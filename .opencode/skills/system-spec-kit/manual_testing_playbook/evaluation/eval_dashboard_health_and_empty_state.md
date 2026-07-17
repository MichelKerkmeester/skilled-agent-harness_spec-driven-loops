---
title: "029 -- Eval dashboard health and empty state"
description: "Validates eval_reporting_dashboard returns health/empty-state information without requiring fresh ablation runs."
audited_post_017: true
version: 3.6.0.1
id: evaluation-eval-dashboard-health-and-empty-state
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 029 -- Eval dashboard health and empty state

## 1. OVERVIEW

This scenario covers the dashboard read surface as separate from running an ablation.

---

## 2. SCENARIO CONTRACT

- Objective: Validate reporting dashboard happy path and empty-state guidance.
- Real user request: `Open the eval reporting dashboard data and tell me whether it reports health or empty-state guidance.`
- RCAF Prompt: `Run eval_reporting_dashboard and verify health, available reports, and empty-state guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dashboard response is non-empty. - It either lists reports or provides explicit empty-state guidance. - Health metadata is present.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run eval_reporting_dashboard and verify health, available reports, and empty-state guidance.
```

### Commands

1. `eval_reporting_dashboard({})`
2. Inspect available report list, health metadata, and empty-state guidance.
3. Confirm response is read-only.

### Expected Output / Verification

- Dashboard response is non-empty.
- It either lists reports or provides explicit empty-state guidance.
- Health metadata is present.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts`

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: 029
- Tool: `eval_reporting_dashboard`
