---
name: workflows-chrome-devtools
description: "Chrome DevTools orchestrator providing intelligent routing between CLI (bdg) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP fallback for multi-tool integration scenarios."
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.1.0
---

<!-- Keywords: chrome-devtools, cdp, browser-debugger-cli, bdg, browser-automation, terminal-debugging, screenshot-capture, network-monitoring, mcp-code-mode, orchestrator -->

# Chrome DevTools Orchestrator - CLI + MCP Integration

Browser debugging and automation through two complementary approaches: CLI (bdg) for speed and token efficiency, MCP for multi-tool integration.

---

<!-- ANCHOR:when-to-use -->
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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing-references -->
## 2. SMART ROUTING & REFERENCES

### Resource Router

```python
import os

SKILL_ROOT = ".opencode/skill/workflows-chrome-devtools"


def safe_load(relative_path):
    """Load markdown only from this skill directory."""
    candidate = os.path.normpath(os.path.join(SKILL_ROOT, relative_path))
    root = os.path.normpath(SKILL_ROOT)
    if not candidate.startswith(root + os.sep):
        raise ValueError(f"Out-of-scope resource path: {relative_path}")
    if not candidate.endswith(".md"):
        raise ValueError(f"Only markdown resources are allowed: {relative_path}")
    return load(candidate)


def discover_markdown_resources():
    """Recursively discover references/assets markdown resources."""
    discovered = []
    for subdir in ("references", "assets"):
        scan_root = os.path.join(SKILL_ROOT, subdir)
        for dirpath, _, filenames in os.walk(scan_root):
            for filename in filenames:
                if filename.endswith(".md"):
                    discovered.append(os.path.join(dirpath, filename))
    return sorted(discovered)


def route_chrome_devtools(context):
    """
    Resource Router for workflows-chrome-devtools skill
    Routes to CLI (priority) or MCP (fallback) based on availability
    """
    text = (getattr(context, "text", "") or "").lower()
    keywords = set(getattr(context, "keywords", []) or [])

    # Optional helper for diagnostics/debugging of available resources.
    if getattr(context, "list_available_resources", False):
        return discover_markdown_resources()

    # ══════════════════════════════════════════════════════════════════════
    # APPROACH SELECTION (weighted intent + capability signals)
    # ══════════════════════════════════════════════════════════════════════
    approach_scores = {"cli": 0.0, "mcp": 0.0, "install": 0.0}

    if getattr(context, "cli_available", False):
        approach_scores["cli"] += 5.0
    else:
        approach_scores["install"] += 3.0

    if getattr(context, "code_mode_configured", False):
        approach_scores["mcp"] += 4.0

    if getattr(context, "needs_multi_tool_integration", False) or getattr(context, "parallel_browser_sessions", False):
        approach_scores["mcp"] += 2.0

    for term in ("bdg", "browser-debugger-cli", "terminal", "cli"):
        if term in text or term in keywords:
            approach_scores["cli"] += 1.0
    for term in ("mcp", "code mode", "multi-tool", "parallel"):
        if term in text or term in keywords:
            approach_scores["mcp"] += 1.0
    for term in ("install", "setup", "not installed"):
        if term in text or term in keywords:
            approach_scores["install"] += 1.0

    approach_precedence = ["cli", "mcp", "install"]
    selected_approach = max(
        approach_precedence,
        key=lambda name: (approach_scores[name], -approach_precedence.index(name))
    )

    # ══════════════════════════════════════════════════════════════════════
    # REFERENCE ROUTING (now reachable; no early return before this block)
    # ══════════════════════════════════════════════════════════════════════
    reference_scores = {
        "cdp_patterns": 0.0,
        "session_management": 0.0,
        "troubleshooting": 0.0,
        "production_automation": 0.0,
    }

    if getattr(context, "needs_cdp_patterns", False) or getattr(context, "exploring_domains", False):
        reference_scores["cdp_patterns"] += 3.0
    if getattr(context, "session_complexity", False) or getattr(context, "multi_session", False):
        reference_scores["session_management"] += 3.0
    if getattr(context, "has_error", False) or getattr(context, "troubleshooting", False):
        reference_scores["troubleshooting"] += 4.0
    if getattr(context, "production_automation", False) or getattr(context, "ci_cd", False):
        reference_scores["production_automation"] += 3.0

    term_map = {
        "cdp_patterns": ("cdp", "domain", "pipe", "jq"),
        "session_management": ("session", "multi-session", "lifecycle"),
        "troubleshooting": ("error", "failed", "troubleshoot", "install issue"),
        "production_automation": ("ci", "pipeline", "automation", "production"),
    }
    for route_name, terms in term_map.items():
        for term in terms:
            if term in text or term in keywords:
                reference_scores[route_name] += 1.0

    reference_precedence = ["troubleshooting", "session_management", "cdp_patterns", "production_automation"]
    selected_reference = max(
        reference_precedence,
        key=lambda name: (reference_scores[name], -reference_precedence.index(name))
    )

    if selected_reference == "troubleshooting" and reference_scores["troubleshooting"] > 0:
        safe_load("references/troubleshooting.md")
    elif selected_reference == "session_management" and reference_scores["session_management"] > 0:
        safe_load("references/session_management.md")
    elif selected_reference == "cdp_patterns" and reference_scores["cdp_patterns"] > 0:
        safe_load("references/cdp_patterns.md")
    elif selected_reference == "production_automation" and reference_scores["production_automation"] > 0:
        safe_load("examples/README.md")

    if selected_approach == "cli":
        return "Use CLI approach (Section 3.1)"
    if selected_approach == "mcp":
        return "Use MCP approach (Section 3.2)"
    return "Install CLI: npm install -g browser-debugger-cli@alpha"

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available)
# ══════════════════════════════════════════════════════════════════════
# examples/performance-baseline.sh  → Performance testing workflow
# examples/animation-testing.sh     → Animation validation
# examples/multi-viewport-test.sh   → Responsive testing
```

