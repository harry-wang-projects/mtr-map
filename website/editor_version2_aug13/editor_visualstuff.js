//import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

//not the same as the one in editor_helpers!!
export function generate_train_icon_2(markertype, line_color, label, image, icon_size){
  if(markertype == "hklrt"){
    //height 18 width 32 border radius 9 font size 11
    return `<div style="
        background-color: #fff;
        height: ${icon_size*0.57}px; width: ${icon_size}px;border-radius:${icon_size*0.28}px;font-size: ${icon_size*0.35}px;text-align: center;vertical-align: middle;
        border:2px solid ${line_color};">${label}</div>  `;
  }else if(markertype == "hkmtr"){
    return `<div style="
        background-color:${line_color};overflow: hidden;
        width:${icon_size}px;height:${icon_size}px;border-radius:50%;
        border:${icon_size * 0.18}px solid ${line_color};"><img src="${image}" style="
        height:100%; width: 100%; object-fit:cover;display:block;"></div>  `;
  }else if(markertype == "largehkmtr"){
    return `<div style="
        background-color:${line_color};overflow: hidden;
        width:${icon_size}px;height:${icon_size}px;border-radius:50%;
        border:${icon_size * 0.18}px solid ${line_color};"><img src="${image}" style="
        height:100%; width: 100%; object-fit:cover;display:block;"></div>  `;
  }else if(markertype == "image"){
    return `<img src="${image}" style="width:${icon_size}px; height: ${icon_size}px ;object-fit:contain;">`;
  }else if(markertype =="largeimage"){
    return `<img src="${image}" style="width:${icon_size}px; height: ${icon_size}px ;object-fit:contain;">`;
  }else if(markertype == "bus"){
    //height 20 width 28 font size 13 border radius 4
    return `<div style="
        background-color: ${line_color}; color:#ffffff;
        height: ${icon_size*0.72}px; width: ${icon_size}px;border-radius:${icon_size*0.14}px;font-size: ${icon_size*0.45}px;text-align: center;vertical-align: middle;padding-top:3px;">${label}</div>  `;
  }else{
    return `<div style="
        background-color:${line_color};
        width:${icon_size}px;height:${icon_size}px;border-radius:50%;
        border:2px solid #fff;"></div>  `;
  }
}