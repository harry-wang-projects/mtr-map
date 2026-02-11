//some variables
//seconds in one tick
let TICK_LENGTH = 1;

//map here

let accel_func = [0.0002380952381,0.0009523809524,0.002142857143,0.00380952381,0.005952380952,0.008571428571,0.01166666667,0.01523809524,0.01928571429,0.02380952381,0.02880952381,0.03428571429,0.04023809524,0.04666666667,0.05357142857,0.06095238095,0.06880952381,0.07714285714,0.08595238095,0.09523809524,0.105,0.1152380952,0.125952381,0.1371428571,0.1488095238,0.160952381,0.1735714286,0.1866666667,0.2002380952,0.2142857143,0.2285714286,0.2428571429,0.2571428571,0.2714285714,0.2857142857,0.3, 0.3142857143,0.3285714286,0.3428571429,0.3571428571,0.3714285714,0.3857142857,0.4,0.4142857143,0.4285714286,0.4428571429,0.4571428571,0.4714285714,0.4857142857,0.5,0.5142857143,0.5285714286,0.5428571429,0.5571428571,0.5714285714,0.5857142857,0.6,0.6142857143,0.6285714286,0.6428571429,0.6571428571,0.6714285714,0.6857142857,0.7,0.7142857143,0.7285714286,0.7428571429,0.7571428571,0.7714285714,0.7857142857,0.7997619048,0.8133333333,0.8264285714,0.839047619,0.8511904762,0.8628571429,0.874047619,0.8847619048,0.895,0.9047619048,0.914047619,0.9228571429,0.9311904762,0.939047619,0.9464285714,0.9533333333,0.9597619048,0.9657142857,0.9711904762,0.9761904762,0.9807142857,0.9847619048,0.9883333333,0.9914285714,0.994047619,0.9961904762,0.9978571429,0.999047619,0.9997619048,1]

/* =========  CONFIGURATION  ============================================= */
//run = seconds from station i to station i + 1
//dwell = seconds stopped at station i
// Lines are composed of branches. Each branch can have different routes, frequencies, and offset times.
let lines = [
  {
    line_id: 2,
    name: "Disneyland Resort Line",
    line_color: "#f173ac",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 300,
        offset_time: 0,
        stations: [
    {name:"Sunny Bay", lat:22.3317, lng:114.0289, run:210, dwell:90, checkpoints: [{lat:22.3332, lng:114.0316, progresss: 0.1}, {lat:22.3306, lng:114.0355, progresss: 0.25}, {lat:22.3173, lng:114.0374, progresss: 0.8}]},
    {name:"Disneyland Resort", lat:22.3156, lng:114.0450, run:90, dwell:90},
        ]
      }
    ]
  },
  {
    line_id: 3,
    name: "Tseung Kwan O line",
    line_color: "#7d499d",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 396,
        offset_time: 0,
        stations: [
          {name:"North Point", lat:22.2908, lng:114.2008, run:90, dwell:90},
          {name:"Quarry Bay", lat:22.2878, lng:114.2097, run:210, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30, checkpoints: [{lat:22.2944, lng:114.2419, progresss: 0.3}]},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:30},
          {name:"Tseung Kwan O", lat:22.3075, lng:114.2600, run:90, dwell:30},
          {name:"Hang Hau", lat:22.3156, lng:114.2644, run:90, dwell:30},
          {name:"Po Lam", lat:22.3225, lng:114.2581, run:90, dwell:90},
        ]
      },
      {
        branch_id: 1,
        SPAWN_EVERY: 396,
        offset_time: 132,
        stations: [
          {name:"North Point", lat:22.2908, lng:114.2008, run:90, dwell:90},
          {name:"Quarry Bay", lat:22.2878, lng:114.2097, run:210, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30, checkpoints: [{lat:22.2944, lng:114.2419, progresss: 0.3}]},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:30},
          {name:"Tseung Kwan O", lat:22.3075, lng:114.2600, run:90, dwell:30},
          {name:"Hang Hau", lat:22.3156, lng:114.2644, run:90, dwell:30},
          {name:"Po Lam", lat:22.3225, lng:114.2581, run:90, dwell:90},
        ]
      },
      {
        branch_id: 2,
        SPAWN_EVERY: 396,
        offset_time: 264,
        stations: [
          {name:"North Point", lat:22.2908, lng:114.2008, run:90, dwell:90},
          {name:"Quarry Bay", lat:22.2878, lng:114.2097, run:210, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30, checkpoints: [{lat:22.2944, lng:114.2419, progresss: 0.3}]},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:30},
          {name:"Tseung Kwan O", lat:22.3075, lng:114.2600, run:150, dwell:30,  checkpoints: [{lat:22.3105, lng:114.2689, progresss: 0.3}, {lat:22.3021, lng:114.2750, progresss: 0.7}]},
          {name:"LOHAS Park", lat:22.2958, lng:114.2689, run:90, dwell:120},
        ]
      }
    ]
  },
  {
    line_id: 10,
    name: "Test line",
    line_color: "#01ffff",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 100,
        offset_time: 0,
        branch_type: "circular",
        stations: [
          {name:"station 1", lat:22.3103, lng:114.1235, run:60, dwell:30},
          {name:"station 2", lat:22.3003, lng:114.1429, run:180, dwell:30},
          {name:"station 3", lat:22.2967, lng:114.1149, run:90, dwell:30, checkpoints: [{lat:22.3000, lng:114.1100, progresss: 0.4}]},
        ]
      },
    ]
  },
];

