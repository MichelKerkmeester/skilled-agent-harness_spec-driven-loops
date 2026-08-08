---
title: Deep Research Strategy - Graph-Engineering-Based Deep Loops
description: Runtime strategy for the 20-iteration deep research session on current deep-loop status, 036-deep-loop-innovation changes, and graph-engineering-based loop evolution (037-graph-engineering).
trigger_phrases:
  - "graph engineering deep loop"
  - "deep loop status"
  - "036 deep loop innovation"
  - "GraphARC"
  - "LangChain graphs"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the deep research session on evolving our system-deep-loop workflows into graph-engineering-based loops. Read by the orchestrator and leaf agents at every iteration.

### Usage
- **Init:** Orchestrator populates Topic, Key Questions, Known Context, and Research Boundaries from config and bounded context snapshot.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** Mutable; analyst-owned sections stable, machine-owned sections rewritten by the reducer.

---

## 2. TOPIC
Current status of the system-deep-loop system and what the 036-deep-loop-innovation changes introduce; how to evolve deep-loop workflows into graph-engineering-based loops aligned with the GraphARC and graph-engineering-master repositories and the LangChain graph concepts.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What is the current status of the system-deep-loop system — which modes, runtime subsystems, convergence and state machinery are live and landed, and where is the authority cutover blocked?
- [ ] Q2: What does the 036-deep-loop-innovation program change — what is the evidence-ledger spine, what is the migration model, and what is the landing status of its phases?
- [ ] Q3: What are the core graph-engineering concepts and patterns in the reference corpus (GraphARC, graph-engineering-master, LangChain, and the article set) — state graphs, nodes/edges, conditional routing, subgraphs, checkpointing, when-to-use/when-not-to-use?
- [ ] Q4: How do the GitHub reference implementations structure graph-based agent workflows in practice (architecture, node contracts, state flow, tooling), and what is LangChain's graph model contribution?
- [ ] Q5: What would a graph-engineering-based deep-loop architecture look like aligned with OUR system — mapping our modes, convergence, evidence-ledger concepts onto graph primitives, with a concrete transformation path?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- NOT implementing or modifying system-deep-loop code (research only; implementation is a follow-up plan).
- NOT reviewing the correctness of individual 036 phases in detail (status-level assessment only).
- NOT a general survey of every agent-graph framework (scoped to the supplied corpus + verified sources).
- NOT making changes to the 036 packet (read-only subject).

---

