---
title: "Checklist: sk-doc scripts and test fixtures"
description: "Blocking SOL verifier contract for the sk-doc scripts-tree kebab-case phase."
trigger_phrases:
  - "sk-doc scripts checklist"
  - "scripts fixture rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts checklist"
    next_safe_action: "Run the scripts verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/scripts/", ".opencode/skills/sk-doc/scripts/tests/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc scripts and test fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. The report pins BASE, candidate SHA, and rename-map hash, records command results and discovery counts, and fails on an unclassified file, zero fixture coverage, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The scripts inventory separates thirteen non-Python fixture/test names, Python scripts, existing hyphenated executables, and symlinks.
- [ ] CHK-002 [P1] BASE SHA, fixture-map hash, and consumer search terms are recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only the thirteen fixture/test paths and their path consumers changed; script logic and content keys are untouched.
- [ ] CHK-004 [P0] No Python `.py` basename, Python package directory, or facade symlink basename was renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The thirteen old fixture/test paths have one kebab-case target each and no additional non-Python snake_case candidate remains.
- [ ] CHK-006 [P0] Fixture discovery/load tests resolve the command, four root, spec, five validation, and two non-Python test-runner targets.
- [ ] CHK-007 [P1] Existing `.sh`, `.js`, and `.mjs` script names and facade links retain their baseline paths and modes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Static search and runtime discovery evidence covers direct, glob, basename, and registry consumers.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable permission, sandbox boundary, or script allowlist changed beyond path updates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] The phase docs and rename manifest agree on the thirteen-file non-Python scope and Python exemption.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The fixture renames and reference updates are path-scoped and no scratch artifacts remain.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all P0 checks pass, fixture discovery counts remain stable, Python names are unchanged, and the verifier reports no stale live paths or unknown candidates across all thirteen non-Python targets.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, successful fixture discovery, and a clean scoped diff after verification.
<!-- /ANCHOR:sign-off -->
