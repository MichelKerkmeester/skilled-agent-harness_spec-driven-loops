---
name: mcp-chrome-devtools
description: "Chrome DevTools orchestrator: routes between bdg CLI (fast, token-efficient) and Code Mode MCP (multi-tool integration)."
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.19.0
---

<!-- Keywords: chrome-devtools, cdp, browser-debugger-cli, bdg, browser-automation, terminal-debugging, screenshot-capture, network-monitoring, mcp-code-mode, orchestrator -->

# Chrome DevTools Orchestrator - CLI + MCP Integration

Browser debugging and automation through two complementary approaches: CLI (bdg) for speed and token efficiency, MCP for multi-tool integration.

## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User mentions "browser debugging", "Chrome DevTools", "CDP" explicitly
- User asks to inspect, test, or automate browser tasks with lightweight CLI approach
- User wants screenshots, HAR files, console logs, or network inspection via terminal
- User mentions "bdg" or "browser-debugger-cli" explicitly
- User needs quick DOM queries, cookie manipulation, or JavaScript execution in browser
- User wants terminal-based browser automation with Unix pipe composability
- User needs production-ready automation scripts for CI/CD browser testing

**Automatic Triggers**:
- "bdg", "browser-debugger-cli" mentioned explicitly
- "lightweight browser debugging" or "quick CDP access"
- "terminal-based browser automation"
- "screenshot without Puppeteer"

### When NOT to Use

**Do not use for**:
- Complex UI testing suites requiring sophisticated frameworks (use Puppeteer/Playwright)
- Heavy multi-step automation workflows better suited for frameworks
- Cross-browser testing (bdg supports Chrome/Chromium/Edge only)
- Visual regression testing or complex test frameworks
- When user explicitly requests Puppeteer, Playwright, or Selenium

---

## 2. SMART ROUTING

The `mcp-tooling` hub picks the workflow mode, and a request naming Chrome DevTools, CDP, `bdg` or browser debugging selects this packet through that hub mode signal.
The first loads are `references/cdp-patterns.md` for the CDP command patterns and `references/session-management.md` for the session lifecycle.
`references/troubleshooting.md` serves install and troubleshooting intent, and the full diagnostics wait for their on-demand keywords.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Tool Comparison

Prefer CLI (`bdg`) for fast, low-token browser inspection. Use MCP via Code Mode when browser work must be chained with other tools or parallel isolated sessions.

### CLI Approach (Priority) - browser-debugger-cli (bdg)

#### Installation & Verification

Check with `command -v bdg`, install with `npm install -g browser-debugger-cli@alpha`, then verify `bdg --version 2>&1`.

### MCP Approach (Fallback) - Chrome DevTools via Code Mode

When CLI unavailable or multi-tool integration needed.

#### Prerequisites

1. Code Mode configured in `.utcp_config.json`
2. Chrome DevTools MCP server registered with `--isolated=true`

#### Isolated Instances

**Key Feature**: MCP uses `--isolated=true` flag for independent browser instances.

**Benefits of isolated instances:**
- Each instance runs in its own browser process
- Multiple parallel browser sessions possible
- No session conflicts between instances
- Register multiple instances for parallel testing (e.g., `chrome_devtools_1`, `chrome_devtools_2`)

Configure one or more Chrome DevTools MCP entries in `.utcp_config.json` with `--isolated=true` when parallel browser sessions are needed.

#### Configuration Check

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

#### Invocation Pattern

Tool naming is `{manual_name}.{manual_name}_{tool_name}`. Run MCP browser operations inside `call_tool_chain()` and close pages in a `finally` block.

#### Available MCP Tools

Common MCP tools include navigation, screenshots, console messages, viewport resize, clicks, form fill, hover, keyboard, waits, page creation/selection/close. Use underscores in tool names and confirm exact names with Code Mode discovery.

#### When to Prefer MCP

