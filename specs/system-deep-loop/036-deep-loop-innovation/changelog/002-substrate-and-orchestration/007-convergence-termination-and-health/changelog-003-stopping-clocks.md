---
title: "Changelog: Stopping Clocks [002-substrate-and-orchestration/007-convergence-termination-and-health/003-stopping-clocks]"
description: "Changelog for the stopping clocks phase: independent budget, novelty-decay, coverage, and wall-time clocks with deterministic earliest-fire termination."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/007-convergence-termination-and-health/003-stopping-clocks` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/007-convergence-termination-and-health`

### Summary

This phase planned multiple independent stopping clocks (budget, novelty-decay, coverage, wall-time, cycle) whose deterministic earliest firing terminates the loop and records a replayable, typed termination cause. Per its implementation summary, the phase delivered five independent typed clocks, replay-stable earliest-fire arbitration, authorized terminal cause events, and additive-dark legacy compatibility. Status is complete.
