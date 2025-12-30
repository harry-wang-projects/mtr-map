//basic numbers

let TICK_RATE = 30;          // sim ticks per real second
let SIM_MS    = 1000 / TICK_RATE;
let clockId   = null;


//map here



/* =========  CONFIGURATION  ============================================= */
/* ==========  MULTI-LINE DATABASE  ==================================== */
const LINES = {
  ISL: {                     // Island Line (your original one)
    name: 'Island Line',
    color: '#0860a8',
    stations: [
      {name:'Kennedy Town',      lat:22.2810, lng:114.1289},
      {name:'HKU',               lat:22.2840, lng:114.1350},
      {name:'Sai Ying Pun',      lat:22.2860, lng:114.1430},
      {name:'Sheung Wan',        lat:22.2870, lng:114.1510},
      {name:'Central',           lat:22.2820, lng:114.1580},
      {name:'Admiralty',         lat:22.2790, lng:114.1650},
      {name:'Wan Chai',          lat:22.2770, lng:114.1730},
      {name:'Causeway Bay',      lat:22.2800, lng:114.1850},
      {name:'Tin Hau',           lat:22.2820, lng:114.1920},
      {name:'Fortress Hill',     lat:22.2880, lng:114.1940},
      {name:'North Point',       lat:22.2910, lng:114.2000},
      {name:'Quarry Bay',        lat:22.2890, lng:114.2120},
      {name:'Tai Koo',           lat:22.2850, lng:114.2170},
      {name:'Sai Wan Ho',        lat:22.2810, lng:114.2230},
      {name:'Shau Kei Wan',      lat:22.2790, lng:114.2290},
      {name:'Heng Fa Chuen',     lat:22.2770, lng:114.2390},
      {name:'Chai Wan',          lat:22.2650, lng:114.2370}
    ]
  },
  SIL: {                     // South Island Line (new)
    name: 'South Island Line',
    color: '#bac429',
    stations: [
      {name:'Admiralty',         lat:22.2790, lng:114.1650},  // shared
      {name:'Ocean Park',        lat:22.2470, lng:114.1730},
      {name:'Wong Chuk Hang',    lat:22.2481, lng:114.1680},
      {name:'Lei Tung',          lat:22.2422, lng:114.1561},
      {name:'South Horizons',    lat:22.2425, lng:114.1492}
    ]
  }
};

/* ---- sane defaults for every line ---- */
Object.keys(LINES).forEach(code=>{
  const st = LINES[code].stations;
  LINES[code].running = Array(st.length-1).fill(90); // seconds
  LINES[code].dwell   = Array(st.length).fill(25);   // seconds
});
Object.keys(LINES).forEach(code=>{
  const st = LINES[code].stations;
  LINES[code].runningTicks = Array(st.length-1).fill(90 * TICK_RATE); // 90 s → ticks
  LINES[code].dwellTicks   = Array(st.length)  .fill(25 * TICK_RATE); // 25 s → ticks
});

let RUNNING = [];          // running[i] = seconds from station i → i+1
let DWELL   = [];          // dwell[i]   = seconds stopped at station i
let SPAWN_EVERY = 120;     // ticks
/* =========  END CONFIG  ================================================ */

/* ---------- map setup (your old code) --------------------------------- */
const map = L.map('map').setView([22.28, 114.18], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OSM', maxZoom:19
}).addTo(map);

/* ==========  DRAW ALL LINES  ========================================== */
const lineLayers = {};      // lineCode → { line, stations[], trains[] }

function drawLine(code){
  const meta = LINES[code];
  const coords = meta.stations.map(s=>[s.lat, s.lng]);

  // polyline
  const line = L.polyline(coords, {color: meta.color, weight: 4});
  line.addTo(map);

  // station markers
  const marks = [];
  meta.stations.forEach(st=>{
    const m = L.circleMarker([st.lat, st.lng], {
      radius: 6,
      color: '#fff',
      weight: 2,
      fillColor: meta.color,
      fillOpacity: 1
    }).addTo(map);
    m.bindTooltip(st.name, {direction:'top', permanent:false});
    marks.push(m);
  });

  lineLayers[code] = { line, stations: meta.stations, trains: [], color: meta.color };
}

/* initial draw */
Object.keys(LINES).forEach(drawLine);

/* ---------- checkbox toggle ---------- */
document.querySelectorAll('#lineToggle input').forEach(box=>{
  box.addEventListener('change', e=>{
    const code = e.target.dataset.line;
    const lyr  = lineLayers[code];
    if (e.target.checked){
      lyr.line.addTo(map);
      lyr.stations.forEach((s,i)=>lyr.stations[i].marker?.addTo(map));
      lyr.trains.forEach(t=>t.marker.addTo(map));
    } else {
      lyr.line.remove();
      lyr.stations.forEach((s,i)=>lyr.stations[i].marker?.remove());
      lyr.trains.forEach(t=>t.marker.remove());
    }
  });
});


//train simulation here


/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
const trains = [];          // active train objects
let tick = 0;               // global time in seconds
let spawnEnabled = true;    // becomes false once first train finishes lap
let firstTrainFinished = false;

