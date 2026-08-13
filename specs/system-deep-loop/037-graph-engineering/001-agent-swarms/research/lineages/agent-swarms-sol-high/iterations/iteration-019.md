# Iteration 19: Integrated Graph-Based Deep-Loop Architecture

## Focus

This pass assembles the prior mechanisms into a buildable boundary map while convergence remains telemetry until iteration 20.

## Findings

1. Decision stack, from authority outward: 036 ledger/gateway/effects/fences/budgets → versioned graph IR/compiler → deterministic scheduler/reducers → adapter capability layer → typed loop subgraphs/gates → trace/evidence projections → knowledge retrieval. Higher layers never write around lower authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:126-170]
2. Extractable contract set: `OrganizationGraphV1`, `WorkGraphProposalV1`, `GraphDefinitionV1`, `NodeSpecV1`, `EdgeSpecV1`, `PortSpecV1`, `ReducerSpecV1`, `WavePlanV1`, `LoopSubgraphSpecV1`, `GateVerdictV1`, `HumanGateOpenedV1`, `GraphCheckpointV1`, `EffectIntentV1`, `TraceEnvelopeV1`, `EvidenceClaimV1`, and `KnowledgeAssertionV1`. [INFERENCE: consolidates the minimum independently versionable boundaries found across iterations 2–17]
3. Runtime flow: classify/justify → propose topology → compile and seal → obtain 036 run authorization → schedule ready nodes/waves → authorize every transition/effect → commit ledger events → update disposable projections → evaluate structural gates → publish certified terminal outcome. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:45-103]
4. Separation rule: organization graph governs who may do work; work graph describes this run; execution graph is the sealed compiled plan; ledger is history/authority; checkpoint is acceleration; evidence graph explains claims/decisions; knowledge graph supports retrieval. None is interchangeable. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170]
5. Implementation dependency order: IR + compiler + golden traces; pure deterministic scheduler; projection/replay; read-only adapters; write-set/fenced waves; typed eval edges; effects/human gates; subgraph profiles; generated work graphs; hybrid retrieval. This order keeps each authority expansion behind observable parity. [INFERENCE: minimizes blast radius and makes every stage independently reversible]
6. The public graph API must expose typed contracts and certificates, not backend/provider names. CLI, native, browser-like, headless, and fan-out surfaces become adapters that either satisfy the same capability profile or reject the graph. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md:19-86]

## Ruled Out

- Multiple competing state authorities; graph engine coupled to one executor; knowledge retrieval controlling transitions.

## Assessment

- New information ratio: 0.57
- Novelty: produces the full contract inventory, authority stack, runtime flow, and implementation order.
- Questions addressed/answered: integration of all eight orientation angles.

## Recommended Next Focus

Run an adversarial coverage audit, resolve residual conflicts, and freeze final decisions.
