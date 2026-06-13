import { IMAGE_BASE_URL, json_config, cssVar, getRowColor, syncToText, syncEditorHeight } from './app.js';
import { setupDropdowns } from './dropdown.js';
import { redraw } from './orchestra.js';

export { draggedElement, draggedIndex, getEditorMode, switchEditorMode, initEditor, renderEditor }

let draggedElement = null;
let draggedIndex = null;

function getEditorMode() {
  const activeTab = document.querySelector('.tab-btn.active');
  return activeTab ? activeTab.dataset.mode : 'visual';
}

function switchEditorMode(mode) {
  const textEditor = document.getElementById('json-editor');
  const visualEditor = document.getElementById('visual-editor');

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });

  if (mode === 'text') {
    textEditor.style.display = 'block';
    visualEditor.style.display = 'none';
    textEditor.value = JSON.stringify(json_config.currentData, null, 2);
  } else {
    textEditor.style.display = 'none';
    visualEditor.style.display = 'block';
    renderEditor();
    syncEditorHeight();
  }
}

function initEditor() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchEditorMode(btn.dataset.mode));
  });
  switchEditorMode('visual');
}

function createOptionsBar(data) {
  const bar = el('div', 'visual-options-bar');
  
  const toggleOption = (label, key, field) => {
    const btn = el('button', 'toggle-option', { textContent: label });
    btn.classList.toggle('active', data[field]);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      json_config.currentData[field] = !json_config.currentData[field];
      btn.classList.toggle('active');
      syncToText();
      redraw();
    });
    return btn;
  };

  bar.appendChild(toggleOption('Labels', 'show_labels', 'show_labels'));
  bar.appendChild(toggleOption('Row Count', 'show_row_count', 'show_row_count'));
  bar.appendChild(toggleOption('Images', 'use_images', 'use_images'));

  return bar;
}

function renderEditor() {
   const container = document.getElementById('visual-editor');
   const data = json_config.currentData;
   if (!data) return;

   fetchImages();
   container.innerHTML = '';

   const rows = {};
   data.sections.forEach((section, idx) => {
     const rowNum = section.row || 1;
     if (!rows[rowNum]) rows[rowNum] = [];
     rows[rowNum].push({ ...section, _index: idx });
   });

   const maxRow = Math.max(...Object.keys(rows).map(Number), 0);

   container.appendChild(createOptionsBar(data));
   container.appendChild(createTitleSection(data));
   container.appendChild(createDate(data));
   container.appendChild(createConductorSection(data));

  for (let rowNum = 1; rowNum <= maxRow; rowNum++) {
    container.appendChild(createRow(rowNum, rows[rowNum] || []));
  }

  container.appendChild(createButton('add-row-btn', '+ Add Row'));
  container.appendChild(createButton('add-section-btn', '+ Add Section to Row 1'));

  setupDragAndDrop();
  setupEventListeners();
  setupDropdowns();
}

async function fetchImages() {
  if (json_config.availableImages.length > 0) return;

  try {
    const response = await fetch('https://api.github.com/repos/mattigoofy/orchestraMapper/contents/figs');
    if (response.ok) {
      const files = await response.json();
      json_config.availableImages = files
        .filter(f => f.type === 'file' && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.name))
        .map(f => f.name.replace(/\.[^/.]+$/, ''));
    }
  } catch (e) {
    console.log('Could not fetch image list:', e);
  }
}

function el(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'textContent') el.textContent = value;
    else if (key === 'innerHTML') el.innerHTML = value;
    else el.setAttribute(key, value);
  }
  return el;
}

function input(className, type, value, placeholder, attrs = {}) {
  return el('input', className, { type, value, placeholder, ...attrs });
}

function createButton(className, text, title) {
  return el('button', className, { textContent: text, title });
}