## 5. STOP CONDITIONS
- 20 iterations completed (maxIterations cap, stop-policy=max-iterations; convergence is telemetry only).
- 3 consecutive stuck iterations with no productive path (stuck recovery).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the hub/registry alongside runtime entrypoints and the 036 handover separated current landed behavior from historical rationale and stale metadata labels. (iteration 1)
- Reading the dated handover beside the parent phase map separated landed code from stale metadata and exposed the two different blocker vocabularies (phase blockers versus 033 preconditions). (iteration 2)
- reading executable GraphARC contracts beside the two graph-engineering articles separated durable node semantics from persuasive terminology and exposed concrete admission, routing, fan-out, convergence, and checkpoint boundaries. (iteration 3)
- reading GraphARC's kernel and planner/materializer together exposed the actual contract boundary, while official docs plus raw source separated LangGraph primitives from GraphARC policy additions. (iteration 4)
- reading the mode discriminator, GraphARC boundary contracts, and the 036 migration sequence together exposed which concerns are graph topology and which are authority/audit concerns. (iteration 5)
- combining the prior mapping with the concrete convergence, fan-out, upsert, and 036 authority contracts made the proposed adapter testable without pretending that current graph metadata is workflow control. (iteration 6)
- comparing the registry, graph metadata, runtime validator, and filesystem census against the dated handover separated authority, projection, and landing claims instead of treating one status source as canonical. (iteration 7)
- reading admission and materialization together exposed the exact authority seam; line-indexing tests connected prose guarantees to executable checks. (iteration 8)
- reading the workflow algorithm beside the runtime implementation made the graph veto boundary and the inline vote's independent semantics explicit; iteration 004 supplied the checkpoint-versus-trace distinction needed for replay design. (iteration 13)
- narrow file-scoped searches plus contiguous source ranges exposed the branch contract, write boundary, executor matrix, and pivot frontier without rereading the already-saturated graph-database path. (iteration 14)
- reading the merge implementation's pure helpers and main output path together with the synthesis YAML made the ordering, provenance, and non-rewrite guarantees directly verifiable instead of inferred from the fan-out runner. (iteration 15)
- narrow corpus search exposed the exact F001/F002/F005 wording and the conflict between child landing labels and residual cutover gates. (iteration 16)
- narrow file-scoped reads exposed the exact optional gateway branch, the unsafe fresh-lock write sequence, and the distinction between packaged and executable graph-engineering artifacts. (iteration 17)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the graph-metadata file itself was not read before the 12-call budget was exhausted; only the hub's one-file invariant could be reported. (iteration 1)
- The bounded status census did not expose canonical direct status rows for 034/036-046, so those phases cannot be classified from this iteration. (iteration 2)
- the direct LangChain evidence path failed because the packet-local LangChain.md file is empty; no replacement source was available within the bounded local corpus action. (iteration 3)
- the packet-local LangChain file and legacy docs URL supplied no direct content; both were unavailable rather than silently treated as evidence. (iteration 4)
- a full reread of the large fan-out implementation was not possible within the bounded tool budget; the current fan-out mapping therefore relies on the inspected entrypoint plus prior packet evidence. (iteration 5)
- the bounded tool budget prevented an additional read of the deep-research workflow asset; the contract is consequently grounded in the already-verified packet/state and runtime sources rather than that orchestration YAML. (iteration 6)
- the per-iteration tool ceiling stopped direct rereads of loop-lock, fan-out, and upsert after the convergence/validator/reducer reads; those claims therefore retain partial-success status and prior citations. (iteration 7)
- no fresh benchmark execution or web retrieval was necessary within the bounded pass, so production parity and an updated LangGraph source snapshot remain indirect. (iteration 8)
- no live graph decision or parity run was possible because the packet records the native database module mismatch. (iteration 13)
- a repository-wide recursive grep timed out before producing evidence; the broad search traversed unrelated phase material instead of the known runtime directory. (iteration 14)
- no executable multi-lineage fixture was run in this bounded research iteration; source evidence established the contract but not runtime parity under shuffled or damaged inputs. (iteration 15)
- broad runtime search consumed the bounded tool budget; direct implementation and `dist/` verification therefore did not run. (iteration 16)
- the final combined grep exited 141 because `head` closed the pipe; it did not erase the required matches, but it prevents treating the command as a clean validation run. (iteration 17)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A big-bang graph replacement is incompatible with the documented additive-dark and rollback-window migration sequence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A big-bang graph replacement is incompatible with the documented additive-dark and rollback-window migration sequence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A big-bang graph replacement is incompatible with the documented additive-dark and rollback-window migration sequence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]

### A database-first adapter is blocked by the recorded native-module mismatch and would conflate projection availability with adapter correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence/upsert skipped events] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A database-first adapter is blocked by the recorded native-module mismatch and would conflate projection availability with adapter correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence/upsert skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A database-first adapter is blocked by the recorded native-module mismatch and would conflate projection availability with adapter correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence/upsert skipped events]

### Allowing a graph adapter to call a direct append mutator or to become authoritative before the gateway and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,153-158] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Allowing a graph adapter to call a direct append mutator or to become authoritative before the gateway and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,153-158]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing a graph adapter to call a direct append mutator or to become authoritative before the gateway and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,153-158]

### Allowing graph convergence to stop before legacy convergence and quality/parity gates agree. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240 and the 036 cutover sequence] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Allowing graph convergence to stop before legacy convergence and quality/parity gates agree. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240 and the 036 cutover sequence]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing graph convergence to stop before legacy convergence and quality/parity gates agree. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240 and the 036 cutover sequence]

### Any graph adapter write or early stop that bypasses the gateway, legacy convergence, or the 014 cutover certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3,6] -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Any graph adapter write or early stop that bypasses the gateway, legacy convergence, or the 014 cutover certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3,6]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any graph adapter write or early stop that bypasses the gateway, legacy convergence, or the 014 cutover certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3,6]

