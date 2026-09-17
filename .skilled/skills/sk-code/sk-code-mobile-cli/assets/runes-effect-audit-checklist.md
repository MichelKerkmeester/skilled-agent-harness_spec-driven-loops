---
title: Runes Effect Self-Invalidation Audit
description: Audit a Svelte $effect (especially a ported React useEffect) in the Pi Remote client for self-invalidation — trace every read, untrack the reducing dispatch, re-audit the file.
trigger_phrases:
  - "svelte effect audit"
  - "useeffect port self-invalidation"
  - "effect update depth exceeded pi remote"
  - "untrack dispatch audit"
  - "rune effect dependency check"
  - "ported effect re-run loop"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# Runes Effect Self-Invalidation Audit

Use this when adding or porting a Svelte `$effect`, especially a ported React `useEffect`
callback, to audit it for self-invalidation.

---

## 1. OVERVIEW

### Purpose

A `$effect` that dispatches into the same `$state` it reads re-invalidates itself — the symptom
is `effect_update_depth_exceeded`, a frozen view, or a silent double-fetch. The state layer these
effects drive lives under `app-mobile/src/shared/state/` (derivations like
`app-mobile/src/shared/state/turns.ts`); the fixed exemplars are
`app-mobile/src/routes/+layout.svelte` and
`app-mobile/src/shared/commands/host-command-catalog.svelte.ts`.

### Usage

Work through the sections in order — list every reactive read, identify the self-invalidation,
untrack the dispatch, trace indirect dispatch, re-audit the whole file, and confirm
test-harness parity — before claiming the effect is fixed, then confirm against THE GATE.

---

## 2. LIST EVERY REACTIVE READ

- [ ] Listed every `$state` / `$derived` / prop / store value the effect reads DIRECTLY
- [ ] Listed every read made INSIDE a function or hook-API method the effect calls — a read one
  layer down is still a dependency of the effect

---

## 3. IDENTIFY THE SELF-INVALIDATION

- [ ] Found any SYNCHRONOUS dispatch whose reducer READS the `$state` it reduces — that read
  makes the effect depend on state the same dispatch then rewrites (the loop)
- [ ] Confirmed the trap over the whole call chain, not just the effect body (an async dispatch
  that rewrites the read state re-invalidates on the next tick and cancels the in-flight run)

---

## 4. UNTRACK THE DISPATCH

- [ ] Wrapped the synchronous dispatch in `untrack(...)` so the effect depends only on its
  intended trigger — e.g. `untrack(() => dispatch({ type: 'session-changed' }))` in
  `app-mobile/src/shared/commands/host-command-catalog.svelte.ts`, and the `dispatchConnection` /
  `dispatchSessions` untracks in `app-mobile/src/routes/+layout.svelte`
- [ ] Verified the trigger still fires when it should (untrack removes the dependency, not the call)

---

## 5. TRACE INDIRECT DISPATCH

- [ ] Traced API METHODS, not just the literal `dispatch(` token — a dispatch can be indirect
  behind a hook method (a `refresh()` or `clearStoredDraft()` that dispatches internally, as in
  `app-mobile/src/pages/chat/attachments/attachment-draft-provider.svelte`)
- [ ] `rg -n "untrack" app-mobile/src` — reviewed the existing untrack sites as the pattern

---

## 6. RE-AUDIT THE WHOLE FILE

- [ ] After fixing one effect, re-audited EVERY effect in the same file — fixing one does not
  clear the others: `rg -n "\$effect" <file>` and walk each (mount + reconnect effects in one
  file have each self-invalidated independently)

---

## 7. TEST-HARNESS PARITY

- [ ] In tests, absorbed `@testing-library/svelte` `rerender` re-firing UNCHANGED props via an
  equality-checked intermediate `$state` in the HARNESS — never a source-side value guard
  (rerender re-fires unchanged props, unlike React `renderHook` Object.is skipping)

---

## 8. VERIFY

- [ ] Reproduced the symptom first where safe (throw / frozen view / double-fetch), applied the
  fix, then confirmed the same path no longer loops
- [ ] `npm run test:web` green

---

## 9. THE GATE

Done only when: every direct and one-layer-down read is enumerated; the reducing synchronous
dispatch is `untrack`-wrapped (including indirect dispatch behind API methods); every other
`$effect` in the file is re-audited; harness rerender is absorbed with an equality-checked
`$state`, not a source guard; and `npm run test:web` is green.