function createTitleSection(data) {
  const section = el('div', 'visual-title');
  section.appendChild(el('h4', null, { textContent: 'Title' }));

  const inp = input('title-input', 'text', data.title || 'Orchestra Seating Layout', 'Enter title...');
  inp.addEventListener('change', () => {
    json_config.currentData.title = inp.value;
    syncToText();
    redraw();
  });
  section.appendChild(inp);

  return section;
}

function createDate(data) {
  const section = el('div', 'visual-date');
  section.appendChild(el('h4', null, { textContent: 'Date' }));

  const inp = input('date-input', 'text', data.date || new Date().toLocaleDateString('en-US'), 'Enter date...');
  inp.addEventListener('change', () => {
    json_config.currentData.date = inp.value;
    syncToText();
    redraw();
  });
  section.appendChild(inp);

  return section;
}

function createConductorSection(data) {
  const section = el('div', 'visual-conductor');
  section.style.setProperty('--conductor-color', data.conductor?.color || cssVar('--accent-brown'));
  section.appendChild(el('h4', null, { textContent: 'Conductor' }));

  const row = el('div', 'conductor-row');

  const nameWrapper = el('div', 'conductor-name-wrapper');
  const nameInput = input('conductor-name', 'text', data.conductor?.name || '', 'Name', { autocomplete: 'off' });
  const dropdown = el('div', 'image-dropdown', { id: 'conductor-img-dropdown' });
  nameWrapper.appendChild(nameInput);
  nameWrapper.appendChild(dropdown);

  nameInput.addEventListener('change', () => {
    if (!json_config.currentData.conductor) appStore.currentData.conductor = {};
    json_config.currentData.conductor.name = nameInput.value;
    syncToText();
    redraw();
  });

  const colorInput = input('conductor-color', 'color', data.conductor?.color || cssVar('--accent-brown'));
  colorInput.addEventListener('change', () => {
    if (!json_config.currentData.conductor) appStore.currentData.conductor = {};
    json_config.currentData.conductor.color = colorInput.value;
    section.style.setProperty('--conductor-color', colorInput.value);
    syncToText();
    redraw();
  });

  row.appendChild(nameWrapper);
  row.appendChild(colorInput);
  section.appendChild(row);

  return section;
}

function createRow(rowNum, rowSections) {
  const row = el('div', 'visual-row', { 'data-row-num': rowNum });

  const header = el('div', 'visual-row-header');
  const label = el('span', 'row-label');
  label.appendChild(el('span', null, { textContent: `Row ${rowNum}` }));
  label.appendChild(el('span', null, { textContent: `(${rowSections.length} sections)`, style: 'opacity: 0.7; font-size: 10px;' }));

  const actions = el('span', 'row-actions');
  actions.appendChild(createButton('row-action-btn add-to-row', '+ Section', 'Add section'));

  if (rowNum > 1) {
    const moveUpBtn = createButton('row-action-btn move-row-up', '↑', 'Move row up');
    moveUpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      json_config.currentData.sections.forEach(s => {
        if (s.row === rowNum) s.row = rowNum - 1;
        else if (s.row === rowNum - 1) s.row = rowNum;
      });
      renderEditor();
      syncToText();
      redraw();
    });
    actions.appendChild(moveUpBtn);
  }

  const deleteBtn = createButton('row-action-btn delete-row', '🗑', 'Delete empty row');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (json_config.currentData.sections.some(s => s.row === rowNum)) {
      alert('Remove all sections from this row first.');
      return;
    }
    json_config.currentData.sections.forEach(s => { if (s.row > rowNum) s.row--; });
    renderEditor();
    syncToText();
    redraw();
  });
  actions.appendChild(deleteBtn);

  header.appendChild(label);
  header.appendChild(actions);
  row.appendChild(header);

  const content = el('div', 'visual-row-content', { 'data-row': rowNum });

  if (rowSections.length === 0) {
    content.appendChild(el('div', null, { textContent: 'Drop sections here', style: 'color: var(--text-dark); font-size: 11px; text-align: center; padding: 10px;' }));
  } else {
    rowSections.forEach(section => content.appendChild(createSection(section, rowNum)));
  }

  row.appendChild(content);
  return row;
}

