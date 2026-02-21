# Chrome DevTools Installation Guide

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package:** `browser-debugger-cli@alpha` | **Dependencies:** Node.js 18+, Chrome/Chromium

**Version:** 2.1.0 | **Updated:** 2026-02-20 | **Protocol:** Chrome DevTools Protocol (CDP)

---

## Version History

| Version | Date       | Changes                                                   |
| ------- | ---------- | --------------------------------------------------------- |
| 2.1.0   | 2026-02-20 | HVR compliance rewrite, formal checkpoints, STOP blocks   |
| 2.0.0   | 2025-10-01 | Two-approach architecture, MCP fallback, security section |
| 1.0.0   | 2025-06-01 | Initial CLI guide                                         |

---

## Table of Contents

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

---

## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install the Chrome DevTools CLI (bdg) for browser debugging.

Please help me:
1. Check if I have Node.js 18+ installed
2. Install browser-debugger-cli globally
3. Verify Chrome/Chromium is available
4. Test with a basic screenshot capture
5. (Optional) Configure MCP fallback if needed

My platform is: [macOS / Linux / Windows with WSL]

Guide me through each step with the exact commands needed.
```

The AI will:
- Verify Node.js 18+ is available on your system
- Install `browser-debugger-cli` globally
- Test Chrome/Chromium availability
- Run a basic screenshot test to confirm installation
- Configure MCP fallback if you need multi-tool workflows

**Expected setup time:** 3 to 5 minutes

### Quick Success Check (30 seconds)

After installation, run these two tests immediately:

1. Open your terminal and run: `bdg --version`
2. Version output appears: CLI is working
3. In Claude Code, ask: "Take a screenshot of example.com"
4. Screenshot captured: full system is working

Not working? Go to [Troubleshooting](#9-troubleshooting).

---

## 1. Overview

Chrome DevTools gives AI assistants browser debugging capabilities through two approaches. The CLI (`bdg`) is the primary method: direct, fast and token-efficient. The MCP fallback runs through Code Mode and suits multi-tool orchestration or parallel browser testing.

### Source Repository

| Property         | Value                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **GitHub (CLI)** | [szymdzum/browser-debugger-cli](https://github.com/szymdzum/browser-debugger-cli)           |
| **GitHub (MCP)** | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| **npm (CLI)**    | `browser-debugger-cli@alpha`                                                                |
| **npm (MCP)**    | `chrome-devtools-mcp@latest`                                                                |
| **License**      | MIT / Apache-2.0                                                                            |

### Two Approaches

| Approach            | Package                      | When to Use                             | Token Cost |
| ------------------- | ---------------------------- | --------------------------------------- | ---------- |
| **CLI (bdg)**       | `browser-debugger-cli@alpha` | Single browser, quick tasks, debugging  | Lowest     |
| **MCP (Code Mode)** | `chrome-devtools-mcp@latest` | Multi-tool workflows, parallel browsers | Higher     |

Default to CLI. Use MCP only when CLI is not sufficient.

### Decision Flowchart

```
Task received → Is bdg CLI available? (command -v bdg)
                      │
              ┌───────┴───────┐
             YES              NO
              │               │
              ▼               ▼
        Use CLI          Is Code Mode configured?
        (fastest)               │
                        ┌───────┴───────┐
                       YES              NO
                        │               │
                        ▼               ▼
                   Use MCP         Install CLI:
                   (fallback)      npm i -g browser-debugger-cli@alpha
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Client (Claude/OpenCode)               │
└─────────────────────────────┬───────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   CLI Approach (Primary)│     │   MCP Approach (Fallback)   │
│   browser-debugger-cli  │     │   Chrome DevTools MCP       │
│                         │     │   via Code Mode             │
│   - Direct terminal     │     │   - call_tool_chain()       │
│   - Self-documenting    │     │   - Type-safe invocation    │
│   - Unix composable     │     │   - Multi-tool integration  │
│   - All 644 CDP methods │     │   - 26 exposed tools        │
└────────────┬────────────┘     └──────────────┬──────────────┘
             │                                  │
             └──────────────┬───────────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │    Chrome DevTools Protocol │
              │    (CDP via WebSocket)      │
              │    Port 9222 (localhost)    │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │    Chrome/Chromium/Edge     │
              └─────────────────────────────┘
