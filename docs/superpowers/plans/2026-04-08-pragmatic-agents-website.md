# Pragmatic Agents Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Math Blaster-inspired static website for "Pragmatic Agentic AI in Digital Humanities" — a single-page site with a retro game console landing page, full-screen slideshow with dynamic entry effects, modal overlays for level content, and a further reading codex.

**Architecture:** Single `index.html` with all content inline (landing page, slideshow, 4 modals). Separate `style.css` for the retro theme, starfield, and animations. Separate `script.js` for slideshow engine, modal logic, keyboard controls, and typewriter/scanline effects. No build step — deploys directly to GitHub Pages.

**Tech Stack:** HTML5, CSS3 (animations, keyframes, custom properties), vanilla JavaScript, Google Fonts (Press Start 2P)

---

## File Structure

```
index.html          — All page content: console, slideshow, 4 modals
style.css           — Retro theme, starfield, animations, responsive layout
script.js           — Slideshow engine, modals, keyboard nav, dynamic effects
materials/          — 7 PNG images (already in repo)
```

---

### Task 1: CSS Foundation — Retro Theme & Starfield

**Files:**
- Create: `style.css`

- [ ] **Step 1: Create style.css with CSS custom properties and base styles**

```css
/* === Custom Properties === */
:root {
  --bg-deep: #0a0a2e;
  --accent-green: #00ff88;
  --accent-cyan: #00ccff;
  --text-white: #f0f0f0;
  --modal-backdrop: rgba(0, 0, 0, 0.85);
  --font-pixel: 'Press Start 2P', monospace;
  --font-body: 'Courier New', 'Consolas', monospace;
}

/* === Reset & Base === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  background: var(--bg-deep);
  color: var(--text-white);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
}

/* === Starfield Background === */
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.starfield .layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background-repeat: repeat;
}

.starfield .layer-1 {
  background-image:
    radial-gradient(1px 1px at 50px 80px, #fff, transparent),
    radial-gradient(1px 1px at 150px 200px, #fff, transparent),
    radial-gradient(1px 1px at 300px 50px, #fff, transparent),
    radial-gradient(1px 1px at 450px 300px, #fff, transparent),
    radial-gradient(1px 1px at 80px 350px, #fff, transparent),
    radial-gradient(1px 1px at 520px 120px, #fff, transparent),
    radial-gradient(1px 1px at 200px 450px, #fff, transparent),
    radial-gradient(1px 1px at 380px 180px, #fff, transparent);
  background-size: 600px 500px;
  animation: drift 120s linear infinite;
}

.starfield .layer-2 {
  background-image:
    radial-gradient(1.5px 1.5px at 100px 150px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 350px 280px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 500px 400px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 220px 50px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 420px 350px, rgba(255,255,255,0.8), transparent);
  background-size: 550px 450px;
  animation: drift 80s linear infinite;
}

.starfield .layer-3 {
  background-image:
    radial-gradient(2px 2px at 180px 100px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 400px 250px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 60px 400px, rgba(255,255,255,0.6), transparent);
  background-size: 500px 500px;
  animation: drift 60s linear infinite;
}

@keyframes drift {
  from { transform: translate(0, 0); }
  to { transform: translate(-50%, -50%); }
}

/* === Google Font Import === */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
```

- [ ] **Step 2: Add console (landing page) styles**

Append to `style.css`:

```css
/* === Console (Landing Page) === */
.console {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

.console-title {
  font-family: var(--font-pixel);
  font-size: clamp(0.8rem, 2.5vw, 1.4rem);
  color: var(--accent-green);
  text-shadow: 0 0 20px var(--accent-green), 0 0 40px rgba(0, 255, 136, 0.3);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  max-width: 90vw;
}

.console-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.5vw, 1rem);
  color: var(--accent-cyan);
  margin-bottom: 3rem;
  opacity: 0.8;
}

.console-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.console-menu li {
  font-family: var(--font-pixel);
  font-size: clamp(0.6rem, 1.5vw, 0.9rem);
  color: var(--text-white);
  cursor: pointer;
  padding: 0.8rem 2rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.console-menu li:hover {
  color: var(--accent-green);
  text-shadow: 0 0 15px var(--accent-green), 0 0 30px rgba(0, 255, 136, 0.4);
  border-color: rgba(0, 255, 136, 0.3);
}

.console-menu li .menu-arrow {
  opacity: 0;
  transition: opacity 0.3s;
  margin-right: 0.5rem;
}

.console-menu li:hover .menu-arrow {
  opacity: 1;
}
```

