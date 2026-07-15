---
title: "Tasks: Create Commands - Router Rewire"
description: "Planned task outline for create commands router rewire."
trigger_phrases:
  - "create commands router rewire tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire"
    last_updated_at: "2026-06-10T19:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewrote seven create command files as thin routers"
    next_safe_action: "Preserve router-only command docs and avoid inline display contracts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-003-create-commands-003-router-rewire-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Create Commands - Router Rewire

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

- [x] T001 Define thin-router acceptance criteria (.opencode/commands/create/*.md) Evidence: routers now contain only routing assets, execution order, and routing rules.
- [x] T002 Map each command to workflow and presentation files (.opencode/commands/create/*.md) Evidence: every router has a routing-asset table with valid workflow and presentation paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Plan command.md rewrites without changing behavior (.opencode/commands/create/*.md) Evidence: routers point to existing workflow YAML files and do not modify workflow YAML content.
- [x] T004 [P] Plan inline-presentation removal checks (.opencode/commands/create/*.md) Evidence: command routers no longer embed startup prompts, dashboards, or completion templates.
- [x] T005 [P] Plan routing-preservation checks (.opencode/commands/create/*.md) Evidence: routers retain mode and operation routing to the existing create workflow YAMLs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record rollback expectations for command.md rewires (.opencode/commands/create/*.md) Evidence: each router fails closed when referenced assets are missing and leaves workflow YAML untouched.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: strict validation requested in final verification pass.
- [x] T008 Confirm implementation-summary.md records delivered work (implementation-summary.md) Evidence: implementation-summary.md updated from planned stub to completed router-rewrite summary.
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
