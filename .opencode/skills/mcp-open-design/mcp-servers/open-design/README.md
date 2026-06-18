# open-design

Pointer doc for the mcp-open-design skill's CLI and MCP server. Nothing is installed here, because both ship inside the Open Design desktop app.

## What it is

Open Design's terminal surface is the bundled `od` CLI, run as `node "<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"`. Its MCP server is the same local daemon exposed over stdio. Neither is an npm package and neither is vendored here, so there is no `setup.sh`: the desktop app is the unit of installation. A bare `od` on PATH is the unrelated octal-dump tool and must never be used.

## Install and wire

- Verify the app and locate the CLI: `bash ../../scripts/install.sh`
- Read-only diagnostics: `bash ../../scripts/doctor.sh`
- Preview MCP wiring, which writes nothing: `node "$OD_BIN" mcp install opencode --print --json`

The full steps, the socket-discovered daemon model (the HTTP port is ephemeral), and the gated wiring flow are in `../../INSTALL_GUIDE.md` and `../../references/mcp_wiring.md`.

## Source

- **GitHub:** https://github.com/nexu-io/open-design
