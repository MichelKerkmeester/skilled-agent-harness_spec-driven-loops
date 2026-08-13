# Iteration 14: Hierarchical Budgets, Locks, and Fencing Composition

## Focus

This iteration maps graph admission, sealed materialization, durable approval, hierarchical budget authority, lease ownership, fencing, 036 authorization, effects, and recovery into one exact execution protocol. The narrow interpretation is a single-host, ledger-backed graph dispatch saga using the shipped `hierarchical-budgets` and `locks-and-fencing` contracts. A general distributed transaction or arbitrary graph-shaped budget hierarchy is deferred because neither runtime module claims that capability.

## Findings

1. **The shipped budget and fencing modules are complementary authorities, not one graph transaction manager — EXTEND iteration 9 and REFINE iterations 3–6.** Hierarchical budgets own a closed `program > mode > lineage > iteration` scope chain and atomically reserve token, fixed-precision cost, attempt, and monotonic-time dimensions across every ancestor. Locks own canonical protected-resource identity, one single-host atomicity domain, monotonic fence tokens, and mutation-time stale-writer exclusion. Graph run, task, node, fan-out branch, and attempt coordinates therefore remain correlation/dispatch identity unless a versioned registry extension maps them to an existing semantic resource; they must not be smuggled into new budget levels or overloaded lock kinds. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-types.ts:9-43] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts:16-55] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md:61-79]

2. **The exact composition is an ordered, receipt-linked saga; only each ledger append or fenced state replacement is atomic — EXTEND iteration 9's lifecycle and CONFIRM iteration 4's immutable-content/live-authority split.** The order is: verify proposal admission proof and materialization seal off-lock; resolve canonical budget scope, dispatch identity, and protected resources; if policy says ASK, persist the gate request and stop; after a durable approval, re-bind proof, seal, policy, gate, budget, authority epoch, and current heads; idempotently reserve all budget dimensions; acquire the minimal branch/run claim and any commit resources in canonical order; authorize and fenced-append `dispatch-authorized`; append `attempt-started` before executor work; execute computation; separately authorize and fence each effect intent; collect effect and normalized usage receipts; settle budget; then fenced-append terminal graph state. No step treats a preceding receipt as permission to skip the next current-state check. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:490-607] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:366-437] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:61-103]

3. **A human approval wait holds neither an executor reservation nor a lease — CONFIRM iteration 6 and REFINE iteration 9.** GraphARC correctly models approval as suspension before the gated node, but its session state is not the system authority. The durable gate request may retain a quote and requested resources for later comparison; it does not reserve capacity. On resume, the orchestrator loads the approval decision, reacquires current proof/seal/policy/authority heads, makes a fresh budget reservation, and only then acquires bounded leases. Holding capacity or renewing a lease across an unbounded human wait creates starvation and turns timeout into accidental policy; reusing a pre-wait reservation or fence creates a stale-authority and ABA path. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/approval.py:1-6] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:608-645] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:269-365]

4. **Crash consistency is achieved by stable identities and compensating transitions, not rollback across ledgers — EXTEND iteration 9.** A granted reservation binds `reservationId`, `dispatchId`, replay fingerprint, pricing digest, scope path, and expiry. If the process crashes before dispatch append, recovery may continue the same dispatch under a newer fence, or cancel only after durable no-dispatch evidence; if dispatch presence is ambiguous, it must quarantine rather than refund. If dispatch was appended but the attempt was not started, recovery may start that same attempt exactly once under a fresh fence. If `attempt-started` was appended but spawn outcome is unknown, the attempt remains charged and recovery records failure or creates a new retry attempt. Missing or mismatched terminal usage becomes `unreconciled`, blocks new admission, and is cleared only by a later normalized receipt. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:648-812] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts:520-763] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md:117-138]

5. **Lease ownership is a bounded liveness claim; the current fence check inside the mutation is the safety boundary — CONFIRM the 036 fencing contract and EXTEND iteration 11's append ordering.** Every acquire or takeover advances the durable high-water token; release, restart, restored state, clock rewind, owner reuse, and cleanup never reuse it. `withFences` rejects duplicates, inverted order, and reentrancy, performs side-effect-free preparation, reacquires resource mutexes in canonical order, revalidates every exact live lease tuple, mints per-resource capabilities, and only then calls commit. Thus a stale worker may finish local computation but cannot append graph state, accept a result, settle another attempt, clear a checkpoint, or execute an effect. A pre-write fence check, PID, nonce, timestamp, or successful lease acquisition alone is insufficient. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts:55-112] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:366-437] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts:468-720]

