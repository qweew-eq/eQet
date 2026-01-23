// src/ws/wolfx.js

export function connectWolfx(onMessage) {
    const ws = new WebSocket('wss://ws-api.wolfx.jp/jma_eew');

    ws.onopen = () => {
        console.log('Connected to Wolfx EEW');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Filter for JMA EEW messages
        if (data.type === 'jma_eew' || data.Type === 'jma_eew') {
            onMessage(data);
        }
    };

    ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
    };

    ws.onclose = () => {
        console.log('Disconnected. Reconnecting...');
        setTimeout(() => connectWolfx(onMessage), 5000);
    };
}

