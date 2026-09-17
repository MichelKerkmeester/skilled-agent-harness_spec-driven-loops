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

Two runtime defects share one shape: the component renders, the suite passes, and the behaviour is still wrong.

---

## 1. OVERVIEW

### Core Principle

Both defects here share a shape: **the component renders, the suite passes, and the behaviour is
still wrong.** Prefer pure derivation over `$effect`, and treat an accessibility contract as
something you read the code for — no token, CDP, or backend gate can see either failure, because
they read resolved colours, structural mounts and API responses, never the effect graph or the
assistive-technology tree.

### When to Use

- Porting a React `useEffect` to `$effect` and it loops, refetches, or freezes
- An effect that dispatches into a store or reducer and then re-runs
- Auditing the remaining effects in a file after fixing one of them
- A `@testing-library/svelte` test behaving differently from its React original
- Porting a control off `react-aria-components` to a bits-ui primitive or a native element
- A hover, press, or focus style stopped working, or a focus ring vanished, after such a port
- A touch tap leaves a control stuck in its hover appearance
- An open sheet or menu still lets a screen reader reach the background

### Key Sources

- `app-mobile/src/shared/state/turns.ts` — derive, don't effect
- `app-mobile/src/routes/+layout.svelte` — two `untrack`ed dispatches, with the WHY inline
- `app-mobile/src/shared/commands/host-command-catalog.svelte.ts` — mount and reconnect effects
- `app-mobile/src/shared/primitives/a11y/interactions.ts`
- `app-mobile/src/shared/primitives/a11y/aria-hide-outside.svelte.ts`
- `app-mobile/src/shared/primitives/a11y/README.md`
- `assets/runes-effect-audit-checklist.md`, `assets/a11y-parity-checklist.md`

---

## 2. WHAT AN EFFECT TRACKS

A `$effect` tracks every reactive read that executes during its run, including reads inside any
function it calls. A `dispatch(...)` is not inert: a synchronous reducer runs during the effect, and
every `$state` that reducer reads becomes a dependency of the effect. The dependency is invisible at
the call site — the effect body may show only `dispatch({ type: '…' })`, yet it now depends on
whatever that reducer touched.

---

## 3. THE SELF-INVALIDATION TRAP

Two shapes both make an effect cancel its own work:

- **Synchronous dispatch into read state.** The reducer reads the `$state` it reduces. That read is
  tracked, so the dispatch mutates a dependency of the effect. The effect re-invalidates, its cleanup
  runs, and any in-flight work the effect started (a fetch, a socket handshake) is aborted mid-flight.
- **Async dispatch that rewrites state.** The dispatch completes later and rewrites the same state.
  The effect re-invalidates on the rewrite, cleans up, and cancels — the same loop, one turn later.

Left uncontrolled, this froze device authentication and oscillated the session roster in
`app-mobile/src/routes/+layout.svelte`, and double-fetched the command catalog in
`app-mobile/src/shared/commands/host-command-catalog.svelte.ts`.

---

## 4. THE FIX: UNTRACK

Wrap the dispatch in `untrack(...)` so the reducer's reads are not registered as dependencies of the
effect. The effect then depends only on the inputs you intend. The fix sites carry the reason inline:

- `+layout.svelte`: `untrack(() => app.dispatchConnection({ type: 'authenticating' }))` — "tracking
  `connection` would cancel establishSession mid-flight"; and `untrack(() => app.dispatchSessions({
  type: 'loading' }))` — "tracking `sessions` would loop fetch abort/restart".
- `host-command-catalog.svelte.ts`: `untrack(() => dispatch({ type: 'session-changed' }))` — so the
  effect "depends only on session id, not catalog state it clears".

`untrack` the dispatch, not the reads you actually want to react to.

---

## 5. AUDIT DISCIPLINE

- **Trace API methods, not literal `dispatch(`.** A dispatch is often indirect — an effect calls a
  hook method that dispatches internally. Grepping only for `dispatch(` misses it; follow what each
  method an effect calls actually does.
- **Re-audit the whole file after fixing one effect.** Fixing one effect does not clear the file;
  `host-command-catalog.svelte.ts` had a second offending effect in the same file after the first was
  fixed. Enumerate every `$effect` in a file and check each.
- **Enumerate the surface.** `grep -rl untrack app-mobile/src` lists the files that already control
  tracking; treat each as a worked example, not a finished job.

---

## 6. HARNESS PARITY

`@testing-library/svelte` `rerender` re-fires a component with unchanged props, unlike React's
`renderHook`, which skips an `Object.is`-equal render. A ported effect that assumed props-changed
semantics will fire extra times under test. Absorb the difference in the test harness with an
equality-checked intermediate `$state` that only updates on a real change — never with a value guard
added to the source. The source stays faithful to Svelte's semantics; the harness compensates for the
library's.

---

## 7. THE INVISIBLE REGRESSION

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

## 8. INTERACTION STATE — THE FOUR ACTIONS

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

## 9. OVERLAY ISOLATION

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

## 10. VISUAL ACCESSIBILITY

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

## 11. RELATED REFERENCES

- [`../design-system/scoped-style-ownership.md`](../design-system/scoped-style-ownership.md) — the rendering side of the same components, and why `:global()` is needed for state selectors.
- [`../storybook/storybook.md`](../storybook/storybook.md) — the catalog's a11y panel, and seeing each surface in isolation.
- [`../verification/verification.md`](../verification/verification.md) — the gates that cannot see either defect, and what they do cover.
- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — where the inline WHY justifying each `untrack` is required to live.
