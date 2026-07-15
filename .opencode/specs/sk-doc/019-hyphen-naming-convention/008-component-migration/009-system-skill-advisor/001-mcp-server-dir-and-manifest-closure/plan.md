---
title: "Implementation Plan: MCP server directory and manifest closure"
description: "Use an explicit package-boundary rename map, update the advisor's path consumers as one dependency-closed change, preserve tool and Python exemptions, and verify the renamed package through build, launcher, bridge, and discovery checks."
trigger_phrases:
  - "mcp-server directory implementation plan"
  - "advisor manifest closure plan"
  - "package root rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the package-boundary implementation plan"
    next_safe_action: "Build the candidate map from the pinned BASE inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server"
      - ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The package manifest state must be recorded before execution because package.json is not present in the current visible surface."
      - "The checked-in lockfile and test-magic names are preserved unless the tool contract proves otherwise."
---

# Implementation Plan: MCP server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/Node runtime with Python compatibility scripts |
| **Framework** | MCP transport, Vitest, TypeScript build |
| **Storage** | Package-local SQLite and generated dist output |
| **Testing** | Typecheck/build, launcher smoke, plugin bridge smoke, Vitest discovery |

### Overview
Create a semantic map for the MCP package root and its ordinary non-Python direct directories, then apply the path
rename together with every live manifest, launcher, configuration, documentation, and test-discovery reference. The
package-lock.json and generated output remain tool-managed; the plan records their contract and verifies them through a
fresh build instead of hand-editing generated data.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Pinned BASE SHA and package-boundary inventory are recorded.
- [ ] The package manifest state, lockfile, launcher, and doctor consumers are identified.
- [ ] Each underscore-bearing directory is classified as rename, Python/package exemption, tool-mandated, or generated.

### Definition of Done
- [ ] The package root and permitted direct directories have one-to-one kebab targets.
- [ ] All live path consumers resolve the same target root.
- [ ] Build, launcher, bridge, and discovery checks pass with BASE counts.
- [ ] No generated, Python, identifier, or tool-mandated name was changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed filesystem rename with an explicit source-to-target map.

### Key Components
- Package root: owns the MCP server, CLI, tests, scripts, and package-local database.
- Path consumers: launcher, doctor assets, TypeScript path construction, build config, docs, and plugin bridge.
- Preserved boundaries: lockfile/tool names, generated dist/node_modules, Python scripts/packages, and test magic.

### Data Flow
The stable launcher and doctor route resolve the skill directory, then the package root, then the built entrypoint.
The plugin bridge and tests resolve package-local bridge/stress paths. The rename map changes only filesystem path
segments, so MCP tool IDs and runtime behavior continue through the same source modules.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the direct directory/file inventory and the package manifest/lockfile state.
- [ ] Search all package-root, bridge, stress, dist, launcher, and doctor references.
- [ ] Freeze the semantic map and collision/metadata report before moving anything.

### Phase 2: Implementation
- [ ] Rename mcp_server to mcp-server and ordinary direct package-layout directories to their kebab targets.
- [ ] Update path-valued consumers, TypeScript include/exclude paths, launchers, doctor probes, docs, and tests.
- [ ] Leave package-lock.json, generated output, Python names, and test-magic names under their approved contracts.
- [ ] Rebuild generated output through the package workflow after source paths are stable.

### Phase 3: Verification
- [ ] Confirm one physical package root and no stale live old-root reference.
- [ ] Run typecheck/build, launcher/doctor probes, plugin bridge smoke, and stress-test discovery.
- [ ] Compare file, test, symlink, executable-bit, and discovery counts to BASE.
- [ ] Record the handoff map and evidence for the scripts phase.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Candidate classification and old/new path closure | rg, filesystem manifest, rename-map checker |
| Build | TypeScript sources and package entrypoint | npm typecheck/build from the renamed package root |
| Integration | Stable launcher, doctor route, plugin bridge | launcher/doctor smoke and bridge test |
| Discovery | Stress and ordinary Vitest suites | Vitest configs with BASE discovery-count comparison |
| Metadata | Symlink and executable-bit preservation | git mode/symlink manifest comparison |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 000 BASE/worktree | Internal | Required | No trustworthy rename map or parity baseline |
| Root-name consumer contract | Internal | Required | Runtime readers may reject the new package path |
| Node dependency install | Internal | Required | Build and launcher results are not meaningful |
| Doctor/launcher consumers | Internal | Required | Installed runtime can remain broken despite local tests |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, missing consumer, build/discovery regression, or metadata drift.
- **Procedure**: Stop before committing the candidate, restore the path map from the pinned BASE in the isolated
  worktree, discard regenerated output, and re-run the inventory. Do not repair a failed package-root move by adding
  compatibility aliases outside the approved root-consumer policy.
<!-- /ANCHOR:rollback -->
