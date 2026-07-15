---
title: "Checklist: mcp-server directory and manifest closure (017 component 011 phase 001)"
description: "Blocking SOL verifier contract for the mcp_server to mcp-server directory and package-path closure."
trigger_phrases:
  - "mcp-server closure checklist"
  - "mcp-code-mode phase 001 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-server verifier contract"
    next_safe_action: "Run the closure verifier after execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is checked before the candidate commit
lands; the report pins the candidate SHA, BASE SHA, and rename-map hash, records commands and exit codes, and fails on
unexpected tracked mutation or an unclassified package-path reference.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned BASE worktree and package-tree census are recorded, with the isolated index confirmed
- [ ] CHK-002 [P2] The BASE SHA, semantic map hash, and active mcp_server consumer inventory are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to the mcp_server directory closure and its path-valued consumers; no adjacent cleanup is included
- [ ] CHK-004 [P0] Python .py names, Python package directories, package identifiers, JSON/YAML/TOML keys, and frozen changelog content are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The semantic map contains exactly mcp_server → mcp-server and passes exact, casefold, and NFC collision checks
- [ ] CHK-006 [P0] install.sh, doctor.sh, INSTALL_GUIDE.md, graph metadata, configured commands, package working directories, and dist/index.js references resolve under mcp-server
- [ ] CHK-007 [P0] The package root and lockfile remain coherent and the package entrypoint can be syntax-checked from the renamed directory
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Strict packet validation and the whole-surface path/reference scan pass with no stale active mcp_server path
- [ ] CHK-009 [P1] The consumer inventory has no unknown disposition; every hit is path, identifier, generated, exempt, or frozen with evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior, dependency source, environment handling, or MCP allowlist changed beyond path rewriting
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase evidence and child packet docs identify the final path map, preserved exemptions, and entrypoint proof
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The directory rename and reference updates land in one dependency-closed, path-scoped commit
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the package-path report pins the SHAs and map hash, active references
resolve under mcp-server, and no unexpected tracked mutation remains after verification.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the worktree shows only the expected directory and
path-reference closure.
<!-- /ANCHOR:sign-off -->
