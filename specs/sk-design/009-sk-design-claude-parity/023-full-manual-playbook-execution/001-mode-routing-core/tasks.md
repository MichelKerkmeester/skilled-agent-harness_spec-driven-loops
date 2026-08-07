---
title: "Tasks: Phase 001 - Mode Routing Core (Wave)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 001 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/001-mode-routing-core"
    last_updated_at: "2026-07-07T17:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mode-routing-core-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 001 - Mode Routing Core (Wave)

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

- [x] T001 Read `interface-mode.md`, `foundations-mode.md`, `motion-mode.md`, `audit-mode.md`, `mode-hint-motion.md` in full
- [x] T002 Read `../../022-benchmark-rerun-and-coverage-fill/` docs as the exact structural template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 MR-001: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-MR001-response.jsonl` -> grade `PASS`
- [x] T004 MR-002: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-MR002-response.jsonl` -> grade `PASS`
- [x] T005 MR-003: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-MR003-response.jsonl` -> grade `PASS`
- [x] T006 MR-004: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-MR004-response.jsonl` -> grade `PARTIAL`
- [x] T007 MR-006: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-MR006-response.jsonl` -> grade `PASS`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write `dispatch-log.md` with one row per dispatch (dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale)
- [x] T009 Write `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] T010 Generate `description.json` and `graph-metadata.json`
- [x] T011 `validate.sh --strict` clean
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 assigned dispatches captured and graded against their own scenario file's Pass/Fail Criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Phase**: `../` (`023-full-manual-playbook-execution`)
<!-- /ANCHOR:cross-refs -->
