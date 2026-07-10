---
title: "CU-002 -- cupt Authentication"
description: "This scenario validates cupt Authentication for `CU-002`. It focuses on Verify `cupt config --api-token pk_xxx` stores credentials and `cupt status` con."
version: 1.0.0.5
---

# CU-002 -- cupt Authentication

---

## 1. OVERVIEW

Tests both authentication paths: Personal API Token (direct token) and the interactive wizard. Authentication is required for all subsequent operations.

### Why This Matters

Authentication is a hard dependency. A broken auth flow means the entire skill is non-functional. This scenario verifies that tokens are stored, retrieved correctly, and accepted by the ClickUp API.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-002` and confirm the expected signals without contradictory evidence.

- **Objective:** Verify `cupt config --api-token pk_xxx` stores credentials and `cupt status` confirms the workspace
- **Real user request:** `Authenticate cupt with a Personal API Token.`
- **Prompt:** `Authenticate cupt with a Personal API Token and verify workspace access.`
- **Expected execution process:** 1. Run `cupt config --api-token pk_YOUR_TEST_TOKEN`. 2. Run `cupt status`. 3. Confirm workspace name in output.
- **Expected signals:** Step 1: exits 0 with confirmation. Step 2: workspace name + user email displayed; exit 0.
- **Desired user-visible outcome:** Agent reports: authenticated as user@email.com in workspace 'My Team' (ID: 123456).
- **Pass/fail:** PASS if `cupt status` shows workspace name without error; FAIL if `cupt status` returns 401 or AuthError

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt config --api-token pk_TEST_TOKEN`  # → exit 0
2. `cupt status`  # → Workspace: My Team (ID: 123456)
3. Confirm user email displayed

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-002 | cupt Authentication | Verify `cupt config --api-token pk_xxx` stores credentials and `cupt status` confirms the workspace | `Authenticate cupt with a Personal API Token and verify workspace access.` | 1. `cupt config --api-token pk_TEST_TOKEN`  # → exit 0 2. `cupt status`  # → Workspace: My Team (ID: 123456) 3. Confirm user email displayed | Step 1: exits 0 with confirmation. Step 2: workspace name + user email displayed; exit 0. | Terminal output of the command sequence above | PASS if `cupt status` shows workspace name without error; FAIL if `cupt status` returns 401 or AuthError | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/01--cupt-authentication/interactive-auth.md`](../../feature_catalog/01--cupt-authentication/interactive-auth.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/mcp_tools.md`](../../references/mcp_tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Lifecycle
- Playbook ID: CU-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cupt-lifecycle/session-auth.md`
