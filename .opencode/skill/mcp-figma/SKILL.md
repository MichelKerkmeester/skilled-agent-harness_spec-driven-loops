---
name: mcp-figma
description: "Figma design file access via MCP providing 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting. Accessed via Code Mode for token-efficient workflows."
allowed-tools: [Read, mcp__code_mode__call_tool_chain, mcp__code_mode__search_tools, mcp__code_mode__list_tools, mcp__code_mode__tool_info]
version: 1.0.0
---

<!-- Keywords: figma, mcp-figma, design-files, components, styles, images, export, design-tokens, design-system, collaboration, comments, team-projects -->

# Figma MCP - Design File Access

Programmatic access to Figma design files through 18 specialized tools covering file retrieval, image export, component/style extraction, and collaboration. Accessed **via Code Mode** for token-efficient on-demand access.

**Core Principle**: Design-to-code bridge - Figma MCP enables AI assistants to read and understand design files.

### Two Options Available

| Option | Name | Type | Best For |
|--------|------|------|----------|
| **A** | Official Figma MCP | HTTP (mcp.figma.com) | Simplicity - no install, OAuth login |
| **B** | Framelink (3rd-party) | stdio (local) | Code Mode integration, API key auth |

**Recommendation:** Start with **Option A** (Official) - zero installation, OAuth login, works immediately. See [Install Guide](../../install_guides/MCP%20-%20Figma.md) for setup details.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use when**:
- Retrieving Figma design file structure or content
- Exporting design elements as images (PNG, SVG, PDF)
- Extracting components for design system documentation
- Getting design tokens (colors, typography, effects)
- Managing team projects and files
- Reading or posting design review comments

**Keyword Triggers**:
- Files: "figma file", "design file", "get design", "figma document"
- Images: "export image", "export png", "export svg", "render node"
- Components: "figma components", "design system", "component library"
- Styles: "design tokens", "figma styles", "colors", "typography"
- Teams: "team projects", "project files", "figma team"
- Comments: "design comments", "review comments", "figma feedback"

### Use Cases

#### Design File Access
- Get complete Figma file structure
- Retrieve specific nodes by ID
- Access file version history
- Navigate page and frame hierarchy

#### Asset Export
- Export nodes as PNG, JPG, SVG, or PDF
- Control scale factor (0.01-4x)
- Get URLs for embedded images
- Batch export multiple nodes

#### Design System Documentation
- List all components in a file
- Extract component metadata
- Get team-wide component libraries
- Document component sets

#### Design Token Extraction
- Get color styles (fills)
- Get typography styles (text)
- Get effect styles (shadows, blurs)
- Get grid styles

#### Collaboration
- Read comments on designs
- Post review feedback
- Reply to existing comments
- Delete comments

### When NOT to Use

**Do not use for**:
- Creating or editing Figma designs → Use Figma directly
- Real-time collaboration → Use Figma's native features
- File storage/backup → Use Figma's version history
- Design prototyping → Use Figma's prototyping tools

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Need to get Figma file or nodes
    │   └─► Tools: get_file, get_file_nodes
    │
    ├─► Need to export images
    │   └─► Tools: get_image, get_image_fills
    │
    ├─► Need component information
    │   └─► Tools: get_file_components, get_component, get_team_components
    │
    ├─► Need style/token information
    │   └─► Tools: get_file_styles, get_style, get_team_styles
    │
    ├─► Need team/project navigation
    │   └─► Tools: get_team_projects, get_project_files
    │
    └─► Need to manage comments
        └─► Tools: get_comments, post_comment, delete_comment
