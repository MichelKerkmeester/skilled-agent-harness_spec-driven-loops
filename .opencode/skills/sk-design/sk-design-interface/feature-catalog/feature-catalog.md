---
title: "design-interface: Feature Catalog"
description: "Current-state inventory for design-interface aesthetic direction, delivery gates, interface writing, the foundations token system and adaptation/data discipline, the motion restraint gate and choreography, and private procedure cards."
trigger_phrases:
  - "design-interface feature catalog"
  - "interface design capabilities"
  - "aesthetic direction process"
  - "interface procedure cards"
  - "foundations token system capabilities"
  - "context adaptation matrix"
  - "motion restraint gate capabilities"
  - "motion procedure cards"
last_updated: "2026-07-27"
version: 1.1.0.0
---

# design-interface: Feature Catalog

This catalog inventories the live `design-interface` mode. The mode owns distinctive visual direction and interface-writing judgment, then hands implementation to `sk-code` with proof of grounding, anti-default critique, and delivery gates. It also owns the permanent `foundations` subworkflow (the static visual system of color, type, layout, spacing, hierarchy, responsive adaptation, data visualization, and token vocabulary) and the permanent `motion` subworkflow (the temporal layer: the restraint gate that decides whether an interaction earns motion, then choreography, reduced motion, and the fill-in build cards).

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for interface direction work: register and dials, two-pass grounding and critique, mechanical delivery gates, writing rules, the foundations token system, the context adaptation matrix, data visualization discipline, the motion restraint gate and choreography, the motion build cards, and mode-local procedure cards.

---

## 2. AESTHETIC DIRECTION PROCESS

### Two-Pass Grounding And Critique

#### Description

Ground the subject, brainstorm a brief-specific token system, critique against common AI-default looks, and revise before code or handoff.

#### Current Reality

The mode names subject, audience, and page job, then chooses palette, type, layout concept, and one signature element. Free axes are critiqued against generic looks before implementation handoff.

#### Source Files

See [`aesthetic-direction-process/two-pass-grounding-and-critique.md`](aesthetic-direction-process/two-pass-grounding-and-critique.md) for implementation anchors.

---

### Register And Dials Intake

#### Description

Read the shared Brand-vs-Product register and the variance, motion, and density dials before visual choices.

#### Current Reality

The mode sets posture and internal calibration before recommendations. These values gate density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity.

#### Source Files

See [`aesthetic-direction-process/register-and-dials-intake.md`](aesthetic-direction-process/register-and-dials-intake.md) for source anchors.

---

## 3. TOKEN SYSTEM (FOUNDATIONS)

### OKLCH Color And Token System

#### Description

Build a register-gated color system in OKLCH: primitives, semantic tokens, contrast pairs, surface scale, and dark-mode mapping.

#### Current Reality

The mode reads the shared Brand-vs-Product register first, because that call sets the color strategy and density everything else inherits, then builds OKLCH primitives and semantic token names (`primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`) before implementation values. Contrast is fixed by changing lightness first, dark mode is rebuilt as a separate surface system rather than an inverted palette, and high-chroma OKLCH values are clamped or wrapped with a fallback.

#### Source Files

See [`token-system/oklch-color-and-token-system.md`](token-system/oklch-color-and-token-system.md) for source anchors and the token starter scaffold.

---

### Typography And Spacing Scale

#### Description

Set type roles, pairing, measure, and a spacing scale so layout rhythm and hierarchy read as deliberate rather than accidental.

#### Current Reality

The mode sets display, heading, body, caption, and utility type roles before decorative type moves, and establishes a spacing scale with proximity-based grouping before adding containers, borders, or cards. Content drives breakpoints rather than fixed device sizes.

#### Source Files

See [`token-system/typography-and-spacing-scale.md`](token-system/typography-and-spacing-scale.md) for source anchors.

---

## 4. DELIVERY GATES

### Mechanical Delivery Gates

#### Description

Run binary layout and content checks that catch structural AI tells before delivery.

#### Current Reality

The layout gate counts hero lines, bento cells, eyebrow labels, contrast, and spacing. The content gate checks lorem, AI-tell phrasing, fake precision, copy register, and image-seed discipline.

#### Source Files

See [`delivery-gates/mechanical-delivery-gates.md`](delivery-gates/mechanical-delivery-gates.md) for gate references.

---

### Interface Writing Rules

#### Description

Treat copy as design material: active, end-user-oriented, consistent, and useful across actions, errors, and empty states.

#### Current Reality

The mode applies interface-writing rules so words support usability instead of undercutting the visual system with vague or templated copy.

#### Source Files

See [`delivery-gates/interface-writing-rules.md`](delivery-gates/interface-writing-rules.md) for source anchors.

---

