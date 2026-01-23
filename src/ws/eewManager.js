import { connectWolfx } from './wolfx.js';
import { updatePanel } from '../ui/panel.js';
import { updateEpicenter } from '../map/marker.js';
import { autoPan } from '../map/autopan.js';
import { AudioPlayer } from '../ui/alerts.js';

export const eewManager = {
  activeEEWs: [],

  async start(map) {
    // 1. First, get the history (past earthquakes)
    await this.fetchHistory(map);

    // 2. Then, listen for live updates
    connectWolfx((eew) => {
      // Manage the list of active earthquakes
      if (eew.isCancel) {
        // If cancelled, clear the active list
        this.activeEEWs = [];
      } else {
        // Otherwise, track the current one for animations
        this.activeEEWs = [eew];
      }

      // 3. Trigger all the visual and audio updates
      updatePanel(eew);      // Updates the sidebar text/pills
      updateEpicenter(eew, map); // Updates the Red X / Cancel Cross
      AudioPlayer(eew);      // Plays the sounds (including cancel chain)
      
      // 4. Handle Camera: Pan to quake only if NOT a cancellation
      // (The marker script handles the zoom-out for cancellations)
      if (!eew.isCancel) {
        autoPan(map, eew);
      }
    });
  },

  async fetchHistory(map) {
    try {
      const response = await fetch('https://api.wolfx.jp/jma_eew.json');
      const data = await response.json();
      if (data) {
        updatePanel(data);
      }
      // On startup, show the whole map of Japan
      autoPan(map, null);
    } catch (err) {
      console.error("eQet: History fetch failed", err);
      autoPan(map, null);
    }
  }
};
