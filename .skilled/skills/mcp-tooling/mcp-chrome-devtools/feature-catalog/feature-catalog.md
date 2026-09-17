---
title: "mcp-chrome-devtools: Feature Catalog"
description: "Unified feature inventory for the mcp-chrome-devtools skill — the bdg CLI (primary, 300+ CDP methods across 53 domains) and the Chrome DevTools MCP via Code Mode (fallback, 26 exposed tools, dual isolated instances)."
version: 1.0.0.0
---

# mcp-chrome-devtools: Feature Catalog

Complete feature inventory for both approaches in the mcp-chrome-devtools skill. This catalog describes **what ships today** — not roadmap aspirations. Execution detail (exact prompts, commands, expected signals, pass/fail criteria) lives in the manual testing playbook (`../manual-testing-playbook/manual-testing-playbook.md`).

---

## 1. OVERVIEW

The mcp-chrome-devtools skill routes browser debugging between two complementary approaches:

- **bdg CLI** (`npm install -g browser-debugger-cli@alpha`) — the primary surface. Direct, fast, token-efficient terminal access to the Chrome DevTools Protocol: 300+ CDP methods across 53 domains, self-documenting via `--list` / `--describe` / `--search`, Unix-pipe composable. One global session lifecycle (`bdg <url>` / `bdg status` / `bdg stop`) with no session selector, so sessions run sequentially.
- **Chrome DevTools MCP via Code Mode** — the fallback for multi-tool integration and parallel browsers. Two isolated manuals (`chrome_devtools_1`, `chrome_devtools_2`) are registered in `.utcp_config.json`, each launching `chrome-devtools-mcp` over stdio via `npx` with `--isolated=true`, invoked through `call_tool_chain()` with the naming `{instance}.{instance}_{tool_name}`.

> **Verification note.** MCP tool names are a subset of CDP (26 exposed tools per `../INSTALL-GUIDE.md` §10) and must be confirmed with Code Mode discovery (`list_tools()` / `tool_info()`) before invocation — never guess a tool name. The registered-state snapshot of both manuals lives in `../assets/utcp-chrome-devtools-manuals.md`.

Routing is **capability-based**: prefer the CLI when it fits (SKILL.md Rule "Check CLI availability first"), and use MCP when browser work must chain with other Code Mode tools or run in parallel isolated instances.

| Metric | Value |
|--------|-------|
| CLI CDP surface | 300+ methods across 53 domains (self-discovered, never hardcoded) |
| MCP exposed tools | 26 (via Code Mode; confirm names with discovery) |
| CLI install | `npm install -g browser-debugger-cli@alpha` |
| MCP manuals | `chrome_devtools_1` + `chrome_devtools_2` in `.utcp_config.json`, both `--isolated=true` |
| MCP invocation | `chrome_devtools_N.chrome_devtools_N_<tool_name>` via `call_tool_chain()` |
| Platforms | macOS and Linux native; Windows via WSL only |

---

## 2. CLI BDG LIFECYCLE

4 features covering install verification and the single-session lifecycle (start, status, stop).

### Install + version
`command -v bdg` then `bdg --version` — verify the CLI before first use; install with `npm install -g browser-debugger-cli@alpha`.

See [`cli-bdg-lifecycle/install-version.md`](cli-bdg-lifecycle/install-version.md)

### Session start
`bdg <url>` — open a URL and start the CDP browser session. One active session at a time.

See [`cli-bdg-lifecycle/session-start.md`](cli-bdg-lifecycle/session-start.md)

### Session status
`bdg status` — JSON session state (`state`, `url`); verify active before any CDP command.

See [`cli-bdg-lifecycle/session-status.md`](cli-bdg-lifecycle/session-status.md)

### Session stop
`bdg stop` — cleanly terminate the session and release the browser; trap-based cleanup in scripts.

See [`cli-bdg-lifecycle/session-stop.md`](cli-bdg-lifecycle/session-stop.md)

---

## 3. PROTOCOL DISCOVERY

4 features covering progressive disclosure of the CDP surface — always discover before executing.

### List CDP domains
`bdg cdp --list` — enumerate all 53 CDP domains (Page, Network, Runtime, DOM, ...).

See [`protocol-discovery/list-cdp-domains.md`](protocol-discovery/list-cdp-domains.md)

### Describe domain or method
`bdg cdp --describe <domain|method>` — method signatures for a domain, or parameters and return type for one method.

See [`protocol-discovery/describe-domain.md`](protocol-discovery/describe-domain.md)

### Search CDP methods
`bdg cdp --search <term>` — find methods by keyword (e.g. `--search screenshot` finds `Page.captureScreenshot`).

See [`protocol-discovery/search-cdp-method.md`](protocol-discovery/search-cdp-method.md)

### Raw CDP execution
`bdg cdp <Method> ['<json>']` — execute any discovered CDP method with optional JSON parameters.

See [`protocol-discovery/raw-cdp-command.md`](protocol-discovery/raw-cdp-command.md)

---

## 4. DOM AND SCREENSHOT

4 features covering DOM inspection, JavaScript evaluation, and visual capture.

### Query selector
`bdg dom query "<selector>"` — return matching elements with text content; simpler than raw `DOM.querySelector`.

See [`dom-and-screenshot/query-selector.md`](dom-and-screenshot/query-selector.md)

### Eval JavaScript
`bdg dom eval "<expression>"` — execute JavaScript in the page context and return the result.

