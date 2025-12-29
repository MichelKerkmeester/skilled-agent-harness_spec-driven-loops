---
title: System Architecture - Code Mode UTCP
description: Architecture, data flow, and execution environment for Code Mode UTCP.
---

# System Architecture - Code Mode UTCP

Understand how Code Mode UTCP achieves 98.7% token savings while providing access to 200+ tools.

---

## 1. 📖 OVERVIEW

### What is Code Mode UTCP?

**Code Mode UTCP** is an MCP orchestration layer that executes TypeScript code with direct access to multiple MCP servers, eliminating traditional tool-calling overhead through progressive disclosure.

**Key innovation:** Instead of exposing 200+ tools directly to AI agents, Code Mode provides a single execution environment where tools are accessed programmatically and loaded on-demand.

---

## 2. 🏗️ ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: AI Agent (OpenCode, Cline, etc.)                  │
│                                                             │
│  Sees: Only 3 tools in context (~1.6k tokens)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • call_tool_chain     (Execute TypeScript)            │  │
│  │ • search_tools        (Progressive discovery)         │  │
│  │ • list_tools          (List all available)            │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Sends TypeScript Code
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Code Mode MCP Server                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  TypeScript Execution Environment (V8 Isolate)        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Security Sandbox                               │  │  │
│  │  │  • Isolated execution context                   │  │  │
│  │  │  • No file system access (unless MCP grants)     │  │  │
│  │  │  • Timeout protection (configurable)             │  │  │
│  │  │  • Output size limits (200k chars default)      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Progressive Tool Loading                       │  │  │
│  │  │  • Tools loaded on-demand via namespaces        │  │  │
│  │  │  • Only requested tool interfaces in context    │  │  │
│  │  │  • Zero upfront context cost                    │  │  │
│  │  │  • Scales to unlimited MCP servers              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Execution Capabilities                         │  │  │
│  │  │  • Full TypeScript/JavaScript support           │  │  │
│  │  │  • Async/await for concurrent operations        │  │  │
│  │  │  • Try/catch error handling                     │  │  │
│  │  │  • State persistence within execution           │  │  │
│  │  │  • Console.log() captured and returned          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────┬───────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ Calls Registered Tools
                           │
                           ▼
         ┌─────────────────┴─────────────────┐
         │                                   │
┌────────▼────────┐  ┌───────▼────────┐  ┌──▼──────────┐
│  Webflow         │  │  ClickUp       │  │  Figma      │
│  MCP Server     │  │  MCP Server    │  │  MCP Server │
│  (40+ tools)    │  │  (20+ tools)   │  │  (15+ tools)│
└─────────────────┘  └────────────────┘  └─────────────┘
         │                   │                  │
         └───────────────────┼──────────────────┘
                             │
         ┌───────────────────┴──────────────────┐
         │                                      │
┌────────▼────────┐  ┌──────────▼─────────┐  ┌▼────────────┐
│  Notion         │  │  Chrome DevTools   │  │  Video      │
│  MCP Server     │  │  (2 instances)     │  │  Audio      │
│  (20+ tools)    │  │  (52 tools total)  │  │  (30+ tools)│
└─────────────────┘  └────────────────────┘  └─────────────┘
```

---

## 3. 🧱 THE "2-3 MCP SERVER WALL" PROBLEM

### Traditional Approach (Before Code Mode)

**Problem:** Each MCP tool consumes tokens in context

```
Traditional MCP Setup:
├─ Tool 1: ~3,000 tokens (schema + description)
├─ Tool 2: ~3,000 tokens
├─ Tool 3: ~3,000 tokens
├─ ...
└─ Tool 47: ~3,000 tokens

Total: ~141,000 tokens for 47 tools
Practical limit: 2-3 MCP servers before context exhaustion
Result: UNUSABLE with 200k context window
```

**Breakdown:**
- Each tool requires schema definition
- Descriptions for AI understanding
- Type definitions for parameters
- Example usage patterns

**Impact:**
- Can only use 2-3 MCP servers total
- Must choose which servers to include
- Context window fills quickly
- No room for actual conversation

### Code Mode Solution

**Solution:** Progressive disclosure + single execution environment

```
Code Mode UTCP Setup:
├─ call_tool_chain: ~600 tokens
├─ search_tools: ~500 tokens
├─ list_tools: ~500 tokens

