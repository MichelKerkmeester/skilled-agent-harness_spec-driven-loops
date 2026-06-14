---
title: "Baseline Before No-Regressions; Report the Delta"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-14"
last_confirmed_source: "manual"
triggerPhrases:
  - no regressions
  - nothing broke
  - still passing
  - baseline
  - regression check
  - re-run the gate
  - report the delta
  - didn't change behavior
---

# Baseline Before No-Regressions; Report the Delta

## Rule

"No regressions" means nothing without a recorded starting number to diff against. BEFORE a change, capture the real baseline: test pass/fail counts AND the names of the failing ones, the base commit, and the mtime of any fixture or baseline you trust. After EACH step, re-run the WHOLE gate on a real exit code — never a grep narrowed to your own files — and report the delta in the form `baseline N failing {…} → now M: {…}`.

## Why

A green suite is necessary, not sufficient: it says nothing about a path it does not exercise — an in-place mutation that never re-renders, a screenshot of the wrong screen, a fixture older than your work making a green result suspect. "No regressions" claimed against an uncaptured baseline is the same false-done hazard as `verify-before-completion-claims.md`, one level up: there the gate is *did the check pass*; here the gate is *did it pass relative to where we started*. This comparative dimension is not covered by the completion-claim rule.

## How to apply

- Before the first edit: record `passed/failed` counts + the failing test names; `git rev-parse HEAD`; the mtime of fixtures you rely on.
- After each step: re-run the full gate, read the actual exit code, state the delta. A green suite alone is not proof for a path it never ran.
- One test flips inside an otherwise-green run → run it alone, re-run the group, check a clean tree, and name it flake or regression with the reason before moving on.
- For anything visual or stateful, gate on a real observation, not a passing build. Related: `bash-output-truncation-verdict-visibility.md` (the hazard that masks a real exit code).
