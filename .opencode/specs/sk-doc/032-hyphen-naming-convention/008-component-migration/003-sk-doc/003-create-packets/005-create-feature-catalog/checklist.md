---
title: "Checklist: create-feature-catalog resource names"
description: "Blocking SOL verifier contract for the create-feature-catalog resource rename phase."
trigger_phrases:
  - "create-feature-catalog resource checklist"
  - "feature catalog template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature catalog checklist"
    next_safe_action: "Run the feature catalog verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/assets/", ".opencode/skills/sk-doc/create-feature-catalog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-feature-catalog resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-feature-catalog phase 005. The report pins BASE, candidate SHA, and rename-map hash, records target and ownership evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The three packet-owned resource rows and external-path dispositions are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-feature-catalog paths and path consumers changed.
- [ ] CHK-004 [P0] Catalog keys, feature IDs, external paths, mandated names, and fields are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Both feature-catalog asset names and `common_pitfalls.md` have one kebab-case target.
- [ ] CHK-006 [P0] Template/reference links resolve and old packet-owned path search is empty.
- [ ] CHK-007 [P1] Resource discovery and path ownership evidence match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, basename consumers, examples, and cross-surface references are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable mode, catalog allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-feature-catalog-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, packet resources resolve, external ownership is explicit, and catalog semantics are unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, resource-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
