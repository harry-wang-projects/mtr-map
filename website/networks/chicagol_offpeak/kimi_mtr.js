//some variables
//seconds in one tick
let TICK_LENGTH = 1;

//map here

let accel_func = [0.0002380952381,0.0009523809524,0.002142857143,0.00380952381,0.005952380952,0.008571428571,0.01166666667,0.01523809524,0.01928571429,0.02380952381,0.02880952381,0.03428571429,0.04023809524,0.04666666667,0.05357142857,0.06095238095,0.06880952381,0.07714285714,0.08595238095,0.09523809524,0.105,0.1152380952,0.125952381,0.1371428571,0.1488095238,0.160952381,0.1735714286,0.1866666667,0.2002380952,0.2142857143,0.2285714286,0.2428571429,0.2571428571,0.2714285714,0.2857142857,0.3, 0.3142857143,0.3285714286,0.3428571429,0.3571428571,0.3714285714,0.3857142857,0.4,0.4142857143,0.4285714286,0.4428571429,0.4571428571,0.4714285714,0.4857142857,0.5,0.5142857143,0.5285714286,0.5428571429,0.5571428571,0.5714285714,0.5857142857,0.6,0.6142857143,0.6285714286,0.6428571429,0.6571428571,0.6714285714,0.6857142857,0.7,0.7142857143,0.7285714286,0.7428571429,0.7571428571,0.7714285714,0.7857142857,0.7997619048,0.8133333333,0.8264285714,0.839047619,0.8511904762,0.8628571429,0.874047619,0.8847619048,0.895,0.9047619048,0.914047619,0.9228571429,0.9311904762,0.939047619,0.9464285714,0.9533333333,0.9597619048,0.9657142857,0.9711904762,0.9761904762,0.9807142857,0.9847619048,0.9883333333,0.9914285714,0.994047619,0.9961904762,0.9978571429,0.999047619,0.9997619048,1]

/* =========  CONFIGURATION  ============================================= */
//run = seconds from station i to station i + 1
//dwell = seconds stopped at station i
// Lines are composed of branches. Each branch can have different routes, frequencies, and offset times.
let lines = [];

// Lines data is loaded from mtr_offpeak_v9.json (see loadLinesData() below),
// instead of being hard-coded here.
let linesDataLoaded = false;

function loadLinesData(){
  fetch('chicago_l_v4.json')
    .then(res => res.json())
    .then(data => {
      lines = data;
      normalizeLineIds();
      linesDataLoaded = true;
      tryStartSimulation();
    })
    .catch(err => {
      console.error('Failed to load lines from mtr_offpeak_v9.json:', err);
    });
}

// Called once both the map style and the lines JSON have finished loading.
function tryStartSimulation(){
  if(mapLoaded && linesDataLoaded){
    split_bidirectional();
    process_lines();
    restart();
  }
}

loadLinesData();

//frames per (simulated) second toggling
//this is the value of the fps that is being toggled
let toggle_fps = 1;
//this is the value of the fps of the current animation. When generate_animation gets pressed, this should be set to toggle_fps.
let animation_fps = 1;

const select = document.getElementById('frame_select');
const display = document.getElementById('fpsdisplay');

select.addEventListener('change', function() {
  toggle_fps = parseInt(this.value, 10);
  display.textContent = "Number of frames per second inside the simulation: " + toggle_fps.toString();
  console.log('Updated to:', myInteger);
});





/* =========  END CONFIG  ================================================ */
function reset_animation(){
  // Stop video/playback and clear playback state
  stopPlayback();
  clearPlaybackMarkers();
  if(typeof animationTrajectories !== 'undefined') animationTrajectories = [];
  //FRAMEUPDATE: added frames version
  if(typeof currentPlaybackTime !== 'undefined') currentPlaybackTime = 0;
  if(typeof currentPlaybackTime_frames !== 'undefined') currentPlaybackTime_frames = 0;
  if(typeof tick !== 'undefined') tick = 0;
}



//drawing the routes and stations
function draw_branchroute(branch, line_color){
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
  if(branch.hasOwnProperty("branch_type") && branch.branch_type === "circular"){
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

  routeLineFeatures.push({
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: branchCoords.map(c => [c[1], c[0]]) },
    properties: { color: line_color }
  });
  allLineCoords.push(...branchCoords);

  branch.stations.forEach(s => {
    stationPointFeatures.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
      properties: { radius: 3, fillColor: line_color, strokeColor: '#fff', strokeWidth: 2, opacity: 1 }
    });
    if(s.checkpoints && Array.isArray(s.checkpoints)){
      s.checkpoints.forEach(cp => {
        stationPointFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [cp.lng, cp.lat] },
          properties: { radius: 2, fillColor: line_color, strokeColor: line_color, strokeWidth: 1, opacity: 0.5 }
        });
      });
    }
  });
  updateRouteSources();
}

