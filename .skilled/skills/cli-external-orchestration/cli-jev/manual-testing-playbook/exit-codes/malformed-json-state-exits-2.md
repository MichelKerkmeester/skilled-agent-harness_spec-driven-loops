---
title: "JEV-006 -- Malformed JSON state exits 2"
description: "Confirm `--json-state` refuses a non-JSON value at exit 2, for `JEV-006`."
version: 1.0.0.0
---

# JEV-006 -- Malformed JSON state exits 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-006`.

---

## 1. OVERVIEW

State may be text or, with `--json-state`, a JSON document. A value that is not JSON must fail at parse time, before a request is built.

### Why This Matters

A caller who passes a shell-quoted blob and receives a transport error has misread the failure class. The parse happens locally, so this failure never costs a provider call.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a non-JSON state value with `--json-state` exits 2 with an `invalid JSON state` error.
- Real user request: `I passed a JSON blob as state and jev refused it.`
- Prompt: `Is it?`
- Expected execution process: run the command sequence in §3 from the repository root with the provider variables cleared, capture the three channels separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr names `invalid JSON state` with a decoder message; exit code `2`; stdout empty.
- Evidence: The command with the exact state value quoted, complete stderr, and the exit code.
- Desired user-visible outcome: the exit code with the decoder message, and the statement that no request was built.
- Pass/fail: PASS when stderr names the JSON failure and the exit code is 2; FAIL when the exit code is 3 or 4, or when a request is built from the raw string; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL \
  jev noul -q 'Is it?' -s 'not json' --json-state </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-006 | Malformed JSON state | Confirm a non-JSON state value with `--json-state` exits 2 with an `invalid JSON state` error | `Is it?` | 1. `env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev noul -q 'Is it?' -s 'not json' --json-state </dev/null` | stderr names `invalid JSON state` with a decoder message; exit code `2`; stdout empty | The command with the exact state value quoted, complete stderr, and the exit code | PASS when stderr names the JSON failure and the exit code is 2; FAIL when the exit code is 3 or 4, or when a request is built from the raw string; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | Exit 3 means `--json-state` was not applied, so the raw string was sent as text. A valid JSON document that parses but has the wrong shape belongs to JEV-016 instead |

### Recorded Result

Observed during the phase-001 pin: stderr carried `invalid JSON state` with a decoder message, exit 2, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/malformed-json-state-exits-2.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The three state forms and the `--json-state` flag |
| [SKILL.md](../../SKILL.md) | The stdin-bounding rule that keeps this command readable |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/malformed-json-state-exits-2.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
