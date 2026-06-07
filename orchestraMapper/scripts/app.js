import { redraw, exportToPNG } from './orchestra.js';
import { initEditor, getEditorMode, renderEditor } from './editor.js';
import { initDropdowns } from './dropdown.js';

export { IMAGE_BASE_URL, json_config, cssVar, getRowColor, syncEditorHeight, syncToText};



const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/mattigoofy/orchestraMapper/main/figs/';

const json_config = { currentData: null, availableImages: [] };
window.json_config = json_config;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getRowColor() {
  return cssVar('--accent-blue');
}

function syncEditorHeight() {
  const canvas = document.getElementById('canvas-container');
  const editor = document.getElementById('editor-container');
  if (canvas && editor) {
    editor.style.height = canvas.offsetHeight + 'px';
  }
}

function syncToText() {
  document.getElementById('json-editor').value = JSON.stringify(json_config.currentData, null, 2);
}

function handlePrint() {
  const dataUrl = document.getElementById('orchestra-canvas').toDataURL('image/png');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html><head><title>Orchestra Layout</title>
    <style>@media print { body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; } img { max-width: 100%; max-height: 100vh; object-fit: contain; } }</style>
    </head><body><img src="${dataUrl}" onload="window.print(); window.close();"></body></html>
  `);
  printWindow.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  initDropdowns();

  // Load data, then render editor
  fetch('./orchestra.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      json_config.currentData = data;
      syncToText();
      renderEditor();
      redraw();
    })
    .catch(err => console.error('Error loading orchestra data:', err));

  window.addEventListener('resize', syncEditorHeight);

  document.getElementById('apply-btn').addEventListener('click', () => {
    if (getEditorMode() === 'visual') {
      redraw();
    } else {
      try {
        json_config.currentData = JSON.parse(document.getElementById('json-editor').value);
        redraw();
      } catch (err) {
        alert('Error parsing JSON: ' + err.message);
      }
    }
  });

  document.getElementById('show-labels').addEventListener('change', redraw);
  document.getElementById('show-counts').addEventListener('change', redraw);
  document.getElementById('use-images').addEventListener('change', redraw);
  document.getElementById('export-btn').addEventListener('click', () => exportToPNG('orchestra-canvas', 'orchestra.png'));
  document.getElementById('print-btn').addEventListener('click', handlePrint);
});
