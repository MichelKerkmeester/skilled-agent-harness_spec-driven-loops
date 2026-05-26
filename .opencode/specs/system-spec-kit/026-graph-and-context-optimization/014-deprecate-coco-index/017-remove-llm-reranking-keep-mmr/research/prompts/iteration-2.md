DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent. Iteration 2 of 10. Report findings only; do NOT implement fixes. Build on iteration 1 — do not re-sweep live .ts code (already done, clean).

## STATE

STATE SUMMARY:
Segment 1 | Iteration 2 of 10
Questions: 0/5 fully answered (Q1 mostly answered in iter 1) | Last focus: live code sweep
Last 2 ratios: N/A -> 0.45 | Stuck count: 0
Next focus: non-obvious + 4-runtime surface sweep.

Research Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss?
Iteration: 2 of 10
Focus Area: Sweep the NON-OBVIOUS and 4-RUNTIME-MIRROR surfaces for residual LIVE references to the removed CocoIndex / cross-encoder / rerank-sidecar / ccc:
  (a) 4-runtime routing+config mirrors: `.gemini/` (GEMINI.md, settings.json), `.codex/` (AGENTS.md, config.toml, agents/), `.claude/` (CLAUDE.md, agents/), and root AGENTS.md/CLAUDE.md — do they still route to deleted MCP tools (e.g. `mcp__cocoindex_code__*`) or describe cross-encoder/ccc?
  (b) MCP configs: `opencode.json`, `.vscode/mcp.json`, `.mcp.json`, `.codex/config.toml`, `.devin/` — any coco/rerank server or dangling env?
  (c) hooks + launcher: `.github/hooks/`, `.opencode/scripts/` install/launcher scripts, `.gitignore` (stale `.cocoindex_code/`?).
  (d) runtime/DB JSON: advisor `skill-graph.json` (both scripts/ and database/ copies), `.advisor-state`, `.doctor-update.last-run.json`.
  Then VERIFY iteration-1 Finding-2: read `mcp_server/tests/embedders/sidecar-hardening.vitest.ts` around line 545 + `sidecar-client.ts:191-200` (RECOGNIZED_SPECKIT_ENV_VARS) in full and confirm whether the test actually fails (run it if cheap, else static-confirm). Classify every hit DEAD vs LIVE-STRANDED.

Remaining Key Questions: Q2 (non-obvious/4-runtime surfaces — THIS iteration), Q3 (capability gap), Q4 (regressions), Q5 (docs).
Last 3 Iterations Summary: iter 1: live-code sweep (newInfoRatio 0.45, insight) — 2 P1 LIVE-STRANDED (tool-schemas.ts rerank desc; sidecar-hardening.vitest.ts:545 stale assertion), 2 P2 DEAD, 4 INFO; zero dangling imports; build coherent.

## STATE FILES

All paths relative to repo root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public).

- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/findings-registry.json
- Read prior iteration: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/iterations/iteration-001.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deltas/iter-002.jsonl

## KNOWN CONTEXT (do not re-discover)

- CocoIndex/ccc/mcp-coco-index DELETED; system-code-graph = tree-sitter structural (NO embeddings), identity `mk_code_index`, 8 MCP tools. MMR diversity reranker (SPECKIT_MMR) KEPT (correct).
- Prior arcs ALREADY cleaned the 4-runtime mirrors of coco/ccc residue (014/006 runtime-configs-4runtime-mirror, 014/007 docs-readme, 015 cross-surface-residue, 016 residue-tail) + a 30-surface deep-review (013). So clean is the EXPECTED result here — your job is to find what those sweeps MISSED, especially live config/runtime-JSON wiring.
- KEPT exceptions (NOT misses): frozen benchmarks/, z_archive/, changelogs, embedder_pluggability decision rationale, process-sweep/RM-8 coco/rerank kill patterns, cli-* `pkill ccc search`, `PipelineRow.rerankerScore`, `scoringMethod`, always-null `rerankerScore` trace field (017 kept exception).
- iter-1 already covered live .ts code (clean) + found the 2 P1 above — do NOT re-report those; find NEW issues.

## CONSTRAINTS

- LEAF agent. No sub-agents. Target 3-5 actions, max 12 tool calls. Write all findings to files.
- Do NOT edit strategy/registry/dashboard (reducer-owned). Report findings only.
- Classify every hit DEAD vs LIVE-STRANDED with file:line + evidence. Only call a MISS if you read it + confirmed live+stranded. Cross-check against the KEPT exceptions before flagging.

## OUTPUT CONTRACT — produce ALL THREE artifacts

1. Narrative at `.../research/iterations/iteration-002.md` (headings: Focus, Actions Taken, Findings [severity + file:line + evidence + DEAD/LIVE], Questions Answered, Questions Remaining, Next Focus).
2. Append `>>` to `.../research/deep-research-state.jsonl` EXACT: `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line via echo).
3. Delta at `.../research/deltas/iter-002.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter002-NNN","severity":"...","label":"...","iteration":2}` per finding + `{"type":"ruled_out",...}` per ruled-out direction.

All three REQUIRED. Begin now.
