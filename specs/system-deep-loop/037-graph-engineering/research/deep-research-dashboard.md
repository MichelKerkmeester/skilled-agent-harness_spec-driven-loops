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
- Topic: Current status of the system-deep-loop system and what the 036-deep-loop-innovation changes introduce; how to evolve deep-loop workflows into graph-engineering-based loops aligned with the GraphARC and graph-engineering-master repositories and the LangChain graph concepts
- Started: 2026-08-08T12:02:10.087Z
- Status: INITIALIZED
- Iteration: 18 of 20
- Session ID: 27ce8e25-71b5-4732-bbf1-f6acf6bbebb4
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: current system-deep-loop status -- inventory live modes, runtime subsystems (convergence, state, fan-out, loop-lock), and graph-metadata/mode-registry wiring; identify what is landed vs stale. | architecture | 0.94 | 8 | complete |
| 2 | Q2: trace the 036 evidence-ledger spine and migration model; establish landing status of phases 001-017 and remediation tree 018-050; identify the 014 cutover blockers F001/F002/F005. | migration-readiness | 0.85 | 7 | complete |
| 3 | Q3: core graph-engineering concepts and patterns in the reference corpus — state graphs, nodes/edges, conditional routing, subgraphs, checkpointing, when-to-use/when-not-to-use | graph-engineering-concepts | 0.88 | 8 | complete |
| 4 | Q4: practical graph workflow implementations and the LangGraph model | practical-implementations | 0.93 | 6 | complete |
| 5 | Q5 part 1: map deep-loop concepts onto graph primitives | target-architecture | 0.92 | 6 | complete |
| 6 | Q5 part 2: first-mode graph adapter contract and shadow-parity gates | target-architecture | 0.86 | 7 | complete |
| 7 | Q1/Q2 reconciliation: verify runtime status and 036 phase census | status-reconciliation | 0.90 | 5 | complete |
| 8 | GraphARC internals deep verification: planner admission/materialization, state, traces, budgets, tests, and the governance-wrapper boundary over the graph runtime. | grapharc-internals | 0.86 | 7 | complete |
| 9 | Runtime census + 036 phase ownership: live loop-lock/fanout/validator wiring, coverage-graph upsert and reducer boundaries, and canonical ownership/status for 034 and 036-046. | runtime-census | 0.83 | 6 | complete |
| 10 | Corpus completion: graph-engineering-master delivery and article synthesis | corpus-completion | 0.74 | 7 | complete |
| 11 | Deep alignment: map the 036 evidence-ledger spine onto graph-engineering semantics | deep-alignment | 0.74 | 7 | complete |
| 12 | Adapter/replay fixture + parity gates + 024 append-boundary fencing verification | adapter-replay-parity | 0.80 | 5 | complete |
| 13 | Convergence as graph analysis: compare coverage-graph convergence with the inline three-signal vote and define graph termination and replay conditions. | convergence-graph-analysis | 0.80 | 5 | complete |
| 14 | Fan-out and lineage as graph branches | fanout-lineage | 0.80 | 5 | complete |
| 15 | Fan-in verification + replay semantics: fanout-merge.cjs ordering, conflict/provenance behavior, registry/state boundaries, DB-independent branch-to-join replay | fan-in-replay | 0.90 | 5 | complete |
| 16 | Cross-check and independent verification of the 014 cutover blockers, graph-engineering-master implementation boundary, and hybrid loop-plus-graph recommendation | independent-verification | 0.45 | 5 | timeout |
| 17 | When-not-to-use validation + direct residual verification (identityResolver, F005 loop-lock window, graph-engineering-master inventory) | when-not-to-use-and-residual-verification | 0.90 | 6 | complete |
| 18 | Migration path and sequencing: staged research-mode graph adapter, shadow parity, per-mode cutover, rollback gates, and later convergence-graph enrichment | migration-sequencing | 0.90 | 5 | complete |

