---
title: "JEV-010 -- A refused connection exits 4, never 0"
description: "Confirm a dead endpoint is reported as a transport failure at exit 4, for `JEV-010`."
version: 1.0.0.0
---

# JEV-010 -- A refused connection exits 4, never 0

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-010`.

---

## 1. OVERVIEW

The standard transport negative control: a custom provider pointed at a port that refuses connections, with a sentinel key present so the credential check passes and the transport layer is reached.

### Why This Matters

This is the scenario that proves a dead provider cannot be read as an answer. A judgment that fails to connect must say so; a caller that reads exit 0 as "the model said no" is the failure this check exists to prevent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a refused connection exits 4 with an `API connection failed` error and empty stdout.
- Real user request: `Prove that a dead endpoint is reported as a transport failure, not as an answer.`
- Prompt: `Is it urgent?`
- Expected execution process: run the command sequence in §3 from the repository root with a sentinel key, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr names `API connection failed` with a connection-refused cause; exit code `4`; stdout empty.
- Evidence: The command, complete stderr, the exit code, and a check that the sentinel key value does not appear in either stream.
- Desired user-visible outcome: the exit code and the transport error string, with the statement that stdout was empty.
- Pass/fail: PASS when the connection failure is named and the exit code is 4; FAIL when the exit code is 0, 3 or 5, or when any payload is written to stdout; SKIP only when the port answers — a listening port is the blocker, because this scenario requires a refused connection.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and set the sentinel key for the custom provider.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env JEV_API_KEY=dummy-sentinel \
  jev noul -q 'Is it urgent?' -s 'Please restore service today.' \
  --provider custom --endpoint 'http://127.0.0.1:9/v1/systemone' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-010 | Refused connection | Confirm a refused connection exits 4 with an `API connection failed` error and empty stdout | `Is it urgent?` | 1. `env JEV_API_KEY=dummy-sentinel jev noul -q 'Is it urgent?' -s 'Please restore service today.' --provider custom --endpoint 'http://127.0.0.1:9/v1/systemone' </dev/null` | stderr names `API connection failed` with a connection-refused cause; exit code `4`; stdout empty | The command, complete stderr, the exit code, and a check that the sentinel key value does not appear in either stream | PASS when the connection failure is named and the exit code is 4; FAIL when the exit code is 0, 3 or 5, or when any payload is written to stdout; SKIP only when the port answers, naming the listening port as the blocker | Exit 3 means the sentinel key did not resolve, so the credential check ran first. Exit 0 with output is the single worst outcome: treat it as a fabricated answer and stop trusting that provider path |

### Recorded Result

Observed during the phase-001 pin: stderr carried `API connection failed` with a connection-refused cause, exit 4, stdout empty. Verdict PASS. The probe makes no call that leaves the machine.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/refused-connection-exits-4.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The exit-code table and the transport failure class |
| [providers-and-models.md](../../references/providers-and-models.md) | The custom provider, its key variable and its endpoint rule |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/refused-connection-exits-4.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
