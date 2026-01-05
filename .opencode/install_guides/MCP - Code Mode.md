# MCP Code Mode Installation Guide

Complete installation and configuration guide for the Code Mode MCP server, enabling TypeScript-based orchestration of external MCP tools. Provides unified access to Webflow, Figma, ClickUp, GitHub, Chrome DevTools, Narsil, and other MCP servers through a single `call_tool_chain()` interface. Delivers 98.7% context reduction and 60% faster execution compared to individual tool calls, with type-safe invocation and automatic tool discovery.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `@utcp/code-mode-mcp` | **Dependencies**: Node.js 18+, .utcp_config.json

---

#### TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-%EF%B8%8F-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [⏱️ TIMEOUT CALCULATION](#7-️-timeout-calculation)
8. [🎯 FEATURES](#8--features)
9. [💡 EXAMPLES](#9--examples)
10. [🔧 TROUBLESHOOTING](#10--troubleshooting)
11. [📚 RESOURCES](#11--resources)

---

## 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the MCP Code Mode server for TypeScript tool orchestration

Please help me:
1. Check if I have Node.js 18+ installed
2. Verify I have npx available for running MCP servers
3. Create the required configuration files (.utcp_config.json and .env)
4. Configure Code Mode for my AI environment (I'm using: [Claude Code / OpenCode / VS Code Copilot])
5. Add my first MCP server (e.g., Webflow, ClickUp, Figma, GitHub)
6. Verify the installation is working with a test search
7. Test a basic tool call using the correct naming pattern

My preferred MCP servers are: [Webflow / ClickUp / Figma / GitHub / Chrome DevTools / other]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Create `.utcp_config.json` configuration file
- Create `.env` file for API keys and secrets (with proper security)
- Configure Code Mode for your specific AI platform
- Add MCP server definitions for your preferred tools
- Test the four available tools: `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`
- Show you the **critical naming convention**: `{manual}.{manual_name}_{tool_name}`
- Demonstrate progressive tool discovery

**Expected setup time:** 10-15 minutes

---

## 1. 📖 OVERVIEW

Code Mode MCP is a TypeScript execution environment that provides unified access to **159 MCP tools across 6 manuals** through progressive disclosure. Instead of exposing all tools to your AI context (causing token exhaustion), Code Mode provides a single execution environment where tools are accessed programmatically and loaded on-demand.

### Source Repository

| Property             | Value                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **GitHub**           | [universal-tool-calling-protocol/code-mode](https://github.com/universal-tool-calling-protocol/code-mode) |
| **npm (MCP Server)** | `@utcp/code-mode-mcp`                                                                                     |
| **npm (Library)**    | `@utcp/code-mode`                                                                                         |
| **Stars**            | 1.2k+                                                                                                     |
| **License**          | MPL-2.0                                                                                                   |

> **Note**: This is the official UTCP (Universal Tool Calling Protocol) implementation, not to be confused with other "code mode" projects like `replicate/replicate-mcp-code-mode` (Replicate-specific) or `jx-codes/codemode-mcp` (abandoned).

### Current Configuration

| Manual                | Tools   | Package                                 |
| --------------------- | ------- | --------------------------------------- |
| **github**            | 26      | `@modelcontextprotocol/server-github`   |
| **figma**             | 18      | `figma-developer-mcp`                   |
| **chrome_devtools_1** | 26      | `chrome-devtools-mcp@latest`            |
| **chrome_devtools_2** | 26      | `chrome-devtools-mcp@latest` (parallel) |
| **clickup**           | 21      | `@taazkareem/clickup-mcp-server`        |
| **webflow**           | 42      | `mcp-remote` (SSE)                      |
| **Total**             | **159** | **6 manuals**                           |

### Key Features

- **67-88% Faster Execution**: Benchmarked performance improvement vs traditional tool calling
- **98.7% Context Reduction**: Access 159+ tools with only ~1.6k tokens (vs ~141k traditional)
- **Single Code Block**: Replaces multiple API calls with one TypeScript execution
- **Progressive Discovery**: Tools loaded on-demand via `searchTools()`, zero upfront cost
- **TypeScript Execution**: Full TypeScript/JavaScript support with async/await
- **State Persistence**: Data flows naturally between operations
- **Multi-Tool Orchestration**: Execute complex workflows in single call
- **Type Safety**: Full TypeScript interfaces with autocomplete
- **Sandboxed Execution**: Secure V8 isolate with timeout protection
- **Multi-Protocol Support**: MCP, HTTP, File, and CLI protocols supported

### The "2-3 MCP Server Wall" Problem

**Traditional Approach:**
```
Tools:     10      20      30      47      100     200
Tokens:    30k     60k     90k    141k    300k    600k
Usable?    ✓       ✓       ✗       ✗       ✗       ✗
```

**Code Mode Solution:**
```
Tools:     10      20      30      47      100     200+
Tokens:    1.6k    1.6k    1.6k    1.6k    1.6k    1.6k
Usable?    ✓       ✓       ✓       ✓       ✓       ✓
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  AI Agent (Claude Code, OpenCode, VS Code Copilot)          │
│                                                             │
│  Sees: Only 4 tools in context (~1.6k tokens)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • call_tool_chain   (Execute TypeScript)              │  │
│  │ • search_tools      (Progressive discovery)           │  │
│  │ • list_tools        (List all available)              │  │
│  │ • tool_info         (Get tool interface)              │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ TypeScript Code
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Code Mode MCP Server (V8 Isolate Sandbox)                  │
│  • Executes TypeScript with tool access                     │
│  • Routes calls to appropriate MCP servers                  │
│  • Returns results + logs                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ Tool Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  MCP Servers: Webflow, ClickUp, Figma, GitHub, Chrome, etc.  │
│  (159 tools accessible via Code Mode)                       │
└─────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature          | Traditional MCP             | Code Mode MCP           |
| ---------------- | --------------------------- | ----------------------- |
| **Context Cost** | ~3k tokens per tool         | ~1.6k total (all tools) |
| **Max Tools**    | 2-3 servers (context limit) | Unlimited servers       |
| **Discovery**    | All tools upfront           | Progressive (on-demand) |
| **Multi-Tool**   | Multiple API calls          | Single execution        |
| **State**        | Manual context management   | Automatic persistence   |
| **Execution**    | ~500ms per tool             | ~300ms for 4 tools      |

---

## 2. 📋 PREREQUISITES

Before installing Code Mode MCP, ensure you have:

### Required

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x or higher
  ```

- **npm/npx** (comes with Node.js)
  ```bash
  npm --version
  npx --version
  ```

- **MCP-Compatible Client** (one of the following):
  - Claude Code CLI
  - OpenCode CLI
  - VS Code with GitHub Copilot
  - Windsurf

### Optional but Recommended

- **API Keys** for MCP servers you want to use:
  - ClickUp: API key + Team ID (Settings → Apps)
  - Figma: Personal Access Token (Settings → Access Tokens)
  - GitHub: Personal Access Token (Settings → Developer settings)
  - Webflow: OAuth (configured in Webflow dashboard)

- **Git** for version control

### Validation: `prerequisites_complete`

**Checklist:**
- [ ] Node.js 18+ installed
- [ ] .env file exists with API keys
- [ ] .utcp_config.json exists

**Quick Verification:**
```bash
node --version && [ -f .env ] && [ -f .utcp_config.json ] && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

---

## 3. 📥 INSTALLATION

### Step 1: Choose Installation Location

Decide where to place your Code Mode configuration:

```bash
# Option A: Project-specific (recommended for isolated projects)
cd /path/to/your/project

# Option B: Global location (for shared configuration)
cd ~/CloudStorage/MCP\ Servers
```

### Step 2: Create Configuration Directory Structure

```bash
# Create directory structure (optional - for local config files)
mkdir -p .opencode/mcp-code-mode
```

### Step 3: Create .utcp_config.json

Create the main configuration file in your project root:

```bash
cat > .utcp_config.json << 'EOF'
{
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": []
}
EOF
```

### Step 4: Create .env File

Create environment file for secrets:

```bash
cat > .env << 'EOF'
# =============================================================================
# API Keys - Standard Variables
# =============================================================================

# ClickUp Configuration
# CLICKUP_API_KEY=pk_your_api_key_here
# CLICKUP_TEAM_ID=your_team_id_here

# Figma Configuration
# FIGMA_API_KEY=figd_your_token_here

# GitHub Configuration
# GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Voyage AI (for Narsil neural search)
# VOYAGE_API_KEY=pa-your_voyage_key_here

# =============================================================================
# Code Mode Prefixed Variables (REQUIRED for Code Mode)
# =============================================================================
# Code Mode requires variables prefixed with the manual name.
# Copy your API keys to these prefixed versions.

# clickup_CLICKUP_API_KEY=pk_your_api_key_here
# clickup_CLICKUP_TEAM_ID=your_team_id_here
# figma_FIGMA_API_KEY=figd_your_token_here
# github_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
# narsil_VOYAGE_API_KEY=pa-your_voyage_key_here
EOF
```

**Important:** Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### Step 5: Verify Files Created

```bash
ls -la .utcp_config.json .env

# Expected output:
# -rw-r--r--  .utcp_config.json
# -rw-r--r--  .env
```

### Validation: `installation_complete`

**Checklist:**
- [ ] code_mode entry in opencode.json
- [ ] UTCP_CONFIG_FILE env var set
- [ ] code-mode-mcp accessible

**Quick Verification:**
```bash
grep -q '"code_mode"' opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

---

## 4. ⚙️ CONFIGURATION

### Option A: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["@utcp/code-mode-mcp"],
      "env": {
        "UTCP_CONFIG_FILE": "/path/to/your/.utcp_config.json"
      }
    }
  }
}
```

### Option B: Configure for OpenCode

Add to `opencode.json` in your project root:

**Option B1: NPM Package (Recommended for most users)**
```json
{
  "mcp": {
    "code_mode": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@utcp/code-mode-mcp"
      ],
      "environment": {
        "UTCP_CONFIG_FILE": ".utcp_config.json"
      }
    }
  }
}
```

**Option B2: Embedded Source (For bundled projects)**

If the Code Mode source is embedded in your project at `.opencode/skill/mcp-code-mode/mcp_server/`:

```json
{
  "mcp": {
    "code_mode": {
      "type": "local",
      "command": [
        "node",
        ".opencode/skill/mcp-code-mode/mcp_server/dist/index.js"
      ],
      "environment": {
        "UTCP_CONFIG_FILE": ".utcp_config.json"
      }
    }
  }
}
```

> **Note:** The embedded approach requires running `npm install` in the `mcp_server/` directory first. This is useful for projects that want to bundle the MCP server source for version control and portability.

### Option C: Configure for VS Code Copilot

Add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["@utcp/code-mode-mcp"],
      "env": {
        "UTCP_CONFIG_FILE": "/path/to/your/.utcp_config.json"
      }
    }
  }
}
```

### Package Name Note

> **Note**: The package `@utcp/code-mode-mcp` is the official UTCP Code Mode MCP server. Some older documentation may reference `utcp-mcp` - both should work, but `@utcp/code-mode-mcp` is the current recommended package.
```

---

### SECURITY WARNING

> **CRITICAL**: Never hardcode API keys directly in `.utcp_config.json`. Always use environment variable references.

**WRONG (Security Risk):**
```json
{
  "env": {
    "CLICKUP_API_KEY": "pk_224591351_ACTUAL_KEY_HERE"
  }
}
```

**CORRECT (Secure):**
```json
{
  "env": {
    "CLICKUP_API_KEY": "${CLICKUP_API_KEY}"
  }
}
```

Then define the actual value in `.env`:
```bash
CLICKUP_API_KEY=pk_224591351_your_actual_key
```

**Security Checklist:**
```
□ .env file is in .gitignore
□ No hardcoded API keys in .utcp_config.json
□ All secrets use ${VARIABLE_NAME} syntax
□ .env file permissions are restricted (chmod 600 .env)
```

---

### ⚠️ CRITICAL: Prefixed Environment Variables

> **Code Mode requires PREFIXED environment variables.** This is the #1 cause of "Variable not found" errors.

When Code Mode loads a manual configuration, it looks for environment variables with the **manual name as a prefix**. For example:

| Manual Name | Config Variable | Required .env Variable |
|-------------|-----------------|------------------------|
| `narsil` | `${VOYAGE_API_KEY}` | `narsil_VOYAGE_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `github` | `${GITHUB_PERSONAL_ACCESS_TOKEN}` | `github_GITHUB_PERSONAL_ACCESS_TOKEN` |
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `clickup` | `${CLICKUP_TEAM_ID}` | `clickup_CLICKUP_TEAM_ID` |

**Error you'll see without prefixed variables:**
```
Error during batch registration for manual 'narsil': Variable 'narsil_VOYAGE_API_KEY' 
referenced in call template configuration not found.
```

**Solution:** Add BOTH unprefixed AND prefixed versions to your `.env`:

```bash
# Standard variables (for other tools)
VOYAGE_API_KEY=pa-your-voyage-key
FIGMA_API_KEY=figd_your-figma-key
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your-github-token
CLICKUP_API_KEY=pk_your-clickup-key
CLICKUP_TEAM_ID=your-team-id

# Code Mode prefixed versions (REQUIRED for Code Mode)
narsil_VOYAGE_API_KEY=pa-your-voyage-key
figma_FIGMA_API_KEY=figd_your-figma-key
github_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your-github-token
clickup_CLICKUP_API_KEY=pk_your-clickup-key
clickup_CLICKUP_TEAM_ID=your-team-id
```

**Why both?** The unprefixed versions are used by other tools and scripts. The prefixed versions are specifically for Code Mode's variable substitution system.

---

### Adding MCP Servers

Add servers to `.utcp_config.json` in the `manual_call_templates` array:

#### GitHub

```json
{
  "name": "github",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "github": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  }
}
```

#### Webflow (Remote SSE)

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.webflow.com/sse"],
        "env": {}
      }
    }
  }
}
```

#### ClickUp (Local with Auth)

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

#### Figma

```json
{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "figma-developer-mcp", "--stdio"],
        "env": {
          "FIGMA_API_KEY": "${FIGMA_API_KEY}"
        }
      }
    }
  }
}
```

#### Chrome DevTools (Multiple Instances)

```json
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
}
```

### Complete .utcp_config.json Example

```json
{
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": [
    {
      "name": "github",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "github": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
              "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
            }
          }
        }
      }
    },
    {
      "name": "webflow",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "webflow": {
            "transport": "stdio",
            "command": "npx",
            "args": ["mcp-remote", "https://mcp.webflow.com/sse"],
            "env": {}
          }
        }
      }
    },
    {
      "name": "clickup",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "clickup": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@taazkareem/clickup-mcp-server"],
            "env": {
              "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
              "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
            }
          }
        }
      }
    },
    {
      "name": "figma",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "figma": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "figma-developer-mcp", "--stdio"],
            "env": {
              "FIGMA_API_KEY": "${FIGMA_API_KEY}"
            }
          }
        }
      }
    }
  ]
}
```

---

## 5. ✅ VERIFICATION

### Check 1: Verify Configuration Files

```bash
# Check .utcp_config.json is valid JSON
python3 -m json.tool < .utcp_config.json

