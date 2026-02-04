// src/ui/alerts.js
let lastUpdateKey = null;

export function AudioPlayer(eew) {
  const updateKey = `${eew.EventID}_${eew.Serial}`;

  // 1. CANCELLATION CHAIN (Tone -> Voice)
  if (eew.isCancel || eew.is_cancel) {
    const cancelTone = new Audio('/sounds/cancel.wav');
    const cancelVoice = new Audio('/sounds/aloudcancel.wav');
    
    cancelTone.play().catch(e => console.warn("Cancel tone failed:", e));
    
    // Play voice immediately after tone ends
    cancelTone.onended = () => {
      cancelVoice.play().catch(e => console.warn("aloudcancel.wav not found or failed:", e));
    };
    return;
  }

  // Prevent duplicate audio triggers for the same data packet
  if (updateKey === lastUpdateKey) return;
  lastUpdateKey = updateKey;

  // 2. REPORT TYPE SOUNDS (Priority: Final > New > Update)
  if (eew.isFinal || eew.is_final) {
    new Audio('/sounds/lastupd.wav').play().catch(() => {});
  } else if (parseInt(eew.Serial) === 1) {
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
      setTimeout(() => {
        new Audio('/sounds/3upper.wav').play().catch(() => {});
      }, 600);
    }

    // Threshold: Warning level (Red Pill)
    if (eew.isWarn || eew.is_warn) {
      setTimeout(() => {
        new Audio('/sounds/warn.wav').play().catch(() => {});
      }, 1200);
    }
  } else if (maxInt === 'FUMEI') {
    new Audio('/sounds/unk.wav').play().catch(() => {});
  }

  // 4. SPECIALS (PLUM / Assumption)
  if (eew.isAssumption || eew.is_plum) {
    new Audio('/sounds/PLUM.wav').play().catch(() => {});
  }
}
