---
title: "Obsidian Local REST API Plugin Troubleshooting"
description: "Cause, detection and recovery for the Local REST API plugin's own failure surface: MCP-not-found, connection refused, 401 auth failures, SSL/OBSIDIAN_VERIFY_SSL mismatches, and port conflicts."
trigger_phrases:
  - "obsidian mcp not found"
  - "local rest api connection refused"
  - "obsidian api key 401"
  - "obsidian verify ssl error"
  - "local rest api port conflict"
  - "vault tools instead of obsidian tools"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Obsidian Local REST API Plugin Troubleshooting

Cause, detection and recovery for the plugin's own failure surface — MCP-not-found, connection refused, auth failures, SSL/`OBSIDIAN_VERIFY_SSL`, and port conflicts. This supplements, and does not replace, `../../troubleshooting.md`'s general MCP connection/launch section.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| MCP tools not found | `obsidian` manual not registered in `.utcp_config.json`, or Code Mode not reconnected |
| Connection refused | Obsidian app not running, or the plugin not enabled |
| 401 Unauthorized | `OBSIDIAN_API_KEY` unset, wrong, or stale after a key regeneration |
| SSL / certificate error | Self-signed cert with `OBSIDIAN_VERIFY_SSL` mismatched to the endpoint |
| Wrong port / no response | `OBSIDIAN_BASE_URL` doesn't match the plugin's configured port |
| `vault_*` tools instead of `obsidian_*` | `OBSIDIAN_BASE_URL` points at the plugin's own `/mcp/` endpoint instead of the cyanheads server |

---

## 2. DIAGNOSIS SEQUENCE

1. Confirm the app is running with the target vault open — the plugin serves nothing otherwise.
2. Confirm the plugin is enabled in `community-plugins.json` (or the in-app plugin list).
3. Run the diagnostic `curl` (§3 of this file) to isolate the REST layer from the MCP layer.
4. Confirm `OBSIDIAN_API_KEY` / `OBSIDIAN_BASE_URL` / `OBSIDIAN_VERIFY_SSL` are set in the Code Mode environment.
5. Confirm the `obsidian` manual in `.utcp_config.json` matches the documented wiring (`command: "npx"`, `args: ["-y", "obsidian-mcp-server@latest"]`, transport `stdio`).
6. Enumerate with `list_tools()` and confirm the returned names are `obsidian_*`, not `vault_*` — a `vault_*` result means the base URL points at the plugin's own MCP endpoint instead.

---

## 3. MCP TOOLS NOT FOUND

| Cause | Check | Fix |
| --- | --- | --- |
| `obsidian` manual missing from `.utcp_config.json` | `grep -A12 '"obsidian"' .utcp_config.json` | The manual is already wired in this skill's default deployment; if it's genuinely missing, print the config for the user rather than writing the file (`SKILL.md` §4) |
| Code Mode not reconnected after an env change | Restart the AI client / reconnect Code Mode | Reconnect and re-run `list_tools()` |
| Wrong callable prefix assumed | Confirm the callable form is `obsidian.obsidian_<tool>`, not a doubled `obsidian.obsidian_obsidian_<tool>` | Use `tool_info()` to confirm the exact name before hardcoding |

```bash
# Confirm the manual is registered:
grep -A12 '"obsidian"' .utcp_config.json
```

---

## 4. CONNECTION REFUSED

| Cause | Check | Fix |
| --- | --- | --- |
| App not running | Confirm Obsidian is open with the target vault | Open the app; route to `notesmd-cli` in the meantime if the task can't wait |
| Plugin not enabled | Check `community-plugins.json` for `obsidian-local-rest-api` | Enable via Settings → Community plugins |
| Wrong port | Compare `OBSIDIAN_BASE_URL` against the plugin's configured port | Correct the base URL, default `http://127.0.0.1:27123` |

```bash
curl -sk -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  "${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}/" | head -c 200
```

---

