---
title: "Checklist: Templates and examples (032 subtree 008 phase 005)"
description: "The system-spec-kit template surface contains underscore-bearing directory and file names in the examples and stress-test layouts, including level_1, level_2, level_3, level_3+, stress_test, and EXTENSION_GUIDE.md. This phase moves permitted template paths and updates generator, renderer, and documentation pointers while preserving tool-mandated manifest templates."
trigger_phrases:
  - "system-spec-kit templates and examples"
  - "level_1 template rename"
  - "stress_test template rename"
  - "EXTENSION_GUIDE rename"
  - "kebab-case phase 005"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/005-templates-and-examples"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the template path map after script callers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Templates and examples

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 004 handoff and template baseline renders are available.
- [ ] CHK-002 [P0] Manifest/tool-mandated names are listed before any template path move.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Path map is semantic and does not alter template content or fields.
- [ ] CHK-004 [P0] Level selector semantics are proven by rendered output.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every named template directory/file has a source-to-target map.
- [ ] CHK-006 [P0] Generators and renderers resolve all target paths.
- [ ] CHK-007 [P0] Tool-mandated manifest template names remain exact.
- [ ] CHK-008 [P1] Rendered tree and anchor comparisons pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted underscore-bearing template path remains.
- [ ] CHK-010 [P1] Old path pointers have zero unresolved active matches.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Renderer and generator boundaries are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Baseline and target render manifests are retained for phase 006.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Batch contains only template/example path closures and their pointers.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the template map, pointer rewrites, exemption audit, generator resolution, and rendered-tree comparison are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the renamed template tree renders the same contracts.
<!-- /ANCHOR:sign-off -->