- [ ] **Step 3: Add modal styles**

Append to `style.css`:

```css
/* === Modal Overlay === */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modal-backdrop);
  z-index: 100;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-backdrop.active {
  display: flex;
  opacity: 1;
}

.modal {
  background: #0d0d35;
  border: 2px solid var(--accent-green);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  width: 90vw;
  max-width: 900px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.modal-title {
  font-family: var(--font-pixel);
  font-size: clamp(0.6rem, 1.5vw, 0.9rem);
  color: var(--accent-green);
  text-shadow: 0 0 10px var(--accent-green);
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-family: var(--font-pixel);
  font-size: 0.7rem;
  color: var(--accent-cyan);
  cursor: pointer;
  background: none;
  border: 1px solid var(--accent-cyan);
  padding: 0.3rem 0.6rem;
  transition: all 0.3s;
}

.modal-close:hover {
  color: #fff;
  border-color: #fff;
  text-shadow: 0 0 10px var(--accent-cyan);
}

/* Getting Started link */
.getting-started {
  display: inline-block;
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  color: var(--accent-cyan);
  border: 1px solid var(--accent-cyan);
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  transition: all 0.3s;
}

.getting-started:hover {
  background: rgba(0, 204, 255, 0.1);
  text-shadow: 0 0 10px var(--accent-cyan);
}

/* Video embed */
.video-item {
  margin-bottom: 1.5rem;
}

.video-label {
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

/* Game item link (for non-video resources) */
.game-item {
  display: block;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--accent-green);
  text-decoration: none;
  padding: 0.8rem 1rem;
  border: 1px dashed var(--accent-green);
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.game-item:hover {
  background: rgba(0, 255, 136, 0.05);
  border-style: solid;
  text-shadow: 0 0 8px var(--accent-green);
}

/* Locked/coming soon item */
.game-item-locked {
  color: #555;
  border-color: #333;
  cursor: default;
}

.game-item-locked:hover {
  background: none;
  border-style: dashed;
  text-shadow: none;
}

/* Further Reading list */
.reading-section {
  margin-bottom: 2rem;
}

.reading-section h3 {
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: var(--accent-cyan);
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.reading-list {
  list-style: none;
}

.reading-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  line-height: 1.5;
}

.reading-list a {
  color: var(--accent-green);
  text-decoration: none;
  transition: text-shadow 0.3s;
}

.reading-list a:hover {
  text-shadow: 0 0 8px var(--accent-green);
}

/* Modal scrollbar */
.modal::-webkit-scrollbar {
  width: 6px;
}
.modal::-webkit-scrollbar-track {
  background: #0a0a2e;
}
.modal::-webkit-scrollbar-thumb {
  background: var(--accent-green);
  border-radius: 3px;
}
```

- [ ] **Step 4: Add slideshow styles**

Append to `style.css`:

