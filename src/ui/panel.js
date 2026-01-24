import { AudioPlayer } from './alerts.js';

const MAXINT_IMAGES = {
  '0': 'shindo_0.png', '1': 'shindo_1.png', '2': 'shindo_2.png',
  '3': 'shindo_3.png', '4': 'shindo_4.png', '5-': 'shindo_5-.png',
  '5+': 'shindo_5+.png', '6-': 'shindo_6-.png', '6+': 'shindo_6+.png',
  '7': 'shindo_7.png', 'FUMEI': 'shindo_unk_int.png'
};

const P2P_SHINDO = { 10: '1', 20: '2', 30: '3', 40: '4', 45: '5-', 50: '5+', 55: '6-', 60: '6+', 70: '7' };

export function updatePanel(eew, history = []) {
  const contentArea = document.getElementById('dynamic-content');
  if (!contentArea) return;

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

  contentArea.innerHTML = `
      <div class="alert-pill" style="background: ${pillColor}; text-align:center; padding:10px; border-radius:8px; font-weight:900; margin-bottom:20px;">${reportTitle}</div>

      ${eew ? `
        <div style="display: flex; gap: 15px; align-items: flex-start; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px;">
          <img src="/shindoimg/panelintensity/${imgName}" style="width:80px; height:80px;">
          <div style="font-size: 13px;">
            <span style="font-size: 18px; font-weight: bold; display: block;">${eew.Hypocenter}</span>
            M ${eew.Magunitude} / 深さ ${eew.Depth}km
          </div>
        </div>
      ` : '<div style="padding: 10px; color: #888; text-align: center;">最新の地震情報を表示中</div>'}
      
      <div style="margin-top: 20px;">
        <div style="font-size: 11px; color: #888; margin-bottom: 8px;">過去の地震</div>
        <div id="history-list">${historyHtml}</div>
      </div>
  `;
}
