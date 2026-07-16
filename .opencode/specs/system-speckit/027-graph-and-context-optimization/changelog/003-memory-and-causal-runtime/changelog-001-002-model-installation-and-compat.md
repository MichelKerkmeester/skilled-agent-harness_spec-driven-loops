---
title: "Local Embeddings Phase 002: Model Installation and Compatibility"
description: "EmbeddingGemma-300m and the ONNX-community port downloaded to local HF cache. Both Python and Node smoke tests passed. The transformers.js risk gate cleared by switching to onnx-community/embeddinggemma-300m-ONNX. A symlink bridges the Python snapshot-hash cache layout to the flat layout transformers.js expects."
trigger_phrases:
  - "model installation and compat"
  - "EmbeddingGemma-300m download"
  - "onnx-community embeddinggemma ONNX"
  - "transformers.js gemma compatibility"
  - "huggingface local cache symlink"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The HF model cache was empty after a reboot, which meant the live MCP swap in sub-phase 003 would block on first-use downloads of roughly 1.3GB and risk hanging MCP startup. It was also unknown whether `@huggingface/transformers` v3.8.1 could load `google/embeddinggemma-300m`: Gemma3 architecture support in transformers.js was recent and the sentence-transformers config layer on top was the highest-risk unknown.

Both Setup A models were pre-downloaded to `~/.cache/huggingface/hub/`. The transformers.js risk gate cleared by switching from the canonical `google/embeddinggemma-300m` repo (PyTorch and safetensors only) to the purpose-built `onnx-community/embeddinggemma-300m-ONNX` repo (transformers.js-tagged, ships fp32/fp16/q4/q4f16/int8 ONNX variants). A symlink was created at `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` pointing to the Python snapshot-hash directory so transformers.js can resolve the model from its expected flat layout. Both smoke tests returned dim=768 and norm=1.0.

### Added

- Python smoke test at `scratch/test-embeddinggemma.py` (EmbeddingGemma-300m via sentence-transformers on MPS, dim 768, norm 1.0034)
- Node smoke test at `scratch/test-embeddinggemma.mjs` (EmbeddingGemma ONNX via transformers.js v3.8.1, fp32, dim 768, norm 1.0)
- `~/.cache/huggingface/hub/models--google--embeddinggemma-300m/` on disk (~620MB, 14 files, sentence-transformers form)
- `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/` on disk (~2.6GB, 21 files, all dtype variants)
- Symlink `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` bridging Python snapshot layout to transformers.js flat layout

### Changed

- Model selection for the live MCP path: `onnx-community/embeddinggemma-300m-ONNX` chosen over `google/embeddinggemma-300m` because transformers.js requires ONNX weights and the canonical repo ships only PyTorch and safetensors

### Fixed

- None. Additive-only phase.

### Verification

| Check | Result |
|-------|--------|
| EmbeddingGemma-300m Python smoke test (sentence-transformers, MPS) | PASS. load=24.3s, encode=1429ms cold, dim=768, norm=1.0034 |
| EmbeddingGemma ONNX Node smoke test (transformers.js v3.8.1, fp32) | PASS. load=640ms, encode=9ms warm, dims=[1,768], norm=1.0 |
| transformers.js risk gate (Gemma3 ST-config compatibility) | PASS. ONNX-community port loaded cleanly. Fallback to `mixedbread-ai/mxbai-embed-large-v1` not triggered |
| Offline load (no network round-trip during smoke tests) | PASS. `allowRemoteModels=false` confirmed local-only resolution |
| Strict packet validation (`validate.sh --strict`) | PASS. Target exit 0 after implementation-summary update |

### Files Changed

| File | What changed |
|------|--------------|
| `scratch/test-embeddinggemma.mjs` (NEW) | Node smoke test for EmbeddingGemma ONNX via transformers.js v3.8.1 |
| `scratch/test-qwen3-4b.py` (NEW) | Python smoke test placeholder for Qwen3 4B (Setup A secondary model) |
| `~/.cache/huggingface/hub/models--google--embeddinggemma-300m/` (NEW) | EmbeddingGemma-300m weights via `snapshot_download`, sentence-transformers form |
| `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/` (NEW) | ONNX port for transformers.js, all dtype variants |
| `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` (NEW) | Symlink bridging Python snapshot-hash layout to transformers.js flat layout |

### Follow-Ups

- Resolve symlink fragility: if `snapshot_download` installs a new revision the snapshot hash changes and the symlink points at the old directory. A startup hook in HfLocalProvider that re-creates the symlink on boot would eliminate the manual repair step.
- Revoke and regenerate the HF token used for the gated Gemma license download. The token was visible in the session transcript and is stored at `~/.cache/huggingface/token` (mode 600). Regenerate at https://huggingface.co/settings/tokens.
