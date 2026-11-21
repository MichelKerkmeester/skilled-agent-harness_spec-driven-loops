---
title: "Implementation Summary"
description: "Every overlay engine, doctor script and git hook refusal now says what happened, why and the exact command to run next, from which folder. The engine closes phase 017's open items and refuses any write through a link that leads outside the tree."
trigger_phrases:
  - "ux and alignment pass implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/013-ux-and-alignment-pass"
    last_updated_at: "2026-11-21T15:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged into local main as 058e6091759 and reran every gate there"
    next_safe_action: "None: a separate step pushes main"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-013-ux-and-alignment-pass"
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
| **Spec Folder** | 013-ux-and-alignment-pass |
| **Completed** | 2026-11-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When an overlay engine, doctor script or git hook refuses now, its first line reads as before, so every consumer that matches on it still works. A why line and a `Next:` line follow it. The `Next:` line holds a quoted command that runs as pasted, and names the folder to run it from. The engine also closes the items phase 017 left open, and it now refuses any write that would land outside the tree through a link.

### Phase 13: ux-and-alignment-pass

The work ran on `worktrees/506-ux-and-alignment-pass` over two sessions. The first session stopped on a usage limit during review round 2, so the second session reran that round.

**Engine items from phase 017:**
- A folder named `*.pyc` ships as content. A cache that cannot be deleted gives a `NOTE` and no longer makes apply exit 2. The re-pin backup copies only removable caches. Commit `78f8792461a`.
- A directory or skill-root entry can change a destination between a file, a folder and a link in one apply. Commits `c2c2f2ab74a` and `299bf658411`.
- A `retained` README is documentation only, and phase 014's contract doc says so. Commit `9a95e0ff0f6`.

**Link safety, found by review:**
- A write through a link that leads outside the tree, or through one that resolves nowhere, is refused before anything is written. The engine judges each link where it really lands. Commits `7b58dbab3d9`, `68fc9264d7c` and `3d48db9bd25`.
- A fresh tree with a layout link above an entry used to crash with `EPERM`. Apply now makes the missing link first and plans the entries again through it. Commits `1abb77229e0` and `de69bd168cb`.
- A layout link the manifest retargets while an entry writes under it is refused in planning, with a two-step remedy: move the link alone, then put the entry back. A link to a missing, dangling or file target with an entry under it is refused, not crashed on. `status` and `apply` print the same refusal from one planning path. Commits `159ae961388`, `196fa2b1bfd`, `4b118208464` and `db5bf1cd339`. A link that another link reads through is refused the same way when it moves.

**UX by surface:**
- **Engine and doctor scripts:** every refusal has a why line and a rooted `Next:` line, and `status` reports a pending `REGEN`. An invalid manifest or state file names the file. The MCP and route scripts name their real tree root.
- **Git hooks:** every `Next:` line is quoted with `%q`. Prose sits on its own line, and each one names the source root and the folder to run from. A restore line warns that it discards staged and unstaged edits.
- **Hook adapters and gates:** the overlay guard, the spec gate and sk-git's message gate print a `Next:` line too.
- **Docs and setup flows:** the install guide, the doctor skill, the command assets and the playbooks quote what the code prints and share one vocabulary.

**Other fixes:**
- The drift guard skips archived deep-loop scripts under `specs/`. Commit `84d61dd6edf`.
- The deep-loop tests strip the operator's git and runner variables, which fixes the salvage-miss case. Commit `5652a4bafe2`.
- Overlay requests route to the doctor skill, and a UI overlay's README stays with sk-doc. Commits `abe1b833b25`, `373ec7de88e` and `7d9fb896e97`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Engine items, link safety and the refusal remedies |
| `.skilled/commands/doctor/scripts/*.sh`, `*.cjs` | Modified | `Next:` lines in the other doctor scripts |
| `.skilled/commands/doctor/scripts/tests/` | Modified | Red-first tests for every behavior change |
| `.skilled/scripts/git-hooks/` | Modified | Quoted, rooted `Next:` lines and their tests |
| `.skilled/hooks/`, `.skilled/skills/sk-git/scripts/`, spec gate | Modified | `Next:` lines in the hook adapters and gates |
| `.skilled/skills/system-skilled-doctor/`, `.skilled/commands/doctor/assets/`, `INSTALL-SKILLED.md`, `README.md` | Modified | Docs aligned with the code |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modified | Archive skip in the drift guard |
| `.skilled/skills/system-deep-loop/runtime/tests/` | Modified | A test environment closed to the caller's variables |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Overlay routing anchored on Skilled vocabulary |
| `.pi/settings.json` | Modified | The project default model listed first again |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each behavior change started with a test that failed, and each commit names its red run. Workers that edited `overlay-engine.cjs` ran one at a time. Every Agent dispatch ran with `model: "opus"` and effort medium, and the alignment lanes and critics ran on opus at effort high.

