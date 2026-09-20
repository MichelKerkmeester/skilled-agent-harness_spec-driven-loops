---
title: "JEV-014 -- An invalid provider environment exits 2"
description: "Confirm a typo in `JEV_PROVIDER` fails loudly instead of falling back, for `JEV-014`."
version: 1.0.0.0
---

# JEV-014 -- An invalid provider environment exits 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-014`.

---

## 1. OVERVIEW

An exported environment variable is given a value that is not one of the four provider names. The CLI must refuse it before any provider access.

### Why This Matters

An exported variable is invisible in the command line, so a silent fallback would send a request to a provider the caller did not choose. Failing loudly is the only safe behavior for a typo.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an unrecognized `JEV_PROVIDER` value exits 2 with a message naming the value.
- Real user request: `I exported a provider name with a typo and jev accepted it — did it?`
- Prompt: `Is it?`
- Expected execution process: run the command sequence in §3 from the repository root with the invalid value exported and the key variables cleared, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr names the invalid provider value; exit code `2`; stdout empty; no request sent.
- Evidence: The exported value, complete stderr, and the exit code.
- Desired user-visible outcome: the quoted invalid-provider message with the exit code.
- Pass/fail: PASS when the invalid value is named and the exit code is 2; FAIL when the command falls back to another provider, exits 3, or exits 4; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the key variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_ENDPOINT JEV_PROVIDER=nope \
  jev noul -q 'Is it?' -s 'x' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-014 | Invalid provider environment | Confirm an unrecognized `JEV_PROVIDER` value exits 2 with a message naming the value | `Is it?` | 1. `env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_ENDPOINT JEV_PROVIDER=nope jev noul -q 'Is it?' -s 'x' </dev/null` | stderr names the invalid provider value; exit code `2`; stdout empty; no request sent | The exported value, complete stderr, and the exit code | PASS when the invalid value is named and the exit code is 2; FAIL when the command falls back to another provider, exits 3, or exits 4; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | Exit 3 means the variable was ignored and a provider default was used; that is the silent-fallback defect this scenario exists to catch. Exit 4 means a request was sent |

### Recorded Result

Observed during the phase-001 pin: stderr named the invalid provider value, exit 2, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `providers/invalid-provider-env-exits-2.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [providers-and-models.md](../../references/providers-and-models.md) | The provider name set and the `JEV_PROVIDER` selection order |
| [cli-reference.md](../../references/cli-reference.md) | The exit-code table and the error envelope |

---

## 5. SOURCE METADATA

- Group: Providers
- Playbook ID: JEV-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `providers/invalid-provider-env-exits-2.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
