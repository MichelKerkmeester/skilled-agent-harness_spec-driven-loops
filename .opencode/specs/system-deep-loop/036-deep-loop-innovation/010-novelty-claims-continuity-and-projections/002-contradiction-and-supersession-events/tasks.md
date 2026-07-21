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
    last_updated_at: "2026-07-21T08:31:20Z"
    last_updated_by: "codex"
    recent_action: "Completed event, reducer, audit, replay, and negative-fixture work"
    next_safe_action: "Use the exported typed projection from sibling consumer work"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Pin the phase-006 envelope, typed-ledger, authorization, and fingerprint interfaces used by both relationship events. Evidence: imports in `service.ts`, `replay.ts`, and `audit.ts`; runtime TypeScript compile exits 0.
- [x] T002 Record the prospective `001-semantic-communities` input contract and the stable claim/evidence references consumed at the phase-010 composition gate. Evidence: `RelationshipReferenceSnapshot` and candidate types carry community, evidence, provenance, independence, and detector identities.
- [x] T003 Freeze event names, schema versions, relation actions, required evidence fields, status enum, typed rejection codes, and canonical serializer rules. Evidence: `event-registry.ts`, `errors.ts`, and `types.ts` expose closed constants and unions.
- [x] T004 Build the run-2 fixture matrix for additions, corrections, retractions, duplicate sources, unresolved contradictions, and supersession chains. Evidence: the leaf suite covers assertion, both withdrawals, exact duplicate, conflict, contradictory evidence, and multi-hop supersession.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement semantic-community and evidence-snapshot input normalization that emits candidates without mutating claim state. Evidence: candidate-only and authorization-denial tests leave the relationship ledger at sequence 0 and claims `active`.
- [x] T006 Implement canonical symmetric contradiction pairing, incompatibility scope validation, evidence completeness, and withdrawal linkage. Evidence: reversed observations share one relationship ID; missing references and ambiguous withdrawals fail; contradiction withdrawal passes. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] T007 Implement directional supersession validation, stronger/newer evidence rationale, acyclic chain checks, competing-successor refusal, and withdrawal linkage. Evidence: directional IDs differ when reversed; chain, cycle, multiplicity, self, and withdrawal fixtures pass. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] T008 Register `deep-loop.claim.contradiction-recorded` and `deep-loop.claim.supersession-recorded` under the versioned envelope. Evidence: registry digest `e778bcdd5d8af3d70a5636010fcff277aa0eb3a7d050a64ab98f2c6ff7f493ed` covers exactly both definitions.
- [x] T009 Route both constructors through fail-closed transition authorization and conflict-detecting idempotent ledger append. Evidence: `ContradictionSupersessionService.record()` simulates before gateway authorization and exact retry recovers the original proof and receipt.
- [x] T010 Implement the pure relation fold for assertions/withdrawals, active/historical sets, terminal supersession resolution, and `active`/`contested`/`superseded` precedence. Evidence: `projection.ts` plus chain and mixed-history fixtures cover every status and terminal successor.
- [x] T011 Implement typed downstream output carrying relation IDs, counterpart claim IDs, evidence state, effective status, and canonical active-pair counts. Evidence: the typed-projection fixture asserts all fields and derives count 1 from one canonical active pair. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] T012 Implement audit/replay output binding each derived result to event IDs, sequences, evidence locators, authorization references, detector/reducer versions, and fingerprint. Evidence: `auditClaimRelationships()` and its fixture assert the durable linkage and covering fingerprint.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify: `CONTRADICTION` round-trips a canonical symmetric pair with complete evidence and append-only assertion/withdrawal history. Evidence: named contradiction assertion and withdrawal tests pass in the 16-test leaf suite.
- [x] T014 Verify: `SUPERSESSION` round-trips a directional replacement with complete rationale/evidence and append-only assertion/withdrawal history. Evidence: directional chain and supersession withdrawal tests pass.
- [x] T015 Verify: Detector candidates cannot alter effective status before authorization and a durable append receipt. Evidence: inert-candidate and stale-authority fixtures both keep sequence 0 and status `active`.
- [x] T016 Verify: Self-relations, missing references, non-canonical pairs, cycles, competing active successors, and ambiguous withdrawals fail before sequence allocation. Evidence: the negative fixtures assert unchanged domain and authorization-audit heads. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] T017 Verify: Exact event retries are idempotent and changed content under an existing event ID fails without double-counting. Evidence: the retry fixture compares complete original receipts, then asserts `EVENT_ID_CONFLICT` and head 1.
- [x] T018 Verify: Mixed histories apply supersession precedence while preserving active and historical contradiction evidence. Evidence: claim A stays `superseded` with its contradiction relation and both evidence positions exposed.
- [x] T019 Verify: Repeated and cross-process replay yields byte-identical relation sets, terminal successors, statuses, counts, and audit output. Evidence: same-artifact descriptor bytes and independently bundled child-process projection bytes match. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] T020 Verify: Corruption, unknown event/reducer versions, unresolved references, and fingerprint mismatch yield no trusted projection. Evidence: closed registries reject unknown contracts; unresolved, invalid-cycle, frame-corruption, and expected-fingerprint mismatch fixtures return `projection: null`.
- [x] T021 Verify: Dark relationship recording changes no legacy output or authority and sibling consumers use the typed projection contract. Evidence: path-scoped status contains only the isolated module/test/docs and projections declare `authority_mode: additive-dark`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. Evidence: T001 through T021 are checked with implementation or command evidence above.
- [x] All requirements in spec.md met with evidence. Evidence: the implementation summary maps canonical events, append-only correction, pre-append refusal, precedence, audit, replay, idempotency, and typed projections.
- [x] Phase gate green (validate/build/test/replay as applicable). Evidence: Vitest 16/16, `tsc --noEmit` exit 0, alignment drift pass, comment hygiene pass, and strict validation errors 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
