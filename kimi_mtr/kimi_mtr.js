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
    line_id: 0,
    name: "Island Line",
    line_color: "#0860a8",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 114,
        offset_time: 0, // seconds offset for when to start spawning
        stations: [
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
      }
    ]
  },
  {
    line_id: 1,
    name: "South Island Line",
    line_color: "#bac429",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 198,
        offset_time: 0,
        stations: [
    {name:"Admiralty", lat:22.2790, lng:114.1650, run:270, dwell:120},
    {name:"Ocean Park", lat:22.2486, lng:114.1742, run:90, dwell:30},
    {name:"Wong Chuk Hang", lat:22.2481, lng:114.1681, run:90, dwell:30},
    {name:"Lei Tung", lat:22.2422, lng:114.1561, run:90, dwell:30},
    {name:"South Horizons", lat:22.2425, lng:114.1492, run:90, dwell:120},
        ]
      }
    ]
  },
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
    {name:"Sunny Bay", lat:22.3317, lng:114.0289, run:210, dwell:90},
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
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30},
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
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30},
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
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:30},
          {name:"Tseung Kwan O", lat:22.3075, lng:114.2600, run:90, dwell:30},
          {name:"LOHAS Park", lat:22.2958, lng:114.2689, run:150, dwell:120},
        ]
      }
    ]
  },
  {
    line_id: 4,
    name: "Tsuen Wan Line",
    line_color: "#ed1d24",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 126,
        offset_time: 0,
        stations: [
          {name:"Central", lat:22.2819, lng:114.1575, run:90, dwell:90},
          {name:"Admiralty", lat:22.2789, lng:114.1647, run:30, dwell:30},
          {name:"TST Checkpoint", lat:22.2798, lng:114.1701, run:120, dwell:30, type: "checkpoint"},
          {name:"Tsim Sha Tsui", lat:22.2972, lng:114.1722, run:90, dwell:30},
          {name:"Jordan", lat:22.3050, lng:114.1717, run:90, dwell:30},
          {name:"Yau Ma Tei", lat:22.3128, lng:114.1708, run:90, dwell:30},
          {name:"Mong Kok", lat:22.3192, lng:114.1694, run:90, dwell:30},
          {name:"Prince Edward", lat:22.3244, lng:114.1683, run:90, dwell:30},
          {name:"Sham Shui Po", lat:22.3308, lng:114.1622, run:90, dwell:30},
          {name:"Cheung Sha Wan", lat:22.3353, lng:114.1564, run:90, dwell:30},
          {name:"Lai Chi Kok", lat:22.3372, lng:114.1483, run:90, dwell:30},
          {name:"Mei Foo", lat:22.3381, lng:114.1375, run:90, dwell:30},
          {name:"Lai King", lat:22.3483, lng:114.1261, run:90, dwell:30},
          {name:"Kuai Fong", lat:22.3569, lng:114.1278, run:90, dwell:30},
          {name:"Kuai Hing", lat:22.3633, lng:114.1311, run:90, dwell:30},
          {name:"Tai Wo Hau", lat:22.3708, lng:114.1250, run:90, dwell:30},
          {name:"Tsuen Wan", lat:22.3736, lng:114.1178, run:120, dwell:90},
        ]
      }
    ]
  },
  {
    line_id: 5,
    name: "Kwun Tong Line",
    line_color: "#00ab4e",
    branches: [
      {
        branch_id: 0,
        SPAWN_EVERY: 252,
        offset_time: 0,
        stations: [
          {name:"Whampoa", lat:22.3050, lng:114.1897, run:120, dwell:90},
          {name:"Ho Man Tin", lat:22.3092, lng:114.1828, run:120, dwell:30},
          {name:"Yau Ma Tei", lat:22.3128, lng:114.1708, run:90, dwell:30},
          {name:"Mong Kok", lat:22.3192, lng:114.1694, run:90, dwell:30},
          {name:"Prince Edward", lat:22.3244, lng:114.1683, run:90, dwell:30},
          {name:"Shek Kip Mei", lat:22.3319, lng:114.1686, run:90, dwell:30},
          {name:"Kowloon Tong", lat:22.3369, lng:114.1761, run:90, dwell:30},
          {name:"Lok Fu", lat:22.3381, lng:114.1872, run:90, dwell:30},
          {name:"Wong Tai Sin", lat:22.3417, lng:114.1939, run:90, dwell:30},
          {name:"Diamond Hill", lat:22.3400, lng:114.2017, run:90, dwell:30},
          {name:"Choi Hung", lat:22.3348, lng:114.2089, run:90, dwell:30},
          {name:"Kowloon Bay", lat:22.3236, lng:114.2142, run:90, dwell:30},
          {name:"Ngau Tau Kok", lat:22.3153, lng:114.2192, run:90, dwell:30},
          {name:"Kwun Tong", lat:22.3122, lng:114.2264, run:90, dwell:30},
          {name:"Lam Tin", lat:22.3067, lng:114.2331, run:90, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:90},
        ]
      },
      {
        branch_id: 1,
        SPAWN_EVERY: 252,
        offset_time: 0,
        stations: [
          {name:"Ho Man Tin", lat:22.3092, lng:114.1828, run:120, dwell:90},
          {name:"Yau Ma Tei", lat:22.3128, lng:114.1708, run:90, dwell:30},
          {name:"Mong Kok", lat:22.3192, lng:114.1694, run:90, dwell:30},
          {name:"Prince Edward", lat:22.3244, lng:114.1683, run:90, dwell:30},
          {name:"Shek Kip Mei", lat:22.3319, lng:114.1686, run:90, dwell:30},
          {name:"Kowloon Tong", lat:22.3369, lng:114.1761, run:90, dwell:30},
          {name:"Lok Fu", lat:22.3381, lng:114.1872, run:90, dwell:30},
          {name:"Wong Tai Sin", lat:22.3417, lng:114.1939, run:90, dwell:30},
          {name:"Diamond Hill", lat:22.3400, lng:114.2017, run:90, dwell:30},
          {name:"Choi Hung", lat:22.3348, lng:114.2089, run:90, dwell:30},
          {name:"Kowloon Bay", lat:22.3236, lng:114.2142, run:90, dwell:30},
          {name:"Ngau Tau Kok", lat:22.3153, lng:114.2192, run:90, dwell:30},
          {name:"Kwun Tong", lat:22.3122, lng:114.2264, run:90, dwell:30},
          {name:"Lam Tin", lat:22.3067, lng:114.2331, run:90, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:90},
        ]
      }
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
let allLineCoords = [];
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
    const branchCoords = branch.stations.map(s=>[s.lat, s.lng]);
    L.polyline(branchCoords, {color:lines[i].line_color, weight:2}).addTo(map);
    allLineCoords.push(...branchCoords);

    branch.stations.forEach(wp=>{
      const type = wp.type || 'station';
      if(type === 'checkpoint'){
        // Draw checkpoints as smaller, semi-transparent markers
        L.circleMarker([wp.lat, wp.lng], {
          radius: 2, 
          color: lines[i].line_color,
          weight: 1, 
          fillColor: lines[i].line_color, 
          fillOpacity: 0.5
        }).addTo(map);
      } else {
        // Draw stations as normal markers
        L.circleMarker([wp.lat, wp.lng], {
          radius: 3, 
          color: '#fff',
          weight: 2, 
          fillColor: lines[i].line_color, 
          fillOpacity: 1
        }).addTo(map);
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
let animationDuration = 10000; // Default: 1 hour in seconds
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
  constructor(line_id, branch_id, direction, createMarker = true){   // +1 = forward, -1 = backward
    this.line_id = line_id;
    this.branch_id = branch_id;
    this.startDir = direction;   // remember original direction
    this.id   = 'T' + Math.floor(Math.random()*1e6);
    this.dir  = direction;
    
    // Get the branch
    const branch = lines[this.line_id].branches[this.branch_id];
    const waypoints = branch.stations;
    
    // Find the first/last station (not checkpoint) based on direction
    let startIdx;
    if(direction === 1){
      // Forward: find first station
      for(let i = 0; i < waypoints.length; i++){
        const type = waypoints[i].type || 'station';
        if(type === 'station'){
          startIdx = i;
          break;
        }
      }
    } else {
      // Backward: find last station
      for(let i = waypoints.length - 1; i >= 0; i--){
        const type = waypoints[i].type || 'station';
        if(type === 'station'){
          startIdx = i;
          break;
        }
      }
    }
    
    //idx is the waypoint (station) it started from
    this.idx = startIdx !== undefined ? startIdx : (direction === 1 ? 0 : waypoints.length - 1);
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
  
  // Get the next station (not checkpoint) in the current direction
  getNextStationIndex(currentIdx, direction){
    const waypoints = this.getStations();
    let idx = currentIdx;
    const step = direction > 0 ? 1 : -1;
    idx += step;
    while(idx >= 0 && idx < waypoints.length){
      const wp = waypoints[idx];
      const type = wp.type || 'station'; // default to station for backward compatibility
      if(type === 'station'){
        return idx;
      }
      idx += step;
    }
    return null; // no more stations
  }
  
  // Get the previous station (not checkpoint) in the current direction
  getPrevStationIndex(currentIdx, direction){
    const waypoints = this.getStations();
    let idx = currentIdx;
    const step = direction > 0 ? 1 : -1;
    while(idx >= 0 && idx < waypoints.length){
      const wp = waypoints[idx];
      const type = wp.type || 'station';
      if(type === 'station'){
        return idx;
      }
      idx -= step;
    }
    return null;
  }
  
  latlng(){
    const waypoints = this.getStations();
    const currentWp = waypoints[this.idx];
    if (!currentWp) {
      console.error(`Invalid waypoint index ${this.idx} for line ${this.line_id}, branch ${this.branch_id}`);
      return [22.28, 114.18]; // Default fallback position
    }
    
    // Find the station segment we're currently in
    const prevStationIdx = this.getPrevStationIndex(this.idx, this.dir);
    const nextStationIdx = this.getNextStationIndex(this.idx, this.dir);
    
    // Determine from and to stations based on direction
    let fromStationIdx, toStationIdx;
    if(this.dir === 1){
      // Forward: from previous station to next station
      fromStationIdx = prevStationIdx !== null ? prevStationIdx : 0;
      toStationIdx = nextStationIdx !== null ? nextStationIdx : (waypoints.length - 1);
    } else {
      // Backward: from next station to previous station
      fromStationIdx = nextStationIdx !== null ? nextStationIdx : (waypoints.length - 1);
      toStationIdx = prevStationIdx !== null ? prevStationIdx : 0;
    }
    
    if(fromStationIdx === null || toStationIdx === null || fromStationIdx === toStationIdx){
      return [currentWp.lat, currentWp.lng];
    }
    
    const fromStation = waypoints[fromStationIdx];
    const toStation = waypoints[toStationIdx];
    
    // Calculate total run time from fromStation to toStation
    // The run value on waypoint[i] represents time FROM waypoint[i-1] TO waypoint[i] (forward direction)
    let totalRunTime = 0;
    
    if(this.dir > 0){
      // Forward direction: sum run times from fromStation+1 to toStation (inclusive)
      // waypoint[i].run is the time from waypoint[i-1] to waypoint[i]
      for(let i = fromStationIdx + 1; i <= toStationIdx; i++){
        if(i >= waypoints.length) break;
        const wp = waypoints[i];
        if(wp && wp.run){
          totalRunTime += wp.run;
        }
      }
    } else {
      // Backward direction: sum run times from fromStation down to toStation+1 (inclusive)
      // When going backward, waypoint[i].run is the time from waypoint[i] to waypoint[i-1]
      // So we sum from fromStation down to toStation+1
      for(let i = fromStationIdx; i > toStationIdx; i--){
        if(i < 0 || i >= waypoints.length) break;
        const wp = waypoints[i];
        if(wp && wp.run){
          totalRunTime += wp.run;
        }
      }
    }
    
    if(totalRunTime === 0){
      return [currentWp.lat, currentWp.lng];
    }
    
    // Calculate elapsed time from fromStation to current position
    // waypoint[i].run = time from waypoint[i-1] to waypoint[i]
    // When at waypoint[idx] with segmentProgress, we've completed the journey to idx
    // and are segmentProgress seconds into the journey from idx to idx+1
    let elapsedTime = 0;
    if(this.dir > 0){
      // Forward: sum run times from fromStation+1 to this.idx (inclusive)
      // This gives the time to reach this.idx
      for(let i = fromStationIdx + 1; i <= this.idx; i++){
        if(i >= waypoints.length) break;
        const wp = waypoints[i];
        if(wp && wp.run){
          elapsedTime += wp.run;
        }
      }
      // Add segmentProgress which is time into the segment from this.idx to next waypoint
      elapsedTime += this.segmentProgress;
    } else {
      // Backward: sum run times from fromStation down to this.idx+1 (inclusive)
      // waypoint[i].run when going backward is still the time from i-1 to i
      // So from fromStation to this.idx, we sum waypoints[fromStation] down to waypoints[this.idx+1]
      for(let i = fromStationIdx; i > this.idx; i--){
        if(i < 0 || i >= waypoints.length) break;
        const wp = waypoints[i];
        if(wp && wp.run){
          elapsedTime += wp.run;
        }
      }
      // Add segmentProgress
      elapsedTime += this.segmentProgress;
    }
    
    // Apply accel_func to the entire segment from station to station
    const time_progress = elapsedTime / totalRunTime;
    let prog_floor = Math.floor(time_progress * 100);
    let prog_ceil = Math.min(Math.floor(time_progress * 100) + 1, accel_func.length - 1);
    prog_floor = Math.max(0, Math.min(prog_floor, accel_func.length - 1));
    
    const f = accel_func[prog_floor] + (accel_func[prog_ceil] - accel_func[prog_floor]) * (time_progress * 100 - prog_floor); 
    
    // Interpolate position between fromStation and toStation
    return [
      fromStation.lat + (toStation.lat - fromStation.lat)*f,
      fromStation.lng + (toStation.lng - fromStation.lng)*f
    ];
  }
  step(){ // advance by 1 tick
    const waypoints = this.getStations();
    const branch = this.getBranch();
    
    // Get the run time to the next waypoint
    // The run value on a waypoint represents time FROM the previous waypoint TO this waypoint
    const nextWpIdx = this.idx + this.dir;
    if(nextWpIdx < 0 || nextWpIdx >= waypoints.length){
      // At terminus, reverse direction
      this.dir *= -1;
      if (this.dir === this.startDir){
        if (!branch.firstTrainFinished){ 
          branch.firstTrainFinished = true; 
        }
      }
      return;
    }
    
    const nextWp = waypoints[nextWpIdx];
    // The run value on nextWp is the time from current waypoint (this.idx) to next waypoint (nextWpIdx)
    const leg = nextWp.run || 0; // run time from current waypoint to next waypoint
    const nextWpType = nextWp.type || 'station';
    const dwell = (nextWpType === 'station' && nextWp.dwell) ? nextWp.dwell : 0; // only stations have dwell
    
    if(this.movingstate == 1){
      if (this.segmentProgress < leg){               // still running
        this.segmentProgress+=TICK_LENGTH;
      } else {                                       // arrived at next waypoint
        // Move to next waypoint
        this.idx += this.dir;
        this.segmentProgress = this.segmentProgress - leg;
        
        // Check if we're at a terminus (first or last station)
        const currentWp = waypoints[this.idx];
        const currentType = currentWp.type || 'station';
        
        if(currentType === 'station'){
          // Check if this is a terminus station
          const prevStationIdx = this.getPrevStationIndex(this.idx, this.dir);
          const nextStationIdx = this.getNextStationIndex(this.idx, this.dir);
          
          if((this.dir === 1 && nextStationIdx === null) || (this.dir === -1 && prevStationIdx === null)){
            // At terminus, reverse direction
            this.dir *= -1;
          if (this.dir === this.startDir){
              if (!branch.firstTrainFinished){ 
                branch.firstTrainFinished = true; 
              }
            }
          }
          
          // If there's a dwell time, start dwelling
          if(dwell > 0){
            this.movingstate = 0;
            this.dwellProgress = 0;
          } else {
            // No dwell, continue moving (shouldn't happen for stations, but handle it)
            this.movingstate = 1;
          }
        } else {
          // At a checkpoint, continue moving without dwelling
          this.movingstate = 1;
        }
      }
      //reduce refresh rate as it shouldn't exceed 60 fps
      if(refreshcoords == 1 && this.marker){
        this.marker.setLatLng(this.latlng());
      }
    }else{
      //dwelling (only at stations)
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
      // Filter to only stations (not checkpoints)
      const stations = branch.stations.filter((wp, idx) => {
        const type = wp.type || 'station';
        return type === 'station';
      });
      
    const wrap = (arr, title) => {
      const tbl = document.createElement('table');
      tbl.innerHTML = `<caption>${title}</caption>` +
          arr.map((v,i)=>`<tr><td>${stations[i].name||'leg '+i}</td>
          <td><input data-array="${title}" data-idx="${i}" type="number"
                     min="5" max="600" value="${v}" style="width:60px;"></td></tr>`).join('');
      return tbl;
    };
    const div = document.createElement("div");
      div.innerHTML = `<strong>${line.name} - Branch ${b + 1}</strong>`;
      //turn station run into a list (only for stations)
    let RUNNING = [];
    let DWELL = [];
      for(let i = 0; i < stations.length; i++){
        RUNNING[i] = stations[i].run || 0;
        DWELL[i] = stations[i].dwell || 0;
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

/* -------------------- GENERATION STAGE -------------------------------- */
function generateAnimation(durationSeconds, onProgress = null){
  return new Promise((resolve, reject) => {
    console.log(`Starting generation for ${durationSeconds} seconds...`);
    isGenerating = true;
    animationData = [];
    
    // Reset simulation state
    restart();
    tick = 0;
    
    // Ensure TICK_LENGTH is 1 for generation (store original value)
    const originalTickLength = TICK_LENGTH;
    TICK_LENGTH = 1;
    
    // Initialize arrays for each second
    for(let s = 0; s <= durationSeconds; s++){
      animationData[s] = [];
    }
    
    let currentSecond = 0;
    const CHUNK_SIZE = 100; // Process 100 seconds at a time to avoid blocking
    
    function processChunk(){
      try {
        const endSecond = Math.min(currentSecond + CHUNK_SIZE, durationSeconds);
        
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
                branch.trains.push(new Train(i, b, 1, false)); // Don't create markers during generation
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
          
          // Store positions for this second
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
        }
        
        currentSecond = endSecond;
        
        // Report progress
        if(onProgress){
          onProgress(currentSecond, durationSeconds);
        }
        
        // Continue with next chunk or finish
        if(currentSecond < durationSeconds){
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
                  animationData[durationSeconds].push({
                    train_id: train.id,
                    line_id: train.line_id,
                    branch_id: train.branch_id,
                    lat: pos[0],
                    lng: pos[1]
                  });
                } catch(e) {
                  console.error(`Error getting final position for train ${train.id}:`, e);
                }
              }
            }
          }
          
          // Restore original TICK_LENGTH
          TICK_LENGTH = originalTickLength;
          
          isGenerating = false;
          console.log(`Generation complete! Generated ${animationData.length} seconds of data.`);
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
    const marker = L.marker([train.lat, train.lng], {
      icon: L.divIcon({
        html:`<div style="
          background:${lines[train.line_id].line_color};
          width:20px;height:20px;border-radius:50%;
          border:2px solid #fff;"></div>  `,
        iconSize:[0,0], iconAnchor:[10,10]
      })
    }).addTo(map);
    playbackMarkers.push(marker);
  }
  
  // Update status display
  for(let i = 0; i < lines.length; i++){
    const lineTrains = frame.filter(t => t.line_id === i);
    const line_span = document.getElementById(`line${i}`);
    line_span.textContent = `${lines[i].name} Trains ${lineTrains.length}`;
  }
  
  document.getElementById("tickdisplay").textContent = `Playback: ${time}s / ${animationData.length - 1}s`;
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
    currentPlaybackTime = 0;
  }
  
  // Play at specified speed (frames per second)
  const frameInterval = 1000 / playbackSpeed; // milliseconds between frames
  
  playbackIntervalId = setInterval(() => {
    playAnimationFrame(currentPlaybackTime);
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
    playAnimationFrame(currentPlaybackTime);
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

/* -------------------- OLD SIMULATION (kept for reference) ------------- */
/* ---------- simulation step ---------- */
function simulate(){

  tick+=TICK_LENGTH;
  actual_tick++;

  //refresh coordinates
  refreshcoords = 0;
  if(tick - lastrefresh > TICK_RATE / 30){
    lastrefresh = tick;
    refreshcoords = 1;
  }

  //do the important stuff first so that they don't get hindered
  for(let i = 0; i < lines.length; i++){
    //such as train spawn control
    if (lines[i].spawnEnabled && tick - lines[i].lastspawn >= lines[i].SPAWN_EVERY){
      lines[i].lastspawn = tick;
      //direction = 1
      lines[i].trains.push(new Train(i, 1));
    }
  }

  for(let i = 0; i < lines.length; i++){
    let trainsstring = "";
    for(let j = 0; j < lines[i].trains.length; j++){
      trainsstring += lines[i].trains[j].visitedstations.toString() + " "
    }

    lines[i].trains.forEach(t=>t.step());
    line_span = document.getElementById(`line${i}`);
    line_span.textContent = `${lines[i].name} Trains ${lines[i].trains.length} | Spawning ${lines[i].spawnEnabled?'ON':'OFF'} ${trainsstring}`;
  }
  document.getElementById("tickdisplay").textContent = `Tick ${tick} (actually ${actual_tick}) - finished: ${finishedticks}`;
  finishedticks+= 1;
}

/* ---------- configurable clock (OLD - kept for reference) ---------- */
let TICK_RATE = 30;          // sim ticks per real second
let SIM_MS    = 1000 / TICK_RATE;
let clockId   = null;

function startClock(){
  if (clockId) clearInterval(clockId);
  SIM_MS = 1000 / TICK_RATE;
  clockId = setInterval(simulate, SIM_MS);
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
    await generateAnimation(duration, (current, total) => {
      statusDiv.textContent = `Generating... ${current}/${total} seconds (${Math.round(current/total*100)}%)`;
    });
    
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Animation';
    statusDiv.textContent = `Generation complete! ${animationData.length} seconds of data ready.`;
    
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

// Old controls (kept for compatibility, but disabled by default)
document.getElementById('tickRate')?.addEventListener('input', e=>{
  TICK_RATE = +e.target.value;
  document.getElementById('tickRateLbl').textContent = TICK_RATE;
  // startClock(); // Disabled - using new generation/playback system
});

document.getElementById('tickTime')?.addEventListener('input', e=>{
  TICK_LENGTH = +e.target.value;
  document.getElementById('tickTimeLbl').textContent = TICK_LENGTH;
  // startClock(); // Disabled - using new generation/playback system
});

/* ---------- initial setup ---------- */
restart();   // sets tick=0, clears trains, etc.
// startClock(); // Disabled - using new generation/playback system
/* ======================================================================= */
/* ======================================================================= */
