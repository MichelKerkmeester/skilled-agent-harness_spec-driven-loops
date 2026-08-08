# Iteration 5: Deep-loop concepts mapped to graph primitives

## Focus
Q5 part 1 investigated how the existing deep-loop modes, iteration focus, convergence guards, JSONL state/reducer, loop lock, fan-out lineages, and 036 evidence-ledger spine map onto graph-engineering primitives. The narrow conclusion is a hybrid architecture: graph topology can become the orchestration/control plane, while the append-only ledger and packet artifacts remain the authority boundary until the 036 cutover gates pass.

## Actions Taken
1. Read the externalized config, state log, strategy, and findings registry before selecting the focus; the state log has four prior iteration records and the prompt pack selects Q5 part 1.
2. Read the mode registry and runtime convergence, lock, and fan-out entrypoints to distinguish current routing/backend contracts from graph-target behavior.
3. Read the GraphARC graph/state/convergence implementation and compared its typed state, write permissions, guarded routing, Send fan-out, budgets, traces, and stop reasons with the existing runtime and the 036 migration model.
4. Verified the two new iteration output paths were absent before creating them; no researched source or reducer-owned file was modified.

## Findings
1. **P1 — Modes map to stable control-graph subgraphs, not one undifferentiated graph.** The three-tier discriminator (`workflowMode`, `runtimeLoopType`, `backendKind`) must remain explicit: research, review, and council can bind to runtime-loop subgraphs, while the improvement lanes share an improvement-host packet and alignment uses a separate convergence backend. A graph adapter keyed only by packet name would erase these distinctions and misroute custom backends. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-19,65-190]

2. **P1 — An iteration focus is a typed work node whose output is a reducer update, not an untyped text edge.** GraphARC's Pydantic state forbids unknown fields; nodes declare write permissions; node updates and fan-out payloads are validated at the boundary; and the compiled wrapper records topology and per-node state deltas. The deep-research focus node can therefore read the current question/state snapshot and emit typed findings, source references, blockers, and next-focus events, while the existing reducer remains the merge authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,284-621; INFERENCE: mapping those contracts onto the packet-local deep-research reducer]

3. **P1 — Convergence belongs on guarded conditional edges.** The existing runtime computes loop-specific signals, blocking guards, graph novelty corroboration, minimum-observation checks, and explicit `STOP_ALLOWED`/`STOP_BLOCKED`/`CONTINUE` decisions; GraphARC's ProgressGuard independently models target, no-progress, and max-round stops with machine-readable reasons. A graph design should route `evaluate -> continue`, `evaluate -> blocked/recover`, or `evaluate -> stop`, retaining `newInfoRatio`, quality signals, and `minIterations` as separate state/guard fields rather than collapsing them into one universal score. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70,145-240; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/convergence.py:1-45; INFERENCE: combining the two explicit guard models]

4. **P1 — Fan-out maps to explicit Send/map branches, but serialization remains a separate graph boundary.** GraphARC treats fan-out as deliberate parallel dispatch, validates destinations and payload schemas, deep-copies inputs, and records node execution traces. The current deep-loop fan-out additionally owns capped pools, status ledgers, retries/orphans, wave-assignment rejection, budgets, salvage, and wait checkpoints; the loop lock centralizes acquire/status/refresh/release but the 036 handover still identifies a fresh-acquisition partial-record window. The graph adapter should call the existing operational fan-out behind an authorized boundary, and place lock/fencing around ledger/checkpoint writes rather than assume graph parallelism supplies serialization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,284-621; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38,146-244; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28,86-186; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-77,116-160]

5. **P0 — Graph checkpointing cannot replace the 036 evidence-ledger spine.** A graph checkpointer can restore typed state for resume and traces can record node execution, but 036 requires an append-only typed event ledger, fail-closed transition authorization, sealed artifacts, replay fingerprints, receipts/effect recovery, identity/policy binding, and fencing. Those are authority and audit properties, not merely persisted graph state. The ledger should remain a sidecar/commit log consumed by graph transition gates until its per-mode authority cutover is verified. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,77-88,94-103; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,116-160; INFERENCE: comparing the 036 ledger requirements with GraphARC's state/checkpoint/trace boundary]

6. **P1 — The safer transformation is additive graph orchestration with per-mode parity gates.** First wrap one runtime-loop mode with a stable graph schema and emit graph topology/events in shadow mode; then compare graph outputs against the existing JSONL/reducer and 036 ledger; next introduce guarded fan-out and convergence edges; cut over one mode only after identity, policy-state, append-fencing, and whole-system gates pass; finally retire legacy writers after zero-use telemetry. This follows the 036 reversible additive-dark, shadow-parity, staged-cutover, then retirement sequence and avoids a big-bang replacement. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:181-186; INFERENCE: applying that migration sequence to the graph/control-plane boundary]

## Questions Answered
- Q5 part 1: the clean mappings are modes→subgraphs, focus→typed node, convergence→conditional guarded edges, fan-out→Send/map branches, and checkpoint state→resume state.
- The non-clean mappings are loop-lock→serialization/fencing (not topology) and evidence-ledger→append-only authority/audit (not a mutable checkpoint).
- Hybrid graph orchestration plus the existing ledger/reducer is better supported than full replacement while 014 remains blocked.

## Questions Remaining
- Q5 part 2: define the concrete graph adapter contract and gate-by-gate migration sequence for the first mode.
- Q1/Q2: reconcile the complete current runtime inventory and canonical status/ownership of the remaining 036 phases.

## Edge Cases
- Ambiguous input: “graph state” was interpreted narrowly as execution/control state, not as replacing the evidence ledger or coverage metadata graph.
- Contradictory evidence: GraphARC checkpoint/trace capabilities and 036 ledger requirements overlap for resume/observability but are not equivalent; the distinction remains unresolved at implementation-detail level and is treated as a design boundary, not collapsed.
- Missing dependencies: no additional external dependency was required; the packet-local LangChain source remains empty as recorded in prior iterations, so no new LangChain-specific claim is made.
- Partial success: the bounded read budget truncated one broad source read, but the required GraphARC contracts and prior cited fan-out/LangGraph evidence were sufficient for this mapping; status remains complete for the selected part, with the adapter contract deferred.

## Sources Consulted
- `.opencode/skills/system-deep-loop/mode-registry.json:1-19,65-190`
- `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70,145-240`
- `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28,86-186`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38,146-244`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,284-621`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/convergence.py:1-45`
- `specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,77-88,94-103`
- `specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,59-77,116-160,181-186`
- `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26`

## Assessment
- New information ratio: 0.92 (five fully new mapping findings and one partially new ledger/checkpoint synthesis).
- Questions addressed: Q5 part 1.
- Questions answered: the clean/non-clean primitive mapping and the hybrid-over-replacement recommendation.

## Reflection
- What worked and why: reading the mode discriminator, GraphARC boundary contracts, and the 036 migration sequence together exposed which concerns are graph topology and which are authority/audit concerns.
- What did not work and why: a full reread of the large fan-out implementation was not possible within the bounded tool budget; the current fan-out mapping therefore relies on the inspected entrypoint plus prior packet evidence.
- What I would do differently: the next iteration should read the narrow fan-out pool and 036 gate contracts directly, then specify the first graph adapter's state schema and parity assertions.

## Next Focus
Q5 part 2: specify a first-mode graph adapter contract, state schema, event/receipt boundary, and measurable shadow-parity gates before any authority cutover.

## SCOPE VIOLATIONS
None. No researched source, reducer-owned file, or implementation file was written.
