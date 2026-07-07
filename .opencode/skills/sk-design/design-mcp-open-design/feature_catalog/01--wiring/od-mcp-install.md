---
title: "od mcp install"
description: "Register Open Design's stdio MCP server into opencode or Claude Code, with a dry-run preview before any config write."
trigger_phrases:
  - "od mcp install"
  - "wire open design"
  - "connect open design mcp"
  - "mcp install opencode"
  - "mcp install claude"
version: 1.4.0.1
---

# od mcp install (od mcp install)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Registers Open Design's stdio MCP server into a terminal agent so its tools appear to the agent. The wire direction is how a coding agent first reaches Open Design content without the in-app chat.

The command resolves the target agent and writes a single MCP entry. For opencode it deep-merges `~/.config/opencode/opencode.json` under `mcp.open-design`. For Claude Code it delegates to `claude mcp add --scope user open-design`. The dry-run form prints the exact entry and writes nothing, so the operator reviews the `command` array and `environment` before anything lands on disk.

**This repo's own canonical wiring is different**: Open Design is already wired here through Code Mode (`.utcp_config.json`'s `open_design` manual), not the native opencode path this feature documents. `WIRE-001` below still validates the native `od mcp install opencode` capability as a general skill feature, but running it live in this repo writes a redundant entry into the user's global config — see `references/mcp_wiring.md` Section 5b before executing `WIRE-001` for real here.

---

## 2. HOW IT WORKS

### Install commands

The CLI is invoked as `node "$OD_BIN" mcp install <agent>` where `$OD_BIN` is the daemon CLI inside the app bundle. Preview first with `--print --json`, which writes nothing and returns the entry the installer would write. Then run the bare install to apply it.

```bash
node "$OD_BIN" mcp install opencode --print --json    # preview only, writes nothing
node "$OD_BIN" mcp install opencode                    # deep-merges opencode.json under mcp.open-design
node "$OD_BIN" mcp install claude --print --json       # preview
node "$OD_BIN" mcp install claude                       # runs: claude mcp add --scope user open-design ...
```

### Written config shape and daemon-URL discovery

The installed entry is a local MCP server whose command launches the bundled Electron as Node against the daemon CLI in `mcp` mode, with `OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH` pointing at the daemon socket, and `ELECTRON_RUN_AS_NODE=1` in the environment. The MCP server re-discovers the live ephemeral daemon URL from the socket on each spawn, so the config stays valid across daemon restarts. Because the install mutates an agent config file, it runs only after the dry-run is reviewed, never blind. The skill never pipes a remote `install.sh` to a shell, since its contents are unverified.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/mcp_wiring.md` | Shared | Wiring commands, written config shape, and manual fallback |
| `references/od_cli_reference.md` | Shared | Locating the CLI and the daemon socket model |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--wiring/install-and-verify.md` | Manual playbook | Wire opencode then verify the live tools/list |

---

## 4. SOURCE METADATA

- Group: MCP Server Wiring
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--wiring/od-mcp-install.md`

Related references:
- [read-only-content.md](../02--reading/read-only-content.md) covers the read-only tools that appear after wiring
- [daemon-and-verification.md](../05--transport/daemon-and-verification.md) covers confirming the live tool set after install
