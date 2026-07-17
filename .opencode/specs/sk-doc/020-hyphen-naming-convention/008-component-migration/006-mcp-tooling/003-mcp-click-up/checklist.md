---
title: "Checklist: mcp-click-up naming closure (032 phase 003)"
description: "Blocking SOL verifier contract for the ClickUp component naming phase."
trigger_phrases:
  - "mcp-click-up naming checklist"
  - "clickup catalog playbook verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 003 SOL verifier contract"
    next_safe_action: "Verify the complete ClickUp candidate map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-click-up/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-click-up Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the ClickUp scan
- [ ] CHK-002 [P2] The report lists all 26 snake_case directories and 137 snake_case files found in the component
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to mcp-click-up and its assigned references; the hub playbook and other components are untouched
- [ ] CHK-004 [P2] cupt/MCP identifiers, JSON/YAML/TOML keys, frontmatter fields, package manifests, and executable behavior are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every catalog/playbook/reference candidate has one explicit kebab target — attach the complete 26-directory/137-file map
- [ ] CHK-006 [P0] No in-scope snake_case filesystem name remains under mcp-click-up, including feature_catalog, manual_testing_playbook, FEATURE_CATALOG.md, and all category/files
- [ ] CHK-007 [P0] Catalog links, playbook links, indexes, path-derived values, and reference links resolve with non-zero discovery counts matching the baseline
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The map covers every catalog-to-playbook link and every component-local reference to a moved path
- [ ] CHK-009 [P1] The package/server layout remains intact and no stale feature_catalog or manual_testing_playbook path remains in active consumers
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No authentication, token handling, ClickUp command safety, MCP allowlist, or sandbox boundary changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] ClickUp catalog, playbook, references, examples, and indexes use canonical kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The full component closure lands in dependency-closed reversible commits and verification leaves git diff-index --quiet HEAD -- clean
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, catalog and scenario discovery are non-zero and baseline-parity, every path resolves, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the ClickUp package layout and identifiers remain unchanged.
<!-- /ANCHOR:sign-off -->
