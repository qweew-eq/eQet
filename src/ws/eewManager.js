// src/ws/eewManager.js
import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';

export const eewManager = {
  activeEEWs: [],

  async start(map) {
    // 1. Get History first
    await this.fetchHistory(map);

    // 2. Start Live Feed
    connectWolfx((eew) => {
      console.log("New EEW Received:", eew);
      
      if (eew.isCancel) {
        this.activeEEWs = [];
      } else {
        this.activeEEWs = [eew];
      }

      // Update everything
      updatePanel(eew);
      updateEpicenter(eew, map);
      
      if (!eew.isCancel) {
        autoPan(map, eew);
      }
    });
  },

  async fetchHistory(map) {
    try {
      const res = await fetch('https://api.wolfx.jp/jma_eew.json');
      const data = await res.json();
      if (data) updatePanel(data);
    } catch (e) {
      console.error("History fetch failed", e);
    }
  }
};
