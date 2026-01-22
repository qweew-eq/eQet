export function waveAnimation(activeEEWs, map) {
  const now = new Date();
  activeEEWs.forEach(eew => {
    const elapsed = (now - new Date(eew.originTime)) / 1000; // sec
    const vp = 6.0, vs = 3.5;
    const pRadius = elapsed * vp * 1000; // meters
    const sRadius = elapsed * vs * 1000;

    // MapLibre circle layer update example
    // here you would update a circle layer with pRadius and sRadius
    // pseudo-code:
    // map.getSource(`wave-${eew.eventID}-p`).setData(circleGeoJSON(eew.epicenter, pRadius));
    // map.getSource(`wave-${eew.eventID}-s`).setData(circleGeoJSON(eew.epicenter, sRadius));
  });
}
