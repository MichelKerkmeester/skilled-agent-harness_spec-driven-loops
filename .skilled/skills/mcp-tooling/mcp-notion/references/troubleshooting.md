---
title: "mcp-notion Troubleshooting Guide"
description: "Error recovery for the Notion MCP and direct API calls: 401/403 auth and sharing, 429 rate-limit backoff, API-version mismatch, data-source-vs-database confusion, the local-to-remote MCP migration, and manual-not-found."
trigger_phrases:
  - "notion mcp error"
  - "notion 401 unauthorized"
  - "notion 429 rate limit"
  - "notion api version mismatch"
  - "notion data source migration"
  - "notion mcp manual not found"
importance_tier: "normal"
contextType: "general"
version: 0.1.0.0
---

# mcp-notion Troubleshooting Guide

Diagnostic recipes for the official Notion MCP server and the direct API-gap calls in `api-gap-tools.md`. Most failures fall into five classes: authentication and sharing (401/403), rate limiting (429/529), API-version mismatch (400), the data-source-vs-database model change, and backend configuration (local deprecation, manual not found). Start with Quick Diagnostics (§3), then jump to the matching section.

---

## 1. OVERVIEW

Every operation here reaches Notion over the network — there is no offline or filesystem fallback. That makes three things the usual root causes: the token, whether the target object is shared with the integration, and which `Notion-Version` the request pins. The error-code map below routes each symptom to its recipe.

| Symptom | HTTP | Section |
|---|---|---|
| Unauthorized / token rejected | 401 | §4 |
| Object exists but access denied | 403 (or 404) | §4 |
| Rate limited / service overloaded | 429 / 529 | §5 |
| Validation error on an otherwise-valid body | 400 | §6 |
| "database" call rejected, or wrong id type | 400 / 404 | §7 |
| Local server deprecated / planning remote | — | §8 |
| MCP tool or manual not found | — | §9 |

---

## 2. PREREQUISITES

