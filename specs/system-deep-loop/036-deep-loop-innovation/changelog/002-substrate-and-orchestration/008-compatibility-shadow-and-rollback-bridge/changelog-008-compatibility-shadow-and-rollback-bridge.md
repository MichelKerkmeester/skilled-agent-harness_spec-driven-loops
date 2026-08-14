---
title: "Changelog: Compatibility, Shadow & Rollback Bridge [002-substrate-and-orchestration/008-compatibility-shadow-and-rollback-bridge]"
description: "Changelog for the compatibility, shadow and rollback bridge phase: upcasters, legacy projections, shadow-parity harness, in-flight state classification, and rollback drills."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/008-compatibility-shadow-and-rollback-bridge` (Level 2)

### Summary

This phase defines the five compatibility, shadow-parity, in-flight-state, and rollback child contracts that make the dark deep-loop substrate provably safe for a later authority cutover without moving authority in this phase. Upcasters and dual-read/single-write adapters keep both generations readable while writing only the dark ledger, legacy projections preserve existing readers, the shadow-parity harness compares legacy and dark results on the same sealed inputs, in-flight states receive an explicit upcast/pin/fork/migrate/block disposition, and rollback drills prove reversibility within the phase-004 rollback window. Per the group parent phase map, this phase is in progress; four of the five children report delivered implementations, while the shadow-parity harness remains planned.

### Included Phases

| Phase | Summary |
|---|---|
| `001-upcasters-and-dual-read-adapters` | Define deterministic event and state upcasters plus dual-read/single-authoritative-write adapters that reconcile legacy state with the dark ledger while legacy remains canonical. |
| `002-legacy-projections` | Define deterministic folds from the verified dark ledger into byte-identical legacy JSONL and JSON artifacts, preserving every existing reader. |
| `003-shadow-parity-harness` | Plan the fail-closed harness that runs legacy and dark paths on identical sealed inputs, compares verified replay fingerprints and projected bytes, and emits the parity certificate required before phase-014 cutover. |
| `004-inflight-state-classification` | Implement a total, fail-closed classification of every frozen phase-003 in-flight state row into upcast, pin, fork, migrate, or block before any phase-014 authority cutover. |
| `005-rollback-drills` | Plan executable, mode-scoped rollback drills that simulate a test-lane authority flip, detect a controlled regression, restore legacy authority within the rollback window, and prove state integrity. |
