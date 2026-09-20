---
title: "Tasks: sk-design shared root-docs conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design shared root-docs conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/001-root-docs"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/ (11 root markdown files)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design shared root-docs conformance

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

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/shared/ (11 root markdown files)
- [ ] T002 Read no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit .opencode/skills/sk-design/shared/anti-slop-principles.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T004 Audit .opencode/skills/sk-design/shared/cognitive-laws.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T005 Audit .opencode/skills/sk-design/shared/context-loading-contract.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T006 Audit .opencode/skills/sk-design/shared/creation-contract.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T007 Audit .opencode/skills/sk-design/shared/design-dispatch-boundary.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T008 Audit .opencode/skills/sk-design/shared/design-proof-token.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T009 Audit .opencode/skills/sk-design/shared/design-token-vocabulary.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T010 Audit .opencode/skills/sk-design/shared/numeric-design-laws.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T011 Audit .opencode/skills/sk-design/shared/procedure-card-schema.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T012 Audit .opencode/skills/sk-design/shared/register.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
- [ ] T013 Audit .opencode/skills/sk-design/shared/sk-code-handoff.md against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Re-read all touched files end-to-end
- [ ] T015 Run validate.sh --strict for this leaf
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
