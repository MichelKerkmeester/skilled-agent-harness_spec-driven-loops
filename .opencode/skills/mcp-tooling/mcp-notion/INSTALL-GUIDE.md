# mcp-notion Installation Guide

Complete installation and configuration for Notion workspace operations, giving AI assistants one MCP path and one direct-API path. The official Notion MCP is the primary surface: all page, block, data-source, comment, user and search CRUD, launched through Code Mode over the local stdio server. Direct Notion REST API calls are the secondary surface for the five capabilities the MCP does not expose. Notion is MCP-only — there is no headless CLI equivalent to ClickUp's `cupt`.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../../../install-guides/README.md) for complete setup.
> **Package:** `@notionhq/notion-mcp-server` (npm) | **Dependencies:** Node.js 18+ and npx; a Notion internal-integration token
> **Phase-by-phase validation:** the checkpoint reference lives in [`references/troubleshooting.md`](references/troubleshooting.md) — this front door summarizes it.

**Version:** 0.1.0.0 | **Updated:** 2026-08-21

---

## 1. OVERVIEW

| Component | Source | Package | Install | Required For |
|-----------|--------|---------|---------|-------------|
| **Official Notion MCP (local stdio)** | [github.com/makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server) · [npm](https://www.npmjs.com/package/@notionhq/notion-mcp-server) | `@notionhq/notion-mcp-server` | `.utcp_config.json` manual using stdio via `npx -y @notionhq/notion-mcp-server`; set `notion_NOTION_TOKEN` | All CRUD (primary), headless and Code Mode |
| **Direct Notion REST API** | [developers.notion.com](https://developers.notion.com/reference/intro) | — | Same `NOTION_TOKEN` bearer, `Authorization: Bearer` + `Notion-Version` headers | File uploads, views, property items, async tasks (secondary) |
| **Remote Notion MCP (OAuth)** | [mcp.notion.com](https://mcp.notion.com/mcp) | — | Streamable HTTP + OAuth 2.0 with PKCE | Interactive sessions only (not headless) |

### When to Install What

```
Need Notion access?
  │
  ├─ Headless or Code Mode (agent automation)?
  │     → local stdio MCP + NOTION_TOKEN (Sections 2-4)
  │
  ├─ File uploads, views, property items, async tasks?
  │     → local stdio MCP + direct API calls (Sections 2-5)
  │
  └─ Interactive session with a browser?
        → remote OAuth MCP at mcp.notion.com (Section 5)
```

### Architecture

```
Agent
  │
  ├── call_tool_chain("notion.notion_*")
  │     └── Code Mode MCP
  │           └── Local Notion MCP server (npx @notionhq/notion-mcp-server, stdio)
  │                 └── Notion REST API (NOTION_TOKEN bearer)
  │
  └── direct REST call (Authorization: Bearer + Notion-Version)
        └── Notion REST API (file uploads, views, property items, async tasks)
```

---

## 2. PREREQUISITES & INSTALLATION

### Prerequisites

- **Node.js 18+** and **npx** — `node --version`; the local MCP server is launched with `npx -y @notionhq/notion-mcp-server`
- **A Notion internal integration** — created at https://www.notion.so/profile/integrations, producing a token that starts with `ntn_`
- **Pages shared with the integration** — an internal integration sees only what is explicitly shared with it

### Install the Server

The local MCP server needs no separate install step. The `notion` manual in `.utcp_config.json` launches it on demand with `npx -y @notionhq/notion-mcp-server`, which fetches and runs the package. Confirm `npx` resolves it:

```bash
npx -y @notionhq/notion-mcp-server --help    # -> server usage; confirms npx can fetch it
```

If your environment blocks on-demand npx fetches, pre-install once with `npm install -g @notionhq/notion-mcp-server`.

---

## 3. AUTHENTICATION

**Create an internal integration:** open https://www.notion.so/profile/integrations, create a new integration scoped to your workspace, and copy its token. New tokens start with `ntn_` (legacy tokens start with `secret_`; both work). Treat the token as an opaque string — do not validate it with a regex.

**Set the token in `.env`:** the Code Mode manual reads `notion_NOTION_TOKEN`, which `.env.example` already lists.

```bash
# .env
notion_NOTION_TOKEN=ntn_YOUR_INTEGRATION_TOKEN_HERE
```

**Share pages and databases with the integration:** open each page or database in Notion, use the connection menu and add your integration. This is mandatory — an unshared object returns HTTP 403, and a missing share is the most common cause of "not found" confusion.

**Verify:** a `call_tool_chain(...)` call to `notion.notion_retrieve_bot_user` returns the bot identity for your integration. A 401 means the token is missing or wrong; re-copy it from Notion settings.

---

## 4. CODE MODE REGISTRATION

The registration already exists. The `notion` manual is defined in `.utcp_config.json` and launches the local stdio server with `npx -y @notionhq/notion-mcp-server`, authenticated with the `NOTION_TOKEN` env var sourced from `${notion_NOTION_TOKEN}`. You do not need to add it. This is the exact block already in place:

**Code Mode (`.utcp_config.json`, the path this skill uses):**

```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@notionhq/notion-mcp-server"],
        "env": {
          "NOTION_TOKEN": "${notion_NOTION_TOKEN}"
        }
      }
    }
  }
}
```

Restart your AI client after editing `.env`. Tool naming follows `notion.notion_{tool_name}`; the underlying tool ids are hyphenated (`retrieve-a-page`, `create-a-page`, `query-data-source`), so confirm every name with `list_tools()`/`tool_info()`, never guess. Do not add this server to `opencode.json` — that file is for native, non-Code-Mode MCP tools.

**MCP smoke test (Code Mode):**

```typescript
const result = await call_tool_chain([{
  tool: "notion.notion_retrieve_bot_user",
  input: {}
}]);
// Should return the bot user identity for your integration
```

---

## 5. DUAL-BACKEND CONFIGURATION

Notion ships two MCP backends. The local stdio server is what Code Mode uses; the remote OAuth server is an interactive-only alternative.

| Dimension | Local stdio server (deprecated) | Remote Notion MCP (recommended) |
|---|---|---|
| **Endpoint** | `npx -y @notionhq/notion-mcp-server` (stdio) | `https://mcp.notion.com/mcp` (Streamable HTTP) |
| **Auth** | `NOTION_TOKEN` bearer (internal integration or PAT) | OAuth 2.0 with PKCE, interactive |
| **Headless** | Yes | No — requires a browser authorization step |
| **Tool names** | `create-a-page`, `retrieve-a-page`, … | `notion-create-pages`, `notion-update-page`, … |
| **API version** | `2025-09-03`, and `2026-03-11` for markdown tools | current, auto-updated |
| **Maintenance** | No longer actively maintained; may be sunset | Actively supported |

**Why Code Mode uses local stdio:** the remote OAuth server cannot complete its browser authorization in a headless context, so it is unusable from Code Mode. The local server authenticates with a static token and runs headless. Its deprecation is a known risk to migrate around, not a reason to avoid it for automation.

**Direct API for the five gaps:** file uploads, views, non-truncated page property items and async-task polling are not exposed by the local MCP. Call them directly against the Notion REST API with the same token:

```bash
# Example: non-truncated property items the page object truncates
curl -s https://api.notion.com/v1/pages/PAGE_ID/properties/PROPERTY_ID \
  -H "Authorization: Bearer ${notion_NOTION_TOKEN}" \
  -H "Notion-Version: 2025-09-03"
# -> full paginated property values (see references/api-gap-tools.md)
```

Respect the rate limit on both paths: about 3 requests per second per integration. On HTTP 429 or 529, honor the `Retry-After` header and back off with jitter.

---

## 6. VERIFICATION

```typescript
// 1. Token and connection
await call_tool_chain([{ tool: "notion.notion_retrieve_bot_user", input: {} }]);
// -> bot user identity (confirms NOTION_TOKEN works)

// 2. Tools registered
list_tools();
// -> 24 notion.notion_* tools appear

// 3. Read a shared database
await call_tool_chain([{ tool: "notion.notion_retrieve-a-database", input: { database_id: "DB_ID" } }]);
// -> database metadata including data-source IDs (confirms sharing works)
```

```bash
# 4. Direct-API gap path
curl -s https://api.notion.com/v1/users/me \
  -H "Authorization: Bearer ${notion_NOTION_TOKEN}" \
  -H "Notion-Version: 2025-09-03"
# -> bot user JSON (confirms the direct-API path and token)
```

All four succeed: both surfaces are working. The full validation ladder and STOP conditions live in [`references/troubleshooting.md`](references/troubleshooting.md) — run it when an install misbehaves or when validating a fresh machine end to end.

---

## 7. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| HTTP 401 `unauthorized` | Token missing, wrong or revoked | Re-copy the `ntn_` token and set `notion_NOTION_TOKEN` in `.env` |
| HTTP 403 on a real page | Object not shared with the integration | Open the object, use the connection menu, add the integration |
| HTTP 404 `object_not_found` | Wrong ID, or object not shared | Verify the page or database ID and confirm it is shared |
| HTTP 429 / 529 | Over the ~3 requests/second limit, or Notion overloaded | Honor `Retry-After`, back off with jitter, centralize retries in the HTTP layer |
| HTTP 400 `validation_error` | Property schema or formula value invalid | Read the data-source schema first; check property types and formula syntax |
| MCP: connection refused | Manual missing, `npx` unavailable, or token unset | Verify the `notion` manual, `npx -y @notionhq/notion-mcp-server`, and `notion_NOTION_TOKEN` |
| MCP: tool not found | Wrong tool name or version drift | Use `notion.notion_{tool_name}`; confirm with `list_tools()`/`tool_info()` |
| Remote MCP prompts for OAuth in a headless run | Remote server cannot authorize headless | Use the local stdio server for headless and Code Mode work |

Full diagnosis and recovery: [`references/troubleshooting.md`](references/troubleshooting.md).

---

## 8. RESOURCES

| Resource | Purpose |
|----------|---------|
| [`SKILL.md`](SKILL.md) | Routing rules, agent invariants, dual-backend selection, quick reference |
| [`README.md`](README.md) | Human-facing overview with feature tables and FAQ |
| [`references/mcp-tools.md`](references/mcp-tools.md) | The 24-tool official MCP catalog by domain, with invocation |
| [`references/api-gap-tools.md`](references/api-gap-tools.md) | Direct Notion REST API calls for the five gap capabilities |
| [`references/property-types.md`](references/property-types.md) | The 22 property types with schema, value, filter and sort semantics |
| [`references/database-model.md`](references/database-model.md) | Hierarchy, relations, rollups (14 functions) and Formulas 2.0 |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Error reference, rate-limit and version doctrine, deprecation migration |

---

**Need help?** See [Troubleshooting](#7-troubleshooting) or load the `mcp-notion` skill for detailed workflows.
