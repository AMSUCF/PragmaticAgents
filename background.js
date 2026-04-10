// === Math Blaster-inspired p5.js background ===
// Two modes: "console" (landing page) and "slideshow" (during slides)

let stars = [];
let shootingStars = [];
let asteroids = [];
let gridOffset = 0;
let mode = 'console'; // 'console' or 'slideshow'

const NUM_STARS = 200;
const NUM_ASTEROIDS = 8;

// === Spaceship ===
let ship = { x: 0, y: 0, w: 28, h: 20, speed: 5, thrustFrame: 0, hitTimer: 0, shakeX: 0, shakeY: 0 };
let pellets = [];
let explosions = [];
let keys_held = {};
let lastShotTime = 0;
const SHOT_COOLDOWN = 200; // ms

// === Touch Controls ===
let touchStartX = null;
let touchStartY = null;
let touchStartTime = 0;
let touchShipStartX = 0;
let isTouchMoving = false;
const TAP_THRESHOLD = 15;   // px — movement under this counts as a tap
const TAP_TIME_LIMIT = 300; // ms — taps must be shorter than this

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('bg-canvas');
  noStroke();

  // Initialize stars
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      speed: random(0.1, 0.8),
      twinkle: random(TWO_PI),
      twinkleSpeed: random(0.02, 0.08)
    });
  }

  // Initialize asteroids (console mode only)
  for (let i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(createAsteroid());
  }

  // Position ship at bottom center
  ship.x = width / 2;
  ship.y = height - 40;
}

function createAsteroid() {
  const size = random(15, 45);
  return {
    x: random(-100, width + 100),
    y: random(-100, height + 100),
    size: size,
    speedX: random(-0.3, 0.3),
    speedY: random(0.1, 0.4),
    rotation: random(TWO_PI),
    rotSpeed: random(-0.01, 0.01),
    vertices: generateAsteroidShape(size),
    opacity: random(80, 160)
  };
}

function generateAsteroidShape(size) {
  const verts = [];
  const numVerts = floor(random(6, 10));
  for (let i = 0; i < numVerts; i++) {
    const angle = map(i, 0, numVerts, 0, TWO_PI);
    const r = size * 0.5 + random(-size * 0.2, size * 0.2);
    verts.push({ x: cos(angle) * r, y: sin(angle) * r });
  }
  return verts;
}

function draw() {
  background(10, 10, 46); // #0a0a2e

  if (mode === 'console') {
    drawConsoleBackground();
  } else {
    drawSlideshowBackground();
  }
}

// === Console Mode: Space scene with stars, shooting stars, asteroids ===
function drawConsoleBackground() {
  // Update ship
  updateShip();
  updatePellets();
  updateExplosions();

  // Draw stars with twinkling
  for (let star of stars) {
    star.twinkle += star.twinkleSpeed;
    const alpha = map(sin(star.twinkle), -1, 1, 80, 255);
    const glow = star.size > 2;

    if (glow) {
      // Larger stars get a soft glow
      fill(100, 200, 255, alpha * 0.15);
      ellipse(star.x, star.y, star.size * 6, star.size * 6);
    }

    fill(255, 255, 255, alpha);
    ellipse(star.x, star.y, star.size, star.size);

    // Slow drift
    star.y += star.speed * 0.3;
    if (star.y > height + 5) {
      star.y = -5;
      star.x = random(width);
    }
  }

  // Shooting stars
  if (random() < 0.008) {
    shootingStars.push({
      x: random(width),
      y: random(height * 0.3),
      speedX: random(4, 8) * (random() > 0.5 ? 1 : -1),
      speedY: random(2, 5),
      life: 1.0,
      length: random(30, 80)
    });
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const tailX = s.x - s.speedX * (s.length / 8);
    const tailY = s.y - s.speedY * (s.length / 8);

    // Draw trail
    for (let t = 0; t < 5; t++) {
      const frac = t / 5;
      const tx = lerp(s.x, tailX, frac);
      const ty = lerp(s.y, tailY, frac);
      fill(0, 255, 136, s.life * 255 * (1 - frac) * 0.5);
      ellipse(tx, ty, 2 * (1 - frac), 2 * (1 - frac));
    }

    // Draw head
    fill(255, 255, 255, s.life * 255);
    ellipse(s.x, s.y, 3, 3);
    fill(0, 255, 136, s.life * 180);
    ellipse(s.x, s.y, 6, 6);

    s.x += s.speedX;
    s.y += s.speedY;
    s.life -= 0.015;

    if (s.life <= 0 || s.x < -50 || s.x > width + 50 || s.y > height + 50) {
      shootingStars.splice(i, 1);
    }
  }

  // Floating asteroids
  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    push();
    translate(a.x, a.y);
    rotate(a.rotation);

    // Asteroid body - pink to stand out as targets
    fill(180, 40, 120, a.opacity * 1.5);
    stroke(255, 100, 200, a.opacity * 0.8);
    strokeWeight(1.5);
    beginShape();
    for (let v of a.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    noStroke();

    pop();

    a.x += a.speedX;
    a.y += a.speedY;
    a.rotation += a.rotSpeed;

    // Check collision with ship
    const dShip = dist(a.x, a.y, ship.x, ship.y);
    if (dShip < a.size * 0.4 + ship.w * 0.4) {
      ship.hitTimer = 30;
      spawnExplosion(a.x, a.y, a.size * 0.6);
      const replacement = createAsteroid();
      replacement.y = -replacement.size;
      replacement.x = random(width);
      asteroids[i] = replacement;
      continue;
    }

    // Wrap around
    if (a.y > height + a.size) a.y = -a.size;
    if (a.y < -a.size * 2) a.y = height + a.size;
    if (a.x > width + a.size) a.x = -a.size;
    if (a.x < -a.size * 2) a.x = width + a.size;
  }

  // Draw pellets
  drawPellets();

  // Draw explosions
  drawExplosions();

  // Draw ship
  drawShip();

  // Subtle scan lines over everything
  drawScanlines(0.03);
}

