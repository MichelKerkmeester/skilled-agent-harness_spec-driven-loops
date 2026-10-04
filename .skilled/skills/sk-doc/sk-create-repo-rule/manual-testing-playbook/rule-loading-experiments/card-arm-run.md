---
title: "RRX-003 -- Card arm run"
description: "This scenario validates the card arm run for `RRX-003`. It focuses on scoring write tasks against the full-rule and card arms for Gate 5 miss, reply-rule miss, card fallback and delivered rule bytes, and on why a resident-card arm is not built."
stage: routing
version: 1.0.0.0
---

# RRX-003 -- Card arm run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRX-003`.

---

## 1. OVERVIEW

This scenario validates the card arm run for `RRX-003`. It focuses on scoring write tasks against the full-rule and card arms for Gate 5 miss, reply-rule miss, card fallback and delivered rule bytes, and on why a resident-card arm is not built.

### Why This Matters

A card is the load-time slice of a rule: when it fires, what it says, and its self-check. The card pilot asks whether pointing the router's Load links at cards keeps sessions loading the router before they write, keeps the reply rules delivered, and costs fewer bytes than the full files. Four numbers answer that, and each one fails differently. A Gate 5 miss is a write made before the router was read. A reply-rule miss is a long reply whose run never read both reply rules. A card fallback is a run that opened a card and then the full rule anyway. Delivered rule bytes is the cost side. A run that reports only one of them can make cards look better or worse than they are.

A third arm with the reply cards resident in `AGENTS.md` is not built. `AGENTS.md` at 26,778 bytes plus the five reply cards at 7,677 bytes is 34,455 bytes, over the 32,768-byte budget recorded in the arms file's `dropped` entry.

