---
title: "Implementation Summary"
description: "A vendored tree now re-pins across a link that became a folder, a rebased folder overlay and a set on a key the new pin adds. A stage that is not clean says BLOCKED. Five engine changes, five new tests, three document edits."
trigger_phrases:
  - "fix barter repin handover items for overlay engine implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine"
    last_updated_at: "2026-11-16T07:11:41Z"
    last_updated_by: "claude-code"
    recent_action: "Built and verified the six handover items"
    next_safe_action: "Commit the worktree, then decide where the second handover goes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-fix-barter-repin-handover-items-for-overlay-engine"
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
| **Spec Folder** | 010-fix-barter-repin-handover-items-for-overlay-engine |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that vendors Skilled can now re-pin across the four situations that stopped Barter's re-pin to `d0fc9d719b`, without a workaround script. A stage that would fail live now says so in its last line.

### Phase 10: fix-barter-repin-handover-items-for-overlay-engine

You can re-pin when upstream turns a link into a folder. You can tell the engine a folder overlay was rebased by setting one `rebasedOnto` commit on its entry, and a file upstream adds inside a `directory` overlay is deleted by `apply` instead of blocking it. A `json-entry` `set` adds its key when the file does not hold it yet, so the same overlay works before and after upstream ships the key.

A stage that lists a blocked overlay ends `RESULT: BLOCKED`. `RESULT: STAGED` now always means the copy re-pinned clean. The generator-written file needed no engine change: a regenerate step's `outputs` list already covers it, and the reference now says so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Five changes: `unownedDrift`, `planDirectoryOverlay`, `isRebasedOntoPin` with its use in `classifyDestination`, the stage result word, and `set` in `planOperation` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Four new tests and one changed assertion for the stage result |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | One new test for `set` |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | `rebasedOnto`, the stage result, the directory overlay delete, the regenerate `outputs` list and the link replaced by a folder |
| `.skilled/skills/sk-code/README.md` | Modified | What `vocabularyMirrors` means for a host hub |
| `INSTALL-SKILLED.md` | Modified | The history lookup package's build step |
| `handover-from-barter.md`, `handover-from-barter-024.md` | Created | Byte copies of Barter's two handovers |
| `handover-to-barter.md` | Created | What Barter does after re-pinning to these changes |
| `../spec.md` | Modified | The parent's phase map row for this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each change was one brief with literal old and new text, run by DeepSeek v4.1 flash at max thinking through the Mistral Vibe CLI. The briefs are in `scratch/dispatch/` and each run's outcome record is `scratch/vibe-runs/<number>/export.json`. All seven record `exit_code` 0 and `outcome` `finished`.

Every engine brief added its test first and ran it before the fix, so each new test was seen failing for the reason the handover reported. After each run the orchestrating session checked that only the named files changed, read the diff and reran the affected test files. The final gate ran from the finished tree. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One `rebasedOnto` commit per folder entry, not a hash per file | Barter had 18 changed files under one entry. One value per re-pin is one edit, and it expires at the next re-pin by itself. The cost is that an owner can acknowledge a folder without reading every file. |
| Change the result word, not the exit code | A blocked stage already exited 1. The confusion came from the word `STAGED` on a stage that would fail live. |
| `set` adds a missing last key | `set` failed before the re-pin because the key was missing, and `insertObjectKeys` would fail after it because the copied value differs. Neither operation alone covered both pins. |
| No engine change for the generator-written field | `managedPathTest` already exempts a regenerate step's listed `outputs`, and an existing test asserts it. Barter's step lists none. |
| A folder replaced by a link is left out | No project has met it and it would roughly double the first change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests` before any change | PASS: `tests 1170`, `pass 1170`, `fail 0` |
| The same command from the final tree | PASS: `tests 1175`, `pass 1175`, `fail 0`. Five new tests. |
| Each new test before its fix | FAIL as expected: `holds its own copy`, `blocked owned-dir: live-edited`, the blocked stage word, the live re-pin of a rebased folder, `missing key "mirrors"` |
| `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | PASS: nine `PASS` lines, `STATUS=OK legs=9`, exit 0 |
| `npm --prefix .skilled/hooks/session-handover/history run build` | PASS: exit 0, `dist/cli.js` present |
| Scope of the seven runs | PASS: six files changed outside this folder, each named in a brief |
| Handover copies against Barter's files with `cmp` | PASS: no output, exit 0, both files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not run against Barter's real tree.** The proof is Skilled's fixtures. Barter confirms it on its next re-pin, after the steps in `handover-to-barter.md`.
2. **`rebasedOnto` is per entry.** A stale overlay file under an entry that names the new pin is written over upstream's change with no second warning.
3. **A `set` removed from an overlay leaves its value in the live file.** That is item 7 of Barter's second handover. A key that `set` added is left the same way. Not fixed here.
4. **A folder that the new pin replaces with a link still refuses.** List the path in `repin.exclude` if it happens.
5. **Items 7 to 10 of the second handover are recorded and not built.**
6. **The new branch that refuses an empty parent object in `set` has no test.** The two cases the test covers do not reach it.
<!-- /ANCHOR:limitations -->

---


