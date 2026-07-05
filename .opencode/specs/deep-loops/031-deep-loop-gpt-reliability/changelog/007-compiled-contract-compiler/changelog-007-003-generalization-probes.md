---
title: "Changelog: Generalization Probes [031-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes]"
description: "Chronological changelog for the compiled-contract generalization probes child."
trigger_phrases:
  - "phase changelog"
  - "generalization probes changelog"
  - "compiled contract probes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Ran focused fix-vs-fallback probes on `gpt-fast-med` to test whether the compiled-command-contract flip generalized beyond review/research. The result was mixed: council showed only directional signal, context was lever-null on the natural cell and method-moot, and leaf-reliability improved detectability but did not mechanically rescue the review re-probe.

### Added

- Scenario cells for context, council and a review re-probe.
- Nine scored behavior-benchmark runs under `runs/`.
- `results.md` with per-cell fix-vs-fallback analysis and the generalization verdict.

### Changed

- The council verdict was revised after N=2 completion: fix 1/2 versus fallback 0/2 is directional, not a reliable flip.

### Fixed

- No production code changed in this probe phase.
- Corrected the over-strong N=1 council read by completing the N>=2 gate.

### Verification

- ACB-005 council fix: one pass and one `stuck_no_progress`; fallback: two `stuck_no_progress` results.
- CXB-004 context: arms moved in lockstep across fix and fallback, making the lever null on the natural cell.
- RVB-REPROBE review fix: leaf dispatched but route-proof/artifact completion remained incomplete.
- `results.md` records the final verdict and limitations.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `scenarios/CXB-004.md` | Created | Context probe cell |
| `scenarios/ACB-005.md` | Created | Council probe cell |
| `scenarios/RVB-REPROBE.md` | Created | Review command-kind re-probe |
| `runs/` | Created | Scored fix/fallback run artifacts |
| `results.md` | Created | Generalization verdict and recommendations |

### Follow-Ups

- Bound the true council fix pass rate with N>=3 after the seat-convergence stall fix.
- Add a setup-confirm carve-out for autonomous-precedence over-triggering on should-halt asks.
- Consider runner-owned retry for leaf reliability, since the single-executor loop still depends on the model following re-dispatch instructions.
