---
title: "Peck teachings analysis report for system-spec-kit"
description: "Deep-research analysis of gytis-ivaskevicius/peck extracted four transferable teachings (T1-T4) with verified citations, ranked by gap-value and risk, and an explicit anti-teachings section. No spec-kit behavior was changed."
trigger_phrases:
  - "peck teachings analysis"
  - "peck spec-kit gap report"
  - "T1 T2 T3 T4 peck teachings"
  - "peck anti-teachings"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-05

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption`

### Summary

Five deep-research iterations mapped the external `gytis-ivaskevicius/peck` repo against system-spec-kit. The deliverable is `peck-teachings-analysis.md`, a decision-ready report that separates four philosophy-neutral mechanisms worth borrowing (T1-T4) from peck's minimalist philosophy, which would gut spec-kit if imported wholesale. Every claim cites a verified peck file and line plus a resolving spec-kit path. An anti-teachings section names what to reject. No spec-kit code, template, or validation rule was modified.

### Added

- `peck-teachings-analysis.md`: full analysis report covering T1 (AC-as-assertions plus mechanical coverage gate), T2 (bounded reflection with promotion-on-recurrence), T3 (self-check and failure-modes in templates), T4 (current-state-only discipline generalized beyond phase parents), anti-teachings, adoption sequencing, and source map.
- Level 1 spec folder: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.

### Changed

- None. This leaf is analysis-only. No spec-kit source files were modified.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | PASS (Errors: 0, Warnings: 0; v3.0.0) |
| Peck quotes verified against `/tmp/peck` source | PASS |
| spec-kit cited paths resolve | PASS |
| Report has all required sections | PASS |
| No spec-kit source modified | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `001-peck-teachings-for-spec-kit/peck-teachings-analysis.md` | Created | Primary deliverable: the teachings report |
| `001-peck-teachings-for-spec-kit/spec.md` | Created | Level 1 feature specification |
| `001-peck-teachings-for-spec-kit/plan.md` | Created | Implementation plan |
| `001-peck-teachings-for-spec-kit/tasks.md` | Created | Task breakdown |
| `001-peck-teachings-for-spec-kit/implementation-summary.md` | Created | Completion summary |

### Follow-Ups

- Effort and risk estimates are qualitative. Per-teaching spec folders would size each one if adoption is pursued.
- T1's `AC_COVERAGE` rule needs a warn-only rollout and per-level opt-in before it can safely gate completion. Adopted in leaf 007.
