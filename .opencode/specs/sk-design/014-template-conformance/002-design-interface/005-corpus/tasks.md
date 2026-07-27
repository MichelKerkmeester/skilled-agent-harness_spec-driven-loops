---
title: "Tasks: design-interface corpus conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "corpus tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned tasks.md"
    next_safe_action: "Start T001"
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

# Tasks: design-interface corpus conformance

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

- [ ] T001 Re-read `overview.md` §2 directory-organization principle
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Run `package_skill.py --check`, extract `corpus/`-scoped output
- [ ] T003 Decide and apply the `corpus/README.md` frontmatter question
- [ ] T004 Confirm kebab-case naming for all `.mjs` files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run `node --test .opencode/skills/sk-design/design-interface/corpus/tests/*.test.mjs`
- [ ] T006 Re-run `package_skill.py --check`
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
