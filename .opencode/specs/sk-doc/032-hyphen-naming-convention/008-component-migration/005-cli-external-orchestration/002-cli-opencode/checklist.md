---
title: "Checklist: cli-opencode component naming (032 phase 005.002)"
description: "Blocking SOL verifier contract for the cli-opencode component: complete reference/asset map, active path closure, schema and dispatch parity, and delegated-surface protection."
trigger_phrases:
  - "cli-opencode naming checklist"
  - "OpenCode path map verifier"
  - "cli-external phase 002 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-opencode verifier"
    next_safe_action: "Run the component checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The component candidate set is 14 local authored files outside manual_testing_playbook/."
---
# Checklist: cli-opencode component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. The verifier pins candidate and BASE SHAs, records the 14-entry path/key ledger and map hash, captures commands and exit codes, and fails on an unknown candidate, stale path, schema drift, delegated-scope mutation, or unexpected tracked change.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 hub-boundary evidence and the pinned worktree are available before the component map is built
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, local map hash, and the full 14-file candidate inventory are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The eight reference files and six asset files map bijectively to kebab-case targets with no collision or stale source
- [ ] CHK-004 [P0] Only filesystem path values changed; JSON keys, schema properties, code identifiers, dispatch rules, and permission semantics did not
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] `SKILL.md`, README, asset links, schema path values/globs, and active local references resolve to the mapped targets
- [ ] CHK-006 [P0] Permissions-matrix JSON parses and its keys, properties, path-normalized `$id`/globs, and example semantics match BASE
- [ ] CHK-007 [P1] Component JavaScript checks/tests pass and the existing hyphenated script names, executable bits, and dispatch behavior remain intact
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The nested `manual_testing_playbook/` tree, external skill paths, changelog history, and exempt Python/package names are outside the diff
- [ ] CHK-009 [P1] The path map, stale-source search, content parity results, and handoff to phase 005 are linked from the evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable allowlist, permission gate, self-invocation guard, tool contract, or sandbox policy changed beyond path references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P1] The final map names each reference/asset source and target and records every external/delegated path decision
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] No implementation-summary scaffold file or scratch directory remains in the phase folder, and no sibling phase file changed
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all 14 local authored files have clean targets, local references resolve, permission/schema and dispatch contracts match BASE, and no delegated or exempt surface was renamed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --` shows no unexpected mutation outside cli-opencode ownership.
<!-- /ANCHOR:sign-off -->