This scenario consumes executor quota and the tasks write files. Every write lands inside a per-run copy under a temporary directory.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRX-003` and confirm the expected signals without contradictory evidence.

- Objective: run the first eight scheduled card pilot write tasks on one executor and read the four card metrics per arm, then confirm the resident arm's byte arithmetic against the live files
- Real user request: `Try the card version of the router on a few real edit tasks and tell me if it still loads the rules properly.`
- Prompt: `Run a few write tasks against the full and cards arms and tell me the Gate 5 miss, reply-rule miss, card fallback and rule bytes for each arm.`
- Expected execution process: the card pilot arms are built, `run` executes the first eight scheduled write tasks, `score` reports each arm with `--metric gate5_miss` for the difference line, and `wc -c` rechecks the resident arm's byte total.
- Expected signals: `8 runs to do (0 already recorded)`, an arm block for `cards` and for `full`, each with a third line reading `gate5 miss`, `reply-rules miss`, `fallback` and `mean rule bytes`, `fallback n/a` on `full`, a difference line `== gate5_miss: <executor>/cards - <executor>/full`, and a `wc -c` total above 32,768.
- Desired user-visible outcome: the operator sees all four metrics for both arms side by side and understands why only two arms exist.
- Pass/fail: PASS if both arm blocks carry all four metrics, `full` shows `fallback n/a`, the difference line appears, and the byte total exceeds the budget, FAIL if any metric is missing, a card read is not counted as delivery of its rule, or the byte total no longer exceeds the budget and the drop is still cited.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a few write tasks against the full and cards arms and tell me the Gate 5 miss, reply-rule miss, card fallback and rule bytes for each arm.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRX-003 | Card arm run | Verify write tasks against the full and card arms report Gate 5 miss, reply-rule miss, card fallback and delivered rule bytes, and that the resident arm stays dropped on byte grounds | `Run a few write tasks against the full and cards arms and tell me the Gate 5 miss, reply-rule miss, card fallback and rule bytes for each arm.` | 1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment` -> 2. `bash: python3 "$X/rule-experiment.py" build --arms "$E/arms.json" --out "$T/envs"` -> 3. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor luna --out "$T/runs.jsonl" --limit 8 --jobs 2` -> 4. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --metric gate5_miss` -> 5. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --metric fallback` -> 6. `bash: wc -c AGENTS.md "$T/envs/cards/template/.skilled/repo-rules/cards/communication.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-prose.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-decisions.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-handoff.md" "$T/envs/cards/template/.skilled/repo-rules/cards/answer-the-actual-request.md"` -> 7. `bash: rm -rf "$T"` | Step 3: `8 runs to do (0 already recorded)`, four `full` and four `cards` jobs. Step 4: `== <executor>/cards` and `== <executor>/full` blocks whose third line reads `gate5 miss`, `reply-rules miss`, `fallback`, `mean rule bytes`, then `== gate5_miss: <executor>/cards - <executor>/full` with points and an interval. Step 5: the fallback difference reads `n/a`. Step 6: a total above 32,768 | Step 3 progress lines, the full step 4 and step 5 output, and the step 6 byte counts | PASS if both blocks carry the four metrics, `full` reads `fallback n/a`, the gate5 difference line appears, and step 6 totals above 32,768. FAIL if a metric is missing, a block is absent without an explanation, or step 6 totals 32,768 or less while the drop is still cited | 1. A missing arm block means every run in it was unscorable, so check exits per `RRX-005`. 2. `gate5 miss n/a` means no run in that arm wrote a file, since the denominator is writing runs. 3. If step 6 drops under the budget, report that the resident arm is buildable and the drop reason is stale, rather than passing silently |

### Commands

Run every step in one shell from the repository root. Step 3 may use `--executor deepseek` after the Devin prerequisites in `RRX-005`.

1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && E=specs/agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment`
2. `bash: python3 "$X/rule-experiment.py" build --arms "$E/arms.json" --out "$T/envs"`
3. `bash: python3 "$X/rule-experiment.py" run --arms "$E/arms.json" --envs "$T/envs" --prompts "$E/prompts.json" --executor luna --out "$T/runs.jsonl" --limit 8 --jobs 2`
4. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --metric gate5_miss`
5. `bash: python3 "$X/rule-experiment.py" score --runs "$T/runs.jsonl" --arms "$E/arms.json" --metric fallback`
6. `bash: wc -c AGENTS.md "$T/envs/cards/template/.skilled/repo-rules/cards/communication.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-prose.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-decisions.md" "$T/envs/cards/template/.skilled/repo-rules/cards/communication-handoff.md" "$T/envs/cards/template/.skilled/repo-rules/cards/answer-the-actual-request.md"`
7. `bash: rm -rf "$T"` once the evidence is recorded

### Expected

Step 3 prints `8 runs to do (0 already recorded)`. With the default `--repeat 1` and `--seed 16`, the first eight jobs are four `full` and four `cards` tasks. Every task prompt carries a suffix naming the fixture spec folder and saying Gate 3 is answered, so a run has no reason to stop and ask.

Step 4 prints the `cards` block before the `full` block, because blocks sort by name. The third line of each block carries the card metrics:

- `gate5 miss` is the share of runs that wrote a file whose first non-exempt write came before any read of `REPO RULES.md`. Its denominator is writing runs only.
- `reply-rules miss` is the share of long replies whose run had not read both `communication.md` and `communication-prose.md` by the time it replied. Reading a rule's card counts as delivering that rule.
- `fallback` is the share of runs that read any card and then opened the full file behind one of those cards. The `full` arm never reads a card, so it reads `fallback n/a`.
- `mean rule bytes` is the mean, over scored runs, of the bytes of the distinct router, rule and card files each run read.

The final line of step 4 is `== gate5_miss: <executor>/cards - <executor>/full <d> pts [<low> to <high>]`. The difference runs in arms-file order, second arm minus first. Step 5 prints the same blocks with `== fallback: <executor>/cards - <executor>/full n/a`, because the `full` denominator is zero.

Step 6 prints `AGENTS.md` and the five reply cards with a total line. Against the live files this reads 26,778 bytes for `AGENTS.md` and 7,677 bytes for the cards, a total of 34,455, which is over 32,768. Both numbers move when those files change, so the comparison with the budget is the signal, not the exact figures.

### Evidence

Capture the step 3 progress lines, the full step 4 and step 5 output, and the step 6 byte counts with the total. Reply and task text stay in the transcripts.

### Pass / Fail

- **Pass**: both arm blocks show `gate5 miss`, `reply-rules miss`, `fallback` and `mean rule bytes` with denominators, `full` reads `fallback n/a`, the `gate5_miss` difference line appears, and step 6 totals more than 32,768 bytes.
- **Fail**: a metric is missing from a block, an arm block disappears without its failed runs being explained, or step 6 totals 32,768 bytes or less while the resident arm is still described as dropped.

### Failure Triage

1. A missing arm block means every run in that arm was unscorable. Count non-zero exits in `$T/runs.jsonl` and follow `RRX-005`.
2. `gate5 miss n/a` means no run in that arm wrote a file. Check the transcripts for refusals or questions before reading the arm as safe.
3. A high `fallback` in `cards` means cards often did not settle the question. That is a finding about the cards, not a harness fault.
4. Use only rate fields with `--metric`. `mean_rule_bytes` is a plain number and raises a `TypeError` as a metric, so read it from the block line instead.
5. If step 6 falls under the budget, the resident arm has become buildable. Report the stale drop reason rather than passing on the old arithmetic.

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
| [`scripts/rule-experiment.py`](../../scripts/rule-experiment.py) | Primary implementation anchor, `score_run`, `summarize` and `compare` |
| [`scripts/build-rule-cards.cjs`](../../scripts/build-rule-cards.cjs) | Generates the cards the `cards` arm links to |
| [`test_rule_experiment.py`](../../../scripts/tests/test_rule_experiment.py) | `test_write_before_the_router_is_read_counts_as_a_gate5_miss` covers the Gate 5 rule |
| `specs/agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment/arms.json` | The `full` and `cards` arms and the `dropped` resident arm |
| `specs/agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment/prompts.json` | The 15 write tasks and the Gate 3 suffix |

---

## 5. SOURCE METADATA

- Group: RULE LOADING EXPERIMENTS
- Playbook ID: RRX-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-loading-experiments/card-arm-run.md`
