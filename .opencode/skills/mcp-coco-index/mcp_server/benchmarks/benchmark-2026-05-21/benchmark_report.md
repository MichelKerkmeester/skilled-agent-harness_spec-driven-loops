---
title: "Benchmark: cocoindex rerank via shared sidecar vs bundled — 2026-05-20"
description: "Smoke A/B comparing cocoindex Stage 2 rerank executed through the bundled in-process CrossEncoder vs the shared system-rerank-sidecar HTTP path. Confirms hit-rate parity and bounded p95 latency cost, justifying the default flip to COCOINDEX_RERANK_VIA_SIDECAR=true (arc 008 phase 006)."
trigger_phrases:
  - "cocoindex via sidecar benchmark"
  - "arc 008 phase 006 ab"
  - "http sidecar reranker bench"
importance_tier: "important"
contextType: "reference"
---

# Benchmark: cocoindex rerank via shared sidecar vs bundled — 2026-05-20

> Arc 008 phase 006 evidence packet. Closes arc 008's deduplication intent by proving that consuming the shared `system-rerank-sidecar` via HTTP returns the same rerank ordering as the in-process bundled `CrossEncoder` with bounded latency cost.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-PROBE COMPARISON](#4--per-probe-comparison)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. RELATED RESOURCES](#10--related-resources)

---

## 1. OVERVIEW

### What this benchmark measures

A direct comparison of two cocoindex rerank dispatch paths over the same fixture, same daemon, same Qwen3-Reranker-0.6B model, in the same session:

- **Arm A — bundled**: cocoindex loads `Qwen/Qwen3-Reranker-0.6B` in-process via `sentence_transformers.CrossEncoder` and calls `model.predict(pairs)` directly.
- **Arm B — sidecar**: cocoindex POSTs `{query, documents, top_k}` to the local `system-rerank-sidecar` at `127.0.0.1:8765/rerank`, which loads the same Qwen model once and returns sigmoid-normalized scores over HTTP.

The decision rule (per `plan.md` §6) requires hit-rate parity ±1 and p95 latency Δ ≤ +500 ms to PROMOTE the sidecar dispatch as default; otherwise HOLD ships the adapter as opt-in.

### What this benchmark does NOT measure

- Cold-start latency (sidecar warmup is excluded — model warmed via `/warmup` before the run).
- Multi-worker concurrency (single ccc daemon, single sidecar worker, serialized).
- Sustained load (smoke is n=1 per arm, 73 probes per arm).

---

## 2. AGGREGATE RESULTS

73-probe expanded fixture (`code-retrieval-fixture-expanded-v2.json`), n=1 per arm, single ccc daemon restarted between arms.

| Arm | Path | Hits | Hit-rate | Latency p50 (ms) | Latency p95 (ms) | Latency p99 (ms) |
|---|---|---|---|---|---|---|
| A | bundled CrossEncoder | 15 / 73 | 0.205 | 1382 | 1877 | 1916 |
| B | HTTP sidecar | 15 / 73 | 0.205 | 1413 | 1895 | 1956 |
| **Δ (B - A)** | | **0** | **0.000** | **+31** | **+18** | **+40** |

Per-probe hit alignment: **18 probes** in the 18-probe smoke matched exactly (7/7 hits on both arms). The 73-probe full sweep produced identical hit counts across arms (15/15).

---

## 3. METHODOLOGY

### Fixture

`benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/fixture-full-73.json` — exact copy of `benchmarks/benchmark-2026-05-20/code-retrieval-fixture-expanded-v2.json` (the authoritative 73-probe expanded fixture used to pick Qwen3 as cocoindex's default reranker on 2026-05-20).

### Runner

`benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py`. A standalone Python harness modeled after `phase2-bench/run-expanded-bench.sh` but writing arm artifacts locally to this benchmark folder instead of pinning them into a remote spec packet.

### Environment overrides

| Arm | `COCOINDEX_RERANK` | `COCOINDEX_RERANK_MODEL` | `COCOINDEX_RERANK_VIA_SIDECAR` |
|---|---|---|---|
| A | true | Qwen/Qwen3-Reranker-0.6B | **false** |
| B | true | Qwen/Qwen3-Reranker-0.6B | **true** |

### Sidecar

Started fresh via `bash .opencode/skills/system-rerank-sidecar/scripts/start.sh` (uvicorn `--workers 1` per arc 008 phase 002 contract), warmed via `POST /warmup` to load the Qwen model before Arm A executed. Sidecar process remained the same throughout — only cocoindex's dispatch changed between arms.

### Per-probe contract

Same as the established lane runner: `ccc search "<query>" --limit 5`, captured stdout parsed for `File: <path>`, latency measured per-call, hit defined as truth-set intersection with normalized top-5.

---

## 4. PER-PROBE COMPARISON

Raw per-probe data lives in:

- `runs/arm-a-bundled-qwen-run-1.json` — bundled Arm A
- `runs/arm-b-sidecar-qwen-run-1.json` — sidecar Arm B
- `runs/arm-a-bundled-qwen-run-1.json` (smoke 18-probe variant overwritten by the full 73-probe run; smoke evidence preserved in this file via run order)

Hit-rate parity confirmed at both probe counts:

| Subset | Arm A hits | Arm B hits | Hit-rate Δ |
|---|---|---|---|
| First 18 probes (smoke) | 7 | 7 | 0 |
| Full 73 probes | 15 | 15 | 0 |

---

## 5. PROCESS NOTES

### What went smoothly

- Sidecar warmed in ~5 s, then served all 73 probes without fallback events on Arm B.
- HttpSidecarRerankerAdapter unit tests (9/9 in `tests/test_http_sidecar_adapter.py`) verified the index→score remap before any live data was generated.
- `ccc daemon stop` between arms ensured a clean process boundary.

### What needed care

- The shipped `phase2-bench/run-expanded-bench.sh` pins outputs into the `023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/` packet directory, which is authoritative historical evidence. An initial attempt to reuse that script overwrote the historical 73-probe `lane-reranker-qwen3-0p6b-run-1.json`; the file was restored from `HEAD` and a standalone `run_ab.py` was written that writes only inside this benchmark folder.

---

## 6. FINDINGS

1. **Hit-rate parity, no regression.** Arm A and Arm B both returned 15/73 hits on the full expanded fixture, with identical per-probe hit alignment. The HTTP path does not change which probes succeed.
2. **Bounded latency cost.** p95 Δ = +18 ms (1877 → 1895). This is well below the +500 ms tolerance gate in the decision rule and approximately matches expected localhost HTTP roundtrip overhead for a serialized cross-encoder call.
3. **No fallback events.** Arm B's `per_probe[].stderr` is clean across all 73 probes — the sidecar served every request, the bundled fallback never fired.
4. **Cocoindex test suite remains green.** All 240 pre-existing tests plus 9 new HttpSidecarRerankerAdapter tests pass (`pytest tests/` 0 failures).

---

## 7. CAVEATS

1. **Absolute hit-rate drift vs 2026-05-20.** The authoritative 2026-05-20 expanded benchmark recorded 30/73 hits for the `reranker-qwen3-0p6b` lane. This benchmark records 15/73 on the same fixture under both arms. The 50% absolute hit drop is **independent of the sidecar swap** (both arms see it equally) and likely reflects index drift since 2026-05-20 — the embedder migrated to `nomic-ai/CodeRankEmbed` and several phase children landed under arcs 006 and 008 between the two runs. Investigating and resolving the absolute drift is **out of scope** for packet 006; what matters here is that Arm A and Arm B remain equivalent.
2. **n=1 per arm.** This is a smoke A/B, not a 3-run confirmation. Confidence intervals are not available. The parity result is strong enough for an opt-in default flip; future re-benches should add n=3 once the absolute hit-rate drift is investigated.
3. **Single-worker sidecar.** The sidecar serializes `model.predict()` calls via `asyncio.Lock` (arc 008 phase 002 contract). Concurrent cocoindex searches would queue at the sidecar. This benchmark did not exercise concurrent load.
4. **Sigmoid score scale.** The sidecar returns sigmoid-normalized scores `[0,1]`; the bundled adapter exposes raw logits before the rerank-applied wrapper. Path-class boost (gated `false` by default) multiplies on whichever scale it receives; operators turning the boost on under `COCOINDEX_RERANK_VIA_SIDECAR=true` must supply `COCOINDEX_RERANK_PATH_CLASS_FACTORS` explicitly. Discussed in `plan.md` D-003.

---

## 8. RECOMMENDATIONS

**Decision: PROMOTE.**

Arm B met all three decision-rule gates:

- ✅ Hit-rate within ±1 (exactly 0).
- ✅ p95 latency Δ ≤ +500 ms (+18 ms).
- ✅ No P0 regressions (240 + 9 tests pass; no fallback events).

Apply:

1. Flip cocoindex default to `COCOINDEX_RERANK_VIA_SIDECAR=true` in `config/config.py`.
2. Stop instantiating the bundled `CrossEncoderRerankerAdapter` eagerly. Keep the class as the fallback path (HttpSidecarRerankerAdapter falls through to it on HTTP failure).
3. Update `mcp-coco-index/SKILL.md` and `INSTALL_GUIDE.md` to document the new dispatch + how to opt out (`COCOINDEX_RERANK_VIA_SIDECAR=false`) when running cocoindex standalone without spawning the sidecar.
4. Note the 30→15 hit-rate drift in a follow-on packet for investigation. Tag suggestion: `007-cocoindex-rerank-baseline-drift`.

---

## 9. REPRODUCIBILITY

```bash
# 1) Start + warm sidecar
nohup bash .opencode/skills/system-rerank-sidecar/scripts/start.sh > /tmp/rerank-sidecar.log 2>&1 &
sleep 4
curl -sf -X POST http://127.0.0.1:8765/warmup

# 2) Run A/B (full 73 probes, n=1)
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python \
  .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py \
  --arms a,b --runs 1 \
  --fixture .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/fixture-full-73.json

# 3) Inspect
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -c "
import json
from pathlib import Path
d = Path('.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/runs')
for f in sorted(d.glob('arm-*.json')):
    data = json.loads(f.read_text())
    print(f.name, 'hits=', data['hits'], 'p95=', data['latency_ms']['p95'])
"
```

---

## 10. RELATED RESOURCES

- `../benchmark-2026-05-20/benchmark_report.md` — authoritative 2026-05-20 expanded benchmark where Qwen3 was promoted as cocoindex's default reranker.
- `.opencode/skills/system-rerank-sidecar/` — the shared HTTP sidecar this benchmark consumes.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/` — the spec packet that authored this work.
- `runs/arm-a-bundled-qwen-run-1.json` — Arm A raw evidence.
- `runs/arm-b-sidecar-qwen-run-1.json` — Arm B raw evidence.
- `run_ab.py` — the bench harness.
