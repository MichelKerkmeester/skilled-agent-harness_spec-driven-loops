---
title: "Local Embeddings Foundation Phase 5: Q4 Quantization for HfLocalProvider"
description: "HF_EMBEDDINGS_DTYPE env var wired through HfLocalProvider. fp32 default preserved. Setting HF_EMBEDDINGS_DTYPE=q4 loads model_q4.onnx at roughly 3x smaller RAM footprint. Cosine similarity benchmark confirmed q4 and fp32 are effectively interchangeable at mean 0.9811."
trigger_phrases:
  - "q4 quantization embeddings"
  - "HF_EMBEDDINGS_DTYPE env var"
  - "EmbeddingGemma q4 variant"
  - "quantized ONNX embedding load"
  - "hf-local dtype knob"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/005-q4-quantization` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

`HfLocalProvider` hardcoded `dtype: 'fp32'` in the `@huggingface/transformers` `pipeline()` call, forcing the largest ONNX model variant (~620MB RAM) even though the HF cache from the earlier snapshot-download phase already contained quantized variants. Operators had no way to select a smaller variant without modifying source code.

A `resolveDtype()` helper and `HF_EMBEDDINGS_DTYPE` env var were added to `hf-local.ts`. The provider reads the env var at startup, validates it against an 8-value allowlist, falls back to `fp32` with a warning on unknown values, then passes the resolved dtype straight into the `pipeline()` call. Setting `HF_EMBEDDINGS_DTYPE=q4` loads `model_q4.onnx` at roughly 3x lower RAM usage with 768-dim output preserved. A 15-document cosine similarity benchmark confirmed fp32 and q4 vectors are effectively interchangeable at mean 0.9811. The recall benchmark against ground-truth queries was deferred because no labeled relevance data exists for the codebase.

### Added

- `HfLocalDtype` type union and `ALLOWED_HF_DTYPES` const array in `hf-local.ts`
- `resolveDtype()` module-scope helper that reads `process.env.HF_EMBEDDINGS_DTYPE`, validates against the allowlist, warns and returns `'fp32'` on unknown values
- `dtype?: HfLocalDtype` field on the `HfLocalOptions` interface
- `dtype: HfLocalDtype` instance field on `HfLocalProvider`, set via `resolveDtype(options.dtype)` in the constructor
- Model-load log line now surfaces the active dtype for operator observability

### Changed

- Hardcoded `dtype: 'fp32'` in the `pipeline()` call replaced with `dtype: this.dtype`
- `shared/dist/embeddings/providers/hf-local.{js,d.ts,d.ts.map,js.map}` regenerated via `npx tsc --build`

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit --composite false -p tsconfig.json` | PASS clean (no output) |
| `npx tsc --build` from `shared/` | PASS dist regenerated |
| `dist` exports contain `resolveDtype`, `ALLOWED_HF_DTYPES`, `this.dtype` | PASS grep returns 7 occurrences across the correct paths |
| Standalone fp32 default load | PASS `[hf-local] Loading onnx-community/embeddinggemma-300m-ONNX (dtype=fp32)` warmup 1156ms, vec dim 768 |
| Standalone q4 load with `HF_EMBEDDINGS_DTYPE=q4` | PASS `dtype=q4` logged, `model_q4.onnx` loaded, warmup 3226ms, vec dim 768, values in `[-0.05, 0.05]` range |
| Unknown dtype fallback | PASS `resolveDtype()` warns and returns `'fp32'` for any out-of-allowlist value |
| Memory side still works | PASS (implicit) 004's fp32 vectors were not touched, default behavior unchanged |
| Synthetic fp32-vs-q4 cosine similarity (N=15 docs) | PASS mean=0.9811, stdev=0.0026, min=0.9759, max=0.9839, verdict effectively interchangeable |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modified | Added `HfLocalDtype` type, `ALLOWED_HF_DTYPES`, `resolveDtype()`, `dtype` field on `HfLocalOptions` and `HfLocalProvider`, wired into `pipeline()` call, updated log message |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.js` | Regenerated | `npx tsc --build` output |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.d.ts` | Regenerated | `npx tsc --build` output |
| `005-q4-quantization/scratch/fp32-vs-q4-similarity.mjs` (NEW) | Created | Cosine similarity benchmark script for N=15 mixed-domain docs comparing fp32 and q4 vectors |

### Follow-Ups

- Add a ground-truth query set (20-50 queries with hand-labeled relevant files) to enable a real MRR/NDCG recall benchmark for q4 vs fp32.
- Update `.env.example` with a documented commented-out `HF_EMBEDDINGS_DTYPE=q4` line once the recall benchmark validates the q4 path.
- Decide whether the sqlite filename-key should include a dtype suffix so fp32 and q4 vector stores can coexist without a forced reindex on dtype flip.
- Investigate q4 cold-load latency on sustained-load macOS thermal conditions, as ARMv8 NEON quantization metadata initialization may throttle under heavy batch workloads.
