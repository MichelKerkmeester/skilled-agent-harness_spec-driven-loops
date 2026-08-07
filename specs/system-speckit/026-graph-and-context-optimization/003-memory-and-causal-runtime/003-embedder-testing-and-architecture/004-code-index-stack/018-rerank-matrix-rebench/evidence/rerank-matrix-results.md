# Rerank Matrix Results — 016/004/018

## Empirical bench

**Source**: 017 final-gate bench run (`../017-hybrid-fusion-empirical-recalibration/evidence/phase2-comparison-017-recalibrated.md`) — the same 3 reranker lanes (BGE-baseline, BGE+path-class, jina-reranker-v3) measured against the corrected 18-probe fixture under the locked 017 RRF defaults (K=60, V=0.9, F=0.5). The 017 final-gate IS the 018 matrix benchmark for Lanes B/C/D under final pipeline defaults.

**Lane A (no-rerank ablation) was excluded** because the harness exhibited a 32-second-per-probe timeout under `COCOINDEX_RERANK_ENABLED=false` (hits=0, latency_ms.mean=32001ms in the killed 16:35 run). This is a known follow-on debt — the no-rerank dispatch path needs an independent debugging packet. Lanes B/C/D fully establish the production reranker verdict on the fully-fixed candidate set.

## Per-lane summary

| Lane | Reranker | Path-class | Hit rate | p50 ms | p95 ms | Maintainability |
|---|---|:---:|---:|---:|---:|---|
| B | `BAAI/bge-reranker-v2-m3` | OFF | **12/18** | 1758 | 12178 | 3 (HF stock) |
| C | `BAAI/bge-reranker-v2-m3` | ON | **13/18** | 1726 | 12389 | 2 (custom boost) |
| D | `jinaai/jina-reranker-v3` | n/a | **14/18** ✅ | 2183 | 13938 | 1 (custom JinaForRanking) |

## Per-probe heatmap

| Probe | Class | Difficulty | B baseline-bge | C bge-path-class | D jina-v3 |
|---:|---|---|:---:|:---:|:---:|
| 1 | control | easy | ✓ | ✓ | ✓ |
| 2 | ? | easy | ✓ | ✓ | ✓ |
| 3 | FAILURE | easy | ✓ | ✓ | ✓ |
| 4 | ? | easy | ✓ | ✓ | ✓ |
| 5 | control | easy | ✗ | ✗ | ✗ |
| 6 | ? | medium | ✓ | ✓ | ✓ |
| 7 | ? | medium | ✓ | ✓ | ✓ |
| 8 | ? | medium | ✓ | ✓ | ✓ |
| 9 | ? | medium | ✓ | ✓ | ✓ |
| 10 | FAILURE | medium | ✗ | ✗ | ✓ ← jina-only |
| 11 | control | hard | ✓ | ✓ | ✓ |
| 12 | ? | hard | ✗ | ✗ | ✗ |
| 13 | ? | hard | ✗ | ✗ | ✗ |
| 14 | FAILURE | hard | ✗ | ✓ | ✗ |
| 15 | ? | hard | ✓ | ✓ | ✓ |
| 16 | control | medium | ✓ | ✓ | ✓ |
| 17 | ? | hard | ✓ | ✓ | ✓ |
| 18 | FAILURE | medium | ✗ | ✗ | ✓ ← jina-only |

## Decision matrix

| Criterion (priority order) | Lane B | Lane C | Lane D |
|---|---:|---:|---:|
| 1. Hit rate (max) | 12 | 13 | **14** ✅ |
| 2. Worst-case probes (probes hit by no-other vs lane, lower is better) | 0 | 1 (probe 14) | 2 (probes 10, 18) |
| 3. p95 latency (min) | **12178** | 12389 | 13938 (+14% vs B) |
| 4. Peak RSS | similar | similar | similar |
| 5. Maintainability score | **3** | 2 | 1 |

## Picked winner

**Lane D — `jinaai/jina-reranker-v3`** ✅

Rationale:
1. **Hit rate (primary)**: 14/18 vs Lane C's 13/18 vs Lane B's 12/18. Jina-v3 is the only lane that hits probes 10 + 18 (FAILURE-class probes the BGE family misses).
2. **Worst-case probes**: jina-v3 misses probe 14 (the import-header probe that bge-path-class catches), but gains probes 10 + 18 net +2. Lane D's miss set (5, 12, 13, 14) is similar size to B's (5, 10, 12, 13, 14, 18) but smaller.
3. **Latency tradeoff**: jina-v3 p95 is 14% slower than BGE-baseline (13938 vs 12178 ms). Within acceptable production envelope.
4. **Maintainability cost (soft factor)**: jina-v3 uses custom `JinaForRanking` (Qwen3-base with listwise scoring) vs BGE's stock HuggingFace `AutoModelForSequenceClassification`. Higher maintenance cost but the hit rate win justifies it. BGE remains opt-in via `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3`.

## Runner-up scenario

**Lane C — BGE + path-class** is the strong runner-up for operators who:
- Need lower-latency reranking (p95 12389 ms vs 13938 ms = 11% faster)
- Run on hardware where jina-v3's `JinaForRanking` is unavailable
- Prefer HF stock models for supply-chain simplicity

To opt back to BGE + path-class:

```bash
COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3
COCOINDEX_RERANK_PATH_CLASS_BOOST=true
```

## Lessons learned

1. **011 deep-research's "jina-v3 wins" conclusion was CONFIRMED on the corrected pipeline** — even after 013 fixture audit, 014 mirror dedup, 015 tree-sitter chunking, 016 expansion-opt-out, and 017 RRF lock, jina-v3 holds its hit-rate lead. The original public-CoIR-benchmark intuition was directionally correct.
2. **Path-class boost is a 1-probe gain** (12→13 vs baseline-bge). Useful, but not enough to overtake jina-v3. Retained as opt-in.
3. **FAILURE-class probes (10, 14, 18)** are differentially won across lanes — jina-v3 wins 10 + 18, BGE+path-class wins 14. No single lane catches all three. Future work: investigate why probe 14 is BGE-only (likely lexical-heavy query that BGE's cross-encoder catches but jina-v3's listwise misses).
4. **Lane A (no-rerank ablation) needs a separate debug packet** — `COCOINDEX_RERANK_ENABLED=false` produced 32-sec/probe timeouts and zero hits. The dispatch path for rerank-disabled queries has a bug. Documented as known follow-on; not blocking the arc.

## Arc closure

Packet 018 is the final ship of the 6-packet 016/004 arc:
- **013**: bench harness + corrected fixture (shipped)
- **014**: mirror dedup (shipped)
- **015**: tree-sitter chunking (shipped, mixed bench; foundational architectural fix)
- **016**: query expansion opt-in default-false (shipped, honest empirical regression)
- **017**: RRF empirical recalibration — no-op (shipped, locked latency-optimum)
- **018**: jina-v3 picked as production reranker default (this packet)

Final state under default config (no env overrides):

| Lane | Hit rate |
|---|---:|
| baseline-bge | 12/18 |
| bge-path-class | 13/18 |
| **jina-v3 (production)** | **14/18** |
