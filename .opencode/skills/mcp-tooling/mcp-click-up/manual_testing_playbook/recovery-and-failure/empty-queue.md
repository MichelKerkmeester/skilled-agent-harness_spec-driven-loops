---
title: "FAIL-002 -- Empty Queue Is Valid"
description: "This scenario validates Empty Queue Is Valid for `FAIL-002`. Objective: Verify `cupt list --tag nonexistent_xyz --json` returns `[]` with exit 0 — not a."
version: 1.0.0.6
---

# FAIL-002 -- Empty Queue Is Valid

---

## 1. OVERVIEW

Validates that **Empty Queue Is Valid** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt list --tag nonexistent_xyz --json` returns `[]` with exit 0 — not an error is required for correct agent operation. Failure here means non-zero exit code or non-json output.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt list --tag nonexistent_xyz --json` returns `[]` with exit 0 — not an error
- **Real user request:** `Fetch tasks with a tag that has no tasks.`
- **Prompt:** `Fetch tasks with tag 'nonexistent_xyz_789' and confirm empty result is valid.`
- **Expected signals:** Step 1: `[]` printed; exit 0. Step 3: `jq length` returns 0.
- **Desired user-visible outcome:** Agent reports: queue empty (0 tasks). This is valid — no fabrication of tasks.
- **Pass/fail:** PASS if output is `[]` AND exit code is 0; FAIL if non-zero exit code OR non-JSON output

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt list --tag nonexistent_xyz_789 --json`  # → []
2. `bash: echo $EXIT_CODE`  # → 0
3. `bash: echo $RESULT | jq length`  # → 0

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| FAIL-002 | Empty Queue Is Valid | Verify `cupt list --tag nonexistent_xyz --json` returns | `Fetch tasks with tag 'nonexistent_xyz_789' and confirm ` | Step 1: `[]` printed; exit 0. Step 3: `jq length` returns 0. | PASS if output is `[]` AND exit code is 0; FAIL if non-zero exit code OR non-JSON output | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/cupt-task-listing/list-assigned.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: Recovery
- Playbook ID: FAIL-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `recovery-and-failure/empty-queue.md`
