---
title: "01-002: Authentication Flow"
---

# 01-002: Authentication Flow

**Goal:** Verify both authentication methods (Personal API Token and OAuth) work correctly.

## Test A: Personal API Token

```bash
cupt config --api-token pk_TEST_TOKEN_HERE
cupt status
```

**Expected:** Workspace name displayed, no auth error.

## Test B: OAuth Flow

```bash
cupt logout
cupt auth   # Follow prompts: Client ID, Client Secret, browser redirect
cupt status
```

**Expected:** Workspace name displayed after OAuth redirect.

## Test C: Logout

```bash
cupt logout
cupt status   # Should fail with auth error
```

**Expected:** Auth error message, prompting to re-authenticate.

## Failure Diagnosis

- 401 error → Token invalid or revoked; generate new token at clickup.com/settings/apps
- OAuth redirect fails → Ensure port 4321 is available; check firewall settings
- `AuthError: No credentials` → Run `cupt auth` or `cupt config --api-token`
