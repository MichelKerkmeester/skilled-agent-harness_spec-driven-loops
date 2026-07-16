---
title: "Checklist: create-command resource names"
description: "Blocking SOL verifier contract for the create-command resource rename phase."
trigger_phrases:
  - "create-command resource checklist"
  - "command template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-command checklist"
    next_safe_action: "Run the create-command verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-command/assets/", ".opencode/skills/sk-doc/create-command/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-command resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-command phase 004. The report pins BASE, candidate SHA, and rename-map hash, records target-resolution evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The seven resource rows and command-content exemptions are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-command paths and path consumers changed.
- [ ] CHK-004 [P0] Command fields, modes, keys, identifiers, and mandated names are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All three asset and four reference filenames have one kebab-case target.
- [ ] CHK-006 [P0] Router, presentation, argument-hint, and worked-example links resolve.
- [ ] CHK-007 [P1] Old live path search is empty and resource discovery matches BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, route/resource values, basename joins, and examples are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No command permission, executable mode, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-command-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, command resources resolve, behavior fields are stable, and no mandated-name drift appears in the diff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, successful resource loading, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