- `notion_NOTION_TOKEN` available to the mode (internal-connection token or PAT; prefix `ntn_`, or legacy `secret_`).
- For MCP issues: the `notion` manual registered in `.utcp_config.json` (Code Mode's config — not `opencode.json` or `.mcp.json`), launching `npx -y @notionhq/notion-mcp-server` over stdio with `NOTION_TOKEN` in its env.
- Network access to `https://api.notion.com`.

---

## 3. QUICK DIAGNOSTICS (RUN IN ORDER)

```bash
# 1. Is the token present in the environment?
[ -n "$notion_NOTION_TOKEN" ] && echo "token set" || echo "TOKEN MISSING"

# 2. Does the token authenticate? (bot/me is the cheapest authenticated call)
curl -sS -o /dev/null -w "%{http_code}\n" https://api.notion.com/v1/users/me \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2025-09-03"
# 200 = good · 401 = token bad (§4) · 429 = rate limited (§5)

# 3. Is a specific object shared with the integration?
curl -sS -o /dev/null -w "%{http_code}\n" "https://api.notion.com/v1/pages/<page_id>" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2025-09-03"
# 200 = shared · 404/403 = not shared with this connection (§4)

# 4. Are the MCP tools registered? (Code Mode)
#    list_tools() should enumerate ~24 notion_* tools; zero = manual not registered (§9)
```

---

## 4. AUTH AND SHARING FAILURES (401 / 403)

### 401 Unauthorized

**Symptom:** any call returns 401, error code `unauthorized`.

**Causes:** token missing from the environment, mistyped, revoked, or from the wrong workspace. Note the token format changed on 2024-09-25 from `secret_` to `ntn_`; both still work — treat tokens as opaque and do not regex-validate them.

**Fix:**
```bash
# Confirm the variable is exported to the mode's environment
env | grep -c notion_NOTION_TOKEN     # expect 1

# Re-copy the token: Notion → Settings → Connections → your integration → Internal Integration Secret
# Then re-set notion_NOTION_TOKEN and re-run Quick Diagnostics step 2.
```
The remote MCP backend does NOT accept these tokens — it uses interactive OAuth. A token that works against `api.notion.com` and the local server will still 401 against `https://mcp.notion.com/mcp`. See §8.

---

### 403 Forbidden (or 404 on an object you can see in the UI)

**Symptom:** the object exists in Notion but the API returns 403, or 404 as if it did not exist.

**Root cause:** the page or data source is not shared with the integration. Notion scopes an internal connection to only the objects explicitly shared with it — being able to see something in the browser does not grant the token access.

**Fix:** in Notion, open the page/database → top-right `•••` menu → `Connections` → add your integration. Sharing a parent shares its children. Re-run Quick Diagnostics step 3; it should return 200.

---

## 5. RATE LIMIT 429 (BACKOFF PLUS JITTER)

**Symptom:** HTTP 429 (`rate_limited`) with a `Retry-After` header, or HTTP 529 (`service_overload`).

**Root cause:** an integration averages ~3 requests/second. Batch loops — multi-part uploads, paginated property reads, bulk page writes — blow through it. 529 is transient server overload and is handled identically.

**Fix — respect `Retry-After`, then back off with jitter:**
```bash
# Single-call pattern: read Retry-After and wait exactly that long before one retry
resp=$(curl -sS -D - -o /dev/null "https://api.notion.com/v1/users/me" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" -H "Notion-Version: 2025-09-03")
retry=$(printf '%s' "$resp" | awk 'tolower($1)=="retry-after:"{print $2+0}')
[ -n "$retry" ] && sleep "$retry"
```

Doctrine for the mode:
1. Centralize retries in the HTTP layer, not per-call.
2. On 429/529, honor `Retry-After` (integer seconds) first; if absent, exponential backoff (1s, 2s, 4s, ...) with random jitter.
3. Space steady-state batch calls to ~333 ms apart to stay under 3 req/s.
4. Cap retries; after the cap, surface the failure rather than hammering the API.

There is no published way to raise the 3 req/s limit for a standard integration — design batches around it.

---

## 6. API-VERSION MISMATCH (400)

**Symptom:** a request with a valid-looking body returns 400 `validation_error`, or a newer field is silently ignored / rejected.

**Root cause:** the `Notion-Version` header is wrong for that endpoint. The surface is versioned per-endpoint: core CRUD pins `2025-09-03`, while file uploads, views, and async tasks require `2026-03-11`. Sending the older version to a newer endpoint (or vice versa) fails validation.

**Fix:** match the version to the endpoint (see `api-gap-tools.md §8`):

| Operation | Notion-Version |
|---|---|
| Page / block / data-source / comment / user / search CRUD | `2025-09-03` |
| File uploads | `2026-03-11` (required) |
| Views | `2026-03-11` |
| Async tasks | `2026-03-11` |

For the local MCP server, the pinned version is set via its launch env (e.g. `OPENAPI_MCP_VERSION` / `NOTION_VERSION`) in `.utcp_config.json`; direct API calls set the header themselves.

---

## 7. DATA-SOURCE-VS-DATABASE CONFUSION

**Symptom:** a call that worked against an older Notion integration now 400s or 404s; an id that looks like a database id is rejected; a "database" query returns nothing.

**Root cause:** Notion API 2.0 migrated the primary abstraction from **databases** to **data sources**. A database is now a container that holds one or more data sources; queries, schema, and rows live on the data source, not the database. Older code that queried a "database id" is now passing the wrong id kind.

**Fix:**
- Retrieve the database to find its data source(s), then target the **data-source id** for queries and schema (`query-data-source`, not a legacy database query).
- Views (`api-gap-tools.md §4`) and property reads operate on the data source. The `parent` for a new view uses `data_source_id`.
- When an id is rejected, confirm whether the endpoint expects a `database_id` or a `data_source_id` — they are distinct and not interchangeable.

This is a model change, not a bug: there is no "fix" beyond passing the correct id kind for the endpoint.

---

## 8. LOCAL-SERVER DEPRECATION AND REMOTE-MCP MIGRATION

**Situation:** the open-source local stdio server (`@notionhq/notion-mcp-server`) is deprecated and no longer actively maintained; Notion prioritizes the remote MCP at `https://mcp.notion.com/mcp`. The mode uses the local server on purpose — it is the only backend that runs headless.

| Dimension | Local stdio (deprecated) | Remote MCP (recommended) |
|---|---|---|
| Transport / auth | stdio, `NOTION_TOKEN` bearer | Streamable HTTP, OAuth 2.0 + PKCE |
| Headless? | Yes — token, no browser | No — interactive OAuth only |
| Tool names | `create-a-page`, `retrieve-a-page`, ... | `notion-create-pages`, ... (+ async tasks) |
| Permissions | only explicitly shared objects | the authorizing user's full access |

**Migration path:**
- Headless / Code Mode / CI → stay on the local stdio server with `notion_NOTION_TOKEN`. Accept the deprecation risk; it is the only headless option.
- Interactive session with a browser → prefer the remote MCP: complete its OAuth flow (its tokens are separate — a local `ntn_` token will NOT authenticate the remote server), and use its native tool names. Async task polling (`api-gap-tools.md §6`) is built in there, so that gap disappears.
- If the local server is sunset before a headless remote path exists, the direct REST API calls in `api-gap-tools.md` remain the fallback for the whole surface, since they only need the bearer token.

---

## 9. MCP MANUAL NOT FOUND

### `notion` tools not found / `list_tools()` returns zero notion entries

**Diagnosis:**
```bash
# Confirm the notion manual is in Code Mode's config (not opencode.json / .mcp.json)
grep -A8 '"notion"' .utcp_config.json
# Expect: command "npx", args ["-y", "@notionhq/notion-mcp-server"], env NOTION_TOKEN
```

**Fix:**
1. Add/repair the `notion` manual under `manual_call_templates` in `.utcp_config.json`, with `NOTION_TOKEN` mapped from `notion_NOTION_TOKEN` and the `Notion-Version` env pinned.
2. Ensure Node.js 18+ and `npx` are available — the manual launches the server on demand.
3. Reconnect Code Mode and re-run `list_tools()`; ~24 `notion_*` tools should appear. There is no browser step for the local server.

### MCP tool call returns "tool not found"

**Cause:** wrong callable name, or the tool does not exist on this server version (local and remote use different naming — see §8).

**Fix:** run `tool_info()` / `list_tools()` to confirm the exact name before hardcoding it. Do not guess; tool names differ between the local and remote backends and can change across server versions.

---

## 10. GETTING HELP

- Notion API reference: https://developers.notion.com/reference/intro
- Rate limits: https://developers.notion.com/reference/request-limits
- Authorization / token model: https://developers.notion.com/guides/get-started/authorization
- MCP backends: https://developers.notion.com/guides/mcp/build-mcp-client (remote) and hosting-open-source-mcp (local, deprecated)
- Direct API-gap recipes: `api-gap-tools.md`; official MCP catalog: `mcp-tools.md`
