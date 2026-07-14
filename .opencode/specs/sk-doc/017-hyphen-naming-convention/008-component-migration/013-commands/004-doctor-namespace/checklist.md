---
title: "Checklist: doctor command namespace naming (017 phase 008/013/004)"
description: "Blocking SOL verification contract for the doctor asset, route, exact-name, and Python exemption closure."
trigger_phrases:
  - "doctor namespace naming checklist"
  - "doctor asset rename verification"
  - "doctor route verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored doctor namespace checklist"
    next_safe_action: "Verify the doctor asset and route closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Doctor command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the doctor child. The report pins candidate SHA, BASE SHA, frozen map hash, maintained/exempt counts, route parse results, helper outcomes, and path-scoped diff. A zero-file or zero-route result is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the doctor handoff, isolated index, 16-row maintained map, exact route-manifest disposition, and Python exemption evidence.
- [ ] CHK-002 [P2] The report records the BASE SHA, candidate SHA, route baseline, and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to maintained doctor assets and their proven route/reference closure; no sibling namespace cleanup is included.
- [ ] CHK-004 [P0] `_routes.yaml`, `audit_descriptions.py`, route IDs, YAML keys, command IDs, generated/tool-mandated names, and frozen history remain unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All 16 maintained doctor assets have one kebab-case target, targets exist, and exact/casefold/NFC collision checks pass.
- [ ] CHK-006 [P0] Every path-valued route, command, presentation, and external pointer resolves with no active old asset path; route IDs and keys are unchanged.
- [ ] CHK-007 [P0] Doctor route selection, workflow loading, presentation loading, and Python-helper checks match the BASE evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The consumer inventory covers `_routes.yaml`, all doctor command/assets, scripts, tests, indexes, and dynamic sites; each non-path or exempt occurrence has a disposition.
- [ ] CHK-009 [P1] The final manifest contains no in-scope snake_case doctor asset, and the report proves the exact route manifest and Python file were not renamed.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Doctor tool grants, mutation gates, sandbox posture, route allowlists, and executable bits are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Doctor route/asset documentation and the phase packet record the final paths, exact/Python exclusions, and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Doctor asset renames and route/reference rewrites land as one dependency-closed, path-scoped batch with no scratch or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, all maintained and exempt rows reconcile, route/helper behavior matches BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains map, route, exemption, and diff receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
