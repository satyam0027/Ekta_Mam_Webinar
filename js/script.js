/* ── Countdown Timer ── */
function updateCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 12);
  target.setHours(19, 0, 0, 0);
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff = 0;
  const days  = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs  = Math.floor((diff % (1000*60)) / 1000);
  const pad = n => String(n).padStart(2,'0');
  document.getElementById('cd-days').textContent  = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

const header = document.getElementById('site-header');
if (header) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 60);
      ticking = false;
    });
  }, { passive: true });
}

const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

const incomeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.income-bar-fill').forEach(bar => {
        bar.style.width = bar.style.width;
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.income-cards').forEach(el => incomeObs.observe(el));

document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

const voicePlayer = document.getElementById('voice-demo-player');
let activeVoicePill = null;

function resetVoicePill(pill) {
  pill.classList.remove('active', 'playing');
  const playBtn = pill.querySelector('.voice-play');
  if (playBtn) playBtn.textContent = '▶';
}

function setVoicePillPlaying(pill) {
  document.querySelectorAll('.voice-pill').forEach(resetVoicePill);
  pill.classList.add('active', 'playing');
  const playBtn = pill.querySelector('.voice-play');
  if (playBtn) playBtn.textContent = '❚❚';
  activeVoicePill = pill;
}

document.querySelectorAll('.voice-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const src = pill.dataset.audio;
    if (!src || !voicePlayer) return;

    const isSameTrack = voicePlayer.src.includes(src);
    const isPlaying = isSameTrack && !voicePlayer.paused;

    if (isPlaying) {
      voicePlayer.pause();
      resetVoicePill(pill);
      activeVoicePill = null;
      return;
    }

    if (!isSameTrack) {
      voicePlayer.src = src;
      voicePlayer.load();
    }

    setVoicePillPlaying(pill);
    voicePlayer.play().catch(() => {
      resetVoicePill(pill);
      activeVoicePill = null;
    });
  });
});

if (voicePlayer) {
  voicePlayer.addEventListener('ended', () => {
    if (activeVoicePill) resetVoicePill(activeVoicePill);
    activeVoicePill = null;
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
