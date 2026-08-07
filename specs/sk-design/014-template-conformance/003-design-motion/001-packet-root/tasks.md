---
title: "Tasks: design-motion packet-root conformance"
description: "Task breakdown for auditing and remediating design-motion's SKILL.md and README.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit tasks"
    next_safe_action: "Read SKILL.md + README.md against governing templates"
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
# Tasks: design-motion packet-root conformance

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

- [ ] T001 [P] Read `skill-md-template.md` in full (`.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`)
- [ ] T002 [P] Read `skill-readme-template.md` in full (`.opencode/skills/sk-doc/create-skill/assets/skill/skill-readme-template.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Read `SKILL.md` in full; diff frontmatter + sections against the template (`design-motion/SKILL.md`)
- [ ] T004 Read `README.md` in full; diff structure against the template (`design-motion/README.md`)
- [ ] T005 [B] Fix each confirmed gap in place (blocked on T003/T004 findings)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-diff fixed files against their templates
- [ ] T007 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual diff + `validate.sh` both clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
