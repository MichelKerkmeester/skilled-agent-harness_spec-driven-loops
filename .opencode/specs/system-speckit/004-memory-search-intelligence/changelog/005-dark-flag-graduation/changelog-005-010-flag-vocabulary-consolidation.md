---
title: "Changelog: Flag Vocabulary Consolidation [005-dark-flag-graduation/010-flag-vocabulary-consolidation]"
description: "Migration-safe packet-local changelog index for Flag Vocabulary Consolidation."
trigger_phrases:
  - "flag-vocabulary-consolidation changelog"
  - "former 017-flag-vocabulary-consolidation"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-11

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/010-flag-vocabulary-consolidation` (Level recorded in phase evidence)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation`
> Historical alias: `017-flag-vocabulary-consolidation`

### Summary

This migration index makes the shipped phase discoverable at its final packet-local path without rewriting its historical identity. The allowed implementation evidence records: Added parseFlagTristate(envVarName, defaultValue) to lib/search/search-flags.ts (:46-56), next to the existing isOptInEnabled() and its TRUTHY_OPT_IN set. It recognizes {true, 1, yes, on, enabled} as opt-in and a new mirrored FALSY_OPT_OUT set {false, 0, no, off, disabled} as opt-out, case-insensitively and whitespace-tolerant, returning the caller's defaultValue for unset or unrecognized input. isOptInEnabled() is re-expressed as parseFlagTristate(variableName, false) — zero behavior change, confirmed by its existing test suite passing unchanged.

### Added

- A packet-local changelog entry at the final phase identity.

### Changed

- Discovery now resolves `017-flag-vocabulary-consolidation` to `005-dark-flag-graduation/010-flag-vocabulary-consolidation`.

### Fixed

- Closed the changelog coverage gap created when the shipped phase moved under a final root parent.

### Verification

- Read `implementation-summary.md`, `tasks.md` and `spec.md` only as changelog evidence.
- Task evidence: 31 of 31 checklist items checked in `tasks.md`.
- Migration manifest: old ID `017` maps to final ID `010`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog/005-dark-flag-graduation/changelog-005-010-flag-vocabulary-consolidation.md` | Added | Indexed the final phase path and preserved `017-flag-vocabulary-consolidation` as an explicit alias. |

### Follow-Ups

- None in the allowed evidence set.
