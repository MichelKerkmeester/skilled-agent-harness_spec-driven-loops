---
title: "Implementation Plan: system-code-graph MCP server directory and manifest closure"
description: "Use an explicit package-boundary rename map, update the code-graph path consumers as one dependency-closed change, preserve Python/tool/generated/test exemptions, and verify the renamed package through build, launcher, plugin, and discovery checks."
trigger_phrases:
  - "system-code-graph mcp-server implementation plan"
  - "code graph package root rename plan"
  - "mcp-server entrypoint closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored package-boundary plan"
    next_safe_action: "Freeze package-boundary map on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server"
      - ".opencode/skills/system-code-graph/tsconfig.json"
      - ".opencode/skills/system-code-graph/vitest.config.ts"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/code-index.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current visible package root has package-lock.json but no package.json; no manifest is synthesized by this phase."
      - "The direct package-layout rename targets are mcp_server, plugin_bridges, and stress_test; tests/__fixtures__ remains classified as test magic."
---

# Implementation Plan: system-code-graph MCP server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/Node MCP runtime with shell and CommonJS launchers |
| **Framework** | MCP transport, TypeScript compiler, Vitest |
| **Storage** | Package-local SQLite database and generated dist output |
| **Testing** | Typecheck/build, launcher/CLI smoke, plugin smoke, Vitest discovery |

### Overview
Create a semantic map for mcp_server/, plugin_bridges/, and stress_test/, then apply the path rename together with
every live launcher, CLI, compiler, test, plugin, configuration, and documentation reference. Preserve the lockfile
and generated output contracts; record the visible absence of package.json instead of creating one.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Pinned BASE SHA and package-boundary inventory are recorded.
- [ ] Package-lock, TypeScript/Vitest configuration, launcher, CLI, plugin, and runtime-config consumers are identified.
- [ ] Each underscore-bearing directory is classified as rename, test-magic, generated, Python/package exemption, or
  tool-mandated.

### Definition of Done
- [ ] The package root and permitted direct directories have one-to-one kebab targets.
- [ ] All live path consumers resolve the same new root.
- [ ] Build, launcher, CLI, plugin, and discovery checks pass with BASE counts.
- [ ] No generated, Python, identifier, data-key, lockfile, or tool-mandated name was changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed filesystem rename with an explicit source-to-target map.

### Key Components
- Package root: owns the MCP server, CLI, handlers, libraries, tests, stress tests, tools, and package-local database.
- Path consumers: TypeScript/Vitest configuration, stable launchers, CLI shim, runtime configs, plugin bridge,
  worktree/git-hook helpers, tests, guides, and topology docs.
- Preserved boundaries: package-lock/tool names, generated dist/node_modules, test magic, Python names, and runtime
  identifiers.

### Data Flow
The stable launcher and CLI resolve the skill directory, then the package root, then the built entrypoint. The plugin
bridge, runtime configs, and tests resolve package-local paths. The rename map changes filesystem path segments only,
so MCP tool IDs, config keys, server identity, and source-module behavior continue unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the direct directory/file inventory, package-lock state, and explicit absence/presence of package.json.
- [ ] Search package-root, database, dist, bridge, stress, launcher, CLI, configuration, hook, test, and documentation references.
- [ ] Freeze the semantic map, collision report, symlink/mode manifest, and BASE discovery counts.

### Phase 2: Implementation
- [ ] Rename mcp_server to mcp-server, plugin_bridges to plugin-bridges, and stress_test to stress-test.
- [ ] Update TypeScript/Vitest path values, source path construction, launchers, CLI shim, runtime configs, plugin bridge,
  tests, git/worktree helpers, guides, and topology docs.
- [ ] Preserve package-lock.json, dist, node_modules, tests/__fixtures__, Python names, and identifiers under their
  owner contracts.
- [ ] Rebuild generated output through the package workflow after source paths are stable.

### Phase 3: Verification
- [ ] Confirm one physical package root and no stale live mcp_server path consumer.
- [ ] Run typecheck/build, launcher/CLI smoke, plugin smoke, and ordinary/stress Vitest discovery.
- [ ] Compare file, symlink, executable-bit, test, and discovery counts to BASE.
- [ ] Record package-map and entrypoint evidence for the scripts phase.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Candidate classification and old/new path closure | rg, filesystem manifest, rename-map checker |
| Build | TypeScript sources and compiled package entrypoint | TypeScript build/typecheck from the skill root |
| Integration | Stable launcher, CLI shim, runtime config, plugin bridge | launcher/CLI and plugin smoke checks |
| Discovery | Ordinary and stress Vitest suites | Vitest config with BASE discovery-count comparison |
| Metadata | Symlink and executable-bit preservation | git mode/symlink manifest comparison |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 000 BASE/worktree | Internal | Required | No trustworthy package map or parity baseline |
| Node dependency install | Internal | Required | Build and launcher results are not meaningful |
| Stable launcher and CLI consumers | Internal | Required | Installed runtime can remain broken despite local tests |
| Plugin and hook path closure | Internal | Required | Prompt-time and plugin callers can retain stale paths |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, missing consumer, build/discovery regression, metadata drift, or package-manifest inconsistency.
- **Procedure**: Stop before committing the candidate, restore the path map from pinned BASE in the isolated worktree,
  discard regenerated output, and rerun the inventory. Do not repair a failed package-root move by adding an
  unapproved compatibility alias or synthesizing a missing package manifest.
<!-- /ANCHOR:rollback -->

