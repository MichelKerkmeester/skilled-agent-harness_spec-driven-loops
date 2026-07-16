---
title: "Checklist: Spine Architecture ADR"
description: "Ratification checklist for the six-primitive cross-mode spine and its downstream transition contract."
trigger_phrases:
  - "spine architecture ADR checklist"
  - "cross-mode spine ratification checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking ratification checks for the spine ADR"
    next_safe_action: "Collect evidence for each P0 ratification check"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] The 006 parent `spec.md`, `manifest/phase-tree.json`, and run-2 `research/research-modes.md` section 12 are pinned as controlling sources
- [ ] CHK-002 [P0] The research five-primitive synthesis and parent transition gateway are reconciled into exactly six spine primitives without contradiction
- [ ] CHK-003 [P1] The child records `depends_on: []` and introduces no runtime implementation or authority change
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The decision is normative, testable, and free of optional language for its load-bearing invariants
- [ ] CHK-005 [P1] Primitive names, ownership, and migration terms are consistent across spec.md, plan.md, tasks.md, and checklist.md
- [ ] CHK-006 [P1] Storage, cryptography, transport, adapter, and scoring implementation choices remain delegated to phases 003-005
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The typed event ledger is append-only, versioned, cross-mode, and the sole canonical history for the new substrate
- [ ] CHK-008 [P0] Every canonical state transition requires explicit pre-write authorization and missing, malformed, unknown, or unsupported decisions deny
- [ ] CHK-009 [P0] Reference artifacts are frozen for their decision epoch and addressed by content digest rather than mutable location alone
- [ ] CHK-010 [P0] Replay fingerprints bind the versions needed to reproduce a run and track entities across passes or revisions
- [ ] CHK-011 [P0] Phase and mode boundaries emit typed receipts/certificates linked to their events, sealed inputs, and replay identity
- [ ] CHK-012 [P0] Adjudication separates candidate from judge, blinds merit-irrelevant provenance, checks counterfactual stability, and retains raw pre-reduction evidence
- [ ] CHK-013 [P0] Ad-hoc per-mode JSONL is rejected for schema, replay, reducer, migration, and cross-mode lineage fragmentation
- [ ] CHK-014 [P0] Mutable source-of-truth state and unversioned events are rejected for lost causality and non-deterministic historical interpretation
- [ ] CHK-015 [P0] A ledger without the authorization gateway is rejected because well-formed forbidden transitions would persist
- [ ] CHK-016 [P0] Mutable reference artifacts and self-scoring are rejected for ruler drift, information leakage, and evaluator gaming
- [ ] CHK-017 [P0] Optional logs in place of receipts are rejected because they cannot provide portable boundary or side-effect proof
- [ ] CHK-018 [P0] Big-bang replacement is rejected and the additive-dark, shadow-parity, rollback-window, per-mode-cutover sequence remains binding
- [ ] CHK-019 [P0] Phase 006 owns ledger/authorization/replay, phase 007 owns seals/receipts/adjudication, and phase 008 preserves the spine through compatibility/shadow/rollback
- [ ] CHK-020 [P1] Each requirement has a deterministic document-inspection or source-trace verification method in plan.md
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P0] All six primitives have a problem statement, ratified invariant, consumer phase, and acceptance check
- [ ] CHK-022 [P1] Positive consequences, implementation costs, compatibility obligations, and migration consequences are all recorded
- [ ] CHK-023 [P1] No rejected alternative remains available through ambiguous wording or a downstream ownership gap
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Default-deny authorization cannot be bypassed by direct typed writers or compatibility adapters
- [ ] CHK-025 [P1] Digest-bound seals prevent post-candidate mutation of authorities, evaluators, canaries, or independence sets
- [ ] CHK-026 [P1] Blinding and counterfactual checks address provenance, order, style, and self-evaluation bias without discarding raw evidence
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] Load-bearing claims cite the 006 parent spec, manifest architecture/migration fields, or run-2 section 12
- [ ] CHK-028 [P1] The ADR distinguishes the research's five recurring mode primitives from the six-part runtime spine ratified here
- [ ] CHK-029 [P2] Later phase authors can identify their owned primitives and forbidden weakenings without reopening this decision
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P1] The phase contains only spec.md, plan.md, tasks.md, and checklist.md before deterministic metadata generation
- [ ] CHK-031 [P1] Frontmatter, anchors, Level 2 markers, template-source markers, and continuity fields match the approved structural mold
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is ratified when every P0 and P1 check carries source-bound evidence, all six primitives remain one
indivisible architecture decision, the alternatives and consequences are explicit, phases 003-005 collectively own
the complete decision, and strict validation reports only the expected missing generated metadata files.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when an independent architecture review confirms source fidelity, no primitive or consumer gap remains,
default-deny and additive-dark constraints are unambiguous, and the strict validator tail contains only
`description.json` and `graph-metadata.json` errors pending deterministic generation.
<!-- /ANCHOR:sign-off -->
