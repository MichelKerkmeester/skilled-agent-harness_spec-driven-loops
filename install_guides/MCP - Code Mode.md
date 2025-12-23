# MCP Code Mode Installation Guide

A comprehensive guide to installing, configuring, and using the Code Mode MCP server for TypeScript-based tool orchestration.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the MCP Code Mode server for TypeScript tool orchestration

Please help me:
1. Check if I have Node.js 18+ installed
2. Verify I have npx available for running MCP servers
3. Create the required configuration files (.utcp_config.json and .env)
4. Configure Code Mode for my AI environment (I'm using: [Claude Code / OpenCode / VS Code Copilot])
5. Add my first MCP server (e.g., Webflow, ClickUp, Figma, Notion)
6. Verify the installation is working with a test search
7. Test a basic tool call

My preferred MCP servers are: [Webflow / ClickUp / Figma / Notion / Chrome DevTools / other]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Create `.utcp_config.json` configuration file
- Create `.env` file for API keys and secrets
- Configure Code Mode for your specific AI platform
- Add MCP server definitions for your preferred tools
- Test the four available tools: `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`
- Show you how to use the critical naming convention
- Demonstrate progressive tool discovery

**Expected setup time:** 10-15 minutes

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

Code Mode MCP is a TypeScript execution environment that provides unified access to 200+ MCP tools through progressive disclosure. Instead of exposing all tools to your AI context (causing token exhaustion), Code Mode provides a single execution environment where tools are accessed programmatically and loaded on-demand.

### Source Repository

| Property | Value |
|----------|-------|
| **GitHub** | [universal-tool-calling-protocol/code-mode](https://github.com/universal-tool-calling-protocol/code-mode) |
| **npm (MCP Server)** | `@utcp/code-mode-mcp` |
| **npm (Library)** | `@utcp/code-mode` |
| **Stars** | 1.2k+ |
| **License** | MPL-2.0 |

> **Note**: This is the official UTCP (Universal Tool Calling Protocol) implementation, not to be confused with other "code mode" projects like `replicate/replicate-mcp-code-mode` (Replicate-specific) or `jx-codes/codemode-mcp` (abandoned).

### Key Features

- **98.7% Context Reduction**: Access 200+ tools with only ~1.6k tokens (vs ~141k traditional)
- **Progressive Discovery**: Tools loaded on-demand, zero upfront cost
- **TypeScript Execution**: Full TypeScript/JavaScript support with async/await
- **State Persistence**: Data flows naturally between operations
- **Multi-Tool Orchestration**: Execute complex workflows in single call
- **Type Safety**: Full TypeScript interfaces with autocomplete
- **Sandboxed Execution**: Secure V8 isolate with timeout protection

### The "2-3 MCP Server Wall" Problem

**Traditional Approach:**
```
Tools:     10      20      30      47      100     200
Tokens:    30k     60k     90k    141k    300k    600k
Usable?    ✅      ✅      ❌     ❌      ❌      ❌
```

**Code Mode Solution:**
```
Tools:     10      20      30      47      100     200+
Tokens:    1.6k    1.6k    1.6k    1.6k    1.6k    1.6k
Usable?    ✅      ✅      ✅     ✅      ✅      ✅
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
│  MCP Servers: Webflow, ClickUp, Figma, Notion, Chrome, etc. │
│  (200+ tools accessible via Code Mode)                       │
└─────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature | Traditional MCP | Code Mode MCP |
|---------|-----------------|---------------|
| **Context Cost** | ~3k tokens per tool | ~1.6k total (all tools) |
| **Max Tools** | 2-3 servers (context limit) | Unlimited servers |
| **Discovery** | All tools upfront | Progressive (on-demand) |
| **Multi-Tool** | Multiple API calls | Single execution |
| **State** | Manual context management | Automatic persistence |
| **Execution** | ~500ms per tool | ~300ms for 4 tools |

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
  - Notion: Integration Token (Integrations page)
  - Webflow: OAuth (configured in Webflow dashboard)

- **Git** for version control

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
# ClickUp Configuration
# CLICKUP_API_KEY=pk_your_api_key_here
# CLICKUP_TEAM_ID=your_team_id_here

# Figma Configuration
# FIGMA_PERSONAL_ACCESS_TOKEN=figd_your_token_here

# Notion Configuration
# NOTION_TOKEN=ntn_your_token_here

# GitHub Configuration
# GITHUB_TOKEN=ghp_your_token_here
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

### Installation Complete

Files created:
- `.utcp_config.json` - MCP server definitions
- `.env` - API keys and tokens (excluded from git)

---

## 4. ⚙️ CONFIGURATION

### Option A: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

### Option B: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "code-mode": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "utcp-mcp"
      ],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

### Option C: Configure for VS Code Copilot

Add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

### Adding MCP Servers

Add servers to `.utcp_config.json` in the `manual_call_templates` array:

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
        "args": ["-y", "@anthropics/mcp-server-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  }
}
```

#### Notion

```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_TOKEN": "${NOTION_TOKEN}"
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
      "chrome-devtools-1": {
        "transport": "stdio",
        "command": "npx",
        "args": ["chrome-devtools-mcp@latest"],
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
            "args": ["-y", "@anthropics/mcp-server-figma"],
            "env": {
              "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
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

---

## 6. 🚀 USAGE

### Critical Naming Pattern

**THE #1 MOST COMMON ERROR** is using wrong function names. All tool calls MUST follow this pattern:

```typescript
{manual_name}.{manual_name}_{tool_name}
```

**Examples:**

| Manual Name | Pattern | Example |
|-------------|---------|---------|
| `webflow` | `webflow.webflow_{tool}` | `webflow.webflow_sites_list()` |
| `clickup` | `clickup.clickup_{tool}` | `clickup.clickup_create_task()` |
| `figma` | `figma.figma_{tool}` | `figma.figma_get_file()` |
| `notion` | `notion.notion_API_{tool}` | `notion.notion_API_get_user()` |
| `chrome_devtools_1` | `chrome_devtools_1.chrome_devtools_{tool}` | `chrome_devtools_1.chrome_devtools_navigate_page()` |

**Common Mistakes:**

| ❌ Wrong | ✅ Correct | Error |
|---------|-----------|-------|
| `webflow.sites_list()` | `webflow.webflow_sites_list()` | Missing manual prefix |
| `webflow.webflow.sites_list()` | `webflow.webflow_sites_list()` | Double dot notation |
| `webflow.webflowSitesList()` | `webflow.webflow_sites_list()` | camelCase vs snake_case |

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
    const design = await figma.figma_get_file({ fileId: "abc123" });

    // Step 2: Create ClickUp task (design data available)
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Development Sprint",
      description: \`Design has \${design.document.children.length} components\`
    });

    // Step 3: Update Webflow CMS (both design and task data available)
    const cms = await webflow.webflow_collections_items_create_item_live({
      collection_id: "queue-id",
      request: {
        items: [{
          fieldData: {
            name: design.name,
            taskUrl: task.url,
            status: "In Queue"
          }
        }]
      }
    });

    return { design, task, cms };
  `,
  timeout: 60000  // Extended timeout for complex workflow
});
```

---

## 7. 🎯 FEATURES

### 7.1 call_tool_chain

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

### 7.2 search_tools

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

### 7.3 list_tools

**Purpose**: List all available tools from all configured MCP servers.

**Parameters**: None

**Example**:
```typescript
list_tools();
```

**Returns**: `{ tools: string[] }` - All available tool names

### 7.4 tool_info

**Purpose**: Get complete TypeScript interface for a specific tool.

**Parameters**:
- `tool_name` (string, required) - Full tool name (e.g., "webflow.webflow_sites_list")

**Example**:
```typescript
tool_info({
  tool_name: "clickup.clickup_create_task"
});
```

**Returns**: Full TypeScript interface definition with parameter types

---

## 8. 💡 EXAMPLES

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
  `
});
```

### Example 2: ClickUp Task Creation

**Scenario**: Create a task with checklist

```typescript
call_tool_chain({
  code: `
    // Create main task
    const task = await clickup.clickup_create_task({
      name: "Implement User Authentication",
      listName: "Development Sprint",
      description: "Implement OAuth2 login flow",
      tags: ["feature", "auth"],
      priority: 2
    });

    console.log(\`Created task: \${task.name} (ID: \${task.id})\`);
    console.log(\`URL: \${task.url}\`);

    return task;
  `
});
```

### Example 3: Multi-Tool Workflow

**Scenario**: Figma → ClickUp → Webflow pipeline

```typescript
call_tool_chain({
  code: `
    try {
      // Step 1: Get Figma design
      console.log('Fetching Figma design...');
      const design = await figma.figma_get_file({
        fileId: "YOUR_FIGMA_FILE_ID"
      });
      console.log(\`Design: \${design.name}\`);

      // Step 2: Create ClickUp task
      console.log('Creating ClickUp task...');
      const task = await clickup.clickup_create_task({
        name: \`Implement: \${design.name}\`,
        listName: "Design Implementation",
        description: \`Components: \${design.document.children.length}\`
      });
      console.log(\`Task created: \${task.url}\`);

      // Step 3: Add to Webflow CMS queue
      console.log('Adding to Webflow CMS...');
      const cmsItem = await webflow.webflow_collections_items_create_item_live({
        collection_id: "YOUR_COLLECTION_ID",
        request: {
          items: [{
            fieldData: {
              name: design.name,
              "task-url": task.url,
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
        taskUrl: task.url,
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

### Example 4: Chrome DevTools Automation

**Scenario**: Take screenshot and check console errors

```typescript
call_tool_chain({
  code: `
    // Create new browser page
    const page = await chrome_devtools_1.chrome_devtools_new_page({});
    console.log(\`Page created: \${page.pageId}\`);

    // Navigate to URL
    await chrome_devtools_1.chrome_devtools_navigate_page({
      pageId: page.pageId,
      url: "https://example.com"
    });
    console.log('Navigation complete');

    // Wait for page load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take screenshot
    const screenshot = await chrome_devtools_1.chrome_devtools_take_screenshot({
      pageId: page.pageId
    });
    console.log('Screenshot captured');

    // Get console messages
    const console = await chrome_devtools_1.chrome_devtools_get_console_message({
      pageId: page.pageId
    });

    // Close page
    await chrome_devtools_1.chrome_devtools_close_page({ pageId: page.pageId });

    return {
      screenshot: screenshot,
      consoleErrors: console.filter(m => m.level === 'error')
    };
  `,
  timeout: 60000
});
```

### Example 5: Error Handling Pattern

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
  `
});
```

---

## 9. 🔧 TROUBLESHOOTING

### Tool Not Found Error

**Problem**: `Error: Tool not found: webflow.sites_list`

**Cause**: Missing manual prefix in tool name

**Solutions**:
1. Use correct naming pattern: `{manual_name}.{manual_name}_{tool_name}`
   ```typescript
   // Wrong
   await webflow.sites_list({});

   // Correct
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
1. Increase timeout for complex operations:
   ```typescript
   call_tool_chain({
     code: `...`,
     timeout: 120000  // 2 minutes
   });
   ```

