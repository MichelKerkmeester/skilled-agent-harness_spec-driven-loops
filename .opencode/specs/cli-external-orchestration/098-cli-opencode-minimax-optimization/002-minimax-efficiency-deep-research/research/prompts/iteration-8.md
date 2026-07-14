DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 8 of 10
Questions: 5/5 answered; hardening phase | Last focus: --variant ablation rig + output-verification recipe
Last 2 ratios: 0.42 -> 0.36 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Stress-test routing heuristics on concrete task scenarios; finalize the sk-prompt-models pattern-index rows + a routing decision table.

Research Topic: How can we improve/update sk-prompt-models and cli-opencode to make best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API provider? Extend the 114 small-model infrastructure rather than rebuilding it. Output concrete file-level deltas for sk-prompt-models and cli-opencode.
Iteration: 8 of 10
Focus Area: HARDENING: Stress-test the MiniMax-vs-others routing heuristics against concrete task scenarios (e.g. 180k-token multi-file review; tight cheap edit; cost-sensitive batch; Cognition-Pro-exhausted fallback). For each scenario name the model the heuristic picks and why. Then finalize the EXACT new rows for sk-prompt-models/references/pattern-index.md (which MiniMax patterns, pointing to which canonical files) and a compact routing decision table suitable for the cross-CLI quality card. Confirm the pattern-index format by reading the current pattern-index.md (14 rows).
Remaining Key Questions: Hardening: routing-heuristic scenario stress-test; finalize pattern-index.md MiniMax rows + routing decision table. (All 5 primary questions answered.)
Last 3 Iterations Summary: run 5: Q5 routing + consolidated deltas (0.50); run 6: validation/reconcile vs actual files (0.42); run 7: --variant ablation rig + output-verification recipe (0.36)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deltas/iter-008.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-008.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deltas/iter-008.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
