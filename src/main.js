import './style.css';
import { initMap } from './map/map.js';
import { connectWolfx } from './ws/wolfx.js';
import { waveAnimation } from './ui/waves.js';
import { renderPanel } from './ui/panel.js';
import { renderStations } from './ui/stations.js';
import { playAlert } from './ui/alerts.js';

// Initialize map
const map = initMap();

// Active earthquakes array
let activeEEWs = [];

// Wolfx WebSocket connection
connectWolfx((eew) => {
  // Add to active EEWs
  activeEEWs.push(eew);

  // Update panel UI
  renderPanel(eew);

  // Play alerts based on intensity / type
  playAlert(eew);

  // Update stations UI (PGA dots)
  renderStations(eew, map);
});

// Animation loop for S/P wave propagation
function animate() {
  waveAnimation(activeEEWs, map);
  requestAnimationFrame(animate);
}
animate();
