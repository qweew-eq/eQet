import './styles.css';
import { initMap } from './map/map.js';
import { eewManager } from './ws/eewManager.js';
import { waveAnimation } from './ui/waves.js';

const map = initMap();
eewManager.start(map);

// 1. SETTINGS LOGIC
const settingsBtn = document.getElementById('settings-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const exitBtn = document.getElementById('exit-door');

settingsBtn.onclick = () => {
    // Toggle marker style logic
    const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
    localStorage.setItem('markerStyle', current);
    document.getElementById('current-style').innerText = current.toUpperCase();
    
    // Show UI
    settingsOverlay.style.display = 'flex';
};

exitBtn.onclick = () => {
    settingsOverlay.style.display = 'none';
};

// 2. MOVING HIGHLIGHT LOGIC
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(btn => {
  btn.onclick = () => {
    navButtons.forEach(b => b.classList.remove('active-icon'));
    btn.classList.add('active-icon');
  };
});

// 3. ANIMATION LOOP
map.on('load', () => {
  function animate() {
    waveAnimation(eewManager.activeEEWs, map);
    requestAnimationFrame(animate);
  }
  animate();
});
