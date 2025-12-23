# Chrome DevTools Orchestrator Installation Guide

A comprehensive guide to installing and configuring browser debugging tools for AI agents. This skill orchestrates between CLI (bdg) and MCP approaches.

---

## 🤖 AI-FIRST INSTALL GUIDE

### Verify Success (30 seconds)

After installation, test immediately:
1. Open terminal and run: `bdg --version`
2. See version output = CLI SUCCESS
3. In Claude Code, ask: "Take a screenshot of example.com"
4. Screenshot captured = FULL SUCCESS

Not working? Jump to [Troubleshooting](#8--troubleshooting).

---

> **Related Documentation:**
> - [SKILL.md](.opencode/skills/workflows-chrome-devtools/SKILL.md) - Complete skill documentation and workflows
> - [cdp_patterns.md](.opencode/skills/workflows-chrome-devtools/references/cdp_patterns.md) - CDP domain patterns and Unix composability
> - [troubleshooting.md](.opencode/skills/workflows-chrome-devtools/references/troubleshooting.md) - Detailed error resolution
> - [examples/README.md](.opencode/skills/workflows-chrome-devtools/examples/README.md) - Production automation templates

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

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ and npm are available
- Install browser-debugger-cli@alpha globally
- Check Chrome/Chromium path and configure if needed
- Test screenshot capture with bdg CLI
- (Optional) Configure Code Mode MCP fallback

**Expected setup time:** 3-5 minutes

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 CLI INSTALLATION](#3--cli-installation)
4. [⚙️ MCP CONFIGURATION](#4-️-mcp-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [🔧 TROUBLESHOOTING](#8--troubleshooting)
9. [📚 RESOURCES](#9--resources)

---

## 1. 📖 OVERVIEW

The Chrome DevTools Orchestrator provides AI assistants with browser debugging capabilities through two complementary approaches: CLI (primary) and MCP (fallback).

### Key Features

- **Self-Documenting CLI**: `--list`, `--describe`, `--search` for CDP method discovery
- **Token Efficient**: CLI approach uses minimal tokens compared to MCP
- **Full CDP Access**: All 644 CDP methods available via CLI
- **Unix Composability**: Pipe output to jq, grep, and other tools
- **Graceful Fallback**: MCP via Code Mode when CLI unavailable

### Approach Comparison

| Specification      | CLI (bdg)                                   | MCP (Code Mode)         |
| ------------------ | ------------------------------------------- | ----------------------- |
| **Installation**   | `npm install -g browser-debugger-cli@alpha` | Code Mode + UTCP config |
| **Token Cost**     | Lowest                                      | Medium                  |
| **CDP Access**     | All 644 methods                             | MCP-exposed subset      |
| **Self-Discovery** | `--list`, `--describe`, `--search`          | `search_tools()`        |
| **Best For**       | Quick debugging, inspection                 | Multi-tool workflows    |

### Tool Selection Flowchart

```
User Request
     │
     ▼
┌─────────────────────────────────────────┐
│ Is bdg CLI available?                   │
│ (command -v bdg)                        │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
        YES              NO
         │               │
         ▼               ▼
┌─────────────────┐  ┌────────────────────┐
│ Use CLI         │  │ Is Code Mode       │
│ (fastest)       │  │ configured?         │
└─────────────────┘  └─────────┬──────────┘
                               │
                       ┌───────┴───────┐
                      YES              NO
                       │               │
                       ▼               ▼
               ┌──────────────┐  ┌────────────────┐
               │ Use MCP      │  │ Install CLI:   │
               │ (fallback)   │  │ npm i -g       │
               └──────────────┘  │ browser-       │
                                 │ debugger-cli   │
                                 │ @alpha         │
                                 └────────────────┘
```

### Architecture Overview

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
└────────────┬────────────┘     └──────────────┬──────────────┘
             │                                  │
             └──────────────┬───────────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │    Chrome DevTools Protocol │
              │    (CDP via WebSocket)      │
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

Before installing, ensure you have:

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

- **Chrome/Chromium Browser** (one of the following):
  - Google Chrome (recommended)
  - Chromium
  - Microsoft Edge (Chromium-based)

### Platform Support

| Platform    | Status         | Notes                             |
| ----------- | -------------- | --------------------------------- |
| **macOS**   | Native support | Recommended                       |
| **Linux**   | Native support | May need sandbox config           |
| **Windows** | WSL only       | PowerShell/Git Bash NOT supported |

### Common Setup Gotchas

**Chrome path not found:**
- Set `CHROME_PATH` environment variable explicitly
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome` or `/usr/bin/chromium-browser`

**Windows users:**
- WSL (Windows Subsystem for Linux) required
- PowerShell and Git Bash are NOT supported
- Install WSL first: `wsl --install`

**Linux sandbox errors:**
- May need `--no-sandbox` flag or namespace configuration
- See [Troubleshooting](#8--troubleshooting) for details

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

# List available CDP domains (53 domains, 644 methods)
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

If Chrome is not auto-detected:

```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Add to shell profile for persistence
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
source ~/.zshrc
```

### Step 5: Test Discovery Commands

```bash
# List all CDP domains
bdg --list

# Explore Page domain
bdg --describe Page

# Search for screenshot methods
bdg --search screenshot

# Get method details
bdg --describe Page.captureScreenshot
```

---

## 4. ⚙️ MCP CONFIGURATION

**Note:** MCP is optional and only needed for multi-tool workflows or when CLI is unavailable.

### When to Use MCP

- Already using Code Mode for other tools (Webflow, Figma, etc.)
- Need to chain browser operations with other MCP tools
- **Parallel browser testing** - compare multiple sites/viewports simultaneously
- Complex multi-step automation in TypeScript
- Type-safe tool invocation required

### Isolated Instances

**Key Feature**: MCP uses `--isolated=true` flag for independent browser instances.

**Benefits:**
- Each instance runs in its own browser process
- Multiple parallel browser sessions possible
- No session conflicts between instances
- Register multiple instances (e.g., `chrome_devtools_1`, `chrome_devtools_2`)

### Step 1: Verify Code Mode Configuration

Ensure Code Mode is configured in `.mcp.json`:

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

Add to `.utcp_config.json` with `--isolated=true` flag:

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

**Note**: Register multiple instances for parallel testing. Each with `--isolated=true`.

### Step 3: Verify MCP Tools

```typescript
// In Code Mode context
const tools = await list_tools();
console.log(tools.filter(t => t.includes('chrome_devtools')));
// Should show: chrome_devtools_1_navigate_page, chrome_devtools_1_take_screenshot, etc.
```

---

## 5. ✅ VERIFICATION

### One-Command Health Check

```bash
# Complete CLI verification in one command
bdg --version 2>&1 && \
  bdg https://example.com 2>&1 && \
  bdg screenshot /tmp/verify.png 2>&1 && \
  bdg stop 2>&1 && \
  echo "SUCCESS: All checks passed" || \
  echo "FAILED: Check error output above"
```

### Check 1: Verify CLI Installation

```bash
# Check bdg is installed
command -v bdg
# Should show: /usr/local/bin/bdg or similar

# Check version
bdg --version
# Should show: browser-debugger-cli@x.x.x

# List CDP domains
bdg --list | head -10
# Should show: Page, DOM, Network, Runtime, etc.
```

### Check 2: Verify Browser Connection

```bash
# Start session
bdg https://example.com 2>&1

# Check status
bdg status 2>&1
# Should show: { "state": "active", ... }

# Stop session
bdg stop 2>&1
```

### Check 3: Verify Screenshot Capture

```bash
bdg https://example.com 2>&1
bdg screenshot /tmp/test.png 2>&1
bdg stop 2>&1

# Verify file created
ls -la /tmp/test.png
# Should show: -rw-r--r-- ... /tmp/test.png
```

### Check 4: Verify in AI Client

**In Claude Code:**
```bash
# Start Claude Code session
claude

# Ask about browser debugging
> Take a screenshot of https://example.com

# Expected: bdg commands executed, screenshot captured
```

### Check 5: Verify MCP (if configured)

```typescript
// Test MCP connection
await call_tool_chain({
  code: `
    const result = await chrome_devtools.chrome_devtools_new_page({
      url: "https://example.com"
    });
    return result ? "MCP: OK" : "MCP: FAILED";
  `
});
```

---

## 6. 🚀 USAGE

### Pattern 1: Quick Screenshot

```bash
bdg https://example.com 2>&1
bdg screenshot output.png 2>&1
bdg stop 2>&1
```

### Pattern 2: Console Log Analysis

```bash
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level == "error")'
bdg stop 2>&1
```

### Pattern 3: Network Monitoring

```bash
bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1
sleep 5  # Wait for network activity
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Analyze slow requests
jq '.log.entries[] | select(.time > 1000) | {url: .request.url, time}' network-trace.har
```

### Pattern 4: Cookie Manipulation

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

### Pattern 5: Single Instance (MCP)

```typescript
await call_tool_chain({
  code: `
    // Navigate (isolated instance)
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });

    // Screenshot
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});

    // Console logs
    const logs = await chrome_devtools_1.chrome_devtools_1_list_console_messages({});

    return { screenshot, logs };
  `,
  timeout: 60000
});
```

### Pattern 6: Parallel Instances (MCP)

```typescript
await call_tool_chain({
  code: `
    // Instance 1: Production
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://production.example.com"
    });

    // Instance 2: Staging (parallel - isolated browser)
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    // Capture both screenshots simultaneously
    const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

    return { production: prod, staging: staging };
  `,
  timeout: 60000
});
```

### Tool Selection Guide

| Scenario | Tool | Why |
|----------|------|-----|
| Quick screenshot | CLI | Fastest, lowest tokens |
| Console log check | CLI | Pipe to jq for filtering |
| Network trace | CLI | HAR export built-in |
| Cookie manipulation | CLI | Full CDP access |
| Multi-tool workflow | MCP | Chain with other tools |
| **Parallel browser testing** | MCP | Multiple isolated instances |
| Already in Code Mode | MCP | Consistency |
| CDP method discovery | CLI | `--list`, `--describe` |

---

## 7. 🎯 FEATURES

### 7.1 CLI Discovery Commands

**Purpose**: Self-documenting CDP method discovery.

**Commands**:

| Command                   | Purpose              | Example                                 |
| ------------------------- | -------------------- | --------------------------------------- |
| `bdg --list`              | List all CDP domains | 53 domains, 644 methods                 |
| `bdg --describe <domain>` | Domain methods       | `bdg --describe Page`                   |
| `bdg --describe <method>` | Method details       | `bdg --describe Page.captureScreenshot` |
| `bdg --search <term>`     | Find methods         | `bdg --search screenshot`               |

**Example Session**:
```bash
# Step 1: List domains
bdg --list
# Output: Page, DOM, Network, Runtime, ...

# Step 2: Explore Page domain
bdg --describe Page
# Output: captureScreenshot, navigate, reload, ...

# Step 3: Get method signature
bdg --describe Page.captureScreenshot
# Output: Parameters, return type, description
```

### 7.2 CLI Helper Commands

**Purpose**: Simplified commands for common operations.

| Command                 | Purpose              | Equivalent CDP             |
| ----------------------- | -------------------- | -------------------------- |
| `bdg screenshot <path>` | Capture screenshot   | `Page.captureScreenshot`   |
| `bdg console logs`      | Get console output   | `Runtime.consoleAPICalled` |
| `bdg network cookies`   | Get cookies          | `Network.getCookies`       |
| `bdg dom query "<sel>"` | Query DOM            | `DOM.querySelector`        |
| `bdg js "<expr>"`       | Execute JavaScript   | `Runtime.evaluate`         |
| `bdg har export <path>` | Export network trace | Multiple Network methods   |

### 7.3 MCP Tools (Isolated Instances)

**Purpose**: Code Mode integration for multi-tool and parallel browser workflows.

| Tool | Purpose | Parameters |
|------|---------|------------|
| `navigate_page` | Navigate to URL | `url: string` |
| `take_screenshot` | Capture screenshot | `{}` |
| `list_console_messages` | Get console logs | `{}` |
| `resize_page` | Set viewport | `width: number, height: number` |

**Note**: Tool names use underscores. Each instance configured with `--isolated=true`.

**Invocation Pattern**:
```typescript
// Tool naming: {instance}.{instance}_{tool_name}
// Each instance runs isolated browser process

// Single instance
await chrome_devtools_1.chrome_devtools_1_take_screenshot({});

// Parallel instances (compare two sites)
await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://prod.example.com" });
await chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "https://staging.example.com" });
```

---

## 8. 🔧 TROUBLESHOOTING

### CLI: Command Not Found

**Problem**: `command not found: bdg`

**What it means**: bdg is not installed or not in PATH.

**Fix**:
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

**Problem**: `Error: Could not find Chrome`

**What it means**: Chrome/Chromium not in expected location.

**Fix**:
```bash
# macOS
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_PATH="/usr/bin/google-chrome"

