---
title: "Tasks: sk-git README"
description: "Task list for finalizing and confirming the sk-git README golden example."
trigger_phrases:
  - "sk-git readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/018-sk-git-readme"
    last_updated_at: "2026-06-07T14:29:02Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-018 confirmation tasks complete"
    next_safe_action: "Begin phase 019 (sk-prompt-models README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-git README

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

- [x] T001 Confirm the README is the phase-001 golden example (unchanged since commit 70fb02a46c)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Validate the README structure with `validate_document.py --type readme`
- [x] T003 Re-check the prose voice (em dash, semicolon, version leak): clean
- [x] T004 Resolve all nine cited paths against the current sk-git skill: all present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `validate_document.py --type readme` passes (0 issues)
- [x] T006 HVR prose scan clean
- [x] T007 `validate.sh --strict` on the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] README confirmed current and valid
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
