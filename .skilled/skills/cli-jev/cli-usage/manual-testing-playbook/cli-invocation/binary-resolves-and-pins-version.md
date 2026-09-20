---
title: "JEV-001 -- Binary resolves and pins the version"
description: "Confirm `jev` resolves on `PATH` and prints the pinned version for `JEV-001`."
version: 1.0.0.0
---

# JEV-001 -- Binary resolves and pins the version

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-001`.

---

## 1. OVERVIEW

This scenario is the package's liveness gate. It resolves the binary and reads its version before any other scenario runs, so a failure elsewhere can be attributed to that scenario rather than to a missing install.

It is also the check that every other scenario inherits: the packet is only advertised once `jev` resolves, and a routing surface that advertises a mode whose binary is absent has found a defect.

### Why This Matters

`uv tool install jev-cli` installs two executables into a tool shim. If the shim directory is not on `PATH`, every later scenario fails with the same exit 127 and the real cause is invisible.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `jev` resolves on `PATH` and prints the pinned version `0.6.2` with exit 0.
- Real user request: `Check that the Jev CLI is installed here before I hand it any work.`
- Prompt: `command -v jev && jev --version`
- Expected execution process: run the command sequence in §3 from the repository root with the provider key variables cleared, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: `command -v` prints a path; stdout then carries exactly `jev 0.6.2`; exit code `0`; stderr empty.
- Evidence: The resolved path, the version line, the exit code, and the complete stderr.
- Desired user-visible outcome: a one-line verdict naming the resolved path and the pinned version.
- Pass/fail: PASS when the path resolves and stdout is exactly `jev 0.6.2` at exit 0; FAIL when the path does not resolve, the version differs from the pin, or the exit code is non-zero; SKIP only when no `uv`-managed install is available in the environment — the missing install is the blocker, and the scenario names `uv tool list` as the next check.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the provider-boundary note.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
command -v jev
jev --version
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-001 | Binary discovery and version pin | Confirm `jev` resolves on `PATH` and prints the pinned version with exit 0 | `command -v jev && jev --version` | 1. `command -v jev` -> 2. `jev --version` | `command -v` prints a path; stdout carries exactly `jev 0.6.2`; exit code `0`; stderr empty | The resolved path, the version line, the exit code, and the complete stderr | PASS when the path resolves and stdout is exactly `jev 0.6.2` at exit 0; FAIL when the path does not resolve, the version differs from the pin, or the exit code is non-zero; SKIP only when no `uv`-managed install is available, naming the missing install as the blocker | Exit 127 means the tool shim is missing from this shell: `uv tool list`, then `uv tool install jev-cli`. A different version string means the pin moved and every other scenario's expectations move with it |

### Recorded Result

Observed during the phase-001 pin: the binary resolved through the `uv` tool shim, stdout read `jev 0.6.2`, and the exit status was 0 with empty stderr. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/binary-resolves-and-pins-version.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The version string, the install command and the rollback |
| [SKILL.md](../../SKILL.md) | The availability rule every dispatch depends on |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: JEV-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/binary-resolves-and-pins-version.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
