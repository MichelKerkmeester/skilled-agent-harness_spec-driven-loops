---
title: "RRX-002 -- Table wording run"
description: "This scenario validates the table wording run for `RRX-002`. It focuses on a small limited run on one executor, pooled scoring that prints aggregates only, and reading the arm difference against the preregistered decision rule."
stage: routing
version: 1.0.0.0
---

# RRX-002 -- Table wording run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRX-002`.

---

## 1. OVERVIEW

This scenario validates the table wording run for `RRX-002`. It focuses on a small limited run on one executor, pooled scoring that prints aggregates only, and reading the arm difference against the preregistered decision rule.

### Why This Matters

The table wording experiment asks whether a shorter no-table block in `communication.md` changes how often a reply carries a markdown table. The full schedule is hundreds of executor runs. A small run with `--limit` proves the whole path end to end first: the run records one row per job, the scorer separates replies whose run read the rule from replies whose run did not, and the arm difference comes out with an interval that can be held against the decision rule written down before any scored run.

The scorer is also a privacy boundary. It prints counts, rates and intervals, and reply text stays in the executors' own transcripts. A scorer that printed reply text would leak whatever a reply contained into every report built from it.

This scenario consumes executor quota. It writes only under a temporary directory and the executor's own transcript store.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRX-002` and confirm the expected signals without contradictory evidence.

- Objective: run the first eight scheduled table wording jobs on one executor, score them pooled, and state which preregistered branch the arm difference falls in
- Real user request: `Do a quick dry run of the table wording experiment so we know the numbers come out before the full batch.`
- Prompt: `Run a small table wording smoke test on one executor and score it pooled, so I can see the per-arm table rate and whether the harness reports the arm difference correctly.`
- Expected execution process: the arms are built, `run` takes the first eight jobs of the seeded schedule and executes them on one executor, then `score --pool` groups by arm across executors and prints one block per arm plus the difference line for the default metric.
- Expected signals: `8 runs to do (0 already recorded)`, eight `[n/8]` lines, one `== pooled/<arm>` block per arm with a table rate for unasked replies, the same rate restricted to runs that read `communication.md`, and a delivery rate, then `== table_unasked_rule_delivered: pooled/short - pooled/current` with a point difference and a bracketed interval, and no reply text anywhere.
- Desired user-visible outcome: the operator sees the harness produces every number the decision rule needs, and is told plainly that an eight-run interval is far too wide to decide anything.
- Pass/fail: PASS if the run records eight rows, the scorer prints only aggregates with both table rates and the delivery rate per arm and a difference line, and the verdict maps the interval to a decision branch while calling it non-decisive, FAIL if reply text is printed, an arm block lacks the split, or a smoke result is presented as a decision.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a small table wording smoke test on one executor and score it pooled, so I can see the per-arm table rate and whether the harness reports the arm difference correctly.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRX-002 | Table wording run | Verify a limited run on one executor scores pooled into aggregates and an arm difference that maps onto the preregistered decision rule | `Run a small table wording smoke test on one executor and score it pooled, so I can see the per-arm table rate and whether the harness reports the arm difference correctly.` | 1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment` -> 2. `bash: python3 "$X/rule-experiment.py" build --arms "$E/arms.json" --out "$T/envs"` -> 3. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor luna --out "$T/runs.jsonl" --limit 8 --jobs 2` -> 4. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --pool` -> 5. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --pool --json` -> 6. `bash: rm -rf "$T"` | Step 3: `8 runs to do (0 already recorded)` then eight `exit=0` lines, five on `short` and three on `current`. Step 4: `== pooled/current` and `== pooled/short` blocks, each with `table (unasked)`, `with communication.md delivered`, `delivery`, then `== table_unasked_rule_delivered: pooled/short - pooled/current` with points and an interval. Step 5: top-level keys `groups` and `differences` only | Step 3 progress lines, the runs JSONL row count, the full step 4 output, the step 5 key list, and the decision-branch statement | PASS if eight rows are recorded, both arm blocks carry the split and delivery rate, a difference line or a stated `n/a` appears, no reply text is printed, and the verdict names the branch and calls the run non-decisive. FAIL if reply text appears, a block lacks the split, `unscorable` rows are folded into rates, or the smoke interval is reported as a decision | 1. If any step 3 line shows a non-zero exit, stop and follow `RRX-005` before scoring. 2. If an arm block is missing, every run in that arm was unscorable, since the scorer drops a group with no scored run. 3. If the difference reads `n/a`, one arm has no run that read `communication.md`, so the rule-delivered denominator is zero |

### Commands

