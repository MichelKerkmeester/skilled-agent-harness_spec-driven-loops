---
name: animation
description: "sk-code ANIMATION surface: read-only Motion.dev evidence (animation principles, the animate/timeline/scroll/gesture API, a Webflow-vs-Motion decision matrix, integration patterns, and copy-ready snippets) bundled by the hub as a cross-stack overlay."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: motion.dev, motion-dev, animation, animate, timeline, inview, in-view, scroll, stagger, gsap, lenis, easing, cross-stack-animation, surface-evidence, sk-code -->

# animation Surface — Motion.dev Evidence

Read-only **domain evidence** for animation via [Motion.dev](https://motion.dev). Unlike Webflow and OpenCode, this is a **cross-stack overlay**: the hub bundles it whenever an animation intent fires, on top of whichever base surface is detected — a Webflow reveal and a system-code loading state can both draw on it. This packet carries no process; the paired workflow mode owns the build. Detection markers: `motion.dev`, `animate()`, `inview`/`in-view`, `scroll()`, `stagger()`, "motion principles", "cross-stack animation".

## 1. WHEN THE HUB BUNDLES THIS

- The task designs or debugs motion — reveals, staggers, timelines, scroll- or gesture-driven animation, easing/language decisions.
- An `ANIMATION` or `MOTION_DEV` intent fires alongside a base surface (Webflow, OpenCode, or UNKNOWN).
- Evidence-only: nothing here mutates the workspace.

## 2. REFERENCE MAP (`references/`)

- `animation_principles.md` — the motion language (timing, easing, choreography) that governs taste before API.
- `quick_start.md` — install and first-animation path.
- `animate_and_timelines.md` — the `animate()` primitive and sequenced timelines.
- `scroll_and_gestures.md` — `scroll()`, `inView`, and gesture-driven motion.
- `integration_patterns.md` — wiring Motion.dev into a Webflow or system-code host.
- `decision_matrix.md` — when to reach for Motion.dev vs Webflow-native interactions vs GSAP/Lenis.
- `performance_and_pitfalls.md` — frame-budget, compositor-only properties, and the common jank traps.

## 3. SURFACE STANDARDS (the non-negotiables)

- **Principles before API.** Choose the motion language first (`animation_principles.md`); the API is how, not whether.
- **Compositor-only animation.** Animate `transform`/`opacity`; keep off layout-triggering properties. See `performance_and_pitfalls.md`.
- **Right tool per case.** Consult `decision_matrix.md` before adding a dependency — Motion.dev, Webflow interactions, and GSAP/Lenis each own a lane.
- **Respect reduced motion.** Honor `prefers-reduced-motion`; degrade to instant state, never to broken layout.

## 4. ASSETS (`assets/`, copy-ready)

- `install_card.md` — CDN and ES-module bootstraps.
- `playbook_entries.md` — ready patterns mapped to intents.
- `snippets/` — drop-in JS: `in_view_reveal.js`, `stagger_animation.js`, `timeline_sequence.js`, `animate_on_scroll.js`, `hover_gesture.js`, `spring_animation.js`, `layout_transition.js`, `principled_reveal.js`, plus `cdn_bootstrap.js` / `es_module_bootstrap.js`.

Snippets are pulled on demand by the paired workflow mode; they are not part of the initial evidence slice.
