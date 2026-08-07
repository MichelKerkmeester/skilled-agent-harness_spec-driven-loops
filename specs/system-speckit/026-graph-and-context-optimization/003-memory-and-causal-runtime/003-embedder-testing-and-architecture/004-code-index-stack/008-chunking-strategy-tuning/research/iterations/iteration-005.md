---
title: "Iter 5 — current-chunker-analysis (016/011/002 research)"
iter_number: 5
dimension: current-chunker-analysis
phase_id: "002-chunking-strategy-tuning"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

# Iter 5 — current-chunker-analysis

## 1. RESEARCH QUESTION

What are the current chunking parameters, corpus statistics, and chunker behavior of the CocoIndex production pipeline, and what strengths and weaknesses does this configuration exhibit for code retrieval on our mixed TS/MD/Python corpus?

## 2. SCOPE READ

| Source | Type | Annotation |
|--------|------|------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:32-37` | Code | Hard-coded chunking constants: CHUNK_SIZE=1000, MIN_CHUNK_SIZE=250, CHUNK_OVERLAP=150. splitter = RecursiveSplitter(). |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:271-277` | Code | `splitter.split(content, chunk_size=CHUNK_SIZE, min_chunk_size=MIN_CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP, language=language)` — language-aware invocation. |
| `target_sqlite.db` (live DB) | Telemetry | 7,692 files, 116,722 chunks, avg 741.1 chars/chunk, language breakdown extracted via Python + sqlite-vec. |
| `.opencode/skills/mcp-coco-index/references/settings_reference.md:152-165` | Docs | Documents built-in chunking params (1000 chars target, 250 min, 150 overlap, RecursiveSplitter algorithm). |
| CocoIndex docs — `RecursiveSplitter` | Web/docs | Syntax-aware, language-aware chunking that prefers function/method boundaries, then class/struct, then line-level fallback. Returns Chunk objects with line positions. |
| Wu et al. 2026, arXiv:2605.04763v1 | Paper | Controlled study (864 settings): Function chunking underperforms Sliding Window and cAST by 3.57–5.64pp; chunk size has weaker non-monotonic effect (≤1.9pp); Sliding Window and cAST are Pareto-optimal. |
| Zhang et al. 2025, arXiv:2506.15655 | Paper | cAST (tree-sitter AST chunking) improves Recall@5 by 4.3 points on RepoEval and Pass@1 by 2.67 on SWE-bench. Non-whitespace character budget. |
| Storia-AI/sage benchmarks/retrieval README | Blog/benchmark | Code retrieval benchmark: chunks of ≤800 tokens ideal; smaller has marginal gains. top_k=25 retrieval, reranked to top 3. |

## 3. FINDINGS

### F1. Current chunking parameters are hard-coded and character-based
- **Evidence**: `indexer.py:32-37` defines `CHUNK_SIZE = 1000`, `MIN_CHUNK_SIZE = 250`, `CHUNK_OVERLAP = 150`, and `splitter = RecursiveSplitter()`. These are module-level constants with no project-level override mechanism.
- **Implication**: Any tuning requires a code change followed by a full `ccc reset --force && ccc index` (≈25 minutes on this repo). No per-language or per-project configuration surface exists.

### F2. Corpus composition is heavily TypeScript-biased
- **Evidence**: Live DB query (Python + sqlite-vec) yields:
  - Total: 7,692 files, 116,722 chunks (avg **15.2 chunks/file**)
  - TypeScript: 87,814 chunks (75.2%), 6,024 files, 14.6 chunks/file
  - JavaScript: 14,637 chunks (12.5%), 761 files, 19.2 chunks/file
  - Bash: 5,199 chunks (4.5%), 414 files, 12.6 chunks/file
  - Markdown: 4,955 chunks (4.2%), 270 files, 18.4 chunks/file
  - Python: 4,048 chunks (3.5%), 219 files, 18.5 chunks/file
- **ADR reference**: 018/003 reports 8,427 files / 127,346 chunks (avg 15.1 chunks/file); the DB is slightly stale or filtered, but proportions are consistent.

### F3. Actual chunk sizes cluster well below the 1000-char ceiling
- **Evidence**: DB chunk length distribution:
  - 750–999 chars: 63,481 (54.4%)
  - 500–749 chars: 35,431 (30.4%)
  - 250–499 chars: 15,710 (13.5%)
  - <250 chars: 1,548 (1.3%)
  - 1000–1499 chars: 590 (0.5%)
  - ≥2000 chars: 0 (0.0%)
  - Max chunk length: **exactly 1000** (hard ceiling enforced)
  - Average: **741.1 chars**
- **Implication**: The RecursiveSplitter is conservative. 99.5% of chunks are under 1000 chars. There is substantial headroom to raise CHUNK_SIZE without frequently hitting the ceiling.

