---
title: "PAGE-003 -- Update page properties"
description: "This scenario validates notion_update-page-properties by patching a property on a disposable scratch page, then archiving it as cleanup."
stage: routing
version: 0.1.0.0
---

# PAGE-003 -- Update page properties

## 1. OVERVIEW

This scenario validates the confirmed `notion_update-page-properties` tool by creating a disposable scratch page, patching one property, confirming the patch, then archiving as cleanup.

### Why This Matters

Property updates are how status, assignee, and other metadata fields change without touching a page's body content. The scenario proves the callable resolves and that only the supplied property changes — an important guardrail against accidentally clobbering the rest of a page's schema.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-003`
- Feature Name: Update page properties
- Scenario Objective: Create a scratch page, patch its title property, confirm the patch, then archive.
- Exact Prompt: `Create a scratch Notion page, rename its title via a property update, confirm the rename took effect, then archive the page.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_update-page-properties") -> 4. Code Mode: tool_info("notion.notion_archive-a-page") -> 5. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"Playbook scratch - before rename\" } }] } }); const updated = await notion[\"notion_update-page-properties\"] ({ page_id: page.id, properties: { title: [{ text: { content: \"Playbook scratch - after rename\" } }] } }); const archived = await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); return { page, updated, archived };" })`
- Expected Signals: The manual reports all three callable names; all three schemas resolve; the create call returns a page `id`; the update call returns the same `id` with the patched title; the archive call confirms trashed state.
- Evidence: `list_tools()` result, three `tool_info()` results, Code Mode response (page/updated/archived), and the scratch parent ID.
- Pass/Fail Criteria: PASS if the callables and schemas resolve, the title changes to the patched value, and the page is archived afterward; SKIP if the manual, token, or a shared scratch parent is unavailable; FAIL if the patch does not apply or an unrelated property changes.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Re-run `list_tools()` and all three `tool_info()` calls. 3. Compare the returned schema against the `properties` input before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and a scratch parent page shared with the integration. Manual registration or scratch-parent sharing may be pending.

### Prompt

`Create a scratch Notion page, rename its title via a property update, confirm the rename took effect, then archive the page.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_update-page-properties")`
4. `tool_info("notion.notion_archive-a-page")`
5. Run the Code Mode chain shown in the scenario contract.
6. Confirm the patched title in the `updated` response and the trashed state in `archived`.

### Expected

All three callable names are discoverable, all three schemas resolve, the title patch applies, and the page ends archived.

### Evidence

Capture discovery, schema, the create/update/archive responses, and the scratch parent ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the title patch applies and the page is archived.
- **Skip:** manual registration, token, or a shared scratch parent is unavailable.
- **Fail:** the patch fails to apply, an unrelated property changes, or the archive fails.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent is shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-003 | Update page properties | Create a scratch page, patch its title, then archive | `Create a scratch Notion page, rename its title via a property update, confirm the rename took effect, then archive the page.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_update-page-properties")` -> 4. `tool_info("notion.notion_archive-a-page")` -> 5. Code Mode create+update+archive chain | Known names and schemas resolve; title patched; page archived | Discovery, schemas, create/update/archive responses, scratch parent ID | PASS on structured patch+archive; SKIP on prerequisites/schema; FAIL on contradictory confirmed behavior | Check token/sharing, rediscover tools, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/update-page-properties.md`](../../feature-catalog/pages/update-page-properties.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, and partial-update behavior |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/update-page-properties.md`
