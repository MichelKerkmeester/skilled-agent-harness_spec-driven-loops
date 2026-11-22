---
title: "Tasks: Align the doctor surface with the removed advisor lane"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor lane removal alignment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align the doctor surface with the removed advisor lane

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOCTOR` is `.skilled/commands/doctor`. `SWEEP` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`. `ADVISOR` is `.skilled/skills/system-skill-advisor/runtime`. `FOLDER` is `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/026-doctor-lane-removal-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baselines on `a34344e6a47` before any edit (`spec.md` Measured Behavior). Verify: the doctor suite prints `ℹ pass 1427`, route validation prints `31 routes validated, 11 warnings`, repo mode prints `live` 0 with 47 of 47, and `sync-runtime-mirrors.cjs --check` prints `260 mirrors`. Evidence: all four recorded in `spec.md` Measured Behavior during planning, with exit 0 each.
- [x] T002 Observe a current copy's apply on a fixture (REQ-002). Use a temp repo and a fixture HOME from the `makeFixture` pattern in `DOCTOR/scripts/tests/release-update.test.cjs`, never the worktree (024 D6). Run `release-update.cjs apply` twice at one release and record the second run's exit and its `writes` array. Verify: the second run exits 0, applies no unit and writes only the recorded base, and the note records whether `doctor-update-apply.yaml` phase 7 is reached. Planning wrote "an empty `writes` array", and the observed list holds the recorded base, so this clause names that. Evidence: a fixture under a temp root and a fixture HOME, removed after the run, printed exit 0, `"writes":[{"path":".skilled/skills/.state/doctor-update/base.json",...}]`, `"appliedUnits":[]` and `"rebuildDatabases":true` for the second dry run, and `"written":[".skilled/skills/.state/doctor-update/base.json"]` for the second apply. A copied tree at the current release, with and without `record-base`, printed the same one write. Phase 7 is derived, not observed: the engine exits 0, the workflow has no stop for a plan with nothing to update, and `phase_7_lane_cleanup` runs on every path that reached the rebuild prompt, which the contract test 'the lane cleanup runs on every path that reached the rebuild prompt and on no other' holds. The new test 'an apply at the release already applied writes only the recorded base and exits 0' pins the engine half.
- [x] T003 Observe the linked refusal (REQ-003). Use `makeVendoredLayout`, replace the project's `.skilled` with a symlink to an outside checkout, and run `release-update.cjs apply --dry-run` from it. Verify: the command exits non-zero and prints the message the guide will quote. Evidence: on a fixture project linked to an outside git checkout, `apply --dry-run` exited 1 with `path parent is not a real directory: <project>/.skilled` in JSON, and `[release-update] path parent is not a real directory: <project>/.skilled` on stderr without `--json`. `check`, `apply --dry-run --remote` and a link to a plain copied tree gave the same message. The new test 'apply in a project whose .skilled links to an outside checkout stops at the link' pins it. The worktree's `git status --short` was unchanged after the runs.
- [x] T004 [P] Confirm the advisor ratchets run before any edit. From `ADVISOR`, run `npx vitest run tests/routing-golden-prompts.vitest.ts tests/doctor-routing-slice.vitest.ts tests/command-routing-slice.vitest.ts tests/routing-registry-drift-guard.vitest.ts`. Verify: it exits 0 and prints its pass count. Evidence: exit 0, `Test Files  4 passed (4)`, `Tests  60 passed (60)`, run before the first edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the per-install cleanup into `INSTALL-SKILLED.md` section 5, the update row at line 308 (REQ-001), using the commands that T002 and T003 confirm. Verify: `rg -n 'sweep-lane-residue.mjs machine' INSTALL-SKILLED.md` prints one line, and `rg -n 'doctor:update apply' INSTALL-SKILLED.md` prints one line. Planning wrote the second pattern as `doctor/update apply`, which cannot match the command `/doctor:update apply`, so the pattern is corrected here. Evidence: both commands print line 308, the "To adopt a new Skilled release" row, and `check_readme_references.py INSTALL-SKILLED.md` prints `PASS ... references=77 unresolved=0`.
- [x] T006 [P] Correct the advisor Upgrade Notes at `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md`, lines 160 to 166 (REQ-009). Verify: `rg -n 'Every reader takes both steps' .skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` prints nothing. Evidence: that `rg` exits 1 with no output, step 1 of "Before You Start" names the copied and linked commands, and `check_changelog_shape.py` prints `PASS` for the file, as it did before the edit.
- [x] T007 [P] Correct the cleanup pointer at `DOCTOR/assets/doctor-update-presentation.txt` line 459 (REQ-009). Verify: `rg -n 'pointed to' DOCTOR/assets/doctor-update-presentation.txt` prints the linked-install wording, and `node --test DOCTOR/scripts/tests/doctor-update-contract.test.cjs` exits 0. Evidence: `rg` prints line 459 of section "9. Lane Cleanup", which now points a linked project to `sweep-lane-residue.mjs machine` from the Skilled checkout. The contract test exits 0 with `ℹ pass 20` and `ℹ fail 0`.
- [x] T008 Add one helper-match case per cleanup phrase to `DOCTOR/scripts/tests/doctor-helper-match.test.cjs` (REQ-011). Verify: `node --test DOCTOR/scripts/tests/doctor-helper-match.test.cjs` fails on the new cases before T009. Evidence: four cases titled 'the cleanup request "<prompt>" ranks /doctor:update first', one per audit prompt. The residue gate keeps the retired product's name out of the tracked test file, so `acme` stands in for it, and the case asserts the stand-in adds no matched term. Before T009 the file printed `ℹ tests 27`, `ℹ pass 23`, `ℹ fail 4`, and exited 1, with each new case failing.
- [x] T009 Add the cleanup phrases to the `/doctor:update` route's `trigger_phrases` in `DOCTOR/_routes.yaml`, lines 782 to 790 (REQ-004, REQ-005). The starting list is "remove leftovers from the retired advisor lane", "clean up what the retired lane left behind", "remove leftover model files after upgrade", "clean embedding model", "advisor model server still running", "lane residue CI failing", "delete the pulled shared model" and "retired advisor lane cleanup". Keep only the phrases that G3 shows routing to `/doctor:update`, and keep each at three words or more. Verify: `bash DOCTOR/scripts/route-validate.sh` prints `31 routes validated`, and the term check in plan.md section 5 prints no hit. Evidence: all eight phrases kept, then four narrowed after the independent review (see the review fix in implementation-summary.md): "remove the retired advisor lane model files", "old advisor embedding model", "lane residue gate failing" and "model the advisor lane pulled". Each ranks `/doctor:update` first in the helper's self-recall test, and route validation exits 0 with "31 routes validated, 11 warnings", the same eleven warnings as the baseline by `diff`. The term check prints `hits=0` for `_routes.yaml`. After the edit the helper-match file prints `ℹ pass 27` and `ℹ fail 0`, and its held-out line reads `top1=0.851 top3=0.915 negatives=1.000`, unchanged from the baseline.
- [x] T010 Rebuild the advisor bridges from the route: `node ADVISOR/scripts/command-bridges/derive-command-bridges.cjs` in write mode (REQ-006). Verify: `node ADVISOR/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0 and prints `"changed": []`. Evidence: `--check` exited 1 before the write, naming `command-bridges.generated.json` and `projection.ts`. The write exited 0 with `"status": "generated"`, and `--check` then exited 0 with `"changed": []`. `skill_advisor.py` did not change, because its bridges carry only slash markers. `npm run build` in `ADVISOR` exited 0, so `doctor-phrase-reach.cjs` scores the new bridges.
- [x] T011 Bump the doctor release. Set `.skilled/skills/system-skilled-doctor/SKILL.md` line 5 to `1.3.0.0`, and create `.skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` in the shape of `v1.2.0.0.md`, with the six items in plan.md section 3 and the gate-safe wording (REQ-007). Verify: `rg -n '^version: 1.3.0.0' .skilled/skills/system-skilled-doctor/SKILL.md` prints one line, and `ls .skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` lists the file. Evidence: `rg` prints `5:version: 1.3.0.0`, `ls` lists the file, and `check_changelog_shape.py` prints `PASS` for it. The six items are worded with "retired advisor lane", and the term check prints `hits=0`. The model entry `v1.2.0.0.md` itself fails the shape check's sentence ceilings, so the new entry copies its layout but keeps each sentence under 22 words.
- [x] T012 [P] Name the cleanup in the doctor README `/doctor:update` row at line 42 (REQ-010). Verify: `rg -n 'cleanup' .skilled/skills/system-skilled-doctor/README.md` prints line 42. Evidence: `rg` prints line 42 only. The README version rose from 1.0.9.0 to 1.0.10.0 for the body change, and `check_readme_references.py` prints `PASS ... references=60 unresolved=0`.
- [x] T013 [P] Update `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` to six legs and 26 rows, and add the delivery leg with its two scripts, its DEGRADED and ERROR rules, and its repair lines from `DOCTOR/assets/doctor-setup.yaml` line 60 (REQ-008). Verify: `rg -n 'five|25' .skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` prints no line that counts legs or rows, and `rg -c 'delivery' .skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` prints at least 1. Evidence: the first `rg` exits 1 with no line, and the second prints `5`. The presentation's section "2. Doctor Target List" holds 26 rows and `doctor-setup.yaml` holds six `Leg` steps, both counted by script. `validate-playbook-package.cjs --strict` exits 0, and none of its 13 package warnings names this file.
- [x] T014 Regenerate the leaf manifest only if the check reports drift. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skilled-doctor`, and when it fails, run its `--write` once (REQ-007). Verify: the `--check` run exits 0. Evidence: `--check` exited 0 with `leaf-manifest.json OK` for `system-skilled-doctor` and for `system-skill-advisor`, so no `--write` ran. `regenerate-skill-derived.cjs --all --dry-run` printed `changed` 0 and `errored` 0.
- [x] T015 Check each new sentence outside `specs/` against `IDENTIFIER_TERMS` and `PROSE_TERMS` in `SWEEP` before it is saved, in `_routes.yaml`, `INSTALL-SKILLED.md`, the advisor changelog, the presentation, the README, the playbook and the new changelog. Verify: a case-insensitive `node -e` check prints `hits=0` for each file. Evidence: a script that imports both lists from `SWEEP` and reads each file's added lines, or the whole file when untracked, printed `hits=0` for all twelve changed files and `TOTAL hits=0`. On known strings it found `ollama`, `vector coverage` and `embedder`. Repo mode reads tracked files only, so `git grep --untracked` with the same patterns also found nothing in the new changelog.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run gates G1 to G7 from plan.md section 5 and read each output and exit status. Verify: `node --test DOCTOR/scripts/tests/*.test.cjs` prints `ℹ fail 0`, route validation prints `31 routes validated`, the four vitest files exit 0, and `sync-runtime-mirrors.cjs --check` prints `260 mirrors`. Evidence: G1 exit 0, `ℹ tests 1437`, `ℹ pass 1437`, `ℹ fail 0` after the review fix, the 1427 baseline plus eight helper-match and two release-update cases. G2 exit 0, "31 routes validated, 11 warnings". G3 in T017. G4 exit 0, `"changed": []`. G5 exit 0, `Tests  60 passed (60)`, and twelve more routing and bridge files passed 104 tests and six scorer ratchet files passed 93. G6 `doctor-phrase-reach.cjs` exit 0, `STATUS=OK phrases=262 bridges=35`, every new phrase `PASS`. G7 exit 0, `PASS: 260 mirrors across 10 trees are in sync`, and the doctor leaf `--check` exit 0.
- [x] T017 Confirm the cleanup prompts route (REQ-004). Verify: each of "clean embedding model", "advisor model server still running", "lane residue CI failing" and "remove Ollama leftovers" prints a `/doctor:update` candidate from `node DOCTOR/scripts/doctor-helper-match.cjs -- "<prompt>"`, and the last one's known limit stays in spec.md. Evidence: each prints `1) /doctor:update` and `STATUS=OK MATCHES=1` with exit 0. "remove Ollama leftovers" matches "remove leftovers from the retired advisor lane" through `remov, leftover`, and the limit is in spec.md section 6. Scored in process under the phrase-reach regime, the advisor puts `command-doctor-update` first for the other three prompts and returns no recommendation for the one that names the product.
- [x] T018 Run repo mode and the gate test (G8). Verify: `node SWEEP repo --json` exits 0 with `allowlistRowsMatched` 47 of 47 and `live` 0, and `node --test DOCTOR/scripts/tests/lane-residue-gate.test.cjs` exits 0. Evidence: repo mode exit 0 with `"allowlistRows":47,"allowlistRowsMatched":47,"live":0`, and the gate test exit 0 with `ℹ pass 2`.
- [x] T019 Repair derived metadata on this packet and on 016: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <folder> --apply`, once for each folder. Verify: each command exits 0 and names the files it rewrote. Evidence: the first pass, with both `--folder` flags, exited 0 and printed `inspected=2 repaired=1 failed=0`, the repair being `re-derive graph metadata` on this packet, which moved its derived status from `draft` to `in_progress`. The one item it calls not repairable, `FRONTMATTER_MEMORY_BLOCK`, is the size of 016's own `spec.md` continuity block, which predates this run. The same command ran again after the last edit of this file, before the final validation.
- [x] T020 Validate this packet and 016 strictly (G9). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict` prints `RESULT: PASSED` for each folder. Evidence: the first pass printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` with exit 0 for this packet. For 016 the recursive run printed `RESULT: PASSED` 27 times and `RESULT: FAILED` none, with exit 0. 016's one warning is the same `FRONTMATTER_MEMORY_BLOCK` note. Both runs repeat after the last edit, before the final trigger index run.
- [x] T021 Regenerate the trigger index as the last write (G10), after `tsc --build` in `.skilled/skills/system-spec-kit/shared`. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0, and no packet or tool file changes after it. Evidence: `tsc --build` exited 0. The first index run exited 0 and rewrote `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. The index runs once more as the last write, after this file's final edit.
- [x] T022 Re-run route validation and repo mode once after T021, read-only. Verify: each exits 0 with the counts that T016 and T018 printed. Evidence: after the first index run, route validation exited 0 with "31 routes validated, 11 warnings", repo mode exited 0 with 47 of 47 rows and `"live":0`, and `generate-trigger-index.mjs --check` printed "trigger index matches the corpus" with 0 stale documents. `git status --short` matched before and after these checks by `diff`. They repeat after the final index run.
- [x] T023 Mark each acceptance criterion Met with its observed output, or name it unmet. Verify: `rg -n '\| Unmet \|' acceptance-criteria.md` prints nothing. Evidence: all fourteen rows read Met with the output each observed, and the `rg` exits 1 with no output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Second Review Round

An independent review of the whole epic returned CONDITIONAL on 2026-11-21. Two leaf workers made the fixes in parallel, and the orchestrator verified, committed and merged.

- [x] T024 Delete the orphaned compiled shared outputs (REQ-013). Verify: the residue vitest covers an orphan listed by machine mode, deleted by apply and gone on the next machine run, and a kept file when its source exists. Evidence: `orphanedSharedOutput` adds the four tsc outputs of `shared/dist/chunking` and `shared/dist/utils/retry` to `COMPILED_LANE_PATHS`, each with its own source, and `hasOwnSource` keeps them while that source exists. The vitest prints `Tests  117 passed (117)`, up from 106, with exit 0.
- [x] T025 Detect a model server whose node binary path holds a space or is named `nodejs` (REQ-014). Verify: the old and new `runsModelServer` disagree on those lines and agree on a non-node negative. Evidence: a side-by-side import of `HEAD:SWEEP` and the edited file printed old false and new true for `/Users/John Doe/.nvm/versions/node/v22/bin/node <server>` and for `/usr/bin/nodejs <server>`, and false for both on `/bin/ls /tmp/node <server>`. The temporary copy was removed.
- [x] T026 List the three launcher key families in M7 (REQ-015). Verify: `git grep` on base and HEAD shows no reader left. Evidence: at `bf6806ad4b3` only `.env.example`, `model-server-supervision.cjs` and `ENV-REFERENCE.md` named them, and HEAD has none outside `specs/`. `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` and the prefixes `SPECKIT_LAUNCHER_CRASH_LOOP_` and `SPECKIT_LAUNCHER_RSS_` are listed, with one vitest case.
- [x] T027 Drop the unmatched-row assertion from the doctor gate test (REQ-016). Verify: `node --test DOCTOR/scripts/tests/lane-residue-gate.test.cjs` exits 0. Evidence: `ℹ pass 2`, exit 0. The exit-0 and `live` 0 assertions stay.
- [x] T028 Split the v4.2.0.0 cleanup bullet per install type (REQ-017). Verify: the release note names `/doctor:update apply` for a copy and the residue script from the checkout for a link. Evidence: the Skill Advisor upgrade group names both paths and the link refusal message, and `check_changelog_shape.py` prints `PASS` with exit 0.
- [x] T029 Remove the dead references (REQ-018). Verify: `git grep` outside `specs/` finds no `modelServerPid` in a doc, no `huggingface/hub` step in a script and no `enable-semantic`, `enable_semantic` or `semantic_enabled`. Evidence: after the index rebuild, the only `modelServerPid` hits outside `specs/` are the generated `phrase-variants.json` and `trigger-index.json`, whose entry comes from a historical launcher packet's trigger phrase under `specs/system-speckit/`, so no live doc or code names it. `bash -n` on the rebuild helper and `py_compile` on the corpus scorer exit 0.
- [x] T030 Ship system-spec-kit 2.14.0.0 (REQ-019). Verify: `SKILL.md` reads the version and the changelog exists and passes the gate. Evidence: `5:version: 2.14.0.0`, `changelog/v2.14.0.0.md` listed, its shape check prints `PASS`, and repo mode stays at `live` 0.
- [x] T031 Reconcile the 024 records and record the routing answer (REQ-020). Verify: 024's handoff criterion names the fixture proof, its goal log holds a reconciliation row, and this packet's decision record states the phrases replace Q004. Evidence: the handoff row now cites Q007 and Q010, the row was appended with `goal.cjs packet-log` (exit 0), and the continuity save writes the operator's two answers into `decision-record.md`.
- [x] T032 Merge origin/main into the branch (REQ-021). Verify: the merge commit has two parents and every gate passes on the merged tree. Evidence: `12a5a29ab09` has parents `533cb420627` and `e9588c57f00`. Eight files conflicted: four generated index outputs kept the branch side, and the install guide, doctor README, update presentation and release note were merged by hand. main's new overlay routing test set the removed lane's switch, and that line was dropped. On the merged tree repo mode exits 0 with 47 of 47 rows and `live` 0, the advisor typecheck exits 0, the advisor suite prints `Tests  2450 passed | 4 skipped` with exit 0 after a rebuild and a skill-graph rescan, the doctor suites print `ℹ pass 1613` and `ℹ fail 0`, the residue vitest prints 117 passed, route validation prints 31 routes, phrase reach prints `STATUS=OK phrases=262`, the bridges print `"changed": []`, and the mirrors print 260 in sync.
- [x] T033 Regenerate the trigger index as the last write, then validate this packet and 016 strictly. Verify: the index `--check` reports no stale document, and both strict runs print `RESULT: PASSED`. Evidence: recorded in implementation-summary.md section Second Review Round.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Third Round

The operator asked on 2026-11-22 to fix the remaining items and the existing bugs and drift.

- [x] T034 Point the rebuild helper's marker step at `runtime/cli/setup/` (REQ-022). Verify: the old path is missing and the new one exists under the script's own `ROOT_DIR`. Evidence: `bash -n` exits 0, `test -f` reports the old path missing and the new one present, and running the marker writer from the spec-kit root exits 0. The marker is gitignored. The whole script was not run, because its first step runs `npm rebuild`.
- [x] T035 Remove the dead overrides (REQ-023). Verify: a lockfile-only resolve with and without them gives byte-identical lockfiles. Evidence: in a scratch copy of both packages and their workspaces, `npm install --package-lock-only --ignore-scripts` exited 0 four times, and `cmp` found each result identical to the committed lockfile, baseline and edited alike. The edited `package.json` files match the proven copies byte for byte, and `npm ls --package-lock-only` exits 0 in both packages.
- [x] T036 Make every doctor changelog pass the shape check (REQ-024). Verify: `check_changelog_shape.py` over all twelve entries. Evidence: `SUMMARY files=12 pass=12 fail=0`, up from 10 of 12. The `v1.0.0.0.md` section quotes the verification tables of `specs/system-skilled-doctor/001-skill-and-overlay-build` children 001 to 004.
- [x] T037 Clear 024's answered questions and name its decision record (REQ-025). Verify: section 4 of 024 `spec.md` points to each answer. Evidence: it cites 001 `spec.md` section 12 and 006 `plan.md`. Its template continuity block stays, because the writer sends a phase-parent save to a child, and `specs/system-skilled-doctor/001-skill-and-overlay-build/spec.md` carries the same block.
- [x] T038 Regenerate the trigger index last, then validate 024, 016 and this packet strictly. Verify: the index `--check` reports no stale document and each strict run prints `RESULT: PASSED`. Evidence: recorded in implementation-summary.md section Third Round.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, with T002 and T003 closed by their observed output, T024 to T033 closed by the second review round, and T034 to T038 closed by the third round
- [x] No `[B]` blocked tasks remaining
- [x] Each Met acceptance criterion names the output it observed
- [x] The implementation commit holds every file in `spec.md` Files to Change, and nothing outside it. Evidence: commit `092ebd6c256` on `worktrees/497-ollama-lane-removal`; `git show --name-only 092ebd6c256` lists the planned files, the packet docs, the 016 phase map and the regenerated index outputs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The current-copy and linked observations (T002, T003) are recorded before any edit to `INSTALL-SKILLED.md` (T005). Evidence: both fixture runs finished before the first edit of this run, and the guide row quotes the T003 message.
- [x] CHK-002 [P0] Every REQ in `spec.md` section 4 has an acceptance row in `acceptance-criteria.md`, checked by `rg -c 'REQ-0' acceptance-criteria.md`. Evidence: `rg -c` prints 16 lines, and `rg -o 'REQ-0[0-9][0-9]' | sort -u` lists all twelve, REQ-001 to REQ-012.
- [x] CHK-003 [P1] The advisor ratchets pass before any edit (T004). Evidence: `Tests  60 passed (60)`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `doctor-helper-match.test.cjs` and `release-update.test.cjs` pass with `node --test` (T008, T002, T003). Evidence: both run inside G1, which prints `ℹ fail 0`, and the helper file alone prints `ℹ pass 27`.
- [x] CHK-011 [P0] `_routes.yaml` parses, and `route-validate.sh` exits 0 (T009). Evidence: route validation exits 0 with "31 routes validated, 11 warnings", and the helper loads the manifest in every helper-match case.
- [x] CHK-012 [P1] Route validation shows no warning beyond the 11 at baseline. Evidence: `diff` of the warning lines from the baseline run and the final run prints nothing.
- [x] CHK-013 [P1] The new changelog follows the `v1.2.0.0.md` shape: frontmatter, lead paragraph, "What's New at a Glance" and "Upgrade". Evidence: `v1.3.0.0.md` holds those four parts, one topical section and the spec-folder line, and `check_changelog_shape.py` prints `PASS`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met (T023). Evidence: fourteen of fourteen rows read Met.
- [x] CHK-021 [P0] The four cleanup prompts route to `/doctor:update` (T017). Evidence: each prints `1) /doctor:update` and `STATUS=OK MATCHES=1`.
- [x] CHK-022 [P1] The held-out routing fixture is unedited, so `git diff --stat` on it prints nothing. Evidence: `git diff` on `fixtures/doctor-helper/heldout.jsonl` prints 0 lines, and the pinned-hash test passes inside G1.
- [x] CHK-023 [P1] Repo mode reports live 0 after the edits (T018). Evidence: `"live":0` with 47 of 47 rows matched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No fixture run wrote to the operator's HOME or to the worktree's state folder, checked by `git status --short` after T002 and T003. Evidence: `git status --short` before and after the fixture runs compared equal by `diff`, the fixture HOME was a temp folder that ended empty and was removed, and the worktree's `.skilled/skills/.state/doctor-update` still holds only its `README.md` dated 2026-11-20. A running advisor daemon's file watcher rewrote `.skilled/skills/.state/advisor/skill-graph-generation.json` with reason `advisor-server-watcher-reindex` after the skill edits, which is not a fixture write.
- [x] CHK-031 [P0] The guide tells no user to delete a file by hand. Evidence: the new row text names only `sweep-lane-residue.mjs machine`, its `apply` and `/doctor:update apply`, each of which deletes through the tool and asks before the shared model goes.
- [x] CHK-032 [P1] No credential is read or written by a changed file, checked by `rg -n -i 'token|secret|password'` on each changed file. Evidence: the scan of every added line, and of the whole new changelog, prints 0 hits for each of the twelve files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `INSTALL-SKILLED.md`, the advisor changelog, the presentation and the README agree on the cleanup commands (REQ-009, REQ-010). Evidence: the first three name `/doctor:update apply` for a copied project and `sweep-lane-residue.mjs machine` then `apply` from the Skilled checkout for a linked one, and the README row points a linked project to `INSTALL-SKILLED.md` section 5.
- [x] CHK-041 [P1] The playbook counts match `doctor-setup-presentation.txt` section 2 (26 rows) and `doctor-setup.yaml` (six legs) (REQ-008). Evidence: a script count prints 26 target rows and six `Leg` steps, and the playbook states 26 rows and six legs.
- [x] CHK-042 [P2] Row 26 of the 016 phase map matches rows 24 and 25 in format. Evidence: all three rows carry the same four cells, number, folder, summary and status.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixture output lives in a temp directory or in `scratch/`, and `git status --short` shows only the planned files. Evidence: every fixture lived in a temp root that was removed, and `git status --short` lists only files in `spec.md` Files to Change, the regenerated `projection.ts` block the bridge row names, this packet and the trigger index outputs.
- [x] CHK-051 [P1] `scratch/` holds no leftover fixture output at closure. Evidence: `ls -A scratch` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---
