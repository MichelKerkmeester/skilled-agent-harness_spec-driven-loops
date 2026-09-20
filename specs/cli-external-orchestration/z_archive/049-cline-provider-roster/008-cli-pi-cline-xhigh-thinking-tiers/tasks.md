---
title: "Tasks: Expose xhigh in the pi picker for cline-pass models"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi cline xhigh tasks"
  - "thinkingLevelMap tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/008-cli-pi-cline-xhigh-thinking-tiers"
    last_updated_at: "2026-08-25T05:06:09Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Linked the successor phase after 009 landed"
    next_safe_action: "Close phase; operator confirms picker"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Expose xhigh in the pi picker for cline-pass models

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

- [x] T001 Confirm pi's picker derives selectable tiers from `thinkingLevelMap` (models-store schema: xhigh-capable models carry it; cline-pass had none)
- [x] T002 Identify the reference map: OpenRouter DeepSeek Flash exposes `high` + `xhigh` (Cline has no `max`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `thinkingLevelMap` (high + xhigh) to both cline-pass models (`.pi/models.json`)
- [x] T004 Restore `defaultThinkingLevel` to `xhigh` (`.pi/settings.json`)
- [x] T005 Document the `thinkingLevelMap` picker requirement (`.pi/custom-providers.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Both `.pi` JSON parse; `pi --list-models` lists both cline-pass models with no error
- [x] T007 Live `pi --thinking xhigh --model cline-pass/cline-pass/deepseek-v4-flash` dispatch completes at exit 0
- [x] T008 `grep -c thinkingLevelMap .pi/models.json` = 2; `defaultThinkingLevel` = xhigh; `validate.sh --strict` exit 0
- [x] T009 Picker tab-cycle to xhigh [deferred: interactive pi TUI only, not headlessly testable; operator confirms after restarting pi so it re-reads `.pi/models.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T009 deferred to operator with documented reason)
- [x] No `[B]` blocked tasks remaining
- [x] Config verified; live xhigh dispatch passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
