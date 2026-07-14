---
title: "Checklist: Scripts tree (017 subtree 008 phase 004)"
description: "The system-spec-kit surface has a small set of non-Python script filenames that still contain underscores, while Python scripts and test fixture names follow separate contracts. This phase renames only permitted script filenames and updates sourcing, imports, and registry references without touching Python filenames or test-runner magic."
trigger_phrases:
  - "system-spec-kit scripts tree"
  - "_utils.sh rename"
  - "run_arm.sh rename"
  - "kebab-case script filenames"
  - "kebab-case phase 004"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/004-scripts-tree"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the non-Python script filename map after MCP consumers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Scripts tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 003 consumer closure is complete and the script baseline is captured.
- [ ] CHK-002 [P0] Python, test-magic, and generated-fixture boundaries are recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Only non-Python script filenames are renamed; contents are not opportunistically refactored.
- [ ] CHK-004 [P0] No leading-hyphen target is produced for _utils.sh.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Inventory proves the complete candidate set and maps utils.sh and run-arm.sh semantically.
- [ ] CHK-006 [P0] Every source, wrapper, registry, and README path resolves to the new script names.
- [ ] CHK-007 [P0] .py files and test/generated fixture names are unchanged.
- [ ] CHK-008 [P1] Shell syntax, executable bits, and benchmark wrapper smoke checks pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted underscore-bearing script filename remains in the assigned surface.
- [ ] CHK-010 [P1] Old-name search has no unresolved active caller.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Shebangs, executable bits, and script invocation boundaries remain unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Script inventory and exemption report are retained for the template phase handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Batch contains only assigned script filename closures and their callers.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when complete script inventory, semantic shell map, caller rewrites, exemption audit, syntax checks, and mode checks are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms no unresolved permitted script filename or caller remains.
<!-- /ANCHOR:sign-off -->

