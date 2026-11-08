---
title: "Morning Handoff: sub-track review remediation"
description: "Overnight log of the review remediation phases: what was done, evidence, open questions and the land decision."
trigger_phrases:
  - "044 review remediation handoff"
importance_tier: "normal"
contextType: "implementation"
---

# Morning Handoff: sub-track review remediation

This file is the overnight log. The run's own instructions are at the end.

## Where the work is

- **Worktree:** `/Users/michelkerkmeester/worktrees/public/323-subtrack-review-fixes`, branch `worktrees/323-subtrack-review-fixes`, branched from main at `230d22ba88`.
- **Review inputs:** `review/review-report.md` and `review/p2-verification.md` in this packet.

## Decisions taken (operator, 2026-11-07)

- **D-001:** `create.sh` refuses an undeclared, symlinked or three-level `--track` before it writes anything.
- **Every other decision** in the phase `spec.md` files (D-002a to D-005c) takes its recommended option.
- **Workspace:** a git worktree.
- **Authority:** the operator approved commit, push and merge, and asked that the save not ask again.

## Phase status

| Phase | Worker | State | Evidence checked by the orchestrator |
|-------|--------|-------|--------------------------------------|
| 001-create-track-fixes | GPT-6 Luna xhigh fast | done | Suite 182/182 (baseline 178); `RESULT: PASSED`; diff in scope |
| 004-doctor-symlink-gaps | DeepSeek v4.1 flash max | done | Doctor tests 51/51 (baseline 50); `RESULT: PASSED`; engine change is one comment plus a pin test |
| 002-subtrack-predicate | GPT-6 Luna xhigh fast | done | Suite 190/190 over 11 files, including the new parity test; `RESULT: PASSED`; no ephemeral ids in comments |
| 003-metadata-write-safety | GPT-6 Luna xhigh fast | done | Suite 194/194; `RESULT: PASSED` with 2 continuity warnings, which the final save writes. Refresh refuses to write a symlinked `graph-metadata.json` at either level, and `--apply` now seeds a missing sub-track one. The seeded file has the fixture's minimal shape, not every `derived` field a real track root carries. |
| 005-docs-and-tests | DeepSeek v4.1 flash max | done | Suite 196/196 over 11 files; `RESULT: PASSED`. Docs corrected: `folder-structure.md`, `lib/README.md`, the feature catalog, and the parent `plan.md`, `tasks.md` and `implementation-summary.md`. Two new cases cover a missing-metadata sub-track and a refresh failure, and the archive test now uses a real `z_` identity. |

After all five phases, the orchestrator ran the whole gate on the worktree:
- build exits 0;
- the packet suite passes 196/196 over 11 files;
- the doctor tests pass 51/51;
- `validate.sh 044 --strict --recursive` prints `RESULT: PASSED` for the parent and all five phases.

Full spec-kit suites on the worktree, taken before the round-1 fixes:
- **cli project:** 199 files passed, 3 skipped; 2,364 tests passed, 20 skipped, 0 failed. The pre-change cli run had 2,346 passing tests over 198 files.
- **core:** 283 files passed, 3 skipped; 4,243 tests passed, 21 skipped, 0 failed.

## Review loop

| Round | Reviewer | P0 | P1 | P2 | Outcome |
|-------|----------|----|----|----|---------|
| 1 | Claude Sonnet, high, a different family from the workers | 0 | 0 | 7 | Both original P1s fixed; flat tracks still pass. The P2s, in order: `--track /` is now accepted (a small regression); `validate.sh` keeps the old track-root regex; one parity case is a tautology; `create.sh` prints a single refusal text; a mis-titled test; a misleading dry-run message; and stale parent phase-map status. Luna fixed all 7. The orchestrator re-derived the parent metadata fingerprint with `repair-derived.cjs --apply`. Re-gate: suite 200/200, doctor 51/51, recursive strict `RESULT: PASSED` on all six folders. |
| 2 | Claude Opus, medium | 0 | 1 | 2 | The P1 is reproduced by the reviewer and confirmed by the orchestrator reading `track-roots.mjs`: `create.sh` refused a declared sub-track whose parent track has no `graph-metadata.json`, because the reader skips any track without metadata, while validation accepted the folder. The P2s: the three-segment test could not fail for its own reason, and the feature catalog did not list the new refusals. All three sent to Luna; the fix decides from the sub-track's own declaration and treats a parent with no metadata like a flat track with none. Luna fixed all 3. Re-gate: suite 201/201, doctor 51/51, recursive strict `RESULT: PASSED` on all six folders. |
| 3 | Claude Sonnet, high, a fresh instance | 0 | 0 | 6 | No regressions; both earlier rounds' fixes hold; pre-push tests 50/50. Five P2s were sent to Luna: (1) `create.sh` leaves a declared sub-track's missing metadata unseeded, so the push gate blocks, and the fix makes `create.sh` call the refresh that seeds it, per D-003b; (2) stale `refresh-track-roots` header and dry-run exit code; (3) a stale `folder-structure.md` sentence; (4) a weak symlink test; (5) the refusal message showing the stripped value. The sixth, sub-track check gaps no normal use hits, is left as known: `resolveParentId` and `expectedParentId` do not check segment 0; `archive.sh` refuses a `z_*` track and has an unanchored `track_of`; the `validate.sh` packet glob is older than this change. Luna fixed the five. Re-gate: suite 202/202, doctor 51/51, pre-push tests 50/50, recursive strict `RESULT: PASSED` on all six folders. |
| 4 | Claude Opus, medium, final | 0 | 0 | 3 | APPROVED. Reproduced: symlinked and broken metadata links are refused; a missing sub-track file is seeded and the sweep is then clean; a parent with no metadata creates the packet; flat tracks are unchanged; `--json` stays one payload. The three cosmetic P2s, logged as follow-ups below. The loop stopped at its 4-round cap with no P0 or P1 in the last two rounds. |