### Big-bang graph replacement before additive-dark and rollback-window evidence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Big-bang graph replacement before additive-dark and rollback-window evidence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Big-bang graph replacement before additive-dark and rollback-window evidence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]

### Database-first adapter or graph-database-gated parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Database-first adapter or graph-database-gated parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Database-first adapter or graph-database-gated parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]

### Exact `fanout-merge.cjs` conflict-order semantics were not freshly verified in this bounded pass; do not promote an implementation claim about merge ordering until that file is read directly. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Exact `fanout-merge.cjs` conflict-order semantics were not freshly verified in this bounded pass; do not promote an implementation claim about merge ordering until that file is read directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exact `fanout-merge.cjs` conflict-order semantics were not freshly verified in this bounded pass; do not promote an implementation claim about merge ordering until that file is read directly.

### Graphing every mode and every leaf file operation; the corpus and workflow branch explicitly support simpler loops for low-branching work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159] -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Graphing every mode and every leaf file operation; the corpus and workflow branch explicitly support simpler loops for low-branching work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graphing every mode and every leaf file operation; the corpus and workflow branch explicitly support simpler loops for low-branching work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159]

### Live graph execution was not attempted after the packet's prior native-module failure; static runtime analysis was the productive fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Live graph execution was not attempted after the packet's prior native-module failure; static runtime analysis was the productive fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live graph execution was not attempted after the packet's prior native-module failure; static runtime analysis was the productive fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]

### Making coverage-graph DB availability a prerequisite for fan-in correctness or replay parity. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: based on separate graph-convergence and filesystem fan-in commands]] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Making coverage-graph DB availability a prerequisite for fan-in correctness or replay parity. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: based on separate graph-convergence and filesystem fan-in commands]]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making coverage-graph DB availability a prerequisite for fan-in correctness or replay parity. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: based on separate graph-convergence and filesystem fan-in commands]]

### Making graph-database availability a prerequisite for adapter correctness or parity; prior state records already show graph convergence/upsert skipped on the native-module mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Making graph-database availability a prerequisite for adapter correctness or parity; prior state records already show graph convergence/upsert skipped on the native-module mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making graph-database availability a prerequisite for adapter correctness or parity; prior state records already show graph convergence/upsert skipped on the native-module mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]

### Making graph-database availability a prerequisite for adapter correctness or shadow parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Making graph-database availability a prerequisite for adapter correctness or shadow parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making graph-database availability a prerequisite for adapter correctness or shadow parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]

### None newly introduced. The prior iteration's direct-read gap for `fanout-merge.cjs` was resolved; the previously blocked database-first/live-graph path was not retried. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: None newly introduced. The prior iteration's direct-read gap for `fanout-merge.cjs` was resolved; the previously blocked database-first/live-graph path was not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly introduced. The prior iteration's direct-read gap for `fanout-merge.cjs` was resolved; the previously blocked database-first/live-graph path was not retried.

### Reopening live graph-database execution or database-first migration; prior packet state records the native-module failure and strategy marks that direction blocked. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Reopening live graph-database execution or database-first migration; prior packet state records the native-module failure and strategy marks that direction blocked. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening live graph-database execution or database-first migration; prior packet state records the native-module failure and strategy marks that direction blocked. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]

### Reopening the already-blocked big-bang/database-first migration directions; the additive-dark, shadow-parity, and rollback-window sequence remains the supported path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_upsert_skipped events] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Reopening the already-blocked big-bang/database-first migration directions; the additive-dark, shadow-parity, and rollback-window sequence remains the supported path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_upsert_skipped events]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening the already-blocked big-bang/database-first migration directions; the additive-dark, shadow-parity, and rollback-window sequence remains the supported path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_upsert_skipped events]

### Sharing mutable authoritative packet state across branches before a validated fan-in; this would weaken the existing lineage write boundary. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Sharing mutable authoritative packet state across branches before a validated fan-in; this would weaken the existing lineage write boundary. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sharing mutable authoritative packet state across branches before a validated fan-in; this would weaken the existing lineage write boundary. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]

