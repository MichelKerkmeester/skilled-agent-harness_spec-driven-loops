---
title: "Checklist: create-changelog resource names"
description: "Blocking SOL verifier contract for the create-changelog resource rename phase."
trigger_phrases:
  - "create-changelog resource checklist"
  - "changelog guidance rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-changelog checklist"
    next_safe_action: "Run the create-changelog verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-changelog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-changelog resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-changelog phase 009. The report pins BASE, candidate SHA, and rename-map hash, records guidance-resolution evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The three reference rows and phase 006/global-path boundary are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-changelog reference paths and path consumers changed.
- [ ] CHK-004 [P0] Version values, release filenames, topology terms, fields, and mandated names are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] `topology_edge_cases.md`, `version_bump_rules.md`, and `worked_examples.md` each have one kebab-case target.
- [ ] CHK-006 [P0] Reference links/indexes resolve and old packet path search is empty.
- [ ] CHK-007 [P1] Global changelog paths and version evidence remain outside this component diff.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, indexes, examples, and cross-phase references are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No release permission, executable mode, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-changelog-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, guidance resources resolve, version/release semantics remain stable, and global evidence is handed to phase 006.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, guidance-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
