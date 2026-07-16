# Iteration 001 — Live Code Surface Sweep

## Focus

Sweep the LIVE code surfaces (memory MCP `mcp_server/`, code-graph `system-code-graph/`, advisor `system-skill-advisor/`) for dangling/dead couplings to removed CocoIndex / cross-encoder / rerank-sidecar. Grep for: `cocoIndex`, `cross-encoder`/`crossEncoder`, `rerankerScore`/`rerankerApplied`/`RerankGate`, `\bccc\b`, `sidecar`, `positional_scoring`, `vector channel`. Classify every hit as DEAD or LIVE-STRANDED.

## Actions Taken

1. **Grep `cocoIndex`/`cocoindex`/`CocoIndex`** across all three skills' `.ts` files → **ZERO hits** in live code. CocoIndex references only survive in JSON fixtures (benchmarks, test corpus data, historical DB logs — all documented kept exceptions).
2. **Grep `cross-encoder`/`crossEncoder`/`CrossEncoder`** across all three skills' `.ts` files → 21 hits in test files + 2 hits in production code (`tool-schemas.ts`, `stage3-rerank.ts`). Read all production hits.
3. **Grep `rerankerScore`/`rerankerApplied`/`RerankGate`** → 1 hit in `search-results.ts:872`. No hits in code-graph or advisor. Verified no dangling imports to deleted modules.
4. **Grep `\bccc\b`** in all skills' `.ts` files → **ZERO hits** in live `.ts` code.
5. **Grep `sidecar`** in `mcp_server/lib` → All hits are about the embedder sidecar worker (embedding process), NOT the rerank sidecar. Correct and live.
6. **Grep `positional_scoring`/`vector channel`** → All hits are about the FTS/hybrid-search vector channel, NOT about CocoIndex. Correct.
7. **Read all production hits in full context** to classify DEAD vs LIVE-STRANDED.
8. **Checked for dangling imports** to deleted modules (`cross-encoder.ts`, `local-reranker.ts`, `reranker.ts`, `rerank-gate.ts`) → **ZERO dangling imports**. All MMR-related imports are correct (`@spec-kit/shared/algorithms/mmr-reranker`).
9. **Discovered a stale test assertion** in `sidecar-hardening.vitest.ts:545` during deep read of `RECOGNIZED_SPECKIT_ENV_VARS`.

## Findings

### Finding 1: P1 — `rerank` parameter description in tool-schemas.ts still claims cross-encoder

- **Severity:** P1
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:132-136`
- **Evidence:** The `rerank` parameter description reads: `"Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation."`
- **Classification:** **LIVE-STRANDED** — This is the public MCP tool schema for `memory_search`, exposed to all MCP callers (AI models, agents, etc.). The `rerank` parameter still exists and defaults to `true`, but it now controls MMR diversity reranking (`stage3-rerank.ts:124`), not cross-encoder reranking. The description is materially wrong — it promises a removed feature. All callers reading the schema will be misled about what this parameter does.
- **Impact:** External callers inspecting the tool schema see a description that references a non-existent feature. The actual behavior (MMR diversity reranking when `rerank=true`) is correct but undocumented in the schema.

### Finding 2: P1 — Test assertion `RECOGNIZED_SPECKIT_ENV_VARS` expects `SPECKIT_CROSS_ENCODER` which was removed

- **Severity:** P1
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:545`
- **Evidence:** The test asserts `expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_CROSS_ENCODER')` but `RECOGNIZED_SPECKIT_ENV_VARS` (at `sidecar-client.ts:191-200`) no longer includes this entry — it was correctly removed as part of the cross-encoder deprecation. The test assertion was NOT updated.
- **Classification:** **LIVE-STRANDED** — This test will FAIL when executed. It's a stale assertion that expects a removed env var to still be present in the recognized-vars constant.
- **Impact:** Broken test in the sidecar hardening suite. The test should be updated to remove the `SPECKIT_CROSS_ENCODER` assertion since it was intentionally removed from the recognized vars.

### Finding 3: P2 — `RerankProvider` type still includes `'cross-encoder'` variant