### Sharing mutable authoritative state across blinded/counterfactual branches before gateway-mediated adjudication. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Sharing mutable authoritative state across blinded/counterfactual branches before gateway-mediated adjudication. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sharing mutable authoritative state across blinded/counterfactual branches before gateway-mediated adjudication. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]

### Starting with AI council, alignment, or improvement as if they shared the research packet contract; the registry assigns them distinct artifact or backend boundaries. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:65-190] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Starting with AI council, alignment, or improvement as if they shared the research packet contract; the registry assigns them distinct artifact or backend boundaries. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:65-190]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with AI council, alignment, or improvement as if they shared the research packet contract; the registry assigns them distinct artifact or backend boundaries. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:65-190]

### Starting with review while its named deep-review parity gap remains unresolved; this would make the first parity oracle weaker than research. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Starting with review while its named deep-review parity gap remains unresolved; this would make the first parity oracle weaker than research. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with review while its named deep-review parity gap remains unresolved; this would make the first parity oracle weaker than research. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83]

### The initial broad recursive search for the pivot symbol exceeded the command timeout. A direct `find` over `.opencode` and file-scoped `grep` recovered the canonical research adapter path without retrying the same broad search. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: The initial broad recursive search for the pivot symbol exceeded the command timeout. A direct `find` over `.opencode` and file-scoped `grep` recovered the canonical research adapter path without retrying the same broad search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The initial broad recursive search for the pivot symbol exceeded the command timeout. A direct `find` over `.opencode` and file-scoped `grep` recovered the canonical research adapter path without retrying the same broad search.

### The legacy LangGraph documentation URL (`https://langchain-ai.github.io/langgraph/concepts/low_level/`) returned no usable body in this run. Current official docs and the official raw source provided a successful fallback, so the iteration remains complete. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The legacy LangGraph documentation URL (`https://langchain-ai.github.io/langgraph/concepts/low_level/`) returned no usable body in this run. Current official docs and the official raw source provided a successful fallback, so the iteration remains complete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The legacy LangGraph documentation URL (`https://langchain-ai.github.io/langgraph/concepts/low_level/`) returned no usable body in this run. Current official docs and the official raw source provided a successful fallback, so the iteration remains complete.

### Treating `dist/graph-engineering.skill` as proof that `graph-engineering/` contains runnable implementation modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [INFERENCE: based on the empty source-tree inventory] -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Treating `dist/graph-engineering.skill` as proof that `graph-engineering/` contains runnable implementation modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [INFERENCE: based on the empty source-tree inventory]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `dist/graph-engineering.skill` as proof that `graph-engineering/` contains runnable implementation modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [INFERENCE: based on the empty source-tree inventory]

### Treating `forward_args=True` as governed argument validation; materializer documentation explicitly leaves those args unchecked. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `forward_args=True` as governed argument validation; materializer documentation explicitly leaves those args unchecked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `forward_args=True` as governed argument validation; materializer documentation explicitly leaves those args unchecked.

### Treating `workflowMode` as the runtime convergence key was ruled out: the hub and registry require explicit `runtimeLoopType`, including load-bearing nulls for custom backends. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70-81; .opencode/skills/system-deep-loop/mode-registry.json:44-64] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `workflowMode` as the runtime convergence key was ruled out: the hub and registry require explicit `runtimeLoopType`, including load-bearing nulls for custom backends. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70-81; .opencode/skills/system-deep-loop/mode-registry.json:44-64]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `workflowMode` as the runtime convergence key was ruled out: the hub and registry require explicit `runtimeLoopType`, including load-bearing nulls for custom backends. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70-81; .opencode/skills/system-deep-loop/mode-registry.json:44-64]

### Treating a LangGraph checkpointer as the append-only evidence ledger or complete why-audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating a LangGraph checkpointer as the append-only evidence ledger or complete why-audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a LangGraph checkpointer as the append-only evidence ledger or complete why-audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md]

