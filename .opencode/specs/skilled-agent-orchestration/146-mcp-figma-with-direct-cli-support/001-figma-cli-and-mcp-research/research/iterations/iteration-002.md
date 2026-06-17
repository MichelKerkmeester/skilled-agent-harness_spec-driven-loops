# Iteration 002 — Figma MCP landscape + Code Mode integration

- **Wave:** 1 (of 3)
- **Executor:** `openai/gpt-5.5-fast --variant high` via cli-opencode (read-only seat, exit 0)
- **Seat id:** bjgmtjwa1
- **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-002.txt`
- **Raw output:** `../raw/iter-002.out`
- **Confidence (seat self-report):** medium-high

> Orchestrator note: seat used web fetch + local Read successfully. Claims tagged ⚠️VERIFY below are file:line citations I will spot-check against the real code before relying on them in the build (a finding is a hypothesis until the cited code is opened).

---

## Official Figma MCP (remote vs desktop): endpoints, transport, auth, tool surface

**Remote server (Figma-recommended):**
- Endpoint: `https://mcp.figma.com/mcp`
- Transport: **HTTP MCP**. Claude Code: `claude mcp add --transport http figma https://mcp.figma.com/mcp`. VS Code config uses `"type":"http"`, `"url":"https://mcp.figma.com/mcp"`.
- Auth: **Figma OAuth** sign-in flow (not a personal API token).
- Scope: recommended, no desktop app required, broadest feature set.
- **Client gate (key risk):** only clients listed in the Figma MCP Catalog can connect; unsupported clients waitlist. Code Mode / OpenCode may hit this gate.
- Rate/access limits: View/Collab seats ~6 calls/month; Full/Dev seats higher (Starter/Pro ≤200/day 10–15/min, Org ≤200/day 15/min, Enterprise ≤600/day 20/min).
- Write access: `use_figma` write-to-canvas requires a **Full seat**; Dev seats are read-only (design context, variables, screenshots).
- Sources: developers.figma.com/docs/figma-mcp-server/{,, remote-server-installation, rate-limits-access, write-to-canvas}

**Desktop/local server:**
- Endpoint: `http://127.0.0.1:3845/mcp`
- Transport: **HTTP MCP**. Claude Code: `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp`.
- Auth/session: via the logged-in Figma desktop app. Requires latest desktop app + an open Figma Design file + Dev Mode enabled + "Enable desktop MCP server" toggle.
- Scope: positioned for specific org/enterprise needs; remote is preferred/broadest.
- Selection support: desktop supports **current-selection** prompting; remote is **link-based** (needs a frame/layer link).

**Official tool surface (from docs):**
- Shared/non-remote-only: `add_code_connect_map`, `get_code_connect_map`, `get_code_connect_suggestions`, `get_design_context`, `get_figjam`, `get_metadata`, `get_screenshot`, `get_variable_defs`, `send_code_connect_mappings`.
- Remote-only: `create_new_file`, `generate_diagram`, `generate_figma_design`, `get_context_for_code_connect`, `get_libraries`, `search_design_system`, `upload_assets`, `use_figma`, `whoami`.
- **Correction to my prior assumption:** docs list `get_design_context` (not `get_code`) and `get_screenshot` (not `get_image`).

**Optional Code-Mode default:** official **remote** when Code Mode can auth/connect (recommended, no desktop dep, broadest surface); **desktop** as practical fallback when remote OAuth/catalog gating fails, or when the workflow is "current desktop selection → context/variables/screenshots".

