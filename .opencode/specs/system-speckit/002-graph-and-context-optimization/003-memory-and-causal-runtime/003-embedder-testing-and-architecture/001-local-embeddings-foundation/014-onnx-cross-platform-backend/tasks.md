---
title: "Tasks: 014/014 ONNX Runtime cross-platform embedding backend"
description: "Task list for ONNX backend implementation, provider tests, backend state, benchmarks, docs, and validation."
trigger_phrases:
  - "014 onnx backend tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend"
    last_updated_at: "2026-05-13T10:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed in-scope ONNX backend tasks"
    next_safe_action: "Operator can update parent metadata outside this dispatch scope"
    blockers:
      - "T054 parent graph-metadata write blocked by allowed write scope"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140140c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
      parent_session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: 014/014 ONNX Runtime cross-platform embedding backend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked by contract/scope |

**Task Format**: `T### [P?] Description (file path) [evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Confirm `onnxruntime>=1.17` is available in the cocoindex venv. Evidence: `onnxruntime 1.26.0`, providers `['CoreMLExecutionProvider', 'AzureExecutionProvider', 'CPUExecutionProvider']`.
- [x] T001 Verify `onnx-community/embeddinggemma-300m-ONNX` cache. Evidence: HF cache contains `snapshots/5090578d9565bb06545b4552f76e6bc2c93e4a66/onnx/model.onnx`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `cocoindex_code/embeddings_onnx.py` with `OnnxEmbedder`. Evidence: file created.
- [x] T011 Implement `_select_providers()` with CPU terminal fallback. Evidence: `tests/test_provider_selection.py` passed.
- [x] T012 Implement pooling/normalization helpers. Evidence: `embeddings_onnx.py` exposes `_mean_pool`, `_l2_normalize`, and uses graph `sentence_embedding` with mean-pool fallback.
- [x] T013 Create `cocoindex_code/backend_state.py`. Evidence: `tests/test_backend_state.py` passed.
- [x] T014 Wire backend gate in `shared.py`. Evidence: `COCOINDEX_CODE_BACKEND` branch added.
- [x] T015 Wire EP-change detection in `daemon.py` and status protocol. Evidence: `DaemonStatusResponse.force_reindex_recommended` added and backend state comparison implemented.
- [x] T020 Create `tests/test_onnx_parity.py`. Evidence: parity gate passed, `mean_cosine=0.997692168`, `min_cosine=0.992301047`, `samples=50`.
- [x] T021 Create `tests/test_provider_selection.py`. Evidence: 2 provider tests passed, covering all requested rows.
- [x] T022 Create `tests/test_backend_state.py`. Evidence: 5 backend-state tests passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Benchmark
- [x] T030 Create `scratch/bench-onnx-vs-sbert.py`. Evidence: script created and ran query/index modes.
- [x] T031 Run query benchmark for both backends. Evidence: `scratch/bench-results.json` has `onnx:CoreMLExecutionProvider:query` and `sbert:mps:0:query`.
- [x] T032 Run index benchmark on the same corpus for both backends. Evidence: `scratch/bench-results.json` has `onnx:CoreMLExecutionProvider:index` and `sbert:mps:0:index`; corpus is the deterministic 50-chunk panel, not a full reindex.

### Documentation
- [x] T040 Update `.env.example` with `COCOINDEX_CODE_BACKEND` and install matrix. Evidence: section appended.
- [x] T041 Add backend-selection subsection to `SKILL.md`. Evidence: `### Backend selection`.
- [x] T042 Update `pyproject.toml` dependency and optional wheel notes. Evidence: `onnxruntime>=1.17` added.

### Validation Gates
- [x] T050 Run parity test under cocoindex venv. Evidence: pytest passed and metrics recorded in packet scratch.
- [x] T051 Run provider-selection and backend-state tests. Evidence: `7 passed in 0.22s`.
- [x] T052 Run strict validation. Evidence: final strict validation exit 0.
- [x] T053 Fill `implementation-summary.md` with real numbers. Evidence: no placeholders remain.
- [B] T054 Update parent `graph-metadata.json`. Evidence: blocked because parent metadata is outside the allowed write scope; no parent write performed by this dispatch.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] ONNX backend is implemented and import/syntax checks pass.
- [x] Provider and backend-state tests pass.
- [x] Parity passes threshold on the deterministic panel.
- [x] Benchmarks for both backends are recorded.
- [x] Packet strict validation exits 0.
- [x] Scope discipline maintained for authored changes; parent metadata remains operator follow-up.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet: `../spec.md`
- Predecessor packet: `../013-v4-cleanup/spec.md`
- Parity evidence: `scratch/parity-results.txt`
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/scratch/bench-results.json`
<!-- /ANCHOR:cross-refs -->
