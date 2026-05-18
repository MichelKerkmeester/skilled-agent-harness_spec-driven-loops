---
title: "Iter 6 — chunking-strategy-survey (016/011/002 research)"
iter_number: 6
dimension: chunking-strategy-survey
phase_id: "002-chunking-strategy-tuning"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

# Iter 6 — chunking-strategy-survey

## 1. RESEARCH QUESTION

What chunk size (character/token budget), overlap ratio, and splitting strategy (semantic vs syntactic, code-aware vs prose-aware) maximizes hit-rate on the 18-pair fixture for our mixed TS/MD/Python corpus, given the jina-code embedder (8K context window) and the current RecursiveSplitter baseline?

## 2. SCOPE READ

| Source | Type | Annotation |
|--------|------|------------|
| `indexer.py:32-37` (iter-005 read) | Code | CHUNK_SIZE=1000 chars, MIN_CHUNK_SIZE=250, CHUNK_OVERLAP=150, splitter=RecursiveSplitter(). |
| `indexer.py:271-277` (iter-005 read) | Code | Language-aware `splitter.split()` invocation; respects function/class boundaries per CocoIndex docs. |
| arXiv:2407.19794 | Paper | Systematic chunk-size sweep (128/256/512/1024/2048 tokens) across 3 corpora; 512 and 1024 consistently maximize similarity scores. Context-window occupancy of 40-70% is optimal. |
| NVIDIA 2024 benchmark (via Firecrawl blog) | Benchmark | Recursive 400-512 tokens with 10-20% overlap is the best default across 5 datasets. Page-level won for paginated docs only. |
| Firecrawl blog / Vecta 2026 | Benchmark | Recursive 512 tokens = 69% end-to-end accuracy. Semantic chunking 15 points below recursive on general text. Query type matters: factoid queries prefer 256-512, analytical need 1024+. |
| LlamaIndex blog | Blog | 512 tokens often optimal for RAG; 1024 for longer context. Relevancy and faithfulness metrics used to select. |
| Sage benchmark (Storia-AI) | Benchmark | Code retrieval: chunks of <=800 tokens ideal; smaller has marginal gains. top_k=25 retrieval, reranked to top 3. |
| Zhang et al. 2025, arXiv:2506.15655 (cAST) | Paper | cAST (tree-sitter AST chunking) improves Recall@5 by 4.3 points on RepoEval and Pass@1 by 2.67 on SWE-bench. Uses non-whitespace character budgets; recursive split-then-merge on AST nodes. |
| Wu et al. 2026, arXiv:2605.04763v1 | Paper | Controlled study (864 settings): chunk size has weaker non-monotonic effect (<=1.9pp) than strategy choice. 32-64 line chunks best at small budgets; whole-file competitive at 16K. Sliding Window and cAST are Pareto-optimal; function-level chunking never Pareto-optimal. |
| Long Code Arena paper (OpenReview) | Paper | Optimal chunk size scales with available context. Sparse BM25 with word-level splitting competitive. Simple line-based chunking matches syntax-aware splitting across budgets. |
| Jina AI model card (jina-embeddings-v2-base-code) | Model docs | 8K token context window, 768-dim, trained on 30+ programming languages. Late chunking supported. |
| Elasticsearch Labs blog | Blog | Jina v2 default chunking in Elasticsearch is 250-word chunks with 100-word overlap; custom setups can increase chunk size to leverage 8K context. |
| Supermemory / code-chunk NPM package | OSS implementation | Tree-sitter AST chunking with scope trees, greedy window assignment, 0% overlap. Never splits mid-function. |
| KnowledgeSDK blog | Blog | AST-aware chunking solves boundary-loss problem; tree-sitter parses 129+ languages. Recommends complete semantic units. |
| Charles Chen wiki (chunking by document type) | Wiki | Source code: AST-based (tree-sitter), function/class-defined chunks, 0% overlap fallback to cAST recursive AST splitting. +4.3 Recall@5 on RepoEval. |