Run every step in one shell from the repository root. Step 3 may use `--executor deepseek` instead of `--executor luna`. The `deepseek` executor is Devin with `deepseek-v4-1-flash-max`. The `luna` executor is Codex with `gpt-6-luna` at max reasoning on the fast tier. Devin first needs the prerequisites listed in `RRX-005`.

1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment`
2. `bash: python3 "$X/rule-experiment.py" build --arms "$E/arms.json" --out "$T/envs"`
3. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor luna --out "$T/runs.jsonl" --limit 8 --jobs 2`
4. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --pool`
5. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --pool --json`
6. `bash: rm -rf "$T"` once the evidence is recorded, because Devin transcripts live inside `$T`

### Expected

Step 3 prints `8 runs to do (0 already recorded)`. With the default `--repeat 1` and `--seed 16`, the first eight jobs of the shuffled schedule are five `short` runs and three `current` runs, so `--limit` does not balance arms. Each finished job prints `[n/8] <arm> <prompt> r0 exit=<code> <seconds>s`. A run normally takes tens of seconds or more.

Step 4 prints one block per arm, in name order. The first line reads `== pooled/<arm>: runs=<scored> long=<long replies> unscorable=<failed>`. The second line carries the three table numbers: `table (unasked)` over every long reply, `with communication.md delivered` over long replies whose run read the rule, and `delivery`, the share of long replies whose run read it. A read counts wherever it falls in the transcript. Every rate prints as `<pct>% of <n> [<low>-<high>]`, a Wilson 95% interval. The last line is `== table_unasked_rule_delivered: pooled/short - pooled/current <d> pts [<low> to <high>]`, the Newcombe interval on the primary metric. None of the table wording prompts asks for a table, so every long reply counts as unasked.

Step 5 prints JSON with exactly two top-level keys, `groups` and `differences`. Neither holds reply text.

Map the step 4 difference onto the decision rule in the preregistration. If the upper bound is below 0, the short wording lowers the table rate. Otherwise, if the upper bound is below +5 points, the short wording is no worse. Otherwise, keep the current wording. With eight runs the interval spans tens of points, so a smoke run lands in the last branch almost always and decides nothing. The full preregistered schedule is `--repeat 5` on both executors, 600 runs.

### Evidence

Capture the step 3 progress lines, the row count of `$T/runs.jsonl`, the full step 4 output, the step 5 key list, and one sentence naming the decision branch the interval falls in and stating that the run is not decisive. Do not copy reply text from the transcripts into the evidence.

### Pass / Fail

- **Pass**: eight rows are recorded, each arm block shows both table rates and the delivery rate with denominators, the difference line appears or its `n/a` is explained, no reply text is printed, and the verdict maps the interval to a branch while calling it a smoke result.
- **Fail**: reply text appears in score output, an arm block lacks the delivered split, failed runs are counted inside a rate, or the smoke interval is reported as adopting or rejecting a wording.

### Failure Triage

1. A step 3 line with a non-zero exit, especially one that returns in about a second, is an executor failure. Follow `RRX-005` before scoring, because resume will never retry that row.
2. A missing arm block means every run in that arm was unscorable. The scorer builds groups only from scored runs, so a fully failed arm disappears instead of showing `runs=0`.
3. A difference of `n/a` means a zero denominator on the chosen metric. On the default metric that means one arm has no long reply whose run read `communication.md`. Check `delivery` in that arm.
4. `--metric` must name a rate field, such as `table_unasked`, `table_unasked_rule_delivered`, `communication_delivered`, `any_prohibition`, `gate5_miss`, `reply_rules_miss` or `fallback`. A non-rate field such as `mean_rule_bytes` raises a `TypeError`.

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
| [`scripts/rule-experiment.py`](../../scripts/rule-experiment.py) | Primary implementation anchor, the `run` and `score` subcommands, `summarize` and `newcombe` |
| [`scripts/measure-rule-compliance.py`](../../scripts/measure-rule-compliance.py) | The table check, the 400-character long-reply floor and the Wilson interval |
| [`test_rule_experiment.py`](../../../scripts/tests/test_rule_experiment.py) | Schedule balance, table and delivery scoring, and the Newcombe worked example |
| `specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment/arms.json` | The `current` and `short` arms |
| `specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment/prompts.json` | The 30 reply-only prompts and the no-edit suffix |
| `specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/preregistration.md` | Metric, schedule and the three-branch decision rule |

---

## 5. SOURCE METADATA

- Group: RULE LOADING EXPERIMENTS
- Playbook ID: RRX-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-loading-experiments/table-wording-run.md`
