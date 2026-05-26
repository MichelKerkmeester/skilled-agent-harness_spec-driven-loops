# Jina-v3 + Nomic + Gemma — Live runtime measurements

> Captured during 2026-05-17 session via direct `ollama` API probes + `ollama ps` + `ps -eo` + `du`.

## Resource snapshot (all loaded simultaneously, Metal)

| Embedder | Quant | Params | Dim | RAM loaded (VRAM) | Disk (HF cache) | Processor | Context |
|---|---|---|---|---|---|---|---|
| **jina-embeddings-v3** | Q4_K_M | 558.31M | 1024 | **495 MB** | ~1.1 GB | **100% GPU (Metal)** | 8192 (loaded at 4096) |
| **nomic-embed-text** | F16 | 137M | 768 | 578 MB | ~270 MB | 100% GPU (Metal) | 2048 default / 8192 max |
| **embeddinggemma-300m** (baseline) | Q8 GGUF | 300M | 768 | (cycled out during probe) | ~300 MB | 100% GPU (Metal) | 2048 |

**Key observation**: jina-v3 uses **LESS RAM than nomic** despite 4× more params, because Q4 quantization ÷ F16 ≈ ¼ bytes/param. The two roughly cancel out.

## Inference latency (warm, both resident, raw `/api/embed` round-trip)

| Embedder | Probe 1 | Probe 2 | Probe 3 | Median |
|---|---|---|---|---|
| jina-embeddings-v3 | 0.10s | 0.06s | 0.06s | **~60 ms** |
| nomic-embed-text | 0.02s | 0.01s | 0.01s | **~12 ms** |

Probe payload: `{"input":"A short test sentence to embed and measure latency."}`. Nomic is ~5× faster per query because of param count (137M vs 558M). Both Metal-GPU, ~0% CPU steady-state.

## End-to-end memory_search latency (with rescue layer, 30-scenario stratified sample)

Per `d-rescue-layer-cost-benefit.md` + ADR-011/ADR-012:

| Embedder | Median ms | p95 ms | Note |
|---|---|---|---|
| jina-embeddings-v3 + rescue | **893** | **1465** | Winner — closes cat-24/409 at 9/10 |
| nomic-embed-text-v1.5 + rescue | 922 | 3045 | Runner-up — 8/10 cat-24/409 (D-RETRY) |
| embeddinggemma-300m + rescue | 787 | 936 | Baseline — 7/10 cat-24/409, fastest but lowest recall |

End-to-end is dominated by **rescue-layer overhead**, not raw embedder latency. Raw-embedder delta (60ms vs 12ms) is invisible at full-query scale.

## Metal acceleration confirmed

`ollama ps` `PROCESSOR` column reads `100% GPU` for all three models on this Apple Silicon machine. `torch.backends.mps.is_available() == True` confirmed via the CocoIndex venv probe (PyTorch 2.11.0 with MPS built).

## CPU usage (steady-state, post-warmup)

| Phase | CPU% on ollama runner |
|---|---|
| Idle (model loaded, no requests) | ~0% |
| Cold-load (first model load) | ~20% (~1-2 sec spike) |
| Active embed query | Spike <1% (Metal does the work) |

## Decision artifact: ADR-012 verdict

Per `decision-record.md` ADR-012: **jina-v3 + rescue layer = production default for mk-spec-memory**. Beats nomic on both quality (9 vs 8 cat-24/409) AND latency (893ms vs 922ms median, 1465ms vs 3045ms p95).

## Probe reproducibility

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

## Cross-references

- ADR-009 (rescue layer rationale): `decision-record.md`
- ADR-010 (rescue layer KEEP verdict): `decision-record.md`
- ADR-011 (rescue layer default-on gate): `decision-record.md`
- ADR-012 (jina-v3 production ratification): `decision-record.md`
- Rescue ON/OFF benchmark: `d-rescue-on-vs-off.jsonl` + `d-rescue-layer-cost-benefit.md`
- cat-24/409 fixture: `../../../manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json`
- Per-embedder cat-24 results: `cat-24-rerun.jsonl` + `embedder-comparison-with-rescue.jsonl`
