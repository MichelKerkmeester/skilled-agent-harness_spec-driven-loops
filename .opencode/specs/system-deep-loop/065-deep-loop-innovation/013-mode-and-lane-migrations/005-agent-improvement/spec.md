---
title: "Feature Specification: Agent Improvement Migration"
description: "Migrate the agent-improvement variant of the deep-improvement evaluator loop onto the typed event-ledger substrate through seven concern children, reusing the shared evaluator, canary, and promotion backbone and ending in an independent mode gate."
trigger_phrases:
  - "agent improvement migration"
  - "agent-improvement event ledger"
  - "agent improvement mode gate"
  - "agent loop proposal scoring"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the seven-child Agent Improvement migration parent and its phase handoff"
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

# Feature Specification: Agent Improvement Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 004-deep-improvement-common |
| **Successor** | 006-model-benchmark |
| **Handoff Criteria** | Agent Improvement's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program makes each mode responsible for its full run behavior on one shared, additive-dark ledger spine. Its phase map places the per-mode fan-out after shared mode contracts, orders deep-improvement common before its three variants, and requires each mode to finish with an independent gate before authority changes in the later cutover phase. The phase tree therefore makes this workstream the Agent Improvement-specific successor to the shared deep-improvement backbone and the predecessor of Model Benchmark.

Agent Improvement needs that boundary because its run is not only generic evaluator scoring. The cited mode research calls for typed agent-workflow mutations across prompts, skills, models, tools, nodes, and topology; normalized execution traces; executable per-step invariants; separate gates for acting, refusing, and clarifying; hidden canary protection; and behavior-family rather than scalar-only evidence. These mode-specific concerns must become replayable ledger vocabulary and projections without re-implementing the evaluator, canary, and promotion services owned by deep-improvement common.

This phase decomposes that migration into seven concern children. Together they hand the successor a sealed, replayable, resumable, parity-proven Agent Improvement path with an armed rollback switch and a passed mode gate. The handoff proves this mode is ready for the staged authority-cutover work while leaving shared services and authority policy in their owning phases.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Agent Improvement emits during its run: the event-envelope specialization, the concrete event types for Agent Improvement's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-003 transition-authorized ledger core and the phase-009 shared event contracts. Output is Agent Improvement's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Agent Improvement's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Agent Improvement SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-003 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Agent Improvement's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-003 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Agent Improvement's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Agent Improvement's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-011 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Agent Improvement's ROLLBACK SWITCH and independent Agent Improvement GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 011. | Planned |
<!-- /ANCHOR:phase-map -->
