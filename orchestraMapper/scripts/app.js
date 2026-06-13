import { redraw, exportToPNG } from './orchestra.js';
import { initEditor, getEditorMode, renderEditor } from './editor.js';
import { initDropdowns } from './dropdown.js';

export { image_base_url, json_config, cssVar, getRowColor, syncEditorHeight, syncToText};



const IMAGE_BASE_URL_FALLBACK = 'https://raw.githubusercontent.com/mattigoofy/orchestraMapper/main/figs/';
let image_base_url = IMAGE_BASE_URL_FALLBACK;

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

async function handlePrint(canvasId) {
  const canvas = document.getElementById(canvasId);
  
  // Redraw without background
  await redraw(true);
  
  const dataUrl = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank');

  redraw();

  printWindow.document.write(`
    <html><head><title>&#8203;</title>
    <style>
      @page { margin: 0; size: auto; }
      @media print { 
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        img { max-width: 100%; max-height: 100vh; object-fit: contain; }
      }
    </style>
    </head><body><img src="${dataUrl}" onload="window.print(); window.close();"></body></html>
  `);
  printWindow.document.close();
}

function handleShare() {
  let url = location.origin + location.pathname;
  let params = "?json=" + encodeURIComponent(JSON.stringify(window.json_config.currentData));
  let fullUrl = url + params;

  navigator.clipboard.writeText(fullUrl).then(() => {
    // Option 1: simple toast (add CSS yourself)
    const toast = document.createElement('div');
    toast.textContent = '🔗 URL copied!';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:8px 16px;border-radius:6px;z-index:9999';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  });

  return fullUrl;
}

document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  initDropdowns();

  let url_params = new URLSearchParams(location.search);
  if (url_params.size > 0 && url_params.get('json') != null) {
    console.log(url_params.get('json'));
    window.json_config.currentData = JSON.parse(url_params.get('json'))
    syncToText();
    renderEditor();
    redraw();

  } else {
    // Load data, then render editor
    fetch('./orchestra.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        json_config.currentData = data;
        image_base_url = data.image_url ?? IMAGE_BASE_URL_FALLBACK;
        syncToText();
        renderEditor();
        redraw();
      })
      .catch(err => console.error('Error loading orchestra data:', err));
  }

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

  document.getElementById('export-btn').addEventListener('click', () => exportToPNG('orchestra-canvas', 'orchestra.png'));
  document.getElementById('print-btn').addEventListener('click', () => handlePrint('orchestra-canvas'));
  document.getElementById('share-btn').addEventListener('click', () => handleShare());
});
