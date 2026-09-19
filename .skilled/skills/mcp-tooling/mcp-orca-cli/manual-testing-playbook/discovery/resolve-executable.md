---
title: "ORCA-001 -- Resolve the executable"
description: "This scenario validates executable resolution and read-only capture of version, help, local command schema and the version-matched guide."
stage: discovery
version: 0.1.1.0
---

# ORCA-001 -- Resolve the executable

## 1. OVERVIEW

This scenario resolves exactly one Orca executable and captures `--version`, `--help`, `orca agent-context --json` and the version-matched guide without touching any mutating lane.

### Why This Matters

Every later scenario depends on the selected executable and its guide. A silent fall-through to a different executable can change the runtime, account, worktree or permission context, so this scenario is the packet's anchor evidence.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-001`
- Feature Name: Resolve the executable and capture version, help, schema and guide
- Scenario Objective: Resolve one executable in the documented order and capture all read-only discovery output with exit statuses.
- Exact Prompt: `Resolve the Orca executable and capture its version, help, local command schema and guide. Do not change any state.`
- Exact Command Sequence: `1. bash: command -v orca -> 2. bash: orca --version -> 3. bash: orca --help -> 4. bash: orca agent-context --json -> 5. bash: orca skills get orca-cli --full`
- Expected Signals: One executable path resolves. `--version` prints a four-segment Orca version. `--help` exits 0. `agent-context --json` returns a schema object without contacting the runtime. `skills get orca-cli --full` returns the bundled guide text.
- Evidence: The resolved path, version string, help exit status, schema command count and the guide's first lines, all with exit statuses.
- Pass/Fail Criteria: PASS when all read-only checks complete with exit 0 and the resolution order is recorded. FAIL on any command error, missing executable or silent fall-through. SKIP when no Orca executable exists and the operator declines installation.
- Failure Triage: 1. Check `ORCA_CLI_COMMAND` and `PATH`. 2. Ask the operator whether to install or configure Orca. 3. Never inspect source or install silently.

---

## 3. TEST EXECUTION

### Prerequisites

An Orca executable is resolvable or the operator has agreed the scenario records a `SKIP`.

### Prompt

`Resolve the Orca executable and capture its version, help, local command schema and guide. Do not change any state.`

### Commands

1. `command -v orca`
2. `orca --version`
3. `orca --help`
4. `orca agent-context --json`
5. `orca skills get orca-cli --full`

### Expected

All five commands exit 0 and their output is captured with the resolved path and version.

### Evidence

Resolved path, version string, help exit status, schema command count, guide retrieval mode.

### Pass / Fail

- **Pass:** every read-only command exits 0 and the resolution order is recorded.
- **Skip:** no executable exists and installation is not authorized.
- **Fail:** any command errors or the sequence falls through to a second executable after an error.

### Failure Triage

1. Confirm `ORCA_CLI_COMMAND` and `PATH` state.
2. Ask the operator whether to install or configure Orca.
3. Re-run the resolution order from the start after any authorized correction.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-001 | Resolve the executable | Capture version, help, schema and guide read-only | `Resolve the Orca executable and capture its version, help, local command schema and guide. Do not change any state.` | `command -v orca` -> `orca --version` -> `orca --help` -> `orca agent-context --json` -> `orca skills get orca-cli --full` | Exit 0 on all five. One resolved path. Schema object. Guide text | Path, version, exit statuses, command count, guide head | PASS on full capture. SKIP on missing executable without authorization. FAIL on error or fall-through | Check env and PATH, ask operator, restart resolution |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Command reference | `references/orca-cli-reference.md` Section 2 |

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: `ORCA-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery/resolve-executable.md`
