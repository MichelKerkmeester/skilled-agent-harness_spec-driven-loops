---
title: "CU-025 -- Complete Task with Note"
description: "This scenario validates Complete Task with Note for `CU-025`. Objective: Verify `cupt done TASK_ID --note text` marks task complete AND adds comment in o."
---

# CU-025 -- Complete Task with Note

---

## 1. OVERVIEW

Validates that **Complete Task with Note** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt done TASK_ID --note text` marks task complete AND adds comment in one call is required for correct agent operation. Failure here means task not closed or note missing from comments.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt done TASK_ID --note text` marks task complete AND adds comment in one call
- **Real user request:** `Mark test task complete with a note.`
- **Prompt:** `Complete task TASK_ID and add the note 'Processed by agent test'.`
- **Expected signals:** Step 3: confirmation message and exit 0. Step 4: note with 'Processed by agent test' appears in output.
- **Desired user-visible outcome:** Agent reports: task closed as 'done'. Comment 'Processed by agent test' added.
- **Pass/fail:** PASS if task status is closed in ClickUp AND note appears in task comments; FAIL if task not closed OR note missing from comments

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Use a throwaway test task only.
1. `cupt statuses TASK_ID`  # → discover closed status
2. `cupt done TASK_ID --dry-run`  # → verify dry-run works
3. `cupt done TASK_ID --note 'Processed by agent test'`  # → mark complete
4. `cupt notes TASK_ID`  # → verify note appears

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-025 | Complete Task with Note | Verify `cupt done TASK_ID --note text` marks task compl | `Complete task TASK_ID and add the note 'Processed by ag` | Step 3: confirmation message and exit 0. Step 4: note with 'Processed by agent t | PASS if task status is closed in ClickUp AND note appears in ta; FAIL if task not closed OR note missing from comments | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/04--cupt-task-completion/031-complete-with-note.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Completion
- Playbook ID: CU-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--task-operations/008-done-with-note.md`
