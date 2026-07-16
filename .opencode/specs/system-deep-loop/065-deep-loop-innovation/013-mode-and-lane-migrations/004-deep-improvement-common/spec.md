---
title: "Feature Specification: Deep Improvement Common Services Migration"
description: "Migrate the shared deep-improvement evaluator-first loop, candidate generation, scoring, canary, and guarded promotion services onto the typed event-ledger substrate before the agent-improvement, model-benchmark, and skill-benchmark variants consume them."
trigger_phrases:
  - "deep improvement common services migration"
  - "deep improvement typed event ledger"
  - "shared evaluator canary promotion migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common"
    last_updated_at: "2026-07-15T21:47:52Z"
    last_updated_by: "opencode"
    recent_action: "Defined the seven-child shared deep-improvement migration contract"
    next_safe_action: "Start child 001 after phase-015 shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Deep Improvement Common Services Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 003-deep-ai-council |
| **Successor** | 005-agent-improvement |
| **Handoff Criteria** | Deep Improvement Common Services's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program spec (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md`) identifies phase 013 as the per-mode migration fan-out and explicitly orders Deep Improvement Common Services before agent-improvement, model-benchmark, and skill-benchmark because those variants share its packet and scoring backend. The phase tree (`manifest/phase-tree.json`) makes this work dependent on phase 015's shared mode contracts and assigns it the full run-C migration outcome: typed schema, reducers, sealed artifacts, certificates, resume adapters, shadow parity, rollback, and an independent mode gate.

The cited mode findings (`002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`) explain why the shared boundary must be migrated once rather than reimplemented in each variant. Deep-improvement findings cover evaluator-first candidate generation, rich evaluator evidence, quality-diverse lineages, conservative and attack-resistant scoring, cross-domain canaries, progressive promotion, and preserved raw observations. This phase therefore establishes the common migration parent for that evaluator, canary, and promotion backbone. It hands successor 005 a single gated shared-services contract that the three variants can consume without redefining event ownership, evidence authority, or promotion safety.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Deep Improvement Common Services emits during its run: the event-envelope specialization, the concrete event types for Deep Improvement Common Services's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Deep Improvement Common Services's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Deep Improvement Common Services's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Deep Improvement Common Services SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-006 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Deep Improvement Common Services's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-006 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Deep Improvement Common Services's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Deep Improvement Common Services's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Deep Improvement Common Services's ROLLBACK SWITCH and independent Deep Improvement Common Services GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |
<!-- /ANCHOR:phase-map -->
