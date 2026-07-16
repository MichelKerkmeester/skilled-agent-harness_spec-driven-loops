---
title: "Tasks: Speckit Commands - Author Presentation Markdown"
description: "Planned task outline for speckit commands author presentation markdown."
trigger_phrases:
  - "speckit commands author presentation markdown tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T19:51:18Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Created presentation Markdown source-of-truth files for each speckit command"
    next_safe_action: "Keep startup, dashboard, and results-display edits in presentation Markdown assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-002-author-presentation-md-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Speckit Commands - Author Presentation Markdown

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

- [x] T001 Define presentation Markdown path conventions (.opencode/commands/speckit/*.md) - Evidence: created `assets/speckit_plan_presentation.md`, `assets/speckit_implement_presentation.md`, `assets/speckit_complete_presentation.md`, and `assets/speckit_resume_presentation.md`.
- [x] T002 Author startup-question sections (.opencode/commands/speckit/*.md) - Evidence: each presentation asset contains startup prompt and auto setup sections.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Author dashboard layout sections (.opencode/commands/speckit/*.md) - Evidence: each presentation asset contains a command-specific dashboard layout.
- [x] T004 [P] Author results-display sections (.opencode/commands/speckit/*.md) - Evidence: each presentation asset contains success/failure or resume/no-session result templates.
- [x] T005 [P] Check that presentation files are the single display source of truth (.opencode/commands/speckit/*.md) - Evidence: routers now point to presentation assets and do not retain presentation templates inline.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record any shared template reuse within the family (.opencode/commands/speckit/*.md) - Evidence: implementation summary lists shared startup, dashboard, and result-display presentation sections.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) - Evidence: final strict validation result recorded after reconciliation.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) - Evidence: implementation summary updated from planned stub to completion record.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this leaf
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
