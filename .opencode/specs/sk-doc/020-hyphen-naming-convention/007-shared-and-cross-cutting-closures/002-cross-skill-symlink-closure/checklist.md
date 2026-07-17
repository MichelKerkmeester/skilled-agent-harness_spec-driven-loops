---
title: "Checklist: cross-skill symlink closure (032 phase 007 child 002)"
description: "Blocking SOL verifier contract for the cross-skill symlink closure: complete edge manifest, atomic target/pointer ordering, relative-link and mode preservation, reference resolution, and component handoff."
trigger_phrases:
  - "cross-skill symlink checklist"
  - "atomic symlink verifier"
  - "phase 007 child 002 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the cross-skill symlink SOL verifier contract"
    next_safe_action: "Run the checklist against the candidate symlink closure commit"
    blockers: []
    key_files:
      - ".opencode/install_guides/install_scripts/"
      - ".opencode/skills/sk-doc/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Checklist evidence will be supplied by the migration executor; this pass only authors the contract"
---
# Checklist: Cross-Skill Symlink Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 002. The verifier pins candidate SHA, BASE SHA, and map hash; records commands, exit codes, link counts, target counts, and mode comparisons; and fails on a zero-file scan, a dangling link, a partial target/pointer update, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate worktree, phase 006 map hash, and phase 005 checker receipt are recorded
- [ ] CHK-002 [P0] The manifest covers install-guide, skill façade, shared-reference, runtime mirror, and other cross-boundary symlinks
- [ ] CHK-003 [P2] Target owners, link modes, target types, and executable bits are captured before execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every target with a changed name is grouped with all link-nodes and path references in one closure
- [ ] CHK-005 [P0] The candidate diff contains no target-only or pointer-only partial update
- [ ] CHK-006 [P1] Link text is rendered relative to each link-node and no source-map or target-map guess is used
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The symlink inventory has non-zero link and target counts and every edge has one owner/disposition
- [ ] CHK-008 [P0] A dry-run fixture with an unresolved pointer or collision aborts before the worktree changes
- [ ] CHK-009 [P0] Every changed link resolves from its containing directory with no dangling target
- [ ] CHK-010 [P0] Link mode is `120000`; target type, identity, and executable bits match the preflight manifest
- [ ] CHK-011 [P0] The phase 005 reference checker reports zero stale symlink/path references
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] Frozen, generated, tool-mandated, Python, changelog, archive, and completed-history edges retain their approved dispositions
- [ ] CHK-013 [P1] Closure identifiers, ordering constraints, and evidence are published for phase 008 `depends_on` entries
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P2] No symlink changes redirect execution outside the approved worktree or alter sandbox, installer, or command authority
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P2] The atomicity decision record and final edge manifest are linked from the phase handoff
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Target and pointer updates land in dependency-closed, path-scoped commits; failed preflight leaves no tracked mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child passes only when every P0 item is green, every target has all pointers in the same closure, link resolution and modes match the manifest, and the downstream component handoff is complete.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms atomic target/pointer movement and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
