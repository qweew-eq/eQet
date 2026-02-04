// src/motion/motionManager.js
export const motionManager = {
  isMonitoring: false,
  points: new Array(280).fill(40),

  init() {
    const btn = document.getElementById('start-monitor-btn');
    if (!btn) return;
    btn.onclick = async () => {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') return;
      }
      this.isMonitoring = true;
      document.getElementById('monitor-init').style.display = 'none';
      document.getElementById('monitor-active').style.display = 'block';
      this.startLoop();
    };
  },

  startLoop() {
    const canvas = document.getElementById('seismoCanvas');
    const ctx = canvas?.getContext('2d');
    const pgaEl = document.getElementById('pga-val');

    window.addEventListener('devicemotion', (e) => {
      if (!this.isMonitoring || !e.acceleration) return;
      const pga = Math.sqrt(e.acceleration.x**2 + e.acceleration.y**2 + e.acceleration.z**2) * 980.665;
      if (pgaEl) pgaEl.innerText = pga.toFixed(2);
      this.points.push(40 - (pga * 0.5));
      this.points.shift();
      this.draw(ctx, canvas);
    });
  },

  draw(ctx, canvas) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.points[0]);
    this.points.forEach((p, i) => ctx.lineTo(i, p));
    ctx.stroke();
  }
};
