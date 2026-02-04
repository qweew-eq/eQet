// src/ui/panel.js
import { AudioPlayer } from './alerts.js';

export function updatePanel(eew, history = []) {
  const contentArea = document.getElementById('dynamic-content');
  if (!contentArea) return;

  // 1. Internal Mappings (Keeps global scope clean)
  const MAXINT_IMAGES = {
    '0': 'shindo_0.png', '1': 'shindo_1.png', '2': 'shindo_2.png',
    '3': 'shindo_3.png', '4': 'shindo_4.png', '5-': 'shindo_5-.png',
    '5+': 'shindo_5+.png', '6-': 'shindo_6-.png', '6+': 'shindo_6+.png',
    '7': 'shindo_7.png', 'FUMEI': 'shindo_unk_int.png'
  };

  const P2P_SHINDO = { 10: '1', 20: '2', 30: '3', 40: '4', 45: '5-', 50: '5+', 55: '6-', 60: '6+', 70: '7' };

  const formatDepth = (d) => {
    if (d === 0 || d === "0" || d === "Very Shallow") return "ごく浅い";
    return `約${d}km`;
  };

  // 2. Audio Trigger
  if (eew) AudioPlayer(eew);

  // 3. EEW Calculations
  const maxInt = eew?.MaxIntensity || 'FUMEI';
  const imgName = MAXINT_IMAGES[maxInt] || MAXINT_IMAGES.FUMEI;
  
  // Logic for the Blue -> Orange -> Red Pill
  let pillColor = '#00d9ff26'; // Default Idle Blue
  let pillClass = 'pill-idle';
  let reportTitle = '地震情報待機中';

  if (eew) {
    if (eew.isCancel) {
      pillColor = '#444';
      pillClass = '';
      reportTitle = '緊急地震速報 (取消)';
    } else {
      pillColor = eew.isWarn ? '#ff0000' : '#ff8c00';
      pillClass = eew.isWarn ? 'pill-warning' : 'pill-forecast';
      reportTitle = `緊急地震速報 第${eew.Serial}報${eew.isFinal ? ' (最終)' : ''}`;
    }
  }

  // 4. Render History
  const historyHtml = history.map(q => {
    const intensity = P2P_SHINDO[q.earthquake.maxScale] || 'unk';
    return `
      <div class="history-item">
        <img src="/shindoimg/panelintensity/shindo_${intensity}.png" class="history-shindo-icon">
        <div style="font-size:11px;">
          <div style="font-weight:bold; color:#fff;">${q.earthquake.hypocenter.name}</div>
          <div style="color:#aaa;">M${q.earthquake.hypocenter.magnitude} / ${formatDepth(q.earthquake.hypocenter.depth)}</div>
        </div>
      </div>`;
  }).join('');

  // 5. Inject HTML
  contentArea.innerHTML = `
      <div class="alert-pill ${pillClass}" style="background: ${pillColor};">${reportTitle}</div>

      ${eew ? `
        <div class="eew-display-box">
          <img src="/shindoimg/panelintensity/${imgName}" class="main-shindo-img">
          <div class="eew-info-text">
            <span class="hypo-title">${eew.Hypocenter}</span>
            <div class="mag-depth-text">M ${eew.Magunitude} / 深さ ${formatDepth(eew.Depth)}</div>
          </div>
        </div>
      ` : `
        <div class="jquake-main-text">
           現在、緊急地震速報は発表されていません。
        </div>
      `}
      
      <div class="section-label">過去の地震情報</div>
      <div id="history-list">${historyHtml}</div>
  `;
}
