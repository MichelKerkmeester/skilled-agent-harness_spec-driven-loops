# Figma MCP Installation Guide (Code Mode Provider)

Complete installation and configuration guide for Figma MCP as a **Code Mode provider**, enabling programmatic access to Figma design files through 18 specialized tools. Covers file retrieval (designs, nodes, versions), image export (PNG, SVG, PDF), component and style extraction, team project management, and collaborative commenting.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `mcp-figma` | **Dependencies**: Node.js 18+, **Code Mode MCP (required)**, Figma Personal Access Token

---

## Table of Contents

0. [🤖 AI INSTALL GUIDE](#-ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🔧 FEATURES](#7--features)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Figma MCP server for accessing Figma designs programmatically.

Please help me:
1. Verify I have Node.js 18+ and Code Mode MCP configured
2. Get a Figma Personal Access Token (guide me through Figma settings)
3. Add Figma MCP to my .utcp_config.json configuration
4. Add my token to the .env file securely
5. Configure for my AI environment (I'm using: [Claude Code / OpenCode / VS Code Copilot])
6. Verify the installation with a test tool discovery
7. Test a basic call to get a Figma file

My Figma file key is: [paste your file key from the URL, e.g., abc123XYZ from figma.com/file/abc123XYZ/...]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ and Code Mode are available
- Guide you through Figma Personal Access Token creation
- Add Figma MCP configuration to `.utcp_config.json`
- Securely store your token in `.env` file
- Configure for your specific AI platform
- Test tool discovery with `search_tools()`
- Demonstrate the **critical naming pattern**: `figma.figma_{tool_name}`
- Execute a test call to retrieve a Figma file

**Expected setup time:** 10-15 minutes

---

## ⚠️ IMPORTANT: Code Mode Provider

**Figma MCP is accessed through Code Mode, not called directly.**

This means:

| Aspect             | What This Means                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Configuration**  | Figma is configured in `.utcp_config.json`, NOT `opencode.json`                          |
| **Access Method**  | All Figma tools are accessed via Code Mode's `call_tool_chain()`                         |
| **Prerequisite**   | Code Mode MCP must be installed first ([MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)) |
| **Context Cost**   | AI sees only 4 Code Mode tools (~1.6k tokens), not 18 Figma tools                        |
| **Naming Pattern** | Tools use pattern: `figma.figma_{tool_name}`                                             |

**Why Code Mode?** Figma's 18 tools would consume ~54k tokens if exposed natively. Code Mode provides on-demand access with 98.7% context reduction.

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client (Claude Code, OpenCode, VS Code)                │
│  └─► Sees: 4 Code Mode tools (call_tool_chain, search_tools...) │
│      └─► NOT 18 Figma tools directly                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ call_tool_chain({ code: `figma.figma_get_file(...)` })
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP (configured in opencode.json)                     │
│  └─► Reads .utcp_config.json for Figma provider definition        │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Figma Provider (configured in .utcp_config.json)                 │
│  └─► 18 tools accessible via figma.figma_{tool_name}              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. 📖 OVERVIEW

Figma MCP provides programmatic access to Figma's design platform through 18 specialized tools. It enables AI assistants to read design files, export images, extract components and styles, manage team projects, and handle collaborative comments.

### Source Repository

| Property               | Value                                       |
| ---------------------- | ------------------------------------------- |
| **npm Package**        | `mcp-figma`                                 |
| **Tools**              | 18                                          |
| **Authentication**     | Figma Personal Access Token                 |
| **Access Method**      | **Code Mode (ONLY)** - No native MCP option |
| **Configuration File** | `.utcp_config.json` (NOT opencode.json)     |

### Current Tool Distribution

| Category            | Tools  | Description                                 |
| ------------------- | ------ | ------------------------------------------- |
| **File Management** | 4      | Get files, nodes, API key management        |
| **Images**          | 2      | Export nodes as images, get image URLs      |
| **Comments**        | 3      | Read, post, delete comments                 |
| **Team & Projects** | 2      | List team projects and project files        |
| **Components**      | 4      | Get file/team components and component sets |
| **Styles**          | 3      | Get file/team styles                        |
| **Total**           | **18** |                                             |

### Key Features

- **Design File Access**: Retrieve complete Figma files with configurable depth
- **Node Extraction**: Get specific nodes by ID for targeted data retrieval
- **Image Export**: Render nodes as PNG, JPG, SVG, or PDF at custom scales
- **Component Discovery**: List and retrieve components from files or teams
- **Style Extraction**: Access design tokens (colors, typography, effects)
- **Collaboration**: Read and post comments on design files
- **Team Management**: Navigate team projects and files

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Agent (Claude Code, OpenCode, VS Code Copilot)              │
│                                                                 │
│  Context: Only 4 Code Mode tools (~1.6k tokens)                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • call_tool_chain   (Execute TypeScript)                  │  │
│  │ • search_tools      (Progressive discovery)               │  │
│  │ • list_tools        (List all available)                  │  │
│  │ • tool_info         (Get tool interface)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ❌ NO direct Figma tools in context                            │
│  ✅ Figma accessed via call_tool_chain()                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ figma.figma_get_file({...})
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP Server (configured in opencode.json)             │
│  ├─ Reads .utcp_config.json for provider definitions            │
│  ├─ Executes TypeScript in V8 sandbox                           │
│  └─ Routes calls to Figma provider                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ MCP Protocol
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Figma Provider (configured in .utcp_config.json)               │
│  ├─ Package: mcp-figma                                          │
│  ├─ 18 tools for Figma API access                               │
│  └─ Authenticated via Personal Access Token                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Figma API (api.figma.com)                                      │
│  • Design files, components, styles                             │
│  • Images, comments, team data                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Understanding Code Mode Providers

Figma is a **Code Mode provider**, not a standalone MCP server. This is the ONLY way to access Figma tools.

| Aspect            | If Figma Were Native MCP    | Figma via Code Mode (Actual)     |
| ----------------- | --------------------------- | -------------------------------- |
| **Configuration** | opencode.json               | .utcp_config.json                |
| **Context Cost**  | ~54k tokens (18 tools × 3k) | ~1.6k tokens (4 Code Mode tools) |
| **Tool Access**   | Direct function calls       | Via `call_tool_chain()`          |
| **Multi-Tool**    | Multiple API calls          | Single TypeScript execution      |
| **State**         | Manual management           | Automatic persistence            |

> **Note**: There is no "native MCP" option for Figma. Code Mode is the only access method.

---

## 2. 📋 PREREQUISITES

Before installing Figma MCP, ensure you have:

### Required

1. **Node.js 18 or higher**
   ```bash
   node --version
   # Should show v18.x or higher
   ```

2. **Code Mode MCP configured**
   - See [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) for installation
   - Verify with:
   ```bash
   grep -q '"code-mode"' opencode.json && echo "✅ Code Mode configured" || echo "❌ Code Mode not found"
   ```

3. **Figma Personal Access Token**
   - Go to Figma → Settings → Account → Personal access tokens
   - Click "Generate new token"
   - Copy the token (starts with `figd_`)
   - **Keep this secure** - it provides full access to your Figma account

### Getting Your Figma Token

1. Open [Figma Settings](https://www.figma.com/settings)
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Give it a description (e.g., "MCP Integration")
5. Copy the token immediately (you won't see it again)

> **Security Note**: Your token provides full access to your Figma account. Never commit it to version control.

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
node --version                    # → v18.x or higher
grep -q '"code-mode"' opencode.json && echo "✅ PASS"  # → ✅ PASS
echo $FIGMA_PERSONAL_ACCESS_TOKEN # → figd_... (if already set)
```

**Checklist:**
- [ ] Node.js 18+ installed?
- [ ] Code Mode MCP configured?
- [ ] Figma Personal Access Token obtained?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. 📥 INSTALLATION

This section covers adding Figma MCP to your Code Mode configuration.

### Step 1: Add Figma to .utcp_config.json

Add the following to your `.utcp_config.json` file's `manual_call_templates` array:

```json
{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  }
}
```

### Step 2: Add Token to .env File

Add your Figma token to your `.env` file:

```bash
# Figma Configuration
FIGMA_PERSONAL_ACCESS_TOKEN=figd_your_token_here
```

> **Important**: Replace `figd_your_token_here` with your actual token.

### Step 3: Verify .env is in .gitignore

```bash
grep -q "^\.env$" .gitignore && echo "✅ .env is gitignored" || echo "⚠️ Add .env to .gitignore"
```

If not present, add it:
```bash
echo ".env" >> .gitignore
```

### Validation: `phase_2_complete`

```bash
# Check configuration
grep -q '"figma"' .utcp_config.json && echo "✅ Figma in config" || echo "❌ Figma not found"
grep -q "FIGMA_PERSONAL_ACCESS_TOKEN" .env && echo "✅ Token in .env" || echo "❌ Token not found"
```

**Checklist:**
- [ ] Figma entry added to `.utcp_config.json`?
- [ ] Token added to `.env` file?
- [ ] `.env` is in `.gitignore`?

❌ **STOP if validation fails** - Check configuration syntax and paths.

---

## 4. ⚙️ CONFIGURATION

> **⚠️ IMPORTANT**: You do NOT add Figma to `opencode.json`. Figma is configured in `.utcp_config.json` and accessed through Code Mode.

### Configuration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  opencode.json (or .mcp.json)                                   │
│  └─► Configures: Code Mode MCP server                            │
│      └─► Points to: .utcp_config.json                            │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  .utcp_config.json                                               │
│  └─► Configures: Figma provider (and other Code Mode providers). │
│      └─► Package: mcp-figma                                      │
│      └─► Auth: FIGMA_PERSONAL_ACCESS_TOKEN                      │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Verify Code Mode is Configured

Code Mode must already be configured in your AI client. Check your configuration file:

#### Option A: OpenCode (`opencode.json`)

```json
{
  "mcp": {
    "code-mode": {
      "type": "local",
      "command": ["npx", "-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

#### Option B: Claude Code CLI (`.mcp.json`)

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

#### Option C: VS Code Copilot (`.vscode/mcp.json`)

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

> **Note**: These configurations are for **Code Mode**, not Figma. Figma is added to `.utcp_config.json` (see Section 3: Installation).

### Security Warning

> **CRITICAL**: Never hardcode your Figma token in configuration files.

**WRONG (Security Risk):**
```json
{
  "env": {
    "FIGMA_PERSONAL_ACCESS_TOKEN": "figd_actual_token_here"
  }
}
```

**CORRECT (Secure):**
```json
{
  "env": {
    "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
  }
}
```

### Validation: `phase_3_complete`

```bash
# Validate JSON syntax
python3 -m json.tool < .utcp_config.json > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# Check Code Mode is configured
grep -q '"code-mode"' opencode.json && echo "✅ Code Mode in opencode.json" || echo "❌ Code Mode not found"
```

**Checklist:**
- [ ] `.utcp_config.json` has valid JSON syntax?
- [ ] Code Mode configured in your AI client config?
- [ ] Token uses `${VARIABLE}` syntax (not hardcoded)?

❌ **STOP if validation fails** - Fix configuration syntax or paths.

---

## 5. ✅ VERIFICATION

Verify Figma MCP is working correctly.

### Step 1: Restart Your AI Client

```bash
# Restart to load new configuration
opencode  # Or restart Claude Code/VS Code
```

### Step 2: Discover Figma Tools

Ask your AI assistant or run:

```typescript
search_tools({ task_description: "figma design", limit: 20 });
```

**Expected output**: List of 18 `figma.figma.*` tools.

### Step 3: List All Figma Tools

```typescript
call_tool_chain({
  code: `
    const allTools = await list_tools();
    const figmaTools = allTools.tools.filter(t => t.includes('figma'));
    console.log('Figma tools found:', figmaTools.length);
    console.log(figmaTools);
    return figmaTools;
  `
});
```

**Expected output**: 18 Figma tools listed.

### Step 4: Test a Basic Call

```typescript
call_tool_chain({
  code: `
    // Check if API key is configured
    const keyStatus = await figma.figma_check_api_key({});
    console.log('API Key Status:', keyStatus);
    return keyStatus;
  `
});
```

**Expected output**: Confirmation that API key is configured.

### Success Criteria: `phase_4_complete`

**Checklist:**
- [ ] `search_tools()` returns Figma tools?
- [ ] `list_tools()` shows 18 Figma tools?
- [ ] `figma_check_api_key()` confirms key is set?
- [ ] No authentication errors?

❌ **STOP if validation fails** - Check token in .env, restart AI client.

---

## 6. 🚀 USAGE

### CRITICAL: Naming Pattern

> **THE #1 MOST COMMON ERROR** is using the wrong function names.

**Pattern:**
```
figma.figma_{tool_name}
```

All Figma tool calls MUST follow this exact pattern.

**Examples:**

| Tool         | Correct                           | Wrong                          |
| ------------ | --------------------------------- | ------------------------------ |
| Get file     | `figma.figma_get_file({...})`     | `figma.get_file({...})`        |
| Get image    | `figma.figma_get_image({...})`    | `figma.figma.get_image({...})` |
| Post comment | `figma.figma_post_comment({...})` | `figma.postComment({...})`     |

### Common Mistakes

| Error                     | Wrong                    | Correct                  |
| ------------------------- | ------------------------ | ------------------------ |
| Missing prefix            | `figma.get_file()`       | `figma.figma_get_file()` |
| Dot instead of underscore | `figma.figma.get_file()` | `figma.figma_get_file()` |
| camelCase                 | `figma.figma_getFile()`  | `figma.figma_get_file()` |

### Basic Workflow

**Step 1: Discover Tools**
```typescript
search_tools({ task_description: "figma components", limit: 10 });
```

**Step 2: Get Tool Details**
```typescript
tool_info({ tool_name: "figma.figma.get_file" });
```

**Step 3: Execute Tool**
```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "your_file_key_here"
    });
    console.log('File name:', file.name);
    return file;
  `
});
```

### Finding Your File Key

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design-File
                           └─────────┘
                           This is your fileKey
```

---

## 7. 🔧 FEATURES

### 7.1 File Management Tools

#### `figma_get_file`
Get a complete Figma file by key.

```typescript
await figma.figma_get_file({
  fileKey: "abc123",      // Required: File key from URL
  version: "123456",      // Optional: Specific version ID
  depth: 2,               // Optional: Node depth (1-4)
  branch_data: true       // Optional: Include branch info
});
```

#### `figma_get_file_nodes`
Get specific nodes from a file.

```typescript
await figma.figma_get_file_nodes({
  fileKey: "abc123",           // Required: File key
  node_ids: ["1:2", "3:4"],    // Required: Array of node IDs
  depth: 2,                    // Optional: Node depth (1-4)
  version: "123456"            // Optional: Version ID
});
```

#### `figma_set_api_key`
Set your Figma API key (saved to ~/.mcp-figma/config.json).

```typescript
await figma.figma_set_api_key({
  api_key: "figd_your_token"   // Required: Your PAT
});
```

#### `figma_check_api_key`
Check if an API key is configured.

```typescript
await figma.figma_check_api_key({});
```

---

### 7.2 Image Tools

#### `figma_get_image`
Render nodes as images.

```typescript
await figma.figma_get_image({
  fileKey: "abc123",           // Required: File key
  ids: ["1:2", "3:4"],         // Required: Node IDs to render
  scale: 2,                    // Optional: Scale (0.01-4)
  format: "png",               // Optional: jpg, png, svg, pdf
  svg_include_id: true,        // Optional: IDs in SVG output
  svg_simplify_stroke: false,  // Optional: Simplify SVG strokes
  use_absolute_bounds: false   // Optional: Use absolute bounds
});
```

#### `figma_get_image_fills`
Get URLs for images used in a file.

```typescript
await figma.figma_get_image_fills({
  fileKey: "abc123"            // Required: File key
});
```

---

### 7.3 Comment Tools

#### `figma_get_comments`
Get all comments on a file.

```typescript
await figma.figma_get_comments({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_post_comment`
Post a comment on a file.

```typescript
await figma.figma_post_comment({
  fileKey: "abc123",           // Required: File key
  message: "Great work!",      // Required: Comment text
  client_meta: {               // Optional: Position
    node_id: "1:2",
    node_offset: { x: 100, y: 50 }
  },
  comment_id: "456"            // Optional: Reply to comment
});
```

#### `figma_delete_comment`
Delete a comment.

```typescript
await figma.figma_delete_comment({
  fileKey: "abc123",           // Required: File key
  comment_id: "456"            // Required: Comment ID
});
```

---

### 7.4 Team & Project Tools

#### `figma_get_team_projects`
Get projects for a team.

```typescript
await figma.figma_get_team_projects({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

#### `figma_get_project_files`
Get files in a project.

```typescript
await figma.figma_get_project_files({
  project_id: "789",           // Required: Project ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page",         // Optional: Pagination cursor
  branch_data: true            // Optional: Include branches
});
```

---

### 7.5 Component Tools

#### `figma_get_file_components`
Get all components from a file.

```typescript
await figma.figma_get_file_components({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_get_component`
Get a specific component by key.

```typescript
await figma.figma_get_component({
  key: "component_key"         // Required: Component key
});
```

#### `figma_get_team_components`
Get all components for a team.

```typescript
await figma.figma_get_team_components({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

#### `figma_get_team_component_sets`
Get component sets for a team.

```typescript
await figma.figma_get_team_component_sets({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

---

### 7.6 Style Tools

#### `figma_get_file_styles`
Get all styles from a file.

```typescript
await figma.figma_get_file_styles({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_get_style`
Get a specific style by key.

```typescript
await figma.figma_get_style({
  key: "style_key"             // Required: Style key
});
```

#### `figma_get_team_styles`
Get all styles for a team.

```typescript
await figma.figma_get_team_styles({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

---

## 8. 💡 EXAMPLES

### Example 1: Get Design File Structure

**Scenario**: Retrieve a Figma file and list its top-level frames.

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ",
      depth: 1
    });
    
    console.log('File:', file.name);
    console.log('Last modified:', file.lastModified);
    console.log('Top-level frames:');
    
    file.document.children.forEach(page => {
      console.log('  Page:', page.name);
      page.children?.forEach(frame => {
        console.log('    Frame:', frame.name, '(', frame.type, ')');
      });
    });
    
    return {
      name: file.name,
      pages: file.document.children.length
    };
  `
});
```

---

### Example 2: Export Component as PNG

**Scenario**: Export a specific component as a 2x PNG image.

```typescript
call_tool_chain({
  code: `
    // Export node as PNG at 2x scale
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234"],  // Node ID from Figma
      format: "png",
      scale: 2
    });
    
    console.log('Image URLs:', images.images);
    
    // Returns URLs like:
    // { "1:234": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/..." }
    
    return images;
  `
});
```

---

### Example 3: Get Design System Components

**Scenario**: List all components in a design system file.

```typescript
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({
      fileKey: "abc123XYZ"
    });
    
    console.log('Total components:', Object.keys(components.meta.components).length);
    
    // List component names and keys
    Object.entries(components.meta.components).forEach(([key, comp]) => {
      console.log('  -', comp.name, '| Key:', key);
    });
    
    return {
      count: Object.keys(components.meta.components).length,
      components: Object.values(components.meta.components).map(c => c.name)
    };
  `
});
```

---

### Example 4: Add Review Comment

**Scenario**: Post a review comment on a specific design element.

```typescript
call_tool_chain({
  code: `
    const comment = await figma.figma_post_comment({
      fileKey: "abc123XYZ",
      message: "✅ Approved for development. Please ensure 8px padding is maintained.",
      client_meta: {
        node_id: "1:234"  // Attach to specific node
      }
    });
    
    console.log('Comment posted:', comment.id);
    console.log('By:', comment.user.handle);
    
    return comment;
  `
});
```

---

### Example 5: Multi-Tool Workflow

**Scenario**: Get file → Extract components → Export as SVG.

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";
    
    // Step 1: Get file info
    console.log('Step 1: Getting file...');
    const file = await figma.figma_get_file({
      fileKey,
      depth: 1
    });
    console.log('File:', file.name);
    
    // Step 2: Get components
    console.log('Step 2: Getting components...');
    const components = await figma.figma_get_file_components({ fileKey });
    const componentList = Object.values(components.meta.components);
    console.log('Found', componentList.length, 'components');
    
    // Step 3: Export first 5 components as SVG
    console.log('Step 3: Exporting as SVG...');
    const nodeIds = componentList.slice(0, 5).map(c => c.node_id);
    
    const images = await figma.figma_get_image({
      fileKey,
      ids: nodeIds,
      format: "svg",
      svg_simplify_stroke: true
    });
    
    console.log('Exported', Object.keys(images.images).length, 'SVGs');
    
    return {
      file: file.name,
      componentsFound: componentList.length,
      exported: Object.keys(images.images).length,
      urls: images.images
    };
  `,
  timeout: 60000  // Extended timeout for multi-step workflow
});
```

---

### Example 6: Extract Design Tokens (Styles)

**Scenario**: Get all styles from a file for design token extraction.

```typescript
call_tool_chain({
  code: `
    const styles = await figma.figma_get_file_styles({
      fileKey: "abc123XYZ"
    });
    
    console.log('Design Tokens Found:');
    
    // Group by style type
    const grouped = {
      FILL: [],
      TEXT: [],
      EFFECT: [],
      GRID: []
    };
    
    Object.values(styles.meta.styles).forEach(style => {
      if (grouped[style.style_type]) {
        grouped[style.style_type].push(style.name);
      }
    });
    
    console.log('Colors:', grouped.FILL.length);
    console.log('Typography:', grouped.TEXT.length);
    console.log('Effects:', grouped.EFFECT.length);
    console.log('Grids:', grouped.GRID.length);
    
    return grouped;
  `
});
```

---

### Example 7: Design-to-Code Pipeline

**Scenario**: Extract design data and generate CSS custom properties (design tokens).

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";
    
    // Step 1: Get file info
    console.log('Step 1: Getting file info...');
    const file = await figma.figma_get_file({
      fileKey,
      depth: 1
    });
    console.log('File:', file.name);
    
    // Step 2: Get all styles (design tokens)
    console.log('Step 2: Extracting styles...');
    const styles = await figma.figma_get_file_styles({ fileKey });
    
    // Step 3: Get all components
    console.log('Step 3: Extracting components...');
    const components = await figma.figma_get_file_components({ fileKey });
    
    // Step 4: Generate CSS custom properties
    console.log('Step 4: Generating CSS...');
    
    const cssTokens = [];
    cssTokens.push(':root {');
    cssTokens.push('  /* Design Tokens from Figma */');
    cssTokens.push('  /* File: ' + file.name + ' */');
    cssTokens.push('');
    
    // Process color styles
    const colorStyles = Object.values(styles.meta.styles)
      .filter(s => s.style_type === 'FILL');
    
    cssTokens.push('  /* Colors */');
    colorStyles.forEach(style => {
      const varName = style.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      cssTokens.push('  --color-' + varName + ': /* extracted from Figma */;');
    });
    
    // Process text styles
    const textStyles = Object.values(styles.meta.styles)
      .filter(s => s.style_type === 'TEXT');
    
    cssTokens.push('');
    cssTokens.push('  /* Typography */');
    textStyles.forEach(style => {
      const varName = style.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      cssTokens.push('  --font-' + varName + ': /* extracted from Figma */;');
    });
    
    cssTokens.push('}');
    
    const css = cssTokens.join('\\n');
    console.log('\\nGenerated CSS:');
    console.log(css);
    
    // Step 5: List components for implementation
    const componentList = Object.values(components.meta.components);
    console.log('\\nComponents to implement:', componentList.length);
    componentList.slice(0, 10).forEach(c => {
      console.log('  -', c.name);
    });
    
    return {
      file: file.name,
      colorTokens: colorStyles.length,
      textTokens: textStyles.length,
      components: componentList.length,
      css: css
    };
  `,
  timeout: 60000
});
```

**Output**: CSS custom properties file with design tokens extracted from Figma, plus a list of components to implement.

---

## 9. 🔧 TROUBLESHOOTING

### Error Quick Reference

| Error                                  | Cause                     | Solution                                  |
| -------------------------------------- | ------------------------- | ----------------------------------------- |
| `Tool not found: figma.get_file`       | Missing `figma_` prefix   | Use `figma.figma_get_file`                |
| `Tool not found: figma.figma.get_file` | Dot instead of underscore | Use `figma.figma_get_file`                |
| `403 Forbidden`                        | Invalid or expired token  | Regenerate Figma PAT                      |
| `404 Not Found`                        | Invalid file key          | Check file key in URL                     |
| `Environment variable not found`       | Token not in .env         | Add `FIGMA_PERSONAL_ACCESS_TOKEN` to .env |
| `Rate limit exceeded`                  | Too many requests         | Wait and retry, reduce request frequency  |

---

### Tool Not Found Error

**Problem**: `Error: Tool not found: figma.get_file`

**Cause**: Missing the `figma_` prefix in tool name.

**Solution**:
```typescript
// WRONG
await figma.get_file({ fileKey: "abc" });

// WRONG
await figma.figma.get_file({ fileKey: "abc" });

// CORRECT
await figma.figma_get_file({ fileKey: "abc" });
```

---

### Authentication Failed

**Problem**: `403 Forbidden` or `Invalid token`

**Solutions**:

1. **Check token is set**:
   ```bash
   grep "FIGMA_PERSONAL_ACCESS_TOKEN" .env
   ```

2. **Verify token format** (should start with `figd_`):
   ```bash
   cat .env | grep FIGMA
   # Should show: FIGMA_PERSONAL_ACCESS_TOKEN=figd_...
   ```

3. **Regenerate token** if expired:
   - Go to Figma → Settings → Personal access tokens
   - Generate new token
   - Update `.env` file

4. **Restart AI client** after changing `.env`

---

### File Not Found

**Problem**: `404 Not Found` when accessing a file

**Solutions**:

1. **Verify file key** from URL:
   ```
   https://www.figma.com/file/ABC123xyz/Design-File
                              └─────────┘
                              Use this part
   ```

2. **Check file permissions**:
   - Ensure your Figma account has access to the file
   - File must be shared with you or in your team

3. **Check if file was deleted or moved**

---

### Rate Limiting

**Problem**: `429 Too Many Requests`

#### Figma API Rate Limits

| Endpoint Type      | Rate Limit         | Notes                    |
| ------------------ | ------------------ | ------------------------ |
| **Most endpoints** | 30 requests/minute | Per user token           |
| **Image export**   | 60 requests/minute | Higher limit for exports |
| **Comments**       | 30 requests/minute | Standard limit           |
| **Team endpoints** | 30 requests/minute | Standard limit           |

#### Best Practices

1. **Add delays between calls**:
   ```typescript
   // Add 2-second delay between requests
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

2. **Batch operations when possible**:
   ```typescript
   // Instead of multiple get_file calls, use get_file_nodes with multiple IDs
   await figma.figma_get_file_nodes({
     fileKey: "abc123",
     node_ids: ["1:2", "3:4", "5:6"]  // Multiple nodes in one call
   });
   ```

3. **Cache responses** - Don't re-fetch unchanged data

4. **Use pagination** - For large datasets, use `page_size` and `cursor`:
   ```typescript
   let cursor = null;
   do {
     const result = await figma.figma_get_team_projects({
       team_id: "123",
       page_size: 30,
       cursor: cursor
     });
     // Process result.projects
     cursor = result.cursor;
   } while (cursor);
   ```

5. **Handle 429 errors gracefully**:
   ```typescript
   try {
     const file = await figma.figma_get_file({ fileKey: "abc" });
   } catch (error) {
     if (error.message.includes('429')) {
       console.log('Rate limited. Waiting 60 seconds...');
       await new Promise(resolve => setTimeout(resolve, 60000));
       // Retry
     }
   }
   ```

---

### Environment Variable Not Loading

**Problem**: `Environment variable FIGMA_PERSONAL_ACCESS_TOKEN not found`

**Solutions**:

1. **Check .env file exists**:
   ```bash
   ls -la .env
   ```

2. **Check variable is defined**:
   ```bash
   cat .env | grep FIGMA
   ```

3. **Check .utcp_config.json references .env**:
   ```json
   "load_variables_from": [
     {
       "variable_loader_type": "dotenv",
       "env_file_path": ".env"
     }
   ]
   ```

4. **Restart AI client** after changes

---

## 10. 📚 RESOURCES

### File Locations

| Path                       | Purpose                     |
| -------------------------- | --------------------------- |
| `.utcp_config.json`        | Code Mode MCP configuration |
| `.env`                     | Figma token (gitignored)    |
| `~/.mcp-figma/config.json` | Alternative token storage   |

### Configuration Reference

**Minimal .utcp_config.json entry**:
```json
{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  }
}
```

### External Links

| Resource            | URL                                      |
| ------------------- | ---------------------------------------- |
| **Figma API Docs**  | https://www.figma.com/developers/api     |
| **mcp-figma npm**   | https://www.npmjs.com/package/mcp-figma  |
| **Figma Settings**  | https://www.figma.com/settings           |
| **Code Mode Skill** | `.opencode/skill/mcp-code-mode/SKILL.md` |
| **Figma MCP Skill** | `.opencode/skill/mcp-figma/SKILL.md`     |

### Related Install Guides

- [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) - Required for Figma MCP access
- [MCP - Narsil.md](./MCP%20-%20Narsil.md) - Similar MCP skill pattern

### Tool Summary

| Category            | Tools                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **File Management** | `get_file`, `get_file_nodes`, `set_api_key`, `check_api_key`                             |
| **Images**          | `get_image`, `get_image_fills`                                                           |
| **Comments**        | `get_comments`, `post_comment`, `delete_comment`                                         |
| **Team & Projects** | `get_team_projects`, `get_project_files`                                                 |
| **Components**      | `get_file_components`, `get_component`, `get_team_components`, `get_team_component_sets` |
| **Styles**          | `get_file_styles`, `get_style`, `get_team_styles`                                        |

---

## Quick Reference

### Naming Pattern (Memorize This!)

```typescript
// Pattern: figma.figma_{tool_name}

// Examples:
figma.figma_get_file({ fileKey: "abc123" });
figma.figma_get_image({ fileKey: "abc123", ids: ["1:2"], format: "png" });
figma.figma_get_file_components({ fileKey: "abc123" });
figma.figma_post_comment({ fileKey: "abc123", message: "LGTM!" });
```

### Common Workflows

**Get file info**:
```typescript
const file = await figma.figma_get_file({ fileKey: "abc123" });
```

**Export as image**:
```typescript
const images = await figma.figma_get_image({ 
  fileKey: "abc123", 
  ids: ["1:2"], 
  format: "png", 
  scale: 2 
});
```

**Get components**:
```typescript
const components = await figma.figma_get_file_components({ fileKey: "abc123" });
```

**Get styles**:
```typescript
const styles = await figma.figma_get_file_styles({ fileKey: "abc123" });
```

---

**Installation Complete!**

You now have Figma MCP installed and configured. Use it to access Figma designs programmatically through Code Mode's efficient orchestration.

Start using Figma MCP by asking your AI assistant:
```
Use search_tools to find Figma tools, then get my design file at [your-file-key]
```

**Remember the naming pattern:**
```
figma.figma_{tool_name}
```

For more information, see the [Figma MCP Skill](./../skill/mcp-figma/SKILL.md) documentation.

---

## Version History

| Version   | Date       | Changes                                                                                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1.0** | 2024-12-30 | Added Code Mode Provider emphasis, improved architecture diagrams, added design-to-code pipeline example, expanded rate limits documentation |
| **1.0.0** | 2024-12-29 | Initial release with 18 tools, 7 examples, complete troubleshooting guide                                                                    |
