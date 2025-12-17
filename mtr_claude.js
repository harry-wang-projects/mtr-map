
/* =========  CONFIGURATION  ============================================= */
const stations = [
  {name:"Kennedy Town", lat:22.2810, lng:114.1289},
  {name:"HKU", lat:22.2840, lng:114.1350},
  {name:"Sai Ying Pun", lat:22.2860, lng:114.1430},
  {name:"Sheung Wan", lat:22.2870, lng:114.1510},
  {name:"Central", lat:22.2820, lng:114.1580},
  {name:"Admiralty", lat:22.2790, lng:114.1650},
  {name:"Wan Chai", lat:22.2770, lng:114.1730},
  {name:"Causeway Bay", lat:22.2800, lng:114.1850},
  {name:"Tin Hau", lat:22.2820, lng:114.1920},
  {name:"Fortress Hill", lat:22.2880, lng:114.1940},
  {name:"North Point", lat:22.2910, lng:114.2000},
  {name:"Quarry Bay", lat:22.2890, lng:114.2120},
  {name:"Tai Koo", lat:22.2850, lng:114.2170},
  {name:"Sai Wan Ho", lat:22.2810, lng:114.2230},
  {name:"Shau Kei Wan", lat:22.2790, lng:114.2290},
  {name:"Heng Fa Chuen", lat:22.2770, lng:114.2390},
  {name:"Chai Wan", lat:22.2650, lng:114.2370}
];

let RUNNING = [];          // running[i] = seconds from station i → i+1
let DWELL   = [];          // dwell[i]   = seconds stopped at station i
let SPAWN_EVERY = 120;     // ticks
/* =========  END CONFIG  ================================================ */

/* ---------- map setup (your old code) --------------------------------- */
const map = L.map('map').setView([22.28, 114.18], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OSM', maxZoom:19
}).addTo(map);

/* draw static line */
const lineCoords = stations.map(s=>[s.lat, s.lng]);
L.polyline(lineCoords, {color:'#0860a8', weight:4}).addTo(map);
stations.forEach(s=>{
  L.circleMarker([s.lat, s.lng], {radius:6, color:'#fff',
    weight:2, fillColor:'#0860a8', fillOpacity:1}).addTo(map);
});
map.fitBounds(L.latLngBounds(lineCoords), {padding:[50,50]});
/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
const trains = [];          // active train objects
let tick = 0;               // global time in seconds
let spawnEnabled = true;    // becomes false once first train finishes lap
let firstTrainFinished = false;

class Train {
  constructor(direction){   // +1 = towards Chai Wan, -1 = towards K-Town
    this.id   = 'T' + Math.floor(Math.random()*1e6);
    this.dir  = direction;
    this.idx  = direction===1 ? 0 : stations.length-1; // start at terminus
    this.segmentProgress = 0; // seconds into current leg
    this.marker = L.marker(this.latlng(), {
      icon: L.divIcon({
        html:`<div style="background:#ff6600;width:14px;height:14px;
              border-radius:50%;border:2px solid #fff;
              box-shadow:0 0 4px #0006;"></div>`,
        iconSize:[14,14], iconAnchor:[7,7]
      })
    }).addTo(map);
  }
  latlng(){
    const A = stations[this.idx];
    const B = stations[this.idx + this.dir];
    if (!B) return [A.lat, A.lng]; // terminus
    const f = this.segmentProgress / RUNNING[this.idx];
    return [
      A.lat + (B.lat - A.lat)*f,
      A.lng + (B.lng - A.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    const leg = RUNNING[this.idx];
    const dwell = DWELL[this.idx + (this.dir===1?0:1)]; // station ahead when moving
    if (this.segmentProgress < leg){               // still running
      this.segmentProgress++;
    } else {                                       // arrived
      if (tick - this.arrivalTick < dwell) return; // dwelling
      // leave station
      this.idx += this.dir;
      this.segmentProgress = 0;
      this.arrivalTick = tick;
      // turnaround at termini
      if (this.idx === 0 || this.idx === stations.length-1){
        this.dir *= -1;
        if (!firstTrainFinished){ firstTrainFinished = true; spawnEnabled=false; }
      }
    }
    this.marker.setLatLng(this.latlng());
  }
  remove(){ map.removeLayer(this.marker); }
}

/* -------------------- time-table builder ------------------------------ */
function buildTables(){
  const defaultRun = 90, defaultDwell = 25;
  RUNNING = Array(stations.length-1).fill(defaultRun);
  DWELL   = Array(stations.length).fill(defaultDwell);
  const wrap = (arr, title) => {
    const tbl = document.createElement('table');
    tbl.innerHTML = `<caption>${title}</caption>` +
      arr.map((v,i)=>`<tr><td>${stations[i].name||'leg '+i}</td>
        <td><input data-array="${title}" data-idx="${i}" type="number"
                   min="5" max="600" value="${v}" style="width:60px;"></td></tr>`).join('');
    return tbl;
  };
  const div = document.getElementById('timeTables');
  div.innerHTML = '';
  div.appendChild(wrap(RUNNING, 'Running'));
  div.appendChild(wrap(DWELL, 'Dwell'));
}
buildTables();

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
  if (spawnEnabled && tick % SPAWN_EVERY === 0){
    trains.push(new Train(1));
  }
  trains.forEach(t=>t.step());
  document.getElementById('status').textContent =
    `Tick ${tick} | Trains ${trains.length} | Spawning ${spawnEnabled?'ON':'OFF'}`;
}

/* ---------- configurable clock ---------- */
let TICK_RATE = 30;          // sim ticks per real second
let SIM_MS    = 1000 / TICK_RATE;
let clockId   = null;

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
