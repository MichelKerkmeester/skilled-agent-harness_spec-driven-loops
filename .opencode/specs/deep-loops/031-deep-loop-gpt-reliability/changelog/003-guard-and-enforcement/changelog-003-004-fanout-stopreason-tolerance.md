---
title: "Changelog: Fanout stopReason Tolerance [031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance]"
description: "Chronological changelog for the fanout-run stopReason tolerance phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

`fanout-run.cjs`'s stopReason handling was too strict for the max-iterations stop policy — a lineage that legitimately reached its iteration cap could be flagged as an anomalous outcome. Loosened `isMaxIterationsStopReason` to a tolerant check that recognizes the max-iterations family (`maxIterationsReached`, `max-iterations (N/N)`, etc.) rather than an exact literal, and landed it with a mutation-proved test.

### Changed

- `isMaxIterationsStopReason` in `fanout-run.cjs` — tolerant max-iterations-family recognition instead of exact-string match, so a lineage that hit its cap is not misclassified.

### Verified

- Vitest suite passing; the tolerant path RED/GREEN mutation-proved.
