# Iteration 6: First-mode graph adapter contract and shadow-parity gates

## Focus
Q5 part 2: define the first graph-backed mode, its typed state and node/edge contract, guarded conditional routing, dispatch/verify/reduce subgraphs, and measurable shadow-parity gates. The prompt pack explicitly selects this focus; the strategy file's reducer-refreshed next-focus text points to Q1/Q2, so Q1/Q2 are deferred rather than silently substituted.

## Actions Taken
1. Read the authoritative iteration prompt, config, state log, strategy, and findings registry before choosing a focus. Confirmed iteration 6, progressive synthesis, the packet-local write boundary, and the prior Q5 mapping evidence.
2. Read the prior mapping narrative, the mode registry, the convergence entrypoint, fan-out entrypoint, and graph upsert entrypoint to separate current runtime contracts from proposed graph behavior.
3. Reconciled GraphARC typed-state/write-boundary evidence, the existing research JSONL/delta contract, and the 036 reversible migration sequence into one first-mode adapter design.
4. Selected `research` as the first shadow-adapted mode because it already has a typed iteration packet, source-cited findings, graph-event vocabulary, and the shared research convergence backend; no implementation or authority cutover was attempted.

## Findings
1. **P1 — `research` is the best first graph-adapter mode.** The mode registry binds research to the shared research runtime and graph-backed convergence, while review still carries a named parity gap in the 036 handover, council has a separate artifact/graph contract, and alignment/improvement use distinct backends. Starting with research gives the adapter an existing iteration narrative, canonical state record, delta stream, and `graphEvents` surface without inventing a second packet identity. This is a reversible recommendation, not evidence that research has already become graph-native. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-19,65-190; SOURCE: .opencode/skills/system-deep-loop/SKILL.md:60-96; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83; INFERENCE: comparing the registered backend and artifact contracts]

2. **P1 — The adapter needs a typed execution state distinct from the knowledge nodes it emits.** A proposed `ResearchGraphState` has these fields: `schemaVersion`; `namespace {specFolder, sessionId, workflowMode, runtimeLoopType, backendKind}`; `iteration {number, run, focus, keyQuestions, remainingQuestions}`; `artifacts {iterationPath, stateLogPath, deltaPath, narrativeHash, stateRecordHash, deltaRecordHash}`; `knowledge {questionIds, findingIds, claimIds, sourceIds, edges}`; `signals {newInfoRatio, convergenceThreshold, minIterations, observations, qualityGate, blockers}`; `route {phase, decision, reason}`; `authority {legacyAuthoritative, shadow, ledgerReceiptRef, lockFenceRef}`; `parity {artifact, stateSchema, graph, reducer, convergence, mismatches}`; and `errors`. The node vocabulary maps `QUESTION` to a remaining key question, `FINDING` to a cited iteration finding, `CLAIM` to an answered/derived proposition, and `SOURCE` to a cited file or URL. The edge vocabulary maps `ANSWERS` from finding/claim to question, `SUPPORTS` or `CONTRADICTS` between claims/findings, `SUPERSEDES` from a newer result to an older result, `DERIVED_FROM` from claim to finding, `COVERS` from finding/claim to question, and `CITES` from finding/claim to source. This keeps graph topology typed while preserving the packet's JSONL artifacts as the durable boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,284-621; SOURCE: specs/system-deep-loop/037-graph-engineering/research/prompts/iteration-006.md; SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md; INFERENCE: translating the existing graph-event and packet contracts into a typed adapter state]

