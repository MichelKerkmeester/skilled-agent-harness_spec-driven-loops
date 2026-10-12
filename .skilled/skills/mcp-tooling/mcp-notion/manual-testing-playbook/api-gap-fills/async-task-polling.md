---
title: "GAP-004 -- Async-Task Polling"
description: "This scenario validates polling the direct async-tasks endpoint to completion for a long-running local-backend operation, or documents the named SKIP blocker when no task id is available."
stage: routing
version: 0.1.0.0
---

# GAP-004 -- Async-Task Polling

## 1. OVERVIEW

This scenario validates the direct Notion REST async-task poll that the local MCP backend cannot perform on its own: given a task id from a long-running operation (for example, a page/database duplication), poll `/v1/async_tasks/{task_id}` until it reports completion.

### Why This Matters

The local backend has no async-task tool at all, and none of its 24 tools trigger an async duplication or export. Without a documented trigger source, this gap is easy to silently skip forever; this scenario makes the blocker explicit instead.

---

## 2. SCENARIO CONTRACT

- Feature ID: `GAP-004`
- Feature Name: Async-Task Polling
- Scenario Objective: Poll a known async task id via direct REST until its status reports completion, honoring the rate-limit budget between polls.
- Exact Prompt: `"Trigger a large export or duplication that returns an async task id, then poll its status until it completes."`
- Exact Command Sequence: `1. obtain a task_id from an out-of-band trigger (e.g. the Notion UI's Duplicate action; no local MCP tool triggers one) -> 2. GET https://api.notion.com/v1/async_tasks/<task_id> (Bearer $notion_NOTION_TOKEN, Notion-Version: 2026-03-11) -> 3. repeat step 2, spaced under ~3 req/s, until the status reports completion`
- Expected Signals: each poll returns a status object; repeated polls show progress toward, then a terminal, completed status; no request exceeds the ~3 requests/second budget.
- Evidence: the task id source, each poll's response body, and the final completed-status response.
- Pass/Fail Criteria: PASS if repeated polling reaches a completed status with no error; SKIP if no task id is available -- no local MCP tool triggers an async operation, so this is the expected default outcome until an external trigger is exercised; FAIL if polling errors, or the status never resolves after a reasonable number of polls.
- Failure Triage: 1. Confirm a task id was actually obtained (record `SKIP` with that blocker if not). 2. Confirm `Notion-Version: 2026-03-11` (`VERIFY`) is set. 3. Confirm the polling interval stays under the rate-limit budget before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set, and a `task_id` is available from an out-of-band async trigger. None of the 24 local MCP tools trigger a duplication or export, so this scenario's default expected outcome is `SKIP` unless a task id has been obtained separately (for example, by exercising the Notion UI's "Duplicate" action and capturing the task id from its network call).

### Prompt

`"Trigger a large export or duplication that returns an async task id, then poll its status until it completes."`

### Commands

1. Obtain a `task_id` out of band (no local MCP tool produces one).
2. `GET https://api.notion.com/v1/async_tasks/<task_id>` (Bearer `$notion_NOTION_TOKEN`, `Notion-Version: 2026-03-11`).
3. Repeat step 2, spaced under ~3 requests/second, until the returned status reports completion.

### Expected

Each poll returns a status object; the sequence shows progress and eventually a terminal completed status, with no request exceeding the rate-limit budget.

### Evidence

Capture the task id's source, each poll response, and the final completed-status response.

### Pass / Fail

- **Pass:** repeated polling reaches a completed status with no error.
- **Skip:** no task id is available -- this is the expected default outcome, since no local MCP tool triggers an async operation.
- **Fail:** polling errors, or the status never resolves after a reasonable number of polls.

### Failure Triage

1. Confirm a task id was actually obtained; if not, record `SKIP` with that named blocker rather than fabricating one.
2. Confirm `Notion-Version: 2026-03-11` (`VERIFY`) is set on every poll.
3. Confirm the polling interval stays under the ~3 req/s budget before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-004 | Async-Task Polling | Verify polling a known task id to a completed status, spaced under the rate-limit budget | `"Trigger a large export or duplication that returns an async task id, then poll its status until it completes."` | 1. obtain task_id out of band -> 2. `GET /v1/async_tasks/<task_id>` -> 3. repeat until completed | Status object per poll; eventual completed status | Task id source, poll responses, final status | PASS if polling reaches completed; SKIP if no task id available (expected default); FAIL if polling errors or never resolves | Confirm task id source, confirm version header, confirm poll spacing |

Cleanup: none (read-only polling against an operation triggered outside this scenario's scope).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/api-gap-fills/async-task-polling.md`](../../feature-catalog/api-gap-fills/async-task-polling.md) | Catalog entry for this gap fill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Endpoint, VERIFY-flagged version pin, and the local-vs-remote backend distinction |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern for the polling loop |

---

## 5. SOURCE METADATA

- Group: API-gap fills
- Playbook ID: `GAP-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `api-gap-fills/async-task-polling.md`
