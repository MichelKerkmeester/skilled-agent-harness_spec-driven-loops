---
title: "JEV-002 -- Root help lists the six subcommands"
description: "Confirm the root help surface names all six `jev` subcommands for `JEV-002`."
version: 1.0.0.1
---

# JEV-002 -- Root help lists the six subcommands

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-002`.

---

## 1. OVERVIEW

`jev` is a subcommand-only CLI: there is no bare-question form. This scenario reads the root help and confirms the six names a caller may use, so a caller who assumes a bare form is corrected by the surface itself.

### Why This Matters

A caller that writes a command which never parses gets an argparse message on stderr and no other signal. Reading the surface once is cheaper than diagnosing that exit 2 later.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the root help names `auth`, `install-skills`, `noul`, `choice`, `score` and `run` with exit 0.
- Real user request: `What can the jev command actually do? Show me the subcommand list.`
- Prompt: `jev --help`
- Expected execution process: run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: exit code `0`; stdout names all six subcommands with one line of purpose each; stderr empty.
- Evidence: Complete stdout, the exit code, and complete stderr.
- Desired user-visible outcome: the six-name list, quoted from stdout.
- Pass/fail: PASS when all six names appear and the exit code is 0; FAIL when a name is missing, a seventh appears, or the exit code is non-zero; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v jev`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
jev --help
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-002 | Root help surface | Confirm the root help names all six subcommands with exit 0 | `jev --help` | 1. `jev --help` | Exit code `0`; stdout names `auth`, `install-skills`, `noul`, `choice`, `score` and `run`; stderr empty | Complete stdout, the exit code, and complete stderr | PASS when all six names appear and the exit code is 0; FAIL when a name is missing, a seventh appears, or the exit code is non-zero; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | An exit 2 with usage text on stderr means the argument did not parse. A sixth name absent from stdout means the installed version is older than the pin and JEV-001's version check is the first thing to re-run |

### Recorded Result

Observed during the phase-001 pin: all six names listed, one line of purpose each, exit 0. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/root-help-lists-six-subcommands.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The six-subcommand surface and the shared flag table |
| [SKILL.md](../../SKILL.md) | The judgment primitives the subcommands map onto |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: JEV-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/root-help-lists-six-subcommands.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
