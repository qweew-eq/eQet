// src/ui/alerts.js
export const AudioPlayer = {
  _cache: {},
  play(fileName) {
    if (!fileName) return;
    let audio = this._cache[fileName];
    if (!audio) {
      audio = new Audio(`/sounds/${fileName}`);
      this._cache[fileName] = audio;
    }
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Audio play failed', e));
  }
};
