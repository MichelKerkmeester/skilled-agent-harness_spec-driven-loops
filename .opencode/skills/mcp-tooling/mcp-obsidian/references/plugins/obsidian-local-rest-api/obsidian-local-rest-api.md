---
title: "Obsidian Local REST API Plugin Index"
description: "Lean entry point for the Local REST API plugin (coddingtonbear/obsidian-local-rest-api): the HTTP/HTTPS REST backend the cyanheads obsidian-mcp-server rides on, its two endpoints, and its own alternate built-in MCP surface."
trigger_phrases:
  - "local rest api"
  - "obsidian local rest api"
  - "obsidian-local-rest-api"
  - "obsidian api key"
  - "rest api plugin"
  - "vault rest api"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Obsidian Local REST API Plugin Index (`obsidian-local-rest-api`)

The `mcp-obsidian` mode treats the Local REST API plugin as **the HTTP/HTTPS backend the cyanheads `obsidian-mcp-server` rides on** — it never talks to the plugin directly for note content, only through the cyanheads MCP's `obsidian_*` tool surface (or, as a separate alternate surface, the plugin's own built-in MCP endpoint).

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`coddingtonbear/obsidian-local-rest-api`](https://github.com/coddingtonbear/obsidian-local-rest-api) | Source of behavior facts |
| Obsidian plugin id | `obsidian-local-rest-api` | Plugin directory name under `.obsidian/plugins/` and enablement entry in `community-plugins.json` |
| Display name | **Local REST API** | Name shown in Community Plugins → Browse |
| Version required (cyanheads MCP path) | **v4.0.0+** | The minimum this skill's default `obsidian` MCP manual (cyanheads `obsidian-mcp-server`) needs |
| Version required (plugin's own MCP endpoint) | **v5.1.0+** | Needed only for the plugin's built-in Streamable HTTP MCP at `/mcp/` — a separate, alternate surface from the cyanheads MCP |
| What it exposes | An HTTP/HTTPS REST API over the vault | The cyanheads MCP (and any other REST-API client) talks to a running Obsidian app through this API — never to the filesystem directly |
| Default HTTP endpoint | `http://127.0.0.1:27123` | `OBSIDIAN_BASE_URL` default; the cyanheads MCP's target |
| Alternate HTTPS/MCP endpoint | `https://127.0.0.1:27124/mcp/` | The plugin's own built-in MCP, self-signed TLS, `vault_*` tools |
| Auth | Bearer token (`OBSIDIAN_API_KEY`) | Copied from the plugin's own settings pane; no OAuth flow |

Not yet installed in this repository — this skill has no live test vault. Every fact in this reference set is drawn from what `SKILL.md`, `references/mcp-tools.md` and `references/troubleshooting.md` already document about the plugin's confirmed env-var contract and endpoints; the exact `data.json` config-key names are `VERIFY` (see `data-model.md` §4).

---

## 2. HOW IT WORKS

The plugin runs inside a live Obsidian app and listens on loopback for HTTP (default `27123`) and HTTPS (self-signed cert, plugin's own MCP at `27124`) requests. It requires the app to be running with the target vault open — closing the app kills both endpoints. A bearer token generated in the plugin's own settings pane authorizes every request; there is no OAuth flow.

Two different clients can talk to this one plugin: (1) the cyanheads `obsidian-mcp-server` (this skill's default MCP, `obsidian_*` tools, launched via `npx -y obsidian-mcp-server@latest`), which uses the plugin only as its REST backend; and (2) the plugin's **own** built-in Streamable HTTP MCP endpoint (`vault_*` tools, v5.1.0+), a separate server surface at `/mcp/`. Do not conflate the two tool namespaces — always confirm with `list_tools()` before calling either.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The plugin's `data.json` config surface, the env keys the cyanheads MCP reads, and the two endpoint/port pair |
| [`workflows.md`](workflows.md) | Enabling the plugin, reading the API key, pointing the MCP at it, and the app-must-be-running boundary |
| [`troubleshooting.md`](troubleshooting.md) | MCP-not-found, auth failures, SSL/`OBSIDIAN_VERIFY_SSL`, and port conflicts |

The cyanheads MCP tool catalog that rides on this plugin lives in [`../../mcp-tools.md`](../../mcp-tools.md). General install/auth/connection troubleshooting for the whole `mcp-obsidian` skill lives in [`../../troubleshooting.md`](../../troubleshooting.md) — this reference set is the plugin-specific supplement, not a replacement.

---

## 4. GUARDRAILS

- **Never hardcode the API key or base URL** in commands or notes — read them from `obsidian_OBSIDIAN_API_KEY` / `obsidian_OBSIDIAN_BASE_URL` in the Code Mode environment (`SKILL.md` §4).
- **Never enable `OBSIDIAN_VERIFY_SSL` blindly** — it defaults to `false`; only turn it on behind a trusted TLS endpoint.
- **Never conflate the two MCP surfaces.** The cyanheads `obsidian_*` tools and the plugin's own `vault_*` tools are different servers over the same REST backend — confirm with `list_tools()`.
- **Never claim the plugin is reachable without a running Obsidian app.** Both its REST endpoint and its own MCP endpoint require the app open with the vault loaded.
- **Never invent exact `data.json` key names.** This reference set documents the confirmed env-var contract and endpoints; the plugin's own settings-file schema is `VERIFY` (see `data-model.md` §4).
