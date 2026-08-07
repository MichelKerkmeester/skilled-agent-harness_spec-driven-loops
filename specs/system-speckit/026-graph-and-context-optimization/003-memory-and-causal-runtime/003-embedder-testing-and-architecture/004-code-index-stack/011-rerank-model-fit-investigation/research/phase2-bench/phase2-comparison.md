# Phase 2 Comparison — 011 Rerank Model Fit Investigation

## Per-probe hit/miss

| Probe | Class | Difficulty | baseline-bge | bge-path-class | jina-v3 |
|---:|---|---|:---:|:---:|:---:|
| 1 | control | easy | ✗ | ✗ | ✗ |
| 3 | FAILURE | easy | ✓ | ✓ | ✓ |
| 5 | control | easy | ✓ | ✓ | ✗ |
| 10 | FAILURE | medium | ✗ | ✗ | ✗ |
| 11 | control | hard | ✗ | ✗ | ✓ |
| 14 | FAILURE | hard | ✗ | ✗ | ✓ |
| 16 | control | medium | ✓ | ✓ | ✓ |
| 18 | FAILURE | medium | ✗ | ✗ | ✓ |

## Summary

| Lane | Total hits | Failure flips (miss→hit) | Control regressions (hit→miss) | Median ms | p95 ms |
|---|---:|---:|---:|---:|---:|
| baseline-bge | 3/8 | 0 | 0 | 1523 | 12613 |
| bge-path-class | 3/8 | 0 | 0 | 1481 | 11224 |
| jina-v3 | 5/8 | 2 | 1 | 2018 | 15059 |

## Verdict

- **bge-path-class**: ❌ **FAILS** — 0 failure flips
- **jina-v3**: ⚠️ **HOLDS** — 2 failure flips but 1 control regressions

## Phase 2 Bench Order Reminder

Per 011/research/research-convergence.md — bench BGE+path-class FIRST as the production-shippable lane; jina-v3 INFORMS only (never ships from this throwaway). If jina-v3 dominates path-class, escalate to production jina-v3 adapter packet. If jina-v3 ties or loses, delete cocoindex_code/rerankers_jina_v3.py + tests/test_rerankers_jina_v3.py.
