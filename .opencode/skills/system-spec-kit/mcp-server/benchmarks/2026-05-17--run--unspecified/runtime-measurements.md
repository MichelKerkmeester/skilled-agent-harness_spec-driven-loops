---
title: "Runtime measurements — jina-v3, nomic, gemma (May 17, 2026)"
description: "Live runtime profile for the three finalist embedders from the May 17, 2026 mk-spec-memory bake-off: RAM, VRAM residency, Metal acceleration, disk footprint, raw inference latency, and end-to-end memory_search latency with the retrieval-rescue layer."
trigger_phrases:
  - "jina v3 runtime measurements"
  - "ollama embedder ram latency"
  - "metal embedder residency"
  - "spec memory embedder latency"
importance_tier: "important"
contextType: "reference"
---

# Runtime measurements — jina-v3, nomic, gemma (May 17, 2026)

> Live runtime snapshot captured on May 17, 2026 via direct `ollama` API probes, `ollama ps`, `ps -eo`, and `du`. All three finalist embedders loaded simultaneously on a single Apple Silicon machine with Metal acceleration. Numeric values are preserved verbatim from the original capture; only the document structure changed.

---

## 1. OVERVIEW

### Captured headlines

- `jina-embeddings-v3` uses **less RAM than `nomic-embed-text`** despite four times the parameter count, because Q4 quantization roughly cancels the param growth.
- Raw embedder latency is fast on Metal: `~60 ms` median for Jina v3, `~12 ms` median for Nomic.
- End-to-end `memory_search` latency is dominated by the rescue-layer overhead, not raw embedder latency. The `60 ms` vs `12 ms` delta is invisible at full-query scale.
- Metal acceleration is confirmed for all three models: `ollama ps` reports `100% GPU` in the `PROCESSOR` column.
- Production verdict per ADR-012: **`jina-embeddings-v3` plus rescue layer** is the production default. It beats Nomic on both quality (nine vs eight cat-24/409 top-3 hits) and latency (`893 ms` vs `922 ms` median, `1465 ms` vs `3045 ms` p95).

### Capture conditions

- Date captured: May 17, 2026, during the bake-off session.
- Host: single Apple Silicon machine.
- Runtime: Ollama with Metal backend, PyTorch 2.11.0 with MPS available (CocoIndex venv probe).
- All three models resident simultaneously during the latency probes.

---

## 2. RESOURCE SNAPSHOT

All three loaded simultaneously, Metal backend.

| Embedder | Quant | Params | Dim | RAM loaded (VRAM) | Disk (HF cache) | Processor | Context |
|---|---|---|---|---|---|---|---|
| `jina-embeddings-v3` | Q4_K_M | 558.31M | 1024 | **495 MB** | ~1.1 GB | **100% GPU (Metal)** | 8192 (loaded at 4096) |
| `nomic-embed-text` | F16 | 137M | 768 | 578 MB | ~270 MB | 100% GPU (Metal) | 2048 default / 8192 max |
| `bge-base-en-v1.5` (baseline) | Q8 GGUF | 300M | 768 | (cycled out during probe) | ~300 MB | 100% GPU (Metal) | 2048 |

### Key observation

Jina v3 uses **less RAM than Nomic** despite four times more params, because Q4 quantization is roughly one quarter byte-per-param of F16. The two effects roughly cancel out, and the larger model lands at lower memory cost than the smaller F16 model.

---

## 3. INFERENCE LATENCY

Warm, both models resident, raw `/api/embed` round-trip.

| Embedder | Probe 1 | Probe 2 | Probe 3 | Median |
|---|---|---|---|---|
| `jina-embeddings-v3` | 0.10s | 0.06s | 0.06s | **~60 ms** |
| `nomic-embed-text` | 0.02s | 0.01s | 0.01s | **~12 ms** |

### Probe payload

```json
{"input":"A short test sentence to embed and measure latency."}
```

Nomic is about five times faster per query because of param count (137M vs 558M). Both run on Metal GPU at roughly zero percent CPU steady-state.

---

## 4. END-TO-END LATENCY WITH RESCUE

End-to-end `memory_search` latency under the rescue layer, measured against the 30-scenario stratified sample. Sources: `evidence/d-rescue-layer-cost-benefit.md`, decision-record ADR-011, ADR-012.