/* =========  END CONFIG  ================================================ */

function reset_lines(){
  // Stop video/playback and clear playback state
  stopPlayback();
  clearPlaybackMarkers();
  if(typeof animationData !== 'undefined') animationData = [];
  if(typeof currentPlaybackTime !== 'undefined') currentPlaybackTime = 0;
  if(typeof tick !== 'undefined') tick = 0;

  // Remove all train markers and clear train arrays
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    if(!line.branches) continue;
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      if(branch.trains){
        branch.trains.forEach(t => t.remove());
        branch.trains.length = 0;
      }
    }
  }

  // Clear map route layers and coords
  if(typeof routeLayerGroup !== 'undefined') routeLayerGroup.clearLayers();
  allLineCoords = [];

  // Clear status and time tables, then rebuild time tables for current lines
  const statusEl = document.getElementById('status');
  if(statusEl) statusEl.innerHTML = '';
  const timeTablesEl = document.getElementById('timeTables');
  if(timeTablesEl) timeTablesEl.innerHTML = '';
  buildTables();

  // Re-draw each line and branch onto the map
  for(let i = 0; i < lines.length; i++){
    // Top display thing
    const line_span = document.createElement('span');
    line_span.setAttribute("id", `line${i}`);
    if(statusEl) statusEl.appendChild(line_span);
    if(statusEl) statusEl.appendChild(document.createElement("br"));

    lines[i].branches = lines[i].branches || [];
    for(let b = 0; b < lines[i].branches.length; b++){
      const branch = lines[i].branches[b];

      // Build coordinates array including checkpoints
      const branchCoords = [];
      for(let s = 0; s < branch.stations.length; s++){
        const station = branch.stations[s];
        branchCoords.push([station.lat, station.lng]);
        if(s < branch.stations.length - 1 && station.checkpoints && Array.isArray(station.checkpoints)){
          const sortedCheckpoints = [...station.checkpoints].sort((a, b) => {
            const progA = a.progress !== undefined ? a.progress : (a.progresss !== undefined ? a.progresss : 0);
            const progB = b.progress !== undefined ? b.progress : (b.progresss !== undefined ? b.progresss : 0);
            return progA - progB;
          });
          sortedCheckpoints.forEach(cp => branchCoords.push([cp.lat, cp.lng]));
        }
      }
      if(lines[i].branches[b].hasOwnProperty("branch_type") && lines[i].branches[b].branch_type === "circular"){
        const station = branch.stations[branch.stations.length - 1];
        if(station.checkpoints && Array.isArray(station.checkpoints)){
          const sortedCheckpoints = [...station.checkpoints].sort((a, b) => {
            const progA = a.progress !== undefined ? a.progress : (a.progresss !== undefined ? a.progresss : 0);
            const progB = b.progress !== undefined ? b.progress : (b.progresss !== undefined ? b.progresss : 0);
            return progA - progB;
          });
          sortedCheckpoints.forEach(cp => branchCoords.push([cp.lat, cp.lng]));
        }
        branchCoords.push([branch.stations[0].lat, branch.stations[0].lng]);
      }

      L.polyline(branchCoords, {color: lines[i].line_color, weight: 2}).addTo(routeLayerGroup);
      allLineCoords.push(...branchCoords);

      branch.stations.forEach(s => {
        L.circleMarker([s.lat, s.lng], {
          radius: 3,
          color: '#fff',
          weight: 2,
          fillColor: lines[i].line_color,
          fillOpacity: 1
        }).addTo(routeLayerGroup);
        if(s.checkpoints && Array.isArray(s.checkpoints)){
          s.checkpoints.forEach(cp => {
            L.circleMarker([cp.lat, cp.lng], {
              radius: 2,
              color: lines[i].line_color,
              weight: 1,
              fillColor: lines[i].line_color,
              fillOpacity: 0.5
            }).addTo(routeLayerGroup);
          });
        }
      });

      branch.trains = [];
      branch.spawnEnabled = true;
      branch.firstTrainFinished = false;
      branch.lastspawn = 0;
    }
  }

  if(allLineCoords.length > 0 && typeof map !== 'undefined'){
    map.fitBounds(L.latLngBounds(allLineCoords), { padding: [50, 50] });
  }
  if(document.getElementById("tickdisplay")){
    document.getElementById("tickdisplay").textContent = 'Stopped';
  }
}

/* ---------- map setup (your old code) --------------------------------- */
const map = L.map('map').setView([22.28, 114.18], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OSM', maxZoom:19, opacity: 0.8
}).addTo(map);

/* Layer group for all route polylines and station markers (so we can clear and re-draw) */
let routeLayerGroup = L.layerGroup().addTo(map);

