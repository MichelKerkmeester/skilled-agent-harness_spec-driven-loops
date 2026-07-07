---
title: "Tasks: Wave 006 - Excluded Aliases & Shared Reference Base"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 006 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base"
    last_updated_at: "2026-07-07T15:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-006-excluded-aliases-shared-base"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 006 - Excluded Aliases & Shared Reference Base

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

- [x] T001 Read `manual_testing_playbook/03--transform-verb-framing/audit-excluded-aliases.md` in full
- [x] T002 Read `manual_testing_playbook/05--shared-reference-base/reference-base-backend-modes.md` in full
- [x] T003 Read `manual_testing_playbook/05--shared-reference-base/shared-base-not-workflow.md` in full
- [x] T004 Locate structural template: read `../../022-benchmark-rerun-and-coverage-fill/` docs as the exact Level 2 shape to mirror
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 `TV-005`: advisor probe (`skill_advisor.py`, threshold 0.8) -> `/tmp/skd-TV005-advisor.txt`
- [x] T006 `TV-005`: orchestrator dispatch (`opencode run`, no-target clause) -> `/tmp/skd-TV005-response.jsonl`
- [x] T007 `SR-002-P1`: advisor probe -> `/tmp/skd-SR002-P1-advisor.txt`
- [x] T008 `SR-002-P1`: orchestrator dispatch (no-target clause) -> `/tmp/skd-SR002-P1-response.jsonl`
- [x] T009 `SR-002-P2`: advisor probe -> `/tmp/skd-SR002-P2-advisor.txt`
- [x] T010 `SR-002-P2`: orchestrator dispatch (no-target clause) -> `/tmp/skd-SR002-P2-response.jsonl`
- [x] T011 `SR-002-P3`: advisor probe -> `/tmp/skd-SR002-P3-advisor.txt`
- [x] T012 `SR-002-P3`: orchestrator dispatch (no-target clause) -> `/tmp/skd-SR002-P3-response.jsonl`
- [x] T013 `SR-003`: advisor probe -> `/tmp/skd-SR003-advisor.txt`
- [x] T014 `SR-003`: orchestrator dispatch (empty clause) -> `/tmp/skd-SR003-response.jsonl`
- [x] T015 Parse each transcript for `tool_use`/`text` events; confirm resolved mode, packet, cited shared resources, tool surface per dispatch
- [x] T016 Grade each dispatch against its owning scenario's own Pass/Fail Criteria, citing the specific criterion line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Write `dispatch-log.md` with one row per dispatch (dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale)
- [x] T018 Write this wave's `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] T019 Run `generate-description.js --level 2`
- [x] T020 Run `backfill-graph-metadata.js`
- [x] T021 Run `validate.sh --strict`, fix any failures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 dispatches graded with an explicit verdict citing a scenario Pass/Fail Criteria line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Structural precedent**: `../../022-benchmark-rerun-and-coverage-fill/`
<!-- /ANCHOR:cross-refs -->
