---
title: "Checklist: create-skill resource names"
description: "Blocking SOL verifier contract for the create-skill resource rename phase."
trigger_phrases:
  - "create-skill resource checklist"
  - "create-skill template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-skill checklist"
    next_safe_action: "Run the create-skill verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-skill/assets/", ".opencode/skills/sk-doc/create-skill/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-skill resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-skill phase 001. The report pins BASE, candidate SHA, and rename-map hash, records resource discovery and path-resolution evidence, and fails on unknown candidates or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Parent-skill, skill, shared-reference, and script inventories are recorded with the exemption rows.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-skill filesystem paths and path consumers changed.
- [ ] CHK-004 [P0] `SKILL.md`, manifests, `.py` files, Python package directories, keys, and identifiers are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Both `parent_skill` directories and all twenty listed non-exempt files, including scaffold filenames, have one kebab-case target.
- [ ] CHK-006 [P0] Parent-skill and ordinary-skill resource links/loaders resolve through renamed directories.
- [ ] CHK-007 [P1] Old path search returns no stale live consumer and resource discovery counts match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, generated path values, basename joins, and reference examples were searched and dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable permission, package allowlist, or sandbox boundary changed beyond path updates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] The phase docs and manifest agree on the create-skill-only scope and exemption boundary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are path-scoped and no implementation-summary or scratch artifact is present in the leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, every create-skill target resolves, the resource inventory is parity-complete, and no mandated/Python path changed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, successful resource discovery, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
