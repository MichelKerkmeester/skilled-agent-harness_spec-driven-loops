---
title: "E2E-020 -- Full Pipeline Loop with Debug Target"
description: "Manual validation scenario for E2E-020: Full Pipeline Loop with Debug Target."
feature_id: "E2E-020"
category: "End-to-End Loop"
---

# E2E-020 -- Full Pipeline Loop with Debug Target

This document captures the canonical manual-testing contract for `E2E-020`.

---

## 1. OVERVIEW

This scenario validates the complete `/deep:start-agent-improvement-loop` loop end-to-end using the debug agent as the target.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Full Pipeline Loop with Debug Target for the full improvement-loop and candidate-tracking scenarios.
- Real user request: `` Validate that the complete `/deep:start-agent-improvement-loop` loop end-to-end using the debug agent as the target. ``
- Prompt: `Validate the full /deep:start-agent-improvement-loop loop against the debug agent.`
- Expected execution process: Run the documented command sequence exactly as written; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Init phase creates `improvement/` directory with config, charter, strategy, and manifest; Integration scan runs and produces `integration-report.json`; Candidate generated under `improvement/candidates/`; Score output produced via dynamic-mode 5-dimension scoring; Dashboard generated at `improvement/agent-improvement-dashboard.md`; Loop completes 1 iteration without errors
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: All runtime artifacts present after 1 iteration (`improvement/` directory with config, charter, strategy, manifest, candidates, integration report, and dashboard), no errors in console output.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| E2E-020 | Full Pipeline Loop with Debug Target | Validate Full Pipeline Loop with Debug Target | `Validate the full /deep:start-agent-improvement-loop loop against the debug agent.` | /deep:start-agent-improvement-loop &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder=<spec-folder> --iterations=1 | Init phase creates `improvement/` directory with config, charter, strategy, and manifest; Integration scan runs and produces `integration-report.json`; Candidate generated under `improvement/candidates/`; Score output produced via dynamic-mode 5-dimension scoring; Dashboard generated at `improvement/agent-improvement-dashboard.md`; Loop completes 1 iteration without errors | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | All runtime artifacts present after 1 iteration (`improvement/` directory with config, charter, strategy, manifest, candidates, integration report, and dashboard), no errors in console output. | If the pipeline stalls at a specific stage: run that stage&#x27;s individual test (from its category folder) to isolate the failure<br>If `improvement/` directory is not created: check the init phase logic and spec folder path resolution<br>If integration scan fails: verify that `debug.md` is resolvable at the given path and the scanner can discover its surfaces<br>If the command is not recognized: verify the skill is registered in `skill_advisor.py` and the command definition exists |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `06--end-to-end-loop/020-full-pipeline.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement |
| `.opencode/agents/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--end-to-end-loop/020-full-pipeline.md`
