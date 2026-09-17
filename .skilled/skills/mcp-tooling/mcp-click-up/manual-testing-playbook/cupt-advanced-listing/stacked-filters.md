---
title: "CU-016 -- Stacked Filters — AND logic for --tag"
description: "This scenario validates Stacked Filters — AND logic for --tag for `CU-016`. Objective: Verify stacking two --tag flags returns only tasks with BOTH tags."
version: 1.0.0.5
---

# CU-016 -- Stacked Filters — AND logic for --tag

---

## 1. OVERVIEW

Validates that **Stacked Filters — AND logic for --tag** behaves as defined in the feature catalog.

### Why This Matters

Verify stacking two --tag flags returns only tasks with BOTH tags is required for correct agent operation. Failure here means a returned task is missing one of the required tags.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify stacking two --tag flags returns only tasks with BOTH tags
- **Real user request:** `List tasks with both 'sprint' and 'backend' tags.`
- **Prompt:** `List tasks that have both 'sprint' and 'backend' tags.`
- **Expected signals:** All returned tasks have both 'sprint' and 'backend' in their tags; result may be [] if no tasks qualify; exit 0.
- **Desired user-visible outcome:** Agent reports: N tasks have both sprint and backend tags (or queue is empty).
- **Pass/fail:** PASS if all returned tasks have both tags AND exit 0; FAIL if a returned task is missing one of the required tags

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Create or find tasks in ClickUp with both tags.
1. `cupt list --tag sprint --tag backend --json`
2. `bash: echo $RESULT | jq '.[].tags[].name' | sort -u`  # → should include both 'sprint' and 'backend'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-016 | Stacked Filters — AND logic for --tag | Verify stacking two --tag flags returns only tasks with BOTH tags | `List tasks that have both 'sprint' and 'backend' tags.` | 1. `cupt list --tag sprint --tag backend --json` 2. `bash: echo $RESULT \| jq '.[].tags[].name' \| sort -u`  # → should include both 'sprint' and 'backend' | All returned tasks have both 'sprint' and 'backend' in their tags; result may be [] if no tasks qualify; exit 0. | Terminal output of the command sequence above | PASS if all returned tasks have both tags AND exit 0; FAIL if a returned task is missing one of the required tags | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/cupt-task-listing/stacked-filters.md`](../../feature-catalog/cupt-task-listing/stacked-filters.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt-commands.md`](../../references/cupt-commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cupt-advanced-listing/stacked-filters.md`