# Check environment variables are defined
cat .env | grep -v "^#" | grep -v "^$"
```

### Check 2: Verify in Your AI Client

**In Claude Code:**
```bash
# Start Claude Code session
claude

# Ask about available tools
> What MCP tools are available?

# Expected: code-mode tools should appear (call_tool_chain, search_tools, etc.)
```

**In OpenCode:**
```bash
opencode

> List available MCP tools

# Expected: Code Mode tools should appear
```

### Check 3: Test Tool Discovery

```
# In your AI chat:
Use search_tools to find tools related to "webflow sites"
```

Expected response should show available Webflow tools.

### Check 4: Test a Basic Call

```typescript
// In your AI chat:
Use call_tool_chain to list all available tools:

call_tool_chain({
  code: `
    const allTools = await list_tools();
    console.log('Total tools:', allTools.tools.length);
    console.log('Sample tools:', allTools.tools.slice(0, 10));
    return allTools;
  `
});
```

### Validation: `verification_complete`

**Checklist:**
- [ ] list_tools() returns tools
- [ ] Tool naming pattern understood
- [ ] At least one manual accessible

**Quick Verification:**
```bash
# Test in OpenCode: call list_tools() and verify output
echo "Run: list_tools() in OpenCode to verify"
```

❌ **STOP if validation fails** - Fix before continuing.

---

## 6. 🚀 USAGE

### CRITICAL: Naming Pattern

> **THE #1 MOST COMMON ERROR** is using the wrong function names. This is the source of most "Tool not found" errors.

**Pattern:**
```
{manual}.{manual_name}_{tool_name}
```

All tool calls MUST follow this exact pattern with a **dot** after the manual name and an **underscore** before the tool name.

**Examples:**

| Manual              | Pattern                                      | Example Call                                               |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `webflow`           | `webflow.webflow_{tool}`                     | `webflow.webflow_sites_list({})`                           |
| `github`            | `github.github_{tool}`                       | `github.github_get_issue({...})`                           |
| `clickup`           | `clickup.clickup_{tool}`                     | `clickup.clickup_create_task({...})`                       |
| `figma`             | `figma.figma_{tool}`                         | `figma.figma_get_file({...})`                              |
| `chrome_devtools_1` | `chrome_devtools_1.chrome_devtools_1_{tool}` | `chrome_devtools_1.chrome_devtools_1_navigate_page({...})` |

### Common Mistakes

| Error                         | Wrong                          | Correct                        |
| ----------------------------- | ------------------------------ | ------------------------------ |
| **Missing second part**       | `webflow.sites_list()`         | `webflow.webflow_sites_list()` |
| **Dot instead of underscore** | `webflow.webflow.sites_list()` | `webflow.webflow_sites_list()` |
| **camelCase**                 | `webflow.webflow_sitesList()`  | `webflow.webflow_sites_list()` |
| **Wrong manual name**         | `wf.webflow_sites_list()`      | `webflow.webflow_sites_list()` |

### Why This Pattern?

The naming follows the `.utcp_config.json` structure:
```json
{
  "name": "webflow",           // ← First part (manual name)
  "config": {
    "mcpServers": {
      "webflow": { ... }       // ← Second part (server name, joined with underscore to tool)
    }
  }
}
// Tool name comes from the MCP server → Combined with underscore
// Result: webflow.webflow_sites_list
```

### Basic Workflow

**Step 1: Discover Tools**

```typescript
// Search for relevant tools
search_tools({
  task_description: "webflow site management",
  limit: 10
});

