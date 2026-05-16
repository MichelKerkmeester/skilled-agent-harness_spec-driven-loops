---
title: "Tasks: 107"
description: "Wave 1-5 task tracker."
trigger_phrases:
  - "107 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/107-026-restructure-execution-wave-1"
    last_updated_at: "2026-05-16T06:51:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "Wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4"
      session_id: "107-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 107

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP
- [x] T001 Scaffold 107 packet
- [x] T002 Capture HEAD baseline (`052558f1b`)
- [ ] T003 Strict-validate 107
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION
### Wave 1: Renames
- [ ] T004 W1.1 rename 014
- [ ] T005 W1.2 rename 015
- [ ] T006 W1.3 rename 006
- [ ] T007 W1.4 rename 002
### Wave 2: Merges (7 PROCEED)
- [ ] T008 M2 014/056 ← 014/057
- [ ] T009 M3 007/014 ← 007/002
- [ ] T010 M4 007/014 ← 007/016-020
- [ ] T011 M5 003 ← 004 (preserve nested + decision-record)
- [ ] T012 M6 009/002 ← 009/006 + 009/007
- [ ] T013 M7 013/001 ← 013/002
- [ ] T014 M11 archive cross-parent docs
### Wave 3: Deletes + Archives
- [ ] T015 8 CONTAINED deletes
- [ ] T016 28 DEEP archives → z_archive/wave-1/
### Wave 4: Parent-doc rewrites (atomic)
- [ ] T017 026/spec.md + 026/resource-map.md + 026/graph-metadata.json
### Wave 5: Index refreshes
- [ ] T018 ccc index refresh
- [ ] T019 memory_index_scan
- [ ] T020 strict-validate 026
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION
- [ ] T021 Run sample queries from resource-map §5.1
- [ ] T022 Strict-validate 107 packet
- [ ] T023 Backfill implementation-summary.md
- [ ] T024 Final commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- All 5 waves committed on main
- 026 strict-validate exits 0 post-Wave-4
- Sample queries return expected results
- 107 strict-validate exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- 999 resource-map.md
- 999 council-review.md
- 999 implementation-dispatch.md
- Recovery baseline: `052558f1b`
<!-- /ANCHOR:cross-refs -->
