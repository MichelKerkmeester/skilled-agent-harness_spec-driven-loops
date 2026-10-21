---
title: "Implementation Summary"
description: "A killer now proves takeover mutex ownership with a random token as well as the inode, renames the directory before it removes anything, and covers each race with a test that fails on the code before its fix. killer.test.cjs runs 59 of 59, 20 times over, and Hook Node Tests is the one check left for the push."
trigger_phrases:
  - "relaunch takeover lock identity implementation summary"
  - "takeover mutex owner token"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/045-relaunch-takeover-lock-identity"
    last_updated_at: "2026-10-21T11:12:52Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Recorded the owner-token takeover fix and its tests"
    next_safe_action: "Push to main and confirm Hook Node Tests green"
    blockers:
      - "Hook Node Tests has not run at a commit that carries this fix"
    key_files:
      - ".skilled/hooks/session-relaunch/lib/killer.cjs"
      - ".skilled/hooks/session-relaunch/tests/killer.test.cjs"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-045-relaunch-takeover-lock-identity"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-relaunch-takeover-lock-identity |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hook Node Tests run 39577580180 went red on Linux because the killer trusted an inode number to recognise the takeover mutex it created, and Linux hands a deleted directory's inode to its replacement. The killer now writes a random token beside its pid and removes the directory only while both the inode and the token still match, so a contender's mutex survives. `killer.test.cjs` moves from 55 tests to 59, and the four new tests each failed on the code before their fix.

### Relaunch takeover lock identity: owner token instead of inode alone

You get a takeover that cannot delete a mutex it did not create, on the platform where the old check was wrong. Two killers can still race, and the killer that loses keeps its directory where its owner left it, so the next attempt finds a mutex rather than an empty path.

The release no longer deletes by path after it checks ownership, because a contender can swap the directory between the check and the removal. It renames the directory to a private `.stale-<pid>-<uuid>` name first, reads the token again from the renamed directory, removes it only on a match and renames it back on a mismatch. The cleanup after a failed owner write takes the same shape, and an owner write that fails with `EEXIST` skips the cleanup entirely, because that error means the directory already belongs to someone else.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | Owner token, inode-plus-token release, rename-first removal, `EEXIST` skip and rename-first ownerless cleanup |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modified | Four tests, one per race, each stubbing the `fs` call where the race happens |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Token, rename-back and the remaining three-killer window stated accurately |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Delivered

The base was captured first: 55 passed of 56 with the new pinned-inode test failing (`scratch/mutation/base-killer.tap`). That test pins the inode returned by `statSync`, so Linux's reuse reproduces on macOS and the failure is a local one rather than a CI-only report.

Commits: `e56248d0ae` writes the owner token and requires inode and token on release, `f0cb18991e` skips the cleanup on an `EEXIST` owner write and makes the release rename before it removes, `b61416d25c` gives the owner-write failure cleanup the same rename-first shape, and `32cf4119fe` states the README limit accurately.

Each new test was then run against the code before its fix: the inode test at 55 of 56, the owner-write and swap tests at 56 of 58 (`scratch/mutation/r1-killer.tap`), and the owner-write failure cleanup test at 58 of 59 (`scratch/mutation/r2-killer.tap`). With all four fixes in place the suite reports 59 passed of 59 (`scratch/after-killer-r3.tap`), and 20 consecutive runs each report 59 of 59 (`scratch/killer-20x-r3.txt`).

