---
title: 'Numeric thresholds'
description: 'Declared numeric limits for release metrics with machine and operator measurement sources.'
trigger_phrases:
  - 'Numeric thresholds'
  - 'threshold gate'
  - 'thresholds.json'
  - 'evaluateThresholds'
  - 'collectMachineMeasurements'
version: 1.0.0.0
---

# Numeric thresholds (evaluateThresholds)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Declared numeric limits for release metrics with machine and operator measurement sources.

Eight metrics declare a finite threshold, a max or min comparison, a unit, and a source. Machine metrics are collected against a disposable build and database, and a missing machine measurement fails while a missing operator measurement stays pending.

Current status: shipped.

---

## 2. HOW IT WORKS

### Declarations

The thresholds file declares the eight required metrics. Four are machine sourced: replay snapshot bytes, storage growth bytes, restart recovery time, and bundle gzip bytes. Four are operator sourced: foreground p95 latency, streaming cadence, queue memory, and WCAG conformance level.

### Evaluation

The evaluator fails on a missing required metric, an undeclared measurement, an invalid declaration, or a violated comparison. Machine collection builds a disposable web dist and database, writes and retains envelopes, snapshots, closes and reopens, and reports the measured values. A missing operator measurement returns pending and never invents a number.

---

## 3. SOURCE FILES

### Implementation

| File                           | Layer  | Role                                                                                  |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------- |
| `release/thresholds.json`      | Schema | Declares the eight metrics with comparison, threshold, unit, and source               |
| `release/threshold-gate.mjs`   | Script | Implements `REQUIRED_METRICS`, `evaluateThresholds`, and `collectMachineMeasurements` |
| `scripts/check-thresholds.mjs` | Script | Runs collection and evaluation from the CLI                                           |

### Validation And Tests

| File                            | Type   | Role                                                                         |
| ------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `tests/threshold-gate.test.mjs` | Vitest | Covers missing thresholds, violated thresholds, and pending operator metrics |

---

## 4. SOURCE METADATA

- Group: release
- Canonical catalog source: `README.md`
- Feature file path: `release/numeric-thresholds.md`
- Current status: shipped

Related references:

- [whole-gate-runner.md](whole-gate-runner.md) - invokes the threshold gate last
- [staged-rollout.md](staged-rollout.md) - consumes threshold claims for stage readiness
