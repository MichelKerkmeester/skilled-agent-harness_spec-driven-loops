---
title: "Timer Status"
description: "cupt time status — current timer state: running task + elapsed, or 'no timer running'."
---

# Timer Status

---

## 1. OVERVIEW

Returns the current timer state: if a timer is running, shows the task name, task ID, and elapsed duration. If no timer is running, returns a clear 'no timer running' message.

---

## 2. CURRENT REALITY

Use as cleanup verification after `cupt time stop`. Pattern: always check `cupt time status` at the end of a work session to confirm no orphaned timer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/time_tracker.py` | CLI | Timer state query |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `06--cupt-time-tracking/04-timer-status.md`