```css
/* === Slideshow (Full-Screen Takeover) === */
.slideshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: var(--bg-deep);
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slideshow.active {
  display: flex;
}

.slideshow-return {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: var(--accent-cyan);
  cursor: pointer;
  background: none;
  border: 1px solid var(--accent-cyan);
  padding: 0.4rem 0.8rem;
  z-index: 51;
  transition: all 0.3s;
}

.slideshow-return:hover {
  color: #fff;
  border-color: #fff;
  text-shadow: 0 0 10px var(--accent-cyan);
}

.slide {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 90%;
  padding: 2rem;
  text-align: left;
}

.slide.active {
  display: flex;
}

.slide-text {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 1.5vw, 1.05rem);
  line-height: 1.8;
  color: var(--text-white);
  margin-bottom: 1.5rem;
}

.slide-image {
  max-width: 100%;
  max-height: 40vh;
  border: 1px solid rgba(0, 255, 136, 0.3);
  margin-top: 1rem;
  /* Scanline reveal animation applied via JS */
  clip-path: inset(0 0 100% 0);
}

.slide-image.revealed {
  animation: scanReveal 1s ease-out forwards;
}

@keyframes scanReveal {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0% 0); }
}

.slide-counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Navigation arrows */
.slide-nav {
  position: absolute;
  bottom: 1.5rem;
  display: flex;
  gap: 1rem;
}

.slide-nav-left {
  left: 2rem;
}

.slide-nav-right {
  right: 2rem;
}

.slide-nav button {
  font-family: var(--font-pixel);
  font-size: 0.7rem;
  color: var(--accent-green);
  background: none;
  border: 1px solid var(--accent-green);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.slide-nav button:hover {
  text-shadow: 0 0 10px var(--accent-green);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
}

/* Loading bar between slides */
.slide-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}

.slide-loader.active {
  display: block;
}

.slide-loader-bar {
  width: 200px;
  height: 8px;
  border: 1px solid var(--accent-green);
  overflow: hidden;
}

.slide-loader-fill {
  height: 100%;
  width: 0%;
  background: var(--accent-green);
  animation: loadFill 0.4s steps(10) forwards;
}

@keyframes loadFill {
  to { width: 100%; }
}

.slide-loader-text {
  font-family: var(--font-pixel);
  font-size: 0.45rem;
  color: var(--accent-green);
  text-align: center;
  margin-top: 0.5rem;
}

/* Glitch transition */
.slideshow.glitch {
  animation: glitchFlicker 0.15s steps(2) 2;
}

@keyframes glitchFlicker {
  0% { filter: none; }
  25% { filter: hue-rotate(90deg) brightness(1.5); }
  50% { filter: invert(0.1) brightness(1.2); }
  75% { filter: hue-rotate(-90deg); }
  100% { filter: none; }
}

/* Typewriter cursor */
.typewriter-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background: var(--accent-green);
  vertical-align: text-bottom;
  animation: cursorBlink 0.7s step-end infinite;
}

@keyframes cursorBlink {
  50% { opacity: 0; }
}
```

- [ ] **Step 5: Add responsive styles**

Append to `style.css`:

```css
/* === Responsive === */
@media (max-width: 768px) {
  .console {
    padding: 1.5rem;
  }

  .console-menu li {
    padding: 0.6rem 1.2rem;
  }

  .modal {
    width: 95vw;
    max-height: 90vh;
    padding: 1.5rem;
  }

  .slide {
    padding: 1.5rem;
  }

  .slide-nav button {
    font-size: 0.6rem;
    padding: 0.4rem 0.7rem;
  }
}

@media (max-width: 480px) {
  .console-title {
    font-size: 0.65rem;
  }

  .console-menu li {
    font-size: 0.5rem;
  }

  .modal {
    padding: 1rem;
  }

  .modal-title {
    font-size: 0.5rem;
  }
}
```

- [ ] **Step 6: Open index.html in browser to verify starfield and console styles render**

At this point `index.html` does not exist yet. Create a minimal placeholder to verify the CSS loads:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pragmatic Agentic AI</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="starfield">
    <div class="layer layer-1"></div>
    <div class="layer layer-2"></div>
    <div class="layer layer-3"></div>
  </div>
  <div class="console">
    <h1 class="console-title">PRAGMATIC AGENTIC AI IN DIGITAL HUMANITIES</h1>
    <p class="console-subtitle">CSS test</p>
  </div>
</body>
</html>
```

Open in browser. Confirm: dark background, drifting stars at 3 parallax speeds, green glowing title text, centered layout. Then delete this test file.

- [ ] **Step 7: Commit**

```bash
git add style.css
git commit -m "feat: add retro game CSS theme with starfield, console, modal, and slideshow styles"
```

---

### Task 2: HTML Structure — Console, Slideshow, and Modals

**Files:**
- Create: `index.html`

This task writes all the HTML content. The slideshow text is condensed from the transcript, preserving direct quotes verbatim.

- [ ] **Step 1: Create index.html with head, starfield, and console**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pragmatic Agentic AI in Digital Humanities</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- Starfield Background -->
<div class="starfield">
  <div class="layer layer-1"></div>
  <div class="layer layer-2"></div>
  <div class="layer layer-3"></div>
</div>

<!-- Console (Landing Page) -->
<div class="console" id="console">
  <h1 class="console-title">PRAGMATIC AGENTIC AI IN DIGITAL HUMANITIES</h1>
  <p class="console-subtitle">A guided tour through agentic tools for humanities scholars</p>
  <ul class="console-menu">
    <li data-action="start"><span class="menu-arrow">&#9654;</span> START</li>
    <li data-action="modal" data-target="level1"><span class="menu-arrow">&#9654;</span> LEVEL 1: COWORK</li>
    <li data-action="modal" data-target="level2"><span class="menu-arrow">&#9654;</span> LEVEL 2: CLAUDE CODE CLI</li>
    <li data-action="modal" data-target="level3"><span class="menu-arrow">&#9654;</span> LEVEL 3: OLLAMA</li>
    <li data-action="modal" data-target="reading"><span class="menu-arrow">&#9654;</span> FURTHER READING</li>
  </ul>
</div>

</body>
</html>
```

