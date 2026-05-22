# Deep Research Strategy: CLI Process Memory Leak Deep Research

## Research Topic

Find memory leaks, orphan process buildup, and process containment failures in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit` and related cli-X deep-flow orchestration.

## Known Context

- Spec packet: `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research`.
- The run is explicitly authorized in auto mode.
- The swap preflight was intentionally bypassed by operator instruction after recording `vm.swapusage` at 43,028.31M used of 44,032.00M and `Pages free` at 2,237,885.
- `claude-opus-4-7` preflight returned `CLAUDE_PREFLIGHT_OK`.
- `codex exec --model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast"` preflight returned `CODEX_PREFLIGHT_OK`.
- `resource-map.md` not present; skipping coverage gate.

## Key Questions

- [ ] Which system-spec-kit command, MCP, or memory paths can spawn long-lived child processes without cleanup?
- [ ] Which deep-research, deep-review, council, or cli-X workflows can produce nested CLI process storms?
- [ ] Where are self-invocation guards, timeout handling, signal handling, stale-lock handling, and cleanup traps missing or inconsistent?
- [ ] Which sidecars or helpers are expected daemons versus unexpected leftovers after an iteration?
- [ ] What verification would prove each proposed fix actually reduces process buildup or memory pressure?

## Next Focus

Iteration 001: inventory system-spec-kit process-spawn entrypoints, background execution patterns, and cleanup ownership.

## Exhausted Approaches

- None yet.

## What Worked

- Executor preflight confirmed both requested model routes are reachable.

## What Failed

- Initial memory preflight would have blocked on swap saturation, but the operator explicitly overrode it.

## Research Rules

- One CLI invocation at a time.
- Each iteration writes exactly one `iterations/iteration-NNN.md`, one `deltas/iter-NNN.jsonl`, and one appended iteration record in `deep-research-state.jsonl`.
- Every finding needs `[SOURCE: path:line]` or `[INFERENCE: ...]`.
- Do not implement fixes during research.