- iterationsCompleted: 18
- keyFindings: 111
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: What is the current status of the system-deep-loop system — which modes, runtime subsystems, convergence and state machinery are live and landed, and where is the authority cutover blocked? [legacy-import]
- [ ] Q2: What does the 036-deep-loop-innovation program change — what is the evidence-ledger spine, what is the migration model, and what is the landing status of its phases? [legacy-import]
- [ ] Q3: What are the core graph-engineering concepts and patterns in the reference corpus (GraphARC, graph-engineering-master, LangChain, and the article set) — state graphs, nodes/edges, conditional routing, subgraphs, checkpointing, when-to-use/when-not-to-use? [legacy-import]
- [ ] Q4: How do the GitHub reference implementations structure graph-based agent workflows in practice (architecture, node contracts, state flow, tooling), and what is LangChain's graph model contribution? [legacy-import]
- [ ] Q5: What would a graph-engineering-based deep-loop architecture look like aligned with OUR system — mapping our modes, convergence, evidence-ledger concepts onto graph primitives, with a concrete transformation path? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: What is the current status of the system-deep-loop system — which modes, runtime subsystems, convergence and state machinery are live and landed, and where is the authority cutover blocked?
- [ ] Q2: What does the 036-deep-loop-innovation program change — what is the evidence-ledger spine, what is the migration model, and what is the landing status of its phases?
- [ ] Q3: What are the core graph-engineering concepts and patterns in the reference corpus (GraphARC, graph-engineering-master, LangChain, and the article set) — state graphs, nodes/edges, conditional routing, subgraphs, checkpointing, when-to-use/when-not-to-use?
- [ ] Q4: How do the GitHub reference implementations structure graph-based agent workflows in practice (architecture, node contracts, state flow, tooling), and what is LangChain's graph model contribution?
- [ ] Q5: What would a graph-engineering-based deep-loop architecture look like aligned with OUR system — mapping our modes, convergence, evidence-ledger concepts onto graph primitives, with a concrete transformation path?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇██▇▇▇▇▆▅▅▆▆▆▇▅▂▇▇
- score sparkline: █▇▇██▇▇▇▇▆▅▅▆▆▆▇▅▂▇▇
- Last 3 ratios: 0.45 -> 0.90 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":147,"docs.langchain.com":4,"langchain-ai.github.io":1,"other":64,"raw.githubusercontent.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treating `workflowMode` as the runtime convergence key was ruled out: the hub and registry require explicit `runtimeLoopType`, including load-bearing nulls for custom backends. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70-81; .opencode/skills/system-deep-loop/mode-registry.json:44-64] (iteration 1)
- Treating existing coverage-graph upsert as a workflow state-graph migration was ruled out; the inspected contract is node/edge persistence and validation, while control execution remains in convergence/fan-out entrypoints. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: compared with .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70 and fanout-run.cjs:1-38] (iteration 1)
- The legacy LangGraph documentation URL (`https://langchain-ai.github.io/langgraph/concepts/low_level/`) returned no usable body in this run. Current official docs and the official raw source provided a successful fallback, so the iteration remains complete. (iteration 4)
- Treating GraphARC's dynamic `Command`/`Send` capability as permissionless model branching; its admission gate is a required control boundary. (iteration 4)
- Treating LangGraph's `compile()` plus checkpointer as equivalent to an append-only evidence ledger or replayable why-audit; the official docs describe state persistence, while traces carry execution rationale. (iteration 4)
- Treating the graph-engineering-master README/WORKFLOWS as proof of an executable local implementation when the packet's `graph-engineering/` inventory is empty. (iteration 4)
- A big-bang graph replacement is incompatible with the documented additive-dark and rollback-window migration sequence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] (iteration 6)
- A database-first adapter is blocked by the recorded native-module mismatch and would conflate projection availability with adapter correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence/upsert skipped events] (iteration 6)
- Allowing graph convergence to stop before legacy convergence and quality/parity gates agree. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240 and the 036 cutover sequence] (iteration 6)
- Starting with AI council, alignment, or improvement as if they shared the research packet contract; the registry assigns them distinct artifact or backend boundaries. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:65-190] (iteration 6)
- Starting with review while its named deep-review parity gap remains unresolved; this would make the first parity oracle weaker than research. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83] (iteration 6)
- Treating the coverage-graph database or a graph checkpointer as the authority ledger or as proof of control-plane migration. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] (iteration 6)
- Treating `forward_args=True` as governed argument validation; materializer documentation explicitly leaves those args unchecked. (iteration 8)
- Treating admission as execution; the checker never calls node factories and only records a decision. (iteration 8)
- Treating GraphARC checkpoint/state APIs or trace replay as the append-only evidence-ledger authority. (iteration 8)
- Reopening the already-blocked big-bang/database-first migration directions; the additive-dark, shadow-parity, and rollback-window sequence remains the supported path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_upsert_skipped events] (iteration 11)
- Sharing mutable authoritative state across blinded/counterfactual branches before gateway-mediated adjudication. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] (iteration 11)
- Treating a LangGraph checkpointer, GraphARC state object, coverage graph, or OTel export as the 036 append-only authority ledger. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/persistence] (iteration 11)
- Treating conditional routing or model-generated dynamic edges as permissionless transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160] (iteration 11)
- Allowing a graph adapter to call a direct append mutator or to become authoritative before the gateway and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,153-158] (iteration 12)
- Making graph-database availability a prerequisite for adapter correctness or parity; prior state records already show graph convergence/upsert skipped on the native-module mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events] (iteration 12)
- Treating the 024 positive handover as proof of current runtime behavior; it is contradicted by the 036 code-verification section and the 024 decision-record correction. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” section] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408] (iteration 12)
- Live graph execution was not attempted after the packet's prior native-module failure; static runtime analysis was the productive fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] (iteration 13)
- Making graph-database availability a prerequisite for adapter correctness or shadow parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] (iteration 13)
- Treating a LangGraph checkpointer as the append-only evidence ledger or complete why-audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md] (iteration 13)
- Treating the graph score as a replacement for the inline vote or its `newInfoRatio` semantics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689] (iteration 13)
- Exact `fanout-merge.cjs` conflict-order semantics were not freshly verified in this bounded pass; do not promote an implementation claim about merge ordering until that file is read directly. (iteration 14)
- Reopening live graph-database execution or database-first migration; prior packet state records the native-module failure and strategy marks that direction blocked. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events] (iteration 14)
- Sharing mutable authoritative packet state across branches before a validated fan-in; this would weaken the existing lineage write boundary. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] (iteration 14)
- The initial broad recursive search for the pivot symbol exceeded the command timeout. A direct `find` over `.opencode` and file-scoped `grep` recovered the canonical research adapter path without retrying the same broad search. (iteration 14)
- Treating candidate preparation or seat output as authoritative focus mutation; the adapter returns preparation input and imports the separate divergent-pivot mechanics contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442] (iteration 14)
- Treating rejected `wave`, `depends_on`, or `touches` metadata as if it already formed a graph scheduler; the runner explicitly falls back to `flat_pool`. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432] (iteration 14)
- Making coverage-graph DB availability a prerequisite for fan-in correctness or replay parity. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: based on separate graph-convergence and filesystem fan-in commands]] (iteration 15)
- None newly introduced. The prior iteration's direct-read gap for `fanout-merge.cjs` was resolved; the previously blocked database-first/live-graph path was not retried. (iteration 15)
- Treating input/arrival order as the canonical merge order; the implementation sorts content, IDs, labels, and final output arrays. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362`] (iteration 15)
- Treating the merged registry as a rewriteable substitute for lineage state logs or append-only deltas. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1096-1127,1149-1169`; [INFERENCE: based on read-only state consumption and registry-only output writes]] (iteration 15)
- Graphing every mode and every leaf file operation; the corpus and workflow branch explicitly support simpler loops for low-branching work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159] (iteration 17)
- Treating `dist/graph-engineering.skill` as proof that `graph-engineering/` contains runnable implementation modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [INFERENCE: based on the empty source-tree inventory] (iteration 17)
- Any graph adapter write or early stop that bypasses the gateway, legacy convergence, or the 014 cutover certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3,6] (iteration 18)
- Big-bang graph replacement before additive-dark and rollback-window evidence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] (iteration 18)
- Database-first adapter or graph-database-gated parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] (iteration 18)

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
Obtain an owner-approved manifest, deprecation record, or merge record for 034 and 036-046.

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
