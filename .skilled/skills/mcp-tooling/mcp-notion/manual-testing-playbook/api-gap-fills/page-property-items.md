---
title: "GAP-003 -- Page Property Items"
description: "This scenario validates recovering a full paginated relation property past the ~25-item MCP truncation via the direct page-property-item endpoint."
stage: routing
version: 0.1.0.0
---

# GAP-003 -- Page Property Items

## 1. OVERVIEW

This scenario validates the direct Notion REST property-item endpoint against the documented truncation in `retrieve-a-page`: a relation, rollup, or people property with more than ~25 items is silently truncated by the MCP tool, and the dedicated endpoint recovers the complete paginated set.

### Why This Matters

Silent truncation is a correctness trap, not a crash -- an agent reading only `retrieve-a-page` output could report an incomplete relation list as complete. This scenario proves the direct-call fill actually recovers the full set.

---

## 2. SCENARIO CONTRACT

- Feature ID: `GAP-003`
- Feature Name: Page Property Items
- Scenario Objective: Read a page's relation property via the MCP, confirm it is truncated (or note the item count), then fetch the same property via the direct endpoint and confirm it returns the full paginated set.
- Exact Prompt: `"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."`
- Exact Command Sequence: `1. tool_info("notion.notion_retrieve-a-page") -> 2. notion["notion_retrieve-a-page"] ({ page_id: "<page_id>" }) -> 3. GET https://api.notion.com/v1/pages/<page_id>/properties/<property_id>?page_size=100 (Bearer $notion_NOTION_TOKEN, Notion-Version: 2025-09-03), following start_cursor until has_more is false`
- Expected Signals: Step 2 shows the relation property capped near 25 items; Step 3 returns the full item count via `next_url`/`start_cursor` pagination until `has_more: false`.
- Evidence: the MCP-read item count, the direct-call paginated item count, and a side-by-side comparison of the two.
- Pass/Fail Criteria: PASS if the direct call's item count exceeds the MCP's truncated count and matches the true total; SKIP if no scratch page pre-seeded with a many-item relation exists (named blocker: no scratch data ready); FAIL if the direct call also truncates or errors.
- Failure Triage: 1. Confirm a scratch page pre-seeded with a many-item relation exists, else record `SKIP` with that blocker. 2. Confirm `Notion-Version: 2025-09-03` is set. 3. Confirm the token is read from `$notion_NOTION_TOKEN`, never hardcoded.

---

## 3. TEST EXECUTION

### Prerequisites

A scratch page pre-seeded with a relation property holding more than 25 items is shared with the integration; `notion_NOTION_TOKEN` is set; outbound HTTPS is permitted (or `curl` via Bash as fallback). If no such pre-seeded page exists, this scenario is `SKIP` with that named blocker -- fabricating a 26-item relation is out of scope for a read-only comparison scenario.

### Prompt

`"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."`

### Commands

1. `tool_info("notion.notion_retrieve-a-page")`.
2. `notion["notion_retrieve-a-page"] ({ page_id: "<page_id>" })`.
3. `GET https://api.notion.com/v1/pages/<page_id>/properties/<property_id>?page_size=100` (Bearer `$notion_NOTION_TOKEN`, `Notion-Version: 2025-09-03`); repeat with `start_cursor` until `has_more` is `false`.

### Expected

The MCP read shows the relation property capped near the ~25-item limit; the direct call's paginated result recovers the complete item count, confirmed by walking `start_cursor` to `has_more: false`.

### Evidence

Capture the MCP-read item count, the direct-call's full paginated item count, and the comparison between them.

### Pass / Fail

- **Pass:** the direct call's item count exceeds the MCP's truncated count and matches the page's true relation size.
- **Skip:** no scratch page pre-seeded with a many-item relation is available.
- **Fail:** the direct call also truncates at or near 25 items, or the call errors.

### Failure Triage

1. Confirm a scratch page pre-seeded with a many-item relation exists, else record `SKIP` with that blocker.
2. Confirm `Notion-Version: 2025-09-03` is set on the direct call.
3. Confirm the token is read from `$notion_NOTION_TOKEN`, never hardcoded.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-003 | Page Property Items | Verify the direct call recovers the full list past the ~25-item MCP truncation | `"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."` | 1. `tool_info(...)` -> 2. `notion["notion_retrieve-a-page"] ({...})` -> 3. `GET /v1/pages/<id>/properties/<id>?page_size=100` (paginated) | MCP shows truncated property; direct call returns full paginated set | MCP item count, direct-call item count, comparison | PASS if direct call exceeds and matches true total; SKIP if no pre-seeded scratch page; FAIL if direct call also truncates or errors | Confirm scratch data, confirm version header, confirm token source |

Cleanup: none (read-only). Reuse the existing pre-seeded scratch page; do not create new relation data.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/api-gap-fills/page-property-items.md`](../../feature-catalog/api-gap-fills/page-property-items.md) | Catalog entry for this gap fill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Endpoint, paginated property types, version pin, and curl example |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern for the MCP read step |

---

## 5. SOURCE METADATA

- Group: API-gap fills
- Playbook ID: `GAP-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `api-gap-fills/page-property-items.md`
