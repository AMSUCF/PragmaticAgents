// === Local Video Detection ===
// When running on localhost or file://, swap YouTube iframes for local video files
(function() {
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
  if (!isLocal) return;

  document.querySelectorAll('.video-wrapper[data-local]').forEach(wrapper => {
    const localSrc = wrapper.dataset.local;
    const iframe = wrapper.querySelector('iframe');
    if (!iframe) return;

    const video = document.createElement('video');
    video.src = localSrc;
    video.controls = true;
    video.preload = 'metadata';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.border = '1px solid rgba(0, 255, 136, 0.3)';
    iframe.replaceWith(video);
  });
})();

// === Prevent arrow/space scrolling when on console (for spaceship controls) ===
window.addEventListener('keydown', (e) => {
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
    const modalsOpen = document.querySelector('.modal-backdrop.active');
    const slideshowOpen = document.getElementById('slideshow').classList.contains('active');
    if (!modalsOpen && !slideshowOpen) {
      e.preventDefault();
    }
  }
});

// === Modal System ===
function openModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  backdrop.style.display = 'flex';
  backdrop.offsetHeight; // trigger reflow
  backdrop.classList.add('active');
}

function closeModal(backdrop) {
  backdrop.classList.remove('active');
  setTimeout(() => {
    backdrop.style.display = 'none';
  }, 300);
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(closeModal);
}

// Close on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', () => closeModal(backdrop));
});

// Close on ESC button click
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const backdrop = btn.closest('.modal-backdrop');
    closeModal(backdrop);
  });
});

// Console menu click handlers
document.querySelectorAll('.console-menu li').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.dataset.action;
    if (action === 'modal') {
      openModal(item.dataset.target);
    } else if (action === 'start') {
      startSlideshow();
    }
  });
});

// Keyboard: Escape closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
    if (document.getElementById('slideshow').classList.contains('active')) {
      exitSlideshow();
    }
  }
});

// === Slideshow Engine ===
let currentSlide = 0;
let totalSlides = 0;
let isAnimating = false;

function startSlideshow() {
  const slideshow = document.getElementById('slideshow');
  const slides = slideshow.querySelectorAll('.slide');
  totalSlides = slides.length;
  currentSlide = 0;
  slideshow.classList.add('active');
  document.getElementById('console').style.display = 'none';
  if (typeof setBgMode === 'function') setBgMode('slideshow');
  showSlide(0);
}

function exitSlideshow() {
  const slideshow = document.getElementById('slideshow');
  slideshow.classList.remove('active');
  document.getElementById('console').style.display = '';
  slideshow.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  if (typeof setBgMode === 'function') setBgMode('console');
}

function showSlide(index) {
  if (isAnimating) return;
  const slideshow = document.getElementById('slideshow');
  const slides = slideshow.querySelectorAll('.slide');

  if (index < 0 || index >= totalSlides) return;

  isAnimating = true;

  // Hide all slides
  slides.forEach(s => s.classList.remove('active'));

  // Glitch transition
  slideshow.classList.add('glitch');

  // Show loader
  const loader = document.getElementById('slideLoader');
  loader.classList.add('active');
  const fill = loader.querySelector('.slide-loader-fill');
  fill.style.animation = 'none';
  fill.offsetHeight;
  fill.style.animation = '';

  setTimeout(() => {
    slideshow.classList.remove('glitch');
    loader.classList.remove('active');

    const slide = slides[index];
    slide.classList.add('active');
    currentSlide = index;

    document.getElementById('slideCounter').textContent =
      `${index + 1} / ${totalSlides}`;

    animateSlide(slide);
  }, 500);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    showSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

// === Dynamic Entry Effects ===
function animateSlide(slide) {
  const textEl = slide.querySelector('.slide-text');
  const imgEl = slide.querySelector('.slide-image');

  // Reset states
  if (imgEl) {
    imgEl.classList.remove('revealed');
  }
  if (textEl) {
    // Hide text until image is done
    textEl.style.opacity = '0';
  }

  // Image reveals first, then text types in after
  if (imgEl) {
    imgEl.offsetHeight;
    imgEl.classList.add('revealed');
    // Wait for scanReveal animation (1s) then start typewriter
    setTimeout(() => {
      if (textEl) {
        textEl.style.opacity = '';
        typewriterEffect(textEl, () => {
          isAnimating = false;
        });
      } else {
        isAnimating = false;
      }
    }, 1000);
  } else if (textEl) {
    textEl.style.opacity = '';
    typewriterEffect(textEl, () => {
      isAnimating = false;
    });
  } else {
    isAnimating = false;
  }
}

function typewriterEffect(element, onComplete) {
  const html = element.dataset.fullHtml || element.innerHTML;
  if (!element.dataset.fullHtml) {
    element.dataset.fullHtml = html;
  }

  const chars = parseHtmlToChars(html);
  let i = 0;
  element.innerHTML = '';

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';

  function type() {
    if (i < chars.length) {
      element.innerHTML = chars.slice(0, i + 1).join('');
      element.appendChild(cursor);
      i++;
      const lastChar = chars[i - 1];
      let delay = 12;
      if (lastChar === '.' || lastChar === '!' || lastChar === '?') delay = 80;
      else if (lastChar === ',' || lastChar === ';') delay = 40;
      else if (lastChar === '\u2014') delay = 60;
      requestAnimationFrame(() => setTimeout(type, delay));
    } else {
      if (cursor.parentNode) cursor.remove();
      element.innerHTML = html;
      if (onComplete) onComplete();
    }
  }

  type();
}

function parseHtmlToChars(html) {
  const result = [];
  let inTag = false;
  let currentTag = '';
  let i = 0;

  while (i < html.length) {
    // Handle HTML entities
    if (html[i] === '&') {
      let entity = '&';
      let j = i + 1;
      while (j < html.length && html[j] !== ';' && j - i < 10) {
        entity += html[j];
        j++;
      }
      if (html[j] === ';') {
        entity += ';';
        result.push(entity);
        i = j + 1;
        continue;
      }
    }

    if (html[i] === '<') {
      inTag = true;
      currentTag = '<';
      i++;
      continue;
    }

    if (inTag) {
      currentTag += html[i];
      if (html[i] === '>') {
        inTag = false;
        if (result.length > 0 && currentTag.startsWith('</')) {
          result[result.length - 1] += currentTag;
        } else {
          result.push(currentTag);
        }
        currentTag = '';
      }
      i++;
      continue;
    }

    result.push(html[i]);
    i++;
  }

  return result;
}

// === Slideshow Navigation Events ===
document.getElementById('prevSlide').addEventListener('click', prevSlide);
document.getElementById('nextSlide').addEventListener('click', nextSlide);
document.getElementById('returnToConsole').addEventListener('click', exitSlideshow);

document.addEventListener('keydown', (e) => {
  const slideshow = document.getElementById('slideshow');
  if (!slideshow.classList.contains('active')) return;

  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  }
});
