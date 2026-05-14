---
title: "01. Search tool contract"
description: "Defines the MCP `search` tool and its natural-language retrieval contract."
---

# 01. Search tool contract

Defines the MCP `search` tool and its natural-language retrieval contract. The MCP server exposes `search` for semantic discovery and `cocoindex_refresh_index` for explicit refresh.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP server exposes `search` for semantic discovery when callers do not know exact symbols or strings. Index refresh is split into `cocoindex_refresh_index` so search latency is predictable by default.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The `search` tool accepts natural language or code snippets, returns code chunks with paths and line numbers and tells callers to start with a small result limit. Status, index lifecycle and reset are intentionally outside the MCP tool surface.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:78` | MCP server | Registers the `search` tool and its description. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:95` | MCP server | Defines the async search handler. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md:271` | Reference | Documents MCP `search` and explicit refresh behavior. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:515` | Manual playbook | Indexes the MCP search tool manual scenarios. |
| `.opencode/skills/mcp-coco-index/tests/test_protocol.py:47` | Protocol | Covers search request encoding defaults. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Pytest | Covers MCP search default refresh behavior. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/01-search-tool-contract.md`

<!-- /ANCHOR:source-metadata -->
