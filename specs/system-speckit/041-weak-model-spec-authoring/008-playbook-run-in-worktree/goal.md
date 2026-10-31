---
title: "Goal: Phase 8: playbook-run-in-worktree"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook run in worktree goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
    last_updated_at: "2026-10-25T00:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Ran the eight scenarios, published the report and closed the phase"
    next_safe_action: "Start phase 009 from the report folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: playbook-run-in-worktree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run every new or changed manual-testing-playbook scenario from phase 007 inside one disposable sk-git worktree and publish a captured, scripted PASS or FAIL for each one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The only scenario host is one disposable worktree created through `worktree-naming.sh create` from the operator's `BASE_REF`. The primary checkout never runs a scenario. |
| D2 | Every scenario runs from its own `### Commands` fenced block. The conductor never retypes a command. |
| D3 | A verdict is a match against the frozen patterns in `scratch/scenarios.tsv`. A run that satisfies the scenario's own Pass section but not the pattern is a `SCENARIO_DEFECT`, not a pass. |
| D4 | A failed scenario gets one fix brief and one rerun, at most three times. After the third failed fix the row becomes `ESCALATED` and the other scenarios continue. |
| D5 | The report package copies the real file set of an existing report folder: `README.md`, `results.csv`, `source.md` and `outcomes/`. The ten `sk-create-benchmark` section headings live inside `README.md`. |
| D6 | Durable writes land in this phase folder plus the one report folder and one reports index row. No source file under `.skilled/` is edited by hand. |
| D7 | The report folder is written before the worktree is removed, so no evidence depends on a deleted directory. |
| D8 | The conductor is a Claude Code session. Every worker is one cli-codex gpt-6-luna max fast dispatch, with cli-devin swe-2-max as fallback. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `wc -l < specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/scenarios.tsv` prints `8`
- [x] `find specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs -name '*.txt' | wc -l` prints at least `8`
- [x] `R=$(find .skilled/skills/system-spec-kit/benchmark/reports -maxdepth 2 -name results.csv -path '*manual-testing-playbook--weak-model-authoring*' | head -1); test -n "$R" && wc -l < "$R"` prints `9`, `find "$(dirname "$R")/outcomes" -name '*.json' | wc -l` prints `8`, and `rg -c '^## [0-9]+\. ' "$(dirname "$R")/README.md"` prints `10`
- [x] `grep -c '^PRIMARY_CLEAN$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/primary-status.txt` prints `1`
- [x] `grep -c '^WORKTREE_GONE$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/removal.txt` prints `1`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree --strict` prints `RESULT: PASSED`
- [x] `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/review/T017.txt` prints `0`
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
| Phase opened | Done | X0 precheck passed on 2026-10-25: HEAD `7a0b549b99` (two record commits above BASE_REF), `git status --porcelain --untracked-files=all` lists nothing outside `001-template-drift-census-and-baseline/scratch/`, phase 007 `**Closeable:** Yes`, 6 Done precondition rows (the check is at least 4), `devin auth status` printed `Logged in (via Devin)` |
| `BASE_REF` recorded | 95abd302c8fbe320f9fd76b36951e33fff5f7d10 | Read from the parent `goal.md` BASE_REF row. It resolves with `git rev-parse --verify`, and `git cat-file -e` succeeded for the card, both guard scripts, the `template-authoring/` directory and `templates/core/spec.md.tmpl` (3 `v2.3` matches). `git diff --stat 95abd302c8 HEAD -- .skilled` printed nothing |
| Worktree created and own-code check passed | Done | `worktree-naming.sh create playbook-run 95abd302c8 --no-provision` printed `worktrees/221-playbook-run /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/221-playbook-run`. Provisioning ran in the background and ended `exit=0`, `provisioned: 11 installed, 5 built, 3 already present, 0 failed` after 1094 s. Own-code check: five `OWN` lines, `MISSING runtime/node_modules` (allowed), no `FOREIGN`, `ORCH_OK`. T007 printed five `PRESENT` lines, including `PRESENT base-ref` |
| Scenarios S1 to S7 recorded | Done | `scratch/results.tsv` S1 to S7 all PASS, run 2026-10-25 01:47:33 to 01:47:44 (11 s). S1 `warn`,`true`; S2 `error`,`false` with detail lines at spec.md lines 3, 23 and 36; S3 five `v2.2` stamp counts of 1 then `error`,`false`; S4 `clean_exit=0`,`EXAMPLE_DRIFT_OK`,`broken_exit=1`,failure count 1, `EXAMPLE_DRIFT_OK` count 0; S5 `golden_exit=0` `Tests  12 passed (12)`, `fill_exit=0` `Tests  16 passed (16)`; S6 `4`,`0`,`1`; S7 `clean_exit=0`, 9 PASS lines, `CARD SYNC OK`, `broken_exit=1`, `CARD SYNC FAILED`. Each scenario also printed `cleanup=ok` where it defines it. Each run was read against the scenario Pass section, not only the frozen patterns. No row was a FAIL or SCENARIO_DEFECT, so T011 did not run |
| Scenario S8 recorded | Done | Scenario 483 ran through the runner on attempt 1 of 1: cli-devin swe-2-max, `--permission-mode dangerous`, 01:47:44 to 01:50:38 (2 min 54 s). `scratch/runs/483.txt` holds `brief=      25 lines`, `devin_exit=0`, `packet=specs/zz-pb-card/001-card-authoring`, `val_exit=0`, `RESULT: PASSED`, `0`, `cleanup=ok`. The worker reply and its validation output are under `scratch/runs/483.worker-1/`. No rate-limit reply. The worker reply says its first strict run hit two derived-metadata errors that it repaired before the second run passed |
| Report package written | Done | `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/`: 3 top-level files, 8 outcome JSON files, `results.csv` 9 lines, `README.md` 10 numbered sections. Built by `scratch/tools/build-report.py` from `results.tsv` and the run files. Verdict `PASS` (8 PASS, 0 FAIL) |
| Reports index row added | Done | One row inserted after the header separator of `.skilled/skills/system-spec-kit/benchmark/reports/README.md`; `rg -c` for the folder name printed `1`: `8 PASS, 0 FAIL`, `**PASS**` |
| Primary checkout gate | Done | `scratch/tools/check-main.sh` compared MAIN status with the baseline: 341 lines before, 341 after, 0 changed lines, `PRIMARY_CLEAN`. No other-session activity showed up in the comparison |
| Worktree removed | Done | `scratch/worktree/removal.txt`: `RUNS_RECORDED 8`, `PATCH_GATE_COVERED` (1 status entry, 1 patched), no commit beyond BASE_REF, `fix.patch` and `status.txt` saved, `REMOVAL_OK`, `WORKTREE_GONE`, `BRANCH_GONE`. `git worktree remove` without `--force` refused because of the one untracked file, which `fix.patch` holds, so `--force` was used. `git branch -d` deleted `worktrees/221-playbook-run` (was `95abd302c8`) |
| Frontier review | Done | cli-devin swe-2-max `--permission-mode auto`, read-only, one attempt (01:54:25 to 01:57:53, devin exit 0, empty err file). Reply: 3 P2 lines, 0 P0, 0 P1. T018 `findings=3`, `unrecorded=0`, all three `T018-APPLIED`. Files: `scratch/review/T017.raw.txt`, `T017.txt`, `T017-input/`, `scratch/briefs/T017.txt` |
| Phase closed | Done | Strict validation printed `RESULT: PASSED` on 2026-10-25, all nine acceptance rows Met, `**Closeable:** Yes` |
| Next phase ready | Done | Phase 009 can start: the report folder and `results.csv` exist, all eight scenarios PASS, and the build branch carries this phase's one local commit (never pushed) |

### Deviations and findings

| Item | Note |
|------|------|
| Primary checkout gate | The gate allows this phase folder, the new report folder and one reports index row when the conductor works in the primary checkout. The report is a product of the phase and cannot live inside the phase folder without breaking the reports convention. |
| Scenario map source | Phase 007 plan section 3.1 freezes the eight ids and paths. This phase copies them into `scratch/scenarios.tsv` and stops with `NO_FILE` or `AMBIGUOUS` when a scenario file is missing or an index row is duplicated. |
| Fix patch | A fix edits a tracked file under `.skilled/`, so T016 saves the worktree diff to `scratch/fixes/fix.patch` and its status to `scratch/fixes/status.txt` before removal. The operator or the phase 009 conductor applies that patch to the build worktree. |
| Bracket scan | The scan flags JavaScript destructuring inside fenced code blocks in `tasks.md`. A fenced block is not an unfilled scaffold hint, so the literal scripts stay and this row records the result. |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
| Executors on 2026-10-25 (supersedes the OpenCode, DeepSeek, Task-tool and cli-codex wording) | The conductor made this phase agent the single worker. Every scenario ran from its own `### Commands` blocks through the runner. The only external dispatches are scenario 483's own cli-devin swe-2-max worker (`--permission-mode dangerous`, approved by the operator for benchmark-style dispatches) and the T017 review (cli-devin swe-2-max `--permission-mode auto`). No subagent was dispatched. A fix (T011) would be made by this agent, at most 3 attempts per row. The cli-pi DeepSeek route was not used. D8, the takeover row, `plan.md` lines about OpenCode, DeepSeek and the Task tool, `tasks.md` T010 and T017 wording, and `spec.md` NFR-S01 are history and were not rewritten |
| T002 provider check | The `opencode.json` check is stale. It was replaced by `command -v devin` (printed `/Users/michelkerkmeester/.local/bin/devin`) and `devin auth status` (printed `Logged in (via Devin)`). node v26.8.2, npm 11.19.1, jq 1.7.1, ripgrep 15.2.0, shasum 6.02, perl 5.034001, openrsync were present |
| T001 Done-row count | `tasks.md` expects `4` Done precondition rows and the tree holds 6. The check is at least 4, so the expected text was wrong and the gate passed |
| X1 amendment: S1 pattern | Before: `^warning$` (`tasks.md` T004 map row S1 and `plan.md` section 3.3). After: `^warn$`. Scenario 476's own Expected and Pass sections say `warn` and `validate.sh` prints `warn`, so the scenario Pass section prevails (D3, ADR-004) |
| X1 amendment: runner fences | Before: the T008 runner awk executed every fenced block under `### Commands`. After: it executes only `bash` and `sh` fences (`tasks.md` T008 and `plan.md` section 3.4). A fixture with a `text` fence and a bare fence printed only `BASH_RAN` and `SH_RAN` |
| X1 amendment: stdin | Before: the T009 loop and the T011 rerun called `run-scenario.sh` with the loop's stdin. After: both lines end with `</dev/null`, so a scenario command cannot eat the remaining map rows |
| X1 amendment: S8 patterns | Before: `RESULT: PASSED`, `^leftover_tokens 0$`, `cleanup=ok`, where `leftover_tokens` is a line T010 wrote itself. After: `^devin_exit=0$`, `^packet=specs/zz-pb-card/001-card-authoring\nval_exit=0\nRESULT: PASSED\n0$`, `cleanup=ok`. Scenario 483 now runs its own Commands blocks through the runner like S1 to S7, and its step 3 prints the packet path, `val_exit`, the `RESULT` line and a bare token count in that order, which is the scenario Pass section. `tasks.md` T004 map and `plan.md` section 3.3 carry the new row |
| X1 amendments carried in the run scripts | T010 is replaced by running scenario 483 through the runner, with a free-tier rate-limit reply retried after the named reset (or 10 minutes) and every attempt logged. The outcome JSON `dispatchModel` is the real model (`swe-2-max` for S8, `none` for scripted scenarios). T011 runs only for a row whose output fails the scenario's own Pass section, and a row that satisfies Pass but not the frozen pattern is `SCENARIO_DEFECT`. T016 includes untracked files in `fix.patch` (`git diff --no-index /dev/null <file>`) and uses `git branch -d`. The README headline and the index row use one rule: `PASS` when all 8 are PASS or FIXED, otherwise `FAIL` with counts |
| Full suite | No full suite ran in this phase: it adds a report package and phase documents only |
| T005 block exit status | The T005 block ends with `test -d "$WT"` before `$WT` is defined in that shell, so the block exits 1 with an empty `WORKTREE_DIR_OK`. `env.sh` holds the right `WT`, and sourcing it then `test -d "$WT"` printed `WORKTREE_DIR_OK` |
| T008 block extraction | The fixture block in T008 holds inner code fences, so a fence-aware extractor cuts it short. The three affected blocks were run from their exact line ranges in `tasks.md` |
| T009 and T010 results | S1 to S7 PASS and S8 PASS on the first attempt. No FAIL, no FIXED, no ESCALATED, no SCENARIO_DEFECT. T011 did not run, `scratch/fix/` holds no brief |
| T016 removal and the pointer file | Scenario 483 left its pointer file `specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt` untracked inside the worktree, as phase 007 forwarded. It was the only status entry. `fix.patch` holds it as a new-file diff (`git diff --no-index /dev/null`), so the gate covered it. Rollback sentence written before removal: to undo, `git worktree add -b <new branch> <dir> 95abd302c8` then `git apply scratch/fixes/fix.patch`. The removal script lives at `scratch/tools/remove-worktree.sh` |
| Advisor daemon left by the S8 worker | The devin session started the skill advisor daemon with the worktree as its root (PIDs 22141 and 22142, parent 1). Both were stopped with SIGTERM before removal. No other process referenced the worktree path afterwards |
| T016 console lines | The T016 block prints `SCRATCH_CLEAN`, `PATCH_SAVED` and `STATUS_SAVED` outside its `tee`, while AC-009 reads them from `removal.txt`. They were prepended to `removal.txt` from the console output of the same run |
| Scenario temp folder | The scenario writes its worker files under a `mktemp -d` folder outside the repository. Its four files were copied to `scratch/runs/483.worker-1/` and byte-compared with `cmp`, then the temp folder was removed |
| Forwarded phase 007 P2s | Recorded and not applied, because this phase edits no scenario or product file: scenarios 479 and 482 list their tools without `awk` and `rg` (both scenarios ran green here), and scenario 483 stores its pointer under phase 007's `scratch/verify/` inside the worktree and never removes it (captured in `fix.patch`) |

