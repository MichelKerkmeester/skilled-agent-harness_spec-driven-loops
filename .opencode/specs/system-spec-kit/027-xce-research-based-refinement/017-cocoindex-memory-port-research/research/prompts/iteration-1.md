# Deep-Research Iteration Prompt Pack — 027/013 cocoindex-memory-port-research

You are operating as the `@deep-research` LEAF agent via cli-codex (model=gpt-5.5, reasoning=high, service_tier=fast). You have read+write access to the workspace.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/11 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Establish ground truth on both tracks in parallel before deep axis investigation. Specifically — (1) Track 1 baseline reads of `external/cocoindex-main/python/cocoindex/_internal/memo_fingerprint.py`, `rust/core/src/state/stable_path.rs`, `python/cocoindex/connectorkits/statediff.py`; (2) Track 2 baseline reads of `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (top 200 lines) + `rg -n 'mcp__mk_spec_memory__'` callsite count; (3) cross-check `handlers/memory-index.ts` (top 80 lines) and `lib/search/vector-index-schema.ts` (causal_edges section).

Research Topic: cocoindex-main → spec_kit_memory MCP port (causal graph, memory database, automatic indexing, embedding pipeline) + MCP tool-namespace shortening from mcp__mk_spec_memory__* to mk_*

Iteration: 1 of 10
Focus Area: Iteration-1 ground truth — read cocoindex-main canonical reference files + spec_kit_memory MCP target files; produce per-axis "what's there" + "what we have" notes so iterations 2-9 can dive into specific port hypotheses.

Remaining Key Questions:
- K1.1: Does cocoindex-main's memoization + dependency-DAG pattern transfer cleanly to TypeScript+SQLite?
- K1.2: Can ChildExistence + ChildComponentTombstone lifecycle port to causal_edges table?
- K1.3: Can statediff.py's (desired, prior) → action model replace ad-hoc post-mutation hooks?
- K1.4: Should spec-doc embeddings be chunked with per-chunk fingerprint?
- K1.5: Can causal edges be auto-derived via multi-phase entity resolution?
- K1.6: Confirm query intelligence is non-port axis.
- K2.1: Where does mcp__ prefix come from? Cross-runtime convention?
- K2.2: Does mk_* survive regex constraints across runtimes?
- K2.3: Drop memory_* from tool names when server renames?
- K2.4: Callsite count for migration cost ceiling.
- K2.5: Final naming recommendation matrix.

Last 3 Iterations Summary: none yet (this is iteration 1)

## STATE FILES

All paths are relative to the repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

- Config: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deltas/iter-001.jsonl`

## TARGET FILES TO READ (iteration 1 baseline)

### cocoindex-main (upstream library — source of port ideas):
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/README.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/python/cocoindex/_internal/memo_fingerprint.py`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/rust/core/src/state/stable_path.rs`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/python/cocoindex/connectorkits/statediff.py`

### spec_kit_memory MCP (target system — current state):
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (top 200 lines + grep for `mcp__mk_spec_memory__` prefix)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` (top 80 lines)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` (causal_edges section ~lines 600-650)

### Project context:
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/spec.md` (this packet's spec)
- `CLAUDE.md` (project-level instructions, especially §1 routing + §6 MCP routing — relevant to Track 2 namespace question)

### Track 2 callsite count:
```bash
rg -n 'mcp__mk_spec_memory__' --type-add 'doc:*.md' -t doc -t ts -t json -t sh -c | awk -F: '{sum+=$NF} END {print sum}'
```

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization. You write to iteration narrative + state.jsonl + delta file; reducer refreshes everything else.
- Iteration 1 is BASELINE — not deep-dive. Catalog what's there + what we have per axis. Iterations 2-9 will dive into specific port hypotheses.
- Cite verbatim file:line for every concrete claim.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/iterations/iteration-001.md`. Structure:
   - `# Iteration 1 — Ground Truth Baseline`
   - `## Focus`
   - `## Actions Taken` (file reads, grep commands, line-range cites)
   - `## Findings` (per-axis: K1.1, K1.2, K1.3 ground truth from cocoindex side; K2.1, K2.4 ground truth from our side; observations only — defer hypotheses to iter-2+)
   - `## Questions Answered` (any K-questions definitively answered this iter)
   - `## Questions Remaining` (all 11 if nothing answered)
   - `## Next Focus` (recommended focus for iteration 2)

2. **Canonical JSONL iteration record** appended to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deep-research-state.jsonl`. Single-line JSON, newline terminator. Schema:
   ```json
   {"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"ground-truth-baseline","keyQuestions":["K1.1","K1.2","K1.3","K1.4","K1.5","K1.6","K2.1","K2.2","K2.3","K2.4","K2.5"],"answeredQuestions":[],"durationMs":<actual>,"timestamp":"<iso>","sessionId":"027-013-cocoindex-port-2026-05-13","generation":1,"graphEvents":[...]}
   ```
   - `newInfoRatio`: estimate 0.7-0.9 for iteration 1 (high info — everything is new)
   - `status`: `insight` if substantive findings, `thought` if just orientation
   - `graphEvents`: include nodes for each canonical reference file you actually read, edges for `READS_FROM` relationships

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/deltas/iter-001.jsonl`. One iteration record + one record per finding/observation/edge.

All three artifacts are REQUIRED. post_dispatch_validate fails the iteration otherwise.

## STOP CONDITIONS (this iteration)

- Time: ≤ 10 minutes wall clock (configurable via maxMinutesPerIteration).
- Tool calls: ≤ 12.
- Tokens: target ≤ 30K output (this is a baseline iteration; depth comes in iter 2-9).

Go.
