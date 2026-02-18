import './styles.css';
import { initMap } from './map/map.js';
import { eewManager } from './ws/eewManager.js';
import { waveAnimation } from './ui/waves.js';
import { updatePanel } from './ui/panel.js';
import { renderMotionPanel } from './motion/motionPanel.js';
import { motionManager } from './motion/motionManager.js';

// 1. Initialize Map and WS immediately
const map = initMap();
eewManager.start(map);

document.addEventListener('DOMContentLoaded', () => {
  // 2. NAVIGATION (Guarded)
  const navIcons = document.querySelectorAll('.side-icon');
  navIcons.forEach(icon => {
    icon.onclick = () => {
      navIcons.forEach(i => i.classList.remove('active-icon'));
      icon.classList.add('active-icon');
      const view = icon.getAttribute('alt')?.toLowerCase();
      if (!view) return;

      if (view === 'motion') {
        renderMotionPanel();
        motionManager.init();
      } else {
        updatePanel(eewManager.getActiveDisplay(), eewManager.historyQuakes, view);
      }
    };
  });

  // 3. SETTINGS & CLOCK (Guarded to prevent crash if IDs are missing)
  const settingsBtn = document.getElementById('settings-btn');
  const clockEl = document.getElementById('jst-clock');

  if (settingsBtn) {
    settingsBtn.onclick = () => {
      const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
      localStorage.setItem('markerStyle', current);
      const styleLabel = document.getElementById('current-style');
      if (styleLabel) styleLabel.innerText = current.toUpperCase();
      const overlay = document.getElementById('settings-overlay');
      if (overlay) overlay.style.display = 'flex';
    };
  }

  if (clockEl) {
    setInterval(() => {
      const jst = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (9 * 3600000));
      clockEl.innerText = jst.toLocaleString('ja-JP').replace(/-/g, '/');
    }, 1000);
  }
});

// 4. ANIMATION LOOP (Wait for Map)
map.on('load', () => {
  const animate = () => {
    const active = eewManager.getActiveDisplay();
    if (active) waveAnimation([active], map);
    requestAnimationFrame(animate);
  };
  animate();
});
