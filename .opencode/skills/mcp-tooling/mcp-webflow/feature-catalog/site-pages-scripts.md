---
title: "Capability: Site, pages, scripts, webhooks, enterprise, AI"
description: "Webflow site/pages/scripts/webhooks/enterprise/AI capability card: the read-only and draft-write surface beyond CMS and Designer."
trigger_phrases: ["webflow site", "webflow pages", "webflow scripts", "webflow webhooks", "webflow enterprise", "webflow ai"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Capability: Site, pages, scripts, webhooks, enterprise, AI

<!-- sk-doc-template: feature-catalog-snippet -->

---
## 1. OVERVIEW

The remaining Data-API modules: site-level reads/publish, page settings and static content,
custom-code scripts, webhooks, Enterprise-gated redirects/robots/activity, and AI Q&A.

---
## 2. HOW IT WORKS

### Capabilities

| Module | Actions | Class |
|--------|---------|-------|
| sites | `list_sites`, `get_site` | RO |
| sites | `publish_site` | PB (see publish-deploy card) |
| pages | `list_pages`, `get_page_metadata`, `get_page_content` | RO |
| pages | `update_page_settings` (SEO/OG/slug/title — schema also carries publishing status) | DW; PB when flipping status |
| pages | `update_static_content` (secondary-locale DOM nodes), page branches (create/update) | DW |
| pages | `delete_branch` (remote) | DS |
| scripts | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | RO |
| scripts | `add_page_script`, `add_site_script`, `set_page_scripts`, `set_site_scripts`, freeform code upserts, `update_registered_script` | DW (ships with publish) |
| scripts | `delete_all_site_scripts`, `delete_all_page_scripts` | DS |
| webhooks | `list_webhooks`, `get_webhook` | RO |
| webhooks | `create_webhook`, `delete_webhook` | DW / DS (integration config) |
| enterprise | `list_301_redirects`, `get_robots_txt`, `list_site_activity_logs` | RO (Enterprise plan) |
| enterprise | redirects/robots/well-known create-update / delete | DW / DS (Enterprise plan) |
| aiChat | `ask_webflow_ai` | RO |
| comments | `list_comment_threads`, `get_comment_thread`, `list_comment_replies` | RO |
| comments | `create_reply` (remote) | DW |
| rules | `webflow_guide_tool` | RO |

---
### Notes

- `custom_code` scopes are Data-Client-app-only (site tokens cannot call custom-code endpoints).
- Enterprise module is gated to Enterprise plans; capability varies by workspace tier.
- `update_page_settings` can flip publishing status — review the payload before sending.

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../references/action-reference.md` | Shared | Required parameters per action (Pages, Scripts, Sites, Webhooks, Enterprise, Utility, Comments) |
| `../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |

---

## 4. SOURCE METADATA

- Group: Pages, Scripts, Sites, Webhooks, Enterprise, Utility, Comments
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `site-pages-scripts.md`

Related references:
- [`../references/action-reference.md`](../references/action-reference.md) — complete action inventory
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
