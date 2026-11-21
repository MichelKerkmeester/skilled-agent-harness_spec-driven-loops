---
title: "Tasks: Fix the ten P2 advisories from the lane removal deep review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review p2 fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix the ten P2 advisories from the lane removal deep review

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

`TOOL` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`. `VTEST` is `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts`. `ALLOW` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json`. `VITEST` is `npx vitest run --config ../../vitest.config.ts --project cli`, run from `.skilled/skills/system-spec-kit/runtime/cli`. `P24` is `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the Vitest baseline on `bf3bca7a8b1` before any edit (`VTEST`). Verify: `VITEST tests/sweep-lane-residue.vitest.ts` exits 0 and prints its pass count. Evidence: on `bf3bca7a8b1`, before any edit, `VITEST tests/sweep-lane-residue.vitest.ts` exit 0 with `Tests 92 passed (92)`.
- [x] T002 [P] Record the repo-mode baseline (`TOOL`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` exits 0 with `allowlistRowsMatched` 47 of 47. Evidence: before any edit, repo mode exit 0 with `allowlistRows` 47, `allowlistRowsMatched` 47 and `live` 0; the gate test exit 0 with `pass 2`.
- [x] T003 [P] Confirm the functions that the change touches (`TOOL`). Verify: `rg -n 'nodeScriptOf|runsModelServer|isOwnedModelServer' .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` prints the lines 1244, 1258, 1259, 1275, 1276, 1277, 1302 and 1307. Evidence: before any edit the `rg` printed lines 1244, 1258, 1259, 1275, 1276, 1277, 1302 and 1307.
- [x] T004 Confirm the residue-gate trap: the tool and the test file have allowlist rows, and the catalog page and the workflow file have none (`ALLOW`). Verify: a `node -e` check of the allowlist paths prints `true true false false` in that order. Evidence: a `node -e` check of the allowlist paths printed `true true false false` for the tool, the Vitest file, the catalog page and the workflow; the gate test file has no row either.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Bind a real Unix socket in the existing socket case: replace `writeFile(dir, 'custom.sock', '')` at V:873 with `net.createServer().listen(path)` in a `makeShortTempDir` folder, await the listen, close the server in `finally`, and assert `machineExitCode` is 1 before apply and 0 after (`VTEST`). Verify: `VITEST -t 'probes and deletes the socket file'` exits 0 before and after T007. Evidence: V:900 binds `net.createServer()` (V:909) in a `makeShortTempDir` folder, awaits `listen`, asserts `isSocket()`, asserts machine exit 1 (V:921) and apply exit 0, and closes the server in `finally` (V:927). The case passed in the full-file run before T007 and passes alone after it (`Tests 1 passed`).
- [x] T006 Add a regular-file case beside V:869: an address that names a regular text file in the socket folder leaves the file on disk, a note names it, and machine mode exits 0 (`VTEST`). Verify: it fails on `bf3bca7a8b1` (it lists and deletes the file) and passes after T007. Evidence: V:931. On the unfixed tool it failed at its first assertion: M4 listed `operator-notes.txt` and the socket folder (`expected [ { …(4) }, { …(3) } ] to deeply equal []`). It passes after T007.
- [x] T007 In `checkModelServer`, list an extra name from `dir.files` only when `lstatOrNull(candidate)?.isSocket()` is true, and note each regular file it skips. The four fixed names keep today's rule (`TOOL` T:1314-1322). Verify: `VITEST -t 'socket file|regular'` exits 0 and `rg -n 'isSocket' TOOL` prints the new line. Evidence: T:1340 lists a name the address adds only when `stat.isSocket()`, reusing the one `lstatOrNull` result, and notes any other path there without marking the check incomplete. `VITEST -t 'socket file|regular'` exit 0 with 2 passed; `rg -n 'isSocket' TOOL` prints T:1340.
- [x] T008 Add a dotenv bad-line case beside the dotenv case at V:733: a `.env` with one unparsable line and one lane key gives a note that names the file, keeps the M7 status FOUND, and prints no value (`VTEST`). Verify: it fails on `bf3bca7a8b1` (no note) and passes after T009. Evidence: V:749. On the unfixed tool it failed at `expect(m7.notes)` with `expected [] to deeply equal [ StringContaining{…} ]`. It passes after T009 and asserts that neither the rejected line's text nor the value prints.
- [x] T009 In `checkDotenv`, when the env-secret CLI's `keys` result has `valid === false`, add the note `some lines could not be parsed, so lane keys on them were not checked` with the file path, and leave `incomplete` unchanged (`TOOL` T:1490-1505). Verify: `VITEST -t 'dotenv'` exits 0 and `rg -n 'could not be parsed' TOOL` prints one line. Evidence: T:1532 to T:1533 add the note when `result.valid === false` and leave `incomplete` unset. `VITEST -t 'dotenv'` exit 0 with 2 passed; `rg -n 'could not be parsed' TOOL` prints only T:1533.
- [x] T010 Add a script-match table beside the ownership cases at V:818 to V:860 (`VTEST`): `node /Users/x/My Repo/.skilled/bin/hf-model-server.cjs` is true; `node other.js /path/hf-model-server.cjs`, `node /x/My Repo/y.js /p/hf-model-server.cjs` and `node /x/xhf-model-server.cjs` are false. Verify: the spaced case fails on `bf3bca7a8b1` (it returns false) and the other three pass. Evidence: V:891 to V:897. On the unfixed tool the spaced row failed with `expected false to be true`, and the other three rows passed.
- [x] T011 In `nodeScriptOf`, when the first non-option word is not a script, join the following words into the shortest prefix whose last segment is exactly `hf-model-server.cjs`, stop at the first later word that ends in `.js`, `.cjs`, `.mjs` or `.ts`, and otherwise return the first non-option word as before (`TOOL` T:1244). Verify: `VITEST -t 'script'` exits 0, the measured command prints `true true`, and the ownership cases at V:818 to V:860 pass. Evidence: T:1251, with `SCRIPT_EXTENSION` at T:198. `VITEST -t 'script'` exit 0 with 10 passed; the measured command printed `true true`; the ownership cases at V:838, V:859 and V:875 pass. [DEVIATION: the join tests whether a later word ends in `/hf-model-server.cjs` and slices the original line. That is the plan's shortest-prefix rule in one pass, per NFR-P02, and it keeps the spacing ps printed.]
- [x] T012 Reword header decision 3 to state that an exact-path row exempts the whole file, so new lane text in that file is not caught, and reword decision 7 to say the script path may contain spaces (`TOOL` header). Verify: `rg -n 'whole file' TOOL` and `rg -n 'may contain spaces' TOOL` each print one line. Evidence: `rg -n 'whole file' TOOL` prints only T:36 and `rg -n 'may contain spaces' TOOL` prints only T:48.
- [x] T013 Remove the line numbers from the 32 reasons that cite them, and keep all 47 paths unchanged (`ALLOW`). Verify: `rg -n '[Ll]ines? [0-9]' ALLOW` prints no line, and a `node -e` check shows 47 rows with the same paths. Evidence: `rg -n '[Ll]ines? [0-9]' ALLOW` printed no line (exit 1); a `node -e` comparison with the `HEAD` copy printed 47 rows, the same paths in order, and 32 reasons changed.
- [x] T014 Check each new sentence for T015 and T016 against `IDENTIFIER_TERMS` and `PROSE_TERMS` (`TOOL` T:110 to T:160), because the catalog page and the workflow file have no allowlist row. Verify: a `node -e` check of each sentence prints no hit. Evidence: a case-insensitive `node -e` check of the five new sentences against `IDENTIFIER_TERMS`, `PROSE_TERMS` and `PATH_TERMS` printed `hits=0`, and the tool's own `attributeTerms` returned `[]` for each.
- [x] T015 [P] Reword the every-push line in the `lane-residue` job comment at `.github/workflows/advisory-checks.yml` lines 21 to 23 to say the gate runs on every pull request and on pushes to `main` and `skilled/**`. Verify: `git diff -- .github/workflows/advisory-checks.yml` changes comment lines only, and `rg -n 'every push' .github/workflows/advisory-checks.yml` prints none. Evidence: `git diff` changes comment lines 23 to 25 only, and the trigger lines 3 to 5 are untouched; `rg -n -i 'every push'` on the file prints nothing.
- [x] T016 [P] Reword line 19 of `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` the same way, and add the whole-file allowlist sentence to section 2. Verify: `rg -n 'every push'` on that file prints none and `rg -n 'whole file'` on it prints one line. Evidence: line 19 names every pull request and pushes to `main` and `skilled/**`; `rg -n -i 'every push'` prints nothing; `rg -n 'whole file'` prints line 27 only. The page's `version` went from `1.0.0.0` to `1.0.1.0` under the sk-doc bump rule.
- [x] T017 [P] Reword line 375 of `P24/008-cleanup-wiring-and-gating/plan.md` the same way. Verify: `rg -n 'every push' P24/008-cleanup-wiring-and-gating/plan.md` prints none. Evidence: lines 370, 375 and 400 reworded; `rg -n -i 'every push'` on the file prints nothing. [DEVIATION: the plan named line 375 only, but a case-sensitive `rg 'every push'` matched lines 370 and 400, and line 375 held the same claim capitalized.]
- [x] T018 Close 005 T053 after the typecheck and shared tests pass (`P24/005-shared-embeddings-package/tasks.md` line 102). Verify: G10 exits 0 for each command, `ls .skilled/skills/system-skill-advisor/runtime/node_modules/@huggingface .skilled/skills/system-spec-kit/node_modules/onnxruntime-node` prints two `No such file` lines, and the tick cites the operator's `npm ci` report and phase commit `1f85a9dd6dd`. Evidence: G10: `npm run typecheck` exit 0 in the advisor runtime and in `system-spec-kit`; `npm test` in `system-spec-kit/shared` exit 0 with `pass 9`; the `ls` check printed two `No such file` lines. The T053 tick cites the conducting session's `npm ci` report and `1f85a9dd6dd`.
- [x] T019 Close 005 AC-014 and its Blocked wording in `P24/005-shared-embeddings-package/` spec.md (lines 36, 463), implementation-summary.md (lines 39, 113), goal.md (lines 78, 85), tasks.md (the `[B]` line, CHK-040 at line 203, the conductor row at line 282) and acceptance-criteria.md (line 67, line 95). Verify: `rg -n 'Blocked|Unmet|not committed' P24/005-shared-embeddings-package` prints no status field, and each AC-014 row is Met with its evidence. Evidence: 005 spec Status Complete with its open question resolved; the summary's Completed field, Verification row, What Was Built line and Known Limitations item 1 updated; AC-014 Met and Closeable Yes; T053, CHK-020 and both completion boxes ticked; CHK-032, CHK-040, the conductor sign-off and plan.md:139 updated. `rg -n 'Blocked|Unmet|not committed'` in 005 now prints only the notation row, the AC legend, the dependency table's Impact-if-Blocked header and text, and goal log row 78. [DEVIATION: goal.md lines 78 and 85 are append-only log rows, so the T020 row supersedes them instead of an edit.]
- [x] T020 Append one Complete row to the 005 goal log through `node .skilled/hooks/goal/bin/goal.cjs packet-log <005 folder> "<item> | Complete | <evidence>" --workspace <repo root>`, and never edit an existing row (`P24/005-shared-embeddings-package/goal.md`). Verify: `git diff` on that file shows additions only. Evidence: `goal.cjs packet-log` printed `STATUS=OK ACTION=packet-log` and `mutation=logged`; `git diff` on 005 goal.md shows one added line.
- [x] T021 Set the 024 parent Status (`P24/spec.md` line 41) and phase-map row 5 (line 118) to Complete. Then, in the 016 parent `../spec.md`, set row 24 to Complete and add row 25 for this packet beside rows 23 and 24. Verify: `rg -n '^\| 25 \|' ../spec.md` prints one line, and `rg -n 'Blocked' P24/spec.md` prints no status row. Evidence: 024 spec Status and row 5 read Complete; 016 row 24 reads Complete and row 25 names this packet; `rg -n '^\| 25 \|' ../spec.md` prints line 161; `rg -n -i 'blocked' P24/spec.md` prints nothing.
- [x] T022 Tick each of the five 024 goal criteria only after its own check holds, and cite each check in the progress row (`P24/goal.md` lines 88 to 92). Verify: criterion 2 is ticked only after G6 prints `RESULT: PASSED` on the final 024 docs, and an unmet criterion stays unticked. Evidence: criteria 1, 2, 3 and 5 ticked after their checks: `git log --reverse` shows the eight phase commits in folder order, G6 printed 9 `RESULT: PASSED` lines with exit 0, repo mode exit 0, the planted-term case passed, the socket case asserts 1 then 0, and `git branch -a --contains HEAD` lists only this branch. Criterion 4 stays unticked: C-08 waits on the operator after merge and BAT-01 is unchanged. The progress row went through `goal.cjs packet-log`.
- [x] T023 [P] Add the Evidence clause to each checked CHK row in `P24/001-residue-check-and-cleanup-tool/tasks.md` (12 rows); CHK-022 cites V:514 and V:497, and CHK-023 cites V:529 and V:404 (`P24/001-residue-check-and-cleanup-tool/tasks.md`). Verify: the count of checked CHK rows with an Evidence clause equals the count of checked CHK rows. Evidence: the evidence script reported `changed=12 checked=34 withEvidence=34`; CHK-022 cites V:514 and V:497, and CHK-023 cites V:529 and V:404, at `bf3bca7a8b1`.
- [x] T024 [P] Add the Evidence clause to each checked CHK row in `P24/006-prose-docs-and-changelogs/tasks.md` (11 rows), and leave a row unticked if no evidence supports it (`P24/006-prose-docs-and-changelogs/tasks.md`). Verify: the count of checked CHK rows with an Evidence clause equals the count of checked CHK rows. Evidence: the script reported `changed=11 checked=35 withEvidence=35`; every row had support, so none was unticked.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Run the strict validator on this packet (G7), before the index regeneration. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <025> --strict` prints `RESULT: PASSED`. Evidence: `validate.sh <025> --strict` printed `RESULT: PASSED` after `repair-derived`.
- [x] T026 Regenerate the trigger index as the last write (G9). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0, and no packet or tool file changes after it. Evidence: `generate-trigger-index.mjs` exit 0 and rewrote its four outputs; it ran once before these documents were filled and again as the last write.
- [x] T027 Run the Vitest file (G1). Verify: `VITEST tests/sweep-lane-residue.vitest.ts` exits 0 with no failed test. Evidence: `VITEST tests/sweep-lane-residue.vitest.ts` exit 0 with `Tests 103 passed (103)` after the review fix, against 92 at baseline.
- [x] T028 Run the gate test (G2 and G4). Verify: `node --test .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` exits 0 and the planted-term case passes. Evidence: `node --test .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` exit 0 with `tests 2`, `pass 2`; the planted-term case passed.
- [x] T029 Run repo mode on the regenerated tree (G3). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` exits 0 with `allowlistRowsMatched` 47 of 47. Evidence: repo mode exit 0 after the regeneration, with `allowlistRowsMatched` 47 of `allowlistRows` 47 and `live` 0.
- [x] T030 Confirm the fixture machine mode goes from 1 to 0 after apply (G5), through the real-socket case in T005. Verify: `VITEST -t 'probes and deletes the socket file'` exits 0. Evidence: `VITEST -t 'probes and deletes the socket file'` exit 0 with 1 passed; the case asserts machine exit 1 (V:921) and apply exit 0 after.
- [x] T031 Run the strict validator on 024 recursively with auto-repair off (G6). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <024> --recursive --strict` prints `RESULT: PASSED`. Evidence: the recursive run printed `RESULT: PASSED` for the parent and all eight children, exit 0.
- [x] T032 Run the strict validator on 016 with auto-repair off (G8). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <016> --strict` prints `RESULT: PASSED`. Evidence: the run printed `RESULT: PASSED` for 016 and each child, exit 0.
- [x] T033 Run the comment-hygiene check on the tool and its test (G11). Verify: `rg -n -e 'R[0-9]+-P2-' -e 'SL4-00' -e '025-review' TOOL VTEST` prints no line. Evidence: the `rg` printed no line (exit 1).
- [ ] T034 Run the follow-up `/deep:review` on the native executor, as the last step (G12). Verify: the review records a verdict and states SL4-005's disposition in its report.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` Open: T034, the follow-up `/deep:review`, has not run.
- [x] No `[B]` blocked tasks remaining Evidence: no task line carries `[B]`; it appears only in the notation table and this line.
- [x] Each new test seen failing before its fix (T006, T008 and T010) Evidence: the full-file run on the unfixed tool exit 1 with `3 failed | 95 passed (98)`, the three being these cases.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: `../024-ollama-lane-removal/review/review-report.md`
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

- [x] CHK-001 [P0] Requirements REQ-001 to REQ-012 documented in spec.md Evidence: `spec.md` section 4 holds REQ-001 to REQ-012.
- [x] CHK-002 [P0] Technical approach and the FIX ADDENDUM surfaces documented in plan.md Evidence: `plan.md` section 3 and the FIX ADDENDUM table name each surface with its action and check.
- [x] CHK-003 [P1] Baseline of the Vitest file, the gate test and repo mode recorded (T001, T002) Evidence: before any edit: Vitest 92 of 92 exit 0, gate test 2 of 2 exit 0, repo mode exit 0 at 47 of 47 (T001, T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in `.skilled/skills/system-spec-kit/runtime/cli` exits 0 Evidence: `npm run typecheck` in `runtime/cli` exit 0 on the edited test file.
- [x] CHK-011 [P0] The Vitest file prints no failure (G1) Evidence: G1 exit 0 with `Tests 103 passed (103)` (T027).
- [x] CHK-012 [P1] The regular-file case and the spaced-path case each fail on `bf3bca7a8b1` and pass after the fix Evidence: on the unfixed tool the regular-file case failed with M4 listing the file, and the spaced row failed with `expected false to be true`; both pass after the fixes (T006, T010).
- [x] CHK-013 [P1] The real-socket fixture is bound with `net.createServer().listen` in a short temp folder Evidence: V:909 calls `net.createServer()` and listens in a folder from `makeShortTempDir` (T005).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met Open: AC-001 to AC-023 are Met; AC-024 waits on the follow-up review.
- [x] CHK-021 [P0] Repo mode matches 47 of 47 after the index regeneration (G3) Evidence: repo mode exit 0 after the regeneration at 47 of 47 (T029).
- [x] CHK-022 [P1] Edge cases tested: regular file and absent path in the socket folder, and the TCP address Evidence: regular file at V:931; absent path in the `HF_EMBED_SERVER_URL` row of the table at V:771, which never writes `custom.sock` while M4 lists only the pid file; TCP address at V:952.
- [x] CHK-023 [P1] Error scenarios validated: the gate test passes, and the malformed allowlist cases still pass Evidence: the gate test exit 0 with 2 of 2 (T028); the malformed allowlist tables at V:401 to V:407 and V:521 pass in the 103-test run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class from plan.md's FIX ADDENDUM: `destructive-path hardening gap`, `false-negative status`, `input-parsing edge case`, `gate blind spot`, `documentation drift`, `doc-to-config drift`, `doc-code drift`, `completion-metadata drift` or `evidence-less checklist rows`. Evidence: `implementation-summary.md` Key Decisions maps each of the ten findings to its class from plan.md's FIX ADDENDUM.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the server file list is built in one place (`checkModelServer`), as plan.md's required inventory shows. Evidence: `rg -n 'MODEL_SERVER_DIR_FILES|dir\.files|lstatOrNull' TOOL` shows the server file list built once, in `checkModelServer` at T:1332.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `nodeScriptOf`, `runsModelServer`, `isOwnedModelServer` and `checkDotenv`, and for the docs and allowlist rows that name them. Evidence: the consumer `rg` lists `nodeScriptOf`, `runsModelServer` and `isOwnedModelServer` only in the tool (T:1276, T:1293, T:1294, T:1319, T:1324) and its test, and `checkDotenv` only at T:1637; the catalog page and the allowlist rows name none of the four.
- [x] CHK-FIX-004 [P0] Adversarial table tests for the path and parser fixes: a regular file, a missing path, the TCP address, a spaced path, `node other.js /p/hf-model-server.cjs`, `node /x/My Repo/y.js /p/hf-model-server.cjs` and `node /x/xhf-model-server.cjs`. Evidence: regular file V:931, missing path V:771, TCP address V:952, and the spaced path with the three false shapes at V:891 to V:897.
- [x] CHK-FIX-005 [P1] Matrix axes and their required rows are listed in plan.md, with the untested rows named. Evidence: `plan.md` lists the matrix axes; the untested rows (a directory or symlink at an address name, and an extensionless first word) are named in `implementation-summary.md` Known Limitations.
- [x] CHK-FIX-006 [P1] Hostile environment: the new cases set `HF_EMBED_SERVER_URL` inside the fixture and leave the scrubbed environment in place. The real-socket test awaits its listen and closes its server in `finally`. Evidence: the new cases set `HF_EMBED_SERVER_URL` in the fixture's own env object, and the file's `SCRUBBED_ENV` scrub still runs; the socket test awaits `listen` and closes the server in `finally` (V:927).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the implementation commit SHA recorded at closure, not to a moving branch range. Open: the evidence cites `bf3bca7a8b1` as the base, and the implementation commit does not exist yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] M7 prints a file path for a rejected line and never a value or the line's text (checked by reading the new note's code) Evidence: the note at T:1533 interpolates only the file path; V:749 asserts that neither the rejected line's text nor the value prints.
- [x] CHK-031 [P0] Apply deletes no regular file named by an explicit address (the regular-file case, T006) Evidence: V:931 asserts the regular file is still on disk with its content after apply, and that no action targets it.
- [x] CHK-032 [P1] N/A: no auth surface changes in this packet Evidence: N/A: no auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same requirements and gates Evidence: spec.md REQ-001 to REQ-012, plan.md section 5 gates G1 to G12 and tasks T025 to T034 name the same gates.
- [x] CHK-041 [P1] Code comments state the reason, with no finding ids, packet numbers or test ids in code comments or test names (G11) Evidence: G11 printed no line (T033); a wider sweep of the added lines for REQ, T0, CHK, AC, ADR and packet numbers found only the existing allowlist phrase `spec packet`.
- [x] CHK-042 [P2] The catalog page and the tool header state the whole-file allowlist limit Evidence: the catalog page line 27 and the tool header T:36 each state the whole-file limit.
- [x] CHK-043 [P1] The 024 parent, 005 and 016 completion metadata agree: 005 Complete, 024 Complete, 016 row 24 Complete Evidence: 005 spec Complete, 024 spec Complete and 016 row 24 Complete (T019, T021).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files went to the session scratchpad outside the repository; `git status` lists no task-created file outside the planned set.
- [x] CHK-051 [P1] scratch/ cleaned before completion; `scratch/.gitkeep` stays Evidence: `ls -A scratch` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 14 | 13/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---
