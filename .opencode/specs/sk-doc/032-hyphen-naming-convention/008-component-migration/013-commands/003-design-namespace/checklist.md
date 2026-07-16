---
title: "Checklist: design command namespace naming (032 phase 008/013/003)"
description: "Blocking SOL verification contract for the design command asset rename and reference closure."
trigger_phrases:
  - "design namespace naming checklist"
  - "design asset rename verification"
  - "design command path verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design namespace checklist"
    next_safe_action: "Verify the design asset closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Design command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the design child. The report pins candidate SHA, BASE SHA, frozen map hash, asset counts, route outcomes, reference results, and path-scoped diff. A zero-file or zero-scenario result is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the design handoff, isolated index, and 15-row map.
- [ ] CHK-002 [P2] The report records the pre-change asset count, BASE SHA, candidate SHA, and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to `.opencode/commands/design/` and its proven path/reference closure; no adjacent namespace cleanup is included.
- [ ] CHK-004 [P0] No command ID, configuration/YAML key, frontmatter field, Python/package name, generated output, tool-mandated name, or frozen history changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All 15 design asset sources have exactly one kebab-case target, every target exists, and exact/casefold/NFC collision checks pass.
- [ ] CHK-006 [P0] Audit, foundations, interface, md-generator, and motion auto/confirm/presentation paths resolve with no active old asset path.
- [ ] CHK-007 [P0] The five design command route and presentation outcomes match the BASE evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The consumer inventory covers all five command files, asset-local links, indexes, tests, and dynamic path sites; every non-path occurrence has a disposition.
- [ ] CHK-009 [P1] The final manifest contains no in-scope snake_case design asset and the report pins the path-scoped diff.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Design command tool grants, workflow gates, sandbox posture, and executable bits are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Design command asset tables and the phase packet record final kebab-case paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The design renames and reference rewrites land as one dependency-closed, path-scoped batch with no scratch or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, all 15 map rows and active references resolve, design behavior matches BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
