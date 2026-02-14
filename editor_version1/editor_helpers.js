
let testing_stations= [
          {name:"North Point", lat:22.2908, lng:114.2008, run:90, dwell:90},
          {name:"Quarry Bay", lat:22.2878, lng:114.2097, run:210, dwell:30},
          {name:"Yau Tong", lat:22.2978, lng:114.2372, run:150, dwell:30, checkpoints: [{lat:22.2944, lng:114.2419, progresss: 0.3}]},
          {name:"Tiu Keng Leng", lat:22.3042, lng:114.2525, run:90, dwell:30},
          {name:"Tseung Kwan O", lat:22.3075, lng:114.2600, run:150, dwell:30,  checkpoints: [{lat:22.3105, lng:114.2689, progresss: 0.3}, {lat:22.3021, lng:114.2750, progresss: 0.7}]},
          {name:"LOHAS Park", lat:22.2958, lng:114.2689, run:90, dwell:120},
        ];

export function calculateDistance(lat1, lon1, lat2, lon2) {
    // Earth's radius in meters
    const R = 6371000;
    
    // Convert degrees to radians
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    // Haversine formula
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Distance in meters
    const distance = R * c;
    
    return distance;
}

export function dist2time(distance, speed, acceleration) {
    let min_fullspeed_dist = (0.5 * acceleration * (speed / acceleration) * (speed / acceleration) ) * 2;
    if(distance >= min_fullspeed_dist){
        //it can reach full speed;
        let accel_decel_time = (speed / acceleration) * 2;
        return accel_decel_time + (distance - min_fullspeed_dist) / speed;
    }else{
        //it doesn't reach full speed.
        let s = distance / 2;
        //1/2 at^2 = s, t = sqrt(2s / a)
        //multiply the time by 2 to include deceleration.
        return Math.sqrt(s * 2 / acceleration) * 2;
    }
}

export function autotime(input_stations, speed, acceleration) {
    let return_array = [];
    for(let i = 0; i < input_stations.length - 1; i++){
        if(input_stations[i].hasOwnProperty("checkpoints")){
            if(input_stations[i].checkpoints.length > 0){
                //add the checkpoints up.
                let distance = 0;
                let lat1 = input_stations[i].lat;
                let lng1 = input_stations[i].lng;
                let lat2 = input_stations[i].checkpoints[0].lat;
                let lng2 = input_stations[i].checkpoints[0].lng;
                distance += (calculateDistance(lat1, lng1, lat2, lng2));
                for(let j = 0; j < input_stations[i].checkpoints.length - 1; j++){
                    lat1 = input_stations[i].checkpoints[j].lat;
                    lng1 = input_stations[i].checkpoints[j].lng;
                    lat2 = input_stations[i].checkpoints[j+1].lat;
                    lng2 = input_stations[i].checkpoints[j+1].lng;
                    distance += (calculateDistance(lat1, lng1, lat2, lng2));
                }
                lat1 = input_stations[i].checkpoints[input_stations[i].checkpoints.length - 1].lat;
                lng1 = input_stations[i].checkpoints[input_stations[i].checkpoints.length - 1].lng;
                lat2 = input_stations[i + 1].lat;
                lng2 = input_stations[i + 1].lng;
                distance += (calculateDistance(lat1, lng1, lat2, lng2));
                return_array.push(dist2time(distance, speed, acceleration));
            }
        }else{
            //no checkpoints, very easy.
            return_array.push(dist2time(calculateDistance(input_stations[i].lat, input_stations[i].lng, input_stations[i+1].lat, input_stations[i+1].lng), speed, acceleration));
        }
    }
    return return_array;
}

export function autoprogress(input_checkpoints) {

}
