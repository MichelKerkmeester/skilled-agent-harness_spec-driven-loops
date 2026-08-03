---
title: "Sitemap, scripts, assets, WHTML"
description: "Webflow sitemap/scripts/assets/whtml capability card: bulk sitemap status, the 20-action scripts surface, asset compression task lifecycle, WHTML building, and schema-markup page actions."
trigger_phrases: ["webflow sitemap", "webflow scripts", "webflow assets", "webflow whtml"]
contextType: implementation
version: 1.0.0.0

# Sitemap, scripts, assets, WHTML

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

The operational surface beyond content: sitemap status bulk updates, the rich custom-code scripts
module, asset management (incl. compression tasks), and WHMTL page building.

---
## 2. HOW IT WORKS

### Actions

### `data_sitemap_tool` (read+write)

| Action | Class |
|--------|-------|
| sitemap reads (items/pages status) | RO |
| `bulk_update_items_sitemap_status`, `bulk_update_pages_sitemap_status` | DW (bulk — review selection before write) |

### `data_scripts_tool` (read+write) — 20 actions

| Action class | Examples |
|--------------|----------|
| RO | `get_page_scripts`, `get_site_scripts`, `get_page_freeform_code`, registered/applied lists |
| DW | `add_page_script`, `add_site_script`, `update_registered_script`, freeform code upserts |
| DS | `clear_page_scripts`, `clear_site_scripts`, `delete_registered_script` |

### `data_assets_tool` + `asset_tool` + `get_asset_preview` (read+write)

| Action class | Examples |
|--------------|----------|
| RO | asset lists/gets, `get_asset_preview`, `list_compression_tasks` |
| DW | upload/update assets, compression requests |
| DS | asset deletes |

### `data_whtml_builder` (write)

| Action | Class |
|--------|-------|
| `insert_whtml` (`build_label`, `parent_element_id`, `creation_position`, `html`) | DW (design-affecting → sk-design pairing) |

### Schema markup (pages)

`bulk_update_pages_schema_markup` and `query_pages_schema_markup` (both `site_id`, `pages[]`)
read/write structured-data markup per page — DW with a write preview of the affected page list
(bulk blast radius), RO reads ungated.

### Semantics

- Scripts stage with publish: registration/application is DW staging; clearing scripts is DS;
  changes ship with the next `publish_site` (see `references/mcp-wiring.md` §10).
- Bulk sitemap updates: confirm the selection before writing (bulk blast radius).
- `insert_whtml` builds page structure — pair with `sk-design` for layout intent; WHTML has no
  batching or read-back action on the surface, so verify via `get_element_snapshot` after insert.
- Asset compression is a task lifecycle: request compression → poll `list_compression_tasks` /
  `get_compression_task` → confirm the format result (`compress_assets` takes `format`) before
  replacing assets.

### Example prompts

- "update the sitemap status of the 'Blog' collection items to 'noindex'" (confirmation, bulk)
- "list the site scripts" / "clear all page scripts on the 'About' page" (confirmation)
- "compress the hero images of the test site"
- "build a two-column section with WHTML on the 'About' page" (sk-design)

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/action-reference.md` | Shared | Required parameters per action (Sitemap, Assets, WHTML, Scripts) |
| `../../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |


## 4. SOURCE METADATA

- Group: Sitemap, Assets, WHTML, Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operations/sitemap-scripts-assets-whtml.md`

Related references:
- [`site-pages-scripts.md`](../content/site-pages-scripts.md) — related capability