### Treating a LangGraph checkpointer, GraphARC state object, coverage graph, or OTel export as the 036 append-only authority ledger. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/persistence] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating a LangGraph checkpointer, GraphARC state object, coverage graph, or OTel export as the 036 append-only authority ledger. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/persistence]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a LangGraph checkpointer, GraphARC state object, coverage graph, or OTel export as the 036 append-only authority ledger. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/persistence]

### Treating admission as execution; the checker never calls node factories and only records a decision. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating admission as execution; the checker never calls node factories and only records a decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating admission as execution; the checker never calls node factories and only records a decision.

### Treating candidate preparation or seat output as authoritative focus mutation; the adapter returns preparation input and imports the separate divergent-pivot mechanics contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating candidate preparation or seat output as authoritative focus mutation; the adapter returns preparation input and imports the separate divergent-pivot mechanics contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating candidate preparation or seat output as authoritative focus mutation; the adapter returns preparation input and imports the separate divergent-pivot mechanics contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442]

### Treating conditional routing or model-generated dynamic edges as permissionless transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating conditional routing or model-generated dynamic edges as permissionless transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating conditional routing or model-generated dynamic edges as permissionless transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160]

### Treating existing coverage-graph upsert as a workflow state-graph migration was ruled out; the inspected contract is node/edge persistence and validation, while control execution remains in convergence/fan-out entrypoints. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: compared with .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70 and fanout-run.cjs:1-38] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating existing coverage-graph upsert as a workflow state-graph migration was ruled out; the inspected contract is node/edge persistence and validation, while control execution remains in convergence/fan-out entrypoints. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: compared with .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70 and fanout-run.cjs:1-38]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating existing coverage-graph upsert as a workflow state-graph migration was ruled out; the inspected contract is node/edge persistence and validation, while control execution remains in convergence/fan-out entrypoints. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: compared with .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70 and fanout-run.cjs:1-38]

### Treating GraphARC checkpoint/state APIs or trace replay as the append-only evidence-ledger authority. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating GraphARC checkpoint/state APIs or trace replay as the append-only evidence-ledger authority.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating GraphARC checkpoint/state APIs or trace replay as the append-only evidence-ledger authority.

### Treating GraphARC's dynamic `Command`/`Send` capability as permissionless model branching; its admission gate is a required control boundary. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating GraphARC's dynamic `Command`/`Send` capability as permissionless model branching; its admission gate is a required control boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating GraphARC's dynamic `Command`/`Send` capability as permissionless model branching; its admission gate is a required control boundary.

### Treating input/arrival order as the canonical merge order; the implementation sorts content, IDs, labels, and final output arrays. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362`] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating input/arrival order as the canonical merge order; the implementation sorts content, IDs, labels, and final output arrays. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating input/arrival order as the canonical merge order; the implementation sorts content, IDs, labels, and final output arrays. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362`]

### Treating LangGraph's `compile()` plus checkpointer as equivalent to an append-only evidence ledger or replayable why-audit; the official docs describe state persistence, while traces carry execution rationale. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating LangGraph's `compile()` plus checkpointer as equivalent to an append-only evidence ledger or replayable why-audit; the official docs describe state persistence, while traces carry execution rationale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating LangGraph's `compile()` plus checkpointer as equivalent to an append-only evidence ledger or replayable why-audit; the official docs describe state persistence, while traces carry execution rationale.

### Treating rejected `wave`, `depends_on`, or `touches` metadata as if it already formed a graph scheduler; the runner explicitly falls back to `flat_pool`. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating rejected `wave`, `depends_on`, or `touches` metadata as if it already formed a graph scheduler; the runner explicitly falls back to `flat_pool`. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating rejected `wave`, `depends_on`, or `touches` metadata as if it already formed a graph scheduler; the runner explicitly falls back to `flat_pool`. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432]

### Treating the 024 positive handover as proof of current runtime behavior; it is contradicted by the 036 code-verification section and the 024 decision-record correction. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” section] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating the 024 positive handover as proof of current runtime behavior; it is contradicted by the 036 code-verification section and the 024 decision-record correction. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” section] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 024 positive handover as proof of current runtime behavior; it is contradicted by the 036 code-verification section and the 024 decision-record correction. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” section] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408]

