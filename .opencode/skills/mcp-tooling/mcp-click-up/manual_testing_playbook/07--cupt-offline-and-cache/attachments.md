---
title: "CU-033 -- List Attachments"
description: "This scenario validates List Attachments for `CU-033`. Objective: Verify `cupt attach list TASK_ID` returns attachment metadata or 'no attachments."
version: 1.0.0.5
---

# CU-033 -- List Attachments

---

## 1. OVERVIEW

Validates that **List Attachments** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt attach list TASK_ID` returns attachment metadata or 'no attachments' is required for correct agent operation. Failure here means exit non-zero even when task exists.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt attach list TASK_ID` returns attachment metadata or 'no attachments'
- **Real user request:** `List attachments on task TASK_ID.`
- **Prompt:** `List all attachments on task TASK_ID.`
- **Expected signals:** File list with names/sizes/dates OR 'no attachments' message; exit 0 either way.
- **Desired user-visible outcome:** Agent reports: N attachments listed (or no attachments found).
- **Pass/fail:** PASS if exit 0 regardless of attachment count; FAIL if exit non-zero even when task exists

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt attach list TASK_ID`  # → attachment list or 'no attachments'
2. Verify exit 0 regardless of whether attachments exist

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-033 | List Attachments | Verify `cupt attach list TASK_ID` returns attachment me | `List all attachments on task TASK_ID.` | File list with names/sizes/dates OR 'no attachments' message; exit 0 either way. | PASS if exit 0 regardless of attachment count; FAIL if exit non-zero even when task exists | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/08--cupt-attachments/list-attachments.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Attachments
- Playbook ID: CU-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--cupt-offline-and-cache/attachments.md`
