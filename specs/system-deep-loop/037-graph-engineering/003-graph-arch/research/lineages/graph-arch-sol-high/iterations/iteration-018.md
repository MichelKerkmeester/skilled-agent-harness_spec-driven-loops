# Iteration 18: Contradictions, Negative Evidence, and Non-Applicability

## Focus

This iteration attempts to falsify the contracts from iterations 1–17 against GraphARC code/tests, the two prior studies, all twelve blog claims already grounded in passes A–B, the current runtime, and the 036 authority plane. It distinguishes a contradiction resolved by the proposed integration from an open implementation gap or a contradiction that changes the decision. The result is negative knowledge: conditions under which the design must refuse, remain observational, or not be used.

## Findings

1. **GraphARC's convenience objects remain useful planner guards but cannot be promoted to proofs; unchecked forwarded arguments require a narrower materialization decision — CONFIRM iterations 3–4 and CONTRADICT the materializer's local “authorisation” wording.** `AdmissionResult` is forgeable ordinary Pydantic data, the proposal fingerprint is only 16 hex characters, registry factories remain interpreter-owned, and `forward_args=True` passes planner JSON to a factory without admission inspection. The prior seal requirement survives, but it is now stricter: a governed adapter must keep `forward_args=false` or validate arguments against a registered per-kind schema and include canonical arguments, schema, factory artifact, and compiler flags in the materialization seal. **Disposition: decision changed; GraphARC gap remains open until the adapter exists.** [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:1-27] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-74] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:117-120] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:248-255]

2. **Session approval is bypassable by direct compiled invocation and loses task identity in repeated-node fan-out; the durable gate must bind task instance and hide the raw runnable — EXTEND iteration 6 and CONTRADICT any GraphARC-session-as-gate compatibility claim.** The session module explicitly states that `session.graph.invoke(...)` runs gated nodes while the session remains pending, and its regression test proves it. It also admits that multiple tasks at the same gated node are indistinguishable and one state verdict reaches the graph. The integration decision therefore changes from “wrap the session gate” to “use a durable task-instance gate outside GraphARC; expose only the governed invocation surface.” **Disposition: decision changed; upstream GraphARC bypass remains open.** [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:1-65] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:194-209]

3. **Policy precedence is deterministic, but audit completeness and identity verification are optional at two different seams — CONFIRM iterations 5, 12, and 15 while preserving an open deployment risk.** GraphARC evaluates matching rules by fixed `DENY → ASK → ALLOW`, so “specific allow overrides broad deny” is not an ambiguity; it is explicitly false. Yet compiled node/edge policy adapters can return bare decisions without engine audit. Separately, the 036 gateway records honest `*_verified=false` fields when its optional resolver pins nothing and can still reach policy evaluation. Requiring a graph-specific resolver plus deny-on-unverified policy resolves the design contradiction, but no generic constructor enforces that deployment profile. **Disposition: prior decision unchanged; integration misconfiguration remains open.** [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:193-299] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:320-370] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:303-348] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-831]

4. **GraphARC replay reconstructs an observation stream rather than canonical execution and is intentionally nondeterministic without missing metadata — CONFIRM iterations 8, 13, and 15 and CONTRADICT any trace-derived proof claim.** File order is recorder order, values longer than 2,000 characters are truncated, reducers are absent unless a caller supplies them, failed writes are inferred away, and parent association may abstain during fan-out. These are honest debugging semantics, not defects to paper over. The 036 ledger replay/fingerprint remains canonical and GraphARC trace replay remains a projection. **Disposition: resolved by authority separation; decision unchanged.** [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:1-34] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:193-242] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-328]

5. **Budget and fencing contracts survive falsification only inside declared atomicity and evidence domains — REFINE iteration 14.** Hierarchical budgets atomically reserve four typed dimensions and block unknown/stale/unreconciled usage; fences authorize writes only when the protected store compares the current durable token inside the same commit. Neither contract supplies multi-host consensus, provider billing ingestion, exchange-rate truth, or safe behavior for a backend without atomic compare-and-mutate. Such environments must use a single fenced broker or remain unsupported, and missing normalized usage keeps dispatch blocked. **Disposition: decision narrowed to declared single-host/backend atomicity; multi-host/general-provider integration remains open.** [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md:54-118] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:65-135]