## 3. FINDINGS

### F1. Current chunk size in characters maps to far fewer tokens than literature sweet spots
- **Evidence**: CHUNK_SIZE=1000 chars (`indexer.py:32`). Code token density is ~1 token per 2.5-4 chars (iter-005 found avg 741 chars/chunk). Thus 1000 chars ≈ 250-400 tokens, and avg chunk ≈ 200-300 tokens.
- **Literature**: arXiv:2407.19794 found 512-1024 tokens optimal; Sage benchmark found <=800 tokens ideal for code; LlamaIndex recommends 512-1024; NVIDIA 2024 recommends 400-512 tokens with 10-20% overlap.
- **Implication**: Our chunks are roughly **half the size** of the empirically optimal range. We are massively under-utilizing jina-code's 8K token window. Raising CHUNK_SIZE to 2000-2500 chars would map to ~500-800 tokens, aligning with literature.

### F2. Overlap recommendations differ sharply between code and prose
- **Evidence**: NVIDIA/Firecrawl recommend 10-20% overlap for general text. For code, cAST paper, Supermemory code-chunk, and KnowledgeSDK all use **0% overlap** because AST boundaries are natural semantic units — once you split at function/class boundaries, overlap is unnecessary and introduces redundant context. Wu et al. (2026) found overlap effects weaker than chunk size for code.
- **Corpus context**: Markdown is only 4.2% of chunks; TypeScript is 75%. Overlap primarily benefits prose where sections can be split mid-argument.
- **Implication**: Current CHUNK_OVERLAP=150 (15% of 1000) is appropriate for prose but wasteful for code. A per-language override (0-5% for TS/JS/Python, 10-15% for MD) is justified.

### F3. AST-based chunking (cAST) is the structural ceiling for code retrieval quality
- **Evidence**: Zhang et al. (2025) cAST: +4.3pp Recall@5 on RepoEval. Supermemory code-chunk implements tree-sitter-based scope trees with greedy window assignment. Wu et al. (2026) confirmed cAST is Pareto-optimal.
- **Current state**: RecursiveSplitter is syntax-aware (prefers function/method, then class/struct, then line fallback) but not full AST-based recursive split-then-merge.
- **Implication**: The gap between current CocoIndex chunking and cAST is likely **2-4pp** on retrieval benchmarks. Full AST integration requires tree-sitter and pipeline changes, flagged as Phase-2.

### F4. Function-level chunking is contraindicated; the current mixed strategy is already superior
- **Evidence**: Wu et al. (2026): "Function chunking performs worse than all other strategies by 3.57-5.64pp... Function chunking is never Pareto-optimal." The current RecursiveSplitter avoids this pitfall by using function boundaries as a preference, not a hard rule, and falling back to size-limited chunks when functions are too large.
- **Implication**: We should **not** move to stricter function-level chunking. The current behavior is already in a better region of the design space.

### F5. Chunk size has a non-monotonic effect, but the direction of change is clear for our baseline
- **Evidence**: Wu et al. (2026) found chunk size effect <=1.9pp — smaller than strategy choice. arXiv:2407.19794 found 512 and 1024 outperform 128/256/2048. Long Code Arena found 32-64 lines at small budgets, whole-file at 16K.
- **Our position**: At ~250-400 tokens avg, we are on the left side of the literature curve (too small). Moving toward 500-800 tokens is the low-risk direction. There is no evidence that 1000-char chunks are optimal for our corpus.

### F6. Jina-code's 8K context window removes the embedding-model constraint from chunk size decisions
- **Evidence**: Jina model card (jina.ai) documents 8K input token length. Elasticsearch Labs blog notes "you don't have to use the whole 8K tokens, you can find a sweet spot based on your use case."
- **Implication**: Embedding truncation or model context limits are not blockers. The only constraints are retrieval precision (smaller = more specific) and reindex time/corpus size (larger = fewer chunks).

