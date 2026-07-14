---
title: "Tasks: system-skill-advisor feature catalog"
description: "Concrete tasks for the feature-catalog root, category, and file rename, path-link repair, and catalog parity verification."
trigger_phrases:
  - "feature catalog tasks"
  - "feature-catalog tree tasks"
  - "catalog link closure tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature-catalog tasks"
    next_safe_action: "Begin with the 42-file catalog inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The catalog map covers 42 files and seven category directories."
---

# Tasks: system-skill-advisor feature catalog

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

- [ ] T001 Enumerate the 42 catalog files, root index, and seven category directories
- [ ] T002 Build kebab-case targets and collision report for every catalog path
- [ ] T003 Inventory catalog, docs, generator, validator, and playbook path references
- [ ] T004 Capture BASE feature IDs, source references, link counts, and classifier discovery
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rename feature_catalog/ to feature-catalog/ and the root index to feature-catalog.md
- [ ] T006 Rename all seven category directories and every in-scope feature file
- [ ] T007 Update catalog links, skill docs, generators, validators, and catalog-to-playbook path references
- [ ] T008 Preserve classification tags, frontmatter, feature IDs, tool IDs, code identifiers, and generated metadata
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Prove one physical catalog root and zero stale live old paths
- [ ] T010 Resolve every catalog link and cross-surface playbook pointer
- [ ] T011 Run catalog validation and compare file, ID, link, and discovery counts to BASE
- [ ] T012 Record the catalog map and handoff evidence for the playbook and subtree-gate phases
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
