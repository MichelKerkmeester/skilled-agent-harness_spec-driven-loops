---
title: "Feature Specification: fan-out / fan-in durable orchestration"
description: "Make fan-out and fan-in durable over the canonical ledger through dispatch receipts, result envelopes, resumable branch orchestration, budget-aware completion policy, and provenance-balanced reduction."
trigger_phrases:
  - "fan-out fan-in durable orchestration"
  - "durable fanout ledger"
  - "resumable provenance-balanced fan-in"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
    last_updated_at: "2026-07-15T14:37:29Z"
    last_updated_by: "codex"
    recent_action: "Authored the durable fan-out and fan-in phase-parent contract"
    next_safe_action: "Author the six child contracts over the approved ledger substrate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Fan-out / Fan-in Durable Orchestration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/034-deep-loop-innovation |
| **Predecessor** | 008-compatibility-shadow-and-rollback-bridge |
| **Successor** | 010-novelty-claims-continuity-and-projections |
| **Handoff Criteria** | Canonical dispatch receipts, typed result envelopes, resume/salvage, logical branch IDs + leases + waves, conditional budget-aware fan-in, partial-failure policy, and provenance-balanced reduction are planned over the ledger substrate, generalizing the shipped fanout-run.cjs pool. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program specification at `.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md` requires durable fan-out/fan-in after the ledger, shared controls, and compatibility bridge are available. The shipped `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` already drives a capped work-conserving pool with budgets, retries, partial summaries, and artifact salvage, but its flat-pool guard rejects wave assignment and its orchestration status, dispatch, and leaf results are not yet canonical ledger contracts. Phase 005's `.opencode/specs/system-deep-loop/034-deep-loop-innovation/005-fanout-live-tools-unblock/spec.md` deliberately leaves those persistence contracts here after exposing the resolved invocation fingerprint at the dispatch boundary.

This phase turns that proven execution surface into durable orchestration through six child contracts covering canonical dispatch and results, resumable branch identity and scheduling, conditional budget-aware completion, explicit partial-failure behavior, and provenance-balanced reduction. The reduction direction is grounded in `.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs`, which demonstrated provenance-preserving round-robin reduction across heterogeneous leaves. Its handoff gives `010-novelty-claims-continuity-and-projections` stable branch identities, recoverable results, and provenance-bearing fan-in outputs for deterministic novelty, claim-continuity, and projection work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-canonical-dispatch-receipts/` | Every leaf dispatch is a canonical ledger event (receipt) with its invocation fingerprint, generalizing the phase-005 adapter fingerprint into durable state. | Planned |
| 002 | `002-result-envelopes-and-resume-salvage/` | Typed result envelopes per leaf plus resume/salvage that recovers an interrupted fan-out from the ledger without re-running completed leaves. | Planned |
| 003 | `003-logical-branch-ids-leases-waves/` | Stable logical branch IDs, worker leases (fenced), and wave scheduling over the existing work-conserving pool, so fan-out is durable and resumable. | Planned |
| 004 | `004-conditional-budget-aware-fanin/` | Conditional fan-in gated by the phase-007 typed budgets: decide how many results to await and when to stop early under budget or sufficiency. | Planned |
| 005 | `005-partial-failure-policy/` | An explicit partial-failure policy: how many leaf failures are tolerated, how degradation is recorded, and when fan-in proceeds vs aborts. | Planned |
| 006 | `006-provenance-balanced-reduction/` | Provenance-balanced reduction that merges leaf results weighting by source/model provenance, generalizing the run-2 fan-out prototype's provenance merge. | Planned |

The six children build one durable orchestration contract over the phase-006 ledger and phase-007 control services, behind the phase-008 compatibility boundary. Their combined output is the stable, provenance-bearing fan-in surface required by phase 010.
<!-- /ANCHOR:phase-map -->
