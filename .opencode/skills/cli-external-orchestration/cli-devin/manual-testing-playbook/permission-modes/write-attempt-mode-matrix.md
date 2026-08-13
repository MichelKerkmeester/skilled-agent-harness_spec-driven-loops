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

1. `DV005_DIR=$(mktemp -d /tmp/cli-devin-dv005.XXXXXX)`
2. Run from that directory: `devin -p "Create marker.txt containing exactly mode-test. Report whether the write completed." --model adaptive --permission-mode normal </dev/null > normal.txt 2>&1; echo "exit=$?" >> normal.txt`
3. Repeat with `--permission-mode accept-edits` and `--permission-mode bypass`.
4. `find "$DV005_DIR" -maxdepth 1 -type f -print -exec sed -n '1,20p' {} \;`
5. Confirm the repository's status is unchanged.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-005 | Same prompt with `normal`, `accept-edits`, `bypass` | Mode-specific result and isolated file evidence | PASS/FAIL/SKIP |

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
