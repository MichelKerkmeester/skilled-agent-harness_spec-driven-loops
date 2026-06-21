# mcp-open-design Installation Guide

Complete installation and configuration guide for the `mcp-open-design` skill, which drives the installed Open Design desktop app from the terminal. The skill talks to the app's local daemon through the bundled **`od`** CLI (the read and write surface) and, optionally, wires Open Design's stdio **MCP server** into an agent (opencode or Claude Code). There is nothing to download or npm-install: the CLI and the MCP server both ship inside the desktop app, so "install" here means confirming the app, locating its bundled CLI, and verifying readiness.

> **Nature of this tool, read first.** The CLI brands itself **`od`** but is `app/prebundled/daemon/daemon-cli.mjs` run under Node, not a binary on PATH. A bare `od` on your PATH is the unrelated `/usr/bin/od` octal-dump tool and must never be used. Always invoke the bundled CLI as `node "<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"`. It is NOT the bundled `vela` binary either (vela is the cloud auth client).
> **Requires:** the Open Design desktop app (v0.9.0+), Node.js 18+, macOS baseline. For MCP wiring you also need the target agent CLI (`opencode` or `claude`) on PATH.

**Version:** 1.2.0.0 | **Updated:** 2026-06-15 | **Transport:** local daemon over a Unix socket (ephemeral HTTP port, never hardcoded)

---

## 0. AI-FIRST INSTALL GUIDE

The fast path for an agent or operator who just wants the skill working:

```bash
# 1. Verify the desktop app and locate the bundled od CLI (installs nothing, wires nothing)
bash .opencode/skills/mcp-open-design/scripts/install.sh

# 2. Open the Open Design desktop app (the daemon it hosts answers every tool call)

# 3. Run read-only diagnostics
bash .opencode/skills/mcp-open-design/scripts/doctor.sh

# 4. PREVIEW MCP wiring (writes nothing), then wire if the printed config looks right
OD_BIN="/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
node "$OD_BIN" mcp install opencode --print --json
```

The CLI works on its own. MCP wiring is optional and is a separate, gated step.

---

## 1. OVERVIEW

Open Design is a desktop app for reading and generating design systems, projects, and files. This skill drives it headlessly:

- **The `od` CLI** is the primary surface. It reads projects, files, and design systems, and (behind gates) creates projects, writes files, and commissions generation runs.
- **The MCP server** is optional. Wiring it registers an `open-design` MCP entry in an agent's config so the agent can call Open Design tools directly. The same daemon backs both surfaces.
- **The daemon** is hosted by the desktop app. Every tool call proxies to it, so the app must be open. It is discovered over a Unix socket, and its HTTP port is ephemeral and rotates on every restart, so nothing here hardcodes a port.

Design judgment stays with `sk-design-interface`: this skill owns the transport, that skill owns the taste. The real-UI loop lives in `sk-design-interface` (`real_ui_loop.md`); this skill's Open Design transport mechanics for it are in `references/design_parity_transport.md`.

---

## 2. PREREQUISITES

| Requirement | Why | Check |
| --- | --- | --- |
| Open Design desktop app, v0.9.0+ | Hosts the daemon and ships the `od` CLI. Required at run time, not just install time. | `ls "/Applications/Open Design.app"` |
| Node.js 18+ | The `od` CLI runs under Node. | `node -v` |
| macOS | The supported baseline. | `uname -s` |
| `opencode` or `claude` on PATH | Only for MCP wiring (the optional step). | `command -v opencode` |

`npm` is not required: this installer downloads nothing.

---

## 3. INSTALLATION

There is no package to install. `scripts/install.sh` verifies local readiness and reports next steps. It never starts the daemon, never wires MCP, and never runs a remote installer.

```bash
bash .opencode/skills/mcp-open-design/scripts/install.sh
# Options:
#   --skip-verify   Skip the od CLI verification step
#   --verbose       Print the verification command before running it
#   --help          Usage
```

What it does:

1. Checks the platform and Node (>=18 is required).
2. Locates `Open Design.app` in `/Applications` or `~/Applications`.
3. Resolves the bundled CLI at `Contents/Resources/app/prebundled/daemon/daemon-cli.mjs`.
4. Verifies it with `node "$OD_BIN" --version` (falling back to `--help`).
5. Prints the manual, gated next steps (open the app, preview MCP wiring, run the doctor).

If the app is missing, install it from Open Design's official download, then rerun. The script reports the app as required rather than failing hard, because its job is to check wiring readiness.

---

## 4. CONFIGURATION (OPTIONAL MCP WIRING)

Wiring the MCP server is optional and gated. Always preview first.

```bash
OD_BIN="/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"

# PREVIEW: prints the exact command + env it would write, changes nothing
node "$OD_BIN" mcp install opencode --print --json
node "$OD_BIN" mcp install claude   --print --json

# WIRE (only after reviewing the preview):
node "$OD_BIN" mcp install opencode   # deep-merges ~/.config/opencode/opencode.json (mcp.open-design)
node "$OD_BIN" mcp install claude     # runs: claude mcp add --scope user open-design ...
```

The written entry is a local stdio server whose `command` is the "Open Design Helper" Electron binary running `daemon-cli.mjs mcp`, with `OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH`, and `ELECTRON_RUN_AS_NODE=1` in its environment. The MCP server rediscovers the live daemon URL from the socket on each spawn, so the config stays valid across daemon restarts. The canonical source for the exact entry is `GET /api/mcp/install-info`. Manual config and the discovery detail live in [`references/mcp_wiring.md`](references/mcp_wiring.md).

