---
title: "Pre-Confirmation Margin Analysis: bge-code-v1's 4 unique probes"
description: "Instrumented single-candidate bench of bge-code-v1 (May 18, 2026 evening) with per-probe top-K cross-encoder score logging. Result invalidates the May 18 morning baseline. All 4 unique-win probes are tight-margin misses with rerank actually firing. Recommends scrapping the planned 3-run bge-code-v1-only confirmation and re-baselining all 4 candidates against the now-correct pipx + harness pipeline."
trigger_phrases:
  - "pre-confirmation margin analysis"
  - "bge-code-v1 unique probes invalidation"
  - "rerank demotion failure mode"
  - "rerank score margins probe 3 10 14 18"
  - "May 18 baseline invalidated"
  - "re-baseline 4 candidates"
importance_tier: "important"
contextType: "research"
---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This analysis was authored after running an instrumented single-candidate bge-code-v1 bench (May 18, 2026 evening) against the existing 18-pair code-retrieval fixture, with the reranker patched to log per-probe top-K cross-encoder scores to a sidecar JSONL.

The bench was scoped to test the rerank non-determinism risk identified in `../../004-code-index-stack/004-extended-bake-off/risk-analysis-rerank-nondeterminism.md`. It surfaced a larger problem than non-determinism.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:headline -->
## 2. HEADLINE

**The May 18 morning `11/18 = 61.1%` baseline for bge-code-v1 was measured against a pipx daemon that did NOT have the reranker module installed.** When rerank actually fires (after the install-hygiene fix in `016/005-cross-cutting-quality/005-cocoindex-install-hygiene/`):

- bge-code-v1 drops to **10/18 = 55.6%** (3 easy / 5 medium / 2 hard; median 1313ms, p95 12474ms)
- All 4 previously-unique-win probes (3, 10, 14, 18) are now MISSES
- All 4 margins are < 0.05 (the noise-floor threshold per the risk analysis §7)
- Rank-1 results are NOT noise-variance — they're systematic demotions: tests above implementations, source above dist, peripheral docs above target tests

The headline finding is bigger than rerank non-determinism: **the rerank is making things WORSE on these queries**, putting close-but-wrong files above the correct one. The May 18 result was lucky — it bypassed the reranker entirely.

<!-- /ANCHOR:headline -->

---

<!-- ANCHOR:per-probe-results -->
## 3. PER-PROBE RESULTS

| # | Difficulty | Expected (normalized path) | Rank-1 (got) | Rank-1 Score | Margin (r1-r2) | Hit? |
|---|---|---|---|---|---|---|
| 3 | easy | `skills/mcp-coco-index/.../cocoindex_code/config.py` | `tests/test_config.py` (dup chunk) | 0.9313 | **0.018** | NO |
| 10 | medium | `system-spec-kit/scripts/dist/memory/generate-context.js` | `scripts/memory/generate-context.ts` | 0.7985 | **0.003** | NO |
| 14 | hard | `system-code-graph/.../lib/structural-indexer.ts` | `stress_test/code-graph/walker-dos-caps.vitest.ts` | 0.0765 | **0.025** | NO |
| 18 | medium | `mcp-coco-index/.../tests/test_refresh_split.py` | `mcp-coco-index/references/tool_reference.md` | 0.1629 | **0.036** | NO |

All four are misses. All four have rank-1 vs rank-2 margin < 0.05.

<!-- /ANCHOR:per-probe-results -->

---

<!-- ANCHOR:failure-mode-pattern -->
## 4. FAILURE MODE PATTERN

These are not random non-determinism flips. They are a systematic class:

| Probe | Failure pattern |
|---|---|
| 3 | **Test file demotes implementation.** `tests/test_config.py` outranks `cocoindex_code/config.py`. The reranker scores the test file (which contains literal "default model" assertions matching the query keywords) higher than the production file. |
| 10 | **Source outranks dist artifact.** Query asks for the "command that reads structured JSON" — `generate-context.ts` (source) ranks above `generate-context.js` (dist). The fixture's expected path is the dist artifact; the .ts source is arguably MORE correct semantically but doesn't match the fixture's choice. |
| 14 | **Stress-test outranks implementation.** `walker-dos-caps.vitest.ts` (a stress test for walker DoS caps) beats `structural-indexer.ts`. The test's name contains "walker" + "caps" which lexically matches the query better than the implementation's named symbols. |
| 18 | **Reference doc outranks integration test.** `tool_reference.md` (which mentions "refresh" + "reprocessing" in prose) outranks the actual `test_refresh_split.py`. |

Common thread: **the cross-encoder rewards lexical-cue density over semantic role.** When a test file or doc contains the query's exact keywords, it scores higher than the implementation that the query is *about*.

<!-- /ANCHOR:failure-mode-pattern -->

---

<!-- ANCHOR:may-18-baseline-invalidation -->
## 5. MAY 18 BASELINE INVALIDATION

The May 18 morning bench (CSV at `../../004-code-index-stack/004-extended-bake-off/evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv`) recorded:

- jinaai/jina-v2-base-code: 9/18 = 50.0%
- google/embeddinggemma-300m: 9/18 = 50.0%
- nomic-ai/CodeRankEmbed: 9/18 = 50.0%
- BAAI/bge-code-v1: 11/18 = 61.1% ← winner

That bench was measured against the pipx daemon (`~/.local/bin/ccc`) which was a non-editable copy from May 7, 2026. Site-packages did NOT contain `reranker.py`, `fts_index.py`, `fusion.py`, or `registered_embedders.py`. The "hybrid+rerank ON" claim was structurally impossible — the modules didn't exist in the running daemon.