6. **Exactly-once external effects remain impossible for opaque targets; receipt-linked sagas support only replay-safe or conclusively reconcilable adapters — CONFIRM iterations 6, 14, and 15 and EXTEND the when-not-to-use boundary.** The effect contract correctly persists intent before invocation, derives stable keys independent of attempt/PID, and refuses success when application precedes a lost confirmation. If a target exposes neither idempotency nor trustworthy read-after-write reconciliation, an ambiguous crash becomes `in_doubt` and requires operator resolution. No retry policy, graph topology, or fence can recover missing target truth. **Disposition: intrinsic residual risk; autonomous effect use is prohibited for opaque targets.** [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:70-160] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts:745-924]

7. **The full governance stack can cost more than it protects on small, read-only, evidence-poor, or operationally immature work — CONFIRM iterations 16–17 and EXTEND non-applicability into an adoption gate.** The blogs themselves retain simple harnesses/loops, warn against architecture theater, disclose advisory budgets, and show that graph retrieval loses simple lookup and cost. The architecture should require a measured coordination or risk benefit before adding proof, gate, budget, fence, effect, and parity services. Conversely, high-risk work does not become suitable merely because the organization cannot operate those controls; it must remain manual or unavailable. **Disposition: decision unchanged but made operationally testable by the matrix below.** [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-118] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:160-182] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:325-361]

## Contradiction Ledger

| ID | Contradiction / negative evidence | Prior decision challenged | Disposition | Consequence |
|---|---|---|---|---|
| C01 | Materializer calls `AdmissionResult` authorisation while admitting callers can forge it | I3 admission proof; I4 seal | **Resolved in design; open in implementation** | Treat GraphARC admission as planner-to-operator evidence only |
| C02 | `forward_args=True` exposes uninspected planner arguments to factories | I4 executable closure | **Changes decision** | Default false; otherwise registered schema + canonical args must enter proof and seal |
| C03 | Direct compiled invocation runs session-gated nodes | I6 durable approval | **Changes decision** | Raw runnable is not exposed on governed paths; only external task-bound gate can release execution |
| C04 | Repeated fan-out tasks at one gated node are indistinguishable; one verdict channel reaches graph | I6 subject binding | **Changes decision** | Gate subject includes task/branch/logical-effect identity, not node name alone |
| C05 | Compiled policy adapters can bypass GraphARC engine audit | I5 policy provenance | **Resolved by 036; GraphARC remains incomplete** | Seal compiled provenance and require canonical 036 decision audit |
| C06 | Gateway identity/evidence resolver is optional and may pin only a subset | I15 mandatory resolver | **Open deployment risk** | Graph profile must require all three verified flags; fail startup or deny otherwise |
| C07 | Fixed deny-first policy means a specific allow never overrides a broad deny | I5 precedence | **Resolved, unchanged** | Preserve deny-first tiers and test rule-order invariance |
| C08 | Trace strings truncate, reducers are caller-supplied, and fan-out parent linkage can be unknown | I8/I13 replay and parity | **Resolved by no-authority classification** | GraphARC replay remains diagnostic; verified ledger replay supplies truth |
| C09 | Local meter cannot reserve concurrent ancestor capacity or settle unknown provider usage | I9/I14 budget | **Resolved for supported runtime; integration open** | Hierarchical authority owns reservation/settlement; unknown usage quarantines |
| C10 | Fence safety depends on atomic compare-token-plus-write; no general multi-host consensus exists | I14 fencing | **Narrows decision** | Support declared atomic domains or a single fenced broker only |
| C11 | External target may apply before confirmation and expose no conclusive query | I15 effect saga | **Intrinsic/open** | Record `in_doubt`; prohibit automatic replay and require operator resolution |
| C12 | Blog majority judges, adoption numbers, speed/cost figures, and knowledge-graph universals lack common independent evidence | I16/I17 corpus deltas | **Resolved by exclusion** | They cannot set architecture, promotion, or cutover thresholds |
| C13 | Knowledge-graph edges, work dependencies, and authorization facts share graph vocabulary but not semantics | I1/I16/I17 graph-kind separation | **Resolved, unchanged** | Separate schemas, owners, admission, and query paths |
| C14 | Complete governance adds latency/operational cost and can dominate simple work | I16/I17 non-applicability | **Resolved by adoption gate** | Require measurable coordination/risk value or use a harness/loop/manual process |