- **Severity:** P2
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:89`
- **Evidence:** `type RerankProvider = 'cross-encoder' | 'fallback-sort' | 'none';` — The `'cross-encoder'` variant is never assigned in production code (line 118 always sets `'none'`). The JSDoc at lines 96-98 says "Applies cross-encoder reranking (if enabled)" and "cross-encoder scores are computed on the raw chunks" — both statements are false.
- **Classification:** **DEAD** — The type variant is dead code (never used) and the JSDoc is stale. The actual behavior at line 117-118 (`const rerankApplied = false; const rerankProvider: RerankProvider = 'none'`) correctly reflects the removed feature. The type variant and JSDoc are cosmetic/confusing but do not cause runtime misbehavior.
- **Impact:** Low. A developer reading this code could be confused about what features are still active. The JSDoc should be updated and the dead type variant pruned.

### Finding 4: P2 — `rerankerScore` field in trace output always null

- **Severity:** P2
- **File:** `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:872`
- **Evidence:** `rerank: toNullableNumber(rawResult.rerankerScore)` — The `rerankerScore` property is never set by the pipeline (confirmed: no `rerankerScore` anywhere in `lib/search/`). This field in the `MemoryResultScores` interface (line 119) will always resolve to `null` via `toNullableNumber`.
- **Classification:** **DEAD** (documented kept exception) — The field is always null but the response shape is preserved to avoid breaking API consumers. This was a known kept exception in the 017 cleanup. Removing it would be a breaking API change. Consistent with the documented "harmless-unused" exception for `PipelineRow.rerankerScore`.
- **Impact:** Negligible. Always-null field in the trace scores sub-object. Could be cleaned up in a future API version bump.

### Finding 5: INFO — V1 hybrid-search tests still set `SPECKIT_CROSS_ENCODER='false'`

- **Severity:** INFO
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1301-1390`
- **Evidence:** Tests T316 (line 1303) and T024 (line 1390) set `process.env.SPECKIT_CROSS_ENCODER = 'false'` and preserve/restore it. The env var is no longer read by any production code.
- **Classification:** **DEAD** — Setting an env var that nothing reads is harmless. The V1 hybrid-search pipeline is being phased out. These test lines are noise but do not break anything.
- **Impact:** Negligible. Dead env var manipulation in tests. Could be cleaned up as part of V1 pipeline removal.

### Finding 6: INFO — `doctor-update.last-run.json` contains historical cocoindex log entry

- **Severity:** INFO
- **File:** `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json:12`
- **Evidence:** `{"name": "cocoindex", "phase": 5, "exit": 0, "rows": "daemon respawned via shell (MCP -32000 prevented MCP-driven reindex); native ccc index in flight"}`
- **Classification:** **DEAD** — Historical log file from a previous `/doctor:update` run. Not live code. The entry references the cocoindex daemon from before its removal.
- **Impact:** None. This is a historical artifact, not a live coupling.

### Finding 7: INFO — Eval ground-truth.json references cross-encoder in historical queries

- **Severity:** INFO
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:155,795`
- **Evidence:** Two eval queries ask about cross-encoder decisions: "what was decided about removing the cross-encoder configuration from search-weights.json" (line 155) and "was there ever a decision to deprecate the cross-encoder reranker" (line 795).
- **Classification:** **DEAD** — These are historical evaluation queries that test whether the search system can find documentation about the deprecation decision. The queries are valid — they test knowledge retrieval about a real historical event. Not live couplings to removed code.
- **Impact:** None. These are correct eval queries about historical system knowledge.

### Finding 8: INFO — Search quality stress test corpus references `'rerank-gate'`

- **Severity:** INFO
- **File:** `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:24,109`
- **Evidence:** The `SearchQualityCase.source` type union includes `'rerank-gate'` and a W4 test case uses `source: 'rerank-gate'` with notes mentioning "conditional rerank." The rerank-gate feature was removed.
- **Classification:** **DEAD** — Test corpus data referencing a removed feature concept. The test case (line 107-117) is a fixture in a static corpus, not live production code. It references a W4 "conditional rerank" workstream that was deferred/removed.
- **Impact:** Negligible. Dead test fixture. Could be cleaned up if the W4 workstream is formally closed.

## Questions Answered

- **Q1 (partial):** Found 2 LIVE-STRANDED hits (P1) in the MCP tool schema description and a stale test assertion. Zero LIVE couplings in code-graph or advisor skill surfaces. Zero dangling imports to deleted modules. The build is coherent — no `import` statement references any of the 4 deleted modules.
- **Q2 (partial):** Non-obvious surface sweep started — `.gitignore`, MCP configs, and 4-runtime mirrors not yet checked (planned for iteration 2 focus).

## Questions Remaining

- Q1: Confirm no additional hidden LIVE couplings in runtime JSON artifacts, `.gitignore`, hooks, or launcher scripts.
- Q2: Full sweep of 4-runtime mirrors (`.gemini/`, `.codex/`, `.claude/`) and MCP configs.
- Q3: Capability gap from removing semantic code search + LLM reranker (not yet addressed).
- Q4: Behavioral regressions (memory-search/confidence/council) — not yet addressed.
- Q5: Stale/contradictory docs — preliminary hits in tool-schemas.ts (P1 finding 1), but full doc sweep not yet done.

## Next Focus

Iteration 2: 4-runtime mirror + non-obvious surface sweep — check `.gemini/`, `.codex/`, `.claude/` settings, `opencode.json`, hooks, launcher scripts, `.gitignore`, and runtime JSON artifacts (skill-graph.sqlite, advisor state) for residual references. Also verify the P1 test failure in sidecar-hardening.vitest.ts by reading the test in full context.
