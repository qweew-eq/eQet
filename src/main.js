import './styles.css';
import { initMap } from './map/map.js';
import { eewManager } from './ws/eewManager.js';
import { waveAnimation } from './ui/waves.js';

const map = initMap();

map.on('load', async () => {
  await eewManager.start(map);

  // Settings Gear Click Logic
  const settingsBtn = document.querySelector('.side-icon[src*="settings.png"]');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
      localStorage.setItem('markerStyle', current);
      alert(`Settings: Cross Animation is now ${current.toUpperCase()}`);
    };
  }

  function animate() {
    waveAnimation(eewManager.activeEEWs, map);
    requestAnimationFrame(animate);
  }
  animate();
});