2. Break large operations into smaller chunks

3. Use parallel execution where possible:
   ```typescript
   const [result1, result2] = await Promise.all([
     tool1.tool1_action(),
     tool2.tool2_action()
   ]);
   ```

### TypeError: Not a Function

**Problem**: `TypeError: webflow.webflow is not a function`

**Cause**: Using double dot notation

**Solution**: Use single dot with underscore:
```typescript
// Wrong
await webflow.webflow.sites_list({});

// Correct
await webflow.webflow_sites_list({});
```

---

## 10. 📚 RESOURCES

### Documentation

- **MCP Protocol**: https://modelcontextprotocol.io
- **MCP Servers List**: https://github.com/modelcontextprotocol/servers

### MCP Server Packages

| Server | Package | Authentication |
|--------|---------|----------------|
| **Webflow** | `mcp-remote https://mcp.webflow.com/sse` | OAuth (dashboard) |
| **ClickUp** | `@taazkareem/clickup-mcp-server` | API Key + Team ID |
| **Figma** | `@anthropics/mcp-server-figma` | Personal Access Token |
| **Notion** | `@modelcontextprotocol/server-notion` | Integration Token |
| **GitHub** | `@modelcontextprotocol/server-github` | Personal Access Token |
| **Chrome DevTools** | `chrome-devtools-mcp@latest` | None |

