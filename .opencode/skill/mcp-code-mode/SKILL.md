---
name: mcp-code-mode
description: "MCP orchestration via TypeScript execution for efficient multi-tool workflows. Use Code Mode for ALL MCP tool calls (ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.). Provides 98.7% context reduction, 60% faster execution, and type-safe invocation. Mandatory for external tool integration."
allowed-tools: [mcp__code_mode__call_tool_chain, mcp__code_mode__search_tools, mcp__code_mode__list_tools, mcp__code_mode__tool_info]
version: 1.2.0
---

<!-- Keywords: mcp-code-mode, typescript-execution, multi-tool-workflow, tool-orchestration, context-reduction, progressive-discovery, external-api-integration, mcp-server -->

# MCP Code Mode

Execute TypeScript code with direct access to 200+ MCP tools through progressive disclosure. Code Mode eliminates context overhead by loading tools on-demand, enabling complex multi-tool workflows in a single execution with state persistence and built-in error handling.

---

## 1. 🎯 WHEN TO USE

### Use Code Mode When

**MANDATORY for ALL MCP tool calls**:
- ✅ Calling ClickUp, Notion, Figma, Webflow, Chrome DevTools, or any other MCP tools
- ✅ Accessing external APIs through MCP servers
- ✅ Managing tasks in project management tools
- ✅ Interacting with design tools, databases, or services
- ✅ Browser automation and web interactions

**Benefits over traditional tool calling**:
- 🚀 **98.7% context reduction** - 1.6k tokens vs 141k for 47 tools
- ⚡ **60% faster execution** - Single execution vs 15+ API round trips
- 🔗 **State persistence** - Data flows naturally between operations
- 🛡️ **Type safety** - Full TypeScript support with autocomplete
- 🎯 **Progressive loading** - Tools discovered on-demand, zero upfront cost

### Do NOT Use Code Mode For

**Use native tools instead**:
- ❌ File operations (use Read, Write, Edit tools)
- ❌ Text searching (use Grep tool)
- ❌ File discovery (use Glob tool)
- ❌ Bash commands (use Bash tool)
- ✅ Semantic code search via Narsil (use `narsil.narsil_neural_search()` via Code Mode)
- ✅ Structural code analysis via Narsil (use `narsil.narsil_find_symbols()`, `narsil.narsil_get_project_structure()` via Code Mode)
- ❌ Conversation memory (use `spec_kit_memory_memory_search()` - **NATIVE MCP**)
- ❌ Sequential Thinking (call `sequential_thinking_sequentialthinking()` directly - **NATIVE MCP**)

> See Section 4 for details on Native MCP vs Code Mode distinction.

### Common Use Cases

| Scenario                     | Code Mode Approach                                                      | Benefit                     |
| ---------------------------- | ----------------------------------------------------------------------- | --------------------------- |
| **Create ClickUp task**      | `call_tool_chain({ code: "await clickup.clickup_create_task({...})" })` | Type-safe, single execution |
| **Multi-tool workflow**      | Figma → ClickUp → Webflow in one execution                              | State persists, 5× faster   |
| **Browser automation**       | Chrome DevTools MCP for testing/screenshots                             | Sandboxed, reliable         |
| **Design-to-implementation** | Fetch Figma design → Create task → Update CMS                           | Atomic workflow             |
| **External API access**      | Any MCP server (Notion, GitHub, etc.)                                   | Progressive tool loading    |

---

## 2. 🧭 SMART ROUTING

### Activation Detection
```
TASK CONTEXT
    │
    ├─► Task involves MCP tool calls (ClickUp, Notion, Figma, etc.)
    │   └─► ACTIVATE Code Mode for efficient orchestration
    │
    ├─► Multi-tool workflow needed (chaining MCP tools)
    │   └─► ACTIVATE Code Mode
    │
    ├─► User mentions "Code Mode", "UTCP", "tool chain"
    │   └─► ACTIVATE this skill
    │
    ├─► External API integration via MCP servers
    │   └─► ACTIVATE Code Mode
    │
    └─► Single tool call or non-MCP task
        └─► Use direct MCP tool call, skip Code Mode
```

