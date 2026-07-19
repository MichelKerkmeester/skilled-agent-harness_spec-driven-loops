---
title: "mcp-chrome-devtools: Feature Catalog"
description: "Unified feature inventory for the mcp-chrome-devtools skill — the bdg CLI (primary, 300+ CDP methods across 53 domains) and the Chrome DevTools MCP via Code Mode (fallback, 26 exposed tools, dual isolated instances)."
version: 1.0.0.0
---

# mcp-chrome-devtools: Feature Catalog

Complete feature inventory for both approaches in the mcp-chrome-devtools skill. This catalog describes **what ships today** — not roadmap aspirations. Execution detail (exact prompts, commands, expected signals, pass/fail criteria) lives in the manual testing playbook (`../manual_testing_playbook/manual_testing_playbook.md`).

---

## 1. OVERVIEW

The mcp-chrome-devtools skill routes browser debugging between two complementary approaches:

- **bdg CLI** (`npm install -g browser-debugger-cli@alpha`) — the primary surface. Direct, fast, token-efficient terminal access to the Chrome DevTools Protocol: 300+ CDP methods across 53 domains, self-documenting via `--list` / `--describe` / `--search`, Unix-pipe composable. One global session lifecycle (`bdg <url>` / `bdg status` / `bdg stop`) with no session selector, so sessions run sequentially.
- **Chrome DevTools MCP via Code Mode** — the fallback for multi-tool integration and parallel browsers. Two isolated manuals (`chrome_devtools_1`, `chrome_devtools_2`) are registered in `.utcp_config.json`, each launching `chrome-devtools-mcp` over stdio via `npx` with `--isolated=true`, invoked through `call_tool_chain()` with the naming `{instance}.{instance}_{tool_name}`.

> **Verification note.** MCP tool names are a subset of CDP (26 exposed tools per `../INSTALL-GUIDE.md` §10) and must be confirmed with Code Mode discovery (`list_tools()` / `tool_info()`) before invocation — never guess a tool name. The registered-state snapshot of both manuals lives in `../assets/utcp_chrome_devtools_manuals.md`.

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

See [`cli_bdg_lifecycle/install_version.md`](cli_bdg_lifecycle/install_version.md)

### Session start
`bdg <url>` — open a URL and start the CDP browser session. One active session at a time.

See [`cli_bdg_lifecycle/session_start.md`](cli_bdg_lifecycle/session_start.md)

### Session status
`bdg status` — JSON session state (`state`, `url`); verify active before any CDP command.

See [`cli_bdg_lifecycle/session_status.md`](cli_bdg_lifecycle/session_status.md)

### Session stop
`bdg stop` — cleanly terminate the session and release the browser; trap-based cleanup in scripts.

See [`cli_bdg_lifecycle/session_stop.md`](cli_bdg_lifecycle/session_stop.md)

---

## 3. PROTOCOL DISCOVERY

4 features covering progressive disclosure of the CDP surface — always discover before executing.

### List CDP domains
`bdg cdp --list` — enumerate all 53 CDP domains (Page, Network, Runtime, DOM, ...).

See [`protocol_discovery/list_cdp_domains.md`](protocol_discovery/list_cdp_domains.md)

### Describe domain or method
`bdg cdp --describe <domain|method>` — method signatures for a domain, or parameters and return type for one method.

See [`protocol_discovery/describe_domain.md`](protocol_discovery/describe_domain.md)

### Search CDP methods
`bdg cdp --search <term>` — find methods by keyword (e.g. `--search screenshot` finds `Page.captureScreenshot`).

See [`protocol_discovery/search_cdp_method.md`](protocol_discovery/search_cdp_method.md)

### Raw CDP execution
`bdg cdp <Method> ['<json>']` — execute any discovered CDP method with optional JSON parameters.

See [`protocol_discovery/raw_cdp_command.md`](protocol_discovery/raw_cdp_command.md)

---

## 4. DOM AND SCREENSHOT

4 features covering DOM inspection, JavaScript evaluation, and visual capture.

### Query selector
`bdg dom query "<selector>"` — return matching elements with text content; simpler than raw `DOM.querySelector`.

See [`dom_and_screenshot/query_selector.md`](dom_and_screenshot/query_selector.md)

### Eval JavaScript
`bdg dom eval "<expression>"` — execute JavaScript in the page context and return the result.

See [`dom_and_screenshot/eval_javascript.md`](dom_and_screenshot/eval_javascript.md)

### Screenshot capture
`bdg dom screenshot <path>` — write a PNG of the current page; CDP alternative is `Page.captureScreenshot`.

See [`dom_and_screenshot/screenshot_capture.md`](dom_and_screenshot/screenshot_capture.md)

