---
title: "Capability: CMS content (read, draft-write, publish, delete)"
description: "Webflow CMS capability card: collection/item reads (RO), draft and live writes (DW), publish (PB), and delete (DS) with the frozen gates and CMS-specific semantics."
trigger_phrases: ["webflow cms", "webflow collection", "webflow cms items"]
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# CMS content (collections + items)

## What it does

Read, create, update, publish, and delete Webflow CMS collections and items through the `cms`
module of the official MCP server (Data API v2).

## Capabilities

| Action | Class | Gate |
|--------|-------|------|
| `get_collection_list`, `get_collection_details`, `list_collection_items` | RO | none (scope check) |
| `create_collection`, `create_collection_*_field`, `update_collection_field` | DW | scope check; target id present |
| `create_collection_items`, `update_collection_items` | DW | scope check; **choose draft vs live target explicitly** |
| `publish_collection_items` | PB | operator confirmation; staging-first; 1 publish/min queue |
| `delete_collection_items` | DS | operator confirmation; before/after listing; rollback = re-publish prior content |

## Safety-critical semantics

- CMS items can be created/deleted **directly in the live site** OR queued as drafts to publish
  later — CMS mutations are NOT implicitly draft-safe; the client must choose.
- Publishing is a separate explicit action; nothing auto-publishes.
- Delete is permanent via the MCP surface (no trash/revert endpoint); rollback is re-publishing
  prior content — confirm before/after state.

## Example prompts

- RO: "list the CMS collection items in the test site"
- DW: "update the title field of the 'Blog' collection item 'hello-world' to 'Hello Webflow' —
  draft target"
- PB: "publish the 'Blog' collection draft items to the staging subdomain"
- DS (refused without confirmation): "delete all items in the 'Drafts' collection"