function clear_routes(){
  routeLineFeatures = [];
  stationPointFeatures = [];
  allLineCoords = [];
  updateRouteSources();
}

function reset_lines(){

  // Remove all train markers and clear train arrays
  
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    if(!line.branches) continue;
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      /*
      if(branch.trains){
        branch.trains.forEach(t => t.remove());
        branch.trains.length = 0;
      }
      */
    }
  }
  
  clear_routes();


  // Clear status and time tables, then rebuild time tables for current lines
  const statusEl = document.getElementById('status');
  if(statusEl) statusEl.innerHTML = '';
  const timeTablesEl = document.getElementById('timeTables');
  if(timeTablesEl) timeTablesEl.innerHTML = '';

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
      draw_branchroute(branch, lines[i].line_color);

      //branch.trains = [];
    }
  }

  if(allLineCoords.length > 0){
    const lats = allLineCoords.map(c => c[0]);
    const lngs = allLineCoords.map(c => c[1]);
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 50, duration: 0, linear:true }
    );
  }
  if(document.getElementById("tickdisplay")){
    document.getElementById("tickdisplay").textContent = 'Stopped';
  }
  const mapOverlayReset = document.getElementById("mapTimeOverlay");
  if(mapOverlayReset) mapOverlayReset.textContent = '';
}

/* ---------- map setup ------------------------------------------------- */
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        //tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        //tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"],
        tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        attribution: '© OSM'
      }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.8 } }]
  },
  center: [114.18, 22.28],
  zoom: 13
});

let routeLineFeatures = [];
let stationPointFeatures = [];
let mapLoaded = false;

function updateRouteSources() {
  if (!mapLoaded) return;
  map.getSource('route-lines').setData({ type: 'FeatureCollection', features: routeLineFeatures });
  map.getSource('route-stations').setData({ type: 'FeatureCollection', features: stationPointFeatures });
}

