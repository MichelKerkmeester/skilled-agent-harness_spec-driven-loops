---
title: "SCG-009 -- Lint goal criteria for rules 4 and 5"
description: "This scenario validates the advisory criteria lint for `SCG-009`. It focuses on the lint flagging a dangling reference and a check that needs another document, skipping a scratch fixture goal, exiting 0 on every input and leaving the goal check green."
stage: routing
version: 1.3.0.0
---

# SCG-009 -- Lint goal criteria for rules 4 and 5

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-009`.

---

## 1. OVERVIEW

This scenario validates the advisory criteria lint for `SCG-009`. It focuses on the lint flagging a dangling reference and a check that needs another document, skipping a scratch fixture goal, exiting 0 on every input and leaving the goal check green.

### Why This Matters

Rules 4 and 5 ask for criteria a reader can check from the line alone. A criterion that says "the report" or "as described in the spec" reaches the objective copy and leaves completion open, because whatever judges the objective never opens another file. The lint is the first machine check for those two rules. It is advisory by design, so the scenario also proves it never fails a run and never changes what the goal check reports.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-009` and confirm the expected signals without contradictory evidence.

- Objective: prove the lint flags the two seeded criteria by rule, skips the scratch fixture goal, names a missing packet and exits 0 each time, while the goal check still passes
- Real user request: `Before I hand this goal over, can you tell me which of its criteria someone could not check without reading more?`
- Prompt: `Lint the completion criteria of the scratch demo packet at $SCRATCH/specs/demo-packet and tell me which ones a reader could not check from the line alone.`
- Expected execution process: the orchestrator writes the fixture goal twice, once in the packet and once under a `scratch` folder inside it, then runs the lint over the scratch workspace, the lint on a packet that does not exist and the goal check on the demo packet.
- Expected signals: step 5 prints `scratch_excluded=1`, `criteria=3`, `rule4_violations=2` and `rule5_violations=1`, then `rule4 specs/demo-packet/goal.md:20: The report`, `rule4 specs/demo-packet/goal.md:21: the spec` and `rule5 specs/demo-packet/goal.md:21: as described in`, and `exit=0`. Step 6 prints `errors=1`, the stderr line `[lint-goal-criteria] ERROR specs/no-such-packet: packet not found` and `exit=0`. Step 7 prints `RESULT: PASSED (5/5 checks)` and `exit=0`.
- Desired user-visible outcome: the author learns which two criteria to rewrite and why, and sees that the lint blocked nothing.
- Pass/fail: PASS if every expected signal appears and no finding names line 19. FAIL if any lint step exits non-zero, the scratch goal is linted, a seeded criterion is not flagged, line 19 is flagged or the goal check fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Lint the completion criteria of the scratch demo packet at $SCRATCH/specs/demo-packet and tell me which ones a reader could not check from the line alone.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-009 | Lint goal criteria for rules 4 and 5 | Flag the two seeded criteria, skip the scratch goal and exit 0 on every input | `Lint the completion criteria of the scratch demo packet at $SCRATCH/specs/demo-packet and tell me which ones a reader could not check from the line alone.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet/scratch/fixture"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture file below to $SCRATCH/specs/demo-packet/goal.md and to $SCRATCH/specs/demo-packet/scratch/fixture/goal.md exactly as given` -> 5. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --root "$SCRATCH" --all; echo "exit=$?"` -> 6. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --root "$SCRATCH" specs/no-such-packet; echo "exit=$?"` -> 7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"; echo "exit=$?"` -> 8. `bash: rm -rf "$SCRATCH"` | Step 5 prints `scratch_excluded=1`, `criteria=3`, `rule4_violations=2`, `rule5_violations=1`, the three finding lines for lines 20 and 21 and `exit=0`. Step 6 prints `errors=1`, the `packet not found` ERROR line and `exit=0`. Step 7 prints `RESULT: PASSED (5/5 checks)` and `exit=0` | The prompt, the reply text and the full output of steps 5 to 7 with each exit line | PASS if every signal appears and line 19 is never flagged. FAIL if a lint step exits non-zero, the scratch goal is counted, a seeded line is missed, line 19 is flagged or step 7 fails | 1. If `scratch_excluded=0`, confirm step 4 wrote the second copy under `scratch/fixture/`. 2. If a finding names line 19, compare the fixture bytes with the block below, because the backticked command is what keeps that line clean. 3. If step 7 fails, the fixture was edited, since the lint never writes a file |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet/scratch/fixture"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture file below to $SCRATCH/specs/demo-packet/goal.md and to $SCRATCH/specs/demo-packet/scratch/fixture/goal.md exactly as given`
5. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --root "$SCRATCH" --all; echo "exit=$?"`
6. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --root "$SCRATCH" specs/no-such-packet; echo "exit=$?"`
7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"; echo "exit=$?"`
8. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes this file, with these exact bytes, to both paths:

```markdown
---
title: "Goal: demo packet"
---
# Goal: demo packet

## 1. DURABLE DIRECTIVE

**Objective:** Keep counter.txt append-only when two runs write to it at once.

### Decisions

| ID | Decision |
|----|----------|
| D1 | A run never rewrites an existing line of counter.txt |

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node counter.js` run twice exits 0 and leaves counter.txt 2 lines longer
- [ ] The report shows no lost line
- [ ] Every line is written as described in the spec
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG
```

### Expected

Step 5 walks the scratch workspace, lints the demo packet's goal and counts the copy under `scratch/fixture/` apart. Line 19 names its command in backticks and states a count, so neither rule fires. Line 20 opens with "The report", a thing the line never names, so rule 4 flags it. Line 21 says "the spec", which rule 4 flags, and "as described in", which rule 5 flags because the check needs another document. Step 6 names the missing packet and still exits 0, because the lint is advisory. Step 7 passes all five checks, because the lint changes neither the goal file nor the goal check.

### Evidence

Capture the prompt and reply text and the complete output of steps 5, 6 and 7, including every `key=value` line, each finding line, the ERROR line and each `exit=` line.

### Pass / Fail

- **Pass**: every expected signal appears, the scratch copy is counted and not linted, line 19 is never flagged and every step exits 0.
- **Fail**: a lint step exits non-zero, `scratch_excluded` is not 1, a seeded line is not flagged, line 19 is flagged or the goal check fails.

### Failure Triage

1. A non-zero exit from the lint is a defect in its entry point, since no input may change its exit code.
2. A missing finding on line 20 or 21 means the rule patterns changed. Compare the reported spans with the lint's test file before changing the fixture.
3. A finding on line 19 means a named command or count no longer counts as naming the thing it checks.

### Optional Supplemental Checks

Run step 5 again with `--json` and confirm each criterion record carries an `id` of `specs/demo-packet/goal.md:<line>`, a 12-character `text_sha12`, its class and the spans per rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry in this packet | This packet ships no `feature-catalog/`. The sk-doc hub catalog's document-validation group describes the lint |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../scripts/lint-goal-criteria.cjs`](../../scripts/lint-goal-criteria.cjs) | The walker, the line classes and rules 4 and 5 |
| [`../../scripts/tests/lint-goal-criteria.test.cjs`](../../scripts/tests/lint-goal-criteria.test.cjs) | The pass and fail cases each rule is held to |
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The goal check step 7 runs, unchanged by the lint |
| [`../../SKILL.md`](../../SKILL.md) | Rules 4 and 5 the lint checks |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-009
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/lint-goal-criteria.md`
