---
title: "GAP-005 -- Daily Notes"
description: "This scenario validates the query-then-create daily-notes convention resolves idempotently to a single dated page using only existing MCP tools."
stage: routing
version: 0.1.0.0
---

# GAP-005 -- Daily Notes

## 1. OVERVIEW

This scenario validates the daily-notes convention: query a "Daily Notes" data source for today's ISO-date-titled page, create it if absent via `create-a-page`, and confirm a second query resolves to exactly one page for that date.

### Why This Matters

Notion has no daily-notes endpoint, so this convention is the entire feature. An off-by-one in the query-then-create sequence would silently create duplicate daily notes; this scenario proves idempotency, not just a single successful create.

---

## 2. SCENARIO CONTRACT

- Feature ID: `GAP-005`
- Feature Name: Daily Notes
- Scenario Objective: Query for today's daily note, create it if absent, then re-query to confirm exactly one page exists for the date.
- Exact Prompt: `"Open today's daily note, creating it if it doesn't already exist."`
- Exact Command Sequence: `1. tool_info("notion.notion_query-data-source") -> 2. notion["notion_query-data-source"]({ data_source_id: "<daily_notes_data_source_id>", filter: { property: "<title_property>", title: { equals: "<today_iso_date>" } } }) -> 3. if empty: tool_info("notion.notion_create-a-page") -> notion["notion_create-a-page"]({ parent: { data_source_id: "<daily_notes_data_source_id>" }, properties: { "<title_property>": { title: [{ text: { content: "<today_iso_date>" } }] } } }) -> 4. re-run step 2's query`
- Expected Signals: Step 2 returns `[]` or the existing page; Step 3 (if run) returns a new `page_id`; Step 4 returns exactly one page matching today's date.
- Evidence: both query responses, the create response (if a page was created), and the final page count for the date.
- Pass/Fail Criteria: PASS if the convention resolves to exactly one page for today's date after create-or-reuse; SKIP if no "Daily Notes" data source exists and one cannot be created as scratch scaffolding (named blocker: no writable scratch parent available); FAIL if the sequence produces more than one page for the same date, or a call errors.
- Failure Triage: 1. Confirm the "Daily Notes" data source id and its title/date property name. 2. Confirm the ISO-date filter matches the property's actual value format. 3. Re-run the query alone to rule out a propagation delay before assuming a duplicate was created.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set, the `notion` manual is registered, and a "Daily Notes" data source is shared with the integration (or can be created as scratch scaffolding via `create-a-data-source` under a scratch parent page).

### Prompt

`"Open today's daily note, creating it if it doesn't already exist."`

### Commands

1. `tool_info("notion.notion_query-data-source")`.
2. `notion["notion_query-data-source"]({ data_source_id: "<daily_notes_data_source_id>", filter: { property: "<title_property>", title: { equals: "<today_iso_date>" } } })`.
3. If the result is empty: `tool_info("notion.notion_create-a-page")` then `notion["notion_create-a-page"]({ parent: { data_source_id: "<daily_notes_data_source_id>" }, properties: { "<title_property>": { title: [{ text: { content: "<today_iso_date>" } }] } } })`.
4. Re-run the step-2 query.

### Expected

The first query returns either the existing note or an empty result; if empty, the create call returns a new page; the final query returns exactly one page for today's date.

### Evidence

Capture both query responses, the create response when a page was created, and the final page count for the date.

### Pass / Fail

- **Pass:** exactly one page exists for today's date after the sequence, whether reused or newly created.
- **Skip:** no "Daily Notes" data source exists and none can be created as scratch scaffolding.
- **Fail:** more than one page matches today's date after the sequence, or a call errors.

### Failure Triage

1. Confirm the "Daily Notes" data source id and its title/date property name.
2. Confirm the ISO-date filter matches the property's actual value format.
3. Re-run the query alone to rule out a propagation delay before assuming a duplicate was created.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-005 | Daily Notes | Verify query-then-create resolves idempotently to one page per date | `"Open today's daily note, creating it if it doesn't already exist."` | 1. `tool_info(...)` -> 2. `notion["notion_query-data-source"]({...})` -> 3. create-if-absent -> 4. re-query | Exactly one page for today's date after the sequence | Both query responses, create response, final count | PASS if exactly one page exists; SKIP if no Daily Notes data source and none creatable; FAIL if duplicate created or call errors | Confirm data source/property, confirm date-format match, re-query before assuming duplicate |

Cleanup: archive the created daily-note page after the scenario. If a scratch "Daily Notes" data source was created for this test, leave it in place as reusable scratch scaffolding -- no MCP tool deletes a data source, so removing one is out of scope for a reversible scratch-safe scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/api-gap-fills/daily-notes.md`](../../feature-catalog/api-gap-fills/daily-notes.md) | Catalog entry for this gap fill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | States the query-then-create convention in full |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern for both the query and create calls |

---

## 5. SOURCE METADATA

- Group: API-gap fills
- Playbook ID: `GAP-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `api-gap-fills/daily-notes.md`
