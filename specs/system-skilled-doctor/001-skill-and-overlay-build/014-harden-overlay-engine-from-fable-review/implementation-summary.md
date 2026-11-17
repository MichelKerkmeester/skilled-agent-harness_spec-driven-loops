---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "harden overlay engine from fable review implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review"
    last_updated_at: "2026-11-17T05:13:18Z"
    last_updated_by: "generate-context"
    recent_action: "Built the last engine fixes, updated the overlay docs and wrote the Barter handover"
    next_safe_action: "Commit, merge origin/main, rerun the suite"
    packet_purpose: "Purpose: Every json-entry difference the records cannot see is reported, and no failed run, missing checkout, malformed file or interrupted write leaves the engine silent or stuck."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/handover-to-barter.md"
    session_dedup:
      fingerprint: "sha256:93b76608dc08fb6815e353cd575a06393bb66e296bc80e262c9f5298ae2148b2"
      session_id: "scaffold-014-harden-overlay-engine-from-fable-review"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "6ad5889a-15be-4f0a-adad-59b8e4427b3f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-17T05:13:18Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| **Spec Folder** | 014-harden-overlay-engine-from-fable-review |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overlay engine no longer goes quiet when a run fails halfway, a checkout is missing or a file is broken. A failed regenerate step now leaves its records behind and runs again on the next apply, and `status` prints a `NOTE` line for every check it skipped and every value no record covers.

### Phase 14: harden-overlay-engine-from-fable-review

You get nine of Fable's ten review items. Apply records the destinations it wrote before any regenerate step runs, so a later drop still removes what that run added. When a step fails, the state says so and the next apply runs the steps again. The state file moves to schema version 2, a version 1 file still loads, and a record without a valid path is refused with a fix. A dropped key the record does not mark as added is refused instead of deleted. The state file and the manifest are written through a temporary file and a rename.

`status` now names what it cannot check. A missing checkout, or one that lacks the pinned commit, prints a note naming the stale root-file check, the json-entry cross-check, or both. Each `setKeyOnItem`, `insertObjectKeys` and indexed `set` gets a note naming its target. An in-sync json-entry destination that differs from its entry set applied to the pinned copy gets a cross-check note, unless a regenerate step lists that file in its `outputs`. A relative `pin.checkout` is read from the tree root, and a malformed entry set blocks only its own overlay.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The nine fixes, the notes and the cross-check |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Tests for each item |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | A manifest write that fails at the rename |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The state version, the refused drop, the notes, the rerun and the atomic writes |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | The `NOTE` line, the skipped stale check and the rerun advice |
| `.skilled/commands/doctor/assets/doctor-overlay-status.yaml`, `doctor-overlay-apply.yaml` | Modified | The `NOTE` prefix and the rerun |
| `handover-to-barter.md` | Created | What a Barter re-pin to this phase changes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The suite printed 1220 tests and fail 0 on the unchanged engine. Each engine change started with a test that failed on that engine: the first eleven failed together (tests 65, fail 11), and the later four failed at their own assertions before the code changed. A read-only `status` on Barter's tree, with this engine and with Barter's own, came back `RESULT: PASSED` both times. That run turned up two false cross-check lines and two pairs of identical notes, and the operator chose the fix for each. The final suite printed 1234 tests, fail 0, and the quality gate printed 0 findings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A dropped key with no `added: true` mark is refused, not deleted | The record cannot tell a person's key from an older engine's, and a hand delete is cheap to undo while a wrong delete is not |
| State schema version 2, with version 1 still read | An older engine fails loudly on the new shape instead of dropping the new records without a word |
| The cross-check only reports | It is new, and a report can be wrong without damaging a tree |
| The cross-check skips declared regenerate outputs | A step rewrites its outputs after the entry sets apply, so the pinned copy says nothing about them; Barter showed the false lines |
| No code change for a relative checkout under `repin --stage` | A re-pin reads only its `--upstream` checkout, so the manifest's `pin.checkout` is never read there |
| `overlay-engine-repin.test.cjs` stays unchanged | The cross-check runs in `status` only, so a re-pin prints nothing new |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline suite on the unchanged engine | PASS: tests 1220, fail 0 |
| Red run of the new sync tests on the unchanged engine | Expected FAIL: tests 65, fail 11, each at its own assertion |
| Item 4 note with the commit check removed | Expected FAIL, then PASS with it restored |
| Cross-check and note-wording tests before the change | Expected FAIL: four tests at their own assertions |
| `node --test .skilled/commands/doctor/scripts/tests` | PASS: tests 1234, pass 1234, fail 0, exit 0 |
| `quality-gate.cjs --worktree` | PASS: 0 findings, exit 0 |
| Barter `status`, this engine against Barter's | PASS: both `RESULT: PASSED`, state file hashes and git status unchanged |
| `git diff 969335a6380 HEAD -- overlay-engine.cjs` before this phase's edits | Empty, so every change here was measured against `969335a6380` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A declared regenerate output gets no cross-check.** A value a dropped `setKeyOnItem` left in such a file is not reported. Remove it by hand when you drop the operation.
2. **The untracked operations still leave their values behind.** The notes report this and do not undo it.
3. **The manifest-write test never failed first.** The writers already used the rename when it was written. It covers one of the three manifest writers; the other two call the same function.
<!-- /ANCHOR:limitations -->

---
