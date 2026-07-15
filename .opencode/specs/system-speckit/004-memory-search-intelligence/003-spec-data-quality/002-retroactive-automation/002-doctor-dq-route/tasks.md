---
title: "Tasks: B2 Guarded data-quality Route on /doctor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor dq route tasks"
  - "data-quality route task breakdown"
  - "dq route work items"
  - "doctor route validate tasks"
  - "guarded dq route tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/002-retroactive-automation/002-doctor-dq-route"
    last_updated_at: "2026-07-04T17:12:09.850Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored tasks.md for the B2 doctor dq route scaffold"
    next_safe_action: "Start T001 once the B1 dq-engine seam lands"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/doctor_data-quality.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-phase-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: B2 Guarded data-quality Route on /doctor

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

- [ ] T001 Confirm the B1 dq-engine exposes runDetectors with an allowFixClass option (B1 sibling phase)
- [ ] T002 [P] Read the precedent route shapes (.opencode/commands/doctor/assets/doctor_code-graph.yaml, doctor_memory.yaml)
- [ ] T003 [P] Read the manifest assertions (.opencode/commands/doctor/scripts/route-validate.py)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the route asset with a diagnostic-default Phase A and a pre-apply approval gate (.opencode/commands/doctor/assets/doctor_data-quality.yaml)
- [ ] T005 Define validate_targets as the inverted doctor_memory.yaml, allow the docs and the two JSONs, forbid the databases (.opencode/commands/doctor/assets/doctor_data-quality.yaml)
- [ ] T006 Wire the route to call dq-engine.runDetectors with allowFixClass pinned to ['safe'] (.opencode/commands/doctor/assets/doctor_data-quality.yaml)
- [ ] T007 Append the data-quality row to the manifest and register the route in the dispatch table (.opencode/commands/doctor/_routes.yaml, .opencode/commands/doctor/speckit.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run route-validate.py and confirm exit 0 with the data-quality row present
- [ ] T009 Run the three flag states on a scratch packet and confirm report-only, confirm-gated apply and dry-run-applies-nothing
- [ ] T010 Confirm a DB-path apply halts with STATUS=FAIL ERROR='confirm-mode-mutation-violation' and update the docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
