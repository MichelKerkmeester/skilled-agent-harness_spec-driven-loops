---
title: "Tasks: Add a cline model-dispatch testing playbook scenario"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline playbook scenario tasks"
  - "PI-023 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/007-cline-model-dispatch-playbook-scenario"
    last_updated_at: "2026-08-18T18:42:01Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a cline model-dispatch testing playbook scenario

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

- [x] T001 Read the model-dispatch scenario template (`model-dispatch/supported-model-allowlist-smoke.md`) and the index structure
- [x] T002 Confirm the next playbook id via `grep -rhoE 'PI-[0-9]{3}'` (max `PI-022` -> new id `PI-023`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the PI-023 scenario (`model-dispatch/cline-provider-id-format-dispatch.md`)
- [x] T004 Update the index count 22 -> 23, the Model Dispatch group, and the cross-reference (`manual-testing-playbook.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 sk-doc validate the scenario -> `playbook_feature`, 0 issues; the index -> VALID, 0 issues
- [x] T006 Live positive control returned `CLI_PI_FLASH_OK` with no `400 invalid model format`
- [x] T007 `validate.sh 049-cline-provider-roster --recursive --strict` exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
