---
title: "Tasks: system-code-graph feature catalog"
description: "Concrete tasks for the code-graph feature-catalog tree rename, path-link closure, classifier preservation, and catalog parity."
trigger_phrases:
  - "system-code-graph feature catalog tasks"
  - "code graph catalog rename tasks"
  - "feature-catalog link repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored catalog tasks"
    next_safe_action: "Begin pinned catalog inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The catalog map covers 19 files, one root index, and eight category directories."
---

# Tasks: system-code-graph feature catalog

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

- [ ] T001 Inventory the feature_catalog root, feature_catalog.md, eight categories, and 18 category files
- [ ] T002 Freeze kebab targets, collision evidence, catalog/link consumers, and root-consumer transition behavior
- [ ] T003 Capture BASE feature IDs, source references, catalog/playbook/reference link counts, and discovery output
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename feature_catalog to feature-catalog and feature_catalog.md to feature-catalog.md
- [ ] T005 Rename context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  edge_confidence_and_provenance, manual_scan_verify_status, mcp_tool_surface, and read_path_freshness
- [ ] T006 Rename all 18 category files to their kebab-case targets
- [ ] T007 Update catalog, SKILL, README, INSTALL_GUIDE, ARCHITECTURE, reference, playbook, and validator path references
- [ ] T008 Preserve classification tokens, feature/tool IDs, frontmatter, data keys, code identifiers, and generated metadata
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify one feature-catalog root, eight categories, 19 files, and zero stale live feature_catalog paths
- [ ] T010 Resolve catalog indexes, feature links, catalog-to-playbook links, and catalog-to-reference links
- [ ] T011 Run catalog validation and compare IDs, counts, links, and discovery behavior to BASE
- [ ] T012 Record catalog-map and cross-link handoff evidence for the manual-playbook phase and subtree gate
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

