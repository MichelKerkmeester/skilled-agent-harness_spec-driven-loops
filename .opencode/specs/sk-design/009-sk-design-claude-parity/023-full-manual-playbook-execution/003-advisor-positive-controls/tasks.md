---
title: "Tasks: Phase 003 - Advisor Positive Controls (Wave)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 003 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/003-advisor-positive-controls"
    last_updated_at: "2026-07-07T18:50:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-positive-controls-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 003 - Advisor Positive Controls (Wave)

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

- [x] T001 Read `positive-design-controls.md` (`AI-001`) in full
- [x] T002 Read `../001-mode-routing-core/` docs as the exact structural template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 AI-001-P1: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-AI-001-P1-response.jsonl` -> grade `PASS`
- [x] T004 AI-001-P2: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-AI-001-P2-response.jsonl` -> grade `PASS`
- [x] T005 AI-001-P3: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-AI-001-P3-response.jsonl` -> grade `PASS`
- [x] T006 AI-001-P4: advisor probe -> real `cli-opencode` dispatch -> capture `/tmp/skd-AI-001-P4-response.jsonl` -> grade `PASS`
- [x] T007 AI-001-P6: advisor probe -> real `cli-opencode` dispatch (caught + corrected wrong no-target-clause branch, re-dispatched) -> capture `/tmp/skd-AI-001-P6-response.jsonl` -> grade `FAIL`
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
- [x] All 5 assigned dispatches captured and graded against `AI-001`'s own Pass/Fail Criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Phase**: `../` (`023-full-manual-playbook-execution`)
<!-- /ANCHOR:cross-refs -->
