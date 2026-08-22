# sk-vision host adapters

## 1. OVERVIEW

The skill drives four coding hosts. Two attach tools in-process and two attach them over MCP. The in-process hosts use command-gated activation by default.

| Host | Attach model | Source in `hooks/` | Host load path |
|------|--------------|--------------------|----------------|
| **OpenCode** | in-process JS plugin with `/vision` hook | `opencode/sk-vision.ts` (built to `sk-vision.js`) | `.opencode/plugins/sk-vision.js` → symlink |
| **Pi** | in-process TS extension with hidden tools and `/vision` prompt | `pi/sk-vision.ts` | `.pi/extensions/sk-vision.ts` → symlink |
| **Devin** | MCP (stdio) | `devin/mcp_config.json` | `.devin/mcp_config.json` → symlink |
| **Cursor** | MCP (stdio) | `cursor/mcp.json` (portable reference) | `.cursor/mcp.json`: a real Cursor-owned config carrying sk-vision. It is deliberately not in `.claude/mcp.json` |

All four sources are also mirrored into the shared hook hub at `.opencode/hooks/sk-vision/{pi,opencode,cursor,devin}` (per-file symlinks back to these sources), so the fleet sees every host's entry in one place.

---

## 2. WHY CURSOR AND DEVIN DIFFER FROM PI AND OPENCODE

Cursor and Devin have no in-process plugin API. They attach tools only through the **Model Context Protocol**, so both launch one shared server at `../vision-runtime/src/mcp/server.ts`, built to `../vision-runtime/dist/mcp-server.js`, that exposes the same 13 `sk_vision_*` tools. There is no per-host adapter code for them. The adapter is the MCP config that names the server.

- **Devin** loads a dedicated `.devin/mcp_config.json`, so the skill owns `devin/mcp_config.json` and `.devin/mcp_config.json` symlinks to it. This follows the same own-the-source pattern as Pi and OpenCode.
- **Cursor** reads `.cursor/mcp.json`, which in this repo is a **real, Cursor-owned file** (it previously symlinked to the shared `.claude/mcp.json`, but sk-vision was intentionally decoupled so Claude Code does not attach it). The skill still cannot own that per-repo file, so `cursor/mcp.json` here is the **portable** sk-vision entry: the exact block to drop into any Cursor MCP config. In this repo sk-vision lives in `.cursor/mcp.json` and is absent from `.claude/mcp.json`.

> **Cursor env scope.** Cursor reads `.cursor/mcp.json`, which is a real Cursor-owned file in this repo. It does not read `.claude/mcp.json`. Cursor honors a per-server `env` block only from its own config scope. To set a server env such as `SK_VISION_MODEL=moondream3-preview` for a dispatched cursor-agent, author the `env` in `.cursor/mcp.json` or use an `envFile`. A shell-env prefix on the dispatch does not reach the host-spawned MCP server. Setting it in `.claude/mcp.json` has no effect on Cursor. sk-vision no longer lives there.

The MCP server stays in `vision-runtime/` rather than under `hooks/` because it needs the MCP SDK dependency, which resolves inside the runtime package.

Because Cursor and Devin launch that server as a child process, it is bound to its host's lifetime and never lingers as an orphan. One idempotent shutdown closes the runtime client, which reaps the Python child, then exits. It runs on every teardown path: the MCP transport closing, stdin reaching `end` or `close` and `SIGTERM`/`SIGINT`/`SIGHUP`. A `SIGKILL`ed host delivers no signal and no clean EOF. A watchdog self-terminates on reparent-to-init (`process.ppid === 1`). Its timer is unref'd so it never keeps an idle server alive.

---

## 3. COMMAND-GATED VISION

The default posture is opt-in and idle. No host auto-inspects an attached image because of a normal message.

- **OpenCode**: `/vision <question>` runs in the `command.execute.before` hook. It fetches the latest session image, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down after the call. Bare `/vision` returns scene, caption and OCR for the latest image. The build still emits `dist/plugin.js` and the host load path still points to that artifact.
- **Pi**: `/vision <question>` drives the hidden `sk_vision_inspect` tool. Bare `/vision` asks in the conversation or returns a full read because a prompt file cannot open a UI input box. Each call opens a fresh runtime and tears it down afterward. `SK_VISION_AUTOINSPECT=1` restores visible tools and legacy auto-inspect.
- **Cursor**: its `/vision` prompt drives the MCP tool registered in `.cursor/mcp.json`.
- **Devin**: it has no command surface, so it calls the MCP tool directly. The Cursor and Devin instruction rules remain unchanged.

---

## 4. FRESH-CHECKOUT NOTE

`vision-runtime/dist/mcp-server.js` and `opencode/sk-vision.js` are gitignored build artifacts. Run `bun run build` in `vision-runtime/` before the OpenCode plugin or the Cursor/Devin MCP server can launch.
