# Iteration 4: Practical graph workflow implementations and the LangGraph model

## Focus
Q4: verify how GraphARC and graph-engineering-master structure graph-based agent workflows in practice, then verify the LangGraph `StateGraph`/routing/checkpoint model from official sources and compare it with GraphARC's wrapper boundary. The packet-local `LangChain.md` was treated as missing, not as evidence.

## Actions Taken
1. Confirmed that the two iteration output paths were available and inventoried the GraphARC runtime and graph-engineering-master trees without mutating either subject.
2. Inspected GraphARC's typed state/graph kernel, admission checker, materializer, governed loop, fan-out, convergence, README, and the supplied graph-engineering-master README/WORKFLOWS files.
3. Queried the current official LangGraph Graph API and Persistence documentation with `curl`, and checked the official `StateGraph` source declarations for node/edge/conditional-edge/compile/checkpointer APIs. The older `langchain-ai.github.io` URL returned no usable body, so the current docs and raw source were used instead.

## Findings
1. **[P1] GraphARC is a governance wrapper around LangGraph, not a replacement graph kernel.** Its runtime imports `StateGraph`, `Command`, `Send`, and `StateSnapshot`, then adds Pydantic state contracts, declared write permissions, checked destinations, per-run budgets, and JSONL trace recording. `GraphARCState` forbids unknown fields and validates assignment; bypassing the wrapper through raw compiled entrypoints fails closed because the run context is required. **[SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,51-64,67-140; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18]**

2. **[P1] The practical GraphARC workflow is planner → admission → materialization → bounded graph execution → recorded stop.** `GovernedLoop` accepts a planner, checker, and materializer; each round records the proposal, admission result, execution status, progress, spend, and errors. Admission evaluates registry membership, policy, remaining budget, nesting depth, and acyclicity; materialization resolves node bodies only from the frozen registry and passes an optional checkpointer to compilation. **[SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:284-347,362-621,672-790; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:431-602,616-860; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py:204-282,433-498]**

3. **[P1] LangGraph's core contribution is a compiled state graph with explicit builder primitives.** The official Graph API defines `StateGraph` over user state, builds it with `add_node` and `add_edge` (including `START`/`END`), and requires `compile()` before invocation. Official source exposes `StateGraph.add_node`, `add_edge`, `add_conditional_edges`, and `compile(checkpointer=...)`; compilation performs structural checks and accepts runtime controls such as checkpointers and breakpoints. **[SOURCE: https://docs.langchain.com/oss/python/langgraph/graph-api; SOURCE: https://raw.githubusercontent.com/langchain-ai/langgraph/main/libs/langgraph/langgraph/graph/state.py:130,375,915,969,1164-1191]**

