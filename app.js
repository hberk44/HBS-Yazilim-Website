const splash = document.querySelector('.splash');
const content = document.querySelector('#site-content');
if (document.documentElement.classList.contains('splash-active')) {
  content.inert = true;
  let timer;
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(timer);
    document.documentElement.classList.remove('splash-active');
    content.inert = false;
    splash.setAttribute('aria-hidden', 'true');
    try { sessionStorage.setItem('hbs-intro-seen', 'true'); } catch {}
    if (splash.contains(document.activeElement)) document.querySelector('.brand').focus({preventScroll:true});
  };

  timer = setTimeout(dismiss, matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 2100);
} else splash.setAttribute('aria-hidden', 'true');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();

function setLanguage(language) {
  const lang = language === 'en' ? 'en' : 'tr';
  const index = lang === 'en' ? 1 : 0;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerHTML = window.hbsTranslations[element.dataset.i18n][index];
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  splash.setAttribute('aria-label', index ? 'HBS Yazılım opening screen' : 'HBS Yazılım açılış ekranı');
  document.querySelector('.brand').setAttribute('aria-label', index ? 'HBS Yazılım home' : 'HBS Yazılım ana sayfa');
  nav.setAttribute('aria-label', index ? 'Main navigation' : 'Ana menü');
  document.title = index ? 'HBS Yazılım — From idea to digital.' : 'HBS Yazılım — Fikirden dijitale.';
  document.querySelector('meta[name="description"]').content = index
    ? 'HBS Yazılım: tailored websites and business applications. From idea to digital.'
    : 'HBS Yazılım: işletmelere özel web siteleri ve kurumsal uygulamalar. Fikirden dijitale.';
  try { localStorage.setItem('hbs-language', lang); } catch {}
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
try { setLanguage(localStorage.getItem('hbs-language')); } catch { setLanguage('tr'); }