/* draw static line */
let allLineCoords = [];
document.getElementById('status').innerHTML = '';
for(let i = 0; i < lines.length; i++){
  //top display thing
  line_span = document.createElement('span');
  line_span.setAttribute("id", `line${i}`)
  document.getElementById('status').appendChild(line_span);
  document.getElementById('status').appendChild(document.createElement("br"));

  // Draw each branch
  lines[i].branches = lines[i].branches || [];
  for(let b = 0; b < lines[i].branches.length; b++){
    const branch = lines[i].branches[b];
    
    // Build coordinates array including checkpoints
    const branchCoords = [];
    for(let s = 0; s < branch.stations.length; s++){
      const station = branch.stations[s];
      // Add station
      branchCoords.push([station.lat, station.lng]);
      
      // Add checkpoints between this station and next (if going forward)
      if(s < branch.stations.length - 1 && station.checkpoints && Array.isArray(station.checkpoints)){
        // Sort checkpoints by progress (handle typo: progresss)
        const sortedCheckpoints = [...station.checkpoints].sort((a, b) => {
          const progA = a.progress !== undefined ? a.progress : (a.progresss !== undefined ? a.progresss : 0);
          const progB = b.progress !== undefined ? b.progress : (b.progresss !== undefined ? b.progresss : 0);
          return progA - progB;
        });
        
        sortedCheckpoints.forEach(cp => {
          branchCoords.push([cp.lat, cp.lng]);
        });
      }
    }
    
    //Add the final loop. For circular lines only.
    if(lines[i].branches[b].hasOwnProperty("branch_type") && lines[i].branches[b].branch_type === "circular"){
      const station = branch.stations[branch.stations.length - 1];
      //add the checkpoints of the final station
      if(station.checkpoints && Array.isArray(station.checkpoints)){
        // Sort checkpoints by progress (handle typo: progresss)
        const sortedCheckpoints = [...station.checkpoints].sort((a, b) => {
          const progA = a.progress !== undefined ? a.progress : (a.progresss !== undefined ? a.progresss : 0);
          const progB = b.progress !== undefined ? b.progress : (b.progresss !== undefined ? b.progresss : 0);
          return progA - progB;
        });
        
        sortedCheckpoints.forEach(cp => {
          branchCoords.push([cp.lat, cp.lng]);
        });
      }
      branchCoords.push([branch.stations[0].lat, branch.stations[0].lng]);
    }

    L.polyline(branchCoords, {color:lines[i].line_color, weight:2}).addTo(routeLayerGroup);
    allLineCoords.push(...branchCoords);

    branch.stations.forEach(s=>{
      // Draw station
      L.circleMarker([s.lat, s.lng], {
        radius: 3, 
        color: '#fff',
        weight: 2, 
        fillColor: lines[i].line_color, 
        fillOpacity: 1
      }).addTo(routeLayerGroup);
      
      // Draw checkpoints for this station (forward direction: between this station and next)
      if(s.checkpoints && Array.isArray(s.checkpoints)){
        s.checkpoints.forEach(cp => {
          L.circleMarker([cp.lat, cp.lng], {
            radius: 2, 
            color: lines[i].line_color,
            weight: 1, 
            fillColor: lines[i].line_color, 
            fillOpacity: 0.5
          }).addTo(routeLayerGroup);
        });
      }
    });

    //set variables for each branch
    branch.trains = [];
    branch.spawnEnabled = true;
    branch.firstTrainFinished = false;
    branch.lastspawn = 0;
  }

  //draw
  if(allLineCoords.length > 0){
    map.fitBounds(L.latLngBounds(allLineCoords), {padding:[50,50]});
  }
}


//train simulation here


/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
// Animation data structure: animationData[second] = [{train_id, line_id, lat, lng}, ...]
let animationData = [];  // Pre-computed animation data
let animationDuration = 30000; // Default: 1 hour in seconds
let isGenerating = false;
let isPlaying = false;
let currentPlaybackTime = 0;
let playbackMarkers = []; // Markers for playback mode

let tick = 0;               // global time in seconds (used during generation)
let actual_tick = 0;       //how many ticks actually happened
let refreshcoords = 0; //whether or not to update coordinates on the map
let lastrefresh = 0; //last time it refreshed

let finishedticks = 0; //seeing how many ticks actually finished

class Train {
  constructor(line_id, branch_id, direction, createMarker = true, line_type){   // +1 = forward, -1 = backward
    this.line_id = line_id;
    this.branch_id = branch_id;
    this.startDir = direction;   // remember original direction
    this.id   = 'T' + Math.floor(Math.random()*1e6);
    this.dir  = direction;

    //circular or not
    this.type = line_type;

    //graphics settings
    /*
    if(lines[this.line_id].hasOwnProperty("label")){
      this.label = lines[this.line_id].label;
    }
    if(lines[this.line_id].hasOwnProperty("markertype")){
      this.markertype = lines[this.line_id].markertype;
    }
    if(lines[this.line_id].hasOwnProperty("image")){
      this.image = lines[this.line_id].image;
    }
    */
    
    // Get the branch
    const branch = lines[this.line_id].branches[this.branch_id];
    const stations = branch.stations;
    
    //idx is the station it started from. 
    //If the direction = 1, then it is the smaller numbered station.
    //If the direction = -1, then it is the larger numbered station.
    //If it is stopped, then it is the current station.
    this.idx  = direction===1 ? 0 : stations.length-1; // start at terminus
    this.segmentProgress = 0; // seconds into current leg
    //whether the train is moving/dwelling. It should start moving.
    this.movingstate = 1;
    this.dwellProgress= 0; //seconds into dwell
    //when it last refreshed
    this.lastrefresh = 0;

    //how many stations it went to. Used for debugging.
    this.visitedstations = 0;
    
    // Only create marker if requested (not needed during generation)
    this.marker = null;
    if (createMarker) {
    this.marker = L.marker(this.latlng(), {
      icon: L.divIcon({
        html:`<div style="
          background:${lines[this.line_id].line_color};
          width:20px;height:20px;border-radius:50%;
          border:2px solid #fff;"></div>  `,
        iconSize:[0,0], iconAnchor:[10,10]
      })
    }).addTo(map);
    }
  }
  
