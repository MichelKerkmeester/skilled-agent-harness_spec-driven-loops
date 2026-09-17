---
title: "MCP-L004 -- Create Webhook via MCP"
description: "This scenario validates Create Webhook via MCP for `MCP-L004`. Objective: Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id."
version: 1.0.0.5
---

# MCP-L004 -- Create Webhook via MCP

---

## 1. OVERVIEW

Validates that **Create Webhook via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id is required for correct agent operation. Failure here means `id` missing or 403 insufficient permissions.

> **Capability status: SKIP.** Webhook tools were confirmed absent from the last live `list_tools()` inventory (`references/mcp-tools.md`). Do not execute this scenario against the current server; it will fail with a tool-not-found error, not the pass/fail signals below. Re-enable only after a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id
- **Real user request:** `Create a webhook for task events.`
- **Prompt:** `Create a webhook for taskCreated events pointing to https://example.com/webhook.`
- **Expected signals:** MCP returns webhook object with `id`; exit 0.
- **Desired user-visible outcome:** Agent reports: webhook created with ID WEBHOOK_ID for taskCreated events.
- **Pass/fail:** SKIP — webhooks confirmed absent from the live server (see capability status above). If a future capture proves otherwise: PASS if response includes `id`; FAIL if `id` missing OR 403 insufficient permissions

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup_official.clickup_official_clickup_manage_webhooks({action: 'create', team_id: 'WORKSPACE_ID', endpoint: 'https://example.com/webhook', events: ['taskCreated']})`
2. `bash: jq .id <<< "$RESULT"`  # → webhook_id

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-L004 | Create Webhook via MCP | Verify `clickup_manage_webhooks` creates a webhook and returns a webhook_id | `Create a webhook for taskCreated events pointing to https://example.com/webhook.` | NOT EXECUTABLE — see capability status above | MCP returns webhook object with `id`; exit 0. | N/A — tool confirmed absent | SKIP — webhooks confirmed absent from the live server; do not attempt | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/manage-webhooks.md`](../../feature-catalog/mcp-low-priority/manage-webhooks.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt-commands.md`](../../references/cupt-commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Structure
- Playbook ID: MCP-L004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-bulk-and-structure/create-webhook.md`
