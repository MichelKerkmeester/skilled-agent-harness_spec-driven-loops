# Cross-Study Integration — Graph-Based Agent-Loop Engine over 036

## 1. Grounding, Scope, and Source Corpus

This capstone integrates five completed syntheses; it does not re-derive them. The orientation fixes eight cross-study questions and states the central tension: richer graph/harness/knowledge mechanisms must remain subordinate to the designated 036 authority plane, which is currently dark rather than enforced. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:33] [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:73]

The source corpus is:

- S1: graph-as-projection, seven planes, typed IR, staged rollout. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5]
- S2: belief settlement, ledger fold, causal-prefix parity, claim/fence, refusal, human gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:11]
- S3: admission versus authorization, policy, gates, budgets, governance mutants. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14]
- S4: completeness and knowledge/evidence production. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:15]
- S5: typed returns, curated memory, callable context, bounded LEAF, layered evaluation, harness mutants. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:14]

The implementation audit confirms that 036 contains substantial ledger/control/cutover primitives, while its per-mode selector is explicitly dark and unwired. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:5] [INFERENCE: “designated authority” is a target-state contract, not a claim of live enforcement.]

## 2. Executive Decision

Evolve system-deep-loop into a typed graph engine whose graph is a proposal/projection and orchestration surface over an append-only evidence substrate. It may compile work, schedule sealed subgraphs, dispatch bounded LEAF actions, curate context, produce knowledge, settle belief, evaluate convergence, and compile organization policy. It may not mutate authoritative loop state. S1's projection rule and S3's admission/authorization split make this boundary directly compatible. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18]

Current mode is `legacy_authoritative_dark_observer`: legacy produces the external result, and 036 records shadow evidence afterward without changing it. Target mode is `036_authoritative`: the exact candidate traverses typed return, evidence, belief, convergence, policy, human-gate, and append-time authority checks. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [INFERENCE: one upstream machine can serve both modes because only its terminal owner changes.]

The design is integration-settled; it is not implementation-proven. The next evidence is a mutant-driven single-mode shadow vertical slice with frozen baselines and measured deltas.

## 3. One Integrated Architecture

The engine has eight cooperating planes plus the external authority boundary:

1. **Typed graph IR** — immutable admitted graph/subgraph/node identities, schemas, dependencies, capabilities, policies, budgets, and evaluator obligations. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23]
2. **Execution harness** — typed returns, bounded repair, fixed LEAF actions/escalations, artifact handles, and node-scoped claims/fences. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226]
3. **Evidence/knowledge production** — independently quality-gated assertions, negative evidence, source closure, and D/C/G/H/R/M promotion families. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77]
4. **Memory/context** — bounded, read-only locators and content-addressed artifact handles; no truth or authority ownership. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50]
5. **Belief/convergence** — deterministic usability and stop-eligibility projections over reference-closed events. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]
6. **Governance** — organization-policy ALLOW/DENY/ASK, durable scoped human decisions, refusal, budgets, and owner-disagreement records. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67]
7. **Compatibility/recovery** — causal-prefix shadow parity, mixed-version replay, effect receipts, reconciliation, rollback drills, and retained legacy assets. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452]
8. **Measurement/promotion** — provenance-bound metrics and conjunctive evidence certificates; summaries cannot authorize. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193]
9. **036 authority boundary** — current-head/epoch/fence/capability/policy recheck and authorized append, dark today and target-authoritative only after cutover evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178] [INFERENCE: every preceding plane is a typed evidence producer for 036, never a competing authority.]

## 4. P1 — Authority-Subordination Contract

The complete artifact is [01-authority-subordination.md](artifacts/01-authority-subordination.md).

- Current state: legacy is authoritative; dark graph/036 observations occur after legacy and cannot change the external result. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5]
- Target state: proposal, admission, evaluation, belief, convergence, policy, human ASK settlement, then 036 append. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [INFERENCE: typed ordering removes implied authority from every upstream “pass.”]
- Hard invariant: graph edges, accepted returns, belief, convergence, policy, or approval never become append capabilities.

## 5. P2 — Unified Promotion-Evidence Model

The complete artifact is [02-promotion-evidence.md](artifacts/02-promotion-evidence.md).

Promotion evidence is six independently blocking families: D data/knowledge, C causal/replay, G governance mutants, H harness mutants, R recovery/rollback, and M measurements. S4 forbids family substitution; S2, S3, and S5 supply distinct negative-test owners. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126]

The earliest-owner oracle evaluates D→C→G→H→R→M and assigns remediation to the first causal failure. It retains downstream symptoms without allowing them to obscure ownership. [INFERENCE: dependency order and mutant localization together provide deterministic failure attribution.]

## 6. P3 — Memory, Knowledge, and Belief Non-Collision

The complete artifact is [03-memory-knowledge-belief.md](artifacts/03-memory-knowledge-belief.md).

Memory locates; knowledge supplies evidence-bound assertions; belief settles context-specific usability. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]

