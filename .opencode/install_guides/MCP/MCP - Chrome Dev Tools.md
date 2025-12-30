# Chrome DevTools Installation Guide

Complete installation and configuration guide for Chrome DevTools integration, enabling browser debugging and automation for AI agents. Covers both **CLI approach** (bdg command - primary, faster, token-efficient) and **MCP fallback** (Code Mode provider) for multi-tool integration scenarios. Provides screenshot capture, DOM inspection, console access, network monitoring, CSS debugging, and JavaScript execution capabilities.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `browser-debugger-cli@alpha` | **Dependencies**: Node.js 18+, Chrome/Chromium

---

## Table of Contents

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 CLI INSTALLATION](#3--cli-installation)
4. [⚙️ MCP CONFIGURATION](#4-️-mcp-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE PATTERNS](#6--usage-patterns)
7. [🎯 BDG COMMAND REFERENCE](#7--bdg-command-reference)
8. [🛡️ SECURITY CONSIDERATIONS](#8-️-security-considerations)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 🤖 AI INSTALL GUIDE

### Verify Success (30 seconds)

After installation, test immediately:

1. Open terminal and run: `bdg --version`
2. See version output = CLI SUCCESS
3. In Claude Code, ask: "Take a screenshot of example.com"
4. Screenshot captured = FULL SUCCESS

Not working? Jump to [Troubleshooting](#9--troubleshooting).

---

**Copy and paste this prompt to your AI assistant to get installation help:**

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

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Install `browser-debugger-cli` globally
- Test Chrome/Chromium availability
- Run basic screenshot test to verify installation
- Configure MCP fallback if multi-tool workflows needed

**Expected setup time:** 3-5 minutes

---

## ⚠️ IMPORTANT: Two Access Methods

Chrome DevTools offers **two approaches** - choose based on your needs:

| Approach           | Configuration                               | Best For                                | Code Mode Required? |
| ------------------ | ------------------------------------------- | --------------------------------------- | ------------------- |
| **CLI (Primary)**  | `npm install -g browser-debugger-cli@alpha` | Quick debugging, single browser         | ❌ No                |
| **MCP (Fallback)** | `.utcp_config.json`                         | Multi-tool workflows, parallel browsers | ✅ Yes               |

### MCP Approach = Code Mode Provider

**When using MCP, Chrome DevTools is accessed through Code Mode, not called directly.**

| Aspect             | What This Means                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Configuration**  | Chrome DevTools is configured in `.utcp_config.json`, NOT `opencode.json`                |
| **Access Method**  | Tools accessed via Code Mode's `call_tool_chain()`                                       |
| **Prerequisite**   | Code Mode MCP must be installed first ([MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)) |
| **Context Cost**   | AI sees only 4 Code Mode tools (~1.6k tokens), not 26 Chrome DevTools tools              |
| **Naming Pattern** | `chrome_devtools_1.chrome_devtools_1_{tool_name}`                                        |

**Why Code Mode for MCP?** Chrome DevTools' 26 MCP tools would consume ~78k tokens if exposed natively. Code Mode provides on-demand access with 98% context reduction.

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client (Claude Code, OpenCode, VS Code)                │
│  └─► CLI: bdg command (direct, standalone, no Code Mode)        │
│  └─► MCP: 4 Code Mode tools → chrome_devtools_1.*               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (MCP only)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP (configured in opencode.json)                     │
│  └─► Reads .utcp_config.json for Chrome DevTools provider        │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Chrome DevTools Provider (configured in .utcp_config.json)       │
│  └─► 26 tools via chrome_devtools_1.chrome_devtools_1_{tool}    │
└─────────────────────────────────────────────────────────────────┘
```

> **Recommendation**: Start with CLI (`bdg`). Only use MCP if you need multi-tool orchestration or parallel browser testing.

---

## 1. 📖 OVERVIEW

The Chrome DevTools tools provide AI assistants with browser debugging capabilities through two complementary approaches.

### Source Repository

| Property         | Value                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **GitHub (CLI)** | [szymdzum/browser-debugger-cli](https://github.com/szymdzum/browser-debugger-cli)           |
| **GitHub (MCP)** | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| **npm (CLI)**    | `browser-debugger-cli@alpha`                                                                |
| **npm (MCP)**    | `chrome-devtools-mcp@latest`                                                                |
| **License**      | MIT / Apache-2.0                                                                            |

## Two Approaches

| Approach            | Package                      | When to Use                             | Token Cost |
| ------------------- | ---------------------------- | --------------------------------------- | ---------- |
| **CLI (bdg)**       | `browser-debugger-cli@alpha` | Single browser, quick tasks, debugging  | **Lowest** |
| **MCP (Code Mode)** | `chrome-devtools-mcp@latest` | Multi-tool workflows, parallel browsers | Higher     |

> **Default to CLI.** Use MCP only when CLI is insufficient.

**Decision flowchart:**
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

### Key Features

| Feature            | CLI (bdg)                                   | MCP (Code Mode)                         |
| ------------------ | ------------------------------------------- | --------------------------------------- |
| **Installation**   | `npm install -g browser-debugger-cli@alpha` | Code Mode + UTCP config                 |
| **Token Cost**     | Lowest                                      | Medium                                  |
| **CDP Access**     | All 644 methods                             | MCP-exposed subset (26 tools)           |
| **Self-Discovery** | `--list`, `--describe`, `--search`          | `search_tools()`                        |
| **Best For**       | Quick debugging, inspection                 | Multi-tool workflows, parallel browsers |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Client (Claude/OpenCode)              │
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

### Performance Targets

| Operation             | Target | Typical |
| --------------------- | ------ | ------- |
| Session startup       | <5s    | ~3s     |
| Screenshot capture    | <2s    | ~1s     |
| Console log retrieval | <1s    | ~500ms  |
| DOM query             | <500ms | ~200ms  |
| HAR export            | <3s    | ~2s     |

---

## 2. 📋 PREREQUISITES

### Required

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x or higher
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- **Chrome/Chromium Browser** (one of):
  - Google Chrome (recommended)
  - Chromium
  - Microsoft Edge (Chromium-based)

### Platform Support

| Platform    | Status         | Notes                             |
| ----------- | -------------- | --------------------------------- |
| **macOS**   | Native support | Recommended                       |
| **Linux**   | Native support | May need sandbox config           |
| **Windows** | WSL only       | PowerShell/Git Bash NOT supported |

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

**Windows users:** WSL required. Install first: `wsl --install`

---

## 3. 📥 CLI INSTALLATION

### Step 1: Install browser-debugger-cli

```bash
npm install -g browser-debugger-cli@alpha
```

### Step 2: Verify Installation

```bash
# Check installation
command -v bdg || echo "Installation failed"

# Check version
bdg --version

# List available CDP domains
bdg --list
```

### Step 3: Test Basic Operation

```bash
# Start a session
bdg https://example.com 2>&1

# Take screenshot
bdg screenshot test.png 2>&1

# Check console logs
bdg console logs 2>&1

# Stop session
bdg stop 2>&1

# Verify screenshot created
ls -la test.png
```

### Step 4: Configure Chrome Path (if needed)

```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Add to shell profile for persistence
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
source ~/.zshrc
```

### Validation Checkpoint: CLI

| Check         | Command                 | Expected                     |
| ------------- | ----------------------- | ---------------------------- |
| CLI installed | `command -v bdg`        | Path to bdg binary           |
| Version       | `bdg --version`         | `browser-debugger-cli@x.x.x` |
| CDP domains   | `bdg --list \| head -5` | `Page, DOM, Network...`      |

---

## 4. ⚙️ MCP CONFIGURATION

> **Note:** MCP is optional. Only configure if you need multi-tool workflows or when CLI is unavailable.

---

### ⚠️ Code Mode Provider (MCP Approach)

**When using MCP, Chrome DevTools is a Code Mode provider, NOT a standalone MCP server.**

| Aspect             | What This Means                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Configuration**  | Chrome DevTools is configured in `.utcp_config.json`, NOT `opencode.json`                |
| **Access Method**  | Tools accessed via Code Mode's `call_tool_chain()`                                       |
| **Prerequisite**   | Code Mode MCP must be installed first ([MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)) |
| **Context Cost**   | AI sees only 4 Code Mode tools (~1.6k tokens), not 26 Chrome DevTools tools              |
| **Naming Pattern** | `chrome_devtools_1.chrome_devtools_1_{tool_name}`                                        |

**Why Code Mode for MCP?** Chrome DevTools' 26 MCP tools would consume ~78k tokens if exposed natively. Code Mode provides on-demand access with 98% context reduction.

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client (Claude Code, OpenCode, VS Code)                │
│  └─► CLI: bdg command (direct, no Code Mode needed)             │
│  └─► MCP: 4 Code Mode tools → chrome_devtools_1.chrome_devtools_1_* │
└─────────────────────────────────────────────────────────────────┘
```

> **CLI vs MCP**: The CLI approach (`bdg` command) is standalone and doesn't require Code Mode. Only the MCP approach requires Code Mode.

---

### When to Use MCP

- Already using Code Mode for other tools (Webflow, Figma, etc.)
- Need to chain browser operations with other MCP tools
- **Parallel browser testing** - compare multiple sites simultaneously
- Complex multi-step automation in TypeScript
- Type-safe tool invocation required

### Step 1: Verify Code Mode

Ensure Code Mode is configured in your MCP settings (`.mcp.json` for Claude Code, or `opencode.json` for OpenCode):

```json
{
  "mcpServers": {
    "code_mode": {
      "command": "node",
      "args": ["/path/to/code-mode-mcp/dist/index.js"],
      "env": {
        "UTCP_CONFIG_PATH": "/path/to/project/.utcp_config.json"
      }
    }
  }
}
```

### Step 2: Add Chrome DevTools to UTCP Config

Add to `.utcp_config.json` with `--isolated=true` for independent browser instances:

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

**Note:** Register multiple instances for parallel testing. Each with `--isolated=true`.

### Step 3: Verify MCP Tools

```typescript
// In Code Mode context
const tools = await list_tools();
console.log(tools.filter(t => t.includes('chrome_devtools')));
// Should show: chrome_devtools_1_navigate_page, chrome_devtools_1_take_screenshot, etc.
```

### Validation Checkpoint: MCP

| Check            | Method                  | Expected                |
| ---------------- | ----------------------- | ----------------------- |
| Config exists    | `cat .utcp_config.json` | chrome_devtools entry   |
| Tools registered | `list_tools()`          | chrome_devtools_* tools |
| Server starts    | Navigate to URL         | No connection errors    |

---

## 5. ✅ VERIFICATION

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
| 2   | Version        | `bdg --version`                     | `browser-debugger-cli@x.x.x`    |
| 3   | CDP domains    | `bdg --list \| wc -l`               | 53+ domains                     |
| 4   | Session start  | `bdg https://example.com 2>&1`      | No errors                       |
| 5   | Session status | `bdg status 2>&1`                   | `{"state": "active"}`           |
| 6   | Screenshot     | `bdg screenshot /tmp/test.png 2>&1` | File created                    |
| 7   | Session stop   | `bdg stop 2>&1`                     | Clean exit                      |

### Verify in AI Client

In Claude Code or OpenCode:
```
> Take a screenshot of https://example.com
```

Expected: bdg commands executed, screenshot captured and displayed.

---

## 6. 🚀 USAGE PATTERNS

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
sleep 5  # Wait for network activity
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

# Set cookie
bdg cdp Network.setCookie '{
  "name": "auth_token",
  "value": "secret-123",
  "domain": "example.com",
  "secure": true
}' 2>&1

bdg stop 2>&1
```

### Pattern 5: Single Instance (MCP Fallback)

When CLI is insufficient, use Code Mode:

```typescript
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  const logs = await chrome_devtools_1.chrome_devtools_1_list_console_messages({});
  return { screenshot, logs };
`)
```

### Pattern 6: Parallel Instances (MCP)

Compare multiple sites simultaneously:

```typescript
call_tool_chain(`
  // Instance 1: Production
  await chrome_devtools_1.chrome_devtools_1_navigate_page({
    url: "https://production.example.com"
  });

  // Instance 2: Staging (parallel - isolated browser)
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
| Network trace            | CLI  | HAR export built-in         |
| Cookie manipulation      | CLI  | Full CDP access             |
| Multi-tool workflow      | MCP  | Chain with other tools      |
| Parallel browser testing | MCP  | Multiple isolated instances |
| CDP method discovery     | CLI  | `--list`, `--describe`      |

---

## 7. 🎯 BDG COMMAND REFERENCE

### Session Commands

| Command      | Description                     | Example                        |
| ------------ | ------------------------------- | ------------------------------ |
| `bdg <url>`  | Open URL, start browser session | `bdg https://example.com 2>&1` |
| `bdg status` | Check session status            | `bdg status 2>&1`              |
| `bdg stop`   | Stop browser, cleanup session   | `bdg stop 2>&1`                |

### Helper Commands

| Command                      | Description             | Example                             |
| ---------------------------- | ----------------------- | ----------------------------------- |
| `bdg screenshot <path>`      | Capture page screenshot | `bdg screenshot /tmp/test.png 2>&1` |
| `bdg console logs`           | Get console messages    | `bdg console logs 2>&1 \| jq '.'`   |
| `bdg network cookies`        | Get all cookies         | `bdg network cookies 2>&1`          |
| `bdg dom query "<selector>"` | Query DOM elements      | `bdg dom query ".my-class" 2>&1`    |
| `bdg js "<expression>"`      | Execute JavaScript      | `bdg js "document.title" 2>&1`      |
| `bdg har export <path>`      | Export network as HAR   | `bdg har export trace.har 2>&1`     |

### Discovery Commands

| Command                   | Description               | Example                                 |
| ------------------------- | ------------------------- | --------------------------------------- |
| `bdg --version`           | Show CLI version          | `bdg --version`                         |
| `bdg --list`              | List all CDP domains (53) | `bdg --list`                            |
| `bdg --describe <domain>` | Show domain methods       | `bdg --describe Page`                   |
| `bdg --describe <method>` | Show method signature     | `bdg --describe Page.captureScreenshot` |
| `bdg --search <term>`     | Search CDP methods        | `bdg --search screenshot`               |

### Raw CDP Commands

| Command                     | Description         | Example                                                     |
| --------------------------- | ------------------- | ----------------------------------------------------------- |
| `bdg cdp <method>`          | Execute CDP method  | `bdg cdp Page.reload 2>&1`                                  |
| `bdg cdp <method> '<json>'` | CDP with parameters | `bdg cdp Network.setCookie '{"name":"x","value":"y"}' 2>&1` |

### Error Handling Pattern

> **Always use `2>&1`** to capture stderr for error handling.

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
# Cleanup automatic on exit
```

---

## 8. 🛡️ SECURITY CONSIDERATIONS

### Port 9222 Exposure

The Chrome DevTools Protocol uses **port 9222** for remote debugging. This port grants full browser control.

**Risks:**
- Full browser control to anyone with port access
- Cookie/session theft
- JavaScript injection
- Local file system access via browser

**Mitigations:**

| Mitigation             | Implementation                             |
| ---------------------- | ------------------------------------------ |
| Bind to localhost only | `--remote-debugging-address=127.0.0.1`     |
| Firewall rules         | Block port 9222 from external access       |
| Development only       | Never expose on production/public networks |
| Network isolation      | Use in CI/CD with isolated networking      |

```bash
# Verify port is localhost-only
lsof -i :9222
# Should show 127.0.0.1:9222, NOT *:9222
```

### Linux Sandbox Security

Chrome's sandbox provides process isolation. Disabling it reduces security.

| Option                     | Security Level | When to Use               |
| -------------------------- | -------------- | ------------------------- |
| Default sandbox            | **Best**       | Standard installations    |
| `--disable-setuid-sandbox` | Medium         | When user namespaces work |
| `--no-sandbox`             | **Poor**       | Last resort only          |

**Preferred approach (most to least secure):**

1. **Run in container with proper permissions**
   ```bash
   # Docker with appropriate caps
   docker run --cap-add=SYS_ADMIN chromium
   ```

2. **Enable user namespaces**
   ```bash
   sudo sysctl -w kernel.unprivileged_userns_clone=1
   ```

3. **Use disable-setuid-sandbox first**
   ```bash
   export CHROME_FLAGS="--disable-setuid-sandbox"
   ```

4. **no-sandbox as last resort**
   ```bash
   # Only if nothing else works
   export CHROME_FLAGS="--no-sandbox"
   ```

### CI/CD Security

For automated testing environments:

```bash
# Recommended CI/CD flags
export CHROME_FLAGS="--disable-gpu --disable-dev-shm-usage --remote-debugging-address=127.0.0.1"
```

| Flag                                   | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `--disable-gpu`                        | Prevent GPU issues in headless |
| `--disable-dev-shm-usage`              | Avoid shared memory issues     |
| `--remote-debugging-address=127.0.0.1` | Localhost binding only         |

---

## 9. 🔧 TROUBLESHOOTING

### CLI: Command Not Found

**Problem:** `command not found: bdg`

**Fix:**
```bash
# Install bdg
npm install -g browser-debugger-cli@alpha

# Or check npm global path
npm config get prefix
export PATH="$(npm config get prefix)/bin:$PATH"

# Verify
command -v bdg
```

### CLI: Chrome Not Found

**Problem:** `Error: Could not find Chrome`

**Fix:**
```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Verify Chrome exists
ls -la "$CHROME_PATH"

# Add to profile
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
```

### CLI: Session Won't Start

**Problem:** `Error: No active session` or session stuck

**Fix:**
```bash
# Force stop existing sessions
bdg stop 2>&1

# Check for zombie Chrome processes
ps aux | grep -i chrome | grep -i debug

# Kill zombie processes
pkill -f "chrome.*remote-debugging"

# Retry
bdg https://example.com 2>&1
```

### CLI: Sandbox Errors (Linux)

**Problem:** `Failed to move to new namespace`

**Fix (in order of preference):**
```bash
# Option 1: Enable user namespaces (preferred)
sudo sysctl -w kernel.unprivileged_userns_clone=1

# Option 2: Disable setuid sandbox only
export CHROME_FLAGS="--disable-setuid-sandbox"

# Option 3: No sandbox (least secure, last resort)
export CHROME_FLAGS="--no-sandbox"
```

### CLI: Windows Not Supported

**Problem:** bdg fails on Windows PowerShell or Git Bash

**Fix:**
```bash
# Install WSL
wsl --install

# Inside WSL, install bdg
npm install -g browser-debugger-cli@alpha
```

### MCP: Tool Not Found

**Problem:** Chrome DevTools tools not appearing in Code Mode

**Fix:**
1. Verify `.utcp_config.json` has chrome_devtools entry
2. Check `disabled: false` in config
3. Restart Claude Code/OpenCode session
4. Run `list_tools()` to verify

### MCP: Connection Failed

**Problem:** MCP server fails to start

**Fix:**
```bash
# Test MCP server directly
npx chrome-devtools-mcp@latest --version

# Check for port conflicts
lsof -i :9222

# Kill conflicting processes
kill $(lsof -t -i :9222)
```

### MCP: Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::9222`

**Fix:**
```bash
# Find process using port
lsof -i :9222

# Kill it
kill -9 $(lsof -t -i :9222)

# Verify port is free
lsof -i :9222  # Should return nothing
```

---

## 10. 📚 RESOURCES

### Related Documentation

| Document        | Location                                                                  | Purpose              |
| --------------- | ------------------------------------------------------------------------- | -------------------- |
| SKILL.md        | `.opencode/skill/workflows-chrome-devtools/SKILL.md`                      | Complete workflows   |
| CDP Patterns    | `.opencode/skill/workflows-chrome-devtools/references/cdp_patterns.md`    | Domain patterns      |
| Troubleshooting | `.opencode/skill/workflows-chrome-devtools/references/troubleshooting.md` | Detailed fixes       |
| Examples        | `.opencode/skill/workflows-chrome-devtools/examples/README.md`            | Production templates |

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
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })  // parallel
```

---

## Quick Reference Card

### Essential CLI Commands

```bash
# Installation
npm install -g browser-debugger-cli@alpha

# Discovery
bdg --list                    # List domains
bdg --describe Page           # Domain methods
bdg --search screenshot       # Find methods

# Session
bdg <url>                     # Start
bdg status                    # Check
bdg stop                      # Stop

# Common operations
bdg screenshot <path>         # Screenshot
bdg console logs              # Console
bdg network cookies           # Cookies
bdg dom query "<selector>"    # DOM query
bdg js "<expression>"         # Execute JS
bdg har export <path>         # HAR export
```

### MCP Quick Start

```typescript
// When CLI is insufficient, use Code Mode:
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
# For Linux: export CHROME_PATH="/usr/bin/google-chrome"
```

---

**Version:** 2.1.0  
**Protocol:** Chrome DevTools Protocol (CDP)  
**Status:** Production Ready

**Need help?** See [Troubleshooting](#9--troubleshooting) or load the `workflows-chrome-devtools` skill for detailed workflows.
