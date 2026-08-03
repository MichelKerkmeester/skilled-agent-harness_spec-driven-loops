---
title: "Webflow MCP Action Reference (Remote Surface, 2026-08-03)"
description: "Complete official action reference for the Webflow MCP remote surface: 31 tools, 216 actions, required parameters, read/write flags, and frozen risk classes."
trigger_phrases:
  - "webflow action reference"
  - "webflow mcp actions"
  - "webflow tool parameters"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Webflow MCP Action Reference (Remote Surface)

> Source: official Webflow MCP tool documentation (developers.webflow.com/mcp/tools/*, fetched
> 2026-08-03) — the **remote deployed surface** (`com.webflow/mcp` 2.0.0). The local OSS
> server (`webflow-mcp-server` npm) exposes the smaller 18-module baseline in
> `tool-surface.md`. Always re-discover the pinned version's live surface per session.
> Class = frozen risk class applied by action-name semantics (RO/DW/DS/PB/DP); read/write
> flags are the official tool-level flags.

## Agent Instructions

### `data_agent_instructions_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `search_instructions` | `site_id` | RO |
| `read_instruction` | `path` | RO |
| `create_instruction` | `markdown` | DW |
| `update_instruction` | `path` | DW |
| `delete_instruction` | `path` | DS |
| `move_instruction` | `toPath` | DW |


## Analyze (add-on)

### `data_analyze_tool` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_query_guide` | `get_query_guide` | RO |
| `get_resolve_event_element_guide` | `get_resolve_event_element_guide` | RO |
| `get_time_on_page_report` | `metricScope` | RO |
| `get_top_dimensions_report` | `limit` | RO |
| `get_top_events_report` | `endTime` | RO |
| `get_top_pages_report` | `limit` | RO |
| `get_traffic_report` | `bucketTimeZone` | RO |


## Assets

### `data_assets_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `compress_assets` | `format` | DW |
| `create_asset` | `file_hash` | DW |
| `create_asset_folder` | `display_name` | DW |
| `delete_asset` | `asset_id` | DS |
| `get_asset` | `asset_id` | RO |
| `get_asset_folder` | `folder_id` | RO |
| `get_compression_task` | `task_id` | RO |
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


## CMS

### `data_cms_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_collection` | `request{displayName, singularName}` | DW |
| `create_collection_items` | `request{fieldData}` | DW |
| `create_collection_option_field` | `request{type=Option, displayName, metadata}` | DW |
| `create_collection_reference_field` | `request{type, displayName, metadata{collectionId}}` | DW |
| `create_collection_static_field` | `request{type, displayName}` | DW |
| `delete_collection_field` | `field_id` | DS |
| `delete_collection_items` | `request{items[].id}` | DS |
| `get_collection_details` | `collection_id` | RO |
| `get_collection_list` | `siteId` | RO |
| `list_collection_items` | `collection_id` | RO |
| `publish_collection_items` | `request{itemIds}` | PB |
| `unpublish_collection_items` | `request{items[].id}` | PB |
| `update_collection_field` | `request` | DW |
| `update_collection_items` | `request{items[].id, fieldData}` | DW |


## Comments

### `data_comments_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_reply` | `content` | DW |
| `get_comment_thread` | `comment_thread_id` | RO |
| `list_comment_replies` | `comment_thread_id` | RO |
| `list_comment_threads` | `site_id` | RO |
| `search_comment_user_by_email` | `email` | RO |


## Components

### `data_component_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_blank_component` | `name` | DW |
| `duplicate_component` | `name` | DW |
| `get_all_components` | `get_all_components` | RO |
| `get_component` | `name` | RO |
| `get_parent_component` | `id {component, element}` | RO |
| `insert_component_instance` | `creation_position` | DW |
| `query_components` | `queries[]` | RO |
| `set_component_metadata` | `component_id` | DW |
| `transform_element_to_component` | `name` | DW |
| `unlink_component_instance` | `component_instance_id` | DW |
| `unregister_component` | `component_id` | DW |

### `data_component_builder` — write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `insert_in_element` | `component_schema{name}` | DW |
| `insert_in_slot` | `slot_name` | DW |

### `data_component_props_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_prop` | `props[]` | DW |
| `get_component_instance_props` | `element_id {component, element}` | RO |
| `remove_prop` | `prop_ids` | DS |
| `reset_all_props_value` | `element_id {component, element}` | DW |
| `set_component_instance_prop_values` | `values[]` | DW |
| `update_prop` | `props[].prop_id` | DW |

### `data_component_variants_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_variant` | `name` | DW |
| `delete_variant` | `variant_id` | DS |
| `duplicate_variant` | `source_variant_id` | DW |
| `get_variant_settings` | `variant_id` | RO |
| `get_variant_styles` | `style_name` | RO |
| `reorder_variants` | `variant_ids` | DW |
| `set_variant_name` | `name` | DW |
| `set_variant_styles` | `style_name` | DW |


## Elements

### `data_element_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_all_elements` | `siteId` | RO |
| `get_attributes` | `id {component, element}` | RO |
| `get_display_name` | `element_id {component, element}` | RO |
| `move_element` | `creation_position` | DW |
| `query_elements` | `queries[]` | RO |
| `remove_attribute` | `attribute_names` | DS |
| `remove_element` | `id {component, element}` | DS |
| `set_attributes` | `attributes[]` | DW |
| `set_display_name` | `display_name` | DW |
| `set_heading_level` | `heading_level` | DW |
| `set_image_asset` | `image_asset_id` | DW |
| `set_link` | `link` | DW |
| `set_style` | `style_names` | DW |
| `set_text` | `text` | DW |

### `data_element_settings_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_bindable_sources` | `queries[]` | RO |
| `get_settings` | `element_id` | RO |
| `set_dom_id` | `element_id` | DW |
| `set_settings` | `operations[]` | DW |
| `set_tag` | `element_id` | DW |
| `set_visibility` | `element_id` | DW |

### `data_element_builder` — write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_element` | `element_schema{type}` | DW |


## Enterprise

### `data_enterprise_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `add_well_known_file` | `redirect_id` | DW |
| `delete_robots_txt` | `site_id` | DS |
| `get_robots_txt` | `site_id` | RO |
| `list_site_activity_logs` | `site_id` | RO |
| `remove_well_known_files` | `fileNames` | DS |
| `replace_robots_txt` | `toUrl` | DW |
| `update_robots_txt` | `site_id` | DW |


## Fonts

### `data_fonts_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `batch_delete_fonts` | `items[]` | DS |
| `create_font` | `font_display` | DW |
| `delete_font` | `font_id` | DS |
| `get_font` | `font_id` | RO |
| `list_fonts` | `site_id` | RO |
| `replace_font_file` | `file_hash` | DW |
| `update_font` | `font_id` | DW |


## Forms

### `data_forms_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `delete_form_submission` | `form_submission_id` | DS |
| `get_form` | `form_id` | RO |
| `get_form_submission` | `form_submission_id` | RO |
| `list_form_submissions` | `form_id` | RO |
| `list_forms` | `site_id` | RO |
| `list_site_form_submissions` | `site_id` | RO |
| `update_form_submission` | `form_submission_data` | DW |


## Localization

### `data_localization_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_component_content` | `component_id` | RO |
| `get_component_properties` | `component_id` | RO |
| `get_page_content` | `page_id` | RO |
| `list_components` | `site_id` | RO |
| `update_component_content` | `nodes` | DW |
| `update_component_properties` | `properties` | DW |
| `update_static_content` | `nodes` | DW |


## Pages

### `data_pages_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `bulk_update_pages` | `pages[]` | DW |
| `bulk_update_pages_schema_markup` | `pages[]` | DW |
| `create_branch` | `page_id` | DW |
| `create_page` | `slug` | DW |
| `delete_branch` | `branch_id` | DS |
| `get_branch_details` | `branch_id` | RO |
| `get_page_metadata` | `page_id` | RO |
| `list_branches` | `site_id` | RO |
| `list_pages` | `site_id` | RO |
| `query_pages_schema_markup` | `pages[]` | RO |
| `update_page_settings` | `page_id` | DW |


## Scripts

### `data_scripts_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `add_page_script` | `version` | DW |
| `add_site_script` | `version` | DW |
| `clear_page_scripts` | `page_id` | DS |
| `clear_site_scripts` | `site_id` | DS |
| `delete_registered_script` | `script_id` | DS |
| `get_page_freeform_code` | `page_id` | RO |
| `get_page_scripts` | `page_id` | RO |
| `get_registered_script` | `script_id` | RO |
| `get_registered_scripts` | `site_id` | RO |
| `get_site_freeform_code` | `site_id` | RO |
| `get_site_scripts` | `site_id` | RO |
| `register_hosted_script` | `display_name` | DW |
| `register_inline_script` | `display_name` | DW |
| `remove_page_script` | `script_id` | DS |
| `remove_site_script` | `script_id` | DS |
| `set_page_freeform_code` | `content` | DW |
| `set_page_scripts` | `scripts` | DW |
| `set_site_freeform_code` | `content` | DW |
| `set_site_scripts` | `scripts` | DW |
| `update_registered_script` | `script_id` | DW |


## Sitemap

### `data_sitemap_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `bulk_update_items_sitemap_status` | `items[]` | DW |
| `bulk_update_pages_sitemap_status` | `pages[]` | DW |
| `get_item_sitemap_status` | `item_id` | RO |
| `get_page_sitemap_status` | `page_id` | RO |
| `list_items_sitemap_status` | `collection_id` | RO |
| `list_pages_sitemap_status` | `site_id` | RO |
| `update_item_sitemap_status` | `includeInSitemap` | DW |
| `update_page_sitemap_status` | `includeInSitemap` | DW |


## Sites

### `data_sites_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_site` | `site_id` | RO |
| `list_sites` | `list_sites` | RO |
| `publish_site` | `site_id` | PB |


## Style

### `data_style_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_style` | `properties[]` | DW |
| `get_style_variable_modes` | `style_name` | RO |
| `get_styles` | `query` | RO |
| `query_styles` | `queries[]` | RO |
| `remove_all_style_variable_modes` | `style_name` | DS |
| `remove_style` | `style_name` | DS |
| `remove_style_variable_mode` | `variable_collection_id` | DS |
| `rename_style` | `new_name` | DW |
| `set_style_variable_mode` | `mode_id` | DW |
| `update_style` | `style_name` | DW |


## Variables

### `data_variable_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_color_variable` | `value` | DW |
| `create_font_family_variable` | `value` | DW |
| `create_number_variable` | `value` | DW |
| `create_percentage_variable` | `value` | DW |
| `create_size_variable` | `value` | DW |
| `create_variable_collection` | `name` | DW |
| `create_variable_mode` | `name` | DW |
| `delete_variable` | `variable_id` | DS |
| `get_variable_collections` | `query` | RO |
| `get_variables` | `variable_collection_id` | RO |
| `query_variables` | `queries[]` | RO |
| `rename_variable` | `new_name` | DW |
| `reorder_variable_collection` | `position` | DW |
| `update_color_variable` | `value` | DW |
| `update_font_family_variable` | `value` | DW |
| `update_number_variable` | `value` | DW |
| `update_percentage_variable` | `value` | DW |
| `update_size_variable` | `value` | DW |


## Webhooks

### `data_webhook_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `create_webhook` | `url` | DW |
| `delete_webhook` | `webhook_id` | DS |
| `get_webhook` | `webhook_id` | RO |
| `list_webhooks` | `site_id` | RO |


## WHTML

### `data_whtml_builder` — write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `insert_whtml` | `html` | DW |


## Designer canvas

### `designer_tool` — read, write

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `check_if_inside_component_view` | `check_if_inside_component_view` | DW |
| `close_component_view` | `close_component_view` | DW |
| `create_page_folder` | `page_folder_name` | DW |
| `get_all_breakpoints` | `get_all_breakpoints` | RO |
| `get_branch_parent_page_id` | `get_branch_parent_page_id` | RO |
| `get_current_branch_id` | `get_current_branch_id` | RO |
| `get_current_component` | `get_current_component` | RO |
| `get_current_mode` | `get_current_mode` | RO |
| `get_current_page` | `get_current_page` | RO |
| `get_selected_element` | `data_element_tool` | RO |
| `list_branches` | `page_id` | RO |
| `open_canvas` | `page_id` | DW |
| `open_component_view` | `component_instance_id {component, element}` | DW |
| `select_element` | `id {component, element}` | DW |
| `switch_page` | `page_id` | DW |

### `element_snapshot_tool` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_element_snapshot` | `id {component, element}` | RO |


## Utility

### `ask_webflow_ai` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `ask_webflow_ai` | `message` | RO |

### `webflow_guide_tool` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_guidelines` | `get_guidelines` | RO |

### `get_more_tools` — read

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_more_tools` | `context` | RO |

