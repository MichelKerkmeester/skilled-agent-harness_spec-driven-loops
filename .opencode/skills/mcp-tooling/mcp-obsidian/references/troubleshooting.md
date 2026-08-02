---
title: "mcp-obsidian Troubleshooting Guide"
description: "Error resolution for the notesmd-cli / official obsidian CLIs and the cyanheads obsidian-mcp-server. Covers PATH issues, Local REST API not enabled, token/port/SSL failures, npx fetch failures, and GUI-vs-shell PATH."
trigger_phrases:
  - "notesmd-cli not found"
  - "obsidian cli error"
  - "obsidian mcp connection failed"
  - "local rest api not enabled"
  - "obsidian api key unset"
  - "obsidian mcp npx failed"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# mcp-obsidian Troubleshooting Guide

Diagnostic guide for the two Obsidian CLI profiles (`notesmd-cli` headless, `obsidian` official app-backed) and the cyanheads `obsidian-mcp-server`, covering installation/PATH, the Local REST API prerequisite, authentication, connection, and npx launch failures.

---

## 1. OVERVIEW

Most failures fall into five categories:
1. **Installation / PATH** — `notesmd-cli` or `obsidian` not on PATH (often a GUI-vs-shell PATH mismatch).
2. **Official CLI not registered** — the `obsidian` binary was never enabled in Settings.
3. **Local REST API prerequisite** — the plugin is not enabled, or is on the wrong port / SSL mode.
4. **Authentication** — `OBSIDIAN_API_KEY` unset or wrong.
5. **MCP launch** — npx cannot fetch `obsidian-mcp-server`, or the app is not running.

Start with the Quick Diagnostics sequence (§3) before diving into specifics.

---

## 2. PREREQUISITES

- `notesmd-cli` installed: `notesmd-cli --version` `VERIFY exact version-flag`
- For the official CLI: Obsidian desktop v1.12.4+ with CLI registered (Settings → General → Command line interface)
- For MCP: a **running Obsidian app**, the **Local REST API plugin v4.0.0+** enabled, a token, and the `obsidian` manual registered in `.utcp_config.json` launching `npx -y obsidian-mcp-server@latest` over stdio with `OBSIDIAN_API_KEY` / `OBSIDIAN_BASE_URL` / `OBSIDIAN_VERIFY_SSL` available to Code Mode

---

## 3. QUICK DIAGNOSTICS (Run in Order)

```bash
# 1. Is the headless CLI installed and on PATH?
notesmd-cli --version

# 2. Which vaults are registered, and which is default?
notesmd-cli list-vaults

# 3. Can it read the vault (headless, no app needed)?
notesmd-cli list

# 4. Is the official app-backed CLI registered? (app-backed)
obsidian --help        # Only after enabling "Register CLI" in Settings

# 5. Is the Local REST API reachable? (MCP prerequisite; app must be running)
curl -sk -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  "${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}/" | head -c 200

# 6. Can npx fetch the MCP server?
npx -y obsidian-mcp-server@latest --help 2>&1 | head -n 5
```

---

## 4. INSTALLATION ISSUES

### `command not found: notesmd-cli`

**Symptoms:** Shell prints `notesmd-cli: command not found`.

**Diagnosis:**
```bash
which notesmd-cli    # Should print a path (e.g. /opt/homebrew/bin/notesmd-cli)
echo $PATH           # Is the install prefix on PATH?
brew list 2>/dev/null | grep notesmd  # Installed via Homebrew?
```

**Solutions (in order):**

1. **Install via Homebrew (macOS/Linux):**
   ```bash
   brew tap yakitrak/yakitrak && brew install yakitrak/yakitrak/notesmd-cli
   notesmd-cli --version   # Verify
   ```

2. **Windows (Scoop):**
   ```bash
   scoop bucket add scoop-yakitrak https://github.com/yakitrak/scoop-yakitrak.git
   scoop install notesmd-cli
   ```

3. **Arch (AUR):**
   ```bash
   yay -S notesmd-cli-bin
   ```

4. **From source (Go 1.19+):** clone the repo and `go build`. **`go install` is not supported** — use a build from the cloned source instead.

> **Do not invoke it as `obsidian-cli`.** The binary was renamed to `notesmd-cli`; the old name will not resolve.

---

