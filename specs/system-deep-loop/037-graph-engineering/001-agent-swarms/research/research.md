# Graph-Based Deep-Loop: Research Synthesis

## Executive Decision

Evolve `system-deep-loop` into a graph runtime by adding a **versioned, compiled execution graph as a projection over the 036 authority plane**. The graph decides what is ready and proposes transitions; 036 remains the only authority for identities, transition admission, ledger history, effects, receipts, budgets, fencing, certificates, and cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:126-170]

Do not begin with autonomous graph generation. Begin with a deterministic graph IR and normalized shadow traces for existing modes, then promote pure nodes, read-only parallelism, fenced writes, typed gates, durable effects/human gates, subgraphs, and only finally generated work graphs. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:123-169]

The practical lesson from AgentSwarms is not its entire runtime. The extractable mechanisms are its typed node/edge core, deterministic graph-order reducers, fail-closed branches, skip propagation, bounded topological execution, pinned graphs, checkpoints, nested swarms, evaluator nodes, approvals, and hybrid retrieval. Its limitations—level-wide barriers, textual loop completion, best-effort checkpoints, source-shape parity tests, and mutable shared browser state—identify where the 036 contracts must remain stronger. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:35-103]

## Authority and Layering

The target has seven non-interchangeable planes:

1. **036 authority plane:** transition gateway, typed append-only ledger, effect receipts, fencing, budgets, certificates, and migration/cutover. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:45-103]
2. **Organization graph:** stable, versioned policy for roles, capability versions, data/tool zones, trust classes, budgets, ownership, and allowed handoffs. It governs who may participate; it schedules nothing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170]
3. **Work graph:** a per-run proposal describing what work is needed now. It may split, merge, cancel, or add bounded work as evidence changes, but cannot expand authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:144-170]
4. **Compiled execution graph:** immutable, digest-bound executable topology validated against organization policy and 036 constraints. [INFERENCE: separates generated intent from authorized deterministic execution]
5. **Ledger/checkpoint:** the ledger is sole history; a checkpoint is a disposable replay accelerator pinned to a ledger sequence and topology/reducer versions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmCheckpoint.ts:11-133]
6. **Evidence graph:** a non-authoritative projection connecting claims, source spans, findings, verdicts, effects, and certificates for explanation and coverage. [INFERENCE: preserves graph-assisted reasoning without creating a second control authority]
7. **Knowledge graph:** a retrieval structure of domain assertions and temporal relations; it can supply evidence candidates but never authorize transitions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/utils/tools/kb-graph.server.ts:117-240]

## Decision 1 — Typed Executable Graph IR

Adopt `GraphDefinitionV1` with immutable `graph_id`, `graph_version`, `topology_digest`, organization/work-graph references, entry/terminal nodes, declared capabilities, and typed node/edge/port/reducer tables. [INFERENCE: derived from AgentSwarms' minimal node/edge types and the 036 versioned event envelope]

`NodeSpecV1` declares kind/version, input/output ports, adapter capability, local state schema, deterministic/effectful class, retry and timeout policy, budget, write set, isolation, and optional subgraph reference. `EdgeSpecV1` declares source/target ports, control/data relation, readiness mode, predicate/verdict enum, reducer, failure behavior, and loop-back permission. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:19-101]

Compilation must reject unknown node/edge kinds, incompatible ports, undeclared cycles, unreachable terminals, ambiguous routes, unsupported adapter capabilities, unsafe writes, and missing gate/effect policies. Arbitrary code may exist behind a versioned adapter, but arbitrary code is not the authoritative graph language. [INFERENCE: a closed IR is required for replay, parity, policy validation, and migration]

Every proposed node/edge transition becomes a 036 transition intent; only the gateway can append its authorized event. An executor cannot “complete” a node by updating graph state directly. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:62-115]

## Decision 2 — Scheduler, Reducers, and Safe Waves

Separate **readiness** from **execution width**. An edge/join declares `all`, `any`, `quorum`, or `stream` readiness. A barrier is valid only when a consumer needs the complete set, cross-set dedupe, or total-set comparison; otherwise pipeline ready items to avoid straggler latency. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:96-143]

Reducer algebra is explicit and versioned: input order, identity, associativity/commutativity claims, missing-input behavior, conflict behavior, and output schema. AgentSwarms correctly stages concurrent writes and reduces in graph order rather than completion order; preserve that determinism. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:103-174]

Branches fail closed. A control result must map exactly to a declared edge/verdict enum; untaken edges become dead and skip propagation must preserve valid diamond joins. Never guess a route from prose or let a failed control node continue with every branch live. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:85-101,234-284]

Parallel write waves require a digest-bound `WavePlanV1`, declared write sets, conflict-graph admission, isolation/fencing, and mutation-side fence validation. Unknown write sets conflict by default. A lease without a fence is insufficient because a stale worker can still commit. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:83-156]

## Decision 3 — Verdicts as Structural Control Edges