```

### MCP Architecture Detail

When using MCP, Chrome DevTools routes through Code Mode, not directly to your AI client:

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client (Claude Code, OpenCode, VS Code)                │
│  - CLI: bdg command (direct, standalone, no Code Mode)          │
│  - MCP: 4 Code Mode tools → chrome_devtools_1.*                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (MCP only)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP (configured in opencode.json)                    │
│  - Reads .utcp_config.json for Chrome DevTools provider         │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Chrome DevTools Provider (configured in .utcp_config.json)     │
│  - 26 tools via chrome_devtools_1.chrome_devtools_1_{tool}      │
└─────────────────────────────────────────────────────────────────┘
```

Chrome DevTools' 26 MCP tools would consume roughly 78k tokens if exposed natively. Code Mode provides on-demand access with 98% context reduction.

### Performance Targets

| Operation             | Target | Typical |
| --------------------- | ------ | ------- |
| Session startup       | <5s    | ~3s     |
| Screenshot capture    | <2s    | ~1s     |
| Console log retrieval | <1s    | ~500ms  |
| DOM query             | <500ms | ~200ms  |
| HAR export            | <3s    | ~2s     |

---

## 2. Prerequisites

### Required Tools

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x or higher
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- **Chrome/Chromium Browser**, one of:
  - Google Chrome (recommended)
  - Chromium
  - Microsoft Edge (Chromium-based)

### Platform Support

| Platform    | Status         | Notes                             |
| ----------- | -------------- | --------------------------------- |
| **macOS**   | Native support | Recommended                       |
| **Linux**   | Native support | May need sandbox configuration    |
| **Windows** | WSL only       | PowerShell and Git Bash not supported |

### Common Setup Issues

**Chrome path not found:**
```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"
# or
export CHROME_PATH="/usr/bin/chromium-browser"
```

**Windows users:** WSL is required. Install it first with: `wsl --install`

---

## 3. Installation

### Step 1: Install browser-debugger-cli

```bash
npm install -g browser-debugger-cli@alpha
```

### Step 2: Verify the binary

```bash
# Confirm installation
command -v bdg || echo "Installation failed"

# Check version
bdg --version

# List available CDP domains
bdg --list
```

### Step 3: Test basic operation

```bash
# Start a session
bdg https://example.com 2>&1

# Take a screenshot
bdg screenshot test.png 2>&1

# Check console logs
bdg console logs 2>&1

# Stop the session
bdg stop 2>&1

# Confirm screenshot was created
ls -la test.png
```

### Step 4: Configure Chrome path if needed

```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Add to your shell profile for persistence
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
source ~/.zshrc
```

### Validation: `phase_1_complete`

Run these checks to confirm prerequisites are met:

| Check         | Command                  | Expected                     |
| ------------- | ------------------------ | ---------------------------- |
| CLI installed | `command -v bdg`         | Path to bdg binary           |
| Version       | `bdg --version`          | `browser-debugger-cli@x.x.x` |
| CDP domains   | `bdg --list \| head -5`  | `Page, DOM, Network...`      |

STOP if any check fails. Fix the issue before continuing.

### Validation: `phase_2_complete`

Confirm CLI installation is complete:

| Check          | Command                             | Expected          |
| -------------- | ----------------------------------- | ----------------- |
| Session starts | `bdg https://example.com 2>&1`      | No errors         |
| Screenshot     | `bdg screenshot /tmp/test.png 2>&1` | File created      |
| Session stops  | `bdg stop 2>&1`                     | Clean exit        |