### Viewport emulation
`bdg cdp Emulation.setDeviceMetricsOverride '<json>'` — emulate device sizes for responsive testing.

See [`dom_and_screenshot/viewport_emulation.md`](dom_and_screenshot/viewport_emulation.md)

---

## 5. CONSOLE AND NETWORK

3 features covering console log retrieval, cookie operations, and network trace export.

### Console logs
`bdg console --list` — JSON array of console messages; pipe to `jq` to filter errors.

See [`console_and_network/console_logs.md`](console_and_network/console_logs.md)

### Cookie management
`bdg network getCookies` and `bdg cdp Network.setCookie '<json>'` — read and inject cookies (requires `Network.enable`).

See [`console_and_network/cookie_management.md`](console_and_network/cookie_management.md)

### HAR export
`bdg network har <path>` — export network activity as a HAR file for `jq` analysis of slow or failed requests.

See [`console_and_network/har_export.md`](console_and_network/har_export.md)

---

## 6. MCP PARALLEL INSTANCES

5 features covering the Code Mode fallback: invocation contract, parallel isolated browsers, page management, isolation, and cleanup.

### Code Mode invocation
`chrome_devtools_1.chrome_devtools_1_<tool>({ ... })` inside `call_tool_chain()` — the manual-namespace contract for all MCP browser operations.

See [`mcp_parallel_instances/code_mode_invocation.md`](mcp_parallel_instances/code_mode_invocation.md)

### Dual-instance parallel
`chrome_devtools_1` + `chrome_devtools_2` via `Promise.all` — two isolated browser processes running simultaneously.

See [`mcp_parallel_instances/dual_instance_parallel.md`](mcp_parallel_instances/dual_instance_parallel.md)

### Page management
`new_page` / `select_page` / `close_page` — multi-tab management within a single instance.

See [`mcp_parallel_instances/page_management.md`](mcp_parallel_instances/page_management.md)

### Context isolation
`--isolated=true` per manual — independent cookie/storage state per instance, no session conflicts.

See [`mcp_parallel_instances/context_isolation.md`](mcp_parallel_instances/context_isolation.md)

### Session cleanup
`try/finally` around Code Mode browser operations — close pages even on errors so no browser leaks.

See [`mcp_parallel_instances/session_cleanup.md`](mcp_parallel_instances/session_cleanup.md)

---

## 7. AUTOMATION AND PERFORMANCE

4 features covering the production example scripts and CI/CD integration patterns.

### Performance baseline
`examples/performance-baseline.sh` — metrics, HAR trace, screenshot, console logs, and DOM statistics in one capture for regression testing.

See [`automation_and_performance/performance_baseline.md`](automation_and_performance/performance_baseline.md)

### Animation testing
`examples/animation-testing.sh` — layout/recalc/task-duration assertions with configurable thresholds and exit codes.

See [`automation_and_performance/animation_testing.md`](automation_and_performance/animation_testing.md)

### Multi-viewport testing
`examples/multi-viewport-test.sh` — desktop/laptop/tablet/mobile rendering with per-viewport screenshots, metrics, and console checks.

See [`automation_and_performance/multi_viewport_test.md`](automation_and_performance/multi_viewport_test.md)

### CI integration
Exit-code driven chaining of the example scripts with `set -e` and trap-based cleanup for pipelines.

See [`automation_and_performance/ci_integration.md`](automation_and_performance/ci_integration.md)

---

## 8. RECOVERY AND TROUBLESHOOTING

5 features covering the documented failure modes and their recoveries.

### Missing browser
`CHROME_PATH` env var — clear failure and fix when Chrome/Chromium cannot be found.

See [`recovery_and_troubleshooting/missing_browser.md`](recovery_and_troubleshooting/missing_browser.md)

### Dead session recovery
`bdg stop` then restart — recover after a crashed or killed browser process.

See [`recovery_and_troubleshooting/dead_session.md`](recovery_and_troubleshooting/dead_session.md)

### Port conflict
`lsof -i :9222` and kill — free the CDP debugging port when `EADDRINUSE` blocks startup.

See [`recovery_and_troubleshooting/port_conflict.md`](recovery_and_troubleshooting/port_conflict.md)

### Linux sandbox errors
User namespaces before `CHROME_FLAGS` fallbacks — ordered fixes for `Failed to move to new namespace`.

See [`recovery_and_troubleshooting/sandbox_errors.md`](recovery_and_troubleshooting/sandbox_errors.md)

### Cleanup leak detection
`pgrep -fl chrome` before/after `bdg stop` — detect and clear leaked browser processes.

See [`recovery_and_troubleshooting/cleanup_leak.md`](recovery_and_troubleshooting/cleanup_leak.md)

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
