---
title: "01-004: Configuration Display"
---

# 01-004: Configuration Display

**Goal:** Verify cupt config is stored correctly and accessible.

## Test Procedure

```bash
cupt config --show
```

## Expected Output

Config shows workspace ID, default list (if set), and confirms token is stored (not printed in full).

## Test: Set and Verify Default Config

```bash
# Set defaults (use your actual IDs)
cupt config --workspace-id 1234567
cupt config --default-list 9876543

# Verify
cupt config --show
```

## Failure Diagnosis

- Empty config → Run `cupt auth` first
- Workspace ID wrong → Get correct ID from `cupt status`