Never pipe a remote `install.sh` to a shell. Use the local `node "$OD_BIN" mcp install` form.

---

## 5. VERIFICATION

```bash
# Read-only diagnostics: platform, Node, app presence + running, od CLI, daemon socket, MCP config presence
bash .opencode/skills/mcp-open-design/scripts/doctor.sh

# Direct CLI check
node "$OD_BIN" --version
```

`doctor.sh` changes nothing, never prints secrets, never starts the daemon, and never wires MCP. It reports the daemon socket at `/tmp/open-design/ipc/release-stable/daemon.sock` and does not probe a fixed HTTP port (that port is ephemeral).

---

## 6. USAGE

```bash
OD_BIN="/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"

# Read direction (read-only, also how you ground a design)
node "$OD_BIN" projects list
node "$OD_BIN" tools design-systems read <name>

# Run direction (generation, multi-turn, GATED)
node "$OD_BIN" run start ...     # turn 1 only: returns a discovery question-form and ZERO files
node "$OD_BIN" ui respond ...    # answer the form to fire the build run that writes files + a previewUrl
```

Generation is **multi-turn, not one-shot**. A single `run start` (or the MCP `start_run`) returns a discovery form and ends `awaiting_input` with no files. Answer it to fire the build run that actually writes the design. `od artifacts create` only adds one file to a project and never produces a rendered design. Verify the live `tools/list` before promising a tool exists or is read-only: the `od mcp --help` text lists a subset, while the running server registers more (around 18, including destructive verbs).

---

## 7. DAEMON AND SOCKET MODEL

- One daemon exposes four interchangeable surfaces: the `od` CLI, the stdio MCP server, an HTTP API (`http://127.0.0.1:<port>/api/*`), and the in-app Skills.
- The daemon is discovered over `OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock`.
- The HTTP port is ephemeral and rotates on every daemon restart. Never hardcode or probe a fixed port. Rediscover it from `GET /api/mcp/install-info` (`daemonUrl`) or the socket. The fixed `127.0.0.1:7456` is only the default of a standalone `od --no-open` daemon.
- The desktop app must be open. If it is closed the socket is gone and calls fail. For a headless daemon, `od --no-open` binds `127.0.0.1:7456`.

Full detail: [`references/od_cli_reference.md`](references/od_cli_reference.md).

---

## 8. SAFETY MODEL

Commands are classified read-only, mutating, and destructive, and every mutating or destructive verb is gated behind explicit user confirmation, an explicit target project or name, and a one-line rollback note. This covers `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`, and the `od artifacts`, `media`, `automation`, `ui`, `memory`, and `plugin` write verbs. Read-only inspection (projects, files, design systems) surfaces freely. The full classification with rollbacks is in [`references/tool_surface.md`](references/tool_surface.md).

---

## 9. TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| Tool calls fail or hang | Desktop app closed, so the daemon socket is gone | Open the Open Design app, then rerun. Or start a headless daemon with `od --no-open`. |
| `od: command not found` | There is no global `od` (a bare `od` is the octal-dump tool) | Invoke `node "$OD_BIN"` with the full bundled path. |
| `doctor.sh` reports the CLI not found | App not installed, or installed under a non-standard path | Install or move `Open Design.app` to `/Applications`, then rerun `install.sh`. |
| MCP entry missing after wiring | Wiring previewed but not applied | Run `node "$OD_BIN" mcp install <agent>` without `--print` after reviewing the preview. |
| A verb returns an auth error | Generation, media, research, or plugin-publish needs a cloud session | Run `vela login` or configure providers. Local reads work without an account. Never paste credentials into prompts. |
| Hardcoded HTTP port does not respond | The HTTP port is ephemeral and rotated on restart | Rediscover it from `GET /api/mcp/install-info` or the socket. |

---

## 10. RESOURCES

- [SKILL.md](SKILL.md) - the runtime contract: directions, gating, multi-turn generation.
- [references/od_cli_reference.md](references/od_cli_reference.md) - locating the CLI, the daemon/socket model, the full verb surface with read-only vs mutating classification.
- [references/mcp_wiring.md](references/mcp_wiring.md) - wiring the MCP server into opencode and Claude Code, the written config shape, the manual fallback, daemon-URL discovery.
- [references/tool_surface.md](references/tool_surface.md) - the read-only / mutating / destructive taxonomy.
- [`references/design_parity_transport.md`](references/design_parity_transport.md) - the Open Design transport for the real-UI loop (the loop itself lives in `sk-design-interface`).

Sibling terminal-driven design skills with the same install-and-doctor shape: [`mcp-figma`](../mcp-figma/INSTALL_GUIDE.md) (Figma Desktop via the silships figma-ds-cli) and [`mcp-chrome-devtools`](../mcp-chrome-devtools/INSTALL_GUIDE.md) (a real-browser surface for last-mile preview).

---

## Version History

| Version | Date       | Changes                                                                    |
| ------- | ---------- | -------------------------------------------------------------------------- |
| 1.2.0.0 | 2026-06-15 | First INSTALL_GUIDE for the skill, aligned with the shared mcp-skill install-and-doctor standard: `scripts/install.sh` (detect and verify, wires nothing) and a read-only `scripts/doctor.sh`. |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `mcp-open-design` skill for detailed workflows.
