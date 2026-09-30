---
id: "DEE-001"
title: "DEE-001 -- Refused port health reports unreachable"
description: "This scenario validates that a health check against a refused port exits 4 with an unreachable error and an empty stdout, for `DEE-001`."
version: 0.1.0.0
---

# DEE-001 -- Refused port health reports unreachable

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-001`.

---

## 1. OVERVIEW

`cli-deem health` reads `GET /health` before any judgment, so a caller learns whether Deem is usable. A refused connection is the common case when the server is stopped or still loading its weights.

### Why This Matters

A feature that stays dormant without Deem reads this exit code. If a refused connection produced a health body or exit 0, an offline arm would treat an absent server as a usable one. This scenario is the reachability half of the availability rule, and DEE-002 and DEE-003 cover the two refusals that come after a body arrives.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a health check against a refused port exits 4 with `Deem unreachable` on stderr and an empty stdout.
- Real user request: `Check whether cli-deem can reach Deem before I run a judgment.`
- Prompt: `Check whether cli-deem can reach Deem before I run a judgment.`
- Expected execution process: run the command block in §3 from the repository root with `CLI_DEEM_URL` pointed at port 9, capture stdout and stderr separately, then read the exit status against the pass/fail criteria below.
- Expected signals: stderr carries `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}`, the exit status is `4`, and stdout is empty.
- Evidence: the command, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads exit 4 and the `Deem unreachable` error, and knows Deem is unavailable for this run.
- Pass/fail: PASS when the exit status is 4, stderr names `Deem unreachable` and stdout is empty. FAIL when the exit status is 0 or 3, or when stdout carries any payload. SKIP only when something answers on port 9, naming the listening service as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health
echo "exit=$?"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-001 | Refused port health reports unreachable | Confirm a health check against a refused port exits 4 with `Deem unreachable` on stderr and an empty stdout | `Check whether cli-deem can reach Deem before I run a judgment.` | 1. `bash: CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health` -> 2. `bash: echo "exit=$?"` | stderr `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}`, exit `4`, stdout empty | The command, complete stdout, complete stderr and the exit status | PASS when the exit status is 4, stderr names `Deem unreachable` and stdout is empty. FAIL when the exit status is 0 or 3, or when stdout carries any payload. SKIP only when something answers on port 9, naming the listening service as the blocker | 1. Exit 0 means something answered on port 9, so check for a local service on that port and pick another refused port. 2. Exit 3 means a health body was read, so confirm `CLI_DEEM_URL` was set for the command. 3. Any stdout payload means the failure path wrote to the wrong stream, so inspect `reportFailure` in `scripts/cli-deem.mjs` |

### Recorded Result

Observed while authoring: stdout was empty, stderr carried `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}` and the exit status was 4. Verdict PASS.

### Failure Triage

1. Exit 0 means something answered on port 9. Check for a local service on that port, then rerun against another refused port.
2. Exit 3 means a health body was read. Confirm `CLI_DEEM_URL` was exported for the command rather than set after it.
3. Any stdout payload means the failure path wrote to the wrong stream. Inspect `reportFailure` in `scripts/cli-deem.mjs` before trusting nearby scenarios.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [health-check.md](../../feature-catalog/availability-check/health-check.md) | Feature-catalog source describing the health check |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | The client, its base URL rule and its exit mapping |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `health exits 4 when nothing is listening` |
| [wire-contract.md](../../references/wire-contract.md) | The endpoints, the loopback rule and the timeouts |

---

## 5. SOURCE METADATA

- Group: Availability Gate
- Playbook ID: DEE-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `availability-gate/refused-port-health-reports-unreachable.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
