---
title: "Expanded calibration summary (May 20, 2026)"
description: "Aggregate lane-level summary of the 023B expanded-fixture calibration sweep: mean hits, hit rate, stddev, and p95 latency across every reranker lane, RRF K value, top-K cut, boost magnitude, and fusion formula measured against the 73-probe fixture."
trigger_phrases:
  - "expanded calibration summary"
  - "023B calibration lane results"
  - "Qwen3 jina-v3 calibration aggregate"
  - "RRF K top-K boost fusion sweep"
importance_tier: "important"
contextType: "reference"
---

# Expanded calibration summary (May 20, 2026)

Lane-level aggregate from the 023B expanded-fixture calibration sweep against `code-retrieval-fixture-expanded-v2.json` (73 probes).

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. LANE RESULTS](#2--lane-results)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The sweep isolates one variable per lane against a fixed Stage 1 embedder (`sbert/nomic-ai/CodeRankEmbed`, 84,747 chunks across 8,555 files). Lanes cover the reranker choice (the load-bearing variable that drove ADR-027), the RRF K value, the rerank top-K cut, the path-class / canonical boost magnitudes, and the fusion formula. Reranker lanes ran n=3; other lanes ran n=1 or n=2 because they showed no movement worth replaying.

The headline is that only one variable moved: swapping the reranker from `jinaai/jina-reranker-v3` to `Qwen/Qwen3-Reranker-0.6B` lifted mean hits 29 → 30 and dropped p95 latency 2905 → 1984 ms. RRF K, boost magnitude, and fusion formula were all flat at 29/73; top-K below 20 regressed; top-K above 20 was flat with worse latency.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:lane-results -->
## 2. LANE RESULTS

| Lane | Name | Runs | Mean hits | Hit rate mean | Stddev | CI95 | p95 mean ms | p95 stddev ms |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| boost-p0p005-c0p005 | boost path=0.005 canonical=0.005 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2817.0 | 0.0 |
| boost-p0p01-c0p01 | boost path=0.01 canonical=0.01 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2800.0 | 0.0 |
| boost-p0p02-c0p02 | boost path=0.02 canonical=0.02 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2792.0 | 0.0 |
| boost-p0p05-c0p05 | boost path=0.05 canonical=0.05 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2865.0 | 0.0 |
| fusion-avg | fusion equal average | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2869.0 | 0.0 |
| fusion-combmnz | fusion CombMNZ | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2837.0 | 0.0 |
| fusion-rrf | fusion RRF | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2837.0 | 0.0 |
| reranker-jina-v3 | reranker jinaai/jina-reranker-v3 (cc-by-nc-4.0) | 3 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2904.7 | 30.9 |
| **reranker-qwen3-0p6b** | **reranker Qwen/Qwen3-Reranker-0.6B (apache-2.0)** | **3** | **30.00/73** | **0.411** | **0.000** | **0.000** | **1984.3** | **61.7** |
| rrf-k10 | RRF K=10 | 2 | 30.00/73 | 0.411 | 0.000 | 0.000 | 2906.0 | 45.3 |
| rrf-k100 | RRF K=100 | 2 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2905.5 | 38.9 |
| rrf-k150 | RRF K=150 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 3456.0 | 0.0 |
| rrf-k30 | RRF K=30 | 2 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2924.5 | 176.1 |
| rrf-k300 | RRF K=300 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2896.0 | 0.0 |
| rrf-k60 | RRF K=60 | 2 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2945.5 | 123.7 |
| sample-smoke | live smoke subset first five probes | 1 | 3.00/5 | 0.600 | 0.000 | 0.000 | 2866.0 | 0.0 |
| topk-10 | rerank top_k=10 | 1 | 27.00/73 | 0.370 | 0.000 | 0.000 | 1654.0 | 0.0 |
| topk-20 | rerank top_k=20 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 2940.0 | 0.0 |
| topk-40 | rerank top_k=40 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 3604.0 | 0.0 |
| topk-5 | rerank top_k=5 | 1 | 19.00/73 | 0.260 | 0.000 | 0.000 | 1130.0 | 0.0 |
| topk-80 | rerank top_k=80 | 1 | 29.00/73 | 0.397 | 0.000 | 0.000 | 3522.0 | 0.0 |

<!-- /ANCHOR:lane-results -->