- [ ] **Step 2: Add slideshow HTML after the console div**

Insert before `</body>`:

```html
<!-- Slideshow (Full-Screen Takeover) -->
<div class="slideshow" id="slideshow">
  <button class="slideshow-return" id="returnToConsole">RETURN TO CONSOLE</button>

  <!-- Slide loader (shown between transitions) -->
  <div class="slide-loader" id="slideLoader">
    <div class="slide-loader-bar"><div class="slide-loader-fill"></div></div>
    <div class="slide-loader-text">LOADING...</div>
  </div>

  <div class="slide" data-slide="1">
    <div class="slide-text">
      I find myself thinking about a visual metaphor based on Math Blaster. The chatbot interface reminds me of many well-intentioned experiments in edutainment&mdash;or what Brenda Laurel memorably called &ldquo;chocolate-covered broccoli.&rdquo; Math Blaster was a well-designed interactive worksheet as a game&mdash;gamification rather than meaningful play. There was no actual correlation between the math and the game mechanics. Similarly, the chatbot is being deployed as a one-size-fits-all educational tool, and it&rsquo;s most likely just going to reduce it. The chatbot reduces friction to an outcome and encourages reductive production.
    </div>
  </div>

  <div class="slide" data-slide="2">
    <div class="slide-text">
      AI slop is something that &ldquo;requires less effort to produce than it does to consume.&rdquo; This is why so many of us are frustrated with chatbots writing essays. But it&rsquo;s possible to use AI in a way that is labor-intensive, requires expertise, and produces weird, interesting, compelling results. A chatbot won&rsquo;t get you there&mdash;the chatbot interface isn&rsquo;t designed for sustained intentionality. It&rsquo;s designed for rapid results, not unlike gamification or early edutainment. It is designed to keep you on the system, even if the outcomes are not that great.
    </div>
  </div>

  <div class="slide" data-slide="3">
    <div class="slide-text">
      Agentic tools require expertise. They reward and extend it. There is something about how agentic tools work as an extension of ourselves that&rsquo;s very different from what a chatbot offers. When we bring AI into the classroom as a technology that offers quick, easy replacement instead of tools that require intentionality, thoughtful design, and can lead to meaningful, creative, and research outputs&mdash;it&rsquo;s thoroughly depressing. I would almost reverse what&rsquo;s on the &ldquo;AI for All&rdquo; red list.
    </div>
  </div>

  <div class="slide" data-slide="4">
    <div class="slide-text">
      The tool I use all the time, Claude Code, does not even appear on UCF&rsquo;s list&mdash;an interesting omission given that it is a highly in-demand tool at UCF. Meanwhile, using a chatbot like Grok is more likely to lead to glib responses and reductiveness, particularly given the political nature of the platform. Both Cowork and Code demand that you provide significant context. They thrive on knowledge input, guidance, and management.
    </div>
    <img class="slide-image" src="materials/mollick-deskilling-deliberate-choices.png" alt="Ethan Mollick post about technology deskilling and deliberate choices about which skills to keep">
  </div>

  <div class="slide" data-slide="5">
    <div class="slide-text">
      Minas Karamanis draws a sharp distinction between an expert building a research project with Claude Code and a grad student using it as a shortcut&mdash;the paper looks identical but the scientist doesn&rsquo;t. Agentic outputs genuinely reflect expertise, whereas chatbot outputs reflect training data and a little bit of prompt literacy. There&rsquo;s very little literacy to build with a chatbot, except perhaps recognizing how easily manipulated we are by them.
    </div>
    <img class="slide-image" src="materials/mollick-tireless-computer-people-quote.png" alt="Ethan Mollick post about tireless computer people completing tasks in 15 minutes">
  </div>

  <div class="slide" data-slide="6">
    <div class="slide-text">
      Agentic tools have mostly been designed for software developers. They&rsquo;re intimidating, and they&rsquo;re being resisted by IT&mdash;which Ethan Mollick writes about as one of the biggest problems with AI right now: that our usage is being decided by a department worried about risk aversion. We&rsquo;re talking about weird tools with serious potential to augment creativity and research that cannot be so easily regulated or defined.
    </div>
    <img class="slide-image" src="materials/underwood-behind-ahead-blog-post.png" alt="Lincoln Mullen's 'Behind, ahead' blog post about discovering agentic coding">
  </div>

  <div class="slide" data-slide="7">
    <div class="slide-text">
      Mr. Chatterbox is a language model trained entirely from scratch on over 28,000 Victorian-era British texts from the British Library&mdash;built using Claude Code as a tool. The resulting output is not Claude. It&rsquo;s not a frontier model. It can be brought into a classroom without any data risks. Students can build things like this for themselves. Wouldn&rsquo;t we rather have students who are makers and creators than passive consumers of a chatbot&rsquo;s output?
    </div>
    <img class="slide-image" src="materials/chatterbox-victorian-chat-roleplay.png" alt="Mr. Chatterbox Victorian chatbot roleplay conversation">
  </div>

  <div class="slide" data-slide="8">
    <div class="slide-text">
      There are three components to what happens when we work with an agentic tool. The lowest level is the LLM itself. Then there&rsquo;s the reasoning layer on top. Then the harness&mdash;Claude Code is a harness, and I can use it with models that are not Claude. This type of workflow with harnesses and local models is starting to be more and more viable. When people talk about AI as if it&rsquo;s all giant data centers and a bubble that&rsquo;s going to burst&mdash;they&rsquo;re just plain wrong. These harnesses and local models would still exist if the rest shut down tomorrow.
    </div>
    <img class="slide-image" src="materials/underwood-put-web-after-model-quote.png" alt="Ted Underwood post comparing AI disclosure to putting 'Web' after internet citations">
  </div>

  <div class="slide" data-slide="9">
    <div class="slide-text">
      The ability to use agentic tools as a cultural and computational interface&mdash;to make up for drops in funding and labor. If you&rsquo;ve ever had things you really wanted to build that you don&rsquo;t have the time or resources for&mdash;those rejected grants, those grants going nowhere in today&rsquo;s climate&mdash;these are ways to build the things you&rsquo;re dreaming about. For me, it&rsquo;s become a way to unlock all those side projects I had almost given up on.
    </div>
    <img class="slide-image" src="materials/claude-bankhead-jones-grasslands-map.png" alt="Map of Bankhead-Jones grasslands generated with Claude, demonstrating agentic research tools">
  </div>

  <div class="slide" data-slide="10">
    <div class="slide-text">
      &ldquo;Should we worry about AI hallucinations invisibly corrupting these digital constructions? Because the researchers are not using these tools to formulate conclusions, and because their models maintain the original data so they, and anyone else, can spot-check them, this seems like much less of a concern than using AI further along in the scholarly process. In this wider context, vibe coding and diligent analysis can coexist.&rdquo; &mdash;Dan Cohen, &ldquo;Vibe Analysis&rdquo;
    </div>
    <img class="slide-image" src="materials/underwood-public-interest-ai-thread.png" alt="Ted Underwood thread about public interest AI development">
  </div>

  <!-- Slide navigation -->
  <div class="slide-nav slide-nav-left">
    <button id="prevSlide">&#9664; PREV</button>
  </div>
  <div class="slide-nav slide-nav-right">
    <button id="nextSlide">NEXT &#9654;</button>
  </div>
  <div class="slide-counter" id="slideCounter"></div>
</div>
```

