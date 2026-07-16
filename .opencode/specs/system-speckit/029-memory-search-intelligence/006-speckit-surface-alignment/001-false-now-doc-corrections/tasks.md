---
title: "Tasks: False-Now Documentation Corrections"
description: "Task list for the four scoped documentation corrections and verification gate."
trigger_phrases:
  - "tasks"
  - "false-now doc corrections"
  - "spec-kit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/006-speckit-surface-alignment/001-false-now-doc-corrections"
    last_updated_at: "2026-07-05T08:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Track false-now doc corrections"
    next_safe_action: "Complete verification tasks"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "false-now-doc-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: False-Now Documentation Corrections

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read cited source files before editing.
- [x] T002 Read Level 1 manifest templates and spec-folder authoring workflow references.
- [x] T003 [P] Confirm live `SPECKIT_RETENTION_FORGETTING` and `SPECKIT_ENVELOPE_FIDELITY` names in code and ENV reference.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Confirm `feature-flags.md:23` already uses `SPECKIT_RETENTION_FORGETTING`.
- [x] T005 Add Track-C supersession note to `benchmark-status.md:114`.
- [x] T006 Fix `benchmark-status.md:183` retention row to `SPECKIT_RETENTION_FORGETTING`.
- [x] T007 Confirm soft-delete catalog line 20 already states shipped active-row default exclusion.
- [x] T008 Confirm `search-results.ts:1350-1352` already states default-on envelope fidelity opt-out.
- [x] T009 [P] Create Level 1 spec packet docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run required acceptance greps.
- [x] T011 Run comment hygiene on modified TypeScript file.
- [x] T012 Run OpenCode alignment drift verification.
- [x] T013 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
