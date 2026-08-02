# Safety Matrix — mcp-webflow Operation Classes

Every researched Webflow MCP tool maps to exactly one risk class and gate. Source: `../001-deep-research/research/research.md` §4/§8. Frozen by Phase 2 contract (D4/D5).

## Class definitions

| Class | Definition | Gate |
|---|---|---|
| RO | Read-only | none (scope check) |
| DW | Draft-safe write | none (scope check; target id present) |
| DS | Destructive | operator confirmation + rollback |
| PB | Publish | operator confirmation + staging-first |
| DP | Deployment-capable | operator confirmation |

## Matrix (module → actions → class)

| Module | Action examples | Class | Gate notes |
|---|---|---|---|
| pages | `list_pages`, `get_page_metadata`, `get_page_content` | RO | — |
| pages | `update_page_settings` (draft settings) | DW | payload may flip publishing status → review before send |
| pages | `update_page_settings` (status → published) | PB | staging-first |
| cms | `get_collection_list`, `get_collection_details`, `list_collection_items` | RO | — |
| cms | `create_collection*`, `update_collection*`, `create/update_collection_items` | DW | CMS mutations are NOT implicitly draft-safe — client must choose draft vs live target |
| cms | `delete_collection_items` | DS | rollback = re-publish prior content |
| cms | `publish_collection_items` | PB | staging-first; 1 publish/min queue |
| sites | `list_sites`, `get_site` | RO | — |
| sites | `publish_site` | PB | `publishToWebflowSubdomain` only; never `customDomains` in smoke |
| workflows | `list_workflows`, `list_workflow_runs`, `get_workflow_run` | RO | — |
| workflows | `run_workflow` | DP | Webflow-side managed execution; target environment named |
| scripts | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | RO | — |
| scripts | `add_inline_site_script`, `upsert_page_script` | DW | script registration ships with site publish → treat as publish-adjacent |
| scripts | `delete_all_site_scripts`, `delete_all_page_scripts` | DS | rollback = re-add from saved copy |
| components | `list_components`, `get_component_content`, `get_component_properties` | RO | — |
| components | `update_component_content`, `update_component_properties` | DW | design-affecting → sk-design pairing |
| dePages | `create_page`, `create_page_folder`, `switch_page` | DW | Designer session required |
| deElement | `query_elements`, `get_selected_element`, snapshot | RO | — |
| deElement | `select_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, `add_or_update_attribute`, `update_id_attribute` | DW | design-affecting → sk-design pairing |
| deElement | `remove_element`, `remove_attribute` | DS | rollback = version-history snapshot re-publish |
| deVariable | `get_variable_collections`, `get_variables`, `query_variables` | RO | — |
| deVariable | `create_variable_collection`, `create_variable_mode`, `create/update_*_variable`, `rename_variable` | DW | design-affecting → sk-design pairing |
| deVariable | `delete_variable` | DS | rollback = version-history snapshot re-publish |
| Not inspected (existence verified) | aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection | — | treat as RO/DW until Phase 3 tool discovery proves otherwise; never grant DS/PB/DP by default |

## Cross-cutting rules (frozen)

1. Nothing auto-publishes; publishing is always a separate explicit action.
2. 429 handling: honor `Retry-After` (~60s); never blind-replay ambiguous non-idempotent writes.
3. Rate limits: plan-based 60/120 rpm; SDK backoff is the default.
4. Workspace tokens: read-only only.
5. Unknown tool modules default to RO/DW until discovery evidence proves a higher class; the skill layer fails closed.
