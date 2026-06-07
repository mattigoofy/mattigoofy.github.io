// ============================================================
// EXPORTS / IMPORTS 
// ============================================================
import { IMAGE_BASE_URL } from './app.js';

export { redraw, generatePositions, drawOrchestra, exportToPNG };

// ============================================================
// MATH HELPERS
// ============================================================
function linspace(start, stop, num) {
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + i * step);
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}


// ============================================================
// IMAGE UTILS
// ============================================================
function getImageUrl(sectionName) {
  const nameLower = sectionName.toLowerCase().replace(/ /g, '_');
  return `${IMAGE_BASE_URL}${nameLower}.png`;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

function drawImage(ctx, img, cx, cy, targetSize) {
  const aspectRatio = img.width / img.height;
  let w, h;
  if (aspectRatio > 1) {
    w = targetSize;
    h = w / aspectRatio;
  } else {
    h = targetSize;
    w = h * aspectRatio;
  }
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  return { w, h };
}


// ============================================================
// DATA PROCESSING
// ============================================================
function generatePositions(sections, rowBaseRadius = 1.2, rowSpacing = 0.7) {
  const rowGroups = {};
  for (const section of sections) {
    if (!rowGroups[section.row]) rowGroups[section.row] = [];
    rowGroups[section.row].push(section);
  }

  const allMusicians = [];
  const sectionInfo = {};
  const rowInfo = {};

  const sortedRowNums = Object.keys(rowGroups).map(Number).sort((a, b) => a - b);

  for (const rowNum of sortedRowNums) {
    const rowSections = rowGroups[rowNum].sort((a, b) => a.start_index - b.start_index);
    const rowNames = rowSections.flatMap(s => s.names);
    const nRow = rowNames.length;
    const radius = rowBaseRadius + (rowNum - 1) * rowSpacing;
    const angles = nRow === 1 ? [Math.PI / 2] : linspace(0, Math.PI, nRow);

    const sectionsInRow = {};
    let idx = 0;

    for (const section of rowSections) {
      const n = section.names.length;
      sectionsInRow[section.name] = angles.slice(idx, idx + n);

      for (let i = 0; i < n; i++) {
        const angle = angles[idx + i];
        allMusicians.push({
          name: section.names[i],
          section: section.name,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          color: section.color,
          visible: section.names[i].trim() !== ''
        });
      }
      idx += n;
    }

    for (const [name, sectAngles] of Object.entries(sectionsInRow)) {
      sectionInfo[name] = { angle: mean(sectAngles), radius };
    }
    rowInfo[rowNum] = { radius, angles };
  }

  return { allMusicians, sectionInfo, rowInfo };
}


// ============================================================
// CANVAS SETUP
// ============================================================
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const qualityMultiplier = 2;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr * qualityMultiplier;
  canvas.height = h * dpr * qualityMultiplier;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr * qualityMultiplier, dpr * qualityMultiplier);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { ctx, w, h };
}

function computeLayout(rowInfo, displayWidth, displayHeight) {
  const maxRadius = Math.max(...Object.values(rowInfo).map(r => r.radius));
  const paddingX = displayWidth * 0.01;
  const paddingY = displayHeight * 0.01;
  const availW = displayWidth - paddingX * 2;
  const availH = displayHeight - paddingY * 2;
  const scale = Math.min(availW, availH) / (maxRadius * 1.5);
  const centerX = displayWidth / 2;
  const centerY = displayHeight / 2 + maxRadius * scale * 0.5;

  return {
    scale,
    centerX,
    centerY,
    toCanvasX: (x) => centerX + x * scale,
    toCanvasY: (y) => centerY - y * scale
  };
}


