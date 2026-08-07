---
title: "Implementation Plan: mcp-server directory and manifest closure (020 component 011 phase 001)"
description: "Rename the embedded mcp_server directory to mcp-server through a semantic, dependency-closed path map. Update installer, doctor, guide, metadata, and entrypoint references together while leaving Python, lockfile, tool-mandated, and package identifier contracts intact."
trigger_phrases:
  - "mcp-server closure implementation plan"
  - "mcp-code-mode phase 001 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-server closure plan"
    next_safe_action: "Execute the semantic package path map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | mcp-code-mode/mcp_server and its active path consumers |
| **Change class** | Directory rename and package/entrypoint reference closure |
| **Execution** | Isolated worktree pinned to BASE; no migration is executed by this authoring pass |

### Overview
The package directory is the only eligible snake_case filesystem name in the current mcp-code-mode package subtree. The plan maps mcp_server to mcp-server, inventories every path consumer, and proves the Node package and dist/index.js entrypoint still resolve through the new directory.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The BASE worktree and package subtree inventory are recorded
- [ ] The semantic map contains mcp_server → mcp-server and no unresolved candidate
- [ ] Active consumers and frozen/exempt references are classified
- [ ] The package/entrypoint closure is listed before the rename

### Definition of Done
- [ ] The directory and all active path consumers use mcp-server
- [ ] Package, lockfile, tool-mandated, Python, and identifier contracts are preserved
- [ ] Reference and runtime checks pass with evidence pinned to the candidate
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A semantic one-entry path map: mcp_server → mcp-server.
- A consumer closure covering scripts/install.sh, scripts/doctor.sh, INSTALL_GUIDE.md, graph-metadata.json, configured MCP commands, package working directories, and dist/index.js references.
- A preservation ledger for package-lock.json, tsconfig.json, .nvmrc, index.ts, scripts/check-node.cjs, Python paths, package identifiers, and frozen changelog references.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the pinned BASE, record the package tree, and freeze the one-entry semantic map.
- Search active files for mcp_server path segments and classify each hit as a path, identifier, generated value, or frozen history.

### Phase 2: Implementation
- Rename the package directory from mcp_server to mcp-server.
- Update installer, doctor, guide, metadata, command, and entrypoint path values in the same dependency-closed change.
- Preserve package-lock.json and tool-mandated filenames and do not alter package identifiers or Python paths.

### Phase 3: Verification
- Re-scan active files for stale mcp_server path segments.
- Prove the configured command, npm working directory, diagnostic path, and dist/index.js path use mcp-server.
- Run the package-specific syntax/reference checks and record the candidate SHA, BASE SHA, and map hash.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Path census and exemption ledger list every package-tree name |
| REQ-002 | Rename map and collision check show exactly one mcp_server → mcp-server entry |
| REQ-003 | Whole-surface reference scan has no stale active mcp_server path |
| REQ-004 | Installer, doctor, configuration, and entrypoint path checks resolve under mcp-server |
| REQ-005 | Diff review proves no Python, lockfile, tool-mandated, identifier, or frozen-history rewrite |
| REQ-006 | Candidate report contains the map hash, consumer inventory, commands, and exit codes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the 020 immutable baseline, exemption policy in 001-convention-policy-and-scope, the semantic rename/reference tooling, and a real Node environment for package-path checks. Phase 002 starts only after this package closure is internally consistent.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore the mcp_server directory name and reverse the recorded path map in one path-scoped revert. Re-run the reference scan and package-path checks against the restored map; no package data or generated dependency contents are changed by the planned closure.
<!-- /ANCHOR:rollback -->
