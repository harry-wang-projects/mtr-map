/**
 * Animation generation: Train class and generateAnimation().
 * Depends on globals from kimi_mtr.js: lines, map, accel_func, TICK_LENGTH, refreshcoords,
 * restart, allBranchesStoppedSpawning, animationData, isGenerating, tick, spawn_completed_time.
 */

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