// ============================================================
// DRAWING
// ============================================================
function drawRowArcs(ctx, rowInfo, layout) {
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#d5d8dc';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;

  for (const info of Object.values(rowInfo)) {
    ctx.beginPath();
    ctx.arc(layout.centerX, layout.centerY, info.radius * layout.scale, Math.PI, 0, false);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawMusician(ctx, m, useImages, imageCache, iconRadius, fontSize, layout) {
  if (!m.visible) return;

  const x = layout.toCanvasX(m.x);
  const y = layout.toCanvasY(m.y);
  let labelY;

  if (useImages && imageCache[m.section]) {
    const { h } = drawImage(ctx, imageCache[m.section], x, y, iconRadius * 2);
    labelY = y + h / 2 + 12;
  } else {
    ctx.beginPath();
    ctx.arc(x, y, iconRadius, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    labelY = y + iconRadius + 10;
  }

  const nameFontSize = Math.max(7, fontSize * 1.1);
  ctx.font = `bold ${nameFontSize}px sans-serif`;
  ctx.fillStyle = '#2c3e50';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(2, nameFontSize * 0.2);
  ctx.strokeText(m.name, x, labelY);
  ctx.fillText(m.name, x, labelY);
}

function drawSectionLabels(ctx, sectionInfo, sectionColors, fontSize, layout, rowInfo, iconRadius, useImages) {
  for (const [name, info] of Object.entries(sectionInfo)) {
    const angle = info.angle;
    const radius = info.radius + 0.35;
    const lx = layout.toCanvasX(radius * Math.cos(angle));
    const ly = layout.toCanvasY(radius * Math.sin(angle));
    const color = sectionColors[name] || '#bdc3c7';
    const labelFontSize = Math.max(8, fontSize);

    ctx.font = `bold ${labelFontSize}px sans-serif`;
    const textWidth = ctx.measureText(name).width;
    const pad = labelFontSize * 0.7;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.95;
    roundRect(ctx, lx - textWidth / 2 - pad, ly - labelFontSize / 2 - pad * 0.6, textWidth + pad * 2, labelFontSize + pad * 1.2, 5);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, lx, ly);
  }
}

function drawConductor(ctx, conductorConfig, useImages, imageCache, iconRadius, fontSize, layout) {
  const name = conductorConfig.name || 'Conductor';
  const color = conductorConfig.color || '#8b4513';
  const squareSize = iconRadius * 0.8;
  const imgSize = iconRadius * 2.5;
  const imgName = conductorConfig.image_name || 'conductor';
  const cx = layout.centerX;
  const cy = layout.toCanvasY(-0.3);

  if (useImages && imageCache[imgName]) {
    const { h } = drawImage(ctx, imageCache[imgName], cx, cy, imgSize * 2);
    const labelFontSize = Math.max(7, fontSize * 1.1);
    ctx.font = `bold ${labelFontSize}px sans-serif`;
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(name, cx, cy + h / 2 + labelFontSize * 0.5);
  } else {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.rect(cx - squareSize, cy - squareSize, squareSize * 2, squareSize * 2);
    ctx.fill();
    ctx.stroke();

    const labelFontSize = Math.max(7, fontSize * 1.1);
    ctx.font = `bold ${labelFontSize}px sans-serif`;
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(name, cx, cy + squareSize + labelFontSize * 0.5);
  }
}

function drawLegend(ctx, rowCounts, fontSize) {
  const x = 10;
  let y = 20;
  const legendFontSize = Math.max(6, fontSize * 1.2);
  const lineHeight = legendFontSize + 10;

  ctx.font = `${legendFontSize}px sans-serif`;

  for (const rowNum of Object.keys(rowCounts).map(Number).sort((a, b) => a - b)) {
    const text = `Row ${rowNum}: ${rowCounts[rowNum]} musicians`;
    const textWidth = ctx.measureText(text).width;
    const pad = legendFontSize * 0.5;

    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.9;
    roundRect(ctx, x, y - 2, textWidth + pad * 2, legendFontSize + pad, 4);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#d5d8dc';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#5d6d7e';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x + pad, y);
    y += lineHeight;
  }
}

function drawTitle(ctx, title, fontSize, centerX) {
  const titleFontSize = Math.max(10, fontSize + 15);
  ctx.font = `bold ${titleFontSize}px sans-serif`;
  ctx.fillStyle = '#2c3e50';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(title, centerX, titleFontSize * 0.5);
}

function drawWatermark(ctx, displayWidth, displayHeight) {
  const lines = [
    'Muziekvereniging',
    'Sint Cecilia Steenbrugge',
    'https://www.ceciliasteenbrugge.be'
  ];
  const fontSize = 11;
  const lineHeight = 14;
  const padding = 12;

  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = '#666';

  const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
  const totalHeight = lines.length * lineHeight;
  const boxWidth = maxWidth + padding * 2;
  const boxHeight = totalHeight + padding * 1.5;

  const x = displayWidth - boxWidth;
  const y = displayHeight - boxHeight;

  ctx.fillStyle = '#f8f9fa';
  roundRect(ctx, x, y, boxWidth, boxHeight, 4);
  ctx.fill();

  ctx.fillStyle = '#555';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, x + padding, y + padding + i * lineHeight);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}


// ============================================================
// MAIN DRAW FUNCTION
// ============================================================
async function drawOrchestra(canvas, musicians, sectionInfo, rowInfo, config, showLabels = false, showRowCounts = false, useImages = false, title = 'Orchestra Seating Layout') {
  const { ctx, w: displayWidth, h: displayHeight } = setupCanvas(canvas);
  const layout = computeLayout(rowInfo, displayWidth, displayHeight);
  const fontSize = config.font_size || 9;
  const iconRadius = 25;

  const conductorConfig = config.conductor || {};
  const sectionColors = {};
  for (const m of musicians) sectionColors[m.section] = m.color;

  const visibleMusicians = musicians.filter(m => m.visible);
  const rowCounts = {};
  for (const m of visibleMusicians) {
    const dist = Math.sqrt(m.x ** 2 + m.y ** 2);
    const closestRow = Object.keys(rowInfo).map(Number).reduce((a, b) =>
      Math.abs(rowInfo[a].radius - dist) < Math.abs(rowInfo[b].radius - dist) ? a : b
    );
    rowCounts[closestRow] = (rowCounts[closestRow] || 0) + 1;
  }

  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, displayWidth, displayHeight);

  drawRowArcs(ctx, rowInfo, layout);

  const imageCache = {};
  if (useImages) {
    const sections = [...new Set(musicians.map(m => m.section))];
    const conductorImgName = conductorConfig.image_name || 'conductor';
    const allSections = [...sections, conductorImgName];

    await Promise.all(allSections.map(async (name) => {
      try {
        imageCache[name] = await loadImage(getImageUrl(name));
      } catch (e) {
        console.log(`No image found for: ${name}`);
      }
    }));
  }

  for (const m of musicians) {
    drawMusician(ctx, m, useImages, imageCache, iconRadius, fontSize, layout);
  }

  if (showLabels) {
    drawSectionLabels(ctx, sectionInfo, sectionColors, fontSize, layout, rowInfo, iconRadius, useImages);
  }

  drawConductor(ctx, conductorConfig, useImages, imageCache, iconRadius, fontSize, layout);

  if (showRowCounts) {
    drawLegend(ctx, rowCounts, fontSize);
  }

  drawTitle(ctx, title, fontSize, layout.centerX);
  drawWatermark(ctx, displayWidth, displayHeight);
}


// ============================================================
// PUBLIC API
// ============================================================
function exportToPNG(canvasId, filename = 'orchestra.png') {
  const canvas = document.getElementById(canvasId);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function redraw() {
  const data = window.json_config?.currentData;
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