# Verify Chrome exists
ls -la "$CHROME_PATH"

# Add to profile for persistence
echo 'export CHROME_PATH="/path/to/chrome"' >> ~/.zshrc
```

### CLI: Session Won't Start

**Problem**: `Error: No active session` or session stuck

**What it means**: Previous session may not have cleaned up properly.

**Fix**:
```bash
# Force stop any existing sessions
bdg stop 2>&1

# Check for zombie Chrome processes
ps aux | grep -i chrome | grep -i debug

# Kill zombie processes if found
pkill -f "chrome.*remote-debugging"

# Retry
bdg https://example.com 2>&1
```

### CLI: Sandbox Errors (Linux)

**Problem**: `Failed to move to new namespace`

**What it means**: Chrome sandbox permissions issue.

**Fix**:
```bash
# Option 1: Run Chrome with no-sandbox (less secure)
export CHROME_FLAGS="--no-sandbox"

# Option 2: Fix sandbox permissions
sudo sysctl -w kernel.unprivileged_userns_clone=1
```

### CLI: Windows Not Supported

**Problem**: bdg fails on Windows PowerShell or Git Bash

**What it means**: bdg requires Unix-like environment.

**Fix**:
```bash
# Install WSL
wsl --install

# Inside WSL, install bdg
npm install -g browser-debugger-cli@alpha
```

### MCP: Tool Not Found

**Problem**: Chrome DevTools tools not appearing in Code Mode

**What it means**: UTCP config not loaded or incorrect.

**Fix**:
1. Verify `.utcp_config.json` has chrome-devtools entry
2. Check `disabled: false` in config
3. Restart Claude Code session
4. Run `list_tools()` to verify

### MCP: Connection Failed

**Problem**: MCP server fails to start

**What it means**: Port conflict or server installation issue.

**Fix**:
```bash
# Test MCP server directly
npx chrome-devtools-mcp@latest --version

