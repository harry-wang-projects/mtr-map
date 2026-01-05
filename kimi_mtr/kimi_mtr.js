//map here


/* =========  CONFIGURATION  ============================================= */
//run = seconds from station i to station i + 1
//dwell = seconds stopped at station i
var lines = [
  {
    line_id: 0,
    name: "Island Line",
    SPAWN_EVERY: 114,
    line_color: "#0860a8",
    stations:[
    {name:"Kennedy Town", lat:22.2810, lng:114.1289, run:80, dwell:120},
    {name:"HKU", lat:22.2840, lng:114.1350, run:80, dwell:30},
    {name:"Sai Ying Pun", lat:22.2860, lng:114.1430, run:90, dwell:30},
    {name:"Sheung Wan", lat:22.2870, lng:114.1510, run:80, dwell:30},
    {name:"Central", lat:22.2820, lng:114.1580, run:80, dwell:30},
    {name:"Admiralty", lat:22.2790, lng:114.1650, run:80, dwell:30},
    {name:"Wan Chai", lat:22.2770, lng:114.1730, run:80, dwell:30},
    {name:"Causeway Bay", lat:22.2800, lng:114.1850, run:70, dwell:30},
    {name:"Tin Hau", lat:22.2820, lng:114.1920, run:80, dwell:30},
    {name:"Fortress Hill", lat:22.2880, lng:114.1940, run:80, dwell:30},
    {name:"North Point", lat:22.2910, lng:114.2000, run:80, dwell:30},
    {name:"Quarry Bay", lat:22.2890, lng:114.2120, run:80, dwell:30},
    {name:"Tai Koo", lat:22.2850, lng:114.2170, run:80, dwell:30},
    {name:"Sai Wan Ho", lat:22.2810, lng:114.2230, run:80, dwell:30},
    {name:"Shau Kei Wan", lat:22.2790, lng:114.2290, run:80, dwell:30},
    {name:"Heng Fa Chuen", lat:22.2770, lng:114.2390, run:120, dwell:30},
    {name:"Chai Wan", lat:22.2650, lng:114.2370, run:1, dwell:120}
    ]
  },
  {
    line_id: 1,
    name: "South Island Line",
    SPAWN_EVERY: 198,
    line_color: "#bac429",
    stations:[
    {name:"Admiralty", lat:22.2790, lng:114.1650, run:270, dwell:120},
    {name:"Ocean Park", lat:22.2486, lng:114.1742, run:90, dwell:30},
    {name:"Wong Chuk Hang", lat:22.2481, lng:114.1681, run:90, dwell:30},
    {name:"Lei Tung", lat:22.2422, lng:114.1561, run:90, dwell:30},
    {name:"South Horizons", lat:22.2425, lng:114.1492, run:90, dwell:120},
    ]
  },
];

/* =========  END CONFIG  ================================================ */

/* ---------- map setup (your old code) --------------------------------- */
const map = L.map('map').setView([22.28, 114.18], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OSM', maxZoom:19, opacity: 0.8
}).addTo(map);

/* draw static line */
for(var i = 0; i < lines.length; i++){
  //top display thing
  line_span = document.createElement('span');
  line_span.setAttribute("id", `line${i}`)
  document.getElementById('status').appendChild(line_span);

  const lineCoords = lines[i].stations.map(s=>[s.lat, s.lng]);
  L.polyline(lineCoords, {color:lines[i].line_color, weight:2}).addTo(map);

  lines[i].stations.forEach(s=>{
    L.circleMarker([s.lat, s.lng], {radius:3, color:'#fff',
      weight:2, fillColor:lines[i].line_color, fillOpacity:1}).addTo(map);
  });

  //set variables that they all have
  lines[i].trains = [];
  lines[i].spawnEnabled = true
  lines[i].firstTrainFinished = false;

  //draw
  map.fitBounds(L.latLngBounds(lineCoords), {padding:[50,50]});
}


//train simulation here


/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
//const trains = [];          // active train objects
let tick = 0;               // global time in seconds
//let spawnEnabled = true;    // becomes false once first train finishes lap
//let firstTrainFinished = false;