```

### Resource Router

```python
def route_figma_resources(task):
    """
    Resource Router for mcp-figma skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # QUICK START
    # Purpose: First-time usage, verification, basic commands
    # Key Insight: Fastest path to working state
    # ──────────────────────────────────────────────────────────────────
    if task.is_first_use or task.needs_verification:
        return load("references/quick_start.md")

    # ──────────────────────────────────────────────────────────────────
    # COMPLETE REFERENCE
    # Purpose: All 18 tools with descriptions and interfaces
    # Key Insight: Use for discovery or when unsure which tool
    # ──────────────────────────────────────────────────────────────────
    if task.needs_tool_discovery or task.needs_full_reference:
        return load("references/tool_reference.md")

    # Default: SKILL.md covers basic usage

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# assets/tool_categories.md → Priority categorization of all 18 tools
```

---

## 3. 🛠️ HOW IT WORKS

### Code Mode Invocation

Figma MCP is accessed via Code Mode's `call_tool_chain()` for token efficiency.

**Naming Convention**:
```
figma.figma_{tool_name}
```

**Process Flow**:
```
STEP 1: Discover Tools
       ├─ Use search_tools() for capability-based discovery
       ├─ Use tool_info() for specific tool details
       └─ Output: Tool name and parameters
       ↓
STEP 2: Execute via Code Mode
       ├─ Use call_tool_chain() with TypeScript code
       ├─ Await figma.figma_{tool_name}({params})
       └─ Output: Tool results
       ↓
STEP 3: Process Results
       └─ Parse and present findings
```

### Tool Invocation Examples

```typescript
// Discover Figma tools
search_tools({ task_description: "figma design components" });

// Get tool details
tool_info({ tool_name: "figma.figma.get_file" });

// Get a Figma file
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ"
    });
    console.log('File:', file.name);
    return file;
  `
});

// Export as image
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234"],
      format: "png",
      scale: 2
    });
    return images;
  `
});

// Get components
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({
      fileKey: "abc123XYZ"
    });
    return components;
  `
});
```

### Finding Your File Key

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design
                           └─────────┘
                           This is fileKey
```

---

## 4. 📋 RULES

### ✅ ALWAYS

1. **ALWAYS use Code Mode for Figma invocation**
   - Call via `call_tool_chain()` with TypeScript
   - Saves context tokens vs native MCP

2. **ALWAYS use full tool naming convention**
   - Format: `figma.figma_{tool_name}`
   - Example: `figma.figma_get_file({ fileKey: "abc" })`

3. **ALWAYS verify file key format**
   - Extract from Figma URL
   - Should be alphanumeric string

4. **ALWAYS handle pagination for team queries**
   - Use `page_size` and `cursor` parameters
   - Check for `cursor` in response for more pages

5. **ALWAYS check API key before operations**
   - Use `figma_check_api_key()` to verify
   - Token must be valid and not expired

### ❌ NEVER

1. **NEVER skip the `figma_` prefix in tool names**
   - Wrong: `await figma.get_file({})`
   - Right: `await figma.figma_get_file({})`

2. **NEVER hardcode Figma tokens**
   - Use environment variables
   - Store in `.env` file

3. **NEVER assume node IDs are stable**
   - Node IDs can change when designs are edited
   - Re-fetch if operations fail

4. **NEVER ignore rate limits**
   - Figma API has rate limits
   - Add delays for batch operations

### ⚠️ ESCALATE IF

1. **ESCALATE IF authentication fails repeatedly**
   - Token may be expired
   - Regenerate in Figma settings

2. **ESCALATE IF file not found**
   - Verify file key from URL
   - Check file permissions

3. **ESCALATE IF rate limited**
   - Wait before retrying
   - Reduce request frequency

---

## 5. 🏆 SUCCESS CRITERIA

### File Access Complete

**File access complete when**:
- ✅ `get_file` returns file structure
- ✅ File name and pages accessible
- ✅ Node hierarchy navigable

### Image Export Complete

**Image export complete when**:
- ✅ `get_image` returns image URLs
- ✅ URLs are accessible and valid
- ✅ Format and scale as requested

### Component Extraction Complete

**Component extraction complete when**:
- ✅ `get_file_components` returns component list
- ✅ Component names and keys accessible
- ✅ Node IDs available for further queries

### Style Extraction Complete

**Style extraction complete when**:
- ✅ `get_file_styles` returns style list
- ✅ Style types categorized (FILL, TEXT, EFFECT, GRID)
- ✅ Style names and keys accessible

### Validation Checkpoints

| Checkpoint         | Validation                           |
| ------------------ | ------------------------------------ |
| `tools_discovered` | `search_tools()` returns Figma tools |
| `auth_verified`    | `check_api_key()` confirms token     |
| `file_accessible`  | `get_file()` returns file data       |
| `export_working`   | `get_image()` returns URLs           |

---

## 6. 🔌 INTEGRATION POINTS

### Prerequisites

Before using this skill, ensure:

1. **mcp-code-mode skill is available** - Figma is accessed through Code Mode
2. **Figma configured in .utcp_config.json** - NOT in opencode.json
3. **Figma Personal Access Token** - Stored in `.env` file

```
Dependency Chain:
┌─────────────────────────────────────────────────────────────────┐
│  mcp-code-mode skill (REQUIRED)                                 │
│  └─► Provides: call_tool_chain(), search_tools(), etc.          │
│      └─► Enables: Access to Figma provider                      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  mcp-figma skill (THIS SKILL)                                    │
│  └─► Provides: Knowledge of 18 Figma tools                      │
│      └─► Pattern: figma.figma_{tool_name}                         │
└─────────────────────────────────────────────────────────────────┘
```

### Code Mode Dependency (REQUIRED)

> **⚠️ CRITICAL**: This skill REQUIRES `mcp-code-mode`. Figma tools are NOT accessible without Code Mode.

**How Figma Relates to Code Mode:**

```
┌─────────────────────────────────────────────────────────────────┐
│  opencode.json                                                  │
│  └─► Configures: code-mode MCP server                            │
│      └─► Points to: .utcp_config.json                            │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  .utcp_config.json                                               │
│  └─► Configures: figma provider (among others)                    │
│      └─► Package: figma-developer-mcp                            │
│      └─► Auth: FIGMA_API_KEY                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Figma Provider Configuration** (in `.utcp_config.json`):

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
          "FIGMA_API_KEY": "figd_your_token_here"
        }
      }
    }
  }
}
```

> **Note**: Code Mode does NOT support `${VAR}` env substitution. You must hardcode the API key directly in the config.

### Related Skills

| Skill             | Relationship | Notes                                              |
| ----------------- | ------------ | -------------------------------------------------- |
| **mcp-code-mode** | **REQUIRED** | Figma accessed via Code Mode's `call_tool_chain()` |
| **mcp-narsil**    | Optional     | Can analyze code generated from Figma designs      |

### Cross-Tool Workflows

**Figma → ClickUp**:
```typescript
// Get design info, create task
const file = await figma.figma_get_file({ fileKey: "abc" });
const task = await clickup.clickup_create_task({
  name: `Implement: ${file.name}`,
  description: `Design file: https://figma.com/file/abc`
});
```

**Figma → Webflow**:
```typescript
// Export images, update CMS
const images = await figma.figma_get_image({ fileKey: "abc", ids: ["1:2"], format: "png" });
// Use image URLs in Webflow CMS
```

---

## 7. 🏎️ QUICK REFERENCE

### Essential Commands

| Task           | Tool                  | Example                                                                  |
| -------------- | --------------------- | ------------------------------------------------------------------------ |
| Get file       | `get_file`            | `figma.figma_get_file({ fileKey: "abc123" })`                            |
| Export image   | `get_image`           | `figma.figma_get_image({ fileKey: "abc", ids: ["1:2"], format: "png" })` |
| Get components | `get_file_components` | `figma.figma_get_file_components({ fileKey: "abc" })`                    |
| Get styles     | `get_file_styles`     | `figma.figma_get_file_styles({ fileKey: "abc" })`                        |
| Get comments   | `get_comments`        | `figma.figma_get_comments({ fileKey: "abc" })`                           |
| Post comment   | `post_comment`        | `figma.figma_post_comment({ fileKey: "abc", message: "..." })`           |

### Common Patterns

```typescript
// Get file structure
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({ fileKey: "abc123XYZ" });
    console.log('Pages:', file.document.children.map(p => p.name));
    return file;
  `
});

// Export multiple nodes as PNG
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234", "1:235", "1:236"],
      format: "png",
      scale: 2
    });
    return images;
  `
});

// Get all components with metadata
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({ fileKey: "abc123XYZ" });
    return components.meta.components.map(c => ({
      name: c.name,
      key: c.key,
      nodeId: c.node_id
    }));
  `
});
```

### Troubleshooting

| Issue                 | Solution                                                    |
| --------------------- | ----------------------------------------------------------- |
| "Invalid token" error | Regenerate token in Figma Settings → Personal Access Tokens |
| File not found        | Verify fileKey from URL: `figma.com/file/{fileKey}/...`     |
| Rate limited          | Add delays between requests, reduce batch size              |
| Node ID not found     | Node IDs change on edit - re-fetch file to get current IDs  |
| Empty components list | File may not have published components                      |

---

## 8. 🔗 RELATED RESOURCES

### references/

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| **tool_reference.md** | All 18 tools documented | Complete parameter reference |
| **quick_start.md** | Getting started | 5-minute setup |

### assets/

| Asset | Purpose |
|-------|---------|
| **tool_categories.md** | Priority categorization of all 18 tools |

### External Resources

- [Figma API Documentation](https://www.figma.com/developers/api) - Official API reference
- [Official Figma MCP Server](https://developers.figma.com/docs/figma-mcp-server/) - Figma's official MCP (HTTP at mcp.figma.com) - **RECOMMENDED**
- [figma-developer-mcp](https://www.npmjs.com/package/figma-developer-mcp) - Recommended package for Code Mode integration

### Related Skills

- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - Tool orchestration (Figma accessed via Code Mode)

### Install Guide

- [MCP - Figma.md](../../install_guides/MCP%20-%20Figma.md) - Installation and configuration
