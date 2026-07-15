---
title: "Implementation Plan: Deep Review resume adapter (013 phase 002/005)"
description: "Implementation plan for the Deep Review resume adapter: fold the sealed ledger through the shared review-loop reducers, rebuild the continuity ladder, and plan idempotent re-entry without duplicate, missing, or unsafe replayed events."
trigger_phrases:
  - "deep review resume adapter implementation plan"
  - "sealed ledger review recovery plan"
  - "deep-review idempotent re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the resume adapter around sealed frontier and reducer replay"
    next_safe_action: "Map shared loop events to Deep Review continuity ladder states"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop deep-review mode (phase 013/002/005) |
| **Change class** | Planning contract for ledger-backed recovery and re-entry |
| **Execution** | Later implementation against the phase-009 shared loop contract and phase-012 conflict graph |

### Overview
The adapter will rebuild Deep Review from a sealed ledger frontier rather than from a mutable checkpoint or report. It will run the shared reducers over the accepted event prefix, derive the continuity ladder from scope through review dimensions, candidate/proof obligations, convergence, and report materialization, then return one typed re-entry decision. The decision is keyed by manifest revision, logical identity, artifact receipt, and replay fingerprint; it never assumes that a prior status is reusable merely because a label matches.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-009 shared review-loop contract is frozen and names the event frontier, reducer versions, and terminal semantics consumed by modes
- [ ] Phase 012 has published the mode interface, write ownership, and executable conflict graph
- [ ] Deep Review sibling concerns expose the typed event, reducer, proof, and certificate contracts needed by the adapter
- [ ] Every interruption boundary and external-effect state has a defined recovery outcome
- [ ] The continuity ladder and re-entry decision algebra are written as testable invariants
- [ ] The adapter has one authoritative ledger read path and no mutable-summary fallback

### Definition of Done
- [ ] A sealed-frontier fold reconstructs Deep Review state deterministically
- [ ] Re-entry decisions are idempotent for duplicate requests and fail closed for missing, conflicting, or incompatible evidence
- [ ] Crash-injection and replay tests cover scope, dimension, finding, proof, convergence, and report boundaries
- [ ] The adapter consumes the shared loop backbone without a Deep Review-specific fork
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Authoritative input**: read the sealed ledger prefix and its frontier certificate; verify sequence continuity, event hashes, schema versions, reducer versions, and the replay-compatibility fingerprint before folding.
- **Shared fold**: invoke the phase-009 review-loop reducer contract for the common lifecycle. Deep Review supplies typed event data and a mode projection; it does not introduce alternate transition rules for scope, pass, convergence, or terminal state.
- **Deep Review projection**: derive a continuity ladder with these ordered states: `scope-established`, `dimension-active`, `candidate-open`, `proof-open`, `convergence-pending`, `report-pending`, `report-sealed`, and explicit `blocked` or `contested` variants. Each state carries its owning logical ID, last applied event sequence, required evidence, and next safe action.
- **Finding continuity**: use reducer-owned partial fingerprints and introduced/fixed/preexisting lineage to match findings across passes and revisions. Preserve raw candidates, challenges, proof receipts, dispositions, and suppressions as immutable events; derive P0/P1/P2 only for presentation.
- **Resume planner**: evaluate each incomplete logical pass or effect as `reuse`, `reexecute`, `compensate`, `reconcile`, or `reject`. Reuse requires compatible manifest and artifact fingerprints. Re-execution changes only the attempt ID while retaining the stable logical ID. Unknown irreversible effects block automatic retry.
- **Idempotency boundary**: write a resume decision with a deterministic key derived from lineage, sealed frontier, manifest revision, and replay fingerprint. A compare-and-set or equivalent single-writer guard makes duplicate requests converge on the existing decision rather than append another logical transition.
- **Report projection**: materialize `review-report.md` only from the folded sealed state and a report projection key. A report already committed for the same input frontier is reused; a different frontier produces a new immutable projection event rather than mutating the old report history.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-009 and phase-012 contracts are available at the pinned baseline and record the exact event, reducer, fingerprint, and write-set interfaces.
- Inventory Deep Review interruption boundaries: before append, after append, during fold, after candidate admission, after proof receipt, during convergence, and during report materialization.
- Define the state-transition and invariant matrix for the continuity ladder, including missing, duplicate, conflicting, late, contested, and unknown-effect inputs.

