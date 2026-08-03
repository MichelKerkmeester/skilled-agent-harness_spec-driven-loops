---
title: "Webflow MCP Action Reference (Remote Surface, 2026-08-03)"
description: "Complete official action reference for the Webflow MCP remote surface: 31 tools, 220 actions, required parameters, read/write flags, and frozen risk classes."
trigger_phrases:
  - "webflow action reference"
  - "webflow mcp actions"
  - "webflow tool parameters"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---
# Webflow MCP Action Reference (Remote Surface)

Complete action inventory for the remote Webflow MCP surface.

---
## 1. OVERVIEW

Source: official Webflow MCP tool documentation (developers.webflow.com/mcp/tools/*, fetched
2026-08-03) — the **remote deployed surface** (`com.webflow/mcp` 2.0.0): **31 tools / 220
actions**. The local OSS server (`webflow-mcp-server` npm) exposes the smaller 18-module baseline
in `tool-surface.md`. Always re-discover the pinned version's live surface per session. Class =
frozen risk class applied by action-name semantics (RO/DW/DS/PB/DP); read/write flags are the
official tool-level flags.

### Global Parameters

Every action on the page-building tools (`data_element_tool`, `data_element_settings_tool`,
`data_component_tool`, `data_component_props_tool`, `data_component_variants_tool`,
`data_element_builder`, `data_component_builder`, `data_whtml_builder`, `data_style_tool`,
`data_variable_tool`) requires `siteId` and `pageId` in addition to the parameters listed;
Designer-canvas actions (`designer_tool`, `element_snapshot_tool`) require `siteId`. Actions
without required parameters are marked `—`.

---
## 2. AGENT INSTRUCTIONS

### `data_agent_instructions_tool` — read, write

| Action                | Required parameters               | Class |
| -----------------------| -----------------------------------| -------|
| `search_instructions` | `site_id`                         | RO    |
| `read_instruction`    | `site_id, path`                   | RO    |
| `create_instruction`  | `site_id, kind, path, markdown`   | DW    |
| `update_instruction`  | `site_id, kind, path`             | DW    |
| `delete_instruction`  | `site_id, kind, path`             | DS    |
| `move_instruction`    | `site_id, kind, fromPath, toPath` | DW    |


---
## 3. ANALYZE (ADD-ON)

### `data_analyze_tool` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_query_guide` | `—` | RO |
| `get_resolve_event_element_guide` | `—` | RO |
| `get_time_on_page_report` | `site_id, startTime, endTime, metricScope` | RO |
| `get_top_dimensions_report` | `site_id, startTime, endTime, dimension, metricScope, limit` | RO |
| `get_top_events_report` | `site_id, startTime, endTime` | RO |
| `get_top_pages_report` | `site_id, startTime, endTime, limit` | RO |
| `get_traffic_report` | `site_id, startTime, endTime, metricScope, bucketTimeZone` | RO |


---
## 4. ASSETS

### `data_assets_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `compress_assets` | `site_id, asset_ids[], format` | DW |
| `create_asset` | `site_id, file_name, file_hash` | DW |
| `create_asset_folder` | `site_id, display_name` | DW |
| `delete_asset` | `asset_id` | DS |
| `get_asset` | `asset_id` | RO |
| `get_asset_folder` | `folder_id` | RO |
| `get_compression_task` | `site_id, task_id` | RO |
| `list_asset_folders` | `site_id` | RO |
| `list_assets` | `site_id` | RO |
| `list_compression_tasks` | `site_id` | RO |
| `update_asset` | `asset_id` | DW |
| `update_asset_folder` | `folder_id` | DW |

### `asset_tool` — write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `upload_image_by_url` | `url` | DW |

### `get_asset_preview` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_asset_preview` | `asset_id` | RO |


---
## 5. CMS

### `data_cms_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_collection` | `siteId, request{displayName, singularName}` | DW |
| `create_collection_items` | `collection_id, request{fieldData}` | DW |
| `create_collection_option_field` | `collection_id, request{type=Option, displayName, metadata}` | DW |
| `create_collection_reference_field` | `collection_id, request{type, displayName, metadata{collectionId}}` | DW |
| `create_collection_static_field` | `collection_id, request{type, displayName}` | DW |
| `delete_collection_field` | `collection_id, field_id` | DS |
| `delete_collection_items` | `collection_id, request{items[].id}` | DS |
| `get_collection_details` | `collection_id` | RO |
| `get_collection_list` | `siteId` | RO |
| `list_collection_items` | `collection_id` | RO |
| `publish_collection_items` | `collection_id, request{itemIds}` | PB |
| `unpublish_collection_items` | `collection_id, request{items[].id}` | PB |
| `update_collection_field` | `collection_id, field_id, request` | DW |
| `update_collection_items` | `collection_id, request{items[].id, fieldData}` | DW |


---
## 6. COMMENTS

### `data_comments_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_reply` | `site_id, comment_thread_id, content` | DW |
| `get_comment_thread` | `site_id, comment_thread_id` | RO |
| `list_comment_replies` | `site_id, comment_thread_id` | RO |
| `list_comment_threads` | `site_id` | RO |
| `search_comment_user_by_email` | `site_id, email` | RO |


---
## 7. COMPONENTS

### `data_component_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_blank_component` | `name` | DW |
| `duplicate_component` | `source_component_id, name` | DW |
| `get_all_components` | `—` | RO |
| `get_component` | `component_id, name` | RO |
| `get_parent_component` | `id {component, element}` | RO |
| `insert_component_instance` | `parent_element_id, component_id, creation_position` | DW |
| `query_components` | `queries[]` | RO |
| `set_component_metadata` | `component_id` | DW |
| `transform_element_to_component` | `id {component, element}, name` | DW |
| `unlink_component_instance` | `component_instance_id` | DW |
| `unregister_component` | `component_id` | DS |

### `data_component_builder` — write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `insert_in_element` | `build_label, parent_element_id, creation_position, component_schema{name}` | DW |
| `insert_in_slot` | `build_label, parent_element_id, creation_position, component_schema{name}, slot_name` | DW |

### `data_component_props_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_prop` | `component_id, props[]` | DW |
| `get_component_instance_props` | `element_id {component, element}` | RO |
| `remove_prop` | `component_id, prop_ids` | DS |
| `reset_all_props_value` | `element_id {component, element}` | DW |
| `set_component_instance_prop_values` | `element_id, values[]` | DW |
| `update_prop` | `component_id, props[].prop_id` | DW |

### `data_component_variants_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_variant` | `component_id, name` | DW |
| `delete_variant` | `component_id, variant_id` | DS |
| `duplicate_variant` | `component_id, source_variant_id` | DW |
| `get_variant_settings` | `component_id, variant_id` | RO |
| `get_variant_styles` | `variant_id, style_name` | RO |
| `reorder_variants` | `component_id, variant_ids` | DW |
| `set_variant_name` | `component_id, variant_id, name` | DW |
| `set_variant_styles` | `variant_id, style_name` | DW |


---
## 8. ELEMENTS

### `data_element_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_all_elements` | `pageId, siteId` | RO |
| `get_attributes` | `id {component, element}` | RO |
| `get_display_name` | `element_id {component, element}` | RO |
| `move_element` | `id, anchor_element_id, creation_position` | DW |
| `query_elements` | `queries[]` | RO |
| `remove_attribute` | `id, attribute_names` | DS |
| `remove_element` | `id {component, element}` | DS |
| `set_attributes` | `id, attributes[]` | DW |
| `set_display_name` | `element_id, display_name` | DW |
| `set_heading_level` | `id, heading_level` | DW |
| `set_image_asset` | `id, image_asset_id` | DW |
| `set_link` | `id, linkType, link` | DW |
| `set_style` | `id, style_names` | DW |
| `set_text` | `id, text` | DW |

### `data_element_settings_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_bindable_sources` | `queries[]` | RO |
| `get_settings` | `type, element_id` | RO |
| `set_dom_id` | `element_id` | DW |
| `set_settings` | `operations[]` | DW |
| `set_tag` | `element_id` | DW |
| `set_visibility` | `element_id` | DW |

### `data_element_builder` — write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_element` | `build_label, parent_element_id, creation_position, element_schema{type}` | DW |


---
## 9. ENTERPRISE

### `data_enterprise_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `add_well_known_file` | `site_id, fileName, fileData, contentType` | DW |
| `create_301_redirect` | `site_id, fromUrl, toUrl` | DW |
| `delete_301_redirect` | `site_id, redirect_id` | DS |
| `delete_robots_txt` | `site_id` | DS |
| `get_robots_txt` | `site_id` | RO |
| `list_301_redirects` | `site_id` | RO |
| `list_site_activity_logs` | `site_id` | RO |
| `remove_well_known_files` | `site_id, fileNames` | DS |
| `replace_robots_txt` | `site_id` | DS |
| `update_301_redirect` | `site_id, redirect_id, fromUrl, toUrl` | DW |
| `update_robots_txt` | `site_id` | DW |

> **Note**: Redirect rules and activity-log reads are audit-safe: `list_301_redirects` and `list_site_activity_logs` are RO, and redirect writes (`create_301_redirect`, `update_301_redirect`) are DW with write preview. Blast radius: bulk redirect replacement rewrites the whole mapping at once — preview the full fromUrl/toUrl set before applying.


---
## 10. FONTS

### `data_fonts_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `batch_delete_fonts` | `site_id, items[]` | DS |
| `create_font` | `site_id, file_name, file_hash, font_family, weight, italic, font_display` | DW |
| `delete_font` | `site_id, font_id` | DS |
| `get_font` | `site_id, font_id` | RO |
| `list_fonts` | `site_id` | RO |
| `replace_font_file` | `site_id, font_id, file_name, file_hash` | DW |
| `update_font` | `site_id, font_id` | DW |


---
## 11. FORMS

### `data_forms_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `delete_form_submission` | `site_id, form_submission_id` | DS |
| `get_form` | `form_id` | RO |
| `get_form_submission` | `site_id, form_submission_id` | RO |
| `list_form_submissions` | `site_id, form_id` | RO |
| `list_forms` | `site_id` | RO |
| `list_site_form_submissions` | `site_id` | RO |
| `update_form_submission` | `site_id, form_submission_id, form_submission_data` | DW |


---
## 12. LOCALIZATION

### `data_localization_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_component_content` | `site_id, component_id` | RO |
| `get_component_properties` | `site_id, component_id` | RO |
| `get_page_content` | `page_id` | RO |
| `list_components` | `site_id` | RO |
| `update_component_content` | `site_id, component_id, localeId, nodes` | DW |
| `update_component_properties` | `site_id, component_id, localeId, properties` | DW |
| `update_static_content` | `page_id, localeId, nodes` | DW |


---
## 13. PAGES

### `data_pages_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `bulk_update_pages` | `site_id, pages[]` | DW |
| `bulk_update_pages_schema_markup` | `site_id, pages[]` | DW |
| `create_branch` | `site_id, page_id` | DW |
| `create_page` | `site_id, title, slug` | DW |
| `delete_branch` | `site_id, branch_id` | DS |
| `get_branch_details` | `site_id, branch_id` | RO |
| `get_page_metadata` | `page_id` | RO |
| `list_branches` | `site_id` | RO |
| `list_pages` | `site_id` | RO |
| `query_pages_schema_markup` | `site_id, pages[]` | RO |
| `update_page_settings` | `page_id` | DW |


---
## 14. SCRIPTS

### `data_scripts_tool` — read, write

Registration and application actions **stage** the site's script configuration; staged changes
ship with the next `publish_site` (separate PB gate). Clear/remove actions are destructive.

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `add_page_script` | `page_id, script_id, location, version` | DW |
| `add_site_script` | `site_id, script_id, location, version` | DW |
| `clear_page_scripts` | `page_id` | DS |
| `clear_site_scripts` | `site_id` | DS |
| `delete_registered_script` | `site_id, script_id` | DS |
| `get_page_freeform_code` | `page_id` | RO |
| `get_page_scripts` | `page_id` | RO |
| `get_registered_script` | `site_id, script_id` | RO |
| `get_registered_scripts` | `site_id` | RO |
| `get_site_freeform_code` | `site_id` | RO |
| `get_site_scripts` | `site_id` | RO |
| `register_hosted_script` | `site_id, hosted_location, integrity_hash, version, display_name` | DW |
| `register_inline_script` | `site_id, source_code, version, display_name` | DW |
| `remove_page_script` | `page_id, script_id` | DS |
| `remove_site_script` | `site_id, script_id` | DS |
| `set_page_freeform_code` | `page_id, location, content` | DW |
| `set_page_scripts` | `page_id, scripts` | DW |
| `set_site_freeform_code` | `site_id, location, content` | DW |
| `set_site_scripts` | `site_id, scripts` | DW |
| `update_registered_script` | `site_id, script_id` | DW |


---
## 15. SITEMAP

### `data_sitemap_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `bulk_update_items_sitemap_status` | `collection_id, items[]` | DW |
| `bulk_update_pages_sitemap_status` | `site_id, pages[]` | DW |
| `get_item_sitemap_status` | `collection_id, item_id` | RO |
| `get_page_sitemap_status` | `page_id` | RO |
| `list_items_sitemap_status` | `collection_id` | RO |
| `list_pages_sitemap_status` | `site_id` | RO |
| `update_item_sitemap_status` | `collection_id, item_id, includeInSitemap` | DW |
| `update_page_sitemap_status` | `page_id, includeInSitemap` | DW |


---
## 16. SITES

### `data_sites_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_site` | `site_id` | RO |
| `list_sites` | `—` | RO |
| `publish_site` | `site_id` | PB |


---
## 17. STYLE

### `data_style_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_style` | `name, properties[]` | DW |
| `get_style_variable_modes` | `style_name` | RO |
| `get_styles` | `query` | RO |
| `query_styles` | `queries[]` | RO |
| `remove_all_style_variable_modes` | `style_name` | DS |
| `remove_style` | `style_name` | DS |
| `remove_style_variable_mode` | `style_name, variable_collection_id` | DS |
| `rename_style` | `style_name, new_name` | DW |
| `set_style_variable_mode` | `style_name, variable_collection_id, mode_id` | DW |
| `update_style` | `style_name` | DW |


---
## 18. VARIABLES

### `data_variable_tool` — read, write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_color_variable` | `variable_collection_id, variable_name, value` | DW |
| `create_font_family_variable` | `variable_collection_id, variable_name, value` | DW |
| `create_number_variable` | `variable_collection_id, variable_name, value` | DW |
| `create_percentage_variable` | `variable_collection_id, variable_name, value` | DW |
| `create_size_variable` | `variable_collection_id, variable_name, value` | DW |
| `create_variable_collection` | `name` | DW |
| `create_variable_mode` | `variable_collection_id, name` | DW |
| `delete_variable` | `variable_collection_id, variable_id` | DS |
| `get_variable_collections` | `query` | RO |
| `get_variables` | `variable_collection_id` | RO |
| `query_variables` | `queries[]` | RO |
| `rename_variable` | `variable_collection_id, variable_id, new_name` | DW |
| `reorder_variable_collection` | `collection_id, anchor_collection_id, position` | DW |
| `update_color_variable` | `variable_collection_id, variable_id, value` | DW |
| `update_font_family_variable` | `variable_collection_id, variable_id, value` | DW |
| `update_number_variable` | `variable_collection_id, variable_id, value` | DW |
| `update_percentage_variable` | `variable_collection_id, variable_id, value` | DW |
| `update_size_variable` | `variable_collection_id, variable_id, value` | DW |


---
## 19. WEBHOOKS

### `data_webhook_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_webhook` | `site_id, trigger_type, url` | DW |
| `delete_webhook` | `webhook_id` | DS |
| `get_webhook` | `webhook_id` | RO |
| `list_webhooks` | `site_id` | RO |

> **Note**: The webhook lifecycle is CRUD-only on the MCP surface. Delivery, authentication, retries, and versioning are managed on Webflow's side, not through these actions. `create_webhook` takes `site_id, trigger_type, url`; `delete_webhook` is DS — confirm before removing a production endpoint.


---
## 20. WHTML

### `data_whtml_builder` — write *(+ siteId, pageId global)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `insert_whtml` | `build_label, parent_element_id, creation_position, html` | DW |


---
## 21. DESIGNER CANVAS

### `designer_tool` — read, write *(+ siteId)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `check_if_inside_component_view` | `—` | RO |
| `close_component_view` | `—` | DW |
| `create_page_folder` | `page_folder_name` | DW |
| `get_all_breakpoints` | `—` | RO |
| `get_branch_parent_page_id` | `—` | RO |
| `get_current_branch_id` | `—` | RO |
| `get_current_component` | `—` | RO |
| `get_current_mode` | `—` | RO |
| `get_current_page` | `—` | RO |
| `get_selected_element` | `—` | RO |
| `list_branches` | `page_id` | RO |
| `open_canvas` | `component_id, page_id` | DW |
| `open_component_view` | `component_instance_id {component, element}` | DW |
| `select_element` | `id {component, element}` | DW |
| `switch_page` | `page_id` | DW |

### `element_snapshot_tool` — read *(+ siteId)*

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_element_snapshot` | `id {component, element}` | RO |


---
## 22. UTILITY

### `ask_webflow_ai` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `ask_webflow_ai` | `message` | RO |

### `webflow_guide_tool` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_guidelines` | `—` | RO |

### `get_more_tools` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_more_tools` | `brief, category, context` | RO |

**Operating contract**: `webflow_guide_tool` (`get_guidelines`) is a read-only guide resource —
load it to get the workflow guidance for a task; it never mutates state. `get_more_tools` is
surface discovery — it advertises what else the remote surface offers, not a capability
guarantee; treat its results as routing hints to confirm against the action reference before
relying on them. `ask_webflow_ai` is **advisory RO**: its answers are model-generated and must
be verified against the actual API reads (list/get actions) before being trusted as fact;
never feed an unverified AI answer into a DW/DS decision.

---
## 23. RELATED RESOURCES

- [`tool-surface.md`](tool-surface.md) — local OSS baseline (18 modules)
- [`mcp-wiring.md`](mcp-wiring.md) — wiring, auth, scope model
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
