---
title: "Checklist: sk-git manual testing playbook (017 phase 008/012/003)"
description: "Blocking SOL verification contract for the sk-git manual-testing-playbook tree rename."
trigger_phrases:
  - "sk-git manual playbook checklist"
  - "017 scenario rename verification"
  - "manual discovery parity acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the manual-playbook phase"
    next_safe_action: "Run the checklist against the candidate playbook rename commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/manual-testing-playbook/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. The verifier pins the candidate SHA, BASE SHA, and 49-entry map hash, records commands, exit codes, path counts, scenario discovery counts, and dispositions, and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned worktree is clean, scoped to sk-git, and the candidate report records BASE SHA and the 49-entry map hash.
- [ ] CHK-002 [P0] The inventory contains one root index, seven category directories, 41 scenario files, and one stable GIT ID for each scenario.
- [ ] CHK-003 [P1] References, assets, benchmark, changelog, feature-catalog, and sibling-surface boundaries are recorded as excluded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Directory and scenario renames follow the semantic map; no blind substitution or ambiguous target is accepted.
- [ ] CHK-005 [P0] Scenario IDs, frontmatter fields, commands, keys, content, modes, symlinks, and non-path values are unchanged.
- [ ] CHK-006 [P1] No feature-catalog path, code identifier, Python/tool-mandated name, or sibling-surface file changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The 49-entry map has exactly one rename or baseline no-op disposition per path and no source/target coexistence.
- [ ] CHK-008 [P0] The root index and all in-tree playbook links resolve to hyphenated targets with zero broken links.
- [ ] CHK-009 [P0] Discovery parity holds: GIT-001 through GIT-041 each appear exactly once, with unchanged category membership.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The consumer inventory covers the root index, category links, scenario cross-links, package-artifact lists, SKILL.md, README.md, and any tracked path-valued registry.
- [ ] CHK-011 [P1] Every source path such as manual_testing_playbook/, worktree_setup/, or fresh_feature_isolated_worktree.md is absent from active pointers after the rewrite.
- [ ] CHK-012 [P1] The candidate diff is path-scoped to the manual playbook and listed pointer consumers; no sibling phase surface is included.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P2] No executable behavior, access policy, secret, or tool invocation changed beyond path-valued references.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree on the 49-entry map and the 41-scenario invariant.
- [ ] CHK-015 [P2] The phase outcome is linked from the parent map and the 017 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] The manual-playbook rename and pointer rewrite land in a dependency-closed, path-scoped commit on the pinned worktree branch.
- [ ] CHK-017 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 checks pass, the candidate report pins SHA and map evidence, all 41 scenarios remain discoverable, every target resolves, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the 49-entry map, 41-ID discovery parity, pointer closure, exemption boundary, and clean path-scoped diff.
<!-- /ANCHOR:sign-off -->