### Treating the coverage-graph database or a graph checkpointer as the authority ledger or as proof of control-plane migration. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the coverage-graph database or a graph checkpointer as the authority ledger or as proof of control-plane migration. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the coverage-graph database or a graph checkpointer as the authority ledger or as proof of control-plane migration. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]

### Treating the graph score as a replacement for the inline vote or its `newInfoRatio` semantics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating the graph score as a replacement for the inline vote or its `newInfoRatio` semantics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the graph score as a replacement for the inline vote or its `newInfoRatio` semantics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689]

### Treating the graph-engineering-master README/WORKFLOWS as proof of an executable local implementation when the packet's `graph-engineering/` inventory is empty. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the graph-engineering-master README/WORKFLOWS as proof of an executable local implementation when the packet's `graph-engineering/` inventory is empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the graph-engineering-master README/WORKFLOWS as proof of an executable local implementation when the packet's `graph-engineering/` inventory is empty.

### Treating the merged registry as a rewriteable substitute for lineage state logs or append-only deltas. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1096-1127,1149-1169`; [INFERENCE: based on read-only state consumption and registry-only output writes]] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating the merged registry as a rewriteable substitute for lineage state logs or append-only deltas. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1096-1127,1149-1169`; [INFERENCE: based on read-only state consumption and registry-only output writes]]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the merged registry as a rewriteable substitute for lineage state logs or append-only deltas. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1096-1127,1149-1169`; [INFERENCE: based on read-only state consumption and registry-only output writes]]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q2: Verify the canonical status and ownership of 034 and 036-046 rather than inferring from the parent map. (iteration 2)
- Q1: Complete the current runtime status inventory. (iteration 2)
- Q3-Q5: Analyze the graph-engineering corpus, practical graph workflow implementations, and the target architecture for this system. (iteration 2)
- Q2: Verify canonical status and ownership of 034 and 036-046. (iteration 3)
- Q5: Turn the target mapping into a concrete migration path and gate sequence for system-deep-loop. (iteration 3)
- Q4: Verify direct LangGraph/LangChain APIs and compare them with GraphARC's wrapper boundary. (iteration 3)
- Q5: turn the comparison into a concrete graph-engineering migration and gate sequence for system-deep-loop. (iteration 4)
- Q2: verify canonical ownership/status for the remaining 036 phases. (iteration 4)
- Q1: reconcile the complete current system-deep-loop runtime inventory and authority boundary. (iteration 4)
- Q5 part 2: define the concrete graph adapter contract and gate-by-gate migration sequence for the first mode. (iteration 5)
- Q1/Q2: reconcile the complete current runtime inventory and canonical status/ownership of the remaining 036 phases. (iteration 5)
- Implement and exercise the adapter contract in a follow-up task; this iteration is research-only and contains no implementation change. (iteration 6)
- Determine the exact normalized reducer snapshot format and a deterministic replay harness once an implementation owner is assigned. (iteration 6)
- Q1/Q2: reconcile the complete current runtime inventory and canonical ownership/status of the remaining 036 phases. (iteration 6)
- Exact ownership/status documents for absent 034 and 036-046 remain unresolved; the smallest next evidence is an owner-approved phase manifest or explicit deprecation/merge record. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:PHASE DOCUMENTATION MAP] (iteration 7)
- Direct fresh verification of `loop-lock.cjs`, `fanout-run.cjs`, and `upsert.cjs` should be run when the tool budget permits; prior evidence establishes their runtime role but not this pass's fresh line-level inspection. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5-8] (iteration 7)
- Q5: an implementation follow-up still needs a deterministic adapter/replay fixture and measurable shadow-parity gates; this iteration intentionally made no code changes. (iteration 8)
- Q1/Q2: canonical ownership/status for absent 034 and 036-046 phase packets and the fresh loop-lock/fan-out/upsert runtime census remain outside this focus. (iteration 8)
- Does the lower portion of the live YAML invoke `verify-iteration.cjs` and `reduce-state.cjs` through explicit research artifact bindings, or only through generic post-dispatch/reducer orchestration? (iteration 9)
- When can the coverage graph DB be rebuilt with a compatible native module so projection parity can be tested without conflating DB availability with control-plane correctness? (iteration 9)
- What owner-approved manifest, deprecation record, or merge record canonically accounts for 036-046? (iteration 9)
- Q5 still needs an implementation-owned adapter/replay fixture and measurable shadow-parity gates; this iteration did not modify code. (iteration 10)
- Article-reported benchmark figures need independent source/experiment verification before use as acceptance thresholds. (iteration 10)
- Canonical owner-approved status, deprecation, or merge evidence for 034 and 036–046 remains unresolved. (iteration 10)
- A direct local LangChain article/source snapshot is still absent; prior official-source findings should remain the authority for LangGraph API details. (iteration 10)
- The packet-local LangChain article body remains absent; official LangGraph documentation remains the source of truth for API claims. (iteration 11)
- An implementation-owned first-mode adapter still needs a deterministic replay fixture, receipt/fingerprint contract, and measurable shadow-parity gates. (iteration 11)
- The supplied GraphARC session path needs a corrected path or owner confirmation before session-lifecycle mapping is claimed. (iteration 11)
- Canonical ownership/status of 034 and 036-046 remains outside this focus. (iteration 12)
- An implementation owner must build and execute the fixture, independent reducer oracle, gate dashboard, and negative fence tests; this iteration intentionally did not modify runtime code. (iteration 12)
- Exact canonical reducer snapshot serialization and production convergence parity remain unexecuted; the graph database remains optional telemetry and must not gate the shadow result. (iteration 12)
- The complete ~109-file 024 caller migration and current branch-level test evidence still require a fresh build/verification pass. (iteration 12)
- The implementation owner still needs to build and execute the deterministic adapter/replay fixture, including graph-off and database-unavailable parity cases. (iteration 13)
- The complete 024 caller migration evidence and owner-approved accounting for 034 and 036-046 remain outside this focus. (iteration 13)
- Canonical reducer snapshot serialization and production convergence parity remain unexecuted. (iteration 13)
- Branch-to-join replay and fanout-merge ordering remain to be verified (see state record). (iteration 14)
- The complete 024 caller-migration verification and owner-approved accounting for 034 and 036-046 remain outside this focus. (iteration 15)
- An implementation owner still needs to execute a small deterministic replay fixture with two or more lineages, same-content duplicates, same-ID conflicts, missing registries, salvaged findings, and shuffled input order. (iteration 15)
- Canonical reducer snapshot serialization and production parity remain unexecuted; graph-database unavailability must be covered as a graph-off fixture case. (iteration 15)
- Determine and record explicit reducer-valid `CONTRADICTS` edges between iteration claims after those source checks. (iteration 16)
- Read the actual runtime gateway, policy registry, loop-lock, append/fencing, and parity harness implementations at line level; reconcile child “landed” claims with live behavior. (iteration 16)
- Directly inventory graph-engineering-master `dist/` and `graph-engineering/`, then read WORKFLOWS.md against that inventory. (iteration 16)
- Search the supplied article corpus for a concrete full-graph-replacement argument and test whether it contradicts the authority-preserving hybrid recommendation. (iteration 16)
- No prior finding was overturned in this pass, so no `CONTRADICTS` or `SUPERSEDES` graph edge is emitted; the `dist` result narrows the inventory-gap wording. (iteration 17)
- Direct runtime fixture execution and shadow-parity evidence remain unrun; static source checks do not prove production behavior under malformed or concurrent inputs. (iteration 17)
- F005 is not cleared until fresh acquisition no longer exposes a readable partial target (or readers fail closed with an owner-approved protocol and tests). (iteration 17)
- F001 is not cleared until an owner-approved production construction path supplies a non-optional identity resolver and its negative tests. (iteration 17)
- Canonical owner-approved accounting for 034 and 036-046 remains unresolved. (iteration 17)
- Build and execute the deterministic research-mode fixture, including graph-off, malformed-event, partial-success, contradiction, and replay cases; compare the independent reducer and convergence oracles. (iteration 18)
- Restore a compatible coverage-graph database only for later enrichment validation; do not make it a Phase A/B prerequisite. (iteration 18)
- Freshly build and verify 024's gateway-only fence and its broad caller migration, including negative tests for stale/superseded writers. (iteration 18)
- Obtain an owner-approved manifest, deprecation record, or merge record for 034 and 036-046. (iteration 18)
- Execute the deterministic research-mode fixture, independent reducer oracle, malformed-event/partial-success/contradiction cases, and replay/shadow-parity comparison. (iteration 19)
- Supply a real graph-engineering implementation or explicitly approve a reference-only dependency, and capture a vetted LangGraph source snapshot. (iteration 19)
- Obtain the owner-approved manifest, merge, or deprecation record for 034 and 036-046. (iteration 19)
- Restore a compatible coverage-graph database only for optional projection/enrichment validation. (iteration 19)
- Build and independently verify 024 fencing, production F001 resolver construction, and F005 fresh-lock publication. (iteration 19)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Build and independently verify 024 fencing, production F001 resolver construction, and F005 fresh-lock publication.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

