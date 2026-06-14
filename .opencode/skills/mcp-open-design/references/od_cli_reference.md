---
title: "Open Design CLI Reference"
description: "How to locate and invoke the Open Design `od` CLI, the daemon and socket transport model, and the full `od` verb surface classified read-only vs mutating."
trigger_phrases:
  - "open design cli reference"
  - "od cli locate"
  - "od daemon socket"
  - "od verb surface"
  - "daemon-cli.mjs od"
importance_tier: "normal"
contextType: "implementation"
---

# Open Design CLI Reference

> **IMPORTANT:** The CLI brands itself `od` but there is no global `od` on PATH. Always invoke it as `node "<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"` (or the `ELECTRON_RUN_AS_NODE=1` form). Bare `od` is the unrelated `/usr/bin/od` octal-dump tool.

---

## 1. OVERVIEW

### Core Principle
The interface to Open Design is the `od` CLI plus a stdio MCP server, both proxying to a local daemon that the desktop app hosts. Locate the CLI first, confirm the daemon is reachable, then act.

### When to Use
- Look up the exact invocation form, daemon transport, and verb surface for the `od` CLI before running anything.
- Confirm whether a given verb is read-only or mutating before promising it is safe.

### Key Sources
- [mcp_wiring.md](mcp_wiring.md) - wiring the MCP server into opencode or Claude Code.
- [tool_surface.md](tool_surface.md) - the MCP tool surface and the surface / gate / omit policy.

All load-bearing claims below are tagged **[CONFIRMED]** (read from the bundled code or observed by running `--help`/`--version`) or **[INFERRED]** (reasoned from the code, needs a live mutating check). The full uncertainty list is Section 6.

---

## 2. LOCATING THE CLI

### What `od` actually is

`od` is not a compiled binary. It is `daemon-cli.mjs`, a 9-line ESM shim that sets `OD_BIN` and `OD_DAEMON_CLI_PATH` to its own path and then imports the real 300 KB CLI chunk. It runs under any Node-compatible runtime. **[CONFIRMED - read file]**

There is **no global `od` on PATH**. `command -v od` resolves to `/usr/bin/od`, the unrelated octal-dump tool, and no shim exists in `~/.local/bin`, `/usr/local/bin`, `/opt/homebrew/bin`, or the app `bin/`. The literal `od` in all help text is just the CLI's branding (argv0), not a PATH command. **[CONFIRMED - ran `which -a od` plus `ls`]**

`od` is also **not** `vela`. The bundled `vela` binary (`…/Resources/open-design/bin/vela`, Mach-O arm64, v0.0.9) is the cloud AMR (agent-model-runtime) and auth client, with commands `agent / auth / completion / help / login / model / models / whoami`. It governs the cloud model service used by inner generation runs, not local project reads or writes. **[CONFIRMED - ran `vela --help` and `vela --version`]**

### The two equivalent invocation forms

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
OD_NODE_BIN="$APP/Contents/MacOS/Open Design"                            # Electron-as-node (no system node needed)

# A) System node (if present on this machine):
node "$OD_BIN" --help

# B) PATH-independent: the bundled Electron run as Node (no system node required):
ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" --help
```

Both forms were verified. **[CONFIRMED - ran both]** Packaged builds ship **no standalone `node`**, so form B is the portable option: the desktop app's own Electron binary becomes the runtime via `ELECTRON_RUN_AS_NODE=1`.

| Artifact | Path | What it is |
|---|---|---|
| `daemon-cli.mjs` | `…/Resources/app/prebundled/daemon/daemon-cli.mjs` | **The `od` CLI.** ESM shim that sets `OD_BIN` to its own path, then imports the real CLI. **[CONFIRMED]** |
| `Open Design` (Electron) | `…/Contents/MacOS/Open Design` | The **Node-compatible runtime** (`OD_NODE_BIN`). Runs the CLI under `ELECTRON_RUN_AS_NODE=1`. **[CONFIRMED]** |
| `vela` | `…/Resources/open-design/bin/vela` | The **cloud AMR / auth client**. NOT `od`. **[CONFIRMED]** |

### Do not pipe the remote installer to a shell

The upstream `curl https://open-design.ai/install.sh | sh -s <agent>` script is **not shipped in the bundle**, so its contents are unverified. It almost certainly drops a global `od` wrapper on PATH and then runs `od mcp install <agent>`, but treat that as **[INFERRED]**. Use the local `node "$OD_BIN" …` form instead. **[INFERRED]**

