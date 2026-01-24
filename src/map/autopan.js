export function autoPan(map, eew) {
  if (!map) return;

  // Check the Setting!
  const isEnabled = localStorage.getItem('autoPan') === 'on';
  if (!isEnabled) return; 

  if (!eew) {
    map.flyTo({ center: [138.0, 38.0], zoom: 4.5, speed: 0.6, essential: true });
    return;
  }

  if (eew.Serial > 1) {
    map.easeTo({ center: [eew.Longitude, eew.Latitude], duration: 2000 });
  } else {
    map.flyTo({ center: [eew.Longitude, eew.Latitude], zoom: 6.5, essential: true });
  }
}