### Routing Decision Tree

```
Browser debugging task received
        │
        ▼
┌─────────────────────────────────┐
│ Is bdg CLI available?           │
│ (command -v bdg)                │
└────────────┬────────────────────┘
             │
     ┌───────┴───────┐
    YES              NO
     │               │
     ▼               ▼
┌──────────────┐ ┌──────────────────┐
│ Use CLI      │ │ Is Code Mode     │
│ Section 3.1  │ │ configured?      │
└──────────────┘ └────────┬─────────┘
                          │
                  ┌───────┴───────┐
                 YES              NO
                  │               │
                  ▼               ▼
          ┌──────────────┐ ┌──────────────┐
          │ Use MCP      │ │ Install CLI: │
          │ Section 3.2  │ │ npm i -g     │
          └──────────────┘ │ browser-     │
                           │ debugger-cli │
                           │ @alpha       │
                           └──────────────┘
```

---

<!-- /ANCHOR:smart-routing-references -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Tool Comparison

| Feature        | CLI (bdg)                          | MCP (Code Mode)      | Puppeteer/Playwright |
| -------------- | ---------------------------------- | -------------------- | -------------------- |
| **Setup**      | `npm install -g browser-debugger-cli@alpha` | MCP config + server  | Heavy dependencies   |
| **Discovery**  | `--list`, `--describe`, `--search` | `search_tools()`     | API docs required    |
| **Token Cost** | Lowest (self-doc)                  | Medium (progressive) | Highest (verbose)    |
| **CDP Access** | 300+ methods across 53 domains     | MCP-exposed subset   | Full but complex     |
| **Best For**   | Debugging, inspection              | Multi-tool workflows | Complex UI testing   |

### CLI Approach (Priority) - browser-debugger-cli (bdg)

#### Installation & Verification

