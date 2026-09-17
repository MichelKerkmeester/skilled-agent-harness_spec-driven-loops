---
title: "PAGE-006 -- Retrieve page as Markdown"
description: "This scenario validates notion_retrieve-page-markdown by reading a known scratch page's block content as Markdown."
stage: routing
version: 0.1.0.0
---

# PAGE-006 -- Retrieve page as Markdown

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-page-markdown` tool as a read-only, token-efficient content read against a known scratch page.

### Why This Matters

The Markdown round trip is the highest-priority read path in the Notion tool set — it avoids a paginated block-by-block walk. The scenario proves the callable resolves under the required `2026-03-11` API version, distinct from the `2025-09-03` pin the other 22 tools use.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-006`
- Feature Name: Retrieve page as Markdown
- Scenario Objective: Read a known scratch page's block content as Markdown.
- Exact Prompt: `Fetch the content of our known scratch Notion page as Markdown and show me what it contains.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_retrieve-page-markdown") -> 3. Code Mode: call_tool_chain({ code: "return await notion[\"notion_retrieve-page-markdown\"] ({ page_id: SCRATCH_PAGE_ID });" })`
- Expected Signals: The manual reports the callable name; the schema resolves; the call returns a Markdown string (possibly empty for a bare scratch page) rather than a 400 API-version error.
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, and the scratch page ID used.
- Pass/Fail Criteria: PASS if the callable and schema resolve and a Markdown response is returned (empty content is a valid outcome for a bare page); SKIP if the manual, token, or a known scratch page ID is unavailable; FAIL if the call errors with a `2026-03-11` API-version mismatch or returns non-Markdown content.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch page is shared with the integration. 2. Confirm the server pins `2026-03-11` for this tool. 3. Repeat `list_tools()` and `tool_info()` before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and a known scratch page ID shared with the integration. A missing scratch page ID is a valid SKIP condition, not a reason to fabricate one.

### Prompt

`Fetch the content of our known scratch Notion page as Markdown and show me what it contains.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_retrieve-page-markdown")`
3. Run the Code Mode read call shown in the scenario contract.
4. Inspect the returned Markdown string.

### Expected

The callable name is discoverable, the schema resolves, and the call returns Markdown content without an API-version error.

### Evidence

Capture discovery, schema, the returned Markdown, and the scratch page ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; Markdown content is returned.
- **Skip:** manual registration, token, or a known scratch page ID is unavailable.
- **Fail:** the call fails on an API-version mismatch or returns non-Markdown content.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch page is shared with the integration.
2. Re-run `list_tools()` and `tool_info()`.
3. Confirm the API version pin; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-006 | Retrieve page as Markdown | Read a known scratch page's content as Markdown | `Fetch the content of our known scratch Notion page as Markdown and show me what it contains.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_retrieve-page-markdown")` -> 3. Code Mode read call | Known name and schema resolve; Markdown content returned | Discovery, schema, Markdown response, scratch page ID | PASS on structured Markdown read; SKIP on prerequisites/schema; FAIL on API-version error | Check token/sharing, rediscover tool, confirm API version |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/retrieve-page-markdown.md`](../../feature-catalog/pages/retrieve-page-markdown.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, and the `2026-03-11` version pin |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-006`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/retrieve-page-markdown.md`
