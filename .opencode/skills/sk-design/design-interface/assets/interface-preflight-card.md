---
title: "Interface Pre-Flight Card"
description: "A mechanical fill-in pass/fail card to run on a built or planned interface before calling it done. Covers hero, bento, eyebrow and meta-label sweep, button contrast, breakpoint overflow, real imagery, copy audit, motion motivation, reduced motion, mobile collapse, and the AI-tell sweep. Every box is binary."
trigger_phrases:
  - "interface pre-flight card"
  - "ui pass fail checklist"
  - "design pre-flight gate"
  - "ai tell sweep card"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Interface Pre-Flight Card

A binary pre-flight card for checking a planned or built interface before delivery.

## 1. OVERVIEW

### Purpose

Turns the sk-design delivery standards into a mechanical pass/fail gate for visual, content, motion, responsive and interaction-state readiness.

### Usage

Set the surface context, then walk each section top-to-bottom against the real render at real breakpoints. A single failed or uncheckable box means the surface is not ready to ship.

---

## 2. SET THE CONTEXT

| Field | Value |
|---|---|
| Surface (page / route / file) | `__________` |
| Register (from `../../shared/register.md`) | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |
| Dials (from `../references/design-process/brief-to-dials.md`) | VARIANCE `___` / MOTION `___` / DENSITY `___` |
| Section count (for the eyebrow math) | `___` |
| Narrowest target width tested | `__________` |

The posture sets how loud the surface may be. The dials set the calibration. Neither relaxes a mechanical box below: a Brand hero may still not overflow, a high-motion page may still not skip reduced motion.

---

## 3. HERO (mechanical_defaults Section 2)

| Check | Pass |
|---|---|
| Headline is 2 lines at desktop (3 at the outside), counted at the narrowest width too | [ ] |
| Container is wide and the clamp ceiling is at or under about 6rem, no hand-inserted `<br>` in the headline | [ ] |
| Subtext is at or under 20 words and 3-4 lines | [ ] |
| Primary CTA is visible without scroll (whole hero fits the first viewport) | [ ] |
| Hero top padding is at or under about 6rem (content does not float halfway down) | [ ] |
| Hero holds at or under 4 text elements (one small label, headline, subtext, CTAs), no trust strip, pricing teaser, or tagline under the CTAs | [ ] |
| Hero has a real visual, not a text-plus-gradient-blob placeholder | [ ] |

---

## 4. BENTO AND GRID (mechanical_defaults Section 3)

| Check | Pass |
|---|---|
| Cell count equals content count exactly, zero empty cells in the middle or at the end | [ ] |
| The column and row interlock is verified, not assumed | [ ] |
| It is a real bento (varied tile size and composition), not a uniform card grid | [ ] |
| Two or more cells carry real visual variation (image, gradient, pattern, tint), not all-text same-color cells | [ ] |
| The grid has rhythm, not six identical left-image right-text rows | [ ] |

---

## 5. EYEBROW AND META-LABEL SWEEP (mechanical_defaults Section 4)

| Check | Pass |
|---|---|
| Eyebrow count is at or under `ceil(sectionCount / 3)`, hero counted as 1 | [ ] |
| No two adjacent sections both carry an eyebrow | [ ] |
| No numbered section markers (`01 / About`, `002 / Capabilities`) unless the section genuinely is an ordered sequence | [ ] |
| No version stamps in the hero (`V0.6`, `BETA`, `INVITE-ONLY`) unless the brief is a launch | [ ] |
| No generic step labels (`Stage 1`, `Phase 01`), no decoration text strip at the hero bottom | [ ] |
| No scroll cues (`Scroll`, `Scroll to explore`), no locale / city / time / weather strip unless the brief is genuinely place-focused | [ ] |
| Middle dot (`·`) rationed to at most one per metadata line, no decorative status dots by default | [ ] |

Count `__` eyebrows against a ceiling of `__`.

---

## 6. BUTTON AND FORM CONTRAST (mechanical_defaults Section 5)

| Check | Pass |
|---|---|
| Every button text passes contrast against its real background (4.5:1 body, 3:1 large), computed against the actual background not white | [ ] |
| Ghost buttons over imagery have a backdrop, scrim, or stroke | [ ] |
| No CTA label wraps to 2+ lines at desktop | [ ] |
| One label per intent across the whole page (nav, hero, footer) | [ ] |
| Form inputs, placeholders, focus rings, helper and error text all pass contrast against the section background | [ ] |
| Label sits above the input, error text below, no placeholder-as-label | [ ] |
| Hit areas are at least 44x44, and expanded hit areas do not overlap neighboring controls | [ ] |

---

## 7. BREAKPOINT OVERFLOW AND MOBILE COLLAPSE (mechanical_defaults Sections 2, 6)

| Check | Pass |
|---|---|
| No text overflows its container at any breakpoint (headline copy tested at every target width) | [ ] |
| A max-width container holds the page, content does not stretch edge to edge on wide screens | [ ] |
| Navigation renders on one line at desktop, height at or under 80px | [ ] |
| Every multi-column section declares its narrow-viewport fallback explicitly | [ ] |
| Viewport-height sections use a dynamic-viewport unit, never a fixed screen height | [ ] |
| At most one repeat per layout family, at most two consecutive zigzag splits, no default split-header | [ ] |
| Icons, play triangles, and icon-text buttons are optically aligned, with tiny nudges where the math looks off | [ ] |

