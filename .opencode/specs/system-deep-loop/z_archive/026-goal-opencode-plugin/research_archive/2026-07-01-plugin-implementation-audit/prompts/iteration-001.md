DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 15
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: mk-spec-memory MCP unavailable in this Claude Code dispatch session; relying on strategy.md Known Context (archived prior design synthesis) as the standing prior-context surface.
Next focus: ## 11. NEXT FOCUS
Iteration 1: Establish ground truth. Read all 8 in-scope phase folders' `spec.md`/`plan.md`/`tasks.md` (001-state-store through 008-system-spec-kit-integration) plus the shipped `.opencode/plugins/mk-goal.js`, `.opencode/commands/opencode_goal.md`, and produce a first-pass phase-by-phase drift map (planned vs shipped, one row per phase). Do NOT open phase 009.

Research Topic: Audit the shipped /goal OpenCode plugin implementation in packet system-deep-loop/032-goal-opencode-plugin (phases 001-state-store through 008-system-spec-kit-integration only; EXCLUDE phase 009-speckit-command-goal-prompt-offer, which is actively owned by a separate in-flight OpenCode session and must not be touched or read as in-scope). Investigate drift between what was planned (each phase's spec.md/plan.md/tasks.md, and the original design synthesis at research_archive/2026-06-28-goal-design-synthesis/research.md) and what was actually built (.opencode/plugins/mk-goal.js, .opencode/commands/opencode_goal.md, the mk-goal-*.test.cjs suite, .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md), refinement needed, missing upgrades, and new additions required to make the /goal plugin feature-complete, fully integrated, low-friction UX, safely automated, and flawless.

ANTI-CONVERGENCE: do not stop early; target at least 10 proper iterations, each adding genuine novelty (new phase examined, new drift class, new UX gap, new automation/safety gap). Do not converge before iteration 10 unless every avenue is genuinely exhausted. Under convergence pressure before iteration 10, rotate to an unexamined phase/file/comparison axis instead of stopping.
Iteration: 1 of 15
Focus Area: ## 11. NEXT FOCUS
Iteration 1: Establish ground truth. Read all 8 in-scope phase folders' `spec.md`/`plan.md`/`tasks.md` (001-state-store through 008-system-spec-kit-integration) plus the shipped `.opencode/plugins/mk-goal.js`, `.opencode/commands/opencode_goal.md`, and produce a first-pass phase-by-phase drift map (planned vs shipped, one row per phase). Do NOT open phase 009.
Remaining Key Questions: - [ ] For each phase 001-008, does the shipped code (`mk-goal.js`, `opencode_goal.md`, test suite, `goal_plugin.md`) match what that phase's `spec.md`/`plan.md`/`tasks.md` specified — where is the drift, and is it a regression, an intentional improvement, or an unresolved gap?
- [ ] Does the shipped implementation faithfully realize the 9 resolved design forks from the original design synthesis (autonomy tier, scope/keying, state store, budget governance, completion detection, status set, surfacing substitute, command style, reuse vs standalone)?
- [ ] What refinements, missing upgrades, or safety/automation gaps exist in the current `/goal` plugin that block it from being feature-complete and low-friction (UX rough edges, error handling, edge cases, race conditions)?
- [ ] Is the system-spec-kit integration (`goal_plugin.md` hook doc + any `_memory.continuity` / spec-folder wiring) complete, consistent, and low-friction — does it correctly interoperate with the rest of the plugin ecosystem (`mk-spec-memory.js` patterns, event hooks, session lifecycle)?
- [ ] What new additions — beyond anything originally planned — does the actual shipped code reveal are needed for the `/goal` plugin to be genuinely flawless (issues discoverable only by reading real code, not anticipated at design time)?
Carried-Forward Open Questions:
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
Last 3 Iterations Summary: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/iterations/iteration-001.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deltas/iter-001.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
