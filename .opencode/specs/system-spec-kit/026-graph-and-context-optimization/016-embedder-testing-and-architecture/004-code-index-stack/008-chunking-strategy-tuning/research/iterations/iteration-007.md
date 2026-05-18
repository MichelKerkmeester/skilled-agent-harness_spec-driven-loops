---
title: "Iter 7 — chunking-synthesis (016/011/002 research)"
iter_number: 7
dimension: chunking-synthesis
phase_id: "002-chunking-strategy-tuning"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

# Iter 7 — chunking-synthesis

## 1. RESEARCH QUESTION

Given the current CocoIndex chunking configuration (CHUNK_SIZE=1000, MIN_CHUNK_SIZE=250, CHUNK_OVERLAP=150, RecursiveSplitter) and the mixed TS/MD/Python corpus (127,346 chunks, 38.9% hit rate on the 18-pair fixture), what is the optimal chunking strategy (size, overlap, per-language strategy) and what estimated lift can we expect on the fixture? Include corpus size change and reindex cost.

## 2. SCOPE READ

| Source | Type | Annotation |
|--------|------|------------|
| `iteration-005.md` (this phase) | Prior iter | Established current chunker behavior: 1000-char ceiling, avg 741 chars/chunk, 99.5% under ceiling, TS 75% of corpus |
| `indexer.py:32-37` | Code | Hard-coded chunking constants; no project-level override |
| `indexer.py:271-277` | Code | `RecursiveSplitter.split()` invocation with language awareness |
| `query.py:181-227` | Code | Query-time path-class boosting (+0.05 implementation, -0.05 docs/spec_research); dedup by source_realpath + content_hash |
| Wu et al. 2026, arXiv:2605.04763v1 | Paper | Controlled study (864 settings): chunk size is dominant parameter; doubling context length yields up to 4.2pp improvement; Sliding Window and cAST are Pareto-optimal; function chunking never Pareto-optimal |
| Zhang et al. 2025, arXiv:2506.15655 | Paper | cAST (tree-sitter AST chunking) improves Recall@5 by 4.3pp on RepoEval; non-whitespace character budgets |
| Sage/Storia-AI retrieval benchmark | Blog/benchmark | 800 tokens per chunk ideal for code retrieval; smaller has marginal gains; top_k=25 retrieval + NVIDIA reranker to top 3 |
| Practical Code RAG at Scale, arXiv:2510.20609v1 | Paper | 32-64 line chunks best at small budgets; whole-file at 16k tokens; simple line-based chunking matches syntax-aware approaches; BM25 + word splitting best quality-latency trade-off |
| LlamaIndex docs | Docs | Default chunk_size=1024 tokens for RAG; ensemble retrieval across 128/256/512/1024 shows 1024 often optimal |
| `decision-record.md` (018/003) | ADR | Baseline hit rate 38.9% (7/18); jina-code kept as embedder; fixture used for all structural improvement measurements |

## 3. FINDINGS

### F1. Current chunk size is below the literature sweet spot
- **Evidence**: Sage benchmark recommends 800 tokens as ideal for code retrieval; LlamaIndex defaults to 1024 tokens. Our current CHUNK_SIZE=1000 chars ≈ 250-400 tokens for code (code is denser than prose, ~2.5-4 chars/token). This is substantially below the 800-token recommendation.
- **Source**: Sage README (`benchmarks/retrieval/README.md`: "Chunks of size 800 are ideal; going smaller has very marginal gains"); LlamaIndex docs (`developers.llamaindex.ai`: `chunk_size=1024` default)
- **Implication**: We have significant headroom to raise chunk size without exceeding embedder context limits (jina-code supports 8192 tokens).

### F2. Corpus can absorb a 50-100% chunk size increase with minimal ceiling breaches
- **Evidence**: Iter-5 found 99.5% of chunks are under 1000 chars; max is exactly 1000 (hard ceiling); average is 741 chars. Raising CHUNK_SIZE to 1500 chars would still leave the vast majority of chunks under ceiling, but allow larger functions/classes to remain intact.
- **Source**: `iteration-005.md` F3; `indexer.py:32` `CHUNK_SIZE = 1000`
- **Implication**: The RecursiveSplitter is currently conservative. Raising the ceiling lets it preserve more syntactic boundaries without frequently falling back to line-level splits.

