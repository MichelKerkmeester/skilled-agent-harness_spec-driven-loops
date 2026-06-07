---
title: mcp-chrome-devtools
description: Chrome DevTools orchestrator that routes between the bdg CLI for fast token-efficient inspection and Code Mode MCP for multi-tool chaining and parallel isolated sessions.
trigger_phrases:
  - "chrome devtools"
  - "browser debugging"
  - "bdg"
  - "screenshot"
  - "browser automation"
---

# mcp-chrome-devtools

> Drive a real browser from the agent through two paths: a fast CLI for the common case and an MCP path when the work must chain or run in parallel.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Screenshots, console reads, network traces, DOM queries and JS execution from the agent or terminal |
| **Invoke with** | "chrome devtools", "browser debugging", "bdg", "screenshot" or auto-routing on those keywords |
| **Works on** | Chrome, Chromium and Edge through the Chrome DevTools Protocol |
| **Produces** | PNG screenshots, HAR files, JSON output and structured data inside MCP tool chains |

---

## 2. OVERVIEW

### Why This Skill Exists

Driving a browser from an agent usually means a heavyweight automation framework or burning tokens on verbose protocol dumps. A one-shot screenshot or a console read wants a fast command. A multi-step flow that interleaves browser actions with other tool calls wants a typed, chainable interface. Picking the wrong one wastes tokens or blocks parallelism. This skill routes between a lightweight CLI for the common case and an MCP path when the work must chain with other tools or run several isolated browsers at once, so neither need forces the wrong tool.

### What It Does

mcp-chrome-devtools is an orchestrator with two complementary paths. The `bdg` command-line tool is the priority path: fast, low-token, self-documenting and capable of reaching the full Chrome DevTools Protocol surface. The MCP path through Code Mode is the fallback: it registers browser instances with `--isolated=true` so each one runs in its own process, which makes parallel sessions and multi-tool chaining possible. The skill routes between them based on what the work requires.

It does not own the MCP transport. `mcp-code-mode` handles that. This skill consumes Code Mode, it does not implement it. For generated application code, `sk-code` owns the surface.

---

## 3. QUICK START

**Step 1: Install the CLI.**

```bash
npm install -g browser-debugger-cli@alpha
command -v bdg
```

You see the path to the binary, for example `/usr/local/bin/bdg`.

**Step 2: Take a screenshot.**

```bash
bdg dom screenshot /tmp/homepage.png "https://example.com"
```

A PNG file lands at `/tmp/homepage.png`. The command prints a JSON status to stdout and exits 0.

**Step 3: Use the MCP path for a chained workflow.**

Configure a Chrome DevTools entry in `.utcp_config.json` with `--isolated=true`, then run inside a `call_tool_chain()` block:

```typescript
const result = await call_tool_chain([
  { tool: "chrome_devtools.chrome_devtools_navigate_page", args: { url: "https://example.com" } },
  { tool: "chrome_devtools.chrome_devtools_take_screenshot", args: {} },
]);
```

The screenshot returns as a data object inside the result. Close the page in a `finally` block.

---

## 4. HOW IT WORKS

### The Routing Rule

Prefer the CLI for fast, low-token browser inspection. Use the MCP path when browser work must be chained with other tools or run as parallel isolated sessions. The CLI is always the first choice unless the work specifically needs MCP capabilities.

### The CLI Path

`bdg` is self-documenting. You discover available methods without guessing:

```bash
bdg cdp --list
```

Prints every CDP domain and method the tool exposes.

```bash
bdg cdp --search screenshot
```

Returns matching method names so you find the right one before calling it.

```bash
bdg cdp --describe Page.captureScreenshot
```

Shows the method signature, parameters and return type.

The CLI writes artifacts to disk (PNG, HAR, JSON) and prints structured JSON to stdout. It reaches the full Chrome DevTools Protocol surface across dozens of domains. In shell scripts, trap the session so cleanup runs on exit:

```bash
trap "bdg stop 2>&1" EXIT INT TERM
```

### The MCP Path

Each MCP instance registered with `--isolated=true` runs its own browser process. Register multiple entries (`chrome_devtools_1`, `chrome_devtools_2`) to run parallel sessions without conflicts. Tools return data as objects inside the `call_tool_chain()` block rather than files on disk. The MCP path exposes a curated subset of browser capabilities: navigation, screenshots, console messages, viewport resize, clicks, form fill, hover, keyboard input and waits.

