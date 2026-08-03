---
title: "Sitemap, scripts, assets, WHTML"
description: "Webflow sitemap/scripts/assets/whtml capability card: bulk sitemap status, the 20-action scripts surface, asset compression, and WHMTL building."
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
| `insert_whtml` (page building via WHTML) | DW (design-affecting → sk-design pairing) |

### Semantics

- Scripts ship with publish: script registration is publish-adjacent; clearing scripts is DS.
- Bulk sitemap updates: confirm the selection before writing (bulk blast radius).
- `insert_whtml` builds page structure — pair with `sk-design` for layout intent.

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