  getBranch(){
    return lines[this.line_id].branches[this.branch_id];
  }
  
  getStations(){
    return this.getBranch().stations;
  }
  
  latlng(){
    let stations = this.getStations();
    const A = stations[this.idx];
    if (!A) {
      console.error(`Invalid station index ${this.idx} for line ${this.line_id}, branch ${this.branch_id}`);
      return [22.28, 114.18]; // Default fallback position
    }
    let B = stations[this.idx + this.dir];

    //see if it is the last stop for a circular line
    //Circular Lines Only part 1
    if(this.idx == stations.length - 1 && this.dir == 1){
      B = stations[0];
    }else if(this.idx == 0 && this.dir != 1){
      B = stations[stations.length - 1];
    }
    //end of cirular lines only part 1

    if (!B) return [A.lat, A.lng]; // terminus
    
    const stationIdx = this.dir === 1 ? this.idx : (this.idx - 1);
    const runTime = stations[stationIdx]?.run;
    if (!runTime || runTime === 0) {
      return [A.lat, A.lng]; // Fallback if run time is invalid
    }
    
    // Calculate progress using accel_func (between stations, not checkpoints)
    const time_progress = this.segmentProgress / runTime;
    let prog_floor = Math.floor(time_progress * 100);
    let prog_ceil = Math.min(Math.floor(time_progress * 100) + 1, accel_func.length - 1);
    prog_floor = Math.max(0, Math.min(prog_floor, accel_func.length - 1));
    
    const f = accel_func[prog_floor] + (accel_func[prog_ceil] - accel_func[prog_floor]) * (time_progress * 100 - prog_floor); 
    
    // Get checkpoints for the current segment
    // Forward: station[i].checkpoints = checkpoints between station[i] and station[i+1]
    // Backward: use checkpoints from station with lower id (station[i-1].checkpoints)
    let checkpoints = [];
    if(this.dir === 1){
      // Forward: checkpoints are in the current station's array (between A and B)
      checkpoints = (A.checkpoints || []).map(cp => ({
        lat: cp.lat,
        lng: cp.lng,
        progress: cp.progress !== undefined ? cp.progress : (cp.progresss !== undefined ? cp.progresss : 0) // Handle typo
      }));
      // Sort by progress
      checkpoints.sort((a, b) => a.progress - b.progress);
    } else {
      // Backward: use checkpoints from station with lower id (B, which is station[i-1])
      // B's checkpoints are stored for forward direction (between B and A)
      // So we reverse them and invert progress values
      checkpoints = (B.checkpoints || []).map(cp => ({
        lat: cp.lat,
        lng: cp.lng,
        progress: cp.progress !== undefined ? cp.progress : (cp.progresss !== undefined ? cp.progresss : 0) // Handle typo
      }));
      // Reverse the checkpoints array and invert progress values for backward direction
      // Progress is in reverse: 0.2 forward becomes 0.8 backward
      checkpoints = checkpoints.reverse().map(cp => ({
        ...cp,
        progress: 1 - cp.progress
      }));
    }
    
    // If there are checkpoints, find which segment we're in
    if(checkpoints.length > 0){
      // Find the checkpoint segment we're currently in
      let prevPoint = {lat: A.lat, lng: A.lng, progress: 0};
      let nextPoint = {lat: B.lat, lng: B.lng, progress: 1};
      
      // Find checkpoints before and after current progress
      for(let i = 0; i < checkpoints.length; i++){
        const cp = checkpoints[i];
        if(cp.progress <= f){
          prevPoint = cp;
        }
        if(cp.progress > f && nextPoint.progress === 1){
          nextPoint = cp;
          break;
        }
      }
      
      // If we're between checkpoints, interpolate between them
      if(prevPoint.progress < f && f < nextPoint.progress){
        const segmentProgress = (f - prevPoint.progress) / (nextPoint.progress - prevPoint.progress);
        return [
          prevPoint.lat + (nextPoint.lat - prevPoint.lat) * segmentProgress,
          prevPoint.lng + (nextPoint.lng - prevPoint.lng) * segmentProgress
        ];
      } else if(f <= prevPoint.progress && prevPoint.progress > 0){
        // Before first checkpoint, interpolate between station and first checkpoint
        const segmentProgress = f / prevPoint.progress;
        return [
          A.lat + (prevPoint.lat - A.lat) * segmentProgress,
          A.lng + (prevPoint.lng - A.lng) * segmentProgress
        ];
      } else if(f >= nextPoint.progress && nextPoint.progress < 1){
        // After last checkpoint, interpolate between last checkpoint and station
        const segmentProgress = (f - nextPoint.progress) / (1 - nextPoint.progress);
        return [
          nextPoint.lat + (B.lat - nextPoint.lat) * segmentProgress,
          nextPoint.lng + (B.lng - nextPoint.lng) * segmentProgress
        ];
      }
    }
    
    // No checkpoints or at exact checkpoint position, use standard interpolation
    return [
      A.lat + (B.lat - A.lat)*f,
      A.lng + (B.lng - A.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    const stations = this.getStations();
    const branch = this.getBranch();
    
    let leg = 0;
    let dwell = 0;
    //when direction = 1, it is idx. When direction = -1, it is idx - 1.
    //circular line change for stepping.
    if(this.type == "circular" && this.dir != 1 && this.idx == 0){
      leg = stations[stations.length - 1].run;
      dwell = stations[this.idx].dwell; // station ahead when moving
    }else{
      //when direction = 1, it is idx. When direction = -1, it is idx - 1.
      leg = stations[this.dir===1?this.idx:(this.idx - 1)].run;
      dwell = stations[(this.dir===1?this.idx:this.idx)].dwell; // station ahead when moving
    }
    if(this.movingstate == 1){
      if (this.segmentProgress < leg){               // still running
        this.segmentProgress+=TICK_LENGTH;
      } else {                                       // arrived
        //if (tick - this.arrivalTick < dwell) return; // dwelling

        if(this.type == "circular"){
          //so much simpler than non-circular lines lmao
          this.idx += this.dir;
          if(this.idx === stations.length || this.dir === -1){
            if(!branch.firstTrainFinished){
              branch.firstTrainFinished = true;
            }
            if(this.idx === stations.length){
              this.idx = 0;
            }else if(this.idx === -1){
              this.idx = stations.length - 1;
            }
          }
        }else{
          // leave station
          this.idx += this.dir;
          //this.arrivalTick = tick;
          // turnaround at termini
          // ---------- turn-around at termini ----------
          if (this.idx === 0 || this.idx === stations.length-1){
            this.dir *= -1;                 // reverse
            //this.arrivalTick = tick;        // mark arrival for dwell calculation
            // -- loop-completion logic (see #2) --
            if (this.dir === this.startDir){
              if (!branch.firstTrainFinished){ 
                branch.firstTrainFinished = true; 
                /*
                branch.spawnEnabled=false; 
                //delete the last train as 2 trains will look close together.
                branch.trains[branch.trains.length-1].marker.remove();
                branch.trains.pop();
                */
              }
            }
            /*
            if (this.dir === -1 && this.idx === stations.length-1){ // finished CCW loop
              if (!firstTrainFinished){ firstTrainFinished = true; spawnEnabled=false; }
            }
            */
          }
        }
        this.movingstate = 0;
        this.dwellProgress = this.segmentProgress - leg;
        this.segmentProgress = 0;
      }
      //reduce refresh rate as it shouldn't exceed 60 fps
      if(refreshcoords == 1 && this.marker){
        this.marker.setLatLng(this.latlng());
      }
    }else{
      //dwelling
      this.dwellProgress+=TICK_LENGTH;
      if(this.dwellProgress >= dwell){
        this.visitedstations++;
        this.movingstate = 1;
        // -- loop-completion logic (see #2) --
        if (branch.firstTrainFinished && branch.spawnEnabled){
          branch.spawnEnabled=false; 
          //delete the last train as 2 trains will look close together.
          const lastTrain = branch.trains[branch.trains.length-1];
          if(lastTrain && lastTrain.marker){
            lastTrain.marker.remove();
          }
          branch.trains.pop();
        }
        this.segmentProgress = this.dwellProgress - dwell;
      }
    }
  }
  remove(){ 
    if (this.marker) {
      map.removeLayer(this.marker); 
    }
  }
}

/* -------------------- time-table builder ------------------------------ */
function buildTables(){
  for(let j = 0; j < lines.length; j++){
    const line = lines[j];
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
    const wrap = (arr, title) => {
      const tbl = document.createElement('table');
      tbl.innerHTML = `<caption>${title}</caption>` +
          arr.map((v,i)=>`<tr><td>${branch.stations[i].name||'leg '+i}</td>
          <td><input data-array="${title}" data-idx="${i}" type="number"
                     min="5" max="600" value="${v}" style="width:60px;"></td></tr>`).join('');
      return tbl;
    };
    const div = document.createElement("div");
      div.innerHTML = `<strong>${line.name} - Branch ${b + 1}</strong>`;
    //turn station run into a list
    let RUNNING = [];
    let DWELL = [];
      for(let i = 0; i < branch.stations.length; i++){
        RUNNING[i] = branch.stations[i].run;
        DWELL[i] = branch.stations[i].dwell;
    }
    div.appendChild(wrap(RUNNING, 'Running'));
    div.appendChild(wrap(DWELL, 'Dwell'));
    document.getElementById('timeTables').appendChild(div);
    }
  }
}
buildTables();

//TODO: Make these buttons work for many lines in the future


function restart(){
  reset_lines();
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      branch.trains.forEach(t=>t.remove());
      branch.trains.length = 0;
      branch.spawnEnabled = true;
      branch.firstTrainFinished = false;
      branch.lastspawn = 0;
    }
  }
  tick = 0;
}