4. **[P1] Conditional routing is data-driven fan-out, not unconstrained branching.** The official Graph API describes `add_conditional_edges` as a routing function over current state whose return value selects one or more destination nodes; multiple destinations run in parallel in the next superstep. GraphARC narrows that dynamic capability with registry/policy/depth/acyclicity admission and explicit destination checks, while its fan-out helper converts exceptions, malformed returns, and timeouts into `WorkerResult(ok=False)` data and deduplicates evidence before synthesis. **[SOURCE: https://docs.langchain.com/oss/python/langgraph/graph-api; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-71; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:509-602; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/fanout.py:1-79]**

5. **[P1] A LangGraph checkpointer is state persistence, not a complete why-audit.** Official Persistence docs distinguish thread-scoped checkpoints (continuity, human-in-the-loop, time travel, fault tolerance) from cross-thread stores; compilation wires a checkpointer/store and invocation uses a `thread_id`. GraphARC's separate trace records node start/end/error, admission fingerprints, topology, and machine-readable stop reasons, which supplies the causal execution record that a state checkpoint alone does not establish. **[SOURCE: https://docs.langchain.com/oss/python/langgraph/persistence; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:164-169; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:58-68,696-719; INFERENCE: checkpoint contents preserve state while GraphARC trace events preserve execution/admission/termination rationale]**

6. **[P2] The graph-engineering-master practical guidance is a staged design discipline, but its claimed executable skill is absent from this checkout.** The README separates knowledge graphs (memory/provenance) from task graphs (job dependencies), and its task rules require real edges, a split→parallel workers→separate verifiers→owned merge diamond, a stop rule, and a human gate. WORKFLOWS makes progress output-driven and gated (approve a route, do one module, critique before continuing), while the bounded inventory returned no files under `graph-engineering/` even though the README claims the skill and references live there. **[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:5-10,20-27,40-60; SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:1-5,19-42,165-179; INFERENCE: bounded `find` inventory from this iteration returned no files below `graph-engineering/`, so implementation-level claims for that directory remain unverified]**

## Questions Answered
- Q4: practical GraphARC architecture, node/state contracts, admission and materialization flow, fan-out/convergence controls, trace tooling, and the LangGraph model contribution.
- Q3 refinement: official LangGraph confirms the state-builder/conditional-routing/checkpointer primitives; GraphARC supplies stricter governance and causal tracing around them.

## Questions Remaining
- Q1: reconcile the complete current system-deep-loop runtime inventory and authority boundary.
- Q2: verify canonical ownership/status for the remaining 036 phases.
- Q5: turn the comparison into a concrete graph-engineering migration and gate sequence for system-deep-loop.

## SCOPE VIOLATIONS
None. All writes were limited to the three paths explicitly allowed for iteration 004; researched source files were read-only.

## Ruled Out
- Treating LangGraph's `compile()` plus checkpointer as equivalent to an append-only evidence ledger or replayable why-audit; the official docs describe state persistence, while traces carry execution rationale.
- Treating the graph-engineering-master README/WORKFLOWS as proof of an executable local implementation when the packet's `graph-engineering/` inventory is empty.
- Treating GraphARC's dynamic `Command`/`Send` capability as permissionless model branching; its admission gate is a required control boundary.

## Dead Ends
- The legacy LangGraph documentation URL (`https://langchain-ai.github.io/langgraph/concepts/low_level/`) returned no usable body in this run. Current official docs and the official raw source provided a successful fallback, so the iteration remains complete.

## Edge Cases
- Ambiguous input: selected the narrow Q4 interpretation of implementation contracts and LangGraph API boundaries; migration design is deferred to Q5.
- Contradictory evidence: none unresolved. The apparent difference between LangGraph flexibility and GraphARC strictness is a wrapper-boundary distinction, not a source contradiction.
- Missing dependencies: local `LangChain.md` remains empty and `graph-engineering/` has no inventoried files; current official LangGraph docs/source and the supplied README/WORKFLOWS were used as fallbacks.
- Partial success: one legacy docs URL failed, but official current docs and source were reachable and sufficient to answer Q4.

## Sources Consulted
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:17-19,46-71,164-169`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,51-140,284-347,362-621,672-790`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:431-602,616-860`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py:204-282,433-498`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/fanout.py:1-79`
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:5-10,20-27,40-60`
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:1-5,19-42,165-179`
- `https://docs.langchain.com/oss/python/langgraph/graph-api`
- `https://docs.langchain.com/oss/python/langgraph/persistence`
- `https://raw.githubusercontent.com/langchain-ai/langgraph/main/libs/langgraph/langgraph/graph/state.py`
- `https://langchain-ai.github.io/langgraph/concepts/low_level/` (no usable body returned)

## Assessment
- New information ratio: **0.93** (4 fully new findings + 2 partially new findings: `(4 + 0.5*2)/6 = 0.83`, plus the permitted 0.10 simplicity bonus for resolving the prior direct-LangChain-source gap).
- Questions addressed: Q4 and the direct LangGraph portion of Q3.
- Questions answered: Q4 at implementation/API-boundary level.

## Reflection
- What worked and why: reading GraphARC's kernel and planner/materializer together exposed the actual contract boundary, while official docs plus raw source separated LangGraph primitives from GraphARC policy additions.
- What did not work and why: the packet-local LangChain file and legacy docs URL supplied no direct content; both were unavailable rather than silently treated as evidence.
- What I would do differently: next iteration should map these proven primitives to the existing mode registry, evidence-ledger events, fan-out, convergence, and authority gates instead of collecting more generic graph terminology.

## Next Focus
Q5: define a stable control graph plus per-run work graphs for system-deep-loop, mapping each mode, evidence-ledger transition, fan-out/convergence gate, checkpoint/trace boundary, rollback window, and 014 authority-cutover prerequisite to an explicit graph node or edge.


## Recommended Next Focus
Q5: define a stable control graph plus per-run work graphs for system-deep-loop, mapping each mode, evidence-ledger transition, fan-out/convergence gate, checkpoint/trace boundary, rollback window, and authority-cutover prerequisite to an explicit graph node or edge.
