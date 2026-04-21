/* ============================================================
   La Notte — Restaurante de Alta Cocina
   js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── NAV: cambia estilo al hacer scroll ── */
  var mainNav = document.getElementById('mainNav');
  window.addEventListener('scroll', function () {
    mainNav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── MENÚ MÓVIL: abrir/cerrar hamburguesa ── */
  document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  // Cerrar al hacer click en un enlace del menú móvil
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('mobileMenu').classList.remove('open');
    });
  });

  // Cerrar al hacer click en el fondo del menú móvil
  document.getElementById('mobileMenu').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });

  /* ── PESTAÑAS DEL MENÚ ── */
  document.getElementById('menuTabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.menu-tab');
    if (!btn) return;
    var tab = btn.getAttribute('data-tab');

    // Desactivar todas las pestañas y paneles
    document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });

    // Activar la pestaña y el panel seleccionados
    btn.classList.add('active');
    var panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
  });

  /* ── FORMULARIO DE RESERVAS ── */
  document.getElementById('btnReserva').addEventListener('click', function () {
    var nombre = document.getElementById('nombre').value.trim();
    var email  = document.getElementById('email').value.trim();
    var errEl  = document.getElementById('reservaError');

    if (!nombre || !email) {
      errEl.style.display = 'block';
      errEl.textContent   = '⚠ Por favor completa tu nombre y correo.';
      return;
    }

    errEl.style.display = 'none';
    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  });

  /* ── SCROLL REVEAL: animar elementos al entrar en pantalla ── */
  var reveals  = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) { observer.observe(el); });

});
