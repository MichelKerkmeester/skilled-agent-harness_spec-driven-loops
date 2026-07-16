---
title: "Checklist: MCP-server directory and manifest closure (032 subtree 008 phase 001)"
description: "The system-spec-kit workspace still exposes mcp_server as a filesystem path even though kebab-case is canonical. The package workspace, lockfile links, package scripts, and entrypoint references must move as one path closure while manifest filenames, package names, Python files, and Python package directories remain exempt."
trigger_phrases:
  - "mcp-server directory closure"
  - "system-spec-kit mcp server manifest"
  - "mcp_server to mcp-server"
  - "kebab-case phase 001"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the root closure on the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: MCP-server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 000 baseline and the isolated worktree are pinned before the package closure is touched.
- [ ] CHK-002 [P2] Candidate report records BASE SHA and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Only package-root path closure files change; no inner-directory or consumer cleanup is mixed in.
- [ ] CHK-004 [P0] Package filenames, package name, Python targets, and code/data identifiers are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Semantic map contains exactly mcp_server -> mcp-server and no collision.
- [ ] CHK-006 [P0] package-lock.json workspaces, package keys, link targets, and file links resolve through mcp-server.
- [ ] CHK-007 [P0] Package entrypoints and build path values resolve after the rename.
- [ ] CHK-008 [P1] Full old-path search is dispositioned as path, identifier, historical, or exempt.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Package-local manifest closure and root README entrypoint paths are updated together.
- [ ] CHK-010 [P1] Changed-path manifest proves the root rename is atomic and no stray old root remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Executable bits, symlinks, and package launch boundaries are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Phase report records exact manifest paths and handoff to phase 002.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Rename lands as a path-scoped dependency-closed unit with no edits outside the assigned subtree during authoring.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the root rename, manifest closure, entrypoint resolution, exemption audit, and clean handoff all have evidence pinned to the candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the package path closure and no unresolved mcp_server filesystem reference remains in the closure.
<!-- /ANCHOR:sign-off -->