// === Slideshow Mode: Retro grid + particles + scan lines ===
function drawSlideshowBackground() {
  // Scrolling perspective grid (bottom half)
  drawRetroGrid();

  // Dim stars (still visible but subdued)
  for (let star of stars) {
    star.twinkle += star.twinkleSpeed;
    const alpha = map(sin(star.twinkle), -1, 1, 20, 80);
    fill(255, 255, 255, alpha);
    ellipse(star.x, star.y, star.size * 0.7, star.size * 0.7);
    star.y += star.speed * 0.2;
    if (star.y > height + 5) {
      star.y = -5;
      star.x = random(width);
    }
  }

  // Floating particles (green/cyan)
  drawFloatingParticles();

  // Stronger scan lines
  drawScanlines(0.06);

  // Vignette effect
  drawVignette();
}

function drawRetroGrid() {
  gridOffset = (gridOffset + 0.5) % 40;

  stroke(0, 255, 136, 25);
  strokeWeight(1);

  // Horizontal lines (perspective)
  const horizon = height * 0.55;
  for (let y = horizon; y < height; y += 20) {
    const depth = map(y, horizon, height, 0, 1);
    stroke(0, 255, 136, depth * 40);
    strokeWeight(depth * 1.5);
    line(0, y + gridOffset * depth, width, y + gridOffset * depth);
  }

  // Vertical lines (converging to center)
  const cx = width / 2;
  for (let i = -15; i <= 15; i++) {
    const baseX = cx + i * 60;
    const topX = cx + i * 5;
    stroke(0, 255, 136, 15);
    strokeWeight(0.5);
    line(topX, horizon, baseX, height);
  }

  noStroke();
}

let particles = [];
const NUM_PARTICLES = 30;

function drawFloatingParticles() {
  // Lazy init
  while (particles.length < NUM_PARTICLES) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.8, -0.1),
      life: random(0.3, 1),
      color: random() > 0.5 ? [0, 255, 136] : [0, 204, 255]
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    fill(p.color[0], p.color[1], p.color[2], p.life * 120);
    ellipse(p.x, p.y, p.size, p.size);

    // Soft glow
    fill(p.color[0], p.color[1], p.color[2], p.life * 30);
    ellipse(p.x, p.y, p.size * 4, p.size * 4);

    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 0.003;

    if (p.life <= 0 || p.y < -10) {
      particles[i] = {
        x: random(width),
        y: height + random(10),
        size: random(1, 4),
        speedX: random(-0.5, 0.5),
        speedY: random(-0.8, -0.1),
        life: random(0.3, 1),
        color: random() > 0.5 ? [0, 255, 136] : [0, 204, 255]
      };
    }
  }
}

