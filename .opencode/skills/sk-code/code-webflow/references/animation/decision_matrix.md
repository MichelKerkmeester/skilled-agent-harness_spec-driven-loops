---
title: "Motion.dev Decision Matrix"
description: "When to choose CSS, Motion.dev, GSAP, or direct Web Animations API for animation work."
trigger_phrases:
  - "motion dev decision matrix"
  - "css vs motion dev"
  - "motion vs gsap choice"
  - "web animations api choice"
  - "smallest animation tool"
importance_tier: normal
contextType: planning
version: 3.5.0.5
---

# Motion.dev Decision Matrix

When to choose CSS, Motion.dev, GSAP, or direct Web Animations API for animation work.

---

## 1. OVERVIEW

### Core Principle

Default to the smallest animation tool that satisfies the current interaction requirements.

### Purpose

This reference gives sk-code a decision path for choosing CSS, Motion.dev, GSAP, or direct WAAPI without turning Motion into a blanket recommendation.

### When to Use

- You need to decide whether Motion is warranted for an animation task.
- You are comparing Motion with CSS, GSAP, or direct Web Animations API.
- You need a short rationale for dependency choice in Motion-related guidance.

### Key Sources

- Official: https://motion.dev/docs/quick-start
- Official: https://motion.dev/docs/gsap-vs-motion
- Official: https://motion.dev/docs/improvements-to-the-web-animations-api-dx
- In-repo: `.opencode/skills/sk-code/code-webflow/references/implementation/animation_workflows/overview_decision_tree_and_css.md`

---

## 2. DECISION TREE

```text
Need animation?
  |
  +-- Static hover/focus/state transition expressible in CSS?
  |     -> Use CSS transition/keyframes first.
  |
  +-- Needs scroll progress, viewport entry, sequencing, interruption, or JS-owned values?
  |     -> Use Motion.dev.
  |
  +-- Needs very large animation timelines, plugin ecosystem, or already-standardized GSAP stack?
  |     -> Consider GSAP.
  |
  +-- Needs one tiny browser-native animation and no Motion benefits?
        -> Direct WAAPI can be enough.
```

