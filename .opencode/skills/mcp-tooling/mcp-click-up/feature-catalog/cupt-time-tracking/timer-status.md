---
title: "Timer Status"
description: "cupt time status — current timer state: task ID + start time, or 'no timer running'."
trigger_phrases:
  - "timer status"
  - "cupt time status"
  - "check running timer"
  - "current timer state"
  - "orphaned timer check"
version: 1.0.0.3
---

# Timer Status

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the current timer state: if a timer is running, shows the task ID and the start timestamp — not the task name, and not a computed elapsed duration. If no timer is running, prints "No timer is currently running".

---

## 2. HOW IT WORKS

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
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Time Tracking
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-time-tracking/timer-status.md`
Related references:
- [log-manual.md](../../feature-catalog/cupt-time-tracking/log-manual.md) — Log Time Manually
