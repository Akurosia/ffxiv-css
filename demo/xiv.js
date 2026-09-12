/* Optional behavior for .xiv-dropdown. Native details and inputs work without JS. */
(() => {
  'use strict';
  function update(dropdown) {
    const value = dropdown.querySelector('.xiv-dropdown-value');
    if (!value) return;
    const selected = [...dropdown.querySelectorAll('input:checked')].map(input => input.closest('label').textContent.trim());
    value.textContent = selected.join(', ') || dropdown.dataset.placeholder || 'Select an option';
  }
  function close(dropdown, restoreFocus = false) {
    dropdown.open = false;
    if (restoreFocus) dropdown.querySelector('summary').focus();
  }
  document.addEventListener('change', event => {
    const dropdown = event.target.closest('.xiv-dropdown');
    if (!dropdown || !event.target.matches('input')) return;
    update(dropdown);
  });
  document.addEventListener('keydown', event => {
    const dropdown = event.target.closest('.xiv-dropdown');
    if (!dropdown) return;
    if (event.key === 'Enter' && event.target.matches('input[type="radio"]')) { event.preventDefault(); close(dropdown, true); }
    if (event.key === 'Escape' && dropdown.open) { event.preventDefault(); close(dropdown, true); }
    if (event.target.matches('summary') && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); dropdown.open = true;
      const inputs = [...dropdown.querySelectorAll('input:not(:disabled)')];
      (event.key === 'ArrowDown' ? inputs[0] : inputs.at(-1))?.focus();
    }
  });
  document.addEventListener('click', event => {
    const chosen = event.target.closest('.xiv-dropdown input[type="radio"]');
    if (chosen) { update(chosen.closest('.xiv-dropdown')); close(chosen.closest('.xiv-dropdown'), true); }
    document.querySelectorAll('.xiv-dropdown[open]').forEach(dropdown => {
      if (!dropdown.contains(event.target)) close(dropdown);
    });
  });
  document.addEventListener('focusin', event => {
    document.querySelectorAll('.xiv-dropdown[open]').forEach(dropdown => {
      if (!dropdown.contains(event.target)) close(dropdown);
    });
  });
  document.addEventListener('reset', event => {
    // Native reset updates checked states after this event has completed.
    setTimeout(() => event.target.querySelectorAll('.xiv-dropdown').forEach(update), 0);
  });
  document.querySelectorAll('.xiv-dropdown').forEach(update);
})();
