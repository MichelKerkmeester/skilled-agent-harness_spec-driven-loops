---
title: Design Token Vocabulary
description: Shared vocabulary for color, typography, layout, spacing, elevation, motion, and state tokens across the design skill family.
trigger_phrases:
  - "design token vocabulary"
  - "token system terms"
  - "color type layout tokens"
  - "shared design tokens"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Design Token Vocabulary

Shared naming for color, typography, layout, elevation, motion, and state tokens across the design skill family.

---

## 1. OVERVIEW

### Purpose

Keep token language consistent when design children discuss visual systems, so a term means the same thing across interface, foundations, motion, and audit work.

### Usage

Use these terms when naming or critiquing tokens. Children own the detailed math and implementation guidance behind each token.

---

## 2. Color Tokens

- **Canvas**: the dominant surface color behind content.
- **Surface**: cards, panels, sheets, and contained regions placed on the canvas.
- **Text primary**: the highest-emphasis reading color.
- **Text secondary**: lower-emphasis supporting copy.
- **Accent**: the brand or action color that carries emphasis.
- **Signal**: semantic feedback color such as success, warning, danger, or info.
- **Border**: structural line color for separation without heavy fill.
- **Overlay**: scrim, modal, tooltip, or floating-layer color.

---

## 3. Typography Tokens

- **Display**: large expressive text for moments of identity.
- **Heading**: structural section titles and page hierarchy.
- **Body**: primary reading text.
- **Caption**: metadata, helper text, labels, and dense details.
- **Utility**: navigation, buttons, tabs, badges, and compact control text.
- **Measure**: comfortable line length for reading.
- **Tracking**: letter spacing used intentionally, usually sparingly.

---

## 4. Layout and Spacing Tokens

- **Grid**: the macro alignment system.
- **Cluster**: a group of related controls or content items.
- **Stack**: vertical rhythm between related elements.
- **Inset**: padding inside a component or region.
- **Gap**: space between sibling elements.
- **Breakout**: a deliberate element that crosses the normal grid to create emphasis.
- **Density**: how much information appears in a given area.

---

## 5. Elevation and Shape Tokens

- **Radius**: corner treatment and softness.
- **Shadow**: depth cue, not decoration by default.
- **Stroke**: border width and emphasis.
- **Layer**: z-axis ordering for sticky bars, popovers, modals, and overlays.
- **Material**: the combined surface behavior: flat, tactile, translucent, recessed, or raised.

---

## 6. Motion and State Tokens

- **Duration**: time a transition takes.
- **Easing**: acceleration curve and perceived weight.
- **Delay**: intentional offset in a sequence.
- **Choreography**: ordered relationship between moving parts.
- **State**: default, hover, focus, active, selected, loading, disabled, error, or success.
- **Reduced motion**: alternate behavior for motion-sensitive users.

---

## 7. Token Quality Checks

- Each token should have a role, not just a value.
- Similar tokens should collapse unless they express distinct meaning.
- Names should describe purpose before appearance.
- Implementation tokens should trace back to design intent.