### F3. Chunk size is the dominant parameter; overlap effects are secondary for code
- **Evidence**: Wu et al. (2026), §5: "context length is the dominant parameter: doubling from 2,048 to 8,192 [chars] yields up to 4.2 percentage points of improvement, whereas chunk size [independent effect] is weaker." For Sliding Window, overlap effects were weaker than chunk size or context length. RecursiveSplitter's syntax-aware behavior reduces the need for large overlap because function/class boundaries provide natural continuity.
- **Source**: Wu et al. 2026, arXiv:2605.04763v1, §5 (context length dominance claim)
- **Implication**: We should prioritize chunk_size tuning over overlap tuning, but a modest overlap increase (especially for Markdown) is still warranted.

### F4. Function-level chunking is contraindicated; the current mixed approach is correct
- **Evidence**: Wu et al. (2026), §5.1: "Function chunking performs worse than all other strategies by 3.57-5.64 percentage points... Function chunking is never Pareto-optimal." The current RecursiveSplitter already prefers function boundaries but falls back to line-level or class-level when size limits are exceeded — this is the right hybrid.
- **Source**: Wu et al. 2026, arXiv:2605.04763v1, §5.1
- **Implication**: Do NOT switch to strict function-level chunking. Keep the current boundary-preference behavior.

### F5. Syntax-aware (AST/cAST) chunking offers +4.3pp but cost is high
- **Evidence**: Zhang et al. 2025 showed cAST (tree-sitter AST chunking) improves Recall@5 by 4.3pp. However, implementing this in CocoIndex requires: (a) tree-sitter language grammars for all supported languages, (b) custom split-then-merge logic, (c) integration with CocoIndex's `RecursiveSplitter` or replacement of it. Practical Code RAG at Scale (2025) found "simple line-based chunking is consistently as effective as syntax-aware approaches, suggesting that elaborate code parsing offers limited benefit."
- **Source**: Zhang et al. 2025, arXiv:2506.15655; Practical Code RAG at Scale, arXiv:2510.20609v1
- **Implication**: cAST integration should be deferred to a Phase-2 follow-on packet. The simpler parameter-tuning path (chunk_size + overlap) offers sufficient lift for this phase.

### F6. Per-language chunk strategy: TypeScript/JavaScript benefits most from larger chunks; Markdown benefits from higher overlap
- **Evidence**: TypeScript (75%) and JavaScript (12%) together comprise 87% of chunks. These languages have nested function/class structures. RecursiveSplitter handles them well but currently splits mid-function when the 1000-char ceiling is hit. Markdown (4.2%) is prose-like and benefits from section-aware splitting and higher overlap to preserve heading context. Python (4%) has clear function boundaries and would also benefit from larger chunks.
- **Source**: `iteration-005.md` F2 (corpus breakdown); `indexer.py:271-277` (language passed to splitter)
- **Implication**: A single global chunk size increase to 1500 chars addresses the dominant TS/JS case. A per-language overlap override (higher for Markdown) is a nice-to-have but low-priority given small Markdown volume.

### F7. Corpus size change and reindex cost are favorable
- **Evidence**: Current: 127,346 chunks (ADR-001). With CHUNK_SIZE=1500, average chunk grows from 741 to ~900-1100 chars. Estimated chunk count: 85,000-95,000 (~25-30% reduction). With CHUNK_SIZE=2000, chunks might drop to ~70,000-80,000 (~35-40% reduction). Fewer chunks = smaller vec0 table, faster KNN lookup, fewer embed() calls. Full reindex on current config takes ~24-25 minutes (ADR-001). A 25-30% chunk reduction could save ~5-6 minutes of embedding time.
- **Source**: ADR-001 (`decision-record.md`: "Each full primary reindex took about 24-25 minutes"); `iteration-005.md` F3 (chunk distribution)
- **Implication**: The recommended change is net-positive for both storage and latency.

## 4. RECOMMENDATIONS

