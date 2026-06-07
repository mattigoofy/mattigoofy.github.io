import { json_config, IMAGE_BASE_URL } from './app.js';

export { initDropdowns, setupDropdowns };

function initDropdowns() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.section-name-wrapper') && !e.target.closest('.conductor-name-wrapper')) {
      document.querySelectorAll('.image-dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

function setupDropdowns() {
  const images = json_config.availableImages;

  document.querySelectorAll('.section-name-input').forEach(input => {
    const dropdown = input.closest('.section-name-wrapper').querySelector('.image-dropdown');
    dropdown.remove();
    document.body.appendChild(dropdown);

    const open = () => {
      renderDropdown(dropdown, images, input.value, input);
      positionDropdown(input, dropdown);
      dropdown.classList.add('open');
    };

    input.addEventListener('focus', open);
    input.addEventListener('click', open);
    input.addEventListener('input', open);
    input.addEventListener('blur', () => setTimeout(() => {
      if (!dropdown.contains(document.activeElement) && !dropdown.matches(':hover')) {
        dropdown.classList.remove('open');
      }
    }, 200));
    input.addEventListener('mousedown', e => e.stopPropagation());

    window.addEventListener('scroll', () => {
      if (dropdown.classList.contains('open')) positionDropdown(input, dropdown);
    }, true);
  });

  const conductorInput = document.querySelector('.conductor-name');
  if (conductorInput) {
    const dropdown = conductorInput.closest('.conductor-name-wrapper').querySelector('.image-dropdown');
    dropdown.remove();
    document.body.appendChild(dropdown);

    const open = () => {
      renderDropdown(dropdown, ['Conductor', ...images], conductorInput.value, conductorInput);
      positionDropdown(conductorInput, dropdown);
      dropdown.classList.add('open');
    };

    conductorInput.addEventListener('focus', open);
    conductorInput.addEventListener('click', open);
    conductorInput.addEventListener('input', open);
    conductorInput.addEventListener('blur', () => setTimeout(() => {
      if (!dropdown.contains(document.activeElement) && !dropdown.matches(':hover')) {
        dropdown.classList.remove('open');
      }
    }, 200));

    window.addEventListener('scroll', () => {
      if (dropdown.classList.contains('open')) positionDropdown(conductorInput, dropdown);
    }, true);
  }
}

function formatImageName(imgName) {
  return imgName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function positionDropdown(input, dropdown) {
  const rect = input.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + window.scrollY}px`;
  dropdown.style.left = `${rect.left + window.scrollX}px`;
  dropdown.style.width = `${rect.width}px`;
}

function renderDropdown(dropdown, images, filter, input) {
  const filtered = images.filter(img => img.toLowerCase().includes(filter.toLowerCase()));
  dropdown.innerHTML = '';

  if (filtered.length === 0) {
    dropdown.innerHTML = '<div class="image-dropdown-empty">No images found</div>';
    return;
  }

  filtered.forEach(img => {
    const imgUrl = `${IMAGE_BASE_URL}${img.toLowerCase().replace(/ /g, '_')}.png`;
    const displayName = formatImageName(img);

    const item = document.createElement('div');
    item.className = 'image-dropdown-item';
    item.dataset.value = displayName;

    const imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.alt = displayName;
    imgEl.onerror = () => imgEl.style.display = 'none';
    item.appendChild(imgEl);

    const span = document.createElement('span');
    span.textContent = displayName;
    item.appendChild(span);

    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      input.value = displayName;
      dropdown.classList.remove('open');
      input.focus();
      input.dispatchEvent(new Event('change'));
    });

    dropdown.appendChild(item);
  });
}
