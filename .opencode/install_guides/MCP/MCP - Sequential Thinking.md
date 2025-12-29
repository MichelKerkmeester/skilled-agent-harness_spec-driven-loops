# Sequential Thinking MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the Sequential Thinking MCP server for dynamic problem-solving and structured reasoning.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `@modelcontextprotocol/server-sequential-thinking` | **Dependencies**: Node.js 18+

---

#### TABLE OF CONTENTS

0. [🤖 AI INSTALL GUIDE](#0--ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [⚙️ CONFIGURATION](#3-️-configuration)
4. [✅ VERIFICATION](#4--verification)
5. [🎯 WHEN TO USE](#5--when-to-use)
6. [🚀 USAGE](#6--usage)
7. [📝 PARAMETERS](#7--parameters)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 0. 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Sequential Thinking MCP server (@modelcontextprotocol/server-sequential-thinking)

Please help me:
1. Check if I have Node.js 18+ installed
2. Configure the MCP server for my environment (I'm using: [OpenCode / VS Code Copilot / Claude Desktop])
3. Verify the installation is working

This is an npx package - no manual installation needed. Guide me through the configuration.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Add the correct configuration to your platform's config file
- Test that the `sequential_thinking_sequentialthinking` tool is accessible
- Show you how to use dynamic thinking with branching and revisions

**Expected setup time:** 2-3 minutes

---

## 1. 📖 OVERVIEW

Sequential Thinking is an official Model Context Protocol (MCP) server that enables dynamic, reflective problem-solving through structured thought sequences. Unlike rigid frameworks, it allows flexible thinking that can adapt and evolve as understanding deepens.

### Source Repository

| Property    | Value                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub**  | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)                   |
| **npm**     | [@modelcontextprotocol/server-sequential-thinking](https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking) |
| **License** | MIT                                                                                                                                |

> **Note**: This is an official MCP server maintained by the Model Context Protocol organization.

### Key Features

- **Dynamic Thought Sequences**: Adjust the number of thoughts as needed during analysis
- **Branching Exploration**: Explore alternative approaches from any thought point
- **Revision Support**: Reconsider and revise previous thoughts when new insights emerge
- **Flexible Structure**: No predefined stages - adapt the thinking process to your problem
- **Progress Tracking**: Monitor your position in the thought sequence
- **Zero Installation**: Runs via npx - no manual installation required

### How It Works

```
Start Thinking → Record Thought 1 → Record Thought 2 → ... → Final Conclusion
                      ↓                    ↓
                 [Revise if needed]   [Branch to explore alternatives]
```

The tool supports:
- **Linear progression**: Move through thoughts sequentially
- **Revisions**: Go back and reconsider earlier assumptions
- **Branching**: Explore multiple solution paths simultaneously
- **Dynamic adjustment**: Increase or decrease total thoughts as needed

---

## 2. 📋 PREREQUISITES

### Required

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```

- **npm/npx** (included with Node.js)
  ```bash
  npx --version
  ```

- **OpenCode CLI** or **VS Code with GitHub Copilot** or **Claude Desktop**

### That's It!

No additional installation needed. The server runs via `npx` which downloads and executes it automatically.

---

## 3. ⚙️ CONFIGURATION

Sequential Thinking MCP can be configured for different AI platforms:

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Option B: Configure for VS Code Copilot

#### Method 1: Workspace Configuration

Create `.vscode/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

#### Method 2: User Settings

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Option C: Configure for Claude Desktop

Add to `claude_desktop_config.json`:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

---

## 4. ✅ VERIFICATION

### Check 1: Verify in OpenCode

```bash
# Start OpenCode session
opencode

# Check MCP servers
> List available MCP tools

# Expected: sequential_thinking_sequentialthinking should appear
```

### Check 2: Verify in VS Code Copilot

1. Open VS Code in configured workspace
2. Open Copilot Chat (Cmd+I / Ctrl+I)
3. Select **Agent Mode** from popup menu
4. Click **tools icon** (top left)
5. Look for `sequential_thinking_sequentialthinking` tool

### Check 3: Test the Tool

Ask your AI assistant:
```
Use sequential thinking to analyze: "What's the best approach to organize this task?"
```

Expected: AI should invoke the tool and show structured thinking output.

---

## 5. 🎯 WHEN TO USE

### Use Sequential Thinking When:

| Scenario                        | Why It Helps                                           |
| ------------------------------- | ------------------------------------------------------ |
| **Multi-step debugging**        | Standard approaches failed; need systematic analysis   |
| **Architectural decisions**     | Significant trade-offs require structured evaluation   |
| **Complex refactoring**         | Changes span 3+ files with dependencies                |
| **User requests deep analysis** | Keywords: "think hard", "ultrathink", "analyze deeply" |
| **Unfamiliar territory**        | Need to explore options before committing              |

### Skip Sequential Thinking When:

| Scenario                  | Why Skip                                      |
| ------------------------- | --------------------------------------------- |
| **Simple fixes**          | Single-file changes with obvious solutions    |
| **Straightforward tasks** | Clear path forward, no trade-offs             |
| **Near context limit**    | Already using significant context             |
| **Speed priority**        | Quick response matters more than thoroughness |
| **Routine operations**    | File operations, simple refactors             |

### Token Cost

**Typical usage:** ~1,500-2,500 tokens per thinking session

Consider this overhead when deciding whether to invoke the tool.

---

## 6. 🚀 USAGE

### Invocation

Sequential Thinking is a **native MCP tool** - call it directly:

```typescript
sequential_thinking_sequentialthinking({
  thought: "Your current thinking step",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

### Natural Language Triggers

The AI will typically invoke this tool when you:

```
Think through this step by step...
Analyze this systematically...
I need to work through a complex decision about...
Help me reason through this problem...
Think hard about this...
```

### Thinking Patterns

**Linear Analysis:**
```
Thought 1 → Thought 2 → Thought 3 → Conclusion
```

**With Revision:**
```
Thought 1 → Thought 2 → Revise Thought 1 → Thought 3 → Conclusion
```

**With Branching:**
```
Thought 1 → Thought 2 → Branch A: Thought 3a → ...
                      ↘ Branch B: Thought 3b → ...
```

---

## 7. 📝 PARAMETERS

### Required Parameters

| Parameter           | Type    | Description                                       |
| ------------------- | ------- | ------------------------------------------------- |
| `thought`           | string  | Your current thinking step content                |
| `thoughtNumber`     | integer | Position in sequence (1, 2, 3...)                 |
| `totalThoughts`     | integer | Estimated total thoughts needed (can adjust)      |
| `nextThoughtNeeded` | boolean | `true` if more thinking needed, `false` when done |

### Optional Parameters

| Parameter           | Type    | Description                                               |
| ------------------- | ------- | --------------------------------------------------------- |
| `isRevision`        | boolean | Set `true` when reconsidering a previous thought          |
| `revisesThought`    | integer | Which thought number is being revised                     |
| `branchFromThought` | integer | Thought number where branch starts                        |
| `branchId`          | string  | Identifier for the current branch (e.g., "alternative-a") |
| `needsMoreThoughts` | boolean | Signal that more thoughts are needed beyond current total |

### Dynamic Adjustment

The `totalThoughts` parameter can be adjusted at any point:

```typescript
// Started with 3 thoughts, realized we need more
sequential_thinking_sequentialthinking({
  thought: "This is more complex than expected...",
  thoughtNumber: 3,
  totalThoughts: 6,  // Increased from 3
  needsMoreThoughts: true,
  nextThoughtNeeded: true
})
```

---

## 8. 💡 EXAMPLES

### Example 1: Basic Analysis

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Analyzing the authentication flow. Current implementation uses JWT tokens stored in localStorage, which has XSS vulnerability concerns.",
  thoughtNumber: 1,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 2
sequential_thinking_sequentialthinking({
  thought: "Alternative approaches: 1) HttpOnly cookies (better security), 2) Session tokens (stateful), 3) Token rotation (complexity trade-off).",
  thoughtNumber: 2,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 3
sequential_thinking_sequentialthinking({
  thought: "HttpOnly cookies provide XSS protection with minimal implementation changes. Need to handle CSRF separately.",
  thoughtNumber: 3,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 4 - Conclusion
sequential_thinking_sequentialthinking({
  thought: "Recommendation: Migrate to HttpOnly cookies with SameSite=Strict. Add CSRF token for state-changing requests. Implementation effort: ~4 hours.",
  thoughtNumber: 4,
  totalThoughts: 4,
  nextThoughtNeeded: false
})
```

### Example 2: With Revision

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Initial assumption: The performance issue is in the database query.",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})

// Thought 2
sequential_thinking_sequentialthinking({
  thought: "Query profiling shows 50ms response time - actually quite fast.",
  thoughtNumber: 2,
  totalThoughts: 5,
  nextThoughtNeeded: true
})

// Thought 3 - Revising Thought 1
sequential_thinking_sequentialthinking({
  thought: "Revising my earlier assumption: The bottleneck is NOT in the database. Looking at network waterfall, the issue is N+1 API calls from the frontend.",
  thoughtNumber: 3,
  totalThoughts: 5,
  isRevision: true,
  revisesThought: 1,
  nextThoughtNeeded: true
})

// Continue with corrected understanding...
```

### Example 3: With Branching

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Need to choose between microservices and monolith for the new e-commerce platform.",
  thoughtNumber: 1,
  totalThoughts: 6,
  nextThoughtNeeded: true
})

// Thought 2 - Branch A: Microservices
sequential_thinking_sequentialthinking({
  thought: "Branch A - Microservices: Better scalability, independent deployments. But: Team of 5 developers, 3-month timeline. Risk of over-engineering.",
  thoughtNumber: 2,
  totalThoughts: 6,
  branchFromThought: 1,
  branchId: "microservices",
  nextThoughtNeeded: true
})

// Thought 3 - Branch B: Monolith
sequential_thinking_sequentialthinking({
  thought: "Branch B - Monolith: Faster initial development, simpler deployment. Can extract services later when team/scale grows.",
  thoughtNumber: 3,
  totalThoughts: 6,
  branchFromThought: 1,
  branchId: "monolith",
  nextThoughtNeeded: true
})

// Thought 4 - Compare branches and conclude
sequential_thinking_sequentialthinking({
  thought: "Comparing branches: Given team size and timeline, monolith wins. Can adopt 'modular monolith' pattern for future extraction.",
  thoughtNumber: 4,
  totalThoughts: 6,
  nextThoughtNeeded: true
})
```

---

## 9. 🔧 TROUBLESHOOTING

### Tool Not Appearing

**Problem**: `sequential_thinking_sequentialthinking` tool not visible

**Solutions**:

1. **Restart your AI client** (OpenCode, VS Code, Claude Desktop)

2. **Verify Node.js version**
   ```bash
   node --version  # Must be 18+
   ```

3. **Test npx directly**
   ```bash
   npx -y @modelcontextprotocol/server-sequential-thinking --help
   ```

4. **Check configuration syntax**
   ```bash
   # Validate JSON
   python3 -m json.tool < opencode.json
   ```

5. **Check for typos in config**
   - Server name: `sequential_thinking` (underscore, not hyphen)
   - Args: `["-y", "@modelcontextprotocol/server-sequential-thinking"]`

### npx Errors

**Problem**: npx fails to run the package

**Solutions**:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

2. **Check network/proxy**
   ```bash
   npm config get proxy
   npm config get https-proxy
   ```

3. **Try global install as fallback**
   ```bash
   npm install -g @modelcontextprotocol/server-sequential-thinking
   ```

### Tool Invocation Fails

**Problem**: Tool appears but fails when called

**Solutions**:

1. **Check parameter types** - Ensure `thoughtNumber` and `totalThoughts` are integers, not strings

2. **Verify required parameters** - All four required parameters must be provided

3. **Check boolean values** - Use `true`/`false`, not strings

---

## 10. 📚 RESOURCES

### Official Documentation

- **MCP Protocol**: https://modelcontextprotocol.io
- **MCP Specification**: https://spec.modelcontextprotocol.io
- **MCP GitHub**: https://github.com/modelcontextprotocol
- **npm Package**: https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking

### Related MCP Servers

| Server              | Purpose                  |
| ------------------- | ------------------------ |
| **Narsil**          | Semantic + structural code search |
| **Spec Kit Memory** | Context preservation     |

### When to Combine Tools

```
Complex debugging → Sequential Thinking + Narsil (search for related code)
Architecture decisions → Sequential Thinking + Memory (recall past decisions)
Code exploration → Narsil (semantic + structural analysis before changing)
```

---

## Quick Reference

### Configuration (OpenCode)

```json
{
  "mcp": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Basic Invocation

```typescript
sequential_thinking_sequentialthinking({
  thought: "Your thinking step here",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

### With Revision

```typescript
sequential_thinking_sequentialthinking({
  thought: "Revising earlier assumption...",
  thoughtNumber: 3,
  totalThoughts: 5,
  isRevision: true,
  revisesThought: 1,
  nextThoughtNeeded: true
})
```

### Decision Checklist

Before invoking Sequential Thinking:
- [ ] Is this complex enough to warrant structured analysis?
- [ ] Do I have context budget for ~2,000 tokens?
- [ ] Would standard reasoning be insufficient?

---

**Installation Complete!**

You now have Sequential Thinking MCP configured. Use it for complex problem-solving, architectural decisions, and multi-step debugging where systematic analysis provides value.
