---
title: "Changelog: Deep Improvement Common Services Migration [003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common]"
description: "Changelog for the deep improvement common services migration group: migrating the shared evaluator-first loop and its services onto the typed event-ledger substrate before the three benchmark variants consume them."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common` (Level 2)

### Summary

This phase-parent migrates the shared deep-improvement evaluator-first loop, candidate generation, scoring, canary, and guarded promotion services onto the typed event-ledger substrate before the agent-improvement, model-benchmark, and skill-benchmark variants consume them. It owns the evaluator, canary, and promotion services its three benchmark variants reuse, and lands before those variants. Each child owns its own scope, plan, and verification. Per the phase documentation map the children are delivered; the lane remains in progress.

### Included Phases

| Phase | Summary |
|---|---|
| `001-typed-ledger-schema` | Define the additive-dark typed append-only event vocabulary for shared Deep Improvement services: candidate generation, evaluator observations, score normalization, canary analysis, and guarded promotion. |
| `002-reducers-and-projections` | Plan the deterministic reducers and live projections for the shared deep-improvement backbone: evaluator-first iteration, candidate generation, scoring, canary analysis, and guarded promotion. |
| `003-sealed-artifacts` | Plan the sealed reference artifacts for the shared deep-improvement backbone, composing the phase-007 sealing primitives into content-addressed, seal-on-write inputs and outputs. |
| `004-certificates-and-receipts` | Plan the shared Deep Improvement Common Services certificate and receipt contract over the typed event-ledger substrate: per-run certificates, per-transition receipts, and independent offline verification. |
| `005-resume-adapter` | Define the Deep Improvement Common Services resume adapter over the sealed typed event ledger with deterministic reducer reconstruction and idempotent re-entry. |
| `006-shadow-parity` | Implement the shared shadow-parity harness with logical event pairing, independent projections, fault injection, and manifest-bound receipts. |
| `007-rollback-and-mode-gate` | Deliver the fail-closed rollback switch and independent migration gate for the shared Deep Improvement Common Services backbone without moving authority. |

## 2026-08-16

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common` (Level 2)

### Summary

The Deep Improvement Common Services migration lane is now Complete, with all seven concern children at Complete. Certificates and receipts verified green at 22/22, the resume adapter at 23/23, shadow parity at 27/27, and the rollback gate at 37/37 after correcting a stale census-fixture path in the rollback-gate test. The shared evaluator-first backbone now runs on the typed event-ledger substrate, additive-dark, ahead of its three benchmark variants.

### What Changed

- All 7 leaves Complete.
- Certificates-and-receipts verified green at 22/22; resume-adapter at 23/23.
- Shadow-parity at 27/27; rollback-gate at 37/37 after correcting a stale census-fixture path in the rollback-gate test.
