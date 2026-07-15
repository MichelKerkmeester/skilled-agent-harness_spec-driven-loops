---
title: "Feature Specification: system-skill-advisor component migration"
description: "Phase parent for the kebab-case filesystem-name migration of the system-skill-advisor surface. Eight independently reviewable child phases cover the MCP package boundary, scripts, references, hooks, feature catalog, manual playbook, release evidence, and the final subtree gate."
trigger_phrases:
  - "system-skill-advisor kebab-case migration"
  - "system-skill-advisor component migration"
  - "advisor surface snake_case cleanup"
  - "system-skill-advisor naming phases"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the lean system-skill-advisor phase-parent map"
    next_safe_action: "Execute one child phase on the pinned migration worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The migration changes filesystem names only; code identifiers and data keys retain their established case."
      - "Python .py files and Python import-package directories remain snake_case exemptions."
      - "Each child phase owns its own L2 plan, tasks, checklist, and any genuine decision record."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only. -->

# Feature Specification: system-skill-advisor component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Parent packet** | sk-doc/019-hyphen-naming-convention/008-component-migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-skill-advisor surface contains several independent filesystem-name groups that still use snake_case:
the mcp_server package boundary, the script regression fixture, reference documents, the feature-catalog tree,
and the manual-testing-playbook tree. Runtime paths, links, registries, and release evidence must agree after those
names become kebab-case, while Python filenames, Python package directories, tool-mandated names, and code/data
identifiers remain unchanged.

### Purpose
Drive the system-skill-advisor surface to the program's kebab-case filesystem convention through eight bounded child
phases, each with its own evidence-pinned acceptance contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mcp_server package boundary and permitted non-Python package-layout directories.
- Non-Python script filenames and every path/reference that resolves to them.
- Reference files, hook registrations, feature-catalog files/directories, and manual-playbook files/directories.
- Changelog evidence and the final scope-aware subtree gate.

### Out of Scope
- Python .py filenames and Python import-package directories.
- Code identifiers, MCP tool IDs, JSON/YAML/TOML keys, frontmatter fields, generated output, lockfile filenames,
  and tool-mandated names.
- Migration work in other 017 component subtrees.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-mcp-server-dir-and-manifest-closure/ | Rename the MCP package root and permitted package-layout directories; close manifest and entrypoint references atomically. | Planned |
| 002 | 002-scripts/ | Rename non-Python script filenames and update their sourcing, registry, fixture, and documentation references. | Planned |
| 003 | 003-references/ | Rename snake_case reference files and repair every link and path pointer to them. | Planned |
| 004 | 004-hooks/ | Audit hook filenames, repair stale registrations, and rename any non-mandated snake_case hook file found in the pinned baseline. | Planned |
| 005 | 005-feature-catalog/ | Rename the feature-catalog root, category directories, and catalog files; update links without changing content identifiers. | Planned |
| 006 | 006-manual-testing-playbook/ | Rename the manual-playbook root, category directories, and scenario files; update links while preserving scenario contracts. | Planned |
| 007 | 007-changelog-verify/ | Verify the changelog records this subtree's rename set and the matching skill version bump; perform no renames. | Planned |
| 008 | 008-skill-gate/ | Aggregate sibling evidence and prove the whole system-skill-advisor naming surface is clean within the exemption boundary. | Planned |

<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. The executor must resolve only the concrete candidate inventory and release-version evidence against the
pinned BASE SHA; no child may broaden the program's exemption boundary.
<!-- /ANCHOR:questions -->
