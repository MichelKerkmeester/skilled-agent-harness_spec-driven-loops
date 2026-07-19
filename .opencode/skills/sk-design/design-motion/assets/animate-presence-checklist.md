---
title: AnimatePresence Checklist
description: A fill-in pass-or-fail checklist for shipping AnimatePresence exit animations, covering wrappers, exit props, keys, symmetry, presence hooks, modes and nested exits.
trigger_phrases:
  - "animate presence checklist"
  - "exit animation checklist"
  - "presence pass fail"
  - "motion exit review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# AnimatePresence Checklist

A pass-or-fail checklist for shipping `AnimatePresence` exit animations without broken removals.

## 1. OVERVIEW

### Purpose

Run this before shipping any exit animation built with `AnimatePresence`. Each item is pass or fail. A single fail means an element will vanish instead of animating out, a list will jump or an exit will look broken. This card is the build-side and review-side gate.

### Usage

Copy the section, mark each box and record the file and line for any fail. A checklist with an open fail is not ready to hand off. The reasoning and code for each rule lives in `references/animate-presence-patterns.md`, so this checklist stays terse and points there when a fix is needed.

---

## 2. EXIT WIRING

The element has to be set up so Motion can run an exit before React removes it.

- [ ] **Wrapper present.** Every conditional `motion.*` element with an `exit` prop sits inside an `AnimatePresence`. A conditional element with `exit` but no wrapper never animates out.
- [ ] **Exit prop defined.** Every element expected to leave with motion has an `exit` prop. An element with only `initial` and `animate` disappears instantly.
- [ ] **Symmetry checked.** The exit mirrors the initial direction unless a different departure is deliberate. A mismatched exit reads as a glitch.
- [ ] **Exit owns its transition.** The exit transition is set on the `exit` prop so it does not inherit the ease-out enter curve. Exit uses ease-in at about 75 percent of the enter duration.

Fail target: `file:line` `__________`

---

## 3. KEYS

Identity has to be stable so Motion can tell which element left.

- [ ] **Stable keys.** Dynamic items use a data ID for the key, never the array index. Index keys let Motion reuse the wrong element and break exits on insert or remove.
- [ ] **Unique keys.** No two siblings inside one `AnimatePresence` share a key.

Fail target: `file:line` `__________`

---

## 4. FIRST RENDER

A default-state element should not animate in on page load.

- [ ] **First-render enter suppressed.** When the child is rendered in its default state on first mount, `AnimatePresence` has `initial={false}` so the enter animation does not play on load.
- [ ] **Intentional entrance preserved.** Confirm `initial={false}` does not cancel an entrance you actually want on load.

Fail target: `file:line` `__________`

---

## 5. MODE

The mode has to match the layout situation.

- [ ] **Mode chosen on purpose.** The `mode` matches the case: default or `sync` for simple overlapping overlays, `wait` for view replacement, `popLayout` for list reorder and removal.
- [ ] **`wait` timing adjusted.** If `mode="wait"` is used, each phase is shortened, because total perceived time roughly doubles when the old element leaves before the new one enters.
- [ ] **`sync` layout handled.** If exiting and entering elements would compete for space, exiting elements are positioned `absolute`, or `popLayout` is used instead.

Fail target: `file:line` `__________`

---

## 6. PRESENCE HOOKS

Hooks have to run in the right place and finish their cleanup.

- [ ] **Hook location.** `useIsPresent` is called from a child of `AnimatePresence`, never the parent.
- [ ] **Interactions disabled on exit.** An exiting element disables its interactive controls while it is no longer present, so a user cannot click an element that is leaving.
- [ ] **safeToRemove called.** If `usePresence` performs async cleanup, `safeToRemove` is called after the cleanup completes. Skipping it strands the element in the DOM.

Fail target: `file:line` `__________`

---

## 7. NESTED EXITS

Parent and child exits have to coordinate.

- [ ] **Propagate set.** Nested `AnimatePresence` uses `propagate` when child exits should run as the parent exits. Without it, children vanish instantly when the parent leaves.
- [ ] **Durations coordinated.** Parent and child exit durations are coordinated. A parent that disappears before its children finish makes the whole exit look broken.

Fail target: `file:line` `__________`

---

## 8. RESULT

- [ ] All six sections pass.
- [ ] Every fail has a recorded `file:line` and a fix from `references/animate-presence-patterns.md`.

Report any open fail in the audit findings format from `references/animate-presence-patterns.md` Section 7, for example `components/modal.tsx:42 - [exit-requires-wrapper] conditional motion.div is not wrapped`.
