'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); menu.focus();
    }
  });
}
const mode = document.getElementById('modalidad');
if (mode) mode.addEventListener('change', () => {
  const text = `Hola TRAINPRO, quisiera información y una cotización para el curso ${mode.dataset.course}${mode.value ? ' en modalidad ' + mode.value : ''}.`;
  document.querySelector('.course-wa').href = 'https://wa.me/51987260390?text=' + encodeURIComponent(text);
});
