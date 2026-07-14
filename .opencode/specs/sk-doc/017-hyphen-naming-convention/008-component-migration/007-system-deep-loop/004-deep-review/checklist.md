---
title: "Checklist: system-deep-loop deep-review names (017 phase 007/004)"
description: "Blocking SOL verification contract for the deep-review filesystem rename set, reference closure, report paths, and review-state parity."
trigger_phrases:
  - "system-deep-loop deep review checklist"
  - "deep-review naming verification"
  - "deep-review filesystem rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep-review checklist"
    next_safe_action: "Verify deep-review closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop deep-review names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the deep-review child. The report pins the candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, the 15-directory/96-file underscore-bearing inventory, and review-state outcomes. Verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and the deep-review ownership boundary is attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, inventory counts, candidate manifest, and protected-name manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to the deep-review component and its dependency-closed references; no adjacent deep-research, council, or improvement cleanup is included.
- [ ] CHK-004 [P0] SKILL.md, mode-registry.json, package manifests, Python .py files/package directories, generated/tool-mandated names, review identifiers, severity labels, and serialized keys were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every one of the 15 candidate directories and 96 candidate files has exactly one rename, exempt, frozen, generated, or tool-mandated disposition with no unknown row or target collision.
- [ ] CHK-006 [P0] Deep-review links, reducers, report writers, fixtures, catalog/playbook references, and state paths resolve after the rename.
- [ ] CHK-007 [P0] Review-depth, finding/severity, convergence, and workflow checks execute non-trivially and preserve their BASE outcomes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Dynamic path construction, reducer/report lookup, and embedded documentation references have an explicit disposition and no stale in-scope basename remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Path containment, review-state boundaries, report-output locations, and any guarded helper behavior are unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The deep-review manifest, exemption decisions, reference closure, review-state evidence, and final path inventory are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The rename/reference change is one dependency-closed deep-review batch with no files from sibling components or the parent benchmark/playbook surfaces.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, all candidate paths have a disposition, deep-review behavior remains non-trivial and parity-clean, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
