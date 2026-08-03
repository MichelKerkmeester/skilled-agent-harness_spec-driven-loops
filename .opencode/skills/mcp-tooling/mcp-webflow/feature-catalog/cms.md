---
title: "Capability: CMS content (read, draft-write, publish, delete)"
description: "Webflow CMS capability card: collection/item reads (RO), draft and live writes (DW), publish (PB), and delete (DS) with the frozen gates and CMS-specific semantics."
trigger_phrases: ["webflow cms", "webflow collection", "webflow cms items"]
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Capability: CMS content (read, draft-write, publish, delete)

<!-- sk-doc-template: feature-catalog-snippet -->

---
## 1. OVERVIEW

Read, create, update, publish, and delete Webflow CMS collections and items through the `cms`
module of the official MCP server (Data API v2).

---
## 2. HOW IT WORKS

### Capabilities

| Action | Class | Gate |
|--------|-------|------|
| `get_collection_list`, `get_collection_details`, `list_collection_items` | RO | none (scope check) |
| `create_collection`, `create_collection_*_field`, `update_collection_field` | DW | scope check; target id present |
| `create_collection_items`, `update_collection_items` | DW | scope check; **choose draft vs live target explicitly** |
| `publish_collection_items` / `unpublish_collection_items` | PB | operator confirmation; live publish (no staging-domain target — staging policy applies at the site level); 1 publish/min queue |
| `delete_collection_items`, `delete_collection_field` | DS | operator confirmation; before/after listing; rollback = re-publish prior content |

---
### Safety-critical semantics

- On the **remote surface**, create/update item actions create **drafts**; publishing is a separate
  explicit action (`publish_collection_items`). The local OSS surface additionally allows direct
  live-site writes — never assume draft-safety across surfaces.
- Publishing is a separate explicit action; nothing auto-publishes.
- Delete is permanent via the MCP surface (no trash/revert endpoint); rollback is re-publishing
  prior content — confirm before/after state.

---
### Example prompts

- RO: "list the CMS collection items in the test site"
- DW: "update the title field of the 'Blog' collection item 'hello-world' to 'Hello Webflow' —
  draft target"
- PB: "publish the 'Blog' collection draft items to the staging subdomain"
- DS (refused without confirmation): "delete all items in the 'Drafts' collection"

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../references/action-reference.md` | Shared | Required parameters per action (CMS) |
| `../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |

---

## 4. SOURCE METADATA

- Group: CMS
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cms.md`

Related references:
- [`../references/action-reference.md`](../references/action-reference.md) — complete action inventory
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
