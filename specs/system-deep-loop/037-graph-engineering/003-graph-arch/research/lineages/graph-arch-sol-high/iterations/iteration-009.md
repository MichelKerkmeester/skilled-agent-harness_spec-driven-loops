# Iteration 9: Hierarchical Graph Budget Lifecycle

## Focus

This iteration decides the budget protocol from deterministic GraphARC admission through dispatch and observed settlement. The narrow interpretation is that the existing `program -> mode -> lineage -> iteration` budget hierarchy remains canonical; graph, node, call, and retry identities live inside an iteration reservation rather than inventing more independently allocated scope kinds. It covers atomic reservation, fan-out/cycle behavior, approval waits, authority ordering, fencing, recovery, exhaustion, mutants, runtime mapping, and non-applicability.

## Findings

1. **A registry-derived worst-case is an admission quote, not a reservation — REFINE Decision 3 and CONFIRM Decision 7's authority-zero refusal.** GraphARC correctly prevents the planner from self-pricing: it sums operator-owned `NodeSpec.worst_case` values and checks all dimensions against a read-only `RemainingBudget`. But `AdmissionChecker.check()` charges nothing and does not bind the observed balance, so two accepted proposals can both fit the same remainder. Define `GraphBudgetQuoteV1` over the sealed proposal/materialization identity, registry/pricing/replay digests, complete four-dimensional estimate, fan-out multiplicities, cycle bound, quote head, and expiry. An incomplete estimate or stale quote cannot reserve or dispatch; over-budget admission produces `TransitionRefusalV1` with zero budget mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:23-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:551-599] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:836-883]

2. **The canonical protocol is reserve across every ancestor, debit attempts before dispatch, settle from observed receipts, then release only proven unused capacity — EXTEND Decision 3 and CONFIRM the runtime's hierarchical-budget design.** The existing runtime already models non-interchangeable token, fixed-precision cost, attempt, and monotonic wall-time vectors; immutable parentage; reservation across a complete scope path; per-attempt commitment; receipt-backed settlement; release, cancel, expiry, anomaly, and reconciliation events. The graph contract should consume that protocol rather than add a graph-local meter ledger. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-types.ts:9-75] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-events.ts:25-66] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:511-595]

3. **Budget evidence and transition authorization are separate mandatory predicates — CONFIRM Decisions 1, 4, and 6.** Reservation mutation is first authorized and durably appended to the budget ledger; the later 036 consequence request then binds the current reservation ID, budget receipt/event hash, budget head, replay fingerprint, estimate, lease, and dispatch ID along with policy, gate, authority, and protected-resource facts. Only a fresh 036 allow plus fenced domain append may release work. A budget grant cannot authorize a node, and an allow proof cannot spend unreserved capacity. Human approval is likewise evidence for fresh authorization, not permission to extend a lease or reset a meter. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:1187-1263] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:121-160] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-006.md:131-154]

4. **Concurrency correctness requires ledger-head compare-and-append under a current fence; process-local meters and promise serialization are adapters, not distributed authority — EXTEND Decision 2.** GraphARC's token meter protects increments with a thread lock, but its USD `SpendMeter` explicitly permits concurrent check/charge races. `HierarchicalBudgetAuthority.#serialize` closes sibling races only inside one object instance. Production reservation must reread the verified budget projection, acquire the budget-ledger fence, authorize against the exact prior head and epoch, append once, and retry the whole read/authorize/append transaction after a stale-head refusal. Tests already require that only one sibling wins the final remainder; this invariant must hold across processes, not merely within one promise chain. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:29-37] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:355-373] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-reducer.ts:505-550] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:465-481]

5. **Retry, fan-out, cycles, approval waits, and resume preserve cumulative spend; none resets a parent or reservation — REFINE Decisions 2 and 6.** Every executor attempt, including failed work and retry, commits one attempt before dispatch. A fan-out either reserves the sealed aggregate upper bound atomically or creates independently receipted branch reservations whose sum fits every ancestor; a branch cannot borrow a sibling's held capacity without an explicit release and new reservation. Cycles reserve/debit each next attempt before the back-edge. Approval waiting consumes the current monotonic deadline by default; a policy that credits human wait must append a capped, gate-linked wait-credit transition before changing the deadline, never infer a pause from timestamps. Resume rebuilds balances from verified ledger history and returns idempotent receipts; it never constructs a fresh `BudgetMeter` that forgets prior work. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:608-710] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-reducer.ts:580-620] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:521-572] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:741-763]

