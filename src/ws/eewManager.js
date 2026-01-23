import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';
import { tsunamiManager } from './tsunamiManager.js';

export const eewManager = {
  historyQuakes: [],

  async start(map) {
    // 1. Fetch confirmed history (Last 4) from P2PQuake
    await this.fetchEqHistory();

    // 2. Start Live EEW Feed (Wolfx)
    connectWolfx((eew) => {
      updatePanel(eew, this.historyQuakes);
      updateEpicenter(eew, map);
      if (!eew.isCancel) autoPan(map, eew);
    });

    // 3. Start Live P2P Feed (Tsunami & Confirmed Updates)
    this.connectP2PWS();
  },

  async fetchEqHistory() {
    try {
      const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=4');
      this.historyQuakes = await res.json();
      updatePanel(null, this.historyQuakes);
    } catch (e) {
      console.error("P2P History fetch failed", e);
    }
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.code === 551) {
        // Update history list when a confirmed quake arrives
        this.historyQuakes.unshift(data);
        this.historyQuakes = this.historyQuakes.slice(0, 4);
        updatePanel(null, this.historyQuakes);
      } else if (data.code === 552) {
        // Handle Tsunami notices
        tsunamiManager.handleTsunami(data);
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
