---
title: "Tasks: Speckit Commands - Inventory and Extract"
description: "Planned task outline for speckit commands inventory and extract."
trigger_phrases:
  - "speckit commands inventory and extract tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T19:51:18Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed speckit command inventory and presentation extraction map"
    next_safe_action: "Use implementation-summary.md extraction map for future command presentation audits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-001-inventory-extract-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Speckit Commands - Inventory and Extract

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

- [x] T001 List every family command Markdown file (.opencode/commands/speckit/*.md) - Evidence: inventoried `plan.md`, `implement.md`, `complete.md`, and `resume.md`.
- [x] T002 List referenced workflow asset YAML files (.opencode/commands/speckit/*.md) - Evidence: mapped all eight existing auto/confirm YAML assets and left them unmodified.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Identify inline startup-question blocks (.opencode/commands/speckit/*.md) - Evidence: moved consolidated startup prompt and auto setup contract into `assets/speckit_*_presentation.md`.
- [x] T004 [P] Identify inline dashboard layout blocks (.opencode/commands/speckit/*.md) - Evidence: moved checkpoint and dashboard templates into presentation assets.
- [x] T005 [P] Identify inline results-display templates (.opencode/commands/speckit/*.md) - Evidence: moved success, failure, resume brief, and next-step display templates into presentation assets.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Draft the extraction map for each command (.opencode/commands/speckit/*.md) - Evidence: extraction map recorded in `implementation-summary.md`.
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
