DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 0/6 answered | Last focus: Trace the embedding-status state machine end-to-end. Map every code path that writes embedding_status across retry-manager, reindex, and embedder_set/embedder-status handlers.
Last 2 ratios: N/A -> 0.74 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?

<!-- /ANCHOR:next-focus -->

Research Topic: mk-spec-memory embedding-backlog drain and daemon-config investigation: why a bulk re-embed cannot drive all rows to embedding_status=success (retry-queue retention parking, reindex/embedder_set status-commit interaction, daemon env-config-reload + worker respawn)
Iteration: 2 of 10
Focus Area: Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?

<!-- /ANCHOR:next-focus -->
Remaining Key Questions: - [ ] Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?
- [ ] Q2: Does the retry-manager ever embed clean `pending` rows (retry_count=0), or only drain its own retry queue? What component is responsible for the initial `pending -> success` transition vs `pending -> retry/failed`?
- [ ] Q3: How does `reindex --force` decide what to (re)embed, and why does it report `Indexed/Updated: 0` and skip rows already marked `failed`? Is status reset part of `--force`?
- [ ] Q4: What does `embedder_set(name)` actually do — does it write vectors to the shard, commit `embedding_status`, and flip the active pointer only on full success? Where can statuses fail to "stick"?
- [ ] Q5: What is the daemon lifecycle (`mk-spec-memory-launcher.cjs` + IPC bridge + worker processes)? Does it reload env config on `/mcp` reconnect or only on full process restart? Why do killed stale workers respawn with stale config?
- [ ] Q6: What is the minimal, reproducible operator procedure (correct restart + env + embed trigger) that drives a large backlog to 0 failed / 0 pending without re-parking — and should the cap(1000)/max-age(24h) defaults change?
Last 3 Iterations Summary: run 1: Trace the embedding-status state machine end-to-end. Map every code path that writes embedding_status across retry-manager, reindex, and embedder_set/embedder-status handlers. (0.74)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-002.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deltas/iter-002.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