```bash
# Check if installed
command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"

# Installation
npm install -g browser-debugger-cli@alpha

# Verify
bdg --version 2>&1
```

**Platform support**: macOS (native), Linux (native), Windows (WSL only)

#### Self-Discovery Workflow

**Core differentiator**: bdg is self-documenting. ALWAYS use discovery commands.

```bash
# Step 1: List available domains
bdg cdp --list

# Step 2: Explore specific domain
bdg cdp --describe Page

# Step 3: Search for capability
bdg cdp --search screenshot

# Step 4: Get method details
bdg cdp --describe Page.captureScreenshot

# Step 5: Execute
bdg cdp Page.captureScreenshot 2>&1
```

#### Session Management

```bash
# Start session
bdg https://example.com 2>&1

# Verify active
bdg status 2>&1

# Execute operations
bdg dom screenshot output.png 2>&1
bdg console --list 2>&1

# Stop session (cleanup)
bdg stop 2>&1
```

**Cleanup pattern**:
```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
bdg https://example.com 2>&1
# ... operations ...
# Cleanup automatic on exit
```

#### Common CDP Patterns

**Screenshots**:
```bash
bdg dom screenshot output.png 2>&1
```

**Console logs**:
```bash
bdg console --list 2>&1 | jq '.[] | select(.level == "error")'
```

**DOM queries**:
```bash
bdg dom query ".my-class" 2>&1
bdg dom query "#element-id" 2>&1
```

**Cookies**:
```bash
bdg network getCookies 2>&1
bdg cdp Network.setCookie '{"name":"auth","value":"token","domain":"example.com"}' 2>&1
```

**JavaScript execution**:
```bash
bdg dom eval "document.title" 2>&1
```

**HAR export**:
```bash
bdg network har network-trace.har 2>&1
```

#### Unix Composability

```bash
# Pipe to jq
bdg console --list 2>&1 | jq '.[] | select(.level == "error")'

# Filter cookies
bdg network getCookies 2>&1 | jq '[.[] | {name, domain}]'

# Grep patterns
bdg console --list 2>&1 | grep -i "error"
```

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

**Configuration example** (`.utcp_config.json`):
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

#### Configuration Check

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

#### Invocation Pattern

Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**Single instance example:**
```typescript
await call_tool_chain({
  code: `
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    return screenshot;
  `,
  timeout: 30000
});
```

**Parallel instances example** (comparing two pages):
```typescript
await call_tool_chain({
  code: `
    // Instance 1: Production site
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });

    // Instance 2: Staging site (parallel)
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    // Capture both screenshots
    const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

    return { production: prod, staging: staging };
  `,
  timeout: 60000
});
```

#### Available MCP Tools

| Tool                    | Purpose            | CLI Equivalent                                     |
| ----------------------- | ------------------ | -------------------------------------------------- |
| `navigate_page`         | Navigate to URL    | `bdg <url>`                                        |
| `take_screenshot`       | Capture screenshot | `bdg dom screenshot`                               |
| `list_console_messages` | Get console logs   | `bdg console --list`                               |
| `resize_page`           | Set viewport size  | N/A (use cdp)                                      |
| `click`                 | Click on element   | `bdg cdp Input.dispatchMouseEvent`                 |
| `fill`                  | Fill form field    | `bdg dom eval "document.querySelector(...).value = ..."` |
| `hover`                 | Hover over element | `bdg cdp Input.dispatchMouseEvent`                 |
| `press_key`             | Press keyboard key | `bdg cdp Input.dispatchKeyEvent`                   |
| `wait_for`              | Wait for condition | N/A (scripting)                                    |
| `new_page`              | Open new page      | N/A                                                |
| `close_page`            | Close page         | `bdg stop`                                         |
| `select_page`           | Switch to page     | N/A                                                |

**Note**: Tool names use underscores (e.g., `take_screenshot`) not camelCase.

