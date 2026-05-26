DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent investigating what a large deprecation arc may have MISSED. Do focused file-based investigation (Grep/Glob/Read/Bash), then write the three required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Sweep live code surfaces for dangling/dead couplings to the removed modules.

Research Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss? Residual couplings/references to removed CocoIndex/cross-encoder/rerank-sidecar, capability gaps, behavioral regressions in memory-search/confidence/council, and doc inaccuracies across all touched surfaces.
Iteration: 1 of 10
Focus Area: Sweep the LIVE code surfaces (memory MCP `.opencode/skills/system-spec-kit/mcp_server`, code-graph `.opencode/skills/system-code-graph`, advisor `.opencode/skills/system-skill-advisor`) for dangling/dead couplings to the removed CocoIndex / cross-encoder / rerank-sidecar. Grep for: `cocoIndex`, `cocoindex`, `cross-encoder`, `crossEncoder`, `rerankerScore`, `rerankerApplied`, `[^a-z]ccc[^a-z]`, `sidecar`, `positional_scoring`, `vector channel`, `RerankGate`. For each LIVE-code hit (exclude .md docs, benchmarks/, z_archive/, changelog/), Read the surrounding code and classify: DEAD (unreachable/never-set — fine) vs LIVE-STRANDED (a real coupling/branch that still executes and references a removed thing — a MISS). Verify the build is still coherent (no dangling imports to deleted modules: cross-encoder.ts, local-reranker.ts, reranker.ts, rerank-gate.ts).
Remaining Key Questions:
- Q1: hidden LIVE runtime couplings to removed CocoIndex/cross-encoder/rerank-sidecar in code
- Q2: residual refs in non-obvious surfaces (4-runtime mirrors, MCP configs, runtime JSON, hooks, .gitignore)
- Q3: capability gap from removing semantic code search + LLM reranker
- Q4: behavioral regressions (memory-search/confidence/council)
- Q5: stale/contradictory docs surviving the alignment
Last 3 Iterations Summary: none yet (iteration 1)

## STATE FILES

All paths are relative to the repo root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public).

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deltas/iter-001.jsonl

## KNOWN CONTEXT (do not re-discover; build on this)

- CORE removal in 014/003 (commit b564013c0e): deleted mcp_server/lib/search/{cross-encoder,local-reranker,reranker,rerank-gate}.ts + 7 tests; stripped stage3 Step-1; removed isCrossEncoderEnabled/isRerankerExpected + RerankGateDecision.
- 017 cleanup (74515e11f7): confidence-scoring reranker_boost/hasRerankerSignal/rerankerScore/rerankerApplied/WEIGHT_RERANKER removed (now 3-factor); result-explainability reranker_support removed; decision-audit rerankTriggerRate removed.
- CocoIndex/ccc/mcp-coco-index DELETED; system-code-graph is now tree-sitter structural (NO embeddings). MMR diversity reranker (SPECKIT_MMR) is KEPT and is correct (algorithmic, not an LLM model).
- A prior 30-surface deep-REVIEW already ran (013-post-deprecation-deep-review). Look for what IT missed; do not just re-cover it.
- KEPT exceptions that are NOT misses: frozen benchmarks/, z_archive/, changelogs, embedder_pluggability decision rationale, process-sweep/RM-8 coco/rerank kill patterns, cli-* `pkill ccc search`, `PipelineRow.rerankerScore` (documented harmless-unused), `scoringMethod`.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization — do NOT edit strategy/registry/dashboard.
- Report findings only; implementation is a separate follow-up.
- Classify every hit: DEAD (fine) vs LIVE-STRANDED (a real miss). Prefer evidence (file:line + the actual code) over assertion. False positives waste a later remediation; only call something a MISS if you read the code and confirmed it's live + stranded.

## OUTPUT CONTRACT — produce ALL THREE artifacts

1. **Iteration narrative** at `.../research/iterations/iteration-001.md` with headings: Focus, Actions Taken, Findings (each finding: severity P0/P1/P2/INFO + file:line + evidence + DEAD-or-LIVE classification), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED (>>) to `.../research/deep-research-state.jsonl`, EXACT `"type":"iteration"`:
```
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}
```
Append as a single line with `echo '<json>' >> <state-log>`. Do not pretty-print.

3. **Delta file** at `.../research/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` line (same as #2) PLUS one structured line per finding (`{"type":"finding","id":"f-iter001-NNN","severity":"P1","label":"...","iteration":1}`) and per ruled-out direction (`{"type":"ruled_out","direction":"...","reason":"...","iteration":1}`).

All three are REQUIRED. Begin the investigation now.
