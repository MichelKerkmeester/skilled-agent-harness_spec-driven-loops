---
title: "CU-006 -- Config Show"
description: "This scenario validates Config Show for `CU-006`. It focuses on Verify `cupt config --show` prints workspace ID, default list ID, and masked tok."
---

# CU-006 -- Config Show

---

## 1. OVERVIEW

Validates that configuration state is persisted and retrievable. Used to debug misconfigured defaults.

### Why This Matters

Agents need to verify configuration before starting workflows. A missing workspace ID or incorrect list default causes errors in downstream commands.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-006` and confirm the expected signals without contradictory evidence.

- **Objective:** Verify `cupt config --show` prints workspace ID, default list ID, and masked token
- **Real user request:** `Show the current cupt configuration.`
- **Prompt:** `Show the current cupt configuration including workspace ID and default list.`
- **Expected execution process:** 1. Run `cupt config --workspace-id TEST_ID`. 2. Run `cupt config --show`. 3. Verify workspace ID appears in output.
- **Expected signals:** Workspace ID shown matching set value; token shown as masked (e.g. pk_xxxx****); exit 0.
- **Desired user-visible outcome:** Agent reports: workspace ID is 1234567, default list ID is 9876543, token is masked.
- **Pass/fail:** PASS if workspace ID appears in output and matches the value set; FAIL if workspace ID missing from output OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt config --workspace-id 1234567`  # → exit 0
2. `cupt config --show`
   # → Workspace: 1234567
   # → Token: pk_xxxx****

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-006 | Config Show | Verify `cupt config --show` prints workspace ID, default lis | `Show the current cupt configuration including workspace ID a` | 1. `cupt config --workspace-id 1234567`  # → exit 0 | Workspace ID shown matching set value; token shown as masked (e.g. pk_xxxx****); | Terminal output + ClickUp UI | PASS if workspace ID appears in output and matches the value set; FAIL if workspace ID missing from output OR exit non-zero | Check prerequisites and auth status |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/01--cupt-authentication/005-show-config.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/mcp_tools.md` | MCP tool reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Lifecycle
- Playbook ID: CU-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cupt-lifecycle/004-config-show.md`
