---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Extract graph-engineering governance patterns from the graph-arch (GraphARC) reference implementation, grounded in all 12 graph-engineering blog posts, to advance the graph-based system-deep-loop design from repo studies 1 and 2. Investigate admission proof, materialization sealing, organization policy, durable human gates, authority-zero refusal, ledger-first observability, budget lifecycle, and governance mutants; map every decision to the runtime and the 036 authority plane, with confirm/refine/extend/contradict framing and when-not-to-use boundaries.
- Started: 2026-08-13T21:32:29Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: fanout-graph-arch-sol-high-1786656633113-zhqpv7
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Prior-decision ledger and orientation normalization across GraphARC, agent-swarms, and graphene-main | architecture-governance | 0.69 | 8 | complete |
| 2 | GraphARC governance architecture, trust boundaries, canonicality, forgeability, and enforcement chokepoints | architecture-governance | 0.86 | 7 | complete |
| 3 | GraphAdmissionProofV1 before 036 authorization: schema, trust boundary, freshness, verification order, and refusal mapping | admission-authority | 0.83 | 6 | complete |
| 4 | SealedCompiledGraphV1 materialization artifact and execution-time TOCTOU revalidation | materialization-sealing | 0.86 | 7 | complete |
| 5 | OrganizationGraphPolicyV1 source contract, provenance-preserving compiler, 036 audit mapping, and mode-registry integration | organization-policy | 0.86 | 7 | complete |
| 6 | GraphApprovalGateV1 durable human-gate lifecycle, dependency revalidation, idempotency, and runtime integration | human-approval-gate | 0.86 | 7 | complete |
| 7 | TransitionRefusalV1 compile/admission variants, authority-zero invariants, remedy/replan lifecycle, and audit integration | authority-zero-refusal | 0.86 | 7 | complete |
| 8 | Ledger-first GraphExecutionEventV1 and projection-to-OTel observability contract | ledger-observability | 0.86 | 7 | complete |
| 9 | Hierarchical graph budget admission, reservation, debit, settlement, and exhaustion lifecycle | hierarchical-budget-lifecycle | 0.79 | 7 | complete |
| 10 | Governance mutant corpus, earliest-owner rules, and staged promotion gates | governance-mutants-promotion | 0.79 | 7 | complete |
| 11 | Authorized-ledger integration mapping for graph admission, evidence, events, refusals, authorization, append, and replay | authorized-ledger-runtime-mapping | 0.71 | 7 | complete |
| 12 | Mode registry, graph policy compilation, canonical identities, capability ceilings, and migration boundaries | mode-registry-policy-compilation | 0.71 | 7 | complete |
| 13 | Exact graph shadow comparison contract, causal-prefix ownership, normalization exclusions, and promotion evidence | shadow-parity-runtime-mapping | 0.79 | 7 | complete |
| 14 | Hierarchical budgets plus locks-and-fencing composition, atomic boundaries, and recovery ownership | budgets-locks-fencing-runtime-mapping | 0.79 | 7 | complete |
| 15 | 036 authority-plane integration, exact verification order, fact ownership, and fail-closed recovery | 036-authority-plane-integration | 0.79 | 7 | complete |
| 16 | Blog-corpus grounding pass A over the first six lexical posts, cross-post tensions, GraphARC fidelity, and non-applicability | blog-corpus-grounding-pass-a | 0.64 | 7 | complete |
| 17 | Blog-corpus grounding pass B over the remaining six lexical posts, pass-A interactions, GraphARC fidelity, and non-applicability | blog-corpus-grounding-pass-b | 0.64 | 7 | complete |
| 18 | Contradictions, negative evidence, explicit non-applicability, and falsification of the combined graph-governance contracts | contradictions-negative-evidence-non-applicability | 0.57 | 7 | complete |
| 19 | Concrete schema and protocol decision matrix for graph governance contracts and existing-runtime compositions | concrete-schema-protocol-decision-matrix | 0.50 | 7 | complete |
| 20 | Independent final cross-check, iteration-19 corrections, and synthesis handoff across the complete graph-architecture lineage | final-cross-check-synthesis-handoff | 0.60 | 8 | complete |

