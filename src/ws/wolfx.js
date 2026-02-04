// src/ws/wolfx.js
export function connectWolfx(onMessage) {
    const ws = new WebSocket('wss://ws-api.wolfx.jp/jma_eew');
    const statusText = document.getElementById('server-status');

    ws.onopen = () => { if (statusText) statusText.innerText = "受信サーバー接続中"; };
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'jma_eew') onMessage(data);
    };
    ws.onclose = () => {
        if (statusText) statusText.innerText = "接続再試行中...";
        setTimeout(() => connectWolfx(onMessage), 5000);
    };
}
