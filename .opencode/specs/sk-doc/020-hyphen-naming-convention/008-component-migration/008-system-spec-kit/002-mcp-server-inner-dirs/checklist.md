---
title: "Checklist: MCP-server inner directories (020 subtree 008 phase 002)"
description: "The MCP server contains non-Python directories whose names still use underscores, including runtime, bridge, stress, and test-support paths. They need semantic targets and intra-tree reference updates; leading and doubled underscores must never be converted mechanically."
trigger_phrases:
  - "mcp-server inner directories"
  - "matrix_runners rename"
  - "plugin_bridges rename"
  - "stress_test rename"
  - "kebab-case phase 002"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the semantic inner-directory map on the renamed package root"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: MCP-server inner directories

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 root closure is present and the baseline is pinned.
- [ ] CHK-002 [P0] Vitest, TypeScript, and stress discovery configurations are read before mapping.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Directory targets are semantic and never mechanically become --helpers--, -support, or --fixtures--.
- [ ] CHK-004 [P0] No .py file, Python package directory, code identifier, or data key is changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] matrix_runners, plugin_bridges, and stress_test have explicit target paths or documented exemptions.
- [ ] CHK-006 [P0] tests/__helpers__, tests/_support, and tests/embedders/__fixtures__ each have a tool-contract disposition.
- [ ] CHK-007 [P0] All updated globs, setup paths, commands, and Markdown links resolve.
- [ ] CHK-008 [P1] Default and stress discovery counts are compared with the pinned baseline.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Intra-tree references move in the same dependency-closed batch as directories.
- [ ] CHK-010 [P1] Old-path disposition ledger has no unknown entries.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Test and stress execution boundaries are not broadened by a glob rewrite.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Directory mapping and exemption decisions are recorded for phase 003.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only the assigned MCP inner-directory closure is included in the phase batch.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when every inner directory has a semantic or exemption disposition, every intra-tree reference resolves, and test discovery evidence is pinned.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the semantic inner-directory map and zero unresolved intra-tree old paths.
<!-- /ANCHOR:sign-off -->
