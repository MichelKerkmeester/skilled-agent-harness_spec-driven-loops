---
title: "mcp-coco-index Qwen3 reranker default benchmark -- 2026-05-20"
description: "Curated benchmark report for the 023B expanded-fixture reranker head-to-head. Winner: Qwen/Qwen3-Reranker-0.6B at 30/73 hits, p95 1984 ms, Apache-2.0."
trigger_phrases:
  - "mcp-coco-index Qwen3 reranker benchmark"
  - "benchmark-2026-05-20-expanded"
  - "Qwen3-Reranker-0.6B default flip"
  - "023B reranker head-to-head"
importance_tier: "important"
contextType: "reference"
---

# mcp-coco-index Qwen3 reranker default benchmark -- 2026-05-20

> **Winner:** `Qwen/Qwen3-Reranker-0.6B`, 30.00/73 hits, 0.411 hit rate, p95 1984 ms, Apache-2.0. The default flip was executed in ADR-027.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. HEADLINE / OVERVIEW](#1--headline--overview)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-CANDIDATE PROFILES](#4--per-candidate-profiles)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:headline-overview -->
## 1. HEADLINE / OVERVIEW

This report records the 023B reranker sub-sweep that flipped the Stage 2 default from `jinaai/jina-reranker-v3` to `Qwen/Qwen3-Reranker-0.6B` on 2026-05-20.

Key measurement context:

| Field | Value |
|---|---|
| Date | 2026-05-20 |
| Fixture | `code-retrieval-fixture-expanded-v2.json` |
| Probe count | 73 probes; see [`SOURCE.md`](./SOURCE.md) for taxonomy |
| Index | 84,747 chunks / 8,555 files |
| Stage 1 embedder | `nomic-ai/CodeRankEmbed` |
| Stage 2 winner | `Qwen/Qwen3-Reranker-0.6B` |
| Decision record | ADR-027 |

The load-bearing result is narrow but unambiguous: Qwen3 produced one additional hit, lowered p95 latency by 921 ms, and moved the default reranker from CC BY-NC 4.0 to Apache-2.0 with only +34 MB warm RSS.
<!-- /ANCHOR:headline-overview -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Reranker | Default status | License | Mean hits | Hit rate | p95 mean | Verdict |
|---|---|---|---:|---:|---:|---|
| `jinaai/jina-reranker-v3` | Old default | CC BY-NC 4.0 | 29.00/73 | 0.397 | 2905 ms | Superseded |
| **`Qwen/Qwen3-Reranker-0.6B`** | **New default** | **Apache-2.0** | **30.00/73** | **0.411** | **1984 ms** | **Promoted** |

Delta:

- Hits: +1/73 (+1.4 percentage points).
- p95 latency: -921 ms (-32%).
- License: non-commercial default removed from the default path.
- Stddev: zero for hits across n=3 on both lanes.
<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

The sweep used the 023B calibration harness over `code-retrieval-fixture-expanded-v2.json`. The fixture expands the corrected 18-probe regression floor to 73 probes spanning architecture invariants, multilingual/code-switched queries, short and long queries, and path-class coverage.

Each lane held the Stage 1 index constant at `nomic-ai/CodeRankEmbed` over 84,747 chunks and 8,555 files. The only measured default-flip variable was the Stage 2 reranker. Each reranker lane ran n=3.

Pipeline shape:

1. Query through the nomic vector lane.
2. Query through the FTS5 lexical lane.
3. Fuse candidates with RRF.
4. Dedup mirror paths.
5. Rerank top-K candidates with the active cross-encoder.
6. Apply path-class/canonical boosts and score the probe hit.
<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:per-candidate-profiles -->
## 4. PER-CANDIDATE PROFILES

### 4.1 Qwen/Qwen3-Reranker-0.6B -- promoted default

| Property | Value |
|---|---|
| Role | Stage 2 cross-encoder reranker |
| License | Apache-2.0 |
| Result | 30.00/73 hits, 0.411 hit rate, p95 1984 ms |
| Warm RSS | 1,179 MB |
| Idle CPU | 0% |
| Strengths observed | Best hit count, best p95, commercial-safe license |
| Weaknesses observed | +34 MB RSS versus jina-v3 |

### 4.2 jinaai/jina-reranker-v3 -- opt-in fallback

| Property | Value |
|---|---|
| Role | Stage 2 cross-encoder reranker |
| License | CC BY-NC 4.0 |
| Result | 29.00/73 hits, 0.397 hit rate, p95 2905 ms |
| Warm RSS | 1,145 MB |
| Idle CPU | 0% |
| Strengths observed | Strong historical 018 fixture result; existing custom adapter remains supported |
| Weaknesses observed | Lost the 023B expanded-fixture head-to-head and carries a non-commercial license |
<!-- /ANCHOR:per-candidate-profiles -->

---

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

023B first calibrated retrieval knobs, then isolated the reranker variable. The calibration sweep found RRF K flat, boost magnitude flat, fusion formula flat, and `top_K=20` saturated for this fixture. That left the reranker lane as the material default decision.
<!-- /ANCHOR:process-notes -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

Qwen3 wins on all decision axes that matter for this flip:

- Quality improved from 29.00/73 to 30.00/73.
- p95 improved from 2905 ms to 1984 ms.
- License improved from CC BY-NC 4.0 to Apache-2.0.
- Resource cost is effectively equivalent: +34 MB RSS and 0% idle CPU for both daemons.

The memory delta is +3%, which is not large enough to offset the quality, latency, and licensing wins.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:caveats -->
## 7. CAVEATS

This is a local expanded-fixture result, not a public benchmark claim. The conclusion applies to the current 023B fixture, current index shape, and current pipeline defaults. Future fixture expansions or transformer/runtime changes should rerun the lane before another default flip.
<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

The default flip is recommended and executed:

- `DEFAULT_RERANKER_NAME` points to `Qwen/Qwen3-Reranker-0.6B`.
- `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` is no longer needed on the default path.
- `jinaai/jina-reranker-v3` stays in the registry as an opt-in fallback.
- ADR-027 records the decision and closes FINDING-012-B for the default path.
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

Replay entrypoint:

```bash
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-expanded-bench.sh
```

Raw evidence lives in the 023B packet:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/
```

Relevant run files:

- `lane-reranker-jina-v3-run-1.json`
- `lane-reranker-jina-v3-run-2.json`
- `lane-reranker-jina-v3-run-3.json`
- `lane-reranker-qwen3-0p6b-run-1.json`
- `lane-reranker-qwen3-0p6b-run-2.json`
- `lane-reranker-qwen3-0p6b-run-3.json`
<!-- /ANCHOR:reproducibility -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

- [`SOURCE.md`](./SOURCE.md) -- fixture composition and harness pointer.
- `023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/` -- raw lane JSON.
- `004-spec-memory-embedder-bake-off/decision-record.md` -- ADR-027.
- `mcp_server/cocoindex_code/registered_embedders.py` -- default reranker registry source.
<!-- /ANCHOR:related-resources -->
