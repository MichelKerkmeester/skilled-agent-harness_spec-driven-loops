---
title: "Implementation Summary: Hierarchical Typed Budgets"
description: "Additive-dark hierarchical token, cost, iteration, and wall-time budget authority with authorized ledger evidence, deterministic replay, and shadow adapters."
trigger_phrases:
  - "hierarchical typed budgets implementation"
  - "typed budget verification evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-21T02:32:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark typed budget service"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts"
    completion_pct: 100
---
# Implementation Summary: Hierarchical Typed Budgets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hierarchical-typed-budgets |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **BASE SHA** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Candidate** | Uncommitted path-scoped working tree based on BASE; no candidate commit was requested |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now has one fail-closed budget service for tokens, fixed-precision monetary cost, iteration attempts, and
monotonic wall time. Budgets nest through `program > mode > lineage > iteration`; every mutation is reconstructed from
validated phase-006 events, authorized through the single-use transition gateway, and appended to the typed hash-chain
ledger. Fan-out and value-of-computation adapters expose the new admission contract in shadow mode while the shipped
legacy guards remain canonical.

### Runtime modules

| Module | Contract |
|--------|----------|
| `budget-types.ts` | Discriminated values, checked arithmetic, fixed-precision pricing identity, envelopes, and canonical hierarchy validation |
| `budget-events.ts` | Validator-bound lifecycle event registry and canonical event preparation |
| `budget-reducer.ts` | Deterministic ledger projection for scopes, reservations, balances, outcomes, and anomalies |
| `budget-authority.ts` | Serialized admission, allocation, lifecycle, settlement, reconciliation, gateway authorization, and append handling |
| `budget-replay.ts` | Replay-fingerprint component and execution-input bindings |
| `shadow-adapters.ts` | Read-only legacy council/fan-out comparison plus fan-out and convergence shadow admission |
| `index.ts` | Public module surface |
| `hierarchical-budgets.vitest.ts` | Focused 29-test contract suite |

### Contract proofs

| Contract | Proof |
|----------|-------|
| Typed dimensions | Cross-dimension, negative, overflow, currency, pricing-digest, and implicit-unlimited inputs reject before mutation |
| Hierarchy | Parent links validate the exact four-level tree; orphan, wrong-parent, and replay mismatches fail closed |
| Atomic admission | Exact-cap succeeds; one-over and ancestor exhaustion emit one denial/exhaustion record with no partial balance change or dispatch marker |
| Concurrency and idempotency | Sibling race grants exactly one final allotment; replayed logical requests retain one transition and stable result |
| Settlement | Attempts, retries, and failures remain charged; receipt-backed actual usage commits; only proven unused capacity releases |
| Uncertain accounting | Missing usage, stale pricing, overage, authorization denial, replay mismatch, and ledger append failure block new work |
| Replay | Re-instantiation from the verified ledger reproduces scope, reservation, balance, anomaly, and fingerprint state |
| Consumers | Fan-out and value-of-computation share the authority result; exhaustion is `incomplete` and never `converged` |
| Migration | Shadow adapters read legacy guards without changing existing writers or moving authority before phase 014 |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive and dark. It imports the frozen event envelope, authorized ledger/gateway, and replay
fingerprint modules directly; it does not redefine their contracts. All durable budget evidence passes through the
existing gateway before the append-only ledger accepts it. Legacy council and fan-out code remains unchanged and is
called only as a read-only shadow baseline.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep typed budgets as four discriminated dimensions | Cross-unit arithmetic must fail before any admission or settlement mutation |
| Derive every balance from the authorized ledger | Mutable side counters could overbook after restart or conflict with replay |
| Serialize local mutations and re-read verified state | One compare-and-append path makes sibling races deterministic and fail closed |
| Keep adapters shadow-only | The program assigns authority cutover to phase 014, so this leaf cannot override legacy decisions |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, exit 0: 1 file and 29 tests passed |
| Runtime TypeScript | PASS, exit 0: `tsc --noEmit -p runtime/tsconfig.json` |
| Alignment drift | PASS, exit 0: 7 runtime files plus 1 test file, 0 findings |
| Comment hygiene | PASS, exit 0 across the new runtime and test files |
| Strict packet validation | PASS, exit 0: Errors 0, Warnings 0 after scoped metadata refresh |

### Evidence anchors

| Evidence | Digest or observation |
|----------|-----------------------|
| Focused fixture | SHA-256 `705f29c9f6e6347253499d950faece15ba23348d6b352ae5efd1aab41cbedb84` |
| Legacy council baseline | SHA-256 `be28f8ca12454a5d37e899a5cef098cc42a3d0124a55a21ca9e8eff68bd8f38d` |
| Legacy fan-out baseline | SHA-256 `9255baf286a90c1cdd9642b2fc6dbe7ae33378f376efaeba30d765088736d8b3` |
| Balance/spawn evidence | Named focused tests assert exact before/after projections, zero partial mutations, one race winner, and absent legacy dispatch/sample markers on shadow denial |
| Additive-dark proof | Scoped status contains only the new budget module/test directories and this leaf's documentation changes; substrate and existing writers have no diff |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark authority only.** The adapters cannot make the typed service canonical. Phase 014 owns authority cutover.
2. **Full-suite baseline is not this leaf's gate.** The repository-wide runtime suite was not run because the user-pinned baseline has roughly 100 known failures from the missing `better-sqlite3` dependency and kebab-case fixture mismatches. The focused 29-test suite is green.
3. **No commit was created.** CHK-028 remains open until the operator authorizes a path-scoped commit. The code, tests, and packet documentation are commit-ready.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None in the runtime contract. The only pending administrative action is committing the verified working-tree candidate.
<!-- /ANCHOR:deviations -->