function clearPlaybackMarkers(){
  playbackMarkers.forEach(m => map.removeLayer(m));
  playbackMarkers = [];
}

/* -------------------- Helper function to calculate when all spawning finishes ---- */
function calculateSpawnCompletionTime(){
  let maxSpawnTime = 0;
  
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      
      // Calculate total journey time for one complete round trip
      let totalJourneyTime = 0;
      for(let s = 0; s < branch.stations.length; s++){
        totalJourneyTime += branch.stations[s].run + branch.stations[s].dwell;
      }
      
      // Time when first train completes journey = offset + journey time
      const firstTrainCompletionTime = branch.offset_time + totalJourneyTime;
      
      maxSpawnTime = Math.max(maxSpawnTime, firstTrainCompletionTime);
    }
  }
  
  return maxSpawnTime;
}

/* -------------------- Helper function to check if all branches have stopped spawning ---- */
function allBranchesStoppedSpawning(){
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      if(branch.spawnEnabled){
        return false;
      }
    }
  }
  return true;
}

let spawn_completed_time = 0;

/* -------------------- GENERATION STAGE -------------------------------- */
function generateAnimation(durationSeconds, onProgress = null){
  return new Promise((resolve, reject) => {
    console.log(`Starting generation for ${durationSeconds} seconds after spawning completes...`);
    isGenerating = true;
    animationData = [];
    
    // Reset simulation state
    restart();
    tick = 0;
    
    // Ensure TICK_LENGTH is 1 for generation (store original value)
    const originalTickLength = TICK_LENGTH;
    TICK_LENGTH = 1;
    
    let currentSecond = 0;
    const CHUNK_SIZE = 100; // Process 100 seconds at a time to avoid blocking
    
    let spawnPhaseComplete = false;
    let spawnEndTime = 0;
    let totalDuration = 0; // Will be calculated after spawn phase
    
    function processChunk(){
      try {
        const endSecond = Math.min(currentSecond + CHUNK_SIZE, currentSecond + CHUNK_SIZE); // Process chunk
        
        for(let second = currentSecond; second < endSecond; second++){
          // Advance simulation by 1 second
          tick = second;
          
          // Spawn trains for each branch (with offset time)
          for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            for(let b = 0; b < line.branches.length; b++){
              const branch = line.branches[b];
              // Account for offset_time: only spawn if current time >= offset
              const effectiveTime = tick - branch.offset_time;
              if (effectiveTime >= 0 && branch.spawnEnabled && effectiveTime - branch.lastspawn >= branch.SPAWN_EVERY){
                branch.lastspawn = effectiveTime;
                if(branch.hasOwnProperty("branch_type") && branch.branch_type === "circular"){
                  branch.trains.push(new Train(i, b, 1, false, branch.branch_type)); // Don't create markers during generation
                }else{
                  branch.trains.push(new Train(i, b, 1, false, "normal")); // Don't create markers during generation
                }
              }
            }
          }
          
          // Step all trains from all branches
          for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            for(let b = 0; b < line.branches.length; b++){
              const branch = line.branches[b];
              branch.trains.forEach(t => {
                try {
                  t.step();
                } catch(e) {
                  console.error(`Error stepping train ${t.id} at second ${second}:`, e);
                }
              });
            }
          }
          
          // Check if spawn phase is complete
          if(!spawnPhaseComplete && allBranchesStoppedSpawning()){
            spawnPhaseComplete = true;
            spawnEndTime = tick;
            totalDuration = spawnEndTime + durationSeconds;
            spawn_completed_time = spawnEndTime;
            console.log(`Spawn phase complete at ${spawnEndTime}s. Total generation: ${totalDuration}s (spawn ${spawnEndTime}s + animation ${durationSeconds}s)`);
            
            // Initialize only future animation slots; do not overwrite existing spawn-phase data
            for(let s = second + 1; s <= totalDuration; s++){
              animationData[s] = [];
            }
          }
          
          // Store positions for this second
          if(animationData[second] === undefined){
            animationData[second] = [];
          }
          
          for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            for(let b = 0; b < line.branches.length; b++){
              const branch = line.branches[b];
              for(let j = 0; j < branch.trains.length; j++){
                const train = branch.trains[j];
                try {
                  const pos = train.latlng();
                  animationData[second].push({
                    train_id: train.id,
                    line_id: train.line_id,
                    branch_id: train.branch_id,
                    lat: pos[0],
                    lng: pos[1]
                  });
                } catch(e) {
                  console.error(`Error getting position for train ${train.id} at second ${second}:`, e);
                }
              }
            }
          }
          
          // Report progress
          if(onProgress){
            if(spawnPhaseComplete){
              onProgress(second, totalDuration, spawnEndTime, true);
            } else {
              // During spawn phase, show which lines are still spawning
              let spawningLines = [];
              for(let i = 0; i < lines.length; i++){
                const line = lines[i];
                for(let b = 0; b < line.branches.length; b++){
                  const branch = line.branches[b];
                  if(branch.spawnEnabled){
                    spawningLines.push(`${line.name} (Branch ${b+1})`);
                  }
                }
              }
              onProgress(second, null, null, false, spawningLines);
            }
          }
        }
        
        currentSecond = endSecond;
        
        // Continue with next chunk or finish
        if(!spawnPhaseComplete || currentSecond < totalDuration){
          // Use requestAnimationFrame for better performance and UI responsiveness
          requestAnimationFrame(processChunk);
        } else {
          // Store final state
          for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            for(let b = 0; b < line.branches.length; b++){
              const branch = line.branches[b];
              for(let j = 0; j < branch.trains.length; j++){
                const train = branch.trains[j];
                try {
                  const pos = train.latlng();
                  if(animationData[totalDuration]){
                    animationData[totalDuration].push({
                      train_id: train.id,
                      line_id: train.line_id,
                      branch_id: train.branch_id,
                      lat: pos[0],
                      lng: pos[1]
                    });
                  }
                } catch(e) {
                  console.error(`Error getting final position for train ${train.id}:`, e);
                }
              }
            }
          }
          
          // Restore original TICK_LENGTH
          TICK_LENGTH = originalTickLength;
          
          isGenerating = false;
          console.log(`Generation complete! Generated ${animationData.length} seconds of data (${spawnEndTime}s spawn + ${durationSeconds}s animation).`);
          resolve(animationData);
        }
      } catch(e) {
        console.error('Error in processChunk:', e);
        isGenerating = false;
        TICK_LENGTH = originalTickLength;
        reject(e);
      }
    }
    
    // Start processing
    processChunk();
  });
}

