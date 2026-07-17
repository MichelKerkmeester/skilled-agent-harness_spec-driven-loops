---
title: "Checklist: sk-git assets (032 phase 008/012/002)"
description: "Blocking SOL verification contract for the sk-git asset and template filename rename phase."
trigger_phrases:
  - "sk-git assets checklist"
  - "032 asset rename verification"
  - "asset template pointer acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the assets phase"
    next_safe_action: "Run the checklist against the candidate asset rename commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/assets/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. **This phase is VERIFY-ONLY — v4 already committed the three asset renames; the verifier proves the completed kebab state, it does not accept any new rename.** The verifier pins the current SHA and the asset-map, records commands, exit codes, discovery counts, parity results, and dispositions, and fails on a surviving source spelling, an unresolved pointer, or a reversed path.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned worktree is clean, scoped to sk-git, and the candidate report records BASE SHA and the three-entry asset-map hash.
- [ ] CHK-002 [P0] The source, target, metadata, content, and pointer inventory is complete before any asset rename is accepted.
- [ ] CHK-003 [P1] The reference, manual-playbook, benchmark, changelog, and sibling-surface boundaries are recorded as excluded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Each of the three asset targets exists on v4 and its source name is absent — the map is fully applied (v4 committed it), not re-executed.
- [ ] CHK-005 [P0] Asset bytes, modes, symlink targets, frontmatter fields, data keys, examples, and template structure are unchanged except approved path values.
- [ ] CHK-006 [P1] No code identifier, tool-mandated name, or non-path value changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] All three asset entries are already kebab on v4; no source and target coexist and nothing requires renaming or reversing.
- [ ] CHK-008 [P0] Active pointers in SKILL.md, README.md, assets/, and references/ resolve to hyphenated targets with zero broken links.
- [ ] CHK-009 [P0] No active pointer retains a source spelling such as assets/commit_message_template.md or assets/worktree_checklist.md.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The consumer inventory covers router tables, resource maps, Markdown links, verification commands, asset cross-links, and reference links.
- [ ] CHK-011 [P1] The candidate diff is path-scoped to assets and its listed pointer consumers; no sibling phase surface is included.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] No executable behavior, access policy, secret, or tool invocation changed beyond path-valued references.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree on the three-entry map and content-parity rules.
- [ ] CHK-014 [P2] The phase outcome is linked from the parent map and the 032 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The asset rename and pointer rewrite land in a dependency-closed, path-scoped commit on the pinned worktree branch.
- [ ] CHK-016 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 checks pass, the candidate report pins SHA and map evidence, asset content parity is clean, every target resolves, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the asset map, content parity, pointer closure, exemption boundary, and clean path-scoped diff.
<!-- /ANCHOR:sign-off -->