---

## 3. THE DAEMON AND SOCKET MODEL

Every `od` verb and every MCP tool call proxies to a **local daemon that the desktop app runs**. The app must be open for the desktop path to work.

### Transport: Unix socket discovery, ephemeral loopback HTTP

The desktop daemon is **socket-discovered**, then speaks HTTP on an **ephemeral** loopback port. It does **not** bind a fixed `127.0.0.1:7456`. **[CONFIRMED - read resolution code plus process table]**

- Live sockets confirmed at `/tmp/open-design/ipc/release-stable/{daemon,desktop,web}.sock` (`srwxr-xr-x`). The path scheme is `join(OD_SIDECAR_IPC_BASE | /tmp/open-design/ipc, namespace, "<app>.sock")` with namespace `release-stable`. **[CONFIRMED - read plus `ls`]**
- The running daemon is an `Open Design Helper … daemon-sidecar.mjs` process with **no `--port` stamp** (socket mode). Its HTTP server starts with `port: parsePort(OD_PORT)`, and an unset `OD_PORT` resolves to `0`, which yields an **ephemeral 127.0.0.1 port** advertised back through the socket `STATUS.url`. **[CONFIRMED - process table plus read]**
- A live `curl http://127.0.0.1:7456` failed while the sockets existed, confirming the desktop sidecar is not on 7456. **[CONFIRMED - live-observed]**

### Daemon-URL discovery order

`resolveDaemonUrl` resolves the daemon endpoint in this order: **[CONFIRMED - read]**

1. `--daemon-url` flag
2. `OD_DAEMON_URL` environment variable
3. discover via `OD_SIDECAR_IPC_PATH` (connect the unix socket, send `STATUS`, take `status.url`)
4. fall back to `http://127.0.0.1:7456`

So with `OD_SIDECAR_IPC_PATH` set, the ephemeral port is found automatically. Without it you depend on a `7456` daemon, which only a standalone `od --no-open` process provides. Each new `od mcp` spawn re-discovers the live URL, so configs survive daemon restarts. A long-running MCP server caches the URL and needs a client restart after a daemon restart.

### Lifecycle: the daemon is a child of the desktop app

The daemon sidecar is a child Electron helper of the desktop app. When the app quits, the daemon dies with it and the sockets are removed (stale sockets are cleaned on the next start). The packaged sidecar has no parent-PID self-monitor (that path is tools-dev only). So the daemon does **not** persist headlessly after the app quits. **[INFERRED - strong, needs the live close-the-app check]**

### Headless without the app: `od --no-open`

To run a daemon without the desktop GUI, start a standalone one in a terminal:

```bash
node "$OD_BIN" --no-open      # standalone daemon, binds 127.0.0.1:7456 by default
```

`od --no-open` starts the local daemon and serves the chat web UI and `/api/*` but does not open a browser. It binds `127.0.0.1:7456` by default (`--port` / `OD_PORT`, `--host` / `OD_BIND_HOST`) and lives as long as the terminal command runs. **[CONFIRMED from help, not executed]**

### Auth

Local project reads and writes are gated by a loopback same-origin check (cross-origin requests get 403). The `od tools …` wrappers expect `OD_DAEMON_URL` plus `OD_TOOL_TOKEN` (bearer), which the daemon injects when it spawns an agent. Run standalone, they may need those env vars set. `vela login/auth/whoami` governs the cloud AMR models used by inner runs and `media generate`, separate from reading and writing local projects. **[CONFIRMED structure, exact per-verb token requirement = INFERRED]**

---

## 4. THE FULL `od` VERB SURFACE

From `od --help`. Read-only verbs are safe to surface freely. Mutating verbs are STOP-and-confirm points (see [tool_surface.md](tool_surface.md) for the gating policy). **[CONFIRMED - ran]**

