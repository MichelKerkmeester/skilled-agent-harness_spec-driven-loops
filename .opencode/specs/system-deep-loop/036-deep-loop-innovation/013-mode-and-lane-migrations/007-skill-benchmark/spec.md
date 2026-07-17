---
title: "Feature Specification: Skill Benchmark Migration"
description: "Migrate the skill-benchmark variant's scenario runs and scoring onto the typed event-ledger substrate while reusing the deep-improvement-common backbone and ending in an independent mode gate."
trigger_phrases:
  - "skill benchmark migration"
  - "skill benchmark event ledger"
  - "skill scenario scoring ledger"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Established the Skill Benchmark migration phase parent and its seven child contracts"
    next_safe_action: "Populate child contracts after the model-benchmark migration is complete"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Skill Benchmark Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | 006-model-benchmark |
| **Successor** | 008-deep-alignment |
| **Handoff Criteria** | Skill Benchmark's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program establishes a shared typed event-ledger substrate and requires each mode to migrate its complete run behavior behind compatibility, shadow-parity, and rollback controls before authority moves. The phase-013 map makes the ordering load-bearing: the deep-improvement-common backbone lands before the benchmark variants, so Skill Benchmark must add only its own scenario-run and scoring behavior rather than recreate shared evaluator, canary, or promotion services.

The cited mode research shows why this migration needs its own phase. Skill evaluation must distinguish paired skill interventions from absolute executor success, separate task definitions from skill treatments and distractors, bind gold criteria to executable checks, and retain layered evidence from skill content through trajectory and task outcome. It must also preserve retrieval, selection, activation, composition, and end-to-end lift as distinct signals. This parent hands its successor a mode-specific ledger path whose seven child contracts collectively make those run results replayable, sealed, independently verifiable, resumable, parity-tested, and safe to cut over.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Skill Benchmark emits during its run: the event-envelope specialization, the concrete event types for Skill Benchmark's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Skill Benchmark's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Skill Benchmark's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Skill Benchmark SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-006 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Skill Benchmark's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-006 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Skill Benchmark's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Skill Benchmark's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Skill Benchmark's ROLLBACK SWITCH and independent Skill Benchmark GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |

The seven children are the complete Skill Benchmark migration surface. They depend on the shared contracts and deep-improvement-common services, and together provide the independent gate required before the successor phase performs staged authority cutover.
<!-- /ANCHOR:phase-map -->
