import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';
import { tsunamiManager } from './tsunamiManager.js';

export const eewManager = {
  activeEEWs: [], // Essential for waveAnimation in main.js
  historyQuakes: [],

  async start(map) {
    // 1. Initial Fetch: Get last 4 confirmed quakes
    await this.fetchEqHistory();

    // 2. Start Live EEW Feed (Wolfx)
    connectWolfx((eew) => {
      if (eew.isCancel) {
        this.activeEEWs = [];
      } else {
        this.activeEEWs = [eew];
      }

      // Update UI & Map
      updatePanel(eew, this.historyQuakes);
      updateEpicenter(eew, map);
      if (!eew.isCancel) autoPan(map, eew);
    });

    // 3. Start Live Confirmed & Tsunami Feed (P2PQuake)
    this.connectP2PWS();
  },

  async fetchEqHistory() {
    try {
      const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=4');
      this.historyQuakes = await res.json();
      // Render panel immediately with history data
      updatePanel(null, this.historyQuakes);
    } catch (e) {
      console.error("P2P History fetch failed", e);
    }
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // 551: Confirmed Earthquake Info
      if (data.code === 551) {
        this.historyQuakes.unshift(data);
        this.historyQuakes = this.historyQuakes.slice(0, 4);
        const currentEEW = this.activeEEWs.length > 0 ? this.activeEEWs[0] : null;
        updatePanel(currentEEW, this.historyQuakes);
      } 
      // 552: Tsunami Notice
      else if (data.code === 552) {
        tsunamiManager.handleTsunami(data);
      }
    };

    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
