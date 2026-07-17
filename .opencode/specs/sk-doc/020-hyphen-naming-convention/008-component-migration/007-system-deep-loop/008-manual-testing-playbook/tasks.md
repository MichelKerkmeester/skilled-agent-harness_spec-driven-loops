---
title: "Tasks: system-deep-loop manual-testing-playbook names (032 phase 007/008)"
description: "Execution tasks for renaming the root manual-testing-playbook corpus and repairing benchmark, router, index, and Markdown path consumers while preserving scenario identity."
trigger_phrases:
  - "system-deep-loop manual playbook tasks"
  - "deep loop scenario naming tasks"
  - "manual-testing-playbook path repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook tasks"
    next_safe_action: "Execute the root playbook rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: System-deep-loop manual-testing-playbook names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the root-playbook map, BASE scenario manifest, and benchmark/router consumer inventory.
- [ ] T002 [P] Inventory the root directory, five categories, index, and 19 scenario files.
- [ ] T003 Confirm nested workflow-packet playbooks are excluded and record all root corpus references.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every root playbook path as rename, exempt, frozen, generated, or tool-mandated.
- [ ] T005 Rename the root, five categories, index, and 19 scenario files through the semantic map.
- [ ] T006 Update benchmark README/runner paths, hub resource references, indexes, and Markdown links.
- [ ] T007 Preserve scenario IDs, prompts, frontmatter fields, category vocabulary, generated output, and nested ownership.
- [ ] T008 Record scenario map, path-reference, and ownership evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Compare scenario IDs, categories, expected routes, and count with BASE.
- [ ] T010 Resolve all root playbook, benchmark, router, index, and Markdown paths.
- [ ] T011 Run root benchmark connectivity and route checks with non-zero scenario discovery.
- [ ] T012 Confirm no nested playbook or protected content contract entered the diff.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