### Example Workflows

Three production scripts ship with the skill under `examples/`:

`performance-baseline.sh [URL] [OUTPUT_DIR]` captures performance metrics, a HAR, a screenshot, console logs and DOM stats into timestamped files. It is CI-friendly with semantic exit codes.

`animation-testing.sh` asserts layout, recalc and task-duration thresholds with before and after screenshots. It exits non-zero on failure.

`multi-viewport-test.sh` runs five viewports (desktop 1920x1080, laptop 1366x768, tablet 768x1024, mobile 375x667, mobile-large 414x896) and fails on any console error. Set `CHROME_HEADLESS=true` for CI.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for mcp-chrome-devtools when you need a screenshot, a console read, a network trace or a DOM query from the agent. Reach for it when you want to automate a browser action from the terminal. Skip it for complex UI testing suites that need a heavier framework, and skip it for cross-browser testing (the CLI targets Chrome, Chromium and Edge only).

### Boundaries

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill consumes Code Mode, it does not implement it. |
| `sk-code` | Owns code standards and tests. This skill handles the browser debugging surface. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: bdg` | Not installed or npm global bin not on PATH | Install with `npm install -g browser-debugger-cli@alpha` and fix your PATH |
| `Could not find Chrome` | Auto-detection failed | Set `CHROME_PATH` to the browser executable |
| `Another session already active` | A prior session was not stopped | Run `bdg stop`, or register `trap "bdg stop" EXIT INT TERM` in your script |
| `Method not found` | You guessed a CDP method name | Use `bdg cdp --search <term>` to find the real name |
| `jq` parse error | stderr is contaminating stdout | Append `2>&1` before piping to `jq` |
| MCP tools missing | The `.utcp_config.json` entry is missing or disabled | Confirm the entry exists and restart the session |

---

## 7. FAQ

**Q: When do I use the CLI versus the MCP path?**

A: Use the CLI for one-shot actions: a screenshot, a console read, a HAR capture, a DOM query. Use the MCP path when you need to chain browser operations with other MCP tools, or when you need multiple isolated browser sessions running in parallel.

**Q: How do I prevent browser processes from accumulating?**

A: In shell scripts, trap the session: `trap "bdg stop 2>&1" EXIT INT TERM`. In MCP workflows, close pages in a `finally` block inside `call_tool_chain()`.

**Q: How do I run headless in CI?**

A: Set `CHROME_HEADLESS=true` before invoking the scripts or `bdg` commands. All three example scripts support it.

**Q: How do I keep CDP method names stable across Chrome versions?**

A: Never hardcode method names. Use `bdg cdp --search <term>` and `bdg cdp --describe <method>` at runtime to discover what the running browser actually supports.

**Q: How do I configure parallel isolated MCP instances?**

A: Register multiple entries in `.utcp_config.json` (for example `chrome_devtools_1` and `chrome_devtools_2`), each with `--isolated=true`. Each one runs in its own browser process.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| CLI installed | `command -v bdg` prints a path |
| CLI functional | `bdg --version 2>&1` prints a version string |
| Session lifecycle | `bdg https://example.com && bdg status && bdg stop` exits 0 |
| MCP configured | `cat .utcp_config.json \| jq '.manual_call_templates[] \| select(.name \| startswith("chrome_devtools"))'` shows entries |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-chrome-devtools/README.md --type readme` reports zero issues |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, routing logic and the bdg quick reference |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Step-by-step install for the CLI and the MCP server |
| [`references/cdp_patterns.md`](./references/cdp_patterns.md) | CDP domain patterns, workflows and Unix-pipe composition |
| [`references/session_management.md`](./references/session_management.md) | Session lifecycle, retry, multi-session and cleanup |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference, diagnostic sequence and platform fixes |
| [`examples/README.md`](./examples/README.md) | Guide to the three production scripts and CI integration |
| [`examples/performance-baseline.sh`](./examples/performance-baseline.sh) | Full baseline: metrics, HAR, screenshot, console, DOM stats |
| [`examples/animation-testing.sh`](./examples/animation-testing.sh) | Animation assertions with before/after shots and exit codes |
| [`examples/multi-viewport-test.sh`](./examples/multi-viewport-test.sh) | Five-viewport responsive test with console error detection |
| [`scripts/install.sh`](./scripts/install.sh) | Automated bdg installer with Chrome detection |
