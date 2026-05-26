# Iteration 002 — Non-Obvious & 4-Runtime Mirror Sweep

## Focus

Sweep the NON-OBVIOUS and 4-RUNTIME-MIRROR surfaces for residual LIVE references to the removed CocoIndex / cross-encoder / rerank-sidecar:
(a) 4-runtime routing+config mirrors: `.gemini/`, `.codex/`, `.claude/`, root `AGENTS.md`/`CLAUDE.md`
(b) MCP configs: `opencode.json`, `.vscode/mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `.devin/`
(c) Hooks + launcher: `.github/hooks/`, `.opencode/scripts/`, `.gitignore`
(d) Verify iter-1 Finding-2 by reading `sidecar-hardening.vitest.ts:545` + `sidecar-client.ts:191-200`

## Actions Taken

1. **Swept `.gemini/`** — GEMINI.md (clean), settings.json (correct "35 tools"), agents/ (all clean), scripts/ (clean), commands/ (1 hit in `memory/search.toml`). Read full content of `memory/search.toml` — this is the Gemini runtime's `/memory:search` command prompt (~1000+ lines of model instructions). Found **major stale cross-encoder documentation** at multiple locations in the prompt body.
2. **Swept `.codex/`** — AGENTS.md (clean), config.toml (clean, no coco/reranker refs), agents/ (all clean), settings.json (clean), hooks.json (clean), policy.json (clean).
3. **Swept `.claude/`** — CLAUDE.md (clean), settings.json/settings.local.json (no coco/reranker refs), agents/ (all clean), mcp.json (correctly says "35 tools").
4. **Swept `.devin/`** — config.json has stale "39 tools" + Voyage reranker ref; config.local.json (minimal, clean); hooks.v1.json (clean).
5. **Swept MCP configs** — `opencode.json` (correctly updated: "35 tools", "cloud rerankers removed"), `.vscode/mcp.json` (stale: "39 tools" + Voyage reranker ref), `.claude/mcp.json` (correct: "35 tools"), `.codex/config.toml` (no coco/reranker refs).
6. **Swept hooks + scripts** — `.github/hooks/` (all clean), `.opencode/scripts/` (all clean), `.gitignore` (no stale `.cocoindex_code/`).
7. **Verified iter-1 Finding-2** — Read `sidecar-hardening.vitest.ts:530-569` and `sidecar-client.ts:185-214`. CONFIRMED: `RECOGNIZED_SPECKIT_ENV_VARS` at sidecar-client.ts:191-200 does NOT include `SPECKIT_CROSS_ENCODER` but test at line 545 still asserts `expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_CROSS_ENCODER')`. The test will fail.
8. **Read root AGENTS.md and CLAUDE.md** — both clean (no coco/cross-encoder references).
9. **Ruled out advisor-state JSON** — gitignored (`**/.advisor-state/**`), not tracked files in the working tree.

## Findings

### Finding 9: P1 — Gemini `/memory:search` command prompt describes cross-encoder reranking as active

- **Severity:** P1
- **File:** `.gemini/commands/memory/search.toml:2` (entire prompt body, multiple locations)
- **Evidence:** The Gemini runtime's `/memory:search` command prompt — sent as instructions to Gemini models at runtime — contains at least 4 separate claims that the cross-encoder reranker is active:
  1. "Cross-encoder reranking only runs when at least 4 candidates reach Stage 3; `applyLengthPenalty` remains on the API surface for compatibility but currently resolves to a neutral `1.0` multiplier for every document" (Hybrid Retrieval Runtime section)
  2. "`getRerankerStatus()` exposes reranker latency plus cache `hits`, `misses`, `staleHits`, and `evictions`" (used TWICE: once in Hybrid Retrieval Runtime, once in APPENDIX A)
  3. "`rerank` | boolean | true | Enable cross-encoder reranking" (APPENDIX B parameter table for `memory_search`)
  4. "`applyLengthPenalty` | boolean | true | Compatibility-only reranker option. Current runtime keeps it on the surface, but the length multiplier is always `1.0` so no documents are penalized for size" (APPENDIX B)
