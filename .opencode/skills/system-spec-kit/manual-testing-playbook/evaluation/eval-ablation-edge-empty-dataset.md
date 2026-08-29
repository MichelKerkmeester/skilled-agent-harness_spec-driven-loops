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
- Operator prompt: `Run eval_run_ablation with an intentionally empty dataset selector and verify the response is structured.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response marks the dataset empty or unavailable. - Error/warning is structured and cites the dataset selector. - No unhandled exception appears.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

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

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.


### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/eval-reporting.ts`

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: 028
- Tool: `eval_run_ablation`