STOP if validation fails. Review [Troubleshooting](#9-troubleshooting) before continuing.

---

## 4. Configuration

MCP is optional. Configure it only if you need multi-tool workflows or when CLI is not available.

### MCP Approach: Code Mode Provider

When using MCP, Chrome DevTools is a Code Mode provider, not a standalone MCP server.

| Aspect             | What This Means                                                                |
| ------------------ | ------------------------------------------------------------------------------ |
| **Configuration**  | Chrome DevTools goes in `.utcp_config.json`, not `opencode.json`               |
| **Access Method**  | Tools are accessed via Code Mode's `call_tool_chain()`                         |
| **Prerequisite**   | Code Mode MCP must be installed first. See [Code Mode INSTALL_GUIDE.md](../mcp-code-mode/INSTALL_GUIDE.md) section 4 |
| **Context Cost**   | Your AI sees only 4 Code Mode tools (~1.6k tokens), not 26 Chrome DevTools tools |
| **Naming Pattern** | `chrome_devtools_1.chrome_devtools_1_{tool_name}`                              |

### When to Use MCP

Use MCP when you:
- Already use Code Mode for other tools such as Webflow or Figma
- Need to chain browser operations with other MCP tools
- Require parallel browser testing to compare multiple sites at once
- Need complex multi-step automation in TypeScript
- Require type-safe tool invocation

### Step 1: Verify Code Mode

Confirm Code Mode is configured in your MCP settings. Use `.mcp.json` for Claude Code or `opencode.json` for OpenCode:

```json
{
  "mcpServers": {
    "code_mode": {
      "command": "node",
      "args": ["/path/to/code-mode-mcp/dist/index.js"],
      "env": {
        "UTCP_CONFIG_FILE": "/path/to/project/.utcp_config.json"
      }
    }
  }
}
```

### Step 2: Add Chrome DevTools to UTCP Config

Add the following to `.utcp_config.json`. Use `--isolated=true` to give each instance its own independent browser:

```json
{
  "manual_call_templates": [
    {
      "name": "chrome_devtools_1",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_1": {
            "transport": "stdio",
            "command": "npx",
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"],
            "env": {}
          }
        }
      }
    },
    {
      "name": "chrome_devtools_2",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_2": {
            "transport": "stdio",
            "command": "npx",
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"],
            "env": {}
          }
        }
      }
    }
  ]
}
```

Register multiple instances for parallel testing. Each needs `--isolated=true`.

### Step 3: Verify MCP tools

```typescript
// In Code Mode context
const tools = await list_tools();
console.log(tools.filter(t => t.includes('chrome_devtools')));
// Expected: chrome_devtools_1_navigate_page, chrome_devtools_1_take_screenshot, etc.
```

### Validation: `phase_3_complete`

| Check            | Method                  | Expected                |
| ---------------- | ----------------------- | ----------------------- |
| Config exists    | `cat .utcp_config.json` | chrome_devtools entry   |
| Tools registered | `list_tools()`          | chrome_devtools_* tools |
| Server starts    | Navigate to a URL       | No connection errors    |

STOP if validation fails. Review your UTCP config and restart your AI client session.

### Security Considerations

Port 9222 runs the Chrome DevTools Protocol for remote debugging. It grants full browser control.

**Risks:**
- Full browser control to anyone with port access
- Cookie and session theft
- JavaScript injection
- Local file system access via browser

**Mitigations:**

| Mitigation             | Implementation                             |
| ---------------------- | ------------------------------------------ |
| Bind to localhost only | `--remote-debugging-address=127.0.0.1`     |
| Firewall rules         | Block port 9222 from external access       |
| Development only       | Never expose on production networks        |
| Network isolation      | Use in CI/CD with isolated networking      |

```bash
# Verify the port is localhost-only
lsof -i :9222
# Should show 127.0.0.1:9222, not *:9222
```

**Linux sandbox security:**

Chrome's sandbox provides process isolation. Avoid disabling it unless necessary.

| Option                     | Security Level | When to Use               |
| -------------------------- | -------------- | ------------------------- |
| Default sandbox            | Best           | Standard installations    |
| `--disable-setuid-sandbox` | Medium         | When user namespaces work |
| `--no-sandbox`             | Poor           | Last resort only          |

**Preferred approach, from most to least secure:**

1. Run in a container with proper permissions:
   ```bash
   docker run --cap-add=SYS_ADMIN chromium
   ```

2. Enable user namespaces:
   ```bash
   sudo sysctl -w kernel.unprivileged_userns_clone=1
   ```

3. Disable setuid sandbox only:
   ```bash
   export CHROME_FLAGS="--disable-setuid-sandbox"
   ```

4. No-sandbox as a last resort:
   ```bash
   export CHROME_FLAGS="--no-sandbox"
   ```

**CI/CD security flags:**
```bash
export CHROME_FLAGS="--disable-gpu --disable-dev-shm-usage --remote-debugging-address=127.0.0.1"
```

| Flag                                   | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `--disable-gpu`                        | Prevent GPU issues in headless |
| `--disable-dev-shm-usage`              | Avoid shared memory issues     |
| `--remote-debugging-address=127.0.0.1` | Localhost binding only         |

---

## 5. Verification

### One-Command Health Check

```bash
# Complete CLI verification in one command
bdg --version 2>&1 && \
  bdg https://example.com 2>&1 && \
  bdg screenshot /tmp/verify.png 2>&1 && \
  bdg stop 2>&1 && \
  ls -la /tmp/verify.png && \
  echo "SUCCESS: All checks passed" || \
  echo "FAILED: Check error output above"
```

### Full Verification Checklist

| #   | Check          | Command                             | Expected Result                 |
| --- | -------------- | ----------------------------------- | ------------------------------- |
| 1   | CLI installed  | `command -v bdg`                    | `/usr/local/bin/bdg` or similar |
| 2   | Version        | `bdg --version`                     | `browser-debugger-cli@x.x.x`   |
| 3   | CDP domains    | `bdg --list \| wc -l`               | 53+ domains                     |
| 4   | Session start  | `bdg https://example.com 2>&1`      | No errors                       |
| 5   | Session status | `bdg status 2>&1`                   | `{"state": "active"}`           |
| 6   | Screenshot     | `bdg screenshot /tmp/test.png 2>&1` | File created                    |
| 7   | Session stop   | `bdg stop 2>&1`                     | Clean exit                      |

### Verify in Your AI Client

In Claude Code or OpenCode, run:
```
> Take a screenshot of https://example.com
```

Expected result: bdg commands execute and a screenshot is captured and displayed.

### Validation: `phase_4_complete`

All 7 checklist items above pass with no errors.

STOP if any item fails. The system is not ready for use until all checks pass.

### Validation: `phase_5_complete`

Your AI client successfully captures a screenshot on request. The system is operational.

---

## 6. Usage

### Pattern 1: Quick Screenshot (CLI)

```bash
bdg https://example.com 2>&1
bdg screenshot output.png 2>&1
bdg stop 2>&1
```

### Pattern 2: Console Log Analysis (CLI)

```bash
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level == "error")'
bdg stop 2>&1
```

### Pattern 3: Network Monitoring (CLI)

```bash
bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1
sleep 5
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Analyze slow requests
jq '.log.entries[] | select(.time > 1000) | {url: .request.url, time}' network-trace.har
```

### Pattern 4: Cookie Manipulation (CLI)

```bash
bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1

# Get cookies
bdg network cookies 2>&1

# Set a cookie
bdg cdp Network.setCookie '{
  "name": "auth_token",
  "value": "secret-123",
  "domain": "example.com",
  "secure": true
}' 2>&1

bdg stop 2>&1
```

### Pattern 5: Single Instance (MCP Fallback)

When CLI is not sufficient, use Code Mode:

```typescript
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  const logs = await chrome_devtools_1.chrome_devtools_1_list_console_messages({});
  return { screenshot, logs };
`)
```

### Pattern 6: Parallel Instances (MCP)

Compare multiple sites at the same time:

```typescript
call_tool_chain(`
  // Instance 1: Production
  await chrome_devtools_1.chrome_devtools_1_navigate_page({
    url: "https://production.example.com"
  });

  // Instance 2: Staging (isolated browser)
  await chrome_devtools_2.chrome_devtools_2_navigate_page({
    url: "https://staging.example.com"
  });

  // Capture both screenshots
  const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

  return { production: prod, staging: staging };
`)
```

### Tool Selection Guide

| Scenario                 | Tool | Why                         |
| ------------------------ | ---- | --------------------------- |
| Quick screenshot         | CLI  | Fastest, lowest tokens      |
| Console log check        | CLI  | Pipe to jq for filtering    |
| Network trace            | CLI  | HAR export built in         |
| Cookie manipulation      | CLI  | Full CDP access             |
| Multi-tool workflow      | MCP  | Chain with other tools      |
| Parallel browser testing | MCP  | Multiple isolated instances |
| CDP method discovery     | CLI  | `--list`, `--describe`      |

### bdg Command Reference

**Session Commands**

| Command      | Description                     | Example                        |
| ------------ | ------------------------------- | ------------------------------ |
| `bdg <url>`  | Open URL, start browser session | `bdg https://example.com 2>&1` |
| `bdg status` | Check session status            | `bdg status 2>&1`              |
| `bdg stop`   | Stop browser, clean up session  | `bdg stop 2>&1`                |