Total: ~1,600 tokens for unlimited MCP access
All 8 MCP servers (200+ tools): FULLY ACCESSIBLE
Result: 98.7% token savings, unlimited scalability
```

**How it works:**
1. Only 3 tools visible to AI initially
2. Tools discovered progressively via `search_tools()`
3. Tool schemas loaded on-demand
4. Execution happens in sandbox with direct tool access

**Impact:**
- Access all 200+ tools
- Use any combination of MCP servers
- Context stays clean
- 98.7% reduction in overhead

---

## 4. 💰 TOKEN ECONOMICS

| Approach                     | Tokens Consumed | Tools Visible | Tools Accessible | Usable?                   |
| ---------------------------- | --------------- | ------------- | ---------------- | ------------------------- |
| **Traditional (10 tools)**   | ~30,000         | 10            | 10               | ✅ Yes                     |
| **Traditional (47 tools)**   | ~141,000        | 47            | 47               | ❌ No (context exhaustion) |
| **Traditional (200+ tools)** | ~600,000+       | 200+          | 200+             | ❌ No (impossible)         |
| **Code Mode UTCP**           | ~1,600          | 3             | 200+             | ✅ Yes (98% savings)       |

**Key insight:** Code Mode breaks the linear scaling problem - adding more tools doesn't increase context overhead.

---

## 5. 🔄 DATA FLOW

### Single-Step Execution

**Flow:**
1. AI calls `call_tool_chain({ code: "..." })`
2. Code Mode MCP server receives TypeScript code
3. V8 Isolate executes code with tool namespaces available
4. Code calls `await manual.manual_tool(params)`
5. MCP server routes call to appropriate MCP server
6. Results captured and returned to V8 context
7. Final results + logs returned to AI

**Example:**

```
AI Agent
  ↓ (1) call_tool_chain({ code: "await webflow.webflow_sites_list({})" })
Code Mode MCP
  ↓ (2) Execute in V8 Isolate
V8 Sandbox
  ↓ (3) await webflow.webflow_sites_list({})
Webflow MCP Server
  ↓ (4) Fetch sites from Webflow API
  ↓ (5) Return { sites: [...] }
V8 Sandbox
  ↓ (6) Capture result
Code Mode MCP
  ↓ (7) Return { result: { sites: [...] }, logs: [...] }
AI Agent
```

### Multi-Step Workflow

**Flow:**
1. AI calls `call_tool_chain` with complex workflow code
2. V8 Isolate maintains state throughout execution
3. Multiple async operations execute (sequential or parallel)
4. Tool discovery, schema inspection, and tool calls in one execution
5. Aggregated results + logs returned to AI

**Example (Figma → ClickUp → Webflow):**

```
AI Agent
  ↓ call_tool_chain({ code: "/* multi-tool workflow */" })
Code Mode MCP
  ↓ Execute in V8 Isolate
V8 Sandbox (State Persisted)
  ├─ (1) const design = await figma.figma_get_file()
  │   ↓ Figma MCP → Returns design data
  │   ↓ State: { design }
  ├─ (2) const task = await clickup.clickup_create_task({ name: design.name })
  │   ↓ ClickUp MCP → Returns task data
  │   ↓ State: { design, task }
  └─ (3) const cms = await webflow.webflow_collections_items_create({ data: { design, task } })
      ↓ Webflow MCP → Returns CMS item
      ↓ State: { design, task, cms }
      ↓ return { design, task, cms }
Code Mode MCP
  ↓ Return { result: { design, task, cms }, logs: [...] }
