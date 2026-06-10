---
title: "Constitutional rule review cadence and staleness diagnostic (peck T2)"
description: "Backfilled last_confirmed and last_confirmed_source frontmatter to all 13 active constitutional rules from git history. Added a read-only staleness diagnostic and documented a 180-day review cadence. No decay, boost, or search behavior changed."
trigger_phrases:
  - "constitutional rule staleness"
  - "constitutional review cadence"
  - "peck T2 teaching"
  - "constitutional-rule-staleness diagnostic"
  - "180-day constitutional review"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/004-constitutional-rule-review` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption`

### Summary

Adopted peck's T2 teaching (bounded reflection with promotion-on-recurrence) by giving constitutional rules a reviewable age. Each of the 13 active rule files now carries `last_confirmed` and `last_confirmed_source` frontmatter backfilled from `git log -1 --format=%cs`. A standalone Node diagnostic lists active rules sorted by staleness with a `review_by` deadline. The memory reference documents a 180-day review cadence. No constitutional rule's decay exemption, search boost, or always-surface behavior was changed.

### Added

- `scripts/constitutional-rule-staleness.cjs`: read-only diagnostic listing active rules by age with `review_by` and status columns.
- `last_confirmed` and `last_confirmed_source: "git-log-last-touch"` frontmatter to all 13 active constitutional rule files.
- 180-day review cadence documentation in `references/memory/memory_system.md`.

### Changed

- None to runtime behavior. The 13 constitutional rule files received metadata additions only.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `node --check scripts/constitutional-rule-staleness.cjs` | PASS |
| Diagnostic run output | PASS: listed 13 rules with dates, age, review_by, status, source, and file |
| Read-only proof | PASS: post-run git status shows only intended constitutional metadata edits |
| Review cadence documented | PASS: memory reference documents 180-day cadence and human-only action |
| Strict phase validation | PASS (RESULT: PASSED, 0 errors, 0 warnings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/constitutional/*.md` (13 files) | Modified | Added `last_confirmed` and `last_confirmed_source` frontmatter |
| `.opencode/skills/system-spec-kit/scripts/constitutional-rule-staleness.cjs` | Created | Read-only staleness diagnostic |
| `.opencode/skills/system-spec-kit/references/memory/memory_system.md` | Modified | Documented 180-day review cadence and diagnostic command |

### Follow-Ups

- This phase informs retirement decisions only. It does not change the constitutional tier's decay exemption or boost.
- No automatic retirement is implemented. Stale output is a review signal for a human to act on.
