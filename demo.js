'use strict';
const $ = (selector) => document.querySelector(selector);
const presets = {
  button: { tag: 'button', base: 'xiv-button', variants: ['', 'primary', 'ghost', 'danger', 'small'], label: 'Accept quest' },
  panel: { tag: 'section', base: 'xiv-panel', variants: ['', 'parchment', 'glass'], label: 'Your next adventure awaits.' },
  input: { tag: 'input', base: 'xiv-input', variants: [''], label: 'Warrior of Light' },
  badge: { tag: 'span', base: 'xiv-badge', variants: ['', 'blue', 'green', 'red'], label: 'Main scenario' },
  notice: { tag: 'div', base: 'xiv-notice', variants: ['', 'quest'], label: 'Your party is ready. A new duty awaits.' },
  checkbox: { tag: 'label', base: 'xiv-check', variants: [''], label: 'Join party in progress' },
  progress: { tag: 'progress', base: 'xiv-progress', variants: ['exp', 'hp', 'mp'], label: 'Experience' }
};
let toastTimer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
}
function setVariant() {
  const p = presets[$('#element').value];
  $('#classes').value = p.base + ($('#variant').value ? ` ${p.base}--${$('#variant').value}` : '');
  render();
}
function setElement() {
  const p = presets[$('#element').value];
  $('#variant').replaceChildren(...p.variants.map(value => new Option(value ? value[0].toUpperCase() + value.slice(1) : 'Default', value)));
  $('#label').value = p.label;
  $('#disabled').disabled = !['button', 'input', 'checkbox'].includes($('#element').value);
  $('#disabled').checked = false;
  setVariant();
}
function render() {
  const type = $('#element').value;
  const p = presets[type];
  const node = document.createElement(p.tag);
  node.className = $('#classes').value;
  if (type === 'input') {
    node.type = 'text'; node.placeholder = $('#label').value; node.setAttribute('aria-label', 'Preview text input');
  } else if (type === 'checkbox') {
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = true; input.setAttribute('checked', ''); input.disabled = $('#disabled').checked;
    node.append(input, document.createTextNode(` ${$('#label').value}`));
  } else if (type === 'progress') {
    node.max = 100; node.value = 68; node.textContent = '68%'; node.setAttribute('aria-label', $('#label').value);
  } else { node.textContent = $('#label').value; }
  if (['input', 'button'].includes(type)) node.disabled = $('#disabled').checked;
  $('#preview').replaceChildren(node);
  $('#play-code').textContent = node.outerHTML;
}
const snippets = {
  panel: '<section class="xiv-panel">\n  <h2 class="xiv-title">Duty Information</h2>\n  <p>A new journey awaits.</p>\n</section>',
  parchment: '<section class="xiv-panel xiv-panel--parchment">\n  <h2 class="xiv-title">The Unending Journey</h2>\n  <p>Your story begins here.</p>\n</section>',
  glass: '<section class="xiv-panel xiv-panel--glass">\n  <h2 class="xiv-title">Aetherial Studies</h2>\n  <p>A translucent surface.</p>\n</section>',
  button: '<button class="xiv-button xiv-button--primary">Accept quest</button>',
  checkbox: '<label class="xiv-check"><input type="checkbox" checked> Join party in progress</label>'
};
async function copy(text, button, message = 'Snippet copied. Place it inside an .xiv wrapper.') {
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const area = document.createElement('textarea'); area.value = text; area.style.cssText = 'position:fixed;opacity:0'; document.body.append(area); area.select();
      const success = document.execCommand('copy'); area.remove(); button.focus(); if (!success) throw new Error('Clipboard unavailable');
    }
    toast(message);
  } catch { toast('Clipboard unavailable. Select and copy the displayed HTML.'); }
}
$('#element').addEventListener('change', setElement);
$('#variant').addEventListener('change', setVariant);
for (const selector of ['#label', '#classes', '#disabled']) $(selector).addEventListener('input', render);
$('#copy-playground').addEventListener('click', event => copy($('#play-code').textContent, event.currentTarget));
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy === 'install' ? $('.install-code code').textContent : snippets[button.dataset.copy], button)));
document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => toast(button.dataset.toast)));
$('#volume').addEventListener('input', event => { $('#volume-value').value = `${event.target.value}%`; });
const dialog = $('#dialog'); dialog.setAttribute('aria-labelledby', 'dialog-title');
for (const selector of ['#abandon', '#open-dialog']) $(selector).addEventListener('click', () => dialog.showModal());
dialog.addEventListener('close', () => { if (dialog.returnValue === 'confirm') toast('Demo quest abandoned. A fresh start awaits.'); });
const tabs = [...document.querySelectorAll('[role="tab"]')];
const content = ['Your next chapter awaits. You have 3 active quests.', 'A journey well travelled. You have completed 12 quests.', 'No archived quests. There are still stories to tell.'];
function selectTab(index) {
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
  $('#tab-content').textContent = content[index]; $('#tab-content').setAttribute('aria-labelledby', tabs[index].id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(next); tabs[next].focus(); }
  });
});
const links = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver(entries => {
  const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (current) links.forEach(link => { const active = link.hash === `#${current.target.id}`; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
document.querySelectorAll('.page > section').forEach(section => observer.observe(section));
$('#element').add(new Option('Progress / resource bar', 'progress'));
setElement();

// The data is bundled as JavaScript so the color browser also works via file://.
const palette = window.XIV_STAINS;
const paletteGrid = $('#palette-grid');
function selectedColors() {
  const query = $('#palette-search').value.trim().toLowerCase();
  return palette.rows.filter(row => !query || `${row.id} ${row.name} --xiv-stain-${row.slug} ${row.hex}`.toLowerCase().includes(query));
}
function renderPalette() {
  const rows = selectedColors();
  $('#palette-count').textContent = `${rows.length} / ${palette.rows.length} named dyes · Stain.Color · exact RGB values`;
  paletteGrid.replaceChildren(...rows.map(row => {
    const hex = row.hex;
    const token = `--xiv-stain-${row.slug}`;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'palette-swatch';
    button.setAttribute('aria-label', `Copy ${row.name}, ${hex}, Stain ${row.id}`);
    const well = document.createElement('span'); well.className = 'swatch-well';
    const color = document.createElement('span'); color.style.backgroundColor = hex; well.append(color);
    const title = document.createElement('strong'); title.textContent = row.name;
    const variable = document.createElement('code'); variable.textContent = token;
    const value = document.createElement('small'); value.textContent = `${hex.toUpperCase()} · ID ${row.id}`;
    button.append(well, title, variable, value);
    button.addEventListener('click', () => {
      const format = $('#palette-format').value;
      const text = format === 'hex' ? hex : format === 'declaration' ? `${token}: ${hex};` : `var(${token})`;
      copy(text, button, `Copied ${text}`);
    });
    return button;
  }));
  if (!rows.length) {
    const empty = document.createElement('p'); empty.className = 'subtle'; empty.textContent = 'No matching dyes. Try a dye name, Stain ID, or hex value.'; paletteGrid.append(empty);
  }
}
$('#palette-search').addEventListener('input', renderPalette);
$('#copy-palette').addEventListener('click', event => {
  const declarations = palette.rows.map(row => `  --xiv-stain-${row.slug}: ${row.hex};\n  --xiv-stain-${row.id}: ${row.hex};`).join('\n');
  copy(`:root {\n${declarations}\n}`, event.currentTarget, `Copied all ${palette.rows.length} named dye colors and ID aliases.`);
});
renderPalette();
document.querySelectorAll('[data-dropdown-copy]').forEach(button => {
  button.addEventListener('click', () => {
    const original = document.getElementById(button.dataset.dropdownCopy).querySelector('details');
    const dropdown = original.cloneNode(true);
    const inputs = [...original.querySelectorAll('input')];
    dropdown.querySelectorAll('input').forEach((input, index) => input.toggleAttribute('checked', inputs[index].checked));
    dropdown.removeAttribute('open');
    copy(dropdown.outerHTML, button, 'Dropdown HTML copied. Include ffxiv.css and xiv.js inside an .xiv wrapper.');
  });
});
