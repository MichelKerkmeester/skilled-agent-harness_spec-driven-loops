---
title: "DV-005 -- Permission mode write-attempt matrix"
description: "Compare normal, accept-edits, and bypass behavior on the same isolated write attempt."
version: 1.0.0.0
---

# DV-005 -- Permission mode write-attempt matrix

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-005`.

## 1. OVERVIEW

Compare the ordinary approval modes on an isolated temporary workspace. The matrix uses `normal` as the `auto` alias control, `accept-edits`, and the repo's `bypass` alias for dangerous mode.

### Why This Matters

Devin's permission mode controls tool approval independently of the model. A write task must not be described as successful merely because a model returned text.

---

## 2. SCENARIO CONTRACT

- Objective: Observe whether the same write request is allowed, prompted, or refused under each mode.
- Real user request: `In a temporary directory, create marker.txt containing the word mode-test under each permission mode.`
- Prompt: `In the current temporary workspace, create marker.txt containing exactly mode-test. Report whether the write completed.`
- Expected execution process: Create a fresh temp workspace; run the prompt with `normal`, `accept-edits`, and `bypass` separately; inspect marker contents and capture each exit code.
- Expected signals: `normal` may prompt or decline in non-interactive mode; `accept-edits` permits workspace edits; `bypass` permits the write without an approval prompt. No repository file changes.
- Desired user-visible outcome: A mode-by-mode evidence table, not a guessed equivalence.
- Pass/fail: PASS when observed behavior is recorded per mode and matches the installed binary's response; FAIL on an unrecorded or contradictory mode result; SKIP if auth is unavailable.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `In the current temporary workspace, create marker.txt containing exactly mode-test. Report whether the write completed.`

### Commands

1. `DV005_DIR=$(mktemp -d /tmp/cli-devin-dv005.XXXXXX)`
2. Run from that directory: `devin -p "Create marker.txt containing exactly mode-test. Report whether the write completed." --model adaptive --permission-mode normal </dev/null > normal.txt 2>&1; echo "exit=$?" >> normal.txt`
3. Repeat with `--permission-mode accept-edits` and `--permission-mode bypass`.
4. `find "$DV005_DIR" -maxdepth 1 -type f -print -exec sed -n '1,20p' {} \;`
5. Confirm the repository's status is unchanged.

### Expected

Mode-specific result and isolated file evidence

### Evidence

Captured output files from every command in §3, the table's Expected Signal cell (`Mode-specific result and isolated file evidence`), and the exit code recorded alongside each command.

### Pass / Fail

- **Pass**: when observed behavior is recorded per mode and matches the installed binary's response.
- **Fail**: on an unrecorded or contradictory mode result
- **Skip**: if auth is unavailable..

### Failure Triage

1. **Signal mismatch**: the captured output does not match the Expected Signal cell; re-run the exact command sequence above and diff the new output against it.
2. **Preflight/blocker**: if the required binary, auth, or workspace precondition is unavailable, record the SKIP with that exact blocker rather than guessing a result.
3. **Unexpected mutation**: if the repository or a temporary workspace shows an unexpected diff, treat the scenario as FAIL regardless of the command's own exit code.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Isolation and permission policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Mode semantics and examples |
| `../../SKILL.md` | Repo dispatch uses `bypass`; dangerous requires approval |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: DV-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `permission-modes/write-attempt-mode-matrix.md`
