---
title: "Implementation Plan: Hierarchical Typed Budgets"
description: "Implementation plan for the shared token, cost, iteration, and wall-time budget authority consumed by durable fan-out and value-of-computation allocation."
trigger_phrases:
  - "hierarchical typed budgets implementation plan"
  - "deep-loop budget reservation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-15T13:59:12Z"
    last_updated_by: "codex"
    recent_action: "Planned typed budget architecture, reservation semantics, and ledger settlement"
    next_safe_action: "Implement the schema and atomic ancestor-chain reservation reducer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Hierarchical Typed Budgets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime shared services (phase 004 child 004) |
| **Change class** | Additive control-plane logic and typed ledger schema |
| **Execution** | Isolated worktree pinned to the phase-000 BASE; dark/non-authoritative until later cutover |

### Overview
Replace disconnected advisory counters and static cost-unit estimates with a single typed authority. The implementation
will model four budget dimensions, reduce their lifecycle from append-only events, reserve atomically across the full
`program > mode > lineage > iteration` ancestor chain, settle actual receipt-backed spend, and deny dispatch on any
exhausted or uncertain dimension. It preserves current `cost-guards.cjs` and `fanout-run.cjs` behavior behind adapters
during shadow parity; program phase 006 fan-out and phase 008 convergence consume the new admission interface only after
their migration gates authorize it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-003 event envelope, transition vocabulary, replay fingerprint, and dark-writer contract are frozen
- [ ] Receipt normalization defines actual token, cost, attempt, and elapsed-time evidence plus pinned pricing identity
- [ ] Scope identities for program, mode, lineage, and iteration are stable and replayable
- [ ] The current council guard, lineage cap, aggregate cap, retry estimate, and timeout behavior are captured as baseline fixtures
- [ ] Atomic ledger mutation and fencing interfaces are available or represented by a test double with the same conflict semantics
- [ ] Program phase 006 and phase 008 caller contracts identify required reservation and denial fields

### Definition of Done
- [ ] All four budget types validate, serialize, and reject cross-unit operations
- [ ] Child allocation and dispatch reservation never exceed any ancestor's remaining typed allotment
- [ ] Reservation, commit, release, expiry, cancellation, retry, and reconciliation are idempotent and replay-deterministic
- [ ] Exhaustion, unknown spend, stale pricing, conflict, and ledger failure deny dispatch before executor spawn
- [ ] Fan-out and value-of-computation adapters use the shared admission result without reimplementing balance arithmetic
- [ ] Shadow parity, concurrency, crash/replay, and receipt-settlement fixtures pass on the pinned BASE
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Typed value layer**: discriminated token, fixed-precision cost, iteration-attempt, and monotonic-duration values; unit and policy mismatches are construction errors.
- **Scope registry**: immutable parent links for `program > mode > lineage > iteration`, stable IDs, policy version, pricing digest, and replay fingerprint.
- **Budget reducer**: derives allocated, reserved, committed, released, expired, and remaining balances exclusively from ordered authorized ledger events.
- **Reservation gateway**: validates the complete ancestor chain and performs one atomic multi-dimensional compare-and-reserve before dispatch; any failed dimension rolls back the whole request.
- **Settlement gateway**: joins executor/effect receipts, commits actual spend, charges attempts and failures, releases only proven unused capacity, and quarantines unknown or contradictory usage.
- **Exhaustion classifier**: emits typed reasons by scope and dimension; distinguishes budget exhaustion from convergence, cancellation, timeout, and infrastructure error.
- **Fan-out adapter**: reserves program/mode/lineage capacity per authorized wave or dispatch and preserves the existing aggregate/per-lineage guard as a shadow baseline.
- **Value-of-computation adapter**: exposes eligible remaining budgets and reservation decisions to program phase 008 without letting the allocator mint or borrow capacity.
- **Projection interface**: read-only balances, reservation age, settlement lag, and denial reasons; sibling stream-fold gauges may derive observability but cannot mutate authority.
- **Migration boundary**: new events remain additive and dark until phase 005 compatibility/shadow gates and phase 011 authority cutover authorize enforcement for a mode.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-000 BASE and inventory current council/fan-out guard inputs, defaults, aliases, stop reasons, ledger events, retry accounting, and wall-time ceilings.
- Freeze adapter fixtures for at-cap, one-over-cap, aggregate-only exhaustion, retry multiplication, failure-before-spawn, timeout, and missing-usage behavior.
- Confirm the phase-003 envelope plus sibling receipt and fencing contracts; record any interface mismatch as a spec amendment rather than a local workaround.

