1. **PURPOSE** — Chrome DevTools orchestrator that routes browser-debugging requests between the `bdg` CLI (fast, token-efficient priority path) and Code Mode MCP (multi-tool-integration fallback) so agents can drive Chrome from the terminal.

2. **PROBLEM** — Driving a browser from an agent or terminal is painful because raw CDP requires WebSocket management, JSON-RPC framing, and manual process lifecycle — none of which an AI assistant should handle. A single tool is not enough: `bdg` covers fast single-browser inspection and CI scripting but cannot chain with other MCP tools or run parallel isolated browsers, while Code Mode MCP handles multi-tool orchestration but at higher token cost. The skill removes this friction by auto-routing between both paths and enforcing cleanup patterns so orphaned Chrome processes never accumulate.

3. **MODES & CAPABILITIES** —
   - **CLI (`bdg`) — priority path**: single `npm install`, lowest token cost, 300+ CDP methods across 53 domains, self-documenting via `--list`/`--describe`/`--search`, Unix-pipe composable.
   - **MCP (Code Mode) — fallback path**: registered in `.utcp_config.json` with `--isolated=true`, enables parallel isolated browser instances and chaining with other Code Mode tools (Figma, external services), higher token cost, subset of CDP exposed as named tools.
   - **Routing rule**: CLI is always preferred when `command -v bdg` succeeds; MCP is selected when Code Mode infrastructure is already in use, when parallel browsers are needed, or when CLI is unavailable. Intent scoring weights: CLI=4, MCP=4, INSTALL=4, TROUBLESHOOT=4, AUTOMATION=3.
   - **Concrete capabilities** (each one line):
     - Screenshots: full-page PNG capture (`bdg dom screenshot` / `take_screenshot`).
     - Network capture: HAR export, request headers, request interception (`bdg network har` / raw CDP Network domain).
     - Console: read console messages, filter by level (`bdg console --list` / `list_console_messages`).
     - Viewport: set device metrics override for responsive testing (`bdg cdp Emulation.setDeviceMetricsOverride` / `resize_page`).
     - Clicks: dispatch mouse events or JS `.click()` (`bdg cdp Input.dispatchMouseEvent` / `click`).
     - Form fill: set input values via JS or CDP (`bdg dom eval` / `fill`).
     - Waits: sleep/polling in scripts, `wait_for` tool in MCP.
     - Sessions: start/status/stop lifecycle, trap-based cleanup for CLI, `try/finally` with `close_page` for MCP.
     - Cookies: get/set/delete cookies via Network domain helpers.
     - DOM query: CSS selector queries (`bdg dom query` / raw CDP `DOM.querySelector`).
     - JavaScript execution: evaluate expressions in page context (`bdg dom eval` / `Runtime.evaluate`).
     - PDF export: `Page.printToPDF` via raw CDP.

4. **INVOCATION** —
   - **CLI path**: `npm install -g browser-debugger-cli@alpha`, then `bdg <url>` to start, `bdg dom screenshot <path>`, `bdg console --list`, `bdg network har <path>`, `bdg cdp --list`/`--describe`/`--search` for discovery, `bdg stop` to end. Always append `2>&1`. In scripts, `trap "bdg stop 2>&1" EXIT INT TERM`.
   - **MCP path**: Register one or more Chrome DevTools entries in `.utcp_config.json` with `"command": "npx", "args": ["chrome-devtools-mcp@latest", "--isolated=true"]`. Invoke inside `call_tool_chain()` using the naming convention `{manual_name}.{manual_name}_{tool_name}()` — e.g., `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`. Close pages in a `finally` block.
   - **Prerequisites**: Node.js 18+, Chrome/Chromium installed. For MCP: Code Mode configured in `opencode.json` or `.mcp.json`.
   - **Automated install**: `scripts/install.sh` handles npm install, Chrome path detection, optional `CHROME_PATH` profile injection, and verification. See `INSTALL_GUIDE.md` for full walkthrough.

