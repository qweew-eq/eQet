// src/ws/eewManager.js
import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';

export const eewManager = {
  activeEEW: null,
  historyQuakes: [],
  expiryTime: null,

  async start(map) {
    await this.fetchEqHistory();

    // Wolfx: EEW (Strings: "5-", "6+")
    connectWolfx((data) => {
      if (data.is_cancel || data.isCancel) {
        this.activeEEW = null;
        this.expiryTime = null;
      } else {
        this.activeEEW = data;
        // Keep Final reports on screen for 5 mins
        this.expiryTime = (data.is_final || data.isFinal) ? Date.now() + 300000 : null;
      }
      this.refresh();
    });

    this.connectP2PWS();
  },

  refresh() {
    updatePanel(this.getActiveDisplay(), this.historyQuakes);
  },

  getActiveDisplay() {
    if (this.expiryTime && Date.now() > this.expiryTime) this.activeEEW = null;
    return this.activeEEW;
  },

  async fetchEqHistory() {
    const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=5');
    this.historyQuakes = await res.json();
    this.refresh();
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.code === 551) {
        this.historyQuakes.unshift(d);
        this.historyQuakes = this.historyQuakes.slice(0, 5);
        this.refresh();
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
