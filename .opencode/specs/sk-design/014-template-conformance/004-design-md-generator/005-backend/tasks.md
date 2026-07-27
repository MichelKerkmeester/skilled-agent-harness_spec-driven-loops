---
title: "Tasks: design-md-generator backend/ structural conformance"
description: "Task breakdown for auditing backend/'s tracked structure against overview.md and package_skill.py rules."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/005-backend"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author backend structural audit tasks"
    next_safe_action: "Enumerate backend/ tree excluding dist/ and node_modules/"
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
# Tasks: design-md-generator backend/ structural conformance

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

- [ ] T001 [P] Read `overview.md` directory rules
- [ ] T002 [P] Identify `package_skill.py` naming/file-type checks
- [ ] T003 Enumerate tracked `backend/` tree, excluding `dist/`/`node_modules/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Check package-config file placement (`package.json`, `tsconfig*.json`, `vitest.config.ts`, `README.md`, `.npmignore`) against `overview.md`
- [ ] T005 Check `scripts/*.ts` (29 files) and `tests/**` (19 `.ts` + fixtures) naming against `package_skill.py`
- [ ] T006 Confirm "tests/ required when scripts/ exists" rule satisfied, citing the 173-test count
- [ ] T007 [B] Fix confirmed gaps (blocked on T004/T005 findings)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-check fixed structure
- [ ] T009 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] "tests/ required when scripts/ exists" rule confirmed satisfied with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
