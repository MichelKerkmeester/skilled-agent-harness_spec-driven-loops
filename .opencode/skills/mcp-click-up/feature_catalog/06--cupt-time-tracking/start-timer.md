---
title: "Start Timer"
description: "cupt time start <id> — starts a running timer on the task."
trigger_phrases:
  - "start timer"
  - "cupt time start"
  - "begin time tracking"
  - "start running timer"
  - "track time on task"
---

# Start Timer

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Starts a timer on the specified task. Only one timer can run at a time — starting a new timer while one is active fails with an error. The timer begins at the moment the command is called.

---

## 2. HOW IT WORKS

Exit 0 and confirmation message on success. Error if a timer is already running. Check current state with `cupt time status` before starting.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/time_tracker.py` | CLI | Timer start via ClickUp time tracking API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `06--cupt-time-tracking/start-timer.md`
Related references:
- [stop-timer.md](stop-timer.md) — Stop Timer
