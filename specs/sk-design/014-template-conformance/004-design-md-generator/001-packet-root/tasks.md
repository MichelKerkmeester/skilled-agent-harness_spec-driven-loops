---
title: "Tasks: design-md-generator packet-root conformance"
description: "Task breakdown for auditing and remediating design-md-generator's three root markdown files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit tasks"
    next_safe_action: "Read SKILL.md, README.md, INSTALL-GUIDE.md against their templates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: design-md-generator packet-root conformance

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

- [ ] T001 [P] Read `skill-md-template.md` and `skill-readme-template.md`
- [ ] T002 [P] Locate and read the sk-doc create-readme install-guide template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Diff `SKILL.md` against `skill-md-template.md`; fix if confirmed
- [ ] T004 Diff `README.md` against `skill-readme-template.md`; fix if confirmed
- [ ] T005 Diff `INSTALL-GUIDE.md` against the install-guide template; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-diff all three fixed files against their respective templates
- [ ] T007 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
