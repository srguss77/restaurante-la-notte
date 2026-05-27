/* ============================================================
   La Notte — Restaurante de Alta Cocina
   js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── PRELOADER ── */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('preloader').classList.add('hidden');
    }, 700);
  });

  /* ── PROGRESS BAR ── */
  var progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', function () {
    var total   = document.documentElement.scrollHeight - window.innerHeight;
    var current = window.scrollY;
    progressBar.style.width = (total > 0 ? (current / total) * 100 : 0) + '%';
  }, { passive: true });

  /* ── CURSOR PERSONALIZADO ── */
  var cursorDot  = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');
  var mouseX = 0, mouseY = 0;
  var ringX  = 0, ringY  = 0;
  var rafRunning = false;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
    if (!rafRunning) {
      rafRunning = true;
      requestAnimationFrame(animateRing);
    }
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    var dist = Math.hypot(mouseX - ringX, mouseY - ringY);
    if (dist > 0.5) {
      requestAnimationFrame(animateRing);
    } else {
      rafRunning = false;
    }
  }

  document.querySelectorAll('a, button, .menu-item, .gallery-item, .evento-card, .filter-btn, .faq-question').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursorRing.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hovering'); });
  });

  /* ── NAV: scroll ── */
  var mainNav = document.getElementById('mainNav');
  window.addEventListener('scroll', function () {
    mainNav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── BACK TO TOP ── */
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── MENÚ MÓVIL ── */
  var mobileMenu = document.getElementById('mobileMenu');

  document.getElementById('hamburger').addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
  document.getElementById('mobileMenuClose').addEventListener('click', function () {
    mobileMenu.classList.remove('open');
  });
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  });
  mobileMenu.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });

  /* ── PESTAÑAS DEL MENÚ ── */
  document.getElementById('menuTabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.menu-tab');
    if (!btn) return;

    document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });

    btn.classList.add('active');
    var panel = document.getElementById('tab-' + btn.getAttribute('data-tab'));
    if (panel) panel.classList.add('active');

    applyFilter(currentFilter);
  });

  /* ── FILTROS DEL MENÚ ── */
  var currentFilter = 'all';

  document.getElementById('menuFilters').addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    applyFilter(currentFilter);
  });

  function applyFilter(filter) {
    var activePanel = document.querySelector('.menu-panel.active');
    if (!activePanel) return;
    activePanel.querySelectorAll('.menu-item').forEach(function (item) {
      var tags = item.getAttribute('data-tags') || '';
      item.classList.toggle('hidden', filter !== 'all' && tags.indexOf(filter) === -1);
    });
  }

  /* ── CONTADORES ANIMADOS ── */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var target   = parseFloat(el.getAttribute('data-target'));
      var prefix   = el.getAttribute('data-prefix') || '';
      var decimal  = target % 1 !== 0;
      var start    = performance.now();
      var duration = 1800;

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var ease     = 1 - Math.pow(1 - progress, 3);
        var value    = target * ease;
        el.textContent = prefix + (decimal ? value.toFixed(1) : Math.floor(value));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + (decimal ? target.toFixed(1) : target);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ── LIGHTBOX ── */
  var galleryImages = [];
  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    galleryImages.push({ src: img.src, alt: img.alt });
  });

  var lightbox        = document.getElementById('lightbox');
  var lightboxImg     = document.getElementById('lightboxImg');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var currentLbIndex  = 0;

  function openLightbox(index) {
    currentLbIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLbIndex].src;
    lightboxImg.alt = galleryImages[currentLbIndex].alt;
    lightboxCounter.textContent = (currentLbIndex + 1) + ' / ' + galleryImages.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(parseInt(item.getAttribute('data-index')));
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function () { openLightbox(currentLbIndex - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { openLightbox(currentLbIndex + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === this) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   openLightbox(currentLbIndex - 1);
    if (e.key === 'ArrowRight')  openLightbox(currentLbIndex + 1);
  });

  /* ── CARRUSEL DE TESTIMONIOS ── */
  var carousel      = document.getElementById('testimoniosCarousel');
  var slides        = carousel.querySelectorAll('.testimonio-slide');
  var dotsContainer = document.getElementById('carouselDots');
  var currentSlide  = 0;
  var autoplayTimer = null;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Testimonio ' + (i + 1));
    dot.addEventListener('click', function () { goToSlide(i); resetAutoplay(); });
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    carousel.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 4500);
  }

  document.getElementById('carouselPrev').addEventListener('click', function () {
    goToSlide(currentSlide - 1);
    resetAutoplay();
  });
  document.getElementById('carouselNext').addEventListener('click', function () {
    goToSlide(currentSlide + 1);
    resetAutoplay();
  });

  resetAutoplay();

  /* ── FAQ ACORDEÓN ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = this.nextElementSibling;
      var isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
      document.querySelectorAll('.faq-question').forEach(function (q) { q.setAttribute('aria-expanded', 'false'); });

      if (!isOpen) {
        answer.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── TILT 3D EN CARDS ── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      var y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      card.style.transform = 'perspective(700px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg) translateZ(6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });

  /* ── FORMULARIO DE RESERVAS ── */
  document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

  document.getElementById('reservaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = document.getElementById('nombre').value.trim();
    var email  = document.getElementById('email').value.trim();
    var fecha  = document.getElementById('fecha').value;
    var errEl  = document.getElementById('reservaError');

    function showError(msg) {
      errEl.style.display = 'block';
      errEl.textContent   = '⚠ ' + msg;
      errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (!nombre) { showError('Por favor ingresa tu nombre completo.'); return; }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { showError('Por favor ingresa un correo electrónico válido.'); return; }

    if (!fecha) { showError('Por favor selecciona una fecha para tu reservación.'); return; }

    errEl.style.display = 'none';
    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display  = 'block';
  });

  /* ── SCROLL REVEAL ── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

});
