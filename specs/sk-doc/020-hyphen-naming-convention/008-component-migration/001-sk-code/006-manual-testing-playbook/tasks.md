---
title: "Tasks: sk-code manual-testing-playbook tree (020 phase 008/006)"
description: "Execution tasks for the hub-level sk-code playbook filesystem rename and scenario graph closure."
trigger_phrases:
  - "manual playbook naming tasks"
  - "sk-code scenario rename tasks"
  - "playbook link repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase tasks"
    next_safe_action: "Execute the hub playbook rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-code manual-testing-playbook tree

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

- [ ] T001 Load frozen map, BASE scenario evidence, and component ownership handoffs.
- [ ] T002 [P] Extract root/category/file paths, scenario IDs, category counts, links, and benchmark consumers.
- [ ] T003 Record empty categories, component-local playbooks, generated output, identifiers, keys, and exact-name exemptions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the hub-level manual-testing-playbook root and root index.
- [ ] T005 Rename all ten category directories and their scenario files.
- [ ] T006 Update scenario links, hub docs, benchmark README, asset entries, and cross-surface references.
- [ ] T007 Publish the scenario graph and benchmark-corpus handoff for 007-benchmark and 009-skill-gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare scenario IDs, category membership, and counts with BASE.
- [ ] T009 Resolve every playbook/root/index/consumer link and confirm non-zero corpus discovery.
- [ ] T010 Verify scenario content, expected resources, identifiers, keys, and sibling-owned trees are unchanged.
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
- **Benchmark consumer**: See ../007-benchmark/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
