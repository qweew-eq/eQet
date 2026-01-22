export function autoPan(map, coords) {
  map.easeTo({ center: [coords.lon, coords.lat], zoom: 6, duration: 500 });
}
