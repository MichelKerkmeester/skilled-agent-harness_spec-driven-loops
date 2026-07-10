---
title: "Implementation Summary: 014/014 ONNX Runtime cross-platform embedding backend"
description: "ONNX Runtime backend implemented for cocoindex with CoreML/DirectML/CUDA/OpenVINO/CPU provider selection, backend state, tests, benchmarks, and docs."
trigger_phrases:
  - "014 onnx backend done"
  - "onnxruntime cocoindex implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend"
    last_updated_at: "2026-05-13T10:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed in-scope implementation and validation evidence"
    next_safe_action: "Review diff; optionally update parent graph metadata outside this dispatch"
    blockers:
      - "Parent graph-metadata update outside allowed write scope"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140140c2a9e0000000000000000000000000000000000000000000000000005"
      session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
      parent_session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity dtype? -> fp32 ONNX graph output passes threshold; q8 export measured below threshold during debugging"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `014-onnx-cross-platform-backend` |
| **Completed** | 2026-05-13 |
| **Level** | 2 |
| **Status** | **REJECTED** — production code reverted, packet retained as decision record |
| **Active Host** | darwin/arm64 |
| **ONNX Runtime** | 1.26.0 |
| **Outcome** | See [`decision-record.md`](decision-record.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:outcome-rejected -->
## Outcome: REJECTED (2026-05-13)

After a six-hypothesis performance investigation (H1-H6 in `scratch/perf-investigation/findings/`), the opt-in ONNX backend was reverted from production. The full rationale, headline numbers, and alternatives-considered live in [`decision-record.md`](decision-record.md). One-line summary: at parity-preserving settings ONNX is 3.5x slower than sbert/PyTorch+MPS on Apple Silicon for this Gemma export, and the Neural Engine only claims ~23% of Gemma's ops regardless of provider configuration. Production code, tests, and dependency entries removed; the packet's spec docs and investigation evidence preserved as rejected-experiment record.

The "What Was Built" and "Verification" sections below describe the state as of the original 2026-05-13 implementation. They are kept verbatim for historical accuracy — none of that production code is on `main` after the 2026-05-13 revert.
<!-- /ANCHOR:outcome-rejected -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented an opt-in ONNX Runtime backend for cocoindex. `OnnxEmbedder` supports lazy tokenizer/session initialization, provider selection, `encode()`, async `embed()`, and CocoIndex vector schema compatibility. The backend is selected with `COCOINDEX_CODE_BACKEND=onnx`; unset/default keeps the sentence-transformers path.

Backend state is persisted to `.cocoindex_code/backend.json`. On backend or active execution-provider change, daemon startup logs `BACKEND_EP_CHANGE` and exposes `force_reindex_recommended` in `DaemonStatusResponse`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embeddings_onnx.py` | Created | ONNX embedder and provider selection |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/backend_state.py` | Created | Backend state persistence and change detection |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modified | Env-gated embedder construction |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Backend state update and status flag plumbing |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified | Added `force_reindex_recommended: bool = False` |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_onnx_parity.py` | Created | ONNX vs sentence-transformers parity gate |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_provider_selection.py` | Created | Cross-platform EP priority tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_backend_state.py` | Created | Backend state unit tests |
| `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-onnx-vs-sbert.py` | Created | Query/index benchmark harness |
| `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-results.json` | Generated | Benchmark results |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | Base ONNX Runtime dependency and wheel notes |
| `.env.example` | Modified | Backend env var and install matrix |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modified | Backend-selection guidance |
| Packet markdown files | Modified | Level 2 template anchors and final evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work was kept to the explicit dispatch write scope, except generated benchmark output required by the contract. The implementation used a single backend switch in `shared.py`, added new isolated modules for ONNX embedding and backend state, and preserved the existing index/query call sites. Tests and benchmarks were run from `.opencode/skills/mcp-coco-index/mcp_server` using that package's `.venv/bin/python`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `sbert` default | Preserves current behavior and offers immediate rollback |
| Use ONNX graph `sentence_embedding` when present | The exported graph's pooled output matches PyTorch parity; manual `last_hidden_state` pooling did not |
| Keep attention-mask mean-pool fallback | Supports ONNX exports that expose only `last_hidden_state` |
| Use fp32 for parity/benchmark gates | `q8` export measured below required parity threshold on this host; fp32 passes |
| Persist backend state instead of auto-resetting DB | Reindex is an operator decision; daemon only recommends |
| Do not update parent metadata | Parent file is outside explicit allowed write scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| ONNX pre-flight | `.venv/bin/python -c "import onnxruntime; ..."` | PASS: `onnxruntime 1.26.0`, providers `CoreMLExecutionProvider`, `AzureExecutionProvider`, `CPUExecutionProvider` |
| HF cache | `ls ~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/*/onnx/model.onnx` | PASS |
| Syntax | `.venv/bin/python -m py_compile ...` | PASS |
| Parity | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/pytest tests/test_onnx_parity.py -v` | PASS: 1 passed |
| Provider/state tests | `.venv/bin/pytest tests/test_provider_selection.py tests/test_backend_state.py -v` | PASS: 7 passed |
| ONNX query bench | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=query` | PASS |
| sbert query bench | `COCOINDEX_CODE_BACKEND=sbert .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=query` | PASS |
| ONNX index bench | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=index` | PASS |
| sbert index bench | `COCOINDEX_CODE_BACKEND=sbert .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=index` | PASS |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../014-onnx-cross-platform-backend --strict` | PASS: exit 0 |

### Parity Result

| Metric | Value |
|--------|-------|
| Mean cosine | 0.997692168 |
| Min cosine | 0.992301047 |
| Samples | 50 |
| Reference backend | `SentenceTransformer("google/embeddinggemma-300m")` on `mps:0` |
| ONNX backend | `onnx-community/embeddinggemma-300m-ONNX` fp32 |
| ONNX active EP | `CoreMLExecutionProvider` |
| Verdict | PASS |

### Benchmark - Query (batch=1, 1000 iterations)

| Backend | EP | p50 (ms) | p95 (ms) | p99 (ms) | Peak watts |
|---------|----|----------|----------|----------|------------|
| sbert | `mps:0` | 35.569334 | 55.710375 | 83.791000 | null |
| onnx | `CoreMLExecutionProvider` | 178.327083 | 227.018958 | 246.630417 | null |

### Benchmark - Index (50-chunk deterministic panel)

| Backend | EP | Wall-clock (s) | Final vector count | Peak watts |
|---------|----|----------------|--------------------|------------|
| sbert | `mps:0` | 0.890202 | 50 | null |
| onnx | `CoreMLExecutionProvider` | 16.954772 | 50 | null |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Evidence | Status |
|-----|----------|--------|
| Default path unchanged | `COCOINDEX_CODE_BACKEND` defaults to `sbert`; existing sentence-transformers branch retained | PASS |
| Lazy ONNX import/session | `shared.py` imports ONNX backend only inside `backend == "onnx"` branch; session loads in `_ensure_session()` | PASS |
| CPU fallback | provider tests assert CPU terminal fallback | PASS |
| State safety | backend-state tests cover change/no-change | PASS |
| Operator visibility | daemon status includes primitive `force_reindex_recommended: bool = False` | PASS |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. CoreML EP emits ONNX Runtime dynamic-shape warnings on this export. It still produced valid parity results.
2. ONNX/CoreML fp32 was slower than sbert/MPS on this host for the 50-chunk panel and batch=1 query benchmark.
3. `powermetrics` peak watts are `null`; the benchmark harness did not obtain privileged power samples in this dispatch.
4. Parent graph metadata registration remains an operator follow-up because the parent file is outside this dispatch's allowed write scope.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Contract Item | Deviation | Reason |
|---------------|-----------|--------|
| Parity through default q8 | Parity gate uses fp32 ONNX model | q8 export measured below required cosine threshold; fp32 passes |
| Manual pooling only | Wrapper uses graph `sentence_embedding` when present, with manual mean-pool fallback | The graph output is the exported pooled embedding and matches PyTorch parity |
| Parent graph metadata T054 | Not modified | Outside explicit allowed write scope |
| Parity tee path | Tee used packet scratch absolute path | Contract relative path resolves under `.opencode/skills/specs`, outside packet scope |
<!-- /ANCHOR:deviations -->
