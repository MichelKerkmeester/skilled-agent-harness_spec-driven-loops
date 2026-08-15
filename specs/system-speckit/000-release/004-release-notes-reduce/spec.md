# Phase 004 — Reduce → Release Notes (Opus, this session)

> Charter only. Full narrative in `../plan.md` §4 Phase 4.

## Goal

Assemble the shipped, public-facing `release-notes-v4.0.0.0.md`.

## Inputs

- Phase-2 per-packet fragments (~54).
- Phase-3 cross-cutting themes + breaking-changes cross-cut.
- Tone/format template: existing spec-kit changelogs (v3.7–v3.9).

## Structure (operator decisions, 2026-08-14)

- **One consolidated `release-notes-v4.0.0.0.md`** covering `v3.6.0.0 → v4.0.0.0` (Decision 4).
- **Two-tier (Decision 3):** user-facing sections + highlights + breaking changes on top;
  a `## Appendix: Internal & developer changes` enumerating `z_archive/*` + internal
  benchmark/tooling packets in full below.

## Steps

1. Merge fragments + themes into the 8 user-facing sections + the internal appendix.
2. Write headline highlights + the 4 breaking changes + upgrade/migration notes.
3. **Format via the repo's sk-doc changelog packet** (matches 370+ existing entries). Do not hand-roll.

## Model

Capable model (this Opus session) writes the prose. Cheap models only gathered.

## Exit criteria

- `release-notes-v4.0.0.0.md` covers all 8 user-facing sections + breaking changes + upgrade notes
  + a complete internal appendix.
- Format passes the sk-doc changelog validator.
- No net-zero churn leaked into the public cut; internal items live in the appendix, not the top.
