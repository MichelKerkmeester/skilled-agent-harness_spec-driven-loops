---
title: "Feature Specification: Hierarchical Typed Budgets"
description: "Plan token, cost, iteration, and wall-time budgets that nest from program to iteration, reserve atomically, settle against ledgered spend, and fail closed before dispatch when any governing scope is exhausted."
trigger_phrases:
  - "hierarchical typed budgets"
  - "deep-loop budget reservation"
  - "fail-closed dispatch budget"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-15T13:59:12Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned hierarchical typed budget contract and verifier gates"
    next_safe_action: "Implement typed reservations and fail-closed dispatch admission"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Hierarchical Typed Budgets

> Phase adjacency under the shared-services parent (navigation order, not a runtime dependency): predecessor `003-blinded-adjudication-service`; successor `005-stream-fold-gauges`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fourth child of the phase-007 shared evidence and control services parent |
| **Depends on** | None (`[]`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped runtime has several useful but disconnected ceilings. `runtime/lib/council/cost-guards.cjs` bounds topics,
rounds, seats, concurrency, and saturation, but calls the result a cost guard without accounting for tokens or money.
`runtime/scripts/fanout-run.cjs` rejects a lineage or aggregate fan-out before spawning when the static estimate
`iterations × costUnitsPerIteration × attempts` exceeds a cap, yet token-named inputs are aliases for the same untyped
cost-unit field. It does not reserve shared capacity, settle actual executor usage, or prevent two concurrent children
from each spending the same parent remainder. Its lineage timeout is a separate hard lifetime ceiling, not a ledgered
wall-time budget. The corresponding tests prove pre-dispatch rejection, but only at isolated lineage and aggregate
levels: `runtime/tests/unit/fanout-run.vitest.ts` and `runtime/tests/council/cost-guards.vitest.ts`.

This phase plans one budget authority with four non-interchangeable dimensions—tokens, monetary cost, iteration
attempts, and monotonic wall time—nested through `program > mode > lineage > iteration`. Every child allocation is a
reservation against its parent's remaining typed allotment; the reservation must succeed atomically across all
required dimensions before dispatch is authorized. Actual spend is committed from executor/effect receipts, unused
reserved capacity is released under explicit settlement rules, and every transition is an append-only ledger event.
Missing, stale, ambiguous, exhausted, or unreconciled budget state denies new work instead of treating the budget as
unlimited or zero-cost.

The service is the shared control contract consumed by program phase 009 durable fan-out/fan-in and program phase 011
value-of-computation allocation. Run-2 calls for budgeted research-plan branches, query-limited evaluator oracles,
cost-aware active-seat selection, real usage propagation, successive halving, and budgeted attribution; these require
one composable authority rather than mode-local counters. The parent program and manifest require the service to land
inside the additive-dark spine, with later compatibility and cutover phases deciding when it becomes authoritative.

Sources: `.opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs`;
`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`;
`.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`;
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`;
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md`;
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `BudgetEnvelope` whose dimension entries are discriminated types: token count, fixed-precision monetary cost plus currency/pricing digest, iteration-attempt count, and monotonic elapsed-time duration plus derived deadline.
- The fixed scope hierarchy `program > mode > lineage > iteration`, with stable scope identity, one parent per non-root budget, inherited policy version, and child limits that may narrow but never widen a parent.
- Explicit accounting states for `limit`, `reserved`, `committed`, `released`, and `remaining`; every value is non-negative, dimension-compatible, and reducer-derived from ledger events.
- Atomic multi-dimensional reservation before dispatch: if any required dimension or ancestor lacks capacity, no dimension is reserved and no child work starts.
- Idempotent reservation, renewal, commit, partial-release, expiry, cancellation, and reconciliation operations keyed by stable request and dispatch identities.
- Settlement rules that charge every attempt, including retries and failed work; join actual token/cost usage from receipts; measure elapsed time monotonically; and release only capacity proven unused.
- Fail-closed behavior for exhaustion, missing parent state, unknown actual usage, stale pricing, invalid units, reservation conflicts, reducer disagreement, replay mismatch, and ledger write failure.
- Typed ledger events for budget creation, child allocation, reservation grant/denial, spend commitment, release, expiry, exhaustion, reconciliation, and anomaly; events retain before/after balances, reason, scope lineage, receipt references, and replay fingerprint.
- A single admission API used by fan-out wave dispatch and convergence/value-of-computation allocation, plus read-only projections for remaining capacity and exhaustion reasons.
- Shadow-parity fixtures that compare current fan-out/council decisions with the new service without changing legacy authority before the program's compatibility and cutover gates.

### Out of Scope
- Implementing program phase 009 fan-out/fan-in scheduling, wave policy, partial-failure reduction, or program phase 011 convergence/value-of-computation algorithms.
- The phase-006 event envelope, transition-authorization gateway, replay-fingerprint implementation, or ledger storage engine.
- Executor-specific token parsing, provider billing ingestion, exchange-rate sourcing, or price-catalog ownership; this service requires normalized receipt inputs and a pinned pricing digest.
- Receipt creation/effect recovery owned by `001-receipts-and-effect-recovery`, stream-fold gauge implementation owned by `005-stream-fold-gauges`, or lock/fencing primitives owned by `006-locks-and-fencing`.
- Moving authority from the legacy runtime, migrating in-flight packets, or removing existing cost guards; those belong to later compatibility, cutover, and retirement phases.
- Treating exhaustion as convergence, success, or an implicit request for more budget; policy may escalate explicitly, but dispatch stays denied until a new authorized allotment is ledgered.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep token, cost, iteration, and wall-time budgets type-distinct | Cross-dimension arithmetic, comparison, reservation, or settlement is rejected; cost binds fixed precision, currency, and pricing digest |
| REQ-002 | Enforce the canonical scope tree | Every mode, lineage, and iteration budget resolves exactly one ancestor chain to a program root; orphaned, cyclic, or wrong-parent scopes fail validation |
| REQ-003 | Prevent child over-allocation | For every dimension, a child's granted limit and reservations never exceed the parent's uncommitted remainder at the authorization point |
| REQ-004 | Reserve all required dimensions atomically | A dispatch obtains token, cost, iteration, and wall-time capacity as one decision or receives a denial with no partial balance mutation |
| REQ-005 | Make reservation operations idempotent and concurrency-safe | Replaying one request returns the original result; competing requests cannot both consume the same remainder; fencing/conflict failures deny dispatch |
| REQ-006 | Settle estimates against actual spend | Receipt-linked commit records actual token, monetary, attempt, and elapsed-time spend; unused capacity is released only by a terminal or policy-authorized event |
| REQ-007 | Charge retries and failures | Every authorized attempt consumes an iteration unit and reserves the other dimensions; failure never erases incurred token, cost, or time spend |
| REQ-008 | Fail closed on exhaustion or uncertain accounting | Exhausted, missing, stale, invalid, unreconciled, or non-replayable state returns a typed denial before executor spawn or convergence sampling |
| REQ-009 | Record the complete budget lifecycle on the ledger | Creation, allocation, reservation, denial, commit, release, expiry, exhaustion, reconciliation, and anomaly events reconstruct balances without mutable side state |
| REQ-010 | Bind spend to evidence and transition authority | Every commit references the dispatch/effect receipt and replay fingerprint; every mutation passes the phase-006 authorization gateway |
| REQ-011 | Support budget-aware fan-out without overbooking | Program phase 009 can reserve per wave or lineage under the program/mode remainder and cannot dispatch a child that lacks a complete reservation |
| REQ-012 | Support value-of-computation allocation without redefining exhaustion | Program phase 011 can compare eligible work against remaining typed budgets, but an exhausted stop is reported as incomplete/budget-exhausted rather than converged |
| REQ-013 | Preserve additive-dark migration discipline | Before authority cutover, the service emits shadow decisions and parity evidence while legacy stays authoritative; authoritative use is gated by later program phases |
| REQ-014 | Preserve source traceability and compatibility baselines | The implementation contract cites the current council/fan-out guards, run-2 findings, parent program spec, and phase manifest; parity fixtures pin their baseline behavior |
<!-- /ANCHOR:requirements -->

### Reservation and settlement contract

| Operation | Required invariant | Ledger result |
|-----------|--------------------|---------------|
| Create root | All four dimensions are explicit and valid; no implicit unlimited value | Root budget event with policy and pricing digests |
| Allocate child | Requested limits are type-compatible and no greater than the parent allocatable remainder | Child-allocation event or typed denial |
| Reserve dispatch | All ancestors and dimensions pass one atomic compare-and-reserve decision | Reservation-granted or reservation-denied event |
| Start attempt | A valid unexpired reservation exists; one iteration unit becomes committed | Attempt-spend event linked to dispatch identity |
| Settle receipt | Actual token/cost/time values are normalized, receipt-backed, and no smaller than already committed spend | Spend-commit plus eligible unused-release events |
| Fail or cancel | Incurred spend remains committed; only demonstrably unused capacity is released | Terminal settlement event with failure/cancel reason |
| Expire | No new work may use the reservation; in-flight spend is reconciled before release | Expiry and reconciliation events |
| Exhaust | Remaining capacity in any required dimension is insufficient for the requested operation | Exhaustion/denial event; dispatch remains absent |

The parent-to-child check walks the full ancestor chain inside the same authorization transaction. A local lineage
remainder is not sufficient if its mode or program ancestor is depleted. Conversely, unused capacity in a sibling is
not borrowed implicitly: reallocation requires a separate authorized ledger transition, preserving who changed the
allotment and why.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One versioned schema represents all four budget types without aliases or cross-unit arithmetic.
- **SC-002**: Deterministic replay of the same ordered budget events yields identical reserved, committed, released, and remaining balances at every scope.
- **SC-003**: Concurrent child requests cannot overbook a parent; exactly the authorized subset receives reservations and every denial is ledgered.
- **SC-004**: Fan-out and convergence callers share one admission contract and cannot spawn or sample after any governing required dimension is exhausted.
- **SC-005**: Actual receipt-backed spend, retries, failures, cancellations, expiry, and unused release reconcile without negative balances or erased consumption.
- **SC-006**: Budget exhaustion is a typed incomplete stop reason, never convergence, success, zero spend, or silent fallback.
- **SC-007**: Shadow fixtures preserve current council/fan-out behavior where equivalent while exposing the current untyped-estimate gaps for later cutover.
- **SC-008**: Strict validation reports no errors other than the intentionally deferred generated metadata files.

**Given** a program budget with two children racing for the same final token or cost allotment, **When** both reserve,
**Then** at most one atomic reservation succeeds and the other records a typed denial before dispatch.

**Given** a lineage reservation whose actual executor receipt is below its estimate, **When** settlement completes,
**Then** actual spend remains committed and only the proven unused remainder returns to the same parent.

**Given** any missing receipt, stale pricing digest, replay mismatch, or exhausted ancestor, **When** fan-out or
value-of-computation requests more work, **Then** admission fails closed and no executor or sample starts.

**Given** iteration capacity is exhausted while evidence risk remains, **When** the loop evaluates termination,
**Then** it records incomplete/budget-exhausted and does not report convergence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independently authored sibling planning contract. Integration consumes the
phase-006 authorized event envelope and replay fingerprint, receipt-normalization output from sibling 001, and atomic
write/fencing behavior from sibling 006. Program phases 006 and 008 are downstream consumers. These contract inputs do
not make predecessor `003-blinded-adjudication-service` or successor `005-stream-fold-gauges` runtime dependencies;
their adjacency is navigation only, as required by the shared-services parent.

The highest risk is oversubscription under concurrency: a read-then-write balance check allows siblings to spend the
same remainder. A second risk is false precision—current token aliases and estimated cost units may look comparable
while representing different resources. Other risks are floating-point monetary drift, wall-clock jumps, missing usage
on failed executor calls, releasing capacity before terminal evidence, retry undercounting, reservation leaks after a
crash, and consumers treating budget exhaustion as convergence. Verification therefore uses fixed-precision money,
monotonic elapsed time, receipt-required settlement, crash/replay fixtures, ancestor-chain races, and explicit
exhaustion taxonomy checks.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for the planning contract. Implementation may choose the fixed-precision cost scale, reservation lease
duration, batch-vs-per-dispatch reservation granularity, and exact event names after the phase-006 envelope and sibling
receipt/fencing interfaces are frozen. Those choices may not merge budget types, permit negative or implicit unlimited
balances, release unproven capacity, bypass ancestor checks, or dispatch under uncertain accounting.
<!-- /ANCHOR:questions -->