Use `GateVerdictV1` with verdict enum, deterministic results, evaluator panel results, evidence/trajectory digests, evaluator/rubric versions, confidence, blast-radius class, authorized action, and certificate reference. A verdict that does not select an edge is a report, not a gate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:41-88]

Run deterministic checks first. Use independent or cross-family judges only for irreducibly semantic criteria; high-blast decisions require blinded/counterfactual adjudication and stronger quorum. Confidence cannot authorize irreversible production writes. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-and-counterfactual-adjudication/spec.md:54-129]

Bind an accepted verdict to the exact graph version, node attempt, input/output/evidence digests, evaluator/rubric versions, deterministic results, and action. A metadata-only certificate is not evidence of semantic equivalence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:49-123]

Promote gates only after negative controls, pinned evaluator versions, trace-derived failure cases, shadow comparison, and measured disagreement. Evaluate end-to-end result, trajectory, and component behavior. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:90-180]

## Decision 4 — Replay, Effects, and Human Gates

The 036 ledger is sole history. `GraphCheckpointV1` contains last applied sequence, replay fingerprint, topology digest, reducer/adapter versions, projected node/edge state, and checksum. Corruption or mismatch discards the checkpoint and replays the ledger. Missing checkpoint state never proves an effect did not happen. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/utils/swarmCheckpoint.server.ts:6-37]

Effectful nodes follow `intent_recorded → execute → confirmed`. Resume classifies unresolved effects as `not_applied|applied|in_doubt|conflict`; replay requires a stable idempotency key or independent proof of non-application. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:56-84]

Human gates are ledger entities. `HumanGateOpenedV1` binds run/attempt, suspended node, graph and evidence digests, allowed principals/groups, policy version, fence, expiry, and timeout edge. Decisions are idempotent commands against an observed gate version; stale topology, evidence, assignment, expiry, or fence is rejected. Reassignment and timeout are new events, never in-place mutation or implicit approval. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/supabase/migrations/20260724100000_swarm_approvals_and_runs.sql:17-58]

## Decision 5 — Loops as Typed Subgraphs

Adopt `LoopSubgraphSpecV1`: immutable child graph reference, typed ports, local state namespace, reducer versions, budget partition, convergence policy, maximum rounds, exit-verdict schema, and parent continuation mapping. Child events use parent/child causation in the same 036 ledger. [INFERENCE: retains independent loop semantics without opaque nested state]

Terminal verdicts are `converged|exhausted|blocked|failed|cancelled`. Textual `DONE` may be input to an evaluator but is not authority. Dedupe convergence against everything observed, including rejected discoveries, or dead ends recur forever. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:209-239]

Use mode-specific profiles rather than one generic loop: research converges on evidence novelty/coverage; review on verified finding closure; improvement on evaluator-approved candidate deltas; council on quorum-backed decisions. Their private scratch state is isolated and they compose only through typed artifacts. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-200]

## Decision 6 — Behavioral Parity

Create a versioned golden-graph corpus and compare normalized authorized ledger traces across CLI, native, browser-like, headless, and fan-out adapters. Required equivalence covers node/edge transitions, reducers, skip sets, verdicts, budget charges, effect intents, checkpoints/resume, and terminal certificates. Transport ids, timestamps, token chunks, and model prose may differ. [INFERENCE: observable semantic parity is stronger than matching imports or node-kind strings]

Fixtures must include unknown route, reducer-order permutations, all/any/quorum/stream joins, missing inputs, write conflicts, retry exhaustion, judge disagreement, stale approvals, lost/corrupt checkpoints, in-doubt effects, cancellation, nested convergence, topology patch races, budget exhaustion, and unavailable capabilities. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:50-145]

Current runtime parity invariants—canonical packet paths, lifecycle vocabulary, reducer ownership, pause sentinel, and lineage keys—become graph adapter conformance requirements rather than provider-specific conventions. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md:19-86]

## Decision 7 — Organization and Work Graphs

`OrganizationGraphV1` is stable governance. The existing mode registry is its proto-source: mode/role owners, definitions, backends, and capability constraints should compile into one versioned graph instead of being duplicated. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-200]

A generator emits `WorkGraphProposalV1` against pinned organization/task/evidence digests. A deterministic compiler checks schema, cycles, ports, capability authorization, write sets, budgets, isolation, gates, and adapters before sealing execution topology. The generator cannot mint tools, data access, authority, or budget. [INFERENCE: proposal/compile/authorize/seal keeps generative planning outside the trust boundary]

Mid-run changes are `GraphPatchProposalV1` operations with precondition digest and affected frontier. Acceptance creates a new topology version; completed events retain the version under which they were authorized. AgentSwarms' separate draft/published graph is the concrete precedent for pinned executable topology. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmPublish.ts:1-121]

## Decision 8 — Hybrid Evidence and Knowledge Routing

