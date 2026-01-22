export function renderStations(eew, map) {
  // Each station dot is drawn on the map with PGA intensity
  eew.stations.forEach(st => {
    const color = pgaToColor(st.pga);
    // draw as MapLibre circle or HTML overlay
    // simplified example:
    const dot = document.createElement('div');
    dot.className = 'station-dot';
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.background = color;
    dot.style.position = 'absolute';
    dot.style.left = `${st.screenX}px`; // map conversion needed
    dot.style.top = `${st.screenY}px`;
    document.body.appendChild(dot);
  });
}

function pgaToColor(pga) {
  if(!pga) return '#999'; // unknown
  if(pga < 10) return '#0f0';
  if(pga < 30) return '#ff0';
  if(pga < 60) return '#f80';
  return '#f00';
}
