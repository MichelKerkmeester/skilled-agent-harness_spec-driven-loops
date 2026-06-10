---
title: "Tasks: Doctor Commands - Author Presentation Markdown"
description: "Planned task outline for doctor commands author presentation markdown."
trigger_phrases:
  - "doctor commands author presentation markdown tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Prepared Planned scaffold for strict validation"
    next_safe_action: "Implement this leaf after parent scope approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-002-author-presentation-md-planned"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Doctor Commands - Author Presentation Markdown

<!-- SPECKIT_LEVEL: 1 -->
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
## PHASE 1: SETUP

- [ ] T001 Define presentation Markdown path conventions (.opencode/commands/doctor/*.md)
- [ ] T002 Author startup-question sections (.opencode/commands/doctor/*.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T003 [P] Author dashboard layout sections (.opencode/commands/doctor/*.md)
- [ ] T004 [P] Author results-display sections (.opencode/commands/doctor/*.md)
- [ ] T005 [P] Check that presentation files are the single display source of truth (.opencode/commands/doctor/*.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T006 Record any shared template reuse within the family (.opencode/commands/doctor/*.md)
- [ ] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh)
- [ ] T008 Confirm Planned implementation-summary.md stub exists for strict validation (implementation-summary.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All planned tasks are complete or explicitly deferred with approval
- [ ] No blocked tasks remain
- [ ] Strict validation passes for this leaf
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