Read-through is fail-closed: locator -> digest-verified assertion -> current belief settlement. Missing, stale, contradicted, insufficient, or authority-zero links return typed blockers. Never-forget classes include authority decisions, DENY/ASK/refusal, human gates, contradictions/supersessions, provenance, negative tests, receipts, rollback anchors, and unresolved blockers. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:103] [INFERENCE: derived views may change; the evidence closure never does.]

## 7. P4 — 036 Capability and Ownership Gap Audit

The complete artifact is [04-036-capability-audit.md](artifacts/04-036-capability-audit.md).

Confirmed present: transition ledger/gateway, head/epoch checks, locking/fencing, budgets, receipts/effect recovery, cutover certificates, and rollback windows. Confirmed shadow-only: dark adapter, shadow parity, per-mode authority flip, and currently unconsumed rollback drills. Missing: graph admission/materialization, belief projection, organization-policy compiler, durable gate/refusal. Adapter-owned: graph identity/evidence resolution, knowledge/memory projections, budget/effect normalization, and graph-to-036 bridge. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:74] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/rollback-drills/README.md:30]

The studies themselves flag 036 assumptions as unaudited and require gates/policy/belief that are not present as graph modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386]

Minimum build: IR materializer; admission/evidence resolver; memory/knowledge/belief reducers; policy/gate/refusal; graph budgets/effects; shadow certificate bridge. [INFERENCE: this adapter slice reuses 036 authority primitives and avoids a second ledger.]

## 8. P5 — Graph, Subgraph, and LEAF Boundary

The complete artifact is [05-execution-boundary.md](artifacts/05-execution-boundary.md).

The closed LEAF actions are READ_CONTEXT, CALL_MODEL, CALL_TOOL, EMIT_ARTIFACT, REQUEST_SUBGRAPH, RETURN_RESULT. Escalations are ASK_HUMAN, REQUEST_BUDGET, REQUEST_CAPABILITY, REPORT_BLOCKER, ABSTAIN. Unknown kinds are refused; escalation returns control to the graph reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330] [INFERENCE: closed kinds enable tactics without authorizing vocabulary expansion.]

Recursive subgraphs bind the parent and may only narrow capabilities/policy, conserve budget, shorten leases/deadlines, and return through parent evaluation. Claims and fences bind every dispatch/result; late results become evidence only. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226]

## 9. P6 — End-to-End Typed Gate/Evaluation State Machine

The complete artifact is [06-typed-gate-machine.md](artifacts/06-typed-gate-machine.md).

The seven stages are ReturnAdmission, Evidence, Belief, Convergence, OrgPolicy, HumanGate, and Authority. Each has discriminated success/block states and reason codes; there is no generic `validated` flag. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:79]

Every failed attempt remains append-only and repair creates a linked attempt. The terminal result is `shadow_recorded` in current mode or 036 `authorized_append` in target mode. [INFERENCE: the same state machine supports migration without changing upstream ownership.]

## 10. P7 — Unified Rollout and Rollback DAG

The complete artifact is [07-rollout-rollback-dag.md](artifacts/07-rollout-rollback-dag.md).

The thirteen-node DAG runs baseline/contract/mutants/dark-core first; permits graph, harness, and knowledge construction as one isolated parallel wave; joins epistemic/governance projections before mutation controls; proves parity and recovery before promotion; cuts over one mode reversibly; observes a rollback window and zero-use; then retires live writers while retaining archival readers. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:138] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126]

Every forward node owns rollback/reconstruction assets and exits with an exact-digest evidence certificate. [INFERENCE: rollout is a proof DAG, not a calendar sequence.]

## 11. P8 — Measurement and Owner-Disagreement Closure

The complete artifact is [08-measurement-arbitration.md](artifacts/08-measurement-arbitration.md).

Seven measurement families cover correctness, epistemics, harness, governance, performance, recovery, and rollout. Every metric binds population, exclusions, source/base/candidate digests, mode, authority epoch/state, policy version, time window, raw observations, and calculation version. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193] [INFERENCE: explicit denominators make comparison auditable.]

Disagreement is jurisdictional, not majoritarian. Earlier-owner blocks persist. Multiple policies compose DENY > ASK > ALLOW; human action settles scoped ASK only. Factual conflicts trigger blinded independent re-derivation; persistent conflict becomes an expiring ASK and `blocked_disagreement`, so 036 refuses. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:103] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330]

## 12. Current-State and Target-State Integration

| Concern | Current state | Target state |
|---|---|---|
| externally visible result | legacy result only | 036-authorized candidate |
| graph | shadow proposal/projection | live proposal/projection |
| evidence machine | records comparisons | blocks/admits authority request |
| policy/gates | prototype/shadow, absent modules | durable, digest-bound producers |
| 036 | designated, dark, unwired per mode | per-mode authoritative and reversible |
| legacy writers | retained and authoritative | retained through rollback window; then zero-use retirement |

This two-mode contract resolves the orientation's central tension without a big-bang switch. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:47] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452]

Other apparent tensions resolve as follows:

