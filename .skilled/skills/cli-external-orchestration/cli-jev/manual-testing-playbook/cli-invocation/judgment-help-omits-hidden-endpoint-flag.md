---
title: "JEV-003 -- The judgment help omits the hidden endpoint flag"
description: "Confirm `--endpoint` works while `--help` never lists it, for `JEV-003`."
version: 1.0.0.0
---

# JEV-003 -- The judgment help omits the hidden endpoint flag

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-003`.

---

## 1. OVERVIEW

Two judgment subcommands are asked for their help. Both must list the shared flags and neither may list `--endpoint`, even though the flag exists and works — it is registered with `argparse.SUPPRESS`.

### Why This Matters

A reader who trusts `--help` alone concludes the endpoint cannot be overridden, and the custom-provider scenario (JEV-009) depends on the override being real. Documenting the gap is cheaper than rediscovering it per caller.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm both judgment help surfaces list the shared flags and omit `--endpoint`.
- Real user request: `Why didn't jev noul --help show me the endpoint flag I saw mentioned?`
- Prompt: `jev noul --help`
- Expected execution process: run the command sequence in §3 from the repository root, capture stdout and the exit status for each surface separately, then judge the result against the pass/fail criteria below.
- Expected signals: `--provider`, `--model`, `--json-state`, `--pretty` and `--value` present in both; `--endpoint` absent from both; exit code `0` for both.
- Evidence: The two help texts, the presence check for the five shared flags, the absence check for `--endpoint`, and the exit codes.
- Desired user-visible outcome: the two lists quoted, with the absent flag named explicitly.
- Pass/fail: PASS when the five shared flags are present and `--endpoint` is absent from both surfaces at exit 0; FAIL when `--endpoint` appears in a help surface or a shared flag is missing; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v jev`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout and the exit status for each surface separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
jev noul --help
jev run --help
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-003 | Hidden endpoint flag | Confirm both judgment help surfaces list the shared flags and omit `--endpoint` | `jev noul --help` | 1. `jev noul --help` -> 2. `jev run --help` | `--provider`, `--model`, `--json-state`, `--pretty` and `--value` present in both; `--endpoint` absent from both; exit code `0` for both | The two help texts, the presence check for the five shared flags, the absence check for `--endpoint`, and the exit codes | PASS when the five shared flags are present and `--endpoint` is absent from both surfaces at exit 0; FAIL when `--endpoint` appears in a help surface or a shared flag is missing; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | If `--endpoint` starts appearing the suppression was dropped: re-run JEV-009 before trusting the flag order. A missing `--value` means the installed version differs from the pin |

### Recorded Result

Observed during the phase-001 pin: `--value` present in both surfaces, `--endpoint` absent from both, exit 0. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/judgment-help-omits-hidden-endpoint-flag.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The shared flag table and the suppressed `--endpoint` note |
| [providers-and-models.md](../../references/providers-and-models.md) | The endpoint override and its order relative to the key check |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: JEV-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/judgment-help-omits-hidden-endpoint-flag.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
