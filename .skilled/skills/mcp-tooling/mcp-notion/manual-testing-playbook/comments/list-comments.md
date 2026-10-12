---
title: "CMT-002 -- List comments"
description: "This scenario validates a read-only comment listing through the confirmed notion_list-comments tool."
stage: routing
version: 0.1.0.0
---

# CMT-002 -- List comments

## 1. OVERVIEW

This scenario validates the confirmed `notion_list-comments` tool by listing the unresolved comments on a known, already-shared page.

### Why This Matters

`list-comments` is read-only, so it runs directly against any page already shared with the integration — no scratch content is required. An empty `results` array is a valid, expected outcome once a page has no unresolved threads and must never be treated as a failure or padded with fabricated rows.

---

## 2. SCENARIO CONTRACT

- Feature ID: `CMT-002`
- Feature Name: List comments
- Scenario Objective: List the unresolved comments on a known shared page via `list-comments` and confirm the response shape, whether or not any comments exist.
- Exact Prompt: `Show me the comments on this Notion page.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_list-comments") -> 3. Code Mode: call_tool_chain({ code: "return await notion[\"notion_list-comments\"] ({ block_id: KNOWN_PAGE_ID });" })`
- Expected Signals: the call resolves with a `results` array (empty or populated) plus pagination fields (`has_more`, `next_cursor`); no error is raised for a page with zero unresolved comments.
- Evidence: `list_tools()` result, `tool_info()` result, and the Code Mode response — the `results` array as returned and the pagination fields.
- Pass/Fail Criteria: PASS if the call resolves with a valid comments-list shape (empty or populated) and pagination fields are present; SKIP if no known page ID shared with the integration is available to target; FAIL if the call errors against a known-valid page ID, or the response shape contradicts the documented comment-object structure.
- Failure Triage: 1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`). 2. Confirm the target page ID is shared with the integration. 3. Re-run `tool_info()` and compare the returned schema against the `block_id` input before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

A page ID already shared with the integration is known in advance — any page qualifies, comments may legitimately be empty. `NOTION_TOKEN` is set and the `notion` manual is registered.

### Prompt

`Show me the comments on this Notion page.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_list-comments")`
3. Run the Code Mode chain shown in the scenario contract against the known page ID.

### Expected

The call resolves with a `results` array — empty or populated — and pagination fields, with no error for a page carrying zero unresolved comments.

### Evidence

Capture tool discovery, schema, and the raw `results` array plus pagination fields from the response.

### Pass / Fail

- **Pass:** the call resolves with a valid comments-list shape, empty or populated.
- **Skip:** no page ID shared with the integration is available in this environment to target.
- **Fail:** the call errors on a valid page ID, or the response contradicts the documented shape.

### Failure Triage

1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`).
2. Confirm the target page ID is shared with the integration.
3. Re-run `tool_info()` and compare the schema against the `block_id` input before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMT-002 | List comments | List unresolved comments on a known shared page, empty result is valid | `Show me the comments on this Notion page.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_list-comments")` -> 3. `call_tool_chain` list-comments read | Valid `results` array (empty or populated) with pagination fields | Discovery, schema, results array, pagination fields | PASS on valid shape returned; SKIP on no known page id; FAIL on error or contradictory shape | Check token/registration, confirm page shared, re-verify schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/comments/list-comments.md`](../../feature-catalog/comments/list-comments.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Comments
- Playbook ID: `CMT-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comments/list-comments.md`
