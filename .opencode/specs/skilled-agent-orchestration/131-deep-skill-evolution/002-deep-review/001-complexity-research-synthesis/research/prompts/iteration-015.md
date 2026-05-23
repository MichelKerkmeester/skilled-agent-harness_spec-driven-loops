DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated continuation):
Segment: continuation | Iteration: 15 of 15
Prior completed iterations: 14
Last focus: Stress-test graph vocabulary and convergence gates: candidate saturation, BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST nodes, graphless fallback, and STOP_BLOCKED behavior.
Last 2 ratios: 0.28 -> 0.25
Resource map: not present; skipping coverage gate
Next focus: Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations.

Research Topic: Stress-test all surfaced recommendations for making deep-review less surface-level: searchLedger, targetSelection, validator enforcement, reducer/dashboard/report persistence, graph/convergence gates, seeded tests, rollout thresholds, and implementation sequencing.
Iteration: 15 of 15
Focus Area: Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations.
Remaining Key Questions: - Which recommendation is likely to become checkbox theater unless constrained more tightly?
- What minimal schema proves real bug-search depth without overburdening trivial reviews?
- Which validator checks should be hard errors versus warnings during rollout?
- How should graphless runs prove equivalent search coverage?
- What seeded tests would fail on the current shallow workflow and pass after the follow-up implementation?
- Continuation focus for iteration 15: Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations.
Last 3 Iterations Summary: - Iteration 12: Stress-test post-dispatch validation: what must fail, warn, or pass for findingsNew, findingDetails, searchLedger rows, evidenceRefs, dispositions, and versioned enforcement.; ratio=0.34; summary=Post-dispatch validation needs a versioned hard-error/warn/pass profile: v2 complete standard/complex review rows should fail wrong severity-count shapes, shallow active findingDetails, absent or uncited searchLedger rows, invalid dispositions, broken finding links, missing target-selection proof, and state/delta drift; legacy, trivial, graphless-with-fallback, and non-complete rows need explicit warning/pass handling.
- Iteration 13: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.; ratio=0.28; summary=Reducer/dashboard/report persistence is the fragile link: current reducer state is finding-centric, dashboard verdicts are severity-centric, ruled-out prose collapses clean proof with dead ends, report synthesis lacks a Search Ledger destination, and validation does not prove reducer survivability.
- Iteration 14: Stress-test graph vocabulary and convergence gates: candidate saturation, BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST nodes, graphless fallback, and STOP_BLOCKED behavior.; ratio=0.25; summary=Graph/convergence expansion is useful but must be ledger-led: current review graph schema and workflow discard BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST kinds, current graph signals cannot measure candidate saturation, graphless STOP behavior contradicts the docs, and blocked_stop needs named candidate/search gates before graph blockers can prove depth.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/iterations/iteration-015.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deltas/iter-015.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/iterations/iteration-015.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deltas/iter-015.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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


## CONTINUATION-SPECIFIC INSTRUCTIONS

Framework: CRISPE + TIDD-EC. CLEAR check passed: concrete task/files, explicit reasoning focus, exact output paths, ordered constraints, reusable pattern.

Spec folder: .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution (pre-approved, skip Gate 3).
Executor requirement: cli-codex gpt-5.5 xhigh fast. You are the research iteration worker, not the workflow manager.

Do not edit implementation files. Do not edit reducer-owned strategy, registry, dashboard, config, packet docs, or the final synthesis. Write only these artifacts for this iteration:
- .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/iterations/iteration-015.md
- append one canonical type=iteration JSONL record to .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deep-research-state.jsonl
- .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/deltas/iter-015.jsonl

Research scope for this continuation:
- Use the current synthesis at .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/research/research.md as the starting recommendation list.
- Re-read current local source files before making claims.
- Focus deeply on the iteration-specific recommendation cluster.
- Identify contradictions, overreach, missing fields, migration hazards, validation holes, and test gaps.
- Include file/path evidence in every finding using [SOURCE: path:line] when possible.
- If exact line numbers are unavailable from your tools, cite repo-relative file paths and section names, and be explicit.

Iteration narrative required headings:
# Iteration 015: Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations.
## Focus
## Actions Taken
## Findings
## Questions Answered
## Questions Remaining
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
## Recommended Next Focus

The state-log JSONL record must be one line and include at least: type, iteration, newInfoRatio, status, focus, findingsCount, summary, timestamp.
The delta file must include the same type=iteration record plus structured records for findings, observations, invariants, edges, or ruled_out directions.
