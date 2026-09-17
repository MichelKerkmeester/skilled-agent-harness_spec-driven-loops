---
title: "Low Sample Benchmark Fixture: Insufficient-State Inputs"
description: "Short improvement session that pins the insufficient-data and insufficient-sample paths for the vitest suites."
trigger_phrases:
  - "low-sample-benchmark fixture"
  - "insufficient sample fixture"
---

# Low Sample Benchmark Fixture: Insufficient-State Inputs

This fixture pins the insufficient-state path for a short improvement session.

## 1. OVERVIEW

- `trade-off-trajectory.json` contains only 2 trajectory points, so `trade-off-detector.cjs` should return `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` when called with `minDataPoints: 3`.
- `benchmark-results.json` contains only 1 replay, so `benchmark-stability.cjs` should return `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` when called with `minReplayCount: 3`.
- `agent-improvement-state.jsonl` embeds both insufficient states in iteration records so `reduce-state.cjs` can surface `insufficientDataIterations` and `insufficientSampleIterations` in the generated registry.

Notes:

- The journal uses validator-accepted enum values from `improvement-journal.cjs`.
- The requested plateau stop is represented as `stopReason: "converged"` with a note because benchmark-plateau aliases are not accepted stop-reason enums.
