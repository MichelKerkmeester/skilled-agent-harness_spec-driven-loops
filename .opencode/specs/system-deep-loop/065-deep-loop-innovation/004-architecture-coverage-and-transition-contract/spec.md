---
title: "Feature Specification: Architecture, Coverage & Transition Contract"
description: "The last planning gate before implementation ratifies the cross-mode spine, freezes all 178 recommendations into a bijective single-disposition ledger, and fixes the transition, versioning, compatibility, cutover, and rollback contract that governs later writers."
trigger_phrases:
  - "architecture coverage transition contract"
  - "deep-loop phase 001 planning gate"
  - "178 recommendation bijective ledger"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the architecture, coverage, and transition planning gate"
    next_safe_action: "Author the three child planning contracts before phase 003 begins"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Architecture, Coverage & Transition Contract

> Sibling phase adjacency (sorted order under the 065 parent): predecessor `003-baseline-taxonomy-and-state-census`; successor `005-fanout-live-tools-unblock`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract |
| **Level** | phase parent (Level 2) |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 003-baseline-taxonomy-and-state-census |
| **Successor** | 006-transition-authorized-ledger-core |
| **Handoff Criteria** | The spine is ratified as an ADR, the 178-row recommendation ledger is proven bijective and single-disposition, and the transition/versioning/rollback policy is frozen — before any writer is built in phase 003. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The [parent program spec](../spec.md) defines one cross-mode spine for all 178 recommendations: a typed append-only event ledger, fail-closed transition authorization, sealed reference artifacts, versioned replay fingerprints, receipts and certificates, and blinded or counterfactual adjudication. The [phase-tree manifest](../manifest/phase-tree.json) records the corpus as 8 run-a, 59 run-b, and 111 run-c recommendations, but the source registries do not yet provide the stable IDs, normalized targets, or single dispositions needed to prove complete coverage. Building a writer before those architecture and transition boundaries are fixed would make later compatibility, cutover, and rollback behavior depend on implementation accidents rather than a ratified contract.

This phase is the final planning gate before code. Its three independent child contracts ratify the spine as an ADR, freeze the 178-row recommendation corpus into a bijective and auditable ledger, and establish the transition, versioning, compatibility, authority-cutover, and rollback policy for phases 003-012. Phase 003 receives one frozen architecture-and-governance boundary: every recommendation has exactly one disposition, every later writer is governed by the same transition contract, and no writer may land before this handoff is satisfied.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-spine-architecture-adr/` | Ratify the single cross-mode spine (typed append-only event ledger + fail-closed transition-authorization gateway + sealed reference artifacts + versioned replay fingerprints + receipts/certificates + blinded/counterfactual adjudication) as an architecture decision governing phases 003-011; record the alternatives considered and rejected, and the consequences. | Planned |
| 002 | `002-recommendation-ledger-bijective-map/` | Freeze all 178 recommendations (8 run-a + 59 run-b + 111 run-c) into one classified ledger: a stable ID, a normalized target (subsystem/mode/phase), and a single disposition per rec; prove the bijective 178-total, single-disposition, and full phase-coverage properties. | Planned |
| 003 | `003-transition-versioning-and-rollback-policy/` | Define, before any writer exists, the event-envelope versioning + upcaster rules, the fail-closed transition-authorization semantics, the per-mode authority-cutover protocol, and the rollback-window policy that every later phase (003-012) must obey. | Planned |

The three children are independent planning contracts. All three must be ratified and frozen before the successor may build the first transition-authorized writer.
<!-- /ANCHOR:phase-map -->