### F7. Per-language chunking is warranted given corpus composition and fixture query patterns
- **Evidence**: Corpus is 75% TS, 4.2% MD, 3.5% Python (iter-005). The 18-pair fixture includes queries targeting single functions (e.g., "handler that accepts an embedder name", id=2) and larger modules (e.g., "single scoring stage where recency, graph, feedback, and rescue boosts are combined", id=7 — a 1488-line file). TypeScript implementation files benefit from larger chunks that capture complete functions + surrounding imports. Markdown spec files benefit from section-aware smaller chunks to avoid mixing unrelated sections.
- **Implication**: A single global CHUNK_SIZE is suboptimal. Per-language overrides (TS: 2000 chars, MD: 800 chars, Python: 1500 chars) would better match semantic unit sizes.

### F8. Corpus size and reindex cost scale favor larger chunks
- **Evidence**: Iter-005 reports 116,722 chunks at avg 741 chars. Doubling chunk size would likely reduce chunks by 30-50% (not exactly half, because many files have multiple functions). Reindex time is ~25 minutes regardless of chunk count because embedding is the bottleneck, not I/O.
- **Implication**: Larger chunks have negligible cost downside and significant potential upside via reduced fragmentation.

## 4. RECOMMENDATIONS

1. **Raise CHUNK_SIZE to 2000 characters** (from 1000). Rationale: maps to ~500-800 tokens, aligning with Sage 800-token ideal and LlamaIndex 512-1024 sweet spot. With avg chunk currently 741 chars, the new ceiling would be used more fully. Estimated reindex cost: ~25 minutes. Estimated hit-rate lift: +3-6pp on 18-pair fixture (extrapolated from cAST +4.3pp and chunk-size literature).

2. **Reduce CHUNK_OVERLAP to 0-50 characters for code files** (from 150), maintain 150-200 for Markdown. Rationale: AST-aware splitting provides natural continuity; overlap is redundant for code. Markdown section splits benefit from overlap to avoid mid-section breaks.

3. **Implement per-language chunk size overrides** in project settings. Rationale: TS implementation files need larger chunks (2000 chars); Markdown needs smaller, section-aware chunks (800 chars); Python sits in between (1500 chars). This is an implementation task for the plan phase.

4. **Defer full cAST/tree-sitter integration to Phase-2 follow-on**. Rationale: Zhang et al. showed +4.3pp lift, but requires architectural changes to CocoIndex's chunker pipeline. Parameter-only tuning should be validated first.

5. **Do NOT switch to function-level chunking**. Rationale: Wu et al. demonstrated it is never Pareto-optimal. Current RecursiveSplitter behavior is already superior.

6. **Run an empirical test reindex with 2000-char chunks before committing**. Rationale: we lack data on actual chunk distribution at 2000 chars. Some very large files (e.g., 1488-line TypeScript modules) might produce ceiling-breach chunks. A test reindex would measure the new chunk count and size distribution.

## 5. JSONL DELTA ROW

```json
{"iter":6,"phase":"complete","timestamp":"2026-05-18T07:50:00Z","dimension":"chunking-strategy-survey","phase_id":"002-chunking-strategy-tuning","findings_count":8,"converged":false,"note":"Literature converges on 512-1024 tokens for code; our 1000-char ceiling maps to only ~250-400 tokens. Strong evidence to raise CHUNK_SIZE to 2000 chars, reduce overlap to 0-50 for code, implement per-language overrides. cAST deferred to Phase-2. Empirical test reindex recommended before committing."}
```

## 6. NEXT ITER PROMPT SUGGESTIONS

- **Iter 7 (chunking-synthesis or empirical-test)**: Either (a) synthesize F1-F8 into a concrete parameter matrix with estimated hit-rate lift and RAM/latency cost, or (b) run a test reindex with CHUNK_SIZE=2000 to measure actual chunk distribution and confirm ceiling-breach behavior on large TS files.
- **Iter 8 (implementation-scoping)**: If empirical test confirms distribution, scope the per-language override implementation in CocoIndex settings.yml and the overlap reduction logic.
