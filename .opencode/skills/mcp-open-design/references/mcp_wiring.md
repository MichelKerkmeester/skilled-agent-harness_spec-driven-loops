---
title: "Open Design MCP Wiring"
description: "Wiring Open Design's stdio MCP server into opencode or Claude Code: the install commands, the exact config shape each writes, the manual fallback, and daemon-URL discovery order."
trigger_phrases:
  - "open design mcp install"
  - "od mcp install opencode"
  - "od mcp install claude"
  - "open design mcp config"
  - "wire open design mcp"
importance_tier: "normal"
contextType: "implementation"
---

# Open Design MCP Wiring

> **IMPORTANT:** Always run `od mcp install <agent> --print --json` (a dry-run) first and read the exact `command` and `environment` it will write before letting it modify an agent config. The live daemon fills the exact `command[0]` and `OD_DATA_DIR` from `/api/mcp/install-info`.

---

## 1. OVERVIEW

### Core Principle
Wiring means registering Open Design's stdio MCP server into the target agent's own config so its tools appear to the agent. The install reads the launch spec from the live daemon, so confirm the daemon is running and dry-run first.

### When to Use
- Connect Open Design's MCP server to opencode or Claude Code ("connect open design", "od mcp install").
- Confirm the exact config entry an install will write, or hand-author the entry without the installer.

### Key Sources
- [od_cli_reference.md](od_cli_reference.md) - locating the CLI and the daemon transport model.
- [tool_surface.md](tool_surface.md) - what the wired tools are and how to gate them.

Claims are tagged **[CONFIRMED]** (read from the bundled install code) or **[INFERRED]** (reasoned, needs a live dry-run to fix the exact string). The exact `command[0]` and `OD_DATA_DIR` are INFERRED until the dry-run prints them (see [od_cli_reference.md](od_cli_reference.md) Section 7).

---

## 2. THE INSTALL COMMANDS

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`

# opencode (writes ~/.config/opencode/opencode.json under "mcp.open-design", deep-merge):
node "$OD_BIN" mcp install opencode --print --json    # PREVIEW only, writes nothing
node "$OD_BIN" mcp install opencode                    # actually install

# Claude Code (delegates to `claude mcp add --scope user open-design ...`):
node "$OD_BIN" mcp install claude --print --json       # PREVIEW only
node "$OD_BIN" mcp install claude                       # actually install
```

`od mcp install <agent>` does **not** create a global `od` shim. It registers the stdio MCP server into the target agent's config and nothing else. **[CONFIRMED - read]** The supported agent slugs include `claude codex cursor copilot openclaw antigravity gemini pi vibe hermes cline kimi trae opencode`. **[CONFIRMED - read]**

Useful flags on `mcp install`: `--uninstall`, `--print` / `--dry-run`, `--json`, `--name` (override the server key), and `--daemon-url`.

### Where the launch spec comes from

`GET /api/mcp/install-info` is the **canonical source** of the launch spec, and both clients install a spec computed from the **live daemon** through it. In sidecar mode (the desktop build, where `OD_SIDECAR_IPC_PATH` is set), the spec is:

- `command[0]` = the **"Open Design Helper"** Electron binary running the daemon now (NOT `Contents/MacOS/Open Design`)
- `args` = `[<daemon-cli.mjs>, "mcp"]`
- `env` = `{ OD_DATA_DIR, OD_SIDECAR_IPC_PATH, ELECTRON_RUN_AS_NODE: "1" }`
- `daemonUrl` = the live HTTP base (ephemeral, rotates on daemon restart)

The MCP server then discovers the live ephemeral daemon URL from the socket at startup, so the config stays valid across daemon restarts. This config shape is **[CONFIRMED - live-verified this session via `/api/mcp/install-info`]**, including that `command[0]` is the Helper binary. The exact `OD_DATA_DIR` string is still per-machine, so read it from the dry-run. If the daemon is down at install time, the installer falls back to a minimal `{command:"od", args:["mcp","--daemon-url",<base>], env:{}}` entry that assumes a PATH `od`. Prefer installing while the app is running so you get the socket-mode entry.

---

## 3. THE opencode CONFIG ENTRY

