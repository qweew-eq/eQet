// src/ui/waves.js
import { waveRadii } from '../assets/wavecalc.js';

/**
 * Initialize wave layers on the map
 */
export function initWaveLayers(map) {
  if (!map.getSource('p-wave')) {
    map.addSource('p-wave', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
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

  if (!map.getSource('s-wave')) {
    map.addSource('s-wave', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
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
 * Update wave positions/radii (This is the one main.js calls)
 */
export function waveAnimation(activeEEWs, map) {
  if (!activeEEWs || activeEEWs.length === 0) return;

  // We take the latest EEW to update the circles
  const eew = activeEEWs[activeEEWs.length - 1];
  const { pRadius, sRadius } = waveRadii(eew.OriginTime);

  const pFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [eew.Longitude, eew.Latitude]
    },
    properties: { radius: pRadius }
  };

  const sFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [eew.Longitude, eew.Latitude]
    },
    properties: { radius: sRadius }
  };

  if (map.getSource('p-wave')) {
    map.getSource('p-wave').setData({ type: 'FeatureCollection', features: [pFeature] });
  }
  if (map.getSource('s-wave')) {
    map.getSource('s-wave').setData({ type: 'FeatureCollection', features: [sFeature] });
  }
}
