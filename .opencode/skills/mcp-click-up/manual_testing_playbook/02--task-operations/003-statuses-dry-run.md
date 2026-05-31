---
title: "CU-023 -- Status Schema + Dry-Run — CRITICAL PATH"
description: "This scenario validates Status Schema + Dry-Run — CRITICAL PATH for `CU-023`. Objective: Verify `cupt statuses TASK_ID` lists statuses and `cupt done TASK_ID --dry-run` ."
---

# CU-023 -- Status Schema + Dry-Run — CRITICAL PATH

---

## 1. OVERVIEW

Validates that **Status Schema + Dry-Run — CRITICAL PATH** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt statuses TASK_ID` lists statuses and `cupt done TASK_ID --dry-run` shows resolved status without writing is required for correct agent operation. Failure here means task status changed in clickup (dry-run wrote) or no dry run message.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt statuses TASK_ID` lists statuses and `cupt done TASK_ID --dry-run` shows resolved status without writing
- **Real user request:** `Show status schema and preview task completion.`
- **Prompt:** `Show the status schema for task TASK_ID and preview completing it.`
- **Expected signals:** Step 1: status list printed with closed status marked. Step 2: 'DRY RUN' message with resolved status name; exit 0. Step 3: task status in UI unchanged.
- **Desired user-visible outcome:** Agent reports: status schema for the list shows 4 statuses; closed status is 'done'. Dry-run: would mark task as 'done'. No changes made.
- **Pass/fail:** PASS if dry-run message printed AND task status unchanged in ClickUp; FAIL if task status changed in ClickUp (dry-run wrote) OR no DRY RUN message

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt statuses TASK_ID`  # → list of statuses, closed status marked
2. `cupt done TASK_ID --dry-run`  # → DRY RUN message with resolved status
3. Verify task status in ClickUp UI is UNCHANGED

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-023 | Status Schema + Dry-Run — CRITICAL PATH | Verify `cupt statuses TASK_ID` lists statuses and `cupt | `Show the status schema for task TASK_ID and preview com` | Step 1: status list printed with closed status marked. Step 2: 'DRY RUN' message | PASS if dry-run message printed AND task status unchanged in Cl; FAIL if task status changed in ClickUp (dry-run wrote) OR no DR | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/04--cupt-task-completion/02-dry-run.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Completion
- Playbook ID: CU-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--task-operations/003-statuses-dry-run.md`
