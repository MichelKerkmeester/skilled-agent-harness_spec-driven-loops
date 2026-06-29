---
title: AI Fingerprint Tells
description: Model-specific defect catalog turned into checkable P0-P3 findings. Codex tells, Gemini tells and 2026-general tells that prove a surface was AI-generated.
trigger_phrases:
  - "AI fingerprint tells"
  - "model specific design defect"
  - "codex design tell"
  - "looks AI generated audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# AI Fingerprint Tells

This reference turns "it feels AI-made" into named, checkable findings. Each tell below is a structural pattern that an image generator or coding model reaches for by reflex, so its presence is strong evidence the surface was machine-authored without revision. Detect the pattern, file a P0-P3 finding and route it to an owner.

The shared anti-slop vocabulary and the general slop signals live in `anti_patterns_production.md` section 1. Do not re-list those here. This file is the model-specific layer underneath them: the tells that point at a particular generator and that a reviewer can grep or eyeball with a concrete rule. The severity model and findings schema are in `audit_contract.md`. The audit reports these tells, it does not rewrite the element, which is `sk-code` work once the user accepts the fix.

Structured mirror: `../assets/ai_fingerprint_registry.json` carries one machine-checkable row per tell, `../assets/ai_fingerprint_self_defect_card.md` carries one self-audit prompt per row and `../../shared/scripts/ai-fingerprint-registry-check.mjs` verifies catalog-to-registry parity.

---

## 1. HOW TO USE THIS CATALOG

1. Resolve the surface to source or rendered evidence.
2. Walk each tell below and check the concrete rule.
3. For every hit, write a finding with the exact element as evidence, the user impact and the owner.
4. Most tells land in the Anti-Patterns dimension of the five-dimension score. A few touch Theming or Performance, noted per tell.
5. A single tell is usually P2 or P3. A gallery of three or more tells on one surface is the Anti-Patterns dimension failing, which is at least P1.

Severity rule of thumb: one isolated tell with a clean rest-of-surface is P3 polish. A tell that defines the whole identity, or three or more tells together, is P1. A tell that also breaks a real user task (an over-rounded control that clips its own label, a stripe background that tanks contrast) climbs to P0 on the task-failure, not on the tell alone.

---

## 2. CODEX TELLS

These are the most frequent giveaways from the Codex lineage. Each one is match-and-refuse in authoring, which makes it match-and-file in audit.

### 2.1 Ghost-card border plus shadow

The pattern is a `1px solid` border and a soft wide drop shadow on the same element, usually a card or a button. The two treatments fight: a border says hard edge, a wide blur says floating, and pairing both as decoration is the tell.

- Check: any element with `border: 1px solid` and `box-shadow` whose blur radius is 16px or more, together on one element.
- Owner: `foundations` for the token decision, `sk-code` for the change.
- Severity: P2 in isolation, P1 when it repeats across a card grid.

### 2.2 Over-rounded cards

Cards, sections and inputs at `border-radius` 24px and above. Cards top out around 12 to 16px. Full-pill is fine on tags and buttons, but a 28px or 32px or 40px radius on a card is the over-round reflex, and no real brand asks for "insanely rounded."

- Check: `border-radius` of 24px or more on a card, section, panel or text input.
- Owner: `foundations`.
- Severity: P3 in isolation, P2 when systemic. Climbs to P1 if the radius clips content or a focus ring.

### 2.3 Sketchy SVG illustration

Hand-drawn or doodle-style SVG meant to depict a real subject. Tells include class names like `loose-sketch`, `doodle` or `wavy`, paper-grain filters built from `feTurbulence` or `feDisplacementMap`, plus crude five-to-thirty-path scenes standing in for a tangible object. These read as amateurish, not whimsical.

- Check: SVG with sketch or doodle class names, turbulence or displacement filters used as grain, low-path crude scene illustrations.
- Owner: `interface` for the direction call (ship a real asset or ship none), `sk-code` to remove.
- Severity: P2, because it undercuts trust in the whole surface.

### 2.4 Diagonal stripe background

Repeating diagonal stripes painted into a `body` pseudo-element or a section background, usually through `repeating-linear-gradient`. Pure decoration with no information and a Codex signature.

- Check: `repeating-linear-gradient` used as a section or body background.
- Owner: `interface` for direction, `sk-code` to remove.
- Severity: P3, unless the stripes drop text contrast below the threshold in `accessibility_performance.md`, which makes it P1 on contrast.

### 2.5 Element-tracking on display type

