# Amendments made before the first scenario run

Each row is a change from the phase documents as written, with the reason.

| Item | Before | After | Reason |
|---|---|---|---|
| S1 frozen pattern A | `^warning$` | `^warn$` | Scenario 476 Expected and Pass sections say `warn`, and validate.sh prints `warn`. The scenario Pass section prevails. |
| S8 frozen patterns | `RESULT: PASSED`, `^leftover_tokens 0$`, `cleanup=ok` (the `leftover_tokens` line was to be written by the conductor) | `^devin_exit=0$`, `^packet=specs/zz-pb-card/001-card-authoring\nval_exit=0\nRESULT: PASSED\n0$`, `cleanup=ok` | Scenario 483 now runs its own Commands blocks. Its step 3 prints the packet path, val_exit, the RESULT line and a bare token count in that order, which is the scenario Pass section. |
| Runner fences | every fenced block under `### Commands` ran | only `bash` and `sh` fences run | A `text` fence under Commands must not execute. A fixture with a text fence and a bare fence ran only the bash and sh blocks. |
| Runner stdin | the T009 loop and rerun inherited stdin | both end with `</dev/null` | A scenario command that reads stdin must not eat the remaining map rows. |
| S8 dispatch | a conductor-written brief and a Task subagent on DeepSeek | scenario 483's own Commands run through the runner, dispatching cli-devin swe-2-max with `--permission-mode dangerous` | The operator approved dangerous mode for this dispatch. The conductor does not retype scenario commands. |
| Outcome `dispatchModel` | DeepSeek string | `swe-2-max` for S8, `none` for scripted scenarios | The honest dispatch model. |
| T016 patch gate | `git diff` only, `branch -D` | tracked diff plus a `git diff --no-index /dev/null <file>` entry per untracked file, and `branch -d` | Untracked files never appear in `git diff`. The scenario 483 pointer file is untracked. |
| Verdict wording | the README headline and the index row used different rules | one rule: PASS when all 8 are PASS or FIXED, otherwise FAIL with counts | One rule for both places. |
| Executors | cli-codex, OpenCode and DeepSeek wording | the phase agent is the single worker, with cli-devin only for scenario 483 and the review | Conductor decision of 2026-10-25. |
| Fix loop | a fix worker for any FAIL row | a fix only for a row whose output fails the scenario's own Pass section | A row that passes its Pass section but not the frozen pattern is a SCENARIO_DEFECT. |
