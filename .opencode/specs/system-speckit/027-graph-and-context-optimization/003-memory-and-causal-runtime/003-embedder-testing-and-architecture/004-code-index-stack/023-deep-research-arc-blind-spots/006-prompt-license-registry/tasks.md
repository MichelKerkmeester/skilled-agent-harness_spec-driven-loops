---
title: "Tasks: 023A2 Prompt License Registry"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "023A2 tasks"
  - "registry accessors"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry"
    last_updated_at: "2026-05-19T22:55:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented packet tasks"
    next_safe_action: "Run full verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:023a200000000000000000000000000000000000000000000000000000000002"
      session_id: "023-deep-research-arc-blind-spots/006-prompt-license-registry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 023A2 Prompt License Registry

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

- [x] T001 Read 023A1 implementation summary.
- [x] T002 Read 023D implementation summary.
- [x] T003 [P] Inspect registry, shared prompt resolver, CLI doctor, daemon startup, config, metadata wrappers, and existing tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add first-class prompt fields to embedder specs.
- [x] T005 Add typed registry accessors and clear unknown-model errors.
- [x] T006 Create `cocoindex_code.registry` public import surface.
- [x] T007 Route shared prompt resolution through registry accessors.
- [x] T008 Route license/policy consumers through typed accessors.
- [x] T009 Add registry validation callable to daemon startup and `ccc doctor`.
- [x] T010 Add registry accessor tests and update doctor test count.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run focused pytest for registry, prompt policy, license, and doctor tests.
- [x] T012 Run full `pytest tests/ -q`.
- [x] T013 Run `ruff check`.
- [x] T014 Run OpenCode alignment verifier on changed scope.
- [x] T015 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` after full verification.
- [x] No blocked tasks remaining.
- [x] Sentinel emitted with pytest count, ruff status, strict validation status, and spawn-agent status.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
