---
title: "JEV-004 -- No key exits 3 with structured JSON on stderr"
description: "Confirm a judgment with no stored key exits 3 with one JSON error object on stderr, for `JEV-004`."
version: 1.0.0.1
---

# JEV-004 -- No key exits 3 with structured JSON on stderr

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-004`.

---

## 1. OVERVIEW

The first member of the exit-code taxonomy. A judgment is attempted with every provider variable cleared, and the credential check must refuse it before any socket is opened.

### Why This Matters

The credentials are resolved before the request is built, so a missing key costs no network call and no provider quota. A run that reaches the provider without a key has found a different defect than the one this scenario checks.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a judgment with no stored key exits 3, prints nothing on stdout, and prints one JSON error object on stderr.
- Real user request: `Run one judgment and tell me if the tool is usable without a key.`
- Prompt: `Is this urgent?`
- Expected execution process: clear `TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY`, `JEV_API_KEY`, `JEV_PROVIDER`, `JEV_ENDPOINT` and `JEV_MODEL`, run the command sequence in §3 from the repository root, capture the three channels separately, then judge the result against the pass/fail criteria below.
- Expected signals: stdout empty; stderr carries exactly one JSON object whose `ok` is `false` and whose `error` names the missing key; exit code `3`.
- Evidence: The command with the cleared variables named, complete stdout, complete stderr, and the exit code.
- Desired user-visible outcome: the exit code with its error string quoted, and the statement that nothing was written to stdout.
- Pass/fail: PASS when stdout is empty, stderr is the credential error, and the exit code is 3; FAIL when stdout carries anything, the exit code is 0 or 2, or stderr is silent; SKIP only when a credential resolves anyway — the unexpected stored credential is the blocker, because this scenario requires the unauthenticated state.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables listed in the contract.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u TYPESAFE_API_KEY -u AI_GATEWAY_API_KEY -u OPENROUTER_API_KEY -u JEV_API_KEY \
  -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL \
  jev noul -q 'Is this urgent?' -s 'Please restore service today.' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-004 | Missing credential exit | Confirm a judgment with no stored key exits 3 with one JSON error object and empty stdout | `Is this urgent?` | 1. `env -u TYPESAFE_API_KEY -u AI_GATEWAY_API_KEY -u OPENROUTER_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev noul -q 'Is this urgent?' -s 'Please restore service today.' </dev/null` | stdout empty; stderr carries one JSON object with `ok` false naming the missing key; exit code `3` | The command with the cleared variables named, complete stdout, complete stderr, and the exit code | PASS when stdout is empty, stderr is the credential error, and the exit code is 3; FAIL when stdout carries anything, the exit code is 0 or 2, or stderr is silent; SKIP only when a credential resolves anyway, naming the unexpected stored credential as the blocker | Exit 0 means a key resolved from somewhere the command did not name — re-read the resolution order before trusting the run. Exit 2 with usage text is an argument problem, not a credential one. A key that reaches the provider without being stored is a separate finding |

### Recorded Result

Observed during the phase-001 pin with the variables cleared: stdout empty, one JSON credential error on stderr, exit 3. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/no-key-exits-3-with-structured-json.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The exit-code table and the JSON error envelope |
| [providers-and-models.md](../../references/providers-and-models.md) | The key resolution order this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/no-key-exits-3-with-structured-json.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