- [ ] **Step 3: Add Level 1 (Cowork) modal HTML**

Insert before `</body>`:

```html
<!-- Level 1: Cowork Modal -->
<div class="modal-backdrop" id="level1">
  <div class="modal" onclick="event.stopPropagation()">
    <button class="modal-close" data-close>ESC</button>
    <h2 class="modal-title">LEVEL 1: COWORK</h2>
    <a href="https://claude.ai" target="_blank" rel="noopener" class="getting-started">&#9733; GETTING STARTED: CLAUDE.AI</a>
    <div class="video-item">
      <div class="video-label">REVISION PLANNING</div>
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/fIAvgI2FxZA" title="Revision Planning" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
    <div class="video-item">
      <div class="video-label">COMPLETING DOCUMENTATION</div>
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/276aI267V7U" title="Completing Documentation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
    <div class="video-item">
      <div class="video-label">WEB RESEARCH AND TOOLS</div>
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/8iTH_-pgS_Q" title="Web Research and Tools" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add Level 2 (Claude Code CLI) modal HTML**

Insert before `</body>`:

```html
<!-- Level 2: Claude Code CLI Modal -->
<div class="modal-backdrop" id="level2">
  <div class="modal" onclick="event.stopPropagation()">
    <button class="modal-close" data-close>ESC</button>
    <h2 class="modal-title">LEVEL 2: CLAUDE CODE CLI</h2>
    <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank" rel="noopener" class="getting-started">&#9733; GETTING STARTED: INSTALL CLAUDE CODE</a>
    <div class="video-item">
      <div class="video-label">LOCAL TRANSCRIPTION</div>
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/XywaSW94IQ4" title="Local Transcription" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
    <a href="https://github.com/AMSUCF/InterdisciplinaryTeaching/blob/main/README.md" target="_blank" rel="noopener" class="game-item">&#9733; WEBCOURSES CONTENT &mdash; View on GitHub</a>
    <div class="game-item game-item-locked">&#9744; BUILDING PRESENTATIONS &mdash; COMING SOON</div>
  </div>