6. **Refund means release of proven unused reservation, never reversal of observed spend — EXTEND Decision 4's ledger-first rule.** A successful or failed execution receipt commits observed tokens, fixed-precision cost, attempts, and elapsed time and releases the remaining estimate. An unstarted cancellation requires immutable no-dispatch evidence; partial release requires unused-capacity evidence; an expired reservation with started work or missing usage becomes `unreconciled`, blocks every ancestor scope, and requires an explicit reconciliation event. Actual usage above the reservation is an anomaly preserved in history, not a negative balance or invented refund. Provider-unpriced calls and node-created threads demonstrate why “zero observed” is unknown rather than free. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:714-849] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-reducer.ts:594-637] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/usage.py:22-32] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:15-19]

7. **Budget exhaustion is an explicit incomplete routing outcome, not convergence, success, automatic trimming, or authorization denial — EXTEND Decision 8 and CONFIRM the shadow adapters.** Before reservation it records typed exhaustion with no changed balance or dispatch. Before an attempt it blocks that branch. After a provider call crosses a ceiling, the call remains committed and later work stops. Fan-in may consume completed branch results only under a declared partial-results contract marked `incomplete-budget-exhausted`; otherwise it aborts. The runtime's shadow adapters already keep legacy authoritative and `converged:false`, while the alpha-model article usefully admits its stated cap is advisory because it relies on self-reported spend. Promotion therefore requires the mutant suite below, receipt completeness, and cross-process race evidence. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/shadow-adapters.ts:84-123] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/shadow-adapters.ts:125-163] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:325-361] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_budget_enforcement.py:86-118]

## Lifecycle and State Machines

Two orthogonal machines prevent approval, authorization, and budget state from collapsing into one flag.

### Reservation lifecycle

```text
quoted (non-authoritative)
  -> denied/exhausted                    # zero reservation mutation
  -> reserved                            # atomic across complete ancestor path
       -> reserved + attempt committed   # before every initial/retry/cycle dispatch
       -> partially-released             # immutable unused-capacity proof
       -> renewed                         # bounded by scope deadline; no spend reset
       -> settled                         # observed receipt + unused remainder released
       -> cancelled                       # only with no-dispatch proof
       -> expired                         # only when no started/unknown work
       -> unreconciled                    # missing/mismatched/over-estimate evidence
            -> settled                    # explicit reconciliation only
```

### Dispatch authority lifecycle

```text
sealed candidate + fresh quote
  -> budget reservation append receipt
  -> optional GraphApprovalGateV1 decision
  -> fresh 036 authorization binding reservation/head/lease/dispatch
  -> fenced domain append receipt
  -> attempt debit append receipt
  -> executor dispatch
  -> observed execution/effect receipt
  -> settle/release/reconcile
```

No arrow may be skipped by a direct graph invocation, checkpoint resume, approval callback, or local `BudgetMeter`. `[INFERENCE: combines the existing budget event state with the iteration-006 gate and 036 append boundaries]`

## Schemas and Receipts

```ts
interface GraphBudgetQuoteV1 {
  quote_version: 'graph-budget-quote@1';
  quote_id: string;
  candidate_digest: string;
  compiled_graph_digest: string;
  registry_digest: string;
  pricing_digest: string;
  replay_fingerprint: string;
  estimate: BudgetVector;                 // tokens, fixed-price cost, attempts, wall time
  estimate_complete: boolean;
  fanout_multiplicities: readonly { edge_id: string; max_children: number }[];
  cycle_attempt_bound: number;
  observed_budget_head: { sequence: number; record_hash: string; authority_epoch: number };
  expires_at_monotonic_ms: number;
}

interface GraphBudgetReservationRefV1 {
  reservation_id: string;
  dispatch_id: string;
  scope_path: readonly string[];          // program -> mode -> lineage -> iteration
  quote_digest: string;
  estimate: BudgetVector;
  lease_expires_at_monotonic_ms: number;
  grant_event_id: string;
  grant_append_receipt_digest: string;
  budget_head_after_grant: { sequence: number; record_hash: string; authority_epoch: number };
}

interface GraphAttemptDebitReceiptV1 {
  reservation_id: string;
  dispatch_id: string;
  graph_run_id: string;
  node_id: string;
  attempt: number;
  debit: BudgetVector;                    // at least one attempt; optional pre-dispatch call allotment
  spend_event_id: string;
  append_receipt_digest: string;
}

interface GraphUsageReceiptV1 {
  receipt_id: string;
  reservation_id: string;
  dispatch_id: string;
  attempt_receipt_digest: string;
  outcome: 'succeeded' | 'failed' | 'cancelled' | 'unknown';
  observed: BudgetVector;
  provider_receipt_digests: readonly string[];
  effect_receipt_digests: readonly string[];
  observation_completeness: 'complete' | 'unpriced' | 'missing' | 'conflicting';
}
```

