import maplibregl from 'maplibre-gl';

export function initMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019bdb6b-5300-7f9e-9627-cfc67708b678/style.json?key=__MAPTILER_KEY__',
    center: [135.0, 35.0],
    zoom: 4,
    transformRequest: (url, resourceType) => {
      if (url.includes('api.maptiler.com')) {
        return {
          url: url,
          headers: {
            'User-Agent': 'DesktopTaurivo1dd'
          }
        };
      }
    }
  });
  return map;
}
