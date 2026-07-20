---
title: "Feature Specification: Deep AI Council Migration"
description: "Migrate the multi-seat Deep AI Council deliberation onto the shared typed event-ledger substrate through seven concern children, preserving replayable run state, sealed artifacts, independent verification, resumability, shadow parity, and a rollback-guarded mode gate."
trigger_phrases:
  - "Deep AI Council migration"
  - "deep ai council event ledger"
  - "deep ai council mode gate"
  - "multi-seat council deliberation migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the seven-child Deep AI Council migration scope"
    next_safe_action: "Author child contracts after shared mode contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Deep AI Council Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `UNKNOWN` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations |
| **Predecessor** | 002-deep-review |
| **Successor** | 004-deep-improvement-common |
| **Handoff Criteria** | Deep AI Council's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program establishes one shared typed event-ledger spine for all deep-loop modes and requires the per-mode migrations to remain additive and dark until each mode proves parity. Phase 012 freezes the shared mode contracts and the dependency/write-set boundaries needed for safe fan-out. Deep AI Council is the third mode lane in phase 013, so it needs its own migration boundary rather than an authority-changing rewrite mixed into the shared substrate or the later staged cutover.

The council's shipped run is a multi-seat deliberation: seats deliberate, critique rounds expose agreement and disagreement, convergence selects a result, artifacts record the council output, and a council test gate evaluates the run. The cited mode research shows why this behavior needs explicit continuity: seat count alone does not establish independence; identity and position can bias judgments; reliability and calibration vary by seat; decision protocols and pairwise comparisons affect aggregation; and minority trajectories, dissent, and metamorphic bias results must remain inspectable. The research registries therefore place Deep AI Council at the intersection of deliberation, adjudication, fan-out/fan-in, convergence, observability, and resumable state.

This phase gives that full council run one mode-owned migration contract across seven concern children. It hands phase 014 an independently gated, replayable, sealed, and shadow-parity-proven Deep AI Council path with a rollback switch armed. Authority cutover remains outside this phase.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Deep AI Council emits during its run: the event-envelope specialization, the concrete event types for Deep AI Council's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Deep AI Council's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Deep AI Council's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Deep AI Council SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-007 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Deep AI Council's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-007 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Deep AI Council's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Deep AI Council's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Deep AI Council's ROLLBACK SWITCH and independent Deep AI Council GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |
<!-- /ANCHOR:phase-map -->
