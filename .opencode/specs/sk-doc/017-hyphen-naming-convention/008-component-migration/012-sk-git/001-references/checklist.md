---
title: "Checklist: sk-git references (017 phase 008/012/001)"
description: "Blocking SOL verification contract for the sk-git reference-file rename and pointer-closure phase."
trigger_phrases:
  - "sk-git references checklist"
  - "017 reference rename verification"
  - "reference pointer closure acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the references phase"
    next_safe_action: "Run the checklist against the candidate rename commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/assets/worktree-checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. The verifier pins the candidate SHA, BASE SHA, and rename-map hash, records commands, exit codes, discovery counts, and dispositions, and fails on zero-file scans or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned worktree is clean, scoped to sk-git, and the candidate report records BASE SHA and the nine-entry map hash.
- [ ] CHK-002 [P0] The source, target, mode, symlink, and pointer inventory is complete before any rename is accepted.
- [ ] CHK-003 [P1] The asset, manual-playbook, benchmark, changelog, and sibling-surface boundaries are recorded as excluded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Each applicable reference rename follows one semantic source-to-target map entry; no mechanical or ambiguous substitution is accepted.
- [ ] CHK-005 [P1] No code identifier, JSON/YAML/TOML key, frontmatter field, or non-path value changed.
- [ ] CHK-006 [P1] File bytes, mode, symlink target, and Git rename history are preserved for every applicable rename.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] All nine reference entries have exactly one rename or baseline no-op disposition; no source and target coexist.
- [ ] CHK-008 [P0] The active pointer scan resolves every reference in SKILL.md, README.md, assets/worktree-checklist.md, and references/ with zero broken targets.
- [ ] CHK-009 [P0] No active pointer retains a source spelling such as references/commit_workflows.md or references/worktree_workflows.md.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The consumer inventory covers router tables, resource maps, Markdown links, commands, asset links, and reference cross-links.
- [ ] CHK-011 [P1] The candidate diff is path-scoped to references and its listed pointer consumers; no sibling phase surface is included.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] No executable behavior, access policy, secret, or tool invocation changed beyond path-valued references.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree on the nine-entry map and the exemption boundary.
- [ ] CHK-014 [P2] The phase outcome is linked from the parent map and the 017 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The rename and pointer rewrite land in a dependency-closed, path-scoped commit on the pinned worktree branch.
- [ ] CHK-016 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 checks pass, the candidate report pins SHA and map evidence, every applicable target resolves, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the reference map, pointer closure, exemption boundary, and clean path-scoped diff.
<!-- /ANCHOR:sign-off -->
