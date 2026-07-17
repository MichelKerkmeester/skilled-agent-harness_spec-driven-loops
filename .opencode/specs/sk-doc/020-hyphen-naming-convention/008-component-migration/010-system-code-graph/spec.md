---
title: "Feature Specification: system-code-graph component migration"
description: "Phase parent for the kebab-case filesystem-name migration of the system-code-graph surface. Eight independently reviewable child phases cover the MCP package boundary, scripts, references, runtime, feature catalog, manual playbook, release evidence, and the final subtree gate."
trigger_phrases:
  - "system-code-graph kebab-case migration"
  - "system-code-graph component migration"
  - "system-code-graph snake_case cleanup"
  - "system-code-graph naming phases"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the system-code-graph phase-parent map"
    next_safe_action: "Execute one child phase on the pinned migration worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The migration changes filesystem names only; code identifiers and data keys retain their established case."
      - "Python .py files and Python import-package directories remain snake_case exemptions."
      - "Each child phase owns its L2 plan, tasks, checklist, and any genuine decision record."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only. -->

# Feature Specification: system-code-graph component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Parent packet** | sk-doc/020-hyphen-naming-convention/008-component-migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph surface still exposes snake_case filesystem roots and content paths in its MCP package,
reference tree, feature catalog, and manual-testing playbook. Runtime path consumers, Markdown links, test discovery,
and release evidence must agree when those filesystem names follow the program's kebab-case convention; Python names,
tool-mandated names, generated output, lockfile names, and identifiers remain exempt.

### Purpose
Drive the system-code-graph surface to the program's kebab-case filesystem convention through eight bounded child
phases, each with its own evidence-pinned acceptance contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The MCP package root and permitted non-Python package-layout directories.
- Non-Python script filenames, reference files, runtime paths, feature-catalog paths, and manual-playbook paths.
- Every live path/link consumer inside the skill and in its launcher, plugin, configuration, test, and documentation
  closure.
- Changelog/version evidence and the final scope-aware subtree gate.

### Out of Scope
- Python .py filenames and Python import-package directories.
- Code identifiers, MCP tool IDs, JSON/YAML/TOML keys, frontmatter fields, generated output, lockfile filenames,
  tool-mandated names, test-magic names, and frozen changelog history.
- Migration work in other 032 component subtrees.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-mcp-server-dir-and-manifest-closure/ | Rename mcp_server and permitted direct package-layout directories; close manifest, launcher, build, test, plugin, and documentation paths atomically. | Planned |
| 002 | 002-scripts/ | Inventory non-Python script filenames, rename any remaining snake_case candidate, and close every sourcing, registry, fixture, and documentation reference. | Planned |
| 003 | 003-references/ | Rename the seven snake_case reference files and repair their links, path hints, and cross-references; prove assets/templates are classified. | Planned |
| 004 | 004-runtime/ | Audit the four-file runtime tree, conditionally rename any newly discovered in-scope candidate, and prove runtime hook/library paths remain resolvable. | Planned |
| 005 | 005-feature-catalog/ | Rename the feature_catalog root, eight category directories, and 19 catalog files; update catalog and cross-surface links without changing identifiers. | Planned |
| 006 | 006-manual-testing-playbook/ | Rename the manual_testing_playbook root, nine category directories, and 29 scenario/index files; preserve scenario contracts and coverage. | Planned |
| 007 | 007-changelog-verify/ | Verify that the changelog records the complete subtree rename set and matching version bump; perform no renames. | Planned |
| 008 | 008-skill-gate/ | Aggregate sibling evidence and prove the whole system-code-graph naming surface is clean within the exemption boundary. | Planned |

<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. The executor must resolve only the pinned candidate inventory and release-version evidence; no child may
broaden the program's exemption boundary or perform work owned by another 032 component subtree.
<!-- /ANCHOR:questions -->

