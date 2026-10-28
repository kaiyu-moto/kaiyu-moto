const header = document.getElementById('site-header');
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const closeNav = () => {
  header.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');
};

toggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Google Ads 轉換追蹤：點 LINE、點電話、點導航
// 在 Google Ads 建立轉換動作後，把拿到的「轉換標籤」貼到下面（例如 'AW-658158835/AbC-D_efG123'）。
// 留空的項目不會送出。
const CONVERSIONS = {
  line: 'AW-658158835/PjGDCJKRg60dEPPp6rkC',
  tel: 'AW-658158835/y49aCKeSiK0dEPPp6rkC',
  map: '',
};

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || typeof gtag !== 'function') return;
  const href = a.getAttribute('href');
  let type = '';
  if (href.includes('line.me')) type = 'line';
  else if (href.startsWith('tel:')) type = 'tel';
  else if (href.includes('google.com/maps')) type = 'map';
  if (type && CONVERSIONS[type]) {
    gtag('event', 'conversion', { send_to: CONVERSIONS[type], transport_type: 'beacon' });
  }
});
