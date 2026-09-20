---
title: "JEV-015 -- A batch request with no key exits 3"
description: "Confirm a well-formed `run` request exits 3 at the credential check with `--value` accepted at parse time, for `JEV-015`."
version: 1.0.0.0
---

# JEV-015 -- A batch request with no key exits 3

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-015`.

---

## 1. OVERVIEW

A well-formed batch request is piped into `run` twice: once plain, once with `--value`. Both must stop at the credential check, which is also what proves `--value` is accepted at parse time.

### Why This Matters

`--value` with `run` is rejected only after a successful call, because the value is read from the parsed answer. With no key the rejection is unreachable — which is exactly why the packet declares a guard rule instead of relying on the CLI to refuse it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm both `run` forms exit 3 with the credential error and produce nothing on stdout.
- Real user request: `Send a batch request through jev with no key and tell me what fails.`
- Prompt: `{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}`
- Expected execution process: clear the provider variables, run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status for each form separately, then judge the results against the pass/fail criteria below.
- Expected signals: both stdout-empty; both carry the credential error on stderr; both exit `3`; no flag-conflict refusal at parse time.
- Evidence: The two commands, the exact request document, complete stderr for both, and both exit codes.
- Desired user-visible outcome: the two exit codes and the statement that the conflict is unreachable without a key.
- Pass/fail: PASS when both forms exit 3 with the credential error and no parse-time refusal appears; FAIL when either exits 2 for a flag conflict, or exits 0; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately for each form.
5. Judge the results against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run -
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run - --value
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-015 | Batch request credential check | Confirm both `run` forms exit 3 with the credential error and produce nothing on stdout | `{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}` | 1. `printf '<request>' \| jev run -` -> 2. `printf '<request>' \| jev run - --value` (each with the provider variables cleared) | Both stdout-empty; both carry the credential error on stderr; both exit `3`; no flag-conflict refusal at parse time | The two commands, the exact request document, complete stderr for both, and both exit codes | PASS when both forms exit 3 with the credential error and no parse-time refusal appears; FAIL when either exits 2 for a flag conflict, or exits 0; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | An exit 2 naming `--value` means the conflict moved to parse time and the packet's guard rule is now belt-and-braces rather than load-bearing. A `run` that answers with `--value` is a billed request the caller cannot read |

### Recorded Result

Observed during the phase-001 pin: both forms stdout-empty with the credential error on stderr, exit 3 for each. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/batch-request-with-no-key-exits-3.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The request document shape and the late `--value` rejection |
| [SKILL.md](../../SKILL.md) | The `jev-value-not-with-run` rule this scenario motivates |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/batch-request-with-no-key-exits-3.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
