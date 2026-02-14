import {calculateDistance} from "./editor_helpers.js";

let lat1 = 22.3317, lng1 = 114.0289;
let lat2 = 22.3156, lng2 = 114.0450;

document.getElementById("distance").innerHTML=(calculateDistance(lat1, lng1, lat2, lng2));