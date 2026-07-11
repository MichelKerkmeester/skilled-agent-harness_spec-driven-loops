---
title: "Changelog: Query-Channel Calibration and Visibility [002-speckit-memory/012-query-channel-calibration]"
description: "Migration-safe packet-local changelog index for Query-Channel Calibration and Visibility."
trigger_phrases:
  - "query-channel-calibration changelog"
  - "former 010-query-channel-calibration"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-11

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration` (Level recorded in phase evidence)
> Parent packet: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-speckit-memory`
> Historical alias: `010-query-channel-calibration`

### Summary

This migration index makes the shipped phase discoverable at its final packet-local path without rewriting its historical identity. The allowed implementation evidence records: Implemented the query-channel calibration and visibility fix.

### Added

- A packet-local changelog entry at the final phase identity.

### Changed

- Discovery now resolves `010-query-channel-calibration` to `002-speckit-memory/012-query-channel-calibration`.

### Fixed

- Closed the changelog coverage gap created when the shipped phase moved under a final root parent.

### Verification

- Read `implementation-summary.md`, `tasks.md` and `spec.md` only as changelog evidence.
- Task evidence: 27 of 27 checklist items checked in `tasks.md`.
- Migration manifest: old ID `010` maps to final ID `012`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog/002-speckit-memory/changelog-002-012-query-channel-calibration.md` | Added | Indexed the final phase path and preserved `010-query-channel-calibration` as an explicit alias. |

### Follow-Ups

- None in the allowed evidence set.
