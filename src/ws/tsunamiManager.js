// src/ws/tsunamiManager.js

export const tsunamiManager = {
  currentTsunami: null,

  handleTsunami(data) {
    // Check if message is a Tsunami Notice (Code 552)
    if (data.code !== 552) return;

    console.log("Tsunami data received:", data);
    this.currentTsunami = data;
    
    this.playTsunamiAudio(data);
    this.updateUI(data);
  },

  playTsunamiAudio(data) {
    const areas = data.areas || [];
    // Extract grades: MajorTsunamiWarning, TsunamiWarning, TsunamiAdvisory, TsunamiForecast
    const grades = areas.map(a => a.grade);

    if (grades.includes('MajorTsunamiWarning')) {
      new Audio('/sounds/tsunamimajor.wav').play().catch(e => console.error(e));
    } else if (grades.includes('TsunamiWarning')) {
      new Audio('/sounds/tsunamiwarn.wav').play().catch(e => console.error(e));
    } else if (grades.includes('TsunamiAdvisory')) {
      new Audio('/sounds/tsunamiadvisory.wav').play().catch(e => console.error(e));
    } else if (grades.includes('TsunamiForecast')) {
      new Audio('/sounds/tsunamiforecast.wav').play().catch(e => console.error(e));
    }
  },

  updateUI(data) {
    const statusLog = document.getElementById('status-log');
    if (statusLog) {
      statusLog.innerHTML = `
        <div style="color: #ff00ff; font-weight: bold; margin-top: 10px; border: 1px solid #ff00ff; padding: 5px; text-align: center; border-radius: 4px;">
           津波警報・注意報 発表中
        </div>
      `;
    }

    // Automatically highlight the Wave icon in the sidebar
    const waveIcon = document.querySelector('img[alt="Wave"]');
    if (waveIcon) {
      const allIcons = document.querySelectorAll('.side-icon');
      allIcons.forEach(i => i.classList.remove('active-icon'));
      waveIcon.classList.add('active-icon');
    }
  }
};