// Returns: Tool names and descriptions (minimal tokens)
```

**Step 2: Get Tool Details (Optional)**

```typescript
// Get full interface for specific tool
tool_info({
  tool_name: "webflow.webflow_sites_list"
});

// Returns: Full TypeScript interface definition
```

**Step 3: Execute Tool**

```typescript
// Execute TypeScript with direct tool access
call_tool_chain({
  code: `
    const sites = await webflow.webflow_sites_list({});
    console.log('Found sites:', sites.sites.length);
    return sites;
  `
});
```

### Multi-Tool Orchestration

```typescript
// State persists across all operations in single execution
call_tool_chain({
  code: `
    // Step 1: Get Figma design
    const design = await figma.figma.get_file({ fileId: "abc123" });

    // Step 2: Create ClickUp task (design data available)
    const task = await clickup.clickup.create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Development Sprint",
      description: \`Design has \${design.document.children.length} components\`
    });

    // Step 3: Create GitHub issue (both design and task data available)
    const issue = await github.github.create_issue({
      owner: "myorg",
      repo: "myrepo",
      title: \`Design: \${design.name}\`,
      body: \`ClickUp task: \${task.url}\`
    });

    return { design, task, issue };
  `,
  timeout: 60000  // Extended timeout for complex workflow
});
```

---

## 7. ⏱️ TIMEOUT CALCULATION

### Formula

```
timeout = base_overhead + (num_tools × tool_avg) + safety_margin
```

### Default Values

| Component       | Value    | Description                     |
| --------------- | -------- | ------------------------------- |
| `base_overhead` | 5,000ms  | Initial connection and setup    |
| `tool_avg`      | 3,000ms  | Average per-tool execution time |
| `safety_margin` | 10,000ms | Buffer for network variability  |

### Calculation Examples

| Tools         | Calculation                | Result   | Recommended   |
| ------------- | -------------------------- | -------- | ------------- |
| **1 tool**    | 5000 + (1 × 3000) + 10000  | 18,000ms | **30,000ms**  |
| **2 tools**   | 5000 + (2 × 3000) + 10000  | 21,000ms | **30,000ms**  |
| **4 tools**   | 5000 + (4 × 3000) + 10000  | 27,000ms | **60,000ms**  |
| **6 tools**   | 5000 + (6 × 3000) + 10000  | 33,000ms | **60,000ms**  |
| **10 tools**  | 5000 + (10 × 3000) + 10000 | 45,000ms | **120,000ms** |
| **15+ tools** | 5000 + (15 × 3000) + 10000 | 60,000ms | **120,000ms** |

### Quick Reference

| Complexity             | Timeout  | Use Case                    |
| ---------------------- | -------- | --------------------------- |
| **Simple** (1-2 tools) | `30000`  | List sites, get single item |
| **Medium** (3-5 tools) | `60000`  | Create task + update CMS    |
| **Complex** (6+ tools) | `120000` | Full design-to-dev pipeline |

### Usage

```typescript
call_tool_chain({
  code: `
    // Complex multi-tool workflow
    const sites = await webflow.webflow_sites_list({});
    const collections = await webflow.webflow_collections_list({ site_id: sites.sites[0].id });
    const task = await clickup.clickup_create_task({ name: "Review collections" });
    return { sites, collections, task };
  `,
  timeout: 60000  // 3 tools → use 60000ms
});
```

---

## 8. 🎯 FEATURES

### 8.1 call_tool_chain

**Purpose**: Execute TypeScript code with direct access to all configured MCP tools.

**Parameters**:
- `code` (string, required) - TypeScript code to execute
- `timeout` (number, optional) - Timeout in milliseconds (default: 30000)
- `max_output_size` (number, optional) - Max output characters (default: 200000)

**Example**:
```typescript
call_tool_chain({
  code: `
    const sites = await webflow.webflow_sites_list({});
    return sites;
  `,
  timeout: 60000
});
```

**Returns**: `{ result: any, logs: string[] }`

### 8.2 search_tools

**Purpose**: Progressive discovery - search for tools by task description.

**Parameters**:
- `task_description` (string, required) - Natural language description of task
- `limit` (number, optional) - Maximum results to return (default: 10)

**Example**:
```typescript
search_tools({
  task_description: "create tasks in ClickUp",
  limit: 5
});
```

**Returns**: Array of tool names with descriptions (minimal tokens)

### 8.3 list_tools

**Purpose**: List all available tools from all configured MCP servers.

**Parameters**: None

**Example**:
```typescript
list_tools();
```

**Returns**: `{ tools: string[] }` - All available tool names

### 8.4 tool_info

**Purpose**: Get complete TypeScript interface for a specific tool.

**Parameters**:
- `tool_name` (string, required) - Full tool name (e.g., "webflow.webflow_sites_list")

**Example**:
```typescript
tool_info({
  tool_name: "clickup.clickup.create_task"
});
```

**Returns**: Full TypeScript interface definition with parameter types

---

## 9. 💡 EXAMPLES

### Example 1: Webflow Site Management

**Scenario**: List all sites and their collections

```typescript
call_tool_chain({
  code: `
    // Get all sites
    const sitesResult = await webflow.webflow_sites_list({});
    const sites = sitesResult.sites;

    console.log(\`Found \${sites.length} sites\`);

    // Get collections for first site
    if (sites.length > 0) {
      const collections = await webflow.webflow_collections_list({
        site_id: sites[0].id
      });

      console.log(\`Site "\${sites[0].displayName}" has \${collections.collections.length} collections\`);
    }

    return { sites, collections };
  `,
  timeout: 30000
});
```

### Example 2: GitHub Issue Creation

**Scenario**: Create an issue with labels

```typescript
call_tool_chain({
  code: `
    // Create GitHub issue
    const issue = await github.github.create_issue({
      owner: "myorg",
      repo: "myrepo",
      title: "Implement User Authentication",
      body: "## Description\\n\\nImplement OAuth2 login flow",
      labels: ["feature", "auth"]
    });

    console.log(\`Created issue: #\${issue.number}\`);
    console.log(\`URL: \${issue.html_url}\`);

    return issue;
  `,
  timeout: 30000
});
```

### Example 3: ClickUp Task Creation

**Scenario**: Create a task with tags

```typescript
call_tool_chain({
  code: `
    // Create main task
    const task = await clickup.clickup.create_task({
      name: "Implement User Authentication",
      listName: "Development Sprint",
      description: "Implement OAuth2 login flow",
      tags: ["feature", "auth"],
      priority: 2
    });

    console.log(\`Created task: \${task.name} (ID: \${task.id})\`);
    console.log(\`URL: \${task.url}\`);

    return task;
  `,
  timeout: 30000
});
```

### Example 4: Multi-Tool Workflow

**Scenario**: Figma → GitHub → Webflow pipeline

```typescript
call_tool_chain({
  code: `
    try {
      // Step 1: Get Figma design
      console.log('Fetching Figma design...');
      const design = await figma.figma.get_file({
        fileId: "YOUR_FIGMA_FILE_ID"
      });
      console.log(\`Design: \${design.name}\`);

      // Step 2: Create GitHub issue
      console.log('Creating GitHub issue...');
      const issue = await github.github.create_issue({
        owner: "myorg",
        repo: "myrepo",
        title: \`Implement: \${design.name}\`,
        body: \`Components: \${design.document.children.length}\`
      });
      console.log(\`Issue created: \${issue.html_url}\`);

      // Step 3: Add to Webflow CMS queue
      console.log('Adding to Webflow CMS...');
      const cmsItem = await webflow.webflow_collections_items_create_item_live({
        collection_id: "YOUR_COLLECTION_ID",
        request: {
          items: [{
            fieldData: {
              name: design.name,
              "github-url": issue.html_url,
              status: "Queued",
              "created-at": new Date().toISOString()
            }
          }]
        }
      });

      console.log('Pipeline complete!');
      return {
        success: true,
        design: design.name,
        issueUrl: issue.html_url,
        cmsItemId: cmsItem.id
      };

    } catch (error) {
      console.error('Pipeline failed:', error.message);
      return { success: false, error: error.message };
    }
  `,
  timeout: 120000
});
```

### Example 5: Chrome DevTools Automation

**Scenario**: Take screenshot and check console errors

```typescript
call_tool_chain({
  code: `
    // Create new browser page
    const page = await chrome_devtools_1.chrome_devtools_1.new_page({});
    console.log(\`Page created: \${page.pageId}\`);

    // Navigate to URL
    await chrome_devtools_1.chrome_devtools_1.navigate_page({
      pageId: page.pageId,
      url: "https://example.com"
    });
    console.log('Navigation complete');

    // Wait for page load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take screenshot
    const screenshot = await chrome_devtools_1.chrome_devtools_1.take_screenshot({
      pageId: page.pageId
    });
    console.log('Screenshot captured');

    // Get console messages
    const consoleMessages = await chrome_devtools_1.chrome_devtools_1.get_console_message({
      pageId: page.pageId
    });

    // Close page
    await chrome_devtools_1.chrome_devtools_1.close_page({ pageId: page.pageId });

    return {
      screenshot: screenshot,
      consoleErrors: consoleMessages.filter(m => m.level === 'error')
    };
  `,
  timeout: 60000
});
```

### Example 6: Error Handling Pattern

**Scenario**: Robust workflow with fallbacks

```typescript
call_tool_chain({
  code: `
    const results = {
      successes: [],
      failures: []
    };

    // Helper for safe execution
    async function tryExecute(name, fn) {
      try {
        const result = await fn();
        results.successes.push({ name, result });
        return result;
      } catch (error) {
        results.failures.push({ name, error: error.message });
        console.error(\`\${name} failed: \${error.message}\`);
        return null;
      }
    }

    // Execute operations with fallbacks
    const sites = await tryExecute('list-sites',
      () => webflow.webflow_sites_list({})
    );

    if (sites) {
      await tryExecute('get-collections',
        () => webflow.webflow_collections_list({ site_id: sites.sites[0].id })
      );
    }

    console.log(\`Complete: \${results.successes.length} succeeded, \${results.failures.length} failed\`);
    return results;
  `,
  timeout: 60000
});
```

---

## 10. 🔧 TROUBLESHOOTING

### Error Message Quick Reference

| Error Message                                | Cause                        | Solution                                  |
| -------------------------------------------- | ---------------------------- | ----------------------------------------- |
| `Tool not found: webflow.sites_list`         | Missing second manual part   | Use `webflow.webflow_sites_list`          |
| `Tool not found: webflow.webflow.sites_list` | Dot instead of underscore    | Use `webflow.webflow_sites_list`          |
| `Execution timeout exceeded`                 | Complex operation            | Increase `timeout` parameter              |
| `UTCP_CONFIG_FILE not set`                   | Missing environment variable | Set path to `.utcp_config.json`           |
| `Environment variable X not found`           | Missing in .env              | Add variable to `.env` file               |
| `Variable 'manual_VAR' not found`            | Missing prefixed variable    | Add `{manual}_{VAR}` to `.env` (see below)|
| `TypeError: X is not a function`             | Wrong naming pattern         | Check exact tool name with `search_tools` |
| `Failed to start MCP server`                 | Package or auth issue        | Test command manually in terminal         |
| `Invalid JSON`                               | Config syntax error          | Validate with `python3 -m json.tool`      |

### Prefixed Variable Not Found

**Problem**: `Error during batch registration for manual 'X': Variable 'X_VAR' not found`

**Cause**: Code Mode requires environment variables prefixed with the manual name.

**Solution**:
1. Identify the manual name from the error (e.g., `narsil`, `figma`, `clickup`)
2. Add the prefixed variable to `.env`:
   ```bash
   # For error: Variable 'narsil_VOYAGE_API_KEY' not found
   narsil_VOYAGE_API_KEY=pa-your-voyage-key
   
   # For error: Variable 'figma_FIGMA_API_KEY' not found
   figma_FIGMA_API_KEY=figd_your-figma-key
   ```
3. Restart OpenCode/Code Mode after updating `.env`

See the [Prefixed Environment Variables](#️-critical-prefixed-environment-variables) section for the complete list.

### Tool Not Found Error

**Problem**: `Error: Tool not found: webflow.sites_list`

**Cause**: Missing the second manual/server part in the tool name

**Solution**:
1. Use correct naming pattern: `{manual}.{manual_name}_{tool_name}`
   ```typescript
   // WRONG - Missing second part
   await webflow.sites_list({});

   // WRONG - Dot instead of underscore
   await webflow.webflow.sites_list({});

   // CORRECT
   await webflow.webflow_sites_list({});
   ```

2. Use tool discovery to find exact names:
   ```typescript
   const tools = await search_tools({
     task_description: "webflow sites",
     limit: 10
   });
   console.log(tools.map(t => t.name));
   ```

### Environment Variables Not Loading

**Problem**: `Error: Environment variable CLICKUP_API_KEY not found`

**Solutions**:
1. Check `.env` file exists in same directory as `.utcp_config.json`

2. Verify variable is defined (not commented out):
   ```bash
   cat .env | grep CLICKUP_API_KEY
   # Should show: CLICKUP_API_KEY=pk_...
   ```

3. Check `load_variables_from` config is correct:
   ```json
   "load_variables_from": [
     {
       "variable_loader_type": "dotenv",
       "env_file_path": ".env"
     }
   ]
   ```

4. Restart your AI client after changing `.env`

### MCP Server Fails to Start

**Problem**: `Error: Failed to start MCP server: webflow`

**Solutions**:
1. Test command manually:
   ```bash
   npx mcp-remote https://mcp.webflow.com/sse
   ```

2. Check npm/npx is in PATH:
   ```bash
   which npx
   ```

3. Install package directly if cached version fails:
   ```bash
   npm install -g @taazkareem/clickup-mcp-server
   ```

4. Check for missing dependencies or auth issues

### Tools Not Appearing

**Problem**: `search_tools` returns empty results

**Solutions**:
1. Verify MCP servers are configured in `.utcp_config.json`

2. Check manual names don't have invalid characters:
   ```json
   // Good
   "name": "webflow"
   "name": "chrome_devtools_1"

   // Bad (hyphens not allowed)
   "name": "webflow-api"
   "name": "my server"
   ```

3. Restart AI client after configuration changes

4. Check for JSON syntax errors:
   ```bash
   python3 -m json.tool < .utcp_config.json
   ```

### Timeout Errors

**Problem**: `Error: Execution timeout exceeded`

**Solutions**:
1. Increase timeout using the calculation formula:
   ```typescript
   call_tool_chain({
     code: `...`,
     timeout: 120000  // 2 minutes for complex workflows
   });
   ```

2. Break large operations into smaller chunks

3. Use parallel execution where possible:
   ```typescript
   const [result1, result2] = await Promise.all([
     tool1.tool1.action(),
     tool2.tool2.action()
   ]);
   ```

### TypeError: Not a Function

**Problem**: `TypeError: webflow.webflow is not a function`

**Cause**: Trying to call the server object as a function

**Solution**: Add the tool name after the second part:
```typescript
// WRONG - Missing tool name
await webflow.webflow();

