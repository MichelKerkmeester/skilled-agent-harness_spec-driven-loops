---
title: "Tasks: system-code-graph references"
description: "Concrete tasks for the seven-file reference rename, link closure, asset/template classification, and content-contract verification."
trigger_phrases:
  - "system-code-graph reference tasks"
  - "code graph reference rename tasks"
  - "reference link repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references tasks"
    next_safe_action: "Begin seven-file reference inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The two code-graph-gold-queries.json files are already compliant assets and are not rename targets."
---

# Tasks: system-code-graph references

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

- [ ] T001 Inventory the seven snake_case reference files under config, readiness, and runtime
- [ ] T002 Classify the two code-graph-gold-queries.json assets and confirm no additional in-scope templates
- [ ] T003 Freeze top-level, plugin bridge, relative, catalog, playbook, and external path consumers plus BASE hashes/counts
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename database_path_policy.md to database-path-policy.md
- [ ] T005 Rename code_graph_readiness_check.md, readiness_and_scope_fingerprint.md, launcher_lease.md,
  naming_conventions.md, ownership_boundary.md, and tool_surface.md to kebab-case
- [ ] T006 Update SKILL, README, ARCHITECTURE, INSTALL_GUIDE, plugin bridge docs, relative links, catalog links, and
  playbook links
- [ ] T007 Preserve reference keys, path-hint identifiers, frontmatter, content semantics, code/data identifiers, and
  already-compliant asset files
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify seven target files exist and no stale live old reference path remains
- [ ] T009 Resolve all affected Markdown/path links and run reference discovery checks
- [ ] T010 Compare preserved asset hashes, reference content, route keys, and link/discovery counts to BASE
- [ ] T011 Record reference-map and link-closure evidence for the catalog/playbook phases and subtree gate
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

