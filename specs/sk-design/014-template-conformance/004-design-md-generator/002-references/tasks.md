---
title: "Tasks: design-md-generator references/ conformance"
description: "Task breakdown for fixing the importance_tier and H2-casing defects, deciding the vendor exemplar placement, and auditing the remaining references files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit tasks"
    next_safe_action: "Read all 10 root references files and the 4-vendor examples/ tree"
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
# Tasks: design-md-generator references/ conformance

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

- [ ] T001 Read `skill-reference-template.md`, including frontmatter enum rules
- [ ] T002 [P] Read all 10 root `references/*.md` files
- [ ] T003 [P] Read all 8 `examples/{linear,stripe,supabase,vercel}/{DESIGN.md,writing-notes.md}` files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Fix `extraction-workflow.md`'s `importance_tier` to `normal` or `important`
- [ ] T005 [P] Convert `quality-checklist.md` numbered H2s to ALL-CAPS
- [ ] T006 [P] Convert `writing-style-guide.md` numbered H2s to ALL-CAPS
- [ ] T007 [P] Convert `design-md-format.md` numbered H2s to ALL-CAPS
- [ ] T008 Diff `anti-patterns.md`, `authoring-boundary.md`, `color-role-taxonomy.md`, `component-taxonomy.md`, `guided-run.md`, `troubleshooting.md` against the template; fix if confirmed
- [ ] T009 [B] Draft the exemplar placement decision in `decision-record.md` (blocked on T003 read + `overview.md`/`package_skill.py` authority)
- [ ] T010 [B] Execute the decision: relocate `examples/` or add the exemption note (blocked on T009)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-read all fixed root files
- [ ] T012 Grep for `references/examples` cross-references; confirm none broken
- [ ] T013 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Exemplar decision recorded and executed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
