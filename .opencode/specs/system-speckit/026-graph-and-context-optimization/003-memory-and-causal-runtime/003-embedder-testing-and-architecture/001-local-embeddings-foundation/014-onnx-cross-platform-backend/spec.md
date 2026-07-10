---
title: "Feature Specification: 014/014 ONNX Runtime cross-platform embedding backend"
description: "Opt-in ONNX Runtime backend for cocoindex with platform-native execution-provider selection and parity/benchmark gates."
trigger_phrases:
  - "014 onnx cross-platform backend"
  - "onnxruntime cocoindex backend"
  - "coreml execution provider"
  - "directml cocoindex"
  - "cross-platform embedding backend"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend"
    last_updated_at: "2026-05-13T10:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented ONNX backend, tests, benchmarks, and packet docs"
    next_safe_action: "Operator should review diff and update parent graph metadata if desired"
    blockers:
      - "Parent graph-metadata update is outside allowed write scope for this dispatch"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140140c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
      parent_session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered this 014/014 packet"
      - "Use subagents? -> User forbade delegation; SPAWN_AGENT_USED=no"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: 014/014 ONNX Runtime cross-platform embedding backend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 14 |
| **Predecessor** | `013-v4-cleanup` |
| **Handoff Criteria** | ONNX backend shipped behind env gate, parity/provider/state tests pass, benchmarks recorded, strict validation exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cocoindex currently encodes embeddings via sentence-transformers on PyTorch. On macOS that routes through Metal Performance Shaders, which targets the GPU and cannot reach Apple's Neural Engine. On Windows without CUDA, PyTorch is CPU-only, leaving AMD and Intel GPUs idle. Both gaps can increase fan ramp, indexing time, and query latency relative to the host silicon.

### Purpose
Add an opt-in ONNX Runtime embedding backend to cocoindex with dynamic execution-provider selection per host platform. The existing sentence-transformers path remains the default via `COCOINDEX_CODE_BACKEND=sbert`; `COCOINDEX_CODE_BACKEND=onnx` enables the new backend for measured parity and benchmark evaluation before any default flip.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cocoindex_code/embeddings_onnx.py` with `OnnxEmbedder` implementing `.encode(texts, **kwargs) -> np.ndarray`, `embed()`, `dim`, `active_ep`, and vector schema compatibility.
- Dynamic execution-provider selection covering Apple Silicon CoreML EP, Windows DirectML EP, Windows/Linux CUDA EP, Intel Mac OpenVINO EP, and CPU EP terminal fallback.
- Backend gate in `cocoindex_code/shared.py` keyed by `COCOINDEX_CODE_BACKEND`, with `sbert` as default and unknown values falling back to `sbert` with a warning.
- Backend state file `.cocoindex_code/backend.json` with EP-change detection and `force_reindex_recommended` surfaced in daemon status.
- Parity tests against `SentenceTransformer("google/embeddinggemma-300m")` on 50 deterministic representative chunks.
- Provider-selection and backend-state unit tests.
- Query/index benchmark harness producing `scratch/bench-results.json`.
- Documentation updates in `.env.example`, `pyproject.toml`, and `.opencode/skills/mcp-coco-index/SKILL.md`.
- Level 2 packet docs and validation evidence.

### Out of Scope
- Default backend flip from `sbert` to `onnx`.
- Native Core ML conversion via `coremltools`.
- Cocoindex Rust-core indexing path or watcher changes.
- New model artifacts beyond the cached `onnx-community/embeddinggemma-300m-ONNX` artifact.
- Parent `014-local-embeddings-setup-a/graph-metadata.json` mutation; that file is outside the dispatch's allowed write scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embeddings_onnx.py` | Create | ONNX Runtime embedder, provider selection, pooling/normalization, CocoIndex compatibility |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/backend_state.py` | Create | Backend state dataclasses, read/write helpers, change detection |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modify | Env-gated backend construction |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Backend state persistence and status flag |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modify | `DaemonStatusResponse.force_reindex_recommended` primitive default |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_onnx_parity.py` | Create | 50-chunk parity gate |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_provider_selection.py` | Create | Cross-platform EP priority tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_backend_state.py` | Create | State round-trip/change tests |
| `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-onnx-vs-sbert.py` | Create | Query/index benchmark harness |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modify | Add `onnxruntime>=1.17` and platform wheel notes |
| `.env.example` | Modify | Document `COCOINDEX_CODE_BACKEND` and install matrix |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modify | Add backend-selection guidance |
| Packet docs | Modify | Level 2 template-conformant spec/plan/tasks/checklist/summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001** `OnnxEmbedder.__init__(model_id, *, dtype="q8", normalize=True, batch_size=32)` exposes the requested public constructor.
- **REQ-002** `OnnxEmbedder.encode(texts, batch_size=None, normalize=None)` returns `np.ndarray` shape `(N, 768)`, dtype `float32`, normalized by default.
- **REQ-003** `OnnxEmbedder.dim` returns `768`; `OnnxEmbedder.active_ep` returns the active ONNX Runtime execution provider.
- **REQ-004** Tokenizer and ONNX session load lazily, only on ONNX backend use or first encode.
- **REQ-005** Provider priority is CoreML on Apple Silicon, DirectML then CUDA on Windows, CUDA on Linux, OpenVINO on Intel Mac where installed, and CPU EP last on every platform.
- **REQ-006** `COCOINDEX_CODE_BACKEND=onnx` routes cocoindex to `OnnxEmbedder`; default/unset `COCOINDEX_CODE_BACKEND` preserves sentence-transformers behavior.
- **REQ-007** Backend state persists `schema_version`, `backend`, `model_id`, `dim`, `active_ep`, `ep_options_hash`, `first_used`, and `last_used`.
- **REQ-008** Backend or active-EP change logs `BACKEND_EP_CHANGE` and surfaces `force_reindex_recommended=true` in daemon status.
- **REQ-009** `DaemonStatusResponse` uses a primitive default `False`, preserving the packet 013 msgspec mutable-default fix.
- **REQ-010** Parity gate compares 50 representative chunks against `SentenceTransformer("google/embeddinggemma-300m")`.
- **REQ-011** Benchmark harness emits query p50/p95/p99 and index wall-clock/vector count for both backends.

