export function renderPanel(eew) {
  const panel = document.getElementById('panel') || createPanel();
  panel.innerHTML = `
    <h3>EEW: ${eew.epicenter.lat.toFixed(2)}, ${eew.epicenter.lon.toFixed(2)}</h3>
    <p>Magnitude: ${eew.magnitude}</p>
    <p>Max Intensity: ${eew.maxIntensity}</p>
    <p>${eew.isAssumption ? 'PLUM' : ''}</p>
  `;
}

function createPanel() {
  const panel = document.createElement('div');
  panel.id = 'panel';
  document.body.appendChild(panel);
  return panel;
}
