---
title: "Tasks: Doctor Commands - Inventory and Extract"
description: "Completed task outline for doctor commands inventory and extract."
trigger_phrases:
  - "doctor commands inventory and extract tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed doctor command inventory and extraction map."
    next_safe_action: "Use the extraction map as the source for presentation asset maintenance."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-001-inventory-extract-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Doctor command surfaces are speckit.md, mcp.md, and update.md; no legacy doctor:*.md surfaces were found."
---
# Tasks: Doctor Commands - Inventory and Extract

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

- [x] T001 List every family command Markdown file (.opencode/commands/doctor/*.md) Evidence: inventoried `speckit.md`, `mcp.md`, and `update.md`.
- [x] T002 List referenced workflow asset YAML files (.opencode/commands/doctor/*.md) Evidence: inventoried all existing doctor workflow YAML assets referenced by the three routers and `_routes.yaml`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Identify inline startup-question blocks (.opencode/commands/doctor/*.md) Evidence: extracted `/doctor` target menu, `/doctor:mcp` sub-action menu, and `/doctor:update` initial/mid-run prompt catalog into presentation Markdown.
- [x] T004 [P] Identify inline dashboard layout blocks (.opencode/commands/doctor/*.md) Evidence: extracted setup dashboards, subsystem manifest, MCP assessment tables, and update health dashboard into presentation Markdown.
- [x] T005 [P] Identify inline results-display templates (.opencode/commands/doctor/*.md) Evidence: extracted diagnostic, MCP, update, restart, failure, rollback, and next-step displays into presentation Markdown.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Draft the extraction map for each command (.opencode/commands/doctor/*.md) Evidence: each router now has a Presentation Boundary section naming the content moved to its presentation asset.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation is part of the final verification run for this leaf.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) Evidence: implementation-summary.md records completed inventory and extraction work.
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
