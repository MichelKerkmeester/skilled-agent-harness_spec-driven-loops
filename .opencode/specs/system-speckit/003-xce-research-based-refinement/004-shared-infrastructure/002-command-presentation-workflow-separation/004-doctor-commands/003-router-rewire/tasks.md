---
title: "Tasks: Doctor Commands - Router Rewire"
description: "Completed task outline for doctor commands router rewire."
trigger_phrases:
  - "doctor commands router rewire tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewired doctor command Markdown files as thin routers."
    next_safe_action: "Keep future display wording in presentation assets and future routing in command routers."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-003-router-rewire-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every doctor command router references existing workflow YAML and new presentation Markdown assets."
---
# Tasks: Doctor Commands - Router Rewire

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

- [x] T001 Define thin-router acceptance criteria (.opencode/commands/doctor/*.md) Evidence: routers now state the router contract, owned assets, execution order, routing rules, and presentation boundary.
- [x] T002 Map each command to workflow and presentation files (.opencode/commands/doctor/*.md) Evidence: each router has an asset table naming valid workflow YAML and presentation Markdown paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Plan command.md rewrites without changing behavior (.opencode/commands/doctor/*.md) Evidence: command routers keep argument parsing, setup binding, YAML load order, and asset existence stops.
- [x] T004 [P] Plan inline-presentation removal checks (.opencode/commands/doctor/*.md) Evidence: prompt, dashboard, and result bodies now live in presentation Markdown files.
- [x] T005 [P] Plan routing-preservation checks (.opencode/commands/doctor/*.md) Evidence: `/doctor` still routes through `_routes.yaml`; `/doctor:mcp` still selects install/debug YAML; `/doctor:update` still loads `doctor_update.yaml` after setup.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record rollback expectations for command.md rewires (.opencode/commands/doctor/*.md) Evidence: rewire is limited to three command Markdown files and three new presentation Markdown files; YAML files remain reference-only.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation is part of the final verification run for this leaf.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) Evidence: implementation-summary.md records router files, presentation files, and verification evidence.
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
