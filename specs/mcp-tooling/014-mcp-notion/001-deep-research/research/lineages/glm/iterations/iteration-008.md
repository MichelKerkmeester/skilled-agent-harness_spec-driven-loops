# Iteration 8: Auth + Runtime — Token Model, Rate Limits, Headless/Code Mode Constraints

## Focus
Document the authentication model (three token types, OAuth for remote MCP), rate limits (3 r/s with Retry-After), and the headless/Code Mode constraints. This defines the runtime doctrine the mode must encode for auth setup, rate-limit handling, and the local-stdio → remote-OAuth migration path.

## Findings

### F8.1 — Three token types, two auth models

The Notion API supports three token types, each with a different identity and access model:

| Token type | Prefix | Auth model | Identity | Scope | Best for |
|---|---|---|---|---|---|
| **Internal connection token** | `ntn_` (new) / `secret_` (legacy) | Static bearer token | Bot user (independent of any person) | One workspace; pages must be explicitly shared | Automated workflows, scripts, CI |
| **Personal access token (PAT)** | `ntn_` | Static bearer token | The user who created it | One workspace; inherits user's access | Personal scripts, CLI workflows |
| **Public connection OAuth token** | `ntn_` (from OAuth flow) | OAuth 2.0 with PKCE | The user who authorized | Any workspace (per installation scope) | Public integrations, multi-workspace |

**Token format change**: As of September 25, 2024, new tokens use `ntn_` prefix instead of `secret_`. Existing `secret_` tokens continue to work. Notion advises against regex-based token validation — treat tokens as opaque strings.

**Auth header**: `Authorization: Bearer {token}` + `Notion-Version: 2026-03-11` (or `2025-09-03`)