// CORRECT - Include tool name
await webflow.webflow_sites_list({});
```

---

## 11. 📚 RESOURCES

### Documentation

- **MCP Protocol**: https://modelcontextprotocol.io
- **MCP Servers List**: https://github.com/modelcontextprotocol/servers

### MCP Server Packages

| Server              | Package                                  | Tools | Authentication        |
| ------------------- | ---------------------------------------- | ----- | --------------------- |
| **GitHub**          | `@modelcontextprotocol/server-github`    | 26    | Personal Access Token |
| **Webflow**         | `mcp-remote https://mcp.webflow.com/sse` | 42    | OAuth (dashboard)     |
| **ClickUp**         | `@taazkareem/clickup-mcp-server`         | 21    | API Key + Team ID     |
| **Figma**           | `figma-developer-mcp`                    | 18    | Personal Access Token |
| **Chrome DevTools** | `chrome-devtools-mcp@latest`             | 26    | None                  |

### Configuration Paths

| Client              | Configuration File |
| ------------------- | ------------------ |
| **Claude Code**     | `.mcp.json`        |
| **OpenCode**        | `opencode.json`    |
| **VS Code Copilot** | `.vscode/mcp.json` |
| **Windsurf**        | `.mcp.toml`        |

### Helper Commands

```bash
# Validate JSON configuration
python3 -m json.tool < .utcp_config.json

# Check environment variables
cat .env | grep -v "^#" | grep -v "^$"

# Test npx command manually
npx -y @taazkareem/clickup-mcp-server

# List manual names from config
cat .utcp_config.json | grep '"name"'
```

