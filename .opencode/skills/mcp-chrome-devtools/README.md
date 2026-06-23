---
title: mcp-chrome-devtools
description: Chrome DevTools orchestrator that drives a real browser from an agent through a fast CLI (bdg) and a Code Mode MCP path for parallel isolated sessions and multi-tool chaining.
trigger_phrases:
  - "chrome devtools"
  - "browser debugging"
  - "bdg"
  - "screenshot"
  - "browser automation"
version: 1.0.0.22
---

# mcp-chrome-devtools

> Drive a real browser from your agent or terminal, with a fast CLI for one-shot inspection and an MCP path for parallel isolated sessions.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Browser screenshots, console inspection, network traces and CDP automation from an agent or terminal |
| **Invoke with** | "chrome devtools", "browser debugging", "bdg", "screenshot" or auto-routing on browser keywords |
| **Works on** | Chrome, Chromium and Edge through a local browser instance |
| **Produces** | Screenshots (PNG), HAR network traces, console logs, DOM queries and CDP responses |

---

## 2. OVERVIEW

### Why This Skill Exists

Driving a browser from an agent usually means a heavyweight automation framework or burning tokens on verbose protocol dumps. A one-shot screenshot or a console read wants a fast single-purpose command. A multi-step flow that chains browser actions with other tool calls wants a typed composable interface. Picking the wrong approach wastes tokens or blocks parallelism. A single tool does not fit both needs, so this skill gives you two paths and routes between them.

### What It Does

This skill drives a real browser through two complementary paths. The `bdg` CLI is fast and token-efficient, self-documenting and reaches the full Chrome DevTools Protocol surface. The Code Mode MCP path runs isolated browser instances for parallel sessions and multi-tool chaining. A routing rule picks the right path for the work at hand. A quick screenshot never pays the MCP overhead, and a complex chain never blocks on a single session.

The MCP transport is owned by `mcp-code-mode`. This skill consumes Code Mode as a provider. It does not implement the transport. For the generated application code that gets inspected, `sk-code` owns the standards and tests.

---

## 3. QUICK START

**Step 1: Install the CLI.**

```bash
npm install -g browser-debugger-cli@alpha
```

**Step 2: Verify the binary and capture a screenshot.**

```bash
command -v bdg
# Expected: /usr/local/bin/bdg or similar path

bdg --version
# Expected: browser-debugger-cli@x.x.x

bdg https://example.com 2>&1
bdg dom screenshot /tmp/example.png 2>&1
bdg stop 2>&1
ls -la /tmp/example.png
# Expected: file exists and is a valid PNG screenshot
```

**Step 3: MCP path with Code Mode.**

Use the `chrome_devtools_1` or `chrome_devtools_2` manual in `.utcp_config.json`, where both entries pin `chrome-devtools-mcp@0.26.0` with `--isolated=true`, then run browser operations inside `call_tool_chain()`:

```typescript
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  const logs = await chrome_devtools_1.chrome_devtools_1_list_console_messages({});
  return { screenshot, logs };
`)
// Expected: returns a screenshot and console messages as typed objects
```

---

## 4. HOW IT WORKS

### The Routing Rule

The skill prefers the CLI for fast low-token inspection. It switches to the MCP path when browser work must be chained with other tools or run as parallel isolated sessions. A weighted intent scorer reads the request text, detects keywords such as "bdg", "screenshot" or "parallel sessions" and loads only the reference files relevant to the chosen path.

### The CLI Path

`bdg` starts a Chrome session, sends CDP commands over WebSocket and writes artifacts to disk. It is self-documenting at every level. `bdg cdp --list` lists every CDP domain. `bdg cdp --describe Page` enumerates the methods in a domain with their signatures. `bdg cdp --search screenshot` finds every CDP method whose name or description contains the term. The CLI reaches the full Chrome DevTools Protocol surface, so you can compose arbitrary CDP workflows and pipe results through Unix tools.

```bash
bdg cdp --list | head -5
# Page
# DOM
# Network
# Runtime
# Emulation

