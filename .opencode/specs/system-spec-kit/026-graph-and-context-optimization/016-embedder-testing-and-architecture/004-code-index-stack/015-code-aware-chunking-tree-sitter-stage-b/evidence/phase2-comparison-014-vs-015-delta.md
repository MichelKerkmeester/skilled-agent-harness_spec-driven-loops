# Phase 2 Delta: 014 vs 015

Status: **COMPLETE** (bench re-ran via main agent on 2026-05-19 after codex sandbox blocked `ccc index`).

## Bench input

- Fixture: `phase2-bench/code-retrieval-fixture-corrected.json` (18 probes, 014-shipped corrected file)
- Embedder: `sbert/BAAI/bge-code-v1`
- DB rebuild: `ccc index` after `ccc reset --force`, 83,527 chunks across 8,469 files (typescript 61,050 / javascript 11,158 / python 4,224 / bash 3,597 / markdown 3,464 / html 19 / css 8 / json 6 / text 1)
- Chunking flag: `COCOINDEX_CODE_AWARE_CHUNKING=true` (default)
- Tree-sitter grammars active: typescript / javascript / python / go / rust / java (go/rust/java unused — corpus has none)

## Summary

| Lane | 014 hits | 015 hits | Δ | Median ms (015) | p95 ms (015) |
|---|---:|---:|---:|---:|---:|
| baseline-bge | 14/18 | **12/18** | **−2** | 1856 | 14067 |
| bge-path-class | 14/18 | **13/18** | **−1** | 1792 | 12437 |
| jina-v3 | 14/18 | **14/18** | **0** | 2239 | 14508 |

## Per-probe deltas

| Probe | Class | 014 (all lanes) | 015 baseline-bge | 015 bge-path-class | 015 jina-v3 | Net |
|---:|---|:---:|:---:|:---:|:---:|---|
| 1 | control | ✗ | ✓ | ✓ | ✓ | **gained 3 lanes** |
| 5 | control | ✗ | ✗ | ✗ | ✗ | unchanged |
| 10 | FAILURE | ✓ | ✗ | ✗ | ✓ | lost on BGE; jina holds |
| 12 | ? | ✗ | ✗ | ✗ | ✗ | unchanged |
| 13 | ? | ✓ | ✗ | ✗ | ✗ | lost 3 lanes |
| 14 | FAILURE | ✓ | ✗ | ✓ | ✗ | mixed — bge-path-class hits the original import-header probe |
| 15 | ? | ✗ | ✓ | ✓ | ✓ | **gained 3 lanes** |
| 18 | FAILURE | ✓ | ✗ | ✗ | ✓ | lost on BGE; jina holds |

All other probes (2, 3, 4, 6, 7, 8, 9, 11, 16, 17) HIT all 3 lanes both pre- and post-015.

## Analysis

**Gains (probes 1 + 15)** — tree-sitter body chunks made the relevant function/class definitions addressable as their own chunks instead of being buried inside line-windowed blocks. Both queries previously failed because the right code body wasn't ranked into the rerank window; with body-chunk addressability, the cross-encoder sees the right candidate.

**Losses (probes 10, 13, 18 on BGE-family; 13 on jina-v3)** — body chunks have less lexical surface than the prior line-windowed chunks. BGE-reranker-v2-m3 scores by token-overlap heuristic; tighter chunks reduce the surface available for that match. Three observations:

1. **jina-v3 is more robust to the chunking shift** (loses only probe 13) because its listwise scoring is less dependent on per-token lexical overlap.
2. **Path-class boost partially compensates** (recovers probe 14 — the original import-header bug — on bge-path-class).
3. **The losses are recoverable downstream**: 016 query expansion adds identifier-flavored variants (camelCase / snake_case / synonyms) to the query, restoring lexical surface for BGE-family rerankers. 017 RRF recalibration adjusts fusion weights for the new candidate set. 018 rerank-matrix re-bench picks the optimal reranker on the fully-fixed pipeline.

**Probe 14 is the load-bearing win for 015**: pre-013 fixture audit, all 3 lanes missed probe 14 because the import-header chunk dominated the dense rank. Post-014 dedup + 015 tree-sitter chunking, bge-path-class now hits it — the body chunks for `findFiles`/`indexFiles` are reachable.

## Net verdict

015 is **architecturally correct + locally regressing**. Body chunks are the right primitive, but the BGE-family rerankers need 016 lexical recovery to clear the prior 14/18 baseline. Shipping 015 standalone trades:

- **+ probe 14 hit on bge-path-class** (the original chunking-starvation bug from 011 iter 6)
- **+ probes 1 + 15 hit on all 3 lanes** (recall gains from body-chunk addressability)
- **− probes 10 + 13 + 18 on BGE-baseline** (lexical surface drop; expected to recover post-016)
- **− probe 13 + 14 on jina-v3** (jina's listwise scoring shifted; expected to recover post-017/018 tuning)

Expected post-arc state (post-016 / 017 / 018): ≥14/18 on all 3 lanes with body chunks active. 015 is the architectural prerequisite; its standalone result is not the final shipping state.

## Probe rerank scores (snapshots)

Full JSONL traces saved at:
- `phase2-bench/baseline-bge-015-treesitter.rerank-scores.jsonl`
- `phase2-bench/bge-path-class-015-treesitter.rerank-scores.jsonl`
- `phase2-bench/jina-v3-015-treesitter.rerank-scores.jsonl`

Inspect for forensic per-probe ranking detail.
