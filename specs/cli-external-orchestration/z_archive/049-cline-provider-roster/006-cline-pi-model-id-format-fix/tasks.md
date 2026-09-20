---
title: "Tasks: Fix the pi cline-pass model id format"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline model id format tasks"
  - "pi cline 400 fix tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/006-cline-pi-model-id-format-fix"
    last_updated_at: "2026-08-18T17:51:54Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix the pi cline-pass model id format

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

- [x] T001 Confirm pi forwards a model object's `id` verbatim as the API `model` parameter
- [x] T002 Reproduce the fault: `curl` the Cline API with a bare id (`400 invalid model format`) and a slashed id (`200`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Slash both cline-pass model ids to `cline-pass/deepseek-v4-flash` and `cline-pass/deepseek-v4-pro` (`.pi/models.json`)
- [x] T004 Update `enabledModels` to the three-segment forms and `defaultModel` to `cline-pass/deepseek-v4-flash` (`.pi/settings.json`)
- [x] T005 Correct the model-id forms and add the slashed-id gotcha (`.pi/custom-providers.md`)
- [x] T006 Correct the roster forms, add the slashed-id gotcha, and mark live-dispatch verified (`cli-pi/.../providers-and-models.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Live pi dispatch to `cline-pass/cline-pass/deepseek-v4-flash` returns a reply (no 400)
- [x] T008 Live pi dispatch to `cline-pass/cline-pass/deepseek-v4-pro` returns a reply
- [x] T009 Unqualified pi dispatch (`pi -p ... --provider cline-pass`) resolves through the cline default → reply (`CLINE_DEFAULT_OK`)
- [x] T010 Both `.pi` JSON parse; `validate.sh 049-cline-provider-roster --recursive --strict` exit 0
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
