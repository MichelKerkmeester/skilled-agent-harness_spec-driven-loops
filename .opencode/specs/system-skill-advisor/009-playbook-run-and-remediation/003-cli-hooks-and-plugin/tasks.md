---
title: "Tasks: CLI Hooks and Plugin (Playbook Run Phase 003)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook cli hooks tasks"
  - "028 phase 003 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/003-cli-hooks-and-plugin"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "CL scenario tasks complete"
    next_safe_action: "Phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: CLI Hooks and Plugin (Playbook Run Phase 003)

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

- [x] T001 Confirm compiled dist hooks for claude/gemini/codex/devin
- [x] T002 [P] Read CL-001/003/004/005/006 scenario files for payload shapes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 CL-006 Devin hook: registration check + substantive/short/malformed
- [x] T004 CL-001 Claude hook smoke
- [x] T005 CL-005 OpenCode bridge direct invocation
- [x] T006 CL-003 Gemini hook smoke (BeforeAgent)
- [x] T007 CL-004 Codex SessionStart + UserPromptSubmit + prompt-wrapper
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Assert exit 0 + JSON validity per smoke
- [x] T009 Assert runtime tags + no prompt leak across all stderr
- [x] T010 Record verdicts (4 PASS, 1 PARTIAL) + bridge finding
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
