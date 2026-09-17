---
title: "Stop Timer"
description: "cupt time stop — stops the current timer and logs elapsed time automatically."
trigger_phrases:
  - "stop timer"
  - "cupt time stop"
  - "end time tracking"
  - "log elapsed time"
  - "stop running timer"
version: 1.0.0.3
---

# Stop Timer

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Stops the currently running timer and logs the elapsed duration as a time entry on the task. The time entry is created in ClickUp with start and end timestamps.

---

## 2. HOW IT WORKS

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
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-time-tracking/stop-timer.md`
Related references:
- [start-timer.md](../../feature-catalog/cupt-time-tracking/start-timer.md) — Start Timer
- [log-manual.md](../../feature-catalog/cupt-time-tracking/log-manual.md) — Log Time Manually
