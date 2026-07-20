---
title: "Checklist: Spine Architecture ADR"
description: "Ratification checklist for the six-primitive cross-mode spine and its downstream transition contract."
trigger_phrases:
  - "spine architecture ADR checklist"
  - "cross-mode spine ratification checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified the ratified spine against every blocking check"
    next_safe_action: "Use the accepted ADR in phases 006, 007, and 008"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Spine Architecture ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking ratification contract for the spine ADR. Every completed item must cite the exact
decision text, source path, manifest field, section-12 statement, or validator output that proves it. Planned status
means checks remain open until an independent architecture pass confirms the six primitives, alternatives,
consequences, and phase-consumer boundaries as one internally consistent decision.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The 036 parent `spec.md`, `manifest/phase-tree.json`, and run-2 `research/research-modes.md` section 12 are pinned as controlling sources [Source: `decision-record.md`, Controlling sources] Verified: 2026-07-20
- [x] CHK-002 [P0] The research five-primitive synthesis and parent transition gateway are reconciled into exactly six spine primitives without contradiction [File: `decision-record.md`] Verified: 2026-07-20
- [x] CHK-003 [P1] The child records `depends_on: []` and introduces no runtime implementation or authority change [File: `spec.md`] [File: `decision-record.md`] Verified: 2026-07-20
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] The decision is normative, testable, and free of optional language for its load-bearing invariants [File: `decision-record.md`, Decision] Verified: 2026-07-20
- [x] CHK-005 [P1] Primitive names, ownership, and migration terms are consistent across spec.md, plan.md, tasks.md, checklist.md, and decision-record.md [File: `decision-record.md`] [File: `tasks.md`] Verified: 2026-07-20
- [x] CHK-006 [P1] Storage, cryptography, transport, adapter, recovery, and scoring implementation choices remain delegated to phases 006-008 [File: `spec.md`] [File: `decision-record.md`] Verified: 2026-07-20
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] The **typed append-only versioned event ledger** is cross-mode and the sole canonical history for the new substrate [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-008 [P0] The **fail-closed transition-authorization gateway (default-deny)** requires explicit pre-write authorization and missing, malformed, unknown, or unsupported decisions deny [File: `decision-record.md`, Decision] Verified: 2026-07-20
- [x] CHK-009 [P0] **Sealed/frozen reference artifacts (digest-referenced)** are frozen for their decision epoch and addressed by content digest rather than mutable location alone [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-010 [P0] **Versioned replay fingerprints** bind the versions needed to reproduce a run and track entities across passes or revisions [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-011 [P0] **Receipts/certificates** are typed, independently checkable, and linked to their events, sealed inputs, and replay identity [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-012 [P0] **Blinded/counterfactual adjudication** separates candidate from judge, blinds merit-irrelevant provenance, checks counterfactual stability, and retains raw pre-reduction evidence [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-013 [P0] Ad-hoc per-mode JSONL is rejected for schema, replay, reducer, migration, and cross-mode lineage fragmentation [File: `decision-record.md`, Alternatives Considered and Rejected] Verified: 2026-07-20
- [x] CHK-014 [P0] Mutable source-of-truth state and unversioned events are rejected for lost causality and non-deterministic historical interpretation [File: `decision-record.md`, Alternatives Considered and Rejected] Verified: 2026-07-20
- [x] CHK-015 [P0] A ledger without the authorization gateway is rejected because well-formed forbidden transitions would persist [File: `decision-record.md`, Why the primitives are indivisible] Verified: 2026-07-20
- [x] CHK-016 [P0] Mutable reference artifacts and self-scoring are rejected for ruler drift, information leakage, and evaluator gaming [File: `decision-record.md`, Alternatives Considered and Rejected] Verified: 2026-07-20
- [x] CHK-017 [P0] Optional logs in place of receipts are rejected because they cannot provide portable boundary or side-effect proof [File: `decision-record.md`, Alternatives Considered and Rejected] Verified: 2026-07-20
- [x] CHK-018 [P0] Big-bang replacement is rejected and the additive-dark, shadow-parity, rollback-window, per-mode-cutover sequence remains binding [Source: `decision-record.md`, Decision] Verified: 2026-07-20
- [x] CHK-019 [P0] Phase 006 owns ledger/authorization/replay, phase 007 owns seals/receipts/adjudication, and phase 008 preserves the spine through compatibility/shadow/rollback [File: `decision-record.md`, Consumer Contract and Rollback] Verified: 2026-07-20
- [x] CHK-020 [P1] Each requirement has a deterministic document-inspection or source-trace verification method in plan.md [File: `plan.md`, Testing Strategy] Verified: 2026-07-20
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P0] All six primitives have a problem statement, ratified invariant, primary consumer phase, source trace, and acceptance check [File: `decision-record.md`, Primitive-to-problem contract] [File: `checklist.md`, Testing] Verified: 2026-07-20
- [x] CHK-022 [P1] Positive consequences, implementation costs, compatibility obligations, and migration consequences are all recorded [File: `decision-record.md`, Consequences] Verified: 2026-07-20
- [x] CHK-023 [P1] No rejected alternative remains available through ambiguous wording or a downstream ownership gap [File: `decision-record.md`, Alternatives Considered and Rejected] Verified: 2026-07-20
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] Default-deny authorization cannot be bypassed by direct typed writers or compatibility adapters [File: `decision-record.md`, Decision] Verified: 2026-07-20
- [x] CHK-025 [P1] Digest-bound seals prevent post-candidate mutation of authorities, evaluators, canaries, rubrics, or independence sets [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
- [x] CHK-026 [P1] Blinding and counterfactual checks address provenance, order, style, and self-evaluation bias without discarding raw evidence [File: `decision-record.md`, Primitive-to-problem contract] Verified: 2026-07-20
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] Load-bearing claims cite the 036 parent spec, manifest architecture/migration fields, or run-2 section 12 [Source: `decision-record.md`, Controlling sources and Source trace] Verified: 2026-07-20
- [x] CHK-028 [P1] The ADR distinguishes the research's five recurring mode primitives from the six-part runtime spine ratified here [File: `decision-record.md`, Context] Verified: 2026-07-20
- [x] CHK-029 [P2] Later phase authors can identify their owned primitives and forbidden weakenings without reopening this decision [File: `decision-record.md`, Consumer Contract and Rollback] Verified: 2026-07-20
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] The leaf contains only canonical spec documents and deterministic metadata; it contains no runtime code or sibling-phase artifact [Evidence: 8/8 leaf files are canonical docs or deterministic metadata] Verified: 2026-07-20
- [x] CHK-031 [P1] Frontmatter, anchors, Level 2 markers, template-source markers, and continuity fields match the approved structural mold [Test: validate.sh --strict final run recorded in implementation-summary.md] Verified: 2026-07-20
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Every P0, P1, and P2 check carries source-bound evidence. All six primitives remain one indivisible architecture
decision, the alternatives and consequences are explicit, phases 006-008 collectively consume or preserve the
complete decision, and final strict validation must report Errors: 0 and Warnings: 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Source fidelity, primitive coverage, consumer ownership, default-deny behavior, and additive-dark sequencing are
verified above. Final sign-off is recorded by the strict validator result in `implementation-summary.md`.
<!-- /ANCHOR:sign-off -->
