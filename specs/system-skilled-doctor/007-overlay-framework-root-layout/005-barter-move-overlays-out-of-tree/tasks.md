---
title: "Tasks: Phase 5: barter-move-overlays-out-of-tree"
description: "Ordered tasks in ai-speckit: record baselines, teach the three hooks both overlay locations in commit 1, move the folder to overlays/ and fix every path in commit 2, then verify status, the hooks, a staged re-pin and the test suites."
trigger_phrases:
  - "barter move overlays out of tree tasks"
  - "barter overlays move task list"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: barter-move-overlays-out-of-tree

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every task runs in an ai-speckit session, from `ai-speckit/` unless it says otherwise. Shell variables:
- `BO` is `skilled/barter-overlays` until T014 and `overlays` from T014 on.
- `ENG` is `node .skilled/commands/doctor/scripts/overlay-engine.cjs`, run from `ai-speckit/skilled`. Each `/doctor:overlay` target runs the same engine command behind the operator's yes.
- `SKILLED` is the local Skilled checkout that holds the current pin, and `STAGE` is a fresh empty folder outside both `skilled/` and `overlays/`.
- `SUM` is `$ENG status --json | node -p 'const r = JSON.parse(require("fs").readFileSync(0, "utf8")); [r.result, r.offLayout.length, r.check.miss, r.counts["in-sync"]].join(" ")'`, run from `ai-speckit/skilled`. It prints the result, the `offLayout` length, the MISS count and the in-sync count. Judge it by what it prints, because `status --json` exits non-zero on `FAILED`. The text status caps LAYOUT lines at 20 plus one overflow line, so no task counts LAYOUT lines.
- `TESTS` is `$(find $BO \( -name relayout-runs -o -name repin-runs \) -prune -o \( -name '*.test.cjs' -o -name '*.test.mjs' \) -print)`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the handoff of phase 004, the re-pin and relayout phase (`$BO/overlay-manifest.json`). Verify: `cd skilled && $SUM` prints `PASSED 0 0` and an in-sync count, and `rg -n '"source": "skilled/' $BO/overlay-manifest.json` prints nothing. Observed: `$SUM` printed `PASSED 0 0 487`; the `"source": "skilled/` grep printed nothing.
- [x] T002 Confirm the vendored engine accepts a sibling folder (`skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: reading `resolveOverlayDir` shows `../<name>` accepted, unlike the refusal at Skilled's pre-001 `:442-444`. Observed: the vendored `063daaee` engine accepts `../<name>` in `resolveOverlayDir`; phase 004 T015's probe printed `../overlays`.
- [x] T003 Record the baselines (`$BO/sync-state.json`). Verify: `cd skilled && $SUM` prints the in-sync count as its fourth value, `node .skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --session-kind` prints `ai-speckit`, `--check "git commit -m x" --cwd .` prints its answer, and `git config --get core.hooksPath` prints `skilled/.opencode/scripts/git-hooks`; each value is written into this task line. Observed: in-sync=487; `--session-kind` printed `ai-speckit`; `--check "git commit -m x" --cwd .` printed `allow`; `core.hooksPath` printed `skilled/.opencode/scripts/git-hooks`.
- [x] T004 Record the test baseline before any change (`tests/run-all.sh`, the `BO` test files). Verify: `bash tests/run-all.sh` and `node --test $TESTS` both exit 0, and their pass and fail counts are written into this task line. Observed: run-all exit 0, 8 PASS. `node --test $TESTS` exit 1: 122 tests, 111 pass, 11 fail, the same 11 pre-existing failures phase 004 recorded (4 missing `yaml`, 4 missing `hook-io.mjs`, 3 missing `014-runtime-engine` modules). DEVIATION: "both exit 0" does not hold at baseline; the gate used from here on is "no failure beyond the baseline set".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Step A, commit 1. The folder stays at `skilled/barter-overlays/`.

- [x] T005 Make `findBarterOverlays` also try `<tree>/../overlays` and take `treeRoot` as the folder holding `.skilled` (`$BO/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`). Verify: `node --test $BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` exits 0. Observed: `findBarterOverlays` returns `{overlaysRoot, treeRoot}` and accepts the folder in the tree or at `<tree>/../overlays`; the guard uses `treeRoot`; core test passes.
- [x] T006 Add a core test case with the folder at `<tree>/../overlays` (`$BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`). Verify: the new case passes, and it fails when T005's probe is commented out. Observed: beside-tree case added to the core test; it passes. The evidence does not record the comment-out probe run.
- [x] T007 Add a plugin test case with the folder beside the tree (`$BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` exits 0. Observed: beside-tree case added to the plugin guard test; it passes.
- [x] T008 Make the commit gate also accept `overlays/overlay-manifest.json` beside `skilled/` (`$BO/root/opencode/scripts/git-hooks/pre-commit`). Verify: `sh -n $BO/root/opencode/scripts/git-hooks/pre-commit` exits 0. Observed: pre-commit accepts either place (`HAS_OVERLAYS`). DEVIATION: the file is bash (process substitution at `:45`), so `sh -n` exits 2; the check run was `bash -n`, exit 0.
- [x] T009 Make `aiSpeckitRoot` also probe `path.join(path.dirname(tree), 'overlays', 'overlay-manifest.json')` (`$BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: `node --test $BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs` exits 0. Observed: `aiSpeckitRoot` accepts either manifest; the gate test passes.
- [x] T010 Add a fixture with `overlays/overlay-manifest.json` beside the tree, next to the one at `:80` (`$BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs`). Verify: the new case passes. Observed: beside-tree fixture added to the gate test; it passes.
- [x] T011 Add the same fixture next to the one at `:66` (`$BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` exits 0. Observed: beside-tree fixture added to the plugin gate test; it passes. Same commit also renamed `dualPlugin` to `definePlugin` in both Barter OpenCode plugins, which had stopped loading after the `063daaee` re-pin.
- [x] T012 Apply the hook sources (`skilled/.skilled/`, `skilled/.opencode/`). Verify: `/doctor:overlay apply` exits 0 and `/doctor:overlay status` prints `RESULT: PASSED`. Observed: apply exit 0, status `RESULT: PASSED`.
- [x] T013 Commit step A by explicit path (the files from T005-T012). Verify: `git show --stat HEAD` lists only hook sources, their tests and their destinations, and the commit gate ran its overlay checks during the commit. Observed: commit `a954fc956ce`, 19 files, no rename. The commit gate ran during the commit. Before the move the guard refused and named `barter-overlays/framework/repo-rules/barter-overlay-first.md` (exit 1), an unowned staged change was refused (exit 1), a clean index exited 0, and the git-write gate printed `ai-speckit`/`allow`.

Step B, commit 2.

- [x] T014 Move the folder (`skilled/barter-overlays/` to `overlays/`). Verify: `git mv skilled/barter-overlays overlays` exits 0 and `ls -d overlays skilled/barter-overlays` lists only `overlays`. Observed: `git mv` exit 0; only `overlays` exists.
- [x] T015 Set `{ "overlayDir": "../overlays" }` (`skilled/.skilled-overlays.json`). Verify: `cat skilled/.skilled-overlays.json` prints that line. Observed: the file reads `{ "overlayDir": "../overlays" }`.
- [x] T016 Change the verify argv at `:1540-1542,1557-1559` to `../overlays/checks/...` (`overlays/overlay-manifest.json`). Verify: `rg -n '"\.\./overlays/checks/' overlays/overlay-manifest.json` prints two lines. Observed: the verify argv grep printed 2 lines.
- [x] T017 Change both layout-link targets to `../../../overlays/framework/...` by hand (`overlays/overlay-manifest.json`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/overlay-manifest.json` prints nothing. Observed: link targets read `../../../overlays/framework/...`; the old-name grep on the manifest printed nothing.
- [x] T018 Set `treeRoot` to `path.resolve(overlayRoot, '..', 'skilled')` at `:16-17` (`overlays/checks/repin-survival.cjs`). Verify: `cd skilled && node ../overlays/checks/repin-survival.cjs` exits 0. Observed: `treeRoot = path.resolve(overlayRoot, '..', 'skilled')`; `RESULT: PASSED`.
- [x] T019 Set the default `treeRoot` the same way at `:93-94` (`overlays/checks/compiled-routing-byte-parity.cjs`). Verify: `cd skilled && node ../overlays/checks/compiled-routing-byte-parity.cjs` exits 0. Observed: same `treeRoot` default; `RESULT: PASSED`.
- [x] T020 Climb into `skilled/.skilled` at `:17` (`overlays/tests/compiled-route-guard.test.cjs`). Verify: `node --test overlays/tests/compiled-route-guard.test.cjs` exits 0. Observed: `LIVE_GUARD` climbs into `../../skilled/.skilled`; the test passes.
- [x] T021 Update the folder-finding helpers and fixtures at `:25,28,34,48,67,102,109,124` (`overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: `node --test overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` exits 0. Observed: helpers and fixtures updated; in-tree fixtures removed, beside-tree and no-folder cases kept; passes.
- [x] T022 Update the helpers and refusal regexes at `:26,29,35,73,83,149,178,190,201` (`overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`). Verify: `node --test overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` exits 0. Observed: helpers and refusal regexes updated; the four hook test files: 41 pass, 0 fail.
- [x] T023 Remove the in-tree probe and its fixtures, leaving only `<tree>/../overlays` (`overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks/barter-overlay-guard` prints nothing. Observed: core keeps one beside-tree candidate per copy; error now reads "could not locate the overlays folder beside the tree"; the grep printed nothing.
- [x] T024 Remove the in-tree test at `:83-89` (`overlays/root/opencode/scripts/git-hooks/pre-commit`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/root/opencode/scripts/git-hooks/pre-commit` prints nothing. Observed: pre-commit accepts only `$TREE_ROOT/../overlays/overlay-manifest.json` and maps a repo-root `TREE_ROOT` to `skilled/`; the grep printed nothing.
- [x] T025 Remove the in-tree probe and the in-tree fixtures at `:66` and `:80` (`overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: `rg -n "(^|[^-])barter-overlays'|(^|[^-])barter-overlays/overlay" overlays/framework/skills/sk-git/scripts/hooks overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` prints nothing. Observed: the gate probes only the beside-tree manifest; in-tree fixtures removed; the grep printed nothing.
- [x] T026 Point `OVERLAYS_DIR` at `:38` and the text at `:6,113-114,124-127` at `overlays/` (`init-repository.sh`). Verify: `rg -n '(^|[^-])barter-overlays' init-repository.sh` prints nothing. Observed: updated; `bash -n` exit 0; the grep printed nothing.
- [x] T027 Point the manifest path at `:12,28` at `overlays/` (`sync-skilled-specs.mjs`). Verify: `node --check sync-skilled-specs.mjs` exits 0 and `rg -n '(^|[^-])barter-overlays' sync-skilled-specs.mjs` prints nothing. Observed: updated; `node --check` exit 0; the grep printed nothing.
- [x] T028 Move the fixture paths at `:19,32,63,64,97` (`tests/init-repository.test.sh`). Verify: `bash tests/init-repository.test.sh` exits 0. Observed: fixture paths moved; the test PASS.
- [x] T029 Move the fixture paths at `:165-173` (`tests/node-version-policy.test.sh`). Verify: `bash tests/node-version-policy.test.sh` exits 0. Observed: fixture paths moved; the test PASS.
- [x] T030 Change `:68` to `/overlays/repin-runs/` and add `overlays/framework/**/node_modules/` and `overlays/framework/**/dist/` (`.gitignore`). Verify: `git check-ignore -v overlays/repin-runs/x overlays/framework/skills/a/node_modules/x overlays/framework/hooks/a/dist/x` prints three rule lines. Observed: the three rules added; `check-ignore` printed three rule lines; no `repin-runs` path untracked.
- [x] T031 Update the prose and the `require("./barter-overlays/...")` at `:132` (`overlays/README.md`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/README.md` prints nothing. Observed: updated, plus one sentence naming `ai-speckit/overlays` beside `ai-speckit/skilled` and the `../overlays` setting; sk-doc validate_document 0 issues.
- [x] T032 Update the folder name at `:51,70` (`overlays/root/REPO RULES.md`). Verify: `rg -n '(^|[^-])barter-overlays' 'overlays/root/REPO RULES.md'` prints nothing. Observed: updated.
- [x] T033 Update the folder name at `:324,327` (`overlays/root/AGENTS.md`). Verify: `rg -n '(^|[^-])barter-overlays/' overlays/root/AGENTS.md` prints nothing. Observed: updated.
- [x] T034 Update the folder name throughout (`overlays/framework/repo-rules/barter-overlay-first.md`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/framework/repo-rules/barter-overlay-first.md` prints nothing. Observed: updated; validate_document 1 warning, present at HEAD before the change.
- [x] T035 Update the folder name in the sk-git and sk-code docs (`overlays/framework/skills/`). Verify: `rg -n '(^|[^-])barter-overlays/' overlays/framework/skills` prints nothing. Observed: 23 sk-git and sk-code docs updated.
- [x] T036 [P] Update the prose at `:11,19,76,105,112,126,428,445` (`README.md`). Verify: `rg -n '(^|[^-])barter-overlays' README.md` prints nothing. Observed: updated; both layout diagrams redrawn with `overlays/` beside `skilled/`; validate_document 0 issues.
- [x] T037 [P] Update the prose (`CONTRIBUTING.md`). Verify: `rg -n '(^|[^-])barter-overlays' CONTRIBUTING.md` prints nothing. Observed: updated; validate_document 1 warning, present at HEAD before the change.
- [x] T038 [P] Update `:7` (`developer-questions.md`). Verify: `rg -n '(^|[^-])barter-overlays' developer-questions.md` prints nothing. Observed: updated.
- [x] T039 [P] Update `:9` in both files (`skilled/README.md`, `skilled/CONTRIBUTING.md`). Verify: `rg -n '(^|[^-])barter-overlays' skilled/README.md skilled/CONTRIBUTING.md` prints nothing. Observed: both files updated.
- [x] T040 Apply from the new place (`skilled/`). Verify: `/doctor:overlay apply` exits 0, `readlink skilled/.skilled/changelog/skilled-coder` prints `../../../overlays/framework/changelog/skilled-coder`, and `git diff overlays/sync-state.json` shows only the two link records. Observed: apply exit 0, 32 changed, both changelog links relinked; `readlink` printed `../../../overlays/framework/changelog/skilled-coder`. DEVIATION: the `sync-state.json` diff carries the two link records AND the new hashes of the 30 applied files whose sources this step edited; the plan assumed no source edit rode with the move. `/doctor:agents-md` updated the one AGENTS line in `.cursor/rules/repo-local.md` (agents-md-check STATUS=OK findings=0), and the regenerate step refreshed the sk-code compiled-route manifest (policy hash only).
- [x] T041 Stage the step B files by explicit path and run the commit gate on that index (`skilled/.opencode/scripts/git-hooks/pre-commit`). Verify: it exits 0 and runs the overlay checks; the staged deletions under `skilled/barter-overlays/` and the staged setting are not reported as unowned. Observed: the commit gate on the staged index exit 0; `bash -x` showed `TREE_ROOT=.../skilled`, `HAS_OVERLAYS=1`, status in-sync=487 and pre-commit ran; no unowned report for the staged deletions or the setting.
- [x] T042 Grep the staged tree for the old folder name before committing (`ai-speckit/`). Verify: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints only the track-name false positives in `../scratch/inventory/b-barter.md` B and the temp-folder fixture name at `overlays/tests/compiled-routing-byte-parity.test.cjs:64`. Observed: the grep printed only `overlays/tests/compiled-routing-byte-parity.test.cjs:64` (temp fixture name) and 4 lines in upstream's `skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` (an upstream-owned fixture, not a Barter path); the pattern already excludes the track name. DEVIATION: the upstream fixture lines were not in the allowed list.
- [x] T043 Commit step B by explicit path (the index staged in T041). Verify: `git show --stat HEAD` lists the rename and the edits, and nothing under `repin-runs/` or `relayout-runs/`. Observed: commit `2a8f454c8d1`, 611 files: 565 renames, 46 edits; nothing under `repin-runs/` or `relayout-runs/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T044 Run status at the new place (`overlays/overlay-manifest.json`). Verify: `cd skilled && $SUM` prints `PASSED 0 0` and the in-sync count from T003, and `cd skilled && $ENG status` prints `RESULT: PASSED` and no line starting `MISS`. Observed: `status --audit` `RESULT: PASSED AUDIT=0 in-sync=487 checked=135 ok=135 miss=0`; `status --json` offLayout=0, miss=0.
- [x] T045 Check the guard refuses an owned destination (`skilled/.skilled/skills/sk-git/sk-git-skilled/SKILL.md`). Verify: `cd skilled && $ENG --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names `../overlays/framework/...`. Observed: refused, naming `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`; `--guard .skilled/repo-rules/barter-overlay-first.md` exit 1 named `../overlays/framework/repo-rules/barter-overlay-first.md`.
- [x] T046 Check the guard allows an edit inside the folder (`overlays/README.md`). Verify: `cd skilled && $ENG --guard ../overlays/README.md` exits 0, as `strictWriteRefusal` allows paths outside the tree (`overlay-engine.cjs:5439`). Observed: printed `allow`, exit 0.
- [x] T047 Check the commit gate on a clean index (`skilled/.opencode/scripts/git-hooks/pre-commit`). Verify: `skilled/.opencode/scripts/git-hooks/pre-commit` exits 0 and its output shows the overlay status ran. Observed: clean index exit 0, overlay status ran (`bash -x` trace); `SPECKIT_SKIP_*` unset (env count 0); an unowned staged change in a temp index is still refused (exit 1).
- [x] T048 Check the edit guard plugin in an OpenCode session (`skilled/.opencode/plugins/barter-overlay-guard.js`). Verify: an edit to `.skilled/skills/sk-git/sk-git-skilled/SKILL.md` is refused with the source under `../overlays/` named. Observed: the live plugin's `tool.execute.before` refused both paths, naming `../overlays/...`.
- [x] T049 Check the git-write gate (`skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: from `skilled/`, `--session-kind` prints `ai-speckit` and `--check "git commit -m x" --cwd .` prints the answer T003 recorded. Observed: printed `ai-speckit` and `allow`, as at T003; a commit from a session outside ai-speckit is refused.
- [x] T050 Run a staged re-pin to the current pin (`overlays/`). Verify: with `PIN=$(node -p 'require("../overlays/overlay-manifest.json").pin.commit')` from `skilled/`, `$ENG repin --stage $STAGE --upstream $SKILLED --to $PIN` runs, its exit status is recorded (whether a same-pin stage exits 0 is UNKNOWN), and `shasum -a 256 overlays/overlay-manifest.json overlays/sync-state.json` plus `find overlays/repin-runs -type f -exec shasum -a 256 {} +` print the same hashes before and after. Observed: `repin --stage /tmp/p5stage.* --to 063daaee...` exit 0, `nothing to copy`, `RESULT: PASSED`; manifest and sync-state hashes unchanged; the `repin-runs` file list identical (1516 files); the stage folder is gone afterwards.
- [x] T051 Run every overlay test (`overlays/**`). Verify: `node --test $TESTS` exits 0. Observed: DEVIATION against "exits 0": exit 1, 126 tests, 115 pass, 11 fail, no failure outside the T004 baseline set; `overlays/tests/` 10/10; both checks `RESULT: PASSED`.
- [x] T052 Run the CI suite (`tests/run-all.sh`). Verify: `bash tests/run-all.sh` exits 0. Observed: exit 0, 8 PASS, 0 FAIL; pi list shows 9 project packages.
- [x] T053 Grep for the old folder name (`ai-speckit/`). Verify: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints the same lines T042 allowed. Observed: the same lines as T042.
- [x] T054 Check the hook path did not move (`.git/config`). Verify: `git config --get core.hooksPath` prints `skilled/.opencode/scripts/git-hooks`. Observed: printed `skilled/.opencode/scripts/git-hooks`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T048 live OpenCode refusal, T041/T047 commit gate)
- [x] Two commits exist in order, hooks first (`a954fc956ce`, then `2a8f454c8d1`), and every row of `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Inventory**: `../scratch/inventory/b-barter.md` section A "Phase 005: the location" and section C
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the failing command's output, and no later task runs until it clears. A blocked step A task stops the phase before `git mv`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Phase 004 is committed, re-pin and relayout both: `$SUM` prints `PASSED 0 0`, per T001 Observed: T001: `$SUM` printed `PASSED 0 0 487`.
- [x] CHK-002 [P0] The vendored engine accepts `../<name>`, per T002 Observed: T002.
- [x] CHK-003 [P1] Baselines recorded in T003: in-sync count, both git-write gate answers, `core.hooksPath` Observed: T003: in-sync=487, `ai-speckit`/`allow`, `core.hooksPath` `skilled/.opencode/scripts/git-hooks`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `sh -n overlays/root/opencode/scripts/git-hooks/pre-commit` and `bash -n init-repository.sh` exit 0 Observed: DEVIATION: `sh -n` on pre-commit exits 2 because the file is bash (process substitution at `:45`, rechecked read-only 2026-11-20); `bash -n` exits 0 on pre-commit and on `init-repository.sh`.
- [x] CHK-011 [P0] `node --check` exits 0 on each changed `.cjs` and `.mjs` file Observed: read-only recheck 2026-11-20: `node --check` on the 55 `.cjs`/`.mjs`/`.js` files the two commits touch that still exist printed no failure; T027 `node --check sync-skilled-specs.mjs` exit 0.
- [x] CHK-012 [P1] No hook keeps a probe for `barter-overlays` after commit 2: `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks overlays/root/opencode/scripts overlays/framework/skills/sk-git/scripts` prints nothing Observed: the grep printed nothing (exit 1), T021-T025 and a read-only recheck.
- [x] CHK-013 [P1] No code comment names a spec path, phase number or task id Observed: the commit gate's comment-hygiene check ran on both commits with `SPECKIT_SKIP_*` unset (T013, T041, T047); a read-only grep of the added comment lines found no spec path, phase number or task id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Status passes at the new place with the baseline in-sync count (T044) Observed: T044: `RESULT: PASSED`, in-sync=487, miss=0.
- [x] CHK-021 [P0] The three hook checks print their baselines (T045-T049) Observed: T045-T049 match the T003 baselines.
- [x] CHK-022 [P1] The staged re-pin leaves the live folder byte-identical (T050) Observed: T050: hashes and the 1516-file `repin-runs` list unchanged.
- [x] CHK-023 [P1] `node --test $TESTS` and `bash tests/run-all.sh` exit 0 (T051-T052) Observed: DEVIATION: run-all exit 0 (8 PASS); `node --test $TESTS` exit 1 with the 11 baseline failures and no new one (T051).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every consumer that finds the folder by its in-tree name, listed in `../scratch/inventory/b-barter.md` A and C. Observed: every consumer in inventory A and C updated in T016-T039; T042 found no Barter path left.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints only the track-name false positives after commit 2. Observed: T042/T053: only the temp fixture name and 4 upstream-owned fixture lines in `overlay-engine-fixes.test.cjs`; DEVIATION, those upstream lines are outside Barter's ownership and were not in the allowed list.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'findBarterOverlays|aiSpeckitRoot|TREE_ROOT/barter' overlays` prints only the new-place probes. Observed: read-only recheck 2026-11-20: the grep prints only `findBarterOverlays`, `aiSpeckitRoot` and their callers and stubs, each probing `<tree>/../overlays`; no `TREE_ROOT/barter` hit.
- [x] CHK-FIX-004 [P0] Each hook has a test for the folder beside the tree and for no folder at all, and the git-write gate keeps its fake-marker `project` case. Observed: beside-tree and no-folder cases kept in each hook suite (T021-T025, 41 pass); the fake-marker `project` case kept.
- [x] CHK-FIX-005 [P1] Matrix: three locations by three hooks, nine rows for commit 1 and six for commit 2, listed in `plan.md` before completion. Observed: the matrix is in `plan.md`, FIX ADDENDUM: LOCATION MATRIX.
- [x] CHK-FIX-006 [P1] `SPECKIT_SKIP_OVERLAY_SYNC` unset when T047 runs, so the commit gate cannot skip for an env reason. Observed: T047: `SPECKIT_SKIP_*` env count 0.
- [x] CHK-FIX-007 [P1] Evidence names the two commit ids, not a branch-relative range. Observed: `a954fc956ce` (hooks) and `2a8f454c8d1` (move).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] The edit guard never fails open: T045 and T048 refuse, at every commit in the range Observed: commit 1: refused naming the in-tree source (T013); commit 2: T045 and T048 refused naming `../overlays/...`.
- [x] CHK-031 [P0] The git-write gate answers `project` for a session opened outside `ai-speckit` Observed: T049: a commit from a session outside ai-speckit is refused.
- [x] CHK-032 [P1] No hook reads a path from the environment or the edited file to find the folder Observed: read-only recheck 2026-11-20: the guard core, the git-write gate and pre-commit locate the folder from their own realpath or `SCRIPT_DIR`; no environment variable or edited path feeds the probe.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same two commits in the same order Observed: all three name commit 1 (hooks) then commit 2 (move): `a954fc956ce`, `2a8f454c8d1`.
- [x] CHK-041 [P1] `overlays/README.md`, `overlays/framework/repo-rules/barter-overlay-first.md` and `overlays/root/AGENTS.md` name `overlays/` and the run directory `ai-speckit/skilled` Observed: T031, T033, T034: all three name `overlays/`; the README names `ai-speckit/skilled`, the rule file and AGENTS name the run folder as `skilled/` inside ai-speckit. Open item: the rule file says the guard names `overlays/framework/...`, the engine prints `../overlays/framework/...`.
- [x] CHK-042 [P2] `README.md` and `CONTRIBUTING.md` show the new folder in their layout text Observed: T036, T037: layout diagrams and text show `overlays/` beside `skilled/`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The re-pin stage directory sits outside both `skilled/` and `overlays/`, and is deleted after T050 Observed: T050: stage under `/tmp`, gone afterwards.
- [x] CHK-051 [P1] `git status --short` prints nothing after T054 Observed: DEVIATION: `git status --short` prints the operator's own 79-line baseline, unchanged after T054, not nothing; nothing pushed (origin/main `64cfee51`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---

