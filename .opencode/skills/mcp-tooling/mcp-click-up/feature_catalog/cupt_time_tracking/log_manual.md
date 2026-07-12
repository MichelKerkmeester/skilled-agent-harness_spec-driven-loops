---
title: "Log Time Manually"
description: "cupt time add <id> <duration> — log time retroactively without a timer."
trigger_phrases:
  - "log time manually"
  - "cupt time add"
  - "manual time entry"
  - "retroactive time log"
  - "log duration without timer"
version: 1.0.0.3
---

# Log Time Manually

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a time entry for the specified task without requiring a running timer. Useful for logging time after the fact. Duration formats: `1h30m`, `45m`, `2h`, `30m`.

---

## 2. HOW IT WORKS

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
- Feature file path: `cupt-time-tracking/log-manual.md`
Related references:
- [stop-timer.md](stop-timer.md) — Stop Timer
- [timer-status.md](timer-status.md) — Timer Status