# Check for port conflicts
lsof -i :9222

# Kill conflicting processes
kill $(lsof -t -i :9222)
```

---

## 9. 📚 RESOURCES

### File Structure

```
workflows-chrome-devtools/
├── SKILL.md              # Main skill documentation
├── install_guide.md      # This file
├── references/
│   ├── cdp_patterns.md   # CDP domain patterns
│   ├── session_management.md  # Session lifecycle
│   └── troubleshooting.md     # Detailed error fixes
└── examples/
    ├── README.md         # Usage guide
    ├── performance-baseline.sh  # Performance testing
    ├── animation-testing.sh     # Animation validation
    └── multi-viewport-test.sh   # Responsive testing
```

### Configuration Paths

| Client  | Configuration         | Purpose                      |
| ------- | --------------------- | ---------------------------- |
| **CLI** | `CHROME_PATH` env var | Browser location             |
| **MCP** | `.mcp.json`           | Code Mode server             |
| **MCP** | `.utcp_config.json`   | Chrome DevTools registration |

### Verification Commands

```bash
# Check CLI version
bdg --version

# List CDP domains
bdg --list

# Test full cycle
bdg https://example.com 2>&1 && \
  bdg screenshot test.png 2>&1 && \
  bdg stop 2>&1 && \
  echo "SUCCESS"

