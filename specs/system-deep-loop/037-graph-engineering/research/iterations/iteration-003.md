# Iteration 3: Core graph-engineering concepts and patterns

## Focus
Q3: establish the reference corpus vocabulary and architectural claims for state graphs, nodes and edges, conditional routing, subgraphs, checkpointing, convergence, and when to use or avoid graph workflows. The selected interpretation is task/orchestration graphs first, with knowledge graphs treated as a distinct but related half of graph engineering.

## Actions Taken
1. Inspected the GraphARC README, roadmap, and runtime graph/state/convergence/fan-out modules for concrete node contracts, routing, budgets, traces, checkpointing, and failure handling.
2. Inspected graph-engineering-master README and WORKFLOWS for its task-graph versus knowledge-graph split, topology rules, verifier pattern, stop rule, human gate, and retrieval routing.
3. Term-mapped all supplied article files for definitions, graph topology, conditional routing, failure modes, checkpointing, and use/avoid guidance; the supplied LangChain.md file had no readable content, so GraphARC's LangGraph implementation and the article corpus were used as the fallback evidence.

## Findings
1. **[P1] A usable state graph is a contract plus execution controls, not merely an adjacency list.** GraphARC models typed state, per-node declared writes, checked destinations, bounded work, JSONL execution traces, and optional DAG enforcement; its base state forbids unknown fields and validates assignment. This makes node input/output shape, write ownership, and transition validity machine-checkable at boundaries. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18]
2. **[P1] Conditional routing is governed dynamic topology.** GraphARC allows a planner to propose a graph at runtime, but a deterministic admission gate checks registry, policy, budget, depth, and acyclicity before execution; rejected proposals produce structured feedback for replanning, and work discovered mid-run re-enters the same gate. This is a fail-closed node/edge contract rather than unconstrained model-generated branching. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-93; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:95-160]
3. **[P1] Fan-out and convergence are first-class graph patterns, while checkpoint/subgraph support remains bounded.** GraphARC converts worker exceptions, malformed returns, and timeouts into data, deduplicates evidence before synthesis, and exposes machine-readable stop reasons for target, no-progress, round cap, budget, human stop, and error. Its roadmap reports JSONL traces, checkpoint resume, convergence guards, cycle detection, and bounded fan-out as landed, but records interrupt resume as unsupported and retry/cache/durability/subgraphs as not yet passed through. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/fanout.py:1-79; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/convergence.py:1-45; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/ROADMAP.md:99-143]
4. **[P1] The graph-engineering-master corpus deliberately separates memory graphs from work graphs.** Knowledge graphs model what agents remember, including relationships, time, and provenance; task graphs model jobs and execution dependencies. Its task rules are to remove fake edges, use a split-to-parallel-workers-to-separate-verifiers-to-owned-merge diamond, apply a stop rule, and place a human gate where mistakes become expensive; its workflow blocks also require ontology and quality verification before serving. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:1-13; SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:40-60; SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:28-39; SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179]
5. **[P1] A practical multi-agent architecture has two graph layers.** The supplied organization article distinguishes a stable org graph for durable roles, ownership, and preserved context from an ephemeral work graph whose task nodes and edges split, merge, reorder, or disappear as evidence changes. It also identifies graph-harness responsibilities beyond a loop harness: inter-agent routing, node failure isolation, work-graph state consistency, dynamic spawning, and observability. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:108-170; SOURCE: specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:216-235]
6. **[P2] The corpus recommends graph selection by dependency shape, not fashion.** The loop-to-graph article recommends graph engineering for complex work with high concurrency, at least three independent verification steps, and complex decision routing; the explanatory article says to keep loops for tight human approval, genuinely sequential dependencies, or workflows with no pair of independent jobs. It also warns about hidden shared-resource edges, silent node failure, context/fan-in overload, and the fact that topology alone does not create truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173; SOURCE: specs/system-deep-loop/037-graph-engineering/context/Graph Engineering explained: what it is, when to use it and when not to.md:151-229]
7. **[P1] The direct architectural implication for system-deep-loop is a stable control graph plus per-run work graphs.** The mode registry and shared policy/identity contracts are candidates for the stable graph layer; each run can materialize a work graph whose nodes are bounded mode phases, whose state is the typed evidence/ledger snapshot, whose conditional edges are authorized convergence and blocker transitions, and whose fan-in/fan-out is explicit. Checkpointed artifacts/receipts should serve resume, while replay traces should preserve why a transition was admitted; this is a target mapping, not evidence that the current control plane has already migrated. [INFERENCE: based on GraphARC's typed-state/write/routing/trace contracts in specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33, the two-layer model in specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170, and prior system status evidence in specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5,8]
8. **[P2] Direct LangChain evidence is missing from the supplied packet, so LangChain-specific claims remain provisional.** The local LangChain.md file yielded no readable content; the fallback corpus identifies orchestration graphs as the LangGraph/Temporal territory, while GraphARC explicitly describes itself as a LangGraph wrapper and its roadmap shows the remaining checkpoint/subgraph/durability boundary. The next iteration should verify the canonical LangGraph/LangChain state-graph, conditional-edge, subgraph, and checkpointer APIs directly. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/LangChain.md:1 (empty local corpus file); SOURCE: specs/system-deep-loop/037-graph-engineering/context/What is Graph Engineering?.md:102-142; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:17-19; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/ROADMAP.md:99-143]