## Community alternatives + verdict
- **Framelink / GLips `figma-developer-mcp`**: mature third-party **stdio** MCP, uses a Figma personal access token, simplifies Figma API responses for coding agents. **Already present** in this repo's `.utcp_config.json` as manual `figma` (`npx -y figma-developer-mcp@latest --stdio`, `FIGMA_API_KEY`). ⚠️VERIFY `.utcp_config.json:69-88` (corroborated: I independently saw this entry). Source repo is `GLips/Figma-Context-MCP` (the `FramelinkAI/...` URL 404s).
- **`grab/cursor-talk-to-figma-mcp`**: plugin/WebSocket bridge; read+modify, but heavy setup (Bun, WS server, Figma plugin, channel join).
- **Verdict:** support **official-first**, document **Framelink** as the compatibility fallback (already fits the project's stdio Code Mode pattern). Skip TalkToFigma unless the skill expands into Figma plugin automation.

## Code Mode registration (.utcp_config.json — concrete examples)
Project config shape: `manual_call_templates[]`, each `{name, call_template_type:"mcp", config.mcpServers.{name}.{transport,command,args,env}}`. Tools called as `manual.manual_{tool}`.

**Code Mode HTTP support (load-bearing claim):** local Code Mode server imports `@utcp/mcp` + `@utcp/http`; `@utcp/mcp` documents `stdio` and `http` (`transport:"http"`, `url`). ⚠️VERIFY `.opencode/skills/mcp-code-mode/mcp_server/index.ts:17-20` + `package.json:58-67` — this gates whether we can register an HTTP Figma MCP at all.

Remote official entry:
```json
{ "name": "figma", "call_template_type": "mcp",
  "config": { "mcpServers": { "figma": {
    "transport": "http", "url": "https://mcp.figma.com/mcp",
    "timeout": 60, "sse_read_timeout": 300 } } } }
```
Desktop fallback entry:
```json
{ "name": "figma_desktop", "call_template_type": "mcp",
  "config": { "mcpServers": { "figma_desktop": {
    "transport": "http", "url": "http://127.0.0.1:3845/mcp",
    "timeout": 60, "sse_read_timeout": 300 } } } }
```
OAuth-bridge fallback (if direct HTTP OAuth fails in Code Mode) — `mcp-remote` stdio bridge:
```json
{ "name": "figma", "call_template_type": "mcp",
  "config": { "mcpServers": { "figma": {
    "transport": "stdio", "command": "npx",
    "args": ["-y","mcp-remote@latest","https://mcp.figma.com/mcp","--transport","http-first"],
    "env": {} } } } }
```

## Code Mode invocation (call_tool_chain)
Naming: `{manual}.{manual}_{tool}`. Discover first with `search_tools` / `tool_info`, then:
```ts
// desktop current-selection
await call_tool_chain({ code: `
  const [ctx, vars, meta] = await Promise.all([
    figma_desktop.figma_desktop_get_design_context({}),
    figma_desktop.figma_desktop_get_variable_defs({}),
    figma_desktop.figma_desktop_get_metadata({})
  ]);
  return { success:true, source:"figma_desktop", ctx, vars, meta };` });
// remote link-based
await call_tool_chain({ code: `
  const url = "https://www.figma.com/design/FILE_KEY/Name?node-id=NODE_ID";
  const [ctx, vars, meta, cc] = await Promise.all([
    figma.figma_get_design_context({ url }),
    figma.figma_get_variable_defs({ url }),
    figma.figma_get_metadata({ url }),
    figma.figma_get_code_connect_map({ url })
  ]);
  return { success:true, source:"figma_remote", ctx, vars, meta, cc };` });
```
**Param caveat:** docs don't publish per-tool JSON schemas — run `tool_info()` after registration and adapt `url`/`nodeId`/file-key params. Cleanup: static registrations need none; dynamic `register_manual` → `deregister_manual`.

## CLI-vs-MCP routing line for mcp-figma
- **figma-cli = PRIMARY**: direct, fast, scriptable Figma ops — inspect/export/create/modify assets or files, terminal-first.
- **Figma MCP via Code Mode = OPTIONAL**: when the agent needs design context FROM Figma as model input — design context, variables/styles, metadata, screenshots, Code Connect maps, design-system search, or remote write-to-canvas.
- Analog to chrome-devtools: CLI = fast/token-efficient default; MCP = type-safe multi-tool orchestration / pull-context path.

## Gotchas & constraints
- Remote = recommended+broadest BUT catalog/client gate may block Code Mode/OpenCode; auth is OAuth (not token).
- Desktop needs latest app + open Design file + Dev Mode + enabled desktop MCP server; fixed port 3845 (conflict/disabled → discovery fails); selection-only (remote is link-only).
- Rate limits by plan/seat; View/Collab severely limited.
- Write-to-canvas: Full seat, 20kb response cap, no asset/image support yet, custom fonts unsupported, beta.
- MCP responses token-heavy → prefer `get_metadata` (sparse XML outline) before `get_design_context` on large designs.
- Repo's current `figma` manual is third-party Framelink, NOT official.

## Confidence + unknowns
Medium-high. Local reads (mcp-code-mode SKILL, chrome-devtools SKILL+INSTALL_GUIDE, .utcp_config.json) + web (Figma official docs ×7, Framelink/npm, TalkToFigma, @utcp/mcp, mcp-remote) succeeded; `FramelinkAI/figma-developer-mcp` 404'd.
**Unknowns:** (1) whether Figma's catalog/OAuth gate admits this project's Code Mode client on the remote server; (2) exact official tool input schemas (use `tool_info()` post-register); (3) whether Code Mode's direct HTTP OAuth suffices for Figma remote, or the `mcp-remote` bridge / desktop-local is needed.
