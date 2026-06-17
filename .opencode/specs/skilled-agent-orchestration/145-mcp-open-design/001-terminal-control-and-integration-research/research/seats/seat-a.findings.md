# Seat A — Open Design terminal-control surface (verified reverse-engineering)

**App:** Open Design v0.9.0 (appVersion `0.9.0` per `Contents/Resources/open-design-config.json`), Electron + Next.js, bundle id `io.open-design.desktop`, installed at `/Applications/Open Design.app`, currently running.
**Method:** Read the bundle + ran only `--help` / `--version` (no mutating commands, no `install`, no daemon start, no `git`). Every load-bearing claim below is tagged **[CONFIRMED]** (I read the code or ran `--help`/`--version` and quote it) or **[INFERRED]** (reasoned from code, needs a live mutating check to be certain — see the UNCERTAIN list).

---

## Headline corrections to the prior "verified context"

1. **`vela` is NOT the `od` CLI.** `vela --help` self-identifies as *"Vela CLI"* with commands `agent / auth / completion / help / login / model / models / whoami` — it is the **AMR (agent-model-runtime) / auth client for the cloud model service**, not the `od` daemon CLI. `vela --version` → `0.0.9`. **[CONFIRMED — ran both]**
2. **The `od` CLI *is* `daemon-cli.mjs` run under a Node-compatible runtime.** `node .../daemon-cli.mjs --help` prints the full `od …` usage. **[CONFIRMED — ran]**
3. **`od mcp` exposes ~18 MCP tools, not 8.** The 8 listed in `od mcp --help` are a documentation subset. The stdio server actually registers the entire `TOOL_DEFS` array (`server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))`, `chunk-YALIBYIQ.mjs:15875`), which includes **mutating + destructive** tools: `write_file`, `delete_file`, `delete_project`, `create_project`, **`start_run`** (commission a full generation), `cancel_run`, `get_run`, `list_skills`, `list_plugins`, `list_agents`. This is the single most important finding for "drive the app without the chat UI." **[CONFIRMED — read registry]**
4. **The desktop daemon is socket-discovered but speaks HTTP on an *ephemeral* loopback port** (not a fixed `7456`). `7456` is only the default for a *standalone* `od --no-open` daemon. **[CONFIRMED — read resolution code + process table]**

---

## Task 1 — EXACT terminal invocation

### 1a. There is no `od` on PATH; what `od` actually is
- `command -v od` → `/usr/bin/od` (the unrelated octal-dump tool). No `od` shim in `~/.local/bin`, `/usr/local/bin`, `/opt/homebrew/bin`, or the app `bin/`. **[CONFIRMED — ran `which -a od` + `ls`]**
- The literal string `od` in all help text is just the CLI's **branding/argv0**, produced by `daemon-cli.mjs`. It only becomes a real PATH command if you create a shim (what `install.sh` does — see 1c).

### 1b. The three binaries and how they relate
| Artifact | Path | What it is |
|---|---|---|
| `vela` | `…/Resources/open-design/bin/vela` (Mach-O arm64, 12 MB) | **AMR/auth client** for the cloud model runtime (`vela agent/login/whoami`). **Not** `od`. **[CONFIRMED — `vela --help`]** |
| `daemon-cli.mjs` | `…/Resources/app/prebundled/daemon/daemon-cli.mjs` | **The `od` CLI.** 9-line ESM shim: sets `process.env.OD_BIN ??= selfPath; OD_DAEMON_CLI_PATH ??= selfPath;` then `import("./chunks/cli-CYV7OPSL.mjs")` (the 300 KB real CLI). **[CONFIRMED — read file]** |
| `Open Design` (Electron) | `…/Contents/MacOS/Open Design` (+ `…/Frameworks/Open Design Helper.app/Contents/MacOS/Open Design Helper`) | The **Node-compatible runtime** (`OD_NODE_BIN`). Packaged builds ship **no standalone `node`**; the CLI runs under Electron via `ELECTRON_RUN_AS_NODE=1`. **[CONFIRMED — `install-info` builder + ran it]** |

