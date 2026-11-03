<!-- Provenance: contract-shaped fixture derived from an operator scenario under sk-git/manual-testing-playbook. -->
---
title: "FX-002 -- Conversation operator scenario"
description: "A clean conversation fixture for the operator-scenario validator."
id: FX-002
version: 1.0.0.0
---

# FX-002 -- Conversation operator scenario

## 1. OVERVIEW

This scenario proves the fixture package can be executed by an operator.

## 2. SCENARIO CONTRACT

- Operator prompt: `Run the fixture contract and report the observed result.`
- Expected signals: the command exits zero and the result is observable.
- Pass/fail: PASS if the result is observable; FAIL if it is not.

## 3. TEST EXECUTION

### Conversation Script

```json conversation
{
  "runtimes": ["codex"],
  "turns": [
    {
      "id": "initial-send",
      "send": "Run the fixture contract and report the observed result.",
      "check": "test -f manual-testing-playbook.md"
    }
  ]
}
```

### Exact Command Sequence

1. `node --version`
2. `node -e "console.log('fixture')"`

### Expected Signals

The command emits a version and the word `fixture`.

### Evidence

Capture the command transcript and the final operator verdict.

### Pass / Fail Criteria

- PASS if both signals are present.
- FAIL if either signal is absent.

### Failure Triage

1. Check that Node is available.
2. Re-run the exact command sequence and compare the transcript.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FX-002 | Conversation operator scenario | Prove the fixture contract | `Run the fixture contract and report the observed result.` | `node --version` -> `node -e "console.log('fixture')"` | Version and fixture output | Command transcript | PASS if both signals are present; FAIL otherwise | Check Node, then rerun. |

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)

## 5. SOURCE METADATA

- Group: scenarios
- Playbook ID: FX-002
- Canonical root source: `manual-testing-playbook.md`
