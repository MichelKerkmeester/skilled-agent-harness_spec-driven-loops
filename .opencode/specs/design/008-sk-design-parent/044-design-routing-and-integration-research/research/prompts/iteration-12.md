DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto):
Iteration 12 of 50 | NON-CONVERGING (convergence is a signal, not a stop) | last ratio: 0.64
Active angle: [D2-8/D2] mode-internal sub-skills invisible at command layer (interface's 11 routed resources) — promote top ones to args/sibling commands? (corpus: impeccable-main)
Executor: cli-codex gpt-5.5 xhigh fast. Sandbox: workspace-write (write ONLY under the research packet).

Research Topic: sk-design routing+integration enforcement (50 non-converging iterations)
Iteration: 12 of 50
Focus Area: NON-CONVERGING 50-iteration run improving the sk-design design family AND designing the enforcement that guarantees routing/utilization. RESEARCH ONLY — the only files you write are the three research artifacts (iteration-NNN.md, the iter-NNN.jsonl delta, and a strategy touch). NEVER edit live sk-design / commands / mcp-open-design / cli-* content.

This iteration researches ONE angle (below). Go deep on it; do NOT re-cover prior angles (check your prior iteration files). Read the REAL on-disk files and VERIFY every claim against them — a finding is a hypothesis until the cited file is opened. Targets by dimension: D1 corpus craft under .opencode/specs/design/008-sk-design-parent/external/impeccable-main (then .opencode/specs/design/008-sk-design-parent/external/designer-skills-main); D2 the /design:* command files at .opencode/commands/design/ + sk-design mode-registry.json; D3 .opencode/skills/sk-design/SKILL.md + mode-registry.json + shared/context_loading_contract.md + the deep-improvement skill-benchmark scripts; D4 .opencode/skills/mcp-open-design/SKILL.md + references/tool_surface.md + sk-design proof cards; D5 .opencode/skills/cli-{opencode,codex,claude-code}/SKILL.md + the agent-io-contract + context_loading_contract.

For this angle, produce: the concrete finding(s), each traced to a real file + line; the BUILDABLE recommendation (what to add/change later, where); and an ENFORCEABLE-vs-ADVISORY label (deterministically enforceable on a test corpus, or intrinsically advisory at runtime). End your delta with a canonical {"type":"iteration",...} record carrying a newInfoRatio estimate. Convergence does NOT stop this run; just report it.

THIS ITERATION'S ANGLE [D2-8 / D2] (corpus: impeccable-main):
mode-internal sub-skills invisible at command layer (interface's 11 routed resources) — promote top ones to args/sibling commands?
Remaining Key Questions: - See strategy Section 3 (Q1-Q5).
Carried-Forward Open Questions:
Advancing the angle bank; current angle D2-8.
Last 3 Iterations Summary: run 9: [D2-5/D2] /design:* failure modes/preconditions un (0.6); run 10: [D2-6/D2] command-as-mode vs command-as-task frami (0.57); run 11: [D2-7/D2] granularity gap: which high-value task v (0.64)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md
- Registry: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-012.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deltas/iter-012.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-012.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deltas/iter-012.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