So the canonical agent form `"$OD_NODE_BIN" "$OD_BIN" …` resolves to **`OD_NODE_BIN` = an Electron binary in the bundle**, **`OD_BIN` = `daemon-cli.mjs`**. `daemon-cli.mjs:6` literally sets `OD_BIN` to its own path. **[CONFIRMED]**

### 1c. What `od mcp install <agent>` and `curl …/install.sh | sh` create
- **`od mcp install <agent>`** does NOT create an `od` shim. It registers Open Design's stdio MCP server **into the target agent's own config** (see Task 2). Supported slugs (`AGENT_SLUGS`, `cli-CYV7OPSL.mjs:1022`): `claude codex cursor copilot openclaw antigravity gemini pi vibe hermes cline kimi trae opencode`. **[CONFIRMED — read]**
- **`curl https://open-design.ai/install.sh | sh -s <agent>`**: I could **not** find the contents of `install.sh` in the bundle (it is a remote script, not shipped locally; bundle only references `https://open-design.ai/{marketplace,plugins,docs,schemas}` — `chunk-LKR7N75Y.mjs:19`, `chunk-HSZ43WJQ.mjs:187`). **[INFERRED]** Its job is almost certainly to (a) drop a global `od` wrapper on PATH that execs the bundled Electron-as-node against `daemon-cli.mjs`, and (b) run `od mcp install <agent>`. **Treat the exact contents as UNVERIFIED** — do not pipe-to-shell a remote script in this workflow; use the local invocations in the EXACT COMMANDS block instead.

---

## Task 2 — MCP wiring for opencode AND Claude Code

### 2a. The launch spec both clients install (from `GET /api/mcp/install-info`)
`computeInstallPayload()` / `buildMcpInstallPayload()` (`server-RB3XHRCQ.mjs:111829-111986`) build it from the **live daemon**:
```js
command = process.execPath            // the Electron runtime running the daemon NOW
args    = isSidecarMode ? [cliPath, "mcp"]
                        : [cliPath, "mcp", "--daemon-url", `http://127.0.0.1:${port}`]
env     = { OD_DATA_DIR, ...(isSidecarMode ? {OD_SIDECAR_IPC_PATH} : {}),
            ...(electronAsNode ? {ELECTRON_RUN_AS_NODE:"1"} : {}) }
```
- `cliPath = OD_BIN` = `…/daemon-cli.mjs`. `isSidecarMode` = `OD_SIDECAR_IPC_PATH` is set — **true for the desktop build**. **[CONFIRMED]**
- So on this machine the installed entry is effectively: **command = the bundle's Electron binary**, **args = `[<…>/daemon-cli.mjs, "mcp"]`**, **env = `{OD_DATA_DIR, OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock, ELECTRON_RUN_AS_NODE=1}`**. The MCP server then **discovers the live (ephemeral) daemon URL from the socket at startup**, so the config stays valid across daemon restarts. **[CONFIRMED — read; exact `execPath`/`OD_DATA_DIR` strings = INFERRED, see UNCERTAIN]**
- Fallback if the daemon is down at install time (`resolveMcpLaunchSpec`, `cli-CYV7OPSL.mjs:2210`): `{command:"od", args:["mcp","--daemon-url",base], env:{}}` — a minimal entry that assumes a PATH `od`.

### 2b. opencode — JSON file write (`planAgentInstall` case `"opencode"`, `cli-CYV7OPSL.mjs:1166`)
- **File:** `~/.config/opencode/opencode.json`  •  **key path:** `mcp`  •  **server key:** `open-design` (override with `--name`).
- **Deep-merges** (`applyJsonInstall`) — preserves existing config. Entry shape:
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
Note opencode uses `command` as an **array** and `environment` (not `env`). **[CONFIRMED — read]**

### 2c. Claude Code — CLI delegation (`planAgentInstall` case `"claude"`, `cli-CYV7OPSL.mjs:1063`)
`od mcp install claude` does **not** write a file directly; it shells out to the `claude` CLI:
```
claude mcp add --scope user open-design \
  -e OD_DATA_DIR=<…> -e OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock -e ELECTRON_RUN_AS_NODE=1 \
  -- <OD_NODE_BIN electron> <…>/daemon-cli.mjs mcp