function createSection(section, rowNum) {
  const idx = section._index;
  const sectionEl = el('div', 'visual-section', {
    draggable: 'true',
    'data-index': idx,
    'data-row': rowNum,
    style: `--section-color: ${section.color}`
  });

  const header = el('div', 'visual-section-header');
  header.appendChild(el('span', 'drag-handle', { textContent: '⋮⋮', title: 'Drag to reorder' }));

  const colorInput = input('section-color', 'color', section.color, null, { 'data-idx': idx });
  colorInput.addEventListener('click', e => e.stopPropagation());
  colorInput.addEventListener('change', (e) => {
    e.stopPropagation();
    json_config.currentData.sections[idx].color = colorInput.value;
    sectionEl.style.setProperty('--section-color', colorInput.value);
    syncToText();
    redraw();
  });
  header.appendChild(colorInput);

  const nameWrapper = el('div', 'section-name-wrapper');
  const nameInput = input('section-name-input', 'text', section.name, 'Section name', { 'data-idx': idx, autocomplete: 'off' });
  nameInput.addEventListener('mousedown', e => e.stopPropagation());
  nameInput.addEventListener('change', () => {
    json_config.currentData.sections[idx].name = nameInput.value;
    syncToText();
    redraw();
  });
  nameWrapper.appendChild(nameInput);
  nameWrapper.appendChild(el('div', 'image-dropdown', { id: `img-dropdown-${idx}` }));
  header.appendChild(nameWrapper);

  const removeBtn = createButton('remove-section-btn', '🗑');
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    json_config.currentData.sections.splice(idx, 1);
    renderEditor();
    syncToText();
    redraw();
  });
  header.appendChild(removeBtn);
  sectionEl.appendChild(header);

  const namesContainer = el('div', 'visual-names', { 'data-idx': idx });

  section.names.forEach((name, nameIdx) => {
    const wrapper = el('div', 'name-input-wrapper');
    const nameField = input(`visual-name-input ${name === '' ? 'empty' : ''}`, 'text', name, 'Empty', { 'data-section': idx, 'data-name': nameIdx });
    nameField.addEventListener('mousedown', e => e.stopPropagation());
    nameField.addEventListener('input', () => {
      json_config.currentData.sections[idx].names[nameIdx] = nameField.value;
      nameField.classList.toggle('empty', nameField.value === '');
      syncToText();
      redraw();
    });
    wrapper.appendChild(nameField);

    const removeNameBtn = createButton('remove-name-btn', '🗑', 'Remove');
    removeNameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      json_config.currentData.sections[idx].names.splice(nameIdx, 1);
      renderEditor();
      syncToText();
      redraw();
    });
    wrapper.appendChild(removeNameBtn);
    namesContainer.appendChild(wrapper);
  });

  const addNameBtn = createButton('add-name-btn', '+');
  addNameBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    json_config.currentData.sections[idx].names.push('');
    renderEditor();
    syncToText();
    redraw();
  });
  namesContainer.appendChild(addNameBtn);
  sectionEl.appendChild(namesContainer);

  sectionEl.addEventListener('dragstart', (e) => {
    draggedElement = sectionEl;
    draggedIndex = idx;
    sectionEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx);
  });

  sectionEl.addEventListener('dragend', () => {
    sectionEl.classList.remove('dragging');
    draggedElement = null;
    draggedIndex = null;
  });

  return sectionEl;
}

