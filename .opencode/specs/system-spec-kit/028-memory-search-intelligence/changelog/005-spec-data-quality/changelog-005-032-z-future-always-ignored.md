---
title: "Changelog: z_future Always Ignored In Backfill [005-spec-data-quality/032-z-future-always-ignored]"
description: "Chronological changelog for the z_future always ignored in backfill phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/032-z-future-always-ignored` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

A scoped fix to the graph-metadata backfill generator so its tree walk unconditionally skips the `z_future` staging area. The walk previously pruned `z_future` only under the `--active-only` flag, so a default run descended into the staging tree and the parser threw `Spec folder is not under a supported specs root` at the refresh site. The fix adds `z_future` to the walk exclusion set, corrects the header comment, and rebuilds the dist. Only `z_future` becomes unconditional, `z_archive` is deliberately left included by default and skippable via `--active-only`.

### Added

- No new additions recorded.

### Changed

- `z_future` is now in the `EXCLUDED_DIRS` set the walk consults at every directory boundary, so a default run prunes the staging area before any folder inside it reaches the refresh path.
- The header comment now states that `z_future` is always skipped while `z_archive` stays included by default and skippable via `--active-only`.
- The compiled dist was rebuilt via tsc so the runtime output carries the same exclusion as the source.

### Fixed

- A default backfill no longer crashes on the staging area. Handing `z_future` to the parser threw the not-a-supported-specs-root error, now unreachable because the walk skips `z_future`. The same descent no longer over-reaches into a tree the generator was never meant to touch.

### Verification

- `collectSpecFolders('.opencode/specs')` returns zero `z_future` folders and raises no error, where it previously threw.
- `z_archive` parity is preserved, 858 folders included by default and zero under `--active-only`.
- A default `backfill --dry-run` exits 0 with no `z_future` or supported-specs-root mention in its output.
- The rebuilt dist carries `z_future` in the exclusion set, matching the corrected source.
- `validate.sh --strict` on this phase exits clean.

### Files Changed

- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`: added `z_future` to `EXCLUDED_DIRS` and corrected the header comment.
- `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`: rebuilt the dist from the corrected source via tsc.

### Follow-Ups

- Add a `z_future`-exclusion case to `.opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`, which covers `z_archive` inclusion but has no `z_future`-exclusion test.
- Check whether other generators that walk the specs tree share the same default-enters-`z_future` shape and need the same guard.
