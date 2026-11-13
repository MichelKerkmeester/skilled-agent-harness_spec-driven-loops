---
title: "Implementation Summary"
description: "Every declared sub-track now holds a z_archive folder that git can track, and create.sh no longer hands out a number that an archived packet in the same folder holds. The 40 seeded files are staged and wait for the operator's commit."
trigger_phrases:
  - "subtrack archive and numbering implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering"
    last_updated_at: "2026-11-13T12:49:45Z"
    last_updated_by: "markdown-agent"
    recent_action: "Committed the build and closed all six acceptance criteria"
    next_safe_action: "Build phase 004-archive-search-and-json"
    blockers: []
    key_files:
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering/tasks.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-subtrack-archive-and-numbering"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af8d5552-c79a-45e0-acf2-f076146fb351"
      workspace: "/Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach"
      savedAt: "2026-11-13T12:20:41Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-subtrack-archive-and-numbering |
| **Completed** | 2026-11-13, committed as `5f3e19712e` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Each of the 40 declared sub-tracks now has a `z_archive/` with a `.gitkeep`, so `archive.sh` has a real folder to move a sub-track's packet into. `create.sh` now numbers a new packet above every archived packet in the same folder, so a restored packet never meets a newer one on its number.

### Phase 3: subtrack-archive-and-numbering

You no longer have to create a sub-track's archive by hand. Run `refresh-track-roots.mjs --apply` and every declared sub-track it visits that has no `z_archive/` gets one with an empty `.gitkeep`. A dry run lists the same folders as pending and exits 1, and a second `--apply` writes nothing. A `z_archive` that is a symlink is refused with exit 2 and nothing is written through it. A `z_archive/` that already exists is left alone, even without a `.gitkeep`, because it may hold archived packets.

The sweep tells you when a sub-track is still missing its archive. In the working tree, `sweep-track-roots.mjs` prints one advisory line per declared sub-track without a `z_archive/` and names the command that seeds it. The line never changes the exit code, so the pre-push gate blocks nothing new.