**Helper Commands**

| Command                      | Description             | Example                             |
| ---------------------------- | ----------------------- | ----------------------------------- |
| `bdg screenshot <path>`      | Capture page screenshot | `bdg screenshot /tmp/test.png 2>&1` |
| `bdg console logs`           | Get console messages    | `bdg console logs 2>&1 \| jq '.'`   |
| `bdg network cookies`        | Get all cookies         | `bdg network cookies 2>&1`          |
| `bdg dom query "<selector>"` | Query DOM elements      | `bdg dom query ".my-class" 2>&1`    |
| `bdg js "<expression>"`      | Execute JavaScript      | `bdg js "document.title" 2>&1`      |
| `bdg har export <path>`      | Export network as HAR   | `bdg har export trace.har 2>&1`     |

**Discovery Commands**

| Command                   | Description               | Example                                 |
| ------------------------- | ------------------------- | --------------------------------------- |
| `bdg --version`           | Show CLI version          | `bdg --version`                         |
| `bdg --list`              | List all CDP domains (53) | `bdg --list`                            |
| `bdg --describe <domain>` | Show domain methods       | `bdg --describe Page`                   |
| `bdg --describe <method>` | Show method signature     | `bdg --describe Page.captureScreenshot` |
| `bdg --search <term>`     | Search CDP methods        | `bdg --search screenshot`               |

