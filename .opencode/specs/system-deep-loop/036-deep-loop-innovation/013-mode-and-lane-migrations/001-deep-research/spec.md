---
title: "Feature Specification: Deep Research Migration"
description: "Migrate the autonomous Deep Research loop from initialization through iterative evidence gathering, convergence, synthesis, and memory-save handoff onto the typed event-ledger substrate through seven concern children and an independent mode gate."
trigger_phrases:
  - "deep research migration"
  - "deep-research event ledger"
  - "deep research typed ledger"
  - "deep research mode gate"
  - "deep research shadow parity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
    last_updated_at: "2026-07-15T17:42:45Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Research migration parent and seven child concerns"
    next_safe_action: "Plan the typed ledger schema child against shared phase contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Deep Research Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | None |
| **Successor** | 002-deep-review |
| **Handoff Criteria** | Deep Research's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The recommendations implementation plan identifies the eight mode workstreams as a fan-out over shared mode contracts, with each mode required to preserve its full run behavior while gaining typed ledger state, sealed evidence, certificates, resume support, shadow parity, rollback, and an independent gate. The phase tree makes Deep Research the first workstream under phase 013, dependent on the shared contracts and fixtures from phase 012, with `002-deep-review` as its successor.

The research inputs show why Deep Research needs its own migration boundary. Its current loop treats planning, evidence gathering, claim support, convergence, synthesis, and continuity as a sequence of partially structured artifacts. The mode findings call for an inspectable research-plan DAG, claim-evidence-contradiction lineage, source and claim versioning, evidence admission, trusted evidence yield, living-resume invalidation, and longitudinal change verification. The runtime findings add the cross-mode requirements for immutable observations, deterministic replay, receipts, compatibility, and non-authoritative shadow operation. These conclusions are recorded in `002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`, `002-deep-loop-effectiveness-and-fanout/research/findings-registry.json`, and the program contract in `036-deep-loop-innovation/spec.md`.

This phase coordinates those Deep Research concerns over the shared typed append-only event-ledger substrate without redefining shared contracts or moving authority prematurely. Its seven child phases divide the mode migration into schema, deterministic replay state, sealed artifacts, certificates and receipts, resume, shadow parity, and rollback plus mode-gate ownership. When the handoff criteria are met, `002-deep-review` receives a proven migration pattern and an unambiguous mode boundary rather than an incomplete or authoritative rewrite.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Deep Research emits during its run: the event-envelope specialization, the concrete event types for Deep Research's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Deep Research's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Deep Research's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Deep Research SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-006 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Deep Research's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-006 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Deep Research's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Deep Research's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Deep Research's ROLLBACK SWITCH and independent Deep Research GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |
<!-- /ANCHOR:phase-map -->