- **Classification:** **LIVE-STRANDED** — This file is the Gemini CLI's command definition for `/memory:search`. It is loaded and sent as a system prompt/instruction to Gemini models every time a user invokes `/memory:search`. The model is being told that cross-encoder reranking is an active feature, that `getRerankerStatus()` exposes reranker cache stats, and that the `rerank` parameter enables "cross-encoder reranking." All of these claims are false — the cross-encoder was removed. The `rerank` parameter now controls MMR diversity reranking.
- **Impact:** Gemini models using this command will make decisions based on false information about the retrieval pipeline's capabilities. This is a more impactful version of Finding 1 (tool-schemas.ts) — it's the same class of bug but in a model-facing instruction document, not a tool schema. The Gemini model may select different query strategies or interpret `rerank` parameter behavior incorrectly.
- **Cross-reference:** This is the Gemini-mirror equivalent of iter-1 Finding 1 (tool-schemas.ts:132-136). Both contain the same stale "Enable cross-encoder reranking" text, but this one is in model instructions, not just a tool schema.

### Finding 10: P2 — `.vscode/mcp.json` reports stale tool count (39) and Voyage reranker

- **Severity:** P2
- **File:** `.vscode/mcp.json:18,21`
- **Evidence:**
  - Line 18: `"_NOTE_2_TOOLS": "Registers 39 tools: memory_save/search/context/...council_graph_query/status/upsert/convergence (4 council), deep_loop_graph_query/status/upsert/convergence (4 deep-loop)...` — This references 39 tools including council/deep-loop graph tools (4+4=8 extras). The correct post-017 count is 35 (council/deep-loop tools were moved to the deep-loop-runtime CLI, not exposed as MCP tools).
  - Line 21: `"_NOTE_5_CLOUD_PROVIDERS": "For cloud: add VOYAGE_API_KEY or OPENAI_API_KEY; Voyage uses rerank-2.5 and auto-selects the matching DB profile"` — References Voyage's rerank-2.5 cloud reranker, which was removed per `opencode.json` line 33: "cloud rerankers (voyage/cohere) were removed in 022/013."
- **Classification:** **LIVE-STRANDED** — `.vscode/mcp.json` is the MCP configuration for VS Code's MCP extension. While tool counts in comments are informational, the Voyage rerank-2.5 reference is a stale claim about cloud reranker support. The correct opencode.json note says "Voyage is embeddings-only here."
- **Impact:** Low-medium. Tool count documentation is wrong but informational. The Voyage rerank-2.5 claim could mislead a developer reading the VS Code MCP config into thinking cloud reranking is supported.

### Finding 11: P2 — `.devin/config.json` reports stale tool count (39) and Voyage reranker

- **Severity:** P2
- **File:** `.devin/config.json:17,20`
- **Evidence:**
  - Line 17: `"_NOTE_2_TOOLS": "Registers 39 tools: ..."` — Same stale 39-tool count as `.vscode/mcp.json`.
  - Line 20: `"_NOTE_5_CLOUD_PROVIDERS": "For cloud: add VOYAGE_API_KEY or OPENAI_API_KEY; Voyage uses rerank-2.5 and auto-selects the matching DB profile"` — Same stale Voyage reranker reference.
- **Classification:** **LIVE-STRANDED** — `.devin/config.json` is the MCP configuration for the Devin runtime. Same class of issue as Finding 10.
- **Impact:** Low-medium. Same as Finding 10, but for Devin's MCP configuration.

### Finding 12: P1 VERIFIED — Stale `SPECKIT_CROSS_ENCODER` assertion in sidecar-hardening test

- **Severity:** P1 (verified from iter-1)
- **File:** `sidecar-hardening.vitest.ts:545` vs `sidecar-client.ts:191-200`
- **Evidence (static-confirmed):** `RECOGNIZED_SPECKIT_ENV_VARS` at sidecar-client.ts:191-200 contains 8 entries (`SPECKIT_EMBEDDER_SIDECAR_IDLE_MS`, `SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS`, `SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS`, `SPECKIT_EMBEDDER_EXECUTION`, `SPECKIT_EMBEDDER_SIDECAR_PROVIDER`, `SPECKIT_EMBEDDER_SIDECAR_MODEL`, `SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS`, `SPECKIT_EMBEDDER_SIDECAR_PARENT_PID`). `SPECKIT_CROSS_ENCODER` is NOT present. The test at line 545 asserts `expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_CROSS_ENCODER')` — this assertion will throw.
- **Classification:** **LIVE-STRANDED** (confirmed). Static code inspection is sufficient to confirm the test failure without running vitest.
- **Impact:** Broken test. The fix is trivial: remove line 545 or update the assertion to not expect the removed env var.

