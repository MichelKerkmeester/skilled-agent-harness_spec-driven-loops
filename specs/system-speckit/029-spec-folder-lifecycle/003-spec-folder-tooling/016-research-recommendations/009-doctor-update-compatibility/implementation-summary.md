---
title: "Implementation Summary"
description: "External users can check their spec layout from /doctor:update check and run a separate, approved compat action that moves a v3 layout to v4 and applies upgrade-legacy."
trigger_phrases:
  - "doctor update compatibility implementation summary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility"
    last_updated_at: "2026-10-11T19:55:37Z"
    last_updated_by: "generate-context"
    recent_action: "Ran the real v3 upgrade twice, fixed two defects, proved undo"
    next_safe_action: "Monitor the three residual packets the workflow leaves for manual review"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/scratch/evidence/lane-real-repo-rerun.txt"
      - "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/scratch/evidence/lane-real-repo-run.txt"
      - "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/scratch/evidence/lane-d1-d2-fix.txt"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
    session_dedup:
      fingerprint: "sha256:e2965f5b0084b81781ac8515961e48e966c5454f765961f0d3aa63616e109398"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-doctor-update-compatibility |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-will-be-built -->
## What Was Built

- **Compatibility check.** `/doctor:update check` gained a read-only phase, `phase_3_compatibility` in `doctor-update-check.yaml`. It runs the layout map and the era report, then renders the layout state and the pre-v4 signal counts. Both commands are pinned read-only by test.
- **Compat action.** `doctor-update-compat-action.yaml` (new, 173 lines) is a separate gated workflow: preflight, layout preview, move approval, layout move with a move log in the git directory, upgrade preview, a second approval, upgrade apply and a summary. Nothing is written before the move approval, and nothing under `.skilled/` is written.
- **Layout map.** `planLayoutMove(repoRoot)` in `upgrade-legacy.mjs` returns the state (`none`, `v3`, `partial`, `v4`), the moves, the already-moved entries, the collisions and the steps. Collisions carry one of four reasons: `exists-in-both`, `type-mismatch`, `case-only-difference` or `unexpected-symlink`. The `--layout-map` flag prints the map as JSON and exits 1 when collisions exist.
- **Routing and docs.** `_routes.yaml` gained a `compat` route, and the phrase "spec-kit version migration" moved onto it. `update.md` has a new section 7 that gives the external-user sequence and its warnings. The presentation has a Layout line in the check dashboard and a Compatibility Action section with the preview, refusal, interrupted-run, approval, log, upgrade, failed-packet, rollback and result templates.
- **Tests.** `doctor-update-compat.test.cjs` (21 cases, 20 at the first closeout and 21 after the failed-step case was added in closeout 2) and `doctor-update-compat-integration.test.cjs` (1 case) live under `.skilled/commands/doctor/scripts/tests/`, and `run-all.sh` picks both up. `upgrade-legacy.vitest.ts` gained a `planLayoutMove` block of six cases.
<!-- /ANCHOR:what-will-be-built -->

---

<!-- ANCHOR:how-will-be-delivered -->
## How It Was Verified

Run on 2026-10-09 from the shared worktree. Raw output sits in the build gates folder, `gates/closeout-009/`.

