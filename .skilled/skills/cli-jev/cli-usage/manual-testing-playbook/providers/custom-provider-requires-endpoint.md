---
title: "JEV-009 -- Custom without an endpoint exits 2 before any request"
description: "Confirm the `custom` provider requires an endpoint and validates it before the key, for `JEV-009`."
version: 1.0.0.0
---

# JEV-009 -- Custom without an endpoint exits 2 before any request

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-009`.

---

## 1. OVERVIEW

The `custom` provider is run twice: once with no endpoint, once with an endpoint and no key. The pair fixes the order of the two checks and proves the endpoint override is accepted even though `--help` never lists it.

### Why This Matters

A caller who sees exit 3 where it expected exit 2 has an endpoint problem; a caller who sees exit 2 has not yet reached the key. Without the pair, the two failures are indistinguishable and the diagnosis costs a guess per incident.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the endpoint rule fires at exit 2 without an endpoint, and that an endpoint moves the failure to the credential check at exit 3.
- Real user request: `Configure jev against our own endpoint and check what happens without a key.`
- Prompt: `Is it?`
- Expected execution process: clear the provider variables, run the two commands in §3 from the repository root, capture stdout, stderr and the exit status for each, then judge the results against the pass/fail criteria below.
- Expected signals: the first command exits `2` naming `JEV_ENDPOINT` or `--endpoint` with no socket opened; the second exits `3` naming the missing custom key; both stdout-empty.
- Evidence: The two commands, both stderr blocks, both exit codes, and the statement that the second endpoint belongs to the discard port.
- Desired user-visible outcome: the two exit codes with the check order made explicit.
- Pass/fail: PASS when the no-endpoint form exits 2 and the endpoint-without-key form exits 3; FAIL when either exit code differs, or when the first form opens a socket; SKIP only when a key resolves for the custom provider — the unexpected stored credential is the blocker, because the second half requires the missing-key state.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately for each command.
5. Judge the results against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u JEV_API_KEY -u JEV_ENDPOINT jev noul -q 'Is it?' -s 'x' --provider custom </dev/null
env -u JEV_API_KEY jev noul -q 'Is it?' -s 'x' --provider custom --endpoint 'https://127.0.0.1:1/v1/systemone' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-009 | Custom provider endpoint rule | Confirm the endpoint rule fires at exit 2 without an endpoint, and that an endpoint moves the failure to the credential check at exit 3 | `Is it?` | 1. `env -u JEV_API_KEY -u JEV_ENDPOINT jev noul -q 'Is it?' -s 'x' --provider custom </dev/null` -> 2. `env -u JEV_API_KEY jev noul -q 'Is it?' -s 'x' --provider custom --endpoint 'https://127.0.0.1:1/v1/systemone' </dev/null` | The first exits `2` naming `JEV_ENDPOINT` or `--endpoint` with no socket opened; the second exits `3` naming the missing custom key; both stdout-empty | The two commands, both stderr blocks, both exit codes, and the statement that the second endpoint belongs to the discard port | PASS when the no-endpoint form exits 2 and the endpoint-without-key form exits 3; FAIL when either exit code differs, or when the first form opens a socket; SKIP only when a key resolves for the custom provider, naming the unexpected stored credential as the blocker | Exit 3 without an endpoint means the rule moved or the environment carries `JEV_ENDPOINT`; re-run with the variable explicitly unset as shown. Exit 2 with an endpoint means the override was not accepted, which contradicts JEV-003 |

### Recorded Result

Observed during the phase-001 pin: the no-endpoint form exited 2 with the endpoint error, and the endpoint-without-key form exited 3 with the missing-key error. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `providers/custom-provider-requires-endpoint.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [providers-and-models.md](../../references/providers-and-models.md) | The four providers, their key variables and the endpoint override |
| [cli-reference.md](../../references/cli-reference.md) | The suppressed `--endpoint` flag and the exit-code table |

---

## 5. SOURCE METADATA

- Group: Providers
- Playbook ID: JEV-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `providers/custom-provider-requires-endpoint.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
