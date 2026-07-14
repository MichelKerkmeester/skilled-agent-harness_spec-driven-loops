---
title: "Checklist: create-readme resource names"
description: "Blocking SOL verifier contract for the create-readme resource rename phase."
trigger_phrases:
  - "create-readme resource checklist"
  - "install guide template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-readme checklist"
    next_safe_action: "Run the create-readme verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-readme/assets/", ".opencode/skills/sk-doc/create-readme/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-readme resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-readme phase 002. The report pins BASE, candidate SHA, and rename-map hash, records link-resolution evidence, and fails on an unknown resource or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Asset/reference inventory and install-guide/README domain split are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-readme paths and path consumers changed.
- [ ] CHK-004 [P0] `SKILL.md`, `README.md`, `audit_readmes.py`, placeholders, keys, and fields are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] `install_guide/` and all eight listed resource files have one kebab-case target each.
- [ ] CHK-006 [P0] Every renamed asset/reference link resolves and old live path search is empty.
- [ ] CHK-007 [P1] Resource discovery counts and install-guide/README domain mapping match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, glob/stem consumers, audit-helper documentation, and examples are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable permission, package allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-readme-only scope and exemptions.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, all install-guide/README resources resolve, counts remain stable, and no mandated/Python path changed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, link-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
