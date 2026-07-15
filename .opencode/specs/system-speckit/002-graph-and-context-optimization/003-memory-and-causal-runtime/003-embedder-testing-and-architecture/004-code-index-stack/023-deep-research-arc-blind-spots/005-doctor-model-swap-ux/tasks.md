---
title: "Tasks: 023D Doctor Model Swap UX"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "023D"
  - "ccc doctor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
    last_updated_at: "2026-05-19T20:36:58Z"
    last_updated_by: "codex"
    recent_action: "Implemented packet tasks"
    next_safe_action: "Validate packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:023d000000000000000000000000000000000000000000000000000000000002"
      session_id: "023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 023D Doctor Model Swap UX

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

- [x] T001 Read target CocoIndex CLI/config/registry/fingerprint surfaces.
- [x] T002 Verify model-card licenses through HuggingFace lookup.
- [x] T003 [P] Confirm pre-bound Level 2 packet path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add embedder license and commercial-safe metadata.
- [x] T005 Add reranker registry with Jina and BGE license metadata.
- [x] T006 Add commercial-safe config enforcement.
- [x] T007 Implement `ccc doctor` text and JSON output.
- [x] T008 Implement model-swap reindex estimator.
- [x] T009 Reuse registry license metadata for fingerprint surfaces.
- [x] T010 Append ADR-024 through ADR-026.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add doctor CLI tests.
- [x] T012 Add embedder/reranker license tests.
- [x] T013 Run targeted pytest.
- [x] T014 Run ruff on changed code/tests.
- [x] T015 Run real `ccc doctor --json`.
- [x] T016 Run full pytest suite.
- [x] T017 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` after strict validation.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual doctor verification produced structured output.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