- Graph executes computation but only proposes mutation. [INFERENCE: projection limits authority, not utility.]
- Evidence history is immutable; memory/belief projections are rebuildable. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99]
- Completeness means all scoped obligations are accounted for; a bounded loop may correctly abstain. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83]
- Compatibility parity and intentional improvement are separate candidate lanes; improvement never masks parity failure. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69]

## 13. Design-Settled Versus Still Open

**Design-settled:** authority ownership; current/target modes; no-bypass ordering; D/C/G/H/R/M conjunction; earliest-owner attribution; memory/knowledge/belief semantics; never-forget classes; closed LEAF/subgraph boundary; typed gate states; jurisdictional arbitration; additive-dark rollout and rollback asset ownership. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:59] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14] [INFERENCE: all eight artifacts agree on one ownership graph.]

**Still open and evidence-bound:** numeric quality/cost/latency thresholds; belief calibration; retention durations; multi-host fencing/store semantics; exact graph identity/evidence resolver; durable policy/gate/refusal implementation; real mutant kill rates; recovery timings; human ASK frequency/latency; per-mode cutover order under observed risk. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193]

No open item requires re-studying one source. Each requires implementation or measurement.

## 14. Next Evidence — Mutant-Driven Shadow Prototype

Use one frozen deep-research legacy corpus and exact baseline SHA. Compile a typed graph, run admitted sealed nodes through the complete state machine, and call the dark adapter only after legacy returns. Do not change external results or cut over authority. This follows every study's terminal evidence recommendation. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:122] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:537] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:234] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193]

Baseline before candidate execution: legacy outcome distribution, causal event prefixes, replay hashes, p50/p95 latency, tokens/tools/cost, receipt completeness, recovery time, and ASK timing.

Seed at least: wrong graph identity; unknown LEAF action; child scope/budget widening; malformed return; each independently missing evidence family; causal reorder/truncation; stale belief; false convergence; DENY/ASK bypass; stale/revoked gate; stale head/epoch/fence; lost never-forget reference; receipt loss; rollback crash.

Prototype exit requires:

- zero externally visible shadow-result differences;
- deterministic replay and exact causal-prefix comparison;
- every seeded safety mutant killed by its expected earliest owner;
- every D/C/G/H/R/M negative blocks independently;
- zero unauthorized appends;
- complete never-forget reference closure;
- passed recovery/rollback drills;
- performance/cost deltas reported with raw denominators, without inventing thresholds.

[INFERENCE: this is the smallest experiment that exercises all eight integrated contracts while preserving current authority.]

## 15. Eliminated Alternatives

- **Graph as authority:** conflicts with S1 projection and S3 admission/authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18]
- **Generic `validated` flag:** masks owner/reason and collapses S5's independent layers. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95]
- **Weighted/majority promotion:** permits a green family to mask red evidence, contrary to S4. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77]
- **Memory as truth store or belief overwrite:** destroys the production/settlement distinction. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]
- **Open-ended LEAF actions or recursive privilege widening:** violates bounded LEAF and sealed graph contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55]
- **Human approval overrides DENY or stale authority facts:** confuses policy settlement with append authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386]
- **Big-bang cutover, parity-only promotion, or early writer retirement:** violates the studies' staged/reversible rollout. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178]
- **Duplicating 036 ledger/cutover/recovery:** creates a second authority plane where an adapter slice is sufficient. [INFERENCE: actual audit shows these primitives already exist.]

## 16. Divergence Map

| Source emphasis | Apparent divergence | Integrated resolution |
|---|---|---|
| S1 graph projection | graph must also schedule real work | scheduling produces proposals/evidence, not authority |
| S2 immutable fold | memory/belief need change | immutable events, rebuildable projections |
| S3 org policy/human gates | 036 is final authority | policy/human settle permission; 036 settles mutation facts |
| S4 completeness | S5 bounds loops | complete obligation accounting may end in abstain/block |
| S2 causal parity | graph intends improvements | compatibility and improvement use separate candidate lanes |
| S5 local repair | S2/S3 fail-closed governance | repair stays inside return admission budget; later-owner blocks never repair locally |
| proposed target architecture | actual 036 is dark | current and target modes share upstream trace but differ at terminal authority |

Each resolution connects at least two studies and removes a circular ownership edge. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:47] [INFERENCE: the resulting dependency graph is acyclic from proposal to authoritative append.]

## 17. Convergence Report

Ten iterations completed under `max-iterations`. New-information ratios were `0.88, 0.82, 0.76, 0.91, 0.72, 0.66, 0.63, 0.69, 0.04, 0.03`. The 0.05 threshold was first crossed at iteration 9 and treated only as telemetry; iteration 10 broadened into closure and next-evidence design as required.

All P1–P8 questions are answered at the integration-design level. The final two rounds found no new architectural component: they resolved tensions, proved logical no-bypass coverage, and converted empirical uncertainty into the shadow-prototype contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:208] [INFERENCE: conceptual convergence is strong, but executable mutant and baseline evidence remains intentionally open.]

Stop reason: `maxIterationsReached`.
