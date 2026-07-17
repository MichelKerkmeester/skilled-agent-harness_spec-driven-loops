---
title: "Tasks: code-webflow filesystem names (032 phase 008/005)"
description: "Execution tasks for the code-webflow filesystem rename and asset/reference closure."
trigger_phrases:
  - "code-webflow naming tasks"
  - "Webflow packet rename tasks"
  - "Webflow asset path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-webflow phase tasks"
    next_safe_action: "Execute the Webflow packet rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: code-webflow filesystem names

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

- [ ] T001 Load frozen map, BASE Webflow evidence, and prior sk-code handoffs.
- [ ] T002 [P] Inventory assets, playbook categories, reference tree, symlinks, benchmark labels, and path consumers.
- [ ] T003 Classify generated output, selectors/identifiers, exact names, keys, frontmatter, and frozen content.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename animation, integrations, patterns, templates, and asset checklist paths.
- [ ] T005 Rename the Webflow manual-testing-playbook categories and scenario files.
- [ ] T006 Rename reference directories/files and repair their deep markdown links.
- [ ] T007 Rename classified benchmark labels and update SKILL.md, README.md, indexes, symlinks, and path values.
- [ ] T008 Record Webflow, Motion.dev, and cross-component reference disposition evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve all asset/reference/playbook markdown and path links.
- [ ] T010 Compare surface, animation, language, and scenario discovery with BASE.
- [ ] T011 Run browser/runtime smoke and benchmark path checks.
- [ ] T012 Verify symlink, exemption, identifier/selector, generated-output, and final handoff parity.
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
- **Predecessor**: See ../004-code-review/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