```
(remove = `claude mcp remove --scope user open-design`; verify = `claude mcp get open-design`). Requires the `claude` binary on PATH. **[CONFIRMED — read]**

### 2d. Runtime daemon-URL discovery (`resolveDaemonUrl`, `cli-CYV7OPSL.mjs:267-291`)
Order: **`--daemon-url` flag → `OD_DAEMON_URL` → discover via `OD_SIDECAR_IPC_PATH`** (connect the unix socket, send `STATUS`, take `status.url`) **→ `http://127.0.0.1:7456`**. So with `OD_SIDECAR_IPC_PATH` set, the ephemeral port is found automatically; without it you depend on a `7456` daemon. **[CONFIRMED — read]**

### 2e. Must the desktop app be running?
**Yes for the desktop/socket path.** The daemon is a child sidecar of the Electron app (see Task 4); `od mcp` proxies tool calls to it. If the app is closed, the socket disappears and discovery falls through to `127.0.0.1:7456`, which fails unless a standalone `od --no-open` daemon is up. **[CONFIRMED app dependency; standalone fallback = INFERRED]**

### 2f. "Settings → MCP server" panel
The per-client copy-paste snippet (absolute paths + a Cursor deeplink) is generated from the same `/api/mcp/install-info` endpoint, so the panel matches `od mcp install … --print` byte-for-byte (`printMcpInstallHelp`, `cli-CYV7OPSL.mjs:2404`). **[CONFIRMED]**

---

## Task 3 — Full headless verb surface