6. **Retries, effects, and settlement have separate irreversible boundaries — CONFIRM iterations 6 and 9.** A retry is a new attempt under the existing open reservation only after `startAttempt` successfully charges an attempt unit; failed work never erases token, cost, time, or attempt consumption. Executor output can propose an `EffectIntent`, but execution needs a fresh 036 authorization decision, an effect idempotency key, and the current effect-resource fence. An ambiguous effect result is recovered by receipt lookup, never blind replay. Terminal settlement accepts only a normalized receipt bound to the dispatch, replay fingerprint, price catalog, units, deadline, and terminal status; it releases only the proven unused remainder. Graph terminal state must reference the budget settlement/anomaly and every effect receipt rather than infer them from local success. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:648-812] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:942-1008] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:84-137]

7. **Recovery ownership must stay partitioned, and GraphARC's local meters/session files remain compatibility observations — REFINE iteration 8 and CONFIRM iteration 13.** The graph orchestrator owns saga state and decides which receipt is missing; hierarchical-budget replay alone owns capacity and reconciliation; the fencing coordinator alone owns token high-water/current lease; the 036 gateway and ledger own authorization/domain truth; the gate ledger owns approval; the effect service owns intent/receipt recovery. GraphARC's process-local budget, usage callbacks, materializer, and session checkpoints help build legacy parity fixtures, but they cannot reset cumulative spend, prove a reservation, mint a fence, or authorize resume. Recovery reconstructs all authoritative cuts first and performs no action when owners disagree. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:205-259] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:7-37] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:61-91]

## State-Machine Composition

```text
PROPOSED
  -> REFUSED                         admission/seal failure; authority-zero terminal
  -> AWAITING_APPROVAL               durable gate request; no dispatch reservation/lease
  -> READY_TO_RESERVE                proof + seal + policy + approval re-bound
  -> RESERVED                        one atomic ancestor-wide budget grant
  -> CLAIMED                         bounded canonical lease(s), new fence epoch
  -> DISPATCH_AUTHORIZED             036 decision + fenced domain append
  -> ATTEMPT_STARTED                 attempt debit committed before spawn
  -> EXECUTING                       computation may emit effect intents only
  -> EFFECT_PENDING/RECOVERING       effect receipt lookup/authorized execution
  -> SETTLING                        normalized usage receipt or anomaly
  -> SUCCEEDED|FAILED|CANCELLED      fenced terminal append references receipts

Any state -> STALE_FENCED            local worker stops committing; successor recovers
Any post-reservation uncertainty -> UNRECONCILED
UNRECONCILED -> terminal only after authoritative receipt/reconciliation evidence
```

The transition key is `(graphRunId, logicalTaskId, logicalNodeId, fanoutBranchId?, attemptId, dispatchId)`. Optional coordinates are explicit `null`, never omitted or synthesized from process index. Proposal/admission and materialization identities remain immutable inputs; authority heads, approval freshness, remaining capacity, lease ownership, and 036 epoch are live inputs rechecked at their owning boundary.

## Transaction Boundaries and Lock Order

| Boundary | Atomic work | Must not be folded into it |
|---|---|---|
| Gate record | Persist request or decision under gate ledger fence | Budget reservation, lease held across human wait, effect |
| Budget admission | Read verified budget head, compare every ancestor/dimension, authorize, append one grant/denial | Graph dispatch append or node state |
| Lease grant | Advance one canonical resource's durable token and install exact holder | Authorization or protected mutation |
| Multi-resource commit | Unique resources in ascending `orderKey`; revalidate every lease and commit while mutexes are held | External calls, human wait, executor work, budget service calls that acquire independent locks |
| Dispatch append | Fresh 036 authorization, expected head, current fence capability, append receipt | Executor spawn |
| Attempt debit | Verify open reservation and append attempt spend | Provider call |
| Effect commit | Fresh effect authorization + effect-resource fence + idempotency lookup/execution/receipt | Inferring graph success or budget settlement |
| Budget settlement | Validate normalized receipt and append commit/release or anomaly | Rewriting executor/effect history |
| Terminal append | Reference dispatch, attempt, effect, and budget receipts under current graph-state fence | Retroactive authorization |

The global acquisition rule is canonical `orderKey` only; semantic labels such as “budget before graph” never override it. Long-running or external work occurs outside `withFences`. If a protocol would require holding a fenced mutex while calling another independently locking authority, it is decomposed into receipt-linked transitions.

## Failure and Recovery Matrix

