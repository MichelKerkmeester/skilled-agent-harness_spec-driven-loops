---
title: "PC-003 --threshold Confidence Flag"
description: "Manual validation that --threshold adjusts the shim's confidence cutoff for Python-path scoring and affects which skills pass the dual-threshold check."
trigger_phrases:
  - "pc-003"
  - "threshold flag"
  - "confidence cutoff shim"
  - "dual threshold shim"
version: 0.8.2.0
id: PC-003
category: python_compat
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# PC-003 --threshold Confidence Flag

Prompt: Manual validation that --threshold adjusts the shim's confidence cutoff for Python-path scoring and affects which skills pass the dual-threshold check.


---

## 1. OVERVIEW

Validate that `--threshold <value>` adjusts the confidence cutoff applied by the shim (default 0.8) and that lower thresholds surface additional candidates while higher thresholds filter aggressively.

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- Advisor runtime built.
- A prompt known to produce a middle-tier confidence candidate (for example around 0.7).

---

## 3. TEST EXECUTION

### Commands

1. Run at the default threshold:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.8
```

2. Run at a looser threshold:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.6
```

3. Run at a strict threshold:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.95
```

4. Record the number of entries returned in each case.

### Expected Signals

- Default returns the standard candidate set.
- Looser threshold returns more candidates (never fewer than default).
- Strict threshold returns fewer candidates (often zero if no candidate clears 0.95).
- All outputs remain valid JSON arrays with consistent shape.

### Evidence

- The output and exit status for each threshold command.
- The JSON-array shape, entry count at each threshold, and the candidate values needed to compare the default, looser, and strict results.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Threshold ignored | Output identical across thresholds | Inspect shim flag parser. |
| Threshold inverted | Strict returns more than looser | Audit cutoff direction. |
| Invalid JSON at edge thresholds | Shell JSON parser errors | Confirm shim exits cleanly. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [PC-002](../../manual-testing-playbook/python-compat/force-native-force-local.md), force toggles.
- Scenario [PC-004](../../manual-testing-playbook/python-compat/regression-suite.md), regression suite coverage of threshold behavior.
- Feature [`feature-catalog/python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: python-compat/threshold-flag.md