5. **KEY FILES** —

   | Path | Purpose |
   |---|---|
   | `SKILL.md` | Skill definition: routing logic, rules, quick reference, allowed tools, version (1.0.7.0) |
   | `README.md` | User-facing documentation: overview, quick start, features, config, examples, troubleshooting, FAQ |
   | `INSTALL_GUIDE.md` | Step-by-step installation for bdg CLI and MCP server, platform support, security, verification checkpoints |
   | `references/cdp_patterns.md` | CDP domain examples (Page, DOM, Network, Runtime, Memory, Performance), Unix composability patterns, discovery workflow |
   | `references/session_management.md` | Session lifecycle, retry/timeout logic, multi-session management, resumption, state persistence, cleanup patterns |
   | `references/troubleshooting.md` | 5-check diagnostic sequence, error/cause/fix table, platform-specific issues, exit code reference, debug mode |
   | `examples/README.md` | Guide to the three production example scripts with usage, output structure, CI/CD chaining patterns |
   | `examples/performance-baseline.sh` | Captures metrics, HAR, screenshot, console logs, DOM stats as timestamped baseline |
   | `examples/animation-testing.sh` | Animation performance assertions (layout count, style recalc, task duration) with exit codes |
   | `examples/multi-viewport-test.sh` | Visual testing across 5 device viewports (desktop to mobile) with per-viewport screenshots and console checks |
   | `scripts/install.sh` | Automated bdg installer: checks Node 18+, detects Chrome path, installs npm package, verifies, optional profile injection |
   | `graph-metadata.json` | Skill graph metadata for advisor indexing |
   | `changelog/` | Version history (v1.0.0.0 through v1.0.8.0) |
   | `manual_testing_playbook/` | 6 manual test suites covering CLI lifecycle, protocol discovery, DOM/screenshot, console/network, MCP parallel instances, recovery/failure |

6. **BOUNDARIES** —
   - Does not support cross-browser testing; bdg works with Chrome/Chromium/Edge (Chromium-based) only.
   - Does not own MCP transport — `mcp-code-mode` owns `call_tool_chain()`, Code Mode configuration in `opencode.json`, and the UTCP client. This skill only registers its Chrome DevTools provider in `.utcp_config.json`.
   - Not a test framework — does not provide assertions, test runners, or Playwright/Puppeteer abstractions. Complex UI testing should use those frameworks directly.
   - Does not support Windows natively — WSL required.
   - Does not handle visual regression testing with image-diff tooling (example scripts capture screenshots but diffing requires external tools like ImageMagick `compare`).

7. **TROUBLESHOOTING & FAQ MATERIAL** —
   - **Common failure modes**: `bdg: command not found` (not installed or PATH issue), `Could not find Chrome/Chromium` (missing browser or `CHROME_PATH` not set), `Another session already active` (prior session not stopped / missing trap), `Method not found` (guessing CDP names instead of using `--search`/`--describe`), `jq` parse error (stderr not captured — missing `2>&1`), sandbox errors on Linux (user namespace restriction), port 9222 conflicts for MCP.
   - **FAQ 1**: When to use CLI vs MCP? — CLI by default (lower tokens, more CDP methods); MCP when chaining with other Code Mode tools or running parallel isolated browsers.
   - **FAQ 2**: How to prevent orphaned browser processes? — Always use `trap "bdg stop 2>&1" EXIT INT TERM` in scripts; use `try/finally` with `close_page` in MCP TypeScript.
   - **FAQ 3**: Can bdg run headless in CI/Docker? — Yes, set `CHROME_HEADLESS=true`; example scripts are written for this and return semantic exit codes.
   - **FAQ 4**: What if a CDP method name changes between Chrome versions? — Never hardcode; use `bdg cdp --search <keyword>` each time; bdg normalizes casing automatically.

8. **STALE FACTS** —
   - **INSTALL_GUIDE.md §7 Features table** says "All 644 CDP methods" for CLI; SKILL.md and README.md both say "300+ methods across 53 domains." The 644 figure is not corroborated elsewhere.
   - **INSTALL_GUIDE.md §1 Architecture Diagram** also says "All 644 CDP methods" and "26 exposed tools" — the 26 tools figure is not listed or counted in SKILL.md or README.md's MCP tool tables (README §3.2 lists 12 MCP tools, not 26).
   - **INSTALL_GUIDE.md CLI subcommand names** use `bdg screenshot`, `bdg console logs`, `bdg network cookies`, `bdg har export`, `bdg js` throughout §3, §5, §6, and §8; SKILL.md §7 Quick Reference and README.md §3.2 Feature Reference use `bdg dom screenshot`, `bdg console --list`, `bdg network getCookies`, `bdg network har`, `bdg dom eval`. These are inconsistent subcommand forms — unclear whether both are valid aliases or one set is outdated.
   - **INSTALL_GUIDE.md §9 troubleshooting** references `bdg --list` for listing CDP domains, but the install guide's own §3 Step 3 uses `bdg screenshot test.png` (not `bdg dom screenshot`), contradicting SKILL.md.
   - **INSTALL_GUIDE.md Node.js requirement**: §0 header says "Node.js 18+", §9 troubleshooting says "Node.js 14.x or higher." `scripts/install.sh` enforces `MIN_NODE_VERSION="18"`. The 14.x reference is stale.
   - **Changelog** contains `v1.0.8.0.md` but SKILL.md frontmatter version is `1.0.7.0` — either the changelog entry is unreleased or the version was not bumped.
   - **SKILL.md §3** says "CLI has 300+ methods across 53 domains" and MCP has "Subset of CDP methods"; INSTALL_GUIDE §7 says CLI has "All 644 methods" and MCP has "MCP-exposed subset (26 tools)." These numbers conflict.