---
title: "03-002: Manual Time Logging"
---

# 03-002: Manual Time Logging

**Goal:** Verify cupt time add logs time entries with correct duration formats.

## Test Procedure

```bash
TASK_ID="abc123"

# Log 1 hour 30 minutes
cupt time add $TASK_ID 1h30m

# Log 45 minutes
cupt time add $TASK_ID 45m

# Log 2 hours
cupt time add $TASK_ID 2h
```

## Valid Duration Formats

| Format | Meaning |
|--------|---------|
| `1h30m` | 1 hour 30 minutes |
| `45m` | 45 minutes |
| `2h` | 2 hours |
| `30m` | 30 minutes |

## Verification

Check the task in ClickUp UI under "Time Tracked" — entries should appear.

## Failure Diagnosis

- Invalid duration format → Use formats above; no spaces allowed
- Time not appearing → Check workspace time tracking settings in ClickUp
