---
title: "PC-004 Python Regression Dataset"
description: "Manual validation that scripts/skill_advisor_regression.py runs the checked-in P0 regression dataset to completion and reports pass/fail totals."
trigger_phrases:
  - "pc-004"
  - "python regression suite"
  - "regression harness coverage"
  - "skill_advisor_regression.py"
version: 0.8.0.14
id: PC-004
category: python_compat
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# PC-004 Python Regression Dataset

Prompt: Manual validation that scripts/skill_advisor_regression.py runs the checked-in P0 regression dataset to completion and reports pass/fail totals.


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
| Fewer than 50 cases | Dataset loaded partial | Verify JSONL integrity. |
| Regressions reported | One or more cases FAIL | Triage per case. Block release until resolved. |
| Non-zero exit but zero failures | Suite exits abnormally | Inspect runner and post-run hooks. |

---

## 4. SOURCE FILES

- Scenario [PC-005](../python_compat/bench_runner.md), bench runner.
- Scenario [NC-003](../native_mcp_tools/native_validate_slices.md), native validate.
- Feature [`python-compat/regression-suite.md`](../../feature_catalog/python_compat/regression_suite.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py` and `scripts/fixtures/skill_advisor_regression_cases.jsonl`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: python-compat/regression-suite.md

---

## 6. EVIDENCE

Precondition checks:

```bash
$ python3 --version
Python 3.9.6

$ test -f ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl"

$ test -f ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py"

$ wc -l ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl"
      50 .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Executed command:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Observed stdout and exit code:

```json
Skill graph: loaded from SQLite
{
  "dataset": ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl",
  "mode": "both",
  "runner": "both",
  "runners_exercised": [
    "inprocess",
    "subprocess"
  ],
  "thresholds": {
    "confidence": 0.8,
    "uncertainty": 0.35,
    "min_top1_accuracy": 0.92,
    "max_command_bridge_fp_rate": 0.05,
    "min_p0_pass_rate": 1.0
  },
  "metrics": {
    "total_cases": 100,
    "passed_cases": 80,
    "failed_cases": 20,
    "pass_rate": 0.8,
    "p0_total": 24,
    "p0_passed": 24,
    "p0_pass_rate": 1.0,
    "top1_cases": 90,
    "top1_accuracy": 0.8667,
    "command_bridge_eval_cases": 76,
    "command_bridge_fp": 0,
    "command_bridge_fp_rate": 0.0
  },
  "gates": {
    "top1_accuracy": false,
    "command_bridge_fp_rate": true,
    "p0_pass_rate": true,
    "all_cases_passed": false,
    "total_cases": true
  },
  "overall_pass": false,
  "failures": [
    "P1-RESEARCH-001 inprocess expected_top_any=[sk-deep-research] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-RESEARCH-002 inprocess expected_top_any=[sk-deep-research] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-003 inprocess expected_top_any=[sk-deep-review] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-004 inprocess expected_top_any=[sk-deep-review] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-005 inprocess expected_top_any=[sk-deep-review] actual_top=sk-code-review passed=false checks.top_ok=false",
    "P1-CLI-002 inprocess expected_top_any=[cli-opencode] actual_top=sk-code passed=false checks.top_ok=false",
    "P1-PHRASE-002 inprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-003 inprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-004 inprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-005 inprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-RESEARCH-001 subprocess expected_top_any=[sk-deep-research] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-RESEARCH-002 subprocess expected_top_any=[sk-deep-research] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-003 subprocess expected_top_any=[sk-deep-review] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-004 subprocess expected_top_any=[sk-deep-review] actual_top=system-deep-loop passed=false checks.top_ok=false",
    "P1-REVIEW-005 subprocess expected_top_any=[sk-deep-review] actual_top=sk-code-review passed=false checks.top_ok=false",
    "P1-CLI-002 subprocess expected_top_any=[cli-opencode] actual_top=sk-code passed=false checks.top_ok=false",
    "P1-PHRASE-002 subprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-003 subprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-004 subprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false",
    "P1-PHRASE-005 subprocess expected_top_any=[sk-deep-agent-improvement] actual_top=null passed=false checks.result_ok=false"
  ]
}

EXIT_CODE=1
```

The runner source shows stdout-only behavior when `--out` is omitted:

```text
319:     if args.out:
320:         ensure_parent_dir(args.out)
321:         with open(args.out, "w", encoding="utf-8") as handle:
322:             json.dump(report, handle, indent=2)
323: 
324:     print(json.dumps(report, indent=2))
325:     return 0 if overall_pass else 1
```

---

## 7. PASS/FAIL

FAIL

Expected did not hold: the suite exited with `EXIT_CODE=1`, `overall_pass` was `false`, `failed_cases` was `20`, `all_cases_passed` was `false`, and `top1_accuracy` was `0.8667` below the `0.92` threshold.
