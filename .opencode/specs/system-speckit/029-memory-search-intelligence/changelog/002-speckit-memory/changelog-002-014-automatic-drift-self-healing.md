---
title: "Changelog: Automatic Drift Self-Healing [002-speckit-memory/014-automatic-drift-self-healing]"
description: "Migration-safe packet-local changelog index for Automatic Drift Self-Healing."
trigger_phrases:
  - "automatic-drift-self-healing changelog"
  - "former 011-automatic-drift-self-healing"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-11

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing` (Level recorded in phase evidence)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/002-speckit-memory`
> Historical alias: `011-automatic-drift-self-healing`

### Summary

This migration index makes the shipped phase discoverable at its final packet-local path without rewriting its historical identity. The allowed implementation evidence records: Implemented a default-off capability flag, SPECKIT_QUERY_TIME_EXISTENCE_FILTER, for the hot memory_search path. When enabled, final top-k rows whose backing file_path no longer exists are filtered from the response and added to a config-table suspect queue. The query path does not delete rows; deletion is deferred until a later scan confirms the absence.

### Added

- A packet-local changelog entry at the final phase identity.

### Changed

- Discovery now resolves `011-automatic-drift-self-healing` to `002-speckit-memory/014-automatic-drift-self-healing`.

### Fixed

- Closed the changelog coverage gap created when the shipped phase moved under a final root parent.

### Verification

- Read `implementation-summary.md`, `tasks.md` and `spec.md` only as changelog evidence.
- Task evidence: 42 of 43 checklist items checked in `tasks.md`.
- Migration manifest: old ID `011` maps to final ID `014`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog/002-speckit-memory/changelog-002-014-automatic-drift-self-healing.md` | Added | Indexed the final phase path and preserved `011-automatic-drift-self-healing` as an explicit alias. |

### Follow-Ups

- Evidence gap: tasks.md records 42 of 43 checklist items checked. This index does not upgrade completion status.
