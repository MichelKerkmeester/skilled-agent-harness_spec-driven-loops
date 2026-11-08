---
title: "Implementation Summary: Review Follow-ups"
description: "Every spec-kit tool now gives the same answer about what is a sub-track and what its packets are, archive.sh creates a missing sub-track metadata file, and two messages say what happened. Each fix sits behind a test that fails on the old code."
trigger_phrases:
  - "review follow ups implementation summary"
  - "sub-track track segment alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos/006-review-follow-ups"
    last_updated_at: "2026-11-08T05:33:40Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 006 follow-ups fixed and tested"
    next_safe_action: "Commit and push main"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/subtrack-predicate-parity.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh"
    session_dedup:
      fingerprint: "sha256:8382b3354d4c633b961eb6e9ba22dcda9af405ec8a2c9dd92e611b562ef6f15e"
      session_id: "scaffold-006-review-follow-ups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-review-follow-ups |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A declared sub-track now exists for every tool or for none. Before, a declared folder under a numbered, hidden, `node_modules` or packet-shaped track could be a packet's parent for the repair while the reader ignored it, and a `z_*` track was a track to the reader but an archive to everything else.

### Phase 6: review-follow-ups

The track reader's name rule is the reference: a track or sub-track is not hidden, not `node_modules`, not `z_*`, not a packet number, and has no `spec.md`. The parser, `repair-derived.cjs`, `validate.sh` and the orchestrator now check that rule for the track as well as for the sub-track. `archive.sh` refreshes a sub-track whose metadata is missing, which creates the file, so an archive no longer leaves the pre-push gate blocked. `validate.sh` lists `003` and `002_name` sub-track packets, matching the reader. A refusal shows `--track 'demo/undeclared/'` as typed, and the sweep says a sub-track's metadata is missing rather than unreadable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modified | One name rule for both levels, `z_*` excluded |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modified | The sub-track check also checks its track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | The same |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | Refuses a sub-track in an archive, hidden or `node_modules` track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | The same refusal, and the sub-track packet glob |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Creates missing sub-track metadata; anchored `track_of` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Refusals print the typed value |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | "missing" for an absent file |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/subtrack-predicate-parity.vitest.ts`, `validate-subtrack.vitest.ts`, `create-track-containment.vitest.ts`, `track-roots.vitest.ts` | Modified | Five new cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The five cases were written first. Then each consumer was fixed and the cases run green. To prove they can fail, the code patch alone was reverse-applied with the tests kept, the runtime rebuilt, and the cases run red (`scratch/red.log`), then the patch reapplied. The full cli and core suites ran last.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The reader stops reading a `z_*` track (D-006a) | The parser, `archive.sh` and the reader's own header already called `z_*` an archive, and no `specs/z_*` folder exists, so moving the one outlier changes nothing real |
| The `validate.sh` track check went into the sub-track test only | `is_track_root_folder` also exempts flat tracks from packet rules, and a stricter check there would change flat-track validation |
| Left the phase-child globs in `validate.sh` alone | They find phases inside a packet, not packets inside a track, and predate sub-tracks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New cases on the pre-phase code | FAIL as intended: `Tests 5 failed | 49 passed (54)`; the track-segment case listed 8 mismatches (`scratch/red.log`) |
| Touched test files on the new code | PASS: `Test Files 6 passed (6)`, `Tests 85 passed (85)` |
| Full cli project | PASS: `Test Files 199 passed | 3 skipped (202)`, `Tests 2375 passed | 20 skipped (2395)`, 0 failed; before this phase 2,370 passed, so the five new cases are the difference |
| Root vitest project | PASS: `Test Files 112 passed | 3 skipped (115)`, `Tests 1400 passed | 13 skipped (1413)`, 0 failed |
| Runtime core suite (`vitest run` in `runtime/`) | PASS: `Test Files 283 passed | 3 skipped (286)`, `Tests 4243 passed | 21 skipped (4264)`, 0 failed, the same totals as before this phase |
| Strict recursive validation of 044 | PASS: `RESULT: PASSED` for the parent and all six phases |
| Runtime build | PASS, `npm run build` exit 0 |
| Shell syntax | PASS, `bash -n` on `create.sh`, `archive.sh`, `validate.sh` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rule is still copied, not shared.** Six files in three languages hold their own copy. The parity test is what keeps them equal, so a new consumer must be added to it.
<!-- /ANCHOR:limitations -->

---
