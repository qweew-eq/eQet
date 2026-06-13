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
    // FIX: Fetch 15 items instead of 5 so we have enough raw data to extract 
    // 5 distinct earthquakes after removing sequential updates.
    const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=15');
    const data = await res.json();
    
    const uniqueQuakes = [];
    const seenTimes = new Set();

    for (const item of data) {
      // Use the specific origin time of the quake as a unique tracking fingerprint
      const timeKey = item.earthquake?.time || item.id;
      
      if (!seenTimes.has(timeKey)) {
        seenTimes.add(timeKey);
        uniqueQuakes.push(item);
      }
    }

    // Safely store exactly the 5 most recent unique events
    this.historyQuakes = uniqueQuakes.slice(0, 5);
    this.refresh();
  },

  connectP2PWS() {
    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.code === 551) {
        const timeKey = d.earthquake?.time || d.id;
        
        // FIX: Check if this specific earthquake already exists in our list
        const existingIndex = this.historyQuakes.findIndex(
          (eq) => (eq.earthquake?.time || eq.id) === timeKey
        );

        if (existingIndex !== -1) {
          // If it exists, replace the stale card data with the fresh update in-place
          this.historyQuakes[existingIndex] = d;
        } else {
          // If it's a completely new physical event, prepend it to the top
          this.historyQuakes.unshift(d);
        }

        // Maintain the structural layout cap
        this.historyQuakes = this.historyQuakes.slice(0, 5);
        this.refresh();
      }
    };
    ws.onclose = () => setTimeout(() => this.connectP2PWS(), 5000);
  }
};
