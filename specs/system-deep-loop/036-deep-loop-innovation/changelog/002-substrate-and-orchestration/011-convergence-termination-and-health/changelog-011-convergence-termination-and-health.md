---
title: "Changelog: Convergence, Termination & Health [002-substrate-and-orchestration/011-convergence-termination-and-health]"
description: "Changelog for the convergence, termination and health phase: path-covering termination, cycle detection, stopping clocks, value-of-computation allocation, and a health and degeneration harness."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/011-convergence-termination-and-health` (Level 2)

### Summary

This phase defines the shared planning boundary for replacing count-based stopping with five complementary contracts: path-covering termination, cycle detection, independent stopping clocks, value-of-computation allocation, and a generic health and degeneration harness. It generalizes the current council convergence anchor across all modes and is deliberately sequenced after durable fan-in and novelty/claims continuity because coverage, cycle, allocation, and health decisions consume those signals. Per the group parent phase map, this phase is in progress; all five children report delivered implementations in their implementation summaries.

### Included Phases

| Phase | Summary |
|---|---|
| `001-path-covering-termination` | Terminate on proven coverage of the search paths/space rather than a raw iteration count, using the coverage and community signals. |
| `002-cycle-detection` | Detect when the loop revisits states, claims, or foci and treat that as a termination/health signal with progress-gated health evidence. |
| `003-stopping-clocks` | Multiple independent stopping clocks (budget, novelty-decay, coverage, wall-time) whose deterministic earliest firing stops the loop, each recorded. |
| `004-value-of-computation-allocation` | Value-of-computation scoring and adaptive allocation that spend more iterations where marginal value is high, gated by the typed budgets. |
| `005-health-and-degeneration-harness` | A generic health and degeneration harness that detects mode collapse, repetition, and quality decay across any mode without taking stop authority. |
