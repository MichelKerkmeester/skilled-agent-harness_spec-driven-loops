---
title: "CU-013 -- Exclude by Tag — --no-tag"
description: "This scenario validates Exclude by Tag — --no-tag for `CU-013`. Objective: Verify `cupt list --no-tag <name> --json` excludes tasks with that tag."
version: 1.0.0.5
---

# CU-013 -- Exclude by Tag — --no-tag

---

## 1. OVERVIEW

Validates that **Exclude by Tag — --no-tag** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt list --no-tag <name> --json` excludes tasks with that tag is required for correct agent operation. Failure here means excluded tag appears in any returned task or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt list --no-tag <name> --json` excludes tasks with that tag
- **Real user request:** `List tasks that do not have the 'processed' tag.`
- **Prompt:** `List tasks that do NOT have the 'processed' tag.`
- **Expected signals:** JSON array; no task in result has 'processed' in its tags array; exit 0.
- **Desired user-visible outcome:** Agent reports: N tasks returned, none carry the 'processed' tag.
- **Pass/fail:** PASS if no task in result has the excluded tag AND exit 0; FAIL if excluded tag appears in any returned task OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. First tag some tasks with 'processed' in ClickUp UI
2. `cupt list --no-tag processed --json`  # → tasks without 'processed' tag
3. `bash: echo $RESULT | jq '[.[].tags[].name] | contains(["processed"])' # → false for each task`

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-013 | Exclude by Tag — --no-tag | Verify `cupt list --no-tag <name> --json` excludes tasks with that tag | `List tasks that do NOT have the 'processed' tag.` | 1. First tag some tasks with 'processed' in ClickUp UI 2. `cupt list --no-tag processed --json`  # → tasks without 'processed' tag 3. `bash: echo $RESULT \| jq '[.[].tags[].name] \| contains(["processed"])' # → false for each task` | JSON array; no task in result has 'processed' in its tags array; exit 0. | Terminal output of the command sequence above | PASS if no task in result has the excluded tag AND exit 0; FAIL if excluded tag appears in any returned task OR exit non-zero | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/02--cupt-task-listing/exclude-tag.md`](../../feature_catalog/02--cupt-task-listing/exclude-tag.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Listing
- Playbook ID: CU-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cupt-advanced-listing/exclude-tag.md`
