---
title: "Tasks: Add cline DeepSeek V4 Pro and make cline the pi default"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline pro pi tasks"
  - "cline-pass deepseek-v4-pro tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/005-cline-pro-and-pi-default"
    last_updated_at: "2026-08-18T14:15:43Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add cline DeepSeek V4 Pro and make cline the pi default

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

- [x] T001 Confirm `cline-pass/cline-pass/deepseek-v4-pro` live + limits via `opencode models cline-pass --verbose` (context 1M, output 384K, no `max` tier)
- [x] T002 Confirm the operator's `.pi/settings.json` target order and default fields
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `deepseek-v4-pro` to the cline-pass models array (`.pi/models.json`)
- [x] T004 Add `cline-pass/deepseek-v4-pro` to `enabledModels`; set `defaultProvider` cline-pass + `defaultModel` deepseek-v4-flash (`.pi/settings.json`)
- [x] T005 Cover both models + the default in `.pi/custom-providers.md`
- [x] T006 Add the pro roster row + §4 lever (`cli-opencode/.../providers-and-models.md`)
- [x] T007 Add the pro roster row (`cli-pi/.../providers-and-models.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `pi --list-models` shows `cline-pass deepseek-v4-flash` and `cline-pass deepseek-v4-pro`
- [x] T009 `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-pro --json` → `status: ready`
- [x] T010 `.pi` JSON parses; `defaultProvider: cline-pass`, `defaultModel: deepseek-v4-flash`
- [x] T011 `validate.sh 049-cline-provider-roster --recursive --strict` exit 0
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