AI Agent
```

**Key benefits:**
- State persists across all operations
- Data flows naturally between tools
- Single execution (no round trips)
- Atomic workflow (all succeed or all fail)

### Progressive Tool Loading

**Flow:**
1. AI calls `search_tools({ task_description: "..." })`
2. Code Mode searches tool repository
3. Returns matching tool names + descriptions (no full schemas)
4. AI calls `tool_info({ tool_name: "..." })` if needed
5. Full TypeScript interface returned for specific tool
6. AI generates code using discovered tools
7. Code executed via `call_tool_chain`

**Example:**

```
AI Agent
  ↓ search_tools({ task_description: "webflow collections" })
Code Mode MCP
  ↓ Search tool repository (keyword matching)
  ↓ Return: [
      { name: "webflow.webflow_collections_list", description: "..." },
      { name: "webflow.webflow_collections_get", description: "..." }
    ]
AI Agent
  ↓ tool_info({ tool_name: "webflow.webflow_collections_list" })
Code Mode MCP
  ↓ Load full interface for specific tool
  ↓ Return: `function webflow_collections_list(params: { site_id: string }): Promise<...>`
AI Agent
  ↓ Generate code using interface
  ↓ call_tool_chain({ code: "await webflow.webflow_collections_list({ site_id: '...' })" })
Code Mode MCP
  ↓ Execute code
```

**Why this works:**
- Initial search only returns tool names (minimal tokens)
- Full interfaces loaded only when needed
- Zero upfront cost for unused tools
- Scales to unlimited tools

---

## 6. ⚙️ EXECUTION ENVIRONMENT

### V8 Isolate Sandbox

**What it is:** Isolated JavaScript execution context (same engine as Chrome/Node.js)

**Security features:**
- ✅ Isolated execution (cannot access host file system)
- ✅ Timeout protection (configurable, default 30s)
- ✅ Output size limits (200,000 characters default)
- ✅ Memory limits (prevents runaway processes)
- ❌ No direct file system access (unless MCP grants it)
- ❌ No network access (except via MCP tools)
- ❌ No process spawning

**What you CAN do:**
- Execute TypeScript/JavaScript code
- Call MCP tools via namespaces
- Use async/await
- Handle errors with try/catch
- Persist state within single execution
- Use console.log() (captured and returned)
- Perform complex data transformations
- Loop, condition, function definitions

**What you CANNOT do:**
- Access host file system directly
- Make HTTP requests directly (use MCP tools)
- Spawn processes
- Execute indefinitely (timeout applies)
- Exceed output size limits

### Capabilities

**Full TypeScript/JavaScript Support:**
```typescript
// Variables and constants
const siteId = "abc123";
let results = [];

// Functions
function formatDate(date) {
  return new Date(date).toISOString();
}

// Loops
for (const site of sites) {
  results.push(site.id);
}

// Async/await
const data = await tool.call();

// Try/catch
try {
  const result = await tool.call();
} catch (error) {
  console.error('Error:', error.message);
}

// Array methods
const ids = items.map(i => i.id);
const filtered = items.filter(i => i.status === 'active');
```

**State Persistence:**
```typescript
// State persists throughout execution
const design = await figma.figma_get_file({ fileId: "..." });
// design variable available for rest of execution

const task = await clickup.clickup_create_task({
  name: design.name  // Can use design data
});

const cms = await webflow.webflow_collections_items_create({
  data: {
    designUrl: design.url,  // Still available
    taskUrl: task.url       // And task data
  }
});

return { design, task, cms };  // All data returned
```

---

## 7. 🔧 CONFIGURATION INTEGRATION

### How .utcp_config.json Connects

**Configuration file defines available tools:**

```json
{
  "manual_call_templates": [
    {
      "name": "webflow",          // Becomes namespace
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "webflow": {
            "transport": "stdio",
            "command": "npx",
            "args": ["mcp-remote", "https://mcp.webflow.com/sse"]
          }
        }
      }
    }
  ]
}
```

**Runtime behavior:**
1. Code Mode loads `.utcp_config.json` on startup
2. Creates namespace for each `name` field (`webflow`, `clickup`, etc.)
3. Registers MCP servers with tool repository
4. Makes namespaces available in V8 sandbox
5. Routes tool calls to appropriate MCP server

**In execution:**
```typescript
// "webflow" namespace available because config has:
// { "name": "webflow", ... }

