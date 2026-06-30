---
title: "Tasks: Create Commands - Inventory and Extract"
description: "Planned task outline for create commands inventory and extract."
trigger_phrases:
  - "create commands inventory and extract tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T19:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed command and workflow asset inventory for create commands"
    next_safe_action: "Maintain inventory when create command files are added or removed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-003-create-commands-001-inventory-extract-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Create Commands - Inventory and Extract

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

- [x] T001 List every family command Markdown file (.opencode/commands/create/*.md) Evidence: inventoried 7 command routers: agent, changelog, feature-catalog, folder_readme, sk-skill, skill, testing-playbook.
- [x] T002 List referenced workflow asset YAML files (.opencode/commands/create/*.md) Evidence: mapped 12 existing workflow YAML assets and kept them read-only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Identify inline startup-question blocks (.opencode/commands/create/*.md) Evidence: extracted consolidated setup prompts into `*_presentation.md` assets.
- [x] T004 [P] Identify inline dashboard layout blocks (.opencode/commands/create/*.md) Evidence: extracted setup/status dashboards into presentation assets.
- [x] T005 [P] Identify inline results-display templates (.opencode/commands/create/*.md) Evidence: extracted completion/failure display templates into presentation assets.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Draft the extraction map for each command (.opencode/commands/create/*.md) Evidence: each router now contains a routing-asset table mapping command, workflow YAML, and presentation Markdown.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation requested in final verification pass.
- [x] T008 Confirm implementation-summary.md records delivered work (implementation-summary.md) Evidence: implementation-summary.md updated from planned stub to completed inventory summary.
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
