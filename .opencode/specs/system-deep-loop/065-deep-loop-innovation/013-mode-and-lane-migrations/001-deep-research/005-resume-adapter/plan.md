---
title: "Implementation Plan: Deep Research - Resume Adapter"
description: "Implementation Plan for the Deep Research resume-adapter phase: ledger-only state reconstruction, continuity-ladder mapping, compatibility-bound recovery decisions, and idempotent re-entry."
trigger_phrases:
  - "deep research resume adapter implementation plan"
  - "deep-research idempotent resume plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-15T19:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined resume decision algebra and continuity-ladder ownership boundaries"
    next_safe_action: "Freeze compatibility outcomes and crash-window fixtures against phase-012 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-research mode migration |
| **Change class** | Planning contract for recovery and re-entry |
| **Execution** | Isolated worktree pinned to the phase-003 BASE; ledger remains additive-dark |

### Overview
Deep Research resume must rebuild the live loop from the sealed event-ledger substrate rather than choosing the newest mutable iteration or continuity file. The adapter folds the persisted ledger through the mode reducers, verifies the checkpoint and replay fingerprint, maps the reconstructed state to the continuity ladder, then persists one recovery decision per logical branch and effect before re-entry. The implementation must distinguish original-manifest replay from changed-manifest execution, reuse the root lease, and preserve claim, source, synthesis, and memory-handoff lineage. Detailed field names and event identities remain subordinate to the phase-012 shared contracts and the preceding Deep Research sibling plans.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-012 shared envelope, replay fingerprint, idempotency, and conflict contracts are frozen and available to the adapter.
- [ ] The typed Deep Research event union, reducer projection fields, sealed reference set, and certificate/receipt references are reviewed at their sibling boundaries.
- [ ] The continuity-ladder matrix names each lifecycle state, reducer field, required sealed reference, and allowed re-entry action.
- [ ] The recovery decision algebra covers branch reuse/re-execution, effect reconciliation/compensation, compatibility outcomes, source invalidation, and memory-save retry.
- [ ] Stable identifiers, manifest revision rules, root lease propagation, and append-before-dispatch ordering are defined without allocating a new lease on resume.
- [ ] Crash, duplicate-delivery, late-event, source-mutation, changed-manifest, and unknown-effect fixtures are specified with expected ledger outcomes.

### Definition of Done
- [ ] Ledger-only reconstruction reaches the same typed resumable state for the same sealed event history and reducer contract.
- [ ] Resume decisions are immutable, fingerprint-bound, idempotent, and safe under process restart and duplicate requests.
- [ ] The mode gate can hand the adapter to shadow parity without authority movement or legacy-writer changes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sealed-ledger reader**: read the complete verified ledger frontier and referenced sealed artifacts; reject hash-chain, seal, cursor, truncation, unknown-event, and projection-fingerprint failures before constructing live state.
- **Reducer-backed reconstruction**: invoke the pure Deep Research reducers with the persisted schema, reducer, codec, ordering, and projection versions; retain `lastAppliedSeq`, seen event IDs, finalized frontier, active branch/claim IDs, open contradiction IDs, community snapshot, and projection fingerprint.
- **Continuity adapter**: translate `run_initialized`, plan/frontier, gather/analyze, convergence, synthesis, and memory-save event families into the existing entry-point state contract without making mutable files authoritative.
- **Compatibility planner**: compare persisted and installed replay fingerprints, manifest revision, source/reference set, and policy versions; persist exact, compatible, migrate, pin-old-runtime, fork, reject, or blocked outcomes before dispatch.
- **Re-entry planner**: fold branch receipts and logical identities into `reuse`, `reexecute`, `compensate`, `reconcile`, or `reject`; pass only approved reexecute branches to the pool and preserve retry history by manifest revision plus logical branch ID.
- **Effect recovery boundary**: use stable effect IDs and idempotency keys with changing attempt IDs, provider receipts, and declared adapter capabilities; unknown irreversible effects remain blocked or reconciled rather than blindly retried.
- **Lease and handoff continuity**: propagate the original root `RunLease` through recovery, salvage, synthesis, and memory-save; use stable handoff identity and receipt lookup for interrupted persistence.
- **Dark-mode boundary**: emit adapter decisions and parity inputs as non-authoritative ledger facts. Legacy state and writers remain unchanged until later shadow, rollback, and cutover phases.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-012 shared contracts and the Deep Research sibling boundaries are frozen; verify the worktree is clean, pinned to BASE, and path-scoped.
- Inventory the current continuity ladder and legacy resume entry points without changing them; identify every mutable source that must be demoted from authority.
- Define the canonical resume request identity, ledger-tail input, reducer checkpoint, sealed-reference set, manifest revision, and root lease inputs.

