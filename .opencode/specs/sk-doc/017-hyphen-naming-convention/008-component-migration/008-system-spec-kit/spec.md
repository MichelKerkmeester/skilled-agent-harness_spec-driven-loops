---
title: "Feature Specification: system-spec-kit component migration"
description: "Lean phase parent for the kebab-case filesystem-name work across the system-spec-kit MCP surface, scripts, templates, references/assets, shared/runtime paths, feature catalog, manual testing playbook, verification evidence, and final subtree gate."
trigger_phrases:
  - "system-spec-kit naming phases"
  - "system-spec-kit kebab-case migration"
  - "017 system-spec-kit component migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored system-spec-kit phase map"
    next_safe_action: "Resume the selected system-spec-kit child phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/"
      - ".opencode/skills/system-spec-kit/scripts/"
      - ".opencode/skills/system-spec-kit/templates/"
      - ".opencode/skills/system-spec-kit/references/"
      - ".opencode/skills/system-spec-kit/feature_catalog/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Kebab-case is the canonical form for in-scope filesystem names; Python .py files and Python package directories remain exempt."
      - "Tool-mandated names, generated/lockfile/vector/checkpoint artifacts, test magic, identifiers/keys, and frozen history remain outside rename scope."
      - "Each child owns its path and reference closure; phases 010 and 011 verify evidence, and phase 012 is the rollup gate."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed plans, tasks, checklists, and decisions live in the children. -->

# Feature Specification: system-spec-kit component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Parent packet** | sk-doc/017-hyphen-naming-convention/008-component-migration |
| **Child Count** | 12 |
| **Handoff Criteria** | All child scopes, path maps, and blocking checklist contracts are authored |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The system-spec-kit surface spans an MCP package boundary, scripts, templates and examples, reference/assets, shared/runtime support, feature-catalog content, manual-testing scenarios, and adjacent verification surfaces. Its in-scope filesystem names must follow the 017 kebab-case convention while Python targets, tool-mandated names, generated artifacts, data identifiers, and frozen history remain protected.

This parent organizes twelve bounded child phases so each path family can inventory its actual baseline names, update its own references, and provide evidence to the final subtree gate. The child documents own all implementation detail.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `mcp_server` package boundary, its permitted inner directories, and consumer/reference closure.
- Non-Python script filenames, templates/examples, reference/assets, shared/runtime paths, feature-catalog paths, and manual-testing-playbook paths.
- Verification of the runtime agent/config/checkpoint/vector/constitutional surfaces, changelog/version evidence, and the final scope-aware skill gate.

### Out of Scope
- Migration execution during this documentation-authoring pass.
- Python `.py` files and Python import-package directories; `SKILL.md`, `mode-registry.json`, package manifests, and other tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, database values, generated/lockfile/vector/checkpoint artifacts, test magic, frozen history, and other 017 exemptions.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This parent is intentionally lean. Each child folder owns its L2 spec, plan, tasks, blocking checklist, optional decision record, and continuity.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-mcp-server-dir-and-manifest-closure/` | Rename the MCP package root and permitted manifest/package-layout directories; close manifest and entrypoint references atomically. | Planned |
| 002 | `002-mcp-server-inner-dirs/` | Rename permitted snake_case inner directories under the MCP tree and update intra-tree references while protecting Python boundaries. | Planned |
| 003 | `003-mcp-server-consumer-rewrites/` | Rewrite every consumer, import, config, registry, and documentation reference to the renamed MCP paths without renaming exempt Python targets. | Planned |
| 004 | `004-scripts-tree/` | Rename non-Python snake_case script filenames and update sourcing, imports, registry entries, and script references. | Planned |
| 005 | `005-templates-and-examples/` | Rename permitted template/example directories and files and update renderer, manifest, and example pointers. | Planned |
| 006 | `006-references-and-assets/` | Rename permitted reference, asset, MCP-document, and curated benchmark-document files and update every link and path pointer. | Planned |
| 007 | `007-shared-and-runtime/` | Rename permitted shared/runtime filesystem names and update references while preserving tool-mandated names and Python boundaries. | Planned |
| 008 | `008-feature-catalog/` | Rename the feature-catalog root, category directories, and catalog files and close catalog indexes and path metadata. | Planned |
| 009 | `009-manual-testing-playbook/` | Rename the manual-testing-playbook root, category directories, and scenario/support files and close playbook navigation. | Planned |
| 010 | `010-config-checkpoints-vectors-constitutional-verify/` | Verify the runtime agent directories and adjacent support surfaces; record the zero-candidate agent result and exemption classifications. | Planned |
| 011 | `011-changelog-verify/` | Verify changelog coverage for phases 001-010, the exemption boundary, and a coherent version bump; perform no renames. | Planned |
| 012 | `012-skill-gate/` | Aggregate phases 001-011 and verify the complete system-spec-kit naming surface is kebab-clean within the exemption boundary. | Planned |

<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

No blocking questions. Execution must pin the candidate/base inventory and release-version evidence; each child must remain within its documented path family and the program exemption set.
<!-- /ANCHOR:questions -->

