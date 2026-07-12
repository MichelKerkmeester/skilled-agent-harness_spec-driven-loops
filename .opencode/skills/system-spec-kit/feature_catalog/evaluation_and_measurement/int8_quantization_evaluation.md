---
title: "INT8 quantization evaluation"
description: "Records the INT8 quantization decision check; current live data now meets the corpus-size activation criterion, so the prior NO-GO needs re-evaluation."
trigger_phrases:
  - "int8 quantization evaluation"
  - "int8 quantization no-go decision"
  - "embedding quantization evaluation"
  - "corpus size latency threshold check"
  - "quantization storage trade-off decision"
version: 3.6.0.12
---

# INT8 quantization evaluation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Records the INT8 quantization decision check. The original decision was **NO-GO** when all three activation criteria were unmet; current live data now meets the corpus-size activation criterion, so the prior no-go should be re-evaluated before any implementation decision.

This evaluated whether compressing stored data to save space was worth the trade-off in search accuracy. The answer was no: the storage saved was tiny and the risk of slightly worse results was not justified. Think of it like deciding whether to photocopy your photos at lower quality to save a filing cabinet drawer. When the drawer is mostly empty anyway, the savings are not worth the blur.

---

## 2. HOW IT WORKS

Current decision: **RE-EVALUATE**. The prior **NO-GO** is no longer reaffirmed against current live data because at least one activation criterion is now met.

Fresh read-only measurements from the live memory database on 2026-07-03:

- Active memories with embeddings: 18,466 vector-backed active rows in the `vec_768` shard versus the 10,000 threshold (184.7%). `memory_index` marks 18,840 active rows as `embedding_status='success'`; the lower vector-backed count is the conservative count because 374 success rows currently lack an active vector payload.
- P95 search latency: 123ms versus the 50ms threshold, based on the current persisted `speckit-eval.db.eval_final_results` latency samples (`n=2`). This is a sparse persisted sample, not a sustained fresh benchmark, so it should trigger re-measurement rather than stand alone as an implementation go/no-go.
- Embedding dimensions: active `nomic-embed-text-v1.5` via `ollama`, 768 dimensions versus the 1,536 threshold (50%). This matches `vec_metadata.active_embedder_dim=768` and the registered embedder configuration.

The current vector-backed corpus would save approximately 42.5 MB (40.6 MiB) of raw vector payload if 768-dim fp32 vectors were replaced by int8 payloads, before SQLite/index overhead. That is about 2.8% of the current main-plus-active-shard database footprint (1.49 GB) and about 31% of the active vector shard. Because the corpus threshold is now met, re-run a dedicated INT8 evaluation before deciding whether storage savings justify the documented 5.32% estimated recall risk, custom quantized BLOB complexity, and KL-divergence calibration overhead.

---

## 3. SOURCE FILES

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/evaluation_and_measurement/int8_quantization_evaluation_r5.md` | Manual revalidation | Re-checks the NO-GO thresholds against current corpus size, p95 latency, and embedding dimensions |
| `feature_catalog/evaluation_and_measurement/memory_roadmap_baseline_snapshot.md` | Supporting measurement source | Documents the nearby baseline snapshot machinery used when evaluating rollout and storage thresholds |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `evaluation_and_measurement/int8_quantization_evaluation.md`
Related references:
- [evaluation-api-surface.md](evaluation_api_surface.md) — Evaluation API Surface
- [memory-roadmap-baseline-snapshot.md](memory_roadmap_baseline_snapshot.md) — Memory roadmap baseline snapshot
