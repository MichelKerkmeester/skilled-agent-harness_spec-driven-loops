---
title: "Search"
description: "Search shared pages and data sources by title through the confirmed notion_search tool - no full-text content search."
trigger_phrases:
  - "Search"
  - "notion_search"
  - "search Notion by title"
version: 0.1.0.0
---

# Search (`notion_search`)

## 1. OVERVIEW

`notion_search` finds pages and data sources shared with the integration, matched by **title**. It is `SRCH-001`, the sole tool in the Search domain and the primary discovery path when a page or data-source ID is not already known.

The Code Mode callable form is `notion["notion_search"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and the target content shared with the integration — `search` only returns what has been explicitly shared, it is not a workspace-wide index.

`notion_search` calls `POST /v1/search` under API version `2025-09-03`. `query` matches against object **title** text; `filter` narrows results to `page` or `data_source`; `sort` orders by `last_edited_time`; `start_cursor` and `page_size` paginate. An empty `query` string returns all shared content ordered by recency — useful as a "what is currently shared with this integration" probe.

`search` is **title-only** — there is no full-text body-content search. This is a structural platform limit, not a fillable gap: a query that matches text inside a page's body but not its title returns no hit for that page. This must be proven with a real title-matching query alongside a real body-only-phrase query, not assumed — see the matching playbook scenario, which runs both and confirms the second returns no result. Do not treat a search miss as evidence a page does not exist: it may simply not be shared with the integration, or the query may be matching body text this tool structurally cannot see.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes discovery-by-title requests to the Search domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and the title-only limit (§5 Search). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/search/search.md`](../../manual-testing-playbook/search/search.md) | Manual playbook | Proves title match succeeds and a body-only phrase returns no result, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Search
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `search/search.md`

Related references:
- [`../users/retrieve-bot-user.md`](../users/retrieve-bot-user.md) — the connectivity preflight that should pass before search is attempted.
