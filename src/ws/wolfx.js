// src/ws/wolfx.js
export function connectWolfx(onMessage) {
    const ws = new WebSocket('wss://ws-api.wolfx.jp/jma_eew');
    const statusText = document.getElementById('server-status');

    ws.onopen = () => { if (statusText) statusText.innerText = "受信サーバー接続中"; };
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'jma_eew') onMessage(data);
    };
    ws.onclose = () => {
        if (statusText) statusText.innerText = "接続再試行中...";
        setTimeout(() => connectWolfx(onMessage), 5000);
    };
}
[04.02, 2:05 PM] Аға: // src/motion/motionManager.js
export const motionManager = {
  isMonitoring: false,
  points: new Array(280).fill(40),

  init() {
    const btn = document.getElementById('start-monitor-btn');
    if (!btn) return;
    btn.onclick = async () => {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') return;
      }
      this.isMonitoring = true;
      document.getElementById('monitor-init').style.display = 'none';
      document.getElementById('monitor-active').style.display = 'block';
      this.startLoop();
    };
  },

  startLoop() {
    const canvas = document.getElementById('seismoCanvas');
    const ctx = canvas?.getContext('2d');
    const pgaEl = document.getElementById('pga-val');

    window.addEventListener('devicemotion', (e) => {
      if (!this.isMonitoring || !e.acceleration) return;
      const pga = Math.sqrt(e.acceleration.x**2 + e.acceleration.y**2 + e.acceleration.z**2) * 980.665;
      if (pgaEl) pgaEl.innerText = pga.toFixed(2);
      this.points.push(40 - (pga * 0.5));
      this.points.shift();
      this.draw(ctx, canvas);
    });
  },

  draw(ctx, canvas) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.points[0]);
    this.points.forEach((p, i) => ctx.lineTo(i, p));
    ctx.stroke();
  }
};
[04.02, 2:05 PM] Аға: // src/motion/motionPanel.js
export function renderMotionPanel() {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  container.innerHTML = `
    <div class="jquake-msg-area">
      <div class="alert-pill pill-idle">強震モニタ (内蔵)</div>
      <div id="monitor-init" style="text-align:center; padding:30px 10px;">
        <p style="font-size:12px; color:#aaa; margin-bottom:20px;">デバイスの加速度センサーを使用し計測します。</p>
        <button id="start-monitor-btn" class="action-btn">計測を開始</button>
      </div>
      <div id="monitor-active" style="display:none;">
        <div class="seismo-container" style="background:#000; padding:10px; border:1px solid #333;">
          <canvas id="seismoCanvas" width="280" height="80"></canvas>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
            <div style="font-size:10px; color:#666;">最大加速度 (PGA)</div>
            <div style="font-size:24px; font-weight:bold; color:#00d9ff; font-family:monospace;">
              <span id="pga-val">0.00</span> <small style="font-size:12px; color:#444;">gal</small>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
[04.02, 2:05 PM] Аға: // src/ui/panel.js
export function updatePanel(eew, history = []) {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  if (!eew) {
    container.innerHTML = `
      <div class="jquake-msg-area">
        <div class="alert-pill pill-idle">監視中</div>
        <div class="jquake-main-text">現在、緊急地震速報は発表されていません。</div>
        <div class="section-label">過去の地震情報</div>
        <div id="history-list">${renderHistory(history)}</div>
      </div>`;
    return;
  }

  const isWarn = eew.isWarn || eew.is_warn;
  const isFinal = eew.isFinal || eew.is_final;
  const pillClass = isWarn ? 'pill-warning' : 'pill-forecast';
  const img = eew.MaxIntensity ? `shindo_${eew.MaxIntensity}.png` : 'shindo_unk.png';

  container.innerHTML = `
    <div class="jquake-msg-area">
      <div class="alert-pill ${pillClass}">緊急地震速報 第${eew.Serial}報${isFinal ? ' (最終)' : ''}</div>
      <div class="eew-display-box">
        <img src="/shindoimg/panelintensity/${img}" style="width:70px; height:70px;">
        <div class="eew-info-text">
          <div class="hypo-title">${eew.Hypocenter}</div>
          <div class="mag-depth-text">M${eew.Magunitude} / 深さ${eew.Depth}km</div>
        </div>
      </div>
      <div class="section-label">過去の地震情報</div>
      <div id="history-list">${renderHistory(history)}</div>
    </div>`;
}

function renderHistory(history) {
  const p2pMap = { 10: '1', 20: '2', 30: '3', 40: '4', 45: '5-', 50: '5+', 55: '6-', 60: '6+', 70: '7' };
  return history.map(q => {
    const s = p2pMap[q.earthquake.maxScale] || 'unk';
    return `
      <div class="history-item">
        <img src="/shindoimg/panelintensity/shindo_${s}.png" style="width:24px; height:24px; margin-right:8px;">
        <div style="font-weight:900; color:#ffcc00; width:45px;">震度 ${s}</div>
        <div style="font-size:12px; flex:1;">${q.earthquake.hypocenter.name}</div>
      </div>`;
  }).join('');
}
[04.02, 2:05 PM] Аға: // src/ws/eewManager.js
import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';

export const eewManager = {
  activeEEW: null,
  historyQuakes: [],
  expiryTime: null,

  async start(map) {
    await this.fetchEqHistory();

    // Wolfx: EEW (Strings: "5-", "6+")
    connectWolfx((data) => {
      if (data.is_cancel || data.isCancel) {
        this.activeEEW = null;
        this.expiryTime = null;
      } else {
        this.activeEEW = data;
        // Keep Final reports on screen for 5 mins
        this.expiryTime = (data.is_final || data.isFinal) ? Date.now() + 300000 : null;
      }
      this.refresh();
    });

    this.connectP2PWS();
  },

  refresh() {
    updatePanel(this.getActiveDisplay(), this.historyQuakes);
  },

  getActiveDisplay() {
    if (this.expiryTime && Date.now() > this.expiryTime) this.activeEEW = null;
    return this.activeEEW;
  },

  async fetchEqHistory() {
    const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=5');
    this.historyQuakes = await res.json();
    this.refresh();
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.code === 551) {
        this.historyQuakes.unshift(d);
        this.historyQuakes = this.historyQuakes.slice(0, 5);
        this.refresh();
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
[04.02, 2:05 PM] Аға: // src/main.js
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
