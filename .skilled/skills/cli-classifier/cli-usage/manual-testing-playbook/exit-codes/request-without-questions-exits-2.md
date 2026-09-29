---
title: "JEV-016 -- A request without questions exits 2"
description: "Confirm a batch request missing its questions object is refused at exit 2, for `JEV-016`."
version: 1.0.0.1
---

# JEV-016 -- A request without questions exits 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-016`.

---

## 1. OVERVIEW

A syntactically valid JSON document is piped into `run` with no `questions` member. The request builder must refuse it and say which members it requires.

### Why This Matters

The two batch failures are different: malformed JSON fails in the decoder (JEV-006), a well-formed document with the wrong shape fails in the request builder. This scenario is the second one, and its message names both required members.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a `run` document without `questions` exits 2 with a message naming the required members.
- Real user request: `Send a batch request without questions and see how jev reacts.`
- Prompt: `{"state":"x"}`
- Expected execution process: clear the provider variables, run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr states that the request must be an object containing state and questions; exit code `2`; stdout empty.
- Evidence: The exact request document, complete stderr, and the exit code.
- Desired user-visible outcome: the quoted message naming both required members.
- Pass/fail: PASS when the requirement message appears and the exit code is 2; FAIL when the exit code is 3 or 4, or when the request is sent; SKIP only when `command -v jev` fails — the missing binary is the blocker.

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
printf '{"state":"x"}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run -
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-016 | Batch request shape | Confirm a `run` document without `questions` exits 2 with a message naming the required members | `{"state":"x"}` | 1. `printf '{"state":"x"}' \| jev run -` (with the provider variables cleared) | stderr states that the request must be an object containing state and questions; exit code `2`; stdout empty | The exact request document, complete stderr, and the exit code | PASS when the requirement message appears and the exit code is 2; FAIL when the exit code is 3 or 4, or when the request is sent; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | Exit 3 means the document was accepted and the credential check ran, so the request builder lost its shape check. A decoder message instead means the document did not parse, which is JEV-006's subject |

### Recorded Result

Observed during the phase-001 pin: stderr named the required members, exit 2, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/request-without-questions-exits-2.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The request document contract |
| [mcp-server.md](../../references/mcp-server.md) | The same contract as exposed through the `run` tool |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-016
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/request-without-questions-exits-2.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
