//map here


/* =========  CONFIGURATION  ============================================= */
//run = seconds from station i to station i + 1
//dwell = seconds stopped at station i
const stations = [
  {name:"Kennedy Town", lat:22.2810, lng:114.1289, run:90, dwell:25},
  {name:"HKU", lat:22.2840, lng:114.1350, run:90, dwell:25},
  {name:"Sai Ying Pun", lat:22.2860, lng:114.1430, run:90, dwell:25},
  {name:"Sheung Wan", lat:22.2870, lng:114.1510, run:90, dwell:25},
  {name:"Central", lat:22.2820, lng:114.1580, run:90, dwell:25},
  {name:"Admiralty", lat:22.2790, lng:114.1650, run:90, dwell:25},
  {name:"Wan Chai", lat:22.2770, lng:114.1730, run:90, dwell:25},
  {name:"Causeway Bay", lat:22.2800, lng:114.1850, run:90, dwell:25},
  {name:"Tin Hau", lat:22.2820, lng:114.1920, run:90, dwell:25},
  {name:"Fortress Hill", lat:22.2880, lng:114.1940, run:90, dwell:25},
  {name:"North Point", lat:22.2910, lng:114.2000, run:90, dwell:25},
  {name:"Quarry Bay", lat:22.2890, lng:114.2120, run:90, dwell:25},
  {name:"Tai Koo", lat:22.2850, lng:114.2170, run:90, dwell:25},
  {name:"Sai Wan Ho", lat:22.2810, lng:114.2230, run:90, dwell:25},
  {name:"Shau Kei Wan", lat:22.2790, lng:114.2290, run:90, dwell:25},
  {name:"Heng Fa Chuen", lat:22.2770, lng:114.2390, run:135, dwell:25},
  {name:"Chai Wan", lat:22.2650, lng:114.2370, run:90, dwell:25}
];

let SPAWN_EVERY = 120;     // ticks
/* =========  END CONFIG  ================================================ */

/* ---------- map setup (your old code) --------------------------------- */
const map = L.map('map').setView([22.28, 114.18], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OSM', maxZoom:19
}).addTo(map);

/* draw static line */
const lineCoords = stations.map(s=>[s.lat, s.lng]);
L.polyline(lineCoords, {color:'#0860a8', weight:2}).addTo(map);

stations.forEach(s=>{
  L.circleMarker([s.lat, s.lng], {radius:3, color:'#fff',
    weight:2, fillColor:'#0860a8', fillOpacity:1}).addTo(map);
});

map.fitBounds(L.latLngBounds(lineCoords), {padding:[50,50]});



//train simulation here


/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
const trains = [];          // active train objects
let tick = 0;               // global time in seconds
let spawnEnabled = true;    // becomes false once first train finishes lap
let firstTrainFinished = false;

class Train {
  constructor(direction){   // +1 = towards Chai Wan, -1 = towards K-Town
    this.startDir = direction;   // remember original direction
    this.id   = 'T' + Math.floor(Math.random()*1e6);
    this.dir  = direction;
    //idx is the station it started from. 
    //If the direction = 1, then it is the smaller numbered station.
    //If the direction = 0, then it is the larger numbered station.
    //If it is stopped, then it is the current station.
    this.idx  = direction===1 ? 0 : stations.length-1; // start at terminus
    this.segmentProgress = 0; // seconds into current leg
    //whether the train is moving/dwelling. It should start moving.
    this.movingstate = 1;
    
    //doesn't look good. Need to add an image. iconSize doesn't do anything
    this.marker = L.marker(this.latlng(), {
      icon: L.divIcon({
        html:`<div style="
          background:#0860a8;
          width:20px;height:20px;border-radius:50%;
          border:2px solid #fff;"></div>  `,
        iconSize:[0,0], iconAnchor:[10,10]
      })
    }).addTo(map);
    //better if I'm only using a circle
    /*this.marker = L.circleMarker(this.latlng(), {radius:7, color:'#fff',
    weight:2, fillColor:'#0860a8', fillOpacity:1}).addTo(map);*/
  }
  latlng(){
    const A = stations[this.idx];
    const B = stations[this.idx + this.dir];
    if (!B) return [A.lat, A.lng]; // terminus
    const f = this.segmentProgress / stations[this.dir ===1?this.idx:(this.idx-1)].run;
    return [
      A.lat + (B.lat - A.lat)*f,
      A.lng + (B.lng - A.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    //when direction = 1, it is idx. When direction = -1, it is idx - 1.
    const leg = stations[this.dir===1?this.idx:(this.idx - 1)].run;
    const dwell = stations[(this.dir===1?this.idx:this.idx)].dwell; // station ahead when moving
    if(this.movingstate == 1){
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
        if (this.idx === 0 || this.idx === stations.length-1){
          this.dir *= -1;                 // reverse
          if(this.idx === stations.length-1){
            this.idx += 0;           // step one station INTO the new direction
          }else{
          }
          this.segmentProgress = 0;       // start fresh leg
          this.arrivalTick = tick;        // mark arrival for dwell calculation
          // -- loop-completion logic (see #2) --
          if (this.dir === this.startDir){
            if (!firstTrainFinished){ 
              firstTrainFinished = true; 
              spawnEnabled=false; 
              //delete the last train as 2 trains will look close together.
              trains[trains.length-1].marker.remove();
              trains.pop();
            }
          }
          /*
          if (this.dir === -1 && this.idx === stations.length-1){ // finished CCW loop
            if (!firstTrainFinished){ firstTrainFinished = true; spawnEnabled=false; }
          }
          */
        }
      }
      //no need to do every time?
      this.marker.setLatLng(this.latlng());
    }else{
      //dwelling
    }
  }
  remove(){ map.removeLayer(this.marker); }
}

/* -------------------- time-table builder ------------------------------ */
function buildTables(){
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
  //turn station run into a list
  let RUNNING = [];
  let DWELL = [];
  for(var i = 0; i < stations.length; i++){
    RUNNING[i] = stations[i].run;
    DWELL[i] = stations[i].dwell;
  }
  div.appendChild(wrap(RUNNING, 'Running'));
  div.appendChild(wrap(DWELL, 'Dwell'));
}
buildTables();

/* -------------------- apply button ----------------------------------- */
document.getElementById('applyBtn').onclick = () => {
  // read running times
  document.querySelectorAll('input[data-array="Running"]').forEach(ip=>{
    stations[ip.dataset.idx].run = +ip.value;
  });
  document.querySelectorAll('input[data-array="Dwell"]').forEach(ip=>{
    stations[ip.dataset.idx].dwell = +ip.value;
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
    //direction = 1
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
