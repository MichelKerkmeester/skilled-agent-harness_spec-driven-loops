---
title: "Async-Task Polling"
description: "Direct Notion REST recipe (GAP-004) for polling the status of a long-running operation such as a large export or duplication -- a capability the local MCP backend does not expose."
trigger_phrases:
  - "notion async task poll"
  - "GAP-004"
  - "poll a notion async task"
version: 0.1.0.0
---

# Async-Task Polling (direct API -- GAP-004)

## 1. OVERVIEW

Some Notion operations -- notably page or database duplication -- complete asynchronously and return a task id rather than a finished result. The **local** MCP server (`@notionhq/notion-mcp-server`) has no tool to poll that id; the **remote** Notion MCP backend (`https://mcp.notion.com/mcp`) exposes async-task tools natively, so this gap only exists on the headless local stdio backend.

Invocation is a single direct HTTPS GET call (`fetch()` inside `call_tool_chain`, or `curl` via Bash). The dedicated reference page for this endpoint returned 404 on the confirmation date, so both the exact `Notion-Version` and the full status/result field set are `VERIFY` -- see `references/api-gap-tools.md` §6.

---

## 2. HOW IT WORKS

Prerequisites: `notion_NOTION_TOKEN` set in the environment, and a `task_id` already produced by a triggering long-running operation. None of the 24 local MCP tools trigger an async duplication or export; a task id must come from elsewhere (for example, the Notion UI's own "Duplicate" action, whose network call returns one) until a local trigger is confirmed.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/async_tasks/{task_id}` | GET | Retrieve the status and result of an async task |

The call carries `Authorization: Bearer $notion_NOTION_TOKEN` and `Notion-Version: 2026-03-11` (`VERIFY` -- attributed to the current API surface via the research index, not a dedicated reference page). Key input: `task_id`.

Behavior notes: poll until the returned status reports completion; space repeated polls to stay under the ~3 requests/second budget (§8 of `api-gap-tools.md`). On the **remote** MCP backend, prefer its native async-task tool over this direct call -- the direct call is specifically the local-backend workaround.

Fallback: if no task id is available (no local trigger, and the UI action was not exercised out of band), the gap cannot be demonstrated end-to-end and the scenario is a documented `SKIP`, not a fabricated pass.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes the 5 API-gap capabilities to direct REST calls instead of an MCP tool. |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Shared | Confirms the endpoint via the API index, flags the version pin and status schema `VERIFY`, and gives a runnable curl example. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/api-gap-fills/async-task-polling.md`](../../manual-testing-playbook/api-gap-fills/async-task-polling.md) | Manual playbook | Polls a task id to completion, or documents the named SKIP blocker when no task id is available. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Illustrates the shared Code Mode `call_tool_chain` pattern the polling loop reuses. |

---

## 4. SOURCE METADATA

- Group: API-gap fills
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `api-gap-fills/async-task-polling.md`

Related references:
- [`page-property-items.md`](page-property-items.md) -- another direct-API gap fill.
- [`daily-notes.md`](daily-notes.md) -- a convention-based gap fill using only existing MCP tools.
