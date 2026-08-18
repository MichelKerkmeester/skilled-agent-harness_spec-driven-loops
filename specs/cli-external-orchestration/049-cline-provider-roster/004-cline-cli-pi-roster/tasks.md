---
title: "Tasks: Add the Cline provider to the cli-pi skill roster (xhigh-only)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline cli-pi roster tasks"
  - "cli-pi cline-pass tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/004-cline-cli-pi-roster"
    last_updated_at: "2026-08-18T14:01:37Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add the Cline provider to the cli-pi skill roster (xhigh-only)

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

- [x] T001 Read the cli-pi roster §2/§4 structure (`cli-pi/references/providers-and-models.md`)
- [x] T002 Confirm model id `cline-pass/deepseek-v4-flash` + xhigh-only tier from Phase 3 config and `pi --list-models`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `### cline-pass` section: description, config-only note, dispatch form, xhigh-only policy, model row (`cli-pi/references/providers-and-models.md` §2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Grep confirms the section and the xhigh-only wording (`rg '### cline-pass' ... && rg 'only at .--thinking xhigh'`)
- [x] T005 Cross-link to `.pi/custom-providers.md` resolves (`ls` on the relative path)
- [x] T006 `validate.sh 049-cline-provider-roster --recursive --strict` exit 0
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