Every lifecycle request has a distinct `operation_id` and idempotency `request_id`. Exact request retries return the original logical outcome and append receipt; reuse with different canonical bytes is `request_conflict`. Receipts reference events already protected by ledger sequence/hash and the authority epoch; graph trace, OTel, or a mutable meter snapshot cannot mint them. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-events.ts:42-66] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-events.ts:176-179] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:960-1007]

## Authority Ordering

1. Verify the sealed candidate, registry, policy, pricing catalogue, replay fingerprint, graph bounds, and `estimate_complete=true`.
2. Read a reference-closed budget projection and require a current quote head; a quote never locks capacity.
3. Under the budget-ledger fence, authorize and append one reservation event across the entire ancestor path. A denial/refusal leaves every balance unchanged.
4. If a human gate is required, hold the reservation under its lease. Any wait-credit or renewal is a separately authorized budget event.
5. Revalidate candidate, approval, policy, roles, resource heads, reservation status/lease, budget head, and authority epoch in the 036 request.
6. Append the exact authorized domain transition through its current resource fence. The receipt unlocks only its bound task/edge.
7. Before executor work, append `startAttempt`; failure to debit prevents dispatch. A retry uses a new operation/request identity and the same cumulative reservation.
8. Execute under local deadline/token/cost adapters. They stop work early and emit observations, but the ledger owns balances.
9. Settle from `GraphUsageReceiptV1`; release only the provably unused vector. Missing, conflicting, or over-estimate usage quarantines the scope until reconciliation.
10. Recover by rereading both ledgers. Return existing receipts for completed operations; retry stale-head transactions from step 2 or 5, never from a cached allow.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:511-710] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:121-160] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-006.md:131-163]

## Concurrency, Fencing, and Fan-Out

- Reservations change every ancestor balance in one authorized event/reducer transition; no child is visible half-reserved.
- Parent allocation is immutable and narrowed down the closed scope chain. Within an iteration, graph/node/call identities are reservation and receipt fields, not new scope aliases.
- Parallel branches get deterministic reservation and dispatch IDs derived from sealed parent, edge, child ordinal, attempt, and request identities. Dynamic fan-out must have a sealed maximum; otherwise quote completeness is false and admission stops.
- A final-remainder race is won only by the append whose expected head and current fence match. Losers reread and return exhaustion or retry with a genuinely new request; they do not replay a stale proof.
- A branch may release capacity only with no-dispatch or unused-capacity evidence. The parent may then create a new reservation; direct sibling transfer is forbidden.
- A back-edge debits its next attempt before execution. Cycle exit releases unused reserved capacity; cycle retry never resets token, cost, attempt, or time totals.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-reducer.ts:481-550] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:651-710] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:426-498]

## Retry, Refund, Approval-Wait, and Exhaustion Rules

| Condition | Required transition | Capacity/result semantics |
|---|---|---|
| Exact reserve/debit/settle retry | Return stored logical outcome and receipt | No second event or charge. |
| Same request ID, different bytes/operation | Refuse `request_conflict` | No mutation; audit conflict. |
| Executor retry after failure | New `startAttempt` event | Failed attempt remains committed. |
| Under-estimate actual usage | Settle observed vector and release remainder | Release is not a refund of spend. |
| Over-estimate actual usage | Anomaly + `unreconciled` | Preserve actual evidence; block ancestor admission. |
| Missing/unpriced/conflicting receipt | Anomaly + `unreconciled` | Zero is not assumed; explicit reconciliation required. |
| Cancel before dispatch | Cancellation with no-dispatch proof | Release full remaining vector. |
| Expiry after started work | Unknown-usage anomaly | Do not release automatically. |
| Approval pending | Lease continues; optional explicit wait-credit/renewal | No implicit deadline pause or reset. |
| Exhausted before reserve/attempt | Typed exhaustion/refusal | No dispatch; `incomplete-budget-exhausted`, never converged. |
| Ceiling crossed inside provider call | Commit offending call in settlement | Stop subsequent work; no rollback of provider spend. |

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:714-918] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:520-738] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:7-19]