</div>
```

- [ ] **Step 5: Add Level 3 (Ollama) modal HTML**

Insert before `</body>`:

```html
<!-- Level 3: Ollama Modal -->
<div class="modal-backdrop" id="level3">
  <div class="modal" onclick="event.stopPropagation()">
    <button class="modal-close" data-close>ESC</button>
    <h2 class="modal-title">LEVEL 3: OLLAMA</h2>
    <a href="https://ollama.com" target="_blank" rel="noopener" class="getting-started">&#9733; GETTING STARTED: OLLAMA.COM</a>
    <a href="https://ollama.com/library/devstral-small" target="_blank" rel="noopener" class="getting-started" style="margin-left: 0.5rem;">&#9733; MODEL: DEVSTRAL SMALL 2</a>
    <div class="video-item">
      <div class="video-label">WORKING WITH LOCAL MODELS</div>
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/37XWlkI-Uyo" title="Working with Local Models" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 6: Add Further Reading modal HTML**

Insert before `</body>`. URLs for Works Cited items should be researched during implementation and filled in where findable. The plan includes placeholder `#` hrefs for items that need URL research — the implementing agent should use web search to find these.

```html
<!-- Further Reading Modal -->
<div class="modal-backdrop" id="reading">
  <div class="modal" onclick="event.stopPropagation()">
    <button class="modal-close" data-close>ESC</button>
    <h2 class="modal-title">FURTHER READING</h2>

    <div class="reading-section">
      <h3>WORKS CITED</h3>
      <ul class="reading-list">
        <li>Bai et al., &ldquo;The Levers of Political Persuasion with Conversational Artificial Intelligence,&rdquo; <em>Science</em>, 2025</li>
        <li>Bender et al., <a href="https://dl.acm.org/doi/10.1145/3442188.3445922" target="_blank" rel="noopener">&ldquo;On the Dangers of Stochastic Parrots,&rdquo;</a> <em>FAccT</em>, 2021</li>
        <li>Furze, &ldquo;The Effort Economy of Slop&rdquo;</li>
        <li>Gerlich, &ldquo;AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking,&rdquo; <em>Societies</em> 15.1, 2025</li>
        <li>Karamanis, &ldquo;The Machines Are Fine. I&rsquo;m Worried About Us,&rdquo; <em>ergosphere.blog</em>, 2026</li>
        <li>Laurel, <em>Utopian Entrepreneur</em>, 2001</li>
        <li>McLuhan, <em>Understanding Media</em>, 1964</li>
        <li>Mitchell, &ldquo;On Evaluating Cognitive Capabilities in Machines,&rdquo; <em>AI: A Guide for Thinking Humans</em>, 2026</li>
        <li>Mollick, <a href="https://www.oneusefulthing.org/" target="_blank" rel="noopener">&ldquo;Management as AI Superpower,&rdquo;</a> <em>One Useful Thing</em></li>
        <li>Mollick, <a href="https://www.oneusefulthing.org/" target="_blank" rel="noopener">&ldquo;The IT Department: Where AI Goes to Die,&rdquo;</a> <em>One Useful Thing</em></li>
        <li>Venturella, &ldquo;Mr. Chatterbox,&rdquo; 2026</li>
        <li>Vincent, &ldquo;Superpowers: How I&rsquo;m Using Coding Agents,&rdquo; 2025</li>
      </ul>
    </div>

    <div class="reading-section">
      <h3>FURTHER READING</h3>
      <ul class="reading-list">
        <li><a href="https://newsletter.dancohen.org/archive/vibe-analysis/" target="_blank" rel="noopener">Cohen, &ldquo;Vibe Analysis&rdquo;</a></li>
        <li><a href="https://jasonheppler.org/2026/03/09/vibing-digital-history/" target="_blank" rel="noopener">Heppler, &ldquo;Vibing Digital History&rdquo;</a></li>
        <li><a href="https://www.oneusefulthing.org/p/claude-dispatch-and-the-power-of" target="_blank" rel="noopener">Mollick, &ldquo;Claude Dispatch and the Power of Interfaces&rdquo;</a></li>
        <li><a href="https://lincolnmullen.com/blog/behind-ahead/" target="_blank" rel="noopener">Mullen, &ldquo;Behind, Ahead&rdquo;</a></li>
        <li><a href="https://magazine.sebastianraschka.com/p/components-of-a-coding-agent" target="_blank" rel="noopener">Raschka, &ldquo;Components of a Coding Agent&rdquo;</a></li>
        <li><a href="https://www.estragon.news/mr-chatterbox-or-the-modern-prometheus/" target="_blank" rel="noopener">Venturella, &ldquo;Mr. Chatterbox, or, The Modern Prometheus&rdquo;</a></li>
      </ul>
    </div>
  </div>
</div>
```