| Embedder | Median ms | p95 ms | Note |
|---|---|---|---|
| `jina-embeddings-v3` + rescue | **893** | **1465** | Winner — closes cat-24/409 at 9/10. |
| `nomic-embed-text-v1.5` + rescue | 922 | 3045 | Runner-up — 8/10 cat-24/409 (D-RETRY). |
| `bge-base-en-v1.5` + rescue | 787 | 936 | Baseline — 7/10 cat-24/409, fastest but lowest recall. |

### Read

End-to-end is dominated by **rescue-layer overhead**, not raw embedder latency. The raw-embedder delta (`60 ms` vs `12 ms`) is invisible at full-query scale. The rescue layer adds roughly a 2.16x median multiplier over OFF for all three candidates; see ADR-011 for the OFF baseline (`426.5 ms` overall median, `1411 ms` overall p95) and the rationale for keeping the rescue layer default-on despite the cost.

---

## 5. METAL ACCELERATION AND CPU

### Metal residency confirmed

`ollama ps` `PROCESSOR` column reads `100% GPU` for all three models on this Apple Silicon host. `torch.backends.mps.is_available() == True` confirmed via the CocoIndex venv probe (PyTorch 2.11.0 with MPS built).

### CPU usage, steady-state, post-warmup

| Phase | CPU% on `ollama runner` |
|---|---|
| Idle (model loaded, no requests) | ~0% |
| Cold-load (first model load) | ~20% (one to two second spike) |
| Active embed query | Spike under 1% (Metal does the work) |

---

## 6. DECISION ARTIFACT

Per `decision-record.md` ADR-012: **`jina-embeddings-v3` plus rescue layer is the production default for `mk-spec-memory`.** Jina beats Nomic on both quality (9 vs 8 cat-24/409 top-3 hits) and latency (`893 ms` vs `922 ms` median, `1465 ms` vs `3045 ms` p95). Baseline Gemma is the fastest but reaches only 7/10 cat-24/409 even with rescue, so the no-swap path is rejected.

### Tradeoffs ratified by ADR-012

- Jina requires a 1024-dimensional vector table and a production re-index on install or activation.
- Re-index time was materially slower than the original estimate; measured 7738-row Jina jobs took tens of minutes in this environment.
- The rescue layer kill switch is available: `SPECKIT_RERANK_LAYER=false` disables the layer at runtime.

---

## 7. REPRODUCIBILITY

### Probe commands

```bash
# RAM snapshot (model must be loaded first via any /api/embed call)
ollama ps

# Latency probe
time curl -s http://localhost:11434/api/embed \
  -d '{"model":"hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M","input":"test"}' \
  -o /dev/null

# Disk size
du -sh ~/.ollama/models/blobs

# Process snapshot
ps -eo pid,etime,rss,pcpu,command | grep -E 'ollama runner'
```

### Expected output shape

`ollama ps` returns a table with `NAME`, `ID`, `SIZE`, `PROCESSOR`, and `UNTIL` columns. The `PROCESSOR` column should read `100% GPU` on Apple Silicon when Metal is active.

The `/api/embed` probe returns a JSON body with an `embedding` array. The `time` prefix captures wall-clock to the curl exit; this is the wire latency, not the model latency alone.

---

## 8. CROSS-REFERENCES

### Spec packet ADRs

| ADR | What it covers | File |
|---|---|---|
| ADR-009 | Retrieval-rescue layer rationale | `../../../../../../specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` |
| ADR-010 | Retrieval-rescue layer KEEP verdict | same `decision-record.md` |
| ADR-011 | Retrieval-rescue layer default-on gate | same `decision-record.md` |
| ADR-012 | `jina-embeddings-v3` production ratification | same `decision-record.md` |

### Evidence files

| File | Content |
|---|---|
| `evidence/d-rescue-on-vs-off.jsonl` | Per-scenario rescue ON vs OFF rows. |
| `evidence/d-rescue-layer-cost-benefit.md` | Aggregate verdict for the rescue layer. |
| `evidence/cat-24-rerun.jsonl` | Per-pair top-3 data across embedders. |
| `evidence/embedder-comparison-with-rescue.jsonl` | Final three rows with rescue ON. |

### Fixture

| Path | What |
|---|---|
| `.opencode/skills/system-spec-kit/manual-testing-playbook/local-llm-query-intelligence/409_fixture.json` | Deterministic ten-pair fixture for cat-24/409. |

### Pointer doc

`./SOURCE.md` — wayfinding pointer with the full spec-packet structure and the "when to read what" map.
