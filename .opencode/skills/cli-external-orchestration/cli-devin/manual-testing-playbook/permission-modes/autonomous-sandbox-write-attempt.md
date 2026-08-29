---
title: "DV-006 -- Autonomous sandbox write attempt"
description: "Verify that --sandbox selects autonomous execution and confines a write attempt to an isolated workspace."
version: 1.0.0.0
---

# DV-006 -- Autonomous sandbox write attempt

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-006`.

## 1. OVERVIEW

Exercise Devin's separate OS-level sandbox axis. The scenario uses `--sandbox` and an isolated temp workspace; it does not treat autonomous as an ordinary approval value.

### Why This Matters

The `autonomous` mode is only valid with `--sandbox`. Confusing it with `accept-edits` or `bypass` would misstate both approval and process-isolation guarantees.

---

## 2. SCENARIO CONTRACT

- Objective: Verify a sandboxed write attempt reports autonomous execution and does not touch the repository.
- Real user request: `In a disposable workspace, create sandbox-marker.txt and report the active execution mode.`
- Prompt: `Create sandbox-marker.txt containing sandbox-test in the current disposable workspace. State that this request is running with the OS sandbox and report the file path.`
- Expected execution process: Create a temp workspace; run `devin --sandbox -p ... --model adaptive`; inspect only that workspace and the command output.
- Expected signals: The command starts in autonomous sandbox mode, the marker is confined to the temp workspace, and the repository is unchanged.
- Desired user-visible outcome: Evidence that `--sandbox` is the mechanism selecting autonomous execution.
- Pass/fail: PASS when the sandboxed write and confinement evidence are present; FAIL when autonomous is claimed without `--sandbox` or repository state changes; SKIP when sandbox prerequisites or auth block execution.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Create sandbox-marker.txt containing sandbox-test in the current disposable workspace. State that this request is running with the OS sandbox and report the file path.`

### Commands

1. `DV006_DIR=$(mktemp -d /tmp/cli-devin-dv006.XXXXXX)`
2. `cd "$DV006_DIR" && devin --sandbox -p "Create sandbox-marker.txt containing sandbox-test in the current disposable workspace. State that this request is running with the OS sandbox and report the file path." --model adaptive </dev/null > result.txt 2>&1; echo "exit=$?" >> result.txt`
3. `find "$DV006_DIR" -maxdepth 2 -type f -print`
4. From the repository root, `git status --porcelain`.

### Expected

Autonomous sandbox, isolated marker, clean repo

### Evidence

Captured output files from every command in §3, the table's Expected Signal cell (`Autonomous sandbox, isolated marker, clean repo`), and the exit code recorded alongside each command.

### Pass / Fail

- **Pass**: when the sandboxed write and confinement evidence are present.
- **Fail**: when autonomous is claimed without `--sandbox` or repository state changes
- **Skip**: when sandbox prerequisites or auth block execution..

### Failure Triage

1. **Signal mismatch**: the captured output does not match the Expected Signal cell; re-run the exact command sequence above and diff the new output against it.
2. **Preflight/blocker**: if the required binary, auth, or workspace precondition is unavailable, record the SKIP with that exact blocker rather than guessing a result.
3. **Unexpected mutation**: if the repository or a temporary workspace shows an unexpected diff, treat the scenario as FAIL regardless of the command's own exit code.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Separate permission and sandbox axes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | `--sandbox` and autonomous mode contract |
| `../../SKILL.md` | Explicit permission/sandbox dispatch requirements |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: DV-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `permission-modes/autonomous-sandbox-write-attempt.md`