await webflow.webflow_sites_list({});
//    ↑ namespace from config
```

---

## 8. ⚡ PERFORMANCE CHARACTERISTICS

### Execution Speed

| Operation                 | Time   | Notes                             |
| ------------------------- | ------ | --------------------------------- |
| **Single tool call**      | ~300ms | Including V8 startup + execution  |
| **Multi-tool (3 tools)**  | ~500ms | Sequential execution              |
| **Multi-tool (5 tools)**  | ~800ms | Sequential execution              |
| **Multi-tool (parallel)** | ~400ms | Promise.all() for independent ops |

**Comparison to traditional:**
- Traditional (3 tools sequentially): ~1500ms (3× 500ms)
- Code Mode (3 tools sequentially): ~500ms
- **Result:** 3× faster

### Token Consumption

| Approach        | Initial Load | Per Tool         | Total (47 tools) | Total (200+ tools) |
| --------------- | ------------ | ---------------- | ---------------- | ------------------ |
| **Traditional** | ~5k          | ~3k              | ~141k            | ~600k+             |
| **Code Mode**   | ~1.6k        | ~0 (progressive) | ~1.6k            | ~1.6k              |

**Savings:** 98.7% reduction in context overhead

### Scalability

**Traditional approach:** Linear scaling (unusable beyond 2-3 servers)

```
Tools:     10      20      30      47      100     200
Tokens:    30k     60k     90k    141k    300k    600k
Usable?    ✅      ✅      ❌     ❌      ❌      ❌
```

**Code Mode approach:** Constant overhead (unlimited servers)

```
Tools:     10      20      30      47      100     200+
Tokens:    1.6k    1.6k    1.6k    1.6k    1.6k    1.6k
Usable?    ✅      ✅      ✅     ✅      ✅      ✅
```

---

## 9. ✨ ARCHITECTURE BENEFITS

### 1. Context Efficiency

**Before:** 141,000 tokens for 47 tools
**After:** 1,600 tokens for 200+ tools
**Savings:** 98.7%

### 2. Execution Speed

**Before:** 15+ API round trips for multi-tool workflow
**After:** 1 execution (internally calls multiple tools)
**Improvement:** 5× faster

### 3. State Management

**Before:** Manual state tracking across AI context
**After:** Automatic state persistence in V8 sandbox
**Benefit:** Natural data flow between operations

### 4. Error Handling

**Before:** Error handling in AI layer (complex)
**After:** Built-in try/catch in TypeScript
**Benefit:** Robust, familiar error patterns

### 5. Developer Experience

**Before:** Multiple tool calls, context switching, manual orchestration
**After:** Single TypeScript workflow, natural programming
**Benefit:** Faster development, fewer bugs

---

## 10. 📝 SUMMARY

**Architecture highlights:**

1. **Three-layer system:** AI Agent → Code Mode MCP → MCP Servers
2. **Progressive disclosure:** Tools loaded on-demand (zero upfront cost)
3. **V8 Isolate sandbox:** Secure, isolated execution environment
4. **Token efficiency:** 98.7% reduction vs traditional approach
5. **Execution speed:** 5× faster than traditional multi-tool workflows
6. **Unlimited scalability:** Add MCP servers without context penalty

**Key innovation:** Breaking the linear scaling problem through progressive tool disclosure and sandboxed execution.

**Result:** 200+ tools accessible with same context overhead as 3 tools in traditional approach.

---

## 11. 🔗 RELATED RESOURCES

### Reference Files
- [configuration.md](./configuration.md) - Complete configuration guide for .utcp_config.json
- [naming_convention.md](./naming_convention.md) - Critical naming patterns for tool calls
- [tool_catalog.md](./tool_catalog.md) - Complete list of 200+ available MCP tools
- [workflows.md](./workflows.md) - Complex multi-tool workflow examples

### Related Skills
- `mcp-narsil` - Semantic + structural code search (via Code Mode)
