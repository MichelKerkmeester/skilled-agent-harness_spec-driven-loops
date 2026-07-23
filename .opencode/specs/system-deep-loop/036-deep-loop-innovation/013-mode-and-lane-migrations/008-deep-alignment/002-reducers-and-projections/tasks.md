---
title: "Tasks: Deep Alignment - Reducers & Projections"
description: "Tasks for the Deep Alignment reducers and projections phase: map typed ledger events to deterministic lane, authority, artifact, evidence, verdict, status, and convergence projections with shared review-loop parity."
trigger_phrases:
  - "Deep Alignment reducers and projections tasks"
  - "deep-alignment projection reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-23T20:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the reducer, public surface, adversarial test, and serial gate"
    next_safe_action: "Consume the closed additive-dark projection contract downstream"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-reducers.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All public exports are mode-owned except the imported shared backbone"
      - "The real typed fold enforces current-state terminal freshness"
---
# Tasks: Deep Alignment - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the typed event schema, phase-012 shared review-loop contract, 013 write-set graph, Deep Review reuse boundary, Deep Alignment adapter rules, and legacy lane fixtures are available as read-only inputs. [Evidence: imports resolve to `deep-alignment-ledger-schema/index.js` and `deep-review-reducers/index.js`.]
- [x] T002 Confirm the phase boundary excludes event-schema authoring, authority compilation, sealed-artifact creation, discovery and re-probe execution, authority cutover, and the six sibling concerns. [Evidence: `git status --short -- <scoped paths>` contains only the reducer module, its test, and this leaf.]
- [x] T003 [P] Record source observation fields, derived verdict fields, authority and verifier metadata, deviation overlays, projection-health fields, and stable identity inputs. [Evidence: `deep-alignment-projection-types.ts` and `assertDeepAlignmentProjectionState`.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the typed event-to-projection matrix with lane and authority identity, applicability precedence, valid transitions, idempotent duplicate policy, late-reprobe policy, sequence checks, and fail-closed errors. [Evidence: `DEEP_ALIGNMENT_EVENT_ROUTING` and `foldDeepAlignmentEvents`.]
- [x] T005 Define the pure immutable fold state, canonical serialization, projection-version contract, and deterministic projection fingerprint. [Evidence: initial state, immutable clone, canonical digest, checkpoint, and version rebuild contracts.]
- [x] T006 Define the lane iteration/convergence reducer for authority epoch, scope, discovery denominator, applicability, rule/artifact coverage, observations, finding lifecycle, deviations, obligations, and terminal decisions. [Evidence: `reduceSharedReviewLoopBackbone` supplies the closed review-loop projection.]
- [x] T007 Define the artifact and evidence-index reducer for authority references, discovered artifacts, applicability decisions, raw observations, re-probe receipts, findings, deviation assertions, reports, digests, freshness, availability, and supersession lineage. [Evidence: `DeepAlignmentArtifactProjection` and proof-witness projection folds.]
- [x] T008 Define the per-mode status reducer for lifecycle, lane summaries, contract and authority versions, replay position, projection health, blocking reasons, shadow parity, and terminal status. [Evidence: `DeepAlignmentModeStatusProjection` and the impossible-transition guard.]
- [x] T009 Define the derived per-lane and overall verdict projection while retaining `PASS`, `FAIL`, `WARN`, `INCONCLUSIVE`, `NOT_APPLICABLE`, `SKIP`, and `EXEMPT` separately from raw evidence. [Evidence: `refreshConformance` derives verdicts without deleting observations, assessments, findings, or deviations.]
- [x] T010 [P] Define the shared review-loop adapter for Deep Alignment and Deep Review; keep mode-specific lane and finding mapping at the boundary and do not fork the backbone. [Evidence: imported `reduceSharedReviewLoopBackbone` with alignment configuration.]
- [x] T011 Define replay failure behavior for unknown versions, expired or mixed authority material, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminals, stale re-probes, missing evidence, and projection drift. [Evidence: typed registry, rebuild reasons, ownership assertions, and terminal guards.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify repeated replay of one ordered typed event sequence produces identical lane state, convergence state, artifact index, per-mode status, verdicts, canonical serialization, fingerprints, and terminal status. [Evidence: targeted Vitest deterministic replay and integrity digest equality.]
- [x] T013 Verify empty, partial, completed, duplicate, late-reprobe, supersession, authority-expiry, mixed-epoch, not-applicable, unresolved, and deviation sequences preserve deterministic state and append-only evidence. [Evidence: `foldDeepAlignmentEvents` covers immutable initial, partial, and full histories.]
- [x] T014 Verify declared applicability, required rule/artifact coverage, unresolved obligations, invalid authority, hard blockers, and contested evidence block convergence when the shared contract requires them. [Evidence: Vitest hard-veto and current-state blocker negatives use the shared backbone.]
- [x] T015 Verify artifact and evidence references retain stable logical identity, producer linkage, authority/verifier revision, content digest, applicability, freshness, availability, and lineage. [Evidence: `assertDeepAlignmentProjectionState` checks ownership-bearing artifact and proof records.]
- [x] T016 Verify per-mode status accepts only valid typed transitions and reports blocked/error states for invalid transitions, authority mismatch, and projection mismatch. [Evidence: Vitest covers impossible status plus version and checkpoint negatives.]
- [x] T017 Verify per-lane and overall verdicts preserve raw observations; known deviations remain visible overlays and `not_applicable` or `unresolved` cannot become pass by coercion. [Evidence: separate source and derived conformance projections.]
- [x] T018 Verify Deep Alignment and Deep Review satisfy the shared review-loop fixtures with mode-specific configuration only. [Evidence: cross-mode reuse test passes with `mode: 'alignment'`.]
- [x] T019 Verify a detector candidate cannot become a blocking finding without authority-bound evidence and a valid live re-probe receipt. [Evidence: phantom-source and borrowed-reference Vitests reject through `foldDeepAlignmentEvents`.]
- [x] T020 Verify shadow parity against frozen legacy Deep Alignment fixtures and record field-level discrepancies without changing authority. [Evidence: `projectDeepAlignmentLegacyView` keeps the frozen parity projection shadow-only.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [Evidence: T001 through T020 are reconciled above.]
- [x] All requirements in spec.md met with evidence. [Evidence: checklist and implementation summary map the delivered reducer, projections, and shared-backbone reuse.]
- [x] Phase gate green (validate/replay/shadow-parity as applicable). [Evidence: Vitest 17/17, runtime TypeScript zero own diagnostics, strict validation Errors 0.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
