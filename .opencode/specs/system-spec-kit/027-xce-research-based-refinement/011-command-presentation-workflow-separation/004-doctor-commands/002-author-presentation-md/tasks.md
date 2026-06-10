---
title: "Tasks: Doctor Commands - Author Presentation Markdown"
description: "Completed task outline for doctor commands author presentation markdown."
trigger_phrases:
  - "doctor commands author presentation markdown tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Created dedicated doctor presentation Markdown assets."
    next_safe_action: "Keep doctor startup questions, dashboards, and result displays in presentation assets."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-002-author-presentation-md-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dedicated presentation assets live under .opencode/commands/doctor/assets/ and are Markdown only."
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

- [x] T001 Define presentation Markdown path conventions (.opencode/commands/doctor/*.md) Evidence: created `doctor_speckit_presentation.md`, `doctor_mcp_presentation.md`, and `doctor_update_presentation.md` under the doctor assets folder.
- [x] T002 Author startup-question sections (.opencode/commands/doctor/*.md) Evidence: each presentation asset has a Startup Presentation or Startup Confirmation section with exact visible prompt text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Author dashboard layout sections (.opencode/commands/doctor/*.md) Evidence: presentation assets include setup dashboards, subsystem manifest display, MCP assessment tables, and update health dashboard templates.
- [x] T004 [P] Author results-display sections (.opencode/commands/doctor/*.md) Evidence: presentation assets include diagnostic, MCP final report, update final status, restart, failure, and rollback result templates.
- [x] T005 [P] Check that presentation files are the single display source of truth (.opencode/commands/doctor/*.md) Evidence: command routers instruct assistants to use presentation contracts, not router bodies, for visible prompts and results.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record any shared template reuse within the family (.opencode/commands/doctor/*.md) Evidence: each presentation asset follows the existing command-family convention used by create and speckit presentation contracts.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation is part of the final verification run for this leaf.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) Evidence: implementation-summary.md records created presentation files and verification evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval. Evidence: T001-T008 are complete.
- [x] No blocked tasks remain. Evidence: no blockers are recorded in continuity.
- [x] Strict validation passes for this leaf. Evidence: final verification run records the command output.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
