---
title: "Checklist: create-flowchart resource names"
description: "Blocking SOL verifier contract for the create-flowchart resource rename phase."
trigger_phrases:
  - "create-flowchart resource checklist"
  - "flowchart asset rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-flowchart checklist"
    next_safe_action: "Run the create-flowchart verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-flowchart/assets/", ".opencode/skills/sk-doc/create-flowchart/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-flowchart resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-flowchart phase 008. The report pins BASE, candidate SHA, and rename-map hash, records target-resolution evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The ten resource rows and validator-content/notation exemptions are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-flowchart paths and path consumers changed.
- [ ] CHK-004 [P0] Validator script content/behavior, notation tokens, content identifiers, and mandated names are unchanged except for the path token.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Six asset, three reference, and one validator filename have one kebab-case target each.
- [ ] CHK-006 [P0] Pattern, guidance, and validator links resolve; old live path search is empty.
- [ ] CHK-007 [P1] Resource discovery and pattern inventory match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, dynamic pattern selection, examples, and validator path consumers are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable mode, validator allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-flowchart-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, flowchart resources resolve, the validator path and behavior remain correct, and notation semantics are unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, resource-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