3. **P1 — Graph transitions must mirror the existing convergence contract instead of introducing a second stopping score.** The adapter should carry the current `newInfoRatio`, threshold, minimum-iteration/observation guards, quality signals, blocker list, status, decision, and stop reason as separate state fields. `evaluate` routes to `continue` only when the legacy runtime says continue and all quality/parity gates pass; it routes to `stop` only when the legacy stop decision is allowed and minimum-iteration plus required quality gates pass; `STOP_BLOCKED`, schema mismatch, or authority/fencing failure routes to `blocked`; missing evidence with a productive fallback routes to `recover`; and no productive fallback routes to `stuck`. A graph novelty signal may corroborate the decision, but it must not authorize an earlier stop or replace loop-local semantics. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70,145-240; SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence events and iterations 1-5; INFERENCE: preserving the current convergence output as the shadow adapter's decision oracle]

4. **P1 — Dispatch, verify, and reduce should be explicit subgraphs with narrow write ownership.** The `dispatch` subgraph reads the packet state/strategy, validates namespace and focus, and emits a work envelope; the existing research worker executes bounded evidence gathering; the `verify` subgraph checks narrative headings, citations, state/delta identity, graph vocabulary, dangling references, and packet-local paths; the `reduce` subgraph appends the canonical iteration/delta records and invokes the workflow reducer, returning normalized strategy/registry/dashboard snapshots for comparison. The adapter must not write reducer-owned strategy, registry, or dashboard files directly. Lock/fencing and ledger receipt creation remain serialization/authority boundaries around artifact commits, not implicit consequences of graph parallelism. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38,146-244; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28,86-186; SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-config.json; SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:284-621; INFERENCE: decomposing the current command-owned loop and GraphARC execution boundary into graph subgraphs]

5. **P1 — Shadow parity must prove artifact identity, not only graph shape.** The first-mode shadow run should enforce these measurable gates: **G0 scope** has zero writes outside the research packet and zero reducer-owned direct edits; **G1 artifacts** has exactly one new iteration narrative, one state-log iteration record, and one delta file, with all required headings and every finding cited; **G2 canonical state** has exactly one `type=iteration` record for the run and a delta first line byte-equivalent to the state-log record, with required route fields and valid node/edge vocabulary; **G3 graph reconstruction** has no dangling node references and reproduces finding, answered-question, source, and edge counts exactly; **G4 reducer parity** has zero normalized differences in reducer outputs produced from the legacy record stream versus the shadow event stream; **G5 convergence parity** has identical status, decision, stop reason, and `newInfoRatio` (tolerance no wider than 1e-9) for every shadowed iteration and no graph-triggered early stop; and **G6 replay/failure parity** deterministically reproduces the same decision and rejects malformed events, missing citations, and incomplete artifacts without converting them into completion. These are pass/fail gates, with 100% artifact/schema/convergence parity required for a cutover candidate. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/prompts/iteration-006.md; SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240; INFERENCE: turning the existing file/JSONL/reducer contracts into objective shadow checks]

6. **P0 — Authority cutover must remain closed until the 036 fencing and parity preconditions pass.** A graph adapter can run in additive-dark shadow mode while the legacy loop and evidence ledger remain authoritative. It must not promote graph transitions or retire legacy writers while F001 identity binding, F002 policy-state binding, F005 lock hardening, the deep-review parity gap, or gateway-only append fencing remain unresolved. The cutover sequence remains shadow parity, whole-system gate on a frozen state, one-mode cutover behind rollback evidence, and legacy retirement only after zero-use telemetry. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,59-77,116-160,181-186; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,94-103; INFERENCE: applying the 036 authority-preserving migration model to graph control]

7. **P1 — The graph database is an optional acceleration path, not a prerequisite for first-mode correctness.** Prior iterations recorded a `better-sqlite3` native-module mismatch that made the coverage-graph database unavailable, causing graph convergence/upsert to be treated as absent. The adapter therefore needs JSONL event emission and file-based parity checks as the primary shadow proof; database upsert can be an additional projection. The existing upsert contract validates typed nodes/edges and namespaces, but that persistence path alone does not establish workflow control migration. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: separating an unavailable projection backend from the required packet and convergence proof]