### Review rounds

| Round | Slices | Result | Fixed in |
|-------|--------|--------|----------|
| 1 | Doctor scripts, the rest | Both REQUESTED_CHANGES: 0 P0, 4 P1, 8 P2 | `2f188045e55`, `9a95e0ff0f6`, `2dd39dfe897`, `e3e885ebe50`, `299bf658411` |
| 2 | Doctor scripts, hooks and code, docs | A: REQUESTED_CHANGES, 1 P1 (a write through an outside link) and 6 P2. B: APPROVED, 6 P2. C: REQUESTED_CHANGES, 1 P1 (a stale quote) and 2 P2 | `f362ba17ed9` to `e4eb5622e21` |
| 3 | Same three | A: REQUESTED_CHANGES, 2 P1 (two more link escapes). B: APPROVED, 1 P2. C: APPROVED, 4 P2 | `71990b7a96a`, `a161a1b056c`, `a45818c4402`, `3d48db9bd25`, `1abb77229e0`, `de69bd168cb` |
| 4 | Doctor scripts | REQUESTED_CHANGES, 1 P1 (a retargeted link wrote into its old target, which the base engine also did) and 3 P2 | `c9f5051ac68`, `639df2f2450`, `af005da53f2`, `19f8bbb5941`, `a4e2a2f2baa` |
| 5 | Same three | A: REQUESTED_CHANGES, 3 P1, all from the move-first change in `639df2f2450`, and 2 P2. B: APPROVED, 3 P2. C: APPROVED, 1 P2 | Move-first removed and replaced by a refusal in `159ae961388` and `196fa2b1bfd`. `3bfd5e111fc` for B. The docs pass for C |
| 6 | Engine since round 4, `3bfd5e111fc`, docs since round 5 | A: APPROVED, 4 P2 (a file or dangling target, a nested-link step, the capture rerun). B: APPROVED, 1 P2 | `4b118208464`, `0f005bce510`, `4e46316a040`, `dcdaa8e5e13`, `e3fc34bf147` |
| 7 | Engine since round 6, docs since round 5 | A: APPROVED, 2 P2 (a `.keep` move that could overwrite an earlier one, and a target that is a manifest link not made yet). C: APPROVED, 1 P2 | `f759ad457aa` for C. The engine P2 fixes were tried in `0f282b48e6d` and `6ce61dee0f8` |
| 8 | Engine since round 7 | REQUESTED_CHANGES, 2 P1 and 3 P2. One P1 came from the new link-chain step. The other, a retarget of a link that another link reads through, predates the branch | Both round 7 P2 fixes reverted exactly in `420f4a760f6`. The older P1 is refused in the next commit |
| 9 | Engine since the revert | APPROVED, no findings. Final verdicts: engine round 9, hooks and code round 6, docs round 7, all APPROVED with no P0 or P1 | `db5bf1cd339` refuses a moved link that another link reads through |

One round 2 P2 was not changed: the scratch contract doc in phase 014 fails sk-doc's README rules. It is a spec-folder scratch doc, which sk-doc does not own, and it fails the same way at the base commit.

### Alignment and drift

Three alignment runs at `65751f8d61a` found 75 findings: 22 on the doctor skill, 22 on the doctor commands and 31 on the overlay layout. 72 are fixed. The critic overturned 3 as duplicates of fixed findings. The last 3 open findings were fixed in `49fe267503f` and `d1e45c3776e`. The drift guards' failure on the archived `post.sh` is fixed in `84d61dd6edf`.

### Handoff items

