import maplibregl from 'maplibre-gl';
import { autoPan } from './autopan.js';

let currentMarker = null;

export function updateEpicenter(eew, map) {
  if (currentMarker) currentMarker.remove();

  const el = document.createElement('div');
  
  // Settings check: Get "blink" or "fade" from storage
  const mode = localStorage.getItem('markerStyle') || 'blink';
  el.className = `epicenter-marker marker-style-${mode}`; 
  
  el.style.backgroundImage = 'url(/cross.png)'; 

  currentMarker = new maplibregl.Marker(el)
    .setLngLat([eew.Longitude, eew.Latitude])
    .addTo(map);

  if (eew.isCancel) {
    el.style.backgroundImage = 'url(/cancelcross.png)';
    
    // The 7-second sequence before zooming out
    setTimeout(() => {
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
        autoPan(map, null); // Reset to Japan Overview
      }
    }, 7000);
  }
}
