---
title: "CU-027 -- Add Comment + List Comments"
description: "This scenario validates Add Comment + List Comments for `CU-027`. Objective: Verify `cupt note TASK_ID text` adds a comment and `cupt notes TASK_ID` lists it."
version: 1.0.0.6
---

# CU-027 -- Add Comment + List Comments

---

## 1. OVERVIEW

Validates that **Add Comment + List Comments** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt note TASK_ID text` adds a comment and `cupt notes TASK_ID` lists it is required for correct agent operation. Failure here means comment missing from `cupt notes` output or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt note TASK_ID text` adds a comment and `cupt notes TASK_ID` lists it
- **Real user request:** `Add a comment and list all comments on task TASK_ID.`
- **Prompt:** `Add a test comment to TASK_ID, then list all comments.`
- **Expected signals:** Step 1: exit 0. Step 2: comment with text 'Playbook test comment — CU-027' appears with author and timestamp.
- **Desired user-visible outcome:** Agent reports: comment added. Comment appears in notes list with correct author.
- **Pass/fail:** PASS if comment text appears in `cupt notes` output; FAIL if comment missing from `cupt notes` output OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt note TASK_ID 'Playbook test comment — CU-027'`  # → exit 0
2. `cupt notes TASK_ID`  # → list with comment text visible

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-027 | Add Comment + List Comments | Verify `cupt note TASK_ID text` adds a comment and `cupt notes TASK_ID` lists it | `Add a test comment to TASK_ID, then list all comments.` | 1. `cupt note TASK_ID 'Playbook test comment — CU-027'`  # → exit 0 2. `cupt notes TASK_ID`  # → list with comment text visible | Step 1: exit 0. Step 2: comment with text 'Playbook test comment — CU-027' appears with author and timestamp. | Terminal output of the command sequence above | PASS if comment text appears in `cupt notes` output; FAIL if comment missing from `cupt notes` output OR exit non-zero | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/cupt-notes-comments/add-comment.md`](../../feature-catalog/cupt-notes-comments/add-comment.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt-commands.md`](../../references/cupt-commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Notes
- Playbook ID: CU-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `time-and-notes/note-and-notes.md`
