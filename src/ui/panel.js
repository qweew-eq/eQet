// src/ui/panel.js
import { AudioPlayer } from './alerts.js';

const MAXINT_IMAGES = {
  '0': 'shindo_0.png', '1': 'shindo_1.png', '2': 'shindo_2.png',
  '3': 'shindo_3.png', '4': 'shindo_4.png', '5-': 'shindo_5-.png',
  '5+': 'shindo_5+.png', '6-': 'shindo_6-.png', '6+': 'shindo_6+.png',
  '7': 'shindo_7.png', 'FUMEI': 'shindo_unk_int.png'
};

export function updatePanel(eew) {
  const panel = document.getElementById('eew-panel');
  if (!panel) return;

  // Trigger the audio logic
  AudioPlayer(eew);

  const maxInt = eew.MaxIntensity || 'FUMEI';
  const imgName = MAXINT_IMAGES[maxInt] || MAXINT_IMAGES.FUMEI;
  
  // Red for Warn (Alert), Orange for Forecast
  const pillColor = eew.isWarn ? '#ff0000' : '#ff8c00';
  
  // Format the title text
  let reportTitle = '';
  if (eew.isCancel) {
    reportTitle = '緊急地震速報 (取消)';
  } else {
    const type = eew.isWarn ? '警報' : '予報';
    const num = eew.isFinal ? '最終報' : `第${eew.Serial}報`;
    reportTitle = `緊急地震速報 ${num} (${type})`;
  }

  const timeParts = eew.OriginTime ? eew.OriginTime.split(' ') : ['', ''];

  panel.innerHTML = `
    <div class="icon-gutter">
      <img src="/icon.png" class="side-icon" alt="Home">
      <img src="/apple-touch-icon.png" class="side-icon" alt="Waves">
      <div style="flex-grow: 1;"></div>
      <img src="/android-chrome-192x192.png" class="side-icon" id="settings-btn" style="margin-bottom: 20px;" alt="Settings">
    </div>

    <div class="panel-content">
      <div class="alert-pill" style="background: ${pillColor};">
        ${reportTitle}
      </div>

      <div class="intensity-block">
        <img src="/shindoimg/panelintensity/${imgName}" class="shindo-img" onerror="this.src='/shindoimg/panelintensity/shindo_unk_int.png'">
        <div class="meta-info">
          ${timeParts[0]}<br/>
          <span style="font-size: 18px; font-weight: bold;">${timeParts[1]} JST</span>
        </div>
      </div>

      <span class="location-text">${eew.Hypocenter || '震源地不明'}</span>

      <div style="text-align: right; font-size: 15px; line-height: 2.0; color: #eee; margin-top: 10px;">
        マグニチュード : <span style="font-weight: bold;">M${eew.Magunitude}</span><br/>
        深さ : <span style="font-weight: bold;">${eew.Depth}km</span>
      </div>
      
      <div id="status-log" style="font-size: 13px; color: #bbb; margin-top: 20px; border-top: 1px solid #444; padding-top: 10px;">
        ${eew.isAssumption ? '※PLUM法による推定を含む<br/>' : ''}
        ${eew.isCancel ? '<span style="color: #ff4444; font-weight: bold;">この速報は取り消されました。</span>' : 
          (eew.isFinal ? '最終報を受信しました。' : '情報を更新中...')}
      </div>
    </div>
  `;
}
