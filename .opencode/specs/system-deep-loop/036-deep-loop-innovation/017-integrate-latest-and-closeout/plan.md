---
title: "Implementation Plan: Integrate Latest & Closeout"
description: "Implementation Plan for the final system-deep-loop recommendations phase: integrate the latest origin, re-census contract drift, reopen affected phases, rerun the whole-system gate on the final SHA, and reconcile packet state."
trigger_phrases:
  - "integrate latest and closeout implementation plan"
  - "deep-loop phase 017 implementation plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/017-integrate-latest-and-closeout"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-integrate-latest-and-closeout"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the final-SHA integration, drift, gate, and reconciliation phases"
    next_safe_action: "Execute the clean-worktree integration and touched-contract recensus"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Integrate Latest & Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / 065 recommendations implementation |
| **Change class** | Integration, contract recensus, gate rerun, and packet reconciliation |
| **Execution** | Clean isolated worktree; final evidence bound to one exact SHA |

### Overview
Phase 017 is the final landing loop for the 15-phase program. It takes the last green phase-016 candidate, integrates the latest origin, compares the resulting tree with the program's phase contracts and pinned baseline, and routes relevant drift back to the owning phase before any closeout claim. The final verification is the complete phase-016 gate on the final SHA, followed by append-only open-item, changelog, parent-rollup, and generated-metadata reconciliation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `016-whole-system-gate` is green on its pre-integration SHA with receipts and exact candidate evidence
- [ ] The latest origin target, clean worktree, and integration method are recorded
- [ ] The 000 baseline and all phase receipts needed for touched-contract comparison are available
- [ ] The parent 065 open-item and changelog surfaces are inventoried without rewriting research inputs
- [ ] The deterministic metadata generation commands for the affected packet tree are identified

### Definition of Done
- [ ] Latest origin is integrated in a clean worktree and final SHA is recorded
- [ ] Touched contracts have a complete drift ledger and relevant drift has reopened the owning phases
- [ ] The full phase-016 gate is green on the final SHA
- [ ] Open items, changelogs, parent rollup, and generated metadata are reconciled and strict validation passes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Clean integration boundary**: Use an isolated worktree and path-scoped integration evidence. Record the pre-integration SHA, origin target, merge result, final SHA, and tracked-mutation result.
- **Touched-contract recensus**: Build a ledger from the integration diff and compare each touched producer, consumer, schema, persistence path, protected behavior, receipt, and write-set edge with the phase that owns it.
- **Drift classifier**: Mark drift relevant when it changes a phase input/output contract, protected baseline, persistence or schema boundary, dependency/write-set relation, or evidence binding. Mark drift non-relevant only with a recorded rationale and no changed acceptance surface.
- **Reopen router**: Reopen the owning phase first, then any downstream phase whose declared input is changed. Preserve prior receipts as historical evidence and require fresh phase evidence before phase 016 is accepted.
- **Final gate boundary**: Run the entire phase-016 contract against the final SHA, not a branch-relative range. The gate covers behavior and mode baselines, mixed-version replay, crash injection, counterfactual and degeneration tests, parity against 000, the blocking SOL review, and recursive strict validation.
- **Append-only closeout**: Add dispositions for 065 open items, append changelog entries, run deterministic metadata generation, and reconcile parent/child status fields without deleting historical records.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-016's pre-integration receipt, the pinned 000 baseline, current parent status, and a clean isolated worktree.
- Record the latest origin target, current HEAD, pre-integration candidate SHA, and expected integration scope.

### Phase 2: Implementation
- Integrate latest origin and resolve only conflicts required for the candidate; stop on unresolved conflicts or unexpected tracked mutation.
- Re-census the contracts touched by integration and write one disposition per touched contract and owning phase.
- Reopen relevant phases and downstream consumers before verification; record explicit non-relevant drift dispositions for the remaining touched items.
- Prepare append-only open-item dispositions, changelog entries, parent rollup changes, and deterministic metadata generation inputs.

### Phase 3: Verification
- Run the complete phase-016 gate on the final SHA, including all mode gates, replay/crash/counterfactual/degeneration coverage, parity, SOL receipt, and recursive `validate.sh --strict`.
- Confirm no stale pre-integration receipt is used as final evidence and all reopened phases have fresh evidence.
- Regenerate packet metadata, verify parent/child status consistency, and record the final closeout and any approved carry-forward item.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Clean-worktree and SHA record: origin target, pre-integration SHA, merge result, final SHA, and unexpected-mutation check |
| REQ-002 | Touched-contract recensus ledger maps changed contracts to owners, assumptions, baselines, receipts, and dispositions |
| REQ-003 | Drift fixture or review record proves relevant changes reopen owning phases and downstream consumers before the gate |
| REQ-004 | Phase-016 whole-system gate runs on the final SHA: exact-SHA behavior/mode baselines, mixed-version replay, crash injection, counterfactual and degeneration, parity against 000, SOL review, and recursive strict validation |
| REQ-005 | Append-only open-item ledger, changelog diff, generated metadata output, and parent rollup agree |
| REQ-006 | Evidence ledger distinguishes historical pre-integration receipts from fresh final-SHA receipts |
| REQ-007 | Parent phase map, child statuses, completion fields, changelogs, and generated metadata reconcile without contradictory state |
| REQ-008 | Final report includes drift set, reopen set, commands, exit codes, metadata result, and approved deferrals |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `execution-sequencing-strategy.md` | Internal contract | Green | Integrate-latest and reopen-on-drift sequencing is undefined |
| Parent 065 `spec.md` | Internal contract | Green | Scope, phase outcomes, success criteria, and open-item ownership cannot be reconciled |
| `manifest/phase-tree.json` | Internal manifest | Green | Dependency and phase outcome comparison is incomplete |
| `016-whole-system-gate` artifacts | Internal gate | Yellow | Final-SHA verification cannot be replayed until the phase-016 contract and receipts are available |
| 000 baseline and phase receipts | Internal evidence | Yellow | Regression and evidence-lineage comparison is blocked |
| `sk-git` worktree lifecycle | Internal workflow | Green | Latest origin cannot be integrated without contaminating the shared checkout |
| `validate.sh --strict` | Internal verifier | Green | Recursive packet closeout cannot be accepted |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If integration conflicts, unexpected tracked mutation, relevant drift without an executable reopen path, or any phase-016 check fails, stop the closeout and keep the pre-integration candidate as the last known evidence point. Discard the disposable integration worktree or revert only its path-scoped integration commits; do not mark the parent complete and do not delete historical receipts, open-item entries, or changelog history. Reopen the owning phase, produce fresh evidence, and restart the final-SHA gate from a clean candidate.
<!-- /ANCHOR:rollback -->
