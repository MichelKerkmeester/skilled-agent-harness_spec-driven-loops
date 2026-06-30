DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 (mine loop-cli-main) | Iteration: 1 of 58
Questions: 0/12 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: [S1-01] loop-cli-main persisted remaining-delay crash-resume.

Research Topic: Mine two vendored reference repos (read-only) to produce a ranked, actionable backlog of improvements to OUR loop systems (deep-loop-runtime, deep-loop-workflows, system-spec-kit commands/agents, skill interconnection, UX, automation). Dimensions D1 source-mining / D2 target-mapping / D3 cross-cutting / D4 synthesis. Every finding: reference file:line + exact OUR target file + port-difficulty + quick-win/deep-rewrite tag.

Reference repos (read-only, absolute paths):
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper

Iteration: 1 of 58
Dimension this iteration: D1 (source-mining)
Focus Area: [S1-01] How does loop-cli-main persist `remainingDelayMs` (src/core/loop-controller.ts, waitForDelay) and reconstruct a partially-elapsed wait after a crash without restarting the interval? Name the exact OUR target file it would improve (start with deep-loop-runtime/scripts/fanout-run.cjs and the loop-lock/atomic-state layer).

Remaining Key Questions (Segment S1 — mine loop-cli-main):
- [S1-01] persisted remainingDelayMs crash-resume (loop-controller.ts:waitForDelay) -> fanout-run.cjs
- [S1-02] abortable chunked sleep + AbortSignal.any (shared/sleep.ts, SLEEP_CHUNK_MS) -> runtime sleep primitive
- [S1-03] triggerNow() save/restore + double-run guard -> deep_research_auto.yaml run-now control
- [S1-04] state machine transitions + resumeResolve gating (loop-controller.ts) -> runtime lifecycle
- [S1-05] interval overrun catch-up + skippedCount -> iteration cadence
- [S1-06] byte-offset log slicing (log-parser.ts, runHistory[].logOffset) -> iteration logging
- [S1-07] conditional task chaining (onSuccess/onFailure, chainGroupId) -> fallback-router.ts
- [S1-08] serialize-diff persistence (daemon/state.ts) -> atomic-state.ts
- [S1-09] socket-bind single-flight (daemon/server.ts) -> loop-lock.ts
- [S1-10] code-signature stale-process restart (daemon/manager.ts) -> process management
- [S1-11] typed discriminated-union IPC (client/ipc.ts, types.ts) -> script stdout contracts
- [S1-12] AGENTS.md WAVE MODEL (push-assignment, depends_on, disjoint globs) -> fanout-run.cjs

Carried-Forward Open Questions:
[None yet]

Last 3 Iterations Summary: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/deep-research-config.json
- State Log: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization. Do NOT edit deep-research-strategy.md.
- Do not implement fixes during research. Report findings only; implementation is a separate follow-up step.
- This iteration's dimension is D1: source-mine the loop-cli-main mechanism in the Focus Area, with a real file:line citation, then name the exact OUR target file it maps to and why it would help (one line). Stay focused on S1-01; you may note adjacent S1 observations but do not sprawl.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type,id,label,relation?,source?,target?}` objects representing coverage-graph nodes/edges discovered this iteration (e.g. a FINDING node, a SOURCE node for the cited file, an edge MAPS_TO our target file). Omit when none.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. A post-validate step emits a `schema_mismatch` conflict if any is missing or malformed.

1. **Iteration narrative markdown** at `.../research/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. In Findings, give: the loop-cli-main mechanism with file:line evidence; the exact OUR target file; a port-difficulty estimate (easy/med/hard); and a quick-win vs deep-rewrite tag.

2. **Canonical JSONL iteration record** APPENDED to the State Log. The record MUST use `"type":"iteration"` EXACTLY. Required schema:
`{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<complete|insight|thought|stuck>","focus":"S1-01","graphEvents":[/* optional */]}`
Append as single-line JSON with a trailing newline: `echo '<single-line-json>' >> <State Log>`. Do NOT pretty-print. It MUST land in the state-log file (not just stdout). Do NOT write the `executor` block — the workflow owns executor provenance.

3. **Per-iteration delta file** at `.../research/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event records (one per finding/observation/graphEvent/ruled_out), each on its own JSON line.

All three artifacts are REQUIRED. `newInfoRatio` should reflect how much genuinely new information this iteration produced (1.0 = all new; near 0 = nothing new).
