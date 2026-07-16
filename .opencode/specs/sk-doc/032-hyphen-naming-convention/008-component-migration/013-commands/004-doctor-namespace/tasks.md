---
title: "Tasks: doctor command namespace naming (032 phase 008/013/004)"
description: "Execution tasks for the doctor command asset rename, route repair, and exact/Python exemption closure."
trigger_phrases:
  - "doctor namespace naming tasks"
  - "doctor asset rename tasks"
  - "doctor route repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored doctor namespace tasks"
    next_safe_action: "Execute the doctor asset and route closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Doctor command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the frozen doctor map, route baseline, and exact/Python exemption decision.
- [ ] T002 [P] Inventory all references to the 16 doctor assets in `_routes.yaml`, commands, assets, scripts, tests, and docs.
- [ ] T003 Confirm `_routes.yaml`, `audit_descriptions.py`, route IDs, YAML keys, and compliant scripts are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the 16 maintained doctor asset files to their mapped kebab-case targets.
- [ ] T005 Update path-valued route, command, presentation, test, and external references without changing route IDs or keys.
- [ ] T006 Preserve `_routes.yaml`, `audit_descriptions.py`, file modes, and executable helper behavior.
- [ ] T007 Record dynamic, non-path, Python, and exact-name occurrences in the disposition ledger.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final doctor manifest with all maintained and exempt map rows.
- [ ] T009 Parse route targets, resolve all asset pointers, and run command-reference checks.
- [ ] T010 Exercise doctor route, workflow, presentation, and helper paths against BASE scenarios.
- [ ] T011 Confirm no route ID, YAML key, Python/exact name, exemption, or sibling namespace changed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
- **Commands parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
