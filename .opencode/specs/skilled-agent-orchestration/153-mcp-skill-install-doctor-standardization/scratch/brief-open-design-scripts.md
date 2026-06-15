You are a precise implementation worker dispatched by an orchestrator. Do exactly the scoped task below and nothing else. Work in the current repository (the Public code environment).

TRACKING / GATE 3: This work is tracked under the spec folder
.opencode/specs/skilled-agent-orchestration/153-mcp-skill-install-doctor-standardization
Gate 3 is PRE-APPROVED by the orchestrator. Do NOT ask about spec folders. Do NOT create or modify any spec-folder docs. Proceed directly with the file writes below.

HARD CONSTRAINTS (all mandatory):
- SCOPE LOCK: Create ONLY the three files in the ALLOWLIST. Touch nothing else (no INSTALL_GUIDE.md, no README.md, no SKILL.md, no mcp-servers).
- READ FIRST: Read every file in REFERENCES before writing.
- House voice: NO em dashes anywhere. Avoid semicolons in prose/comment sentences (shell-syntax semicolons inside code are fine).
- Comment hygiene [HARD BLOCK]: NEVER put spec paths, packet numbers, ADR/REQ/CHK/task ids, or "phase N" labels in comments. Comments state the durable WHY only.
- NO git: do not run git add/commit/push. The orchestrator commits.
- Do NOT install anything, do NOT run the scripts, do NOT start the daemon, do NOT wire any MCP, do NOT pipe any remote installer to a shell. Authoring only.
- SELF-VERIFY: after writing, run `bash -n` on EACH of the three files and confirm each parses.

ALLOWLIST (create these three new files):
- .opencode/skills/mcp-open-design/scripts/_common.sh
- .opencode/skills/mcp-open-design/scripts/install.sh
- .opencode/skills/mcp-open-design/scripts/doctor.sh

REFERENCES (read first):
- .opencode/skills/mcp-figma/scripts/_common.sh   (TEMPLATE for _common.sh: helpers + binary resolution + path helpers + constants)
- .opencode/skills/mcp-figma/scripts/install.sh   (TEMPLATE for install.sh: prerequisites -> detect -> verify -> report next steps; flags; never connects/patches)
- .opencode/skills/mcp-figma/scripts/doctor.sh    (TEMPLATE for doctor.sh: read-only, report-only, never prints secrets)
- .opencode/skills/mcp-open-design/SKILL.md        (the od CLI + daemon + socket facts; read sections "HOW IT WORKS", Prerequisites, Rules)
- .opencode/skills/mcp-open-design/references/od_cli_reference.md   (locating the CLI, the daemon/socket model, the od verb surface)

CRITICAL FACTS about Open Design (use these EXACTLY, do not invent paths or verbs):
- There is NO npm package and NO global `od` on PATH. A bare `od` is the unrelated /usr/bin/od octal-dump tool and must never be used.
- The `od` CLI ships INSIDE the desktop app. Canonical location:
  OD_APP = "/Applications/Open Design.app"   (also check "$HOME/Applications/Open Design.app")
  OD_BIN = "$OD_APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
  The CLI is invoked as:  node "$OD_BIN" <verb...>   (it is a Node script, NOT a binary; the ELECTRON_RUN_AS_NODE=1 form also exists but `node "$OD_BIN"` is the documented baseline).
- The desktop app (v0.9.0+) hosts a local daemon that answers every tool call, so the app must be open at run time. The daemon is discovered over a Unix socket:
  OD_SOCKET = "/tmp/open-design/ipc/release-stable/daemon.sock"
- The daemon HTTP port is EPHEMERAL and rotates on every restart. NEVER hardcode or probe a fixed HTTP port (7456 is only the default of a standalone `od --no-open` daemon). Rediscover from the socket if needed.
- MCP wiring is a SEPARATE, gated step (not part of install): `node "$OD_BIN" mcp install opencode --print --json` previews and writes nothing; without `--print` it deep-merges the agent config. install.sh must NOT auto-wire; it only reports this as a next step.
- Node.js is REQUIRED (the CLI runs under node).

CONTRACT for each file:

A) scripts/_common.sh  (source this, do not run directly)
   - Top WHY comment: the od CLI is not an npm package and not a global binary; it ships inside the Open Design desktop app and is run as `node <daemon-cli.mjs>`. A bare `od` is the unrelated octal-dump tool.
   - `set -euo pipefail`.
   - log/info/ok/warn/err color helpers identical to mcp-figma/scripts/_common.sh.
   - `od_app_path()` : echo the first existing app dir among the two candidates, return 1 if none.
   - `od_bin()` : if an app dir is found AND "$app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs" exists, echo that full path and return 0; else return 1.
   - `node_major()` : same as the figma template.
   - Constants: `OD_SOCKET="/tmp/open-design/ipc/release-stable/daemon.sock"`.
   - A short comment that the HTTP port is ephemeral and must not be hardcoded.

B) scripts/install.sh  (install + verify ONLY, never wires MCP, never starts the daemon)
   - Source _common.sh.
   - Flags: --skip-verify, --verbose, --help (mirror the figma install.sh flag handling shape; you do NOT need --source/--repo-url since there is nothing to download).
   - check_prerequisites: Darwin baseline (warn on others), Node >= 18 REQUIRED (err+exit if missing), npm optional (info).
   - detect_app: locate "Open Design.app". If missing, warn that it is required at run time (the app hosts the daemon and ships the CLI) and point the user to the app download in INSTALL_GUIDE.md. Do not exit fatally just because the app is closed/missing; this script verifies wiring readiness.
   - locate_cli + verify: resolve od_bin(); if found, run `node "$OD_BIN" --version` (fall back to `--help`) and report. If not found, err with the exact expected path and instruct installing/opening the desktop app.
   - report_next_steps: 1) open the Open Design desktop app, 2) PREVIEW MCP wiring with `node "$OD_BIN" mcp install opencode --print --json` (writes nothing) and review before wiring, 3) run doctor.sh for diagnostics. Make clear install.sh itself wires nothing.
   - WHY comment near the top: unlike a normal CLI there is nothing to npm-install; "install" here means verifying the desktop app and locating its bundled od CLI.

C) scripts/doctor.sh  (read-only diagnostics, report-only)
   - Source _common.sh. Top WHY comment: read-only, changes nothing, never prints secrets, never starts the daemon or wires MCP.
   - Checks (report-only): platform; Node >= 18; Open Design.app presence; od CLI (daemon-cli.mjs) locatable via od_bin(); `node "$OD_BIN" --version`; daemon socket present at OD_SOCKET; desktop app running (`pgrep -f "Open Design"` best-effort); whether an "open-design" MCP entry is present in `~/.config/opencode/opencode.json` (grep for "open-design", report presence only) and best-effort `claude mcp list 2>/dev/null | grep -qi open-design` if `claude` is on PATH.
   - Explicitly note in an info line that the daemon HTTP port is ephemeral, so this doctor does not probe a fixed port.
   - exit 0, change nothing.
   - Final log line: read-only, point to install.sh + INSTALL_GUIDE.md, and note the app must be open for live tool calls.

OUTPUT: End with a short report: the three full paths written, the `bash -n` result for each, and any assumption you had to make.
