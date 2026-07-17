---
title: "Tasks: Contradiction & Supersession Events"
description: "Tasks for typed contradiction and supersession schemas, evidence-backed detection, deterministic status derivation, and replay audit."
trigger_phrases:
  - "contradiction supersession tasks"
  - "claim relationship event tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed event, reducer, audit, and negative-fixture work"
    next_safe_action: "Implement registry schemas before reducer and audit adapters"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Contradiction & Supersession Events

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

- [ ] T001 Pin the phase-006 envelope, typed-ledger, authorization, and fingerprint interfaces used by both relationship events
- [ ] T002 Record the prospective `001-semantic-communities` input contract and the stable claim/evidence references consumed at the phase-010 composition gate
- [ ] T003 Freeze event names, schema versions, relation actions, required evidence fields, status enum, typed rejection codes, and canonical serializer rules
- [ ] T004 Build the run-2 fixture matrix for additions, corrections, retractions, duplicate sources, unresolved contradictions, and supersession chains
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement semantic-community and evidence-snapshot input normalization that emits candidates without mutating claim state
- [ ] T006 Implement canonical symmetric contradiction pairing, incompatibility scope validation, evidence completeness, and withdrawal linkage
- [ ] T007 Implement directional supersession validation, stronger/newer evidence rationale, acyclic chain checks, competing-successor refusal, and withdrawal linkage
- [ ] T008 Register `deep-loop.claim.contradiction-recorded` and `deep-loop.claim.supersession-recorded` under the versioned envelope
- [ ] T009 Route both constructors through fail-closed transition authorization and conflict-detecting idempotent ledger append
- [ ] T010 Implement the pure relation fold for assertions/withdrawals, active/historical sets, terminal supersession resolution, and `active`/`contested`/`superseded` precedence
- [ ] T011 Implement typed downstream output carrying relation IDs, counterpart claim IDs, evidence state, effective status, and canonical active-pair counts
- [ ] T012 Implement audit/replay output binding each derived result to event IDs, sequences, evidence locators, authorization references, detector/reducer versions, and fingerprint
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: `CONTRADICTION` round-trips a canonical symmetric pair with complete evidence and append-only assertion/withdrawal history
- [ ] T014 Verify: `SUPERSESSION` round-trips a directional replacement with complete rationale/evidence and append-only assertion/withdrawal history
- [ ] T015 Verify: Detector candidates cannot alter effective status before authorization and a durable append receipt
- [ ] T016 Verify: Self-relations, missing references, non-canonical pairs, cycles, competing active successors, and ambiguous withdrawals fail before sequence allocation
- [ ] T017 Verify: Exact event retries are idempotent and changed content under an existing event ID fails without double-counting
- [ ] T018 Verify: Mixed histories apply supersession precedence while preserving active and historical contradiction evidence
- [ ] T019 Verify: Repeated and cross-process replay yields byte-identical relation sets, terminal successors, statuses, counts, and audit output
- [ ] T020 Verify: Corruption, unknown event/reducer versions, unresolved references, and fingerprint mismatch yield no trusted projection
- [ ] T021 Verify: Dark relationship recording changes no legacy output or authority and sibling consumers use the typed projection contract
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