**Full invocation pattern**: `{manual_name}.{manual_name}_{tool_name}()`
- Example: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`

#### When to Prefer MCP

- Already using Code Mode for other tools (Webflow, Figma, etc.)
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

**Important**: Always close browser instances when done to prevent resource leaks.

```typescript
// Cleanup pattern for MCP sessions
await call_tool_chain({
  code: `
    try {
      // Your browser operations
      await chrome_devtools_1.chrome_devtools_1_navigate_page({
        url: "https://example.com"
      });
      const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
      return screenshot;
    } finally {
      // Always close the page when done
      await chrome_devtools_1.chrome_devtools_1_close_page({});
    }
  `,
  timeout: 30000
});

// For multi-instance cleanup
await call_tool_chain({
  code: `
    try {
      // Operations on multiple instances...
    } finally {
      // Close all instances
      await chrome_devtools_1.chrome_devtools_1_close_page({});
      await chrome_devtools_2.chrome_devtools_2_close_page({});
    }
  `,
  timeout: 30000
});
```

**Best Practice**: Wrap browser operations in try/finally to ensure cleanup even on errors.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS Rules

**ALWAYS do these without asking:**

1. **ALWAYS check CLI availability first**
   - Run `command -v bdg` before any operation
   - Prefer CLI over MCP when available

2. **ALWAYS verify bdg installation** before first use
   - `command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"`

3. **ALWAYS use discovery commands** when exploring
   - Start with `--list`, `--describe`, `--search`
   - Document how you found the method

4. **ALWAYS verify session status** before CDP commands
   - `bdg status 2>&1 | jq '.state'`

5. **ALWAYS capture stderr** with `2>&1`
   - Essential for error handling
   - All bdg commands should include this

6. **ALWAYS stop sessions** after operations
   - `bdg stop 2>&1` or use trap pattern

7. **ALWAYS use jq** for JSON processing
   - Avoid string manipulation on JSON output

### ❌ NEVER Rules

**NEVER do these:**

1. **NEVER execute CDP commands without verifying session**
   - Session must be `active` state first

2. **NEVER hardcode CDP method lists**
   - Use self-discovery instead
   - Methods change between versions

3. **NEVER skip error handling**
   - Always use `2>&1` pattern
   - Check exit codes in scripts

4. **NEVER leave sessions running**
   - Cleanup with `bdg stop` or trap
   - Browser processes consume resources

5. **NEVER assume method names**
   - Verify with `--describe` first
   - Method signatures vary

6. **NEVER use on Windows without WSL**
   - PowerShell/Git Bash not supported

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF bdg not installed on Windows**
   - WSL required for Windows support
   - Ask if they have WSL configured

2. **ESCALATE IF Chrome/Chromium not found**
   - May need `CHROME_PATH` environment variable
   - Ask user to specify browser location

3. **ESCALATE IF session fails after 3 retries**
   - May indicate deeper issue
   - Ask about browser permissions/sandbox

4. **ESCALATE IF task requires cross-browser testing**
   - bdg is Chrome-only
   - Suggest Puppeteer/Playwright for cross-browser

5. **ESCALATE IF complex UI testing needed**
   - May be better suited for Puppeteer/Playwright
   - Ask about test framework preferences

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Browser Debugging Completion Checklist

**Workflow complete when:**

- ✅ CLI vs MCP approach selected based on availability
- ✅ bdg installation verified (or MCP configured)
- ✅ Session started successfully (`active` state)
- ✅ CDP operations executed (exit code 0, valid JSON)
- ✅ Required data captured (screenshot, logs, cookies, etc.)
- ✅ Session stopped and cleaned up
- ✅ Output provided to user
- ✅ Error handling implemented (stderr captured)
- ✅ Method discovery documented

### Quality Targets

- **Session startup**: < 5 seconds
- **Screenshot capture**: < 2 seconds
- **Console log retrieval**: < 1 second
- **Error rate**: 0% (all errors handled gracefully)

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Related Skills

