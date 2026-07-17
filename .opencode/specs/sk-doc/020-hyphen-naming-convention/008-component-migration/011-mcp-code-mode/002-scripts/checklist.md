---
title: "Checklist: mcp-code-mode scripts (032 component 011 phase 002)"
description: "Blocking SOL verifier contract for the script filename census, Python exemption, and conditional reference closure."
trigger_phrases:
  - "mcp-code-mode scripts checklist"
  - "mcp-code-mode phase 002 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts verifier contract"
    next_safe_action: "Run the script audit after phase 001"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-code-mode scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. The report pins the candidate SHA, BASE SHA, and
rename-map hash, records the complete script inventory, consumer dispositions, commands, and exit codes, and fails on
an unknown filename or an unproved empty rename set.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 has landed and the post-rename script paths are recorded from a clean pinned BASE worktree
- [ ] CHK-002 [P2] The BASE SHA, map hash, and script consumer inventory are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to eligible script filenames and their path consumers; no adjacent script cleanup is included
- [ ] CHK-004 [P0] validate_config.py, Python package directories, command names, environment variables, identifiers, and data keys are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The inventory explicitly classifies doctor.sh, install.sh, update.sh, validate_config.py, and mcp-server/scripts/check-node.cjs
- [ ] CHK-006 [P0] The map contains every eligible non-Python candidate, or the census proves the eligible set is empty
- [ ] CHK-007 [P0] Every affected shell source, import, registry, documentation, and manual pointer resolves to the final script path
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Strict packet validation and the active reference scan pass with no stale eligible script path
- [ ] CHK-009 [P1] Every script hit has a disposition and no Python exemption was silently converted into a rename
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior, environment handling, dependency source, or MCP allowlist changed beyond permitted path rewriting
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase evidence records whether the eligible rename map was empty and identifies the preserved Python path
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Any non-empty script rename and its reference updates land in one dependency-closed, path-scoped commit
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the candidate report proves the full script inventory and map result,
syntax/reference checks are green, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the script census has no unknown or unproved candidate.
<!-- /ANCHOR:sign-off -->
