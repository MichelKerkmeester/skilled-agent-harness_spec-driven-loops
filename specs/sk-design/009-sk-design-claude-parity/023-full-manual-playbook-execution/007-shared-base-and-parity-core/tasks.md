---
title: "Tasks: Wave 007 - Shared Base & Parity Core"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 007 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core"
    last_updated_at: "2026-07-07T17:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-007-shared-base-parity-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 007 - Shared Base & Parity Core

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

- [x] T001 Read `05--shared-reference-base/hub-routing-only.md` in full
- [x] T002 Read `06--parity-behavior/procedure-selection-proof.md` in full
- [x] T003 Read `06--parity-behavior/context-proof-gates.md` in full
- [x] T004 Read `06--parity-behavior/motion-procedure-selection-proof.md` in full
- [x] T005 Read `06--parity-behavior/audit-procedure-selection-proof.md` in full
- [x] T006 Read `022-benchmark-rerun-and-coverage-fill/`'s 5 docs as the exact structural template
- [x] T007 Confirmed `skill_advisor.py` and `opencode` CLI availability
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 `SR-004` advisor probe → `/tmp/skd-SR004-advisor.txt` (sk-design 0.904 top-1)
- [x] T009 `SR-004` real dispatch → `/tmp/skd-SR004-response.jsonl`, graded PASS
- [x] T010 `PB-001` advisor probe → `/tmp/skd-PB001-advisor.txt` (sk-design 0.878 top-1)
- [x] T011 `PB-001` real dispatch (with no-target clause) → `/tmp/skd-PB001-response.jsonl`, graded PASS
- [x] T012 `PB-002` advisor probe → `/tmp/skd-PB002-advisor.txt` (native unavailable; fallback: sk-design 0.89, NOT top-1)
- [x] T013 `PB-002` real dispatch (with no-target clause) → `/tmp/skd-PB002-response.jsonl`, graded PARTIAL
- [x] T014 `PB-004` advisor probe → `/tmp/skd-PB004-advisor.txt` (sk-design 0.867 top-1)
- [x] T015 `PB-004` real dispatch (with no-target clause) → `/tmp/skd-PB004-response.jsonl`, graded PASS
- [x] T016 `PB-005` primary advisor probe → `/tmp/skd-PB005-advisor.txt` (native unavailable; fallback: sk-design 0.95 tied #1)
- [x] T017 `PB-005` primary real dispatch (with no-target clause) → `/tmp/skd-PB005-response.jsonl`
- [x] T018 `PB-005` negative-control advisor probe → `/tmp/skd-PB005neg-advisor.txt` (sk-design 0.914 top-1)
- [x] T019 `PB-005` negative-control real dispatch (with no-target clause) → `/tmp/skd-PB005neg-response.jsonl`, graded PASS (both variants together)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Write `dispatch-log.md` with one row per dispatch (6 rows across 5 scenario ids)
- [x] T021 Write `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] T022 Run `generate-description.js`
- [x] T023 Run `backfill-graph-metadata.js`
- [x] T024 Run `validate.sh --strict`, fix any failures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every dispatch has a real captured `.jsonl` transcript and a verdict citing the scenario's own Pass/Fail Criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch Log**: See `dispatch-log.md`
- **Parent Phase**: `../` (`023-full-manual-playbook-execution/`)
<!-- /ANCHOR:cross-refs -->
