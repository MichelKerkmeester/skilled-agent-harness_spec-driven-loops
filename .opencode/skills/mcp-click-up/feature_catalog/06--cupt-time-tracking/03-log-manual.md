---
title: "Log Time Manually"
description: "cupt time add <id> <duration> — log time retroactively without a timer."
---

# Log Time Manually

---

## 1. OVERVIEW

Creates a time entry for the specified task without requiring a running timer. Useful for logging time after the fact. Duration formats: `1h30m`, `45m`, `2h`, `30m`.

---

## 2. CURRENT REALITY

Duration is parsed and converted to milliseconds for the ClickUp API. The time entry is created with the current timestamp as the end time. No start/stop timestamps are recorded — just the duration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/time_tracker.py` | CLI | Manual time entry creation |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `06--cupt-time-tracking/03-log-manual.md`