### GUI-vs-shell PATH mismatch (the "bean-price" class of bug)

**Symptoms:** `notesmd-cli` (or `bean-check`, `bean-price`, `npx`) works in an interactive terminal but fails when invoked by a GUI-launched app, an agent runtime, or a `launchd`/systemd service.

**Root cause:** GUI apps and background services inherit a **minimal PATH** that does not include `~/.local/bin`, `/opt/homebrew/bin`, pipx/Scoop shims, or a Go bin dir. The interactive shell adds those via `~/.zshrc` / `~/.bashrc`, which non-interactive contexts never source.

**Diagnosis:**
```bash
# Compare PATH as the shell sees it vs. as the runtime sees it
echo "$PATH"                                  # Interactive shell PATH
which notesmd-cli                             # Resolves here?
# In the failing context, print the PATH it actually has and check for the prefix
```

**Fix:**
1. Find the real install prefix: `dirname "$(which notesmd-cli)"`.
2. Ensure that prefix is exported in a file the non-interactive context reads (e.g. the runtime's env config, a wrapper script, or a `launchd`/systemd `Environment=` entry) — not only in `~/.zshrc`.
3. Or invoke by absolute path in scripts that a GUI/service launches.

---

## 5. OFFICIAL CLI NOT REGISTERED

### `command not found: obsidian`

**Symptoms:** `obsidian --help` prints `command not found`, even though the desktop app is installed.

**Root cause:** the official CLI ships **inside** the desktop app but is **not enabled by default** — it must be registered.

**Fix:**
1. Open Obsidian desktop (v1.12.4+).
2. **Settings → General → Command line interface → toggle on → "Register CLI"**.
3. On macOS/Linux this adds `obsidian` to PATH. Open a new shell, then `obsidian --help`.
4. If it still fails, this is likely the GUI-vs-shell PATH issue (§4) — confirm where "Register CLI" placed the binary and ensure that prefix is on your shell PATH.

> The official CLI is **app-backed** — it launches/focuses the running app. For headless/file work, use `notesmd-cli` instead; it needs no app and no registration step.

---

## 6. LOCAL REST API ISSUES (MCP PREREQUISITE)

### Local REST API not enabled

**Symptoms:** MCP calls fail with connection refused; `curl` to the base URL times out or refuses.

**Root cause:** the cyanheads MCP server talks to the vault **through the Local REST API plugin**, which must be installed, enabled, and running (the Obsidian app must be open).

**Fix:**
1. In Obsidian: **Settings → Community plugins → Browse → install "Local REST API"** (need **v4.0.0+**).
2. Enable it, then open its settings and **copy the API key**.
3. Confirm the app is **running** with the target vault open — the server cannot reach a closed app.
4. Re-test:
   ```bash
   curl -sk -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
     "${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}/"
   ```

---

### Wrong port or SSL error

**Symptoms:** `curl`/MCP returns a TLS/certificate error, or connects to the wrong port and gets no response.

**Root cause:** the Local REST API plugin serves HTTPS on a self-signed certificate (default HTTPS port differs from the HTTP port `27123`).

**Fix:**
- Set `OBSIDIAN_VERIFY_SSL=false` so the self-signed cert is accepted (this is the documented default for this deployment).
- Confirm `OBSIDIAN_BASE_URL` matches the plugin's configured port. The default in this wiring is `http://127.0.0.1:27123`; if you enabled only HTTPS, point the base URL at the HTTPS port instead `VERIFY port`.
- Use `curl -k` (insecure) when hand-testing the self-signed HTTPS endpoint.

---

## 7. AUTHENTICATION ISSUES

### `OBSIDIAN_API_KEY` unset / 401 Unauthorized

**Symptoms:** MCP tool calls return 401, or `curl` to the base URL returns unauthorized.

**Diagnosis:**
```bash
# Is the key present in the environment Code Mode sees?
printenv OBSIDIAN_API_KEY >/dev/null && echo "set" || echo "UNSET"
```

**Fix:**
1. In Obsidian → Local REST API settings → copy the API key.
2. Make it available to Code Mode as `OBSIDIAN_API_KEY` (interpolated into `.utcp_config.json` as `${obsidian_OBSIDIAN_API_KEY}` — the env var name in your shell/agent env is `OBSIDIAN_API_KEY`).
3. Restart the AI client after setting it.
4. Re-test with the `curl` command in §6.

> There is no OAuth flow — the token is a static bearer key from the plugin. If 401 persists, regenerate the key in the plugin settings and update the env.

---

## 8. MCP CONNECTION & LAUNCH ISSUES

### npx cannot fetch `obsidian-mcp-server`

**Symptoms:** MCP fails to start; logs show npm/npx errors fetching the package.

**Diagnosis:**
```bash
node --version     # Need 18+
npx --version
npx -y obsidian-mcp-server@latest --help 2>&1 | head -n 10
```

**Fix:**
1. Confirm Node.js 18+ and network access to the npm registry.
2. Pre-warm the package so the first MCP launch is not blocked on a cold fetch: `npx -y obsidian-mcp-server@latest --help`.
3. Behind a proxy/offline environment, pre-install so npx resolves it from cache `VERIFY exact cache path`.
4. Confirm the `.utcp_config.json` `obsidian` manual uses `command: "npx"`, `args: ["-y", "obsidian-mcp-server@latest"]`, transport `stdio`.

---

### `obsidian` tools not found

**Diagnosis:**
```bash
# Check .utcp_config.json (Code Mode's config, not opencode.json) has the obsidian manual:
grep -A12 '"obsidian"' .utcp_config.json
# Should show: command "npx", args ["-y", "obsidian-mcp-server@latest"], env OBSIDIAN_API_KEY/BASE_URL/VERIFY_SSL
```

**Fix:**
1. Confirm the `obsidian` manual is registered in `.utcp_config.json` under `manual_call_templates` (a later gated phase performs this wiring).
2. Set `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, and `OBSIDIAN_VERIFY_SSL` in the environment available to Code Mode.
3. Reconnect Code Mode and verify the stdio server starts.
4. Enumerate with `list_tools()` — the server should report **14 tools**; confirm the exact callable name with `tool_info("obsidian.obsidian_get_note")` before hardcoding it. The callable form is `obsidian.obsidian_<tool>` (one `obsidian_` after the dot), NOT a doubled `obsidian.obsidian_obsidian_<tool>`.

---

### MCP call fails because the app is closed

**Symptoms:** tools that worked earlier now fail with connection refused.

**Root cause:** the Local REST API only responds while the Obsidian app is running with the vault open. Closing the app kills the endpoint.

**Fix:** open the app with the target vault, or route the task to `notesmd-cli` (headless, filesystem — no app needed).

---

## 9. HEADLESS VS APP-BACKED: PICKING THE RIGHT SURFACE

**Symptom:** a task keeps failing because "the app isn't running."

**Resolution:** that task should use the **headless** surface.

| Situation | Correct surface |
|-----------|-----------------|
| No app running (server, CI, unattended) | `notesmd-cli` CLI (filesystem) |
| App running + Local REST API + token | `obsidian-mcp-server` MCP, or official `obsidian` CLI |
| Need file determinism / diffs | `notesmd-cli` CLI |
| Need live UI / app rendering | official `obsidian` CLI |

Do not fight to make an app-backed surface work headlessly — switch surfaces instead.

---

## 10. EMPTY RESULTS

### `notesmd-cli search` / `obsidian_search_notes` returns nothing

**This is valid behavior** — an empty result means no matching note exists.

**Before escalating:**
```bash
# 1. Try full-text (body) search instead of title search:
notesmd-cli search-content "term"

# 2. Confirm you are on the right vault:
notesmd-cli list-vaults
notesmd-cli list

# 3. Check spelling / casing of the query.
```

**After checking all above:** report "No matching note" — do not fabricate one.

---

## 11. UPGRADE

```bash
# Headless CLI
brew upgrade notesmd-cli          # Homebrew
scoop update notesmd-cli          # Scoop

# MCP server pins @latest via npx; force a fresh fetch:
npx -y obsidian-mcp-server@latest --help

# Official CLI upgrades with the Obsidian desktop app itself.
```

---

## 12. GETTING HELP

- `notesmd-cli` repo: https://github.com/Yakitrak/obsidian-cli
- cyanheads `obsidian-mcp-server`: https://github.com/cyanheads/obsidian-mcp-server
- Obsidian Local REST API plugin: https://github.com/coddingtonbear/obsidian-local-rest-api
- Obsidian help/docs: https://help.obsidian.md/
