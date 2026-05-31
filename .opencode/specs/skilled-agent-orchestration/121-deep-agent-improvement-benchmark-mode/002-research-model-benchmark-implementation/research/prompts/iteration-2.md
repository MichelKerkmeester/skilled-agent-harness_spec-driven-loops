DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 1/5 answered | Last focus: Q1: Define exact interface contracts for the three pluggable seams (candidate-source, dispatcher, scorer)
Last 2 ratios: N/A -> 0.35 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Q2: Design the `dispatch-model.cjs` generalization — how does config drive model/provider selection, what is the exact config schema for `modelBenchmarkConfig`, and what is the wiring path from `loop.cjs`'s `mode` to the resolved dispatcher?

Research Topic: How should we implement the deep-agent-improvement model-benchmark mode designed in 001? Define exact interface contracts for the three pluggable seams (candidate-source, dispatcher, scorer); generalize 120/003 dispatch-minimax.cjs into a model-agnostic dispatch-model.cjs; port the 120/003 eval-rig scorer + 5-dim rubric cleanly; wire a mode switch (agent-improvement | model-benchmark) into loop.cjs without regressing agent-improvement; backward-compat test strategy; implementation edge cases. Output per-seam interface contracts + a wiring/backward-compat build-delta list.
Iteration: 2 of 10
Focus Area: Q2: Design the `dispatch-model.cjs` generalization — how does config drive model/provider selection, what is the exact config schema for `modelBenchmarkConfig`, and what is the wiring path from `loop.cjs`'s `mode` to the resolved dispatcher?
Remaining Key Questions: - **Q2**: Generalize `dispatch-minimax.cjs` → `dispatch-model.cjs` — config schema and model/provider selection mechanism needs detailed design.
- **Q3**: Port eval-rig scorer + 5-dim rubric — the harness + deterministic checks need a clean import path; fixture coupling is the main risk.
- **Q4**: Wire mode switch into `loop.cjs` + reduce-state/converge/materialize without regressing agent-improvement.
- **Q5**: Backward-compat test strategy + concrete edge cases.
Last 3 Iterations Summary: run 1: Q1: Define exact interface contracts for the three pluggable (0.35)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/iterations/iteration-002.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/deltas/iter-002.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
