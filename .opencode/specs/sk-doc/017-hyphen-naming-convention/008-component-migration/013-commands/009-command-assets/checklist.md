---
title: "Checklist: command asset and reference closure (017 phase 008/013/009)"
description: "Blocking SOL verification contract for residual command asset ownership, kebab-case targets, and cross-namespace path closure."
trigger_phrases:
  - "command asset closure checklist"
  - "residual command path verification"
  - "command template reference verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored command asset checklist"
    next_safe_action: "Verify residual asset ownership and closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Command asset and reference closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the residual asset child. The report pins sibling-map revisions, full inventory count, residual count, ownership hash, candidate/BASE SHAs, path results, boundary evidence, and scoped diff. A residual no-op without complete ownership evidence is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes sibling maps for 001–008 and a complete `.opencode/commands/**` inventory.
- [ ] CHK-002 [P0] Every file and directory has exactly one owner/disposition row, with residual rows explicitly separated from sibling-owned rows.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Physical changes are limited to 009-owned maintained files and proven cross-namespace path consumers.
- [ ] CHK-004 [P0] Generated contracts, tool manifests, Python/package exemptions, fixtures, command IDs, semantic keys, and frozen evidence retain their exact boundary.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every approved residual target is kebab-case, unique under exact/casefold/NFC comparison, and present on disk.
- [ ] CHK-006 [P0] Every active link, reference, template pointer, manifest input, and command README path resolves to its final target.
- [ ] CHK-007 [P0] The command-reference checks and boundary-specific generated/fixture checks pass with receipts.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No residual old active path remains, and every remaining occurrence has a documented historical, generated, fixture, tool, semantic, or other exemption.
- [ ] CHK-009 [P1] Ownership comparison proves no file is omitted or claimed by both 009 and a sibling.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Command execution boundaries, plugin/tool paths, generated-contract authority, fixture failure semantics, and executable bits are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The residual map, final target table, pointer closure, and all boundary dispositions are recorded for the rollup.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames and path rewrites are one dependency-closed scoped batch with no scratch, implementation-summary, duplicate-owner, or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, the residual map is exhaustive and unique, all active pointers resolve, and every special boundary is evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains all receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
