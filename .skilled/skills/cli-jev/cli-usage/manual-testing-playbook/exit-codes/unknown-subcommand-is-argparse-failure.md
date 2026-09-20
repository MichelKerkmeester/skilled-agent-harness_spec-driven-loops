---
title: "JEV-008 -- An unknown subcommand is an argparse failure"
description: "Confirm an unknown subcommand lists the six valid choices and exits 2, for `JEV-008`."
version: 1.0.0.1
---

# JEV-008 -- An unknown subcommand is an argparse failure

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-008`.

---

## 1. OVERVIEW

A plausible but nonexistent subcommand is used. The parser must refuse it and name the six choices it accepts.

### Why This Matters

The refusal is self-correcting: the error message is the subcommand list. A caller who invents `jev judge` gets the same information JEV-002 reads from the help surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an unknown subcommand exits 2 with the six valid choices listed on stderr.
- Real user request: `I typed jev judge and jev complained.`
- Prompt: `jev judge`
- Expected execution process: run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr names the invalid choice and lists `auth`, `install-skills`, `noul`, `choice`, `score` and `run`; exit code `2`; stdout empty.
- Evidence: The command, complete stderr, and the exit code.
- Desired user-visible outcome: the quoted invalid-choice message with the six valid names.
- Pass/fail: PASS when the invalid choice is named with all six alternatives and the exit code is 2; FAIL when a valid subcommand is refused, an alternative is missing, or the exit code differs; SKIP only when `command -v jev` fails — the missing binary is the blocker.

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
  jev judge -q 'Is it?' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-008 | Unknown subcommand | Confirm an unknown subcommand exits 2 with the six valid choices listed on stderr | `jev judge` | 1. `env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev judge -q 'Is it?' </dev/null` | stderr names the invalid choice and lists `auth`, `install-skills`, `noul`, `choice`, `score` and `run`; exit code `2`; stdout empty | The command, complete stderr, and the exit code | PASS when the invalid choice is named with all six alternatives and the exit code is 2; FAIL when a valid subcommand is refused, an alternative is missing, or the exit code differs; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | A valid subcommand refused here means the parser table changed and JEV-002 must be re-run. An exit 127 is a shell problem, not a parser one |

### Recorded Result

Observed during the phase-001 pin: `argument command: invalid choice: 'judge'` naming all six alternatives, exit 2, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/unknown-subcommand-is-argparse-failure.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The six-subcommand surface |
| [SKILL.md](../../SKILL.md) | The rule that a judgment dispatch is recognized by its subcommand |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/unknown-subcommand-is-argparse-failure.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
