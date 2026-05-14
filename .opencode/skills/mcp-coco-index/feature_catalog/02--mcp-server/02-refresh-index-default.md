---
title: "02. Refresh-index default"
description: "Keeps MCP searches no-refresh by default and preserves explicit refresh."
---

# 02. Refresh-index default

Keeps MCP searches no-refresh by default and preserves explicit refresh. The `search` tool defaults `refresh_index=false` so search latency is predictable; callers can use `cocoindex_refresh_index` or `search(refresh_index=true)` when they need fresh indexing first.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP `search` tool defaults `refresh_index=false`. Fresh-index reads are opt-in through `cocoindex_refresh_index` or explicit `search(refresh_index=true)`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The server calls `client.index(project_root)` before search only when `refresh_index` is true. The separate `cocoindex_refresh_index` tool calls the same daemon refresh path without performing a search.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:116` | MCP schema | Defines `refresh_index` with default `false`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:171` | MCP server | Runs daemon indexing before search only when refresh is enabled. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:236` | MCP server | Registers `cocoindex_refresh_index` as explicit refresh without search. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md:317` | Reference | Documents the explicit refresh tool. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:241` | Manual playbook | Documents refresh/no-refresh query strategy. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Pytest | Covers default no-refresh search, explicit refresh-before-search, and refresh-without-search. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/02-refresh-index-default.md`

<!-- /ANCHOR:source-metadata -->
