---
title: "Tasks: code-quality filesystem names (017 phase 008/003)"
description: "Execution tasks for the code-quality filesystem rename and quality-mode path closure."
trigger_phrases:
  - "code-quality naming tasks"
  - "quality mode rename tasks"
  - "quality checklist path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-quality phase tasks"
    next_safe_action: "Execute the quality packet rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: code-quality filesystem names

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

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the frozen map, BASE evidence, and preceding component handoffs.
- [ ] T002 [P] Inventory checklist, playbook, benchmark, and quality-mode path consumers.
- [ ] T003 Classify generated output, exact names, identifiers, keys, and frozen content.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename assets/code-quality-checklist and its markdown files.
- [ ] T005 Rename the quality manual-testing-playbook root/category/index/scenario paths.
- [ ] T006 Rename classified benchmark labels and update quality-mode command/report paths.
- [ ] T007 Repair SKILL.md, README.md, shared-resource, playbook, and cross-surface references.
- [ ] T008 Record every remaining cross-component edge for the subtree gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Load the quality mode and its checklist/resource set from the new paths.
- [ ] T010 Run quality-mode scenarios and compare gate outcomes with BASE.
- [ ] T011 Search for stale old basenames and verify the component inventory is kebab-clean.
- [ ] T012 Verify scope, executable modes, generated output, identifiers, and exemption parity.
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

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Predecessor**: See ../002-code-opencode/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
