---
title: "Implementation Plan: Deep Review resume adapter"
description: "Implementation plan for the Deep Review resume adapter: fold the sealed ledger through the shared review-loop reducers, rebuild the continuity ladder, and plan idempotent re-entry without duplicate, missing, or unsafe replayed events."
trigger_phrases:
  - "deep review resume adapter implementation plan"
  - "sealed ledger review recovery plan"
  - "deep-review idempotent re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Reverified the certificate-bound resume adapter at HEAD"
    next_safe_action: "Shadow parity can consume the closed resume evidence"
    blockers: []
    key_files: []
    completion_pct: 100
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
| **Surface** | system-deep-loop deep-review mode |
| **Change class** | Additive-dark ledger-backed recovery and re-entry |
| **Execution** | Implemented against the landed typed ledger, reducers, sealed artifacts, certificates, and shared effect substrate |

### Overview
The adapter will rebuild Deep Review from a sealed ledger frontier rather than from a mutable checkpoint or report. It will run the shared reducers over the accepted event prefix, derive the continuity ladder from scope through review dimensions, candidate/proof obligations, convergence, and report materialization, then return one typed re-entry decision. The decision is keyed by manifest revision, logical identity, artifact receipt, and replay fingerprint; it never assumes that a prior status is reusable merely because a label matches.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase-012 shared review-loop contract is frozen and names the event frontier, reducer versions, and terminal semantics consumed by modes. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:1-97,441-557`; fresh adapter suite 12/12]
- [x] Phase 015 has published the mode interface, write ownership, and executable conflict graph. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:1119-1462`; fresh adapter suite 12/12]
- [x] Deep Review sibling concerns expose the typed event, reducer, proof, and certificate contracts needed by the adapter. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:1-73`; whole-runtime TypeScript exit 0]
- [x] Every interruption boundary and external-effect state has a defined recovery outcome. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:123-199,760-877`; fresh adapter suite 12/12]
- [x] The continuity ladder and re-entry decision algebra are written as testable invariants. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:123-199,558-759,878-970`; fresh adapter suite 12/12]
- [x] The adapter has one authoritative ledger read path and no mutable-summary fallback. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:1119-1211`; fresh adapter suite 12/12]

### Definition of Done
- [x] A sealed-frontier fold reconstructs Deep Review state deterministically. [Evidence: `runtime/tests/unit/deep-review-resume-adapter.vitest.ts:645-913`; fresh command exit 0, 12/12]
- [x] Re-entry decisions are idempotent for duplicate requests and fail closed for missing, conflicting, or incompatible evidence. [Evidence: `runtime/tests/unit/deep-review-resume-adapter.vitest.ts:827-913`; fresh command exit 0, 12/12]
- [x] Crash-injection and replay tests cover scope, dimension, finding, proof, convergence, and report boundaries. [Evidence: `runtime/tests/unit/deep-review-resume-adapter.vitest.ts:645-913`; fresh command exit 0, 12/12]
- [x] The adapter consumes the shared loop backbone without a Deep Review-specific fork. [Evidence: `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts:1-73,1119-1462`; whole-runtime TypeScript exit 0]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Authoritative input**: read the sealed ledger prefix and its frontier certificate; verify sequence continuity, event hashes, schema versions, reducer versions, and the replay-compatibility fingerprint before folding.
- **Shared fold**: invoke the phase-012 review-loop reducer contract for the common lifecycle. Deep Review supplies typed event data and a mode projection; it does not introduce alternate transition rules for scope, pass, convergence, or terminal state.
- **Deep Review projection**: derive a continuity ladder with these ordered states: `scope-established`, `dimension-active`, `candidate-open`, `proof-open`, `convergence-pending`, `report-pending`, `report-sealed`, and explicit `blocked` or `contested` variants. Each state carries its owning logical ID, last applied event sequence, required evidence, and next safe action.
- **Finding continuity**: use reducer-owned partial fingerprints and introduced/fixed/preexisting lineage to match findings across passes and revisions. Preserve raw candidates, challenges, proof receipts, dispositions, and suppressions as immutable events; derive P0/P1/P2 only for presentation.
- **Resume planner**: evaluate each incomplete logical pass or effect as `reuse`, `reexecute`, `compensate`, `reconcile`, or `reject`. Reuse requires compatible manifest and artifact fingerprints. Re-execution changes only the attempt ID while retaining the stable logical ID. Unknown irreversible effects block automatic retry.
- **Idempotency boundary**: write a resume decision with a deterministic key derived from lineage, sealed frontier, manifest revision, and replay fingerprint. A compare-and-set or equivalent single-writer guard makes duplicate requests converge on the existing decision rather than append another logical transition.
- **Report projection**: materialize `review-report.md` only from the folded sealed state and a report projection key. A report already committed for the same input frontier is reused; a different frontier produces a new immutable projection event rather than mutating the old report history.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-012 and phase-015 contracts are available at the pinned baseline and record the exact event, reducer, fingerprint, and write-set interfaces.
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

The adapter depends on the phase-012 shared review-loop contract for lifecycle transitions, sealed-frontier semantics, and reducer invocation. It depends on phase 015 for the common mode interface, shared fixtures, and executable write-set conflict graph. It consumes typed events, reducers, certificates, and shadow interfaces from the Deep Review sibling concerns, but the required adjacency to `004-certificates-and-receipts` and `006-shadow-parity` is navigation and ordering rather than a hard runtime dependency. The later authority-cutover phase remains the only owner of authority changes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive-dark and changes no runtime authority. Rollback removes the adapter package and its focused test, preserves the sealed ledger and immutable events, and returns the lineage to the existing recovery path without rewriting history. A resume request with an unknown external effect remains blocked for reconciliation rather than being treated as if the effect never occurred.
<!-- /ANCHOR:rollback -->
