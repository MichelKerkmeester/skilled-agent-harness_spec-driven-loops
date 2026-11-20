---
title: "Tasks: Phase 1: engine-out-of-tree-overlay-folder"
description: "Ordered tasks that let the overlay engine run with a sibling overlay folder: fixture first, then for each surface a failing sibling case and the engine change that makes it pass."
trigger_phrases:
  - "engine out of tree overlay folder tasks"
  - "sibling overlay folder task list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: engine-out-of-tree-overlay-folder

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `T` is `.skilled/commands/doctor/scripts/tests`. Every command runs from the Skilled repository root. This phase runs in Skilled.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Run the engine suite on the starting tree and write its pass count into this line (`$T/overlay-engine-*.test.cjs`). Verify: `node --test $T/overlay-engine-*.test.cjs` exits 0 with a fail count of 0. Evidence: baseline 203 tests, 203 pass, 0 fail, exit 0 (`scratch/evidence/baseline-engine-suite.txt`).
- [x] T002 [P] Run the guard core test on the starting tree (`.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`). Verify: `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0. Evidence: 19/19, exit 0 (`scratch/evidence/baseline-guard.txt`).
- [x] T003 [P] Reproduce the refusal on a probe tree under `$TMPDIR` whose `.skilled-overlays.json` names `../overlays` (`$E:442-444`). Verify: `node $E status --root <probe tree>` prints `names a folder outside the tree root: ../overlays` and exits 2. Evidence: printed `names a folder outside the tree root: ../overlays`, exit 2 (`scratch/evidence/baseline-probe.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add a `createWorkspace` option that puts the overlay folder at `workspace/overlays` and writes the setting `../overlays` (`$T/overlay-engine-fixtures.cjs:53-69`). Verify: `node --test $T/overlay-engine-*.test.cjs` still exits 0, since no test uses the option yet. Evidence: suite stayed 203/203 with the option unused.
- [x] T005 Rewrite the refusal test into an accept/refuse table: accept `../overlays`, `../overlays/`, `../outside` and `a/../../outside`, and refuse `..`, `../`, `.`, `/etc`, `C:\overlays`, a NUL value, `../../x` and `../a/b` (`$T/overlay-engine-fixes.test.cjs:102-105`). Verify: `node --test $T/overlay-engine-fixes.test.cjs` exits 1, failing only on the accept rows. Evidence: the refusal test became one test per accept or refuse row; before the engine change only the accept rows failed.
- [x] T006 Accept a normalized value of exactly `../<segment>` in `resolveOverlayDir` (`$E:442-444`). Verify: `node --test $T/overlay-engine-fixes.test.cjs` exits 0, and the T003 command no longer prints `outside the tree root`. Evidence: fixes test 33/33, exit 0. The probe now prints `no overlay manifest at ../overlays/overlay-manifest.json` and exits 2 (`scratch/evidence/after-probe.txt`).
- [x] T007 Add sibling-folder cases for status, apply and capture that assert the `../overlays/` display text (`$T/overlay-engine-sync.test.cjs`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-sync.test.cjs` exits 0. A failure names a site the inventory missed. Evidence: sibling pattern 3/3, exit 0.
- [x] T008 Add sibling-folder re-pin cases: live re-pin, `--stage` with live manifest, `sync-state.json` and `repin-runs/` bytes compared before and after, rollback of the manifest pin and `sync-state.json`, a rollback of a run folder with no `area` entries, and a stage folder inside the live overlay folder (`$T/overlay-engine-repin.test.cjs`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-repin.test.cjs` exits 1 with `destination escapes the sync root` in the output. Evidence: before the engine change all sibling cases failed at `names a folder outside the tree root`, which `resolveOverlayDir` throws before `relativeKey` is reached.
- [x] T009 Record overlay-folder files as `"area": "overlay"` entries with overlay-relative paths under their own run subfolder when the folder is a sibling (`$E:4505-4572`, `writeBackup` and `backupLeaves`). Verify: the T008 live re-pin case passes and its `backup.json` holds `"area": "overlay"` entries for `overlay-manifest.json` and `sync-state.json`. Evidence: the live sibling re-pin case reads `area: "overlay"` entries for both files, stored under `overlay-backup/`.
- [x] T010 Restore each backup entry against the root its area names, and an entry without `area` against the tree root (`$E:5190-5196`, `$E:4221-4226`). Verify: both T008 rollback cases pass. Evidence: the sibling rollback and the in-tree no-`area` rollback both pass; tampered `area` entries exit 2 with nothing changed.
- [x] T011 With a sibling folder, copy the tree to `<dir>/<tree folder name>` and the overlay folder to `<dir>/<overlay folder name>`, build the staged context on the tree copy, and refuse a stage folder inside the live overlay folder (`$E:5076-5083`, `$E:5094`, `$E:5156-5176`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-repin.test.cjs` exits 0, including the byte-unchanged case. Evidence: repin sibling pattern 10/10, exit 0, including the byte-unchanged and stage-inside-overlay cases.
- [x] T012 Add sibling-folder cases for `--guard`, `apply --adopt` and pre-commit, the last both with the tree nested in the repository and with the tree as the git top level (`$T/overlay-engine-strict-writes.test.cjs`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-strict-writes.test.cjs` exits 1, failing only on the pre-commit case with the tree as the git top level, since the nested-tree case already works through `path.posix.join` (`$E:5706`). Evidence: before the engine change all four failed at `resolveOverlayDir`; after the first engine change only the top-level pre-commit case still failed (exit 1, not 2).
- [x] T013 Build the manifest's git path from its absolute path relative to the git top level, and exit 2 with a same-repository line when that path leaves the repository (`$E:5706-5710`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-strict-writes.test.cjs` exits 0. Evidence: strict-writes sibling pattern 5/5, exit 0.
- [x] T014 Add a sibling-folder relayout case that moves one source and checks the backup under `relayout-runs/<stamp>/` (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test --test-name-pattern sibling $T/overlay-engine-follow-up.test.cjs` exits 1 with `destination escapes the sync root` in the output. Evidence: failed at `names a folder outside the tree root` before the engine change.
- [x] T015 Compute relayout backup paths relative to the overlay root when the folder is a sibling, keeping `runDir/<overlayLabel>/...` for an in-tree folder (`$E:6252-6257`). Verify: `node --test $T/overlay-engine-follow-up.test.cjs` exits 0, including the cases at `:1094,1098,1138-1139`. Evidence: follow-up 46/46, exit 0.
- [x] T016 Add a sibling-folder case beside the custom-overlayDir case at `:184` that denies an owned destination and allows a write inside the sibling folder (`.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`). Verify: `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0 with no change to `overlay-guard.cjs`. Evidence: guard 20/20, exit 0; `overlay-guard.cjs` has no diff.
- [x] T023 Add a sibling-folder case with a layout link whose target reaches into the overlay folder, as Barter's `.skilled/changelog/*` links do (`$T/overlay-engine-repin.test.cjs`). Verify: `node --test $T/overlay-engine-repin.test.cjs` exits 0, and the case shows the link passes `status` and `apply` on the live tree and, inside a `--stage` run, `fs.realpathSync` of the staged link lands under `<dir>/<overlay folder name>`, not under the live overlay folder. Evidence: passes in the repin sibling run.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T017 Run the whole engine suite (`$T/overlay-engine-*.test.cjs`). Verify: `node --test $T/overlay-engine-*.test.cjs` exits 0, and its pass count is the T001 count plus the new sibling cases. Evidence: 238 tests, 238 pass, 0 fail, exit 0 (`scratch/evidence/after-engine-suite.txt`): the 202 starting tests that remain after the refusal test split, plus the accept and refuse rows and the sibling cases.
- [x] T018 Run the guard core test (`.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`). Verify: `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0. Evidence: 20/20, exit 0 (`scratch/evidence/after-guard.txt`).
- [x] T019 Confirm no existing assertion or test was removed or rewritten outside the refusal test; `overlay-engine-fixtures.cjs` is an expected modification (`$T/`). Verify: `git diff -U0 -- $T/overlay-engine-{sync,strict-writes,repin,follow-up}.test.cjs | rg '^-\s*(assert|test\()'` prints nothing. Evidence: the `rg` printed nothing (exit 1).
- [x] T020 Add a new in-tree test that runs a live re-pin and asserts its `backup.json` entries carry no `area` field, leaving the existing re-pin tests unedited (`$T/overlay-engine-repin.test.cjs`). Verify: `node --test --test-name-pattern 'in-tree backup' $T/overlay-engine-repin.test.cjs` exits 0. Evidence: 1/1, exit 0.
- [x] T021 Confirm no doc, workflow yaml or guard code changed (`.skilled/commands/doctor/assets`). Verify: `git status --porcelain .skilled/commands/doctor/assets .skilled/commands/doctor/overlay.md .skilled/skills/system-skilled-doctor .skilled/hooks/overlay-guard/lib/overlay-guard.cjs` prints nothing. Evidence: printed nothing.
- [x] T022 Run the strict validator on this phase folder (`specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder --strict --quiet` prints `RESULT: PASSED`. Evidence: see the validate line in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is `Met`; no manual run is needed, because the fixtures cover every command
- [x] The proving artifact is the T017 run: `node --test $T/overlay-engine-*.test.cjs` exits 0 with the sibling cases included
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Evidence**: `../scratch/inventory/a-engine.md` and `../scratch/design-notes.md`
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

A blocked task is marked `[B]` with the failing command and its output on the task line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The T001 baseline pass count is written on the T001 line. Done: T001 line.
- [x] CHK-002 [P0] The T003 probe prints the Measured Behavior refusal and exits 2. Done: `scratch/evidence/baseline-probe.txt`.
- [x] CHK-003 [P1] `spec.md` §10 lists the default this phase assumes for each parent open question it depends on. Done: §10 lists the four resolved answers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check .skilled/commands/doctor/scripts/overlay-engine.cjs` exits 0. Done: exit 0.
- [x] CHK-011 [P0] No added comment carries a spec path, phase number or requirement id: `git diff -U0 -- .skilled/commands/doctor/scripts | rg '^\+.*(specs/|REQ-|AC-|phase 0)'` prints nothing. Done: printed nothing.
- [x] CHK-012 [P1] Each new refusal, the stage folder inside the live overlay folder and the manifest outside the repository, exits 2 with a line that names the folder. Done: `refuse: the stage folder sits inside the overlay folder: <dir>` and the same-repository line naming `../overlays`, both exit 2.
- [x] CHK-013 [P1] New code follows the engine's existing pattern: paths keyed through `relativeKey` against the root they live under, refusals returned as `refuse: ...` lines. Done: overlay paths are keyed with `relativeKey(ctx.overlayRoot, ...)`, refusals use `refuse:` lines.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, and its Verification cell names the test that passed. Done: every row in `acceptance-criteria.md` is `Met`.
- [x] CHK-021 [P0] T017 and T018 both exit 0. Done: both exit 0.
- [x] CHK-022 [P1] The accept/refuse table in `overlay-engine-fixes.test.cjs` covers `..`, `../`, `../../x`, `../a/b` and `a/../../outside`. Done: rows for `..`, `../`, `../../x`, `../a/b` and `a/../../outside`, plus `a/../../overlays`.
- [x] CHK-023 [P1] Pre-commit with the tree as the git top level exits 2 with the same-repository line in `overlay-engine-strict-writes.test.cjs`. Done: "pre-commit refuses to judge a tree whose sibling overlay folder is outside its git repository".
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every site in the inventory's "Breaks" lists keys an overlay-folder path against the tree root. Done: every Breaks site was keyed against the tree root.
- [x] CHK-FIX-002 [P0] The same-class producer `rg` in `plan.md` FIX ADDENDUM returns only hits that are handled or listed there. Done: hits at `:4516` (tree leaves), `:4544` and `:6309` (both in-tree branches).
- [x] CHK-FIX-003 [P0] The consumer `rg` in `plan.md` FIX ADDENDUM returns only consumers that are listed there, with the workflow yaml handed to phase 003. Done: consumers are the engine, its tests and the guard core; the workflow yaml stays with phase 003.
- [x] CHK-FIX-004 [P0] The `resolveOverlayDir` table holds the adversarial cases: a backslash value, joined input `a/../../outside`, outside-root `../../x`, no-op `.`, and the fallback with no setting file resolving to `skilled-overlays`. Done: `C:\overlays` (backslash), `a/../../outside`, `../../x`, `.`, and the `skilled-overlays` default at `overlay-engine-fixes.test.cjs:67`.
- [x] CHK-FIX-005 [P1] Each of the 22 matrix rows in `plan.md` FIX ADDENDUM maps to a passing test, with the in-tree rows covered by the existing suite. Done: the sibling rows map to the sync, repin, strict-writes, follow-up and guard sibling cases; the in-tree rows are the existing suite.
- [x] CHK-FIX-006 [P1] A guard case runs with `process.cwd()` outside the tree, since `strictWriteRefusal` resolves its input against the working folder (`overlay-engine.cjs:5438`). Done: the strict-writes guard case run from the workspace.
- [x] CHK-FIX-007 [P1] The T017 and T018 evidence names the phase commit SHA. Done: `scratch/evidence/at-phase-commit.txt` reruns both at `d2d2e839456`: 238/238 and 20/20, each exit 0.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] Every backup file a sibling-folder re-pin or relayout writes sits inside its run folder, asserted in `overlay-engine-repin.test.cjs` and `overlay-engine-follow-up.test.cjs`. Done: the live re-pin case reads the `overlay-backup/` copies and the relayout case reads its run folder.
- [x] CHK-031 [P0] `resolveOverlayDir` allows at most one parent segment, proven by the T005 table. Done: fixes test, plus the link-to-tree and case-variant refusals.
- [x] CHK-032 [P1] A `--stage` run writes nothing under the live overlay folder, proven by the T008 byte-unchanged case. The engine has no authentication surface, so this write boundary is the security check that applies. Done: the stage case compares live overlay and tree digests.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same functions and engine lines. Done.
- [x] CHK-041 [P1] The new code comments say why overlay-folder files carry an `area`, and hold no ephemeral label. Done: the `writeBackup` comment says why; CHK-011 shows no ephemeral label.
- [x] CHK-042 [P2] Doctor docs and workflow yaml stay untouched in this phase, because phase 003 owns them: T021 prints nothing. Done: T021 printed nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The T003 probe tree lives under `$TMPDIR` and nothing is written under this packet except its docs. Done: probe under `$TMPDIR`, deleted.
- [x] CHK-051 [P1] Every fixture workspace is removed by the `t.after` cleanup in `overlay-engine-fixtures.cjs:55`, and the probe tree is deleted after T006. Done: fixtures register `t.after` cleanup; the probe was deleted after the run.
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
