---
title: "Feature Specification: Staged State Migration & Authority Cutover"
description: "Classify and migrate eligible in-flight state, then cut authority per mode under shadow-parity, rollback, and certificate gates."
trigger_phrases:
  - "staged state migration and authority cutover"
  - "deep-loop per-mode authority flip"
  - "cutover certificate rollback window"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the staged migration and per-mode authority cutover parent"
    next_safe_action: "Author the three cutover children without moving authority in this parent"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Staged State Migration & Authority Cutover

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover |
| **Level** | phase parent (Level 2) |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 013-mode-and-lane-migrations |
| **Successor** | 015-legacy-writer-retirement |
| **Handoff Criteria** | Eligible in-flight state is migrated, and authority flips from legacy to the dark spine one mode at a time - each flip gated by shadow parity + rollback drill and recorded by a cutover certificate inside a monitored rollback window. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 parent program requires the new deep-loop spine to remain additive, dark, and non-authoritative until every mode has a safe migration path, shadow parity, and rollback evidence. Its sequencing invariants state that per-mode gates prove shadow parity only and that authority changes solely in phase 011 (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md`). The phase tree makes this phase depend on `013-mode-and-lane-migrations` and assigns it the outcome of classifying and migrating eligible in-flight state before a one-mode-at-a-time authority flip (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

The phase-001 transition, versioning, and rollback policy fixes the per-mode authority boundary, shadow-parity precondition, single-writer rule, cutover certificate, and monitored rollback window (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`). Phase 005 supplies the required shadow-parity proof, five-way in-flight-state classification, and executable rollback drill evidence through its child contracts (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`, `.opencode/specs/system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification/spec.md`, and `.opencode/specs/system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills/spec.md`). Without this phase, authority would either move without complete evidence or remain ambiguous across modes, leaving phase 012 unable to retire legacy writers safely.

This phase is the only phase that moves canonical authority. It turns the completed per-mode migrations and phase-005 safety evidence into an evidence-gated, reversible cutover: eligible in-flight state is handled under its classification, authority flips from legacy to the dark spine one mode at a time, and every flip is recorded by a cutover certificate inside a monitored rollback window. The successor receives a per-mode cutover and rollback record with unresolved or ineligible modes still legacy-authoritative, allowing phase 012 to require the window, zero-use telemetry, and archival-read evidence before legacy-writer retirement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-inflight-state-migration/` | Execute the migration of eligible in-flight state per the phase-005 classification (upcast/fork/migrate), guarded so a running loop is never corrupted or lost. | Planned |
| 002 | `002-per-mode-authority-flip/` | Flip canonical authority from legacy to the dark spine one mode at a time, each flip gated by that mode's shadow-parity proof and a passing rollback drill. | Planned |
| 003 | `003-cutover-certificate-and-rollback-window/` | The cutover certificate (the evidence bundle that authorizes a flip) plus enforcement of the monitored rollback window during which a flip stays reversible. | Planned |
<!-- /ANCHOR:phase-map -->
