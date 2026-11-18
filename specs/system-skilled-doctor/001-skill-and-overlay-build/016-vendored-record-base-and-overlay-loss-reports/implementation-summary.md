---
title: "Implementation Summary"
description: "Record-base now runs from a project root where .skilled is a symlink into a vendored subfolder and it can record a commit pin. Overlay re-pins now name the upstream items and files they would drop, where they dropped them without a word before."
trigger_phrases:
  - "vendored record base and overlay loss reports implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/016-vendored-record-base-and-overlay-loss-reports"
    last_updated_at: "2026-11-18T08:30:31Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed record-base vendored layout and overlay-engine loss reports"
    next_safe_action: "Verify the operator yes, then commit worktree 472"
    packet_purpose: "Purpose: Success means `record-base` works in that layout, can record a framework commit that falls between release tags and reports every upstream content loss on re-pin, except the paths an overlay removes by design."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/assets/doctor-overlay-repin.yaml"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:b8fe95a77b62c8fa38c0614d78236771452ee163c1a899193a7328f13b752197"
      session_id: "scaffold-016-vendored-record-base-and-overlay-loss-reports"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      workspace: "/Users/michelkerkmeester/worktrees/public/472-vendored-layout-and-scorer-fixes"
      savedAt: "2026-11-18T08:30:31Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 016-vendored-record-base-and-overlay-loss-reports |
| **Completed** | 2026-11-18 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

If your project vendors Skilled under a subfolder with a root `.skilled` symlink, `record-base` now runs from the project root. Before, it exited 1 with `path parent is not a real directory`. You can also record a framework commit that falls between release tags with `--pin=<full-sha>`. Overlay re-pins now name each upstream item or file they would drop, where those dropped without a word before.

### Record-base in a vendored layout and overlay-engine loss reports

Both fixes came from a second report from a project that vendors Skilled, dated 2026-11-18. The record-base fix chooses the root from a real `.skilled` directory or from a valid symlink, reads the project's own HEAD at its subfolder and adds the pin form. The overlay fix names the upstream content a re-pin would drop, warns on a missing `before` anchor and on numeric path steps and records the keys that `setKeyOnItem` and `insertObjectKeys` write, so a dropped key can be restored. The report's other four items are in packet 011.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modified | Root choice in `resolveRepo`, the project's HEAD read through `headFilesAt()`, the `:(top)` pathspec and the `--pin` form in `record-base` and `check`. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Upstream loss reports before the copy, the anchor and array-index notes and the key records with `restoreDroppedKeys`. |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | Four new cases: the vendored root, the symlink refusal, the `--pin` form and the normal checkout. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Four new re-pin cases: json-entry, directory, anchor and skill-root losses. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | New and changed status and apply cases for key restores, anchors and array indexes. |
| `.skilled/commands/doctor/update.md` | Modified | The `record-base` flag line gains `--pin=<full-sha>`, with one sentence on pins. |
| `.skilled/commands/doctor/assets/doctor-update-record-base.yaml` | Modified | A `pin` user input and the dispatch lines take `--release <tag>` or `--pin <sha>`. |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modified | Lists `--pin=<full-sha>` for `record-base`. |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modified | Keep and plan lists carry the `upstream-lost` and `NOTE` lines. |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | `Upstream lost:` and `Notes:` slots and the NOTE rows. |
| `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` | Modified | The NOTE text. |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The records, the notes table, the re-pin section and the upgrade notes. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The vendored record-base case and the pin case failed on the code before their fix and the work record shows both failures. The release-update suite went from 77 passing to 81 and the overlay suites from 195 passing to 206. On a pristine engine copy, 12 of the final overlay tests fail, which shows the new tests catch the old behavior. The named doctor suites then ran together with 368 tests passing. Those runs come from the work record and this packet did not re-run them. This packet did run `node --check` on both engine scripts and each exited 0. Nothing is committed yet, so no commit SHA pins this evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The root is a real `.skilled` directory or a symlink to a directory named `.skilled` inside the work tree. | `safeResolve` refuses a symlinked parent by design, so the root has to be chosen before that guard runs. Any other target falls back to the top level and the guard refuses it. |
| The flag is `--pin`, not `--commit`. | The router contract test bans the word "commit" in `update.md`, because that test guards next-step wording (work record, line 13). |
| A pin records `{ commit, tree }` with no `release` key. | A SHA in `release` would break `isReleaseRecord` and `compareVersions` (work record, line 13). |
| A missing `before` anchor warns and does not fail. | Failing would block an existing project's re-apply and no strict flag covers anchors (work record, line 22). |
| Loss reports never block an apply. | The report step tells the operator to carry each listed change into the overlay by hand (work record, line 26). |
| A dropped key is restored only from a readable pin and a hand-edited value is refused. | The restore takes back only what the pin says the key was, so it refuses when the pin cannot say or when the value changed (work record, line 25). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| release-update suite before the fix | 77 of 77 pass (recorded, work record line 15) |
| release-update suite after the fix | 81 of 81 pass, exit 0 (recorded, work record line 15) |
| Overlay suites before the fix | 195 of 195 pass (recorded, work record line 27) |
| Overlay suites after the fix | 206 pass: 198 overlay-engine tests and 8 contract tests, exit 0 (recorded, work record line 27) |
| Fail-before proof | 12 of the final overlay tests fail on a pristine engine copy: sync 9, repin 3 (recorded, work record line 27) |
| Contract, compat and agents-md suites | Contract 12 of 12, compat 30 of 30 and agents-md contract 39 of 39, before and after (recorded, work record line 15) |
| Independent rerun | 368 tests, 368 pass, 0 fail, exit 0 across the named suites (recorded, work record line 33) |
| Syntax | `node --check` exits 0 on both engine scripts (observed in this packet) |
| Pin argument checks | `--pin abc --dry-run` exits 2 and `--pin <40-hex> --release v4.1.0.0 --dry-run` exits 2 (observed in this packet) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A vendored copy kept as a git submodule is refused.** Its top level differs from the project's, so its symlink fails the same-top-level check. The work record names no workaround.
2. **Relative `--remote` paths resolve against the git top level.** The work record names no workaround.
3. **Fetching a pin needs a remote that allows fetch by id.** GitHub and local remotes do. The local commit is tried first, so a commit already in the clone needs no fetch.
4. **A project's own `vN.N.N.N` tags read as framework tags.** The work record names no workaround.
5. **`align` and `rollback` share these helpers but have no vendored-layout test.** The work record names no test for them in that layout.
6. **A missing `before` anchor still appends at the end on apply.** The `NOTE` on `status` and `repin` names the anchor, so you can fix the overlay. Failing instead is an open question in spec.md.
7. **Upgrading changes three visible things.** The first apply after the upgrade rewrites `sync-state.json`, even at `0 changed`. Dropping a `setKeyOnItem` or `insertObjectKeys` key now refuses when no pin is readable or the value was hand-edited. An older engine drops the `keys` records.
8. **The overlay contract test does not check the YAML keep lists.** It does not check that they name every line kind the engine prints.
<!-- /ANCHOR:limitations -->

---