| Verb | Purpose | Class |
|---|---|---|
| `od [--port --host --no-open]` | Start the local daemon plus chat web UI (`--no-open` skips the browser). Defaults `--port 7456` (`OD_PORT`), `--host 127.0.0.1` (`OD_BIND_HOST`). | **mutating** (starts a server) |
| `od mcp [--daemon-url]` | stdio MCP server proxying project tools to the daemon. | read + write (tool-dependent) |
| `od mcp install <agent>` | Register the Open Design MCP server into an agent's config. Flags: `--uninstall --print/--dry-run --json --name --daemon-url`. | **mutating** (writes config) |
| `od mcp live-artifacts` | stdio MCP exposing live-artifact and connector tools (no `--help` output). | read + write |
| `od tools live-artifacts <create\|list\|update\|refresh>` | Live artifacts via daemon wrappers. | list = read; create/update/refresh = **mutating** |
| `od tools connectors <list\|execute\|github-design-context\|local-design-context\|design-system-package-audit>` | Discover and run connectors, build design-context packs. | list = read; execute = **mutating / side-effecting** |
| `od tools design-systems read --path <manifest-path> [--design-system <id>]` | Read a registered design system's pull-layer files (allowlisted). | **read-only** |
| `od artifacts create --name <path> --input <file> [--project] [--manifest] [--encoding] [--daemon-url]` | Create one project artifact file (rejects an existing target). | **mutating** |
| `od media generate --surface <image\|video\|audio> --model <id> …` (plus `media wait <taskId>`) | Generate media into the active project. Picks up `OD_DAEMON_URL`/`OD_PROJECT_ID` injected by the daemon. | **mutating** |
| `od research search --query <text> [--max-sources 5] [--daemon-url]` | Tavily-backed shallow research, JSON to stdout. | read (external fetch) |
| `od automation <…>` | Drive the Automations surface headlessly (same store as the UI tab). | mixed (see Section 5) |
| `od memory tree <list\|view\|edit\|move>` | Inspect or edit the memory tree injected into agent prompts. | list/view = read; edit/move = **mutating** |
| `od ui <list\|show\|respond\|revoke\|prefill>` | Read and answer GenUI surfaces (form / choice / confirmation / oauth-prompt) from any process. | list/show = read; respond/revoke/prefill = **mutating** |
| `od plugin <list\|info\|install\|uninstall\|apply\|doctor\|replay\|trust\|publish-repo\|open-design-pr\|scaffold\|pack\|export\|…>` | Plugin lifecycle via the daemon. | mixed; install/apply/trust = **mutating** |
| `od diagnostics export [<path>] [--output] [--json] [--daemon-url]` | Bundle logs, machine info, and crashes into a zip (same as Settings to About). | **mutating** (writes a zip) |

### Notes on the verb surface

- `od tools design-systems read` is the read-only terminal door to a design system's pull layer. A design system is a `DESIGN.md` (9-section prose) plus a paste-ready `tokens.css` (`:root` block) plus an optional `components.html`.
- The bundle ships large local libraries under `…/Resources/open-design/`: roughly 152 `design-systems/`, 139 `skills/`, 111 `design-templates/`, plus `community-pets/`, `craft/`, `frames/`, `plugins/`, and `prompt-templates/`. The `od://design-systems/…` resource URIs are an Electron custom protocol for the renderer, **not** a terminal transport. **[CONFIRMED - `ls` plus process table, resource list partially INFERRED]**

---

## 5. DRIVING THE APP'S WORK WITHOUT THE CHAT UI

These are the headless equivalents of typing into the in-app chat box. Every one is mutating and is a STOP-and-confirm point.

- **`start_run(prompt, [skill], [plugin], [inputs], [agent], [model])` plus `get_run(runId)` plus `get_artifact`** is the true headless equivalent of the chat box. Open Design spawns its own inner agent (`claude` / `codex` / `gemini`, per `list_agents`) to do the design work and returns files plus a `previewUrl`/`studioUrl`. `cancel_run` aborts. These are MCP tools (see [tool_surface.md](tool_surface.md)). **[CONFIRMED - read registry]**
- **`od automation create/run/runs/…`** schedules or fires a routine and harvests results, the same store as the UI Automations tab, explicitly designed for external agents. Schedules use `hourly:` / `daily:` / `weekdays:` / `weekly:`. **[CONFIRMED - ran `--help`]**
- **`od ui respond --run <runId> <surfaceId> --value… | --skip`** and **`od ui prefill`** answer the app's GenUI forms, confirmations, and oauth prompts from the terminal, so a run that blocks on a question can be unblocked headlessly. **[CONFIRMED - ran `--help`]**
- **`od artifacts create`**, plus the MCP `write_file` and `create_artifact` tools, push files into a project without a zip export.
- **`od media generate`** produces image, video, or audio into the active project.

