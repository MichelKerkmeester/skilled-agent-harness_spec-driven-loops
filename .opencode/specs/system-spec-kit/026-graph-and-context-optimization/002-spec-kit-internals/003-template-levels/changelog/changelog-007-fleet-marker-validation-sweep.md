---
title: "Template Levels Phase 010/007: Fleet marker validation sweep"
description: "Validated SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers across all spec folders in the fleet. Corrected markers that referenced deleted level directories or stale template paths. Ensured all folders validate cleanly under strict mode after the greenfield template system migration."
trigger_phrases:
  - "phase 010/007 changelog"
  - "fleet marker validation"
  - "SPECKIT_LEVEL marker sweep"
  - "SPECKIT_TEMPLATE_SOURCE sweep"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold` (Level 3)
> Parent packet: `026-graph-and-context-optimization/008-template-levels`

### Summary

Phase 007 swept all spec folders in the repository for SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers that referenced deleted template directories (`level_1/`, `level_2/`, `level_3/`, `level_3+/`, `core/`, `addendum/`) or stale composition paths. After the greenfield migration (phases 003-004), these markers pointed to paths that no longer exist on disk. The sweep corrected markers where needed and confirmed that `spec-kit-docs.json` now serves as the single source of truth for template resolution, while existing SPECKIT_TEMPLATE_SOURCE markers remain valid as descriptive provenance per ADR-005.

The spec.md in this phase is scaffolded but unfilled (still contains template placeholders). The actual work was performed via an automated sweep using cli-copilot (Options A+B).

### Added

- Fleet-wide marker correction results recorded in the implementation summary.
- Confirmed that existing `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` markers remain valid as descriptive provenance comments per ADR-005 indefinite support policy.

### Changed

- Fleet markers corrected where they referenced deleted template directory paths.
- Validation rules updated to treat SPECKIT_TEMPLATE_SOURCE as descriptive provenance, not resolver keys.

### Fixed

- Spec folders with stale template source markers now validate cleanly under `validate.sh --strict`.
- Markers that previously pointed to `level_N/` composition paths now validate against the manifest-backed contract.

### Verification

- `validate.sh --strict` passes across all existing spec folders.
- Stale marker grep confirms zero references to deleted level directories outside historical fixtures.
- Workflow-invariance test remains green.

### Files Changed

| File | What changed |
|------|--------------|
| Fleet spec folder markers (multiple) | SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers corrected |
| Validation scripts | Treat SPECKIT_TEMPLATE_SOURCE as provenance per ADR-005 |

Two commits: `30024e3bed`, `79e97aec92`.

### Follow-Ups

- **Phase 008 (z_archive marker sweep).** Validate and clean archive markers in `z_archive/` directories.