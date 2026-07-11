---
title: "279 -- Retention sweep dry-run no-op"
description: "Validates memory_retention_sweep dry-run behavior when no rows are eligible for deletion."
audited_post_017: true
version: 3.6.0.2
---

# 279 -- Retention sweep dry-run no-op

## 1. OVERVIEW

Retention sweeps are destructive when not in dry-run mode; this scenario exercises the safe no-op edge first.

---

## 2. SCENARIO CONTRACT

- Objective: Validate retention dry-run reports eligible counts without deleting rows.
- Real user request: `Run a retention sweep dry-run and prove it does not delete anything when no rows are eligible.`
- RCAF Prompt: `Validate memory_retention_sweep dry-run no-op behavior and report before/after counts.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dry-run response includes the candidate list and `swept: 0`. - Before/after row counts are identical. - Response data carries `dryRun: true` so the no-op mode is explicit.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

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

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: 279
- Tool: `memory_retention_sweep`
