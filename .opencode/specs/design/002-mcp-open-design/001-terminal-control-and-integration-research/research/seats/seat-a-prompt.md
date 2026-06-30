# Seat A — Open Design terminal-control surface (READ-ONLY reverse-engineering)

You are a senior reverse-engineering analyst. Produce a verified, precise map of EVERY way to drive the installed **Open Design** desktop app from a terminal — optimized for **opencode** and **Claude Code** as the driving agents — WITHOUT using the app's in-app chat UI.

## Verified context (verify + deepen; do not just restate)
- Open Design v0.9.0, Electron + Next.js, installed at `/Applications/Open Design.app` (bundle id `io.open-design.desktop`); currently running.
- CLI engine: `/Applications/Open Design.app/Contents/Resources/open-design/bin/vela` (Mach-O arm64) plus the node entry `app/prebundled/daemon/daemon-cli.mjs` (per `Contents/Resources/open-design-config.json` → `daemonCliEntryRelative`). The CLI presents itself as `od` in help.
- Daemon runs as a sidecar over Unix sockets: `/tmp/open-design/ipc/release-stable/{daemon,desktop,web}.sock`. Internal `od://` scheme (registered on the network service). Default TCP would be `127.0.0.1:7456` (`OD_PORT`/`OD_BIND_HOST`) but the desktop build appears socket-only / ephemeral-port.
- `od` verbs (from `--help`): `od [--port --host --no-open]` (start daemon + web UI); `od tools live-artifacts|connectors|design-systems read`; `od artifacts create`; `od mcp` (stdio MCP server); `od mcp live-artifacts`; `od research search`; `od plugin ...`; `od automation <list|get|create|update|run|runs|pause|resume|delete>`; `od memory tree`; `od ui <list|show|respond|revoke|prefill>`; `od media generate`; `od diagnostics export`. Agent-runtime form: `"$OD_NODE_BIN" "$OD_BIN" tools ...`.
- `od mcp` stdio tools: `list_projects, get_active_context, get_artifact, get_project, get_file, search_files, list_files, create_artifact` (project defaults to the one open in the app; response stamps `usedActiveContext`). `--daemon-url` resolution: flag → `OD_DAEMON_URL` → `OD_SIDECAR_IPC_PATH` → `http://127.0.0.1:7456`.

## Tasks
1. **EXACT terminal invocation.** There is no global `od` on PATH (`/usr/bin/od` is the unrelated octal-dump tool). Given ONLY the installed desktop app, what exact command does a user run to invoke the `od` CLI? Determine the relationship between `bin/vela`, `daemon-cli.mjs`, and any `od` shim. What does `od mcp install <agent>` and/or `curl https://open-design.ai/install.sh | sh -s <agent>` create, and where? Give copy-paste commands that work on THIS machine.
2. **MCP wiring for opencode AND Claude Code.** The EXACT config each needs (the JSON / command+args the user adds), how the daemon URL is discovered at runtime, whether the desktop app must be running, and what `od mcp install opencode` / `od mcp install claude` actually write (file path + contents). Find the per-client snippet logic (the app's Settings → MCP server panel).
3. **Full headless verb surface.** For each of `mcp, automation, ui, artifacts, media, research, plugin, tools, memory`: what it does, key args, and read-only vs mutating. Highlight which verbs let a terminal drive the app's work without the chat UI (esp. `automation`, `ui respond`, `artifacts create`).
4. **Daemon / socket / port model.** Unix sockets vs TCP 7456; how `od mcp` finds the live daemon; what happens if the desktop app is closed (does the daemon persist? can `od --no-open` start a headless daemon?).

## Method & constraints
- READ the bundle freely: `Contents/Resources/open-design` (bin, skills, design-systems, plugins, prompt-templates), `Contents/Resources/app/prebundled/daemon`, `open-design-config.json`. You MAY run `od` / `vela` / `node <daemon-cli.mjs>` subcommands with `--help` or `--version` ONLY. **NO mutating commands** (no `install`, no `create`, no `automation run`, no daemon start).
- Cite evidence: file paths, exact help output, config contents.
- **Spec folder: `.opencode/specs/design/002-mcp-open-design` (pre-approved — skip Gate 3).** This is a shared working tree with other active sessions: you may WRITE exactly ONE file — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/design/002-mcp-open-design/001-terminal-control-and-integration-research/research/seats/seat-a.findings.md`. Do NOT create, modify, move, or delete ANY other file. Do NOT run `git` or any mutating/install command.

## Output
Write your COMPLETE structured findings (markdown) to that one file, with sections per tasks 1–4, an "EXACT COMMANDS FOR THIS MACHINE" block, and an "UNCERTAIN / NEEDS LIVE VERIFICATION" list. Put a 1-paragraph summary in your final reply.
