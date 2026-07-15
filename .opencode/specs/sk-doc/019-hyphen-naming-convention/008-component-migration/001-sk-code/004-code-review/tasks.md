---
title: "Tasks: code-review filesystem names (017 phase 008/004)"
description: "Execution tasks for the code-review filesystem rename and review-scenario path closure."
trigger_phrases:
  - "code-review naming tasks"
  - "review mode rename tasks"
  - "review playbook path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-review phase tasks"
    next_safe_action: "Execute the review packet rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: code-review filesystem names

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

- [ ] T001 Load frozen map, BASE review evidence, and preceding sk-code handoffs.
- [ ] T002 [P] Inventory review assets, categories, scenarios, references, benchmark labels, and path consumers.
- [ ] T003 Classify review identifiers, content values, exact names, generated output, and frozen surfaces.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename review checklist assets and repair incoming links.
- [ ] T005 Rename the manual-testing-playbook root, review categories, indexes, and scenario files.
- [ ] T006 Rename review references and classified benchmark labels.
- [ ] T007 Update SKILL.md, README.md, indexes, scenario links, shared/surface references, and benchmark paths.
- [ ] T008 Record scenario and cross-component disposition evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve all review markdown and path-valued references.
- [ ] T010 Compare scenario IDs and discovery counts with BASE.
- [ ] T011 Run findings-first, security, correctness, and review-state checks.
- [ ] T012 Verify scope, exemptions, generated output, identifiers, and final cross-component handoff.
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
- **Predecessor**: See ../003-code-quality/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