[SOURCE: https://developers.notion.com/reference/authentication] [SOURCE: https://developers.notion.com/guides/get-started/authorization] [SOURCE: https://github.com/ramnes/notion-sdk-py/issues/245]

### F8.2 — Two MCP server backends with fundamentally different auth

| Dimension | Open-source local server (deprecated) | Remote Notion MCP (recommended) |
|---|---|---|
| **URL** | `npx -y @notionhq/notion-mcp-server` (stdio) | `https://mcp.notion.com/mcp` (Streamable HTTP) or `/sse` (SSE) |
| **Auth** | `NOTION_TOKEN` bearer token (internal connection or PAT) | **OAuth 2.0 with PKCE** (interactive, user-based) |
| **Headless?** | ✅ Yes — token-based, no human interaction | ❌ No — requires interactive OAuth approval |
| **Permissions** | Only pages explicitly shared with the connection | Inherits the authorizing user's full Notion access |
| **Maintenance** | No longer actively maintained; may be sunset | Actively supported, receives updates |
| **Tool names** | `create-a-page`, `retrieve-a-page`, etc. | `notion-create-pages`, `notion-update-page`, etc. (different naming) |
| **API version** | 2025-09-03 (most tools), 2026-03-11 (markdown tools) | Current (auto-updated) |

**Critical constraint**: The remote MCP server does NOT accept internal integration tokens. You cannot use an `ntn_` token from a public connection's OAuth flow directly — you must initiate OAuth with the MCP server itself (`https://mcp.notion.com/mcp`). Tokens from Notion's public connection OAuth are not compatible with the remote MCP server's OAuth.

[SOURCE: https://developers.notion.com/guides/mcp/build-mcp-client] [SOURCE: https://developers.notion.com/guides/mcp/hosting-open-source-mcp] [SOURCE: https://github.com/makenotion/notion-mcp-server/issues/106]

### F8.3 — Headless/Code Mode constraint: the fundamental tension

This is the core runtime constraint for mcp-notion:

**The recommended backend (remote MCP) requires interactive OAuth** — a human must complete the OAuth flow in a browser. This is incompatible with:
- Headless server automation
- CI/CD pipelines
- Unattended agent workflows
- Code Mode in a headless context (no browser)

**The deprecated backend (local stdio server) supports token-based auth** — `NOTION_TOKEN` works headlessly, but the server is no longer actively maintained and may be sunset.

**The mode must support both backends** and route based on runtime context:
- **Headless/Code Mode** → local stdio server with `NOTION_TOKEN` (with deprecation warning)
- **Interactive (browser available)** → remote MCP with OAuth (recommended path)

This dual-backend support is the strongest argument for the build verdict (iteration 5): a thin transport cannot abstract backend switching, but a light workflow skill can route between them.

### F8.4 — Rate limits: 3 requests/second per integration

(Consolidated from iteration 2, F2.5, with additional detail)

- **Per connection**: average 3 requests/second, with some bursts allowed
- **Per workspace**: shared across all connections, scaled to plan (Free: ~10 r/s, Plus: ~25 r/s, Business: ~50 r/s, Enterprise: ~100 r/s)
- **Secondary limit**: ~1000 requests per 5 minutes per workspace
- **HTTP 429**: `rate_limited` error code, `Retry-After` header (integer seconds), `additional_data.rate_limit_reason`
- **HTTP 529**: `service_overload` — retry same as 429
- **No published way to raise the 3 r/s limit** for standard integrations
- **Token bucket implementation**: burst up to 3 requests, then ~333ms wait before next

**Mode doctrine for rate limiting**:
1. Centralize retries in the HTTP layer (not per-tool)
2. Respect `Retry-After` header with exponential backoff + jitter
3. Queue requests to stay under 3 r/s (333ms minimum spacing)
4. Handle both 429 (rate limited) and 529 (service overloaded) identically
5. For batch operations (bulk page creation, database queries with many results), implement pagination with rate-limit-aware delays

[SOURCE: https://developers.notion.com/reference/request-limits] [SOURCE: https://novumos.app/learn/notion-api-rate-limits]

### F8.5 — Code Mode integration model

Based on the mcp-obsidian pattern (iteration 3, F3.1), the Code Mode integration for mcp-notion would be:

**For the local stdio server (headless path)**:
```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@notionhq/notion-mcp-server@latest"],
        "env": {
          "NOTION_TOKEN": "${notion_NOTION_TOKEN}",
          "OPENAPI_MCP_VERSION": "2025-09-03"
        }
      }
    }
  }
}
```

**For the remote MCP (interactive path)**:
- Requires Streamable HTTP transport to `https://mcp.notion.com/mcp`
- Requires OAuth 2.0 with PKCE — must complete interactive flow
- Code Mode would need to support HTTP transport + OAuth token management
- Token refresh handling required

**Env vars** (analogous to mcp-obsidian's `obsidian_OBSIDIAN_*`):
- `notion_NOTION_TOKEN` — internal connection or PAT token (local server path)
- `notion_NOTION_VERSION` — API version (default `2025-09-03`)

### F8.6 — Auth setup doctrine (install guide)

The mode's `INSTALL-GUIDE.md` must encode:

1. **Choose auth model**: headless (local stdio + token) vs interactive (remote MCP + OAuth)
2. **Create internal connection**: Settings → Connections → Add new → copy `ntn_` token
3. **Share pages with connection**: explicitly share pages/databases the connection needs
4. **Set env vars**: `notion_NOTION_TOKEN` in `.env` (or OAuth token for remote)
5. **Register in `.utcp_config.json`**: the `notion` manual with stdio transport
6. **Verify**: `list_tools()` shows 24 `notion_*` tools; `retrieve-a-database` returns data
7. **Rate limit awareness**: document the 3 r/s constraint and retry behavior
8. **Deprecation warning**: the local server is deprecated; plan for remote MCP migration

### F8.7 — Error handling doctrine (troubleshooting)

| Error | Code | Recovery |
|---|---|---|
| Unauthorized | 401 | Token missing, wrong, or expired — re-copy from Notion settings |
| Forbidden | 403 | Page not shared with connection — share via "Add connections" menu |
| Rate limited | 429 | Respect `Retry-After` header; implement backoff + jitter |
| Service overloaded | 529 | Retry same as 429 |
| Not found | 404 | Check page/database ID; ensure it's shared with connection |
| Validation error | 400 | Check property schema; formula expressions validated on save |
| Connection refused (MCP) | — | Server not running; check `npx` availability and `NOTION_TOKEN` |
| Tool not found (MCP) | — | Run `list_tools()` to enumerate; tool names may differ by version |

## Sources Consulted
- https://developers.notion.com/reference/authentication (bearer token auth)
- https://developers.notion.com/guides/get-started/authorization (three token types)
- https://developers.notion.com/guides/get-started/public-connections (OAuth 2.0 flow)
- https://developers.notion.com/guides/mcp/build-mcp-client (remote MCP OAuth with PKCE)
- https://developers.notion.com/guides/mcp/hosting-open-source-mcp (deprecation status)
- https://github.com/makenotion/notion-mcp-server/issues/106 (token incompatibility with remote MCP)
- https://github.com/ramnes/notion-sdk-py/issues/245 (ntn_ prefix change)
- https://www.gamut.so/blog/notion-mcp-server-setup-guide (hosted vs self-hosted comparison)
- https://tygartmedia.com/notion-mcp-claude-setup (practical setup guide)
- https://developers.notion.com/reference/request-limits (rate limits)
- https://novumos.app/learn/notion-api-rate-limits (rate limit analysis)

## Assessment
- **newInfoRatio: 0.70** — The three-token-type model, remote MCP OAuth requirement, token incompatibility issue, and dual-backend routing doctrine are net-new. Rate limits were partially covered in iteration 2 but now with mode-specific doctrine.
- **Novelty justification**: Auth model comparison (local token vs remote OAuth), the headless constraint analysis, Code Mode integration model, and error handling doctrine are all net-new.
- **Confidence**: High — sourced from official Notion docs + GitHub issues + practical setup guides.

## Reflection
- **What worked**: Official docs for auth model; GitHub issue #106 for the critical token incompatibility; practical guides for the hosted-vs-self-hosted comparison.
- **What failed**: Nothing significant.
- **Ruled out**: **Remote MCP as the sole backend** — requires interactive OAuth, incompatible with headless/Code Mode. The mode must support the local stdio server for headless operation despite deprecation.

## Recommended Next Focus
Iteration 9: API version pinning + 015 migration tie-in. Document the API version landscape (2022-06-28, 2025-09-03, 2026-03-11), which tools require which version, how the mode should pin versions, and how the 015 Notion→Obsidian migration spec relates to mcp-notion (is mcp-notion also a migration enabler?).
