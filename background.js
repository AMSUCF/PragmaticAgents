// === Math Blaster-inspired p5.js background ===
// Two modes: "console" (landing page) and "slideshow" (during slides)

let stars = [];
let shootingStars = [];
let asteroids = [];
let gridOffset = 0;
let mode = 'console'; // 'console' or 'slideshow'

const NUM_STARS = 200;
const NUM_ASTEROIDS = 8;

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
    opacity: random(30, 70)
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
  for (let a of asteroids) {
    push();
    translate(a.x, a.y);
    rotate(a.rotation);

    // Asteroid body
    fill(40, 40, 80, a.opacity);
    stroke(0, 255, 136, a.opacity * 0.4);
    strokeWeight(1);
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

    // Wrap around
    if (a.y > height + a.size) a.y = -a.size;
    if (a.y < -a.size * 2) a.y = height + a.size;
    if (a.x > width + a.size) a.x = -a.size;
    if (a.x < -a.size * 2) a.x = width + a.size;
  }

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// === Mode switching (called from script.js) ===
function setBgMode(newMode) {
  mode = newMode;
}
