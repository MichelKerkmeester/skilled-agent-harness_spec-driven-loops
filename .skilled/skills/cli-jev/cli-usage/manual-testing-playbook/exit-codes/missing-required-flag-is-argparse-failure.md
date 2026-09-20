---
title: "JEV-007 -- A missing required flag is an argparse failure"
description: "Confirm each judgment subcommand refuses a missing required flag with usage text at exit 2, for `JEV-007`."
version: 1.0.0.1
---

# JEV-007 -- A missing required flag is an argparse failure

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-007`.

---

## 1. OVERVIEW

Three subcommands are run without their required question or criteria flag. Each must fail inside the argument parser, not later.

### Why This Matters

Both argparse exits and `CliError` exits use code 2 and write to stderr, but only one of them writes JSON. A caller that parses stderr as JSON must tolerate plain usage text at exit 2, and this scenario is the evidence for that requirement.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `noul`, `choice` and `score` each print a usage block naming the missing flag and exit 2.
- Real user request: `I ran jev noul without the question flag and got a wall of text.`
- Prompt: `Is it?`
- Expected execution process: run the command sequence in §3 from the repository root with the provider variables cleared, capture stdout, stderr and the exit status for each command separately, then judge the results against the pass/fail criteria below.
- Expected signals: each stderr names the missing required flag (`-q/--question`, `-o/--option`, `-l/--level`); exit code `2` for each; stdout empty; no JSON envelope.
- Evidence: The three commands, the three stderr blocks, and the three exit codes.
- Desired user-visible outcome: the three lines naming which flag each subcommand requires.
- Pass/fail: PASS when all three exit 2 with a usage block naming the missing flag; FAIL when a command exits 0 or 3, or when a missing flag is not named; SKIP only when `command -v jev` fails — the missing binary is the blocker.

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
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev noul -s 'x' </dev/null
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev choice -q 'Which?' -s 'x' </dev/null
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev score -q 'How bad?' -s 'x' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-007 | Missing required flag | Confirm each judgment subcommand refuses a missing required flag with usage text at exit 2 | `Is it?` | 1. `jev noul -s 'x' </dev/null` -> 2. `jev choice -q 'Which?' -s 'x' </dev/null` -> 3. `jev score -q 'How bad?' -s 'x' </dev/null` (each with the provider variables cleared) | Each stderr names the missing required flag (`-q/--question`, `-o/--option`, `-l/--level`); exit code `2` for each; stdout empty; no JSON envelope | The three commands, the three stderr blocks, and the three exit codes | PASS when all three exit 2 with a usage block naming the missing flag; FAIL when a command exits 0 or 3, or when a missing flag is not named; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | Exit 3 means the flag was supplied somewhere the command did not show. A JSON envelope at exit 2 is a `CliError`, not argparse, and points at the request rather than the command line |

### Recorded Result

Observed during the phase-001 pin: the three usage blocks, exit 2 for each, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/missing-required-flag-is-argparse-failure.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The per-subcommand required flags and the exit-code table |
| [judgment-primitives.md](../../feature-catalog/judgment-primitives/judgment-primitives.md) | The criteria each subcommand expects before it is worth sending |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/missing-required-flag-is-argparse-failure.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
