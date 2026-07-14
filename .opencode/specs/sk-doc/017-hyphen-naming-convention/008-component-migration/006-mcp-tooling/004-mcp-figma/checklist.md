---
title: "Checklist: mcp-figma naming closure (017 phase 004)"
description: "Blocking SOL verifier contract for the Figma component naming phase."
trigger_phrases:
  - "mcp-figma naming checklist"
  - "figma catalog helper verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 004 SOL verifier contract"
    next_safe_action: "Verify the complete Figma candidate map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-figma/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-figma/scripts/_common.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-figma Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the Figma scan
- [ ] CHK-002 [P2] The report lists all 14 snake_case directories and 30 snake_case files found in the component
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to mcp-figma and its assigned references; hub playbook and other components are untouched
- [ ] CHK-004 [P2] Shell variables, Figma/Code Mode identifiers, frontmatter fields, package paths, and transport behavior are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every Figma directory/file candidate has one explicit semantic target, including scripts/_common.sh to scripts/common.sh
- [ ] CHK-006 [P0] No in-scope snake_case filesystem name remains under mcp-figma, including asset, catalog, playbook, reference, install, and helper paths
- [ ] CHK-007 [P0] Markdown links, path values, and shell source commands resolve with non-zero catalog/playbook discovery
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The map covers every catalog/playbook/index entry and every source command that points to the moved helper or documentation
- [ ] CHK-009 [P1] The target common.sh is used consistently and no stale _common.sh path remains
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] The Figma transport remains workspace read-only and no credential, destructive-verb, or allowlist behavior changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Figma catalog, playbook, asset, reference, and install navigation use canonical kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The component closure lands in dependency-closed reversible commits and verification leaves git diff-index --quiet HEAD -- clean
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, resource discovery is non-zero, bash -n and helper resolution pass, the transport remains read-only, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the Figma helper and transport boundaries remain intact.
<!-- /ANCHOR:sign-off -->
