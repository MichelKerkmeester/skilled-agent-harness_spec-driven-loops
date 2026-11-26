---
title: mcp-chrome-devtools
description: "Makes a real browser inspectable and drivable by an agent: one-shot inspection through a fast CLI and parallel isolated sessions through Code Mode for chained multi-tool work."
trigger_phrases:
  - "chrome devtools"
  - "browser debugging"
  - "bdg"
  - "screenshot"
  - "browser automation"
version: 1.0.26.0
---

# mcp-chrome-devtools

> Point your agent at a real browser, then read back a screenshot, a console error, a HAR trace or a DOM query.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Screenshots, console output, network traces and DOM queries from a live page |
| **Invoke with** | "chrome devtools", "browser debugging", "bdg" or "screenshot" |
| **Works on** | Chrome or another Chromium browser on macOS and Linux, Windows through WSL |
| **Produces** | PNG screenshots, HAR traces, console JSON and CDP responses |

### What It Does

The `bdg` CLI is the entry point. It opens a Chrome session and sends Chrome DevTools Protocol commands over it. Results come back as JSON you can read or pipe. When browser work must chain with other tools or run against several browsers at once, the skill registers the Chrome DevTools MCP server in Code Mode and calls it through `call_tool_chain()`.

The MCP transport belongs to `mcp-code-mode`. Application-code standards and their tests belong to `sk-code`.

### Why This Skill Exists

Agent browser work comes in two shapes. One wants a single fact fast: a screenshot, one console error, a HAR trace or a DOM query. The other chains browser steps with other tools and needs several browsers side by side. The CLI covers the first shape at a small token cost. Code Mode covers the second. Routing between them keeps a one-shot capture from paying MCP overhead and keeps a long chain from queueing behind one session.

### The CDP Capability Surface

The protocol is the reason the CLI stays small. `bdg` does not wrap every CDP method in its own subcommand. It exposes discovery and a raw call, so the full surface is reachable once you know the method name.

| Capability | What the skill knows how to operate |
|---|---|
| **Screenshots** | `bdg dom screenshot <path>` writes a PNG of the page or of one element |
| **Console** | `bdg console --list` prints a chronological text view, and `bdg console --list --json` returns the messages under `.messages` for `jq` |
| **Network** | `bdg network har <path>` exports a HAR 1.2 trace. `bdg network list` shows the requests |
| **DOM** | `bdg dom query`, `bdg dom eval` and `bdg dom click` reach elements and run page JavaScript |
| **Protocol** | `bdg cdp` lists, describes and calls any method across the 53 domains |
| **Parallel runs** | Isolated Code Mode manuals each own their browser process |

---

## 2. QUICK START

**Step 1: Install the CLI.**

```bash
npm install -g browser-debugger-cli@0.6.10
```

Expected: npm reports the added package and exits 0. Then confirm that the binary resolves and reports a version.

```bash
command -v bdg
bdg --version
```

Expected: an absolute path such as `/opt/homebrew/bin/bdg`, then a bare version number such as `0.6.10`.

**Step 2: Capture a screenshot.**

```bash
bdg https://example.com 2>&1
bdg dom screenshot /tmp/example.png 2>&1
bdg stop 2>&1
ls -la /tmp/example.png
```

Expected: the first command starts a session on the URL. The second writes the PNG. `bdg stop` ends the session. The last line lists `/tmp/example.png` as a non-empty file. A missing file means the screenshot step failed.

**Step 3: Confirm the MCP manuals before you call them.**

```bash
cat .utcp_config.json | jq -r '.manual_call_templates[] | select(.name | startswith("chrome_devtools")) | .name'
```

Expected:

```text
chrome_devtools_1
chrome_devtools_live
chrome_devtools_2
```

Then run browser work inside a `call_tool_chain()` block:

```typescript
call_tool_chain(`
  chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" })
  const shot = chrome_devtools_1.chrome_devtools_1_take_screenshot({})
  return shot
`)
```

Expected: the block returns the screenshot object. Close the page in a `finally` block so no browser process lingers.

---

## 3. HOW IT WORKS

A browser request reaches this skill from the `mcp-browser-use` hub, which scores the request text and picks a path. The CLI path opens one Chrome session and works through it. The MCP path launches a Code Mode manual and calls typed tools inside a chain. Both paths produce files or values a caller can check.

