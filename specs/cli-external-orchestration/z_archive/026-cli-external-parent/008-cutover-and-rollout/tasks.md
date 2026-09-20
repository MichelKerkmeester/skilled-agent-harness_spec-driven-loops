---
title: "Tasks: Phase 8: cutover-and-rollout"
description: "Task list for the terminal gate: strict parent-skill check, recursive validation, active fail-open hook trigger test, stale-reference sweep, and parent rollup."
trigger_phrases:
  - "cli-external cutover tasks"
  - "terminal gate tasks"
  - "parent rollup tasks"
  - "phase 008 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the terminal-gate task list"
    next_safe_action: "Run the terminal gate after phase 007"
    blockers: []
    key_files:
      - "../graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: cutover-and-rollout

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Confirm phases 001-007 completed with benchmark and review evidence
- [ ] T002 Confirm the strict parent-skill and recursive validation commands
- [ ] T003 [P] Prepare a known dispatch hard-rule violation for the active hook trigger
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs .opencode/skills/cli-external` and require zero warnings
- [ ] T005 Run `validate.sh .opencode/specs/cli-external-orchestration/026-cli-external-parent --recursive --strict`
- [ ] T006 Actively trip the hard-rule violation and confirm the fail-open hook advisory fires from the new path
- [ ] T007 Run the final stale-reference grep sweep for the old flat paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm all strict gates pass and the hook is actively proven live
- [ ] T009 Roll up parent `description.json` and `graph-metadata.json` (status complete, `last_active_child_id: 008`) at execution time only
- [ ] T010 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict checks pass, fail-open hook actively proven, sweep clean, parent rolled up
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
