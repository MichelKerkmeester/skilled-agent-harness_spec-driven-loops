# RRF Sweep Results

Lane used for deterministic picker: `baseline-bge`.
Successful cells loaded: 7.
Latency cap: p95 <= 10319 ms (15 percent over baseline p95 8973 ms).

## Table 1: Top 10 Cells

| Rank | k | vec_weight | fts_weight | Hits | Hit rate | p50 ms | p95 ms | Default delta | Cap |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 60 | 0.9 | 0.5 | 12/18 | 0.667 | 1652 | 11868 | 0.400 | fail |
| 2 | 60 | 0.9 | 0.7 | 12/18 | 0.667 | 1702 | 12096 | 0.200 | fail |
| 3 | 30 | 0.7 | 0.7 | 12/18 | 0.667 | 1766 | 12174 | 30.000 | fail |
| 4 | 60 | 0.7 | 0.7 | 12/18 | 0.667 | 1633 | 12210 | 0.000 | fail |
| 5 | 90 | 0.7 | 0.7 | 12/18 | 0.667 | 1959 | 12989 | 30.000 | fail |
| 6 | 120 | 0.7 | 0.7 | 12/18 | 0.667 | 1717 | 13642 | 60.000 | fail |
| 7 | 60 | 0.7 | 0.5 | 12/18 | 0.667 | 1640 | 13759 | 0.200 | fail |

## Table 2: Per-Probe Heatmap

| Probe | Picked cell | Cells hit | Hit configs |
|---:|---|---:|---|
| 1 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 2 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 3 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 4 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 5 | MISS | 0 | - |
| 6 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 7 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 8 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 9 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 10 | MISS | 0 | - |
| 11 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 12 | MISS | 0 | - |
| 13 | MISS | 0 | - |
| 14 | MISS | 0 | - |
| 15 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 16 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 17 | HIT | 7 | K=60 V=0.9 F=0.5, K=60 V=0.9 F=0.7, K=30 V=0.7 F=0.7, K=60 V=0.7 F=0.7, K=90 V=0.7 F=0.7, ... +2 |
| 18 | MISS | 0 | - |

## Table 3: Latency Scatter

| Cell | Hit rate | p95 ms |
|---|---:|---:|
| K=60 V=0.9 F=0.5 | 0.667 | 11868 |
| K=60 V=0.9 F=0.7 | 0.667 | 12096 |
| K=30 V=0.7 F=0.7 | 0.667 | 12174 |
| K=60 V=0.7 F=0.7 | 0.667 | 12210 |
| K=90 V=0.7 F=0.7 | 0.667 | 12989 |
| K=120 V=0.7 F=0.7 | 0.667 | 13642 |
| K=60 V=0.7 F=0.5 | 0.667 | 13759 |

## Decision

Picked cell: `K=60 V=0.9 F=0.5` with 12/18 hits, p50 1652 ms, and p95 11868 ms.
The picker maximizes hit rate, then minimizes p95 latency, then prefers the smallest distance from inherited defaults `(60, 0.7, 0.7)`.
No successful cell met the 15 percent p95 cap, so the report keeps the best-ranked cell and marks the cap failure for operator review.

## Probe Notes

- Probe 1: picked cell is HIT and stayed hit.
- Probe 2: picked cell is HIT and stayed hit.
- Probe 3: picked cell is HIT and stayed hit.
- Probe 4: picked cell is HIT and stayed hit.
- Probe 5: picked cell is MISS and stayed miss.
- Probe 6: picked cell is HIT and stayed hit.
- Probe 7: picked cell is HIT and stayed hit.
- Probe 8: picked cell is HIT and stayed hit.
- Probe 9: picked cell is HIT and stayed hit.
- Probe 10: picked cell is MISS and stayed miss.
- Probe 11: picked cell is HIT and stayed hit.
- Probe 12: picked cell is MISS and stayed miss.
- Probe 13: picked cell is MISS and stayed miss.
- Probe 14: picked cell is MISS and stayed miss.
- Probe 15: picked cell is HIT and stayed hit.
- Probe 16: picked cell is HIT and stayed hit.
- Probe 17: picked cell is HIT and stayed hit.
- Probe 18: picked cell is MISS and stayed miss.
