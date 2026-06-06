---
title: "MCP-L004 -- Create Webhook via MCP"
description: "This scenario validates Create Webhook via MCP for `MCP-L004`. Objective: Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id."
---

# MCP-L004 -- Create Webhook via MCP

---

## 1. OVERVIEW

Validates that **Create Webhook via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id is required for correct agent operation. Failure here means `id` missing or 403 insufficient permissions.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id
- **Real user request:** `Create a webhook for task events.`
- **Prompt:** `Create a webhook for taskCreated events pointing to https://example.com/webhook.`
- **Expected signals:** MCP returns webhook object with `id`; exit 0.
- **Desired user-visible outcome:** Agent reports: webhook created with ID WEBHOOK_ID for taskCreated events.
- **Pass/fail:** PASS if response includes `id`; FAIL if `id` missing OR 403 insufficient permissions

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_manage_webhooks({action: 'create', team_id: 'WORKSPACE_ID', endpoint: 'https://example.com/webhook', events: ['taskCreated']})`
2. `bash: jq .id <<< "$RESULT"`  # → webhook_id

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-L004 | Create Webhook via MCP | Verify `clickup_manage_webhooks` creates a webhook and  | `Create a webhook for taskCreated events pointing to htt` | MCP returns webhook object with `id`; exit 0. | PASS if response includes `id`; FAIL if `id` missing OR 403 insufficient permissions | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/13--mcp-low-priority/manage-webhooks.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Structure
- Playbook ID: MCP-L004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--mcp-bulk-and-structure/create-webhook.md`