## Questions Answered
- Q3: Core graph-engineering concepts and patterns are answered at the supplied-corpus level: typed state and node contracts, typed/conditional edges, governed dynamic admission, bounded fan-out and convergence, separate verifier/fan-in topology, checkpoint and trace distinctions, and selection criteria for graphs versus loops.
- Q4: Practical implementation structure is partially answered through GraphARC; direct LangChain contribution remains unverified because the local LangChain source is empty.

## Questions Remaining
- Q1: Complete the current runtime status inventory.
- Q2: Verify canonical status and ownership of 034 and 036-046.
- Q4: Verify direct LangGraph/LangChain APIs and compare them with GraphARC's wrapper boundary.
- Q5: Turn the target mapping into a concrete migration path and gate sequence for system-deep-loop.

## Edge Cases
- Ambiguous input: “Graph engineering” is used in the corpus for orchestration graphs, graphs of loops, and graph-structured memory; this iteration selected orchestration/task graphs while preserving the knowledge-graph distinction.
- Contradictory evidence: none found on the core task-graph patterns; apparent terminology conflict is polysemy, not a resolved technical contradiction.
- Missing dependencies: the packet-local LangChain.md file is empty; GraphARC source and the supplied field guide were used as fallback, with direct LangChain claims explicitly deferred.
- Partial success: Q3 is covered with concrete local implementations, but Q4's LangChain-specific portion remains incomplete; status is complete because the in-scope Q3 focus has enough independent corpus evidence.

## Sources Consulted
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:17-19,46-71,162-181
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/ROADMAP.md:99-143
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/convergence.py:1-45
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/fanout.py:1-79
- specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:1-60
- specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:28-39,165-179
- specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:11-13,50-58,160-195
- specs/system-deep-loop/037-graph-engineering/context/Graph Engineering explained: what it is, when to use it and when not to.md:30-69,151-229
- specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:108-170,216-235
- specs/system-deep-loop/037-graph-engineering/context/What is Graph Engineering?.md:102-142,163-187
- specs/system-deep-loop/037-graph-engineering/context/LangChain.md:1
- specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5,8

## Assessment
- New information ratio: 0.88
- Calculation: six findings are fully new and two are partially new (6 + 0.5 + 0.5) / 8; no simplicity bonus claimed.
- Questions addressed: Q3 fully at corpus level; Q4 partially through GraphARC.
- Questions answered: Q3 at corpus level.

## Reflection
- What worked and why: reading executable GraphARC contracts beside the two graph-engineering articles separated durable node semantics from persuasive terminology and exposed concrete admission, routing, fan-out, convergence, and checkpoint boundaries.
- What did not work and why: the direct LangChain evidence path failed because the packet-local LangChain.md file is empty; no replacement source was available within the bounded local corpus action.
- What I would do differently: begin the next iteration with canonical LangGraph documentation/API inspection, then test the proposed stable-org/work-graph mapping against the existing mode registry and evidence-ledger transitions.

## Recommended Next Focus
Q4: verify direct LangGraph/LangChain graph APIs and compare state schemas, conditional routing, subgraphs, checkpointers, and resume semantics with GraphARC and the existing system runtime. After that, use Q5 to define a concrete migration/gating sequence rather than a big-bang rewrite.
