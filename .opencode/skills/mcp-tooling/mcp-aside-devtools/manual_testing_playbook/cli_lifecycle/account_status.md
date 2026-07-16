---
title: "ASD-003 -- Account status"
description: "This scenario validates read-only account inspection for `ASD-003`. It focuses on confirming `aside account list` and `aside account status` report sign-in state without mutating it."
version: 1.0.0.0
---

# ASD-003 -- Account status

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-003`.

---

## 1. OVERVIEW

This scenario inspects the account layer read-only: enumerate accounts and report the active account's status.

### Why This Matters

Aside's built-in model tier fails closed when signed out, and every browser-touching lane inherits the signed-in account context (including `aside mcp`, which has no auth option of its own). Confirming account state up front prevents misdiagnosing later failures as transport or binding problems.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `aside account list` and `aside account status` succeed and report account state, with no mutation (`account use` is NOT run).
- Real user request: `"Am I signed in to Aside, and with which account?"`
- Prompt: `Report the Aside sign-in state and active account without changing anything.`
- Expected execution process: list, status, no `use`.
- Expected signals: list returns at least one account or a clear signed-out message; status reports the active account's state.
- Desired user-visible outcome: A short account-state report with a PASS verdict.
- Pass/fail: PASS if both commands complete and the state is unambiguous; FAIL if either command errors uninterpretably.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Report the Aside sign-in state and active account without changing anything.`

### Commands

1. `bash: aside account list 2>&1`
2. `bash: aside account status 2>&1`

### Expected

- Step 1: account enumeration (or explicit signed-out output)
- Step 2: active-account status

### Evidence

Both outputs verbatim, with any account identifiers noted but credential-adjacent values redacted.

### Pass / Fail

- **Pass**: both commands complete with an unambiguous state.
- **Fail**: either command errors without a readable state.

### Failure Triage

1. Signed-out state: valid finding, not a scenario failure — note that built-in models fail closed while BYO API-key providers keep working; recovery (`aside account use <id>`) is operator-invoked.
2. Multiple accounts with no clear default: report ACCOUNT_AMBIGUOUS and stop — selection is an operator decision.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md` | SIGNED_OUT and ACCOUNT_AMBIGUOUS taxonomy |

---

## 5. SOURCE METADATA

- Group: CLI LIFECYCLE
- Playbook ID: ASD-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cli_lifecycle/account_status.md`
