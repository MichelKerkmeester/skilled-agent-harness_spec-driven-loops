---
title: "Tasks: per-mode router auto-load of the context-loading contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context contract router tasks"
  - "F-004 default resource tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/038-design-context-router"
    last_updated_at: "2026-06-28T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all router auto-load tasks complete"
    next_safe_action: "Arc complete"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-038-design-context-router"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: per-mode router auto-load of the context-loading contract

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

- [x] T001 Read each mode's resource-loading table + router to confirm DEFAULT_RESOURCE always-loads
- [x] T002 Confirm the F-004 scope is interface/foundations/audit (review evidence)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add contract to DEFAULT_RESOURCE + ALWAYS row — design-interface
- [x] T004 Add contract to DEFAULT_RESOURCE + ALWAYS row — design-foundations
- [x] T005 Add contract to DEFAULT_RESOURCE + ALWAYS row — design-audit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 ast.literal_eval each DEFAULT_RESOURCE (valid 3-entry list, contract present); confirm path resolution
- [x] T007 sk-doc validate the three SKILLs; INTENT_SIGNALS/RESOURCE_MAP unchanged
- [x] T008 Author wrapper; generate metadata; validate.sh --strict; commit + push to 028
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Contract auto-loads in all 3 modes; routers valid; SKILLs sk-doc VALID; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding**: `../035-design-context-benchmark/review/review-report.md` (F-004)
<!-- /ANCHOR:cross-refs -->
