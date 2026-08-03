---
title: "Capability: Designer-family operations (de* modules)"
description: "Webflow Designer capability card: elements, styles, variables, components, assets, pages via the Bridge App — always paired with sk-design, draft-only until publish."
trigger_phrases: ["webflow designer", "webflow element", "webflow style", "webflow variable", "webflow component"]
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Designer-family operations (`de*` modules)

## What it does

Operates the live Designer canvas via the Bridge App: elements (deElement), styles (deStyle),
variables (deVariable), components (deComponents), assets (deAsset), and pages (dePages).

## Capabilities

| Module | Actions | Class | Gate |
|--------|---------|-------|------|
| dePages | `create_page`, `create_page_folder`, `switch_page` | DW | Designer session; sk-design for layout intent |
| deElement | `query_elements`, `get_selected_element`, snapshot | RO | none |
| deElement | `select_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, attribute updates | DW | **sk-design pairing required** |
| deElement | `remove_element`, `remove_attribute`, `remove_style`, `remove_properties` | DS | operator confirmation; version-history rollback |
| deStyle | style read/get, create/update, remove | RO/DW/DS | sk-design pairing for DW |
| deVariable | get/query, create/update/rename, delete | RO/DW/DS | sk-design pairing for DW |
| deComponents | component read/get, builder, `unregister_component` | RO/DW/DS | sk-design pairing for DW |
| deAsset | asset read/list, upload, delete | RO/DW/DS | sk-design pairing for DW |
| localDeMCPConnection | `get_designer_app_connection_info` | RO | none (diagnostic) |

## Safety-critical semantics

- Designer tools require the **Bridge App open in the Designer** (auto-installs on remote OAuth;
  local mode needs the Bridge App Designer extension). Data API tools work with Webflow closed.
- Designer edits are **draft-only inside the Designer** — they appear on the live site only after
  `publish_site` (gated separately).
- **All Designer-family operations load `sk-design` first** (cross-hub pairing): the transport
  executes, never decides taste.

## Example prompts

- "set the hero heading level to H1 in the test site" → sk-design + deElement DW
- "create a variable collection 'Brand' with a mode 'Light'" → sk-design + deVariable DW
- "remove the 'hero' element" → confirmation + rollback statement (DS)
