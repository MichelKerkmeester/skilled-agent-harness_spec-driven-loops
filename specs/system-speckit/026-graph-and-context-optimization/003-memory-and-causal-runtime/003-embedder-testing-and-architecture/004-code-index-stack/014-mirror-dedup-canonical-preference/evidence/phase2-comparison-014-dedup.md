# Phase 2 Comparison — 011 Rerank Model Fit Investigation

## Per-probe hit/miss

| Probe | Class | Difficulty | baseline-bge | bge-path-class | jina-v3 |
|---:|---|---|:---:|:---:|:---:|
| 1 | control | easy | ✗ | ✗ | ✗ |
| 2 | ? | easy | ✓ | ✓ | ✓ |
| 3 | FAILURE | easy | ✓ | ✓ | ✓ |
| 4 | ? | easy | ✓ | ✓ | ✓ |
| 5 | control | easy | ✗ | ✗ | ✗ |
| 6 | ? | medium | ✓ | ✓ | ✓ |
| 7 | ? | medium | ✓ | ✓ | ✓ |
| 8 | ? | medium | ✓ | ✓ | ✓ |
| 9 | ? | medium | ✓ | ✓ | ✓ |
| 10 | FAILURE | medium | ✓ | ✓ | ✓ |
| 11 | control | hard | ✓ | ✓ | ✓ |
| 12 | ? | hard | ✗ | ✗ | ✗ |
| 13 | ? | hard | ✓ | ✓ | ✓ |
| 14 | FAILURE | hard | ✓ | ✓ | ✓ |
| 15 | ? | hard | ✗ | ✗ | ✗ |
| 16 | control | medium | ✓ | ✓ | ✓ |
| 17 | ? | hard | ✓ | ✓ | ✓ |
| 18 | FAILURE | medium | ✓ | ✓ | ✓ |

## Summary

| Lane | Total hits | Failure flips (miss→hit) | Control regressions (hit→miss) | Median ms | p95 ms |
|---|---:|---:|---:|---:|---:|
| baseline-bge | 14/18 | 0 | 0 | 2028 | 2876 |
| bge-path-class | 14/18 | 0 | 0 | 2022 | 2899 |
| jina-v3 | 14/18 | 0 | 0 | 2016 | 2850 |

## Verdict

- **bge-path-class**: ❌ **FAILS** — 0 failure flips
- **jina-v3**: ❌ **FAILS** — 0 failure flips

## Phase 2 Bench Order Reminder

Per 011/research/research-convergence.md — bench BGE+path-class FIRST as the production-shippable lane; jina-v3 INFORMS only (never ships from this throwaway). If jina-v3 dominates path-class, escalate to production jina-v3 adapter packet. If jina-v3 ties or loses, delete cocoindex_code/rerankers_jina_v3.py + tests/test_rerankers_jina_v3.py.
