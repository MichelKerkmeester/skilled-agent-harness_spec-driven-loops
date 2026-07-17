---
title: "Implementation Plan: MCP-server directory and manifest closure (032 subtree 008 phase 001)"
description: "The system-spec-kit workspace still exposes mcp_server as a filesystem path even though kebab-case is canonical. The package workspace, lockfile links, package scripts, and entrypoint references must move as one path closure while manifest filenames, package names, Python files, and Python package directories remain exempt."
trigger_phrases:
  - "mcp-server directory closure"
  - "system-spec-kit mcp server manifest"
  - "mcp_server to mcp-server"
  - "kebab-case phase 001"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned mcp-server closure execution"
    next_safe_action: "Execute the root closure on the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: MCP-server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (MCP-server directory and manifest closure) |
| **Change class** | Runtime/package layout and manifest closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Treat the package root, workspace declarations, package-local path scripts, and lockfile links as one semantic rename unit. The source-to-target map changes only the filesystem segment and path-valued references; package names, manifest filenames, code identifiers, and exempt Python targets remain unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The pinned BASE contains exactly one live package root at mcp_server.
- [ ] The manifest and lockfile reference inventory is captured with line numbers.
- [ ] Collision, symlink, executable-bit, and package-name dispositions are recorded.

### Definition of Done
- [ ] The root rename map is bijective and all package path values use mcp-server.
- [ ] The package manifest closure and entrypoint references are internally consistent.
- [ ] The verifier proves no exempt filename or identifier changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use a semantic map entry mcp_server -> mcp-server, then apply it to path-valued workspace and entrypoint references.
- Keep package.json, package-lock.json, tsconfig.json, and vitest config as exact tool-facing filenames.
- Validate the closure from the workspace root through npm metadata, package scripts, and dist entrypoints before handing off inner-directory work.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase 000 baseline and the current package-lock.json are available in the isolated worktree.
- Inventory mcp_server references in package.json, package-lock.json, tsconfig files, README entrypoints, and build scripts.

### Phase 2: Implementation
- Create the root-only source-to-target map and run exact, case-fold, and NFC collision checks before any rename.
- Rename the package root and update workspace arrays, package keys, link targets, and package-local path values atomically.
- Reconcile dist-freshness, build, start, test, and workspace references without changing package names or manifest filenames.

### Phase 3: Verification
- Resolve the workspace package from mcp-server and confirm no stale path remains in the manifest closure.
- Run package metadata and entrypoint checks, then compare the changed-path manifest against the exemption list.
- Record the map hash and clean handoff evidence for phase 002.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Map audit plus collision report shows one mcp_server source and one mcp-server target. |
| REQ-002 | Parse package-lock.json and package.json; assert workspace and file-link path values resolve to the new root. |
| REQ-003 | Run package entrypoint and build-resolution checks in the central worktree. |
| REQ-004 | Compare changed names against package, Python, identifier, and key exemptions. |
| REQ-005 | Inspect the phase report and phase-map handoff record. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pinned BASE and phase 000 census | Internal | Required | Without the baseline, collision and clean-install evidence is not comparable. |
| npm workspace metadata | Internal | Required | Stale paths prevent package resolution or install parity. |
| Phase 002 inner-directory map | Internal | Downstream | The package root must be stable before inner paths are rewritten. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop before deleting the old root if collision or package-resolution checks fail. Revert the path-scoped commit or restore the source-to-target map in the isolated worktree; no generated dependency tree or external install is part of this authoring pass.
<!-- /ANCHOR:rollback -->
