---
title: "ORCA-004 -- Recover from a stopped runtime"
description: "This scenario validates stopped-runtime behavior using read-only status or schema commands and an authorized recovery path only."
stage: recovery
version: 0.1.0.0
---

# ORCA-004 -- Recover from a stopped runtime

## 1. OVERVIEW

This scenario verifies how the packet behaves when the local schema is readable but the connected runtime is stopped or unreachable, using only read-only commands plus an authorized recovery path.

### Why This Matters

`agent-context --json` works without the app, so a green schema read can mask a dead runtime. The packet must not start or authenticate a runtime as a hidden side effect of another request.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-004`
- Feature Name: Recover from a stopped runtime with read-only commands
- Scenario Objective: Observe the exact error and recovery path when a runtime-dependent command runs against a stopped runtime, without starting or authenticating anything implicitly.
- Exact Prompt: `Check whether a runtime-dependent Orca command works while the runtime is stopped and record the exact recovery path. Read-only unless recovery is authorized.`
- Exact Command Sequence: `1. bash: orca agent-context --json (expected: works) -> 2. bash: orca status --json or the guide's status command -> 3. agent: report the runtime state and the documented recovery path`
- Expected Signals: The schema read succeeds; the runtime command fails with a specific error; the reported recovery is the documented read-only path and requires authorization for anything further.
- Evidence: Both command outputs with exit statuses, the error code and the recovery path reported.
- Pass/Fail Criteria: PASS when the exact recovery is observed and reported; FAIL on a disguised failure, an implicit runtime start or an invented recovery; SKIP if runtime control is not authorized or the runtime cannot be stopped safely (blocker: missing authorized runtime control).
- Failure Triage: 1. Confirm the schema read result. 2. Re-run the status command. 3. Ask the operator before any start or authentication step.

---

## 3. TEST EXECUTION

### Prerequisites

A resolved executable and an Orca runtime the operator agrees to observe in a stopped or stopped-able state. If the runtime is live and cannot be stopped, the scenario records `SKIP`.

### Prompt

`Check whether a runtime-dependent Orca command works while the runtime is stopped and record the exact recovery path. Read-only unless recovery is authorized.`

### Commands

1. `orca agent-context --json`
2. `orca status --json` or the guide's status command
3. Report the runtime state and documented recovery path.

### Expected

The schema read succeeds, the runtime command fails specifically and the recovery path is reported without being executed implicitly.

### Evidence

Command outputs, exit statuses, error code, reported recovery path.

### Pass / Fail

- **Pass:** the exact recovery is observed and reported.
- **Skip:** runtime control is not authorized or a live runtime cannot be stopped safely.
- **Fail:** a disguised failure, an implicit start or an invented recovery.

### Failure Triage

1. Re-run the schema read to separate local from runtime state.
2. Re-run the status command with its exact flags.
3. Ask the operator before any start or authentication step.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-004 | Recover from a stopped runtime | Observe stopped-runtime error and authorized recovery | `Check whether a runtime-dependent Orca command works while the runtime is stopped and record the exact recovery path. Read-only unless recovery is authorized.` | `orca agent-context --json` -> status command -> report recovery | Schema succeeds; runtime command fails specifically; recovery documented | Outputs, exit statuses, error code, recovery path | PASS on exact observed recovery; SKIP without runtime control; FAIL on implicit start or invented recovery | Re-run schema and status, ask operator |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Runtime state rules | `references/session-and-runtime.md` Section 4 |

---

## 5. SOURCE METADATA

- Group: Recovery
- Playbook ID: `ORCA-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `recovery/stopped-runtime-recovery.md`
