---
title: "Implementation Summary: Conditional Budget-Aware Fan-in"
description: "Additive-dark conditional fan-in with event-cut decisions, provenance-aware sufficiency, typed hierarchical budget floors, safe outstanding disposition, and immutable reduction binding."
trigger_phrases:
  - "conditional fan-in implementation"
  - "budget-aware fan-in evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
    last_updated_at: "2026-07-21T05:20:03Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the additive-dark conditional fan-in leaf"
    next_safe_action: "Preserve wait-for-all authority until a later cutover packet explicitly adopts fan-in decisions"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/conditional-fanin.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Conditional Budget-Aware Fan-in

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-conditional-budget-aware-fanin |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Candidate** | Uncommitted leaf delta on base `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Policy / decision version** | 1 / 1 |
| **Decision event** | `fanout.fanin.decision-finalized` version 1 |
| **Authority** | Current `fanout-run.cjs` wait-for-all path remains authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Conditional fan-in now has a versioned dark policy surface that evaluates durable results and branch state at one event-sequence cut. It can record a transition-authorized immutable decision, but it cannot replace the current runner. The decision contains every satisfied trigger, its precedence-selected classification, exact included/excluded/outstanding identities, the typed budget snapshot and admission outcome, provenance sufficiency evidence, state-specific dispositions, and an ordered reducer-input digest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/conditional-fanin/types.ts` | Created | Closed policy, cut, budget, sufficiency, decision, disposition, and salvage types |
| `runtime/lib/conditional-fanin/policy.ts` | Created | Version validation, deterministic default, and policy digest |
| `runtime/lib/conditional-fanin/decision-view.ts` | Created | Event-cut normalization and fail-closed result/branch validation |
| `runtime/lib/conditional-fanin/sufficiency.ts` | Created | Count, agreement, and provenance-group quorum evidence |
| `runtime/lib/conditional-fanin/budget-continuation.ts` | Created | Complete next-result plus margin reservation through the existing budget authority |
| `runtime/lib/conditional-fanin/decision.ts` | Created | Fixed trigger precedence, immutable candidate, reducer digest, and late-result salvage link |
| `runtime/lib/conditional-fanin/decision-event.ts` | Created | Closed event schema and prior-head authorized ledger commit |
| `runtime/lib/conditional-fanin/disposition.ts` | Created | Queued, reserved, cancellable, non-cancellable, and terminal disposition plans and executor ports |
| `runtime/lib/conditional-fanin/reduction.ts` | Created | Exact ordered-envelope binding and drift rejection |
| `runtime/lib/conditional-fanin/shadow-adapter.ts` | Created | Dark evaluation with explicit legacy authority |
| `runtime/lib/conditional-fanin/index.ts` | Created | Public leaf API |
| `runtime/tests/unit/conditional-fanin.vitest.ts` | Created | Event-cut, quorum, budget, race, salvage, disposition, and reduction fixtures |
| `plan.md`, `tasks.md`, `checklist.md` | Modified | Reconciled implementation and verifier evidence |
| `implementation-summary.md` | Created | Recorded proofs, verification, limitations, and dark boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The leaf composes the existing result-envelope, branch-lease/wave, hierarchical-budget, event-envelope, transition-authorization, and append-only-ledger APIs. The runner remains untouched. Verification uses real temporary authorized ledgers and the real typed budget authority, then exercises pure replay and reduction boundaries with deterministic fixtures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use integer basis points for support | Replay never depends on floating-point threshold interpretation |
| Count each provenance group at most once | Duplicate or correlated lineage outputs cannot manufacture independent agreement |
| Make a conflicting provenance group abstain | One lineage cannot vote for contradictory answers and still support either answer |
| Consume `HierarchicalBudgetAuthority.admit` once | The budget owner retains atomic four-dimensional ancestor enforcement and evidence |
| Require positive estimate and margin in all dimensions | Token, money, attempt, and monotonic wall-time admission cannot collapse into zero-cost continuation |
| Store every trigger in precedence order | Replay preserves simultaneous evidence while anomaly and exhaustion cannot be hidden by sufficiency |
| Commit against the exact ledger head | Result/terminal races either precede the cut or invalidate it; they cannot mutate the frozen set |
| Express cancellation through fenced/idempotent ports | Executor owners retain effect authority while fan-in pins decision, branch, reservation, lease, and fence identity |
| Keep the optional value signal rank-only | Later usefulness scoring can select a candidate but cannot grant budget or rewrite a decision |

### Load-Bearing Proofs

#### Atomic Event-Cut Freeze

`buildFanInDecisionView` rejects every result or branch state whose ledger sequence exceeds the declared cut, validates result envelopes, requires running branches to carry the matching lease, sorts by ledger sequence and stable identity, and binds the policy digest and budget evidence. `finalizeFanInDecisionCandidate` then materializes included, excluded, and outstanding IDs, sufficiency evidence, the post-admission budget snapshot, dispositions, ordered reducer inputs, and both reducer and decision digests before any reduction handoff exists.

`commitFanInDecision` requires the decision ledger ID and registry digest to match the cut, reads the exact cut head, asks the transition gateway for an allow proof against that prior head, and calls `AppendOnlyLedger.appendAuthorized`. The ledger rechecks the head and single-use proof under its exclusive append lock. A terminal event committed first makes the cut stale; a terminal event racing after authorization makes the authorized append stale. Neither path can persist a decision over a different result set.

