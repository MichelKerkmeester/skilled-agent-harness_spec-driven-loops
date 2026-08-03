---
title: "Webflow MCP Tool Surface (Research Baseline)"
description: "Research-time inventory of the local OSS webflow-mcp-server 18-module surface with risk classes; the remote surface lives in action-reference.md."
trigger_phrases:
  - "webflow tool surface"
  - "webflow mcp tools"
  - "webflow tool inventory"
  - "webflow actions"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---
# Webflow MCP Tool Surface (Local OSS Baseline)

Research-time inventory of the local 18-module server surface.

---
## 1. OVERVIEW

**Two surfaces.** The remote deployed surface (`com.webflow/mcp` 2.0.0) is documented at **31
tools / 220 actions** in `action-reference.md` (official docs, 2026-08-03). This file is the
**local OSS server baseline** (18 modules, research-time 2026-08-02). Baseline only: live
discovery (`list_tools`) per session is the only trustworthy inventory; the pinned server
version's actual surface must be recorded here after the first authenticated session.

---
## 2. Combined-Tool Pattern

Each of the 18 modules registers **one MCP tool** whose input schema is an `actions` array of
optional per-action objects; each action maps 1:1 to a Webflow Data API v2 endpoint
(GET/POST/PUT/PATCH/DELETE per the server source). Tool-level `readOnlyHint` exists but is not
per-action — per-action class derives from the HTTP method + payload semantics.

---
## 3. Module Inventory (18 Modules, Official Repo `Src/Tools/`)

| Module | Surface | Key actions (class) |
|--------|---------|---------------------|
| **sites** | site-level lifecycle | `list_sites` (RO), `get_site` (RO), `publish_site` (PB — POST /v2/sites/:id/publish; body must carry `customDomains` OR `publishToWebflowSubdomain`; optional `pageId`; 1/min queue) |
| **pages** | page metadata/content/settings | `list_pages` (RO), `get_page_metadata` (RO), `get_page_content` (RO), `update_page_settings` (DW; schema also carries publishing status → PB when flipping to published), `update_static_content` (DW; secondary-locale DOM nodes) |
| **cms** | collections + items | `get_collection_list` (RO), `get_collection_details` (RO), `list_collection_items` (RO), `create_collection*` (DW), `update_collection_field` (DW), `create_collection_items` (DW), `update_collection_items` (DW — bulk draft writes), `publish_collection_items` (PB), `delete_collection_items` (DS — permanent) |
| **components** | site components | `list_components` (RO), `get_component_content` (RO), `get_component_properties` (RO), `update_component_content` (DW), `update_component_properties` (DW) |
| **scripts** | custom code | `list_registered_scripts` (RO), `list_applied_scripts` (RO), `get_page_script` (RO), `add_inline_site_script` (DW), `upsert_page_script` (DW — ships with publish), `delete_all_site_scripts` (DS), `delete_all_page_scripts` (DS) |
| **workflows** | workflow automation | `list_workflows` (RO), `list_workflow_runs` (RO), `get_workflow_run` (RO), `run_workflow` (DP — executes a pre-approved automation; blast radius depends on the workflow definition) |
| **webhooks** | integration config | `list_webhooks` (RO), `get_webhook` (RO), `create_webhook` (DW), `delete_webhook` (DS — integration config, not site content) |
| **enterprise** | Enterprise-gated (plan check) | `list_301_redirects` (RO), `get_robots_txt` (RO), `list_site_activity_logs` (RO), `create_301_redirect` (DW), `update_301_redirect` (DW), `update_robots_txt` (DW), `replace_robots_txt` (DW), `add_well_known_file` (DW), `delete_301_redirect` (DS), `delete_robots_txt` (DS), `remove_well_known_files` (DS) |
| **aiChat** | AI Q&A | `ask_webflow_ai` (RO — Webflow AI over API knowledge; `readOnlyHint: true`) |
| **comments** | comment threads | `list_comment_threads` (RO), `get_comment_thread` (RO), `list_comment_replies` (RO) |
| **rules** | guidance | `webflow_guide_tool` (RO — best-practice guidance text, no side effects) |
| **dePages** | Designer pages | `create_page` (DW), `create_page_folder` (DW), `switch_page` (DW) — Designer session required |
| **deElement** | Designer elements | `query_elements` (RO), `get_selected_element` (RO), snapshot (RO), `select_element` (DW), `set_text` (DW), `set_style` (DW), `set_link` (DW), `set_heading_level` (DW), `set_image_asset` (DW), `add_or_update_attribute` (DW), `update_id_attribute` (DW), `remove_element` (DS), `remove_attribute` (DS), `remove_style` (DS), `remove_properties` (DS) |
| **deStyle** | Designer styles | style read/get (RO), style create/update (DW), `remove_style` (DS) |
| **deVariable** | Designer variables | `get_variable_collections` (RO), `get_variables` (RO), `query_variables` (RO), `create_variable_collection` (DW), `create_variable_mode` (DW), `create/update_*_variable` (DW), `rename_variable` (DW), `delete_variable` (DS) |
| **deComponents** | Designer components | component read/get (RO), component builder (DW), `unregister_component` (DS) |
| **deAsset** | Designer assets | asset read/list (RO), asset upload (DW), asset delete (DS) |
| **localDeMCPConnection** | OSS-local only | `get_designer_app_connection_info` (RO — bridge-app connection state) |

---
## 4. Read-Only Surface (Safe, No Mutation)

`ask_webflow_ai`, comments (list/get/replies), `webflow_guide_tool`, `get_designer_app_connection_info`,
`list_sites`, `get_site`, `list_pages`, `get_page_metadata`, `get_page_content`, cms list/get,
components list/get, scripts list/get, webhooks list/get, workflows list/get, enterprise
list/get/robots/activity, plus the `de*` getters and `query_*` family.

---
## 5. Publish/Deploy Surface (Never Implicit)

- `publish_site` — the single site-level deploy action (POST /v2/sites/:id/publish).
- `publish_collection_items` — deploys CMS item drafts to live.
- `run_workflow` — executes a pre-approved automation.
- Script registration ships with site publish (publish-adjacent).
- There is no other deploy path — every other mutation is draft/staging-scoped.

---
## 6. Destructive Surface (No Trash/Revert Via Mcp)

CMS item deletion (permanent), script deletion (site/page), webhook deletion, enterprise redirect/
robots/well-known deletion, `remove_element`/`remove_attribute`/`remove_style`/`remove_properties`,
`delete_variable`, `unregister_component`, asset deletion. None expose an undo endpoint; rollback
must be re-applied state or version-history snapshot re-publish. API-level site restore does not
exist in the Data API v2 surface → treated as unsupported.

---
## 7. Cross-Cutting Facts

- CMS mutations are NOT implicitly draft-safe — the client chooses live vs queued/drafted target.
- Nothing auto-publishes; one publish queue per minute.
- Rate limits: plan-based 60/120 rpm; 429 + `Retry-After` (~60s); SDK backoff default.
- `custom_code` scopes are Data-Client-app-only (not site tokens).
- Unknown modules default to RO/DW until discovery evidence proves a higher class (fail closed).
- Enterprise module is gated to Enterprise plans; capability varies by workspace tier.

---
## 8. RELATED RESOURCES

- [`action-reference.md`](action-reference.md) — remote surface (31 tools / 220 actions)
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
