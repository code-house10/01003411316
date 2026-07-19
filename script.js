const menuBtn = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const overlay = document.querySelector('.nav-overlay');
const closeBtn = document.querySelector('.close-menu');
const body = document.body;

function openMenu() {
  if (!mobileNav) return;
  body.classList.add('menu-open');
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
  menuBtn?.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  if (!mobileNav) return;
  body.classList.remove('menu-open');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
  menuBtn?.setAttribute('aria-expanded', 'false');
}

menuBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.querySelectorAll('.accordion-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item').forEach(other => {
      other.classList.remove('open');
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('.accordion-content').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});

const firstOpen = document.querySelector('.accordion-item.open .accordion-content');
if (firstOpen) firstOpen.style.maxHeight = firstOpen.scrollHeight + 'px';

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();
    const animate = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: .55 });
counters.forEach(el => counterObserver.observe(el));

const backTop = document.querySelector('.back-top');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('show', window.scrollY > 650);
}, { passive: true });
backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const headerLogo = document.querySelector('.header-logo');
if (headerLogo) {
  const playLogoAnimation = () => {
    headerLogo.classList.remove('logo-load-animation');
    void headerLogo.offsetWidth;
    headerLogo.classList.add('logo-load-animation');
  };

  if (headerLogo.complete) {
    requestAnimationFrame(playLogoAnimation);
  } else {
    headerLogo.addEventListener('load', playLogoAnimation, { once: true });
    headerLogo.addEventListener('error', () => {
      headerLogo.style.opacity = '1';
      headerLogo.style.transform = 'none';
    }, { once: true });
  }
}

const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('.hero-slide')];
  const dots = [...heroSlider.querySelectorAll('[data-slide-to]')];
  const prev = heroSlider.querySelector('.slider-prev');
  const next = heroSlider.querySelector('.slider-next');
  let current = 0;
  let timer = null;

  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  const stopAuto = () => timer && clearInterval(timer);
  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => showSlide(current + 1), 4300);
  };

  prev?.addEventListener('click', () => { showSlide(current - 1); startAuto(); });
  next?.addEventListener('click', () => { showSlide(current + 1); startAuto(); });
  dots.forEach(dot => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.slideTo));
    startAuto();
  }));

  heroSlider.addEventListener('mouseenter', stopAuto);
  heroSlider.addEventListener('mouseleave', startAuto);
  heroSlider.addEventListener('focusin', stopAuto);
  heroSlider.addEventListener('focusout', startAuto);

  let touchStartX = 0;
  heroSlider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  heroSlider.addEventListener('touchend', e => {
    const distance = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 40) {
      showSlide(current + (distance > 0 ? 1 : -1));
      startAuto();
    }
  }, { passive: true });

  showSlide(0);
  startAuto();
}