## Questions Answered
- **Q5 part 2:** Research is the recommended first mode for a shadow graph adapter.
- The adapter state schema, node/edge mapping, guarded route contract, dispatch/verify/reduce decomposition, and measurable parity gates are specified above.
- The authority boundary is explicit: graph orchestration may be shadowed first, but the legacy loop/evidence ledger remains authoritative until the 036 gates pass.

## Questions Remaining
- Q1/Q2: reconcile the complete current runtime inventory and canonical ownership/status of the remaining 036 phases.
- Implement and exercise the adapter contract in a follow-up task; this iteration is research-only and contains no implementation change.
- Determine the exact normalized reducer snapshot format and a deterministic replay harness once an implementation owner is assigned.

## Next Focus
Q1/Q2: verify the remaining 036 phase ownership/status and reconcile the complete current runtime inventory, while preserving the first-mode research adapter and parity gates as the implementation baseline.

## Ruled Out
- Starting with review while its named deep-review parity gap remains unresolved; this would make the first parity oracle weaker than research. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83]
- Starting with AI council, alignment, or improvement as if they shared the research packet contract; the registry assigns them distinct artifact or backend boundaries. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:65-190]
- Treating the coverage-graph database or a graph checkpointer as the authority ledger or as proof of control-plane migration. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Allowing graph convergence to stop before legacy convergence and quality/parity gates agree. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240 and the 036 cutover sequence]

## Dead Ends
- A database-first adapter is blocked by the recorded native-module mismatch and would conflate projection availability with adapter correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph convergence/upsert skipped events]
- A big-bang graph replacement is incompatible with the documented additive-dark and rollback-window migration sequence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]

## Edge Cases
- Ambiguous input: the prompt's explicit Q5 part 2 focus takes precedence over the reducer-refreshed strategy next-focus text; Q1/Q2 are deferred.
- Contradictory evidence: GraphARC typed checkpoint/state execution and the 036 append-only evidence ledger overlap for resume/observability but are not equivalent; the ledger and receipts remain the authority boundary.
- Missing dependency: the coverage-graph database is unavailable in the recorded environment; JSONL and file parity remain the fallback proof path.
- Partial success: the adapter is specified and parity criteria are measurable, but no production implementation or live parity run was attempted; status is complete for the research/design question only.

## Sources Consulted
- `.opencode/skills/system-deep-loop/mode-registry.json:1-19,65-190`
- `.opencode/skills/system-deep-loop/SKILL.md:60-96`
- `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70,145-240`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38,146-244`
- `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28,86-186`
- `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18`
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,284-621`
- `specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,77-88,94-103`
- `specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,59-77,116-160,181-186`
- `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: prior iteration and graph backend events`
- `specs/system-deep-loop/037-graph-engineering/research/prompts/iteration-006.md`

## Assessment
- New information ratio: **0.86** (five of seven findings define new adapter/gate detail; two refine the prior graph-to-loop mapping).
- Questions addressed: Q5 part 2.
- Questions answered: first-mode selection, typed state and graph vocabulary, guarded routing, subgraph boundaries, shadow-parity gates, and cutover preconditions.

## Reflection
- What worked and why: combining the prior mapping with the concrete convergence, fan-out, upsert, and 036 authority contracts made the proposed adapter testable without pretending that current graph metadata is workflow control.
- What did not work and why: the bounded tool budget prevented an additional read of the deep-research workflow asset; the contract is consequently grounded in the already-verified packet/state and runtime sources rather than that orchestration YAML.
- What I would do differently: the implementation iteration should first capture one real research run into a shadow snapshot, then compare normalized reducer and convergence outputs before expanding the graph boundary.

## Recommended Next Focus
Verify Q1/Q2's remaining runtime and phase ownership gaps, then implement a research-only shadow harness that records the G0-G7 parity results without changing authority.

## SCOPE VIOLATIONS
None. Only the three packet-local iteration outputs are being written; researched files and reducer-owned files remain read-only.
