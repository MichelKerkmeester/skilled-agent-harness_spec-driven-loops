---
title: "Tasks: CocoIndex Ollama Adapter"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cocoindex ollama adapter tasks"
  - "ollama routing task list"
  - "litellm adapter tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter"
    last_updated_at: "2026-05-18T17:41:16Z"
    last_updated_by: "codex"
    recent_action: "Completed adapter task list"
    next_safe_action: "Review verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py"
      - ".opencode/skills/mcp-coco-index/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "codex-2026-05-18-cocoindex-ollama-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The implementation uses the existing LiteLLM factory rather than a new embedder backend."
---
# Tasks: CocoIndex Ollama Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the packet scope (`spec.md`).
- [x] T002 Verify `pyproject.toml` declares the LiteLLM path through `cocoindex[litellm]`.
- [x] T003 [P] Inspect `config.py`, `registered_embedders.py`, `shared.py`, `indexer.py`, and the TS Ollama adapter reference.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `requires_ollama_daemon` metadata with `False` default (`registered_embedders.py`).
- [x] T005 Register `ollama/nomic-embed-text` with 768 dimensions and operator metadata (`registered_embedders.py`).
- [x] T006 Add Ollama daemon/model readiness checks in the LiteLLM factory path (`shared.py`).
- [x] T007 Add mocked LiteLLM routing tests (`tests/test_ollama_routing.py`).
- [x] T008 Update registry and config tests for the new prefix (`tests/test_registered_embedders.py`, `tests/test_config.py`).
- [x] T009 Update install guide and feature catalog (`INSTALL_GUIDE.md`, `feature_catalog/`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run targeted pytest coverage for config, registry, and Ollama routing.
- [x] T011 Run Python syntax compilation on changed Python files.
- [x] T012 Probe local Ollama availability for optional smoke testing.
- [x] T013 Run strict spec validation.
- [ ] T014 P1 Worktree e2e validation captured.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [ ] P1 follow-on T014 captured in a separate worktree commit.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification evidence recorded in `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
