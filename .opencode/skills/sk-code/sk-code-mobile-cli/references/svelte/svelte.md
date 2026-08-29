---
title: Svelte Runtime Correctness — Effects and Accessibility
description: Entry point for the two ways a Pi Remote component misbehaves at runtime while every gate stays green — a $effect that invalidates itself, and the accessibility contract the react-aria to bits-ui swap silently dropped.
trigger_phrases:
  - "effect loop self invalidation"
  - "untrack svelte runes"
  - "bits-ui accessibility parity"
  - "focus ring hover state svelte"
  - "component misbehaves at runtime"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Svelte Runtime Correctness — Effects and Accessibility

Both contracts here cover the same failure shape: **the component renders, the suite passes, and the
behaviour is still wrong.** Neither defect is visible to typecheck, to a screenshot, or to a token
gate, which is why each has its own written contract and its own audit checklist.

---

## 1. START HERE — PICK BY THE SYMPTOM

| Symptom | Read |
|---|---|
| A view freezes, oscillates, double-fetches, or cancels its own in-flight work | [`svelte-runes-effects.md`](svelte-runes-effects.md) |
| Hover, focus ring, dismissal, roles or the AT tree behave wrong after a primitive swap | [`a11y-parity.md`](a11y-parity.md) |

---

## 2. THE EFFECT TRAP

A `$effect` that dispatches into state it also reads becomes its own dependency: the sync dispatch
reads the `$state` it reduces, the async one rewrites it, the effect re-invalidates, and the cleanup
cancels the work still in flight. `untrack` around the dispatch is the fix.

Two things make this hard to find. **The dispatch is often indirect** — routed through an API method
rather than a literal `dispatch(` call — so grepping for the obvious pattern misses instances. And
**fixing one effect does not clear the file**: the same file has produced a second instance after a
first was fixed. Audit every ported effect, and trace what the methods it calls actually do.

---

## 3. THE ACCESSIBILITY CONTRACT

The react-aria → bits-ui primitive swap regressed the accessibility contract systemically, and no
objective gate could see it — not token identity, not the CDP render gates, not the backend suite.
Focus management, roles, the AT tree and dismissal behaviour are simply outside what those measure.

The specific trap worth carrying: a native-button port breaks `[data-hovered]` and
`[data-focus-visible]` styling, focus ring included. **The faithful fix is the
`use:hover` / `use:press` / `use:focusVisible` actions plus `.sel:global([data-*])`** — not native
`:hover`, which sticks after a tap on touch.

---

## 4. WHY BOTH NEED THEIR OWN AUDIT

A green suite is not evidence for either of these. Use the bundled checklists —
`assets/runes-effect-audit-checklist.md` and `assets/a11y-parity-checklist.md` — and negative-control
whatever check you rely on: break the behaviour, watch the check go red, restore, watch it go green.
A check that has never failed has proven nothing.

---

## 5. RELATED REFERENCES

- [`../design-system/scoped-style-ownership.md`](../design-system/scoped-style-ownership.md) — the rendering side of the same components, and why `:global()` is needed for state selectors.
- [`../storybook/storybook.md`](../storybook/storybook.md) — the catalog's a11y panel, and seeing each surface in isolation.
- [`../verification/browser-free-verification-recipe.md`](../verification/browser-free-verification-recipe.md) — the gates that cannot see either defect, and what they do cover.
- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — where the inline WHY justifying each `untrack` is required to live.
