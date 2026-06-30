---
title: "Tasks: Speckit Commands - Router Rewire"
description: "Planned task outline for speckit commands router rewire."
trigger_phrases:
  - "speckit commands router rewire tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire"
    last_updated_at: "2026-06-10T19:51:18Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewired four speckit command Markdown files into thin routers"
    next_safe_action: "Preserve command routers as asset pointers and keep display contracts in presentation assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-003-router-rewire-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Speckit Commands - Router Rewire

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

- [x] T001 Define thin-router acceptance criteria (.opencode/commands/speckit/*.md) - Evidence: routers retain frontmatter, mode routing, asset table, execution targets, and presentation boundary only.
- [x] T002 Map each command to workflow and presentation files (.opencode/commands/speckit/*.md) - Evidence: each router references one presentation asset and both auto/confirm YAML assets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Plan command.md rewrites without changing behavior (.opencode/commands/speckit/*.md) - Evidence: YAML workflow paths are unchanged and YAML files were not edited.
- [x] T004 [P] Plan inline-presentation removal checks (.opencode/commands/speckit/*.md) - Evidence: grep check found presentation phrases in assets, not routers.
- [x] T005 [P] Plan routing-preservation checks (.opencode/commands/speckit/*.md) - Evidence: router references point to existing workflow YAML assets and new presentation files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record rollback expectations for command.md rewires (.opencode/commands/speckit/*.md) - Evidence: implementation summary records changed routers and untouched YAML assets.
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
