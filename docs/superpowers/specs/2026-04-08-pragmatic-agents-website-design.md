# Pragmatic Agentic AI in Digital Humanities — Website Design Spec

## Overview

A Math Blaster-inspired static website companion to a talk on pragmatic uses of agentic AI in digital humanities. The site serves as both a presentation archive and a navigable resource hub. Deployed on GitHub Pages as plain HTML/CSS/JS with no build step.

## Site Structure

### Files

- `index.html` — all content: landing page, slideshow, modals
- `style.css` — retro game theme and animations
- `script.js` — slideshow engine, modal logic, keyboard handlers, dynamic effects
- `materials/` — 7 PNG images (already in repo)

### UX Model

The site is a single page with two modes:

1. **The Console (landing page)** — home base with game-menu navigation. Level content and further reading appear as modal overlays on top of this page.
2. **The Slideshow (game intro)** — full-screen takeover with arrow-key navigation. A "RETURN TO CONSOLE" button provides an escape hatch back to the landing page.

## Visual Theme

### Color Palette

- Background: deep space navy/black (#0a0a2e)
- Primary accent: neon green (#00ff88)
- Secondary accent: cyan (#00ccff)
- Body text: white (#ffffff) or near-white
- Modal backdrop: semi-transparent black

### Typography

- **Headings & menu items:** Press Start 2P (Google Fonts) — pixel/arcade aesthetic
- **Body text in slides and modals:** a readable monospace or system sans-serif — pixel font for long paragraphs would hurt readability

### Starfield Background

Pure CSS animated starfield using multiple layers of small radial-gradient dots at different sizes and animation speeds to create parallax depth. Present on the landing page and visible behind modal backdrops. No canvas needed — keeps the implementation simple.

### Interactions

- Menu items glow/pulse on hover with text-shadow bloom
- Modals fade in with neon-bordered container over dark backdrop
- Keyboard: Left/Right arrows for slideshow, Escape to close modals or return to console
- Responsive: modals and slideshow scale for tablet/phone, menu stacks vertically on small screens

## Landing Page ("The Console")

- Full-viewport starfield background
- Title: "PRAGMATIC AGENTIC AI IN DIGITAL HUMANITIES" in Press Start 2P
- Subtitle or tagline beneath
- Game-menu navigation (centered, stacked):
  - **START** — launches the full-screen slideshow
  - **LEVEL 1: COWORK** — opens modal
  - **LEVEL 2: CLAUDE CODE CLI** — opens modal
  - **LEVEL 3: OLLAMA** — opens modal
  - **FURTHER READING** — opens modal

## Slideshow ("Game Intro")

### Behavior

- Full-screen takeover over the landing page
- Arrow keys (left/right) navigate between slides
- Clickable prev/next buttons for mobile/mouse users
- Slide counter visible (e.g., "3 / 10")
- "RETURN TO CONSOLE" button fixed in corner (top-right)

### Dynamic Entry Effects

Each slide uses retro-game-inspired entry animations:

- **Text:** typewriter effect — characters appear one by one
- **Images:** scan-line render — image reveals from top to bottom with a CRT-style sweep
- **Slide transitions:** screen wipe, glitch, or scanline sweep effect between slides
- **Loading bar:** brief pixel-art loading bar or screen flicker before each slide appears

### Slide Content

~10 slides condensing the transcript into paragraph-sized chunks (3-5 sentences each). All direct quotes preserved verbatim. Images placed on the slides where they're contextually relevant.

1. **Math Blaster metaphor** — edutainment parallel, Laurel's "chocolate-covered broccoli," chatbot as gamification, no correlation between content and game mechanics
2. **AI slop** — Bluesky/Furze definition ("requires less effort to produce than consume"), chatbot reduces friction to outcome, encourages reductive production
3. **Agentic tools vs chatbots** — expertise required, McLuhan extension metaphor, intentionality vs quick results, labor-intensive but compelling
4. **The red list problem** — UCF's AI lists inverted, Claude Code absent from list, Grok on yellow list | *Image: mollick-deskilling-deliberate-choices.png*
5. **Cowork and Code demand expertise** — context-demanding tools, Karamanis's Alice and Bob parable, agentic outputs reflect expertise vs chatbot outputs reflect training data | *Image: mollick-tireless-computer-people-quote.png*
6. **IT resistance and weird tools** — Mollick on IT as where AI goes to die, agentic tools designed for developers, intimidating but creative potential | *Image: underwood-behind-ahead-blog-post.png*
7. **Mr. Chatterbox** — Victorian model built from scratch on 28,000 texts with Claude Code, students as makers not consumers, cultural flattening doesn't have to be the outcome | *Image: chatterbox-victorian-chat-roleplay.png*
8. **How LLMs actually work** — three layers (model, reasoning, harness), Claude Code as harness, local models viable, Superpowers workflow with Gemma 4 on desktop | *Images: underwood-put-web-after-model-quote.png, underwood-public-interest-ai-thread.png*
9. **Why experiment now** — local models persist regardless of AI bubble, persistence benefits archives and humanities, unlock side projects and rejected grants | *Image: claude-bankhead-jones-grasslands-map.png*
10. **Vibe analysis** — Cohen quote on vibe coding and diligent analysis coexisting, close reading endures, interconnected web of evidence

### Source Research

During implementation, research and fill in any missing URLs for inline citations (Laurel, Furze, McLuhan, Mitchell, Vincent, etc.) so that Further Reading is as complete as possible.

## Level Modals

### Shared Modal Design

- Large overlay covering most of the viewport
- Dark background with neon border (matching retro theme)
- Close via: X button in corner, Escape key, or clicking outside the modal
- Pixel font header with level name
- Content scrolls within the modal if needed

### Level 1: Cowork

**Getting Started:** Link to Claude Cowork — https://claude.ai (Cowork is available through Claude's web interface as a collaborative workspace feature)

Three embedded YouTube videos, stacked vertically with title labels:

- Revision Planning — https://youtu.be/fIAvgI2FxZA
- Completing Documentation — https://youtu.be/276aI267V7U
- Web Research and Tools — https://youtu.be/8iTH_-pgS_Q

### Level 2: Claude Code CLI

**Getting Started:** Link to Claude Code installation — https://docs.anthropic.com/en/docs/claude-code/overview

Two embedded videos, one link, one placeholder:

- Local Transcription — https://youtu.be/XywaSW94IQ4
- Webcourses Content — link to https://github.com/AMSUCF/InterdisciplinaryTeaching/blob/main/README.md (styled as a game item/pickup)
- Building Presentations — "COMING SOON" (styled as locked/grayed-out item)

### Level 3: Ollama

**Getting Started:** Link to Ollama — https://ollama.com. Model used in demo: Devstral Small 2 — https://ollama.com/library/devstral-small

One embedded YouTube video:

- Working with Local Models — https://youtu.be/37XWlkI-Uyo

### Video Sizing

YouTube iframes sized responsively within the modal container. 16:9 aspect ratio maintained.

## Further Reading Modal

Same modal style as levels. Scrollable list styled like a game credits/codex screen. Items with known URLs open in new tabs.

### Works Cited in Presentation

- Bai et al., "The Levers of Political Persuasion with Conversational Artificial Intelligence," *Science*, 2025
- Bender et al., "On the Dangers of Stochastic Parrots," *FAccT*, 2021
- Furze, "The Effort Economy of Slop"
- Gerlich, "AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking," *Societies* 15.1, 2025
- Karamanis, "The Machines Are Fine. I'm Worried About Us," *ergosphere.blog*, 2026
- Laurel, *Utopian Entrepreneur*, 2001
- McLuhan, *Understanding Media*, 1964
- Mitchell, "On Evaluating Cognitive Capabilities in Machines," *AI: A Guide for Thinking Humans*, 2026
- Mollick, "Management as AI Superpower," *One Useful Thing*
- Mollick, "The IT Department: Where AI Goes to Die," *One Useful Thing*
- Venturella, "Mr. Chatterbox," 2026
- Vincent, "Superpowers: How I'm Using Coding Agents," 2025

### Further Reading

- Cohen, "Vibe Analysis" — https://newsletter.dancohen.org/archive/vibe-analysis/
- Heppler, "Vibing Digital History" — https://jasonheppler.org/2026/03/09/vibing-digital-history/
- Mollick, "Claude Dispatch and the Power of Interfaces" — https://www.oneusefulthing.org/p/claude-dispatch-and-the-power-of
- Mullen, "Behind, Ahead" — https://lincolnmullen.com/blog/behind-ahead/
- Raschka, "Components of a Coding Agent" — https://magazine.sebastianraschka.com/p/components-of-a-coding-agent
- Venturella, "Mr. Chatterbox, or, The Modern Prometheus" — https://www.estragon.news/mr-chatterbox-or-the-modern-prometheus/

### Implementation Note

Research missing URLs for Works Cited items during build. Some are books (Laurel, McLuhan) and may link to publisher/WorldCat pages. Others (Furze, Karamanis, Vincent, Mitchell) should have findable web URLs.

## No Audio

No sound effects. Visual-only experience.
