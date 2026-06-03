// ============================================================
// STATE
// ============================================================
const appStore = { currentData: null };
window.appStore = appStore;


// ============================================================
// REDRAW
// ============================================================
function redraw() {
  const data = appStore.currentData;
  if (!data) return;

  const { allMusicians, sectionInfo, rowInfo } = generatePositions(data.sections);
  const canvas = document.getElementById('orchestra-canvas');
  const showLabels = document.getElementById('show-labels').checked;
  const showCounts = document.getElementById('show-counts').checked;
  const useImages = document.getElementById('use-images').checked;

  document.fonts.ready.then(() => {
    drawOrchestra(
      canvas, allMusicians, sectionInfo, rowInfo, data,
      showLabels, showCounts, useImages,
      data.title || 'Orchestra Seating Layout'
    );
  });
}


// ============================================================
// EVENT LISTENERS
// ============================================================
document.getElementById('apply-btn').addEventListener('click', function() {
  const jsonText = document.getElementById('json-editor').value;
  try {
    appStore.currentData = JSON.parse(jsonText);
    redraw();
  } catch (err) {
    alert('Error parsing JSON: ' + err.message);
  }
});

document.getElementById('show-labels').addEventListener('change', redraw);
document.getElementById('show-counts').addEventListener('change', redraw);
document.getElementById('use-images').addEventListener('change', redraw);

document.getElementById('export-btn').addEventListener('click', function() {
  exportToPNG('orchestra-canvas', 'orchestra.png');
});

document.getElementById('print-btn').addEventListener('click', function() {
  const canvas = document.getElementById('orchestra-canvas');
  const dataUrl = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Orchestra Layout</title>
        <style>
          @media print {
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.print(); window.close();">
      </body>
    </html>
  `);
  printWindow.document.close();
});


// ============================================================
// INITIAL LOAD
// ============================================================
const jsonPath = './orchestra.json';

fetch(jsonPath)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => {
    appStore.currentData = data;
    document.getElementById('json-editor').value = JSON.stringify(data, null, 2);
    redraw();
  })
  .catch(err => console.error('Error loading orchestra data:', err));
