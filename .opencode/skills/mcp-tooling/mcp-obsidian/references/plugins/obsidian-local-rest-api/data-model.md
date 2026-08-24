---
title: "Obsidian Local REST API Plugin Data Model"
description: "The plugin's data.json config surface, the OBSIDIAN_API_KEY/OBSIDIAN_BASE_URL/OBSIDIAN_VERIFY_SSL env keys the cyanheads MCP reads, and the plugin's two loopback endpoints (HTTP 27123, HTTPS/MCP 27124)."
trigger_phrases:
  - "local rest api data model"
  - "obsidian local rest api data json"
  - "obsidian api key env var"
  - "obsidian base url"
  - "obsidian verify ssl"
  - "local rest api port"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Obsidian Local REST API Plugin Data Model

The plugin persists its own configuration inside the Obsidian app; the cyanheads MCP that rides on it reads three environment values. Every fact below is confirmed against `SKILL.md`, `references/mcp-tools.md` and `references/troubleshooting.md` unless flagged `VERIFY`.

---

## 1. OVERVIEW

### Storage and surface model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Plugin settings | `.obsidian/plugins/obsidian-local-rest-api/data.json` | `VERIFY` exact keys — not yet confirmed in this skill (see §4) |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this reference set is loaded for a live vault) |
| REST surface | HTTP `27123` / HTTPS+MCP `27124` on loopback | No — the AI calls it through the cyanheads MCP tool surface, never raw HTTP, except for the diagnostic `curl` in `workflows.md`/`troubleshooting.md` |
| API key | Bearer token, copied from the plugin's settings pane | No — generated in-app; the AI reads it from env, never generates or invents one |

### Core contract

- The plugin requires a **running Obsidian app** with the target vault open — it has no headless mode.
- Auth is a static bearer token, not an OAuth flow.
- Both endpoints listen on **loopback only** (`127.0.0.1`).
- Two different tool surfaces can ride on this one plugin (§3) — never assume which one `OBSIDIAN_BASE_URL` currently points at without confirming via `list_tools()`.

---

## 2. ENV KEYS THE CYANHEADS MCP READS

Confirmed from `SKILL.md` §3 and `references/mcp-tools.md` §3:

| Env var (shell/agent) | Code Mode manual key | Default | Purpose |
| --- | --- | --- | --- |
| `OBSIDIAN_API_KEY` | `obsidian_OBSIDIAN_API_KEY` | — (required) | The Local REST API bearer token |
| `OBSIDIAN_BASE_URL` | `obsidian_OBSIDIAN_BASE_URL` | `http://127.0.0.1:27123` | The plugin's REST endpoint the cyanheads MCP calls |
| `OBSIDIAN_VERIFY_SSL` | `obsidian_OBSIDIAN_VERIFY_SSL` | `false` | Whether to verify the plugin's self-signed TLS cert |

The `obsidian_` prefix on each Code Mode key matches the `obsidian` manual name in `.utcp_config.json`, so `${obsidian_OBSIDIAN_API_KEY}` resolves to the shell/agent env var `OBSIDIAN_API_KEY`. This wiring is already live in `.utcp_config.json` and `.env.example` — this reference set documents it, it does not modify those files (`SKILL.md` §4, "Never auto-modify `.utcp_config.json`, `.env.example`, `opencode.json`, or hub files").

---

## 3. THE TWO ENDPOINTS

| Endpoint | Port | Protocol | Consumer |
| --- | --- | --- | --- |
| REST API (default) | `27123` | HTTP | cyanheads `obsidian-mcp-server` (`obsidian_*` tools) — the default wiring this skill documents |
| Plugin's own MCP | `27124` | HTTPS (self-signed), path `/mcp/` | The plugin's built-in Streamable HTTP MCP (`vault_*` tools, v5.1.0+) — an alternate surface, out of scope for the default wiring |

Both endpoints listen on loopback (`127.0.0.1`) only. `OBSIDIAN_VERIFY_SSL=false` is documented as safe specifically because the endpoint never leaves loopback with a self-signed cert — never point `OBSIDIAN_BASE_URL` at a non-loopback host while verification is off (`references/mcp-tools.md` §3).

---

## 4. PLUGIN SETTINGS FILE (`data.json`) — VERIFY

The plugin persists its own configuration at `.obsidian/plugins/obsidian-local-rest-api/data.json`. Its existence and general purpose are a reasonable inference from the plugin's documented role — it must store the bound port(s), which protocol(s) are enabled, the generated API key (or a reference to where Obsidian stores it), and an SSL-related toggle to produce the behavior `SKILL.md`/`references/mcp-tools.md`/`references/troubleshooting.md` already document. **No exact key name has been confirmed against an installed plugin or its source in this pass.** Expect it to cover, at minimum:

- The bound port(s) for HTTP and HTTPS (defaults align with `27123` / `27124`)
- Whether HTTPS (and the plugin's own MCP endpoint) is enabled
- The generated API key, or a pointer to where Obsidian stores it
- An SSL-verification-related toggle equivalent in effect to `OBSIDIAN_VERIFY_SSL`

**VERIFY the exact key names against a real `data.json` or the plugin's source before writing a production file** — do not invent a key name and present it as confirmed. Read the setting from the plugin's own in-app settings pane instead of writing this file blind (see `workflows.md` §2).

---

## 5. WHAT THE AI MUST NOT DO

- Never invent `data.json` key names; that surface is `VERIFY` (§4).
- Never hardcode the API key or base URL — read from env (§2).
- Never claim the plugin's own `vault_*` MCP endpoint when the default wiring is the cyanheads `obsidian_*` surface — confirm with `list_tools()`.
- Never claim the endpoint is reachable while Obsidian is closed — the REST endpoint requires a running app (`workflows.md` §2).
- Never enable `OBSIDIAN_VERIFY_SSL` outside a trusted loopback deployment.