**Raw CDP Commands**

| Command                     | Description         | Example                                                     |
| --------------------------- | ------------------- | ----------------------------------------------------------- |
| `bdg cdp <method>`          | Execute CDP method  | `bdg cdp Page.reload 2>&1`                                  |
| `bdg cdp <method> '<json>'` | CDP with parameters | `bdg cdp Network.setCookie '{"name":"x","value":"y"}' 2>&1` |

**Error Handling Pattern**

Always use `2>&1` to capture stderr for error handling:

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
# Cleanup runs automatically on exit
```

---

## 7. Features

| Feature            | CLI (bdg)                                   | MCP (Code Mode)                         |
| ------------------ | ------------------------------------------- | --------------------------------------- |
| **Installation**   | `npm install -g browser-debugger-cli@alpha` | Code Mode + UTCP config                 |
| **Token Cost**     | Lowest                                      | Medium                                  |
| **CDP Access**     | All 644 methods                             | MCP-exposed subset (26 tools)           |
| **Self-Discovery** | `--list`, `--describe`, `--search`          | `search_tools()`                        |
| **Best For**       | Quick debugging, inspection                 | Multi-tool workflows, parallel browsers |

**Core capabilities available through both approaches:**
- Screenshot capture
- DOM inspection and querying
- Console log access
- Network monitoring and HAR export
- CSS debugging
- JavaScript execution
- Cookie management
- Full Chrome DevTools Protocol access

---

## 8. Examples

### Example 1: Full Debug Session

```bash
#!/bin/bash
# Complete debug session with error handling
trap "bdg stop 2>&1" EXIT INT TERM

# Verify CLI is available
command -v bdg || { echo "Install: npm install -g browser-debugger-cli@alpha"; exit 1; }

# Start session
bdg https://example.com 2>&1 || exit 1

# Capture initial state
bdg screenshot before.png 2>&1
bdg console logs 2>&1 > console-before.json

# Enable network monitoring
bdg cdp Network.enable 2>&1
sleep 3

# Export network trace
bdg har export session.har 2>&1
bdg screenshot after.png 2>&1

echo "Debug session complete. Files: before.png, after.png, session.har, console-before.json"
```

### Example 2: JavaScript Execution

```bash
bdg https://example.com 2>&1

# Get page title
bdg js "document.title" 2>&1

# Count links on page
bdg js "document.querySelectorAll('a').length" 2>&1

# Get all link hrefs
bdg js "Array.from(document.querySelectorAll('a')).map(a => a.href)" 2>&1

bdg stop 2>&1
```

### Example 3: DOM Query and Interaction

```bash
bdg https://example.com 2>&1

# Query elements by class
bdg dom query ".nav-link" 2>&1

# Click a button via JavaScript
bdg js "document.querySelector('#submit-btn').click()" 2>&1

