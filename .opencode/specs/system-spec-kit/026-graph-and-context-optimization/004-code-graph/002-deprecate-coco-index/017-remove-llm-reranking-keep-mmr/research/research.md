---
title: "Deep Research — What the 014 CocoIndex + LLM-reranker deprecation arc missed"
description: "deepseek-v4-pro deep-research audit (5 iterations, converged) of residual couplings, capability gaps, regressions, and doc inaccuracies across the 014 deprecation surfaces."
importance_tier: high
contextType: research
---

# Deep Research: 014 Deprecation Miss-Finding

## 1. OVERVIEW

Executor: `cli-opencode` / `deepseek/deepseek-v4-pro` (reasoningEffort=high). 5 iterations, converged (all 5 questions answered; newInfoRatio 0.45 → 0.50 → 0.40 → 0.35 → 0.10). Scope: the full 014 CocoIndex + LLM-reranker deprecation arc, incl. 017 vestige cleanup, the comprehensive doc alignment, and the council pre-push-hook purge.

## 2. VERDICT

**The deprecation broke nothing live, but left a consistent trail of stale model-/operator-facing documentation + one broken test.** The CORE removal is clean (zero dangling imports, zero live CocoIndex/`ccc`/cross-encoder call sites, build coherent, full search-pipeline test suite green, confidence math verified behavior-neutral). The misses are entirely in *documentation/schema/type/test* surfaces — most notably the **public/model-facing `rerank` parameter docs** that still promise "cross-encoder reranking" (now MMR), spread across the MCP tool schema and 2 of the 4 runtime `/memory:search` command prompts.

## 3. RESEARCH QUESTIONS & ANSWERS

- **Q1 (live code couplings) — ANSWERED:** No live runtime coupling to removed modules. Zero dangling imports to the 4 deleted files; zero live `cocoIndex`/`ccc` refs in `.ts`. Found 2 stranded surfaces (the tool-schema desc + a stale test). The "sidecar" / "vector channel" / "positional_scoring" hits are the embedder sidecar + FTS vector channel — unrelated, correct.
- **Q2 (non-obvious / 4-runtime surfaces) — ANSWERED:** 16 surfaces clean (.codex, .claude, root docs, hooks, .gitignore, opencode.json, .gemini/GEMINI.md, .claude/mcp.json). Misses: the gemini `/memory:search` command prompt (P1) + `.vscode/mcp.json` & `.devin/config.json` stale "39 tools" + Voyage `rerank-2.5` (P2).
- **Q3 (capability gap) — ANSWERED:** (a) Embedding-based semantic code search is genuinely GONE (REAL-GAP) — HYBRID code-graph+Grep covers it but requires iterative term-guessing; this is the **accepted D2 trade-off, not a regression**. (b) MMR + ADR-011 rescue layer adequately replace the (opt-in) cross-encoder — COVERED, no documented quality regression. (c) 7 more stranded promises found (incl. the opencode `/memory:search` P1).
- **Q4 (behavioral regressions) — ANSWERED (empirical):** Ran the suites. sidecar-hardening FAILS (3 tests — stale `SPECKIT_CROSS_ENCODER` assertion). stage3-rerank + confidence + result-explainability + rescue = 47 pass / 0 fail. `/doctor`/`/speckit`/council have zero runtime coco/cross-encoder assumptions. Confidence 3-factor math verified inert (removed 0.20 weight was always ×0; rawValue cap 0.80 unchanged). **No live regression.**
- **Q5 (full doc sweep) — ANSWERED:** Command-mirror staleness is bounded to the 2 `search` commands (gemini + opencode); siblings clean; .codex/.claude have no memory commands. 1 new P3 (cli-* `ccc search` pkill). All other live-doc hits are intentional-historical (embedder docs, dead-code-removal catalog, changelogs, benchmarks).

## 4. FINDINGS CATALOGUE (actionable — remediation seed)

### P1 (4)
1. `mcp_server/tool-schemas.ts:132-136` — `memory_search` `rerank` param description still says "Enable cross-encoder reranking" (now controls MMR). Public MCP schema; model-facing.
2. `.gemini/commands/memory/search.toml` — Gemini `/memory:search` command prompt describes cross-encoder reranking + `getRerankerStatus()` as active (~4 locations). Model-facing instructions.
3. `.opencode/commands/memory/search.md:120-121,872,986-987` — OpenCode `/memory:search` command prompt, same stale cross-encoder claims (~4 locations). Model-facing.
4. `mcp_server/tests/embedders/sidecar-hardening.vitest.ts:545` — stale assertion `expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_CROSS_ENCODER')` → **3 tests fail** (verified by running). (Test-maintenance; downgradeable to P2.)