```text
                        ┌────────────────────────────┐
                        │ Browser request            │
                        └──────────────┬─────────────┘
                                       │
                                       ▼
                        ┌────────────────────────────┐
                        │ Weighted intent scoring    │
                        └──────────────┬─────────────┘
                                       │
                   ────────────────────┴────────────────────
                   │                                       │
                   ▼                                       ▼
    ┌────────────────────────────┐          ┌────────────────────────────┐
    │ bdg CLI session            │          │ Code Mode manual           │
    └──────────────┬─────────────┘          └──────────────┬─────────────┘
                   │                                       │
                   ▼                                       ▼
    ┌────────────────────────────┐          ┌────────────────────────────┐
    │ PNG, HAR or console JSON   │          │ Typed tool result          │
    └────────────────────────────┘          └────────────────────────────┘
```

### How the path is chosen

A weighted scorer adds points for signal words. A request naming `bdg` or a terminal scores for the CLI. A request naming Code Mode or parallel sessions scores for MCP. A `bdg` binary on PATH adds five points to the CLI score. A configured Code Mode adds four to the MCP score. The environment therefore counts as much as the wording. The two highest intents load together when their scores sit within one point. A scored route loads the reference files its intents map to, and an on-demand keyword adds `references/troubleshooting.md` and `references/session-management.md` on top.

### The CLI path

One session runs at a time. `bdg <url>` opens the page. `bdg status --json` reports the state as JSON. `bdg stop` releases the browser. There is no session selector, so a second script cannot drive the CLI at the same time.

The CLI documents its own protocol surface. Run discovery before a method call:

```bash
bdg cdp --list | jq '.count'
bdg cdp --search screenshot | jq -r '.methods[].name'
```

Expected:

```text
53
Emulation.setVisibleSize
HeadlessExperimental.beginFrame
Page.captureScreenshot
```

The counts and names come from the protocol schema bundled with `browser-debugger-cli`, so they track the installed CLI rather than the Chrome build. Never hardcode a method list.

### The MCP path

Each manual launches the same server through `npx`. `chrome_devtools_1` and `chrome_devtools_2` pass `--isolated=true`, so each starts its own browser with its own cookie and storage state. That is what makes parallel work possible. `chrome_devtools_live` passes `--autoConnect` and attaches to the Chrome you already have open, which is the only manual that reaches a signed-in page.

The server exposes 29 tools per instance. These names come from the packet's own files. Code Mode discovery settles any name you are unsure of.

| Need | Tool |
|---|---|
| Navigation | `navigate_page` |
| Screenshot | `take_screenshot` |
| Console | `list_console_messages` |
| Pages | `new_page`, `select_page`, `close_page`, `list_pages` |

Tool naming is `{manual_name}.{manual_name}_{tool_name}`, so a call reads `chrome_devtools_1.chrome_devtools_1_navigate_page`.

### The example scripts

`examples/` holds three bash scripts. Each one doubles as a CI gate because it returns a non-zero exit code when a check fails.

- `performance-baseline.sh` writes metrics, a HAR trace, a screenshot, console logs and DOM counts into one folder under the temp directory, with a timestamp in each file name.
- `animation-testing.sh` fails on a layout count above 3 or a task duration above 200ms. Style recalculations cap at 5.
- `multi-viewport-test.sh` runs five viewports from 1920x1080 down to 414x896. It sets each one with `bdg cdp Emulation.setDeviceMetricsOverride --params '<json>'`, the form bdg 0.6.10 accepts.

All three scripts save console output with `bdg console --list --json` and read errors from `.messages[]` where `type` is `error`. A console error fails a viewport in the viewport matrix, raises a warning in the animation test and is listed in the baseline summary.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when the answer lives in a rendered page: a screenshot to prove layout, a console error to explain a failed load, a HAR trace to find a slow request or a CDP call that no other tool exposes.

Reach for the CLI when one inspection settles the question. Reach for the MCP path when the browser step sits inside a larger chain or when two pages must be checked at the same time.

