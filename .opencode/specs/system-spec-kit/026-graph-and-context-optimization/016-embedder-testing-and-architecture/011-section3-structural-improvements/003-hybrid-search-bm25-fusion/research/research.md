# Research Synthesis: 016/011/003 Hybrid Search (BM25 + Semantic Fusion)

> **Status**: DEFERRED — cli-devin daily quota exhausted before iter 8 could run (2026-05-18T05:20Z). Resume when quota refreshes.

## Question

Does adding BM25 lexical search + fusion (RRF or weighted-linear) to CocoIndex's semantic retrieval improve hit-rate on the 18-pair fixture? What weights/normalization?

## State

3 iters were planned (8, 9, 10) covering:
- **iter 8** (bm25-engine-options): sqlite-fts5 vs tantivy vs manticore vs rank-bm25; cross-reference mk-spec-memory's bm25-index.ts
- **iter 9** (fusion-algorithms): RRF vs weighted-linear vs CombSUM vs CombMNZ; mk-spec-memory's stage2-fusion.ts as proven precedent; BEIR/TREC literature
- **iter 10** (hybrid-synthesis-and-cross-cutting): full synthesis + CROSS-CUTTING synthesis across all 3 phases (reranker + chunking + hybrid)

None of these executed due to cli-devin daily quota exhaustion.

## Strong leading hypothesis (from prior context)

mk-spec-memory's `lib/search/pipeline/stage2-fusion.ts` already implements hybrid search with `lib/search/bm25-index.ts` (sqlite-fts5 backend) — proven in production. The CocoIndex implementation would mirror this pattern, so iter 8/9 are primarily about cross-engine analysis + lift estimation, not greenfield design.

## Cross-cutting note (iter 10 deferred)

Iter 10 was scoped as cross-cutting synthesis covering all 3 phases. The reranker phase (016/011/001) DID converge with a clear recommendation (GTE inline at K=20, expected +2 to +4 hits = 50-61.1% post-rerank). The chunking + hybrid phases need their iter sweeps before integrated cross-cutting synthesis can be done.

## Next steps when resuming

1. Re-dispatch via cli-devin SWE-1.6 (verify quota refreshed)
2. Use the prompts at `/tmp/devin-research-011-{8,9,10}.md` (rebuild via `python3 /tmp/build-research-iters.py` if /tmp cleared)
3. Recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
4. Dispatch pattern: `devin -p --prompt-file /tmp/devin-research-011-N.md --agent-config <recipe> --permission-mode dangerous`
5. Extract via `python3 /tmp/extract-research-iters.py 8 9 10`

## Open questions (carry forward)

- Is sqlite-fts5 sufficient for our corpus scale (127K chunks) in CocoIndex's Python context?
- Best fusion algorithm for code retrieval specifically (RRF k=60 default? linear-weighted 0.3 BM25 + 0.7 semantic?)
- Whether to expose hybrid as opt-in or default-on
- Total integrated lift estimate when ALL 3 (reranker + tuned chunking + hybrid) ship together
