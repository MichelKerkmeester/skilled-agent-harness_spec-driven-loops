---
title: "Changelog: Drift-Marker Native Consolidation [002-speckit-memory/031-drift-marker-native-consolidation]"
description: "Migration-safe packet-local changelog index for Drift-Marker Native Consolidation."
trigger_phrases:
  - "drift-marker-native-consolidation changelog"
  - "former 022-drift-marker-native-consolidation"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-11

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation` (Level recorded in phase evidence)
> Parent packet: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-speckit-memory`
> Historical alias: `022-drift-marker-native-consolidation`

### Summary

This migration index makes the shipped phase discoverable at its final packet-local path without rewriting its historical identity. The allowed implementation evidence records: The embedded git-hook writer was replaced with a compiled TypeScript entrypoint at scripts/git-hooks/drift-marker-write.ts. It parses the unchanged environment payload, delegates DB path resolution, deduplication, atomic writes, and lock reclaim through the public MCP API, and catches operational errors so the hook remains non-fatal.

### Added

- A packet-local changelog entry at the final phase identity.

### Changed

- Discovery now resolves `022-drift-marker-native-consolidation` to `002-speckit-memory/031-drift-marker-native-consolidation`.

### Fixed

- Closed the changelog coverage gap created when the shipped phase moved under a final root parent.

### Verification

- Read `implementation-summary.md`, `tasks.md` and `spec.md` only as changelog evidence.
- Task evidence: 29 of 29 checklist items checked in `tasks.md`.
- Migration manifest: old ID `022` maps to final ID `031`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog/002-speckit-memory/changelog-002-031-drift-marker-native-consolidation.md` | Added | Indexed the final phase path and preserved `022-drift-marker-native-consolidation` as an explicit alias. |

### Follow-Ups

- None in the allowed evidence set.