## 5. AUTHENTICATION (401)

| Cause | Check | Fix |
| --- | --- | --- |
| `OBSIDIAN_API_KEY` unset | `printenv OBSIDIAN_API_KEY >/dev/null && echo set \|\| echo UNSET` | Copy a fresh key from the plugin's settings pane and set the env var |
| Key regenerated in-app but env not updated | Compare the last key copy against the last regeneration | Re-copy and re-set the key, restart the AI client |
| Key set in the wrong env layer | Confirm Code Mode itself resolves `${obsidian_OBSIDIAN_API_KEY}`, not just the shell | Set it in the environment the Code Mode process actually reads |

There is no OAuth flow — the token is a static bearer key from the plugin's own settings pane.

---

## 6. SSL / `OBSIDIAN_VERIFY_SSL`

| Cause | Check | Fix |
| --- | --- | --- |
| Self-signed cert rejected | TLS/certificate error on `curl` or MCP call | Set `OBSIDIAN_VERIFY_SSL=false` — documented safe only because the endpoint is loopback-only |
| `OBSIDIAN_VERIFY_SSL=true` against the self-signed endpoint | Confirm the flag's current value | Flip to `false` unless a trusted cert has been configured |
| Verification disabled against a non-loopback host | Confirm `OBSIDIAN_BASE_URL` is `127.0.0.1`/`localhost` | Never point a non-loopback `OBSIDIAN_BASE_URL` at this plugin with verification off — the bearer token would cross the network unverified |

---

## 7. PORT CONFLICTS

| Cause | Check | Fix |
| --- | --- | --- |
| Another process bound to `27123`/`27124` | `lsof -i :27123` / `lsof -i :27124` (or platform equivalent) | Free the port, or change the plugin's configured port and update `OBSIDIAN_BASE_URL` to match |
| Base URL points at the wrong of the two endpoints | Compare the port in `OBSIDIAN_BASE_URL` against `data-model.md` §3 | Use `27123` (HTTP, cyanheads MCP) unless deliberately targeting the plugin's own `/mcp/` endpoint on `27124` |

---

## 8. RECOVERY

| Problem | Fix |
| --- | --- |
| Tools not found | Confirm `.utcp_config.json` wiring, reconnect Code Mode |
| Connection refused | Open the app + enable the plugin, or route to `notesmd-cli` |
| 401 | Re-copy the API key, restart the AI client |
| SSL error | Set `OBSIDIAN_VERIFY_SSL=false` on the loopback endpoint |
| Port mismatch | Correct `OBSIDIAN_BASE_URL` to the plugin's actual configured port |
| `vault_*` tools appear instead of `obsidian_*` | Point `OBSIDIAN_BASE_URL` back at the cyanheads server's expected endpoint, not the plugin's own `/mcp/` |

---

## 9. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `app_and_plugin_confirmed_live` | The app is running, the vault is open, and the plugin is enabled |
| `endpoint_reachable` | The diagnostic `curl` returns a response, not a connection error |
| `api_key_valid` | The bearer token authenticates without a 401 |
| `ssl_mode_matches_endpoint` | `OBSIDIAN_VERIFY_SSL` matches the trust level of the actual `OBSIDIAN_BASE_URL` host |
| `tool_surface_confirmed` | `list_tools()` returns the expected `obsidian_*` (or, deliberately, `vault_*`) names |

---

## 10. LIMITS

- This reference set documents the env-var contract, endpoints, and failure modes already confirmed in `SKILL.md` / `references/mcp-tools.md` / `references/troubleshooting.md`. It does not add newly-verified `data.json` key names (see `data-model.md` §4).
- The plugin's own built-in MCP endpoint (`vault_*` tools) is documented only as an alternate surface — the default wiring this skill operates is the cyanheads `obsidian_*` server.
- Never fabricate a diagnostic result. If `curl`/`list_tools()` was not actually run, say so rather than assuming success.
