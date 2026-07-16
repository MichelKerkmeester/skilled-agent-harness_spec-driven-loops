---
title: "Phase Parent Rollup: peck teachings adoption"
description: "Rollup of 7 child phase changelogs under 001-peck-teachings-adoption. Spans 2026-06-05 to 2026-06-10. Detail lives in the child changelogs."
trigger_phrases:
  - "001-peck-teachings-adoption rollup"
  - "001-peck-teachings-adoption phase parent"
  - "peck teachings adoption changelog index"
  - "peck T1 T2 T3 T4 adoption"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption` (Level 1, Phase Parent)

### Summary

This phase parent groups 7 child phases spanning 2026-06-05 to 2026-06-10. Each child shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

The seven phases adopted all four peck teachings (T1-T4) plus three additional verification-discipline slices (T5-T9 from the peck source-pass) into system-spec-kit. The sequence was: analysis (001), template self-check guidance (002), current-state advisory rule (003), constitutional review cadence (004), reviewer benchmark substrate (005), verification discipline across the agent roster and validator (006), and acceptance-criteria coverage gate (007).

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-001-001-001-peck-teachings-for-spec-kit.md](./changelog-001-001-001-peck-teachings-for-spec-kit.md) | 2026-06-05 | Peck teachings analysis report for system-spec-kit |
| [changelog-001-001-002-self-check-templates.md](./changelog-001-001-002-self-check-templates.md) | 2026-06-10 | Self-check and failure-mode guidance in manifest templates (peck T3) |
| [changelog-001-001-003-current-state-discipline.md](./changelog-001-001-003-current-state-discipline.md) | 2026-06-10 | Advisory CURRENT_STATE_DISCIPLINE validation rule (peck T4) |
| [changelog-001-001-004-constitutional-rule-review.md](./changelog-001-001-004-constitutional-rule-review.md) | 2026-06-10 | Constitutional rule review cadence and staleness diagnostic (peck T2) |
| [changelog-001-001-005-reviewer-prompt-benchmark-substrate.md](./changelog-001-001-005-reviewer-prompt-benchmark-substrate.md) | 2026-06-10 | Reviewer-prompt benchmark substrate for deep-improvement Lane B |
| [changelog-001-001-006-peck-verification-discipline.md](./changelog-001-001-006-peck-verification-discipline.md) | 2026-06-10 | Peck verification discipline: read-budget, escalation, anti-softening, and completion-freshness gate |
| [changelog-001-001-007-acceptance-coverage-gate.md](./changelog-001-001-007-acceptance-coverage-gate.md) | 2026-06-10 | Opt-in acceptance-criteria coverage gate (peck T1, source pass) |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None.

### Verification

- All 7 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `001-peck-teachings-adoption/` (child phases) | n/a | Rollup of 7 child phase changelogs; no direct source changes at the parent level |

### Follow-Ups

- AC-format normalization in shared manifest templates (`spec.md.tmpl`, `checklist.md.tmpl`) remains deferred. It was outside the approved write paths for the acceptance-coverage-gate phase.
- `CONTINUITY_FRESHNESS` and `AC_COVERAGE` are both default-off. Promotion to active enforcement requires separate decisions.