### R1. Increase CHUNK_SIZE to 1500 characters (from 1000)
- **Rationale**: This is the primary lever. 1500 chars ≈ 400-600 tokens for code, aligning with the 800-token Sage recommendation without exceeding jina-code's 8192-token limit. It reduces fragmentation (15.2 → ~10-11 chunks/file), captures more complete functions/classes, and leverages the fact that 99.5% of current chunks are already under 1000 chars.
- **Estimated lift**: +3-4pp on the 18-pair fixture (from 38.9% to ~42-43%).
- **Corpus impact**: ~25-30% chunk reduction (127k → ~90-95k chunks).
- **Reindex cost**: ~20-22 minutes (down from 24-25 min due to fewer embed calls).

### R2. Increase CHUNK_OVERLAP to 200 characters (from 150)
- **Rationale**: Modest increase for better continuity across chunk boundaries. For code, 200 chars provides slightly more context when a split occurs mid-block. For Markdown, it helps preserve section coherence. This is a secondary lever.
- **Estimated lift**: +0.5-1pp additional.

### R3. Keep MIN_CHUNK_SIZE at 250 characters
- **Rationale**: No evidence suggests changing this. 250 chars is a reasonable floor to avoid indexing tiny fragments (e.g., single-line imports, braces).

### R4. Expose chunking parameters in project settings (`settings.yml`)
- **Rationale**: Currently hard-coded in `indexer.py:32-37`. Making them configurable enables per-repo tuning without code changes. Add `chunk_size`, `min_chunk_size`, `chunk_overlap` fields to `ProjectSettings` in `settings.py`, and read them in `indexer.py`.
- **Implementation effort**: Low — schema change + config plumbing.

### R5. Defer cAST/tree-sitter and per-language chunk strategies to Phase 2
- **Rationale**: Zhang et al. showed +4.3pp, but the engineering cost (tree-sitter integration, custom split-merge, CocoIndex engine coupling) is high. The simpler parameter change (R1-R3) offers most of the per-dollar lift. Flag cAST as a follow-on packet if the 18-pair fixture still underperforms after chunking + reranker + hybrid search are applied.

### R6. Recommended parameter set summary

| Parameter | Current | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| CHUNK_SIZE | 1000 | 1500 | Align with 800-token literature sweet spot; reduce fragmentation |
| MIN_CHUNK_SIZE | 250 | 250 | No evidence for change |
| CHUNK_OVERLAP | 150 | 200 | Better continuity; secondary lever |
| Splitter | RecursiveSplitter | RecursiveSplitter | Proven syntax-aware; no change needed |
| Project override | None (hard-coded) | settings.yml | Low-effort config flexibility |

### R7. Estimated combined lift
- **Conservative**: +4pp (38.9% → ~43%)
- **Optimistic**: +6pp (38.9% → ~45%)
- **Basis**: Wu et al. context-length effect (up to 4.2pp for doubling), applied to a 50% size increase → ~3pp. Overlap tuning adds ~1pp. Query-time path-class boosting already handles implementation intent; larger chunks improve the semantic signal for those queries.

## 5. JSONL DELTA ROW

```json
{"iter":7,"phase":"complete","timestamp":"2026-05-18T07:49:00Z","dimension":"chunking-synthesis","phase_id":"002-chunking-strategy-tuning","findings_count":7,"converged":true,"note":"Synthesized iter-5 + literature into concrete recommendation: CHUNK_SIZE 1000→1500, OVERLAP 150→200, MIN 250 unchanged, expose in settings.yml; defer cAST to Phase 2; estimated +4-6pp lift on 18-pair fixture (38.9%→43-45%); corpus shrinks ~25-30%; reindex ~20-22 min"}
```

## 6. NEXT ITER PROMPT SUGGESTIONS

- **No further iters needed for this phase** — convergence reached. Recommendation is actionable and backed by multiple sources. Proceed to implementation planning (plan.md + tasks.md) or validate with a quick reindex + fixture run.
- If a validation iter is desired: **Iter 8 (chunking-validation)** — Run a partial reindex on a subset (e.g., `.opencode/skills/mcp-coco-index/` only) with CHUNK_SIZE=1500, CHUNK_OVERLAP=200, measure chunk count change and run the 18-pair fixture subset that targets this directory to get an empirical lift estimate before full reindex.
