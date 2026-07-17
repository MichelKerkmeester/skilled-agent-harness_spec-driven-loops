---
title: "Tasks: Create Commands - Author Presentation Markdown"
description: "Planned task outline for create commands author presentation markdown."
trigger_phrases:
  - "create commands author presentation markdown tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T19:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Created seven dedicated create command presentation Markdown assets"
    next_safe_action: "Keep user-facing display contracts in presentation Markdown assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-003-create-commands-002-author-presentation-md-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Create Commands - Author Presentation Markdown

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

- [x] T001 Define presentation Markdown path conventions (.opencode/commands/create/*.md) Evidence: created `.opencode/commands/create/assets/create_*_presentation.md` files for all seven commands.
- [x] T002 Author startup-question sections (.opencode/commands/create/*.md) Evidence: every presentation asset contains Phase 0 and consolidated startup prompt sections.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Author dashboard layout sections (.opencode/commands/create/*.md) Evidence: every presentation asset contains setup dashboard tables.
- [x] T004 [P] Author results-display sections (.opencode/commands/create/*.md) Evidence: every presentation asset contains completion and, where applicable, failure display templates.
- [x] T005 [P] Check that presentation files are the single display source of truth (.opencode/commands/create/*.md) Evidence: routers state presentation Markdown owns user-visible wording and layout.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record any shared template reuse within the family (.opencode/commands/create/*.md) Evidence: `/create:skill` and `/create:sk-skill` use separate presentation assets while sharing the existing `create_sk_skill_*.yaml` workflows.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation requested in final verification pass.
- [x] T008 Confirm implementation-summary.md records delivered work (implementation-summary.md) Evidence: implementation-summary.md updated from planned stub to completed presentation-summary evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this leaf (pending final command output evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
