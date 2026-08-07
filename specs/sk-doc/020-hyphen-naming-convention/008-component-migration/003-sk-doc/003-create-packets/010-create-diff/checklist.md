---
title: "Checklist: create-diff naming audit"
description: "Blocking SOL verifier contract for the create-diff zero-row naming audit."
trigger_phrases:
  - "create-diff naming audit checklist"
  - "create-diff zero-row verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-diff audit checklist"
    next_safe_action: "Run the create-diff census verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-diff/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-diff naming audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-diff phase 010. The report pins BASE, candidate SHA, and the zero-row census hash, records the complete path listing and count, and fails on any unclassified candidate or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Complete create-diff path listing and filesystem/content classification are recorded.
- [ ] CHK-002 [P1] BASE SHA and zero-row census hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] No create-diff implementation or unrelated packet file changed.
- [ ] CHK-004 [P0] Content identifiers, fields, keys, and tool names were not treated as path candidates.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The complete create-diff candidate count is zero at the pinned baseline.
- [ ] CHK-006 [P0] All create-diff path references resolve and no stale path is found.
- [ ] CHK-007 [P1] The path listing and discovery result are reproducible from the recorded command.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Any dynamic path, content underscore, or future candidate is explicitly dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable mode, diff-policy allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Parent and rollup docs record this phase as a verified zero-row component.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] No implementation-summary or scratch artifact remains and no migration file was created.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the zero-row result is evidence-pinned, references resolve, and the component remains unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires the pinned zero-row report, path-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