### Performance Metrics

| Metric              | Traditional MCP   | Code Mode        | Improvement     |
| ------------------- | ----------------- | ---------------- | --------------- |
| **Context tokens**  | 141k (47 tools)   | 1.6k (159 tools) | 98.7% reduction |
| **Execution time**  | ~2000ms (4 tools) | ~300ms (4 tools) | 85% faster      |
| **API round trips** | 15+               | 1                | 93% reduction   |

### Project Structure

```
your-project/
├── .utcp_config.json     # MCP server definitions
├── .env                   # API keys (gitignored)
├── .env.example          # Template for team
├── .mcp.json             # Claude Code config (optional)
├── opencode.json         # OpenCode config (optional)
└── .vscode/
    └── mcp.json          # VS Code config (optional)
```

---

## Quick Reference

### Essential Commands

```bash
# Create configuration
cat > .utcp_config.json << 'EOF'
{
  "load_variables_from": [
    { "variable_loader_type": "dotenv", "env_file_path": ".env" }
  ],
  "tool_repository": { "tool_repository_type": "in_memory" },
  "tool_search_strategy": { "tool_search_strategy_type": "tag_and_description_word_match" },
  "manual_call_templates": []
}
EOF

# Validate JSON
python3 -m json.tool < .utcp_config.json

# Check environment variables
env | grep -E "(CLICKUP|FIGMA|GITHUB)"
```