### Resource Router
```python
def route_code_mode_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # TOOL NAMING (CRITICAL)
    # Purpose: Tool naming pattern and common mistakes
    # Key Insight: ⚠️ CRITICAL: Tool naming errors (read first)
    # ──────────────────────────────────────────────────────────────────
    if task.error_contains("tool not found") or task.error_contains("naming"):
        return load("references/naming_convention.md")  # priority: CRITICAL

    # ──────────────────────────────────────────────────────────────────
    # CONFIGURATION AND SETUP
    # Purpose: .utcp_config.json and .env setup
    # Key Insight: Setting up Code Mode, adding MCP servers
    # ──────────────────────────────────────────────────────────────────
    if task.needs_setup or task.env_vars_not_loading:
        load("references/configuration.md")  # .utcp_config.json and .env setup
        load("assets/config_template.md")  # template file
        return load("assets/env_template.md")  # env template

    # ──────────────────────────────────────────────────────────────────
    # CONFIG VALIDATION
    # Purpose: Validates .utcp_config.json structure
    # Key Insight: Before deploying configuration, troubleshooting errors
    # ──────────────────────────────────────────────────────────────────
    if task.validating_config:
        return execute("scripts/validate_config.py")  # syntax + env var checks

    # ──────────────────────────────────────────────────────────────────
    # TOOL DISCOVERY
    # Purpose: Complete list of 200+ available tools
    # Key Insight: Discovering available tools and capabilities
    # ──────────────────────────────────────────────────────────────────
    if task.needs_tool_list or "what tools" in task.query:
        return load("references/tool_catalog.md")  # 200+ available tools

    # ──────────────────────────────────────────────────────────────────
    # WORKFLOWS AND ERROR HANDLING
    # Purpose: 5 comprehensive workflow examples
    # Key Insight: Multi-tool orchestration, error handling patterns
    # ──────────────────────────────────────────────────────────────────
    if task.multi_tool_workflow or task.needs_error_handling:
        return load("references/workflows.md")  # 5 workflow examples

    # ──────────────────────────────────────────────────────────────────
    # ARCHITECTURE
    # Purpose: System architecture and token economics
    # Key Insight: Understanding how Code Mode works internally
    # ──────────────────────────────────────────────────────────────────
    if task.how_it_works or task.token_questions:
        return load("references/architecture.md")  # system internals

    # ══════════════════════════════════════════════════════════════════════
    # STATIC RESOURCES (always available, not conditionally loaded)
    # ══════════════════════════════════════════════════════════════════════
    # assets/config_template.md → Template .utcp_config.json file
    # assets/env_template.md → Template .env file with placeholders
```

---

## 3. 🛠️ HOW IT WORKS

### Critical Naming Pattern

**The #1 most common error** when using Code Mode is using wrong function names. All MCP tool calls MUST follow this pattern:

```typescript
{manual_name}.{manual_name}_{tool_name}
```

**Examples**:

✅ **Correct**:
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
await figma.figma_get_file({...});
```

❌ **Wrong** (missing manual prefix):
```typescript
await webflow.sites_list({});        // Error: Tool not found
await clickup.create_task({...});    // Error: Tool not found
```

**See [references/naming_convention.md](references/naming_convention.md) for complete guide with troubleshooting.**


### Context Parameter

Many Code Mode tools require a `context` parameter (15-25 words) for analytics:

```typescript
await webflow.webflow_sites_list({ 
  context: "Listing sites to identify collection structure for CMS update" 
});
```

This helps with usage tracking and debugging.

### Tool Name Translation

> **Note:** `list_tools()` returns names in `a.b.c` format (e.g., `webflow.webflow.sites_list`). To call the tool, use underscore format: `webflow.webflow_sites_list()`. The `tool_info()` function shows the correct calling syntax.

### Basic Workflow

**Step 1: Discover Tools**

```typescript
// Progressive discovery - search for relevant tools
search_tools({
  task_description: "clickup task management",
  limit: 10
});

