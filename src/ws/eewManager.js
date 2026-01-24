import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';
import { tsunamiManager } from './tsunamiManager.js';

export const eewManager = {
  activeEEWs: [], 
  historyQuakes: [],

  async start(map) {
    await this.fetchEqHistory();

    connectWolfx((eew) => {
      this.activeEEWs = eew.isCancel ? [] : [eew];
      updatePanel(eew, this.historyQuakes);
      updateEpicenter(eew, map);
      if (!eew.isCancel) autoPan(map, eew);
    });

    this.connectP2PWS();
  },

  async fetchEqHistory() {
    try {
      const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=4');
      this.historyQuakes = await res.json();
      updatePanel(null, this.historyQuakes);
    } catch (e) {
      updatePanel(null, []);
    }
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.code === 551) {
        this.historyQuakes.unshift(data);
        this.historyQuakes = this.historyQuakes.slice(0, 4);
        updatePanel(this.activeEEWs[0] || null, this.historyQuakes);
      } else if (data.code === 552) {
        tsunamiManager.handleTsunami(data);
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