## Exhaustion Routing

`budget_exhausted`, `deadline_exhausted`, `reservation_expired`, `unknown_usage`, and `actual_exceeds_reservation` remain distinct stable outcomes. Pre-dispatch exhaustion routes to a non-executable `TransitionRefusalV1` or budget-denial evidence. Mid-run exhaustion routes the exact branch to `incomplete-budget-exhausted`; fan-in may continue only if its sealed contract explicitly accepts partial inputs and preserves missing-branch identities. Otherwise the graph aborts and settles all observed work. No exhaustion path may claim success, convergence, human rejection, authorization denial, or automatic graph repair. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:529-567] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/shadow-adapters.ts:93-121] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-007.md:180-205]

## Mutants

Each mutant must fail at its earliest owner without unreceipted dispatch, negative balance, duplicate charge, protected projection change, or external effect:

1. Admit two proposals against one read-only remainder and reserve both.
2. Let a planner lower registry worst-case values or mark an incomplete quote complete.
3. Change pricing, registry, graph, fan-out bound, or cycle bound after quote but reuse it.
4. Reserve a child beyond any ancestor or with wrong parent/replay identity.
5. Race sibling reservations for the last unit from different authority instances.
6. Reuse a stale ledger head, expired fence, authority epoch, lease, or allow proof.
7. Dispatch before reservation, 036 append, or attempt-debit receipt.
8. Retry a failed node without charging another attempt.
9. Resume with a fresh local meter and zero cumulative spend.
10. Release a started reservation using no-dispatch evidence or refund committed failed spend.
11. Treat missing provider price, missing usage metadata, or a child-thread call as zero.
12. Settle actual usage above estimate by driving the balance negative.
13. Expire started unknown work and silently free its entire reservation.
14. Pause the wall clock during approval without an authorized wait-credit event.
15. Auto-trim fan-out, remove a node, or lower a model tier after exhaustion while retaining candidate identity.
16. Mark budget exhaustion as converged, successful, or an authorization/human denial.
17. Permit a partial fan-in whose sealed contract requires all branches.
18. Retry an exact settlement and append or charge it twice.

[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:426-498] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:520-885] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_budget_enforcement.py:96-137]

## Runtime Mapping

| Contract responsibility | Existing runtime owner | GraphARC adapter / required refinement |
|---|---|---|
| Quote calculation | Planner/admission adapter | Translate frozen registry worst-case, fan-out, and cycle bounds into `GraphBudgetQuoteV1`; require completeness. |
| Canonical hierarchy/vector | `hierarchical-budgets/budget-types.ts` | Keep `program/mode/lineage/iteration`; map graph/node/call into reservation/dispatch/receipt IDs. |
| Reservation/debit/settlement | `HierarchicalBudgetAuthority` + event registry/reducer | Add graph quote/reference fields; preserve existing receipt, anomaly, and reconciliation semantics. |
| Budget authorization and durability | `authorized-ledger` + `FencedLedgerWriter` | Enforce expected head/fence across authority instances, not only `#serialize`. |
| Execution authorization | 036 transition gateway | Bind current reservation receipt/head/lease in the exact consequence request. |
| Local early stops | GraphARC `BudgetMeter`, usage callback, deadline guard, `SpendMeter` | Treat as adapters producing observations; close child-thread/unpriced gaps or report incomplete usage. |
| Human wait | `GraphApprovalGateV1` + budget authority | Default clock continues; optional capped wait credit is a distinct authorized event. |
| Shadow migration | hierarchical budget shadow adapters + shadow parity | Legacy stays authoritative until promotion; compare reservations, debits, outcomes, receipts, and ancestor balances. |
| Replay/telemetry | budget replay + `GraphExecutionProjectionV1` | Rebuild from ledger; expose meter/trace/OTel only as derived observations. |

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/README.md:10-37] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-replay.ts:24-52] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/usage.py:1-32]

## When Not to Use

