---
title: "Implementation Summary: Metadata Write Safety"
description: "Refresh safely refuses symlinked graph metadata and seeds missing declared sub-track metadata so the track-root sweep can repair it."
trigger_phrases:
  - "metadata write safety implementation"
  - "refresh track roots symlink guard"
  - "missing sub-track metadata seed"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-metadata-write-safety |
| **Completed** | 2026-11-07 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Refresh now checks metadata paths with `lstat` before writing, so `--apply` refuses symlinked graph metadata without changing its target. It also seeds a missing metadata file for a declared sub-track, letting the sweep's printed repair clear the block while malformed existing files remain untouched.

### Metadata Write Safety

The shared write site protects top-level tracks and sub-tracks. When a declared sub-track has no metadata file, `--apply` writes the minimal track-root shape with its current packet children; the sweep then reports that the track roots match.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modified | Refuses metadata symlinks and seeds missing declared sub-track metadata. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Modified | Adds red-first coverage for sub-track and top-level symlinks, missing metadata repair, and invalid JSON preservation. |
| `description.json` | Modified | Refreshes this phase's generated description and level metadata. |
| `graph-metadata.json` | Modified | Refreshes this phase's derived synopsis and source fingerprint. |
| `spec.md` | Modified | Records the operator decisions and completion status. |
| `plan.md` | Modified | Records completed quality gates and verification evidence. |
| `tasks.md` | Modified | Marks the ordered implementation tasks complete with evidence paths. |
| `scratch/` | Created | Holds the baseline, red/green regression logs, and verification outputs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I added and ran the symlink and missing-file regressions before changing the writer, saved their failing output, then implemented the guard and seed. The runtime build, required 11-file CLI suite, focused regressions, doctor tests, and code-quality checks passed; strict packet validation printed `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cover both top-level tracks and sub-tracks with the same `lstat` guard. | The writer is shared, so the single check closes both symlink write paths without splitting behavior by track level. |
| Seed missing sub-track metadata only on `--apply`. | The sweep already points operators to this command; seeding there makes that repair work while dry runs remain read-only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime build | PASS, `npm run build`, exit 0 (`scratch/build.log`). |
| Focused metadata regressions | PASS, 4 passed, 0 failed, exit 0 (`scratch/green-final-metadata-safety.log`). |
| Red-then-green proof | PASS, symlink failures in `scratch/red-t004-subtrack-symlink.log` and `scratch/red-t005-top-level-symlink.log` became green; the missing-file failure in `scratch/red-t007-isolated-missing-subtrack.log` is covered by the green seed/sweep test in `scratch/green-t009-isolated-seed.log`. |
| Required CLI suite | PASS, 11 files and 194 tests passed, 0 failed, exit 0; baseline was 190 tests, so the four new cases account for the increase (`scratch/final-cli-suite-status.log`). |
| Unchanged refresh/archive coverage | PASS, `create-track-refresh` 20 passed and `archive-track` 60 passed, matching baseline (`scratch/refresh-archive-final.json`). |
| Track-root coverage | PASS, 23 passed, 0 failed; baseline was 19 (`scratch/track-roots-final.json`). |
| Doctor symlink tests | PASS, 51 passed, 0 failed, exit 0 (`scratch/doctor-tests.log`). |
| Strict packet validation | PASS, `RESULT: PASSED`, exit 0, 0 errors (`scratch/strict-validation-final.log`); two continuity warnings remain because the canonical save writer also updates parent graph metadata outside this phase's scope. |
| Code quality gate | PASS, `NO_BLOCKER_FOUND`, no findings or unverified files. |
| SKILLED drift guards | PASS, all four guards; 11 non-blocking warnings were reported in unrelated existing files. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only declared sub-tracks are seeded.** The track reader does not surface a top-level folder without metadata, so this change cannot repair an absent top-level metadata file.
2. **Canonical continuity is not written in this phase.** The save writer would also update the phase parent's graph metadata, outside the frozen file scope; the Level 1 example remains valid without that block, though strict validation reports the omission as a warning.
<!-- /ANCHOR:limitations -->