---

## 6. EXACT COMMANDS FOR THIS MACHINE

```bash
# ---- Canonical paths -------------------------------------------------------
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
OD_NODE_BIN="$APP/Contents/MacOS/Open Design"                            # Electron-as-node (no system node needed)
SOCK="/tmp/open-design/ipc/release-stable/daemon.sock"                   # live daemon socket

# ---- Invoke the `od` CLI (two equivalent forms) ----------------------------
# A) System node (if present on this machine) -- VERIFIED:
node "$OD_BIN" --help

# B) PATH-independent, bundled Electron as Node (no system node) -- VERIFIED:
ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" --help

# ---- Point any verb at the live desktop daemon (auto-discovers ephemeral port)
export OD_SIDECAR_IPC_PATH="$SOCK"     # discovery: flag > OD_DAEMON_URL > this socket > 127.0.0.1:7456
node "$OD_BIN" tools design-systems read --path preview/colors.html   # read-only example
node "$OD_BIN" automation list --json                                  # read-only
node "$OD_BIN" memory tree list --json                                 # read-only
node "$OD_BIN" ui list --project <projectId> --json                   # read-only
# (the above need the Open Design app running so $SOCK exists)

# ---- Standalone headless daemon (desktop app closed) -----------------------
node "$OD_BIN" --no-open                # binds 127.0.0.1:7456 by default
```

> **Note:** the verbs above that read the daemon need the Open Design desktop app running so the socket exists. The `mcp install … --print` dry-run is covered in [mcp_wiring.md](mcp_wiring.md).

---

## 7. UNCERTAIN / NEEDS LIVE VERIFICATION

Carry these forward and resolve them with a live, non-mutating check before relying on them. They were the open items the terminal-surface investigation could not close with `--help`/`--version` alone.

1. **Exact `command[0]` (`process.execPath`) the installer writes.** The install code uses the *daemon's* `process.execPath`. The live daemon runs inside `Open Design Helper.app/Contents/MacOS/Open Design Helper`, so the auto-installed value may be the **Helper** path, not `Contents/MacOS/Open Design`. The main binary works as node (verified via `--help`). Confirm the installed string with `od mcp install opencode --print --json`.
2. **Exact `OD_DATA_DIR` value** in the installed `env` (under `~/Library/Application Support/Open Design/namespaces/release-stable/…`). Get it from the dry-run.
3. **`curl https://open-design.ai/install.sh | sh -s <agent>` contents.** Not shipped in the bundle, and the global `od` shim it creates is unverified. Prefer the local `node "$OD_BIN" …` form.
4. **Does the daemon truly die when the app quits?** Strongly inferred (Electron child, no packaged parent-monitor). Verify by closing the app and running `ls /tmp/open-design/ipc/release-stable/`.
5. **Does `od --no-open` give a working headless daemon on `127.0.0.1:7456` with the desktop app closed**, and can `od mcp` and `start_run` drive it fully without the GUI? Default 7456 is confirmed from help, but this was not executed.
6. **Auth and token requirements per verb.** Whether `start_run`, `media generate`, and `research search` need a logged-in `vela` account or `OD_TOOL_TOKEN` when invoked by a *user* (rather than a daemon-spawned agent). Needs a live non-mutating call.
7. **`od mcp live-artifacts` tool set.** Produced no `--help` output. Enumerate it by starting the server and listing tools.
8. **Whether `od mcp install` re-derives a `7456` fallback entry** when run while the daemon is down (the fallback path) versus the socket-mode entry when up. Confirm both with dry-runs in each state.

---

## 8. REFERENCES

- [mcp_wiring.md](mcp_wiring.md) - the install commands, the written config shape, the manual fallback, and daemon-URL discovery.
- [tool_surface.md](tool_surface.md) - the MCP tool surface and the surface / gate / omit policy.
- [SKILL.md](../SKILL.md) - the skill contract these references support.
