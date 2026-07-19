import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';

export const eewManager = {
  activeEEW: null,
  historyQuakes: [],
  expiryTime: null,

  async start(map) {
    await this.fetchEqHistory();

    connectWolfx((data) => {
      if (data.is_cancel || data.isCancel) {
        this.activeEEW = null;
        this.expiryTime = null;
      } else {
        this.activeEEW = data;
        this.expiryTime = (data.is_final || data.isFinal) ? Date.now() + 300000 : null;
      }
      this.refresh();
    });

    this.connectP2PWS();
  },

  triggerMock() {
    this.activeEEW = {
      title: "MOCK TEST",
      hypocenter: { name: "Tokyo Bay" },
      magnitude: 5.2,
      depth: "10km",
      intensity: "5-",
      is_final: false
    };
    this.refresh();
  },

  refresh() {
    updatePanel(this.getActiveDisplay(), this.historyQuakes);
  },

  getActiveDisplay() {
    if (this.expiryTime && Date.now() > this.expiryTime) this.activeEEW = null;
    return this.activeEEW;
  },

  async fetchEqHistory() {
    const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=15');
    const data = await res.json();
    
    const uniqueQuakes = [];
    const seenTimes = new Set();

    for (const item of data) {
      const timeKey = item.earthquake?.time || item.id;
      if (!seenTimes.has(timeKey)) {
        seenTimes.add(timeKey);
        uniqueQuakes.push(item);
      }
    }

    this.historyQuakes = uniqueQuakes.slice(0, 5);
    this.refresh();
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.code === 551) {
        const timeKey = d.earthquake?.time || d.id;
        const existingIndex = this.historyQuakes.findIndex(
          (eq) => (eq.earthquake?.time || eq.id) === timeKey
        );

        if (existingIndex !== -1) {
          this.historyQuakes[existingIndex] = d;
        } else {
          this.historyQuakes.unshift(d);
        }

        this.historyQuakes = this.historyQuakes.slice(0, 5);
        this.refresh();
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