# Check result after click
bdg screenshot post-click.png 2>&1
bdg console logs 2>&1

bdg stop 2>&1
```

### Example 4: Network Analysis

```bash
bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1

# Wait for full page load activity
sleep 5
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Find slow requests (over 1 second)
jq '.log.entries[] | select(.time > 1000) | {url: .request.url, time}' network-trace.har

# Find failed requests
jq '.log.entries[] | select(.response.status >= 400) | {url: .request.url, status: .response.status}' network-trace.har
```

### Example 5: Parallel Comparison (MCP)

```typescript
// Compare production and staging side by side
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({
    url: "https://production.example.com"
  });
  await chrome_devtools_2.chrome_devtools_2_navigate_page({
    url: "https://staging.example.com"
  });

  const prodScreenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  const stagingScreenshot = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});
  const prodLogs = await chrome_devtools_1.chrome_devtools_1_list_console_messages({});
  const stagingLogs = await chrome_devtools_2.chrome_devtools_2_list_console_messages({});

  return {
    production: { screenshot: prodScreenshot, logs: prodLogs },
    staging: { screenshot: stagingScreenshot, logs: stagingLogs }
  };
`)
```

### Example 6: Cookie Session Management

```bash
bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1

# Export current cookies
bdg network cookies 2>&1 > cookies.json

# Inject an auth token
bdg cdp Network.setCookie '{
  "name": "auth_token",
  "value": "test-session-token",
  "domain": "example.com",
  "path": "/",
  "secure": true,
  "httpOnly": true
}' 2>&1

# Reload to test authenticated state
bdg cdp Page.reload 2>&1
bdg screenshot authenticated.png 2>&1

bdg stop 2>&1
```

---

## 9. Troubleshooting

### Error/Cause/Fix Reference

| Error | Cause | Fix |
| ----- | ----- | --- |
| `command not found: bdg` | CLI not installed or not in PATH | Run `npm install -g browser-debugger-cli@alpha`. Check PATH with `npm config get prefix` |
| `Error: Could not find Chrome` | Chrome path not set or binary missing | Set `CHROME_PATH` env var. See path examples below |
| `Error: No active session` | Session not started or crashed | Run `bdg stop 2>&1` then retry `bdg <url> 2>&1` |
| `Failed to move to new namespace` | Linux sandbox restriction | Enable user namespaces or set `CHROME_FLAGS`. See Linux sandbox section |
| `bdg fails on Windows` | Native Windows not supported | Install WSL with `wsl --install`, then install bdg inside WSL |
| Chrome DevTools tools missing in Code Mode | UTCP config missing or disabled | Check `.utcp_config.json`, confirm `disabled: false`, restart your session |
| MCP server fails to start | Port conflict or config error | Run `lsof -i :9222` and kill conflicting processes |
| `EADDRINUSE: address already in use :::9222` | Port 9222 already taken | Run `kill -9 $(lsof -t -i :9222)` to free the port |

### CLI: Command Not Found

```bash
# Install bdg
npm install -g browser-debugger-cli@alpha

# Or fix PATH
npm config get prefix
export PATH="$(npm config get prefix)/bin:$PATH"

# Verify
command -v bdg
```

### CLI: Chrome Not Found

```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Confirm Chrome exists at the path
ls -la "$CHROME_PATH"

# Add to your shell profile
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
```

### CLI: Session Won't Start

```bash
# Force stop any existing sessions
bdg stop 2>&1

# Find zombie Chrome processes
ps aux | grep -i chrome | grep -i debug

# Kill zombie processes
pkill -f "chrome.*remote-debugging"

# Retry
bdg https://example.com 2>&1
```

### CLI: Sandbox Errors (Linux)

Fix in order of preference:

```bash
# Option 1: Enable user namespaces (preferred)
sudo sysctl -w kernel.unprivileged_userns_clone=1

# Option 2: Disable setuid sandbox only
export CHROME_FLAGS="--disable-setuid-sandbox"

# Option 3: No sandbox (least secure, last resort)
export CHROME_FLAGS="--no-sandbox"
```

### CLI: Windows Not Supported

```bash
# Install WSL
wsl --install

# Inside WSL, install bdg
npm install -g browser-debugger-cli@alpha
```

### MCP: Tool Not Found

