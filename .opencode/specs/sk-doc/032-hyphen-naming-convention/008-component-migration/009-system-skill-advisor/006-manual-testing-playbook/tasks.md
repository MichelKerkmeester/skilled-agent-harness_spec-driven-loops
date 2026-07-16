---
title: "Tasks: system-skill-advisor manual testing playbook"
description: "Concrete tasks for the manual-testing-playbook root, category, and scenario rename, path-link repair, and scenario parity verification."
trigger_phrases:
  - "manual testing playbook tasks"
  - "manual-testing-playbook tree tasks"
  - "advisor scenario path closure tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook tasks"
    next_safe_action: "Begin with the 48-file playbook inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The playbook map covers 48 files and nine category directories."
---

# Tasks: system-skill-advisor manual testing playbook

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

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate the 48 playbook files, root index, and nine category directories
- [ ] T002 Build kebab-case targets and collision report for every scenario path
- [ ] T003 Inventory catalog, docs, references, tests, and operator command references
- [ ] T004 Capture BASE scenario IDs, parsed counts, links, and representative outputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rename manual_testing_playbook/ to manual-testing-playbook/ and the root index to manual-testing-playbook.md
- [ ] T006 Rename all nine category directories and every in-scope scenario file
- [ ] T007 Update catalog links, docs, references, test fixtures, and operator command paths
- [ ] T008 Preserve scenario IDs, frontmatter, steps, expected results, Python references, and coverage semantics
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Prove one physical playbook root and zero stale live old paths
- [ ] T010 Resolve every playbook link and command target
- [ ] T011 Run scenario parser/test discovery and representative operator checks
- [ ] T012 Compare IDs, counts, and outcomes to BASE and hand off evidence to the subtree gate
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
