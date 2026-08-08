# Iteration 8: GraphARC internals deep verification

## Focus
GraphARC internals deep verification: planner admission/materialization, state, traces, budgets, tests, and the governance-wrapper boundary over the graph runtime. The selected interpretation is the implementation contract behind the already-verified GraphARC kernel, not a fresh survey of other graph frameworks.

## Actions Taken
1. Read the authoritative iteration pack, configuration, state log, strategy, and findings registry before selecting the focus; prior exhausted directions were not retried.
2. Read the complete GraphARC planner admission and materialization modules, then inspected typed state, runtime budgets, traces, convergence/fan-out, and GraphARC graph entrypoints.
3. Enumerated the GraphARC bench and test surfaces and line-indexed the admission, budget, replay, runtime, and bench contracts for citation.

## Findings
1. **[P1] Admission is a deterministic, fail-closed gate rather than an executor.** `AdmissionChecker.check()` runs registry, node/edge policy, remaining-budget, depth, optional reachability, and acyclicity checks; the immutable `AdmissionResult` carries status, proposal fingerprint, rejections, checks run, cost estimate, remaining budget, depth, and node count. `_emit()` records both admitted and rejected decisions as `phase="admission"` trace events. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:101-115,457-507,551-614,975-1008]
2. **[P1] Routing authority is attached to registry kinds, not planner-chosen instance names.** Edge and node policies implement deny/ask/allow ordering; endpoint kinds are resolved from proposed nodes or an explicit `{name: kind}` live-node mapping, and unresolved endpoint kinds are refused rather than assumed safe. This prevents renaming an instance from laundering a denied transition, while `NEEDS_APPROVAL` remains a stop rather than an implicit allow. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:302-361,382-428,672-835]
3. **[P1] Admission budgets are conservative estimates, while runtime budgets are the enforcement plane.** `_worst_case()` walks proposal edges and multiplies each registry `NodeSpec.worst_case` by possible execution steps; `_check_budget()` compares tokens, iterations, and seconds with remaining headroom and marks estimates incomplete when kinds are unregistered. The runtime `BudgetMeter` charges iterations/tokens, checks ceilings at node/call boundaries, and `deadline_guard` enforces wall-clock limits with signal or thread fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:184-210,836-893; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/budget.py:48-57,129-317,363-510]
4. **[P1] Materializer is the governance wrapper around a real graph runtime.** It accepts only an admitted `AdmissionResult` matching the exact proposal fingerprint/type, performs standalone entry/reachability/write checks, obtains bodies only from operator-owned registry factories, then calls `GraphARC.add_node`, `add_edge`, and `compile`. The optional `forward_args` path is explicitly unchecked; `_confine()` restricts `Command`/`Send` destinations to edges the proposal declared. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py:1-88,139-202,204-292,293-380,433-491; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:364-465,623-712]
5. **[P1] State, routing, checkpoint, and trace planes are distinct.** `GraphARCState` forbids unknown fields and validates assignment; the kernel validates node updates and exposes static, conditional, and fan-out edge primitives plus compiled state/history operations. `TraceRecorder` appends JSONL `TraceEvent` records and strictly rejects malformed owned traces, while `TailRecorder` tolerates a torn final line for live reads; replay tests reconstruct node order, state deltas, failed executions, and fan-out from the file. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:364-465,495-757,1009-1299; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/trace.py:61-220,223-273; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_replay.py:108-255,410-495]
6. **[P2] The contract is executable and broad, but benchmark evidence is a harness rather than proof of production parity.** Admission tests cover all failed checks, policy/name evasion, trace recording, planner non-execution, and reachability; budget tests cover token/time ceilings and fan-out interruption; replay tests cover deterministic reconstruction. `bench/run_bench.py` supplies hashing, external-agent invocation, task grading, and a CLI main, so it can compare runs but does not itself establish deep-loop authority parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_admission.py:82-918,1047-1108,1456-1518; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_budget_enforcement.py:55-120,377-457,508-591; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_replay.py:108-255,410-495; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/bench/run_bench.py:30-52,76-165]
7. **[P1] GraphARC adds governance and audit boundaries around LangGraph-like graph execution rather than replacing the runtime model.** Its materializer documents static edge fan-out/join with LangGraph super-step semantics, while the kernel exposes conditional and fan-out edge builders and compiles a runnable graph; the materializer also accepts a checkpointer and the compiled wrapper exposes state/history APIs. The additional GraphARC contract is operator-owned admission, registry factories, declared writes, and trace-backed audit; this is an implementation-level wrapper boundary, not evidence that a deep-loop evidence ledger has become the graph runtime. [INFERENCE: based on specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py:25-37,239-292,338-380; specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:364-465,466-493,1009-1299; prior LangGraph verification recorded in specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl iteration 4 and https://docs.langchain.com/oss/python/langgraph/graph-api]

## Questions Answered
- **Q3:** GraphARC's implementation-level node/edge/state contract, admission routing, budget accounting, convergence/fan-out boundary, and trace/replay behavior are now verified.
- **Q4:** GraphARC is a governance/materialization wrapper over a real graph runtime with LangGraph-compatible topology semantics; its registry, admission, declared-write, and trace layers are additions.
- **Q5:** The first deep-loop adapter should preserve this separation: a typed work graph may use GraphARC-like admission/materialization, while the evidence ledger remains the authority/audit plane and legacy parity remains a gate.

## Questions Remaining
- Q1/Q2: canonical ownership/status for absent 034 and 036-046 phase packets and the fresh loop-lock/fan-out/upsert runtime census remain outside this focus.
- Q5: an implementation follow-up still needs a deterministic adapter/replay fixture and measurable shadow-parity gates; this iteration intentionally made no code changes.

## SCOPE VIOLATIONS
None. No researched source path or reducer-owned file was modified.

## Ruled Out
- Treating admission as execution; the checker never calls node factories and only records a decision.
- Treating `forward_args=True` as governed argument validation; materializer documentation explicitly leaves those args unchecked.
- Treating GraphARC checkpoint/state APIs or trace replay as the append-only evidence-ledger authority.

## Dead Ends
No new dead end. The remaining uncertainty is implementation ownership and parity measurement, not a failed evidence path.

## Edge Cases
- Ambiguous input: narrowed to GraphARC implementation internals and wrapper/runtime boundaries; broad framework survey deferred.
- Contradictory evidence: none found in the inspected GraphARC modules; the explicit trust-boundary caveats were retained rather than smoothed over.
- Missing dependencies: no local GraphARC source dependency was missing; fresh web retrieval was not needed because LangGraph evidence was verified in iteration 4 and cited as prior packet evidence.
- Partial success: bench behavior was line-indexed rather than executed, and no new LangGraph web call was made within the bounded pass; core GraphARC contracts were fully inspected. Status remains complete because the focus questions were answered with local executable-source evidence.

## Sources Consulted
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:101-1008
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py:1-491
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:364-1299
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/budget.py:48-510
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/trace.py:61-273
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_admission.py:82-1518
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_budget_enforcement.py:55-707
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/tests/test_replay.py:108-1454
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/bench/run_bench.py:30-213
- https://docs.langchain.com/oss/python/langgraph/graph-api
- https://docs.langchain.com/oss/python/langgraph/persistence

## Assessment
- New information ratio: 0.86
- Questions addressed: Q3, Q4, and the implementation-contract portion of Q5.
- Questions answered: GraphARC admission/materialization/state/trace/budget contract and governance-wrapper boundary.

## Reflection
- What worked and why: reading admission and materialization together exposed the exact authority seam; line-indexing tests connected prose guarantees to executable checks.
- What did not work and why: no fresh benchmark execution or web retrieval was necessary within the bounded pass, so production parity and an updated LangGraph source snapshot remain indirect.
- What I would do differently: on the next implementation-oriented pass, run a minimal adapter fixture through admission, materialization, replay, and parity assertions before considering any authority change.

## Next Focus
Fresh line-level verification of `loop-lock.cjs`, `fanout-run.cjs`, and `upsert.cjs`, followed by the smallest deterministic GraphARC-style adapter/replay fixture design; do not treat the coverage graph as control-plane authority.
