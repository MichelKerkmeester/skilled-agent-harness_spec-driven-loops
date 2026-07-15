---
title: "Verification Checklist: CocoIndex Ollama Adapter"
description: "Verification Date: 2026-05-18"
trigger_phrases:
  - "cocoindex ollama adapter checklist"
  - "ollama routing verification"
  - "litellm ollama checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter"
    last_updated_at: "2026-05-18T17:41:16Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification evidence"
    next_safe_action: "Review and commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "codex-2026-05-18-cocoindex-ollama-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The full temp-project smoke was attempted and blocked by daemon Operation not permitted."
---
# Verification Checklist: CocoIndex Ollama Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available: `cocoindex[litellm]==1.0.0a33` is declared and `LiteLLMEmbedder` imports in the venv.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `python -m ruff check ...` passed after removing one stale unused test import.
- [x] CHK-011 [P0] No console errors or warnings from targeted pytest.
- [x] CHK-012 [P1] Error handling implemented: missing Ollama daemon/model raises clear `RuntimeError` before indexing starts.
- [x] CHK-013 [P1] Code follows project patterns: registry-gated provider routing keeps sentence-transformers default unchanged.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met except optional full temp-project smoke; see limitation in implementation summary.
- [x] CHK-021 [P0] Manual testing complete: direct `litellm.aembedding(model="ollama/nomic-embed-text")` returned `dim=768`.
- [x] CHK-022 [P1] Edge cases tested: implicit `:latest` Ollama tag matching and explicit version mismatch behavior.
- [x] CHK-023 [P1] Error scenarios validated through readiness gate code path and mocked route tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: cross-consumer provider-routing gap across registry, config, factory, tests, and docs.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with `rg -n "litellm|LiteLLMEmbedder|COCOINDEX_CODE_EMBEDDING_MODEL|registered_embedders"`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `requires_ollama_daemon`, `ollama/nomic-embed-text`, and `_ensure_ollama_daemon_ready`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction adversarial cases are not applicable; this change does not alter path parsing or redaction.
- [x] CHK-FIX-005 [P1] Matrix axes: provider prefix (`sbert/`, `ollama/`, unknown), daemon state, model tag state.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant covered by `Config.from_env()` tests with isolated `patch.dict(..., clear=True)`.
- [x] CHK-FIX-007 [P1] Evidence pinned to this working-tree diff and command outputs recorded in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented through registry gating and Ollama tag validation.
- [x] CHK-032 [P1] Auth/authz not applicable; Ollama uses local daemon configuration and optional `OLLAMA_API_BASE`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized.
- [x] CHK-041 [P1] Code comments adequate and limited to non-obvious readiness behavior.
- [x] CHK-042 [P2] Install guide and feature catalog updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files limited to `/private/tmp/cocoindex-ollama-*` smoke directories.
- [x] CHK-051 [P1] No repo-local scratch files created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-18
<!-- /ANCHOR:summary -->
