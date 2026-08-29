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
- Operator prompt: `Run eval_reporting_dashboard and verify health, available reports, and empty-state guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dashboard response is non-empty. - It either lists reports or provides explicit empty-state guidance. - Health metadata is present.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

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
- Playbook ID: 029
- Tool: `eval_reporting_dashboard`