class Train {
  constructor(line_id, direction){   // +1 = towards Chai Wan, -1 = towards K-Town
    this.line_id = line_id;
    this.startDir = direction;   // remember original direction
    this.id   = 'T' + Math.floor(Math.random()*1e6);
    this.dir  = direction;
    //idx is the station it started from. 
    //If the direction = 1, then it is the smaller numbered station.
    //If the direction = 0, then it is the larger numbered station.
    //If it is stopped, then it is the current station.
    this.idx  = direction===1 ? 0 : lines[this.line_id].stations.length-1; // start at terminus - can be just 0
    this.segmentProgress = 0; // seconds into current leg
    //whether the train is moving/dwelling. It should start moving.
    this.movingstate = 1;
    this.dwellProgress= 0; //seconds into dwell
    
    //doesn't look good. Need to add an image. iconSize doesn't do anything
    this.marker = L.marker(this.latlng(), {
      icon: L.divIcon({
        html:`<div style="
          background:${lines[this.line_id].line_color};
          width:20px;height:20px;border-radius:50%;
          border:2px solid #fff;"></div>  `,
        iconSize:[0,0], iconAnchor:[10,10]
      })
    }).addTo(map);
    //better if I'm only using a circle
    /*this.marker = L.circleMarker(this.latlng(), {radius:7, color:'#fff',
    weight:2, fillColor:line_color, fillOpacity:1}).addTo(map);*/
  }
  latlng(){
    const A = lines[this.line_id].stations[this.idx];
    const B = lines[this.line_id].stations[this.idx + this.dir];
    if (!B) return [A.lat, A.lng]; // terminus
    const f = this.segmentProgress / lines[this.line_id].stations[this.dir ===1?this.idx:(this.idx-1)].run;
    return [
      A.lat + (B.lat - A.lat)*f,
      A.lng + (B.lng - A.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    //when direction = 1, it is idx. When direction = -1, it is idx - 1.
    const leg = lines[this.line_id].stations[this.dir===1?this.idx:(this.idx - 1)].run;
    const dwell = lines[this.line_id].stations[(this.dir===1?this.idx:this.idx)].dwell; // station ahead when moving
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
        if (this.idx === 0 || this.idx === lines[this.line_id].stations.length-1){
          this.dir *= -1;                 // reverse
          if(this.idx === lines[this.line_id].stations.length-1){
            this.idx += 0;           // step one station INTO the new direction
          }else{
          }
          this.segmentProgress = 0;       // start fresh leg
          this.arrivalTick = tick;        // mark arrival for dwell calculation
          // -- loop-completion logic (see #2) --
          if (this.dir === this.startDir){
            if (!lines[this.line_id].firstTrainFinished){ 
              lines[this.line_id].firstTrainFinished = true; 
              lines[this.line_id].spawnEnabled=false; 
              //delete the last train as 2 trains will look close together.
              lines[this.line_id].trains[lines[this.line_id].trains.length-1].marker.remove();
              lines[this.line_id].trains.pop();
            }
          }
          /*
          if (this.dir === -1 && this.idx === lines[this.line_id].stations.length-1){ // finished CCW loop
            if (!firstTrainFinished){ firstTrainFinished = true; spawnEnabled=false; }
          }
          */

        }
        this.movingstate = 0;
        this.dwellProgress = 0;
      }
      //no need to do every time?
      this.marker.setLatLng(this.latlng());
    }else{
      //dwelling
      this.dwellProgress++;
      if(this.dwellProgress >= dwell){
        this.movingstate = 1;
      }
    }
  }
  remove(){ map.removeLayer(this.marker); }
}

/* -------------------- time-table builder ------------------------------ */
function buildTables(){
  for(var j = 0; j < lines.length; j++){
    const wrap = (arr, title) => {
      const tbl = document.createElement('table');
      tbl.innerHTML = `<caption>${title}</caption>` +
        arr.map((v,i)=>`<tr><td>${lines[0].stations[i].name||'leg '+i}</td>
          <td><input data-array="${title}" data-idx="${i}" type="number"
                     min="5" max="600" value="${v}" style="width:60px;"></td></tr>`).join('');
      return tbl;
    };
    const div = document.createElement("div");
    div.innerHTML = '';
    //turn station run into a list
    let RUNNING = [];
    let DWELL = [];
    for(var i = 0; i < lines[j].stations.length; i++){
      RUNNING[i] = lines[j].stations[i].run;
      DWELL[i] = lines[j].stations[i].dwell;
    }
    div.appendChild(wrap(RUNNING, 'Running'));
    div.appendChild(wrap(DWELL, 'Dwell'));
    document.getElementById('timeTables').appendChild(div);
  }
}
buildTables();

//TODO: Make these buttons work for many lines in the future
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
  for(var i = 0; i < lines.length; i++){
    lines[i].trains.forEach(t=>t.remove());
    lines[i].trains.length = 0;
    tick = 0;
    lines[i].spawnEnabled = true;
    lines[i].firstTrainFinished = false;
  }
}

/* -------------------- main loop --------------------------------------- */


/* ---------- simulation step ---------- */
function simulate(){
  tick++;
  for(var i = 0; i < lines.length; i++){
    if (lines[i].spawnEnabled && tick % lines[i].SPAWN_EVERY === 0){
      //direction = 1
      lines[i].trains.push(new Train(i, 1));
    }
    lines[i].trains.forEach(t=>t.step());
    line_span = document.getElementById(`line${i}`);
    line_span.textContent = `${lines[i].name} Tick ${tick} | Trains ${lines[i].trains.length} | Spawning ${lines[i].spawnEnabled?'ON':'OFF'}`;
  }
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