bdg cdp --describe Page | head -3
# Page.enable
# Page.disable
# Page.navigate
```

### The MCP Path

The MCP path registers `chrome-devtools-mcp@0.26.0` entries in `.utcp_config.json` with `--isolated=true`. Each entry runs its own browser process, so parallel sessions and multi-tool chaining do not interfere. Tool naming follows the Code Mode convention: `{manual_name}.{manual_name}_{tool_name}`. Tools return data as objects inside a `call_tool_chain()` block instead of writing files to disk. Always close pages in a `finally` block so cleanup runs even on errors.

The MCP path exposes a curated subset of browser capabilities. For navigation it gives you `navigate_page`. For screenshots it gives you `take_screenshot`. For viewport control it gives you `resize_page`. For interaction it gives you `click`, `fill`, `hover` and `press_key`. For session control it gives you `new_page`, `select_page` and `close_page`. The CLI path covers the same actions and reaches the full CDP surface beyond the curated set.

### Isolated Instances

`--isolated=true` is the key to parallelism. Register several entries in `.utcp_config.json`, each with its own name such as `chrome_devtools_1` and `chrome_devtools_2`. Each entry gets its own browser process. Inside a single `call_tool_chain()` block you can navigate two isolated browsers, capture both screenshots and return them together. No session conflicts, no port collisions.

### Example Workflows

The skill ships three production scripts under `examples/`. Each doubles as an end-to-end workflow and a CI-ready test.

`performance-baseline.sh [URL] [OUTPUT_DIR]` captures metrics, a HAR trace, a screenshot, console logs and DOM stats into timestamped files. The output lands in a `performance-baselines/` directory with JSON for metrics and console logs, a HAR file for the network trace and a PNG for the visual baseline.

`animation-testing.sh` asserts layout count, recalculation count and task-duration thresholds, captures before and after screenshots and exits non-zero on any failure. It targets a selector and an animation trigger class so you can test any animated element on the page.

`multi-viewport-test.sh` runs five viewports (desktop 1920x1080, laptop 1366x768, tablet 768x1024, mobile 375x667, mobile-large 414x896) and fails on any console error. It captures an initial and an animated screenshot per viewport and writes a per-viewport summary.

All three scripts support headless mode (`CHROME_HEADLESS=true`), return semantic exit codes and are designed for CI pipelines.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when you need a browser screenshot, a console log, a network trace or a CDP operation from an agent. Reach for the CLI when the work is a single inspection. Reach for the MCP path when you are already using Code Mode for other tools or need parallel isolated browsers. Reach for the example scripts when you want a pre-built CI workflow.

This skill is not a cross-browser test framework. The CLI targets Chrome, Chromium and Edge. For cross-browser or complex UI test suites, reach for Puppeteer, Playwright or Selenium.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill registers Chrome DevTools as a Code Mode provider and calls tools through `call_tool_chain()`. |
| `sk-code` | Owns application-code standards and tests. This skill verifies browser behavior that sk-code produces. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: bdg` | CLI not installed or npm global bin not on PATH | `npm install -g browser-debugger-cli@alpha` and verify PATH with `npm config get prefix` |
| `Could not find Chrome` | Chrome path not set or binary missing | Set `CHROME_PATH` to the browser executable and confirm with `ls -la "$CHROME_PATH"` |
| `Another session already active` | A prior session was not stopped | Run `bdg stop`, or register `trap "bdg stop" EXIT INT TERM` in scripts |
| `Method not found` | A guessed CDP method name | Use `bdg cdp --search <term>` to find the real name, never hardcode method names |
| `jq` parse error | stderr is contaminating stdout | Append `2>&1` before piping to `jq` |
| MCP tools missing | The `.utcp_config.json` entry is missing or disabled | Confirm the entry exists with `disabled: false` and restart the session |

---

## 7. FAQ

**Q: When do I use the CLI versus the MCP path?**

A: Use the CLI for one-shot screenshots, console checks and network traces where speed and low token cost matter. Use the MCP path when you need to chain browser operations with other MCP tools or run parallel isolated browsers. If the CLI is available and no chaining is needed, the CLI wins.

**Q: How do I prevent browser processes from piling up?**

A: Run `bdg stop` after each session. In scripts, register `trap "bdg stop" EXIT INT TERM` so cleanup runs even on failure. For MCP sessions, wrap browser calls in `try/finally` and close pages in the `finally` block.

**Q: Can I use this with Firefox or Safari?**

A: No. The CLI targets Chrome, Chromium and Edge. For cross-browser testing reach for Puppeteer, Playwright or Selenium.

**Q: How do I keep CDP method names stable across Chrome versions?**

A: Do not hardcode method names. Use `bdg cdp --list`, `bdg cdp --describe <domain>` and `bdg cdp --search <term>` to discover the current names before running commands. The discovery commands always reflect the connected Chrome version.

**Q: How do I configure parallel isolated MCP instances?**

A: Register multiple entries in `.utcp_config.json`, each with its own name such as `chrome_devtools_1` and `chrome_devtools_2`, and `--isolated=true` on every entry. Each entry gets its own browser process. Use them in parallel inside the same `call_tool_chain()` block.

---

## 8. VERIFICATION

The skill ships a manual testing playbook and three example scripts that double as verification gates.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-chrome-devtools/README.md --type readme` reports zero issues |
| CLI health | `command -v bdg && bdg --version 2>&1 && bdg https://example.com 2>&1 && bdg dom screenshot /tmp/verify.png 2>&1 && bdg stop 2>&1 && ls -la /tmp/verify.png` all pass with no errors |
| MCP health | Confirm chrome_devtools tools appear in `list_tools()` output and a `navigate_page` call completes without connection errors |
| Example scripts | Run `performance-baseline.sh`, `animation-testing.sh` and `multi-viewport-test.sh` in headless mode and confirm all exit zero |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the two-path router and the full rule set |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Step-by-step install for the CLI and the MCP server, with an AI-first prompt |
| [`references/cdp_patterns.md`](./references/cdp_patterns.md) | CDP domain patterns, workflows and Unix-pipe composition |
| [`references/session_management.md`](./references/session_management.md) | Session lifecycle, retry, multi-session and cleanup |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference, diagnostic sequence and platform fixes |
| [`examples/README.md`](./examples/README.md) | Guide to the three production scripts and CI integration |
| [`scripts/install.sh`](./scripts/install.sh) | Automated bdg installer with Chrome detection |