### Phase 2: Implementation
- Specify the ledger-only reconstruction contract and reducer checkpoint validation, including full-rebuild and blocked outcomes.
- Build the continuity-ladder matrix for initialization, plan/frontier, gather, analyze, convergence, synthesis, memory-save, incomplete, and failed states.
- Define compatibility classification and immutable `resume_decision` events for exact, compatible, migrate, pin-old-runtime, fork, reject, and blocked cases.
- Define branch and effect recovery folds with stable logical IDs, changing attempts, adapter capabilities, unknown-effect handling, and append-before-dispatch ordering.
- Define source and claim dependency invalidation so source mutation reopens affected work without rewriting historical evidence or rebaselining the run.
- Define root lease propagation, memory-save handoff reconciliation, duplicate-resume suppression, and dark-path failure behavior.

### Phase 3: Verification
- Ledger-only replay reconstructs identical resumable state, continuity position, branch decisions, lease identity, and projection fingerprint from identical sealed history.
- Duplicate resume requests, duplicate events, process restart, and crash-window fixtures produce no double application or replayed side effect.
- Compatible and incompatible fingerprint fixtures select the declared outcome and never silently reuse stale branch success.
- Branch, effect, source, claim, synthesis, and memory-save cases preserve stable logical identity while attempts and revisions remain distinct.
- Changed source and claim fixtures reopen only dependent work, retain old evidence, and expose a deterministic new revision path.
- Dark-path checks prove that blocked resume does not mutate legacy state or present a dark result as production completion.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Replay sealed ledger fixtures with mutable continuity files removed or altered; compare reconstructed state and confirm no mutable file is consulted as authority |
| REQ-002 | Validate a lifecycle mapping matrix from event family to reducer field, continuity state, required reference, and allowed re-entry action |
| REQ-003 | Exercise exact, compatible, migrate, pin-old-runtime, blocked, unknown-event, and projection-mismatch fingerprints; verify each decision is persisted immutably |
| REQ-004 | Run branch fixtures with completed, missing, invalidated, and changed-manifest leaves; verify only `reexecute` leaves reach the pool and retry keys include manifest revision plus logical leaf ID |
| REQ-005 | Inject prepared/dispatched/result/unknown/reconciled/compensated effect sequences with varied adapter capabilities; verify irreversible unknown effects never auto-retry |
| REQ-006 | Submit identical resume requests concurrently and sequentially; compare event IDs, decision counts, reducer output, and side-effect dispatch count |
| REQ-007 | Restart after each lease debit and handoff boundary; verify the same lease ID, deadline, lineage, and generation are propagated without a fresh lease |
| REQ-008 | Mutate, retract, duplicate, and supersede source versions; verify affected-claim closure and synthesis invalidation while unaffected claims and evidence remain reusable |
| REQ-009 | Replay the frozen original manifest and a changed manifest separately; verify compatible reuse only for the former and explicit fork/restart/reject for the latter |
| REQ-010 | Run blocked, quarantined, and dark-success cases against a legacy-state snapshot; assert legacy bytes, writer behavior, and authority status remain unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the shared phase-006 typed ledger, transition authorization, effect, and replay primitives; phase-012 shared mode contracts and write-set conflict graph; and the Deep Research sibling contracts for typed events, reducers/projections, sealed artifacts, and certificates/receipts. The current Deep Research runtime and continuity files are read as compatibility inputs only. The research registries provide the resume decision algebra, root lease, effect unknown-state, replay-compatibility, claim-continuity, living-resume, and evidence-admission requirements. The manifest declares `depends_on: []`, so sibling adjacency names navigation order rather than a hard runtime dependency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Resume binding remains behind the dark-path adapter switch. If a reconstruction, compatibility, effect, or handoff check fails, disable new adapter re-entry, preserve the sealed ledger and all immutable decisions for diagnosis, and return control to the existing legacy resume path without rewriting legacy state. A path-scoped `git revert` of the phase commits restores the prior adapter contract; no deletion, data migration, ledger compaction, or legacy-writer retirement is part of this phase. Any already sealed references remain readable and are not rolled back by deleting evidence.
<!-- /ANCHOR:rollback -->