### Phase 2: Implementation
- Add typed budget values and versioned envelopes with strict unit, currency/pricing, duration, scope, and parent validation.
- Add authorized lifecycle events and a deterministic reducer for allocation, reservation, spend, release, expiry, exhaustion, reconciliation, and anomaly states.
- Implement idempotent atomic ancestor-chain reservation, including multi-dimensional rollback, conflict denial, reservation lease/expiry, and no implicit sibling borrowing.
- Implement receipt-backed settlement: commit attempt spend at start, commit actual token/cost/time on receipt, retain failure spend, and release only terminally proven unused capacity.
- Add fail-closed admission for missing parent, exhausted ancestor, unknown usage, stale pricing, invalid unit, replay mismatch, reducer divergence, fence conflict, or append failure.
- Add fan-out and value-of-computation adapters, keeping current runtime guards as shadow comparators until later authority cutover.
- Emit read-only balance and denial projections for stream-fold gauges without creating a second mutable accounting source.

### Phase 3: Verification
- Prove each dimension rejects aliases and cross-type arithmetic, including current token-named cost-unit compatibility inputs.
- Replay every lifecycle fixture and compare all intermediate and terminal balances, not only the final remainder.
- Race siblings against the same parent remainder and prove no overbooking, partial reservation, negative balance, or double release.
- Crash between reserve/start/receipt/settle steps, resume from the ledger, and prove idempotent reconciliation with incurred spend preserved.
- Exercise fan-out and value-of-computation at child, mode, and program exhaustion; verify no executor/sample starts and exhaustion is not reported as convergence.
- Run shadow parity against the shipped council/fan-out fixtures and document intentional differences caused by typed actual-spend accounting.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property tests construct valid same-type operations and reject every cross-type/unit/currency/pricing combination |
| REQ-002 | Scope-tree fixtures cover valid ancestry, orphan, cycle, wrong level, duplicate identity, and replay mismatch |
| REQ-003 | Parent/child boundary tables test exact capacity, one-unit over, nested ancestor depletion, and explicit reallocation |
| REQ-004 | Multi-dimensional fault injection fails each dimension in turn and proves zero partial reservations |
| REQ-005 | Duplicate request and concurrent-race tests prove stable results, fencing denial, and no double spend |
| REQ-006 | Estimated-vs-actual receipt fixtures cover under, exact, over, missing, stale-price, and contradictory usage |
| REQ-007 | Success, retry, timeout, cancellation, and executor-failure fixtures retain all incurred attempt/token/cost/time spend |
| REQ-008 | Spawn-marker fixtures prove every exhaustion and uncertainty class denies work before dispatch |
| REQ-009 | Golden event streams replay to expected balances at every event boundary and from checkpoints |
| REQ-010 | Authorization, receipt-reference, and replay-fingerprint mutation tests reject unbound spend events |
| REQ-011 | Fan-out fixtures cover per-wave, per-lineage, aggregate/program, partial-failure, and sibling-contention admission |
| REQ-012 | Convergence fixtures distinguish converged, incomplete-budget-exhausted, timeout, and infrastructure failure |
| REQ-013 | Shadow mode emits would-grant/would-deny parity evidence without moving legacy authority |
| REQ-014 | Baseline contract test pins the cited runtime paths and manifest/research source references |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The planning child declares no sibling hard dependency (`depends_on: []`). Implementation integrates with the
phase-003 authorized ledger envelope and replay fingerprint, sibling 001 receipt normalization, sibling 006 atomic
fencing, and sibling 005 read-only gauge consumption. Program phase 006 durable fan-out/fan-in and program phase 008
convergence/value-of-computation are downstream consumers, not owners of budget arithmetic. Phase 005 compatibility
and shadow parity plus phase 011 mode cutover govern authority; legacy writers remain authoritative beforehand.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The service lands additively behind a per-mode authority switch. Before cutover, rollback disables dark budget writes
and adapters while preserving the legacy council/fan-out guards and all append-only evidence. After a mode cutover, its
rollback certificate restores the legacy admission path inside the declared window; no ledger history is deleted or
rewritten. Leaked reservations are closed by authorized expiry/reconciliation events, and conflicting spend remains
quarantined until receipt-backed settlement rather than being reset to zero. Path-scoped commits allow `git revert` of
code while retained events remain readable through the compatibility layer.
<!-- /ANCHOR:rollback -->