function drawScanlines(alpha) {
  for (let y = 0; y < height; y += 3) {
    fill(0, 0, 0, alpha * 255);
    rect(0, y, width, 1);
  }
}

function drawVignette() {
  // Radial gradient vignette using concentric rects
  const cx = width / 2;
  const cy = height / 2;
  const maxR = max(width, height) * 0.7;

  noFill();
  for (let r = maxR * 0.6; r < maxR; r += 4) {
    const alpha = map(r, maxR * 0.6, maxR, 0, 120);
    stroke(10, 10, 46, alpha);
    strokeWeight(5);
    ellipse(cx, cy, r * 2, r * 2);
  }
  noStroke();
}

// === Ship Controls ===
function updateShip() {
  if (keys_held[LEFT_ARROW] || keys_held[65]) ship.x -= ship.speed;
  if (keys_held[RIGHT_ARROW] || keys_held[68]) ship.x += ship.speed;
  ship.x = constrain(ship.x, ship.w / 2, width - ship.w / 2);
  ship.y = height - 40;
  ship.thrustFrame++;

  // Damage shake
  if (ship.hitTimer > 0) {
    ship.hitTimer--;
    ship.shakeX = random(-3, 3);
    ship.shakeY = random(-2, 2);
  } else {
    ship.shakeX = 0;
    ship.shakeY = 0;
  }
}

function drawShip() {
  push();
  translate(ship.x + ship.shakeX, ship.y + ship.shakeY);

  // Damage flash — red glow around ship
  if (ship.hitTimer > 0) {
    const flashAlpha = map(ship.hitTimer, 0, 30, 0, 180);
    fill(255, 50, 50, flashAlpha);
    noStroke();
    ellipse(0, 0, ship.w * 2, ship.h * 2);
  }

  // Engine glow
  fill(0, 255, 136, 40 + sin(ship.thrustFrame * 0.3) * 20);
  noStroke();
  ellipse(0, 12, 14, 8);

  // Thruster flame (flickers)
  const flicker = 4 + sin(ship.thrustFrame * 0.5) * 3;
  fill(0, 255, 136, 180);
  triangle(-4, 10, 4, 10, 0, 10 + flicker);
  fill(255, 255, 255, 120);
  triangle(-2, 10, 2, 10, 0, 10 + flicker * 0.6);

  // Ship body — flash red/white when hit, otherwise green
  const hitFlash = ship.hitTimer > 0 && (ship.hitTimer % 4 < 2);
  if (hitFlash) {
    fill(255, 80, 80);
    stroke(255, 80, 80);
  } else {
    fill(0, 255, 136);
    stroke(0, 255, 136);
  }
  strokeWeight(1);
  beginShape();
  vertex(0, -ship.h / 2);       // nose
  vertex(-ship.w / 2, ship.h / 2);  // bottom-left
  vertex(-4, ship.h / 4);       // inner-left notch
  vertex(0, ship.h / 3);        // center notch
  vertex(4, ship.h / 4);        // inner-right notch
  vertex(ship.w / 2, ship.h / 2);   // bottom-right
  endShape(CLOSE);

  // Cockpit highlight
  fill(0, 204, 255, 150);
  noStroke();
  ellipse(0, -2, 6, 8);

  pop();
}

// === Pellets ===
function updatePellets() {
  for (let i = pellets.length - 1; i >= 0; i--) {
    pellets[i].y -= 8;
    if (pellets[i].y < -10) {
      pellets.splice(i, 1);
      continue;
    }

    // Check collision with asteroids
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const a = asteroids[j];
      const d = dist(pellets[i].x, pellets[i].y, a.x, a.y);
      if (d < a.size * 0.5) {
        // Spawn explosion
        spawnExplosion(a.x, a.y, a.size);
        // Replace asteroid
        asteroids[j] = createAsteroid();
        asteroids[j].y = -asteroids[j].size;
        asteroids[j].x = random(width);
        // Remove pellet
        pellets.splice(i, 1);
        break;
      }
    }
  }
}

function drawPellets() {
  noStroke();
  for (const p of pellets) {
    // Glow
    fill(0, 255, 136, 60);
    ellipse(p.x, p.y, 8, 12);
    // Core
    fill(255, 255, 255);
    rect(p.x - 1, p.y - 4, 2, 8);
  }
}

