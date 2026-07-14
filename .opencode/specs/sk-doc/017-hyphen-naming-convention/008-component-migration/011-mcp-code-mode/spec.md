---
title: "Feature Specification: mcp-code-mode component migration (017)"
description: "The mcp-code-mode surface still contains snake_case directory, reference, asset, and manual-playbook names. This phase parent defines seven independent contracts that move permitted filesystem names to kebab-case while preserving Python names, tool-mandated names, generated history, and non-filesystem identifiers."
trigger_phrases:
  - "mcp-code-mode component migration"
  - "017 mcp code mode naming"
  - "kebab-case mcp-code-mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-code-mode phase map"
    next_safe_action: "Execute the first child phase on the pinned worktree"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; detailed plans, tasks, checklists, and decisions live in the children. -->

# Feature Specification: mcp-code-mode component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration |
| **Predecessor** | 010-system-code-graph |
| **Successor** | 012-sk-git |
| **Handoff Criteria** | All seven child contracts pass and the subtree gate proves the scoped naming surface is clean |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mcp-code-mode skill mixes snake_case filesystem names with the program's required kebab-case form. Its package directory, reference and asset files, manual-testing tree, and path-valued pointers must be handled as one documented surface, while Python files, Python package directories, tool-mandated names, generated output, frozen changelogs, and identifiers remain exempt.

This phase parent partitions that work into seven independently verifiable child phases: four rename/reference closures, one manual-playbook closure, a changelog verification phase, and a final subtree gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The filesystem names and active path references under .opencode/skills/mcp-code-mode.
- The mcp_server package directory, non-Python scripts, references/assets, runtime tree, and manual_testing_playbook tree.
- Changelog/version evidence and the final exemption-aware subtree census.

### Out of Scope
- Python .py filenames and Python import-package directories.
- Code identifiers, JSON/YAML/TOML keys, frontmatter field names, tool names, generated or lockfile content, and frozen changelog history.
- Any other skill surface or the execution of the migration during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-mcp-server-dir-and-manifest-closure/ | Rename mcp_server where permitted and close manifest, launcher, and entrypoint path references atomically | Planned |
| 002 | 002-scripts/ | Audit script filenames, rename eligible non-Python names, and update sourcing/import/registry references | Planned |
| 003 | 003-references-and-assets/ | Rename naming_convention.md, tool_catalog.md, config_template.md, and env_template.md with link closure | Planned |
| 004 | 004-runtime/ | Audit the runtime tree for permitted snake_case names and close any runtime path references | Planned |
| 005 | 005-manual-testing-playbook/ | Rename the manual-testing root, eight category directories, index, and 27 scenario files with link closure | Planned |
| 006 | 006-changelog-verify/ | Verify the changelog entry and version bump describe the completed rename set; perform no renames | Planned |
| 007 | 007-skill-gate/ | Aggregate sibling evidence and prove the complete mcp-code-mode surface is kebab-clean within the exemption boundary | Planned |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. Execution must use the program-level exemption set and the exact live-tree inventory recorded by each child checklist.
<!-- /ANCHOR:questions -->
