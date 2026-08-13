---
title: "Tasks: Deep Research - Reducers & Projections"
description: "Tasks for planning and implementing deterministic deep-research reducers and projections over the typed event ledger."
trigger_phrases:
  - "deep research reducers tasks"
  - "deep research projection tasks"
  - "deep research replay fold tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-22T05:14:02Z"
    last_updated_by: "codex"
    recent_action: "Closed evidence-to-source referential trust"
    next_safe_action: "Downstream projection consumption"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Reducers & Projections

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

- [x] T001 Confirm the frozen typed-ledger event contract, phase-012 mode interface, and phase-013 write-set boundary before implementation [Evidence: `DeepResearchLedgerEvent` and `ModeContract.reduce` imports]
- [x] T002 Build the deep-research event inventory for plan, branch, evidence, claim, community, convergence, artifact, receipt, and status families [Evidence: `DEEP_RESEARCH_EVENT_ROUTING` covers all 23 stems]
- [x] T003 Define the field-level reducer ownership matrix, canonical ordering tuple, reducer/version fingerprint inputs, and invalid-event policy [Evidence: `DEEP_RESEARCH_PROJECTION_FIELD_OWNERSHIP`]
- [x] T004 Capture legacy reducer and heartbeat output fixtures from `deep-research/scripts/reduce-state.cjs` and `deep-research-auto.yaml` for shadow comparison [Evidence: `projectDeepResearchLegacyView` fixture]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Implement the pure event router and canonical fold with no I/O, clock, randomness, model, network, seal, or ledger-append dependency [Evidence: `foldDeepResearchEvents`]
- [x] T006 Implement the iteration projection for plan revisions, branch lifecycle, query recipes, admission outcomes, raw observations, claims, and next-focus obligations [Evidence: `DeepResearchResearchPlanProjection` and `DeepResearchIterationProjection`]
- [x] T007 Implement the convergence projection for observed/finalized frontiers, trusted evidence yield, contradiction/falsification blockers, health inputs, and incomplete outcomes [Evidence: `DeepResearchConvergenceProjection`]
- [x] T008 [P] Implement the reversible artifact index for artifact identity, digest, schema, provenance, receipts, validity, availability, and supersession [Evidence: `DeepResearchArtifactIndexProjection`]
- [x] T009 [P] Implement per-mode status derivation, impossible-transition rejection, terminal ambiguity, quarantine, and blocked/rebuild-required states [Evidence: `DeepResearchStatusProjection`]
- [x] T010 Implement incremental cursor/checkpoint folding and projection-fingerprint compatibility checks without changing canonical event history [Evidence: `DeepResearchProjectionCheckpoint` binds its projection identity and `sourceTailSequence` without changing the exported projection digest]
- [x] T011 Implement the read-only legacy-shaped compatibility projection with explicit lossy-field markers and shadow-only posture [Evidence: `projectDeepResearchLegacyView`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify deterministic replay: identical typed event sequences produce byte-equivalent projections, indexes, status, and fingerprints [Evidence: Vitest 21/21 reordered replay]
- [x] T013 Verify arrival-order invariance with independent-event permutations, duplicate events, late completions, and finalized-frontier advancement [Evidence: `foldDeepResearchEvents` late-event fixtures]
- [x] T014 Verify raw evidence and judgment lineage: supersession, retraction, contradiction, invalid admission, and unknown outcomes remain inspectable [Evidence: `DeepResearchClaimEvidenceProjection` fixtures]
- [x] T015 Verify artifact behavior: digest mismatch, missing receipt, invalid reference, superseded artifact, and unavailable artifact never create success placeholders [Evidence: `artifactFromEvent` fixtures]
- [x] T016 Verify incremental/full parity across checkpoint restart, cursor gaps, log rotation, truncation, schema drift, and projection-version changes [Evidence: `rebuild_required` fixtures prove genuine cursor gaps and forged checkpoint tails fail closed while an untampered checkpoint continues]
- [x] T017 Verify status safety: impossible transitions, missing terminal evidence, quarantine, incomplete exhaustion, and unknown event types fail closed [Evidence: `DeepResearchReducerError` fixtures]
- [x] T018 Verify the reducer boundary has no side effects and the compatibility projection cannot authorize a transition or authority cutover [Evidence: `verifyDeepResearchReducerSurface`]
- [x] T019 Verify a supported claim arriving after an incomplete evaluation cannot reuse that stale evaluation to change eligibility or finalized revision; only a fresh evaluation advances the convergence cursor and decision fields [Evidence: Vitest 45/45 includes `keeps evaluation-owned convergence eligibility stable until a fresh evaluation`]
- [x] T020 Verify two source versions with byte-identical content receive distinct full-digest artifact identities and retain independent provenance receipts [Evidence: Vitest 45/45 includes `indexes byte-identical content from distinct sources under distinct identities`]
- [x] T021 Verify admitted evidence contributes trusted convergence only when its source version was captured, and terminal source/evidence/claim references cannot dangle [Evidence: Vitest 45/45 includes phantom-source blocking, the captured-source positive control, terminal phantom-evidence rejection, and mutation falsifiers]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T021 are checked with implementation or fixture evidence]
- [x] All requirements in spec.md met with evidence [Evidence: checklist.md maps the projection contract to 45 passing reducer tests and strict validation]
- [x] Phase gate green (validate/build/test/replay as applicable) [Evidence: targeted Vitest 45/45, pinned runtime TypeScript exit 0, and strict packet validation exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Typed event input**: Planned predecessor `001-typed-ledger-schema`
- **Artifact consumer**: Planned successor `003-sealed-artifacts`
- **Research inputs**: See `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`
<!-- /ANCHOR:cross-refs -->
