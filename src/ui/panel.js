import { AudioPlayer } from './alerts.js';

const MAXINT_IMAGES = {
  '0': 'shindo_0.png', '1': 'shindo_1.png', '2': 'shindo_2.png',
  '3': 'shindo_3.png', '4': 'shindo_4.png', '5-': 'shindo_5-.png',
  '5+': 'shindo_5+.png', '6-': 'shindo_6-.png', '6+': 'shindo_6+.png',
  '7': 'shindo_7.png', 'FUMEI': 'shindo_unk_int.png'
};

const P2P_SHINDO = { 10: '1', 20: '2', 30: '3', 40: '4', 45: '5-', 50: '5+', 55: '6-', 60: '6+', 70: '7' };

export function updatePanel(eew, history = []) {
  const panel = document.getElementById('eew-panel');
  if (!panel) return;

  if (eew) AudioPlayer(eew);

  const maxInt = eew?.MaxIntensity || 'FUMEI';
  const imgName = MAXINT_IMAGES[maxInt] || MAXINT_IMAGES.FUMEI;
  const pillColor = eew?.isWarn ? '#ff0000' : '#ff8c00';
  const reportTitle = eew ? (eew.isCancel ? '緊急地震速報 (取消)' : `緊急地震速報 第${eew.Serial}報`) : '地震情報待機中';

  const historyHtml = history.map(q => {
    const intensity = P2P_SHINDO[q.earthquake.maxScale] || 'unk';
    return `
      <div class="history-item" style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
        <img src="/shindoimg/panelintensity/shindo_${intensity}.png" style="width:30px; height:30px;">
        <div style="font-size:11px;">
          <div style="font-weight:bold; color:#fff;">${q.earthquake.hypocenter.name}</div>
          <div style="color:#aaa;">M${q.earthquake.hypocenter.magnitude} / ${q.earthquake.hypocenter.depth}km</div>
        </div>
      </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="icon-gutter">
      <img src="/icon.png" class="side-icon active-icon" alt="Home">
      <img src="/images/imagesicon/shake.png" class="side-icon" alt="Shake">
      <img src="/images/imagesicon/info.png" class="side-icon" alt="Info">
      <img src="/images/imagesicon/wave.png" class="side-icon" alt="Wave">
      <div style="flex-grow: 1;"></div>
      <img src="/images/imagesicon/settings.png" class="side-icon" id="settings-btn" style="margin-bottom: 20px;" alt="Settings">
    </div>

    <div class="panel-content">
      <div class="alert-pill" style="background: ${pillColor};">${reportTitle}</div>

      ${eew ? `
        <div style="display: flex; gap: 15px; align-items: flex-start; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px;">
          <img src="/shindoimg/panelintensity/${imgName}" class="shindo-img">
          <div style="font-size: 13px;">
            <span style="font-size: 18px; font-weight: bold; display: block;">${eew.Hypocenter}</span>
            M ${eew.Magunitude} / 深さ ${eew.Depth}km
          </div>
        </div>
      ` : '<div style="padding: 10px; color: #888; text-align: center;">最新の地震情報を表示中</div>'}
      
      <div style="margin-top: 20px;">
        <div style="font-size: 11px; color: #888; margin-bottom: 8px;">過去の地震</div>
        <div id="history-list">${historyHtml}</div>
        <div id="status-log"></div>
      </div>
    </div>
  `;
}
