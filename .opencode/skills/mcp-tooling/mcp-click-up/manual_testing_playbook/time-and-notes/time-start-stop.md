---
title: "CU-029 -- Timer Lifecycle — start, status, stop"
description: "This scenario validates Timer Lifecycle — start, status, stop for `CU-029`. Objective: Verify timer start/status/stop lifecycle: start exits 0, status shows running ti."
version: 1.0.0.6
---

# CU-029 -- Timer Lifecycle — start, status, stop

---

## 1. OVERVIEW

Validates that **Timer Lifecycle — start, status, stop** behaves as defined in the feature catalog.

### Why This Matters

Verify timer start/status/stop lifecycle: start exits 0, status shows running timer, stop exits 0 and clears timer is required for correct agent operation. Failure here means any step exits non-zero or final status still shows running timer.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify timer start/status/stop lifecycle: start exits 0, status shows running timer, stop exits 0 and clears timer
- **Real user request:** `Start a timer on task TASK_ID, check status, then stop it.`
- **Prompt:** `Start timer on TASK_ID, check timer status, then stop it.`
- **Expected signals:** Step 1: exit 0. Step 2: running timer shown. Step 3: exit 0, elapsed logged. Step 4: 'no timer' message.
- **Desired user-visible outcome:** Agent reports: timer started, ran for N seconds, stopped. No orphaned timer.
- **Pass/fail:** PASS if all 4 steps exit 0 AND final status shows no timer; FAIL if any step exits non-zero OR final status still shows running timer

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: `cupt time status`  # → must show 'no timer running'
1. `cupt time start TASK_ID`  # → exit 0
2. `cupt time status`  # → 'Timer running on: Task Name (TASK_ID), Elapsed: 0:00:XX'
3. `cupt time stop`  # → exit 0, logs elapsed time
4. `cupt time status`  # → 'No timer running'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-029 | Timer Lifecycle — start, status, stop | Verify timer start/status/stop lifecycle: start exits 0 | `Start timer on TASK_ID, check timer status, then stop i` | Step 1: exit 0. Step 2: running timer shown. Step 3: exit 0, elapsed logged. Ste | PASS if all 4 steps exit 0 AND final status shows no timer; FAIL if any step exits non-zero OR final status still shows run | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/cupt-time-tracking/start-timer.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Time Tracking
- Playbook ID: CU-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `time-and-notes/time-start-stop.md`