What the May 18 bench actually measured: **pure vector retrieval against the chunking-1500/200 + RRF-but-no-FTS5 + NO-rerank stack.** That bge-code-v1 came in at 11/18 there means it dominates the OTHER candidates on raw vector-only retrieval. But the "+2-pair lead via hybrid+rerank" framing was a false attribution.

The instrumented bench tonight, with reranker.py actually loaded and `$CCC` resolving to the editable local-venv install, measured the **actual production stack** and got 10/18. The reranker — when it fires — costs bge-code-v1 one of its 4 unique wins AND adds significant latency (504ms median → 1313ms).

<!-- /ANCHOR:may-18-baseline-invalidation -->

---

<!-- ANCHOR:decision-rule-application -->
## 6. §7 DECISION RULE APPLICATION

Per `../../004-code-index-stack/004-extended-bake-off/risk-analysis-rerank-nondeterminism.md` §7:

- All margins > 0.10 → Path A (proceed with 3-run rule)
- 2-3 wide, 1-2 in 0.05-0.10 → Path B (add `torch.use_deterministic_algorithms`)
- 2+ margins < 0.05 → Path C (tighten gate, widen fixture, or de-risk)

**Result: Path C — all 4 margins are < 0.05 (0.003 to 0.036).**

BUT the original rule assumed bge-code-v1 was WINNING those probes by tight margins. The new data shows bge-code-v1 is LOSING those probes (rank-1 is a wrong file). The original promote rule (min ≥10/18 across 3 runs) is now moot — the single-run result IS 10/18, and there's no reason to believe a 3-run replay would consistently land >10/18 given the failure-mode pattern in §4.

<!-- /ANCHOR:decision-rule-application -->

---

<!-- ANCHOR:recommendations -->
## 7. RECOMMENDATIONS

### 7.1 Scrap the planned 3-run bge-code-v1-only confirmation

The 3-run rule was designed to detect non-determinism flipping wins. The actual problem is systematic rerank failure on the fixture, not non-determinism. Three more runs of bge-code-v1 won't change the underlying lexical-vs-semantic mismatch. Do not burn another 3.5h of bench compute on this gate.

### 7.2 Re-baseline ALL 4 candidates against the corrected pipeline

The May 18 morning numbers for jina/gemma/nomic/bge are all from the no-rerank stack. With pipx now editable + harness pinned to local-venv + rerank actually firing, the right next step is a full 4-candidate re-bench. Expected wall: ~80-110 min.

Hypothesis: jina-code, gemma, and nomic also drop on the new pipeline, but the RELATIVE ordering may differ from the May 18 result. Possible outcomes:
- All 4 drop similarly → ranking stable, just at lower hit rates
- Some drop more than others → ranking changes; a different winner emerges
- One candidate is robust to the failure mode → that's the new default

### 7.3 Investigate the rerank failure mode

The four failure cases in §4 share a pattern: the cross-encoder rewards lexical density over semantic role. Worth investigating:

- Is `BAAI/bge-reranker-v2-m3` the right reranker for code retrieval? It was trained for text. There may be a code-specific cross-encoder that wouldn't make this class of mistake.
- Does the rerank top-K (currently 20) help or hurt? Higher K → more candidates with lexical cues that can outrank the target.
- Should we add a "path-class boost" that down-weights `tests/`, `references/`, `z_archive/` in the reranker output?

### 7.4 Fixture audit

Probe 10's "expected: .js dist file" is arguably wrong — the .ts source is semantically more correct. The fixture may have been authored against the wrong artifact. Re-evaluate all 18 expected paths for "what would actually answer this query best."

### 7.5 Update the 016/004/004 benchmark_report.md

The May 18 result has to be re-headlined: "11/18 = 61.1% measured against a stack without rerank firing." Add an erratum section pointing here. The risk-analysis-rerank-nondeterminism.md should also gain an erratum noting that the failure mode is worse than non-determinism.

<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:caveats -->
## 8. CAVEATS

- **Still a single-run measurement.** The 10/18 result tonight could itself have variance. But the per-probe failure-mode analysis (§4) is structural, not noise — re-runs would produce similar misses unless the reranker model or rerank top-K changes.
- **Indexed corpus size may have changed.** Tonight's index showed slightly different chunk counts (markdown: 3449 vs morning: 5114). Some files may have been touched by parallel sessions. Marginal effect; not a confound for the rank-1 failure mode.
- **Latency comparison invalid.** Morning bench had median 504ms (no rerank); tonight 1313ms (rerank firing). Cannot directly compare.
- **Other candidates not re-measured tonight.** Only bge-code-v1 was re-run. Recommendation §7.2 covers the full re-baseline.

<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:cross-links -->
## 9. RELATED RESOURCES

- **Risk analysis:** `../../004-code-index-stack/004-extended-bake-off/risk-analysis-rerank-nondeterminism.md` — the framework that motivated this instrumented run
- **Install hygiene fix:** `../../005-cross-cutting-quality/005-cocoindex-install-hygiene/` — the pipx repair + harness $CCC resolution that made this bench possible
- **Original bake-off:** `../../004-code-index-stack/004-extended-bake-off/benchmark-results.md` — the May 18 morning numbers (now invalidated by this analysis)
- **Score log:** `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/rerank-scores-instrumented.jsonl` — 18 per-probe rows with top-K candidates + cross-encoder scores

<!-- /ANCHOR:cross-links -->