class Train {
  constructor(code, direction){   // code = 'ISL' | 'SIL' | ...
    this.lineCode = code;
    const meta    = LINES[code];
    this.color   = meta.color;
    this.stations = meta.stations;
    this.id      = code + '_' + Math.floor(Math.random()*1e6);
    this.dir     = direction;
    this.startDir= direction;
    this.idx     = direction === 1 ? 0 : this.stations.length-1;
    this.segmentProgress = 0;
    this.arrivalTick = tick;

    /* marker icon now uses the line colour */
    this.marker = L.marker(this.latlng(), {
      icon: L.divIcon({
        html: `<div style="
          background:${this.color};
          width:14px;height:14px;border-radius:50%;
          border:2px solid #fff;box-shadow:0 0 4px #0006;"></div>`,
        iconSize:[14,14], iconAnchor:[7,7]
        })
    }).addTo(map);
  }
  latlng(){
    const A = this.stations[this.idx];
    const B = this.stations[this.idx + this.dir];
    if (!B) return [A.lat, A.lng];          // terminus – dwell position
    const seg = RUNNING[this.idx];
    if (!seg || seg <= 0) return [A.lat, A.lng]; // bad data – stay put
    const f = this.segmentProgress / seg;
    return [
      A.lat + (B.lat - A.lat)*f,
      A.lng + (B.lng - A.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    const leg   = LINES[this.lineCode].runningTicks[this.idx];
    const dwell = LINES[this.lineCode].dwellTicks  [this.idx + (this.dir===1?0:1)];
    console.log(this.lineCode, this.idx, this.dir, this.stations.length);
    if (this.segmentProgress < leg){               // still running
      this.segmentProgress++;
    } else {                                       // arrived
      if (tick - this.arrivalTick < dwell) return; // dwelling
      // leave station
      this.idx += this.dir;
      this.segmentProgress = 0;
      this.arrivalTick = tick;
      // turnaround at termini
      // ---------- turn-around at termini ----------
      /* -------- turn-around at termini -------------------------------- */
      if (this.idx === 0 || this.idx === this.stations.length-1){
        this.dir *= -1;
        this.idx += this.dir;                 // step into new direction
        this.segmentProgress = 0;
        this.arrivalTick = tick;
        /* full-loop detection */
        if (this.dir === this.startDir && this.idx === (this.startDir===1?0:this.stations.length-1)){
          if (!firstTrainFinished){ firstTrainFinished = true; spawnEnabled = false; }
        }
        return;
      }
    }
    this.marker.setLatLng(this.latlng());
  }
  remove(){ map.removeLayer(this.marker); }
}

/* -------------------- time-table builder ------------------------------ */
function buildPerLineTables(){
  const div = document.getElementById('perLineTables');
  div.innerHTML = '';
  Object.entries(LINES).forEach(([code,meta])=>{
    const wrap = (arr, title) => {
      const tbl = document.createElement('table');
      tbl.innerHTML = `<caption>${meta.name} – ${title}</caption>` +
        arr.map((v,i)=>`<tr><td>${meta.stations[i].name||'leg '+i}</td>
          <td><input data-line="${code}" data-array="${title}" data-idx="${i}"
                     type="number" min="5" max="600" value="${v}" style="width:60px;"></td></tr>`).join('');
      return tbl;
    };
    const runs = Array(meta.stations.length-1).fill(90);
    const dwells = Array(meta.stations.length).fill(25);
    div.appendChild(wrap(runs,'Running'));
    div.appendChild(wrap(dwells,'Dwell'));
  });
}
buildPerLineTables();

/* -------------------- apply button ----------------------------------- */
document.getElementById('applyBtn').onclick = () => {
  // read running times
  document.querySelectorAll('input[data-array="Running"]').forEach(ip=>{
    RUNNING[ip.dataset.idx] = +ip.value;
  });
  document.querySelectorAll('input[data-array="Dwell"]').forEach(ip=>{
    DWELL[ip.dataset.idx] = +ip.value;
  });
  SPAWN_EVERY = +document.getElementById('spawnEvery').value;
  restart();
};
function restart(){
  trains.forEach(t=>t.remove());
  trains.length = 0;
  tick = 0;
  spawnEnabled = true;
  firstTrainFinished = false;
}

/* -------------------- main loop --------------------------------------- */


/* ---------- simulation step ---------- */
function simulate(){
  tick++;
  Object.keys(LINES).forEach(code=>{
    if (!lineLayers[code]) return;
    const meta = lineLayers[code];
    /* spawn */
    if (spawnEnabled && tick % SPAWN_EVERY === 0){
      meta.trains.push(new Train(code, 1));
    }
    /* move */
    meta.trains.forEach(t=>t.step());
  });
  document.getElementById('status').textContent =
    `Tick ${tick} | Lines ${Object.keys(LINES).length} | Spawning ${spawnEnabled?'ON':'OFF'}`;
}

/* ---------- configurable clock ---------- */
//parameters at the top

function startClock(){
  if (clockId) clearInterval(clockId);
  SIM_MS = 1000 / TICK_RATE;
  clockId = setInterval(simulate, SIM_MS);
}
document.getElementById('tickRate').addEventListener('input', e=>{
  TICK_RATE = +e.target.value;
  document.getElementById('tickRateLbl').textContent = TICK_RATE;
  startClock();
});

/* ---------- initial kick-off ---------- */
restart();   // sets tick=0, clears trains, etc.
startClock();
/* ======================================================================= */
/* ======================================================================= */
