---
title: "CU-014 -- Cap Results — -n N"
description: "This scenario validates Cap Results — -n N for `CU-014`. Objective: Verify `cupt list -n 3 --json` returns at most 3 tasks regardless of total queue."
---

# CU-014 -- Cap Results — -n N

---

## 1. OVERVIEW

Validates that **Cap Results — -n N** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt list -n 3 --json` returns at most 3 tasks regardless of total queue size is required for correct agent operation. Failure here means `jq length` returns > 3 or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt list -n 3 --json` returns at most 3 tasks regardless of total queue size
- **Real user request:** `List the first 3 tasks only.`
- **Prompt:** `Fetch at most 3 tasks in JSON format.`
- **Expected signals:** Step 2: JSON array returned. Step 3: `jq length` returns ≤ 3; exit 0.
- **Desired user-visible outcome:** Agent reports: 3 tasks returned (capped from N total).
- **Pass/fail:** PASS if `jq length` returns ≤ 3 AND exit 0; FAIL if `jq length` returns > 3 OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: workspace must have more than 3 tasks.
1. `cupt list --json`  # → total count > 3
2. `cupt list -n 3 --json`  # → array with ≤ 3 elements
3. `bash: echo $RESULT | jq length`  # → 3

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-014 | Cap Results — -n N | Verify `cupt list -n 3 --json` returns at most 3 tasks  | `Fetch at most 3 tasks in JSON format.` | Step 2: JSON array returned. Step 3: `jq length` returns ≤ 3; exit 0. | PASS if `jq length` returns ≤ 3 AND exit 0; FAIL if `jq length` returns > 3 OR exit non-zero | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/02--cupt-task-listing/018-cap-results.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cupt-advanced-listing/018-cap-results.md`