### 3a. `od` top-level verbs (from `od --help`, **[CONFIRMED — ran]**)
| Verb | Purpose | Class |
|---|---|---|
| `od [--port --host --no-open]` | Start local daemon + chat web UI (`--no-open` = don't open browser). Defaults `--port 7456` (`OD_PORT`), `--host 127.0.0.1` (`OD_BIND_HOST`). | **mutating** (starts server) |
| `od mcp [--daemon-url]` | stdio MCP server proxying project tools to the daemon. | read+write (tool-dependent) |
| `od mcp install <agent>` | Register OD MCP into an agent's config. `--uninstall --print/--dry-run --json --name --daemon-url`. | **mutating** (writes config) |
| `od mcp live-artifacts` | stdio MCP exposing live-artifact + connector tools (no `--help` output). | read+write |
| `od tools live-artifacts <create\|list\|update\|refresh>` | Live artifacts via daemon wrappers. | list=read; create/update/refresh=**mutating** |
| `od tools connectors <list\|execute\|github-design-context\|local-design-context\|design-system-package-audit>` | Discover/run connectors; build design-context packs. | list=read; execute=**mutating/side-effecting** |
| `od tools design-systems read --path <manifest-path> [--design-system <id>]` | Read active design-system pull-layer files (allowlisted). | **read-only** |
| `od artifacts create --name <path> --input <file> [--project] [--manifest] [--encoding] [--daemon-url]` | Create one project artifact file (rejects existing targets). | **mutating** |
| `od media generate --surface <image\|video\|audio> --model <id> …` (+ `media wait <taskId>`) | Generate media into the active project; picks up `OD_DAEMON_URL`/`OD_PROJECT_ID` injected by the daemon. | **mutating** |
| `od research search --query <text> [--max-sources 5] [--daemon-url]` | Tavily-backed shallow research; JSON to stdout. | read (external fetch) |
| `od automation <…>` | Drive the **Automations** surface headlessly (same store as the UI tab). | mixed (see 3c) |
| `od memory tree <list\|view\|edit\|move>` | Inspect/edit the memory tree injected into agent prompts. | list/view=read; edit/move=**mutating** |
| `od ui <list\|show\|respond\|revoke\|prefill>` | Read & **answer GenUI surfaces** (form/choice/confirmation/oauth-prompt) from any process. | list/show=read; respond/revoke/prefill=**mutating** |
| `od plugin <list\|info\|install\|uninstall\|apply\|doctor\|replay\|trust\|publish-repo\|open-design-pr\|scaffold\|pack\|export\|…>` | Plugin lifecycle via daemon. | mixed; install/apply/trust=**mutating** |
| `od diagnostics export [<path>] [--output] [--json] [--daemon-url]` | Bundle logs/machine-info/crashes into a zip (same as Settings → About). | **mutating** (writes a zip; otherwise safe/read-ish) |

### 3b. `od mcp` stdio tool surface — the FULL `TOOL_DEFS` (`chunk-YALIBYIQ.mjs:15452-15877`) **[CONFIRMED — read]**
This is what an opencode/Claude Code MCP client sees. Annotations: `READ_ANNOTATIONS` (readOnlyHint:true) vs `WRITE_ANNOTATIONS` (readOnlyHint:false) vs `destructiveHint:true`.

**Read-only (11):** `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files` (literal substring), `list_files`, `list_skills`, `list_plugins`, `get_run`, `list_agents`.
**Mutating (5):** `create_artifact` (rejects existing), `write_file` (overwrites/tolerates existing), `create_project`, **`start_run`**, `cancel_run`.
**Destructive (2, `destructiveHint:true`):** `delete_file`, `delete_project` (requires explicit `project` **and** `confirm:true`; no active-project fallback).

`project` defaults to the active OD project (expires ~5 min of inactivity); responses stamp `usedActiveContext`. **[CONFIRMED]**

### 3c. The verbs that drive the app's *work* without the chat UI
- **`start_run(prompt, [skill], [plugin], [inputs], [agent], [model])` + `get_run(runId)` + `get_artifact`** — the true headless equivalent of the chat box. Open Design **spawns its own inner agent** (`claude`/`codex`/`gemini`, per `list_agents`) to do the design work and returns files/`previewUrl`/`studioUrl`. `cancel_run` aborts. (`chunk-YALIBYIQ.mjs:15701`). This lets a terminal agent *commission* OD generations programmatically.
- **`od automation create/run/runs/…`** — schedule or fire a routine and harvest results; same store as the UI Automations tab, explicitly designed for external agents (hermes/openclaw/…). Schedules: `hourly:/daily:/weekdays:/weekly:`. **[CONFIRMED — ran `--help`]**
- **`od ui respond --run <runId> <surfaceId> --value… | --skip`** and **`od ui prefill`** — answer the app's GenUI forms/confirmations/oauth prompts from the terminal, so a run that blocks on a question can be unblocked headlessly. **[CONFIRMED — ran `--help`]**
- **`od artifacts create` / MCP `write_file` / `create_artifact`** — push files into a project without zip export.
- **`od media generate`** — produce image/video/audio into the active project.

### 3d. Resources + bundled content
`od mcp` advertises `capabilities.resources` and `od://design-systems/…` resource URIs (referenced in `start_run`/server instructions). The bundle also ships large local libraries under `…/Resources/open-design/`: ~152 `design-systems/`, ~139 `skills/`, ~111 `design-templates/`, plus `community-pets/`, `craft/`, `frames/`, `plugins/`, `prompt-templates/`. `od://` is an Electron custom protocol (registered `--standard-schemes=od …` on the network helper, seen in the process table) for the renderer — **not a terminal transport**. **[CONFIRMED — `ls` + process table; resource list = partially INFERRED]**

---

## Task 4 — Daemon / socket / port model

- **Transport is Unix-socket discovery + ephemeral loopback HTTP.** Live sockets confirmed: `/tmp/open-design/ipc/release-stable/{daemon,desktop,web}.sock` (`srwxr-xr-x`). Path scheme `resolveAppIpcPath` = `join(OD_SIDECAR_IPC_BASE|/tmp/open-design/ipc, namespace, "<app>.sock")`; `APP_KEYS={daemon,desktop,web}`, namespace `release-stable` (`chunk-YQ23VIX5.mjs:4,53,327`). **[CONFIRMED — read + `ls`]**
- **Daemon process:** the running daemon is `Open Design Helper … daemon-sidecar.mjs --od-stamp-app=daemon --od-stamp-mode=runtime --od-stamp-namespace=release-stable --od-stamp-ipc=…/daemon.sock --od-stamp-source=packaged` — **a child Electron helper of the desktop app, with NO `--port` stamp**, i.e. socket mode. The sidecar's HTTP server is started with `port: parsePort(OD_PORT)`; unset → `0` → **ephemeral 127.0.0.1 port**, advertised back via the socket `STATUS.url` (`daemon-sidecar.mjs:96-116`, `chunk-YQ23VIX5.mjs`). **[CONFIRMED — process table + read]**
- **How `od mcp` finds the live daemon:** `OD_SIDECAR_IPC_PATH` → connect socket → `STATUS` → `status.url` (the ephemeral `http://127.0.0.1:<port>`). Each new MCP spawn re-discovers it, so configs survive daemon restarts; a *running* MCP server caches the URL (restart the MCP client after a daemon restart). **[CONFIRMED — read]**
- **`7456` reality:** it is the **default only for a standalone `od`/`od --no-open` daemon** (`--port` default 7456 / `OD_PORT`, `--host` default 127.0.0.1 / `OD_BIND_HOST`). The desktop sidecar does **not** bind 7456; it's socket-discovered + ephemeral. **[CONFIRMED — read help + code]**
- **If the desktop app closes:** the daemon sidecar is a child process of the Electron app, so it dies with the app and the sockets are removed (`prepareIpcPath` rms stale sockets on next start). The packaged sidecar has no parent-PID self-monitor (that path, `attachParentMonitor`/`OD_TOOLS_DEV_PARENT_PID`, is **tools-dev only**); lifecycle is the normal Electron child-process teardown. **So the daemon does NOT persist headlessly after the app quits.** **[INFERRED — strong; needs the live close-the-app check]**
- **Headless-without-the-app path:** run `od --no-open` in a terminal to start a **standalone** daemon (binds `127.0.0.1:7456` by default; scans PATH for agent CLIs; serves chat UI + `/api/*`). That process lives as long as the terminal command runs. **[CONFIRMED from help; not executed]**
- **Auth:** Local project tools are gated by a **loopback same-origin check** (`isLocalSameOrigin`, `install-info` returns 403 cross-origin). `od tools …` wrappers expect `OD_DAEMON_URL` + `OD_TOOL_TOKEN` (bearer) **injected by the daemon when it spawns an agent**; run standalone they may need those env vars. `vela login/auth/whoami` governs the **cloud AMR models** (used by inner runs/`media generate`), separate from reading/writing local projects. **[CONFIRMED structure; exact token requirement per verb = INFERRED]**

---

## EXACT COMMANDS FOR THIS MACHINE

```bash
# ---- Canonical paths -------------------------------------------------------
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
OD_NODE_BIN="$APP/Contents/MacOS/Open Design"                            # Electron-as-node (no system node needed)
SOCK="/tmp/open-design/ipc/release-stable/daemon.sock"                   # live daemon socket

# ---- Invoke the `od` CLI (two equivalent forms) ----------------------------
# A) System node (present here: /opt/homebrew/bin/node v25.6.1) — VERIFIED:
node "$OD_BIN" --help

# B) PATH-independent, bundled Electron as Node (no system node) — VERIFIED:
ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" --help

# ---- Point any verb at the live desktop daemon (auto-discovers ephemeral port)
export OD_SIDECAR_IPC_PATH="$SOCK"     # discovery: flag > OD_DAEMON_URL > this socket > 127.0.0.1:7456
node "$OD_BIN" tools design-systems read --path preview/colors.html   # read-only example
node "$OD_BIN" automation list --json                                  # read-only
node "$OD_BIN" memory tree list --json                                 # read-only
node "$OD_BIN" ui list --project <projectId> --json                   # read-only
# (the above need the Open Design app running so $SOCK exists)

# ---- Wire opencode (writes ~/.config/opencode/opencode.json under "mcp") ----
#   (DRY-RUN first; the live daemon fills exact command/env from /api/mcp/install-info)
node "$OD_BIN" mcp install opencode --print --json     # preview only, writes nothing
node "$OD_BIN" mcp install opencode                    # actually install

# ---- Wire Claude Code (delegates to the `claude` CLI, --scope user) ---------
node "$OD_BIN" mcp install claude --print --json       # preview only
node "$OD_BIN" mcp install claude                       # runs: claude mcp add --scope user open-design -e … -- <electron> <daemon-cli.mjs> mcp

# ---- Manual MCP entry if you don't want the installer (opencode.json) -------
#   "mcp": { "open-design": { "type":"local",
#     "command": ["/Applications/Open Design.app/Contents/MacOS/Open Design",
#                 "/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs","mcp"],
#     "enabled": true,
#     "environment": { "ELECTRON_RUN_AS_NODE":"1",
#                      "OD_SIDECAR_IPC_PATH":"/tmp/open-design/ipc/release-stable/daemon.sock" } } }

# ---- Headless generation without the chat UI (via the MCP tools) -----------
#   create_project -> start_run(prompt,…) -> get_run(runId) -> get_artifact
#   reachable from opencode/Claude once the MCP server above is wired.
```
> **Note:** the `mcp install … --print` dry-run and the manual config were NOT executed (Seat A constraint = `--help`/`--version` only). They are reconstructed from the install code and are safe; verify exact `command[0]`/`OD_DATA_DIR` with the dry-run when permitted.

---

## UNCERTAIN / NEEDS LIVE VERIFICATION
1. **Exact `command[0]` (`process.execPath`) the installer writes.** Code uses the *daemon's* `process.execPath`; the live daemon runs inside `Open Design Helper.app/Contents/MacOS/Open Design Helper`, so the auto-installed value may be the **Helper** path, not `Contents/MacOS/Open Design`. The main binary works as node (I verified `--help`), but confirm the installed string via `od mcp install opencode --print --json`.
2. **Exact `OD_DATA_DIR` value** in the installed `env` (under `~/Library/Application Support/Open Design/namespaces/release-stable/…`) — get it from the dry-run.
3. **`curl https://open-design.ai/install.sh | sh -s <agent>` contents** — not shipped in the bundle; the global `od` shim it creates is unverified. Prefer the local `node "$OD_BIN" …` form.
4. **Does the daemon truly die when the app quits?** Strongly inferred (Electron child, no packaged parent-monitor). Verify by closing the app and `ls /tmp/open-design/ipc/release-stable/`.
5. **Does `od --no-open` give a working headless daemon on `127.0.0.1:7456` with the desktop app closed**, and can `od mcp`/`start_run` drive it fully without the GUI? (Default 7456 confirmed from help; not executed.)
6. **Auth/token requirements per verb.** Whether `start_run`/`media generate`/`research search` need a logged-in `vela` account or `OD_TOOL_TOKEN` when invoked by a *user* (vs daemon-spawned agent) — needs a live non-mutating call.
7. **`od mcp live-artifacts` tool set** — produced no `--help`; enumerate by starting it and listing tools.
8. **Whether `od mcp install` re-derives a `7456` fallback entry** when run while the daemon is down (the `resolveMcpLaunchSpec` fallback) vs the socket-mode entry when up — confirm both with dry-runs in each state.
