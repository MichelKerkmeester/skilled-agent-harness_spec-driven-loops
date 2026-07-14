---
title: "Tasks: system-skill-advisor references"
description: "Concrete tasks for the 15-file reference rename, path-only link repair, and navigation/reference verification."
trigger_phrases:
  - "advisor references tasks"
  - "reference file rename tasks"
  - "reference link closure tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references tasks"
    next_safe_action: "Begin with the 15-file reference inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Reference directories remain unchanged; only files and path contexts move."
---

# Tasks: system-skill-advisor references

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

- [ ] T001 Enumerate the 15 snake_case reference files and their kebab-case targets
- [ ] T002 Scan each old path across skill docs, commands, catalog/playbook, and references
- [ ] T003 Classify path hits versus identifiers, keys, generated metadata, and frozen history
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename config, decisions, graph, hooks, runtime, and scoring reference files by the frozen map
- [ ] T005 Update internal links and indexes within the reference tree
- [ ] T006 Update SKILL.md, README.md, INSTALL_GUIDE.md, commands, catalog/playbook links, and path-valued examples
- [ ] T007 Preserve reference directories, identifiers, tool IDs, fields, keys, and frozen history
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Resolve every Markdown link and executable path example
- [ ] T009 Run reference validation and compare link/count results to BASE
- [ ] T010 Scan old names and record intentional non-path or historical mentions
- [ ] T011 Hand off the reference disposition ledger to the hooks, catalog, playbook, and subtree-gate phases
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
