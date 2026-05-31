---
title: "05-001: Missing Authentication Recovery"
---

# 05-001: Missing Authentication Recovery

**Goal:** Verify graceful handling of missing or expired credentials.

## Test Procedure

```bash
# Simulate missing auth
cupt logout

# Attempt commands that require auth
cupt status
cupt list --today --json
```

## Expected Output

```
Error: AuthError: No credentials found.
Run 'cupt auth' or 'cupt config --api-token <token>' to authenticate.
```

## Recovery

```bash
cupt auth
# OR:
cupt config --api-token pk_YOUR_TOKEN

# Verify recovery
cupt status
```

## Expected Recovery Output

Workspace name displayed, no error.
