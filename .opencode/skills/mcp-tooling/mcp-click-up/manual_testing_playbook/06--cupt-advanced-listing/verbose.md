---
title: "CU-015 -- Verbose Output — --verbose"
description: "This scenario validates Verbose Output — --verbose for `CU-015`. Objective: Verify `cupt list --verbose` adds assignee and time columns to the output."
version: 1.0.0.5
---

# CU-015 -- Verbose Output — --verbose

---

## 1. OVERVIEW

Validates that **Verbose Output — --verbose** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt list --verbose` adds assignee and time columns to the output is required for correct agent operation. Failure here means output identical to `cupt list` without verbose columns or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt list --verbose` adds assignee and time columns to the output
- **Real user request:** `List tasks with verbose output.`
- **Prompt:** `List tasks with verbose output showing assignee and time tracked.`
- **Expected signals:** Output includes column headers 'Assignee' and 'Tracked' (or equivalent) in the table; exit 0.
- **Desired user-visible outcome:** Agent reports: task list with assignee and time tracked columns visible.
- **Pass/fail:** PASS if output includes assignee and time column headers; FAIL if output identical to `cupt list` without verbose columns OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt list --verbose`  # → includes Assignee and Tracked columns

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-015 | Verbose Output — --verbose | Verify `cupt list --verbose` adds assignee and time col | `List tasks with verbose output showing assignee and tim` | Output includes column headers 'Assignee' and 'Tracked' (or equivalent) in the t | PASS if output includes assignee and time column headers; FAIL if output identical to `cupt list` without verbose columns | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/02--cupt-task-listing/verbose.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cupt-advanced-listing/verbose.md`
