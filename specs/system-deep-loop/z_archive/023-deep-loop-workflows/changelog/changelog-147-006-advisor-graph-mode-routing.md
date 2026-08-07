---
title: "Changelog: Advisor graph mode-routing collapse [147-deep-loop-workflows/006-advisor-graph-mode-routing]"
description: "Chronological changelog for the advisor graph mode-routing collapse phase."
trigger_phrases:
  - "phase changelog"
  - "advisor graph"
  - "mode routing"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/deep-loops/029-deep-loop-workflows/006-advisor-graph-mode-routing` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/029-deep-loop-workflows`

### Summary

This phase collapsed advisor graph routing from five `deep-*` skill IDs into one `deep-loop-workflows` node. A mode-alias and discriminator layer preserved concrete mode selection. The family correction happened first, so the advisor never failed closed while the graph moved.

### Added

- None.

### Changed

- Migrated the advisor graph and scorer surface from five `deep-*` skill IDs to one `deep-loop-workflows` skill plus a mode-alias and discriminator layer.
- Performed the family correction first so routing never failed closed mid-migration.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Explicit verification | NOT RECORDED: No explicit verification was recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| N/A | N/A | No file-level detail recorded. |

### Follow-Ups

- CHK-001 Predecessor: phase 005 green and continuity read.
- CHK-002 Phase-001 parity baseline available.
- CHK-010 Edits stay in this phase's frozen scope, with no adjacent cleanup.
- CHK-011 Changes follow existing project conventions.
- CHK-020 `family=deep-loop` for `deep-ai-council`, `deep-improvement` and the merged node.
- CHK-021 Both routing-parity fixtures assert `deep-loop-workflows` and concrete mode. Vitest green.
