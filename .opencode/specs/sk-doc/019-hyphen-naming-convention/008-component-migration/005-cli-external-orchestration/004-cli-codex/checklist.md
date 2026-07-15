---
title: "Checklist: cli-codex component naming (017 phase 005.004)"
description: "Blocking SOL verifier contract for the cli-codex component: complete seven-file map, active link closure, Codex safety/dispatch parity, and delegated-surface protection."
trigger_phrases:
  - "cli-codex naming checklist"
  - "Codex path map verifier"
  - "cli-external phase 004 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-codex verifier"
    next_safe_action: "Run the component checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The candidate set is seven local authored files outside manual_testing_playbook/."
---
# Checklist: cli-codex component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The verifier pins candidate and BASE SHAs, records the seven-entry path ledger and map hash, captures commands and exit codes, and fails on unknown candidates, stale links, Codex-contract drift, delegated-scope mutation, or unexpected tracked changes.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 003 handoff and the pinned worktree are available before the component map is built
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, map hash, and the seven-file candidate inventory are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Five reference and two asset files map bijectively to kebab-case targets with no collision or stale source
- [ ] CHK-004 [P0] Only filesystem path values changed; model/flag values, code identifiers, data keys, sandbox names, and dispatch rules did not
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] `SKILL.md`, README, asset links, and active component citations resolve to mapped targets
- [ ] CHK-006 [P0] Codex availability, self-invocation, model/reasoning, sandbox, review/search/image, and handback contracts compare with BASE
- [ ] CHK-007 [P1] The complete component inventory has no unclassified non-kebab authored name outside the seven-entry map
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The nested `manual_testing_playbook/`, changelog history, Python/package names, tool-mandated files, and external paths are outside the diff
- [ ] CHK-009 [P1] The path map, stale-source search, Codex parity results, and handoff to phase 005 are linked from the evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No availability guard, approval policy, sandbox rule, tool allowlist, self-invocation guard, or web/image behavior changed beyond path references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P1] The final evidence identifies all seven source/target pairs and every delegated/external path disposition
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] No implementation-summary scaffold file or scratch directory remains in the phase folder, and no sibling phase file changed
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all seven local authored files have clean targets, local references resolve, Codex safety/dispatch contracts match BASE, and no delegated or exempt surface was renamed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --` shows no unexpected mutation outside cli-codex ownership.
<!-- /ANCHOR:sign-off -->

