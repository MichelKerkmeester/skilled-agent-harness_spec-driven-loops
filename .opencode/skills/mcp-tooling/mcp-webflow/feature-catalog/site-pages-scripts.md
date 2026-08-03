---
title: "Capability: Site, pages, scripts, webhooks, enterprise, AI"
description: "Webflow site/pages/scripts/webhooks/enterprise/AI capability card: the read-only and draft-write surface beyond CMS and Designer."
trigger_phrases: ["webflow site", "webflow pages", "webflow scripts", "webflow webhooks", "webflow enterprise", "webflow ai"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Site, pages, scripts, webhooks, enterprise, AI

## What it does

The remaining Data-API modules: site-level reads/publish, page settings and static content,
custom-code scripts, webhooks, Enterprise-gated redirects/robots/activity, and AI Q&A.

## Capabilities

| Module | Actions | Class |
|--------|---------|-------|
| sites | `list_sites`, `get_site` | RO |
| sites | `publish_site` | PB (see publish-deploy card) |
| pages | `list_pages`, `get_page_metadata`, `get_page_content` | RO |
| pages | `update_page_settings` (SEO/OG/slug/title — schema also carries publishing status) | DW; PB when flipping status |
| pages | `update_static_content` (secondary-locale DOM nodes) | DW |
| scripts | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | RO |
| scripts | `add_inline_site_script`, `upsert_page_script` | DW (ships with publish) |
| scripts | `delete_all_site_scripts`, `delete_all_page_scripts` | DS |
| webhooks | `list_webhooks`, `get_webhook` | RO |
| webhooks | `create_webhook`, `delete_webhook` | DW / DS (integration config) |
| enterprise | `list_301_redirects`, `get_robots_txt`, `list_site_activity_logs` | RO (Enterprise plan) |
| enterprise | redirects/robots/well-known create-update / delete | DW / DS (Enterprise plan) |
| aiChat | `ask_webflow_ai` | RO |
| comments | `list_comment_threads`, `get_comment_thread`, `list_comment_replies` | RO |
| rules | `webflow_guide_tool` | RO |

## Notes

- `custom_code` scopes are Data-Client-app-only (site tokens cannot call custom-code endpoints).
- Enterprise module is gated to Enterprise plans; capability varies by workspace tier.
- `update_page_settings` can flip publishing status — review the payload before sending.