- Already using Code Mode for other tools (external services, Figma, etc.)
- Need to chain browser operations with other MCP tools
- **Parallel browser testing** - compare multiple sites/viewports simultaneously
- Complex multi-step automation in TypeScript
- Type-safe tool invocation required

#### MCP Limitations

- Higher token cost than CLI
- Requires Code Mode infrastructure
- Subset of CDP methods (CLI has 300+ methods across 53 domains)
- Less self-documenting than CLI's `--list`, `--describe`

### MCP Session Cleanup

Always close browser instances when done. Wrap Code Mode browser operations in `try/finally` so cleanup runs even on errors.

---

## 4. RULES

### ✅ ALWAYS Rules

1. Check CLI availability first and prefer CLI when it fits.
2. Use discovery commands before CDP methods.
3. Verify session status before CDP commands.
4. Capture stderr with `2>&1`.
5. Stop sessions after operations.
6. Use `jq` for JSON processing.

### ⛔ NEVER Rules

1. Execute CDP commands without an active session.
2. Hardcode CDP method lists.
3. Skip error handling or exit-code checks.
4. Leave sessions running.
5. Assume method names without discovery.
6. Use on Windows without WSL.

### ⚠️ ESCALATE IF

1. Chrome/Chromium cannot be found.
2. Sessions fail after 3 retries.
3. Cross-browser testing is required.
4. Complex UI testing needs a heavier framework.
5. Windows use lacks WSL.

---

## 5. SUCCESS CRITERIA

### Browser Debugging Completion Checklist

Workflow is complete when CLI/MCP path is selected, installation or config is verified, session is active, CDP operations exit 0 with valid JSON, requested data is captured, sessions are cleaned up, and discovery/error handling are documented.

### Quality Targets

Quality targets are fast session startup, quick screenshot/console capture, and handled errors.

---

## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 5 decision tree
- **Continuity**: Context preserved by `/speckit:save`, which writes through `generate-context.js`

### Tool Usage Guidelines

Use Bash for `bdg`, Read for references, Grep for logs/output, and Glob for screenshots/HAR exports. Chrome/Chromium is the runtime; set `CHROME_PATH` if auto-detection fails.

---

## 7. QUICK REFERENCE

### Essential CLI Commands

Use `bdg cdp --list`, `bdg cdp --describe <domain>`, `bdg cdp --search <term>`, `bdg <url>`, `bdg status`, `bdg stop`, `bdg dom screenshot <path>`, `bdg console --list`, `bdg dom query`, `bdg dom eval`, and `bdg network har <path>`. In shell scripts, install a trap so `bdg stop 2>&1` runs on exit.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers Markdown resources dynamically from `references/` and `assets/` when those directories exist.
This skill currently routes over the flat reference set: `references/cdp-patterns.md`, `references/session-management.md` and `references/troubleshooting.md`.
The asset [`assets/utcp-chrome-devtools-manuals.md`](assets/utcp-chrome-devtools-manuals.md) is the registered-state snapshot of the `chrome_devtools_1` and `chrome_devtools_2` Code Mode manuals. Verify them, do not re-add them.

Scripts: `scripts/install.sh`.

Examples: [`examples/README.md`](examples/README.md) — automation example scripts. It lives outside the `references/`/`assets/` discovery roots, so it is linked here rather than auto-loaded by the router.

Feature catalog: [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md) — the full CLI + MCP capability inventory (29 features across 7 domains), with per-feature files per domain.

Server pointers: [`mcp-servers/bdg-cli/README.md`](mcp-servers/bdg-cli/README.md) (CLI install pointer) and [`mcp-servers/chrome-devtools-mcp/README.md`](mcp-servers/chrome-devtools-mcp/README.md) (the Code Mode server behind the manuals) — nothing vendored.

Related skills: `mcp-code-mode` for MCP fallback and `sk-code` for browser verification in application-code workflows.

Install guide: [INSTALL-GUIDE.md](INSTALL-GUIDE.md).
