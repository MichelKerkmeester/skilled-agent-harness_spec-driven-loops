---
title: "Checklist: mcp-chrome-devtools naming closure (020 phase 002)"
description: "Blocking SOL verifier contract for the Chrome DevTools component naming phase."
trigger_phrases:
  - "mcp-chrome-devtools naming checklist"
  - "chrome devtools playbook verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 002 SOL verifier contract"
    next_safe_action: "Verify the Chrome DevTools candidate map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-chrome-devtools Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the component scan
- [ ] CHK-002 [P2] The report lists all 8 snake_case directories and 28 snake_case files found in the component
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to mcp-chrome-devtools and its assigned references; hub-level playbook and other components are untouched
- [ ] CHK-004 [P2] SKILL.md, identifiers, scenario IDs, frontmatter fields, and executable behavior are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every in-scope directory/file candidate has one explicit kebab target — attach the complete 8-directory/28-file map
- [ ] CHK-006 [P0] No in-scope snake_case filesystem name remains, including INSTALL_GUIDE.md, playbook categories/files, and reference files
- [ ] CHK-007 [P0] All Markdown links, path tables, and path-derived category values resolve to existing resources with non-zero scenario discovery
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The rename map covers every scenario index entry and every component-local reference to a moved path
- [ ] CHK-009 [P1] The target install-guide.md is used consistently and no stale INSTALL_GUIDE.md path remains
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No allowed-tool list, browser command, credential handling, or sandbox boundary changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The Chrome DevTools playbook and reference navigation use canonical kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The component rename lands in a dependency-closed, reversible commit and verification leaves git diff-index --quiet HEAD -- clean
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the scenario inventory is non-zero, all links resolve, the parent-hub check passes, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and no Chrome DevTools identifier or tool contract was altered.
<!-- /ANCHOR:sign-off -->