## Negative-Knowledge Registry

| Negative fact | Falsifier / observable check | Required response |
|---|---|---|
| Convenience data is not proof | Hand-build matching `AdmissionResult` and materialize | No 036 evidence resolution; refuse governed dispatch |
| Executable meaning exceeds topology | Change registry body, args, reducer, schema, policy, or compiler flag under same proposal | Seal mismatch or recompilation; never reuse approval |
| Session gate is not graph-enforced | Invoke compiled graph directly while hold is pending | Governed surface must make this path unreachable |
| Node name is not task identity | Fan out the same gated node and approve only selected branches | Exact task-bound decisions; ambiguity refuses release |
| Optional verification is not verification | Omit resolver or return partial expected identity | All verified flags false/partial; graph policy denies |
| Local audit is not canonical audit | Use compiled policy adapter that returns a bare decision | Absence of 036 decision receipt blocks mutation |
| Trace replay is not execution replay | Use a >2,000-character value or reducer-backed field without reducer metadata | Divergence/unknown; never create promotion evidence |
| Local headroom is not reservation | Race two dispatches against the same remaining parent capacity | At most one authoritative reservation; loser denies before spawn |
| Lease is not fencing | Resume an expired holder after successor token acquisition | Mutation-side stale-fence rejection |
| Intent is not effect completion | Crash after target application before local confirmation | Reconcile; `in_doubt` blocks automatic retry |
| A judge is not ground truth | Inject a known wrong candidate sharing judge blind spot | Negative control must fail; surviving mutant blocks promotion |
| Graph breadth is not value | Compare end-to-end cost/failure recovery with the simplest harness/loop | Reject graph if coordination/risk benefit is not measured |

## Changed and Unchanged Decisions

### Changed

- **Materialization closure:** `forward_args` is prohibited by default for governed execution. Any exception requires a registered argument schema, canonical validated argument bytes, and inclusion in admission proof and materialization seal.
- **Approval subject and invocation surface:** the durable gate binds `(proposal, materialization, task/branch instance, action, actor/role, policy, expiry)`; a node name is insufficient. Governed callers receive no raw compiled-graph invocation path.
- **Environment claim:** fencing is supported only for stores with atomic current-token-plus-mutation or through one fenced broker; the design does not claim general distributed locking.

### Unchanged

- GraphARC proposals, admissions, policies, sessions, traces, meters, and checkpoints remain non-authoritative evidence or compatibility observations.
- One 036 authority plane independently binds current head, epoch, registered policy, and trusted actor/capability/evidence identity.
- Quote precedes an unbounded human wait; authoritative budget reservation and fence follow approval and live revalidation.
- Every irreversible effect has a separately authorized intent and confirmation/reconciliation lifecycle.
- Verified ledger replay precedes projections; telemetry, parity, and certificates never mutate authority.
- Missing branches, evidence, usage, identity, schema, policy, fence, or target outcome fail closed rather than being normalized.
- Work, supervision, evidence/knowledge, and authority graphs keep different schemas and owners.

## Residual Open Risks

1. No shipped graph-specific evidence resolver or deployment constructor mechanically requires all identity/evidence fields to be verified before an allow.
2. No shipped durable materialization-seal service closes registry body, dependency/environment, forwarded argument, reducer, and compiler-option identity.
3. GraphARC still exposes a direct compiled invocation path that bypasses session approval, and its fan-out approval identity is insufficient for selective task release.
4. Provider pricing/usage normalization and stale-price ownership remain external dependencies of authoritative settlement.
5. The fencing contract is single-host/backend-atomicity scoped; multi-host deployment needs a proven broker or transactional backend, not a file lease.
6. Opaque external targets without idempotency or conclusive status queries necessarily retain operator-blocking `in_doubt` outcomes.
7. Corpus performance/adoption assertions and knowledge-retrieval scores remain unsuitable for local cutover until reproduced with pinned workloads and costs.
8. Operational burden—receipt retention, policy/key rotation, reconciliation queues, gate staffing, fence recovery, and parity analysis—has not been measured for this graph integration.

