---
title: "Tasks: design-motion references/ conformance"
description: "Task breakdown for fixing the two known separator-discipline defects, the H2-casing defect, and auditing the remaining 4 references files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit tasks"
    next_safe_action: "Read all 7 references files against skill-reference-template.md"
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
# Tasks: design-motion references/ conformance

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

- [ ] T001 Read `skill-reference-template.md` in full
- [ ] T002 [P] Read all 7 `references/*.md` files in full
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Fix separator discipline in `motion-strategy.md` (`---` before §3-§7)
- [ ] T004 [P] Fix separator discipline in `micro-interactions.md` (`---` before §3 onward)
- [ ] T005 [P] Convert `advanced-craft.md` numbered H2s to ALL-CAPS
- [ ] T006 Diff `animate-presence-patterns.md` against the template; fix if confirmed
- [ ] T007 Diff `animation-decision-framework.md` against the template; fix if confirmed
- [ ] T008 Diff `corpus-map.md` against the template; fix if confirmed
- [ ] T009 Diff `performance-reduced-motion.md` against the template; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-read all 7 files; confirm consistent separator discipline and ALL-CAPS H2s
- [ ] T011 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 7 files conformant to `skill-reference-template.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
