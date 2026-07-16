---
title: "Tasks: system-code-graph manual testing playbook"
description: "Concrete tasks for the code-graph manual-testing-playbook tree rename, path-link closure, scenario preservation, and coverage parity."
trigger_phrases:
  - "system-code-graph manual testing playbook tasks"
  - "code graph manual scenario rename tasks"
  - "manual-playbook link repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook tasks"
    next_safe_action: "Begin pinned scenario inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The playbook map covers 29 files, one root index, and nine category directories."
---

# Tasks: system-code-graph manual testing playbook

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

- [ ] T001 Inventory the manual_testing_playbook root, manual_testing_playbook.md, nine categories, and 28 scenario files
- [ ] T002 Freeze kebab targets, collision evidence, playbook/link consumers, and sibling-phase boundaries
- [ ] T003 Capture BASE scenario IDs, category membership, feature references, link counts, and content fingerprints
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename manual_testing_playbook to manual-testing-playbook and manual_testing_playbook.md to manual-testing-playbook.md
- [ ] T005 Rename context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  manual_scan_verify_status, mcp_tool_surface, plugins_and_hooks, post_rename_infrastructure, and read_path_freshness
- [ ] T006 Rename all 28 scenario files to their kebab-case targets
- [ ] T007 Update playbook, catalog, SKILL, README, INSTALL_GUIDE, ARCHITECTURE, reference, test, and validator path references
- [ ] T008 Preserve scenario IDs, frontmatter, titles, steps, expected results, commands, evidence rules, and content keys
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify one manual-testing-playbook root, nine categories, 29 files, and zero stale live manual_testing_playbook paths
- [ ] T010 Resolve root navigation, scenario links, catalog/reference links, and sibling-phase pointers
- [ ] T011 Compare scenario identity, category membership, content fingerprints, feature references, and coverage to BASE
- [ ] T012 Record playbook-map and cross-link handoff evidence for the subtree gate
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