**mcp-code-mode**: Required for MCP fallback approach
- When CLI unavailable, Code Mode provides alternative
- Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**workflows-code**: Phase 3 browser testing integration
- Use bdg for verification during implementation
- Example integration pattern:
  ```bash
  npm run dev &
  sleep 5
  bdg http://localhost:3000 2>&1
  bdg dom screenshot verification.png 2>&1
  bdg console --list 2>&1 > console.json
  bdg stop 2>&1
  ```

### Tool Usage Guidelines

**Bash**: All bdg commands, session management, error handling
**Read**: Load reference files when detailed guidance needed
**Grep**: Filter command output, search logs
**Glob**: Find screenshot files, locate HAR exports

### External Tools

**browser-debugger-cli (bdg)**:
- Installation: `npm install -g browser-debugger-cli@alpha`
- Purpose: Primary CLI for browser debugging
- Fallback: Use MCP via Code Mode if unavailable

**Chrome/Chromium**:
- Installation: System package manager or direct download
- Purpose: Browser runtime for CDP connection
- Fallback: Set `CHROME_PATH` if not auto-detected

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:examples -->
## 7. EXAMPLES

### Example 1: Screenshot Capture (CLI)

```bash
# Verify installation
command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"

# Start session
bdg https://example.com 2>&1

# Capture screenshot
bdg dom screenshot example.png 2>&1

# Stop session
bdg stop 2>&1
```

### Example 2: Console Log Analysis (CLI)

```bash
bdg https://example.com 2>&1
bdg cdp Runtime.enable 2>&1
bdg console --list 2>&1 | jq '.[] | select(.level=="error")' > errors.json
bdg stop 2>&1
```

### Example 3: Screenshot via MCP (Single Instance)

```typescript
await call_tool_chain({
  code: `
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    return screenshot;
  `,
  timeout: 30000
});
```

### Example 4: Parallel Screenshots via MCP (Multi-Instance)

```typescript
await call_tool_chain({
  code: `
    // Navigate both instances in parallel
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://production.example.com"
    });
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    // Capture screenshots from both
    const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

    return { production: prod, staging: staging };
  `,
  timeout: 60000
});
```

---

<!-- /ANCHOR:examples -->
<!-- ANCHOR:quick-reference -->
## 8. QUICK REFERENCE

### Essential CLI Commands

```bash
# Discovery
bdg cdp --list                # List domains
bdg cdp --describe Page       # Domain methods
bdg cdp --search screenshot   # Find methods

# Session
bdg <url>                     # Start
bdg status                    # Check
bdg stop                      # Stop

# Helpers
bdg dom screenshot <path>     # Screenshot
bdg console --list            # Console
bdg network getCookies        # Cookies
bdg dom query "<sel>"         # DOM query
bdg dom eval "<expr>"         # Execute JS
bdg network har <path>        # HAR export
```

### MCP Tools (Isolated Instances)

```typescript
// Tool naming: {instance}.{instance}_{tool_name}
// Each instance runs isolated browser (--isolated=true)

// Instance 1
chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })
chrome_devtools_1.chrome_devtools_1_take_screenshot({})
chrome_devtools_1.chrome_devtools_1_list_console_messages({})

// Instance 2 (parallel testing)
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })
chrome_devtools_2.chrome_devtools_2_take_screenshot({})
```

### Error Handling Pattern

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
```

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### references/

- **cdp_patterns.md** (~2k words): CDP domain patterns, Unix composability, advanced workflows
- **session_management.md** (~1k words): Session lifecycle, multi-session, error recovery
- **troubleshooting.md** (~1.5k words): Installation issues, browser errors, platform fixes

### examples/

- **README.md**: Comprehensive usage guide, CI/CD patterns
- **performance-baseline.sh**: Performance testing workflow
- **animation-testing.sh**: Animation validation with thresholds
- **multi-viewport-test.sh**: Responsive testing across 5 viewports
<!-- /ANCHOR:related-resources -->
