---
title: "279 -- Retention sweep dry-run no-op"
description: "Validates memory_retention_sweep dry-run behavior when no rows are eligible for deletion."
audited_post_017: true
version: 3.6.0.2
id: maintenance-retention-sweep-dry-run-no-op
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 279 -- Retention sweep dry-run no-op

## 1. OVERVIEW

Retention sweeps are destructive when not in dry-run mode; this scenario exercises the safe no-op edge first.

---

## 2. SCENARIO CONTRACT

- Objective: Validate retention dry-run reports eligible counts without deleting rows.
- Real user request: `Run a retention sweep dry-run and prove it does not delete anything when no rows are eligible.`
- Operator prompt: `Validate memory_retention_sweep dry-run no-op behavior and report before/after counts.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dry-run response includes the candidate list and `swept: 0`. - Before/after row counts are identical. - Response data carries `dryRun: true` so the no-op mode is explicit.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_retention_sweep dry-run no-op behavior and report before/after counts.
```

### Commands

1. `memory_stats({})` and record total rows.
2. `memory_retention_sweep({ dryRun: true })` — `dryRun` is the tool's only parameter
3. `memory_stats({})` again and compare totals.

### Expected Output / Verification

- Dry-run response data includes the candidate list and `swept: 0`.
- Before/after row counts are identical.
- Response data carries `dryRun: true` so the no-op mode is explicit.

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
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-retention-sweep.ts`

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: 279
- Tool: `memory_retention_sweep`
