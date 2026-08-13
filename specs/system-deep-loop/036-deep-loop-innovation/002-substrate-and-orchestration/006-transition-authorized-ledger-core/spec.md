---
title: "Feature Specification: transition-authorized-ledger-core"
description: "The versioned event envelope, typed append-only ledger, replay fingerprints, and fail-closed transition-authorization gateway must co-land as one dark substrate while legacy writers remain authoritative."
trigger_phrases:
  - "transition authorized ledger core"
  - "dark deep-loop event ledger"
  - "fail-closed transition authorization gateway"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the lean phase-parent contract for the dark ledger core"
    next_safe_action: "Plan the four child contracts before implementing the dark substrate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Transition-Authorized Ledger Core

> Sibling phase adjacency (sorted order under the 036 parent): predecessor `005-fanout-live-tools-unblock`; successor `007-shared-evidence-and-control-services`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core |
| **Level** | phase parent (Level 2) |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | 004-architecture-coverage-and-transition-contract |
| **Successor** | 007-shared-evidence-and-control-services |
| **Handoff Criteria** | The versioned event envelope, the typed append-only ledger, the replay-fingerprint scheme, and the fail-closed transition-authorization gateway are planned and co-landed as one dark (non-authoritative) substrate; legacy writers remain the source of truth until phase 014. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped runtime under `.opencode/skills/system-deep-loop/runtime/` persists in-flight state through existing JSONL and checkpoint paths, while the cross-mode research calls for one typed append-only event substrate with versioned replay identity. The phase-004 spine ADR ratifies that shared architecture and makes the first typed writer inseparable from default-deny transition authorization: a structurally valid event is not sufficient evidence that its transition is permitted (`../002-deep-loop-effectiveness-and-fanout/research/research-modes.md`, `../004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`).

This phase turns that frozen architecture and transition policy into the core substrate every later spine service records into. Its four children must co-land as one additive-dark, non-authoritative unit: events may be recorded in parallel, but legacy writers remain the source of truth until the per-mode authority cutover in phase 014. The completed parent hands phase 007 an authorized, typed, replay-verifiable recording foundation without moving authority or absorbing the successor's evidence and control services (`../spec.md`, `../manifest/phase-tree.json`, `../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-versioned-event-envelope/` | The wire format for every event: an explicit schema version + type discriminator + required-field contract + upcast entry points, per the phase-004 transition policy; the single shape all later events use. | Planned |
| 002 | `002-typed-append-only-ledger/` | The append-only ledger writer/reader over the envelope: monotonic append, no in-place mutation, typed events, integrity + ordering guarantees; the one source of truth the spine records into (dark). | Planned |
| 003 | `003-replay-fingerprints/` | Versioned replay fingerprints derived from the ledger so any run is deterministically reproducible and verifiable; fingerprint derivation, storage, and mismatch detection. | Planned |
| 004 | `004-transition-authorization-gateway/` | The fail-closed (default-deny) gateway that must authorize every state transition before it is recorded, co-landed with the ledger; authorized/denied decisions are themselves ledger events. | Planned |
<!-- /ANCHOR:phase-map -->
