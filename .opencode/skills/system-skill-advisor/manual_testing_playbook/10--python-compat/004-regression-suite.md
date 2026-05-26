---
title: "PC-004 Python Regression Dataset"
description: "Manual validation that scripts/skill_advisor_regression.py runs the checked-in P0 regression dataset to completion and reports pass/fail totals."
trigger_phrases:
  - "pc-004"
  - "python regression suite"
  - "regression harness coverage"
  - "skill_advisor_regression.py"
---

# PC-004 Python Regression Dataset

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `scripts/skill_advisor_regression.py` runs the P0 regression dataset at `scripts/fixtures/skill_advisor_regression_cases.jsonl` and reports pass/fail totals against the Python scorer.

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- MCP server built so the shim has a native option to delegate to where relevant.
- Regression dataset present at the fixture path.

---

## 3. TEST EXECUTION

1. Run the suite:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

2. Capture stdout and exit code.
3. Inspect per-case results for any FAIL entry.
4. Confirm the summary line reports the current dataset total and pass/fail counts.

### Expected Signals

- Exit code is 0.
- Summary reports all cases passing for the checked-in dataset.
- No case is marked SKIP without an explicit reason.
- No prompt text is written to logs beyond what the dataset already contains.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Fewer than 52 cases | Dataset loaded partial | Verify JSONL integrity. |
| Regressions reported | One or more cases FAIL | Triage per case. Block release until resolved. |
| Non-zero exit but zero failures | Suite exits abnormally | Inspect runner and post-run hooks. |

---

## 4. SOURCE FILES

- Scenario [PC-005](./005-bench-runner.md), bench runner.
- Scenario [NC-003](../01--native-mcp-tools/003-native-validate-slices.md), native validate.
- Feature [`08--python-compat/02-regression-suite.md`](../../feature_catalog/08--python-compat/02-regression-suite.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py` and `scripts/fixtures/skill_advisor_regression_cases.jsonl`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/004-regression-suite.md
