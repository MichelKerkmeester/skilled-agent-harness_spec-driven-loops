---
title: "RRX-005 -- Executor failure triage"
description: "This scenario validates executor failure triage for `RRX-005`. It focuses on recognizing fast-failing runs by their recorded exit and error tail, removing them before resuming because resume skips every recorded job, and knowing how the scorer treats them."
stage: routing
version: 1.0.0.0
---

# RRX-005 -- Executor failure triage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRX-005`.

---

## 1. OVERVIEW

This scenario validates executor failure triage for `RRX-005`. It focuses on recognizing fast-failing runs by their recorded exit and error tail, removing them before resuming because resume skips every recorded job, and knowing how the scorer treats them.

### Why This Matters

The harness resumes by skipping every (arm, prompt, rep) already written to the runs file, and it writes failed runs too. So a batch that hits an exhausted quota or a missing trust entry does not stop. It burns through the rest of its schedule in about a second per job and records each one as done. Resuming without cleaning the file retries nothing. In one observed case a Devin run hit `daily usage quota has been exhausted` and recorded 243 failed rows before anyone looked.

The scorer then hides the damage in two ways. Inside an arm that has at least one good run, failed runs show up only as an `unscorable` count. An arm whose every run failed is dropped from the output entirely, with no `runs=0` line to notice.

The diagnostic steps are read-only. The cleanup step rewrites the runs file, so it keeps a backup first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRX-005` and confirm the expected signals without contradictory evidence.

- Objective: find failed rows in a runs file, read their cause from the error tail, remove them, and resume so that only the removed jobs run again
- Real user request: `Half the experiment runs came back in under a second. What happened and how do I rerun just those?`
- Prompt: `A batch of experiment runs failed within a second each. Find out why, clean the runs file and resume without losing the runs that did succeed.`
- Expected execution process: count rows carrying an `error` tail, read a few of them for the executor's own message, fix the cause, back up the runs file, keep only rows with exit 0, then rerun the same `run` command and confirm it schedules only the removed jobs.
- Expected signals: a non-zero `"error"` count, error tails such as the quota message with `seconds` near 1, a resume before cleanup printing `0 runs to do (<all> already recorded)`, and a resume after cleanup printing `<removed> runs to do (<kept> already recorded)`.
- Desired user-visible outcome: the operator learns the cause from the executor's own words, reruns exactly the failed jobs, and keeps every good run.
- Pass/fail: PASS if the failed rows are found and their cause named from the error tail, the cleaned file holds only exit 0 rows, and the resume schedules exactly the removed jobs, FAIL if the operator resumes without cleaning, deletes good rows, or reports scored rates without the unscorable count.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `A batch of experiment runs failed within a second each. Find out why, clean the runs file and resume without losing the runs that did succeed.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRX-005 | Executor failure triage | Verify fast-failing runs are found by their error tail, removed before resuming, and rerun alone | `A batch of experiment runs failed within a second each. Find out why, clean the runs file and resume without losing the runs that did succeed.` | 1. `bash: X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment && R="$T/runs.jsonl"` -> 2. `bash: grep -c '"error"' "$R"` -> 3. `bash: grep -m 3 '"error"' "$R"` -> 4. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor deepseek --out "$R" --limit 8` -> 5. `bash: cp "$R" "$R.bak"` -> 6. `bash: python3 -c 'import json,sys; p=sys.argv[1]; keep=[l for l in open(p) if json.loads(l)["exit"] == 0]; open(p, "w").writelines(keep)' "$R"` -> 7. `bash: grep -c '"error"' "$R"` -> 8. `agent: Fix the cause named in step 3, then rerun the step 4 command` | Step 2: a count above 0. Step 3: error tails with `"exit": 1` or another non-zero code and `seconds` near 1. Step 4 before cleanup: `0 runs to do (8 already recorded)` when all eight jobs are recorded. Step 7: `0`, exit 1. Step 8: `<removed> runs to do (<kept> already recorded)` | Step 2 count, step 3 error tails, step 4 line, step 7 count, the step 8 first line, and the backup path | PASS if the cause is named from step 3, step 4 proves resume skips failed rows, step 7 prints 0, and step 8 schedules exactly the removed jobs. FAIL if the run is resumed before cleanup, good rows are lost, or rates are reported without the unscorable count | 1. Read the error tail before anything else, since it carries the executor's own reason. 2. If step 8 still exits in about a second, the cause is not fixed, so stop and restore from `$R.bak` before the file fills with failures again. 3. Timeouts record `"exit": "timeout"` with no error tail, so step 2 misses them while step 6 still removes them |

### Commands

Run from the repository root in the shell that ran the failing batch, so `$T` still names its temporary directory. Step 4 starts no executor only when the failed batch ran to completion, so every scheduled job is recorded. If the batch was interrupted, skip step 4, because it would start the missing jobs on the broken executor. Step 8 starts the executor again.

1. `bash: X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment && R="$T/runs.jsonl"`
2. `bash: grep -c '"error"' "$R"`
3. `bash: grep -m 3 '"error"' "$R"`
4. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor deepseek --out "$R" --limit 8`
5. `bash: cp "$R" "$R.bak"`
6. `bash: python3 -c 'import json,sys; p=sys.argv[1]; keep=[l for l in open(p) if json.loads(l)["exit"] == 0]; open(p, "w").writelines(keep)' "$R"`
7. `bash: grep -c '"error"' "$R"`
8. `agent: Fix the cause named in step 3, then rerun the step 4 command`