`od mcp install opencode` writes to `~/.config/opencode/opencode.json` under key path `mcp`, server key `open-design` (override with `--name`). It **deep-merges**, preserving existing config. **[CONFIRMED - read]**

```json
{
  "mcp": {
    "open-design": {
      "type": "local",
      "command": ["<OD_NODE_BIN electron>", "<…>/daemon-cli.mjs", "mcp"],
      "enabled": true,
      "environment": {
        "OD_DATA_DIR": "<~/Library/Application Support/Open Design/…>",
        "OD_SIDECAR_IPC_PATH": "/tmp/open-design/ipc/release-stable/daemon.sock",
        "ELECTRON_RUN_AS_NODE": "1"
      }
    }
  }
}
```

opencode uses `command` as an **array** and the key `environment` (not `env`). **[CONFIRMED - read]**

---

## 4. THE Claude Code INSTALL

`od mcp install claude` does **not** write a file directly. It shells out to the `claude` CLI, which requires the `claude` binary on PATH. **[CONFIRMED - read]**

```bash
claude mcp add --scope user open-design \
  -e OD_DATA_DIR=<…> \
  -e OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock \
  -e ELECTRON_RUN_AS_NODE=1 \
  -- <OD_NODE_BIN electron> <…>/daemon-cli.mjs mcp
```

Companion commands:

```bash
claude mcp get open-design       # verify the registration
claude mcp remove --scope user open-design   # uninstall
```

---

## 5. MANUAL CONFIG FALLBACK

If you do not want to run the installer, hand-author the opencode entry. Use absolute paths and keep `ELECTRON_RUN_AS_NODE` and `OD_SIDECAR_IPC_PATH` so the server can run under the bundled Electron and discover the live daemon.

```json
{
  "mcp": {
    "open-design": {
      "type": "local",
      "command": [
        "/Applications/Open Design.app/Contents/MacOS/Open Design",
        "/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs",
        "mcp"
      ],
      "enabled": true,
      "environment": {
        "ELECTRON_RUN_AS_NODE": "1",
        "OD_SIDECAR_IPC_PATH": "/tmp/open-design/ipc/release-stable/daemon.sock"
      }
    }
  }
}
```

The per-client "Settings to MCP server" copy-paste snippet in the desktop app is generated from the same `/api/mcp/install-info` endpoint, so it matches `od mcp install … --print` byte-for-byte. **[CONFIRMED]**

---

## 6. DAEMON-URL DISCOVERY ORDER

The wired MCP server resolves the daemon endpoint in this order. With `OD_SIDECAR_IPC_PATH` set, the ephemeral port is found automatically. Without it, the server depends on a `7456` daemon. **[CONFIRMED - read]**

1. `--daemon-url` flag
2. `OD_DAEMON_URL` environment variable
3. discover via `OD_SIDECAR_IPC_PATH` (connect the unix socket, send `STATUS`, take `status.url`)
4. fall back to `http://127.0.0.1:7456`

Each new MCP spawn re-discovers the live URL, so the config survives daemon restarts. A long-running MCP server caches the URL, so restart the MCP client after a daemon restart. The desktop daemon is socket-discovered on an **ephemeral** port, never a fixed `:7456`. The `7456` port is only the default for a standalone `od --no-open` daemon. See [od_cli_reference.md](od_cli_reference.md) Section 3 for the full transport and lifecycle model.

---

## 7. AFTER WIRING

- Confirm the Open Design desktop app is running so the daemon socket exists. Otherwise every tool call fails.
- Verify the agent's live `tools/list` shows the Open Design tools. The `od mcp --help` text undercounts the surface, so the live list is the source of truth (see [tool_surface.md](tool_surface.md)).
- Never pipe `https://open-design.ai/install.sh` to a shell. Use the local `node "$OD_BIN" mcp install` form. **[INFERRED - install.sh contents are unverified]**

---

## 8. REFERENCES

- [od_cli_reference.md](od_cli_reference.md) - locating the CLI, the daemon and socket model, and the full verb surface.
- [tool_surface.md](tool_surface.md) - the MCP tools and the surface / gate / omit policy.
- [SKILL.md](../SKILL.md) - the skill contract these references support.
