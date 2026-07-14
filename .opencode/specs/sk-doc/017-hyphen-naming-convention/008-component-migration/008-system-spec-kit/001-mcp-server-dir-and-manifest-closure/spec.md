---
title: "Feature Specification: MCP-server directory and manifest closure (017 subtree 008 phase 001)"
description: "The system-spec-kit workspace still exposes mcp_server as a filesystem path even though kebab-case is canonical. The package workspace, lockfile links, package scripts, and entrypoint references must move as one path closure while manifest filenames, package names, Python files, and Python package directories remain exempt."
trigger_phrases:
  - "mcp-server directory closure"
  - "system-spec-kit mcp server manifest"
  - "mcp_server to mcp-server"
  - "kebab-case phase 001"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-server closure docs"
    next_safe_action: "Execute the root closure on the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: MCP-server directory and manifest closure

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor None; successor 002-mcp-server-inner-dirs.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 001 of the 008 system-spec-kit component migration under the 017 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The TypeScript MCP package is rooted at .opencode/skills/system-spec-kit/mcp_server, and the workspace lockfile records that exact directory in workspaces, package entries, and file links. A partial rename would leave npm resolution, prepare-build paths, or entrypoint documentation pointing at a directory that no longer exists.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename .opencode/skills/system-spec-kit/mcp_server/ to mcp-server/ as the package root.
- Update path-bearing workspace and manifest references in package-lock.json and mcp_server/package.json in the same dependency closure.
- Update package-local build, start, test, and dist-freshness entrypoint paths where they contain the old directory segment.
- Preserve package.json, package-lock.json, tsconfig.json, vitest config filenames, the @spec-kit/mcp-server package name, and all .py files and Python package directories exactly.

### Out of Scope
- Inner directory renames such as matrix_runners, plugin_bridges, and stress_test; phase 002 owns those semantic mappings.
- Consumer rewrites outside the package and workspace closure; phase 003 owns the repository-wide reference sweep.
- Any migration execution in this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The package root is mapped from mcp_server to mcp-server without a second physical root. | The rename map has one source and one target, and preflight has no exact, case-fold, or Unicode collision. |
| REQ-002 | The npm workspace and lockfile path closure is updated atomically. | workspaces, package keys, link targets, and file:../mcp_server values resolve to mcp-server after the planned rename. |
| REQ-003 | Package entrypoints retain their existing behavior and basenames. | context-server, spec-kit-cli, spec-memory, build, start, and test commands resolve through the renamed root. |
| REQ-004 | Exemption boundaries are preserved. | No manifest filename, package name, Python file, Python package directory, code identifier, or data key is renamed. |
| REQ-005 | The phase leaves an evidence-pinned handoff for phase 002. | The report records the map, affected manifest paths, collision scan, and clean handoff path. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The mcp-server package resolves from the new workspace path with no stale mcp_server path in the manifest closure.
- **SC-002**: All package entrypoint path values agree with the renamed directory and preserve existing executable names.
- **SC-003**: The central verifier can replay the map and prove the exemption set was not touched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The lockfile is generated data but also contains workspace path values required for reproducible installation. The plan changes path values only as a consequence of the package-root rename and never renames the lockfile itself. A second risk is that a path string can look like an identifier; the reference scan must distinguish filesystem paths from package names and object keys.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. Execution must confirm the exact lockfile entries and preserve the package name @spec-kit/mcp-server.
<!-- /ANCHOR:questions -->