### Expected

Step 2 prints the number of rows that carry an `error` field. The harness writes that field only when the executor exits non-zero, holding the last 400 characters of its stderr or stdout. Step 3 shows up to three such rows. A fast failure reads like `"exit": 1, "error": "...daily usage quota has been exhausted...", "seconds": 0.9`. That is the executor's message, not reply text.

Step 4, run before cleanup with the same schedule flags as the failed batch, prints `0 runs to do (8 already recorded)` and starts nothing. This is the trap: failed rows count as recorded, so a plain resume never retries them.

Step 6 keeps only rows with exit 0, which also drops `timeout` rows. Step 7 then prints `0` and exits 1, because `grep -c` exits 1 when nothing matches. Step 8, after the cause is fixed, prints `<removed> runs to do (<kept> already recorded)` as its first line. For example, five good rows and three failed ones resume as `3 runs to do (5 already recorded)`.

Executor prerequisites, checked before any rerun:

- Devin needs each run directory's parent, `$T/envs/<arm>/runs`, listed under `trusted_paths` in `~/.local/share/devin/cli/trusted_workspaces.json`, and needs stdin from `/dev/null`. The harness already passes `/dev/null` as stdin to every executor.
- Every run sets `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0`, which mark it as a non-interactive child whose Gate 3 answer is already settled. The harness sets both in each child's environment. A run reproduced by hand outside the harness must set both and redirect stdin itself.

How the scorer treats failed rows: a row with a non-zero exit or no transcript is unscorable. Inside an arm with at least one scored run it adds to `unscorable=<n>` on the arm's first line and to no rate. An arm with no scored run at all is absent from both the text and `--json` output, so count failed rows from the runs file rather than from the score.

### Evidence

Capture the step 2 count, the step 3 error tails, the step 4 line, the step 7 count, the first line of the step 8 rerun, and the path of the backup. State the cause in the executor's own words from step 3.

### Pass / Fail

- **Pass**: the failed rows are counted, their cause is named from the error tail, step 4 shows resume skipping them, the cleaned file holds no failed row, and the rerun schedules exactly the removed jobs.
- **Fail**: the batch is resumed before cleaning, good rows are removed, the cause is guessed rather than read, or scored rates are reported without the unscorable count.

### Failure Triage

1. Read the error tail first. A quota message, a trust prompt and an authentication error each need a different fix, and the exit code alone does not tell them apart.
2. If the rerun fails in about a second again, stop it, restore from `$R.bak`, and fix the cause before trying once more. Each fast failure is another row to clean.
3. Timeout rows carry `"exit": "timeout"` and no error tail. Step 2 does not count them, but step 6 removes them because their exit is not 0.
4. An arm missing from the score output is the scorer's way of saying every run in it failed. Never read it as an arm with nothing to report.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/rule-experiment.py`](../../scripts/rule-experiment.py) | Primary implementation anchor, `run_one` records the exit and error tail, `run` skips recorded jobs, `score` counts unscorable rows |
| [`test_rule_experiment.py`](../../../scripts/tests/test_rule_experiment.py) | `test_failed_run_is_unscorable` covers the scorer side |

---

## 5. SOURCE METADATA

- Group: RULE LOADING EXPERIMENTS
- Playbook ID: RRX-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-loading-experiments/executor-failure-triage.md`