## Consolidated When-Not-to-Use Matrix

| Dimension | Do not use a graph / full governed graph when | Use instead | Re-entry evidence |
|---|---|---|---|
| Graph size/shape | One bounded task, a short true sequence, or one objective correction loop; no real fan-out/join/gate/recovery | Function, harness, chain, or bounded loop | Trace shows stable independent branches or explicit control-state need |
| Risk/blast radius | Irreversible effect cannot be idempotent or reconciled; financial/safety/legal judgment lacks accountable approval | Manual/operator workflow or read-only analysis | Durable intent, target idempotency/status, risk owner, and tested recovery |
| Authority | Actor/capability/evidence cannot be positively resolved; current policy/head/epoch unavailable | Refuse mutation; advisory proposal only | Trusted resolver pins all fields and 036 policy denies unverified input |
| Environment | Backend cannot atomically compare fence and mutate; multi-host topology lacks a proven coordinator | Single writer/broker or unsupported | Fault-injection proves stale-writer rejection in declared atomicity domain |
| Evidence quality | No external ground truth, incomplete branch observations, correlated judge, surviving negative controls | Human judgment, deterministic instrumenting, or more evidence collection | Pinned answer key/rubric, complete cases, mutants killed, deterministic rerun |
| Budget/accounting | Usage/pricing is unknown, stale, self-reported only, or parent capacity cannot be reserved | Quote/advisory mode or no dispatch | Normalized receipts, pricing digest, atomic ancestor reservation, reconciliation |
| Operational maturity | No gate operator, recovery queue, receipt/key retention, policy versioning, on-call ownership, or rollback drill | Shadow/read-only/manual mode | Named owners, SLOs, runbooks, drills, retention and key-rotation evidence |
| Retrieval | Simple lookup or cheap keyword/vector/relational query suffices; entity identity/edge semantics are unreliable | Keyword/vector/SQL/hybrid route | Multi-hop/temporal workload, governed entity resolution, provenance, measured gain |
| Change rate | Topology/capability/policy changes faster than it can be sealed, approved, and observed | Flexible harness/manual planning | Stable contract boundaries and measured benefit from explicit topology |
| Cost/value | Governance and orchestration latency/cost exceed avoided failure cost | Simpler architecture | Representative baseline shows better end-to-end value including failures/recovery |

## Falsification Mutants

| Mutant | Earliest owner | Required outcome |
|---|---|---|
| Forge an admitted result with matching proposal ID/fingerprint | Graph evidence resolver | No trusted admission proof; zero reservation, append, or effect |
| Enable `forward_args` and inject an undeclared callable/credential/reference | Compiler/materialization seal | Schema/seal refusal before gate |
| Call raw compiled graph while a durable approval is pending | Governed invocation boundary | Path unavailable or 036/gate denial; gated body never runs |
| Fan out identical gated node names and approve one named task | Gate ledger | Only exact bound task releases; ambiguity denies all uncertain tasks |
| Configure no gateway resolver, or pin actor but not capability/evidence | Graph transition policy | Deny on any `*_verified=false` |
| Produce a decision through a GraphARC compiled policy adapter with no audit record | 036 authorization gateway | Missing canonical decision proof blocks mutation |
| Replay a truncated string or reduced list without registered reducer identity | Replay/parity gate | Mismatch/unknown blocks certificate; no inferred expected baseline |
| Race sibling dispatches against one remaining ancestor budget unit | Budget authority | One grant, one denial, no oversubscription |
| Pause holder, expire/take over, then resume old write | Fencing coordinator/store | Atomic stale-fence rejection and no committed old-epoch bytes |
| Crash after remote application but before confirmation on opaque target | Effect recovery | `in_doubt`; no automatic replay or fabricated confirmation |
| More-specific allow conflicts with broad deny | Policy compiler/evaluator | Deny-first stable result independent of file order |
| Judge shares builder blind spot and passes a known-bad output | Evaluation/promotion gate | Mutant survives; promotion blocked rather than majority-overridden |
| Drop one failed fan-out result before reduce | Observation/fan-in policy | Missing branch visible; partial acceptance only if sealed policy permits |
| Run governed stack on one cheap read-only lookup | Adoption gate | Simpler baseline wins; graph rejected on cost/value |