| Failure point | Durable evidence | Owner and required recovery | Forbidden recovery |
|---|---|---|---|
| Approval pending/timeout | Gate request, no executor reservation | Gate service records pending/expired; fresh decision restarts revalidation | Synthetic reject, lease renewal, hidden reservation |
| Budget grant then crash | Reservation keyed to dispatch | Orchestrator resumes same dispatch or budget authority cancels after no-dispatch proof | Blind refund/reset |
| Lease acquisition timeout | Typed lock timeout, reservation still open | Orchestrator retries boundedly or cancels reservation with proof | Force unlock or token reuse |
| Authorization deny after reserve | Denial receipt, no dispatch append | Cancel/release only after verified absence of dispatch | Treat denial as no-spend proof without ledger check |
| Dispatch append then crash before spawn | Dispatch receipt, no attempt event | Reacquire higher fence; start same attempt once | Append second dispatch |
| Attempt debit then spawn ambiguity | Attempt event, unknown execution | Preserve debit; reconcile receipt or fail; retry uses new attempt | Erase attempt or release incurred spend |
| Lease expires during computation | Higher successor token/current holder | Old worker discards commit; successor reconciles authoritative events | Old owner renew/release/commit |
| Effect timeout/ambiguous response | Effect intent/idempotency key, receipt unknown | Effect service looks up receipt before authorized retry | Blind replay |
| Usage missing/mismatch | Budget anomaly/unreconciled scope | Budget authority blocks admission until reconciliation | Estimate-as-actual or capacity release |
| Cancel requested | Current dispatch/attempt/effect cuts | Authorize cancellation, stop new effects, settle incurred usage, terminal append | Delete events or reset meter |
| Resume after checkpoint | Replay fingerprint, heads, lease high-water | Rebuild all ledgers, reject stale identity, acquire new fence | Trust checkpoint/PID/session alone |
| Inverted or reentrant lock set | Typed order violation before commit | Caller recomputes unique sorted set | Retry same order or nest guards |

## Graph Ownership Mapping

| Concern | Canonical owner | Graph use |
|---|---|---|
| Program/mode/lineage/iteration capacity | Hierarchical budget ledger | Node and fan-out attempts use distinct reservation/dispatch IDs at the applicable existing leaf; graph topology is not a new budget ancestry |
| Graph-run/node/branch mutable state | Versioned protected-resource adapter | Use an existing kind only when semantics and required identity components match; otherwise add a reviewed graph-specific registry version before authority |
| Ledger append head | Fenced ledger writer | Budget, gate, graph-domain, authorization, effect, and recovery ledgers each retain their own head/fence |
| Current worker claim | Fencing coordinator | Lease controls liveness; current capability at commit controls safety |
| Permission to transition/effect | 036 gateway | Re-evaluates exact request, heads, epoch, policy, gate, proof, seal, budget and fence evidence |
| Saga progress | Graph orchestration ledger/reducer | References receipts across authorities; never recomputes or overrides their decisions |

## Composition Mutants

| ID | Injected defect | Earliest expected owner |
|---|---|---|
| HB-LF01 | Add `task` or `node` as an undeclared fifth budget scope | Budget schema |
| HB-LF02 | Reserve only the leaf while an ancestor is exhausted | Budget admission |
| HB-LF03 | Hold/renew a reservation and lease throughout approval wait | Gate-to-budget composition |
| HB-LF04 | Reuse pre-approval proof, policy head, or authority epoch on resume | 036 authorization |
| HB-LF05 | Treat reservation receipt as dispatch authorization | 036 gateway |
| HB-LF06 | Acquire resources in semantic rather than canonical order | Fencing coordinator |
| HB-LF07 | Check a fence before, but not atomically with, mutation | Protected writer |
| HB-LF08 | Reuse a token after release/restart/clock rewind | Fencing coordinator |
| HB-LF09 | Old worker commits after takeover under the same owner ID | Protected writer |
| HB-LF10 | Spawn executor before `attempt-started` is durable | Budget/orchestrator boundary |
| HB-LF11 | Retry under the same attempt without another attempt debit | Budget authority |
| HB-LF12 | Execute effect from approval or node return without new intent authorization | Effect gateway |
| HB-LF13 | Blindly replay an ambiguous effect | Effect recovery/idempotency |
| HB-LF14 | Cancel and release capacity while dispatch presence is ambiguous | Budget reconciliation |
| HB-LF15 | Reset cumulative spend or fence state from GraphARC session/checkpoint | Replay/continuity verifier |
| HB-LF16 | Hold a fenced guard while calling an external provider or waiting for a human | Lock-composition invariant |

All mutants must prove zero protected mutation/effect on denial, stable typed reason, unchanged unrelated resources, deterministic replay, and earliest-owner attribution in the iteration-13 comparator.

## Compatibility

- Legacy GraphARC admission/materialization, session approval, process-local budget, and usage records remain shadow observations only. The adapter correlates their proposal/run/node/call identities to the canonical dispatch without accepting them as budget, lease, or authorization receipts.
- During dark operation, legacy remains authoritative and the fenced shadow adapter serializes legacy emission plus dark observation under one epoch; dark budget denial or lock failure is reported as divergence and cannot alter the legacy result.
- A staged cutover requires complete graph parity cases for approval waits, budget races, stale fences, retries, cancellations, effect ambiguity, settlement quarantine, and resume, plus fresh bindings to budget reducer/replay and fencing registry/coordinator/writers.
- In-flight legacy work is classified, not silently adopted. It either finishes under legacy authority, is drained, or receives an explicit migration record that creates canonical reservation/dispatch/resource identities at a new epoch.

