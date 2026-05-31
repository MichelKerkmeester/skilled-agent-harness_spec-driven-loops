---
title: "Stop Timer"
description: "cupt time stop — stops the current timer and logs elapsed time automatically."
---

# Stop Timer

---

## 1. OVERVIEW

Stops the currently running timer and logs the elapsed duration as a time entry on the task. The time entry is created in ClickUp with start and end timestamps.

---

## 2. CURRENT REALITY

Exit 0 with duration confirmation. Error if no timer is running. Follow with `cupt time status` to verify no orphaned timer remains.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/time_tracker.py` | CLI | Timer stop and time entry creation |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `06--cupt-time-tracking/02-stop-timer.md`
