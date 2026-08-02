---
title: "mcp-webflow: Feature Catalog"
description: "Canonical capability inventory for the mcp-webflow transport: the researched Webflow MCP 2.0 tool modules, their operation classes, and the frozen gates."
trigger_phrases:
  - "webflow"
  - "webflow feature catalog"
  - "webflow capabilities"
last_updated: "2026-08-02"
version: 1.0.0.0
---

# mcp-webflow: Feature Catalog

Canonical capability inventory for the `mcp-webflow` skill. The transport reaches Webflow MCP 2.0 through the `webflow` Code Mode manual (official `webflow-mcp-server`, `WEBFLOW_TOKEN`). Every capability is tagged with its frozen operation class (RO read-only, DW draft-write, DS destructive, PB publish, DP deploy) and gate.

> **Discovery-first contract.** The rows below are the research-time inventory (`references/tool-surface.md`). Always re-discover per session (`list_tools`); callables carry the `webflow.webflow.webflow_<tool>` prefix. The pinned server version's live surface is the only authoritative inventory.

## 1. OVERVIEW

Webflow MCP 2.0 exposes the Data API v2 and Designer API as bounded combined tools (one MCP tool per module, `actions` array inside). The transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden); all mutations land in Webflow's cloud under the frozen gates. Designer-family modules require `sk-design` pairing.

## 2. Capability inventory by module

| Module | Callable | Capabilities | Class |
|---|---|---|---|
| pages | `data_pages_tool` | list/get pages + metadata/content | RO |
| pages | `data_pages_tool` | update page settings (draft) | DW |
| pages | `data_pages_tool` | update page settings (publish-status) | PB |
| cms | `data_cms_tool` | collection/item reads | RO |
| cms | `data_cms_tool` | collection/item create/update (live or queued target) | DW |
| cms | `data_cms_tool` | delete collection items | DS |
| cms | `data_cms_tool` | publish collection items | PB |
| sites | `data_sites_tool` | list/get sites | RO |
| sites | `data_sites_tool` | publish site | PB |
| workflows | `data_workflows_tool` | list workflows/runs | RO |
| workflows | `data_workflows_tool` | run workflow | DP |
| scripts | `data_scripts_tool` | list/get scripts | RO |
| scripts | `data_scripts_tool` | add/upsert scripts | DW |
| scripts | `data_scripts_tool` | delete all site/page scripts | DS |
| components | `data_components_tool` | list/get components/properties | RO |
| components | `data_components_tool` | update component content/properties | DW (sk-design) |
| dePages | `de_page_tool` | create page/folder, switch page | DW (Designer session) |
| deElement | `element_tool` / `element_snapshot_tool` | query/select/set text-style-link-image-attributes | RO/DW (sk-design) |
| deElement | `element_tool` | remove element/attribute | DS |
| deVariable | `variable_tool` | get/query variables | RO |
| deVariable | `variable_tool` | create/update/rename variables | DW (sk-design) |
| deVariable | `variable_tool` | delete variable | DS |
| Not inspected | aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection | existence source-verified; semantics pending discovery | RO/DW default (fail closed) |

## 3. Cross-cutting capabilities

- **No auto-publish**: publishing is always a separate explicit action (1/min queue).
- **Rate discipline**: plan-based 60/120 rpm; 429 + `Retry-After`; SDK backoff default.
- **Least privilege**: read-only scopes baseline; `sites:write` only for staging publish; workspace tokens read-only.
- **Rollback**: staged-first; CMS re-publish; Designer version-history snapshot; API-level site restore UNKNOWN (treated as unsupported).
- **Pairing**: Designer-family → `sk-design`; Data-family transport-only.
