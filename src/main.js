import './styles.css';
import { initMap } from './map/map.js';
import { eewManager } from './ws/eewManager.js';
import { waveAnimation } from './ui/waves.js';

const map = initMap();

// Start the system immediately to populate the panel
eewManager.start(map);

map.on('load', () => {
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
      localStorage.setItem('markerStyle', current);
      alert(`Settings: Cross Animation is now ${current.toUpperCase()}`);
    };
  }

  function animate() {
    // Uses the array we defined in eewManager
    waveAnimation(eewManager.activeEEWs, map);
    requestAnimationFrame(animate);
  }
  animate();
});
