---
title: "Tasks: Phase 4: SKILL note and cross-runtime mirrors"
description: "Task list for the SKILL subsection and the Claude and Cursor command mirrors."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/004-skill-and-mirrors"
    last_updated_at: "2026-08-19T04:54:45Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-005"
    next_safe_action: "Run final recursive strict validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-skill-and-mirrors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: SKILL note and cross-runtime mirrors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm the SKILL insertion point and the mirror convention.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add the "Operator Trigger Commands" subsection to SKILL.md.
- [x] T-003 Create the `.claude` and `.cursor` mirrors for both commands.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Confirm the default-off statement in SKILL.md is intact.
- [x] T-005 Confirm every mirror resolves to its canonical command.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The SKILL subsection is present and additive, and both commands resolve through their Claude and Cursor mirrors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Skill: `.opencode/skills/sk-communication/SKILL.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