### P2 (8)
5. `mcp_server/lib/search/pipeline/stage3-rerank.ts:89,96-98` — `RerankProvider` type retains dead `'cross-encoder'` variant + stale JSDoc.
6. `.vscode/mcp.json:18,21` — stale "39 tools" + Voyage `rerank-2.5` note (should be 35 / embeddings-only).
7. `.devin/config.json:17,20` — same stale "39 tools" + Voyage `rerank-2.5`.
8. `system-code-graph/SKILL.md:52` — self-contradictory routing ("don't use system-code-graph for semantic concept search: use system-code-graph").
9. `system-spec-kit/shared/types.ts:216-225` — `scoringMethod` union still includes `'cross-encoder'` + JSDoc.
10. `system-spec-kit/shared/embeddings.ts:43` — comment references deleted `cross-encoder.ts`.
11. `sk-doc/scripts/validate-doc-model-refs.js:144,160` — validator still accepts `cross-encoder/*` model paths (won't flag stale model refs).
12. `sk-code/references/opencode/shared/code_organization.md:492` — dir-tree still shows deleted `cross-encoder.ts`.

### P3 (1)
13. `cli-{codex,claude-code,devin,opencode,gemini}/SKILL.md` (single-dispatch blocks) — stale `pkill -9 -f "ccc search"`. Harmless (no `ccc` binary). NOTE: keep the `positional_scoring_fallback:app` part of the cleanup triple unless separately verified; only `ccc search` is stale. (May overlap with a documented kept RM-8 cleanup pattern — operator decides.)

## 5. RULED OUT — verified clean / intentional (NOT misses)
- Live code: zero dangling imports, zero live coco/ccc/RerankGate. `.codex`/`.claude`/root docs/hooks/.gitignore/opencode.json/.gemini GEMINI.md/.claude mcp.json all clean.
- INTENTIONAL-HISTORICAL: `embedder_pluggability.md` (Path A rejection + 014 removal narrative), `embedder_architecture.md:172`, `feature_catalog/16/04-dead-code-removal.md`, all changelogs, all benchmark reports, eval ground-truth queries, stress-corpus `rerank-gate` fixture, `.doctor-update.last-run.json` log, `registry.ts` local mapping (with removal-context comment), always-null `rerankerScore` trace field (017 kept exception), `PipelineRow.rerankerScore`, `scoringMethod` field itself.

## 6. NO-REGRESSION (empirically verified, iter 4)
- Search pipeline (stage3 MMR, confidence, result-explainability, rescue): 47 tests pass / 0 fail.
- `/doctor` + `/speckit` + `deep-ai-council`: zero runtime coco/cross-encoder assumptions.
- Confidence 3-factor math: removed 0.20 reranker weight was genuinely inert (always ×0); rawValue cap 0.80 unchanged → scores mathematically identical pre/post. Behavior-neutral confirmed.

## 7. CAPABILITY CONCLUSIONS
- **REAL-GAP (accepted):** embedding-based "find code by concept" is gone; replacement is structural (code-graph) + lexical (Grep) iteration. Deliberate D2 trade-off, not a regression.
- **COVERED:** MMR (default-on diversity) + ADR-011 rescue layer replace the opt-in cross-encoder; documented quality metrics maintained.

## 8. ROOT-CAUSE PATTERN
The deprecation's code + primary-doc cleanup was thorough, but three classes were systematically under-swept: (1) **model-facing command prompts** (`/memory:search` in gemini + opencode) vs the tool schema — the same stale text in 3 surfaces; (2) **secondary config mirrors** (.vscode, .devin) missed by the tool-count/Voyage cleanup that reached the primary configs; (3) **type unions + validators + code-org docs** that still encode the removed `cross-encoder` concept. The prior 30-surface deep-review (013) and the 017 doc alignment caught the high-traffic surfaces but missed these.

## 9. REMEDIATION SEED
A scoped remediation packet should fix the 4 P1 (align the `rerank` param description to MMR across tool-schema + both command prompts; fix the stale test) + the 8 P2 (configs, type unions, comments, validator, code-org doc) + the 1 P3 (cli-* ccc pkill). All are doc/schema/type/test edits — no production-code behavior change. Estimated: low-risk mechanical alignment, ~14 edits across ~13 files.

## 10. CONVERGENCE REPORT
- Stop reason: all_questions_answered (5/5; newInfoRatio collapsed to 0.10)
- Total iterations: 5 of 10 (converged early — findings exhausted)
- Questions answered: 5 / 5
- newInfoRatio trajectory: 0.45, 0.50, 0.40, 0.35, 0.10
- Executor: cli-opencode / deepseek-v4-pro / high, one-at-a-time with kill+RSS between
- Corruption count: 0

## 11. ITERATION TRAIL
- iter 1: live-code sweep — 2 P1 (tool-schema, broken test) + 2 P2 + 4 INFO; zero dangling imports.
- iter 2: 4-runtime/config sweep — P1 gemini search.toml + 2 P2 (vscode/devin); 16 surfaces clean.
- iter 3: capability-gap — P1 opencode search.md + 6 stranded promises; REAL-GAP (semantic search) + COVERED (MMR/rescue).
- iter 4: regressions (empirical) — BROKEN-TEST confirmed (3 fails) + NO-REGRESSION across pipeline/workflows/confidence-math.
- iter 5: final doc sweep — command-mirror bounded to 2 search commands; 1 new P3; rest intentional-historical; CONVERGED.
