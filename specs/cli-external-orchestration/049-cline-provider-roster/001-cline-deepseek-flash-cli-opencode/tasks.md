---
title: "Tasks: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline provider roster tasks"
  - "cli-opencode cline-pass tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/001-cline-deepseek-flash-cli-opencode"
    last_updated_at: "2026-08-18T11:12:25Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster

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

- [x] T001 Confirm `cline-pass` authenticated and model id via `opencode models cline-pass`
- [x] T002 Confirm reasoning tiers (none→xhigh, no max) via `opencode models cline-pass --verbose`
- [x] T003 Read packet-047 OpenRouter diff to locate exact edit points (`git show 621f8276ad`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `### cline-pass` section + model row (`providers-and-models.md` §2)
- [x] T005 Add effort-lever row for cline-pass Flash (`providers-and-models.md` §4)
- [x] T006 Add keywords + Common alternates + honor-overrides (`SKILL.md`)
- [x] T007 Add Cline login-menu entry (`cli-reference.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Grep the model id across roster surfaces (`rg cline-pass/cline-pass/deepseek-v4-flash`)
- [x] T009 Confirm docs match live `--verbose` tiers (no `max`)
- [x] T010 `validate.sh --strict` exit 0
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