map.on('load', () => {
  mapLoaded = true;
  map.addSource('route-lines', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addSource('route-stations', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({
    id: 'route-lines-layer', type: 'line', source: 'route-lines',
    paint: { 'line-color': ['get', 'color'], 'line-width': 2 }
  });
  map.addLayer({
    id: 'route-stations-layer', type: 'circle', source: 'route-stations',
    paint: {
      'circle-radius': ['get', 'radius'],
      'circle-color': ['get', 'fillColor'],
      'circle-stroke-color': ['get', 'strokeColor'],
      'circle-stroke-width': ['get', 'strokeWidth'],
      'circle-opacity': ['get', 'opacity']
    }
  });
  tryStartSimulation();
});

/* draw static line */
let allLineCoords = [];

//train simulation here


/* ---------------------------------------------------------------------- */

/* =====================  SIMULATION  =================================== */
// animationTrajectories[line_id][branch_id] = { trajectory, journeyTimeSeconds, initialProgresses }
let animationTrajectories = [];  // Pre-computed per-branch trajectories (one full journey cycle).
let animationPlaybackDurationSeconds = 0; // User-requested playback length (generation is independent).
let isGenerating = false;
let isPlaying = false;
let currentPlaybackTime = 0;
let currentPlaybackTime_frames = 0;
let playbackMarkers = []; // Markers for playback mode

let tick = 0;               // global time in seconds (used during generation)
let actual_tick = 0;       //how many ticks actually happened
let refreshcoords = 0; //whether or not to update coordinates on the map
let lastrefresh = 0; //last time it refreshed

let finishedticks = 0; //seeing how many ticks actually finished

//TODO: Make these buttons work for many lines in the future


function restart(){
  reset_animation();
  reset_lines();
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    for(let b = 0; b < line.branches.length; b++){
      const branch = line.branches[b];
      //branch.trains.forEach(t=>t.remove());
      //branch.trains.length = 0;
    }
  }
  tick = 0;
}

function clearPlaybackMarkers(){
  playbackMarkers.forEach(m => m.remove());
  playbackMarkers = [];
}

//turn everything into integers for travel/dwell times
function remove_decimals(){
  for(let i = 0; i < lines.length; i++){
    for(let j = 0; j < lines[i].branches.length; j++){
      for(let k = 0; k < lines[i].branches[j].stations.length; k++){
        lines[i].branches[j].stations[k].run = Math.ceil(lines[i].branches[j].stations[k].run);
        lines[i].branches[j].stations[k].dwell = Math.ceil(lines[i].branches[j].stations[k].dwell);
      }
    }
  }
}

let spawn_completed_time = 0;

function getLineZIndex(lineCfg) {
  return lineCfg.hasOwnProperty("line_zindex") ? lineCfg.line_zindex : 0;
}

function createPlaybackMarker(lineCfg, pos) {
  const train_image = lineCfg.hasOwnProperty("image") ? lineCfg.image : "";
  const markertype = lineCfg.hasOwnProperty("markertype") ? lineCfg.markertype : "";
  let icon_size = 30;
  if(lineCfg.hasOwnProperty("icon_size")){
    icon_size = lineCfg.icon_size;
  }
  const el = generate_train_icon(markertype, lineCfg.line_color, lineCfg.label, train_image, icon_size);
  el.style.zIndex = String(getLineZIndex(lineCfg));
  const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([pos.lng, pos.lat])
    .addTo(map);
  playbackMarkers.push(marker);
  return marker;
}

function generate_train_icon(markertype, line_color, label, image, icon_size){
  const el = document.createElement('div');
  if(markertype == "hklrt"){
    //height 18 width 32 border radius 9 font size 11 line height 18
    el.style.cssText = `background:#fff;height:${icon_size*0.57}px;width:${icon_size}px;border-radius:${icon_size*0.28}px;font-size:${icon_size*0.35}px;text-align:center;line-height:${icon_size*0.57}px;border:2px solid ${line_color};`;
    el.textContent = label;
  }else if(markertype == "hkmtr"){
    el.style.cssText = `background:${line_color};overflow:hidden;width:${icon_size}px;height:${icon_size}px;border-radius:50%;border:${icon_size * 0.18}px solid ${line_color};`;
    const img = document.createElement('img');
    img.src = image;
    img.style.cssText = 'height:100%;width:100%;object-fit:cover;display:block;';
    el.appendChild(img);
  }else if(markertype == "largehkmtr"){
    el.style.cssText = `background:${line_color};overflow:hidden;width:${icon_size}px;height:${icon_size}px;border-radius:50%;border:${icon_size * 0.18}px solid ${line_color};`;
    const img = document.createElement('img');
    img.src = image;
    img.style.cssText = 'height:100%;width:100%;object-fit:cover;display:block;';
    el.appendChild(img);
  }else if(markertype == "image"){
    const img = document.createElement('img');
    img.src = image;
    img.style.cssText = `width:${icon_size}px;height:${icon_size}px;object-fit:contain;`;
    img.className = 'my-image-icon';
    el.appendChild(img);
  }else if(markertype =="largeimage"){
    const img = document.createElement('img');
    img.src = image;
    img.style.cssText = `width:${icon_size}px;height:${icon_size}px;object-fit:contain;`;
    img.className = 'my-image-icon';
    el.appendChild(img);
  }else if(markertype == "bus"){
    //height 20 width 28 font size 13 border radius 4
    el.style.cssText = `background:${line_color};color:#ffffff;
        height: ${icon_size*0.72}px; width: ${icon_size}px;border-radius:${icon_size*0.14}px;font-size: ${icon_size*0.45}px;text-align: center;`;
    el.textContent = label;
  }else{
    el.style.cssText = `background:${line_color};width:${icon_size}px;height:${icon_size}px;border-radius:50%;border:2px solid #fff;`;
  }
  return el;
}

function secondsToTimeStr(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/* -------------------- PLAYBACK STAGE ----------------------------------- */
function playAnimationFrame(time){
  if(!animationTrajectories || animationTrajectories.length === 0){
    console.warn("No animation trajectories to play");
    return;
  }

  //FRAMEUPDATE: Changed elapsedSeconds to elapsedFrames
  //const elapsedSeconds = time - spawn_completed_time;
  //if(elapsedSeconds < 0) return;
  const elapsedFrames = time - spawn_completed_time;
  if(elapsedFrames < 0) return;
  
  // Create markers for all virtual trains at this time.
  // Each branch has a trajectory array indexed by `timeProgress` (seconds).
  // A train's `timeProgress` advances by 1 per frame and wraps with modulo.
  for(let i = 0; i < lines.length; i++){
    const lineCfg = lines[i];
    const lineMeta = animationTrajectories[i] || [];

    let trainsOnThisLine = 0;

    for(let b = 0; b < (lineCfg.branches ? lineCfg.branches.length : 0); b++){
      const branchMeta = lineMeta[b];
      if(!branchMeta) continue;

      //FRAMEUPDATE: Changed variable names from seconds to frames
      const { trajectory, journeyTimeFrames, initialProgresses } = branchMeta;
      if(!trajectory || journeyTimeFrames <= 0) continue;


      if(lines[i].branches[b].branch_type == "unidirectional"){
        const time_value = elapsedFrames;
        //Once a minute: Update the queue.
        if(elapsedFrames % (60 * animation_fps) == 0){
          //step 1: Add new trains.
          let add_finished = false;
          while (true){
            //break out of the end is reached
            if(lines[i].branches[b].head >= lines[i].branches[b].spawn_times.length){
              break;
            }

            //break out if this train isn't active yet
            //FRAMEUPDATE: spawn_times doesn't change. Hence, animationfps gets multiplied.
            if(elapsedFrames < lines[i].branches[b].spawn_times[lines[i].branches[b].head] * animation_fps){
              break;
            }
            //add the marker
            const pos = trajectory[0];
            const marker = createPlaybackMarker(lineCfg, pos);

            animationTrajectories[i][b].markers[ lines[i].branches[b].head] = marker;

            //head = the next train to be added.
            lines[i].branches[b].head++;
            lines[i].branches[b].markerhead++;

          }

          //step 2: Remove old trains.
          let del_finished = false;
          while (true){
            if(lines[i].branches[b].tail >= lines[i].branches[b].head){
              break;
            }
            //break out if this train is still active
            //FRAMEUPDATE: spawn_times doesn't change. Hence, animationfps gets multiplied.
            if(elapsedFrames - (lines[i].branches[b].spawn_times[lines[i].branches[b].tail] * animation_fps + lines[i].branches[b].travel_time_frames) < 0){
              break;
            }

            animationTrajectories[i][b].markers[ lines[i].branches[b].tail].remove();


            //tail = the next train to be removed
            lines[i].branches[b].tail++;
            lines[i].branches[b].markertail++;
          }
        }


        //display the trains in the queue.
        for(let k = lines[i].branches[b].tail; k < lines[i].branches[b].head; k++){
          //if it doesn't get deleted yet, then wait more.
          //FRAMEUDPATE: Multiplied spawn_times by the animation_fps. Hence, timeProgress represents the frame.
          let timeProgress = elapsedFrames - lines[i].branches[b].spawn_times[k] * animation_fps;
          if(timeProgress >= journeyTimeFrames - 1){
            timeProgress = journeyTimeFrames - 1;
          }
          const pos = trajectory[timeProgress];
          if(!pos) continue;

          branchMeta.markers[k].setLngLat([pos.lng, pos.lat]);
          trainsOnThisLine++;
        }
      }else{
        for(let k = 0; k < initialProgresses.length; k++){
          const timeProgress = (initialProgresses[k] + elapsedFrames) % journeyTimeFrames;
          console.log("__timeprogress:");
          console.log(timeProgress)
          console.log("__len:");
          console.log(trajectory.length);
          const pos = trajectory[timeProgress];
          console.log(branchMeta.markers.length);
          if(!pos) continue;

          /*
          const marker = L.marker([pos.lat, pos.lng], { icon:   line_icon }).addTo(map);
          playbackMarkers.push(marker);
          */
          trainsOnThisLine++;
          branchMeta.markers[k].setLngLat([pos.lng, pos.lat]);
        }
      }
    }

    const line_span = document.getElementById(`line${i}`);
    if(line_span){
      line_span.textContent = `${lineCfg.name} Trains ${trainsOnThisLine}`;
    }
  }

  const timeStr = secondsToTimeStr(Math.round(elapsedFrames / animation_fps));
  document.getElementById("tickdisplay").textContent = `Playback: ${elapsedFrames} frames ${elapsedFrames / animation_fps}s | ${timeStr}`;
  const mapOverlay = document.getElementById("mapTimeOverlay");
  if(mapOverlay) mapOverlay.textContent = timeStr;
}

let playbackIntervalId = null;
//in frames per second (real seconds)
let currentPlaybackSpeed = 1;

function startPlayback(playbackSpeed = 1, resetTime = true){
  if(isPlaying && resetTime) return; // Don't restart if already playing and not resetting
  if(!animationTrajectories || animationTrajectories.length === 0){
    alert("Please generate animation data first!");
    return;
  }
  
  // If already playing and just changing speed, update the interval
  if(isPlaying && !resetTime){
    updatePlaybackSpeed(playbackSpeed);
    return;
  }
  
  //generate the train markers. By pre-generating them and updating them each time, I should be able to increase the performance.

  // Clear existing markers
  clearPlaybackMarkers();

  // Create markers for all virtual trains at this time.
  // Each branch has a trajectory array indexed by `timeProgress` (seconds).
  // A train's `timeProgress` advances by 1 per frame and wraps with modulo.
  // Lower line_zindex lines are created first so higher z-index markers stack on top.
  const lineIndices = lines.map((_, idx) => idx).sort((a, b) => getLineZIndex(lines[a]) - getLineZIndex(lines[b]));
  for(const i of lineIndices){
    const lineCfg = lines[i];
    const lineMeta = animationTrajectories[i] || [];
    let trainsOnThisLine = 0;

    for(let b = 0; b < (lineCfg.branches ? lineCfg.branches.length : 0); b++){
      const branchMeta = lineMeta[b];
      if(!branchMeta) continue;

      const { trajectory, journeyTimeFrames, initialProgresses } = branchMeta;
      if(!trajectory || journeyTimeFrames <= 0) continue;

      animationTrajectories[i][b].markers = [];
  
      if(lines[i].branches[b].branch_type == "unidirectional"){
        //unidirectional lines. The markers are in a queue.
        animationTrajectories[i][b].markerhead = 0;
        animationTrajectories[i][b].markertail = 0;

        //start iterating. Start with head. Add the markers first.
        //no train can despawn at time 0, so no need to pop anything.
        while(true){
          if(lines[i].branches[b].spawn_times[ animationTrajectories[i][b].markerhead] != 0){
            break;
          }
          const pos = trajectory[0];
          const marker = createPlaybackMarker(lineCfg, pos);
          
          //add the marker
          animationTrajectories[i][b].markers[ animationTrajectories[i][b].markerhead] = marker;
          animationTrajectories[i][b].markerhead++;

          //change the head of spawn progresses.
          lines[i].branches[b].head++;

          trainsOnThisLine++;
        }

      }else{
        //normal or circular lines. Just markers that don't change.
        console.log("><initialprogresslen:");
        for(let k = 0; k < initialProgresses.length; k++){
          const timeProgress = (initialProgresses[k]) %   journeyTimeFrames;
          console.log(timeProgress);
          const pos = trajectory[timeProgress];
          if(!pos) continue;

          const marker = createPlaybackMarker(lineCfg, pos);
          animationTrajectories[i][b].markers[k] = marker;
          trainsOnThisLine++;
        }
      }
    }

    const line_span = document.getElementById(`line${i}`);
    if(line_span){
      line_span.textContent = `${lineCfg.name} Trains ${trainsOnThisLine}`;
    }
  }

  isPlaying = true;
  currentPlaybackSpeed = playbackSpeed;
  if(resetTime){
    currentPlaybackTime = 0;
    currentPlayBackTime_frames = 0;
  }
  
  // Play at specified speed (frames per second)
  const frameInterval = 1000 / playbackSpeed; // milliseconds between frames
  
  playbackIntervalId = setInterval(() => {
    
    playAnimationFrame(currentPlaybackTime_frames + spawn_completed_time);
    currentPlaybackTime_frames++;
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
    
    playAnimationFrame(currentPlaybackTime_frames + spawn_completed_time);
    currentPlaybackTime_frames++;
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
  startPlayback(playbackSpeed, false); // Don't reset time when resuming
}




/* ---------- UI Controls for Generation and Playback ---------- */
// Generation controls
document.getElementById('generateBtn')?.addEventListener('click', async () => {
  const generateBtn = document.getElementById('generateBtn');
  const statusDiv = document.getElementById('generationStatus');
  
  if(isGenerating){
    return;
  }  
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  statusDiv.textContent = 'Starting generation...';

  //set the frames per simulated second
  animation_fps = toggle_fps;
  //alert(toggle_fps);
  
  //turn all travel times into integers.
  remove_decimals();
  console.log(lines);

  try {
    await generateAnimation((current, total, spawnEndTime, isPostSpawn, spawningLines) => {
      if(isPostSpawn){
        // After spawn phase: animation duration is counting (requested duration only)
        const progress = Math.round((current - spawnEndTime) / (total - spawnEndTime) * 100);
        statusDiv.textContent = `Generating animation... ${current - spawnEndTime}/${total - spawnEndTime}s of animation (${progress}%) | Total: ${current}/${total}s`;
      } else {
        // During spawn phase: show elapsed time and which lines are still spawning
        const spawningText = spawningLines && spawningLines.length > 0
          ? spawningLines.join(', ')
          : 'none (finalizing…)';
        statusDiv.textContent = `Spawning trains… ${current}s elapsed\nLines still spawning: ${spawningText}\n`;
      }
    });
    

    //post generation (for unidirectioanl) - list out the spawn complete times for trains
    for(let i = 0; i < lines.length; i++){
      for(let j = 0; j < lines[i].branches.length; j++){
        if(!lines[i].branches[j].hasOwnProperty("branch_type")){
          continue;
        }
        if(lines[i].branches[j].branch_type != "unidirectional"){
          continue;
        }
        //FRAMEUPDATE: Now, travel_time is in frames.
        let travel_time = animationTrajectories[i][j].trajectory.length;
        lines[i].branches[j].travel_time = travel_time;
        //animation_fps was already multiplied
        let travel_time_frames = animationTrajectories[i][j].trajectory.length;
        lines[i].branches[j].travel_time_frames = travel_time_frames;
        for(let k = 0; k < lines[i].branches[j].spawn_times.length; k++){
          lines[i].branches[j].events[Math.floor((lines[i].branches[j].spawn_times[k] + travel_time)/60)] = 1;
        }
      }
    }

    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Animation';
    //animationPlaybackDurationSeconds = duration;
    statusDiv.textContent = `Generation complete! spawn_completed_time=${spawn_completed_time}s.`;
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
  currentPlaybackTime_frames = 0;
  document.getElementById("tickdisplay").textContent = 'Stopped';
  const mapOverlay = document.getElementById("mapTimeOverlay");
  if(mapOverlay) mapOverlay.textContent = '';
});

document.getElementById('playbackSpeed')?.addEventListener('input', e => {
  const speed = parseFloat(e.target.value);
  document.getElementById('playbackSpeedLbl').textContent = speed;
  if(isPlaying){
    // Update speed without resetting playback position
    updatePlaybackSpeed(speed);
  }
});

//settings buttosn
document.getElementById('showroutes')?.addEventListener('click', e => {
  for(let i = 0; i < lines.length; i++){
    lines[i].branches = lines[i].branches || [];
    for(let b = 0; b < lines[i].branches.length; b++){
      draw_branchroute(lines[i].branches[b], lines[i].line_color);
    }
  }
});

document.getElementById('hideroutes')?.addEventListener('click', e => {
  clear_routes();
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
        reset_animation();
        reset_lines();

        //do the processing here. For unidirectional lines.
        split_bidirectional();
        process_lines();

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

document.getElementById('setTimeBtn')?.addEventListener('click', () => {
  const input = (document.getElementById('timeInput')?.value || '').trim();
  const match = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(input);
  if(!match){
    alert('Invalid time format. Use HH:MM:SS (e.g. 14:02:33)');
    return;
  }
  const h = Number(match[1]), m = Number(match[2]), s = Number(match[3]);
  if(h > 23 || m > 59 || s > 59){
    alert('Invalid time values.');
    return;
  }
  currentPlaybackTime_frames = (h * 3600 + m * 60 + s) * animation_fps;

  //for scheduled_frequencies, reset the queue. We can just reset the head and tail back to 0 and redo it.
  //also, delete all trains.
  for(let i = 0; i < lines.length; i++){
    for(let j = 0; j < lines[i].branches.length; j++){
      if(!lines[i].branches[j].hasOwnProperty("branch_type")){
        continue;
      }
      if(lines[i].branches[j].branch_type === "unidirectional" || lines[i].branches[j].branch_type === "bidirectional"){
        lines[i].branches[j].head = 0;
        lines[i].branches[j].tail = 0;
        for(let k = 0; k < animationTrajectories[i][j].markers.length; k++){
          animationTrajectories[i][j].markers[k].remove();
        }
      }
    }
  }
});

// startClock(); // Disabled - using new generation/playback system
/* ======================================================================= */
/* ======================================================================= */