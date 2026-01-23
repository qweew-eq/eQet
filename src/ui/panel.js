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
  const pillColor = eew.isWarn ? '#ff0000' : '#ff8c00';
  
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
      <img src="/images/imagesicon/icon.png" class="side-icon" alt="Home">
      <img src="/images/imagesicon/shake.png" class="side-icon" alt="Shake">
      <img src="/images/imagesicon/info.png" class="side-icon" alt="Info">
      <img src="/images/imagesicon/wave.png" class="side-icon" alt="Wave">
      <div style="flex-grow: 1;"></div>
      <img src="/images/imagesicon/settings.png" class="side-icon" id="settings-btn" style="margin-bottom: 20px;" alt="Settings">
    </div>

    <div class="panel-content">
      <div class="alert-pill" style="background: ${pillColor};">
        ${reportTitle}
      </div>

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
      
      <div class="eq-reports-area" style="margin-top: 20px;">
        地震情報 :
        <div id="status-log" style="font-size: 13px; color: #bbb; margin-top: 5px;">
          ${eew.isCancel ? '<span style="color: #ff4444; font-weight:bold;">この速報は取り消されました。</span>' : ''}
        </div>
      </div>
    </div>
  `;
}