This matches the existing local rule: CSS first for simple states; Motion when programmatic control is needed (Repo: `.opencode/skills/sk-code/code-webflow/references/implementation/animation_workflows/overview_decision_tree_and_css.md`). Motion docs support the programmatic side via `animate()`, sequences, `scroll()`, and `inView()` (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/scroll, https://motion.dev/docs/inview).

## 3. MOTION.DEV vs GSAP

| Axis | Motion.dev | GSAP |
|------|------------|------|
| Core fit | Web animation API for JavaScript, React, and Vue with small imports and browser acceleration paths (Source: https://motion.dev/docs/quick-start, https://motion.dev/docs/animate) | Mature animation platform with broad plugins and timeline-heavy workflows (comparison source: https://motion.dev/docs/gsap-vs-motion) |
| Bundle posture | Motion documents mini and hybrid `animate()` sizes and tree-shakable package imports (Source: https://motion.dev/docs/animate) | Use when GSAP is already project-standard or plugin capability is required |
| Local sk-code fit | Existing Webflow code already uses Motion for dropdowns, sliders, hover, hero, and scroll-linked behavior | Existing Webflow guidance also references GSAP; choose only when its capability is earned |
| License | Motion package is MIT according to npm/security package indexes; recheck when compliance matters | GSAP licensing can be project-dependent; verify before commercial plugin use |

Recommendation: choose Motion for the sk-code examples in this packet because the repo already contains Motion patterns and the requested assets are Motion-specific. Choose GSAP only when a real timeline/plugin requirement beats the extra dependency and licensing review.

## 4. MOTION.DEV vs RAW CSS

Use raw CSS when:
- a hover/focus/open/closed state can be expressed with `transition`,
- no JS measurement, sequencing, scroll state, or interruption is required,
- reduced-motion behavior can be handled with media queries alone.

Use Motion when:
- timing is coordinated across multiple DOM nodes,
- animations need JS state, scroll progress, viewport entry, or motion values,
- you need sequence arrays, controls, or interruption behavior (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/scroll, https://motion.dev/docs/inview).

Local examples: `link_grid.js` could be CSS in many stacks, but uses Motion because the current Webflow implementation centralizes interactive color animation through JS. `testimonial.js` earns Motion because it uses drag state, inertia, and snap behavior (Repo: `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, `a_nobel_en_zn/2_javascript/slider/testimonial.js`).

## 5. MOTION.DEV vs Web Animations API

Direct WAAPI is enough when a single DOM element needs a simple browser-native animation and you do not need Motion's import, controls, inferred keyframes, independent transform axes, spring/custom easing, sequences, or interruption behavior.

Motion's WAAPI comparison documents added developer-experience features including spring/custom easing, inferred/default value behavior, a `.finished`/thenable path, seconds-based durations, target-state persistence, `stop()`, partial keyframes, interruption behavior, cubic-bezier array syntax, and independent transforms (Source: https://motion.dev/docs/improvements-to-the-web-animations-api-dx).

Recommendation: use WAAPI directly only for tiny isolated effects. Use Motion when those helpers reduce code or avoid brittle animation-state handling.

## 6. WHY MOTION.DEV

Motion is a strong default for sk-code animation references because:
- official JS docs cover CDN and package-manager usage (Source: https://motion.dev/docs/quick-start),
- it offers `animate()`, sequences, `scroll()`, `inView()`, `hover()`, `press()`, `spring()`, and motion values across vanilla JS surfaces (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/scroll, https://motion.dev/docs/inview, https://motion.dev/docs/hover, https://motion.dev/docs/press, https://motion.dev/docs/spring),
- current repo code already uses both guarded `window.Motion` and dynamic ESM import patterns (Repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/slider/testimonial.js`).

## 7. CONTRACT REGRESSION EXAMPLES

Use these examples when checking future router drift. They are routing contracts, not implementation requests.

| Query | Expected Surface | Expected References |
|-------|------------------|---------------------|
| `Should I use motion.dev or pure CSS for hover states?` | N/A or UNKNOWN | `references/animation/decision_matrix.md`, `references/animation/quick_start.md`; cite the decision tree in this file |
| `For a Webflow page, should scroll reveal use Motion.dev or CSS?` | WEBFLOW | `references/implementation/animation_workflows/overview_decision_tree_and_css.md`, `references/implementation/performance_patterns/overview_and_checklist.md`, `references/animation/decision_matrix.md`, `references/animation/scroll_and_gestures.md` |
| `I'm building vanilla HTML/CSS/JS only, NOT Webflow, and deciding between Motion.dev and WAAPI.` | UNKNOWN or N/A | `references/animation/decision_matrix.md`, `references/animation/performance_and_pitfalls.md`; no `references/*` surface resources for a non-Webflow task |

Expected response shape: give the smallest-tool recommendation first, then name the trade-off. Do not emit directory placeholders such as `references/animation/`.

## 8. REFERENCES AND RELATED RESOURCES

- Motion quick start: https://motion.dev/docs/quick-start
- Motion animate/mini/hybrid/sequences: https://motion.dev/docs/animate
- Motion scroll: https://motion.dev/docs/scroll
- Motion inView: https://motion.dev/docs/inview
- Motion hover/press: https://motion.dev/docs/hover, https://motion.dev/docs/press
- Motion spring: https://motion.dev/docs/spring
- Motion vs GSAP: https://motion.dev/docs/gsap-vs-motion
- Motion vs WAAPI / improvements: https://motion.dev/docs/improvements-to-the-web-animations-api-dx
- Local Webflow animation decision rule: `.opencode/skills/sk-code/code-webflow/references/implementation/animation_workflows/overview_decision_tree_and_css.md`
- Local Motion usage anchors: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/slider/testimonial.js`