- Compat unit suite: `node --test doctor-update-compat.test.cjs` gives 20 pass, 0 fail, rc 0 (`compat-unit.log`).
- Compat integration suite: 1 pass, 0 fail, rc 0, 11.1 s. It replays the workflow's command strings on a throwaway v3 repository through preview, move, upgrade and `validate.sh --strict` (`compat-integration.log`).
- Live layout map on this checkout: state `v4`, empty arrays, exit 0 (`layout-map-live.out` and `.rc`).
- Collision preview on a scratch partial fixture: `exists-in-both` lists the from and to paths (`collide.out`).
- Packet gates: `validate.sh --strict` prints `RESULT: PASSED`, and `check-goal.cjs` passes 5 of 5 with exit 0.
- Whole-tree gate `gates/tree3/` (HEAD `02cc1fb948`, the build's shared tree, read from `delta.txt`): build rc 0, build-cli rc 0, CLI check rc 0, typecheck rc 0, typecheck-cli rc 0, CLI test rc 0 with 171 files passed and 1,752 tests passed (tree2 had 1,749), workflow invariance 2 of 2, focused vitest 8 files and 129 tests passed, hooks 181 pass and 0 fail, doctor `run-all.sh` 7 suites passed and 0 failed, test-validation 31 total and 0 failed with `RESULT: PASSED`, and the two compat suites 21 of 21.
- `typecheck:tests` exits 2 with 95 `error TS` lines in both tree2 and tree3. The build evidence log records it as report-only. This phase does not touch the files it reports, and the count before wave 1 was not captured.
- Closeout 2 (2026-10-09), after the failed-step case was added: compat unit suite 21 pass, 0 fail, rc 0 (`gates/closeout2-009/compat-unit.log`), and the compat integration suite 1 pass, 0 fail, rc 0 (`gates/closeout2-009/compat-integration.log`).
- Closeout 2 whole-tree gate `gates/tree4/` (HEAD `02cc1fb948`, read from each `.rc` file and log): build, build-cli, cli-check, typecheck and typecheck-cli rc 0. CLI test rc 0 with 171 files and 1,775 tests passed (`cli-test.log`). Hooks 181 pass, 0 fail (`hooks.log`). Doctor `run-all.sh` 7 suites passed, 0 failed (`doctor.log`). Test-validation 31 total, 0 failed, `RESULT: PASSED` (`test-validation.log`). Doctor-update compat suites 22 of 22 (`doctor-update.log`). Focused vitest 8 files, 152 tests passed (`focused-vitest.log`). Workflow invariance 2 of 2 (`workflow-invariance-isolated.log`). `typecheck:tests` rc 2 with 95 `error TS` lines, report-only, the same count as tree2 and tree3. Its root-test step rc 124 is the default-bound timeout described in Deviations, not a test failure.
- Root command named in AC-007, `npm --prefix .skilled/skills/system-spec-kit test`: see the AC-007 row for its result and the bound it ran under.
- Closeout 3 (2026-10-09), whole-tree gate `gates/tree5/`, which started at HEAD `02cc1fb948`. Commit `c2a0a667e9` landed at 10:37, inside the root step, but the spec documents it recorded were last written on 2026-10-08, so the run did not read content that changed during it (see AC-007). Build, build-cli, cli-check, typecheck and typecheck-cli rc 0. CLI test rc 0, and its raw `cli-test.log` has no vitest summary line, so its 171 files and 1775 tests are not confirmed from that log. Hooks 184 tests, 181 pass, 0 fail, rc 0 (`hooks.log`). Doctor `run-all.sh` 7 suites passed, 0 failed (`doctor.log`). Test-validation 31 total, 0 failed, RESULT: PASSED (`test-validation.log`). Doctor-update node tests 22 pass, 0 fail (`doctor-update.log`). Focused vitest 8 files, 152 tests passed (`focused-vitest.log`). Workflow invariance 2 of 2 (`workflow-invariance-isolated.log`). Drift guards: alignment drift and stack folders PASSED, with 0 errors (`drift.log`). `typecheck:tests` rc 2 with 95 `error TS` lines, report-only. Root test rc 0 (`root-test.log`), with runtime test:core at 281 files and 4180 tests passed, and CLI at 171 files and 1775 tests passed.
- Packet gates, closeout 3 (2026-10-09). `repair-derived.cjs --folder` with `--apply` returned rc 0. `validate.sh --strict` printed RESULT: PASSED with Errors 0 and Warnings 0, rc 0. It also printed one advisory, AC_COVERAGE, because the Verification cells cite test names and logs rather than file:line. `check-goal.cjs` printed RESULT: PASSED (5/5 checks), rc 0. Logs sit in `gates/closeout3-009/`.
- Closeout 5 (2026-10-11), real-repo upgrade runs. A fresh clone of the v3-era commit `9f2970c46fa28eb52f5a80797cab4588b8738185` (3465 `spec.md` files, 1.1 GB under `specs/`, 2048 packets) exercised the workflow end to end with the worktree tooling copied in. Preview exit 1 with 0 unreadable and no ENAMETOOLONG, apply exit 2 with 2045 of 2048 packets passing, five upgraded packets passing `validate.sh --strict` and one packet restored byte for byte by the README recovery script. The three residual packets fail only `METADATA_DISK_PATH_CONSISTENCY`, which the tool never records by design, so the workflow ends STATUS=PARTIAL for manual review. The runs and their results are recorded in Not Done below. Evidence: `scratch/evidence/lane-real-repo-run.txt`, `scratch/evidence/lane-d1-d2-fix.txt` and `scratch/evidence/lane-real-repo-rerun.txt`.

### Review rounds

- Round 1, a DeepSeek read-only review, found four P2 findings. F1: the recovery skip rules for v4 could skip a step the interrupted run still owed. F2: the `update.md` dry-run wording promised output a v3 dry run does not show. F3: the preflight required the era report, which the action never runs. F4: phase 4 lacked the dirty re-check that phase 2 has. The builder applied fixes 009-F1 to 009-F4, and the compat and contract suites passed 31 of 31 after them.
- Final review, a fresh Opus high read-only pass, found F5 (P2). The rollback block lacked the undo for the legacy root and the parent directories that a reversed move needs. The fix, 009-O7, derives the parent directories from the logged `mv` argv and restores the legacy root. It changes presentation text only, because the move-log fields are pinned by test.
- Closeout 3 (2026-10-09): a fresh Opus high alignment and overengineering review, requested by the operator, ran after the test round. Its verdict was ALIGNED, with a simplify-first note, and all its findings were P2. The one fix that touched this phase's code gave `planLayoutMove` its JSDoc and removed an unreachable fallback in the same function. The other fixes in `upgrade-legacy.mjs` (one healer loader, one exported atomic writer and the duplicate writer removed) do not touch this phase's functions. The post-fix vitest run of five test files, including `upgrade-legacy.vitest.ts`, passed 124 tests (build log OC-F2O5).
- No second DeepSeek round for this phase is recorded in the build evidence log.
- The 009-T1 test round, added at closeout 2, has no review round recorded in the build evidence log. Closeout 3 correction (2026-10-09): TR-R1, a read-only Luna review of the test round on the cli-codex route, did review 009-T1 in `doctor-update-compat.test.cjs`. Its one finding there, that the comment at test line 646 names `phase_4_move`, was rejected. The name is the YAML workflow key that the test reads (test lines 317, 520, 692 and 822), so it is a durable identifier and not an ephemeral label. Its Vitest files could not start in its sandbox, which denied Vite's cache write, so that review read the files and ran only the doctor node tests
- Post-rerun review (2026-10-11). A code review after the real-repo rerun found four issues, all fixed in `upgrade-legacy.mjs` and the README restore script. Item 1 concerned the dry-run preview, which dropped every symbolic link because the copy rewrote relative links to absolute ones and the macOS temp path did not match its real path. The preview keeps relative links as written and checks containment on the real preview path, so an in-packet link is kept while a self-referential or escaping link is still refused. The other three items extended the secret test to the sidecar files, hardened the README restore script and pruned sidecars that a written manifest does not reference. The focused suite moved from 63 to 67 tests, all passing. Evidence: `scratch/evidence/lane-review-fixes-upgrade.txt`.
<!-- /ANCHOR:how-will-be-delivered -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Separate action outside the release transaction | The release engine covers only `.skilled/` units, and the layout move and the upgrade need their own approval, log and rollback |
| Mandatory preview with collision listing | A wrong path map can strand a repository, so nothing is written before the move approval |
| Refusal on a dirty spec root, not a before-image | The move keeps no before-image of its own. The upgrade's before-image manifest comes from phase 010 |
| Layout map returns the full plan | One function returns the state, the moves, the collisions and the steps, and the check, the preview and the action all read it |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

- **Watchdog rerun.** Build brief 009-A1 was killed by the 40-minute watchdog after it had written most of `planLayoutMove`, `--layout-map`, the direct-run guard and the tests. The rerun, 009-A1b, found the work complete and changed nothing.
- **Entry point changed.** The original `upgrade-legacy.mjs` called `main()` on every load. It now calls `main()` only on a direct run, comparing real paths, and `--layout-map` takes its own branch. The tests import `planLayoutMove`, so importing the module must stay quiet. This changes existing top-level behavior and goes beyond the "does not modify existing functions" note in T004.
- **Map, not only collisions.** The spec asks for a "path map collision-check function". The built function returns the whole layout map, and the collisions are one field of it.
- **Fixtures are generated.** The tests build the v3 and v4 fixtures in temp directories at run time. No fixture tree is committed.
- **Shared file.** `planLayoutMove` lives in `upgrade-legacy.mjs`, which phases 011, 012 and 015 also edit. Closeout 3 (2026-10-09) removed 003 from this list, because 003 edits `heal-spec-docs.cjs` and leaves this file unedited. Per parent D6 it ships in one combined commit, and this phase's files cannot be reverted alone. Closeout 2 (2026-10-09) corrected this list: the first pass named 013 too, and the build evidence log records no edit to this file by 013.
- **Model route.** Builders and reviewers ran on DeepSeek V4.1 Flash max through cli-pi and cli-devin, per parent D1, not the Luna route named in the child goal. This applies to the build phase. Closeout 3 (2026-10-09) note: the read-only review of the test round, TR-R1, ran on Luna through cli-codex after parent D1 brought Luna back on 2026-10-09, so the route statement above covers the build and not that review.
- **Runner fix outside this phase's files.** `runtime/scripts/run-tests.mjs` drops its call to `npm run test:file-watcher`. HEAD `02cc1fb948` makes that call, and no `package.json` in the runtime defines the script. Operator decision on 2026-10-09: "Remove the dead step (Recommended)". The change is a five-line deletion in the worktree under brief RT-1, not part of this phase's Files to Change. AC-007 depends on it.
- **Test added at closeout 2.** The failed move step case was written in the 009-T1 test round, after the Devin quota ran out and the round moved to a DeepSeek route. The build evidence log records no review round for it. The lock refusal and the manifest refusal were skipped, because the harness has no executable path to them.
- **Runner bound raised for the closeout run.** The runner stops any test invocation after 10 minutes by default (`run-tests.mjs`, `DEFAULT_TEST_RUN_TIMEOUT_MS`). The root command needs about 25 minutes now that the dead step is gone, so the Met run in `gates/closeout2-009/root-test-bound-raised.log` sets `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, the variable the runner reads. The default is unchanged in code. The two runs at the default bound stopped with exit 124 and are kept on record in `gates/tree4/root-test.log` and `gates/closeout2-009/root-test.log`. The tree5 root step, closeout 3, ran under the same raised bound and ends with rc 0 in `gates/tree5/root-test.rc`, but it straddles commit `c2a0a667e9` (see AC-007).
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:not-done -->
## Not Done

- **Manual run on a real v3 repository.** Closed 2026-10-11. A fresh clone of the v3-era commit `9f2970c46fa28eb52f5a80797cab4588b8738185` (3465 `spec.md` files, 1.1 GB under `specs/`, 2048 packets inspected) ran the workflow's command sequence. The first run stopped at D1, the preview following a committed self-referential link until ENAMETOOLONG, and D2, the reversibility manifest inlining every before-image into one JSON string until the apply refused with "Invalid string length" (`scratch/evidence/lane-real-repo-run.txt`). The fixes, the preview copy keeping links as links and before-images going to sidecar files, are recorded with red and green tests in `scratch/evidence/lane-d1-d2-fix.txt`. The rerun (`scratch/evidence/lane-real-repo-rerun.txt`) completed the move, the preview, the apply and the restore. The preview exited 1 with 2048 failing packets, 0 unreadable and 0 ENAMETOOLONG occurrences. The apply exited 2 with 2045 of 2048 packets passing, a 16,212,687-byte manifest with 0 inline content and 31,168 sidecar files. Three packets stay failing on `METADATA_DISK_PATH_CONSISTENCY` alone, a rule the tool never records by design, so the workflow ends STATUS=PARTIAL for manual review: `specs/system-speckit/027-xce-research-based-refinement`, `specs/system-speckit/029-spec-root-resolution-hardening` and `specs/system-speckit/030-rust-backend-rewrite-research`. Five upgraded packets pass `validate.sh --strict`. The README recovery script restored one packet byte for byte, and that packet fails strict validation again exactly as it did before the upgrade. What the clone run did not exercise: the `/doctor:update compat` orchestrator itself and prompted approvals. The harness ran the command strings from the clone root with both approvals pre-approved, and both run evidence files record that deviation.
- **Approval prompts.** Neither the move approval nor the upgrade approval is run by any test. The suite replays the commands that follow each approval.
- **Untested refusals.** No test covers the release lock refusal, a failed move step, an upgrade that fails after the move, or the manifest refusal printed by the upgrade. Closeout 2 (2026-10-09): the failed move step now has its own case, so the gaps left are the lock refusal, the upgrade failure and the manifest refusal.
- **Performance.** The timing check on a 4,000-packet corpus, listed in `plan.md` section 3, was not run.
- **Adversarial rollback tests.** The rollback block now derives paths from logged argv (009-O7). No table test covers delimiter, joined-input or outside-root cases for that derivation. Closeout 2 (2026-10-09): not applicable, because the rollback is operator guidance text, not code (CHK-FIX-004).
- **Root test command (AC-007).** The root `npm --prefix .skilled/skills/system-spec-kit test` exits 1 at HEAD after its runtime core suite passes. The missing `test:file-watcher` script is outside this phase's files. Closeout 2 (2026-10-09): resolved. The dead step is removed in `run-tests.mjs` (see Deviations), and the root command exits 0 with the bound raised (`gates/closeout2-009/root-test-bound-raised.log`).
- **Commit.** This closeout does not commit. The phase ships in the combined upgrade-legacy commit.
<!-- /ANCHOR:not-done -->

---

<!-- ANCHOR:files -->
## Files Changed

- `.skilled/commands/doctor/assets/doctor-update-check.yaml` (modified)
- `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` (new)
- `.skilled/commands/doctor/assets/doctor-update-presentation.txt` (modified, section 10 and the Layout line)
- `.skilled/commands/doctor/_routes.yaml` (modified, the `compat` route)
- `.skilled/commands/doctor/update.md` (modified, section 7)
- `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` (new)
- `.skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs` (new)
- `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` (modified, the compat workflow name)
- `.skilled/commands/doctor/scripts/tests/README.md` (modified, two rows)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (modified, shared, see Deviations)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` (modified, shared, the `planLayoutMove` block)
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:status -->
## Status: Complete

Closeout 2 (2026-10-09): every acceptance row is Met in `acceptance-criteria.md`, each with the evidence it names. Closeout 3 (2026-10-09): citations re-checked after the Opus alignment fixes, AC-007 re-cited to tree5, and the goal's progress rows and completion criteria reconciled to the Met rows. Closeout 4 (2026-10-09): AC-007 is Met on the tree5 root run, `gates/tree5/root-test.log`, which ran on the final code. The closeout 2 raised-bound run, `gates/closeout2-009/root-test-bound-raised.log`, stays as history. The first-pass text of this paragraph said AC-007 was open, because the root command exited 1 at HEAD while the dead `test:file-watcher` step was still in `run-tests.mjs`. The operator decision removed that step. The caveats and the Not Done list above name what the suite does not reach. Closeout 5 (2026-10-11): the real-repo runs close the manual-run item in Not Done, with the slash-command orchestrator and prompted approvals named there as what the clone run did not exercise.
<!-- /ANCHOR:status -->
