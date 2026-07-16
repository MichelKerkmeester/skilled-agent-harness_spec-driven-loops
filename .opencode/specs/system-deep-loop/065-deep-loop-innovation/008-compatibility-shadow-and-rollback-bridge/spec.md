---
title: "Feature Specification: compatibility-shadow-and-rollback-bridge"
description: "Define the five compatibility, shadow-parity, in-flight-state, and rollback child contracts that make the dark deep-loop substrate provably safe for a later authority cutover without moving authority in this phase."
trigger_phrases:
  - "compatibility shadow and rollback bridge"
  - "deep-loop recommendations phase 008"
  - "shadow parity before authority cutover"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the compatibility, shadow-parity, and rollback bridge phase map"
    next_safe_action: "Author the five child contracts without moving runtime authority"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Compatibility, Shadow & Rollback Bridge

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 007-shared-evidence-and-control-services |
| **Successor** | 009-fanout-fanin-durable-orchestration |
| **Handoff Criteria** | Upcasters, dual-read/single-write adapters, and legacy projections are planned; the shadow-parity harness can prove the dark path reproduces legacy behavior; in-flight state is classified; and rollback drills are defined — all without moving authority, which remains phase 014's responsibility. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The dark ledger and shared services can record valid-looking state while still being unsafe to promote: legacy readers must remain functional, old and current event versions must resolve deterministically, a running loop cannot be stranded between state shapes, and a nominal rollback path is worthless unless it is executable. The [006 parent specification](../spec.md) therefore requires an additive, dark, non-authoritative migration, while the [execution-sequencing strategy](../execution-sequencing-strategy.md) places this bridge between the dark substrate and durable orchestration and reserves every authority change for phase 014.

This phase turns that safety requirement into five child contracts. The [phase-003 census](../003-baseline-taxonomy-and-state-census/spec.md) supplies the in-flight shapes, backends, protected behaviors, replay fixtures, and rollback anchors to classify; the [phase-004 transition and rollback policy](../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md) fixes deterministic upcasting, single-writer authority, and the rollback window; and the [phase-006 replay-fingerprint contract](../006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md) supplies immutable comparisons over stored events, effective events, and projections. Upcasters and dual-read/single-write adapters keep both generations readable while writing only the dark ledger, legacy projections preserve existing readers, and the shadow-parity harness compares legacy and dark results on the same sealed inputs.

The successor receives a dark substrate whose compatibility is planned, whose legacy behavior can be reproduced and verified, whose in-flight states have an explicit upcast / pin / fork / migrate / block disposition, and whose reversal is covered by executable drills. **No authority cutover occurs here**: phase 008 makes a later cutover provably safe; phase 014 alone may move authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-upcasters-and-dual-read-adapters/` | Upcasters (old event/state versions -> current) plus dual-read/single-write adapters that read both legacy and dark shapes but write the dark ledger only during the shadow period. | Planned |
| 002 | `002-legacy-projections/` | Projections that render the dark ledger back into the legacy JSONL/JSON shapes so every existing reader keeps working unchanged while the spine runs dark. | Planned |
| 003 | `003-shadow-parity-harness/` | The harness that runs the dark path and the legacy path on the same sealed inputs and proves identical results via replay fingerprints - the precondition any mode must pass before phase 014 cutover. | Planned |
| 004 | `004-inflight-state-classification/` | Classify every in-flight state shape from the phase-003 census into one of upcast / pin / fork / migrate / block, so a running loop is handled correctly at cutover. | Planned |
| 005 | `005-rollback-drills/` | Executable rollback drills that prove a cutover can be reversed within the phase-004 rollback window, with integrity checks, before any real authority flip is attempted. | Planned |

The five children collectively establish the compatibility and reversibility evidence required by phase 009 while legacy remains authoritative.
<!-- /ANCHOR:phase-map -->
