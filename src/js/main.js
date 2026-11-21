// (function () {
//   'use strict';

//   // Footer year
//   document.getElementById('year').textContent = new Date().getFullYear();

//   // Green-screen keyer: pointer reveals the transparency grid
//   const keyer = document.getElementById('keyer');
//   const alpha = document.getElementById('keyerAlpha');
//   function moveKeyer(e) {
//     const r = keyer.getBoundingClientRect();
//     alpha.style.setProperty('--x', (e.clientX - r.left) + 'px');
//     alpha.style.setProperty('--y', (e.clientY - r.top) + 'px');
//   }
//   keyer.addEventListener('pointermove', moveKeyer);
//   keyer.addEventListener('pointerdown', moveKeyer);

//   // Count-up stats (runs once when visible)
//   const stats = document.querySelectorAll('.stat');
//   const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//   function count(el) {
//     const target = +el.dataset.count, suffix = el.dataset.suffix || '';
//     if (reduce) { el.textContent = target + suffix; return; }
//     const start = performance.now(), dur = 1200;
//     (function tick(now) {
//       const p = Math.min((now - start) / dur, 1);
//       el.textContent = Math.round(target * p) + suffix;
//       if (p < 1) requestAnimationFrame(tick);
//     })(start);
//   }
//   const io = new IntersectionObserver((entries, obs) => {
//     entries.forEach(en => { if (en.isIntersecting) { count(en.target); obs.unobserve(en.target); } });
//   }, { threshold: .6 });
//   stats.forEach(s => io.observe(s));

//   // Course filter
//   const buttons = document.querySelectorAll('#courseFilter .btn-filter');
//   const courses = document.querySelectorAll('#courseGrid .course');
//   buttons.forEach(btn => btn.addEventListener('click', () => {
//     buttons.forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//     const f = btn.dataset.filter;
//     courses.forEach(c => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
//   }));

//   // "Enquire" buttons preselect the course in the form
//   document.querySelectorAll('.enquire').forEach(b => b.addEventListener('click', () => {
//     document.getElementById('course').value = b.dataset.course;
//     document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
//     document.getElementById('name').focus({ preventScroll: true });
//   }));

//   // Form validation (replace the demo handler with your backend / WhatsApp / email service)
//   const form = document.getElementById('enquiryForm');
//   form.addEventListener('submit', e => {
//     e.preventDefault();
//     if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
//     form.reset();
//     form.classList.remove('was-validated');
//     document.getElementById('formOk').classList.remove('d-none');
//   });

//   // Close mobile menu after clicking a link
//   const nav = document.getElementById('nav');
//   nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
//     const c = bootstrap.Collapse.getInstance(nav);
//     if (c) c.hide();
//   }));
// })();