### Non-Functional Requirements
- Default `sbert` path must remain byte-for-byte behaviorally unchanged.
- ONNX imports must not happen at `shared.py` module import time.
- CPU EP fallback must keep the backend bootable on hosts without accelerated providers.
- No archival files or deprecated copies are created.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. With `COCOINDEX_CODE_BACKEND=onnx`, parity on the deterministic 50-chunk panel reaches mean cosine >= 0.995 and min cosine >= 0.99.
2. Provider-selection tests cover darwin/arm64, win32 DirectML/CUDA/CPU, linux CUDA/CPU, and darwin/x86_64 OpenVINO/CPU.
3. Backend state tests cover round-trip, backend change, active EP change, and no-change.
4. Benchmark harness records both `sbert` and `onnx` query rows in `scratch/bench-results.json`.
5. `.env.example`, `pyproject.toml`, and `SKILL.md` document backend selection and platform install guidance.
6. Strict packet validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Numerical drift across EPs**: different EPs use different fused kernels and precision paths. Mitigation: parity gate and EP-aware backend state recommending reindex on change.
- **CoreML dynamic shape warnings**: current CoreML EP emits unbounded-dimension warnings while still producing valid outputs. Mitigation: record active EP and benchmark results; CPU fallback remains available.
- **DirectML/GPU wheel conflicts**: `onnxruntime-directml` and `onnxruntime-gpu` should not be blindly co-installed with base `onnxruntime`. Mitigation: document per-platform wheel matrix.
- **Pooling mismatch**: the exported ONNX graph's `sentence_embedding` output is the graph-level pooled representation. Mitigation: wrapper uses that output when present and falls back to attention-mask mean pooling otherwise.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

| Area | Complexity | Notes |
|------|------------|-------|
| Backend wrapper | Medium | Must satisfy both direct `encode()` and CocoIndex async `embed()` contracts |
| Provider selection | Medium | Cross-platform priority matrix plus CPU fallback |
| Numerical parity | Medium | Exported graph pooling differs from naive manual pooling |
| Daemon state | Low | Simple JSON state and bool status flag |
| Documentation | Medium | Level 2 template compliance plus real benchmark evidence |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Target | Verification |
|-------------|--------|--------------|
| Import cost | `shared.py` does not import `onnxruntime` at module load | Static review + py_compile |
| Compatibility | Existing default backend remains `sbert` | Factory tests/static evidence |
| Vector shape | `(N, 768)` `float32` normalized | Parity test and wrapper assertions |
| Provider fallback | CPU EP terminal on every platform | Provider-selection tests |
| Operator safety | Reindex recommended on backend/EP change | Backend-state tests and daemon status field |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Empty `texts` input returns an empty `(0, 768)` float32 array.
- Unknown `COCOINDEX_CODE_BACKEND` logs a warning and falls back to `sbert`.
- Missing accelerated provider still returns CPU EP as the final provider.
- Existing `backend.json` absent on first run creates a fresh state without recommending reindex.
- Existing `backend.json` with different backend or active EP recommends reindex but does not delete data.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No packet-blocking questions remain.

Follow-on decisions:
- Whether to make ONNX the default backend after broader host benchmarking.
- Whether native Core ML conversion is worth a separate Apple-Silicon packet.
- Whether to add cross-platform CI runners for DirectML/CUDA/OpenVINO parity.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- Parent packet: `../spec.md`
- Predecessor: `../013-v4-cleanup/spec.md`
- Benchmark artifact: `scratch/bench-results.json`
- Parity artifact: `scratch/parity-results.txt`
<!-- /ANCHOR:related-docs -->