function generate_train_icon(markertype, line_color, label){
  if(markertype == "hklrt"){
    return L.divIcon({
      className: 'custom-div-icon',
      html:`<div style="
        background: #fff;
        height: 18px; width: 32px;border-radius:9px;font-size: 11px;text-align: center;vertical-align: middle;
        border:2px solid ${line_color};">${label}</div>  `,
        iconSize:[0, 0], iconAnchor:[16,10]
    })
  }else{
    return L.divIcon({
      className: 'custom-div-icon',
      html:`<div style="
        background:${line_color};
        width:20px;height:20px;border-radius:50%;
        border:2px solid #fff;"></div>  `,
      iconSize:[0, 0], iconAnchor:[10,10]
    })
  }
}

/* -------------------- PLAYBACK STAGE ----------------------------------- */
function playAnimationFrame(time){
  if(!animationData || animationData.length === 0){
    console.warn("No animation data to play");
    return;
  }
  
  if(time >= animationData.length){
    stopPlayback();
    return;
  }
  
  // Clear existing markers
  clearPlaybackMarkers();
  
  // Create markers for all trains at this time
  const frame = animationData[time] || [];
  for(let i = 0; i < frame.length; i++){
    const train = frame[i];
    let train_icon;
    if(lines[train.line_id].hasOwnProperty("markertype")){
      train_icon = generate_train_icon(lines[train.line_id].markertype, lines[train.line_id].line_color, lines[train.line_id].label)
    }else{
      train_icon = generate_train_icon("", lines[train.line_id].line_color, lines[train.line_id].label)
    }
    const marker = L.marker([train.lat, train.lng], {
      icon: train_icon
    }).addTo(map);
    playbackMarkers.push(marker);
  }
  
  // Update status display
  for(let i = 0; i < lines.length; i++){
    const lineTrains = frame.filter(t => t.line_id === i);
    const line_span = document.getElementById(`line${i}`);
    line_span.textContent = `${lines[i].name} Trains ${lineTrains.length}`;
  }
  
  document.getElementById("tickdisplay").textContent = `Playback: ${time - spawn_completed_time}s / ${animationData.length - 1 - spawn_completed_time}s (actual playback ${time}s / ${animationData.length - 1}s )`;
}

