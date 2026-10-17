---
title: "PC-004 Python Regression Dataset"
description: "Manual validation that scripts/skill_advisor_regression.py runs the checked-in P0 regression dataset to completion and reports pass/fail totals."
trigger_phrases:
  - "pc-004"
  - "python regression suite"
  - "regression harness coverage"
  - "skill_advisor_regression.py"
version: 0.8.1.0
id: PC-004
category: python_compat
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# PC-004 Python Regression Dataset

Prompt: Manual validation that scripts/skill_advisor_regression.py runs the checked-in P0 regression dataset to completion and reports pass/fail totals.


---

## 1. OVERVIEW

Validate that `scripts/skill_advisor_regression.py` runs the P0 regression dataset at `scripts/fixtures/skill-advisor-regression-cases.jsonl` and reports pass/fail totals against the Python scorer.

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- Advisor runtime built so the shim has a native option to delegate to where relevant.
- Regression dataset present at the fixture path.

---

## 3. TEST EXECUTION

### Commands

1. Run the suite:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py \
  --dataset .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl
```

2. Capture stdout and exit code.
3. Inspect per-case results for any FAIL entry.
4. Confirm the summary line reports the current dataset total and pass/fail counts.

### Expected Signals

- Exit code is 0.
- Summary reports all cases passing for the checked-in dataset.
- No case is marked SKIP without naming the missing prerequisite.
- No prompt text is written to logs beyond what the dataset already contains.

### Evidence

- The suite command output and exit status.
- The per-case results, dataset total, pass and fail counts, any SKIP reason with its missing prerequisite, and whether prompt text appears in logs beyond the dataset.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Fewer than 47 cases | Dataset loaded partial | Verify JSONL integrity. |
| Regressions reported | One or more cases FAIL | Triage per case. Block release until resolved. |
| Non-zero exit but zero failures | Suite exits abnormally | Inspect runner and post-run hooks. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [PC-005](../../manual-testing-playbook/python-compat/bench-runner.md), bench runner.
- Scenario [NC-003](../../manual-testing-playbook/native-cli-tools/native-validate-slices.md), native validate.
- Feature [`python-compat/regression-suite.md`](../../feature-catalog/python-compat/regression-suite.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py` and `scripts/fixtures/skill-advisor-regression-cases.jsonl`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: python-compat/regression-suite.md
