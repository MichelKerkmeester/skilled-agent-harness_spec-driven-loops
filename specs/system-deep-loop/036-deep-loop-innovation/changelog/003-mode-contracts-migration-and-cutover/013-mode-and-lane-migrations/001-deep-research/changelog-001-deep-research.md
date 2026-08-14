---
title: "Changelog: Deep Research Migration [003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations/001-deep-research]"
description: "Changelog for the deep research migration group: migrating the autonomous deep research loop onto the typed event-ledger substrate through seven concern children and an independent mode gate."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations/001-deep-research` (Level 2)

### Summary

This phase-parent coordinates the Deep Research migration over the shared typed append-only event-ledger substrate without redefining shared contracts or moving authority prematurely. Its seven child phases divide the mode migration into schema, deterministic replay state, sealed artifacts, certificates and receipts, resume, shadow parity, and rollback plus mode-gate ownership. When the handoff criteria are met, deep-review receives a proven migration pattern and an unambiguous mode boundary. Per the parent phase documentation map, all seven children are delivered; the lane remains in progress pending acceptance of reconciled evidence.

### Included Phases

| Phase | Summary |
|---|---|
| `001-typed-ledger-schema` | Define the typed append-only event schema Deep Research emits during its run: envelope specialization, concrete event types, field-level types, and versioned-envelope plus upcaster hooks. |
| `002-reducers-and-projections` | Define the deterministic reducers that replay Deep Research's typed event log into its live state projections; a pure fold with no side effects. |
| `003-sealed-artifacts` | Define how Deep Research seals its reference artifacts with content-addressed digests, seal-on-write, and a tamper-evident read path. |
| `004-certificates-and-receipts` | Define Deep Research's per-run certificate and per-transition receipts, their replay-fingerprint inputs, and independent offline verification. |
| `005-resume-adapter` | Define how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, with idempotent re-entry. |
| `006-shadow-parity` | Define the shadow-parity harness that runs the ledger path beside the legacy emitter and diffs projections event-for-event. |
| `007-rollback-and-mode-gate` | Define the fail-closed rollback switch and the independent mode-gate checklist that certifies this mode migrated. |