let playbackIntervalId = null;
let currentPlaybackSpeed = 1;

function startPlayback(playbackSpeed = 1, resetTime = true){
  if(isPlaying && resetTime) return; // Don't restart if already playing and not resetting
  if(!animationData || animationData.length === 0){
    alert("Please generate animation data first!");
    return;
  }
  
  // If already playing and just changing speed, update the interval
  if(isPlaying && !resetTime){
    updatePlaybackSpeed(playbackSpeed);
    return;
  }
  
  isPlaying = true;
  currentPlaybackSpeed = playbackSpeed;
  if(resetTime){
    currentPlaybackTime;
  }
  
  // Play at specified speed (frames per second)
  const frameInterval = 1000 / playbackSpeed; // milliseconds between frames
  
  playbackIntervalId = setInterval(() => {
    playAnimationFrame(currentPlaybackTime + spawn_completed_time);
    currentPlaybackTime++;
    
    if(currentPlaybackTime >= animationData.length){
      stopPlayback();
    }
  }, frameInterval);
}

function updatePlaybackSpeed(newSpeed){
  if(!isPlaying) return;
  
  currentPlaybackSpeed = newSpeed;
  
  // Clear existing interval
  if(playbackIntervalId){
    clearInterval(playbackIntervalId);
    playbackIntervalId = null;
  }
  
  // Start new interval with new speed
  const frameInterval = 1000 / newSpeed; // milliseconds between frames
  
  playbackIntervalId = setInterval(() => {
    playAnimationFrame(currentPlaybackTime + spawn_completed_time);
    currentPlaybackTime++;
    
    if(currentPlaybackTime >= animationData.length){
      stopPlayback();
    }
  }, frameInterval);
}

