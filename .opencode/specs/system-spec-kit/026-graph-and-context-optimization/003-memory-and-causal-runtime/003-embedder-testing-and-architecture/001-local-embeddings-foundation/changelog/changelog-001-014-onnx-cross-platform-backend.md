---
title: "Local Embeddings Foundation 014: ONNX Runtime cross-platform embedding backend (REJECTED)"
description: "Opt-in ONNX Runtime backend for cocoindex shipped and validated with CoreML EP parity, provider-selection tests and benchmark results, then rejected after a six-hypothesis investigation showed ONNX is 3.5x to 19x slower than sbert/MPS for the Gemma 300m export at parity-preserving settings on Apple Silicon."
trigger_phrases:
  - "014 onnx cross-platform backend"
  - "onnxruntime cocoindex backend rejected"
  - "coreml execution provider gemma"
  - "onnx vs sbert benchmark cocoindex"
  - "cocoindex backend state force reindex"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The cocoindex embedding path on macOS routed all inference through PyTorch and Metal Performance Shaders, leaving Apple's Neural Engine unreachable. On Windows without CUDA, the backend was CPU-only, stranding discrete GPUs. The premise of this phase was that ONNX Runtime with platform-native execution-provider selection could close both gaps.

An opt-in ONNX backend was fully implemented behind `COCOINDEX_CODE_BACKEND=onnx`. `OnnxEmbedder` shipped with lazy session initialization, dynamic CoreML/DirectML/CUDA/OpenVINO/CPU provider selection, parity validation on 50 deterministic chunks (mean cosine 0.9977 against sbert/MPS, threshold 0.995 passed) and backend state persistence with `force_reindex_recommended` surfacing on provider change. After passing all gates a six-hypothesis investigation measured ONNX at p50 178ms vs sbert/MPS at p50 36ms (batch=1 query). The investigation confirmed the Neural Engine claimed only approximately 23% of Gemma's ops regardless of provider configuration. The slowness was architectural rather than configuration-fixable. Production code was reverted on 2026-05-13. The spec docs and H1-H6 investigation evidence are retained as a rejected-experiment decision record (see `decision-record.md`). The successor path, `015-node-llama-cpp-evaluation`, delivered the performance improvement via a different backend.

### Added

- `cocoindex_code/embeddings_onnx.py` with `OnnxEmbedder`, `_select_providers()`, `_mean_pool`, `_l2_normalize` and CocoIndex vector schema compatibility (NEW, later reverted)
- `cocoindex_code/backend_state.py` with state dataclasses, read/write helpers and EP-change detection (NEW, later reverted)
- `DaemonStatusResponse.force_reindex_recommended: bool = False` primitive default in `protocol.py`
- `tests/test_onnx_parity.py` 50-chunk parity gate against sentence-transformers (NEW, later reverted)
- `tests/test_provider_selection.py` covering darwin/arm64, win32 DirectML/CUDA/CPU, linux CUDA/CPU, darwin/x86_64 OpenVINO/CPU (NEW, later reverted)
- `tests/test_backend_state.py` covering round-trip, backend change, active EP change and no-change (NEW, later reverted)
- `scratch/bench-onnx-vs-sbert.py` query/index benchmark harness (NEW, later reverted)

### Changed

- `cocoindex_code/shared.py` updated with env-gated backend construction keyed on `COCOINDEX_CODE_BACKEND` (later reverted)
- `cocoindex_code/daemon.py` updated with backend state persistence and status flag plumbing (later reverted)
- `pyproject.toml` extended with `onnxruntime>=1.17` base dependency and platform wheel notes (later reverted)
- `.env.example` extended with `COCOINDEX_CODE_BACKEND` documentation and install matrix

### Fixed

None.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| ONNX pre-flight | `.venv/bin/python -c "import onnxruntime; print(onnxruntime.__version__)"` | PASS: 1.26.0. providers CoreMLExecutionProvider, AzureExecutionProvider, CPUExecutionProvider |
| HF cache | `ls ~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/*/onnx/model.onnx` | PASS |
| Syntax | `.venv/bin/python -m py_compile cocoindex_code/embeddings_onnx.py cocoindex_code/backend_state.py` | PASS |
| Parity | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/pytest tests/test_onnx_parity.py -v` | PASS: 1 passed. mean cosine 0.997692, min cosine 0.992301 |
| Provider/state tests | `.venv/bin/pytest tests/test_provider_selection.py tests/test_backend_state.py -v` | PASS: 7 passed |
| ONNX query bench | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=query` | PASS: p50 178.3ms, p95 227.0ms, CoreMLExecutionProvider |
| sbert query bench | `COCOINDEX_CODE_BACKEND=sbert .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=query` | PASS: p50 35.6ms, p95 55.7ms, mps:0 |
| ONNX index bench | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=index` | PASS: 16.95s for 50 chunks |
| sbert index bench | `COCOINDEX_CODE_BACKEND=sbert .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=index` | PASS: 0.89s for 50 chunks |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../014-onnx-cross-platform-backend --strict` | PASS: exit 0 |
| Rejection decision | Six-hypothesis investigation H1-H6 in `scratch/perf-investigation/findings/` | ONNX 3.5x to 19x slower. Neural Engine claims only approximately 23% of Gemma ops. Architectural rejection. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embeddings_onnx.py` | Created then reverted | ONNX embedder. provider selection. pooling and normalization helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/backend_state.py` | Created then reverted | Backend state persistence. EP-change detection |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modified then reverted | Env-gated backend construction |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified then reverted | Backend state update and status flag plumbing |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified then reverted | Added `force_reindex_recommended: bool = False` primitive default |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_onnx_parity.py` | Created then reverted | 50-chunk parity gate |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_provider_selection.py` | Created then reverted | Cross-platform EP priority tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_backend_state.py` | Created then reverted | Backend state unit tests |
| `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-onnx-vs-sbert.py` | Created then reverted | Query and index benchmark harness |
| `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-results.json` | Generated then reverted | Benchmark result data |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified then reverted | `onnxruntime>=1.17` base dependency and platform wheel notes |
| `.env.example` | Modified | `COCOINDEX_CODE_BACKEND` documentation and install matrix |

### Follow-Ups

- Evaluate whether a native Core ML conversion via `coremltools` could achieve higher Neural Engine utilization for the Gemma 300m architecture on Apple Silicon.
- Add cross-platform CI runners for DirectML/CUDA/OpenVINO parity verification when a suitable ONNX export is identified.
- Consider re-evaluating ONNX Runtime for non-Gemma model exports where the exported graph is better suited to the CoreML EP.
