---
title: "Checklist: mcp-tooling hub manual-testing-playbook naming closure (032 phase 005)"
description: "Blocking SOL verifier contract for the hub-level manual-testing-playbook naming phase."
trigger_phrases:
  - "mcp-tooling hub playbook checklist"
  - "hub routing scenario verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 005 SOL verifier contract"
    next_safe_action: "Verify the hub playbook candidate map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling Hub Manual-Testing-Playbook Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the hub-playbook scan
- [ ] CHK-002 [P2] The report lists the 2 underscored directories, 7 underscored files, and seven-scenario baseline
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to the hub-level manual-testing-playbook and its root navigation references
- [ ] CHK-004 [P2] Scenario IDs, frontmatter fields, labels, component paths, and routing semantics are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every hub playbook candidate has one explicit kebab target — attach the complete two-directory/seven-file map
- [ ] CHK-006 [P0] No in-scope snake_case name remains in the hub playbook root, category, index, or scenarios
- [ ] CHK-007 [P0] SKILL.md, the playbook index, and all scenario links resolve with exactly seven discovered scenarios
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The rename map covers every hub index entry and every link to a moved scenario
- [ ] CHK-009 [P1] No component-local manual-testing-playbook path was rewritten by this phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No routing policy, external-tool boundary, credential handling, or executable behavior changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Hub routing documentation names manual-testing-playbook and hub-routing with canonical hyphenated paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The hub playbook rename is path-scoped and reversible; verification leaves git diff-index --quiet HEAD -- clean
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, exactly seven hub scenarios are discovered, all links resolve, component ownership is clean, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the component-local playbooks remain outside the diff.
<!-- /ANCHOR:sign-off -->