# Check Chrome path
echo $CHROME_PATH
ls -la "$CHROME_PATH"
```

### Related Documentation

| Document        | Location                                                            | Purpose              |
| --------------- | ------------------------------------------------------------------- | -------------------- |
| SKILL.md        | `.opencode/skills/workflows-chrome-devtools/SKILL.md`               | Complete workflows   |
| CDP Patterns    | `.opencode/skills/workflows-chrome-devtools/references/cdp_patterns.md`    | Domain patterns      |
| Troubleshooting | `.opencode/skills/workflows-chrome-devtools/references/troubleshooting.md` | Detailed fixes       |
| Examples        | `.opencode/skills/workflows-chrome-devtools/examples/README.md`            | Production templates |

---

## ⚡ Quick Reference

### Tool Summary

| Tool | Purpose | Speed | Use When |
|------|---------|-------|----------|
| CLI `bdg` | Browser debugging | Fastest | Quick debugging, inspection |
| CLI `--list/--describe` | Discovery | <100ms | Finding CDP methods |
| MCP `navigate_page` | Navigation | ~2s | Multi-tool workflows |
| MCP `take_screenshot` | Screenshot | ~1s | Code Mode integration |
| MCP (parallel) | Compare sites | ~3s | Parallel browser testing |

### Essential Commands

```bash
# Installation
npm install -g browser-debugger-cli@alpha

# Discovery
bdg --list
bdg --describe Page
bdg --search screenshot

# Session management
bdg <url>
bdg status
bdg stop

# Common operations
bdg screenshot <path>
bdg console logs
bdg network cookies
bdg dom query "<selector>"
bdg js "<expression>"
```

### MCP Tools (Isolated Instances)

```typescript
// Tool naming: {instance}.{instance}_{tool_name}
chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })
chrome_devtools_1.chrome_devtools_1_take_screenshot({})
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })  // parallel
```

### Configuration Quick Copy

**CLI Environment:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

**MCP Config (.utcp_config.json) - Isolated Instances:**
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

---

**Installation Complete!**

You now have the Chrome DevTools CLI installed and configured. Use it for browser debugging, screenshot capture, console log analysis, and network monitoring.

Start using Chrome DevTools by asking your AI assistant:
```
Take a screenshot of https://example.com
```

---

## Next Steps

- **Test the CLI**: Run `bdg --version` to verify installation
- **Try a screenshot**: `bdg https://example.com 2>&1 && bdg screenshot test.png 2>&1 && bdg stop 2>&1`
- **Explore CDP methods**: `bdg --list` and `bdg --search <term>`
- **Read SKILL.md**: For complete workflows and patterns

**Need help?** See [Troubleshooting](#8--troubleshooting) or check `references/troubleshooting.md` for detailed error resolution.

---

**Version**: 2.1.0
**Protocol**: Chrome DevTools Protocol (CDP)
**Status**: Production Ready
