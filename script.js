const CONFIG = { couple: { name1: 'Juan', name2: 'Briggitte' }, relationship: { startDate: '2021-06-15T00:00:00' }, music: { file: 'assets/music/Reik - Creo En Ti (LetraLyrics).mp3' }, theme: { primary: '#721C3A', secondary: '#C84C72' }, development: { resetVouchers: false } };
const imageFiles = [
  'WhatsApp Image 2026-08-19 at 12.35.47 AM(1).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.47 AM.jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.48 AM(1).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.48 AM(2).jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.48 AM(3).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.48 AM(4).jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.48 AM(5).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.48 AM.jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.49 AM(1).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.49 AM(2).jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.49 AM(3).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.49 AM(4).jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.49 AM(5).jpeg', 'WhatsApp Image 2026-08-19 at 12.35.49 AM(6).jpeg',
  'WhatsApp Image 2026-08-19 at 12.35.49 AM.jpeg', 'WhatsApp Image 2026-08-19 at 12.39.01 AM.jpeg'
].map(file => `assets/images/${file}`);
const memories = imageFiles.map((image, index) => ({ id: index + 1, image, title: 'Algunos de nuestros recuerdos juntos', date: '', description: '' }));
const vouchers = [
  { id: 1, icon: '♡', title: 'Vale por un abrazo', description: 'Un abrazo largo y sin límite de tiempo.', conditions: 'Canjeable cuando quieras.' },
  { id: 2, icon: '◌', title: 'Vale por una película', description: 'Una película elegida por ti, con snacks incluidos.', conditions: 'Válido para una noche de sofá.' },
  { id: 3, icon: '✦', title: 'Vale por una sorpresa', description: 'Un plan secreto pensado especialmente para ti.', conditions: 'Requiere una sonrisa al canjear.' },
  { id: 4, icon: '⌁', title: 'Vale por una cita', description: 'Una cita para volver a sentirnos en el primer capítulo.', conditions: 'Día y lugar a elección.' },
  { id: 5, icon: '☼', title: 'Vale por consentirte', description: 'Un día entero para hacerte sentir muy querida.', conditions: 'Sin fecha de caducidad.' },
  { id: 6, icon: '♥', title: 'Vale por todo', description: 'Un recordatorio de que siempre puedes contar conmigo.', conditions: 'Canjeable todos los días.' }
];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let currentVoucher = null;
let memoryIndex = 0;
let memoryAutoplay = true;
let memoryTimer = null;
let memoryPointerStart = null;
const intro = $('#intro');
const mainContent = $('#mainContent');
const envelopeButton = $('#envelopeButton');
const music = $('#music');
const storedVouchers = JSON.parse(localStorage.getItem('juan-briggitte-vouchers') || '{}');
if (CONFIG.development.resetVouchers) localStorage.removeItem('juan-briggitte-vouchers');
function wrapMemoryIndex(index) { return (index + memories.length) % memories.length; }
function memoryCard(memory, position) { return `<button class="memory-card memory-card-${position}" data-memory-index="${memory.id - 1}" aria-label="Abrir ${memory.title}"><img src="${memory.image}" alt="${memory.title} de Juan y Briggitte" loading="${position === 'center' ? 'eager' : 'lazy'}"><span class="memory-card-number">${String(memory.id).padStart(2, '0')}</span></button>`; }
function renderMemoryCarousel() {
  const previous = memories[wrapMemoryIndex(memoryIndex - 1)];
  const current = memories[memoryIndex];
  const next = memories[wrapMemoryIndex(memoryIndex + 1)];
  $('#memoryTrack').innerHTML = `${memoryCard(previous, 'previous')}${memoryCard(current, 'center')}${memoryCard(next, 'next')}`;
  $('#memoryCounter').textContent = `${String(current.id).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`;
  $('#memoryDate').textContent = current.date;
  $('#memoryTitle').textContent = current.title;
  $('#memoryDescription').textContent = current.description;
  $('#memoryDots').innerHTML = memories.map((memory, index) => `<button class="carousel-dot ${index === memoryIndex ? 'active' : ''}" data-memory-dot="${index}" aria-label="Ir al recuerdo ${memory.id}"></button>`).join('');
  $$('.memory-card').forEach(card => card.addEventListener('click', () => { const index = Number(card.dataset.memoryIndex); if (index === memoryIndex) openMemoryLightbox(); else goToMemory(index); }));
  $$('.carousel-dot').forEach(dot => dot.addEventListener('click', () => { pauseMemoryAutoplay(); goToMemory(Number(dot.dataset.memoryDot)); }));
  preloadMemory(wrapMemoryIndex(memoryIndex + 1));
}
function goToMemory(index) { memoryIndex = wrapMemoryIndex(index); renderMemoryCarousel(); }
function preloadMemory(index) { const image = new Image(); image.src = memories[index].image; }
function pauseMemoryAutoplay() { memoryAutoplay = false; clearInterval(memoryTimer); $('#autoplayButton').textContent = '▶'; $('#autoplayButton').setAttribute('aria-label', 'Reproducir automáticamente'); $('#autoplayButton').setAttribute('aria-pressed', 'false'); }
function startMemoryAutoplay() { clearInterval(memoryTimer); memoryAutoplay = true; $('#autoplayButton').textContent = 'Ⅱ'; $('#autoplayButton').setAttribute('aria-label', 'Pausar reproducción automática'); $('#autoplayButton').setAttribute('aria-pressed', 'true'); memoryTimer = setInterval(() => goToMemory(memoryIndex + 1), 5000); }
function openExperience() { envelopeButton.classList.add('opening'); setTimeout(() => { intro.classList.add('is-opening'); mainContent.classList.remove('is-locked'); document.body.classList.add('experience-open'); startMusicPrompt(); }, 1250); }
envelopeButton.addEventListener('click', openExperience); $('#openHint').addEventListener('click', openExperience);
$$('[data-scroll]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' })));
function relationshipParts(start, now) { let years = now.getFullYear() - start.getFullYear(); let months = now.getMonth() - start.getMonth(); let days = now.getDate() - start.getDate(); if (days < 0) { months--; const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += previousMonth.getDate(); } if (months < 0) { years--; months += 12; } const elapsed = new Date(now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), start.getHours(), start.getMinutes(), start.getSeconds())); return [years, months, days, elapsed.getUTCHours(), elapsed.getUTCMinutes(), elapsed.getUTCSeconds()]; }
function updateCounter() { const values = relationshipParts(new Date(CONFIG.relationship.startDate), new Date()); $$('#counterGrid strong').forEach((item, index) => item.textContent = String(values[index]).padStart(2, '0')); }
updateCounter(); setInterval(updateCounter, 1000);
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
$$('.reveal').forEach(element => observer.observe(element));
renderMemoryCarousel();
startMemoryAutoplay();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { const id = entry.target.dataset.section; $$('[data-nav]').forEach(nav => nav.classList.toggle('active', nav.dataset.nav === id)); } }), { rootMargin: '-35% 0px -55% 0px' });
$$('[data-section]').forEach(section => sectionObserver.observe(section));
$$('[data-nav]').forEach(nav => nav.addEventListener('click', event => { event.preventDefault(); document.getElementById(nav.dataset.nav).scrollIntoView({ behavior: 'smooth' }); }));
function openModal(id) { const modal = document.getElementById(id); modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeModal(modal) { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('[data-close], .modal-backdrop').forEach(element => element.addEventListener('click', () => closeModal(element.closest('.modal'))));
function updateLightbox() { const memory = memories[memoryIndex]; $('#lightboxImage').src = memory.image; $('#lightboxImage').alt = `${memory.title} de Juan y Briggitte`; $('#lightboxCaption').textContent = `${memory.title} · ${memory.description}`; $('#lightboxDate').textContent = memory.date; $('#lightboxCounter').textContent = `${String(memory.id).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`; }
function openMemoryLightbox() { pauseMemoryAutoplay(); updateLightbox(); openModal('lightbox'); }
function navigateLightbox(direction) { memoryIndex = wrapMemoryIndex(memoryIndex + direction); renderMemoryCarousel(); updateLightbox(); }
$('#memoryPrev').addEventListener('click', () => { pauseMemoryAutoplay(); goToMemory(memoryIndex - 1); });
$('#memoryNext').addEventListener('click', () => { pauseMemoryAutoplay(); goToMemory(memoryIndex + 1); });
$('#autoplayButton').addEventListener('click', () => memoryAutoplay ? pauseMemoryAutoplay() : startMemoryAutoplay());
$('#lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
$('#lightboxNext').addEventListener('click', () => navigateLightbox(1));
$('#memoryStage').addEventListener('pointerdown', event => { memoryPointerStart = { x: event.clientX, y: event.clientY }; $('#memoryStage').setPointerCapture(event.pointerId); });
$('#memoryStage').addEventListener('pointerup', event => { if (!memoryPointerStart) return; const deltaX = event.clientX - memoryPointerStart.x; const deltaY = event.clientY - memoryPointerStart.y; memoryPointerStart = null; if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) { pauseMemoryAutoplay(); goToMemory(memoryIndex + (deltaX < 0 ? 1 : -1)); } });
document.addEventListener('keydown', event => { const modal = $('.modal.is-open'); if (event.key === 'Escape' && modal) closeModal(modal); if (event.key === 'ArrowLeft') { pauseMemoryAutoplay(); modal?.id === 'lightbox' ? navigateLightbox(-1) : goToMemory(memoryIndex - 1); } if (event.key === 'ArrowRight') { pauseMemoryAutoplay(); modal?.id === 'lightbox' ? navigateLightbox(1) : goToMemory(memoryIndex + 1); } });
function renderVouchers() { const grid = $('#voucherGrid'); grid.innerHTML = vouchers.map(voucher => { const redeemed = storedVouchers[voucher.id]; return `<button class="voucher ${redeemed ? 'is-redeemed' : ''}" data-voucher="${voucher.id}"><span class="voucher-status">${redeemed ? '✓ CANJEADO' : 'ABRIR VALE'}</span><span class="voucher-icon">${voucher.icon}</span><h3>${voucher.title}</h3><small>${voucher.description}</small></button>`; }).join(''); $$('.voucher').forEach(card => card.addEventListener('click', () => showVoucher(Number(card.dataset.voucher)))); }
function showVoucher(id) { currentVoucher = vouchers.find(voucher => voucher.id === id); const redeemed = Boolean(storedVouchers[id]); $('#voucherIcon').textContent = currentVoucher.icon; $('#voucherTitle').textContent = currentVoucher.title; $('#voucherDescription').textContent = currentVoucher.description; $('#voucherConditions').textContent = currentVoucher.conditions; $('#voucherModal .voucher-detail').classList.toggle('is-redeemed', redeemed); openModal('voucherModal'); }
$('#redeemButton').addEventListener('click', () => { if (!currentVoucher || storedVouchers[currentVoucher.id]) return; if (window.confirm('¿Segura que quieres canjear este vale? ♥')) { storedVouchers[currentVoucher.id] = true; localStorage.setItem('juan-briggitte-vouchers', JSON.stringify(storedVouchers)); renderVouchers(); $('#voucherModal .voucher-detail').classList.add('is-redeemed'); showToast('Vale canjeado con mucho amor ♥'); } });
renderVouchers(); $('#letterButton').addEventListener('click', () => openModal('letterModal'));
$('#musicButton').addEventListener('click', () => { if (music.paused) { if (!music.src) music.src = CONFIG.music.file; music.play().then(() => $('#musicButton').classList.add('playing')).catch(() => showToast('Añade tu canción en assets/music/cancion.mp3')); } else { music.pause(); $('#musicButton').classList.remove('playing'); } });
function startMusicPrompt() {}
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); }