### NAMING PATTERN (Memorize This!)

```typescript
// Pattern: {manual}.{manual_name}_{tool_name}
//          ───┬───  ─────┬─────  ────┬────
//             │          │           └── Tool from MCP server
//             │          └── Server name + underscore + tool
//             └── Manual name (from "name" field)

// Examples:
webflow.webflow_sites_list({});
github.github_get_issue({ owner: "foo", repo: "bar", issue_number: 123 });
clickup.clickup_create_task({ name: "My Task", listName: "Sprint" });
figma.figma_get_file({ fileId: "abc123" });
chrome_devtools_1.chrome_devtools_1_new_page({});
```

### Common Workflows

**Tool Discovery**:
```typescript
const tools = await search_tools({ task_description: "webflow cms", limit: 10 });
console.log(tools.map(t => t.name));
```

**Single Tool Call**:
```typescript
call_tool_chain({
  code: `await webflow.webflow_sites_list({})`
});
```

**Multi-Tool with Error Handling**:
```typescript
call_tool_chain({
  code: `
    try {
      const a = await github.github_get_repo({ owner: "x", repo: "y" });
      const b = await clickup.clickup_create_task({ name: a.name });
      return { success: true, a, b };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});
```

### Validation Checklists

**Installation:**
```
□ Node.js 18+ installed
□ .utcp_config.json created and valid
□ .env created with required keys
□ .env in .gitignore
□ AI client configured
□ Code Mode tools visible
```

**Before Each Session:**
```
□ Correct naming pattern: {manual}.{manual}.{tool}
□ Timeout calculated for complexity
□ Error handling in place
□ API keys not expired
```

---

**Installation Complete!**

You now have Code Mode MCP installed and configured. Use it to orchestrate 159+ tools with 98.7% less context overhead and execute complex multi-tool workflows in single TypeScript executions.

Start using Code Mode by asking your AI assistant:
```
Use search_tools to find tools for [your task]
```

**Remember the naming pattern:**
```
{manual}.{manual}.{tool_name}
```

For more information, refer to the MCP Protocol documentation and the skill documentation in `.opencode/skill/mcp-code-mode/`.
