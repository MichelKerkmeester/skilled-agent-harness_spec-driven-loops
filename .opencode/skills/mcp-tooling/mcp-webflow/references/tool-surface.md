---
title: "Webflow MCP Tool Surface"
description: "Research-time inventory of the official Webflow MCP 2.0 tool modules and their operation classes. Baseline only — always re-discover live per session."
trigger_phrases:
  - "webflow tool surface"
  - "webflow mcp tools"
  - "webflow tool inventory"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Webflow MCP Tool Surface

> Research-time inventory (Phase 1, deepseek-max lineage). **Baseline only**: live discovery (`list_tools`) per session is the only trustworthy inventory; the pinned server version's actual surface must be recorded here after the first authenticated session (see `../mcp-servers/webflow-mcp/README.md` §3).

## Combined-tool pattern

One MCP tool per module with an `actions` array; per-action risk classes derive from the underlying HTTP method + payload (tool-level `readOnlyHint` is not per-action).

## Modules and classes

| Module | Read-only | Draft-write | Destructive | Publish | Deploy |
|---|---|---|---|---|---|
| pages | `list_pages`, `get_page_metadata`, `get_page_content` | `update_page_settings` | — | publish-status change via `update_page_settings` | — |
| cms | `get_collection_list`, `get_collection_details`, `list_collection_items` | `create_collection*`, `update_collection*`, `create/update_collection_items` | `delete_collection_items` | `publish_collection_items` | — |
| sites | `list_sites`, `get_site` | — | — | `publish_site` | — |
| workflows | `list_workflows`, `list_workflow_runs`, `get_workflow_run` | — | — | — | `run_workflow` |
| scripts | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | `add_inline_site_script`, `upsert_page_script` | `delete_all_site_scripts`, `delete_all_page_scripts` | — | script registration ships with site publish |
| components | `list_components`, `get_component_content`, `get_component_properties` | `update_component_content`, `update_component_properties` | — | — | — |
| dePages | — | `create_page`, `create_page_folder`, `switch_page` | — | — | — |
| deElement | `query_elements`, `get_selected_element`, snapshot | `select_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, `add_or_update_attribute`, `update_id_attribute` | `remove_element`, `remove_attribute` | — | — |
| deVariable | `get_variable_collections`, `get_variables`, `query_variables` | `create_variable_collection`, `create_variable_mode`, `create/update_*_variable`, `rename_variable` | `delete_variable` | — | — |
| Not inspected (existence verified) | aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection | | | | |

## Cross-cutting facts

- CMS mutations are NOT implicitly draft-safe — the client chooses live vs queued/drafted target.
- Nothing auto-publishes; publishing is always a separate explicit action; one publish queue per minute.
- Rate limits: plan-based 60/120 rpm; 429 + `Retry-After` (~60s); SDK backoff default.
- Unknown modules default to read-only/draft-write until discovery evidence proves a higher class (fail closed).
