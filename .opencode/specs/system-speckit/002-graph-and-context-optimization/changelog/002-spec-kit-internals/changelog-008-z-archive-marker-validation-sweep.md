---
title: "Template Levels Phase 010/008: z_archive marker validation sweep"
description: "Validated SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers in z_archive/ directories after the greenfield template migration. Confirmed archive markers are correct as historical provenance. No corrections needed beyond confirming the ADR-005 indefinite support policy applies."
trigger_phrases:
  - "phase 010/008 changelog"
  - "z_archive marker validation"
  - "archive marker sweep"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels` (Level 3)
> Parent packet: `002-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Phase 008 swept the `z_archive/` directories for SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers after the greenfield template migration. Archive folders contain historical spec-folder snapshots that are no longer actively maintained but must remain readable. The sweep confirmed that all archive markers reference valid historical template paths and fall under the ADR-005 indefinite support policy: their SPECKIT_TEMPLATE_SOURCE markers remain descriptive provenance, and the validator does not enforce marker presence or current-path resolution on archived folders.

The spec.md is scaffolded but unfilled (template placeholders remain). The actual work was performed via cli-copilot (Options A+B).

### Added

- Archive marker audit results recorded in the implementation summary.
- Confirmed ADR-005 indefinite support policy applies to all `z_archive/` marker references.

### Changed

- No corrections were needed. Archive markers are correct as historical provenance.

### Fixed

- Nothing required fixing. All archive markers validate correctly under the provenance-only policy.

### Verification

- `validate.sh --strict` passes on archive folders with provenance-only validation mode.
- Stale marker grep confirms zero actionable issues in `z_archive/` directories.
- Workflow-invariance test remains green.

### Files Changed

| File | What changed |
|------|--------------|
| No files changed | Archive markers confirmed correct as historical provenance |

Two commits: `a5f06d201a`, `7beb807694`.

### Follow-Ups

- None. The template-levels track is complete through this sweep.