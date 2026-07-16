---
title: "Feature Specification: Model Benchmark Migration"
description: "Migrate the model-benchmark variant's multi-model runs and scoring matrix onto the typed event-ledger substrate through seven concern children, reusing the deep-improvement-common backbone and ending in an independent mode gate."
trigger_phrases:
  - "Model Benchmark migration"
  - "model-benchmark event ledger"
  - "model benchmark scoring matrix"
  - "model benchmark mode gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the seven-child Model Benchmark migration parent and its phase handoff"
    next_safe_action: "Author child 001 typed-ledger-schema contract on shared mode interfaces"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Model Benchmark Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | system-deep-loop/034-deep-loop-innovation |
| **Predecessor** | 005-agent-improvement |
| **Successor** | 007-skill-benchmark |
| **Handoff Criteria** | Model Benchmark's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program requires each mode to migrate its complete run behavior onto one additive, dark, typed event-ledger spine before authority changes in the later cutover phase. Its phase map places Model Benchmark after the shared mode contracts and after deep-improvement-common, because the three benchmark variants share that evaluator and scoring backbone. The phase tree records this workstream as the Model Benchmark-specific migration from those shared services to an independently gated mode.

Model Benchmark exists at this boundary because its distinctive behavior is a multi-model run organized as a scoring matrix, not a generic evaluator invocation. The mode research identifies task-conditional model strengths, adaptive evaluation with coverage quotas, preserved judge configuration and calibration evidence, contamination-aware benchmark lineage, workload and latency measurements, and uncertainty-aware paired comparisons. Without a mode-owned ledger contract, those observations remain difficult to replay, compare, resume, and audit independently of the shared improvement services. The phase therefore preserves Model Benchmark's run and scoring evidence while keeping evaluator, canary, calibration, and promotion ownership in deep-improvement-common, as required by the parent program and the shared-mode contract work.

This phase decomposes that migration into seven concern children. Together they hand `007-skill-benchmark` a proven shared-backbone boundary and hand the later staged cutover phase a sealed, replayable, resumable, parity-proven Model Benchmark path with its rollback switch armed and independent mode gate passed. The successor owns its own skill-specific benchmark behavior; it does not inherit Model Benchmark's mode evidence or gate result.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Model Benchmark emits during its run: the event-envelope specialization, the concrete event types for Model Benchmark's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Model Benchmark's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Model Benchmark's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Model Benchmark SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-006 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Model Benchmark's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-006 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Model Benchmark's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Model Benchmark's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Model Benchmark's ROLLBACK SWITCH and independent Model Benchmark GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |
<!-- /ANCHOR:phase-map -->