Review T017 (cli-devin swe-2-max, `--permission-mode auto`, one attempt, 01:54:25 to 01:57:53, devin exit 0, `scratch/review/T017.attempts.txt`). The input was the files listed in `scratch/briefs/T017.txt` under `scratch/review/T017-input/`. The reviewer returned 3 P2 lines, no P0 and no P1. Each was confirmed by reading the named README line and the evidence behind it.

T018-APPLIED F01 report-README.md:34 provisioning tally: true gap in the review input, the tally is the last line of `scratch/worktree/provision.out`. The report `source.md` now names that file and `provision-exit.txt`, and README section 3 cites the file
T018-APPLIED F02 report-README.md:61 timings: true gap, no duration record existed. `scratch/timings.txt` now holds the modification times and the elapsed seconds (provisioning 1094 s, S1 to S7 within 11 s of each other, S8 174 s after S7). README sections 5 and 9 cite it and say "within 11 seconds of each other" in place of "finished in 12 seconds", and the 9th section expects about 3 minutes for the eight scenarios in place of "under 5 minutes"
T018-APPLIED F03 report-README.md:36 30 minute alarm: true gap, the alarm is line 21 of `scratch/tools/run-scenario.sh`. The report `source.md` now has a Runner row naming that file and line, and README section 3 cites it
| Changelog and validation on 2026-10-25 | `nested-changelog.js --write` ran after the first strict pass. The generator copied raw task text into its Added, Changed and Fixed sections, so they were rewritten by hand from `implementation-summary.md` in `specs/system-speckit/054-weak-model-spec-authoring/changelog/changelog-054-008-playbook-run-in-worktree.md`. `repair-derived.cjs --apply` re-derived `graph-metadata.json` twice (generated metadata drift after the doc edits). Final `validate.sh --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, with AC_COVERAGE 9/9 |
| Timings | Provisioning 1094 s, S1 to S7 run files written within 11 s of each other, S8 174 s after S7 (`scratch/timings.txt`). The report README cites the same numbers |
<!-- /ANCHOR:log -->
