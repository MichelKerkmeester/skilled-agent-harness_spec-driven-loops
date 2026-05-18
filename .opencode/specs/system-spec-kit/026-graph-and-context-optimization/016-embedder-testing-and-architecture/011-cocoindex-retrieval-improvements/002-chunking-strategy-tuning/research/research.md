# Research Synthesis: 016/011/002 Chunking Strategy Tuning

> **Status**: CONVERGED (3 of 3 iters complete) — 2026-05-18T07:48-07:51Z. Iter 5 ran via cli-devin SWE-1.6 originally; iters 5-7 re-dispatched via cli-devin kimi-k2.6 (SWE-1.6 + DeepSeek + GLM quotas exhausted; Kimi was the only available cli-devin model).

## Question

What chunking strategy (size, overlap, semantic vs syntactic, code-aware splitters) maximizes hit-rate on the 18-pair fixture for our mixed TS/MD/Python corpus?

## Recommendation (one-liner)

Raise `CHUNK_SIZE` from 1000 → **1500-2000 chars**, reduce `CHUNK_OVERLAP` for code (from 150 → 0-50, keep 150-200 for Markdown), expose params in `settings.yml`, defer cAST/tree-sitter to Phase 2. Estimated lift: **+4-6pp** on 18-pair fixture (38.9% → 43-45%).

## Concrete decisions

| Parameter | Current | Recommended | Est. impact |
|---|---|---|---|
| `CHUNK_SIZE` | 1000 chars | **1500** (conservative) or 2000 (aggressive) | +3-4pp |
| `CHUNK_OVERLAP` (code) | 150 (15%) | **0-50** (function-aware, AST-split) | +0.5-1pp |
| `CHUNK_OVERLAP` (Markdown) | 150 | **150-200** (keep) | neutral |
| `MIN_CHUNK_SIZE` | 250 | **250** (keep) | neutral |
| Project override | None (hard-coded in `indexer.py:32-37`) | **Expose in `settings.yml`** | enables per-project tuning |
| cAST/tree-sitter | Not used | **DEFER to Phase 2** | high engineering cost; +4.3pp Recall@5 ceiling (Zhang et al. 2025) |
| Per-language overrides | None | **TS=2000 / MD=800 / Python=1500** | enables per-language tuning |

## Literature evidence

- **Wu et al. 2026** (arXiv:2605.04763v1): controlled 864-setting study. Function chunking *never* Pareto-optimal; Sliding Window + cAST dominate. Chunk size has weaker non-monotonic effect (≤1.9pp).
- **Zhang et al. 2025** (arXiv:2506.15655): cAST gives +4.3pp Recall@5 on RepoEval, +2.67 Pass@1 on SWE-bench. Tree-sitter AST chunking.
- **Storia-AI/sage benchmarks**: ≤800 tokens ideal; smaller has marginal gains. top_k=25 retrieval → rerank top 3.
- **arXiv:2407.19794, LlamaIndex docs, NVIDIA 2024**: converge on 512-1024 tokens as optimal for code (our current 1000 *chars* maps to only ~250-400 tokens — way below optimal).

## Corpus analysis (from iter 5)

- Current state: 116,722 chunks / 7,692 files = ~15.2 chunks/file
- TypeScript dominates at 75.2%
- Average chunk: 741 chars (well under 1000 ceiling — 99.5% under cap)
- Headroom: doubling chunk_size would shrink corpus 30-50% (127K → ~90-95K) with negligible reindex cost change

## Implementation hints (cross-referenced)

- **Current code path**: `cocoindex_code/indexer.py:32-37` hard-codes `CHUNK_SIZE=1000`, `MIN_CHUNK_SIZE=250`, `CHUNK_OVERLAP=150`. `splitter.split(content, chunk_size=CHUNK_SIZE, min_chunk_size=MIN_CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP, language=language)` at line 271-277 — language-aware invocation.
- **Override path**: Add `chunking:` block in `settings.yml`; load via `config.py:from_env()` with env override `COCOINDEX_CODE_CHUNK_SIZE` / `COCOINDEX_CODE_CHUNK_OVERLAP`. Apply per-language overrides via a small mapping at indexer.py.
- **Empirical test reindex**: Run benchmark harness on the 18-pair fixture with CHUNK_SIZE=1500 first; promote to 2000 only if 1500 shows clear lift.

## Source iterations

| Iter | Dimension | File | Findings | Note |
|---|---|---|---|---|
| 5 | current-chunker-analysis | `iterations/iteration-005.md` | 7 | RecursiveSplitter syntax-aware, 1000-char ceiling, avg 741 chars, function-level contraindicated (Wu et al.) |
| 6 | chunking-strategy-survey | `iterations/iteration-006.md` | 8 | Literature converges 512-1024 tokens; raise to 2000 chars; reduce code overlap to 0-50 |
| 7 | chunking-synthesis | `iterations/iteration-007.md` | 7 | CONVERGED — 1000→1500, 150→200, expose in settings.yml; +4-6pp lift; ~25-30% chunk reduction |

## Next steps

1. Refine `plan.md` + `tasks.md` from this synthesis
2. Implementation: 2-stage approach
   - Stage A: Raise CHUNK_SIZE to 1500 + expose in settings.yml. Run benchmark. Measure.
   - Stage B: If Stage A shows lift, raise to 2000 + per-language overrides. Re-measure.
3. Validation: 18-pair fixture hit-rate before/after; reindex time delta
4. Post-impl: 5-iter deep-review (single-commit tier)

## Cross-cutting note

This phase sequences **FIRST** in the integrated rollout (per iter 10 cross-cutting synthesis). Chunking changes reshape what FTS5 (hybrid) and reranker downstream consume.
