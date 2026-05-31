---
title: "CU-010 -- Filter Today — cupt list --today --json"
description: "This scenario validates Filter Today — cupt list --today --json for `CU-010`. Objective: Verify `cupt list --today --json` returns valid JSON array of today's tasks."
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

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-010 | Filter Today — cupt list --today --json | Verify `cupt list --today --json` returns valid JSON ar | `List today's assigned tasks in JSON format.` | JSON array returned; `jq length` prints a number; exit 0; result may be [] | PASS if output is valid JSON parseable by `jq`; FAIL if non-JSON output OR exit non-zero | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/02--cupt-task-listing/010-filter-today.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--task-operations/001-list-today.md`
