---
title: "Brief to Dials (the Design Read intake)"
description: "A structured Design Read that reads a brief into three working dials, variance, motion, and density, and maps each dial to concrete layout, motion, and density choices, with use-case presets. Defers the Brand-vs-Product posture to the shared register and stays an intake, never a style chooser."
trigger_phrases:
  - "design read intake"
  - "variance motion density dials"
  - "brief to dial values"
  - "use case dial presets"
  - "design dial inference"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Brief to Dials

Before choosing a palette or a layout, read the brief into a small set of working values. The aesthetic direction in `design_principles.md` decides what is distinctive. This intake decides how much variance, motion, and density the surface should carry, so the direction has a calibrated starting point instead of a silent default. Three dials hold those values: variance, motion, and density. Set them from the brief, state them, and let every downstream layout, motion, and density choice answer to them.

This is an intake, not a chooser. The dials are working calibration the agent sets by reading the brief, never a menu of styles the user picks from and never a preset that survives across briefs. A choosable style axis is exactly the templated default the skill exists to resist. Read the brief, set the values, build, and adjust the values conversationally if the work calls for it.

The posture decision comes first and it lives elsewhere. Whether the surface is a Brand surface (design is the product) or a Product surface (design serves the product) is set in `../../../shared/register.md`, and that decision gates density, the motion budget, color dosage, copy register, anti-slop strictness, and audit severity. This intake defers the posture to the register and works the three dials within it. Set the register first, then read the dials.

---

## 1. OVERVIEW

### Core principle

A brief carries signals about how expressive, how kinetic, and how packed a surface should be. The model tends to ignore those signals and reach for one middle-of-the-road default. The Design Read makes the signals explicit: name the subject and the page's one job, read the posture from the register, then set three dials the rest of the work answers to.

### When to use

- At the start of any interface task, after the register posture is set and before the token system is brainstormed.
- When a brief is ambiguous about how loud or dense the surface should be, the dials force the ambiguity into a stated value rather than a silent guess.

### The dials, named once

Use these exact names everywhere downstream. Never invent aliases.

- **VARIANCE.** How far the composition departs from symmetry. Low is calm and symmetrical, high is asymmetric and expressive.
- **MOTION.** How much the surface moves. Low is static, high is cinematic and physics-driven.
- **DENSITY.** How packed the surface is. Low is airy and gallery-like, high is information-dense.

Each runs on a 1 to 10 feel. The numbers are calibration for the agent, not a UI the user edits.

---

## 2. THE DESIGN READ (INTAKE BEFORE DIALS)

Capture these before setting any dial. Capture only what is present, do not invent a brief.

1. **Subject and audience.** Name one concrete subject, who it is for, and the single job of the page. If the brief does not pin this, pin it yourself and state the choice. Distinctive choices come from the subject's own world, so this anchors everything.
2. **Posture.** Read the Brand-vs-Product register (`../../../shared/register.md`). Brand surfaces (landing, campaign, portfolio) and Product surfaces (dashboard, admin, tool) start from different dial centers, the register owns that call.
3. **Pinned axes.** Note any axis the brief fixes outright (a named palette, a named typeface, a fixed layout). A pinned axis is followed exactly and is not subject to the dials, the dials only calibrate the free axes.
4. **Existing system.** Note any design system, brand tokens, or component patterns already present. When a system exists, ground in it and spend the one justified risk within it.

State a one-line Design Read before generating, for example: "Premium consumer cookware landing, Brand posture, palette free, no existing system, leaning expressive and mid-density." That one line makes the calibration auditable.

### If the brief is genuinely ambiguous

Ask one focused question, do not guess across a wide gap. One question that resolves the posture or the single biggest free axis is worth more than a generated guess that has to be redone.

---

## 3. DIAL INFERENCE (READ THE BRIEF INTO VALUES)

Map the brief's own language to dial values. These are starting points, the Design Read overrides them when the subject calls for it.

| Brief signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| minimalist, clean, calm, editorial, Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer, Apple-like, luxury, brand | 7-8 | 5-7 | 3-4 |
| playful, experimental, agency, award-show | 9-10 | 8-10 | 3-4 |
| landing page, portfolio, marketing site (general) | 7-9 | 6-8 | 3-5 |
| trust-first, public-sector, regulated, accessibility-critical | 3-4 | 2-3 | 4-5 |
| redesign, preserve the existing feel | match existing | existing +1 | match existing |
| redesign, overhaul the existing feel | existing +2 | existing +2 | match existing |

When the brief carries more than one signal, let the posture and the subject break the tie. A "playful public-sector" brief is a contradiction to resolve with one question, not to average into a flat 6.

---

## 4. USE-CASE PRESETS (STARTING CENTERS)

When the brief maps cleanly to a common use case, start from these centers and adjust from the Design Read. These are starting centers, not locked styles.

