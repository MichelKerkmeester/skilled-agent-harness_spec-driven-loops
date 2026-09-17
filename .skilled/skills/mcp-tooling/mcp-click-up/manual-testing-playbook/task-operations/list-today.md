---
title: "CU-010 -- Filter Today — cupt list --today --json"
description: "This scenario validates Filter Today — cupt list --today --json for `CU-010`. Objective: Verify `cupt list --today --json` returns valid JSON array of today's tasks."
version: 1.0.0.6
---

# CU-010 -- Filter Today — cupt list --today --json

---

## 1. OVERVIEW

Validates that **Filter Today — cupt list --today --json** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt list --today --json` returns valid JSON array of today's tasks is required for correct agent operation. Failure here means non-json output or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt list --today --json` returns valid JSON array of today's tasks
- **Real user request:** `List tasks due today.`
- **Prompt:** `List today's assigned tasks in JSON format.`
- **Expected signals:** JSON array returned; `jq length` prints a number; exit 0; result may be []
- **Desired user-visible outcome:** Agent reports N tasks due today (or queue is empty — both valid).
- **Pass/fail:** PASS if output is valid JSON parseable by `jq`; FAIL if non-JSON output OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt list --today --json`  # returns JSON array
2. `bash: echo $RESULT | jq length`  # → numeric count
3. Verify each task's due_date is today (or task has no due_date)

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-010 | Filter Today — cupt list --today --json | Verify `cupt list --today --json` returns valid JSON array of today's tasks | `List today's assigned tasks in JSON format.` | 1. `cupt list --today --json`  # returns JSON array 2. `bash: echo $RESULT \| jq length`  # → numeric count 3. Verify each task's due_date is today (or task has no due_date) | JSON array returned; `jq length` prints a number; exit 0; result may be [] | Terminal output of the command sequence above | PASS if output is valid JSON parseable by `jq`; FAIL if non-JSON output OR exit non-zero | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/cupt-task-listing/filter-today.md`](../../feature-catalog/cupt-task-listing/filter-today.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt-commands.md`](../../references/cupt-commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `task-operations/list-today.md`
