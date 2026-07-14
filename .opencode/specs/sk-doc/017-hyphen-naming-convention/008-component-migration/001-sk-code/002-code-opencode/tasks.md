---
title: "Tasks: code-opencode filesystem names (017 phase 008/002)"
description: "Execution tasks for the code-opencode filesystem rename and resource-reference closure."
trigger_phrases:
  - "code-opencode naming tasks"
  - "OpenCode packet rename tasks"
  - "OpenCode reference repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-opencode phase tasks"
    next_safe_action: "Execute the OpenCode packet rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: code-opencode filesystem names

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

- [ ] T001 Load the frozen map, BASE manifests, and 001 shared handoff.
- [ ] T002 [P] Inventory assets, playbook, references, benchmark labels, symlinks, and all active path consumers.
- [ ] T003 Record every .py file and Python import-package directory as an explicit exemption.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename asset/checklist and Rust checklist paths to kebab-case.
- [ ] T005 Rename manual_testing_playbook categories and scenario/index files.
- [ ] T006 Rename language/reference directory and file names across config, JavaScript, Python, Rust, shared, shell, and TypeScript trees.
- [ ] T007 Rename nested benchmark storage labels and update packet docs, resource indexes, links, and symlink target strings.
- [ ] T008 Record cross-component references for the downstream subtree gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve all OpenCode markdown, config, resource, and symlink references.
- [ ] T010 Run language-specific resource discovery checks and compare logical load sets with BASE.
- [ ] T011 Verify Python/package/tool-mandated names and content identifiers remain unchanged.
- [ ] T012 Publish the path manifest, reference disposition, and benchmark/scenario handoff evidence.
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
- **Hub/shared predecessor**: See ../001-hub-root-and-shared/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
