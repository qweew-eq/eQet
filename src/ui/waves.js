// src/ui/waves.js
import { waveRadii } from '../assets/wavecalc.js';

/**
 * Initialize wave layers on the map
 * @param {maplibregl.Map} map
 */
export function initWaveLayers(map) {
  // P-wave circle
  if (!map.getSource('p-wave')) {
    map.addSource('p-wave', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addLayer({
      id: 'p-wave-layer',
      type: 'circle',
      source: 'p-wave',
      paint: {
        'circle-radius': ['get', 'radius'],
        'circle-color': 'rgba(0, 180, 255, 0.3)',
        'circle-stroke-color': 'rgba(0, 180, 255, 0.6)',
        'circle-stroke-width': 2
      }
    });
  }

  // S-wave circle
  if (!map.getSource('s-wave')) {
    map.addSource('s-wave', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addLayer({
      id: 's-wave-layer',
      type: 'circle',
      source: 's-wave',
      paint: {
        'circle-radius': ['get', 'radius'],
        'circle-color': 'rgba(255, 100, 0, 0.3)',
        'circle-stroke-color': 'rgba(255, 100, 0, 0.6)',
        'circle-stroke-width': 2
      }
    });
  }
}

/**
 * Update wave positions/radii
 * @param {maplibregl.Map} map
 * @param {Object} epicenter - {lat, lon}
 * @param {String|Date} originTime
 */
export function updateWaves(map, epicenter, originTime) {
  const { pRadius, sRadius } = waveRadii(originTime);

  const pFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [epicenter.lon, epicenter.lat]
    },
    properties: {
      radius: pRadius / map.getZoomScale() // adjust for map scale if needed
    }
  };

  const sFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [epicenter.lon, epicenter.lat]
    },
    properties: {
      radius: sRadius / map.getZoomScale()
    }
  };

  map.getSource('p-wave').setData({
    type: 'FeatureCollection',
    features: [pFeature]
  });

  map.getSource('s-wave').setData({
    type: 'FeatureCollection',
    features: [sFeature]
  });
}

/**
 * Starts the animation loop for the waves
 * @param {maplibregl.Map} map
 * @param {Object} epicenter - {lat, lon}
 * @param {String|Date} originTime
 */
export function startWaveAnimation(map, epicenter, originTime) {
  function frame() {
    updateWaves(map, epicenter, originTime);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
