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
  const timeParts = eew?.OriginTime ? eew.OriginTime.split(' ') : ['', ''];

  const historyHtml = history.map(q => {
    const intensity = P2P_SHINDO[q.earthquake.maxScale] || 'unk';
    return `
      <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
        <img src="/shindoimg/panelintensity/shindo_${intensity}.png" style="width:30px; height:30px;">
        <div style="font-size:11px;">
          <div style="font-weight:bold; color:#fff;">${q.earthquake.hypocenter.name}</div>
          <div style="color:#aaa;">M${q.earthquake.hypocenter.magnitude} / ${q.earthquake.hypocenter.depth}km</div>
        </div>
      </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="icon-gutter">
      <img src="/icon.png" class="side-icon" alt="Home">
      <img src="/images/imagesicon/shake.png" class="side-icon" alt="Shake">
      <img src="/images/imagesicon/info.png" class="side-icon" alt="Info">
      <img src="/images/imagesicon/wave.png" class="side-icon" alt="Wave">
      <div style="flex-grow: 1;"></div>
      <img src="/images/imagesicon/settings.png" class="side-icon" id="settings-btn" style="margin-bottom: 20px;" alt="Settings">
    </div>

    <div class="panel-content">
      <div class="alert-pill" style="background: ${pillColor};">${reportTitle}</div>

      ${eew ? `
        <div class="intensity-block" style="display: flex; gap: 15px; align-items: flex-start;">
          <img src="/shindoimg/panelintensity/${imgName}" class="shindo-img" style="width: 80px; height: 80px;">
          <div class="meta-info" style="font-size: 13px; line-height: 1.4;">
            発生日時: ${timeParts[0]}<br/>
            <span style="font-size: 16px; font-weight: bold;">${timeParts[1]} JST</span><br/>
            <span style="font-size: 18px; font-weight: bold; display: block; margin-top: 5px;">${eew.Hypocenter || '震源地不明'}</span>
          </div>
        </div>
        <div style="text-align: right; font-size: 15px; margin-top: 10px; color: #eee;">
          マグニチュード : <span style="font-weight: bold;">${eew.Magunitude}</span><br/>
          深さ : <span style="font-weight: bold;">${eew.Depth}km</span>
        </div>
      ` : '<div style="padding: 20px 0; color: #888; text-align: center;">最新の地震情報を表示中</div>'}
      
      <div class="eq-reports-area" style="margin-top: 20px; border-top: 1px solid #444; padding-top: 15px;">
        <div style="font-size: 12px; font-weight: bold; color: #888; margin-bottom: 10px;">過去の地震情報</div>
        <div id="history-list">${historyHtml}</div>
        <div id="status-log"></div>
      </div>
    </div>
  `;

  // Attach highlight logic
  const icons = panel.querySelectorAll('.side-icon');
  icons.forEach(icon => {
    icon.onclick = () => {
      icons.forEach(i => i.classList.remove('active-icon'));
      icon.classList.add('active-icon');
    };
  });
}