function stopPlayback(){
  if(playbackIntervalId){
    clearInterval(playbackIntervalId);
    playbackIntervalId = null;
  }
  isPlaying = false;
}

function pausePlayback(){
  if(playbackIntervalId){
    clearInterval(playbackIntervalId);
    playbackIntervalId = null;
  }
  isPlaying = false;
}

function resumePlayback(playbackSpeed = 1){
  if(isPlaying) return;
  if(currentPlaybackTime >= animationData.length){
    currentPlaybackTime = 0;
  }
  startPlayback(playbackSpeed, false); // Don't reset time when resuming
}




/* ---------- UI Controls for Generation and Playback ---------- */
// Generation controls
document.getElementById('generateBtn')?.addEventListener('click', async () => {
  const duration = parseInt(document.getElementById('animationDuration').value) || 3600;
  const generateBtn = document.getElementById('generateBtn');
  const statusDiv = document.getElementById('generationStatus');
  
  if(isGenerating){
    return;
  }  
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  statusDiv.textContent = 'Starting generation...';
  
  try {
    await generateAnimation(duration, (current, total, spawnEndTime, isPostSpawn, spawningLines) => {
      if(isPostSpawn){
        // After spawn phase: animation duration is counting (requested duration only)
        const progress = Math.round((current - spawnEndTime) / (total - spawnEndTime) * 100);
        statusDiv.textContent = `Generating animation... ${current - spawnEndTime}/${total - spawnEndTime}s of animation (${progress}%) | Total: ${current}/${total}s`;
      } else {
        // During spawn phase: show elapsed time and which lines are still spawning
        const spawningText = spawningLines && spawningLines.length > 0
          ? spawningLines.join(', ')
          : 'none (finalizing…)';
        statusDiv.textContent = `Spawning trains… ${current}s elapsed\nLines still spawning: ${spawningText}\n(Animation will run for ${duration}s after all lines stop spawning.)`;
      }
    });
    
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Animation';
    statusDiv.textContent = `Generation complete! Total ${animationData.length}s = ${spawn_completed_time}s spawn + ${animationData.length - spawn_completed_time}s animation.`;
    // Enable playback controls
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('stopBtn').disabled = false;
  } catch(e) {
    console.error('Generation error:', e);
    statusDiv.textContent = 'Generation failed: ' + e.message;
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Animation';
  }
});

// Playback controls
document.getElementById('playBtn')?.addEventListener('click', () => {
  const speed = parseFloat(document.getElementById('playbackSpeed').value) || 1;
  startPlayback(speed);
});

document.getElementById('pauseBtn')?.addEventListener('click', () => {
  pausePlayback();
});

document.getElementById('stopBtn')?.addEventListener('click', () => {
  stopPlayback();
  clearPlaybackMarkers();
  currentPlaybackTime = 0;
  document.getElementById("tickdisplay").textContent = 'Stopped';
});

document.getElementById('playbackSpeed')?.addEventListener('input', e => {
  const speed = parseFloat(e.target.value);
  document.getElementById('playbackSpeedLbl').textContent = speed;
  if(isPlaying){
    // Update speed without resetting playback position
    updatePlaybackSpeed(speed);
  }
});


/* ---------- JSON file upload: replace or append lines ------------------ */
function setJsonLoadStatus(msg, isError) {
  const el = document.getElementById('jsonLoadStatus');
  if (el) {
    el.textContent = msg;
    el.style.color = isError ? '#dc3545' : '#666';
  }
}

function normalizeLineIds() {
  for (let i = 0; i < lines.length; i++) {
    lines[i].line_id = i;
    if (!lines[i].branches) lines[i].branches = [];
    for (let b = 0; b < lines[i].branches.length; b++) {
      lines[i].branches[b].branch_id = b;
      if (!lines[i].branches[b].stations) lines[i].branches[b].stations = [];
    }
  }
}

function loadJsonFile(replace) {
  const input = document.getElementById(replace ? 'jsonFileReplace' : 'jsonFileAppend');
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          setJsonLoadStatus('JSON must be an array of lines.', true);
          return;
        }
        if (replace) {
          lines = data;
        } else {
          lines = lines.concat(data);
        }
        normalizeLineIds();
        reset_lines();
        setJsonLoadStatus(replace ? 'Lines replaced.' : 'Lines appended.');
        input.value = '';
      } catch (err) {
        setJsonLoadStatus('Invalid JSON: ' + err.message, true);
      }
    };
    reader.onerror = function () {
      setJsonLoadStatus('Failed to read file.', true);
    };
    reader.readAsText(file);
  }
}

document.getElementById('loadJsonReplaceBtn')?.addEventListener('click', function () {
  document.getElementById('jsonFileReplace')?.click();
});
document.getElementById('jsonFileReplace')?.addEventListener('change', function () {
  loadJsonFile(true);
});

document.getElementById('loadJsonAppendBtn')?.addEventListener('click', function () {
  document.getElementById('jsonFileAppend')?.click();
});
document.getElementById('jsonFileAppend')?.addEventListener('change', function () {
  loadJsonFile(false);
});

/* ---------- initial setup ---------- */
restart();   // sets tick=0, clears trains, etc.
// startClock(); // Disabled - using new generation/playback system
/* ======================================================================= */
/* ======================================================================= */