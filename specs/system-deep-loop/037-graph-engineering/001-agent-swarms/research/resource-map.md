# Resource Map

## Orientation and Current Runtime

- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md` — mandatory evidence hierarchy, current-state map, and eight research angles.
- `.opencode/skills/system-deep-loop/mode-registry.json` — current modes, owners, backends, and capability diversity.
- `.opencode/commands/deep/assets/deep-research-auto.yaml` — current sequential outer loop, lifecycle, reducer, convergence, and synthesis workflow.
- `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` — evidence/coverage convergence projection.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — detached flat fan-out and current rejection of unsafe dependency waves.
- `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md` — runtime parity invariants.

## AgentSwarms Reference

- `src/lib/swarmGraph.ts` — graph types, reducer algebra, topology, skip propagation, branch and retry safety.
- `src/lib/swarmRuntime.ts` — browser-like executor, routers, loops, nested swarms, evaluation, retries, approvals, and scheduling.
- `src/utils/swarmExecute.server.ts` — headless scheduling, checkpoints, resume, deadlines, and runtime differences.
- `src/lib/swarmCheckpoint.ts` and `src/utils/swarmCheckpoint.server.ts` — checkpoint schema and best-effort persistence boundary.
- `src/lib/swarmPublish.ts` — editable draft versus pinned published graph.
- `src/lib/evalScoring.ts` and `src/lib/swarmTemplates.ts` — deterministic/judge evals and eval→condition→approval flow.
- `tests/unit/swarmExecutorParity.test.ts` — current parity checks and their source-shape boundary.
- `supabase/migrations/20260724100000_swarm_approvals_and_runs.sql` — routed approvals, decision identity, and cancellation.
- `src/lib/kbRag.ts` and `src/utils/tools/kb-graph.server.ts` — lexical/vector fusion and bounded graph traversal.

## 036 Authority Plane

- `specs/system-deep-loop/036-deep-loop-innovation/spec.md` and `handover.md` — authority architecture, migration sequencing, and current cutover boundary.
- `006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md` — typed ledger event identity.
- `007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md` — durable effect intents, confirmations, and recovery.
- `007-shared-evidence-and-control-services/003-blinded-and-counterfactual-adjudication/spec.md` — independent gate authority.
- `007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md` — nested budget authority.
- `007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md` — ownership and stale-writer rejection.
- `008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md` — shadow comparison and rollback gates.
- `012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md` — write-set conflict and wave safety.
- `025-artifact-certificate-binding/spec.md` — semantic certificate binding.

## Blog Corpus — All 12 Posts

1. `Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md` — deterministic-first gates, judge bias, trajectory eval, negative controls, blast radius, shadow launch.
2. `From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md` — graph adoption method and vector/graph routing.
3. `Graph Engineering Roadmap.md` — nodes/edges, diamonds, barriers/pipelines, cycles, convergence, and topology economics.
4. `Graph Engineering explained: what it is, when to use it and when not to.md` — fake-edge test, deterministic joins, anchors, and rejection boundaries.
5. `Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md` — graph retrieval, provenance, entity resolution, maintenance, and graph limitations.
6. `Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md` — practical fan-out, independent verification, costs, and when graphs are wrong.
7. `Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md` — stable organization graph versus dynamic work graph.
8. `Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md` — harness/graph/loop layering and selection boundaries.
9. `How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md` — builder/judge/manager separation and grounded stopping.
10. `How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md` — topology review, budget caps, model tiering, state, and operational debugging.
11. `LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md` — layer hierarchy and complete pipeline framing.
12. `What is Graph Engineering.md` — typed edges, temporal supersession, entity resolution, hybrid lazy graph retrieval.

## Evidence Use Rule

Repository code and 036 contracts support implementation/authority claims. Blog posts support concepts, hypotheses, and when-not-to-use boundaries. The orientation seed governs conflicts and prevents corpus claims from overriding observed runtime state.