When you create a packet, `create.sh` reads the numbers in the target folder and in its `z_archive/`. With `001-a` live and `z_archive/007-b` archived, the new packet is `008`. An archive that holds only lower numbers changes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | The highest-number loop in `resolve_branch_name` also reads `"$SPECS_DIR"/z_archive/*` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modified | New case `numbers after an archived packet so its number is not reused` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modified | New `ensureArchive` seeds `z_archive/.gitkeep` in a declared sub-track that has no `z_archive/`, reports it as pending in a dry run and refuses a linked one |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | Advisory line for a declared sub-track without `z_archive/`, working tree only |
| `specs/<track>/<sub-track>/z_archive/.gitkeep` | Created | 40 empty files, one per declared sub-track, staged and not committed |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` | Modified | Line 41 names the sub-track's own `z_archive/` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | The `archive.sh` row names the sub-track's own `z_archive/`, and the `refresh-track-roots.mjs` and `sweep-track-roots.mjs` rows describe the seeding and the advisory line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash built the code through the dsh harness on the LLM Gateway route, one change per dispatch, in four dispatches: the archive-aware loop in `create.sh` with its test, `ensureArchive` in `refresh-track-roots.mjs`, the advisory in `sweep-track-roots.mjs` and a fix to `ensureArchive`. The orchestrator read every diff.

Before the change the `find` of the goal printed 0 paths and the sweep listed 40 declared sub-tracks with exit 0, saved in `scratch/sweep-before.txt`. The test baseline in `scratch/baseline.txt` is a copy of the phase 001 baseline, because the first edit of this phase was made in an earlier session. The orchestrator then ran the `create.sh` cases in a throwaway clone, the refresh and sweep cases in a scratch tree with one declared sub-track, the seeding on the real tree, the pre-push hook tests and `npm test`. The first `npm test` failed 3 tests, the fourth dispatch fixed the cause, and the rerun passed. After the fix the scratch-tree runs and the real-tree idempotence run gave the same outputs as before it. The two reference docs were edited last. Nothing was committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Seed only when the `z_archive` directory itself is absent | The first version seeded whenever the `.gitkeep` file was missing, so it wrote into a fixture's existing `z_archive/` that holds an archived packet and failed 3 tests that pin the refresh stdout. A folder with content needs no placeholder |
| Make the missing-archive line an advisory diagnostic | The approved plan says the sweep "reports" it. An advisory line leaves the exit code alone, so the pre-push gate cannot start blocking a tree that passed before. This is the planned default, and the operator has not ruled on it |
| Check for the archive in the working tree only, not with `--rev` | As built: the check sits in the working-tree branch of the sweep, beside the other working-tree diagnostic. The reason was not recorded during the build. The effect is that the pre-push gate, which reads a commit, never prints the line |
| Create the 40 folders with the refresh in this worktree | The approved plan names 40 existing untracked folders, but they exist only in the operator's main checkout. Here `find` printed 0 paths |
| Reuse the phase 001 test baseline | The first edit of this phase predates this session, so no baseline could be captured before it. Phase 002 closed on the same counts |
| Add no test for the seeding or the advisory in this phase | Phase 005 owns the new suites. The scratch-tree runs are the cover until then |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

Every row is an orchestrator run of 2026-11-13 unless it names another source.

| Check | Result |
|-------|--------|
| Before the change: the `find` of the goal and the sweep | `find` printed 0 paths. The sweep listed 40 declared sub-tracks and exited 0, saved in `scratch/sweep-before.txt` |
| `bash -n create.sh`, `node --check` on the two `.mjs` scripts | Exit 0 for all three |
| Clone: `001-a` live, `z_archive/007-b` archived, `create.sh --track demo --skip-branch --short-name next-one "Next one"` | Exit 0, created `specs/demo/008-next-one` |
| Clone: `005-c` live, `z_archive/002-low` archived | Created `006-lower` |
| New case in `create-root-numbering.vitest.ts` | Reported by the build dispatch, not rerun: failed before the fix, and the 17 tests of the file pass after it |
| Scratch tree, declared sub-track `demo/sub`: refresh dry run | Printed `demo/sub: create z_archive/.gitkeep`, exit 1, nothing written |
| Scratch tree: refresh `--apply` | Printed `demo/sub: create z_archive/.gitkeep (written)`, exit 0, `.gitkeep` present |
| Scratch tree: second `--apply` | Printed only `demo/sub: up to date`, exit 0 |
| Scratch tree: `z_archive` a symlink | Printed `demo/sub: z_archive is a symlink, not written`, exit 2, link target stayed empty |
| Scratch tree: sweep before seeding | Printed `demo/sub: sub-track has no z_archive/; seed it with refresh-track-roots.mjs --apply`, exit 0 |
| Scratch tree: sweep after seeding | No such line, exit 0 |
| Real tree: `refresh-track-roots.mjs --apply` | Wrote 40 `.gitkeep` files, exit 0. The `find` of the goal printed 40 paths |
| Real tree: second `--apply` | `git status --porcelain` byte-identical before and after |
| Real tree: `git status --porcelain specs` | Listed 40 `z_archive/` entries |
| Real tree: sweep after seeding | No missing-archive line, exit 0, the same exit code as in `scratch/sweep-before.txt` |
| `bash .skilled/scripts/git-hooks/tests/pre-push.test.sh` | Exit 0, `pre-push tests: PASS=50 FAIL=0` |
| First `npm test` after the build | Exit 1, 3 failures in `tests/track-roots.vitest.ts`, the refresh tests that pin stdout. Cause confirmed from the test diff: seeding wrote into a fixture's existing `z_archive/` |
| `npm test` rerun after the fix | Exit 0. Vitest 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, every legacy stage 0 failed. Baseline 206 files and 2524 tests, so the delta is the one new numbering test |
| `git ls-files 'specs/*/*/z_archive/.gitkeep'` piped to `wc -l` | Printed 40 after commit `5f3e19712e` |
| `rg -c -i "sub-track"` on `spec-lifecycle-automation.md`, and the README pattern of T010 | Each printed 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The seeding and the advisory have no test.** Phase 005 owns the new suites. Until then the scratch-tree runs above are the only cover for `ensureArchive` and the sweep line.
2. **The failing run of the new numbering case was not observed by the orchestrator.** The build dispatch reported it. To confirm, revert the one-line loop change in `create.sh` and run `npx vitest run tests/create-root-numbering.vitest.ts`.
4. **An existing `z_archive/` without a `.gitkeep` is not seeded.** Git tracks it only once it holds a file. Add a `.gitkeep` by hand when an empty archive folder must be tracked.
5. **The sweep advisory is silent with `--rev`.** The pre-push gate reads a commit, so it never prints the line. Run the sweep on the working tree to see a missing archive.
6. **`scratch/` still holds `sweep-before.txt` and `baseline.txt`.** They are the evidence T011 and T014 cite. Remove them when the phase closes, which ticks CHK-051.
<!-- /ANCHOR:limitations -->

---