### Ruled Out — Surfaces confirmed clean

| Surface | Status | Evidence |
|---------|--------|----------|
| `.codex/` (AGENTS.md, config.toml, agents/, settings.json, hooks.json, policy.json) | CLEAN | No coco/cross-encoder/reranker hits in any file |
| `.claude/` (CLAUDE.md, settings.json, settings.local.json, agents/) | CLEAN | No coco/cross-encoder/reranker hits; `.claude/mcp.json` correctly says "35 tools" |
| `.gemini/GEMINI.md` | CLEAN | Only references `mcp__mk_code_index__*`, no coco refs |
| `.gemini/settings.json` | CLEAN | Correctly says "35 tools", no Voyage reranker ref |
| `.gemini/agents/` (all 11 agent files) | CLEAN | No coco/cross-encoder/reranker hits |
| `.gemini/scripts/` | CLEAN | No hits |
| `.gemini/commands/` (except search.toml) | CLEAN | All other command tomls clean |
| `opencode.json` | CLEAN | Correctly updated: "35 tools", "cloud rerankers removed" |
| `.claude/mcp.json` | CLEAN | Correctly says "35 tools" |
| `.codex/config.toml` | CLEAN | No coco/reranker refs in MCP env notes |
| `.devin/config.local.json` | CLEAN | Minimal config, no coco/reranker refs |
| `.devin/hooks.v1.json` | CLEAN | Only references system-skill-advisor + system-code-graph hooks |
| `.gitignore` | CLEAN | No stale `.cocoindex_code/` or `ccc` entries |
| `.github/hooks/` (all scripts + JSON) | CLEAN | No coco/reranker refs; only standard session/user-prompt hook wiring |
| `.opencode/scripts/` (all scripts) | CLEAN | No coco/reranker refs; orphan sweeper correctly classifies mk-code-index-launcher |
| Root `AGENTS.md`, `CLAUDE.md` | CLEAN | No coco/cross-encoder/reranker refs |
| `.advisor-state/skill-graph-generation.json` | RULED OUT | Gitignored (`**/.advisor-state/**`), not tracked |

## Questions Answered

- **Q2 (ANSWERED):** Found 3 LIVE-STRANDED residual references in non-obvious surfaces:
  1. **P1**: `.gemini/commands/memory/search.toml` — Gemini `/memory:search` command prompt still describes cross-encoder reranking as active (multiple locations). This was MISSED by the prior 30-surface deep-review and all prior arc sweeps.
  2. **P2**: `.vscode/mcp.json` — Stale "39 tools" count + Voyage rerank-2.5 reference.
  3. **P2**: `.devin/config.json` — Same stale "39 tools" + Voyage rerank-2.5 reference.
  - The remaining 16 surfaces in the 4-runtime mirror + MCP config + hooks/scripts sweep are CLEAN.
  - **Q2 is now ANSWERED** with evidence.

## Questions Remaining

- Q1: Partially answered in iter-1 (2 P1 in live code). Verification of Finding-2 complete. Q1 can be marked partially resolved.
- Q3: Capability gap — not yet addressed.
- Q4: Behavioral regressions — not yet addressed.
- Q5: Stale docs — not yet addressed (but the gemini search.toml finding is a significant doc artifact).

## Next Focus

Iteration 3: Q3 (capability gap assessment) — evaluate whether removing semantic code search (CocoIndex) + the LLM reranker left a real user-facing gap vs. the replacements (code-graph+Grep; algorithmic MMR). Also surface any feature/flag/doc that still promises the removed capability (beyond what's already been found).

(End of file - total 124 lines)
