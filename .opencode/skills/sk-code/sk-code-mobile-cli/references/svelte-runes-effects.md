---
title: Svelte Runes and the Effect Self-Invalidation Trap
description: Why a $effect that dispatches into state it also reads cancels its own in-flight work, how untrack fixes it, and the audit and test-harness discipline that keeps ported effects honest.
trigger_phrases:
  - "effect self invalidation"
  - "untrack dispatch svelte"
  - "effect cancels in flight work"
  - "ported useeffect to effect"
  - "svelte rune effect trap"
  - "rerender re-fires props harness"
  - "audit every ported effect"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Svelte Runes and the Effect Self-Invalidation Trap

The app runs on Svelte runes. Reactive derivation is done with `$derived`; side effects with
`$effect`. The dangerous rune is `$effect`: it re-runs whenever any reactive value it read changes,
and it reads more than the literal `dispatch(...)` you can see. This is the single most common
regression class in the SvelteKit port.

---

## 1. OVERVIEW

### Core Principle

Prefer pure derivation. `app-mobile/src/shared/state/turns.ts` groups transcript blocks into turns
with a plain function feeding `$derived` — no `$effect`, so nothing to invalidate. Reach for
`$effect` only for genuine side effects (fetches, socket lifecycle, DOM events). When you do, control
exactly what it tracks.

### When to Use

- Porting a React `useEffect` to `$effect` and it loops, refetches, or freezes
- An effect that dispatches into a store or reducer and then re-runs
- Auditing effects in a file after fixing one of them
- A `@testing-library/svelte` test that behaves differently from its React original

### Key Sources

- `app-mobile/src/shared/state/turns.ts` (derive, don't effect)
- `app-mobile/src/routes/+layout.svelte` (two `untrack`ed dispatches, with the WHY inline)
- `app-mobile/src/shared/commands/host-command-catalog.svelte.ts` (mount + reconnect effects)

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

## 7. CHECK AND RELATED REFERENCES

- Check: run `test:web` after touching any effect; it exercises the ported effects under the harness.
- `scoped-style-ownership.md` — the rendering side of the same components.
- `comment-grammar.md` — where the inline WHY that justifies each `untrack` is required to live.
