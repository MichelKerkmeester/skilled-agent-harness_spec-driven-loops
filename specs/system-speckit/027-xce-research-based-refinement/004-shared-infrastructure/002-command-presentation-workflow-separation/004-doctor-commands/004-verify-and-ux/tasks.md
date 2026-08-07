---
title: "Tasks: Doctor Commands - Verify and UX"
description: "Completed task outline for doctor commands verify and ux."
trigger_phrases:
  - "doctor commands verify and ux tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified doctor command presentation split, references, and validation path."
    next_safe_action: "Run the same reference and strict validation checks after future doctor presentation edits."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-004-verify-and-ux-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Presentation adherence is enforced by router load order and asset-reference checks."
---
# Tasks: Doctor Commands - Verify and UX

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

- [x] T001 Define cross-model render scenarios (.opencode/commands/doctor/*.md) Evidence: presentation assets include startup, setup, dashboard, and result templates for the three command surfaces.
- [x] T002 Verify startup questions are asked consistently (.opencode/commands/doctor/*.md) Evidence: routers require presentation asset load before visible startup prompts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Verify dashboard layout is stable (.opencode/commands/doctor/*.md) Evidence: setup and health dashboards use explicit Markdown/text templates in presentation assets.
- [x] T004 [P] Verify results-display template is followed (.opencode/commands/doctor/*.md) Evidence: result, failure, restart, rollback, and troubleshooting displays live in presentation assets.
- [x] T005 [P] Apply family-specific UX polish plan (.opencode/commands/doctor/*.md) Evidence: presentation assets use compact ASCII-safe templates and clear next-step endings.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record verification evidence for implementation handoff (.opencode/commands/doctor/*.md) Evidence: implementation-summary.md lists reference checks, no-YAML-edit check, and strict validation outputs.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation is part of the final verification run for this leaf.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) Evidence: implementation-summary.md records verification and UX outcomes.
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