| Use case | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| Landing, mainstream SaaS | 7 | 6 | 4 |
| Landing, agency or creative | 9 | 8 | 3 |
| Landing, premium consumer | 7 | 6 | 3 |
| Portfolio, designer or studio | 8 | 7 | 3 |
| Portfolio, developer | 6 | 5 | 4 |
| Editorial or blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |
| Redesign, preserve | match | match +1 | match |
| Redesign, overhaul | existing +2 | existing +2 | match |

A general center when nothing else fits is a mid-high variance, mid motion, low-mid density (around 8 / 6 / 4). Use it only when the brief gives no stronger signal, and still state it.

---

## 5. HOW THE DIALS DRIVE OUTPUT

The dials are global calibration. Every layout, motion, and density decision answers to them, so they are worth setting deliberately.

### VARIANCE drives layout

- **High variance (above 4).** Avoid the centered hero and the symmetrical grid. Reach for a split-screen hero, a left-aligned content with a right-aligned asset, asymmetric whitespace, or scroll-pinned structure. The centered hero is reserved for an editorial or manifesto brief where the message itself is the composition.
- **Low variance.** Symmetry is legitimate and calm. Precision in spacing and type carries the work, since there is no asymmetric move to lean on.
- Variance never licenses a broken layout. The mechanical rules in `mechanical_defaults.md` hold at every variance value, asymmetry is a composition choice, not permission to overflow a hero or leave a dead bento cell.

### MOTION drives the motion budget

- **The motion budget is owned by the register posture first.** A Brand surface gets one rehearsed entrance and earned scroll moments, a Product surface gets short state transitions and no page-load choreography. Read `../../../shared/register.md` for the budget, then use the MOTION dial to set intensity within it.
- **Motion claimed is motion shown.** If MOTION is above 4, the surface actually moves: an entry transition on the hero, a scroll reveal on key sections, hover feedback on the CTAs at minimum. A static page claiming a high motion value is broken. If working motion cannot ship in the available scope, drop the dial to a low value and ship a clean static page rather than half-built motion that breaks.
- **Every animation is motivated.** Before adding motion, name what it communicates: hierarchy, storytelling, feedback, or a state transition. "It looked cool" is not a reason. If the reason does not fit in one sentence, drop the animation. Motion that cannot be justified is the tell, not motion itself.
- **Reduced motion is not optional.** Every animation needs a reduced-motion alternative, a crossfade or an instant transition. This holds at every MOTION value above the floor.

### DENSITY drives content and layout packing

- **The density center is owned by the register posture first.** A Brand surface earns its whitespace and leaves room for one big move, a Product surface is efficient and information-dense where the task needs it. Read the register, then use the DENSITY dial to set the level within the posture.
- **Low density.** Generous whitespace, few elements per section, one visual or one CTA per section. Cut ruthlessly, a landing page lives on the first impression, not the full read.
- **High density.** Information-dense layouts are legitimate for data surfaces, but density is earned by the task, not by filling space. At high density, generic card containers give way to plain breathing layout, and a long list reaches for the right component (a grouped split, a card grid, tabs, a carousel) rather than a longer list.
- Density never licenses a data-dump. A 20-row table or a giant matrix on a marketing surface is the wrong layout at any density, route the breadth to the right component or a different page.

---

## 6. ADJUSTING AND RECORDING THE DIALS

- **Adjust conversationally, never through a settings UI.** If the work reveals the surface should be calmer or more kinetic, change the value and say so. The dials are the agent's calibration, the user steers it with plain language.
- **State the values once, up front.** The one-line Design Read carries them. This makes the calibration auditable and keeps the agent honest about whether it reasoned from the brief or silently used a center.
- **The dials are not a style menu.** Never surface variance, motion, and density to the user as choosable knobs or a pick-a-vibe axis. They are an internal read of the brief. The moment they become a reusable preset the user selects, the intake has become the templated default the skill resists.
- **The posture still wins.** Where a dial value and the register posture disagree, the register posture sets the budget and the dial sets the intensity within it. Read the register first, always.

---

## 7. RELATED RESOURCES

- [`../../../shared/register.md`](../../../shared/register.md) owns the Brand-vs-Product posture that gates density, motion budget, color dosage, copy register, and severity. Read it first, this intake defers the posture to it.
- [`design_principles.md`](./design_principles.md) owns the aesthetic direction, the two-pass process, and the anti-default mandate. The dials calibrate, the principles decide what is distinctive.
- [`mechanical_defaults.md`](./mechanical_defaults.md) owns the layout gate that holds at every dial value.
- [`copy_and_mock_data.md`](./copy_and_mock_data.md) owns the content gate, including the one-copy-register rule the posture sets.
- [`variation_diversity.md`](./variation_diversity.md) owns the seed-of-thought debias when a brief asks for two or more directions at once. The dials calibrate one direction, that reference spreads several.
