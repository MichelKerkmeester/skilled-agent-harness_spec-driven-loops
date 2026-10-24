---
title: "Goal: Phase 2: template-and-example-defect-repair"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template and example defect repair goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair"
    last_updated_at: "2026-10-23T11:27:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: template-and-example-defect-repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Apply every ledger row that phase 1 assigned to this phase, so that no example doc, authoring checklist or style guide in system-spec-kit teaches a weak model a broken line. The spec-kit suite result stays the same.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every exact text swap is made by `apply_row.py` and never by a model. It runs only when the old text occurs exactly once in its file. |
| D2 | Only the files named by the 25 known rows in `tasks.md` T004, by owner `002` ledger rows and `templates/.hashes` change. No other file under `templates/core`, `templates/addons` or `templates/packet-types` changes than `templates/core/implementation-summary.md.tmpl` and `templates/addons/resource-map.md.tmpl`, which owner `002` rows L-A-002 to L-A-005 fix. |
| D3 | `templates/.hashes` is deleted only when both reader searches in `tasks.md` T008 exit with code 1. |
| D4 | Rows owned by the write recipe (`041-006`) and by phases 3 to 6 are not touched here. |
| D5 | One worker fixes only a row the applier could not apply as a swap, one row and one file per brief, with at most 3 workers at once and never two that write the same file. |
| D6 | The phase closes on a matching suite comparison and one read-only review through `cli-devin` with `swe-2-max`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -c '^APPLIED K-' scratch/applied.txt` prints `25` and `grep -c '^KCHECK K-.* locator=0 expected=1$' scratch/applied.txt` prints `25`
- [x] `grep -c '^YES ' scratch/recheck.txt` prints `0`, so no owner `002` ledger row still reproduces. `grep -c '^K-LEFT .* [1-9][0-9]*$' scratch/recheck.txt` prints `0` too
- [x] The leaked-text search in `tasks.md` T007 prints nothing, and its exact-line check prints `18 1`
- [x] `test ! -e .skilled/skills/system-spec-kit/templates/.hashes` succeeds, and `rg -l --hidden '\.hashes' .skilled --glob '!**/node_modules/**' --glob '!.git'` exits with code 1
- [x] `tasks.md` T014 prints `SUITE_MATCH`, and `tasks.md` T013 prints `0` changed paths that no row names
- [x] `scratch/review/T015.txt` holds only lines that start with `P0`, `P1` or `P2`, or the single line `NO FINDINGS`. Each P0 and P1 line is fixed
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 1 closed with a reviewed ledger (T001) | Done | `LEDGER_OK`, `exit=0`, `REVIEW_OK` |
| Tools checked (T002) | Done | Python 3.9.6, jq-1.7.1-apple, ripgrep 15.2.0, v26.8.2 |
| Phase start commit | Done | 800c89b50440c1415ca135ef2771611faee5fc32 |
| Known rows saved (T004) | Done | file byte-identical to the T004 heredoc, checks printed `25` and `25 1` |
| Applier saved and tested (T005) | Done | self-test printed `APPLIED K-08`, `FAIL K-08: locator found 0 times`, `exit=1`, `1`, then `SYNTAX_OK`. After the `DELETE LINE` fix the self-test ran again on the committed copy of the file with the same four lines |
| 25 known rows applied (T006) | Done | counts `25`, `25`, `25`, no `BLOCKED` line |
| Example descriptions checked (T007) | Done | first search printed nothing, then `18 1`, then `0` |
| `.hashes` reader guards and delete (T008) | Done | `rc=1` twice, then `DELETED`. The file was tracked |
| Census rows applied (T009 to T011) | Done | T009: 47 rows, 47 lines, 0 `OUT-OF-SCOPE`; tally 18 `APPLIED`, 24 `SKIP-GONE`, 5 `NEEDS-WORKER`. All five were evidence that tested a disk fact (see findings). After the ledger fix the T010 prepare block selected no row, so no worker ran. T011 had no `DELETE-PENDING` row |
| Every row rechecked, scope checked (T012, T013) | Done | T012 printed `0`, `0`, `0`. T013 printed `0` unexplained paths over 36 changed files, and `0` template paths outside the two allowed files, after the phase 003 count amendment was committed apart as `b30bca0214` |
| Suite compared with the phase 1 start (T014) | Done | `SUITE_MATCH` on run 4, `exit=0`, 2243 s. Runs 1 to 3 are in the findings below |
| Frontier review and findings (T015, T016) | Done | cli-devin swe-2-max `--permission-mode auto`, session `longhaired-aftershave`, 191 s. Four findings, each confirmed in the file: P1 `quick-reference.md:185` still said `(Level 3 only)`, P2 `templates/examples/README.md` lines 71 and 84 still said `level_3+`, P2 line 115 still linked `../manifest/README.md`. All four are second copies that the census rows fixed in one place only. Applied as rows R-1 to R-4 in `scratch/review-rows.jsonl` through `apply_row.py`, each `extra_paths=0`. T016 printed `COUNTS_MATCH`, and T012 (`0 0 0`) and T013 (`0`, `0`) were rerun clean |
| Phase closed and committed (T017) | Done | strict `RESULT: PASSED`, one local commit. The level 2 scaffold probe printed `packet_pointer: "scaffold/001-pointer-probe"`, so phase 003's T014 counts hold. Next: `041-write-recipe-fixes/006-fix-write-recipe-move-destination`, then phase 003 |

### Deviations and findings

| Item | Note |
|------|------|
| Applier wrote `DELETE LINE` | Row L-A-001's `expected_text` is the instruction `DELETE LINE`, which `apply_row.py` did not refuse, so T009 wrote that text into `templates/README.md`. The applier now removes the whole line that holds the locator for that value (T005 heredoc changed). The line was restored and L-A-001 re-applied: `APPLIED`, `extra_paths=0`, and only the stress-test line is gone |
| Core and addons rows | The ledger gives this phase L-A-002 to L-A-004 (`core/implementation-summary.md.tmpl`) and L-A-005 (`addons/resource-map.md.tmpl`), which D2 forbade. The operator chose to keep the four fixes, amend D2 and T013 for those two files, and move phase 003's frozen counts. Phase 003's own T005 test on a copy printed `converted 14` and `20 14` for implementation-summary instead of `11` and `17 11`, with `LEFTOVERS_SAME`, so its total becomes 217 |
| Evidence that tested a disk fact | L-A-001, L-A-005, L-B-022, L-B-023 and L-B-024 had evidence commands such as `test -d templates/stress-test || echo MISSING`, true before and after the fix. The operator chose to rewrite those five `evidence_cmd` values in the phase 1 ledger to `grep -qF -- '<locator>' '<file>' && echo STILL-PRESENT`. They print `NO` on the fixed tree and the locator is present in each committed file. The ledger was untracked, so a backup was taken first and the ledger is committed with this phase |
| Compiled contracts regenerated | Suite run 2 printed `Tests  5 failed | 4157 passed | 21 skipped (4183)`: three `render-command-contract` and two `check-contract-drift` tests reported `STALE_SOURCE_DIGEST` for `references/workflows/auto-mode-contract.md`, which a row edited. `compile-command-contracts.cjs --write` for `deep/ai-council`, `deep/review` and `deep/research` changed one line in each compiled contract, the digest `c7da6611…` to `dbaeb353…`. `check-contract-drift.cjs` then printed `OK commands=3` and both test files passed 43 of 43. These generated files follow mechanically from the row and D2 did not name them, so T013 now allows them |
| Version bump re-staled the contracts | The phase commit `e6a8179aaa` passed through the `doc-version-bump` hook, which raised the `version:` line of 12 changed docs, `auto-mode-contract.md` among them. That changed its digest after the contracts were compiled, so the committed tree had three stale digests (`dbaeb353…` recorded, `a78bc788…` live). The contracts were recompiled and committed apart. A scan for the phase-start hash of every changed `.md` file found the three contracts for `auto-mode-contract.md` and no other consumer, so nothing else records these docs. Later phases that edit a contract source must recompile after their commit, since the hook runs at commit time |
| T017 count | T017's last command counts staged paths under `$S` and printed `37`, while `changed-files.txt` holds 40. The three compiled contracts sit under `.skilled/commands/`, outside `$S`, so 37 plus 3 is the full set |
| Golden snapshot updated | Suite run 3 matched the runtime lane (`Test Files  276 passed | 3 skipped (279)`, `Tests  4162 passed | 21 skipped (4183)`) but the CLI lane printed `Tests  3 failed | 2058 passed | 20 skipped (2081)`: `scaffold-golden-snapshots` recorded the old `packet_pointer` of the Level 2, 3 and 3+ implementation summaries, which rows L-A-002 to L-A-004 changed on purpose. The snapshot update changed exactly those three lines, `Snapshots  3 updated`, and the test then passed 12 of 12. The CLI lane's legacy and validation steps had not run because they chain after vitest with `&&` |
| Suite guard raised | Suite run 1 ended `exit=124` because the suite's own 600000 ms bound stopped it under machine load (load average about 7). Later runs set `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`. The bound is a time limit, not a test, and T014 compares the same summary lines |
| Review findings applied by script | T016 says to send each finding to a worker. All four were exact swaps or one line removal, and D1 says every exact swap is made by `apply_row.py` and never by a model, so D1 governs and no worker ran. The reviewer prefixed its first finding with narration. The raw reply is `scratch/review/T015.raw.txt`, and `T015.txt` holds the four finding lines verbatim |
| Review run read-only on files | T015 names cli-codex, and parent D4 and this phase's D6 name cli-devin swe-2-max. It runs on `--permission-mode auto`, which refuses shell commands, so the conductor wrote the diff, the stat, the owner `002` rows and the five check outputs to `scratch/review/` and the reviewer reads only files |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
<!-- /ANCHOR:log -->