1. Open `.utcp_config.json` and confirm the chrome_devtools entry exists
2. Check that `disabled` is not set to `true`
3. Restart your Claude Code or OpenCode session
4. Run `list_tools()` and look for chrome_devtools_* entries

### MCP: Connection Failed

```bash
# Test the MCP server directly
npx chrome-devtools-mcp@latest --version

# Check for port conflicts
lsof -i :9222

# Kill any conflicting processes
kill $(lsof -t -i :9222)
```

### MCP: Port Already in Use

```bash
# Find the process using port 9222
lsof -i :9222

# Kill it
kill -9 $(lsof -t -i :9222)

# Confirm the port is free
lsof -i :9222
# Should return nothing
```

---

## 10. Resources

### Related Documentation

| Document        | Location                                                                  | Purpose              |
| --------------- | ------------------------------------------------------------------------- | -------------------- |
| SKILL.md        | `.opencode/skill/mcp-chrome-devtools/SKILL.md`                      | Complete workflows   |
| CDP Patterns    | `.opencode/skill/mcp-chrome-devtools/references/cdp_patterns.md`    | Domain patterns      |
| Troubleshooting | `.opencode/skill/mcp-chrome-devtools/references/troubleshooting.md` | Detailed fixes       |
| Examples        | `.opencode/skill/mcp-chrome-devtools/examples/README.md`            | Production templates |
| Code Mode Guide | `.opencode/skill/mcp-code-mode/INSTALL_GUIDE.md`                          | Code Mode setup      |

### Configuration Paths

| Client  | Configuration                 | Purpose                      |
| ------- | ----------------------------- | ---------------------------- |
| **CLI** | `CHROME_PATH` env var         | Browser location             |
| **MCP** | `.mcp.json` / `opencode.json` | Code Mode server             |
| **MCP** | `.utcp_config.json`           | Chrome DevTools registration |

### MCP Tools Reference (26 tools)

| Tool                    | Purpose            | CLI Equivalent                                   |
| ----------------------- | ------------------ | ------------------------------------------------ |
| `navigate_page`         | Navigate to URL    | `bdg <url>`                                      |
| `take_screenshot`       | Capture screenshot | `bdg screenshot`                                 |
| `list_console_messages` | Get console logs   | `bdg console logs`                               |
| `resize_page`           | Set viewport size  | `bdg cdp Emulation.setDeviceMetricsOverride`     |
| `click`                 | Click element      | `bdg js "document.querySelector('...').click()"` |
| `type_text`             | Type into element  | `bdg js "..."`                                   |
| `get_page_content`      | Get page HTML      | `bdg dom query "html"`                           |

**Tool naming convention:** `{instance}.{instance}_{tool_name}`

```typescript
// Example invocations
chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })
chrome_devtools_1.chrome_devtools_1_take_screenshot({})
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })  // parallel instance
```

---

## Quick Reference Card

### Installation

```bash
npm install -g browser-debugger-cli@alpha
```

### Discovery

```bash
bdg --list                    # List all CDP domains
bdg --describe Page           # Show domain methods
bdg --search screenshot       # Find methods by keyword
```

### Session Control

```bash
bdg <url>                     # Start session
bdg status                    # Check session state
bdg stop                      # Stop session
```

### Common Operations

```bash
bdg screenshot <path>         # Capture screenshot
bdg console logs              # Get console messages
bdg network cookies           # Get all cookies
bdg dom query "<selector>"    # Query DOM
bdg js "<expression>"         # Execute JavaScript
bdg har export <path>         # Export HAR file
```

### MCP Quick Start

```typescript
// When CLI is not sufficient, use Code Mode:
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  return screenshot;
`)
```

### Environment Setup

```bash
# Add to ~/.zshrc or ~/.bashrc
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Linux: export CHROME_PATH="/usr/bin/google-chrome"
```

### Validation Checkpoints Summary

| Checkpoint          | Meaning                              |
| ------------------- | ------------------------------------ |
| `phase_1_complete`  | Prerequisites validated              |
| `phase_2_complete`  | CLI installation complete            |
| `phase_3_complete`  | Configuration complete               |
| `phase_4_complete`  | Verification complete                |
| `phase_5_complete`  | System operational                   |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `mcp-chrome-devtools` skill for detailed workflows.