## Ruled Out

- Repairing GraphARC convenience objects by adding self-asserted proof fields or signatures inside the same interpreter.
- Treating comments that disclose a limitation as enforcement of that limitation.
- Hiding direct compiled invocation behind convention while the object remains reachable.
- Retrying opaque effects because an intent exists or a lease is current.
- Inferring reducers, parent events, missing usage, identities, or target outcomes during replay/recovery.
- Claiming multi-host fencing, exactly-once effects, or hard provider budget without the owning external primitive.
- Requiring the full governed graph stack for every small/read-only workflow.

## Dead Ends

- Broad repetition of the already blocked approach list would add no evidence. This pass used the list only as a falsification index and reread the narrow implementation seams that could overturn decisions.
- Product adoption and benchmark claims still lack one reproducible local methodology, so they remain excluded rather than averaged or majority-voted.

## Edge Cases

- Ambiguous input: “resolved” distinguishes design closure from shipped integration. Several contradictions are resolved architecturally while remaining open implementation gaps.
- Contradictory evidence: GraphARC prose calls admission authorisation and session approval governed, while the same modules document forgery and direct-invocation bypass. The executable limitations govern system classification.
- Missing dependencies: No graph-specific resolver, durable materialization-seal service, general multi-host fence backend, provider usage authority, or universal effect reconciliation surface exists.
- Partial success: Four focused audit actions covered the named falsification surfaces. Two broad outputs truncated after load-bearing anchors; no missing claim is marked resolved solely from truncated evidence.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/{proposal,admission,materialize}.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/{policy,session,observe,runtime,gateway}/`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types,transition-authorization-gateway}.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/`
- `.opencode/skills/system-deep-loop/runtime/tests/{unit,fixtures,hierarchical-budgets}/`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/{001-receipts-and-effect-recovery,004-hierarchical-typed-budgets,006-locks-and-fencing}/spec.md`
- `specs/system-deep-loop/037-graph-engineering/{001-agent-swarms,002-graphene-main}/research/research.md`
- All twelve files under `specs/system-deep-loop/037-graph-engineering/context/blog-posts/`, through the iteration-16/17 evidence matrices and targeted negative-evidence scan
- Graph-arch lineage iterations 1–17

## Assessment

- New information ratio: 0.57
- Calculation: 1 fully new finding (changed task-bound approval/raw-invocation decision) and 6 partially new findings (sealed arguments, optional identity/audit, replay, atomicity scope, opaque effects, and adoption gate): `(1 + 0.5 × 6) / 7 = 0.571`, rounded to `0.57`.
- Questions addressed: Which prior contracts survive direct falsification, which contradictions are resolved versus open, and where should the combined mechanism not be used?
- Questions answered: The contradiction ledger, negative-knowledge registry, changed/unchanged decisions, residual risks, non-applicability matrix, and mutant suite establish the negative boundary for the design.

## Reflection

- What worked and why: Reading implementation docstrings beside executable regression tests separated candidly documented limitations from actual enforcement and revealed the task-identity/direct-invocation change.
- What did not work and why: Broad prior-iteration/blog scans truncated because the negative corpus is large; narrow load-bearing code and service contracts supplied the decisions, while truncated material was not used to close new questions.
- What I would do differently: Iteration 19 should encode each surviving decision as a concrete schema field, producer, verifier, freshness rule, and refusal code so no prose-only boundary reaches synthesis.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `18/18`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 4; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Build the iteration-19 concrete schema and protocol decision matrix. For every surviving object and transition, name its sole producer, canonical fields, digest/reference bindings, verifier, freshness/revocation rule, refusal owner/code, storage ledger, replay contribution, and explicit non-authority consumers; incorporate the two changed decisions for sealed arguments and task-bound approval.
