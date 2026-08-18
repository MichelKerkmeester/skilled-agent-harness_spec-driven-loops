---
title: "MCP stdio transport (sk-vision-mcp)"
description: "Exposes all 13 sk-vision tools through one shared MCP stdio server used by Cursor and Devin."
trigger_phrases:
  - "MCP stdio transport (sk-vision-mcp)"
  - "sk-vision MCP server"
  - "Cursor Devin vision tools"
  - "sk-vision-mcp"
version: 1.0.0.0
---

# MCP stdio transport (sk-vision-mcp)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Exposes all 13 sk-vision tools through one shared MCP stdio server used by Cursor and Devin.

The transport is additive to the native OpenCode plugin and Pi extension. MCP-only hosts receive the same tool names, input schemas, handlers, provider behavior, and NDJSON runtime path without a host-specific code fork.

---

## 2. HOW IT WORKS

The built `vision-runtime/dist/mcp-server.js` process communicates over stdin/stdout using MCP. It registers every definition from the shared `skVisionTools` registry and delegates requests through `PhotonProvider` and `RuntimeClient`; MCP `tools/list` therefore advertises the complete 13-tool surface.

Cursor starts the process from `.cursor/mcp.json` under the server key `sk-vision`. Devin starts the same process from `.devin/mcp_config.json`; Devin's host namespace turns an underlying name such as `sk_vision_status` into `mcp__sk-vision__sk_vision_status`.

Both repository configs use `node` with one absolute argument to the built server. Moving the checkout requires updating that path. MCP hosts support explicit tool calls but do not receive the native OpenCode/Pi image-attachment hooks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/mcp/server.ts` | Handler | MCP registration, text-result framing, stdio lifecycle, and runtime cleanup |
| `vision-runtime/package.json` | Script | `sk-vision-mcp` bin metadata and MCP dependency |
| `.cursor/mcp.json` | Script | Cursor repository registration for the built stdio server |
| `.devin/mcp_config.json` | Script | Devin repository registration for the built stdio server |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/src/mcp/server.test.ts` | MCP integration test | Initializes the server, asserts 13 tools, and calls status without model weights |
| `manual-testing-playbook/host-adapters/mcp-standalone.md` | Manual playbook | Validates direct Node launch and `tools/list` |
| `manual-testing-playbook/host-adapters/cursor-mcp.md` | Manual playbook | Validates Cursor config and host attach |
| `manual-testing-playbook/host-adapters/devin-mcp.md` | Manual playbook | Validates Devin config, attach, and namespacing |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/mcp-transport.md`

Related references:
- [opencode-plugin.md](opencode-plugin.md) - native OpenCode adapter with attachment hooks
- [pi-extension.md](pi-extension.md) - native Pi adapter with attachment hooks