The skill is not a cross-browser test framework. It drives Chromium-based browsers only, so Firefox and Safari need another tool. A full UI suite belongs to Playwright or Puppeteer. Application-code standards belong to `sk-code`.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-browser-use` | Hub that routes a browser request to this packet and loads only the files the matched intents name. |
| `mcp-code-mode` | Owns the MCP transport. This skill registers the Chrome DevTools manuals and calls them through `call_tool_chain()`. |
| `mcp-aside-devtools` | Owns signed-in Aside browser work by default. The live manual here is the fallback when an isolated browser cannot reach the page. |
| `sk-code` | Owns application-code standards and the browser verification inside a code workflow. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `bash: bdg: command not found` | npm installed the binary somewhere that is not on PATH | Run `npm install -g browser-debugger-cli@0.6.10`, then check `npm config get prefix` to find its `bin` folder |
| `Error: Could not find Chrome/Chromium executable` | No browser binary at a standard path | Set `CHROME_PATH` to your browser executable and confirm with `ls -la "$CHROME_PATH"` |
| `Error: Session already running` | An earlier run never called `bdg stop` | Run `bdg stop 2>&1`. In a script, register `trap "bdg stop 2>&1" EXIT INT TERM` |
| `Error: Method 'Page.screenshot' not found` | The method name does not exist | `bdg cdp --search screenshot` finds the real name, here `Page.captureScreenshot` |
| `Error: Session target not found` from `bdg dom eval`, exit 83 | bdg 0.6.10 looks for the tab on port 9222 only. A session on another port has no tab there | Start the session without `-p` when 9222 is free, or read the value with `bdg cdp Runtime.evaluate --params '<json>'`. See `references/troubleshooting.md` §6 |
| Chrome DevTools tools missing in Code Mode | The manual is absent or disabled in `.utcp_config.json` | Compare the file against the manuals snapshot and restart the session |

---

## 6. FAQ

### Are both paths needed?

No. The CLI covers inspection on its own and needs only the `bdg` binary. The MCP path needs Code Mode configured in `.utcp_config.json` with the manuals registered there. In this repository all three manuals are already registered.

### When is the MCP path worth the extra tokens?

When browser work chains with other Code Mode tools or when two pages must be inspected at the same time. The isolated manuals cover the second case because each owns a browser process. A single screenshot gains nothing from MCP and costs more.

### Can I drive a page I am already signed in to?

Only through `chrome_devtools_live`, which attaches to your open Chrome with `--autoConnect`. An isolated manual starts logged out on every run. Turn on remote debugging once at `chrome://inspect/#remote-debugging`, then open pages with `new_page({ url, background: true })` and close only the tab you opened.

### Where does a capture end up?

Wherever the command points. A HAR file, a cookie dump, a trace or a screenshot of a signed-in page can hold live session cookies and bearer tokens, so write them outside the repository and redact values before you quote them.

### Does this work on Windows?

Only through WSL. Native Windows shells are not supported. bdg 0.6.10 needs Node.js 20 or higher, and both setup scripts check for 20.

---

## 7. VERIFICATION

Run the checks from the repository root. The manual playbook runs 22 scenarios across 6 categories. The critical path is install and session start. A failed screenshot capture also blocks release.

| Check | What a pass looks like |
|---|---|
| Setup diagnostics | `bash .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh` prints ✓ lines for Node, npm, the `bdg` binary, the browser and the registered manual, and a platform line that is ✓ on macOS and a warning elsewhere, then exits 0 |
| Protocol reach | `bdg cdp --list` piped to `jq '.count'` prints `53` |
| CLI health | The screenshot commands in QUICK START leave a non-empty PNG on disk and `bdg stop` ends the session |
| Example scripts | Each script exits 0 on a clean run and non-zero when a check or command fails |
| README structure | The validator below reports zero issues |

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md --type readme
```

Expected: `✅ VALID` with `Total issues: 0`.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, routing summary and the ALWAYS and NEVER rules |
| [`ROUTER.md`](./ROUTER.md) | Intent model, resource map and the loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step install for the CLI and the MCP server |
| [`references/cdp-patterns.md`](./references/cdp-patterns.md) | CDP domain patterns and Unix pipe composition |
| [`references/session-management.md`](./references/session-management.md) | Session lifecycle, retry and cleanup patterns |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference, diagnostic sequence and platform fixes |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Inventory of 31 CLI and MCP features across 7 domains |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The 22 manual scenarios that validate the skill's surface |
| [`examples/README.md`](./examples/README.md) | Guide to the three example scripts and their CI use |
| [`scripts/README.md`](./scripts/README.md) | What the install and diagnostic scripts change and print |
| [`scripts/install.sh`](./scripts/install.sh) | Installer for `bdg` with Chrome detection |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only environment diagnostics |
| [`mcp-servers/bdg-cli/README.md`](./mcp-servers/bdg-cli/README.md) | Install pointer for the `bdg` CLI, nothing vendored |
| [`mcp-servers/chrome-devtools-mcp/README.md`](./mcp-servers/chrome-devtools-mcp/README.md) | The Code Mode server behind the manuals |
| [`assets/utcp-chrome-devtools-manuals.md`](./assets/utcp-chrome-devtools-manuals.md) | Snapshot of the three registered manual entries |