See [`dom-and-screenshot/eval-javascript.md`](dom-and-screenshot/eval-javascript.md)

### Screenshot capture
`bdg dom screenshot <path>` — write a PNG of the current page; CDP alternative is `Page.captureScreenshot`.

See [`dom-and-screenshot/screenshot-capture.md`](dom-and-screenshot/screenshot-capture.md)

### Viewport emulation
`bdg cdp Emulation.setDeviceMetricsOverride '<json>'` — emulate device sizes for responsive testing.

See [`dom-and-screenshot/viewport-emulation.md`](dom-and-screenshot/viewport-emulation.md)

---

## 5. CONSOLE AND NETWORK

3 features covering console log retrieval, cookie operations, and network trace export.

### Console logs
`bdg console --list` — JSON array of console messages; pipe to `jq` to filter errors.

See [`console-and-network/console-logs.md`](console-and-network/console-logs.md)

### Cookie management
`bdg network getCookies` and `bdg cdp Network.setCookie '<json>'` — read and inject cookies (requires `Network.enable`).

See [`console-and-network/cookie-management.md`](console-and-network/cookie-management.md)

### HAR export
`bdg network har <path>` — export network activity as a HAR file for `jq` analysis of slow or failed requests.

See [`console-and-network/har-export.md`](console-and-network/har-export.md)

---

## 6. MCP PARALLEL INSTANCES

5 features covering the Code Mode fallback: invocation contract, parallel isolated browsers, page management, isolation, and cleanup.

### Code Mode invocation
`chrome_devtools_1.chrome_devtools_1_<tool>({ ... })` inside `call_tool_chain()` — the manual-namespace contract for all MCP browser operations.

See [`mcp-parallel-instances/code-mode-invocation.md`](mcp-parallel-instances/code-mode-invocation.md)

### Dual-instance parallel
`chrome_devtools_1` + `chrome_devtools_2` via `Promise.all` — two isolated browser processes running simultaneously.

See [`mcp-parallel-instances/dual-instance-parallel.md`](mcp-parallel-instances/dual-instance-parallel.md)

### Page management
`new_page` / `select_page` / `close_page` — multi-tab management within a single instance.

See [`mcp-parallel-instances/page-management.md`](mcp-parallel-instances/page-management.md)

### Context isolation
`--isolated=true` per manual — independent cookie/storage state per instance, no session conflicts.

See [`mcp-parallel-instances/context-isolation.md`](mcp-parallel-instances/context-isolation.md)

### Session cleanup
`try/finally` around Code Mode browser operations — close pages even on errors so no browser leaks.

See [`mcp-parallel-instances/session-cleanup.md`](mcp-parallel-instances/session-cleanup.md)

---

## 7. AUTOMATION AND PERFORMANCE

4 features covering the production example scripts and CI/CD integration patterns.

### Performance baseline
`examples/performance-baseline.sh` — metrics, HAR trace, screenshot, console logs, and DOM statistics in one capture for regression testing.

See [`automation-and-performance/performance-baseline.md`](automation-and-performance/performance-baseline.md)

### Animation testing
`examples/animation-testing.sh` — layout/recalc/task-duration assertions with configurable thresholds and exit codes.

See [`automation-and-performance/animation-testing.md`](automation-and-performance/animation-testing.md)

### Multi-viewport testing
`examples/multi-viewport-test.sh` — desktop/laptop/tablet/mobile rendering with per-viewport screenshots, metrics, and console checks.

See [`automation-and-performance/multi-viewport-test.md`](automation-and-performance/multi-viewport-test.md)

### CI integration
Exit-code driven chaining of the example scripts with `set -e` and trap-based cleanup for pipelines.

See [`automation-and-performance/ci-integration.md`](automation-and-performance/ci-integration.md)

---

## 8. RECOVERY AND TROUBLESHOOTING

5 features covering the documented failure modes and their recoveries.

### Missing browser
`CHROME_PATH` env var — clear failure and fix when Chrome/Chromium cannot be found.

See [`recovery-and-troubleshooting/missing-browser.md`](recovery-and-troubleshooting/missing-browser.md)

### Dead session recovery
`bdg stop` then restart — recover after a crashed or killed browser process.

See [`recovery-and-troubleshooting/dead-session.md`](recovery-and-troubleshooting/dead-session.md)

### Port conflict
`lsof -i :9222` and kill — free the CDP debugging port when `EADDRINUSE` blocks startup.

See [`recovery-and-troubleshooting/port-conflict.md`](recovery-and-troubleshooting/port-conflict.md)

### Linux sandbox errors
User namespaces before `CHROME_FLAGS` fallbacks — ordered fixes for `Failed to move to new namespace`.

See [`recovery-and-troubleshooting/sandbox-errors.md`](recovery-and-troubleshooting/sandbox-errors.md)

### Cleanup leak detection
`pgrep -fl chrome` before/after `bdg stop` — detect and clear leaked browser processes.

See [`recovery-and-troubleshooting/cleanup-leak.md`](recovery-and-troubleshooting/cleanup-leak.md)

---

## Feature Count Summary

| Category | Count |
|----------|-------|
| CLI bdg Lifecycle | 4 |
| Protocol Discovery | 4 |
| DOM and Screenshot | 4 |
| Console and Network | 3 |
| MCP Parallel Instances | 5 |
| Automation and Performance | 4 |
| Recovery and Troubleshooting | 5 |
| **TOTAL** | **29** |