#### Provenance-Diverse Sufficiency

Eligible envelopes contribute to the configured count, but support is calculated over distinct provenance groups. One coherent group casts at most one vote. A group containing multiple agreement keys contributes no supporting vote. The winning key is selected by supporting-group count with lexical tie-breaking; integer basis points compare that count with all distinct groups. Fixtures prove three duplicate envelopes from one lineage fail the diversity floor and a contradictory lineage cannot inflate support.

#### Typed Hierarchical Budget Floor

The continuation request adds one complete typed result estimate to a complete typed settlement margin, rejects zero values in any component, and issues one deterministic reservation against the existing phase-007 authority. That authority serializes the mutation and checks token, monetary, iteration-attempt, and monotonic wall-time capacity at every scope in the program-to-iteration path. Sixteen fixtures independently constrain each dimension at program, mode, lineage, and iteration scope; every continuation is denied as budget-constrained with `converged: false`.

#### Exhaustion Is Never Success

Only an allowed, dispatch-enabled, granted budget decision becomes `reserved`. Typed exhaustion and deadline exhaustion become `budget-constrained`; stale pricing, missing scope/accounting, reconciliation blocks, reservation conflicts, authorization denial, ledger failure, replay mismatch, and every other denial become fail-closed anomalies. The await predicate maps those outcomes to incomplete classifications. Simultaneous sufficiency cannot change them into convergence.

#### Deterministic Precedence

The pure predicate always records triggers in this fixed order: fail-closed anomaly, budget floor, sufficiency, all eligible terminal. The first is primary. A fixture with exhaustion plus sufficient evidence records both and selects budget floor; adding stale-state evidence records all three and selects anomaly. Identical cut data in different arrival order yields the same complete decision and digest.

#### Safe Outstanding Disposition

Queued work gets a stable withdrawal key. Reserved-not-started work calls only `HierarchicalBudgetAuthority.cancel` after a no-dispatch proof; a replay returns the same idempotent cancellation and releases the proven unused reservation once. Running cancellable work carries its exact lease ID and fence token into one stable cancel-and-settle command. Running non-cancellable work detaches to salvage while retaining lease and spend. Both running paths require actual-spend settlement; no disposition writes a direct capacity release or erases committed spend.

#### Late Results Stay Non-Authoritative

The view rejects post-cut envelopes. `recordLateResultForSalvage` accepts only a valid envelope at a later ledger sequence, marks it non-authoritative, and derives a salvage digest without touching the decision. The late-result fixture confirms included IDs and the reducer-input digest remain byte-identical.

#### Reduction Is Bound to the Decision

`bindReductionToDecision` requires the exact envelope count, position, envelope ID, content digest, and recomputed ordered-input digest recorded in the finalized decision. Reorder, membership growth, or content mismatch throws before the reducer receives input.

#### Value Signal Extension Is Rank-Only

The default policy contains a versioned no-signal value. A rank-only extension requires a signal digest and may reorder eligible outstanding branches. It still calls the same typed reservation authority. The high-ranked denial fixture remains budget-constrained and cannot rewrite an existing decision.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Conditional fan-in leaf suite | PASS, exit 0: 1 file and 29 tests |
| Scope/dimension budget matrix | PASS: 16 program/mode/lineage/iteration by token/cost/attempt/wall-time cases |
| Runtime TypeScript typecheck | PASS, exit 0 |
| Strict spec validation | PASS, exit 0: Errors 0 |
| Comment hygiene scan | PASS: no requirement, checklist, task, packet, or phase labels in runtime/test code |
| Additive-dark scope | PASS: new module, one test, and this leaf's docs only; `fanout-run.cjs` unchanged |

### Exact Commands

```bash
cd .opencode/skills/system-spec-kit/mcp-server
npx vitest run ../../system-deep-loop/runtime/tests/unit/conditional-fanin.vitest.ts
npx tsc --noEmit -p ../../system-deep-loop/runtime/tsconfig.json
```

Leaf result: `Test Files 1 passed (1); Tests 29 passed (29)`. TypeScript result: exit 0.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin \
  --strict
```

Strict result: exit 0 with zero errors.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Production authority is intentionally unchanged.** The current runner does not import this module; a later authorized cutover must wire it into execution.
2. **Executor effects remain port-owned.** The fan-in layer freezes fenced cancel and salvage commands, while executor owners perform cancellation and receipt-backed settlement.
3. **Decision atomicity uses the shared ledger domain.** Results and terminal transitions must serialize through the same authorized ledger cut for the prior-head proof to govern their race.
4. **The whole worktree is not clean.** Other user-owned packet changes predate this leaf; path-scoped status is the asserted boundary.
<!-- /ANCHOR:limitations -->

---

## Deviations from Plan

The plan described emitting shadow decisions beside the current runner. The scope lock forbade editing `fanout-run.cjs`, so delivery is an importable shadow adapter whose return value explicitly states that wait-for-all remains authoritative. No current execution path was rewired. The budget service, result envelopes, branch leases/waves, event envelope, authorization ledger, and replay-fingerprint modules were consumed through their public contracts and were not redefined or modified.
