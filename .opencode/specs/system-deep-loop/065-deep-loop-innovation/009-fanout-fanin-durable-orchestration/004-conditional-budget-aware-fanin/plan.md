---
title: "Implementation Plan: Conditional Budget-Aware Fan-in"
description: "Implementation plan for replay-stable fan-in that stops on evidence sufficiency or typed-budget floors and preserves cancellation, salvage, and reducer-input evidence."
trigger_phrases:
  - "conditional budget-aware fan-in implementation plan"
  - "dynamic fan-in implementation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
    last_updated_at: "2026-07-15T14:48:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the fan-in decision architecture, stop precedence, and verifier strategy"
    next_safe_action: "Implement the decision reducer and cancel-salvage state transitions"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Conditional Budget-Aware Fan-in

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop durable orchestration |
| **Change class** | Ledgered orchestration policy and runtime control flow |
| **Execution** | Additive-dark implementation with replay and shadow-parity fixtures |

### Overview
Replace the current implicit wait-for-all join with a versioned decision reducer that evaluates accepted durable
results, outstanding branch state, partial-failure eligibility, sufficiency evidence, and the phase-007 typed-budget
snapshot at one ledger event cut. The reducer either keeps awaiting or finalizes an immutable decision that dispositions
outstanding leaves and hands an exact ordered result set to reduction. Current \`fanout-run.cjs\` behavior remains the
shadow baseline until later program gates authorize cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Typed budget reservation and settlement interfaces expose all four dimensions, ancestor denials, and stable snapshot references
- [ ] Durable result envelopes, logical branch IDs, dispatch/attempt IDs, leases, and wave identities are frozen
- [ ] Partial-failure policy exposes typed branch/result eligibility without owning fan-in finalization
- [ ] Reduction exposes an input contract bound to ordered result-envelope IDs and a digest
- [ ] The current wait-for-all summary behavior in \`fanout-run.cjs\` has pinned shadow fixtures

### Definition of Done
- [ ] Await/stop evaluation is deterministic at an event-sequence cut and records every satisfied trigger
- [ ] Sufficiency requires count, support, and provenance-diversity evidence
- [ ] Budget floor uses atomic typed admission for another useful result plus settlement margin
- [ ] Queued, reserved, cancellable, non-cancellable, late, failed, and expired leaves have explicit dispositions
- [ ] Finalized decisions replay to the same reducer-input digest and cannot be mutated by late results
- [ ] Conditional fan-in stays dark until shadow parity and later cutover gates pass
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **FanInPolicy**: versions minimum accepted results, agreement/support threshold, provenance-diversity floor, budget-floor request shape, cancellation policy, salvage policy, and the optional value-of-computation slot.
- **FanInDecisionView**: folds ledger events through a declared sequence into accepted result envelopes, outstanding branch/attempt states, lease/fence state, partial-failure eligibility, budget snapshot references, and prior open decision state.
- **SufficiencyEvaluator**: returns typed pass/fail evidence and a provenance digest; it cannot dispatch, reserve budget, cancel leaves, or finalize the decision.
- **BudgetContinuationProbe**: asks the phase-007 authority for one complete next-result reservation plus settlement margin. Any missing, stale, exhausted, conflicting, or unreconciled dimension denies continuation.
- **FanInDecisionReducer**: applies deterministic trigger precedence, freezes included/excluded IDs, computes the ordered reducer-input digest, and emits one transition-authorized decision event.
- **OutstandingDispositionCoordinator**: withdraws queued work, cancels unused reservations, emits fenced cancel requests, and routes racing/non-cancellable terminals to salvage while preserving spend settlement.
- **ReductionHandoff**: supplies only the decision-bound ordered result set, decision ID, digest, and completion classification to the later provenance-balanced reducer.
- **ShadowAdapter**: derives the new decision beside the existing full-pool settlement path and compares when conditional fan-in would have stopped, which results it would include, and which budget reason applied.

Decision finalization and terminal-result persistence serialize through the ledger transition gateway. The finalized
event carries its sequence cut; any later result is linked as salvage and cannot be incorporated without a new
authorized superseding decision. Cancellation is advisory to executors but authoritative for reducer eligibility:
failure to stop a process never permits a late result to mutate the frozen input.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin current \`fanout-run.cjs\` wait-for-all, per-lineage budget-cap, aggregate-cap, cancellation, summary, and salvage behavior.
- Confirm typed budget, result-envelope, logical-branch, lease/wave, partial-failure, and reduction interface versions.
- Define event names, policy schema, decision schema, stop precedence, and deterministic result ordering.

### Phase 2: Implementation
- Implement the event-cut decision view and sufficiency evaluator with provenance-aware quorum evidence.
- Implement the typed continuation probe and settlement-margin request against the phase-007 budget authority.
- Implement the fan-in decision reducer, authorization call, immutable included set, and reducer-input digest.
- Implement outstanding-leaf withdrawal, reservation release, fenced cancellation, non-cancellable detach, and late-result salvage.
- Bind reduction handoff to the finalized decision and reject mismatched or mutated result sets.
- Add the optional versioned value-of-computation field with a deterministic no-signal default.
- Emit additive-dark shadow decisions beside the current wait-for-all runtime path.

### Phase 3: Verification
- Exercise sufficiency, budget-floor, simultaneous-trigger, all-terminal, and fail-closed decisions under reordered but equivalent event delivery.
- Race decision finalization against queued withdrawal, reservation release, cancel acknowledgement, process completion, lease expiry, and late result persistence.
- Verify all actual spend settles and only proven-unused reservations release.
- Verify correlated results cannot satisfy a provenance-aware quorum and late results cannot change the reducer-input digest.
- Compare shadow decisions with pinned \`fanout-run.cjs\` summaries and prove legacy authority remains unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Rebuild the decision view from shuffled delivery with the same ledger order and compare its event cut and inputs |
| REQ-002 | Cover every continue/stop branch and reject reduction without a finalized typed trigger |
| REQ-003 | Matrix minimum count, agreement threshold, independent provenance, correlated duplicates, and contradictory results |
| REQ-004 | Deny continuation separately at program, mode, lineage, and iteration scope for each typed dimension |
| REQ-005 | Assert exhaustion, stale pricing, missing accounting, and reconciliation gaps never classify as convergence |
| REQ-006 | Replay the ledger and compare decision ID inputs, all triggers, primary trigger, included IDs, and digest |
| REQ-007 | Race withdrawal and reservation cancellation; verify no dispatch occurs and only unused capacity releases |
| REQ-008 | Race cancel request with terminal success/failure; verify actual spend and salvage evidence survive |
| REQ-009 | Persist a late result after the cut and prove the authoritative reducer input remains unchanged |
| REQ-010 | Alter order, membership, or content after finalization and require reduction handoff rejection |
| REQ-011 | Feed strict/quorum/deadline/progressive eligibility outcomes through the same decision schema |
| REQ-012 | Run with no value signal and a versioned phase-011 stub; typed budget admission remains authoritative |
| REQ-013 | Assert shadow mode writes evidence only and the legacy wait-for-all result remains authoritative |
| REQ-014 | Source-reference lint confirms the budget spec, runtime runner, and phase tree remain cited |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child contract declares \`depends_on: []\`; predecessor/successor adjacency is navigational. Implementation integrates
with the typed budget contract in
\`.opencode/specs/system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md\`,
the current orchestration baseline in \`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs\`, and the
ordering/invariants in
\`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json\`.
Within the durable-orchestration parent it consumes frozen branch/result/lease/partial-failure interfaces but does not
make sibling authoring order a hard dependency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Conditional fan-in lands additive-dark behind a policy/authority switch. Rollback disables decision authority and
restores the current wait-for-all join while retaining ledgered shadow decisions, result envelopes, spend settlement,
cancel/salvage evidence, and replay data. Never delete or rewrite a finalized decision during rollback. Any in-flight
conditional decision either completes under its pinned policy version or is transitioned to a typed rollback state;
legacy authority resumes only after outstanding reservations and executor dispositions reconcile.
<!-- /ANCHOR:rollback -->
