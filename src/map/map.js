import maplibregl from 'maplibre-gl';

export function initMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019bdb6b-5300-7f9e-9627-cfc67708b678/style.json?key=IAxgKtygqhnYR1RJh6rS',
    center: [135.0, 35.0],
    zoom: 4
  });
  return map;
}
