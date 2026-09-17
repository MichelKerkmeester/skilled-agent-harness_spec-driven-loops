---
title: "CU-020 -- Prefetch + Offline Mode"
description: "This scenario validates Prefetch + Offline Mode for `CU-020`. Objective: Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeed."
version: 1.0.0.5
---

# CU-020 -- Prefetch + Offline Mode

---

## 1. OVERVIEW

Validates that **Prefetch + Offline Mode** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeeds without network is required for correct agent operation. Failure here means prefetch fails or offline show makes api call or returns error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeeds without network
- **Real user request:** `Prefetch task cache and show a task in offline mode.`
- **Prompt:** `Prefetch tasks, then show a task without network access.`
- **Expected signals:** Step 1: prefetch exits 0. Step 2: task details returned without network call; exit 0.
- **Desired user-visible outcome:** Agent reports: prefetch complete. Task details retrieved from local cache.
- **Pass/fail:** PASS if prefetch exits 0 AND `--offline show` returns task details; FAIL if prefetch fails OR offline show makes API call OR returns error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt prefetch`  # → exit 0 with caching confirmation
2. `cupt show TASK_ID --offline`  # → task details from cache, no API call
3. Verify no network request was made (use `--debug` to check logs)

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-020 | Prefetch + Offline Mode | Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeeds without network | `Prefetch tasks, then show a task without network access.` | 1. `cupt prefetch`  # → exit 0 with caching confirmation 2. `cupt show TASK_ID --offline`  # → task details from cache, no API call 3. Verify no network request was made (use `--debug` to check logs) | Step 1: prefetch exits 0. Step 2: task details returned without network call; exit 0. | Terminal output of the command sequence above | PASS if prefetch exits 0 AND `--offline show` returns task details; FAIL if prefetch fails OR offline show makes API call OR returns error | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/cupt-workspace/prefetch.md`](../../feature-catalog/cupt-workspace/prefetch.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt-commands.md`](../../references/cupt-commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Offline
- Playbook ID: CU-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cupt-offline-and-cache/prefetch-offline.md`
