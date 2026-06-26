---
title: Anti-Patterns And Production Details
description: Anti-slop detection, theming drift, token misuse, copy clarity, pseudo-elements, View Transitions, and production-readiness details.
trigger_phrases:
  - "anti-pattern detection"
  - "AI slop audit"
  - "theming drift"
  - "pseudo-element audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Anti-Patterns And Production Details

This reference catches details that make a UI look generic, fragile, or production-unready.

## 1. Anti-Slop Signals

Use parent `sk-design/references/anti_slop_principles.md` as the shared vocabulary. Common findings:
- Generic cream + serif + terracotta with no subject reason.
- Near-black + one acid accent as the whole identity.
- Hairline broadsheet layout with no editorial premise.
- Repeated glass, blur, glow, mesh gradients, or hero metrics.
- Uniform card grids everywhere.
- Decorative `01 / 02 / 03` labels without sequence.
- Scattered motion instead of one choreographed moment.

## 2. Theming And Tokens

Report:
- Hard-coded colors where semantic tokens exist.
- Dark mode variants missing or failing contrast.
- Primitive tokens used directly in components instead of semantic tokens.
- One-off spacing, radius, shadow, or z-index values.
- Theme switching that leaves stale colors or surfaces.

Map token fixes to `sk-design-foundations` and implementation to `sk-code`.

## 3. UX Copy Clarity

Check interface text:
- Buttons use verb + object (`Save changes`, not `OK`).
- Error messages answer what happened, why, and how to fix.
- Empty states explain value and next action.
- Loading states say what is happening when waits are long.
- Terminology stays consistent.
- Placeholders are not the only labels.
- Humor is avoided in errors.

## 4. Pseudo-Elements

Pseudo-elements should reduce DOM clutter and improve native behavior when used correctly.

Rules (map each finding to P0-P3 by user impact; a broken `content` declaration that hides functional UI is P1, a missed DOM-reduction opportunity is typically P3):
- `::before` and `::after` need `content`.
- Parent needs `position: relative` for absolute pseudo-elements.
- Layering needs z-index discipline so decoration does not cover content.
- Decorative layers should prefer pseudo-elements over extra DOM nodes.
- Pseudo-elements can expand hit targets with negative inset.

## 5. View Transitions

Use native View Transitions for navigation-level shared element changes when supported and when interruption/cancellation constraints fit.

Rules (map each finding to P0-P3 by user impact; an uncancellable transition that traps an interaction-heavy flow is P0-P1, a default crossfade that could be richer is P3):
- Elements need unique `view-transition-name` during the transition.
- Clean up names after transition.
- Style `::view-transition-*` pseudo-elements when default crossfade is not enough.
- Avoid View Transitions for interaction-heavy UI requiring cancellation.

## 6. Production Readiness

Production-readiness findings include:
- Missing empty/loading/error/success states.
- Long text overflow or missing `min-width: 0` in flex/grid.
- Fixed text containers that fail translation expansion.
- RTL issues from physical properties instead of logical properties.
- Offline and slow-network paths missing.
- Client-only validation for server-required constraints.
- Missing alt text, captions, or media controls.

## 7. Finding Owner Map

| Finding type | Owner |
| --- | --- |
| Palette, type, spacing, responsive, theme tokens | `sk-design-foundations` |
| Choreography, micro-interactions, reduced motion | `sk-design-motion` |
| Overall direction or signature visual concept | `sk-design-interface` |
| Implementation changes | `sk-code` |
| Broader correctness/security/test review | `sk-code-review` |