function shootPellet() {
  const now = millis();
  if (now - lastShotTime < SHOT_COOLDOWN) return;
  lastShotTime = now;
  pellets.push({ x: ship.x, y: ship.y - ship.h / 2 });
}

// === Explosions ===
function spawnExplosion(x, y, size) {
  const numParticles = floor(random(12, 24));
  const ex = { particles: [], flash: 1.0 };
  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const speed = random(1, 4);
    const isGreen = random() > 0.3;
    ex.particles.push({
      x: x, y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: 1.0,
      decay: random(0.015, 0.04),
      size: random(2, size * 0.15),
      color: isGreen ? [0, 255, 136] : [255, 200, 50]
    });
  }
  explosions.push(ex);
}

function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ex = explosions[i];
    ex.flash *= 0.85;
    let alive = false;
    for (let j = ex.particles.length - 1; j >= 0; j--) {
      const p = ex.particles[j];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // slight gravity
      p.life -= p.decay;
      if (p.life <= 0) {
        ex.particles.splice(j, 1);
      } else {
        alive = true;
      }
    }
    if (!alive) explosions.splice(i, 1);
  }
}

function drawExplosions() {
  noStroke();
  for (const ex of explosions) {
    // White flash
    if (ex.flash > 0.1) {
      fill(255, 255, 255, ex.flash * 80);
      const flashSize = ex.flash * 60;
      if (ex.particles.length > 0) {
        ellipse(ex.particles[0].x, ex.particles[0].y, flashSize, flashSize);
      }
    }
    for (const p of ex.particles) {
      fill(p.color[0], p.color[1], p.color[2], p.life * 255);
      ellipse(p.x, p.y, p.size, p.size);
      // Trail
      fill(p.color[0], p.color[1], p.color[2], p.life * 80);
      ellipse(p.x - p.vx, p.y - p.vy, p.size * 0.6, p.size * 0.6);
    }
  }
}

// === Input Handling ===
function keyPressed() {
  keys_held[keyCode] = true;
  // Space to shoot (only in console mode, and not when modals/slideshow active)
  if (keyCode === 32 && mode === 'console') {
    const modalsOpen = document.querySelector('.modal-backdrop.active');
    const slideshowOpen = document.getElementById('slideshow').classList.contains('active');
    if (!modalsOpen && !slideshowOpen) {
      shootPellet();
    }
  }
}

function keyReleased() {
  keys_held[keyCode] = false;
}

// === Touch Input Handling ===
function touchStarted() {
  if (mode !== 'console') return true;
  const modalsOpen = document.querySelector('.modal-backdrop.active');
  const slideshowOpen = document.getElementById('slideshow').classList.contains('active');
  if (modalsOpen || slideshowOpen) return true;

  if (touches.length > 0) {
    touchStartX = touches[0].x;
    touchStartY = touches[0].y;
    touchStartTime = millis();
    touchShipStartX = ship.x;
    isTouchMoving = false;
  }
  return false; // prevent default
}

function touchMoved() {
  if (mode !== 'console' || touchStartX === null) return true;
  const modalsOpen = document.querySelector('.modal-backdrop.active');
  const slideshowOpen = document.getElementById('slideshow').classList.contains('active');
  if (modalsOpen || slideshowOpen) return true;

  if (touches.length > 0) {
    const dx = touches[0].x - touchStartX;
    if (abs(dx) > TAP_THRESHOLD) {
      isTouchMoving = true;
    }
    // Move ship relative to swipe distance
    ship.x = constrain(touchShipStartX + dx, ship.w / 2, width - ship.w / 2);
  }
  return false; // prevent default (no scrolling)
}

function touchEnded() {
  if (mode !== 'console' || touchStartX === null) {
    touchStartX = null;
    return true;
  }

  const elapsed = millis() - touchStartTime;
  // If it was a quick tap without much movement, shoot
  if (!isTouchMoving && elapsed < TAP_TIME_LIMIT) {
    shootPellet();
  }

  touchStartX = null;
  touchStartY = null;
  isTouchMoving = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ship.x = constrain(ship.x, ship.w / 2, width - ship.w / 2);
}

// === Mode switching (called from script.js) ===
function setBgMode(newMode) {
  mode = newMode;
}
