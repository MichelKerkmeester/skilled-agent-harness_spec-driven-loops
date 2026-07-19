---
title: "028 -- Eval ablation edge empty dataset"
description: "Validates eval_run_ablation reports a structured empty-dataset result."
audited_post_017: true
version: 3.6.0.1
id: evaluation-eval-ablation-edge-empty-dataset
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 028 -- Eval ablation edge empty dataset

## 1. OVERVIEW

This scenario adds an edge case to the eval_run_ablation surface: no rows should produce a clear diagnostic, not a misleading PASS.

---

## 2. SCENARIO CONTRACT

- Objective: Validate ablation empty dataset handling.
- Real user request: `Run eval_run_ablation on an empty or nonexistent dataset and report the structured failure.`
- RCAF Prompt: `Run eval_run_ablation with an intentionally empty dataset selector and verify the response is structured.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response marks the dataset empty or unavailable. - Error/warning is structured and cites the dataset selector. - No unhandled exception appears.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run eval_run_ablation with an intentionally empty dataset selector and verify the response is structured.
```

### Commands

1. `eval_run_ablation({ dataset: "playbook-017-empty-dataset", dryRun: true })`
2. Inspect status, warnings, and recovery fields.
3. Confirm no dashboard state is written for the dry-run.

### Expected Output / Verification

- Response marks the dataset empty or unavailable.
- Error/warning is structured and cites the dataset selector.
- No unhandled exception appears.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp-server/handlers/eval-reporting.ts`

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: 028
- Tool: `eval_run_ablation`
