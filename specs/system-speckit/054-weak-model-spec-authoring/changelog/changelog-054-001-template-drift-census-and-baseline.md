---
title: "Changelog: Phase 1: template-drift-census-and-baseline [054-weak-model-spec-authoring/001-template-drift-census-and-baseline]"
description: "Chronological changelog for the Phase 1: template-drift-census-and-baseline phase."
trigger_phrases:
  - "weak model spec authoring template drift census and baseline changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 001 produced the verified defect ledger and the first authoring baseline that phases 002 to 009 consume. That first baseline was three Level 2 runs on DeepSeek V4.1 Flash, and a Level 3 rebaseline on cli-devin swe-2-max later replaced it.

### Added

- A defect ledger of 72 rows, each with an evidence command that reproduces on the start commit, covering 18 leaked example descriptions and the five confirmed defects.
- Three census lanes over the templates, examples and references, with a coverage check and a deterministic reduce that keeps only rows that reproduce.
- A three-run authoring baseline with five metrics per run, and a hint list for later comparison.
- A frontier review of the ledger with 47 findings, each recorded in the phase goal log.

### Changed

- Two ledger rows changed after review: `L-C-003` was removed as a false positive and `L-C-013` had its expected text corrected.

### Fixed

- No product file changed in this phase. The 45 other review findings were recorded for the owner phases instead of applied here.

### Verification

- Strict validation of this phase folder: RESULT: PASSED
- Ledger: 72 rows, 0 schema failures, 72 of 72 evidence commands reproduce
- Baseline: 3 runs, each with 6 keys
- Review disposition: 47 findings, 47 recorded lines
- Suite: finished with exit=0

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md` | Modified | Phase plan, tasks and close-out evidence |
| `graph-metadata.json` | Modified | Refreshed derived metadata after the source-doc edits |

### Follow-Ups

- Three runs detect only large effects, so later phases report a minimum and a maximum instead of a significance claim.
- 45 review findings are recorded, not applied. They need owner-phase decisions or exact replacement text.
- The Level 2 DeepSeek baseline is history. The packet compares against the Level 3 cli-devin swe-2-max baseline.
