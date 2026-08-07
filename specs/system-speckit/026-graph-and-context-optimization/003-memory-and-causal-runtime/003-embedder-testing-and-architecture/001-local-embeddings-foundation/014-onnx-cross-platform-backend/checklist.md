---
title: "Verification Checklist: 014/014 ONNX Runtime cross-platform embedding backend"
description: "Verification evidence for ONNX backend implementation, parity, benchmarks, docs, metadata, and scope discipline."
trigger_phrases:
  - "014 onnx backend checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend"
    last_updated_at: "2026-05-13T10:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded verification evidence for in-scope ONNX backend work"
    next_safe_action: "Review generated benchmark artifact and parent metadata follow-up"
    blockers:
      - "Parent metadata checklist item blocked by explicit scope lock"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0140140c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
      parent_session_id: "014-014-onnx-cross-platform-backend-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 014/014 ONNX Runtime cross-platform embedding backend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim in-scope completion until complete |
| **[P1]** | Required | Must complete or document scope blocker |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md.
  - **Evidence**: `spec.md` includes requirements, scope, risks, NFRs, edge cases, and related docs anchors.
- [x] CHK-002 [P0] Technical approach defined in plan.md.
  - **Evidence**: `plan.md` includes architecture, phases, dependencies, rollback, and Level 2 sections.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: `onnxruntime 1.26.0`; providers `CoreMLExecutionProvider`, `AzureExecutionProvider`, `CPUExecutionProvider`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `embeddings_onnx.OnnxEmbedder` defines `encode`, `dim`, `active_ep`, async `embed`, and vector schema.
  - **Evidence**: `py_compile` passed for `embeddings_onnx.py`; parity test returns `(50, 768)` normalized vectors.
- [x] CHK-011 [P0] `_select_providers()` returns CoreML first on darwin/arm64 when available.
  - **Evidence**: `tests/test_provider_selection.py::test_select_providers_table PASSED`.
- [x] CHK-012 [P0] `_select_providers()` returns Dml first on win32 when available, else CUDA, then CPU.
  - **Evidence**: provider table test passed.
- [x] CHK-013 [P0] `_select_providers()` returns OpenVINO before CPU on darwin/x86_64 when available.
  - **Evidence**: provider table test passed.
- [x] CHK-014 [P0] CPU EP is the final provider on every platform row.
  - **Evidence**: provider table test asserts `selected[-1][0] == "CPUExecutionProvider"`.
- [x] CHK-015 [P0] `shared._build_embedder` reads `COCOINDEX_CODE_BACKEND` and dispatches.
  - **Evidence**: static implementation in `shared.py`; py_compile passed.
- [x] CHK-016 [P1] `daemon.py` emits `BACKEND_EP_CHANGE` when prior backend state differs.
  - **Evidence**: `_update_backend_state()` compares `load_state()` with current state and logs `BACKEND_EP_CHANGE`.
- [x] CHK-017 [P1] No imports of `onnxruntime` happen at module load time in `shared.py`.
  - **Evidence**: `onnxruntime` is imported inside `embeddings_onnx._select_providers()` / `_ensure_session()`, not in `shared.py`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `tests/test_onnx_parity.py` runs 50 representative chunks through both backends.
  - **Evidence**: `samples=50` in `scratch/parity-results.txt`.
- [x] CHK-021 [P0] Mean cosine >= 0.995.
  - **Evidence**: `mean_cosine=0.997692168`.
- [x] CHK-022 [P0] Min cosine >= 0.99.
  - **Evidence**: `min_cosine=0.992301047`.
- [x] CHK-023 [P0] Provider-selection tests pass.
  - **Evidence**: `7 passed in 0.22s` for provider/state command.
- [x] CHK-024 [P0] Backend-state tests cover round-trip, backend change, EP change, and no-change.
  - **Evidence**: `tests/test_backend_state.py` five tests passed.
- [x] CHK-025 [P1] Syntax checks pass.
  - **Evidence**: `.venv/bin/python -m py_compile ...` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Backend implementation complete.
  - **Evidence**: ONNX wrapper, backend state, shared factory, daemon, and protocol changes are present.
- [x] CHK-061 [P0] Verification complete for in-scope files.
  - **Evidence**: parity/provider/state tests and benchmarks executed.
- [x] CHK-062 [P1] Out-of-scope parent metadata item documented.
  - **Evidence**: T054/CHK-052 marked blocked by explicit scope lock.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No unsafe deletion or archival patterns introduced.
  - **Evidence**: no `.bak`, `_deprecated`, or `z_archive` files created.
- [x] CHK-031 [P1] Backend state writes are scoped to `.cocoindex_code/backend.json`.
  - **Evidence**: `backend_state.state_path(root)` resolves only `root/.cocoindex_code/backend.json`.
- [x] CHK-032 [P1] No secrets or API keys added.
  - **Evidence**: docs only add commented env-var examples.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `.env.example` documents `COCOINDEX_CODE_BACKEND` with install matrix.
  - **Evidence**: appended CocoIndex embedding backend section.
- [x] CHK-041 [P0] `pyproject.toml` lists `onnxruntime>=1.17`.
  - **Evidence**: dependency added under `[project].dependencies`.
- [x] CHK-042 [P0] `SKILL.md` references backend selection.
  - **Evidence**: `### Backend selection` subsection added.
- [x] CHK-043 [P0] Numbers recorded in `implementation-summary.md` with no placeholders.
  - **Evidence**: summary includes parity and benchmark tables with real values.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `description.json` present with `specId: "014"` and parent chain.
  - **Evidence**: existing `description.json`.
- [x] CHK-051 [P0] `graph-metadata.json` present with `parent_id: "014"` and `manual.depends_on: ["013"]`.
  - **Evidence**: packet `graph-metadata.json`.
- [B] CHK-052 [P1] Parent graph metadata lists this packet under `children_ids`.
  - **Evidence**: blocked by allowed write scope; parent file not modified by this dispatch.
- [x] CHK-053 [P0] Strict packet validation exits 0.
  - **Evidence**: final validation command exits 0.
- [x] CHK-054 [P1] No edits to cocoindex Rust core.
  - **Evidence**: `git diff --stat | grep -E '\.rs$'` returns empty for in-scope changes.
- [x] CHK-055 [P1] No edits to memory-side embeddings.
  - **Evidence**: no authored changes under `.opencode/skills/system-spec-kit/shared/embeddings/`.
- [x] CHK-056 [P1] ONNX model reused from cache.
  - **Evidence**: cached model path under `models--onnx-community--embeddinggemma-300m-ONNX/snapshots/5090578...`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All in-scope implementation, tests, benchmarks, and docs are complete. One parent-metadata registration task is intentionally left as an operator follow-up because the parent file is outside the allowed write list for this dispatch.
<!-- /ANCHOR:summary -->
