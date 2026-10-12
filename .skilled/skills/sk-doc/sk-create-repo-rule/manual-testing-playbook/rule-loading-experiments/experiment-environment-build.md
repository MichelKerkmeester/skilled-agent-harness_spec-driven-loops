---
title: "RRX-001 -- Experiment environment build"
description: "This scenario validates the experiment environment build for `RRX-001`. It focuses on building every arm as its own git repository whose only difference from its sibling is the arm's declared edit, with the rule corpus still passing its own checks."
stage: routing
version: 1.0.0.0
---

# RRX-001 -- Experiment environment build

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRX-001`.

---

## 1. OVERVIEW

This scenario validates the experiment environment build for `RRX-001`. It focuses on building every arm as its own git repository whose only difference from its sibling is the arm's declared edit, with the rule corpus still passing its own checks.

### Why This Matters

A rule-loading experiment compares arms, and a comparison is only as good as the claim that the arms differ in one thing. If the build leaks an extra difference, drops a linked file, or silently applies an edit to the wrong span, every rate the later runs produce measures the build rather than the rule. This scenario costs no executor time, so it runs before any run that does.

The build is deterministic and needs no executor. It writes only under a temporary directory and never touches the live rule files.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRX-001` and confirm the expected signals without contradictory evidence.

- Objective: build the table wording and card pilot arms, prove each arm is a clean git repository, and prove the arm difference is exactly the declared edit
- Real user request: `Before we burn executor quota, check the experiment arms actually build and only differ where they should.`
- Prompt: `Build the table wording and card pilot experiment environments in a temp directory and check that every arm is a sound test bed before we spend executor runs on it.`
- Expected execution process: `rule-experiment.py build` copies the fixture project, the live router and every rule file into one `template/` per arm, copies the skill files the rules link to, applies the arm's edits, and commits the result as a fresh git repository. The corpus checker then runs against each arm.
- Expected signals: four `built <arm>:` lines, one commit per arm, `RESULT: PASSED (11/11 checks)` on both table wording arms and the card pilot `full` arm, a single check 2 failure on the `cards` arm, a diff between the two table wording arms confined to the no-table block of `communication.md`, and an ambiguous edit aborting with `found 2`.
- Desired user-visible outcome: the operator knows the arms are fit to run, and knows the one expected checker failure is by design rather than a defect.
- Pass/fail: PASS if every signal above is observed, FAIL if any arm fails a check other than check 2 on `cards`, the arm diff touches any other line or file, or the ambiguous edit builds.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Build the table wording and card pilot experiment environments in a temp directory and check that every arm is a sound test bed before we spend executor runs on it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRX-001 | Experiment environment build | Verify every arm builds as its own repository, passes the corpus checks it should, and differs from its sibling only by its declared edit | `Build the table wording and card pilot experiment environments in a temp directory and check that every arm is a sound test bed before we spend executor runs on it.` | 1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && P=specs/agents/016-repo-rule-advisor-surfacing` -> 2. `bash: python3 "$X/rule-experiment.py" build --arms "$P/007-table-wording-experiment/experiment/arms.json" --out "$T/007"` -> 3. `bash: python3 "$X/rule-experiment.py" build --arms "$P/008-gate5-card-pilot/experiment/arms.json" --out "$T/008"` -> 4. `bash: for a in 007/current 007/short 008/full 008/cards; do git -C "$T/$a/template" log --oneline; done` -> 5. `bash: for a in 007/current 007/short 008/full; do node "$X/check-repo-rules.cjs" --root "$T/$a/template"; done` -> 6. `bash: node "$X/check-repo-rules.cjs" --root "$T/008/cards/template"` -> 7. `bash: diff -r -x .git "$T/007/current/template" "$T/007/short/template"` -> 8. `bash: find "$T/007/current/template/.skilled/skills" -type f` -> 9. `bash: printf '%s\n' '{"arms":[{"name":"bad","edits":[{"file":".skilled/repo-rules/communication.md","replace":[["§6","section 6"]]}]}]}' > "$T/ambiguous.json"` -> 10. `bash: python3 "$X/rule-experiment.py" build --arms "$T/ambiguous.json" --out "$T/amb"` -> 11. `bash: rm -rf "$T"` | Steps 2 and 3: `built current`, `built short`, `built full`, `built cards`. Step 4: one `arm <name>` commit each. Step 5: three `RESULT: PASSED (11/11 checks)`. Step 6: `2/11 FAIL row coverage` naming rules with `no trigger row`, `11/11 PASS card sync - cards=13 every card matches its rule`, `RESULT: FAILED (10/11 checks)`, exit 1. Step 7: one hunk in `communication.md`. Step 8: two linked skill files. Step 10: `found 2`, exit 1 | Full output and exit status of every step | PASS if all expected signals appear and step 7 shows no other hunk or file. FAIL if a check other than check 2 fails on `cards`, any other arm fails a check, step 7 shows a second difference, or step 10 exits 0 | 1. If step 7 shows more than one hunk, read the arms file edit, because the find text matched a wider span than intended. 2. If check 7 fails in any arm, run step 8, since a rule now links to a skill file the build does not copy. 3. If `cards` fails a check other than 2, regenerate cards in a copy per `RRX-004` before blaming the arm |

### Commands

Run every step in one shell from the repository root, so `$T`, `$X` and `$P` persist between steps.

1. `bash: T=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && P=specs/agents/016-repo-rule-advisor-surfacing`
2. `bash: python3 "$X/rule-experiment.py" build --arms "$P/007-table-wording-experiment/experiment/arms.json" --out "$T/007"`
3. `bash: python3 "$X/rule-experiment.py" build --arms "$P/008-gate5-card-pilot/experiment/arms.json" --out "$T/008"`
4. `bash: for a in 007/current 007/short 008/full 008/cards; do git -C "$T/$a/template" log --oneline; done`
5. `bash: for a in 007/current 007/short 008/full; do node "$X/check-repo-rules.cjs" --root "$T/$a/template"; done`
6. `bash: node "$X/check-repo-rules.cjs" --root "$T/008/cards/template"`
7. `bash: diff -r -x .git "$T/007/current/template" "$T/007/short/template"`
8. `bash: find "$T/007/current/template/.skilled/skills" -type f`
9. `bash: printf '%s\n' '{"arms":[{"name":"bad","edits":[{"file":".skilled/repo-rules/communication.md","replace":[["§6","section 6"]]}]}]}' > "$T/ambiguous.json"`
10. `bash: python3 "$X/rule-experiment.py" build --arms "$T/ambiguous.json" --out "$T/amb"`
11. `bash: rm -rf "$T"`

### Expected

Steps 2 and 3 print one `built <arm>: <path>` line per arm and exit 0. Step 4 prints exactly one commit per arm, subject `arm current`, `arm short`, `arm full` and `arm cards`, which proves each template is its own repository and a run that writes files can be diffed against a clean base.

Step 5 prints `RESULT: PASSED (11/11 checks)` three times. The counts in each line, such as `files=13 triggerRows=13 indexRows=13`, match what `check-repo-rules.cjs` prints for the live repository, because an arm is a copy of the live corpus. Check 11 reads `card sync - no cards directory` in these three arms.

Step 6 is the one designed failure. The `cards` arm repoints every Load link in the router at `repo-rules/cards/<rule>.md`, so check 2 no longer finds a trigger row for any rule file: `2/11 FAIL row coverage - answer-the-actual-request.md: no trigger row; ... (+9 more)`. Check 11 passes with `cards=13 every card matches its rule`. Check 10 reports `bullets=0` and passes only vacuously, because with no rule mapped to a row there is nothing to compare. The run ends `RESULT: FAILED (10/11 checks)` with exit 1.

Step 7 prints one hunk, `76,80c76,78`, replacing the five-line no-table block of `communication.md` with the three-line short wording. No other file and no other line differs. Step 7 exits 1, which for `diff` means a difference was found.

Step 8 lists `sk-create-with-human-voice/references/hvr-rules.md` and `scope-and-exemptions.md`, the skill files the rules link to. Their presence is why check 7 reads `rule links - files=13 links=42 all resolve` in step 5. A bare copy of the router and the rules without them fails check 7 with three unresolved links.

Step 10 prints `Error: edit for .skilled/repo-rules/communication.md expects one match of '§6', found 2` and exits 1. The partial `amb/bad/template` it leaves behind has no `.git`, so it can never be mistaken for a built arm.

### Evidence

Capture the full output and exit status of steps 2 through 10. The step 6 output and the step 7 hunk are the central evidence: step 6 shows the only checker failure is the designed one, and step 7 shows the arms differ in one block.

### Pass / Fail

- **Pass**: four arms build, each has one commit, three pass 11 of 11, `cards` fails check 2 alone, the arm diff is the single no-table hunk, the linked skill files are present, and the ambiguous edit aborts with `found 2`.
- **Fail**: any arm fails to build, any check other than check 2 on `cards` fails, the arm diff shows a second hunk or file, or the ambiguous edit builds an arm.

### Failure Triage

1. A second hunk in step 7 means an edit matched more than intended or the fixture changed. Read the `replace` pair in the arms file against the live `communication.md`.
2. A check 7 failure in an arm means a rule now links to a skill file outside the copied set. Run step 8 and compare it with the links the rules carry.
3. A `cards` failure beyond check 2 points at card drift, not the arm. Run `RRX-004` on a copy, because the build regenerates cards from the copied rules and a generator fault shows up here first.
4. If step 10 exits 0, the one-match guard in `apply_edit` is gone, and every later arm comparison is suspect until it is restored.

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
| [`scripts/rule-experiment.py`](../../scripts/rule-experiment.py) | Primary implementation anchor, the `build` subcommand and `apply_edit` |
| [`scripts/rule-experiment-fixture/`](../../scripts/rule-experiment-fixture/) | The fixture project every arm starts from |
| [`scripts/check-repo-rules.cjs`](../../scripts/check-repo-rules.cjs) | The eleven corpus checks run against each arm |
| [`test_rule_experiment.py`](../../../scripts/tests/test_rule_experiment.py) | `test_arm_edit_refuses_an_ambiguous_match` covers the step 10 guard |
| `specs/agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment/arms.json` | Table wording arms, `current` and `short` |
| `specs/agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment/arms.json` | Card pilot arms, `full` and `cards` |

---

## 5. SOURCE METADATA

- Group: RULE LOADING EXPERIMENTS
- Playbook ID: RRX-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-loading-experiments/experiment-environment-build.md`