- iterationsCompleted: 20
- keyFindings: 134
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] Which admission facts must become a non-forgeable proof precondition before 036 authorization, and which facts must 036 re-bind independently?
- [ ] Which sealed materialization, policy compilation, approval, refusal, and budget contracts close bypass and TOCTOU paths without duplicating authorization? [legacy-import]
- [ ] Which ledger-first observability and replay-to-OTel contract preserves canonical evidence while keeping telemetry a projection? [legacy-import]
- [ ] Which runtime integration points in authorized-ledger, mode-registry, shadow-parity, hierarchical-budgets, and locks-and-fencing should confirm, refine, extend, or contradict prior studies? [legacy-import]
- [ ] Which governance mutants and staged-promotion gates prove the combined design, and where should the mechanisms explicitly not be used? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] Which sealed materialization, policy compilation, approval, refusal, and budget contracts close bypass and TOCTOU paths without duplicating authorization?
- [ ] Which ledger-first observability and replay-to-OTel contract preserves canonical evidence while keeping telemetry a projection?
- [ ] Which runtime integration points in authorized-ledger, mode-registry, shadow-parity, hierarchical-budgets, and locks-and-fencing should confirm, refine, extend, or contradict prior studies?
- [ ] Which governance mutants and staged-promotion gates prove the combined design, and where should the mechanisms explicitly not be used?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅█▇█████▇▇▅▅▇▇▇▄▄▂▁▃
- score sparkline: ▅█▇█████▇▇▅▅▇▇▇▄▄▂▁▃
- Last 3 ratios: 0.57 -> 0.50 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":13,"other":287}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treating GraphARC trace, replay, or OTel as canonical evidence: repo studies require the 036 ledger and closed audit/domain cuts, while GraphARC derives and infers telemetry after execution. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:29-31] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:50-50] (iteration 1)
- Treating GraphARC's admitted proposal as final authorization: the orientation explicitly records that `AdmissionResult` is forgeable ordinary data and lacks current 036 head/epoch binding. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:34-34] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:58-58] (iteration 1)
- Treating GraphARC's memory graph as a replacement for Graphene truth admission: its contradiction check occurs after write and lacks checked settlement, nogoods, and a serializable admission head. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-328] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:68-68] (iteration 1)
- Treating direct compiled-graph invocation as session-gate compliant: the session runtime and regression test demonstrate the gated node executes while approval remains pending. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:45-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:194-209] (iteration 2)
- Treating forwarded planner arguments as governed by admission: both proposal and materializer sources state admission does not inspect them. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:117-120] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:21-27] (iteration 2)
- Treating registry object identity as immutable registry contents: the governed-loop source explicitly distinguishes them and requires `freeze()` for the stronger claim. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:12-18] (iteration 2)
- Extending `AdmissionResult` with an `authorized=true` or self-asserted signature field: the caller can construct both and the library trust boundary remains unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60] (iteration 3)
- Letting a valid admission proof bypass current head/epoch/policy/identity evaluation: 036 explicitly requires exact live request and state binding before append. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-98] (iteration 3)
- Using the 16-character proposal fingerprint as the only proof subject: it omits mutable governance dependencies and is shorter than the full canonical digest used by 036. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:248-255] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:169-188] (iteration 3)
- Reusing approval solely because artifact bytes remain unchanged: policy, authority, assignment, budget, resource versions, and expiry may have changed. (iteration 4)
- Sealing only proposal topology: registry bodies, arguments, writes, schemas, reducers, compiler flags, policies, gates, and effects also determine executable meaning. (iteration 4)
- Treating the returned `CompiledGraphARC` object as durable proof: it has no canonical manifest, content digest, or trust-separated attestation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:255-282] (iteration 4)
- Accepting caller-provided tenant, role, or context as identity evidence. (iteration 5)
- Adding tenant policy, role assignments, or verdicts to mode-registry metadata. (iteration 5)
- Lowering compiled rules to bare `Decision` values: it reproduces behavior but loses the exact source rule, approver role, policy identity, and audit cause. (iteration 5)
- Treating a more specific or tenant-scoped allow as an exception to a broad deny: the fixed tier model deliberately forbids that. (iteration 5)
- Treating GraphARC's JSONL policy audit as the canonical 036 decision ledger. (iteration 5)
- A decision containing only request ID and Boolean outcome. (iteration 6)
- Direct callback approval or `grapharc go` as a trusted human decision. (iteration 6)
- Letting the approval invoke an effect without a separate authorized `EffectIntent`. (iteration 6)
- Planner checkpoint/decision files as canonical approval storage. (iteration 6)
- Releasing a gated node from session/checkpoint state without a current append receipt. (iteration 6)
- Reusing approval because the proposal fingerprint or artifact digest is unchanged. (iteration 6)
- Treating timeout as a synthetic reject by an absent person. (iteration 6)
- Allowing a refusal evidence receipt to satisfy an authorization or effect boundary. (iteration 7)
- Fabricating a 036 audit decision for compiler/admission refusal. (iteration 7)
- First-failure-only admission results. (iteration 7)
- Free-text remedy as executable instruction. (iteration 7)
- Mutating and resubmitting the same candidate identity. (iteration 7)
- Partial admission or automatic repair of a rejected proposal. (iteration 7)
- Treating `NEEDS_APPROVAL` as denial or approval. (iteration 7)
- A graph-local authoritative ledger parallel to 036. (iteration 8)
- Blind resend after an ambiguous telemetry export. (iteration 8)
- Checkpoint acceptance without cut/reducer/topology/fingerprint verification. (iteration 8)
- Last-write-wins replay for fields whose reducers are unknown. (iteration 8)
- OTel export failure affecting graph authority or success. (iteration 8)
- Timestamp, step, or filename sorting as replay order. (iteration 8)
- Treating GraphARC trace JSONL or OTel spans as canonical evidence. (iteration 8)
- Whole-trace sorting or terminal-state equality as shadow parity. (iteration 8)
- Creating a graph-local budget ledger parallel to the existing hierarchical-budget and 036 ledgers. (iteration 9)
- GraphARC's `SpendMeter.ensure_headroom()` plus `charge()` bounds overshoot per process but cannot atomically reserve concurrent calls or account for unpriced calls; varying that pattern cannot close distributed races. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:7-37] (iteration 9)
- Releasing unknown or already committed spend as a “refund.” (iteration 9)
- Resetting cumulative spend on retry, cycle, approval resume, checkpoint recovery, or authority re-instantiation. (iteration 9)
- The alpha-model article's stated per-run cap cannot provide hard guarantees: it explicitly describes advisory self-reported spend. It remains useful as a product-honesty boundary, not as a protocol source. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:325-361] (iteration 9)
- Treating budget exhaustion as convergence, success, human rejection, authorization denial, or permission to trim the graph. (iteration 9)
- Treating GraphARC admission headroom or an `ADMITTED` result as reserved capacity. (iteration 9)
- Allowing shadow parity, triage, normalization, or certificate issuance to change authority or emit live effects. (iteration 10)
- Classifying a mutant by its last visible symptom instead of its earliest owning gate. (iteration 10)
- Falling back to legacy inside a post-cutover request after a selected writer fails. (iteration 10)
- Passing promotion because all discovered tests ran while required cases or observations were absent. (iteration 10)
- Reusing the Roadmap's 14 pedagogical steps as promotion stages cannot supply authority, evidence closure, recovery, or rollback semantics; it remains a fixture-taxonomy source only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-266] (iteration 10)
- The prompt's `context/graph-arch/examples/` path does not exist. Repository discovery found the canonical examples under `context/graph-arch/grapharc/examples/`; retrying the stale path is exhausted for this packet. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage0_dag.py:1-8] (iteration 10)
- Treating stage 0–6 completion as a maturity ladder or cutover signal. (iteration 10)
- Allowing organization policy to widen a mode/platform ceiling. (iteration 12)
- Lowering ASK to ALLOW after a callback without durable gate evidence and fresh 036 reevaluation. (iteration 12)
- Matching policy against aliases, command names, packets, agents, or instance names. (iteration 12)
- Putting tenant policy, role assignments, gate outcomes, or authorization verdicts in mode-registry metadata. (iteration 12)
- Reusing compiled policy after authority-relevant registry projection drift. (iteration 12)
- Rewriting historical canonical modes through alias-aware readers. (iteration 12)
- Treating registry tool surfaces or current executor self-reports as request authority. (iteration 12)
- Adding undocumented volatility tolerances after observing a failure. (iteration 13)
- Comparing incomplete observation subsets or silently accepting extra observations. (iteration 13)
- Issuing promotion evidence after any authority mutation, live effect, missing case, open divergence, mutant survivor, nondeterministic rerun, or stale binding. (iteration 13)
- Reusing the same implementation on both sides or deriving both projections from one reducer. (iteration 13)
- Treating GraphARC trace, replay, policy audit, session state, or local meters as canonical truth. (iteration 13)
- Whole-trace sorting, terminal-state-only comparison, or generic object diff as causal parity. (iteration 13)
- A cross-ledger ACID transaction spanning budget, gate, graph-domain, authorization, and effect ledgers; no consulted runtime primitive provides it. (iteration 14)
- Broad repository-wide `budget|lock|approval` scanning was noisy because it mixed legacy guards, planning documents, and unrelated phase contracts. Narrow reads of the two runtime libraries, their tests, and their owning 036 specs recovered the actual authority boundaries. (iteration 14)
- Force-unlock, token reset, owner-ID reuse as lease continuity, or checkpoint-derived fence restoration below the durable high-water mark. (iteration 14)
- Holding a lease or reservation through approval wait to “guarantee” later capacity. (iteration 14)
- Mapping graph run/task/node/fan-out depth directly onto the four fixed budget scope kinds. (iteration 14)
- Reserving after executor spawn, or settling from estimates/local success without a normalized receipt. (iteration 14)
- A cross-ledger transaction or graph-local authority plane; receipt-linked recovery is the supported composition. (iteration 15)
- Asking 036 to rerun the graph compiler/materializer or human decision instead of verifying their immutable owner receipts. (iteration 15)
- Broad cross-repository searches again produced noisy legacy references. Narrow reads of the gateway/ledger/effect implementations, their unit tests, the owning phase-004/006 specs, and the two prior syntheses supplied the enforceable boundaries. (iteration 15)
- Calling budget reservation before an unbounded human gate or materializing unsealed bytes after approval. (iteration 15)
- Folding denial into domain history, treating an allow audit event as an applied transition, or using telemetry/replay as a writer. (iteration 15)
- Treating the generic gateway's optional identity resolver as sufficient without graph-specific mandatory pinning. (iteration 15)
- A generated script, trace, local meter, or callback as proof of the iteration-15 authority protocol. (iteration 16)
- Budget exhaustion or maximum iterations as convergence. (iteration 16)
- Graph retrieval as a universal RAG replacement or source of canonical facts. (iteration 16)
- Majority vote or fresh-context evaluation as truth or mutation authority. (iteration 16)
- Posts 3, 4, and 6 substantially duplicate one claim family; repetition was not counted as independent evidence. (iteration 16)
- Product and organization references lacked reproducible local methodology and were excluded from performance, cutover, and authority decisions. (iteration 16)
- Silent removal of failed/missing fan-out results. (iteration 16)
- Worktree/process separation as a replacement for claims, leases, fences, and canonical append. (iteration 16)
- A targeted GraphARC inventory requested `memory/graph.py`, which does not exist. The narrower implementation inventory and existing materializer/replay sources established that knowledge-graph storage is outside GraphARC rather than inventing a replacement path. (iteration 17)
- Adopting an autonomous alpha graph on the blog's performance assertions. (iteration 17)
- Allowing a dynamic work graph to grant itself tools, credentials, roles, or wider budget. (iteration 17)
- Equating fresh context with independent evidence, filesystem isolation, or fencing. (iteration 17)
- Equating work-graph edges, retrieval edges, causal claims, and authorization facts. (iteration 17)
- Posts 1, 3, and 4 repeat pass-A maker/checker and fan-out claims; only the new layer ownership, stress mutants, capability-rewrite boundary, and finance fixture were retained as deltas. (iteration 17)
- Treating graph, loop, and harness as successive replacements rather than nested layers with distinct failure ownership. (iteration 17)
- Treating local reported cost as a hard budget or cap termination as convergence. (iteration 17)
- Using model diversity, diagram approval, or Manager `PASS` as ground truth or mutation authority. (iteration 17)
- Broad repetition of the already blocked approach list would add no evidence. This pass used the list only as a falsification index and reread the narrow implementation seams that could overturn decisions. (iteration 18)
- Claiming multi-host fencing, exactly-once effects, or hard provider budget without the owning external primitive. (iteration 18)
- Hiding direct compiled invocation behind convention while the object remains reachable. (iteration 18)
- Inferring reducers, parent events, missing usage, identities, or target outcomes during replay/recovery. (iteration 18)
- Product adoption and benchmark claims still lack one reproducible local methodology, so they remain excluded rather than averaged or majority-voted. (iteration 18)
- Repairing GraphARC convenience objects by adding self-asserted proof fields or signatures inside the same interpreter. (iteration 18)
- Requiring the full governed graph stack for every small/read-only workflow. (iteration 18)
- Retrying opaque effects because an intent exists or a lease is current. (iteration 18)
- Treating comments that disclose a limitation as enforcement of that limitation. (iteration 18)
- Further research into generic protocol shape is unlikely to reduce implementation risk; the remaining questions require implementation specifications, target-owner primitives, and executable mutants. (iteration 20)
- Introducing a graph-local omnibus ledger or cross-ledger ACID transaction: no consulted primitive supports it, and it would split authority. (iteration 20)
- Recounting repeated blog claims as independent evidence: passes A/B already expose shared claim families and unsupported marketing. (iteration 20)
- Repeating broad repository scans: prior iterations and the final bounded inventory show they mix legacy and unrelated contracts; owner-specific reads are sufficient. (iteration 20)
- Self-attested GraphARC proof fields, direct compiled invocation, session/checkpoint approval authority, local cost as reservation, trace/OTel authority, and blind opaque-effect retry are definitively exhausted. (iteration 20)
- Treating the iteration limit or new-information ratio as convergence proof: iteration 20 is a hard workflow stop, and synthesis remains a separate reducer/workflow responsibility. (iteration 20)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Follow up on: **The final adoption rule is risk-and-value based, with no “unsafe because controls are unavailable” exception — CONFIRM iterations 16–18 and EXTEND Decision 8's non-applicability boundary.** Use a typed function, har...

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
