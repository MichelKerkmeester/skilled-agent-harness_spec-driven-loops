---
title: Local REST API — REST surface and built-in MCP
description: The Obsidian Local REST API plugin's own REST endpoints and its built-in Streamable-HTTP MCP, distinct from the cyanheads obsidian-mcp-server.
trigger_phrases:
  - "local rest api endpoints"
  - "obsidian rest api surface"
  - "local rest api built-in mcp"
  - "vault_ mcp tools"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Local REST API — REST surface and built-in MCP

The `obsidian-local-rest-api` plugin exposes both a plain REST API and its own built-in MCP endpoint; this documents that surface, which is separate from the cyanheads `obsidian-mcp-server` the mode's `.utcp_config` targets.

---

## 1. OVERVIEW

The Local REST API plugin (verified against installed `self: 5.1.0`, Obsidian `1.13.4`) is the app-backed bridge every MCP path in this mode ultimately rides on. It serves two surfaces on the same loopback HTTPS port:

- a **plain REST API** (the endpoints in §3), and
- a **built-in Streamable-HTTP MCP** at `/mcp/` (§4) that wraps those endpoints as MCP tools.

Do not confuse the built-in MCP with the cyanheads `obsidian-mcp-server` (npm, `obsidian_*` tools) that `references/mcp-tools.md` documents. Both talk to this same plugin; they are different servers with different tool names. Use this reference when operating the REST API directly, or when a client points at the plugin's own `/mcp/` instead of the cyanheads server.

---

## 2. AUTHENTICATION AND TRANSPORT

- **Bearer token** — every request needs `Authorization: Bearer <apiKey>`; the key is the Local REST API plugin's `apiKey` (Settings → Local REST API, or `.obsidian/plugins/obsidian-local-rest-api/data.json`). An unauthenticated request returns `authenticated: false` from `/`.
- **Loopback + self-signed TLS** — the default endpoint is `https://127.0.0.1:27124` with a self-signed certificate, so clients pass `-k` / `OBSIDIAN_VERIFY_SSL=false`. This is safe **only** because the endpoint is loopback; never send the bearer token to a non-`127.0.0.1` host with verification disabled. The plugin's cert is downloadable at `GET /obsidian-local-rest-api.crt` if a client prefers to trust it explicitly.
- **Running app required** — the plugin runs inside Obsidian, so the surface is live only while the app is open with the plugin enabled. Headless work uses `notesmd-cli` instead (see `obsidian-cli-commands.md`).

---

## 3. REST ENDPOINTS

Authoritative list, read from the plugin's own `GET /openapi.yaml` (14 paths):

| Method(s) | Path | Purpose |
|---|---|---|
| `GET` | `/` | Server status, auth state, and version manifest |
| `GET`,`POST`,`PUT`,`PATCH`,`DELETE` | `/active/` | Read / replace / append / patch / delete the **active** note |
| `GET` | `/vault/` | List the vault root |
| `GET` | `/vault/{pathToDirectory}/` | List a directory |
| `GET`,`POST`,`PUT`,`PATCH`,`DELETE` | `/vault/{filename}` | Read / append / replace / patch / delete a note by path |
| `POST` | `/search/` | Structured search (Dataview / JsonLogic query in the body) |
| `POST` | `/search/simple/` | Plain-text search |
| `GET` | `/tags/` | List all tags in the vault |
| `GET` | `/commands/` | List every registered command (core + plugin) |
| `POST` | `/commands/{commandId}/` | Execute a command by id |
| `POST` | `/open/{filename}` | Open a file in the Obsidian UI |
| `GET`,`POST` | `/mcp/` | The built-in MCP endpoint (see §4) |
| `GET` | `/openapi.yaml` | The OpenAPI spec itself |
| `GET` | `/obsidian-local-rest-api.crt` | The plugin's self-signed certificate |

The `PATCH` verbs on `/active/` and `/vault/{filename}` are the plugin's targeted-edit surface (insert relative to a heading, block reference, or frontmatter field) — richer than a raw `PUT` overwrite.

---

## 4. BUILT-IN MCP (`/mcp/`)

The plugin ships a **Streamable-HTTP MCP** at `/mcp/`, confirmed live: an `initialize` call returns `protocolVersion: 2024-11-05` and advertises `tools` and `resources` capabilities (`listChanged: true`).

- **Transport** — Streamable HTTP with Server-Sent-Event responses. A client must `initialize`, send the `notifications/initialized` acknowledgement, then issue `tools/list` / `tools/call` on the same session (the server returns an `Mcp-Session-Id` header to carry). A bare `POST /mcp/ {tools/list}` without the handshake returns nothing.
- **Tool surface** — **16 `vault_*`/search/tag/command tools** (validated live in an earlier session): `vault_read`, `vault_write`, `vault_patch`, `vault_move`, `search_simple`, `search_query`, `tag_list`, `command_list`, and further tools that mirror the REST endpoints in §3. These names belong to the plugin version, so confirm the full set and each argument shape with a live `tools/list` before hardcoding — enumerate, do not assume.
- **When to prefer it** — only when a client speaks MCP but cannot register the cyanheads `obsidian-mcp-server`, or when you specifically want the plugin's own tool surface. The mode's default MCP path remains the cyanheads server via Code Mode (`references/mcp-tools.md`).

---

## 5. WHEN TO USE WHICH SURFACE

| Need | Surface |
|---|---|
| Direct HTTP calls, scripting, or a quick probe | Local REST API endpoints (§3) |
| An MCP client that can register a stdio server | cyanheads `obsidian-mcp-server` (`references/mcp-tools.md`) |
| An MCP client pointed at the plugin's own endpoint | Built-in MCP at `/mcp/` (§4) |
| No running app (servers, CI, unattended) | `notesmd-cli` filesystem CLI (`references/obsidian-cli-commands.md`) |

---

## 6. WHAT THE AI MUST NOT DO

- Do not send the bearer token to any non-loopback host with TLS verification disabled.
- Do not assume the built-in MCP tool names; enumerate them with a live `tools/list`.
- Do not conflate the built-in `/mcp/` tools with the cyanheads `obsidian_*` tools — they are different servers.
- Do not rely on this surface when no Obsidian app is running; route to `notesmd-cli`.

---

## 7. RELATED RESOURCES

- [`mcp-tools.md`](mcp-tools.md) — the cyanheads `obsidian-mcp-server` (`obsidian_*`) surface this mode's `.utcp_config` targets.
- [`obsidian-cli-commands.md`](obsidian-cli-commands.md) — the headless `notesmd-cli` filesystem alternative.
- [`plugins/plugin-operation-logic.md`](plugins/plugin-operation-logic.md) — the file-layer operating model for the whole mode.
