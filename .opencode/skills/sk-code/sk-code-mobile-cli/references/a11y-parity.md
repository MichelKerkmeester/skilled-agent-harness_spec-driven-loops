---
title: The react-aria to bits-ui Accessibility Parity Contract
description: The accessibility contract the react-aria to bits-ui primitive swap must preserve, and the Svelte-action fix that keeps interaction state, focus, and dismissal faithful across touch and both themes.
trigger_phrases:
  - "a11y parity contract"
  - "react-aria to bits-ui swap"
  - "data-hovered focus-visible styling"
  - "use:hover use:press action"
  - "aria hide outside overlay"
  - "touch hover sticks after tap"
  - "wcag aa both themes 44px target"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The react-aria to bits-ui Accessibility Parity Contract

The Pi Remote phone app migrated its interactive controls off `react-aria-components` onto bits-ui
primitives plus native elements. bits-ui gives the widget roles and keyboard model, but the swap does
not carry the accessibility guarantees for free. This reference is the contract the swap must preserve
and the Svelte-action fix that preserves it.

---

## 1. OVERVIEW

### Core Principle

Swapping a primitive family silently regresses the assistive-technology contract. The AT-tree, focus
order, roles, and dismissal behavior change with the swap, and **no token, CDP, or backend gate can
see any of it** — those gates read resolved colors, structural mounts, and API responses, never the
accessibility tree. Parity is verified by reading the code and by the shape of the fix, not by a
green gate.

### When to Use

- Porting a control off `react-aria-components` to a bits-ui primitive or a native element
- A hover, press, or focus style stopped working, or a focus ring vanished, after such a port
- A touch tap leaves a control stuck in its hover appearance
- An open sheet or menu still lets a screen reader reach the background

### Key Sources

- `app-mobile/src/shared/primitives/a11y/interactions.ts`
- `app-mobile/src/shared/primitives/a11y/aria-hide-outside.svelte.ts`
- `app-mobile/src/shared/primitives/a11y/README.md`

---

## 2. THE INVISIBLE REGRESSION

The primitive swap regresses four things that every objective gate is blind to:

| Contract | What breaks on a naive swap | Who must restore it |
| --- | --- | --- |
| Roles / accessible name | native element or bits-ui default replaces the react-aria role | the primitive wrapper or the consuming surface |
| Focus movement | entry, looping, and restoration are not carried by the helper | the overlay primitive or its caller |
| Dismissal | Escape / outside-click is not implied by a native element | the owning menu or sheet |
| Outside content | background stays in the AT-tree while an overlay is open | `hideOutside` plus a live session |

Treat any such port as a parity task, not a cosmetic one. The `a11y/README.md` table lists, row by
row, what the helpers guarantee versus what the caller must still supply.

---

## 3. INTERACTION STATE — THE FOUR ACTIONS

Native-button and native-element ports break `[data-hovered]` and `[data-focus-visible]` styling and
the focus ring, because those data attributes were emitted by react-aria and no longer exist. The
faithful fix is the four Svelte actions in `interactions.ts`, attached to the control's own element:

- `use:hover` — sets `data-hovered`, but only for non-touch pointers, so a tap never leaves CSS
  `:hover` stuck on a touch device.
- `use:press` — sets `data-pressed` across pointer and keyboard (Enter / Space) activation.
- `use:focusVisible` — sets `data-focus-visible` only when `:focus-visible` matches, preserving
  keyboard-only focus indication (the focus ring).
- `use:focused` — sets `data-focused` regardless of input modality.

Style these states from the **consuming** component with `.selector:global([data-*])`, never with a
native `:hover`. Native `:hover` is the exact bug the actions exist to avoid — it sticks after a tap
on touch. `app-mobile/src/shared/primitives/button/button.svelte` attaches all four actions to its
native `<button>`; a consumer such as `app-mobile/src/pages/chat/artifacts/card-artifact.svelte`
styles the states with `.artifact-card:global([data-hovered])`,
`.artifact-card:global([data-pressed])`, and a `.artifact-card:global([data-focus-visible])` focus
ring (`outline` on `--focus`, never color-only).

---

## 4. OVERLAY ISOLATION

An open overlay must hide the rest of the page from assistive technology. That is the one reusable
helper: `hideOutside(targets)` in `aria-hide-outside.svelte.ts`. It applies `aria-hidden="true"` to
every unrelated body element, exempts each target's subtree and ancestors, preserves live regions
(`aria-live` and `alert` / `log` / `status` / `timer` roles), observes body mutations so late-mounted
background content is hidden too, and restores only the attributes it changed when the returned
release function runs. It is nested-session aware, so multiple overlays stack safely.

`hideOutside` does one job. It does **not** move, trap, or restore focus, and it does **not** dismiss.
The owning menu or sheet still supplies focus entry / looping / restoration and its Escape and
outside-click behavior. Keep the release function alive until the overlay closes.

---

## 5. VISUAL ACCESSIBILITY

Two visual guarantees survive the swap only if the surface owns them:

- **Contrast.** Every meaningful foreground/background pair must meet WCAG AA in **both** themes —
  `4.5:1` for normal text, `3:1` for non-text indicators (focus ring, checked border, check mark).
  `app-mobile/tests/contrast.test.ts` proves this by arithmetic (`NORMAL_TEXT = 4.5`,
  `LARGE_OR_NON_TEXT = 3`), and asserts a color is never the sole indicator when it fails `3:1`.
- **Hit target.** Interactive controls need at least a `44px` touch target. The same test asserts
  `min-inline-size: 44px` / `min-block-size: 44px` on the real control selectors; the a11y helpers
  emit no dimensions, so the surface owns them.

`contrast.test.ts` runs inside `npm run test:web` — that is the gate for both guarantees.

---

## 6. RELATED REFERENCES

- `browser-free-verification-recipe.md` — why screenshots cannot prove color values, and the token
  and CDP gates that verify what a11y styling still cannot.
- `ds-grammar.md` — the `@ds guardrail: do-not-edit` seams that mark these frozen accessibility lines.
- `component-story-upkeep.md` — the Storybook catalog whose a11y panel checks each surface in isolation.