- Do not use a budget reservation as authorization, approval, a task lease, a capability, an effect receipt, or proof that work succeeded.
- Do not use a registry worst-case quote as billing truth or reserve capacity merely because admission returned `ADMITTED`.
- Do not use provider-reported cost alone where the backend omits prices; unknown coverage requires conservative policy or reconciliation.
- Do not allocate graph/node/call as new hierarchy levels when stable reservation and dispatch identities inside the iteration scope provide the required accounting.
- Do not use ledger reservation overhead for a single-process deterministic transformation with no concurrency, resume, nested allocation, external spend, or protected consequence; a local hard meter can suffice, but must not claim durable or distributed guarantees.
- Do not use monotonic wall-time budget as the interrupt mechanism itself; local deadline guards enforce execution while the ledger records allocation and settlement.
- Do not promise a distributed global ceiling if the deployment lacks a shared ledger and current fencing domain.
- Do not automatically shrink, reprice, reroute, or change models to fit budget under the same sealed candidate. Replanning creates a new candidate, quote, reservation, and authorization request.

## Ruled Out

- Treating GraphARC admission headroom or an `ADMITTED` result as reserved capacity.
- Creating a graph-local budget ledger parallel to the existing hierarchical-budget and 036 ledgers.
- Resetting cumulative spend on retry, cycle, approval resume, checkpoint recovery, or authority re-instantiation.
- Releasing unknown or already committed spend as a “refund.”
- Treating budget exhaustion as convergence, success, human rejection, authorization denial, or permission to trim the graph.

## Dead Ends

- The alpha-model article's stated per-run cap cannot provide hard guarantees: it explicitly describes advisory self-reported spend. It remains useful as a product-honesty boundary, not as a protocol source. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:325-361]
- GraphARC's `SpendMeter.ensure_headroom()` plus `charge()` bounds overshoot per process but cannot atomically reserve concurrent calls or account for unpriced calls; varying that pattern cannot close distributed races. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:7-37]

## Edge Cases

- Ambiguous input: “graph/node/call meters” could mean additional hierarchy levels or identities inside the existing iteration scope. The narrower choice preserves the runtime's closed four-level hierarchy and uses reservations/dispatch/receipts for graph detail; adding scope kinds is deferred unless an allocation use case proves necessary. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-types.ts:9-17]
- Contradictory evidence: GraphARC and the alpha-model blog describe ceilings that can overshoot or be advisory, while hierarchical-budget tests require atomic reservation and receipt-backed recovery. Resolved by retaining the former only as local enforcement/observation adapters and selecting the ledger-backed runtime as canonical accounting. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:7-19] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:426-481]
- Missing dependencies: no external provider exposes a universal authoritative token/cost receipt, and GraphARC documents unpriced and child-thread gaps. The protocol represents completeness and quarantines unknown usage instead of claiming exact settlement. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/usage.py:22-32] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:15-19]
- Partial success: none. Five focused local-source actions supplied sufficient evidence for the design-level decision.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/budget.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/usage.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_budget_enforcement.py`
- `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/`
- `.opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/`
- `specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md`
- Iterations 1–8 in this lineage, especially iterations 6–8.

## Assessment

- New information ratio: 0.79
- Questions addressed: How admission quotes become atomic reservations; how graph/node/call/token/time usage maps into the hierarchy; how authorization, approval, fencing, retries, fan-out, cycles, settlement, release, and exhaustion interact.
- Questions answered: The hierarchical lifecycle, schemas/receipts, authority ordering, concurrency rules, retry/refund behavior, exhaustion routing, mutants, runtime mapping, and when-not-to-use boundaries are decided at design level.
- Questions remaining: Cross-mode graph evolution/migration, complete governance mutant staging, and synthesis across all eight angles remain.

## Reflection

- What worked and why: Following one unit of capacity from deterministic quote through ancestor reservation, attempt debit, provider observation, settlement, and recovery exposed exactly which layers own prediction, authority, enforcement, and accounting.
- What did not work and why: Broad repository scans were noisy and truncated because generic budget language appears throughout blogs and runtime consumers; narrow authority, reducer, test, and alpha-blog ranges recovered the load-bearing contracts.
- What I would do differently: Start the next slice with a single graph-version transition and trace its sealed graph, open reservations, approval gates, ledger projections, checkpoints, and in-flight effects through migration and rollback.

## Recommended Next Focus

Specify graph evolution and migration: versioned topology/schema/reducer upgrades, handling of open reservations and approval gates, checkpoint compatibility, in-flight tasks/effects, rolling cutover, rollback, shadow parity, and migration mutants across the runtime and 036 authority plane.
