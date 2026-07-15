---
title: "Feature Specification: Shared Evidence & Control Services"
description: "Plan the seven shared evidence and control services that make the transition-authorized ledger usable by the compatibility bridge and every deep-loop mode."
trigger_phrases:
  - "shared evidence and control services"
  - "deep-loop phase 004 shared services"
  - "receipts seals adjudication budgets gauges locks continuity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services"
    last_updated_at: "2026-07-15T13:53:47Z"
    last_updated_by: "codex"
    recent_action: "Defined seven shared-service child contracts behind the phase-003 envelope"
    next_safe_action: "Author the seven child service packets without changing legacy authority"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Shared Evidence & Control Services

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation |
| **Predecessor** | 003-transition-authorized-ledger-core |
| **Successor** | 005-compatibility-shadow-and-rollback-bridge |
| **Handoff Criteria** | The seven shared services (receipts + effect-recovery, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks/fencing, continuity identities) are each planned behind the phase-003 envelope contract and ready for the compatibility bridge and the mode migrations to consume. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The recommendations program defines one additive-dark runtime spine, then places this phase after the transition-authorized ledger core and before the compatibility, shadow, and rollback bridge. The parent specification and phase manifest assign this parent the evidence and control services that make the bare ledger usable across modes, while the phase-001 architecture ADR binds receipts, sealed artifacts, and blinded adjudication to the shared spine without moving authority from the legacy path. Sources: `.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/spec.md`, `.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/manifest/phase-tree.json`, and `.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/001-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`.

This phase decomposes that shared layer into seven independently planned service contracts behind the phase-003 event envelope: receipts and effect recovery, sealed reference artifacts, blinded adjudication, typed budgets, stream-fold gauges, locks and fencing, and continuity identities. The run-2 synthesis identifies the recurring cross-mode evidence spine and the AI-council need for counterfactual, provenance-blinded judgement; this parent turns those findings into the child map that phase 005 and the later mode migrations can consume while legacy remains authoritative. Source: `.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/research/research-modes.md`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-receipts-and-effect-recovery/` | Receipts/certificates emitted at phase and mode boundaries, plus an effect-recovery gateway that makes external effects idempotent and replay-safe after a crash or resume. | Planned |
| 002 | `002-sealed-reference-artifacts/` | The sealed/frozen reference-artifact mechanism: immutable inputs referenced by content digest so any run pins the exact artifacts it consumed. | Planned |
| 003 | `003-blinded-adjudication-service/` | A blinded/counterfactual adjudication service for scoring and convergence decisions, controlling positional and identity bias in multi-candidate judgement. | Planned |
| 004 | `004-hierarchical-typed-budgets/` | Hierarchical typed budgets (token/cost/iteration/time) that nest by scope and fail closed when exhausted, consumed by fan-out and convergence. | Planned |
| 005 | `005-stream-fold-gauges/` | Stream-fold gauges: observability metrics computed as a deterministic fold over the ledger event stream, so gauges are reproducible from the log. | Planned |
| 006 | `006-locks-and-fencing/` | Locks and fencing tokens for safe concurrent writers and resume, preventing split-brain between legacy and dark paths and between fan-out workers. | Planned |
| 007 | `007-continuity-identities/` | Stable continuity identities threaded across resume, handover, and mode boundaries, so a claim or lineage keeps one identity across the whole loop. | Planned |

The seven children are shared service contracts that can be planned in parallel once the phase-003 envelope contract is fixed. Together they hand phase 005 and the later mode migrations a complete evidence and control layer while the additive-dark path remains non-authoritative.
<!-- /ANCHOR:phase-map -->