Pointer-based snapshot captured at init (2026-08-08). Research subjects are READ-ONLY.

- Source pointers (local):
  - `specs/system-deep-loop/036-deep-loop-innovation/spec.md` -- phase-parent spec: 178 recommendations converging on evidence-ledger spine (append-only typed event ledger + fail-closed transition-authorization gateway + sealed artifacts + replay fingerprints + receipts + blinded adjudication), landed additive+dark, per-mode authority cutover, legacy retirement.
  - `specs/system-deep-loop/036-deep-loop-innovation/handover.md` -- 2026-08-08 status: substrate (001-013) built/landed; remediation WS1 (018-033) in progress; 014 authority cutover BLOCKED + operator-gated (preconditions F001/F002/F005); completion_pct 95; deepseek provider BANNED for this epic.
  - `specs/system-deep-loop/036-deep-loop-innovation/goal.md`, `execution-sequencing-strategy.md`, `before-and-after.md`, `033-dispositions.md`.
  - `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/` -- repo: CHANGELOG, ROADMAP, docs/, grapharc/ package, bench/, tests/.
  - `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/` -- repo: README, WORKFLOWS.md, dist/, graph-engineering/.
  - `specs/system-deep-loop/037-graph-engineering/context/*.md` -- 5 articles: "From Loops to Graphs: The Next Paradigm in AI Agent Engineering", "Graph Engineering explained: what it is, when to use it and when not to", "Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs", "LangChain", "What is Graph Engineering?".
  - `.opencode/skills/system-deep-loop/SKILL.md` + `mode-registry.json` -- hub with 7 workflow modes (research/review/ai-council/alignment + 3 improvement lanes), runtimeLoopType/backendKind discriminator, frozen `runtime/` backend.
  - `.opencode/commands/deep/*.md` + `assets/deep-research-auto.yaml` -- command surface owning state/dispatch/convergence/synthesis.