- [ ] **Step 7: Add script tag at end of body**

Insert before `</body>`:

```html
<script src="script.js"></script>
```

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add complete HTML structure with console, slideshow, level modals, and further reading"
```

---

### Task 3: JavaScript — Modal System

**Files:**
- Create: `script.js`

- [ ] **Step 1: Create script.js with modal open/close logic**

```javascript
// === Modal System ===
function openModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  backdrop.style.display = 'flex';
  // Trigger reflow for transition
  backdrop.offsetHeight;
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
```

- [ ] **Step 2: Open in browser, verify modals open and close**

Test: click each level menu item, verify modal appears with fade-in. Click ESC button, click backdrop, press Escape key — all should close the modal. Verify `onclick="event.stopPropagation()"` on `.modal` prevents clicks inside modal from closing it.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add modal open/close system with keyboard and click handlers"
```

---

### Task 4: JavaScript — Slideshow Engine with Dynamic Effects

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add slideshow state and navigation functions**

Append to `script.js`:

```javascript
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
  showSlide(0);
}

function exitSlideshow() {
  const slideshow = document.getElementById('slideshow');
  slideshow.classList.remove('active');
  document.getElementById('console').style.display = '';
  // Reset all slides
  slideshow.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
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
  // Reset loader animation
  const fill = loader.querySelector('.slide-loader-fill');
  fill.style.animation = 'none';
  fill.offsetHeight;
  fill.style.animation = '';

  setTimeout(() => {
    slideshow.classList.remove('glitch');
    loader.classList.remove('active');

    // Activate new slide
    const slide = slides[index];
    slide.classList.add('active');
    currentSlide = index;

    // Update counter
    document.getElementById('slideCounter').textContent =
      `${index + 1} / ${totalSlides}`;

    // Trigger dynamic entry effects
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
```

- [ ] **Step 2: Add typewriter and scanline animation functions**

Append to `script.js`:

```javascript
// === Dynamic Entry Effects ===
function animateSlide(slide) {
  const textEl = slide.querySelector('.slide-text');
  const imgEl = slide.querySelector('.slide-image');

  // Typewriter effect for text
  if (textEl) {
    typewriterEffect(textEl, () => {
      // After text finishes, reveal image
      if (imgEl) {
        imgEl.classList.remove('revealed');
        imgEl.offsetHeight; // reflow
        imgEl.classList.add('revealed');
      }
      isAnimating = false;
    });
  } else {
    isAnimating = false;
  }
}

function typewriterEffect(element, onComplete) {
  const html = element.dataset.fullHtml || element.innerHTML;
  // Store original HTML on first run
  if (!element.dataset.fullHtml) {
    element.dataset.fullHtml = html;
  }

  // Parse HTML into text nodes and tags
  const chars = parseHtmlToChars(html);
  let i = 0;
  element.innerHTML = '';

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';

  function type() {
    if (i < chars.length) {
      // Add next chunk (character or full tag)
      element.innerHTML = chars.slice(0, i + 1).join('');
      element.appendChild(cursor);
      i++;
      // Vary speed: slower after punctuation, faster for tags
      const lastChar = chars[i - 1];
      let delay = 12;
      if (lastChar === '.' || lastChar === '!' || lastChar === '?') delay = 80;
      else if (lastChar === ',' || lastChar === ';') delay = 40;
      else if (lastChar === '\u2014') delay = 60; // em dash
      requestAnimationFrame(() => setTimeout(type, delay));
    } else {
      // Remove cursor when done
      if (cursor.parentNode) cursor.remove();
      // Restore full HTML cleanly
      element.innerHTML = html;
      if (onComplete) onComplete();
    }
  }

  type();
}

function parseHtmlToChars(html) {
  // Split HTML into renderable chunks: tags stay whole, text splits per-char
  const result = [];
  let inTag = false;
  let currentTag = '';
  let i = 0;

  while (i < html.length) {
    // Handle HTML entities like &ldquo; &mdash; etc.
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
        // Attach tag to previous character or push as standalone
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
```

