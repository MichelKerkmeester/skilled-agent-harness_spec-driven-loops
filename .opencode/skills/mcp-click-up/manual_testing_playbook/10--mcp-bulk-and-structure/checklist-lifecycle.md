---
title: "MCP-L009 -- Checklist Lifecycle — create, add item, check off, delete"
description: "This scenario validates Checklist Lifecycle — create, add item, check off, delete for `MCP-L009`. Objective: Verify full checklist CRUD: create checklist, add item, resolve item, delete che."
---

# MCP-L009 -- Checklist Lifecycle — create, add item, check off, delete

---

## 1. OVERVIEW

Validates that **Checklist Lifecycle — create, add item, check off, delete** behaves as defined in the feature catalog.

### Why This Matters

Verify full checklist CRUD: create checklist, add item, resolve item, delete checklist is required for correct agent operation. Failure here means any operation returns error or checklist persists after delete.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify full checklist CRUD: create checklist, add item, resolve item, delete checklist
- **Real user request:** `Full checklist lifecycle on task TASK_ID.`
- **Prompt:** `Create a checklist on TASK_ID, add item, check it off, then delete the checklist.`
- **Expected signals:** Each step returns success; step 5 confirms checklist deleted from ClickUp; all exit 0.
- **Desired user-visible outcome:** Agent reports: checklist created, item added, item resolved, checklist deleted.
- **Pass/fail:** PASS if all 4 operations succeed AND checklist absent from ClickUp after delete; FAIL if any operation returns error OR checklist persists after delete

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_create_checklist({task_id: 'TASK_ID', name: 'Test Checklist'})`  # → checklist_id
2. Code Mode: `clickup.clickup_create_checklist_item({checklist_id: 'CL_ID', name: 'Test item'})`  # → item_id
3. Code Mode: `clickup.clickup_update_checklist_item({checklist_id: 'CL_ID', checklist_item_id: 'ITEM_ID', resolved: true})`
4. Code Mode: `clickup.clickup_delete_checklist({checklist_id: 'CL_ID'})`
5. Verify checklist gone from task in ClickUp UI

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-L009 | Checklist Lifecycle — create, add item, check off, delete | Verify full checklist CRUD: create checklist, add item, | `Create a checklist on TASK_ID, add item, check it off, ` | Each step returns success; step 5 confirms checklist deleted from ClickUp; all e | PASS if all 4 operations succeed AND checklist absent from Clic; FAIL if any operation returns error OR checklist persists after | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/13--mcp-low-priority/086-create-checklist.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Checklists
- Playbook ID: MCP-L009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--mcp-bulk-and-structure/checklist-lifecycle.md`
