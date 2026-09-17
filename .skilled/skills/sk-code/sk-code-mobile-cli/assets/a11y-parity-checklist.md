---
title: A11y Parity Checklist
description: Verify a primitive swap or interaction change in the Pi Remote client preserves accessibility — AT-tree, focus ring, pointer-aware state, overlay isolation, dismissal, target size, and WCAG AA in both themes.
trigger_phrases:
  - "a11y parity checklist"
  - "primitive swap accessibility pi remote"
  - "focus ring data-focus-visible"
  - "aria hide outside overlay"
  - "wcag contrast both themes"
  - "touch target 44px"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# A11y Parity Checklist

Use this when swapping a primitive or changing an interaction — none of the value/render gates
see the AT-tree, focus, roles, or dismissal.

---

## 1. OVERVIEW

### Purpose

A swap can pass the value/render gates and still regress accessibility. This checklist proves
parity explicitly: AT-tree, focus and interaction states, overlay isolation and dismissal,
mutual exclusivity and target size, and contrast in both themes.

### Usage

Work through the sections in order after swapping a primitive or changing an interaction,
before claiming the change preserves accessibility. Check each box, then confirm against THE
GATE.

---

## 2. AT-TREE (role / name / state)

- [ ] Accessible role, name, and checked/expanded/pressed state match the pre-swap primitive
- [ ] Covered by `app-mobile/tests/accessibility.svelte.test.ts` (and the per-surface a11y
  suites) — green

---

## 3. FOCUS AND INTERACTION STATES

- [ ] Focus ring intact — a native-button port keeps `[data-focus-visible]` styling: apply
  `use:focusVisible` from `app-mobile/src/shared/primitives/a11y/interactions.ts` and style via
  `.selector:global([data-focus-visible])`
- [ ] Hover/press via the `use:hover` / `use:press` actions (interactions.ts), styled with
  `.selector:global([data-hovered])` / `:global([data-pressed])` — NOT native `:hover`, which
  sticks after a touch tap (the `hover` action ignores `pointerType === 'touch'`)

---

## 4. OVERLAY ISOLATION AND DISMISSAL

- [ ] Overlays hide the rest of the tree — `hideOutside(...)` from
  `app-mobile/src/shared/primitives/a11y/aria-hide-outside.svelte.ts` marks siblings
  `aria-hidden` (live regions exempt) and restores on close. Covered by
  `app-mobile/tests/dialog-aria-hide-outside.svelte.test.ts`
- [ ] Dismissal works — Escape AND outside-press close the sheet/menu (see the primitive
  `sheet.svelte` and `menu-content.svelte` under `app-mobile/src/shared/primitives`)

---

## 5. MUTUAL EXCLUSIVITY AND TARGET SIZE

- [ ] Radio/toggle mutual exclusivity holds — exactly one option carries the checked state.
  Covered by `app-mobile/tests/effort-sheet-a11y.svelte.test.ts` (the effort radio group)
- [ ] Interactive targets >=44px — the `Do not edit — WCAG target size` floor in
  `app-mobile/src/app.css` (`min-block-size` / `min-inline-size` of 44px) is unbroken; measure
  the swapped control in the rendered catalog

---

## 6. CONTRAST (both themes)

- [ ] WCAG AA holds in light AND dark — `app-mobile/tests/contrast.test.ts` computes the real
  ratio for every foreground/background pair: >=4.5:1 for text, >=3:1 for non-text (focus ring,
  checked border, check mark), asserted per theme

---

## 7. VERIFY

- [ ] `npm run test:web` green — runs the a11y and contrast suites above

---

## 8. THE GATE

Parity holds only when: role/name/state match; the focus ring survives via
`[data-focus-visible]`; hover/press use the pointer-aware actions, not native `:hover`; overlays
isolate via `hideOutside` and dismiss on Escape and outside-press; radio/toggle exclusivity
holds; every target clears the 44px floor; `contrast.test.ts` passes AA in both themes; and
`npm run test:web` is green.