### Phase 2: Implementation
- Bind the adapter to the shared sealed-frontier reader and reducer registry; reject unsealed or incompatible histories before scheduling work.
- Implement the Deep Review continuity projection from folded state, with explicit ownership for scope, dimension cells, candidate/proof obligations, convergence, and report status.
- Implement logical identity and replay-fingerprint matching for pass, finding, proof, and report work; keep attempt identity separate from logical identity.
- Implement the resume decision algebra and persist the decision before any re-entered side effect; preserve unknown outcomes for receipt lookup or compensation.
- Add duplicate-request protection and late-event handling so a second process cannot double-apply a committed transition or erase a branch-local success.
- Expose the next safe action to the shared loop runner without duplicating its transition or convergence policy.

### Phase 3: Verification
- Replay each sealed fixture from an empty reducer and from every interruption frontier; compare state fingerprints, event counts, open obligations, and next actions.
- Inject crashes at every append/fold/proof/convergence/report boundary and verify recovery neither loses nor duplicates logical work.
- Exercise unchanged, compatible, migrated, pinned, incompatible, and changed-manifest fingerprints; verify the expected reuse, reexecute, reconcile, compensate, or reject result.
- Deliver duplicate and concurrent resume requests for one lineage and independent lineages; compare behavior with the phase-012 write-set conflict graph.
- Confirm report projection idempotency, raw finding preservation, derived severity behavior, and compatibility with later shadow-parity and mode-gate checks.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Seal a ledger prefix, corrupt its frontier or chain, and verify recovery refuses before scheduling a pass |
| REQ-002 | Fold identical prefixes in fresh processes and compare canonical state and next-action fingerprints |
| REQ-003 | Build fixtures ending at scope, each dimension cell, candidate, proof, convergence, and report boundaries; verify one owning continuity state per fixture |
| REQ-004 | Submit the same resume request repeatedly and concurrently; assert one logical decision and stable projection keys |
| REQ-005 | Remove, duplicate, reorder, and conflict events; alter the replay fingerprint; assert blocked, reconcile, or reject without silent progress |
| REQ-006 | Change manifest revision, adapter version, reducer version, and artifact digest independently; verify stable logical IDs and changing attempt IDs follow the decision algebra |
| REQ-007 | Replay candidate, proof, disposition, and suppression history; verify raw events remain present and P0/P1/P2 is derived from orthogonal fields |
| REQ-008 | Run the shared-loop contract fixtures and write-set conflict cases; verify no mode-local transition path is exercised |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The adapter depends on the phase-009 shared review-loop contract for lifecycle transitions, sealed-frontier semantics, and reducer invocation. It depends on phase 012 for the common mode interface, shared fixtures, and executable write-set conflict graph. It consumes typed events, reducers, certificates, and shadow interfaces from the Deep Review sibling concerns, but the required adjacency to `004-certificates-and-receipts` and `006-shadow-parity` is navigation and ordering rather than a hard runtime dependency. The later authority-cutover phase remains the only owner of authority changes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning only and changes no runtime authority. If implementation reveals a contract mismatch, disable the adapter at its boundary, preserve the sealed ledger and all immutable events, and return the lineage to the existing non-authoritative or legacy recovery path without deleting or rewriting history. Revert only the adapter implementation and its tests; retain migration evidence so the corrected contract can be re-run against the same sealed fixtures. A resume request with an unknown external effect remains blocked for reconciliation rather than being rolled back as if the effect never occurred.
<!-- /ANCHOR:rollback -->
