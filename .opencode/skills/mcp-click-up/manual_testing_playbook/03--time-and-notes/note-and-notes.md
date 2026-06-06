---
title: "CU-027 -- Add Comment + List Comments"
description: "This scenario validates Add Comment + List Comments for `CU-027`. Objective: Verify `cupt note TASK_ID text` adds a comment and `cupt notes TASK_ID` lists it."
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

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-027 | Add Comment + List Comments | Verify `cupt note TASK_ID text` adds a comment and `cup | `Add a test comment to TASK_ID, then list all comments.` | Step 1: exit 0. Step 2: comment with text 'Playbook test comment — CU-027' appea | PASS if comment text appears in `cupt notes` output; FAIL if comment missing from `cupt notes` output OR exit non-ze | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/05--cupt-notes-comments/033-add-comment.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Notes
- Playbook ID: CU-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--time-and-notes/note-and-notes.md`