## 5. ADAPTATION AND DATA (FOUNDATIONS)

### Context Adaptation Matrix

#### Description

Adapt a design across device, input method, connection, and posture by rethinking the experience per context rather than scaling pixels.

#### Current Reality

The adaptation matrix reads four dimensions, device and viewport, input method, connection, and posture, then rethinks layout, interaction, content, and navigation per target so a phone, a tablet, and a print export each get a deliberate treatment while core functionality survives every one. Input capability is detected rather than inferred from width.

#### Source Files

See [`adaptation-and-data/context-adaptation-matrix.md`](adaptation-and-data/context-adaptation-matrix.md) for the four adaptation dimensions and worked references.

---

### Data Visualization Discipline

#### Description

Treat chart and table encoding as design: match the chart to the question, keep one variable per visual channel, and align numeric tables for magnitude.

#### Current Reality

A chart type is chosen by the question rather than the dataset shape, every visual channel carries one variable, and color-for-data uses a sequential, diverging, or categorical scale chosen by the question and kept separate from brand color. Numeric tables right-align with tabular numerals so magnitude reads down the column.

#### Source Files

See [`adaptation-and-data/data-visualization-discipline.md`](adaptation-and-data/data-visualization-discipline.md) for chart-type selection and encoding rules.

---

## 6. MOTION AND CHOREOGRAPHY

### Motion Restraint Gate

#### Description

Decide whether an interaction earns motion before any timing, easing, or material choice, using frequency, the keyboard rule, a named purpose, and the register motion-budget dial.

#### Current Reality

The gate runs four checks in order and stops at the first no: a 100-plus-times-a-day action never animates, a keyboard-driven action stays instant, the animation must name one purpose from feedback, orientation, focus, continuity, perceived performance, or earned delight, and the surviving choice must still fit the Brand-vs-Product motion budget. This gate runs first, before any timing or easing choice, and the interface pre-flight card's motion section (`assets/interface-preflight-card.md` Section 10) assumes it has already run.

#### Source Files

See [`restraint-gate-and-choreography/motion-restraint-gate.md`](restraint-gate-and-choreography/motion-restraint-gate.md) for the frequency table, the keyboard rule, and register coupling.

---

### Choreography And Reduced Motion

#### Description

Choreograph timing, easing, and material for motion that survives the gate, keep exits faster than entrances, and define a reduced-motion equivalent that preserves the state change.

#### Current Reality

Feedback motion stays under `300ms`, exit transitions run faster than their matching entrance, `AnimatePresence` exits require a wrapper, an `exit` prop, and a stable key, and `prefers-reduced-motion` swaps movement for instant state, opacity, or color changes without losing the state signal. Performance rules keep animation on the compositor (`transform`, `opacity`), forbid `transition: all`, and require a FLIP-style measure/invert/play sequence for layout-like transitions.

#### Source Files

See [`restraint-gate-and-choreography/choreography-and-reduced-motion.md`](restraint-gate-and-choreography/choreography-and-reduced-motion.md) for timing tiers, `AnimatePresence` rules, and the reduced-motion contract.

---

## 7. MOTION BUILD CARDS

### Motion Fill-In Cards

#### Description

Convert a motion decision that survived the gate into a build-ready spec using named fill-in cards for the common interaction patterns.

#### Current Reality

Cards cover feedback, hover, focus, loading, state transition, toast, page transition, gesture, drag-and-drop, and async state-machine patterns, each naming owner, purpose, states, timing/easing tier, properties, reduced-motion equivalent, and a pass/fail checklist. A card with a blank cell is not ready to hand to `sk-code`.

#### Source Files

See [`build-cards/motion-fill-in-cards.md`](build-cards/motion-fill-in-cards.md) for every card and its required fields.

---

## 8. PROCEDURE CARDS

### Interface Procedure Card Inventory

#### Description

Six private cards support interface-specific planning after public mode selection: discovery questions, aesthetic direction, wireframes, variations, prototypes, and decks.

#### Current Reality

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/interface-procedure-card-inventory.md`](procedure-cards/interface-procedure-card-inventory.md) for the card list and boundaries.

---

### Foundations Procedure Card Inventory

#### Description

Three private cards support foundations-specific evidence gathering after the public mode is selected: component/system inventory, hierarchy/rhythm review, and tweakable design controls.

#### Current Reality

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/foundations-procedure-card-inventory.md`](procedure-cards/foundations-procedure-card-inventory.md) for the card list and boundaries.

---

### Motion Procedure Card Inventory

#### Description

One private card supports motion-specific interaction-state evidence gathering after the public mode is selected: interaction states pass.

#### Current Reality

The mode chooses the card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/motion-procedure-card-inventory.md`](procedure-cards/motion-procedure-card-inventory.md) for the card definition and boundaries.