| Item | Outcome |
|------|---------|
| 1. A re-pin never refreshed `.env.example` | Fixed: only `.env.example` is exempt from the secret rule, in `c2c2f2ab74a` and `9a95e0ff0f6` |
| 2. Engine refusals without a why or a next command | Fixed: `59d26c89f38` to `3076d1ec251` and `2f188045e55` |
| 3. Alignment assets: git env, nested root, `.vibe`, `cli-vibe` | Fixed in the operator-local, gitignored assets. The lsa suite passes 92 of 92. Not committed, because the files are gitignored |
| 4. Doctor docs and playbooks drifting from the engine | Fixed: `25391f947a6` to `de2fa53e0d3` |
| 5. More nested-root gaps in the alignment assets | Fixed in the same gitignored assets |
| 6. `--fix literal` writing into a git folder | Fixed in the same gitignored assets, with tests that fail on the old code |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A refusal keeps its first line, and the remedy goes on new lines below it | Tests, presentation contracts and Barter's hooks match on the first line |
| A nested layout link that leads outside the tree still exits 2 | It is refused while planning, before any link exists. Exit 2 is documented and pinned by existing tests |
| A retargeted link with an entry under it is refused, not moved first | Moving it first, tried in `639df2f2450`, brought three new P1s in review round 5: a cleanup line naming a user folder, a loop when a link moved back, and a crash on a missing target. A refusal writes nothing, and its `Next:` sequence is tested end to end |
| The second session reran review round 2 rather than trusting the first session's partial run | That run's results were lost when the session stopped |
| The free `.keep` name and the link-chain step were reverted, not fixed again | Round 8 found a new P1 in the chain step. A revert put the engine back on the tree round 7 approved, and the two P2s it aimed at are recorded below |
| The engine is changed in at most one more round after round 8 | Each link-handling fix had produced the next round's P1, so the last round is bounded to a refusal only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Each count below was read on the branch tip and again on the merged main `058e6091759`, and the two runs agree.

| Check | Base main | Branch tip and merged main |
|-------|-----------|----------------------------|
| Overlay engine suites | 362 pass | 466 pass, 0 fail |
| Full doctor suite | not run | 1598 pass, 0 fail |
| Overlay guard | 34 | 35 |
| Doctor contract | 9 | 9 |
| Router sync | 56 | 56 |
| Local doc alignment | 10 | 10 |
| Local skilled alignment | 76 | 92 |
| Drift guards | exit 1 on the archived `post.sh` | exit 0 |
| Route validate | 32 routes | 32 routes |
| Deep-loop vitest | 1 failed, 3887 passed | 3892 passed, 0 failed |
| Git hook suites | not run on base, 166, 50, 46 and 82 after round 1 | pre-commit 176, pre-push 59, commit-msg 48, prepare-commit-msg 87, all 0 fail |
| Advisor scorer | not run on base, 406 after round 1 | 408 |
| Strict recursive validation of the 007 parent | 17 folders PASSED | 18 of 18 `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The alignment asset fixes are not in git.** The alignment commands and their assets are operator-local and gitignored, so handoff items 3, 5 and 6 live only in the main checkout. Copy `.skilled/commands/assets/local-skilled-alignment/` aside before you reset that checkout.
2. **Barter's overlaid git hooks need a rebase.** Barter overlays the git hooks whole, and this phase rewords their `Next:` lines. The next re-pin shows them as `upstream-moved`, so take the upstream wording when you rebase them.
3. **An entry whose destination is the layout link path itself stays out of sync.** `status` reports its files out of sync after every apply. The base engine does the same. Point the entry at a folder under the link instead.
4. **Two dangling-link remedies do not end in sync.** When a folder above a layout link's target is itself a dangling link, the `mkdir -p` in the `Next:` line fails. Fix that dangling folder by hand, then run `apply`. When the dangling target is itself a manifest layout link, set the manifest right rather than moving that link aside.
5. **A keep-aside move can overwrite an earlier `.keep`.** Every keep-aside `Next:` line moves `<path>` to `<path>.keep`. If that name is taken, rename the old `.keep` first.
6. **A layout link that targets another manifest link not made yet loops.** With `inner -> realdir` and `up -> inner` and an entry under `up`, the engine refuses `up` as missing, and `mkdir -p inner` leads to the next refusal. Make `inner` first with an apply that has no entry under `up`.
7. **A dangling user link under a made layout link crashes apply.** With `realdir/x -> ../nowhere` and an entry at `up/x/tool`, apply exits 2 with `ENOENT` after it makes the links and leaves them standing. Remove or fix the dangling link, then run `apply`.
8. **A moved link that another link reads through gets the moved-link refusal only.** When `inner` moves to a folder that does not exist while `up -> inner` has an entry under it, the refusal is the moved-link one, not the missing-target one, and its `Next:` line may not name a link under `up`. Make the new target first, then follow the `Next:` line.
<!-- /ANCHOR:limitations -->
