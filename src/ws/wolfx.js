import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';
import { AudioPlayer } from '../ui/alerts.js';

export const eewManager = {
  activeEEWs: [],

  async start(map) {
    await this.fetchHistory(map);

    connectWolfx((eew) => {
      if (eew.isCancel) {
        this.activeEEWs = [];
      } else {
        this.activeEEWs = [eew];
      }

      updatePanel(eew);
      updateEpicenter(eew, map);
      AudioPlayer(eew);
      
      // Don't autoPan if it's a cancellation (marker handles zoom out)
      if (!eew.isCancel) autoPan(map, eew);
    });
  },

  async fetchHistory(map) {
    try {
      const res = await fetch('https://api.wolfx.jp/jma_eew.json');
      const data = await res.json();
      if (data) updatePanel(data);
      autoPan(map, null); // Start overview
    } catch (e) { autoPan(map, null); }
  }
};