- [ ] **Step 3: Add keyboard and button event listeners for slideshow navigation**

Append to `script.js`:

```javascript
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
```

- [ ] **Step 4: Open in browser, test full slideshow flow**

Test:
1. Click START — slideshow takes over, slide 1 appears with typewriter text
2. Press Right arrow — glitch transition, loader bar, slide 2 typewriter begins
3. On slides with images (4-10), verify image scan-reveals after text finishes
4. Press Left arrow — goes back
5. Click "RETURN TO CONSOLE" — back to landing page
6. Press Escape during slideshow — back to landing page
7. Slide counter shows correct "N / 10"

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: add slideshow engine with typewriter, scanline, glitch, and loader effects"
```

---

### Task 5: Source URL Research

**Files:**
- Modify: `index.html` (Further Reading modal)

- [ ] **Step 1: Research missing URLs for Works Cited items**

Use web search to find URLs for these items currently missing links in the Further Reading modal:

1. Bai et al., "The Levers of Political Persuasion..." *Science* 2025
2. Furze, "The Effort Economy of Slop"
3. Gerlich, "AI Tools in Society..." *Societies* 15.1, 2025
4. Karamanis, "The Machines Are Fine..." *ergosphere.blog*, 2026
5. Laurel, *Utopian Entrepreneur*, 2001 (publisher or WorldCat)
6. McLuhan, *Understanding Media*, 1964 (publisher or WorldCat)
7. Mitchell, "On Evaluating Cognitive Capabilities..." 2026
8. Venturella, "Mr. Chatterbox," 2026
9. Vincent, "Superpowers: How I'm Using Coding Agents," 2025

- [ ] **Step 2: Update the Works Cited list items in index.html with found URLs**

For each URL found, wrap the citation title in an anchor tag:

```html
<li><a href="FOUND_URL" target="_blank" rel="noopener">Citation text</a></li>
```

For items where no URL can be found (books without online presence), leave as plain text.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add researched URLs to works cited in further reading modal"
```

---

### Task 6: Final Polish & Verification

**Files:**
- Possibly modify: `style.css`, `index.html`, `script.js`

- [ ] **Step 1: Add .gitignore for .superpowers directory**

Create `.gitignore`:

```
.superpowers/
```

- [ ] **Step 2: Full end-to-end test in browser**

Open `index.html` in browser. Check every feature:

1. Landing page: starfield animates, title glows green, menu items show arrow on hover
2. Click START: slideshow takes over full screen
3. Navigate all 10 slides with arrow keys: typewriter text, scanline images, glitch transitions, loader bar
4. Click RETURN TO CONSOLE: back to landing
5. Open each Level modal (1, 2, 3): videos load, Getting Started links work, Coming Soon is grayed out
6. Open Further Reading: all links work (open in new tab), scrolling works
7. Close modals: ESC key, X button, backdrop click all work
8. Responsive: resize to mobile width, verify menu stacks, modals fit, slideshow text is readable

- [ ] **Step 3: Fix any issues found during testing**

Address any visual or functional issues discovered in Step 2.

- [ ] **Step 4: Commit**

```bash
git add .gitignore style.css index.html script.js
git commit -m "feat: final polish and gitignore for pragmatic agents website"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | CSS foundation: retro theme, starfield, all component styles | `style.css` |
| 2 | HTML structure: console, slideshow content, modals | `index.html` |
| 3 | JavaScript: modal open/close system | `script.js` |
| 4 | JavaScript: slideshow engine with dynamic effects | `script.js` |
| 5 | Research and add missing source URLs | `index.html` |
| 6 | Final polish, testing, gitignore | all files |