### F4. Overlap is 150 chars (15% of target) — moderate for code, possibly low for prose
- **Evidence**: `CHUNK_OVERLAP = 150` against `CHUNK_SIZE = 1000`.
- **CocoIndex docs**: RecursiveSplitter preserves code structure (function/class boundaries), so syntactic continuity reduces the need for large text overlap compared to prose.
- **Literature**: Wu et al. (2026) found overlap effects weaker than chunk size or context length for Sliding Window on code completion. For Markdown (4.2% of corpus), section boundaries may benefit from higher overlap to avoid splitting semantic sections.

### F5. RecursiveSplitter is syntax-aware but not full AST-based
- **Evidence**: CocoIndex docs describe RecursiveSplitter as preferring function/method boundaries, then class/struct, then line-level fallback. It uses language detection (`detect_code_language`) and respects import blocks. Zhang et al. (2025) showed full AST-based cAST improves Recall@5 by 4.3 points over line-based heuristics.
- **Implication**: CocoIndex's current approach is a middle ground — better than naive line splitting, but not as structure-preserving as cAST. The gap may be 2–4pp on retrieval benchmarks.

### F6. Function-level chunking is contraindicated by controlled evidence
- **Evidence**: Wu et al. (2026), §5.1: "Function chunking performs worse than all other strategies by 3.57–5.64 percentage points (pp) Exact Match... Function chunking is never Pareto-optimal."
- **Implication**: Because RecursiveSplitter already falls back from function boundaries when chunks would exceed size limits, the current behavior implicitly avoids the pure-function-level pitfall. Moving to stricter function-level chunking would likely *reduce* retrieval quality.

### F7. Chunk size literature converges on 800–1500 tokens (or ~2000–4000 chars) for code
- **Evidence**:
  - Sage benchmark: 800 tokens ideal for code retrieval.
  - LlamaIndex: 1024 tokens often optimal for RAG.
  - Mistral Codestral Embed: 3000 chars with 1000 overlap (embedding-focused, not retrieval).
  - cAST paper: uses non-whitespace character budgets; optimal retrieval chunk size varies by language but typically 500–1000 tokens.
- **Implication**: Our current 1000-char target ≈ 250–400 tokens (code is dense, fewer tokens per char than prose). This is on the smaller side of the literature range. Raising to 1500–2000 chars could align with the 800-token recommendation without excessive ceiling breaches.

## 4. RECOMMENDATIONS

1. **Increase CHUNK_SIZE to 1500–2000 chars** (from 1000). Rationale: average chunk is 741 chars; 99.5% are under 1000. Raising the ceiling would reduce chunks-per-file from ~15 to ~8–10, reducing fragmentation and potentially improving top-k recall on the 18-pair fixture. Estimated reindex cost: ~25 minutes (same as current full reindex).

2. **Increase CHUNK_OVERLAP to 200–300 chars** (from 150), especially for Markdown. Rationale: 15% overlap is conservative. For prose files (Markdown, 4.2% of corpus), section splits benefit from higher overlap. For code, 150 may remain adequate because syntactic boundaries provide natural continuity.

3. **Defer full AST/cAST integration** to a follow-on packet. Rationale: Zhang et al. showed +4.3 Recall@5 points, but implementing tree-sitter-based recursive split-then-merge in CocoIndex requires architectural changes outside the scope of a parameter-tuning phase. Flag as Phase-2 improvement.

4. **Do NOT switch to function-level chunking**. Rationale: Wu et al. demonstrated it is never Pareto-optimal. The current RecursiveSplitter's mixed approach (function boundary preferred, size-limited fallback) is already superior.

5. **Expose chunking parameters in project settings** (`settings.yml`). Rationale: currently hard-coded in `indexer.py:32-37`. Making them project-level config enables per-repo tuning without code changes. This is an implementation task for the plan phase.

## 5. JSONL DELTA ROW

```json
{"iter":5,"phase":"complete","timestamp":"2026-05-18T07:45:00Z","dimension":"current-chunker-analysis","phase_id":"002-chunking-strategy-tuning","findings_count":7,"converged":false,"note":"Current chunker is syntax-aware with 1000-char ceiling; avg chunk 741 chars; TS 75% of corpus; headroom exists to raise chunk_size and overlap; function-level chunking contraindicated by Wu et al.; cAST integration deferred to Phase 2"}
```

## 6. NEXT ITER PROMPT SUGGESTIONS

- **Iter 6 (chunking-strategy-survey)**: Survey literature on chunk-size sweeps (200/500/1000/2000 chars), overlap tuning (0/10/25%), and token-vs-character budgets. Include the 800-token Sage finding and LlamaIndex 1024-token recommendation. Identify the optimal parameter set for a TS-heavy mixed corpus.
- **Iter 7 (chunking-synthesis)**: Synthesize F1–F7 into a concrete recommendation with estimated hit-rate lift on the 18-pair fixture, RAM/latency cost, and an implementation plan (including project-settings exposure and per-language overrides).
