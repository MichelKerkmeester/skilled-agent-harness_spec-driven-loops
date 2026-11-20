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

- [ ] T001 Confirm the handoff of phase 004, the re-pin and relayout phase (`$BO/overlay-manifest.json`). Verify: `cd skilled && $SUM` prints `PASSED 0 0` and an in-sync count, and `rg -n '"source": "skilled/' $BO/overlay-manifest.json` prints nothing.
- [ ] T002 Confirm the vendored engine accepts a sibling folder (`skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: reading `resolveOverlayDir` shows `../<name>` accepted, unlike the refusal at Skilled's pre-001 `:442-444`.
- [ ] T003 Record the baselines (`$BO/sync-state.json`). Verify: `cd skilled && $SUM` prints the in-sync count as its fourth value, `node .skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --session-kind` prints `ai-speckit`, `--check "git commit -m x" --cwd .` prints its answer, and `git config --get core.hooksPath` prints `skilled/.opencode/scripts/git-hooks`; each value is written into this task line.
- [ ] T004 Record the test baseline before any change (`tests/run-all.sh`, the `BO` test files). Verify: `bash tests/run-all.sh` and `node --test $TESTS` both exit 0, and their pass and fail counts are written into this task line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Step A, commit 1. The folder stays at `skilled/barter-overlays/`.

- [ ] T005 Make `findBarterOverlays` also try `<tree>/../overlays` and take `treeRoot` as the folder holding `.skilled` (`$BO/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`). Verify: `node --test $BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` exits 0.
- [ ] T006 Add a core test case with the folder at `<tree>/../overlays` (`$BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`). Verify: the new case passes, and it fails when T005's probe is commented out.
- [ ] T007 Add a plugin test case with the folder beside the tree (`$BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` exits 0.
- [ ] T008 Make the commit gate also accept `overlays/overlay-manifest.json` beside `skilled/` (`$BO/root/opencode/scripts/git-hooks/pre-commit`). Verify: `sh -n $BO/root/opencode/scripts/git-hooks/pre-commit` exits 0.
- [ ] T009 Make `aiSpeckitRoot` also probe `path.join(path.dirname(tree), 'overlays', 'overlay-manifest.json')` (`$BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: `node --test $BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs` exits 0.
- [ ] T010 Add a fixture with `overlays/overlay-manifest.json` beside the tree, next to the one at `:80` (`$BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs`). Verify: the new case passes.
- [ ] T011 Add the same fixture next to the one at `:66` (`$BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` exits 0.
- [ ] T012 Apply the hook sources (`skilled/.skilled/`, `skilled/.opencode/`). Verify: `/doctor:overlay apply` exits 0 and `/doctor:overlay status` prints `RESULT: PASSED`.
- [ ] T013 Commit step A by explicit path (the files from T005-T012). Verify: `git show --stat HEAD` lists only hook sources, their tests and their destinations, and the commit gate ran its overlay checks during the commit.

Step B, commit 2.

- [ ] T014 Move the folder (`skilled/barter-overlays/` to `overlays/`). Verify: `git mv skilled/barter-overlays overlays` exits 0 and `ls -d overlays skilled/barter-overlays` lists only `overlays`.
- [ ] T015 Set `{ "overlayDir": "../overlays" }` (`skilled/.skilled-overlays.json`). Verify: `cat skilled/.skilled-overlays.json` prints that line.
- [ ] T016 Change the verify argv at `:1540-1542,1557-1559` to `../overlays/checks/...` (`overlays/overlay-manifest.json`). Verify: `rg -n '"\.\./overlays/checks/' overlays/overlay-manifest.json` prints two lines.
- [ ] T017 Change both layout-link targets to `../../../overlays/framework/...` by hand (`overlays/overlay-manifest.json`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/overlay-manifest.json` prints nothing.
- [ ] T018 Set `treeRoot` to `path.resolve(overlayRoot, '..', 'skilled')` at `:16-17` (`overlays/checks/repin-survival.cjs`). Verify: `cd skilled && node ../overlays/checks/repin-survival.cjs` exits 0.
- [ ] T019 Set the default `treeRoot` the same way at `:93-94` (`overlays/checks/compiled-routing-byte-parity.cjs`). Verify: `cd skilled && node ../overlays/checks/compiled-routing-byte-parity.cjs` exits 0.
- [ ] T020 Climb into `skilled/.skilled` at `:17` (`overlays/tests/compiled-route-guard.test.cjs`). Verify: `node --test overlays/tests/compiled-route-guard.test.cjs` exits 0.
- [ ] T021 Update the folder-finding helpers and fixtures at `:25,28,34,48,67,102,109,124` (`overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: `node --test overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` exits 0.
- [ ] T022 Update the helpers and refusal regexes at `:26,29,35,73,83,149,178,190,201` (`overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`). Verify: `node --test overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` exits 0.
- [ ] T023 Remove the in-tree probe and its fixtures, leaving only `<tree>/../overlays` (`overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks/barter-overlay-guard` prints nothing.
- [ ] T024 Remove the in-tree test at `:83-89` (`overlays/root/opencode/scripts/git-hooks/pre-commit`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/root/opencode/scripts/git-hooks/pre-commit` prints nothing.
- [ ] T025 Remove the in-tree probe and the in-tree fixtures at `:66` and `:80` (`overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: `rg -n "(^|[^-])barter-overlays'|(^|[^-])barter-overlays/overlay" overlays/framework/skills/sk-git/scripts/hooks overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` prints nothing.
- [ ] T026 Point `OVERLAYS_DIR` at `:38` and the text at `:6,113-114,124-127` at `overlays/` (`init-repository.sh`). Verify: `rg -n '(^|[^-])barter-overlays' init-repository.sh` prints nothing.
- [ ] T027 Point the manifest path at `:12,28` at `overlays/` (`sync-skilled-specs.mjs`). Verify: `node --check sync-skilled-specs.mjs` exits 0 and `rg -n '(^|[^-])barter-overlays' sync-skilled-specs.mjs` prints nothing.
- [ ] T028 Move the fixture paths at `:19,32,63,64,97` (`tests/init-repository.test.sh`). Verify: `bash tests/init-repository.test.sh` exits 0.
- [ ] T029 Move the fixture paths at `:165-173` (`tests/node-version-policy.test.sh`). Verify: `bash tests/node-version-policy.test.sh` exits 0.
- [ ] T030 Change `:68` to `/overlays/repin-runs/` and add `overlays/framework/**/node_modules/` and `overlays/framework/**/dist/` (`.gitignore`). Verify: `git check-ignore -v overlays/repin-runs/x overlays/framework/skills/a/node_modules/x overlays/framework/hooks/a/dist/x` prints three rule lines.
- [ ] T031 Update the prose and the `require("./barter-overlays/...")` at `:132` (`overlays/README.md`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/README.md` prints nothing.
- [ ] T032 Update the folder name at `:51,70` (`overlays/root/REPO RULES.md`). Verify: `rg -n '(^|[^-])barter-overlays' 'overlays/root/REPO RULES.md'` prints nothing.
- [ ] T033 Update the folder name at `:324,327` (`overlays/root/AGENTS.md`). Verify: `rg -n '(^|[^-])barter-overlays/' overlays/root/AGENTS.md` prints nothing.
- [ ] T034 Update the folder name throughout (`overlays/framework/repo-rules/barter-overlay-first.md`). Verify: `rg -n '(^|[^-])barter-overlays' overlays/framework/repo-rules/barter-overlay-first.md` prints nothing.
- [ ] T035 Update the folder name in the sk-git and sk-code docs (`overlays/framework/skills/`). Verify: `rg -n '(^|[^-])barter-overlays/' overlays/framework/skills` prints nothing.
- [ ] T036 [P] Update the prose at `:11,19,76,105,112,126,428,445` (`README.md`). Verify: `rg -n '(^|[^-])barter-overlays' README.md` prints nothing.
- [ ] T037 [P] Update the prose (`CONTRIBUTING.md`). Verify: `rg -n '(^|[^-])barter-overlays' CONTRIBUTING.md` prints nothing.
- [ ] T038 [P] Update `:7` (`developer-questions.md`). Verify: `rg -n '(^|[^-])barter-overlays' developer-questions.md` prints nothing.
- [ ] T039 [P] Update `:9` in both files (`skilled/README.md`, `skilled/CONTRIBUTING.md`). Verify: `rg -n '(^|[^-])barter-overlays' skilled/README.md skilled/CONTRIBUTING.md` prints nothing.
- [ ] T040 Apply from the new place (`skilled/`). Verify: `/doctor:overlay apply` exits 0, `readlink skilled/.skilled/changelog/skilled-coder` prints `../../../overlays/framework/changelog/skilled-coder`, and `git diff overlays/sync-state.json` shows only the two link records.
- [ ] T041 Stage the step B files by explicit path and run the commit gate on that index (`skilled/.opencode/scripts/git-hooks/pre-commit`). Verify: it exits 0 and runs the overlay checks; the staged deletions under `skilled/barter-overlays/` and the staged setting are not reported as unowned.
- [ ] T042 Grep the staged tree for the old folder name before committing (`ai-speckit/`). Verify: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints only the track-name false positives in `../scratch/inventory/b-barter.md` B and the temp-folder fixture name at `overlays/tests/compiled-routing-byte-parity.test.cjs:64`.
- [ ] T043 Commit step B by explicit path (the index staged in T041). Verify: `git show --stat HEAD` lists the rename and the edits, and nothing under `repin-runs/` or `relayout-runs/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T044 Run status at the new place (`overlays/overlay-manifest.json`). Verify: `cd skilled && $SUM` prints `PASSED 0 0` and the in-sync count from T003, and `cd skilled && $ENG status` prints `RESULT: PASSED` and no line starting `MISS`.
- [ ] T045 Check the guard refuses an owned destination (`skilled/.skilled/skills/sk-git/sk-git-skilled/SKILL.md`). Verify: `cd skilled && $ENG --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names `../overlays/framework/...`.
- [ ] T046 Check the guard allows an edit inside the folder (`overlays/README.md`). Verify: `cd skilled && $ENG --guard ../overlays/README.md` exits 0, as `strictWriteRefusal` allows paths outside the tree (`overlay-engine.cjs:5439`).
- [ ] T047 Check the commit gate on a clean index (`skilled/.opencode/scripts/git-hooks/pre-commit`). Verify: `skilled/.opencode/scripts/git-hooks/pre-commit` exits 0 and its output shows the overlay status ran.
- [ ] T048 Check the edit guard plugin in an OpenCode session (`skilled/.opencode/plugins/barter-overlay-guard.js`). Verify: an edit to `.skilled/skills/sk-git/sk-git-skilled/SKILL.md` is refused with the source under `../overlays/` named.
- [ ] T049 Check the git-write gate (`skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`). Verify: from `skilled/`, `--session-kind` prints `ai-speckit` and `--check "git commit -m x" --cwd .` prints the answer T003 recorded.
- [ ] T050 Run a staged re-pin to the current pin (`overlays/`). Verify: with `PIN=$(node -p 'require("../overlays/overlay-manifest.json").pin.commit')` from `skilled/`, `$ENG repin --stage $STAGE --upstream $SKILLED --to $PIN` runs, its exit status is recorded (whether a same-pin stage exits 0 is UNKNOWN), and `shasum -a 256 overlays/overlay-manifest.json overlays/sync-state.json` plus `find overlays/repin-runs -type f -exec shasum -a 256 {} +` print the same hashes before and after.
- [ ] T051 Run every overlay test (`overlays/**`). Verify: `node --test $TESTS` exits 0.
- [ ] T052 Run the CI suite (`tests/run-all.sh`). Verify: `bash tests/run-all.sh` exits 0.
- [ ] T053 Grep for the old folder name (`ai-speckit/`). Verify: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints the same lines T042 allowed.
- [ ] T054 Check the hook path did not move (`.git/config`). Verify: `git config --get core.hooksPath` prints `skilled/.opencode/scripts/git-hooks`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Two commits exist in order, hooks first, and every row of `acceptance-criteria.md` is `Met`
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

- [ ] CHK-001 [P0] Phase 004 is committed, re-pin and relayout both: `$SUM` prints `PASSED 0 0`, per T001
- [ ] CHK-002 [P0] The vendored engine accepts `../<name>`, per T002
- [ ] CHK-003 [P1] Baselines recorded in T003: in-sync count, both git-write gate answers, `core.hooksPath`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `sh -n overlays/root/opencode/scripts/git-hooks/pre-commit` and `bash -n init-repository.sh` exit 0
- [ ] CHK-011 [P0] `node --check` exits 0 on each changed `.cjs` and `.mjs` file
- [ ] CHK-012 [P1] No hook keeps a probe for `barter-overlays` after commit 2: `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks overlays/root/opencode/scripts overlays/framework/skills/sk-git/scripts` prints nothing
- [ ] CHK-013 [P1] No code comment names a spec path, phase number or task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Status passes at the new place with the baseline in-sync count (T044)
- [ ] CHK-021 [P0] The three hook checks print their baselines (T045-T049)
- [ ] CHK-022 [P1] The staged re-pin leaves the live folder byte-identical (T050)
- [ ] CHK-023 [P1] `node --test $TESTS` and `bash tests/run-all.sh` exit 0 (T051-T052)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every consumer that finds the folder by its in-tree name, listed in `../scratch/inventory/b-barter.md` A and C.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints only the track-name false positives after commit 2.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'findBarterOverlays|aiSpeckitRoot|TREE_ROOT/barter' overlays` prints only the new-place probes.
- [ ] CHK-FIX-004 [P0] Each hook has a test for the folder beside the tree and for no folder at all, and the git-write gate keeps its fake-marker `project` case.
- [ ] CHK-FIX-005 [P1] Matrix: three locations by three hooks, nine rows for commit 1 and six for commit 2, listed in `plan.md` before completion.
- [ ] CHK-FIX-006 [P1] `SPECKIT_SKIP_OVERLAY_SYNC` unset when T047 runs, so the commit gate cannot skip for an env reason.
- [ ] CHK-FIX-007 [P1] Evidence names the two commit ids, not a branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] The edit guard never fails open: T045 and T048 refuse, at every commit in the range
- [ ] CHK-031 [P0] The git-write gate answers `project` for a session opened outside `ai-speckit`
- [ ] CHK-032 [P1] No hook reads a path from the environment or the edited file to find the folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same two commits in the same order
- [ ] CHK-041 [P1] `overlays/README.md`, `overlays/framework/repo-rules/barter-overlay-first.md` and `overlays/root/AGENTS.md` name `overlays/` and the run directory `ai-speckit/skilled`
- [ ] CHK-042 [P2] `README.md` and `CONTRIBUTING.md` show the new folder in their layout text
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The re-pin stage directory sits outside both `skilled/` and `overlays/`, and is deleted after T050
- [ ] CHK-051 [P1] `git status --short` prints nothing after T054
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---

