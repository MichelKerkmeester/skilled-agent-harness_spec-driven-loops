---
title: "Implementation Plan: Repo convention audit"
description: "How the plugin's convention state and gate baselines were measured, and which commands reproduce each figure."
trigger_phrases:
  - "audit plan"
  - "convention measurement method"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Repo convention audit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Measure the plugin tree rather than describe it. Every figure in `audit.json` comes from a command
run against the worktree at its base commit, with output and exit status read. Nothing is inferred.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The audit is read-only, so its gate is the integrity of its own numbers.

| Check | Requirement |
|-------|-------------|
| Reproducibility | Each figure traces to a command recorded here |
| Exit status | Read directly, never through a pipe — zsh does not populate `PIPESTATUS` |
| Lint baseline | Recorded as failing at 115 problems, so later phases cannot mistake it for a regression |
| No mutation | `git status` in the worktree shows nothing but the packet itself |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`audit.json` is a single flat document with one object per concern: `gateBaseline`, `files`,
`naming`, `comments`, `folderDocs`, `styles`, `renameBlastRadius`, `knownOpenDebt`. Later phases read
the object they need rather than re-deriving it, which keeps one number in one place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Capture gate baselines from a clean worktree with linked dependencies.
2. Inventory filenames and classify their case.
3. Inventory comments: banner coverage, section rules, density, commented-out code.
4. Walk folders against the three-or-more-direct-sources threshold, both directions.
5. Measure the stylesheet: size, banner style, comment language, distinct classes.
6. Quantify the rename blast radius, including paths hard-coded outside `src/`.
7. Record known open debt from the preceding packets as evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The audit's correctness is checked by consumption: phase 008's scanners are written against these
figures and must independently report the same counts. Agreement between an independent scanner and
the recorded audit is the test. Disagreement means one of them is wrong and both get re-derived.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- A worktree with `node_modules` linked; a bare worktree lacks gitignored dependencies and every
  gate would report a false failure.
- A system Chrome for the capture harness, otherwise `screenshots:verify` cannot be baselined.
- The preceding packets' handover for the open-debt inventory.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing to roll back. The phase creates one file and mutates no source. Deleting `audit.json`
returns the tree to its prior state, at the cost of every later phase losing its cited baseline.
<!-- /ANCHOR:rollback -->

---

## 8. CROSS-REFERENCES

- [`audit.json`](audit.json)
- [`../001-surface-design-plan/mode-design-plan.md`](../001-surface-design-plan/mode-design-plan.md)
