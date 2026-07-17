---
title: "Checklist: system-deep-loop deep-alignment names (032 phase 007/007)"
description: "Blocking SOL verification contract for the deep-alignment path rename set, embedded-key protections, adapter/catalog/playbook closure, and read-only boundary."
trigger_phrases:
  - "system-deep-loop deep alignment checklist"
  - "deep-alignment naming verification"
  - "alignment adapter path rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored alignment checklist"
    next_safe_action: "Verify alignment paths and keys"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop deep-alignment names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the deep-alignment child. The report pins the candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, the 15-directory/68-file inventory, and the distinction between filesystem paths and embedded resource keys. Verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and the deep-alignment ownership boundary is attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, path/key manifest, adapter/catalog/playbook/state ownership, and protected-name manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to deep-alignment and its dependency-closed references; no other component or shared-surface cleanup is included.
- [ ] CHK-004 [P0] SKILL.md, mode-registry.json, package manifests, Python .py files/package directories, tool-mandated names, embedded resource identifiers, serialized keys, authority labels, and read-only contracts were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every one of the 15 candidate directories and 68 candidate files has exactly one filesystem disposition, and every embedded key/identifier is separately classified with no unknown row or collision.
- [ ] CHK-006 [P0] Adapter, catalog, manual-playbook, resource-map, and state paths resolve while embedded identifiers and keys retain their BASE values.
- [ ] CHK-007 [P0] All four alignment authority/read-only paths execute non-trivially and preserve their BASE outcomes and parity relationships.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Dynamic path strings and documentation links have an explicit disposition, with no stale in-scope filesystem basename remaining and no embedded-key rewrite.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Read-only boundaries, tool access, authority selection, resource containment, and state handling are unchanged except for required filesystem path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The path/key manifest, exemption decisions, adapter/catalog/playbook evidence, read-only results, and final inventory are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The rename/reference change is one dependency-closed alignment batch, with no sibling component and no embedded-key-only edit in the filesystem diff.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, paths and embedded keys remain correctly separated, alignment behavior is non-trivial and read-only safe, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
