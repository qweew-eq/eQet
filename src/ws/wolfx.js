export function connectWolfx(onEEW) {
  const ws = new WebSocket('wss://ws-api.wolfx.jp/all_eew');
  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      // Wolfx usually sends 'eew' or 'jma_eew'
      if (data.type === 'eew' || data.type === 'jma_eew') {
        onEEW(data); // Pass the raw data so the names match your other files
      }
    } catch (e) {
      console.error(e);
    }
  };
}