Display headings with letter-spacing tighter than -0.04em. The Codex default drifts to -0.05em through -0.085em on display H1s, which makes the letters touch and reads as cramped rather than designed. The floor is -0.04em, and -0.02em to -0.03em is plenty for tight grotesque display.

- Check: `letter-spacing` tighter than -0.04em on a display or hero heading.
- Owner: `foundations`.
- Severity: P3, or P2 when it forces letters to collide and hurts legibility.

### 2.6 Theater / meta-criticism copy

Copy that criticizes a product surface by calling it a kind of "theater" instead of naming the concrete user harm. Phrases like "design theater", "engagement theater" or "strategy theater" sound incisive but often dodge the actual evidence: what is ornamental, what misleads the user and what should change. This is a Codex tell when the page or critique leans on meta-criticism as the voice.

- Check: body copy containing a word followed by `theater` as meta-criticism copy.
- Owner: `interface`.
- Severity: P2, because the voice can flatten judgment into posture.
- Advisory: a live hit is flag-and-confirm. Legitimate phrases such as "movie theater" or "home theater" are false positives unless the surrounding copy is clearly meta-criticism.

---

## 3. GEMINI TELLS

### 3.1 Image-hover animation

Any `transform` on the `:hover` of an `<img>`, or a parent-hover pattern that scales, rotates or translates a child image. This is the most common Gemini motion tell. It adds no information because the image is not an action target, and it reads as motion added because the tool could. Card hover feedback belongs on the card background, border or shadow, never on the image and never through the image's parent.

- Check: `:hover` transforms on `img`, or any parent-hover utility that animates a child image.
- Owner: `motion` for the interaction decision, `sk-code` to change.
- Severity: P2, because it signals reflex motion across the surface.

---

## 4. 2026-GENERAL TELLS

These are not tied to one model. They are the saturated defaults of the current generation, so they appear across generators regardless of the brief. That cross-brief uniformity is what makes them tells.

### 4.1 Cream or sand body background

The warm-neutral near-white body background is the saturated default of 2026. The whole band of light warm-tinted neutrals reads as cream, sand, paper or parchment no matter what the token is named, and token names like `--paper`, `--cream`, `--sand`, `--bone`, `--linen` or `--ivory` are tells in themselves. A brief that asks for warm, traditional or magazine-warm does not justify it. Warmth belongs in the accent, the type and the imagery, not in a default warm-tinted body.

- Check: a body or page background in the light warm-neutral band, or a warm-paper token name used as the page background.
- Owner: `foundations`.
- Severity: P2, because it sets the generic tone for the entire surface. P1 when paired with two or more other tells.

### 4.2 Eyebrow above every section

A tiny uppercase tracked label sitting above every section heading. The small all-caps kicker with wide tracking was a 2023 device and is now the saturated AI scaffold, appearing above most generated sections regardless of brief. One named kicker as a deliberate brand system is voice. An eyebrow on every section is AI grammar.

- Check: a small uppercase tracked label repeated above three or more section headings.
- Owner: `interface` for the cadence decision, `foundations` if it is a token-level type style.
- Severity: P2.

The numbered variant (`01 / 02 / 03` markers above every section) is the same reflex one tier deeper. Numbers earn their place only when the section genuinely is an ordered sequence and the order carries information. Numbered eyebrows on every section are AI grammar, same severity as the plain eyebrow.

### 4.3 Uniform section fade-and-rise

One identical entrance animation applied to every section: fade in and rise on scroll, same distance, same easing, same trigger, top to bottom. The tell is the uniform reflex, not motion itself. Staggering items within one list is legitimate, and each reveal should fit what it reveals. Suppressing the reflex is never a reason to ship a page with no motion at all.

- Check: the same scroll-triggered fade-and-rise applied uniformly to most or all top-level sections.
- Owner: `motion`.
- Severity: P2. Climbs to P1 if the reveal gates content visibility so the section ships blank on a hidden tab or a headless render, because that is a content-delivery failure, not a motion taste issue.

---

## 5. EVIDENCE AND LABELING

- Cite the exact element, selector, file and line, rendered observation for each tell.
- A tell found by reading source is a confirmed finding. A tell suspected from a screenshot without the underlying code is an inferred finding, so label it inferred and state that the source would confirm it.
- Do not claim a detector, overlay or browser scan ran unless it actually ran.
- A clean pass on this catalog means no model-specific tells were found. It does not mean the design is distinctive. Pair it with the critique lens in `critique_hardening.md` for the judgment call on hierarchy, voice and flow.
