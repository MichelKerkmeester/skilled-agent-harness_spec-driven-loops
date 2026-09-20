---
title: "JEV-011 -- The key is never echoed on the error path"
description: "Confirm the credential never appears in the output of a failing call, for `JEV-011`."
version: 1.0.0.1
---

# JEV-011 -- The key is never echoed on the error path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-011`.

---

## 1. OVERVIEW

A sentinel key is exported and a call is forced to fail. The sentinel must not appear anywhere in stdout or stderr.

### Why This Matters

The error body is the one place a client library commonly prints the `Authorization` header, and a key in a transcript is a rotation event rather than a bug report. This scenario is the check that the tool's error paths are redacted.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the sentinel key value never appears in the combined output of a failing call.
- Real user request: `Make sure the API key can never end up in a log or transcript.`
- Prompt: `Is it?`
- Expected execution process: run the command sequence in §3 from the repository root, capture the combined output, then judge the result against the pass/fail criteria below.
- Expected signals: the sentinel search count is `0`; the failure itself is still reported on stderr.
- Evidence: The command, the search count, and the failing error string that proves output was produced.
- Desired user-visible outcome: a count of zero with the failure that would have carried the key, quoted.
- Pass/fail: PASS when the count is 0 and the failure is still reported; FAIL when the sentinel appears in either stream; SKIP only when the failure does not occur — a successful call is the blocker, because this scenario needs an error path to search.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and set the sentinel key for the custom provider.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the count and confirm the failure that produced it.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env JEV_API_KEY=dummy-sentinel jev noul -q 'Is it?' -s 'x' \
  --provider custom --endpoint 'http://127.0.0.1:9/v1/systemone' </dev/null 2>&1 | grep -c 'dummy-sentinel'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-011 | Credential redaction | Confirm the sentinel key value never appears in the combined output of a failing call | `Is it?` | 1. `env JEV_API_KEY=dummy-sentinel jev noul -q 'Is it?' -s 'x' --provider custom --endpoint 'http://127.0.0.1:9/v1/systemone' </dev/null 2>&1 \| grep -c 'dummy-sentinel'` | The sentinel search count is `0`; the failure itself is still reported on stderr | The command, the search count, and the failing error string that proves output was produced | PASS when the count is 0 and the failure is still reported; FAIL when the sentinel appears in either stream; SKIP only when the failure does not occur, naming the absent error path as the blocker | A count above zero is a rotation event: rotate the key before doing anything else. A count of zero with no error line means the pipeline swallowed the output and the check proved nothing |

### Recorded Result

Observed during the phase-001 pin: the sentinel search count was 0 while the same call reported its transport error on stderr. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/key-never-echoed-on-error-path.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [providers-and-models.md](../../references/providers-and-models.md) | Where the key is resolved from and stored |
| [SKILL.md](../../SKILL.md) | The rule that forbids inlining a credential on a command line |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/key-never-echoed-on-error-path.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
