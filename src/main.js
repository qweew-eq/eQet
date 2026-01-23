import './styles.css';
import { initMap } from './map/map.js';
import { connectWolfx } from './ws/wolfx.js';
import { waveAnimation } from './ui/waves.js';
import { updatePanel } from './ui/panel.js';
import { AudioPlayer as playAlert } from './ui/alerts.js';


// Initialize map
const map = initMap();

// Active earthquakes array
let activeEEWs = [];

// WAIT for the map to be ready before doing anything else
map.on('load', () => {
  console.log("Map is ready! Starting EEW logic...");

  // Wolfx WebSocket connection
  connectWolfx((eew) => {
    activeEEWs.push(eew);
    updatePanel(eew);
    playAlert(eew);
  });

  // Start animation loop ONLY after map is loaded
  function animate() {
    waveAnimation(activeEEWs, map);
    requestAnimationFrame(animate);
  }
  animate();
});
