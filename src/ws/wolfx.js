export function connectWolfx(onEEW) {
  const ws = new WebSocket('wss://ws-api.wolfx.jp/all_eew');
  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if(data.type === 'eew') {
        onEEW(normalizeEEW(data));
      }
    } catch(e) { console.error(e); }
  };
}

function normalizeEEW(raw) {
  return {
    originTime: raw.OriginTime,
    epicenter: { lat: raw.Latitude, lon: raw.Longitude },
    magnitude: raw.Magnitude,
    maxIntensity: raw.MaxIntensity,
    isTraining: raw.isTraining,
    isAssumption: raw.isAssumption,
    isFinal: raw.isFinal,
    stations: raw.Stations || [],
    eventID: raw.EventID
  };
}