### Configuration Paths

| Client | Configuration File |
|--------|-------------------|
| **Claude Code** | `.mcp.json` |
| **OpenCode** | `opencode.json` |
| **VS Code Copilot** | `.vscode/mcp.json` |
| **Windsurf** | `.mcp.toml` |

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

| Metric | Traditional MCP | Code Mode | Improvement |
|--------|-----------------|-----------|-------------|
| **Context tokens** | 141k (47 tools) | 1.6k (200+ tools) | 98.7% reduction |
| **Execution time** | ~2000ms (4 tools) | ~300ms (4 tools) | 85% faster |
| **API round trips** | 15+ | 1 | 93% reduction |

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
env | grep -E "(CLICKUP|FIGMA|NOTION|GITHUB)"
```

### Naming Pattern Quick Reference

```typescript
// Pattern: {manual_name}.{manual_name}_{tool_name}

webflow.webflow_sites_list({});
clickup.clickup_create_task({...});
figma.figma_get_file({...});
notion.notion_API_get_user({...});
chrome_devtools_1.chrome_devtools_new_page({});
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
      const a = await tool1.tool1_action({});
      const b = await tool2.tool2_action({ data: a });
      return { success: true, a, b };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});
```

### Timeout Guidelines

| Complexity | Timeout | Example |
|------------|---------|---------|
| **Simple (1-2 tools)** | 30000ms | List sites |
| **Medium (3-5 tools)** | 60000ms | Create task + update CMS |
| **Complex (6+ tools)** | 120000ms | Full design-to-dev pipeline |

---

**Installation Complete!**

You now have Code Mode MCP installed and configured. Use it to orchestrate 200+ tools with 98.7% less context overhead and execute complex multi-tool workflows in single TypeScript executions.

Start using Code Mode by asking your AI assistant:
```
Use search_tools to find tools for [your task]
```

For more information, refer to the MCP Protocol documentation and the skill documentation in `.opencode/skills/mcp-code-mode/`.
