---
title: "Deep-Alignment Tests: regression suite"
description: "node:test regression coverage for the deep-alignment state-machine scripts and adapters."
---

# Deep-Alignment Tests

---

## 1. OVERVIEW

Regression suite for `../` and `../adapters/`, using the built-in `node:test` runner. Each file targets one wiring seam or one failure mode, not general adapter correctness (the adapters carry their own contract docs).

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `state-machine-wiring.test.cjs` | Drives SCOPE through REMEDIATE against a synthetic multi-lane fixture, proving the seams between scripts |
| `reducer-fail-closed.test.cjs` | Proves the reducer never emits a clean PASS on an unaudited corpus and fails closed on a corrupted log or unknown severity |
| `reducer-seal-state.test.cjs` | Pins `overall.sealed` semantics: seeded false, refreshed per iteration, only set true by terminal `--seal` |
| `partition-identity-progress.test.cjs` | Proves the corpus partitioner advances by artifact identity, not a bare numeric cursor |
| `scoping-adapter.test.cjs` | Proves the `adapter` discriminator selects `sk-design-live-render` over the default static adapter and fails closed on an unknown adapter |
| `sk-doc-command-adapter.test.cjs` | Deterministic fixture regression for `../adapters/sk-doc-command.cjs` |
| `command-behavior-matrix.test.cjs` | Exercises the command-benchmark scheduler's scheduling, fixture guards, sampling and reconciliation |
| `command-scenario-rollout.test.cjs` | Reconciles authored command contracts against frozen v1 behavior |
| `command-topology-pilot.test.cjs` | Reconciles authored contracts and activates captured-result gates |

## 3. VALIDATION

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
```

Run any file in this folder the same way, directly with `node`.

## 4. RELATED

- [`../README.md`](../README.md)
