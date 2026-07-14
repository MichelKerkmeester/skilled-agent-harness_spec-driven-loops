---
title: "Checklist: deep command namespace naming (017 phase 008/013/002)"
description: "Blocking SOL verification contract for the maintained deep asset closure and generated contract boundary."
trigger_phrases:
  - "deep namespace naming checklist"
  - "deep asset rename verification"
  - "compiled contract verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep namespace checklist"
    next_safe_action: "Verify the maintained deep closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Deep command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the deep child. The report pins candidate SHA, BASE SHA, frozen map hash, maintained/generated counts, compiler output, route results, and path-scoped diff. A zero-file, zero-contract, or zero-scenario result is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the deep handoff, isolated index, 28-row maintained map, four generated exemptions, and compiler instructions.
- [ ] CHK-002 [P2] The report records the BASE SHA, candidate SHA, contract-manifest baseline, and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to maintained deep assets/bodies and their proven reference closure; no sibling namespace cleanup is included.
- [ ] CHK-004 [P0] No generated contract filename, command ID, schema key, YAML key, Python/package name, tool-mandated name, or frozen history changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All 28 maintained sources have one kebab-case target, all four compiled contract filenames remain exact, and collision checks pass.
- [ ] CHK-006 [P0] Auto, confirm, presentation, legacy, compiler source paths, and active README links resolve with no old maintained path or missing target.
- [ ] CHK-007 [P0] Compiler validation or regeneration records current source paths/digests, and deep route, fallback, injection, and command-ID outcomes match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The consumer inventory covers command files, asset-local links, compiled headers, manifest records, tests, and dynamic injection sites; each generated/non-path occurrence has a disposition.
- [ ] CHK-009 [P1] The final manifest has no in-scope maintained snake_case name and the report proves compiled filenames were not renamed.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Dispatch gates, write boundaries, compiler tool posture, generated-output handling, and executable bits are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Deep asset READMEs, generated-contract evidence, and the phase packet record maintained targets, exemptions, and compiler receipts.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Maintained renames, reference rewrites, and generated refreshes are dependency-closed and path-scoped; no scratch or unrelated files remain.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, maintained and generated counts reconcile, compiler evidence is current, deep behavior matches BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains map, compiler, route, and diff receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