---

## 8. REAL IMAGERY VS PLACEHOLDER (copy_and_mock_data Section 7)

| Check | Pass |
|---|---|
| Real or generated imagery used first, no pure-text page with div-based fake screenshots | [ ] |
| Every placeholder image seed is descriptive and unique, never the literal word `image` or a reused seed | [ ] |
| Apt aspect ratio per slot, not one square reused everywhere | [ ] |
| No div-based fake product UI, no sketchy hand-rolled SVG as a fallback | [ ] |
| No decoration pills or photo-credit captions overlaid on placeholder images | [ ] |
| Every meaningful image has real alt text | [ ] |
| Image edges over variable backgrounds use an inset pure black/white alpha outline, not a tinted stroke | [ ] |

---

## 9. COPY AUDIT (copy_and_mock_data Sections 2, 3, 4, 5, 6)

| Check | Pass |
|---|---|
| No lorem ipsum, no placeholder filler text, no generic or empty alt text | [ ] |
| No banned filler verbs ("Elevate", "Seamless", "Unleash", "Next-Gen"), no exclamation marks in status copy, no "Oops!" errors | [ ] |
| Copy self-audit run over every visible string, every flagged or grammatically broken string rewritten | [ ] |
| No generic person names ("Jane Doe"), no placeholder brands ("Acme"), no repeated avatars or dates as filler | [ ] |
| Sentence case on headers, real logos on any trust wall (not text wordmarks), logos only with no category labels | [ ] |
| Every number is grounded in the brief or marked mock, no invented engineering precision, no fake-perfect round numbers | [ ] |
| One copy register across the surface, matched to the register posture | [ ] |

---

## 10. MOTION MOTIVATION AND REDUCED MOTION (brief_to_dials Section 5)

| Check | Pass |
|---|---|
| Every animation is justified in one sentence (hierarchy, storytelling, feedback, state transition), no motion-for-show | [ ] |
| Motion claimed is motion shown: if MOTION is above 4 the page actually moves, if it cannot ship clean the dial dropped to a low value instead | [ ] |
| At most one horizontal marquee on the page | [ ] |
| Reduced motion alternative present for every animation (crossfade or instant) | [ ] |
| Scroll-driven motion uses a scroll-progress or observer mechanism, not a raw scroll listener | [ ] |
| Reveal animations enhance an already-visible default, content is not gated behind a class-triggered transition that can fail to fire | [ ] |

---

## 11. AI-TELL SWEEP (the cross-cutting last filter)

| Check | Pass |
|---|---|
| Zero em-dash (U+2014) and zero en-dash-as-separator (U+2013) anywhere visible, the only dash is the regular hyphen | [ ] |
| Not a templated default look spent on a free axis (cream + serif + terracotta, near-black + one acid accent, broadsheet hairlines) | [ ] |
| No AI-purple or neon-glow accent by default, one accent color used identically across all sections | [ ] |
| One corner-radius system applied consistently, one page theme (no section flips to inverted mode mid-page) | [ ] |
| No three-equal-card feature row, no hero-metric template (big number, small label, supporting stats, gradient accent) | [ ] |
| No side-stripe borders, no gradient text, no decorative glassmorphism by default | [ ] |
| Icons from one allowed library, no hand-rolled SVG icon paths | [ ] |
| Nested border radii are concentric, with the inner radius reduced by the inset spacing | [ ] |
| If someone could say "AI made that" without doubt, it has failed: reworked until the answer is not obvious from the category alone | [ ] |

---

## 12. INTERACTION STATE MATRIX (stateful surfaces only; else N/A)

Use this section when the surface has interactive states beyond default, including loading/error/empty/disabled states, async fetch, form submit, multi-step flow, optimistic update, or state-transition motion. If the surface is not stateful, mark N/A and skip the boxes. If it is stateful, every box below must pass.

| Applicability | Mark |
|---|---|
| Stateful surface | [ ] |
| N/A: no interactive states beyond default | [ ] |

| Check | Pass |
|---|---|
| states: every distinct state is enumerated, none implicit | [ ] |
| events: every trigger that moves the surface between states is named | [ ] |
| transitions: every event maps to a defined target state, no undefined transition | [ ] |
| forbidden: impossible state combinations are named and structurally prevented | [ ] |
| guards: conditional transitions carry explicit validity, permission, or not-pending conditions | [ ] |
| uiByState: every state has a visible UI representation, including hover/focus/active/disabled where applicable | [ ] |
| recovery: every error or terminal state has a documented way out, no dead end | [ ] |
| a11y: per-state focus targets, async announcements, and disabled semantics are covered | [ ] |
| reducedMotion: state-transition motion has a reduced-motion alternative, or is marked N/A | [ ] |

---

## 13. VERDICT

| Result | Mark |
|---|---|
| All boxes pass | [ ] SHIP |
| One or more boxes fail | [ ] FIX, list the failing box numbers below |

Failing boxes: `__________`

If a single box cannot be honestly checked, the surface is not done. Fix it, then re-run this card.