## When Not to Use

- Do not use the current fencing backend for multi-host or network-filesystem coordination; its declared atomicity domain is `single-host-filesystem`.
- Do not serialize independent nodes under one coarse graph lock merely because they share a run; protect the smallest state actually mutated and rely on ledger-head fencing for shared appends.
- Do not create a lock for immutable proposal/seal validation or read-only replay; locks protect mutation, not confidence.
- Do not encode graph topology as budget ancestry. The shipped hierarchy is administrative; arbitrary node/task quotas need a separately versioned allocation contract.
- Do not reserve executor capacity before an unbounded human wait, or hold locks during planning, provider calls, effect execution, backoff, or telemetry export.
- Do not use lease expiry as cancellation, authorization, budget release, or proof that an external effect did not happen.
- Do not use GraphARC meters, session checkpoints, local traces, or PIDs to reconstruct authoritative spend or ownership.

## Ruled Out

- A cross-ledger ACID transaction spanning budget, gate, graph-domain, authorization, and effect ledgers; no consulted runtime primitive provides it.
- Mapping graph run/task/node/fan-out depth directly onto the four fixed budget scope kinds.
- Holding a lease or reservation through approval wait to “guarantee” later capacity.
- Reserving after executor spawn, or settling from estimates/local success without a normalized receipt.
- Force-unlock, token reset, owner-ID reuse as lease continuity, or checkpoint-derived fence restoration below the durable high-water mark.

## Dead Ends

- Broad repository-wide `budget|lock|approval` scanning was noisy because it mixed legacy guards, planning documents, and unrelated phase contracts. Narrow reads of the two runtime libraries, their tests, and their owning 036 specs recovered the actual authority boundaries.

## Edge Cases

- Ambiguous input: “hierarchical” could mean graph topology or the shipped administrative scope chain. The latter is selected because the runtime type union is closed; graph coordinates remain dispatch/resource identity.
- Contradictory evidence: GraphARC materialization prose calls admitted data authorization and local session/budget code enforces useful process behavior, while 036 requires current gateway, receipt, and fence evidence. The 036/runtime contracts are authoritative at system scope; GraphARC is retained as compatibility evidence.
- Missing dependencies: No distributed transaction or multi-host fencing backend exists; the design explicitly remains a single-host saga.
- Partial success: None; all five research actions yielded sufficient local evidence.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/{budget-types,budget-authority,budget-events,budget-reducer,budget-replay}.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/{locks-and-fencing-types,fenced-lease-coordinator,fenced-ledger-writer,fenced-state-store,fence-capability}.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/{001-receipts-and-effect-recovery,004-hierarchical-typed-budgets,006-locks-and-fencing}/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves/spec.md`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/{runtime,session,planner,gateway}/`
- Graph-arch lineage iterations 3–6, 8–9, 11, and 13

## Assessment

- New information ratio: 0.79
- Calculation: 4 fully new findings (module-boundary constraint, exact saga order, compensation/recovery protocol, recovery ownership) and 3 partially new findings (approval wait, fencing invariant, retry/effect/settlement mapping): `(4 + 0.5 × 3) / 7 = 0.786`, rounded to `0.79`.
- Questions addressed: How do budget reservation, approval, leases/fences, authorization, dispatch, attempts, effects, settlement, cancellation, retry, and resume compose without deadlock, overspend, ABA, or stale commit?
- Questions answered: The state machine, transaction boundaries, canonical lock discipline, failure ownership, graph identity mapping, mutants, compatibility, and non-applicability are decided at design level.

## Reflection

- What worked and why: Reading the closed budget scope types and fence commit contract before composing the graph lifecycle exposed where atomicity truly ends and forced explicit recovery receipts for every cross-service gap.
- What did not work and why: A broad 036 scan mixed many historical and downstream lock/budget mentions; narrowing to the owning phase-007 specs and runtime tests recovered the enforceable contracts.
- What I would do differently: For the next pass, begin with the 036 gateway input and append receipt schemas and lay every graph transition field against their exact verification order.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `14/14`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

036 authority-plane integration and exact verification order. Define one graph transition request/evidence schema and walk admission proof, sealed materialization, compiled policy, canonical identity, gate decision, budget receipt, fence capability, current ledger heads, authority epoch, effect intent, append receipt, and replay projection through gateway evaluation without duplicating or skipping an owner.
