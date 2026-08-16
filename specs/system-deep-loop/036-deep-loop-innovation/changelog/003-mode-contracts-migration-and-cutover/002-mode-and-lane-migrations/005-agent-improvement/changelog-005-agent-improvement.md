---
title: "Changelog: Agent Improvement Migration [003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement]"
description: "Changelog for the agent improvement migration group: migrating the agent-improvement variant of the deep-improvement evaluator loop onto the typed event-ledger substrate."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement` (Level 2)

### Summary

This phase-parent migrates the agent-improvement variant of the deep-improvement evaluator loop onto the typed event-ledger substrate through seven concern children, reusing the shared evaluator, canary, and promotion backbone and ending in an independent mode gate. Each child owns its own scope, plan, and verification. Per the phase documentation map the children are delivered; the lane remains in progress.

### Included Phases

| Phase | Summary |
|---|---|
| `001-typed-ledger-schema` | The additive-dark Agent Improvement typed ledger extends the shared Deep Improvement Common Services schema with typed AgentIR, change-contract, mutation, causal-experiment, manifest, transfer, and behavioral-classification events. |
| `002-reducers-and-projections` | Plan the deterministic reducers and live projections for the Agent Improvement migration: agent-loop proposal generation, AgentIR mutation lineage, evaluator scoring, and convergence state replayed from the typed event ledger. |
| `003-sealed-artifacts` | Plan the sealed reference artifacts for the agent-improvement variant: immutable AgentIR and change inputs, content-addressed proposal and trial outputs, and a tamper-evident read path. |
| `004-certificates-and-receipts` | Plan the Agent Improvement per-run certificate and per-transition receipt contract, binding proposal generation and scoring evidence to replay fingerprints and offline verification. |
| `005-resume-adapter` | Plan the Agent Improvement resume adapter over the sealed typed event ledger, re-entering idempotently without double-applying events or losing branch evidence. |
| `006-shadow-parity` | Plan the Agent Improvement shadow-parity harness that compares the agent-specific projections event-for-event and blocks authority cutover on any unexplained semantic difference. |
| `007-rollback-and-mode-gate` | Plan the fail-closed Agent Improvement rollback switch and independent migration gate, certifying this mode only after shadow parity, sealed evidence, and rollback readiness pass. |

## 2026-08-16

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement` (Level 2)

### Summary

The Agent Improvement migration lane is now Complete, with all seven concern children at Complete. Certificates and receipts verified green at 14/14, the resume adapter at 34/34, shadow parity at 36/36, and the rollback gate at 61/61. The variant runs on the shared typed event-ledger substrate, additive-dark, reusing the deep-improvement-common backbone.

### What Changed

- All 7 leaves Complete.
- Certificates-and-receipts verified green at 14/14; resume-adapter at 34/34.
- Shadow-parity at 36/36; rollback-gate at 61/61.
