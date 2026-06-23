---
title: "CU-007 -- Auth Status Check"
description: "This scenario validates Auth Status Check for `CU-007`. It focuses on Verify `cupt status` exits 0, shows workspace name, user email, and workspace ID."
version: 1.0.0.5
---

# CU-007 -- Auth Status Check

---

## 1. OVERVIEW

Validates the auth status and workspace connectivity. This is the preflight check run before any agent workflow.

### Why This Matters

If `cupt status` fails, the agent cannot proceed with any ClickUp operation. This is the second critical-path check after version verification.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-007` and confirm the expected signals without contradictory evidence.

- **Objective:** Verify `cupt status` exits 0, shows workspace name, user email, and workspace ID
- **Real user request:** `Check cupt authentication status and workspace details.`
- **Prompt:** `Check cupt authentication status and report workspace name and ID.`
- **Expected execution process:** 1. Run `cupt status`. 2. Verify workspace name is non-empty. 3. Verify workspace ID is a numeric string.
- **Expected signals:** Workspace name displayed; user email displayed; workspace ID (numeric) displayed; exit 0.
- **Desired user-visible outcome:** Agent reports: authenticated as user@email.com in workspace 'My Team' (ID: 1234567).
- **Pass/fail:** PASS if workspace name, user email, and numeric workspace ID all displayed; FAIL if AuthError displayed OR workspace name is empty OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt status`
   # → Authenticated: ✓
   # → Workspace: My Team (ID: 1234567)
   # → User: user@email.com

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-007 | Auth Status Check | Verify `cupt status` exits 0, shows workspace name, user ema | `Check cupt authentication status and report workspace name a` | 1. `cupt status` | Workspace name displayed; user email displayed; workspace ID (numeric) displayed | Terminal output + ClickUp UI | PASS if workspace name, user email, and numeric workspace ID all dis; FAIL if AuthError displayed OR workspace name is empty OR exit non-z | Check prerequisites and auth status |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/01--cupt-authentication/auth-status.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/mcp_tools.md` | MCP tool reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Lifecycle
- Playbook ID: CU-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cupt-lifecycle/status-json.md`