Use a deterministic query classifier for `lexical|vector|graph|hybrid`. Exact ids and symbols route lexical; semantic lookup routes vector; multi-hop, relationship, temporal, and contradiction questions route graph; mixed questions fuse candidates and rerank by provenance/fitness. Record route, candidate origin, score normalization, and final source spans. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/kbRag.ts:160-252]

`KnowledgeAssertionV1` uses controlled predicates, source span digest, extractor/version, confidence, bitemporal validity (`valid_from/valid_until`, `observed_at`), and status (`active|superseded|contradicted|uncertain`). Contradictions preserve both claims; supersession closes validity rather than deleting history. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:144-198]

Entity resolution is gated. Exact curated identifiers may link automatically; fuzzy merges remain proposals with evidence and review because hop-level identity errors compound. Retrieved paths are evidence candidates, never authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:230-372]

## Cross-Cutting Observability and Budget

Emit `TraceEnvelopeV1` for every attempt: causal ids, graph/node/adapter versions, input/output/evidence digests, edge selection, reducer result, budget debit, effect ids, verdict/certificate, timing, and status. Keep sensitive/full payloads in sealed referenced artifacts. [INFERENCE: one typed trace boundary supports replay, parity, trajectory eval, and cost analysis]

Track critical-path latency, queue/barrier wait, fan-out width, straggler tax, retry/revisit rate, branch prune ratio, conflicts, judge disagreement, effect ambiguity, and cost per certified outcome. Budgets nest run → subgraph → node → attempt; exhaustion chooses an explicit edge and never silently weakens model/evidence/gate requirements. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:299-342]

## Explicit When-Not-to-Use Boundaries

- Keep a direct harness action for one deterministic command or small transform. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-118]
- Keep a single loop when every step depends on the previous output, topology is still exploratory, or an operator wants to approve every step. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:193-231]
- Do not create a typed subgraph for an ordinary bounded retry without independent state, internal roles, gates, or convergence. [INFERENCE: graph structure must represent a real semantic boundary]
- Do not use barriers where streaming/pipeline readiness suffices; do not parallelize writes with unknown conflicts or without mutation-side fencing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:126-143]
- Do not use graph-only retrieval for simple lookup, and do not build an extracted knowledge graph where curated links/exact identifiers already solve identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-195]
- Do not grant autonomous gates authority over irreversible production writes regardless of confidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:147-180]
- Do not let dynamic topology expand capabilities, data access, budgets, or bypass gates. [INFERENCE: generation is planning, never authority]
- Do not adopt graphs for novelty or visual neatness. Require two independent jobs or a real branch/gate/subgraph need plus a measurable expected benefit and simpler fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:75-140]

## Staged Delivery Order

1. Shadow-emit `GraphDefinitionV1` and normalized traces from existing modes; legacy execution remains authoritative. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:123-169]
2. Execute pure deterministic nodes/reducers in the graph runtime and differential-test traces. [INFERENCE: smallest authority-free executable slice]
3. Add read-only fan-out with readiness modes and deterministic fan-in. [INFERENCE: adds width without external mutation]
4. Add write-set admission, isolation, fencing, and effect intents for parallel writes. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:124-156]
5. Add typed eval edges, certificates, durable human gates, and effect recovery. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/spec.md:82-123]
6. Add mode-specific typed subgraphs and independent convergence. [INFERENCE: composes proven primitives before dynamic generation]
7. Add organization-governed work-graph generation and append-only topology patches. [INFERENCE: highest topology risk follows compiler/parity maturity]
8. Add hybrid knowledge/evidence routing as a non-authoritative projection. [INFERENCE: retrieval stays downstream of the control authority]
9. Cut over mode by mode only after golden-trace parity, negative controls, rollback drill, cost/latency baseline, effect recovery, and acceptance certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:50-145]

## Terminal Audit and Remaining Evidence

All eight prioritized angles are resolved at design-decision level, and all 12 supplied posts were used as concepts/boundaries alongside AgentSwarms code, current runtime sources, and 036 authority contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:35-180]

No further document-only iteration can prove the graph runtime improves quality, cost, or latency. The next evidence class is a shadow prototype with golden traces and measured baselines. Until those checks pass, the decisions above are an implementation design—not a cutover certificate. [INFERENCE: terminal adversarial audit identifies measurement, not more synthesis, as the remaining confirmation path]

## Convergence Report

- Stop reason: `maxIterationsReached` after exactly 20 iterations; pre-cap convergence signals were treated as telemetry as required. [SOURCE: deep-research-config.json]
- Question coverage: 8/8 prioritized angles resolved at extractable design-decision level. [SOURCE: findings-registry.json]
- Final novelty telemetry: 0.31 on iteration 20; the declining trend reflects integration/audit, not permission to stop early. [SOURCE: deltas/iter-020.jsonl]
- Residual implementation questions: schema field naming, compiler language/module placement, and initial shadow fixture selection. These require scoped implementation planning and runtime measurements, not additional corpus review. [INFERENCE: design boundaries are stable while concrete implementation placement remains intentionally unselected]
