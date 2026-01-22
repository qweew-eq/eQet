// src/ui/panel.js
import { AudioPlayer } from './alerts.js';

// Map max intensity to shindo images
const MAXINT_IMAGES = {
  '1': 'shindo_1.png',
  '2': 'shindo_2.png',
  '3': 'shindo_3.png',
  '4': 'shindo_4.png',
  '5-': 'shindo_5-.png',
  '5+': 'shindo_5+.png',
  '6-': 'shindo_6-.png',
  '6+': 'shindo_6+.png',
  '7': 'shindo_7.png',
  FUMEI: 'shindo_unk_int.png', // unknown intensity
};

// Sound triggers
const SOUNDS = {
  max3upper: '3upper.wav',
  warn: 'warn.wav',
  update: 'upd.wav',
  newEq: 'eq.wav',
  plum: 'PLUM.wav'
};

// Keep track of last played sounds
let lastMaxInt = null;
let lastUpdate = null;

/**
 * Update the EEW panel UI
 * @param {Object} eew - EEW data from WolfX
 */
export function updatePanel(eew) {
  const panel = document.getElementById('eew-panel');
  if (!panel) return;

  // Determine intensity image
  let maxInt = eew.MaxIntensity || 'FUMEI';
  const imgName = MAXINT_IMAGES[maxInt] || MAXINT_IMAGES.FUMEI;

  // Create or update image element
  let imgEl = panel.querySelector('img');
  if (!imgEl) {
    imgEl = document.createElement('img');
    imgEl.style.width = '80px';
    imgEl.style.height = '80px';
    panel.appendChild(imgEl);
  }
  imgEl.src = `/shindoimg/panelintensity/${imgName}`;

  // Play sounds based on max intensity
  if (maxInt !== lastMaxInt) {
    if (maxInt >= '3' && maxInt < '5') AudioPlayer.play(SOUNDS.max3upper);
    if (maxInt >= '5-') AudioPlayer.play(SOUNDS.warn);
    lastMaxInt = maxInt;
  }

  // Play update sound every new EEW update
  const updateKey = `${eew.EventID}_${eew.Serial}`;
  if (updateKey !== lastUpdate) {
    AudioPlayer.play(SOUNDS.update);
    lastUpdate = updateKey;
  }

  // Play new earthquake sound if this is the first report
  if (eew.Serial === 1) {
    AudioPlayer.play(SOUNDS.newEq);
  }

  // Play PLUM sound if assumption method
  if (eew.IsAssumption) {
    AudioPlayer.play(SOUNDS.plum);
  }

  // Fill textual info
  panel.innerHTML += `
    <div style="font-size:12px; margin-top:5px;">
      <b>${eew.Hypocenter || '???'}</b> <br/>
      Mag: ${eew.Magunitude || '???'} <br/>
      Depth: ${eew.Depth || '???'} km <br/>
      Time: ${eew.OriginTime || '???'}
    </div>
  `;
}
