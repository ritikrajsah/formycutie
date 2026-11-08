/**
 * Diwali Surprise for Nandini ❤️🪔
 * A Romantic Festive Multi-Screen Experience
 * Designed & Created with Love by Ritik
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION & PHOTO REGISTRY
  // ==========================================
  const TOTAL_SCREENS = 7;
  let currentScreen = 1;

  // The 8 Photo Cards Registry
  // Original photographs provided by Ritik
  const photosData = [
    {
      id: 1,
      src: './assets/photos/photo-1.jpg',
      title: 'Under The Lights Together',
      caption: 'Side by side, making every moment shine brighter.'
    },
    {
      id: 2,
      src: './assets/photos/photo-2.jpg',
      title: 'That Radiant Smile',
      caption: 'The smile that lights up my entire world.'
    },
    {
      id: 3,
      src: './assets/photos/photo-3.jpg',
      title: 'Sparklers & Festive Joy',
      caption: 'A night full of sparkle, but you outshine them all.'
    },
    {
      id: 4,
      src: './assets/photos/photo-4.jpg',
      title: 'Our Sweet Fun Moments',
      caption: 'Two hearts, endless laughs, and infinite memories.'
    },
    {
      id: 5,
      src: './assets/photos/photo-5.jpg',
      title: 'Blooming With Beauty',
      caption: 'Every glance at you feels like a blessing.'
    },
    {
      id: 6,
      src: './assets/photos/photo-6.jpg',
      title: 'Together in Every Celebration',
      caption: 'Dressed up, smiling bright, and making every moment count.'
    },
    {
      id: 7,
      src: './assets/photos/photo-7.jpg',
      title: 'Golden Diwali Lights',
      caption: 'Walking beneath a thousand lights, but your glow is unmatched.'
    },
    {
      id: 8,
      src: './assets/photos/photo-8.jpg',
      title: 'Forever By Your Side',
      caption: 'Every Diwali and every lifetime, you are my favourite blessing.'
    }
  ];

  let activePhotoIndex = 0;
  let availablePhotos = [];

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const progressBar = document.getElementById('progress-bar');
  const progressDots = document.querySelectorAll('.progress-dots .dot');
  const screens = document.querySelectorAll('.experience-screen');
  const galleryGrid = document.getElementById('gallery-grid');

  // Lightbox Elements
  const lightboxModal = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Interactive Canvas
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  // Audio Toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');

  // ==========================================
  // SCREEN NAVIGATION SYSTEM
  // ==========================================
  function goToScreen(screenNumber) {
    if (screenNumber < 1 || screenNumber > TOTAL_SCREENS) return;

    const previousScreen = currentScreen;
    currentScreen = screenNumber;

    // Update screen visibility
    screens.forEach(screen => {
      const step = parseInt(screen.dataset.screen, 10);
      if (step === currentScreen) {
        screen.classList.add('active');
        screen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        screen.classList.remove('active');
      }
    });

    // Update Progress Indicator
    const progressPercent = (currentScreen / TOTAL_SCREENS) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    progressDots.forEach(dot => {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'completed');
      if (dotStep === currentScreen) {
        dot.classList.add('active');
      } else if (dotStep < currentScreen) {
        dot.classList.add('completed');
      }
    });

    // Trigger Screen-Specific Particle / Sound Effects
    if (currentScreen === 2) {
      triggerHeartBurst();
      triggerFireworkBurst(window.innerWidth * 0.3, window.innerHeight * 0.3, '#ffd700');
      triggerFireworkBurst(window.innerWidth * 0.7, window.innerHeight * 0.25, '#ff477e');
    } else if (currentScreen === 6 || currentScreen === 7) {
      launchCelebrationShow();
    }
  }

  // Bind All Navigation Buttons
  function initNavigation() {
    // Next buttons
    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextScreen = parseInt(btn.dataset.next, 10);
        goToScreen(nextScreen);
      });
    });

    // Previous / Back buttons
    document.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevScreen = parseInt(btn.dataset.prev, 10);
        goToScreen(prevScreen);
      });
    });

    // Progress Dots Direct Click
    progressDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetStep = parseInt(dot.dataset.step, 10);
        goToScreen(targetStep);
      });
    });

    // Replay Button
    const replayBtn = document.getElementById('btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        goToScreen(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // PHOTO GALLERY & LIGHTBOX
  // ==========================================
  async function loadAndRenderPhotos() {
    galleryGrid.innerHTML = '';
    availablePhotos = [];

    // Verify which photos load cleanly
    for (let i = 0; i < photosData.length; i++) {
      const item = photosData[i];
      const exists = await checkImageExists(item.src);
      
      if (exists) {
        const photoIndex = availablePhotos.length;
        availablePhotos.push(item);

        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${item.title}`);

        card.innerHTML = `
          <div class="photo-wrapper">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <span class="photo-badge">✨ #${i + 1}</span>
          </div>
          <div class="photo-caption-bar">
            <span class="photo-caption-title">${item.title}</span>
            <span class="photo-view-pill">Tap to view</span>
          </div>
        `;

        card.addEventListener('click', () => openLightbox(photoIndex));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(photoIndex);
          }
        });

        galleryGrid.appendChild(card);
      }
    }

    // If less than 8 images exist yet, inform console & maintain clean presentation
    if (availablePhotos.length < 8) {
      console.info(`Gallery loaded ${availablePhotos.length} original photographs. Ready for the remaining photos.`);
    }
  }

  function checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function openLightbox(index) {
    if (!availablePhotos.length) return;
    activePhotoIndex = (index + availablePhotos.length) % availablePhotos.length;
    const photo = availablePhotos[activePhotoIndex];

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxCaption.innerHTML = `<strong>${photo.title}</strong> — ${photo.caption}`;

    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextPhoto() {
    openLightbox(activePhotoIndex + 1);
  }

  function prevPhoto() {
    openLightbox(activePhotoIndex - 1);
  }

  function initLightboxListeners() {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    });

    // Touch Swipe Gesture for Lightbox on iPhone / Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextPhoto(); // swiped left
        } else {
          prevPhoto(); // swiped right
        }
      }
    }
  }

  // ==========================================
  // AMBIENT PARTICLES, PETALS & FIREWORKS
  // ==========================================
  let width, height;
  const particles = [];
  const petals = [];
  const fireworks = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Golden Dust Particle Class
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.2 + 0.6;
      this.color = Math.random() > 0.35 ? '#ffd56b' : '#ff9ebb';
      this.alpha = Math.random() * 0.6 + 0.2;
      this.speedY = -(Math.random() * 0.6 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.008;

      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(0.9, this.alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Falling Romantic Flower Petal Class
  class Petal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 50;
      this.size = Math.random() * 10 + 8;
      this.speedY = Math.random() * 0.9 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.02;
      this.color = Math.random() > 0.4 ? 'rgba(255, 75, 110, 0.7)' : 'rgba(255, 184, 40, 0.65)';
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.9 + this.speedX;
      this.angle += this.angularSpeed;

      if (this.y > height + 30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(this.size / 2, -this.size / 2, this.size, 0);
      ctx.quadraticCurveTo(this.size / 2, this.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // Firework Spark Particle Class
  class FireworkSpark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.022 + 0.012;
      this.gravity = 0.06;
      this.size = Math.random() * 2.5 + 1;
    }
    update() {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate background particles & petals
  for (let i = 0; i < 45; i++) particles.push(new Particle());
  for (let i = 0; i < 18; i++) petals.push(new Petal());

  function triggerFireworkBurst(x, y, customColor) {
    const palette = ['#ffd700', '#ff477e', '#ff9ebb', '#ffb703', '#ffffff', '#ff0055'];
    const color = customColor || palette[Math.floor(Math.random() * palette.length)];
    const count = 40;
    for (let i = 0; i < count; i++) {
      fireworks.push(new FireworkSpark(x, y, color));
    }
  }

  function triggerHeartBurst() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * (width * 0.6) + width * 0.2;
        const y = Math.random() * (height * 0.4) + height * 0.2;
        triggerFireworkBurst(x, y, '#ff477e');
      }, i * 280);
    }
  }

  let celebrationInterval = null;
  function launchCelebrationShow() {
    if (celebrationInterval) return;
    let bursts = 0;
    celebrationInterval = setInterval(() => {
      const x = Math.random() * (width * 0.8) + width * 0.1;
      const y = Math.random() * (height * 0.45) + height * 0.1;
      triggerFireworkBurst(x, y);
      bursts++;
      if (bursts > 18) {
        clearInterval(celebrationInterval);
        celebrationInterval = null;
      }
    }, 450);
  }

  // Tap or Click Anywhere to Spawn Festive Sparklers
  window.addEventListener('click', (e) => {
    // Prevent if clicking buttons or cards
    if (e.target.closest('button') || e.target.closest('.photo-card')) return;
    triggerFireworkBurst(e.clientX, e.clientY);
  });

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Update & Draw Petals
    petals.forEach(p => {
      p.update();
      p.draw();
    });

    // Update & Draw Fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const spark = fireworks[i];
      spark.update();
      spark.draw();
      if (spark.alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  // ==========================================
  // AMBIENT FESTIVE AUDIO (WEB AUDIO API SYNTH)
  // No external MP3 file needed — Works 100% reliably on GitHub Pages & Safari
  // ==========================================
  let audioCtx = null;
  let isAudioPlaying = false;
  let melodyTimer = null;
  let droneGain = null;

  // Indian classical meditative romantic scale notes (Pentatonic Bhairavi / Raag notes in Hz)
  const notes = [
    261.63, // C4 (Sa)
    293.66, // D4 (Re)
    329.63, // E4 (Ga)
    392.00, // G4 (Pa)
    440.00, // A4 (Dha)
    523.25, // C5 (Sa high)
    587.33, // D5 (Re high)
    659.25  // E5 (Ga high)
  ];

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function startAmbientMelody() {
    initAudio();
    if (isAudioPlaying) return;
    isAudioPlaying = true;

    audioBtn.classList.add('playing');
    audioLabel.textContent = 'Music Playing 🎶';

    // Warm Tanpura / Drone Harmonic Base
    const rootOsc = audioCtx.createOscillator();
    const fifthOsc = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();

    rootOsc.type = 'sine';
    rootOsc.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3

    fifthOsc.type = 'triangle';
    fifthOsc.frequency.setValueAtTime(196.00, audioCtx.currentTime); // G3

    droneGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 3);

    rootOsc.connect(droneGain);
    fifthOsc.connect(droneGain);
    droneGain.connect(audioCtx.destination);

    rootOsc.start();
    fifthOsc.start();

    // Gentle Bell / Flute Notes Chime Sequencer
    function playChime() {
      if (!isAudioPlaying) return;
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 3.6);

      // Random delay between 1.2s and 2.8s for an organic soothing feel
      const delay = Math.random() * 1600 + 1200;
      melodyTimer = setTimeout(playChime, delay);
    }

    playChime();
  }

  function stopAmbientMelody() {
    isAudioPlaying = false;
    audioBtn.classList.remove('playing');
    audioLabel.textContent = 'Sound Off';

    if (melodyTimer) {
      clearTimeout(melodyTimer);
      melodyTimer = null;
    }
    if (droneGain && audioCtx) {
      droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        stopAmbientMelody();
      } else {
        startAmbientMelody();
      }
    });
  }

  // Auto-start music softly on the first user interaction (browser policy compliant)
  function handleFirstInteraction() {
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    if (!isAudioPlaying) {
      startAmbientMelody();
    }
  }
  document.addEventListener('click', handleFirstInteraction, { once: true });
  document.addEventListener('touchstart', handleFirstInteraction, { once: true });

  // ==========================================
  // INITIALIZE EVERYTHING ON DOM READY
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLightboxListeners();
    loadAndRenderPhotos();
  });

})();