Luna reviewed the change in three rounds. Round 1 failed on two P1s, the path swap between the ownership check and `rmSync` and the `EEXIST` cleanup, and both were fixed in `f0cb18991e`. Round 2 failed on two P1s and a P2: the non-`EEXIST` cleanup was fixed in `b61416d25c`, the README's missing token was fixed in `32cf4119fe` and the restore window was recorded as the accepted limit. Round 3 failed on one P1 that asked for the lock-file consequence of that window to be stated, which the README now does, and on two P2s that confirmed the limit wording and flagged trailing whitespace in the scratch captures. No finding was left unfixed without a recorded reason.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prove ownership with a token as well as the inode | Linux reuses a deleted directory's inode, so the inode alone cannot tell the killer's directory from a contender's replacement |
| Rename before removing and read the token again | The path stops naming the directory about to be removed, and the second read checks the directory the killer actually holds rather than the one it checked before the rename |
| Rename a mismatched directory back instead of removing it | Removing it would delete the contender's mutex, and the rename back leaves that mutex where its owner expects it |
| Skip the cleanup on an `EEXIST` owner write | That error means the directory is no longer the one the killer created, so a cleanup there can only remove a contender's mutex |
| Keep the pid as the first field of the owner file | Every reader parses the pid from that field, so the new second field leaves the mutex readable by the rest of the hook |
| Document the three-killer window instead of closing it | Directories have no atomic compare-and-delete, so closing it means changing the takeover protocol, which this failure does not require |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `killer.test.cjs` at the base with the new inode test | FAIL 55 passed of 56: "killer leaves a replaced takeover directory even when its inode is reused" (`scratch/mutation/base-killer.tap`) |
| `killer.test.cjs` after the owner token | PASS 56 of 56 (`scratch/after-killer.tap`) |
| `killer.test.cjs` before the owner-write and rename fixes | FAIL 56 passed of 58: the `EEXIST` and swap tests (`scratch/mutation/r1-killer.tap`) |
| `killer.test.cjs` after the owner-write and rename fixes | PASS 58 of 58 (`scratch/after-killer-r2.tap`) |
| `killer.test.cjs` before the ownerless cleanup fix | FAIL 58 passed of 59: the `EACCES` cleanup test (`scratch/mutation/r2-killer.tap`) |
| `killer.test.cjs` after the ownerless cleanup fix | PASS 59 of 59 (`scratch/after-killer-r3.tap`) |
| 20 consecutive `killer.test.cjs` runs | PASS 59 of 59 each, 20 of 20 (`scratch/killer-20x-r3.txt`) |
| Luna review, 4 rounds | Rounds 1 to 3 failed and their P1s were fixed in `f0cb18991e`, `b61416d25c` and `32cf4119fe`; the three-killer window is recorded as a known limit. Round 4 found only this table's stale validation row, fixed here (`scratch/luna/`) |
| Strict spec validation | PASSED: `validate.sh 082 --strict --recursive` prints `RESULT: PASSED` for all 46 folders, exit 0, after `repair-derived.cjs --apply` re-derived the packet and parent metadata |
| Hook Node Tests suites, run as the CI step runs them | PASS 870 of 870 across 29 files; installer test 4 of 4 |
| Plugin suite | PASS 516 of 516 |
| Live session-relaunch scenario | PASS on OpenCode 1 and 2 with `llmgateway/deepseek-v4.1-flash`: the window marker reaches a later request, the shell call completes, exit 0 (`scratch/live-runs/`) |
| Hook Node Tests on CI | PENDING: no run at a commit that carries this fix |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three killers racing on one loop's takeover keep one window.** If a third killer recreates the mutex path while a mismatched directory is being renamed back, the displaced directory stays under its `.stale-` name until the sweep. In that window two killers can both pass the re-check, and one can remove the lock the other just created with its exclusive open, so both supervise the loop. Directories have no atomic compare-and-delete, which is why the window remains. The hooks README states it.
2. **The new tests reproduce the races with filesystem stubs.** `statSync` pins the inode, `writeFileSync` fails the owner write and `renameSync` swaps the directory, so each test proves the code path deterministically rather than observing a real ext4 interleaving. The 20-run capture is the local evidence, and the Linux CI job is the confirmation once this is pushed.
3. **The `.stale-` sweep is what clears a lost directory.** A rename-back that finds the path taken leaves the directory for the sweep under the mutex, which removes it only once it is older than 30 s. Until then the directory is present under its private name, not at the canonical mutex path.
<!-- /ANCHOR:limitations -->

---
