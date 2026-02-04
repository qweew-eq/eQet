// src/main.js
import './styles.css';
import { initMap } from './map/map.js';
import { eewManager } from './ws/eewManager.js';
import { waveAnimation } from './ui/waves.js';
import { updatePanel } from './ui/panel.js';
import { renderMotionPanel } from './motion/motionPanel.js';
import { motionManager } from './motion/motionManager.js';

const map = initMap();
eewManager.start(map);

// NAVIGATION & VIEW SWITCHING
const navIcons = document.querySelectorAll('.side-icon');
navIcons.forEach(icon => {
  icon.onclick = () => {
    navIcons.forEach(i => i.classList.remove('active-icon'));
    icon.classList.add('active-icon');
    const view = icon.getAttribute('alt').toLowerCase();

    if (view === 'motion') {
      renderMotionPanel();
      motionManager.init();
    } else {
      updatePanel(eewManager.getActiveDisplay(), eewManager.historyQuakes, view);
    }
  };
});

// SETTINGS OVERLAY
document.getElementById('settings-btn').onclick = () => {
  const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
  localStorage.setItem('markerStyle', current);
  document.getElementById('current-style').innerText = current.toUpperCase();
  document.getElementById('settings-overlay').style.display = 'flex';
};

document.getElementById('exit-door').onclick = () => {
  document.getElementById('settings-overlay').style.display = 'none';
};

// JST CLOCK
setInterval(() => {
  const jst = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (9 * 3600000));
  document.getElementById('jst-clock').innerText = jst.toLocaleString('ja-JP').replace(/-/g, '/');
}, 1000);

// ANIMATION LOOP
map.on('load', () => {
  const animate = () => {
    const active = eewManager.getActiveDisplay();
    if (active) waveAnimation([active], map);
    requestAnimationFrame(animate);
  };
  animate();
});