- Reuse candidates: `runtime/scripts/convergence.cjs`, `loop-lock.cjs`, `fanout-run.cjs`, `upsert.cjs` (coverage-graph), `deep-research/scripts/reduce-state.cjs`; coverage-graph node/edge vocabularies (QUESTION|FINDING|CLAIM|SOURCE; ANSWERS|SUPPORTS|CONTRADICTS|SUPERSEDES|DERIVED_FROM|COVERS|CITES).
- Integration points: mode-registry.json (per-mode contracts), research/ state packet layout (config/state/strategy/registry/dashboard/iterations/deltas), spec-check-protocol, generate-context.js continuity saves.
- Constraints and risks: 036 is operator-gated at 014 (IRREVERSIBLE cutover); deepseek provider banned; research must not modify any researched file; graph convergence DB may be unavailable (treat as absent, not failure); memory MCP may be wedged (use daemon CLI or skip).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20 (stop-policy=max-iterations; convergence telemetry only)
- Convergence threshold: 0.05 (telemetry)
- Per-iteration budget: 12 tool calls, 20 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this run); `resume`, `restart` live; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: native @deep-research agent via pi-subagents, model openai-codex/gpt-5.6-luna (deepseek banned)
- Current generation: 1
- Started: 2026-08-08T12:02:10Z
