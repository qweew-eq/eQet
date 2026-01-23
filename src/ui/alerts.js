// src/ui/alerts.js
let lastUpdateKey = null;

export function AudioPlayer(eew) {
  const updateKey = `${eew.EventID}_${eew.Serial}`;

  // 1. CANCELLATION CHAIN (Tone -> Voice)
  if (eew.isCancel) {
    const cancelTone = new Audio('/sounds/cancel.wav');
    const cancelVoice = new Audio('/sounds/aloudcancel.wav');
    cancelTone.play().catch(() => {});
    // Wait for tone to finish before playing voice
    cancelTone.onended = () => cancelVoice.play().catch(() => {});
    return;
  }

  // Prevent duplicate audio triggers for the same data packet
  if (updateKey === lastUpdateKey) return;
  lastUpdateKey = updateKey;

  // 2. REPORT TYPE SOUNDS (Priority: Final > New > Update)
  if (eew.isFinal) {
    new Audio('/sounds/lastupd.wav').play().catch(() => {});
  } else if (eew.Serial === 1) {
    new Audio('/sounds/eq.wav').play().catch(() => {});
  } else {
    new Audio('/sounds/update.wav').play().catch(() => {});
  }

  // 3. INTENSITY & THRESHOLD LOGIC
  const maxInt = eew.MaxIntensity;

  if (maxInt && maxInt !== 'FUMEI') {
    // Specific Intensity Voice (e.g., 5+.wav)
    new Audio(`/sounds/${maxInt}.wav`).play().catch(() => {});

    // Threshold: 3 or 4
    if (maxInt === '3' || maxInt === '4') {
      new Audio('/sounds/3upper.wav').play().catch(() => {});
    }

    // Threshold: Warning level (Red Pill)
    if (eew.isWarn) {
      new Audio('/sounds/warn.wav').play().catch(() => {});
    }
  } else if (maxInt === 'FUMEI') {
    new Audio('/sounds/unk.wav').play().catch(() => {});
  }

  // 4. SPECIALS
  if (eew.isAssumption) {
    new Audio('/sounds/PLUM.wav').play().catch(() => {});
  }
}
