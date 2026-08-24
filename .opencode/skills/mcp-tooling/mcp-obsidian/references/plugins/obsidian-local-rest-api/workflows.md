---
title: "Obsidian Local REST API Plugin Workflows"
description: "Safe recipes for enabling the Local REST API plugin, reading its API key, and pointing the cyanheads obsidian-mcp-server at it, including the app-must-be-running boundary."
trigger_phrases:
  - "enable local rest api"
  - "obsidian api key setup"
  - "wire obsidian mcp"
  - "point mcp at local rest api"
  - "obsidian rest api workflow"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Obsidian Local REST API Plugin Workflows

Safe recipes for enabling the plugin, reading its API key, and pointing the cyanheads MCP at it. File writes are minimal here — this plugin is operated mostly through its own in-app settings pane and through environment variables, not through direct `data.json` edits (see `data-model.md` §4).

---

## 1. OVERVIEW

### Operating sequence

1. Confirm Obsidian is running with the target vault open — the plugin only serves while the app is live.
2. Enable the plugin (§2) and confirm its port/protocol in the plugin's own settings pane — this reference set does not confirm the `data.json` key names, so read the setting from the in-app UI rather than writing the file blind.
3. Copy the generated API key from the settings pane.
4. Set `OBSIDIAN_API_KEY` / `OBSIDIAN_BASE_URL` / `OBSIDIAN_VERIFY_SSL` in the environment Code Mode reads (already wired as `obsidian_OBSIDIAN_*` in `.utcp_config.json` — never edit that file, `SKILL.md` §4).
5. Restart the AI client / reconnect Code Mode so the new env values take effect.
6. Verify with `list_tools()` against the `obsidian` manual, or a diagnostic `curl` (§4).

---

## 2. ENABLE THE PLUGIN

Goal: get the REST API listening on loopback for the cyanheads MCP to reach.

### Steps

1. In Obsidian: **Settings → Community plugins → Browse → install "Local REST API"** (need v4.0.0+ for the cyanheads MCP path; v5.1.0+ if the plugin's own built-in MCP endpoint is also wanted).
2. Enable it from the Community plugins list.
3. Open its settings and confirm the bound port(s) — default HTTP `27123`; HTTPS/plugin-MCP `27124`.
4. Confirm the app is running with the target vault open before any downstream step — the endpoint dies when the app closes.

### Checkpoint

`plugin_enabled_and_listening`: `community-plugins.json` lists `obsidian-local-rest-api` as enabled, and the app is confirmed running with the vault open.

---

## 3. READ THE API KEY AND WIRE THE MCP

Goal: get `OBSIDIAN_API_KEY` into the environment Code Mode reads, without hardcoding it anywhere.

### Steps

1. In the plugin's settings pane, copy the generated API key.
2. Set it as `OBSIDIAN_API_KEY` in the environment Code Mode sees (shell env, agent runtime env, or wherever `.env`/`.env.example` values are sourced from for this deployment) — never paste it into a note, command, or this reference set.
3. Confirm `OBSIDIAN_BASE_URL` (`http://127.0.0.1:27123` default) and `OBSIDIAN_VERIFY_SSL` (`false` default) are set or left at default.
4. Restart the AI client / reconnect Code Mode.
5. Re-confirm the env var is present (for example `printenv OBSIDIAN_API_KEY >/dev/null && echo set`) without printing the secret value itself in shared output.

### Checkpoint

`api_key_wired`: `OBSIDIAN_API_KEY` is present in the Code Mode environment and was never written into a file this skill tracks (`.utcp_config.json` already interpolates it as `${obsidian_OBSIDIAN_API_KEY}` — this reference set does not modify that file).

---

## 4. VERIFY THE ENDPOINT (DIAGNOSTIC ONLY)

Goal: confirm the REST API is reachable before routing a request to the MCP.

### Steps

1. Run the diagnostic `curl` from `../../troubleshooting.md` §3:
   ```bash
   curl -sk -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
     "${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}/" | head -c 200
   ```
2. A response (not a connection error) confirms the app + plugin + token are all live.
3. Confirm the `obsidian` manual's tools enumerate via `list_tools()` before routing any note operation to MCP.

### Checkpoint

`endpoint_reachable`: the diagnostic `curl` returns a response (not connection-refused/timeout), and `list_tools()` against the `obsidian` manual succeeds.

---

## 5. APP-MUST-BE-RUNNING BOUNDARY

The plugin's REST endpoint (and its own MCP endpoint) exist only while Obsidian is open with the vault loaded. There is no headless mode for this plugin — when no app is running, route the task to `notesmd-cli` instead (`../../obsidian-cli-commands.md`); never fight to make this surface work headlessly.

### Checkpoint

`app_running_confirmed_before_mcp_route`: the app's live state was confirmed (not assumed) before any MCP call was attempted.

---

## 6. VERIFYING

Run these named checkpoints after any Local REST API operation:

| Checkpoint | What it proves |
| --- | --- |
| `plugin_enabled_and_listening` | The plugin is enabled and the app is running with the vault open |
| `api_key_wired` | `OBSIDIAN_API_KEY` is set in the Code Mode env, never hardcoded |
| `endpoint_reachable` | The diagnostic `curl` and `list_tools()` both succeed |
| `app_running_confirmed_before_mcp_route` | The app's live state was verified, not assumed, before routing to MCP |

Any step that fails routes to `troubleshooting.md`.
