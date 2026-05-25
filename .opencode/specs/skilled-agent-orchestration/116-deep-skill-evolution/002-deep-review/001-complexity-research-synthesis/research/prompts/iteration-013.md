DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated continuation):
Segment: continuation | Iteration: 13 of 15
Prior completed iterations: 12
Last focus: Stress-test post-dispatch validation: what must fail, warn, or pass for findingsNew, findingDetails, searchLedger rows, evidenceRefs, dispositions, and versioned enforcement.
Last 2 ratios: 0.37 -> 0.34
Resource map: not present; skipping coverage gate
Next focus: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.

Research Topic: Stress-test all surfaced recommendations for making deep-review less surface-level: searchLedger, targetSelection, validator enforcement, reducer/dashboard/report persistence, graph/convergence gates, seeded tests, rollout thresholds, and implementation sequencing.
Iteration: 13 of 15
Focus Area: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.
Remaining Key Questions: - Which recommendation is likely to become checkbox theater unless constrained more tightly?
- What minimal schema proves real bug-search depth without overburdening trivial reviews?
- Which validator checks should be hard errors versus warnings during rollout?
- How should graphless runs prove equivalent search coverage?
- What seeded tests would fail on the current shallow workflow and pass after the follow-up implementation?
- Continuation focus for iteration 13: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.
Last 3 Iterations Summary: - Iteration 10: Final convergence pass: synthesize accumulated evidence, resolve weak claims, close remaining questions, and produce roadmap inputs; ratio=0.31; summary=Final convergence supports a stable diagnosis: focused deep-research finds more bugs because it preserves hypothesis search and ruled-out evidence, while deep-review preserves dimensions, severity, active findings, and verdicts more strongly than candidate generation. Highest-leverage remediation is a versioned searchLedger with targetSelection/searchCoverage, prompt-visible contract, post-dispatch validation, reducer/dashboard/report persistence, then graph/convergence expansion and seeded-bug tests. Remaining uncertainty is threshold calibration, not the core ordering.
- Iteration 11: Stress-test the versioned searchLedger and targetSelection recommendation: required fields, naming, minimal row shape, trivial-review exemptions, and backwards compatibility.; ratio=0.37; summary=The searchLedger recommendation is sound but needs tighter versioned enforcement: canonical searchLedger naming, explicit reviewDepthApplicability, targetSelection separate from scope discovery, minimal cited ledger rows, graphless fallback proof, legacy warn-only reads, and seeded tests that reject checkbox rows.
- Iteration 12: Stress-test post-dispatch validation: what must fail, warn, or pass for findingsNew, findingDetails, searchLedger rows, evidenceRefs, dispositions, and versioned enforcement.; ratio=0.34; summary=Post-dispatch validation needs a versioned hard-error/warn/pass profile: v2 complete standard/complex review rows should fail wrong severity-count shapes, shallow active findingDetails, absent or uncited searchLedger rows, invalid dispositions, broken finding links, missing target-selection proof, and state/delta drift; legacy, trivial, graphless-with-fallback, and non-complete rows need explicit warning/pass handling.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/iterations/iteration-013.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deltas/iter-013.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/iterations/iteration-013.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deltas/iter-013.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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

Spec folder: .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution (pre-approved, skip Gate 3).
Executor requirement: cli-codex gpt-5.5 xhigh fast. You are the research iteration worker, not the workflow manager.

Do not edit implementation files. Do not edit reducer-owned strategy, registry, dashboard, config, packet docs, or the final synthesis. Write only these artifacts for this iteration:
- .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/iterations/iteration-013.md
- append one canonical type=iteration JSONL record to .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deep-research-state.jsonl
- .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/deltas/iter-013.jsonl

Research scope for this continuation:
- Use the current synthesis at .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/research/research.md as the starting recommendation list.
- Re-read current local source files before making claims.
- Focus deeply on the iteration-specific recommendation cluster.
- Identify contradictions, overreach, missing fields, migration hazards, validation holes, and test gaps.
- Include file/path evidence in every finding using [SOURCE: path:line] when possible.
- If exact line numbers are unavailable from your tools, cite repo-relative file paths and section names, and be explicit.

Iteration narrative required headings:
# Iteration 013: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.
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
