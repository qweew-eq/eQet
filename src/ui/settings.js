export function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const overlay = document.getElementById('settings-overlay');
    const exitBtn = document.getElementById('exit-door');
    const styleDisplay = document.getElementById('current-style');

    if (!settingsBtn || !overlay) return;

    // 1. Load initial state from LocalStorage
    const savedStyle = localStorage.getItem('markerStyle') || 'fade';
    if (styleDisplay) styleDisplay.innerText = savedStyle.toUpperCase();

    // 2. Open Settings
    settingsBtn.onclick = () => {
        overlay.style.display = 'flex';
    };

    // 3. Toggle Logic (Example: Click the text to toggle style)
    if (styleDisplay) {
        styleDisplay.style.cursor = "pointer";
        styleDisplay.onclick = () => {
            const current = localStorage.getItem('markerStyle') === 'fade' ? 'blink' : 'fade';
            localStorage.setItem('markerStyle', current);
            styleDisplay.innerText = current.toUpperCase();
            console.log(`Marker style changed to: ${current}`);
        };
    }

    // 4. Save and Exit
    exitBtn.onclick = () => {
        overlay.style.display = 'none';
        // Optional: Trigger a map refresh or notification here
    };

    // Close on background click
    overlay.onclick = (e) => {
        if (e.target === overlay) exitBtn.click();
    };
}
