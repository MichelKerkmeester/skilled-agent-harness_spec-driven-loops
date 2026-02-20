---
description: "When to trigger Code Mode and when to use native MCP instead."
---
# When To Use Code Mode

## 1. WHEN TO USE

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

<!-- /ANCHOR:when-to-use -->
