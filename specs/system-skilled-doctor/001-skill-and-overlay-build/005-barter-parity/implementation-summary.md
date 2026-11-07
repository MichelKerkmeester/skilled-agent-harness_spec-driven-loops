---
title: "Implementation Summary"
description: "The overlay engine now reads a real vendoring project's overlay folder: a protected file blocks only its own entry, a re-pin copies .dsh and lists the upstream changes it leaves out, and Barter's tree passes the upstream /doctor:overlay status."
trigger_phrases:
  - "barter parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity"
    last_updated_at: "2026-11-07T23:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reran every gate from the final state and staged a re-pin of Barter onto the fix commit"
    next_safe_action: "Operator decisions in scratch/morning-decisions.md"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "b2bc3af2-2d66-4d13-9d70-784e628579d2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-barter-parity |
| **Status** | Complete |
| **Completed** | 2026-11-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that copies Skilled in and keeps its own overlay folder can now use `/doctor:overlay` without moving a file. Barter's tree went from `status` exiting 2 on a manifest it could not find to `checked=132 ok=132 miss=0` and `RESULT: PASSED`, with Barter's own fork still passing beside it.

### Phase 5: barter-parity

A token-named file the engine may not read used to stop the whole report, so one file hid every other overlay's state. Now it blocks only its own entry, and the `MISS` line tells you what to add to that entry's `protectedPaths`. A re-pin now copies `.dsh` with the other runtime folders. It lists every upstream change it deliberately leaves out, such as a new `AGENTS.md` or a path under `repin.exclude`, instead of dropping it without a word. A stage says how many regenerate and verify steps it skipped, so a clean stage no longer reads as a full rehearsal. When the overlay folder cannot be found, the error tells you to name it in `.skilled-overlays.json`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Per-entry protected-path block, re-pin refusal over a blocked entry, `.dsh` default, not-copied list, stage-skip line, setting-aware error |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modified | The protected-path tests now assert the per-entry contract |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Three new re-pin tests and the stage-skip assertion |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | The missing-manifest error with and without the setting |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modified | The stage invariant says what a stage skips |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | Plan lines, a refusal row and four troubleshooting rows |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Modified | Points a vendoring project at `/doctor:overlay` |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Three adoption phrases on the read-only `status` route |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Modified | Regenerated from the routes |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modified | Regenerated from the routes |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Per-entry refusal, re-pin copy set and not-copied list, adoption section |
| `README.md` | Modified | §5 names the re-pin copy set, the not-copied list and adoption |
| Barter `skilled/.skilled-overlays.json` | Created | Names `barter-overlays`; untracked in Barter, not committed |
| Barter `skilled/barter-overlays/overlay-manifest.json` | Modified | `protectedPaths` on `repo-frontend` and a `repin` block; untracked in Barter, not committed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A five-iteration deep-research run on pi with DeepSeek V4.1 Flash at `--thinking max` mapped the gaps. The dsh route was out of DevPass credit. Each finding was checked against the cited engine lines before use, and a fresh Opus agent at medium effort reviewed the scope. Barter's adoption was first proven on a staged copy, then applied to the real tree after a byte-identical round-trip check and a backup. The engine changes went in one behavior at a time, each with a test. A mutation pass then removed each behavior from a copy of the engine and confirmed its test failed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A protected path blocks its entry instead of aborting | One refused file hid every other overlay's state. A plan stub with no outputs keeps the no-read guarantee, and apply already writes nothing while any entry is blocked |
| A path that escapes its root still aborts | That is a broken manifest, not one blocked overlay |
| A re-pin refuses a blocked entry before its backup | Otherwise the copy would land and the apply after it would fail, leaving a half-moved tree |
| The not-copied list skips top-level links | Barter links `specs` to its own folder, and every upstream spec change would otherwise flood the report |
| `fork-drifted`, `outsideCertificate`, Barter's regenerate pairs and the fork's retirement stay out | Each changes Barter's own behavior or every state path, so they wait for the operator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Upstream `status --root barter/ai-speckit/skilled` | PASS: `checked=132 ok=132 miss=0`, `RESULT: PASSED` (was exit 2) |
| Barter `replay.cjs --check` and `sync.cjs --status` | PASS: `checked=132 ok=132 miss=0`, `in-sync=468` |
| Doctor suite | 1,068 tests, 1,062 pass, 6 fail; the six are the agents-md failures the base commit also has (base: 1,065, 1,059, 6) |
| Mutation pass | Each of four removed behaviors fails its test; engine restored byte-identical |
| `doctor-phrase-reach.cjs` | PASS: `STATUS=OK phrases=228 bridges=35` |
| Advisor vitest suite | PASS: 160 files, 1,373 tests, 8 skipped |
| Staged re-pin of Barter onto `c29f26ded8` | PASS: exit 0, `checked=132 ok=132 miss=0`, `RESULT: STAGED`, no blocked overlay; listed `README.md` as not copied, skipped 9 regenerate and 10 verify steps, and found 8 overlays that now equal upstream |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Barter still runs its fork.** `sync.cjs` and `replay.cjs` keep the `fork-drifted` state and the `outsideCertificate` list, which the engine does not support yet. Both tools now pass on the same folder, so either can run until the operator decides.
2. **A stage cannot prove the generators.** It has no project install, so a clean stage can still fail at a regenerate step in the live run. The stage now says how many steps it skipped.
<!-- /ANCHOR:limitations -->

---
