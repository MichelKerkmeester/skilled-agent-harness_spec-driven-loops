---
title: "Checklist: create-quality-control resource names"
description: "Blocking SOL verifier contract for the create-quality-control resource rename phase."
trigger_phrases:
  - "create-quality-control resource checklist"
  - "quality control reference rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored quality control checklist"
    next_safe_action: "Run the quality control verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-quality-control/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-quality-control resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-quality-control phase 011. The report pins BASE, candidate SHA, and rename-map hash, records reference-resolution evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The three reference rows and shared-backbone boundary are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-quality-control paths and path consumers changed.
- [ ] CHK-004 [P0] `workflows.md`, shared paths, score fields, validation terms, keys, and mandated names are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All three reference filenames have one kebab-case target.
- [ ] CHK-006 [P0] Reference indexes and workflow links resolve; old packet path search is empty.
- [ ] CHK-007 [P1] Shared-backbone ownership and resource discovery match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, indexes, examples, shared paths, and workflow consumers are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No quality-control permission, executable mode, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-quality-control-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, quality-control references resolve, shared ownership is respected, and workflow semantics remain stable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, reference-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