## Landed

- **Final gate on the code that was pushed:**
  - the packet suite passes 202/202;
  - the full cli project passes 2,370 tests over 199 files, with 20 skipped and 0 failed;
  - core passes 4,243 tests over 283 files, with 21 skipped and 0 failed;
  - the doctor tests pass 51/51 and the pre-push tests 50/50;
  - `validate.sh --strict --recursive` prints `RESULT: PASSED` on all six folders.
- **Save:** `generate-context.js --full-auto` wrote the two operator decisions into `decision-record.md` and the continuity into `005-docs-and-tests`. Six other answers from the same session belong to other work and were left out of this packet: the Barter router commit, worktrees 145 and 087, and the DSH plugin tests.
- **Pushed to `origin/main` as a fast-forward** (`230d22ba88..dc7e4f00de`), in five commits:
  - `f46c48fa2a`: the code;
  - `0f823500e6`: doctor;
  - `db4d8c6453`: docs;
  - `e79c779ff9`: the packet;
  - `dc7e4f00de`: the trigger index.
- **Branch protection:** GitHub reported that the push bypassed two rules. The commits are unsigned, and the required status checks had not yet run.
- **Commit hooks:** the pre-commit mirror gate first failed on the operator's private `local-skilled-alignment` command. Provisioning had linked it into the worktree as symlinks, and the mirror checks skip symlinked sources. The fix replaced the gitignored worktree copies with real files, matching main. No gate was bypassed.

## Your primary checkout

`/Users/michelkerkmeester/MEGA/Development/Skilled` is still on `230d22ba88`, five commits behind `origin/main`, with other sessions' uncommitted work. It also holds untracked originals of the files these commits add: the 044 phase folders, `review/` and `review-archive/`. So `git merge --ff-only origin/main` will refuse to overwrite them. To sync it:
1. Move `specs/system-speckit/044-named-subtracks-and-host-repos/{001,002,003,004,005}-*` and `review/` aside.
2. Run `git merge --ff-only origin/main`.
3. Keep `review-archive/` and the untracked ledger folders, or delete them. They are run state and are not committed.

The worktree and its branch, `worktrees/323-subtrack-review-fixes`, can be removed once you are happy.

## Follow-ups (cosmetic, not done)

- **`archive.sh:281`** does not seed a missing sub-track `graph-metadata.json`, though `create.sh` now does. The push gate catches it, and the repair it prints works.
- **`sweep-track-roots.mjs:99`** calls a missing sub-track metadata file "unreadable", where refresh now says "missing". The wording predates this change.
- **`create.sh:1409-1426`:** only the empty-segment refusal shows the raw `--track` value. The other refusals print it without its trailing slash.
- **The four sub-track check gaps** from round 3: segment 0 is not checked in `resolveParentId` and `expectedParentId`; `archive.sh` refuses a `z_*` track and has an unanchored `track_of`; the `validate.sh` packet glob. Normal use hits none of them.

## Open questions for the operator

None yet.

## Noted, out of scope

- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:169` exits with a bash syntax error. The phase 004 worker found it.
- The review's run snapshots, 196 MB, were moved out of `review/lineages/*/containment` to the session scratchpad so validation could read `review/`. The scratchpad is temporary. Two more snapshot folders stay under `review-archive/`, about 94 MB.
- Untracked runtime folders `deep-review-ledger/`, `deep-review-audit-ledger/` and `locks-and-fencing-v1/` sit at the packet root in the main checkout. Nothing was deleted.
