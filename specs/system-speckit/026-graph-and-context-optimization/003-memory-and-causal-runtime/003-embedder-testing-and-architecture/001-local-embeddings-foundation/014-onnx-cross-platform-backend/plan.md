---
title: "Implementation Plan: 014/014 ONNX Runtime cross-platform embedding backend"
description: "Plan for the opt-in ONNX Runtime cocoindex backend, provider selection, state detection, tests, benchmarks, and docs."
trigger_phrases:
  - "014 onnx backend plan"
  - "onnxruntime provider selection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend"
    last_updated_at: "2026-05-13T10:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed ONNX backend plan"
    next_safe_action: "Review benchmark numbers before default-backend discussion"
    blockers:
      - "Parent metadata registration is outside allowed write scope"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0140140c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
      parent_session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: 014/014 ONNX Runtime cross-platform embedding backend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, msgspec protocol structs, TOML, Markdown |
| **Framework** | CocoIndex Code soft-fork under `.opencode/skills/mcp-coco-index/mcp_server` |
| **Storage** | `.cocoindex_code/backend.json` state file plus existing sqlite vector DB |
| **Testing** | pytest, parity comparison, benchmark harness, strict spec validation |

### Overview
Add an opt-in ONNX Runtime embedding backend behind `COCOINDEX_CODE_BACKEND=onnx`. The implementation keeps the current sentence-transformers path as default, adds EP-aware backend state, verifies cross-platform provider priority with table tests, and records parity/benchmark evidence before any future default flip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered by orchestrator.
- [x] Allowed write scope supplied explicitly.
- [x] Existing packet drafts and 013 style reference read.
- [x] ONNX model cache verified.
- [x] `onnxruntime>=1.17` installed in the cocoindex venv.

### Definition of Done
- [x] ONNX backend class created and wired behind env gate.
- [x] Backend state file and daemon status flag implemented.
- [x] Provider-selection and backend-state tests pass.
- [x] Parity gate passes on 50 deterministic chunks.
- [x] Query/index benchmarks recorded for both backends.
- [x] Docs updated and packet strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single factory switch at `shared._build_embedder()`. Both backends satisfy the same CocoIndex embedder contract, so indexing and query paths stay unchanged.

### Key Components
- `OnnxEmbedder`: lazy tokenizer/session wrapper, provider selection, `encode()`, async `embed()`, and vector schema.
- `_select_providers()`: platform-priority provider list with CPU EP terminal fallback.
- `backend_state.py`: typed state file helpers and change detection.
- `daemon._update_backend_state()`: persists current backend identity and carries `force_reindex_recommended`.
- `DaemonStatusResponse`: backward-compatible primitive boolean status field.

### Data Flow
1. Daemon loads user settings.
2. `create_embedder()` calls `_build_embedder()`.
3. `_build_embedder()` reads `COCOINDEX_CODE_BACKEND`.
4. `sbert` builds the existing `SentenceTransformerEmbedder`; `onnx` builds `OnnxEmbedder`.
5. Daemon persists backend state and recommends reindex if backend/EP changed.
6. Existing index/search code calls `await embedder.embed(...)` unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Pre-flight
- Verify `onnxruntime>=1.17` in `.opencode/skills/mcp-coco-index/mcp_server/.venv`.
- Verify cached `onnx-community/embeddinggemma-300m-ONNX` model files.

### Phase 1: Implementation
- Add `embeddings_onnx.py`.
- Add `backend_state.py`.
- Wire `shared.py`, `daemon.py`, and `protocol.py`.
- Add `onnxruntime>=1.17` to base runtime dependencies.

### Phase 2: Tests
- Add parity test.
- Add provider-selection test.
- Add backend-state test.

### Phase 3: Benchmark
- Add query/index benchmark script.
- Run query mode for ONNX and sbert.
- Run index mode over the same deterministic 50-chunk panel for both backends.

### Phase 4: Documentation
- Update `.env.example`.
- Add backend-selection section to `SKILL.md`.
- Rewrite packet docs to Level 2 anchors.

### Phase 5: Validation
- Run parity, provider/state tests, benchmarks, and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Expected |
|------|---------|----------|
| Parity | `COCOINDEX_CODE_BACKEND=onnx .venv/bin/pytest tests/test_onnx_parity.py -v` | mean cosine >= 0.995, min >= 0.99 |
| Provider/state | `.venv/bin/pytest tests/test_provider_selection.py tests/test_backend_state.py -v` | all pass |
| Syntax | `.venv/bin/python -m py_compile ...` | exit 0 |
| Bench query | `COCOINDEX_CODE_BACKEND=<backend> .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=query` | rows for both backends |
| Bench index | `COCOINDEX_CODE_BACKEND=<backend> .venv/bin/python scratch/bench-onnx-vs-sbert.py --mode=index` | rows for both backends |
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `onnxruntime>=1.17` in base runtime deps.
- Existing `transformers`, `huggingface_hub`, and `sentence-transformers` stack in the cocoindex venv.
- Cached `onnx-community/embeddinggemma-300m-ONNX` model.
- Optional platform wheels documented for DirectML, CUDA, and OpenVINO.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Leave `COCOINDEX_CODE_BACKEND` unset or set to `sbert` to use current behavior.
- If backend/EP changes after trying ONNX, run a clean `ccc reset && ccc index` before comparing search quality.
- Remove generated `.cocoindex_code/backend.json` only if deliberately resetting backend state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Notes |
|-------|------------|-------|
| Phase 1 | Phase 0 | Provider code depends on installed/importable ONNX Runtime |
| Phase 2 | Phase 1 | Tests import new modules |
| Phase 3 | Phase 1 | Benchmark imports both backend implementations |
| Phase 4 | Phase 1-3 | Docs record actual behavior and numbers |
| Phase 5 | Phase 1-4 | Strict validation requires final docs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Area | Estimated | Actual Notes |
|------|-----------|--------------|
| Backend implementation | 2-3h | Added CocoIndex compatibility beyond requested `encode()` |
| Tests | 1-2h | Provider/state tests fast; parity loads both models |
| Benchmarks | 1h+ | ONNX CoreML query run is slow on this export |
| Docs/validation | 1h | Existing drafts rewritten into Level 2 anchors |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Risk | Rollback Action |
|------|-----------------|
| ONNX parity fails on another host | Keep `COCOINDEX_CODE_BACKEND=sbert` and inspect provider-specific drift |
| CoreML EP performs poorly | Set backend to `sbert` or test CPU EP/OpenVINO follow-up |
| Existing index mixed across EPs | Rebuild index after backend/EP change |
| Optional wheel conflict | Uninstall conflicting `onnxruntime-*` wheel and install the platform-specific one only |
<!-- /ANCHOR:enhanced-rollback -->