function setupDragAndDrop() {
  const container = document.getElementById('visual-editor');

  container.querySelectorAll('.visual-row-content').forEach(rowContent => {
    rowContent.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      rowContent.classList.add('drag-over');
    });

    rowContent.addEventListener('dragleave', (e) => {
      if (!rowContent.contains(e.relatedTarget)) rowContent.classList.remove('drag-over');
    });

    rowContent.addEventListener('drop', (e) => {
      e.preventDefault();
      rowContent.classList.remove('drag-over');
      if (!draggedElement) return;

      const fromIndex = draggedIndex;
      const toRow = parseInt(rowContent.dataset.row);
      const currentData = json_config.currentData;
      const oldRow = currentData.sections[fromIndex].row;

      // Calculate insert position from DOM
      const sectionsInTargetRow = Array.from(rowContent.querySelectorAll('.visual-section'));
      let insertAt = sectionsInTargetRow.length;

      const rect = rowContent.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      for (let i = 0; i < sectionsInTargetRow.length; i++) {
        const sectionRect = sectionsInTargetRow[i].getBoundingClientRect();
        if (relativeY < sectionRect.top - rect.top + sectionRect.height / 2) {
          insertAt = i;
          break;
        }
      }

      // Adjust insertAt for same-row moves
      if (oldRow === toRow && fromIndex < insertAt) {
        insertAt--;
      }

      // Remove from old position
      const [movedSection] = currentData.sections.splice(fromIndex, 1);
      movedSection.row = toRow;

      // Calculate new array index
      let newIndex;
      if (oldRow === toRow) {
        // Same row - find position among remaining sections in this row
        if (insertAt >= currentData.sections.filter(s => s.row === toRow).length) {
          newIndex = currentData.sections.reduce((lastIdx, s, idx) => s.row === toRow ? idx : lastIdx, -1) + 1;
        } else {
          let count = 0;
          newIndex = currentData.sections.findIndex((s, idx) => {
            if (s.row === toRow) { if (count === insertAt) return true; count++; }
            return false;
          });
          if (newIndex === -1) newIndex = currentData.sections.length;
        }
      } else {
        // Different row
        let count = 0;
        newIndex = currentData.sections.findIndex((s, idx) => {
          if (s.row === toRow) { if (count === insertAt) return true; count++; }
          return false;
        });
        if (newIndex === -1) {
          newIndex = currentData.sections.reduce((lastIdx, s, idx) => s.row === toRow ? idx : lastIdx, -1) + 1;
        }
      }

      currentData.sections.splice(newIndex, 0, movedSection);
      updateStartIndices();
      renderEditor();
      syncToText();
      redraw();
    });
  });
}

function updateStartIndices() {
  const data = json_config.currentData;
  const rowCounts = {};

  // Count sections per row
  data.sections.forEach(section => {
    rowCounts[section.row] = (rowCounts[section.row] || 0) + 1;
  });

  // Assign start_index based on position within each row
  const rowPositions = {};
  data.sections.forEach(section => {
    const row = section.row;
    if (!rowPositions[row]) rowPositions[row] = 0;
    section.start_index = rowPositions[row];
    rowPositions[row]++;
  });
}

function setupEventListeners() {
  const container = document.getElementById('visual-editor');

  container.querySelectorAll('.add-to-row').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = parseInt(btn.closest('.visual-row').dataset.rowNum);
      json_config.currentData.sections.push({ name: '', color: getRowColor(), row, start_index: 0, names: [''] });
      renderEditor();
      syncToText();
      redraw();
    });
  });

  container.querySelector('.add-row-btn')?.addEventListener('click', () => {
    const rows = [...new Set(json_config.currentData.sections.map(s => s.row))];
    const newRow = (rows.length > 0 ? Math.max(...rows) : 0) + 1;
    json_config.currentData.sections.push({ name: 'New Section', color: getRowColor(), row: newRow, start_index: 0, names: [''] });
    renderEditor();
    syncToText();
    redraw();
  });

  container.querySelector('.add-section-btn')?.addEventListener('click', () => {
    json_config.currentData.sections.push({ name: 'New Section', color: getRowColor(), row: 1, start_index: 0, names: [''] });
    renderEditor();
    syncToText();
    redraw();
  });
}
