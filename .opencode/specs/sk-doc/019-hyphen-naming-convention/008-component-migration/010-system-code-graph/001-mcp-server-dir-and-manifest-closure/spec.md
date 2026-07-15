---
title: "Feature Specification: system-code-graph MCP server directory and manifest closure"
description: "Rename the system-code-graph MCP package root and permitted non-Python direct layout directories to kebab-case, then update the launcher, CLI, build, test, plugin, configuration, and documentation path closure atomically."
trigger_phrases:
  - "system-code-graph mcp-server directory"
  - "code graph package root rename"
  - "mcp-server manifest closure"
  - "plugin-bridges stress-test rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored MCP package-boundary docs"
    next_safe_action: "Execute package-boundary rename on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server"
      - ".opencode/skills/system-code-graph/tsconfig.json"
      - ".opencode/skills/system-code-graph/vitest.config.ts"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/code-index.cjs"
      - ".opencode/plugins/mk-code-graph.js"
      - ".opencode/skills/system-code-graph/package-lock.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current non-Python package-boundary candidates are mcp_server, plugin_bridges, and stress_test."
      - "The visible package root has package-lock.json but no package.json; the executor must record that state and must not invent a manifest."
      - "package-lock.json, generated dist/node_modules output, test-magic directories, Python names, and tool identifiers are preserved."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph MCP server directory and manifest closure

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph runtime is rooted at mcp_server/, with plugin_bridges/ and stress_test/ as ordinary direct
non-Python package-layout directories. The TypeScript compiler and Vitest configuration, stable launcher and CLI shim,
runtime configs, plugin bridge, hooks, tests, and guides all refer to that layout. A root-only move would strand those
consumers, while renaming test-magic or generated paths would break tool contracts.

### Purpose
Move the permitted MCP package-boundary names to kebab-case and update the complete live path closure in one
dependency-closed change, while preserving Python, generated, lockfile, test-magic, and tool-mandated names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename .opencode/skills/system-code-graph/mcp_server/ to mcp-server/.
- Rename mcp_server/plugin_bridges/ to plugin-bridges/ and mcp_server/stress_test/ to stress-test/.
- Update path-valued references in tsconfig.json, vitest.config.ts, code-index-cli.ts, core/config.ts, launchers,
  CLI shims, runtime configs, plugin bridges, git-hook/worktree helpers, tests, and package guides.
- Reconcile the package-root contract represented by package-lock.json without renaming the lockfile or hand-editing
  generated dependency output.

### Out of Scope
- .py files, Python import-package directories, node_modules/, dist/, SQLite/runtime state, and generated output.
- package-lock.json, tsconfig.json, vitest.config.ts, .gitkeep, and test-magic directories such as tests/__fixtures__/
  as rename targets unless their owner contract explicitly permits it.
- The scripts, references, runtime, feature-catalog, and manual-playbook filesystem names owned by phases 002–006;
  their direct path consumers are updated only when required to close this package-root path.
- MCP tool IDs, server names, config keys, code identifiers, JSON/YAML/TOML keys, and frontmatter fields.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/mcp_server/ | Rename | Package root to mcp-server/ |
| .opencode/skills/system-code-graph/mcp_server/plugin_bridges/ | Rename | Permitted direct directory to plugin-bridges/ |
| .opencode/skills/system-code-graph/mcp_server/stress_test/ | Rename | Permitted direct directory to stress-test/ |
| .opencode/skills/system-code-graph/tsconfig.json | Modify | Update root, output, include, and exclude path values |
| .opencode/skills/system-code-graph/vitest.config.ts | Modify | Update package and stress-test discovery paths |
| .opencode/bin/{mk-code-index-launcher.cjs,code-index.cjs} | Modify | Update launcher and compiled-entrypoint paths |
| .opencode/plugins/{mk-code-graph.js,tests/mk-code-graph.test.cjs} | Modify | Update plugin bridge and package probes |
| opencode.json, .claude/mcp.json, git-hook/worktree helpers | Modify | Update database, dist, and package-root path values |
| .opencode/skills/system-code-graph/{README,INSTALL_GUIDE,ARCHITECTURE,SKILL}.md | Modify | Repair package topology and operator paths |
| .opencode/skills/system-code-graph/package-lock.json | Verify only | Preserve the lockfile name and package-manager-owned dependency output |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The package-root rename is complete | The inventory contains exactly one live mcp-server/ package root and no permitted mcp_server/ root remains. |
| REQ-002 | Permitted direct package-layout directories use kebab-case | plugin-bridges/ and stress-test/ exist, while preserved test-magic and generated directories have recorded owner-contract reasons. |
| REQ-003 | The manifest and entrypoint closure is atomic | Launchers, CLI shims, TypeScript/Vitest paths, runtime configs, plugin bridge references, tests, and documentation resolve the same target root in one candidate diff. |
| REQ-004 | Exemptions remain intact | No Python filename/package directory, lockfile filename, generated output, test-magic name, code identifier, data key, or tool-mandated name changes as a side effect. |
| REQ-005 | Runtime behavior remains discoverable | Typecheck/build, package entrypoint, launcher/CLI smoke, plugin bridge smoke, and Vitest discovery complete against the renamed root with BASE counts. |
| REQ-006 | File metadata is preserved | Symlink targets, symlink mode, executable bits, and ordinary file permissions are unchanged except for the path rename. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The code-graph package has one kebab-case root and no stale live references to the old package root.
- **SC-002**: The compiler, test runner, launcher, CLI, runtime configuration, plugin bridge, and documentation agree
  on the same layout.
- **SC-003**: All program exemptions are proven by an evidence-pinned rename map and runtime checks.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External launcher, CLI, plugin, and hook consumers | A missed path can make the server appear uninstalled or stale | Scan the repository-wide consumer set before the rename and smoke every stable entrypoint after it. |
| Risk | Generated dist or lockfile content is treated as source | Hand edits can be overwritten or create false-green builds | Preserve generated/tool-managed output and rebuild from the renamed source root. |
| Risk | Test-magic directories are renamed as ordinary names | Vitest discovery or fixtures can silently disappear | Classify each magic directory against the actual runner configuration before acting. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record the package-manifest state at the pinned BASE before changing path
references; the current visible surface has package-lock.json but no package.json, and the phase must not invent one.
<!-- /ANCHOR:questions -->

