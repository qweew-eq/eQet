// src/motion/motionPanel.js
export function renderMotionPanel() {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  container.innerHTML = `
    <div class="jquake-msg-area">
      <div class="alert-pill pill-idle">強震モニタ (内蔵)</div>
      <div id="monitor-init" style="text-align:center; padding:30px 10px;">
        <p style="font-size:12px; color:#aaa; margin-bottom:20px;">デバイスの加速度センサーを使用し計測します。</p>
        <button id="start-monitor-btn" class="action-btn">計測を開始</button>
      </div>
      <div id="monitor-active" style="display:none;">
        <div class="seismo-container" style="background:#000; padding:10px; border:1px solid #333;">
          <canvas id="seismoCanvas" width="280" height="80"></canvas>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
            <div style="font-size:10px; color:#666;">最大加速度 (PGA)</div>
            <div style="font-size:24px; font-weight:bold; color:#00d9ff; font-family:monospace;">
              <span id="pga-val">0.00</span> <small style="font-size:12px; color:#444;">gal</small>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
