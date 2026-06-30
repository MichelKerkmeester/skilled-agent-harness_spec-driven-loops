---
title: "Tasks: deterministic enforcement for the context-loading contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context contract enforcement tasks"
  - "proof check apca tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/037-design-context-enforcement"
    last_updated_at: "2026-06-28T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all enforcement + indexing tasks complete"
    next_safe_action: "Optional per-mode router auto-load (deferred F-004 piece)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-037-design-context-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: deterministic enforcement for the context-loading contract

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

- [x] T001 Rebuild better-sqlite3 against the active node (fix the ABI mismatch)
- [x] T002 Confirm the arc packets (029/030/035/036) index into memory_index (18 rows, BM25/FTS)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add APCA-W3 Lc to contrast_check.py (functions + evaluate + output)
- [x] T004 Write proof_check.py (deterministic proof-of-application gate, checkbox-aware verdict)
- [x] T005 Wire both calculators into context_loading_contract.md §5 and proof_of_application_card.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Smoke proof_check.py on all 4 benchmark notes (PASS minimax-B/kimi-B, FAIL kimi-A)
- [x] T007 Smoke APCA on the decisive pairs; py_compile both scripts; sk-doc the edited docs
- [x] T008 Author wrapper docs; generate metadata; run validate.sh --strict; commit + push to 028
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates smoke-pass; arc indexed; edited docs sk-doc VALID; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: `../035-design-context-benchmark/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
