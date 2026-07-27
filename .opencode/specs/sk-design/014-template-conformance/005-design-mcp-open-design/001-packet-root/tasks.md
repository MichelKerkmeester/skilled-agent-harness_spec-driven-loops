---
title: "Tasks: design-mcp-open-design packet-root doc conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "design-mcp-open-design packet-root doc conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/{SKILL.md,README.md,INSTALL-GUIDE.md}"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: design-mcp-open-design packet-root doc conformance

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

- [ ] T001 Read SKILL.md, README.md, INSTALL-GUIDE.md (design-mcp-open-design/)
- [ ] T002 Read skill-md-template.md, skill-readme-template.md, install-guide-template.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Diff and fix SKILL.md structure (design-mcp-open-design/SKILL.md)
- [ ] T004 Diff and fix README.md structure (design-mcp-open-design/README.md)
- [ ] T005 Diff and fix INSTALL-GUIDE.md structure (design-mcp-open-design/INSTALL-GUIDE.md)
- [ ] T006 Record the .mjs-relocation and missing-procedures/ observations in implementation-summary.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Re-read all 3 fixed files end-to-end
- [ ] T008 Run validate.sh --strict for this leaf
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