// Returns: Tool names and descriptions (minimal tokens)
// Example: ["clickup.clickup_create_task", "clickup.clickup_get_task", ...]
```

**Step 2: Call Tools via Code Mode**

```typescript
// Execute TypeScript with direct tool access
call_tool_chain({
  code: `
    // Note the naming pattern: {manual_name}.{manual_name}_{tool_name}
    const result = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });

    console.log('Task created:', result.id);
    return result;
  `
});
```

**Step 3: Multi-Tool Orchestration**

```typescript
// State persists across tool calls in single execution
call_tool_chain({
  code: `
    // Step 1: Get Figma design
    const design = await figma.figma_get_file({ fileId: "abc123" });

    // Step 2: Create ClickUp task (design data available)
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
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

## 4. 🏗️ PROJECT CONFIGURATION

### Two MCP Configuration Systems

**IMPORTANT**: Code Mode only accesses tools in `.utcp_config.json`. Native MCP tools are NOT accessed through Code Mode.

**1. Native MCP** (`opencode.json`) - Direct tools (call directly, NOT through Code Mode):
- **Sequential Thinking**: `sequential_thinking_sequentialthinking()`
- **Spec Kit Memory**: `spec_kit_memory_memory_search()`, `spec_kit_memory_memory_save()`, etc.
- **Code Mode server**: The Code Mode tool itself
- **Note**: Some AI environments have built-in extended thinking capabilities that may supersede Sequential Thinking MCP.

**Code Mode MCP tools** (accessed via `call_tool_chain()`):
- **Narsil**: `narsil.narsil_find_symbols()`, `narsil.narsil_neural_search()`, `narsil.narsil_get_project_structure()` - Semantic + structural code analysis via Rust-powered AST

**2. Code Mode MCP** (`.utcp_config.json`) - External tools accessed through Code Mode:
- **MCP Config**: `.utcp_config.json` (project root)
- **Environment Variables**: `.env` (project root)
- **External tools**: Webflow, Figma, Chrome DevTools, ClickUp, Notion, etc.
- These are accessed via `call_tool_chain()` wrapper

### How to Discover Available Code Mode Tools

**These discovery methods ONLY work for Code Mode tools in `.utcp_config.json`**
**They do NOT show Sequential Thinking (which is in `.mcp.json`)**

**Step 1: Check Configuration**
```typescript
// Read .utcp_config.json to see configured Code Mode MCP servers
// Look for "manual_call_templates" array
// Each object has a "name" field (this is the manual name)
// Check "disabled" field - if true, server is not active

// NOTE: Sequential Thinking is NOT in this file
// Sequential Thinking is in .mcp.json and called directly
```

**Step 2: Use Progressive Discovery**
```typescript
// Search for Code Mode tools by description
const tools = await search_tools({
  task_description: "browser automation",
  limit: 10
});

// List all available Code Mode tools
const allTools = await list_tools();

// Get info about a specific Code Mode tool
const info = await tool_info({
  tool_name: "server_name.server_name_tool_name"
});

// NOTE: These discovery tools are part of Code Mode
// They only show tools configured in .utcp_config.json
// Sequential Thinking will NOT appear in these results
```

### Critical Naming Convention (Code Mode Tools Only)

**See Section 3: Critical Naming Pattern for the complete guide.**

**Quick reminder**: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list()`)

**Sequential Thinking Exception**:
- NOT in `.utcp_config.json` - uses native MCP tools
- Call directly: `sequential_thinking_sequentialthinking()`
- Does NOT use `call_tool_chain()`
- Sequential Thinking MCP provides structured reasoning for complex multi-step problems.

### Configuration Structure

```json
{
  "manual_call_templates": [
    {
      "name": "manual_name",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "manual_name": {
            "transport": "stdio",
            "command": "npx",
            "args": ["package-name"],
            "env": {},
            "disabled": false
          }
        }
      }
    }
  ]
}
```

### Generic Multi-Tool Workflow Pattern

```typescript
call_tool_chain({
  code: `
    // Step 1: Discover what tools are available
    const availableTools = await search_tools({
      task_description: "your task here",
      limit: 10
    });

    console.log("Available tools:", availableTools);

    // Step 2: Call tools using correct naming pattern
    // Pattern: {manual_name}.{manual_name}_{tool_name}
    const result = await manual_name.manual_name_tool_name({
      // parameters here
    });

    // Step 3: Chain multiple tools if needed
    const result2 = await another_manual.another_manual_other_tool({
      data: result.output
    });

    return { result, result2 };
  `,
  timeout: 60000
});
```

### How to Check Active Code Mode Servers

**IMPORTANT**: This only shows Code Mode servers in `.utcp_config.json`, NOT Sequential Thinking

```typescript
// This code shows how to discover what Code Mode tools are configured
call_tool_chain({
  code: `
    // List all available tools from all active Code Mode MCP servers
    // NOTE: This will NOT include Sequential Thinking
    const allTools = await list_tools();

    // Group by server (manual name is prefix before first dot)
    const servers = {};
    allTools.forEach(tool => {
      const serverName = tool.split('.')[0];
      if (!servers[serverName]) servers[serverName] = [];
      servers[serverName].push(tool);
    });

    console.log("Active Code Mode servers:", Object.keys(servers));
    console.log("Tool counts:", Object.fromEntries(
      Object.entries(servers).map(([k, v]) => [k, v.length])
    ));

    console.log("NOTE: Sequential Thinking is NOT in this list");
    console.log("Sequential Thinking is a native MCP tool, not a Code Mode tool");

    return servers;
  `
});
```

---

## 5. 📋 RULES

### ✅ ALWAYS

- **Use Code Mode for ALL MCP tool calls** - Mandatory for ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.
- **Follow naming pattern**: `{manual_name}.{manual_name}_{tool_name}` (see [naming_convention.md](references/naming_convention.md))
- **Use progressive discovery**: `search_tools()` before calling unknown tools
- **Use try/catch** for error handling in multi-step workflows
- **Set appropriate timeouts**: 30s (simple), 60s (complex), 120s+ (very complex)
- **Console.log progress** in complex workflows for debugging
- **Structure return values** consistently: `{ success, data, errors, timestamp }`

### ❌ NEVER

- **Skip Code Mode for MCP tools** - Direct MCP calls cause context exhaustion
- **Use wrong naming pattern** - `webflow.sites_list` instead of `webflow.webflow_sites_list`
- **Guess tool names** - Use `search_tools()` to discover correct names
- **Ignore TypeScript errors** - Type safety prevents runtime errors
- **Skip error handling** - Unhandled errors crash entire workflow
- **Use Code Mode for file operations** - Use Read/Write/Edit tools instead
- **Assume tool availability** - Verify with `list_tools()` first

### ⚠️ ESCALATE IF

- **Tool naming errors persist** after consulting [naming_convention.md](references/naming_convention.md)
- **Configuration fails to load** - Check [configuration.md](references/configuration.md)
- **Environment variables not found** - Verify .env file exists and syntax is correct
- **MCP server fails to start** - Check command/args in .utcp_config.json
- **Tools not discovered** - Verify manual name matches configuration
- **Execution timeout** - Increase timeout or break into smaller operations
- **Need to add new MCP server** - Follow guide in [configuration.md](references/configuration.md)

---

## 6. 🏆 SUCCESS CRITERIA

**Code Mode implementation complete when**:

- ✅ All MCP tool calls use `call_tool_chain` (no direct tool calls)
- ✅ Tool naming follows `{manual_name}.{manual_name}_{tool_name}` pattern
- ✅ Progressive discovery used (`search_tools` before calling)
- ✅ Error handling implemented (try/catch for critical operations)
- ✅ Console logging tracks workflow progress
- ✅ Return values structured consistently
- ✅ Timeouts set appropriately for workflow complexity
- ✅ Configuration validated (`.utcp_config.json` and `.env` correct)
- ✅ Type safety verified (no TypeScript errors)
- ✅ Multi-tool workflows execute atomically (all succeed or all fail)

---

## 7. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Cross-Skill Collaboration

**Pairs with mcp-narsil**:
- Use **mcp-narsil** for semantic + structural code search (via Code Mode)
- Use **mcp-code-mode** for external tool integration (Webflow, Figma, ClickUp, etc.)
- Example: Search codebase → Create ClickUp task → Update Notion docs

**Workflow**:
```typescript
// All Code Mode - single execution for code search + task creation
call_tool_chain({
  code: `
    // 1. Find relevant code using Narsil semantic search
    const searchResults = await narsil.narsil_neural_search({
      query: "authentication implementation",
      top_k: 5
    });

    // 2. Create task based on search results
    const task = await clickup.clickup_create_task({
      name: "Refactor authentication",
      description: \`Found in: \${searchResults.results.map(r => r.file).join(', ')}\`
    });

    return { searchResults, task };
  `
});
```

### Triggers

**Automatic activation when**:
- User mentions MCP tool names (ClickUp, Notion, Figma, Webflow, etc.)
- Request involves external tool integration
- Multi-tool workflow described
- Browser automation needed (Chrome DevTools)

### Outputs

**What Code Mode produces**:
- External tool operation results (tasks created, data fetched, etc.)
- Workflow execution logs (console.log captured)
- Error details (if failures occur)
- State snapshots (all variables returned)

---

## 8. 📦 REFERENCES

### Configuration
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [configuration.md](references/configuration.md) | Setup guide | .utcp_config.json structure |
| [env_template.md](assets/env_template.md) | Environment variables | API key patterns |
| [config_template.md](assets/config_template.md) | Config examples | Server definitions |

### Tool Documentation
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [naming_convention.md](references/naming_convention.md) | Tool naming patterns | `{manual}.{manual}_{tool}` |
| [tool_catalog.md](references/tool_catalog.md) | Available tools | By server category |
| [workflows.md](references/workflows.md) | Usage patterns | Multi-tool examples |

### Architecture
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [architecture.md](references/architecture.md) | System design | Performance benefits |
| [README.md](README.md) | Overview | Quick start |

---

## 9. 🏎️ QUICK REFERENCE

### Essential Commands

```typescript
// 1. Discover tools
search_tools({ task_description: "webflow site management", limit: 10 });

// 2. Get tool details
tool_info({ tool_name: "webflow.webflow_sites_list" });

// 3. List all tools
list_tools();

// 4. Call single tool
call_tool_chain({
  code: `await webflow.webflow_sites_list({})`
});

// 5. Multi-tool workflow with error handling
call_tool_chain({
  code: `
    try {
      const result1 = await tool1.tool1_action({...});
      const result2 = await tool2.tool2_action({...});
      return { success: true, result1, result2 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});

// 6. Parallel execution of independent operations
call_tool_chain({
  code: `
    const [sites, tasks, figmaFile] = await Promise.all([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_tasks({ listName: "Development" }),
      figma.figma_get_file({ fileKey: "abc123" })
    ]);
    
    return { 
      siteCount: sites.length,
      taskCount: tasks.length,
      figmaName: figmaFile.name
    };
  `
});
```

### Parallel Execution Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| `Promise.all()` | All must succeed | `const [a, b] = await Promise.all([fnA(), fnB()])` |
| `Promise.allSettled()` | Partial success OK | `const results = await Promise.allSettled([...])` |
| Batch processing | Many items, rate limits | `processInBatches(items, 3, processor)` |
| Parallel → Sequential | Fetch then process | Phase 1: parallel fetch, Phase 2: sequential use |

**See [references/workflows.md](references/workflows.md) Section 7 for comprehensive parallel execution examples.**

### Critical Naming Pattern

**See Section 3: Critical Naming Pattern for the complete guide with examples.**

**Pattern**: `{manual_name}.{manual_name}_{tool_name}`

### Timeout Guidelines

- **Simple (1-2 tools)**: 30s (default)
- **Complex (3-5 tools)**: 60s
- **Very complex (6+ tools)**: 120s+

---

## 10. 🔗 RELATED RESOURCES

### scripts/

| Script | Purpose | Usage |
|--------|---------|-------|
| **update-code-mode.sh** | Update to latest version | `bash .opencode/skill/mcp-code-mode/scripts/update-code-mode.sh` |
| **validate_config.py** | Validate configuration | `python3 scripts/validate_config.py <config-path> --check-env <env-path>` |

### references/

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| **naming_convention.md** | Tool naming pattern | CRITICAL - read first for errors |
| **configuration.md** | Setup guide | .utcp_config.json and .env |
| **tool_catalog.md** | Available tools | 250+ tools across 8 servers |
| **workflows.md** | Usage patterns | 5 comprehensive examples |
| **architecture.md** | System design | Token economics |

### assets/

| Asset | Purpose |
|-------|---------|
| **config_template.md** | .utcp_config.json template |
| **env_template.md** | .env template with API key placeholders |

### External Resources

- [Code Mode GitHub](https://github.com/universal-tool-calling-protocol/code-mode) - Source code and documentation
- [MCP Specification](https://modelcontextprotocol.io/) - Model Context Protocol standard

### Performance Metrics

| Metric | Traditional | Code Mode | Improvement |
|--------|-------------|-----------|-------------|
| Context tokens | 141k (47 tools) | 1.6k (200+ tools) | 98.7% reduction |
| Execution time | ~2000ms (4 tools) | ~300ms (4 tools) | 60% faster |
| API round trips | 15+ | 1 | 93% reduction |

### Related Skills

- **[mcp-narsil](../mcp-narsil/SKILL.md)** - Semantic + structural code search (via Code Mode)
- **[mcp-figma](../mcp-figma/SKILL.md)** - Figma design file access (via Code Mode)

### Install Guide

- [MCP - Code Mode.md](../../install_guides/MCP/MCP%20-%20Code%20Mode.md) - Installation and configuration