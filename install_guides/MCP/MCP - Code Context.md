# MCP Code Context Installation Guide

A comprehensive guide to installing, configuring, and using the Code Context MCP server for structural code intelligence via Tree-sitter AST analysis.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: `code-context-provider-mcp` | **Dependencies**: Node.js 18+

---

#### TABLE OF CONTENTS

0. [🤖 AI INSTALL GUIDE](#0--ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [🎯 TOOL SELECTION DECISION TREE](#2--tool-selection-decision-tree)
3. [🔍 UNIFIED SEARCH](#3--unified-search-searchcode)
4. [📋 PREREQUISITES](#4--prerequisites)
5. [📥 INSTALLATION](#5--installation)
6. [⚙️ CONFIGURATION](#6--configuration)
7. [✅ VERIFICATION](#7--verification)
8. [🚀 USAGE PATTERNS](#8--usage-patterns)
9. [🎯 FEATURES](#9--features)
10. [💡 EXAMPLES](#10--examples)
11. [🔧 TROUBLESHOOTING](#11--troubleshooting)
12. [📚 RESOURCES](#12--resources)

---

## 0. 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Code Context MCP server for structural code analysis.

Please help me:
1. Check if I have Node.js 18+ installed
2. Verify I have npx available for running MCP servers
3. Add Code Context to my opencode.json as a native MCP server
4. Verify the installation is working with a test query
5. Show me how to use it for listing functions in a directory

My project to analyze is located at: [your project path]

Note: Code Context is a NATIVE MCP - call directly with code_context_get_code_context(),
NOT via Code Mode call_tool_chain().

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Add Code Context to `opencode.json` as native MCP
- Test the `code_context_get_code_context` tool directly
- Show you how to use symbol extraction and tree visualization
- Demonstrate the tool selection matrix (Code Context vs LEANN vs Grep)

**Expected setup time:** 5 minutes

---

## 1. 📖 OVERVIEW

Code Context MCP is a structural code intelligence tool that uses Tree-sitter AST (Abstract Syntax Tree) analysis to provide precise navigation and understanding of code structure. Unlike lexical search (Grep) which matches text, or semantic search (LEANN) which matches meaning, Code Context matches **structure** - functions, classes, methods, and their relationships.

### Source Repository

| Property          | Value                                                                                |
| ----------------- | ------------------------------------------------------------------------------------ |
| **npm**           | [code-context-provider-mcp](https://www.npmjs.com/package/code-context-provider-mcp) |
| **Version**       | 1.0.11                                                                               |
| **License**       | MIT                                                                                  |
| **Access Method** | **NATIVE MCP** (direct call)                                                         |
| **Tool Name**     | `code_context_get_code_context`                                                      |

### Key Features

| Feature                     | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| **AST-Aware Analysis**      | Tree-sitter parsing for precise symbol extraction         |
| **Multi-Language Support**  | JavaScript, TypeScript, Python, CSS, HTML                 |
| **Symbol Filtering**        | Filter by functions, classes, variables, imports, exports |
| **Directory Visualization** | Tree view of folder structure                             |
| **Gitignore Respect**       | Automatically excludes ignored files                      |
| **Depth Control**           | Limit recursion to prevent timeout                        |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Query                                 │
│    "List functions in src/auth"                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Code Context Provider (NATIVE MCP)                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Input Layer                            │  │
│  │        absolutePath  |  analyzeJs  |  symbolType          │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Tree-sitter Parser                       │  │
│  │    JavaScript | TypeScript | Python | CSS | HTML          │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Symbol Extraction                        │  │
│  │    Functions | Classes | Variables | Imports | Exports    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JSON Response                              │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   Directory Tree    │  │      Symbol List                │   │
│  │   (Structure)       │  │      (Functions, Classes)       │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Invocation Method

**NATIVE MCP** - Call directly (NOT via Code Mode):

```typescript
// CORRECT - Native call
code_context_get_code_context({
  absolutePath: "/path/to/src",
  analyzeJs: true,
  symbolType: "functions"
})

// WRONG - Do NOT use Code Mode for this tool
call_tool_chain(`code_context.code_context_get_code_context(...)`)
```

Code Context is a **native MCP tool** configured in `opencode.json`. Unlike external tools (Webflow, Figma, ClickUp) that require Code Mode's `call_tool_chain()`, Code Context is called directly like other native tools (Read, Write, Grep).

---

## 2. 🎯 TOOL SELECTION DECISION TREE

**When to Use Code Context vs Other Tools:**

| Need                    | Tool             | Example Query                         |
| ----------------------- | ---------------- | ------------------------------------- |
| List functions in file  | **Code Context** | `symbolType: "functions"`             |
| List classes in module  | **Code Context** | `symbolType: "classes"`               |
| Get imports/exports     | **Code Context** | `symbolType: "imports"`               |
| Directory structure     | **Code Context** | `analyzeJs: false, maxDepth: 2`       |
| Understand code meaning | **LEANN**        | `leann_search("how does auth work")`  |
| Find code by intent     | **LEANN**        | `leann_search("error handling")`      |
| Find text pattern       | **Grep**         | `grep("TODO", { include: "*.ts" })`   |
| Find file by name       | **Glob**         | `glob({ pattern: "**/auth*.ts" })`    |
| Read file contents      | **Read**         | `read({ filePath: "/path/to/file" })` |

### Decision Flow

```
What do you need?
    │
    ├─► "What functions exist?" ─────────► Code Context (structural)
    │   "List all classes"
    │   "Show me the exports"
    │
    ├─► "How does this work?" ──────────► LEANN (semantic)
    │   "Find authentication logic"
    │   "Where is error handling?"
    │
    ├─► "Find TODO comments" ───────────► Grep (lexical)
    │   "Search for 'deprecated'"
    │   "Find console.log"
    │
    └─► "Read this specific file" ──────► Read (direct access)
```

### Comparison Matrix

| Feature             | Code Context       | LEANN                 | Grep           |
| ------------------- | ------------------ | --------------------- | -------------- |
| **Query Type**      | Structural (AST)   | Semantic (meaning)    | Lexical (text) |
| **Finds**           | Symbol definitions | Code by intent        | Text patterns  |
| **Example**         | "List functions"   | "How does auth work?" | "Find TODO"    |
| **Speed**           | Fast (1-5s)        | Medium                | Fastest        |
| **False Positives** | None (AST-aware)   | Context-aware         | High           |
| **Invocation**      | Native MCP         | Native MCP            | Native         |

---

## 3. 🔍 UNIFIED SEARCH (/search:code)

The `/search:code` command provides unified search routing that automatically selects the best tool for your query:

### How Routing Works

| Query Pattern                  | Routed To    | Why                          |
| ------------------------------ | ------------ | ---------------------------- |
| "list functions in auth.ts"    | Code Context | Structural query (symbols)   |
| "show classes in models/"      | Code Context | Structural query (symbols)   |
| "how does authentication work" | LEANN        | Semantic query (meaning)     |
| "find error handling logic"    | LEANN        | Semantic query (intent)      |
| "find TODO comments"           | Grep         | Lexical query (text pattern) |

### Usage Examples

```
/search:code list functions in src/auth
→ Routes to Code Context with symbolType: "functions"

/search:code how does the login flow work
→ Routes to LEANN for semantic search

/search:code find all console.log statements
→ Routes to Grep for text pattern matching
```

### Related Command

The `/search:code` command is part of the unified search system. For implementation details, see the related skill: `mcp-code-context`.

---

## 4. 📋 PREREQUISITES

Before installing Code Context MCP, ensure you have:

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
  - OpenCode CLI
  - Claude Code CLI
  - VS Code with GitHub Copilot

### Validation: `prerequisites_complete`

```bash
# All commands should succeed:
node --version       # → v18.x or higher
npm --version        # → 9.x or higher
npx --version        # → 9.x or higher
```

**Expected:**
- [ ] `node --version` returns v18+
- [ ] `npm --version` returns version
- [ ] `npx --version` returns version

**If validation fails:** Install Node.js 18+ from https://nodejs.org before continuing.

---

## 5. 📥 INSTALLATION

Code Context is installed as a **native MCP server** in your AI client's configuration.

### Step 1: Add to opencode.json

Add the Code Context configuration to your `opencode.json` file in the `mcp` section:

```json
{
  "mcp": {
    "code_context": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "code-context-provider-mcp"
      ],
      "enabled": true
    }
  }
}
```

### Step 2: Complete opencode.json Example

Here's an example showing Code Context alongside other native MCP servers:

```json
{
  "mcp": {
    "sequential_thinking": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"],
      "enabled": true
    },
    "leann": {
      "type": "local",
      "command": ["/path/to/leann_mcp"],
      "enabled": true
    },
    "code_context": {
      "type": "local",
      "command": ["npx", "-y", "code-context-provider-mcp"],
      "enabled": true
    }
  }
}
```

### Validation: `installation_complete`

```bash
# Validate JSON configuration
python3 -m json.tool < opencode.json

# Check Code Context entry exists
grep -A 6 '"code_context"' opencode.json
```

**Expected:**
- [ ] `opencode.json` has valid JSON syntax
- [ ] `code_context` entry exists in `mcp` section
- [ ] Command is `["npx", "-y", "code-context-provider-mcp"]`
- [ ] `enabled` is `true`

**If validation fails:** Check JSON syntax and ensure the configuration matches the format above.

---

## 6. ⚙️ CONFIGURATION

### Option A: Configure for OpenCode (Recommended)

OpenCode reads native MCP configuration from `opencode.json`:

```json
{
  "mcp": {
    "code_context": {
      "type": "local",
      "command": ["npx", "-y", "code-context-provider-mcp"],
      "enabled": true
    }
  }
}
```

### Option B: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "code_context": {
      "command": "npx",
      "args": ["-y", "code-context-provider-mcp"]
    }
  }
}
```

### Option C: Configure for VS Code Copilot

Add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "code_context": {
      "command": "npx",
      "args": ["-y", "code-context-provider-mcp"]
    }
  }
}
```

### No Environment Variables Required

Code Context does not require any API keys or environment variables. It runs entirely locally using Tree-sitter for AST parsing.

---

## 7. ✅ VERIFICATION

### Check 1: Restart AI Client

After adding configuration, restart your AI client to load the new MCP server.

### Check 2: Test Native Tool Availability

In your AI chat, the tool should be available as `code_context_get_code_context`:

```typescript
// Test: Get directory structure
code_context_get_code_context({
  absolutePath: "/path/to/your/project/src",
  analyzeJs: false,
  maxDepth: 2
})
```

### Check 3: Test Symbol Extraction

```typescript
// Test: List functions in a directory
code_context_get_code_context({
  absolutePath: "/path/to/your/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})
```

### Validation: `verification_complete`

**Expected:**
- [ ] AI client restarted after configuration
- [ ] Tool `code_context_get_code_context` is recognized
- [ ] Directory structure query returns tree results
- [ ] Symbol extraction query returns function list
- [ ] No connection errors in responses

**If validation fails:** 
1. Check `opencode.json` has valid JSON syntax
2. Verify `enabled: true` in code_context config
3. Restart AI client completely
4. Check Node.js 18+ is installed

---

## 8. 🚀 USAGE PATTERNS

### Critical: Native Invocation

**ALWAYS call directly** - Code Context is a native MCP tool:

```typescript
// CORRECT - Native call
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,
  symbolType: "functions"
})

// WRONG - Do NOT use Code Mode
call_tool_chain(`code_context.code_context_get_code_context(...)`)
```

### Pattern 1: Directory Structure

Get a high-level view of project layout:

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: false,
  maxDepth: 2
})
```

### Pattern 2: List Functions

Find all functions in a module:

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})
```

### Pattern 3: List Classes

Map the OOP structure:

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
})
```

### Pattern 4: Analyze Dependencies

Check what a file imports:

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/components/Button.tsx",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "imports"
})
```

### Pattern 5: Combined Workflow

Find → Read → Understand:

```typescript
// Step 1: Find functions with Code Context
const result = code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})
// Result: handleLogin at auth/login.ts:45

// Step 2: Read the specific function
read({ filePath: "/Users/dev/project/src/auth/login.ts", offset: 44, limit: 30 })

// Step 3: Understand with LEANN if needed
leann_search({ index_name: "project", query: "how does login validation work" })
```

---

## 9. 🎯 FEATURES

The server exposes 1 MCP tool for structural code analysis:

### code_context_get_code_context

**Purpose**: Extract directory structure and/or AST-based symbols from code.

**Parameters:**

| Parameter        | Type    | Required | Default | Description                                             |
| ---------------- | ------- | -------- | ------- | ------------------------------------------------------- |
| `absolutePath`   | string  | **Yes**  | -       | Absolute path to directory or file                      |
| `analyzeJs`      | boolean | No       | `false` | Enable AST parsing for symbols                          |
| `includeSymbols` | boolean | No       | `false` | Include symbol list in response                         |
| `symbolType`     | string  | No       | `"all"` | Filter: functions/classes/variables/imports/exports/all |
| `maxDepth`       | number  | No       | `5`     | Maximum directory recursion depth                       |

**Native Call:**
```typescript
code_context_get_code_context({
  absolutePath: "/absolute/path/to/directory",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions",
  maxDepth: 3
})
```

**Returns:**
```typescript
interface CodeContextResponse {
  tree: TreeNode[];      // Directory structure
  symbols?: Symbol[];    // Extracted symbols (if analyzeJs: true)
}
```

### Symbol Types

| symbolType    | Extracts                                        |
| ------------- | ----------------------------------------------- |
| `"functions"` | Function declarations, arrow functions, methods |
| `"classes"`   | Class declarations                              |
| `"variables"` | Variable declarations (const, let, var)         |
| `"imports"`   | Import statements                               |
| `"exports"`   | Export declarations                             |
| `"all"`       | All symbol types (default)                      |

### Supported Languages

| Language   | Extension     | Symbol Extraction |
| ---------- | ------------- | ----------------- |
| JavaScript | `.js`         | Full              |
| TypeScript | `.ts`, `.tsx` | Full              |
| Python     | `.py`         | Full              |
| CSS        | `.css`        | Limited           |
| HTML       | `.html`       | Limited           |
| JSON       | `.json`       | Structure only    |
| Markdown   | `.md`         | Headers only      |

---

## 10. 💡 EXAMPLES

### Example 1: Project Overview

**Scenario**: Get a high-level view of project structure

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project",
  analyzeJs: false,
  maxDepth: 2
})
```

**Expected output:**
```
project/
├── src/
│   ├── components/
│   ├── utils/
│   └── index.ts
├── tests/
└── package.json
```

### Example 2: List All Functions

**Scenario**: Find all functions in the auth module

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})
```

**Expected output:**
```
Functions found: 4
  - handleLogin at auth/login.ts:45
  - validateToken at auth/token.ts:12
  - refreshSession at auth/session.ts:78
  - logout at auth/logout.ts:5
```

### Example 3: List All Classes

**Scenario**: Map the OOP structure of models

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
})
```

### Example 4: Dependency Analysis

**Scenario**: Check what a file imports

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/components/Button.tsx",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "imports"
})
```

### Example 5: Single File Analysis

**Scenario**: Analyze a specific file's structure

```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/utils/helpers.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
})
```

---

## 11. 🔧 TROUBLESHOOTING

### Tool Not Recognized

**Problem**: AI doesn't recognize `code_context_get_code_context`

**Cause**: MCP server not loaded or not configured

**Solution**:
1. Check `opencode.json` has the `code_context` entry
2. Verify `enabled: true`
3. Restart AI client completely
4. Check for JSON syntax errors: `python3 -m json.tool < opencode.json`

### Path Must Be Absolute

**Problem**: `Error: Path must be absolute`

**Cause**: Relative path was provided

**Solution**:
```typescript
// WRONG
{ absolutePath: "./src" }
{ absolutePath: "src/components" }

// CORRECT
{ absolutePath: "/Users/dev/project/src" }
{ absolutePath: "/absolute/path/to/directory" }
```

### Empty Results

**Problem**: Response has empty symbols array

**Cause**: `analyzeJs` not enabled or wrong file type

**Solutions**:
```typescript
// Check 1: Is analyzeJs enabled?
{ analyzeJs: true }  // Must be true for symbols

// Check 2: Is includeSymbols enabled?
{ includeSymbols: true }  // Must be true

// Check 3: Is symbolType too restrictive?
{ symbolType: "all" }  // Try "all" first

// Check 4: Are files the right type?
// Only JS/TS/Python files have full symbol support
```

### Timeout Errors

**Problem**: Query times out on large directories

**Cause**: Too deep or too large directory

**Solution**:
```typescript
// PROBLEM: Deep recursion on large codebase
{
  absolutePath: "/Users/dev/monorepo",
  analyzeJs: true,
  maxDepth: 10
}

// SOLUTION: Start shallow
{
  absolutePath: "/Users/dev/monorepo",
  analyzeJs: false,  // Tree only first
  maxDepth: 2
}

// Then target specific subdirectory
{
  absolutePath: "/Users/dev/monorepo/packages/auth",
  analyzeJs: true,
  maxDepth: 5
}
```

### Using Wrong Invocation Method

**Problem**: Trying to use Code Mode for Code Context

**Cause**: Confusion about native vs Code Mode tools

**Solution**:
```typescript
// WRONG - Code Mode (external tools only)
call_tool_chain(`code_context.code_context_get_code_context({...})`)

// CORRECT - Native call
code_context_get_code_context({
  absolutePath: "/path/to/src",
  analyzeJs: true
})
```

**Remember**: Code Context is a **native MCP tool**, not an external tool. Call it directly.

---

## 12. 📚 RESOURCES

### File Locations

| Path                                | Purpose                       |
| ----------------------------------- | ----------------------------- |
| `opencode.json`                     | Native MCP configuration      |
| `.opencode/skill/mcp-code-context/` | Skill documentation           |
| `.mcp.json`                         | Claude Code MCP configuration |
| `.vscode/mcp.json`                  | VS Code MCP configuration     |

### Parameter Quick Reference

| Goal           | analyzeJs | includeSymbols | symbolType    | maxDepth |
| -------------- | --------- | -------------- | ------------- | -------- |
| Quick overview | `false`   | -              | -             | `2`      |
| Function list  | `true`    | `true`         | `"functions"` | `3`      |
| Class map      | `true`    | `true`         | `"classes"`   | `3`      |
| Full analysis  | `true`    | `true`         | `"all"`       | `5`      |
| Imports only   | `true`    | `true`         | `"imports"`   | `3`      |

### External Resources

- **npm Package**: https://www.npmjs.com/package/code-context-provider-mcp
- **Tree-sitter**: https://tree-sitter.github.io/tree-sitter/
- **MCP Protocol**: https://modelcontextprotocol.io

### Related Skill

- **mcp-code-context** - Skill documentation for Code Context usage patterns
- **mcp-leann** - Semantic code search (for "how" and "why" questions)
- **workflows-code** - Code implementation workflow

### Configuration Template

**Complete opencode.json Entry:**
```json
{
  "mcp": {
    "code_context": {
      "type": "local",
      "command": ["npx", "-y", "code-context-provider-mcp"],
      "enabled": true
    }
  }
}
```

---

## Quick Start Summary

```bash
# 1. Prerequisites
node --version  # Ensure v18+

# 2. Add to opencode.json (see Installation section)

# 3. Validate configuration
python3 -m json.tool < opencode.json

# 4. Restart AI client

# 5. Test with a native call
```

In your AI chat:
```typescript
code_context_get_code_context({
  absolutePath: "/path/to/your/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})
```

---

**Installation Complete!**

You now have Code Context MCP installed and configured as a **native MCP tool**. Use it to explore code structure, find symbol definitions, and understand codebase organization.

**Key Reminders:**
- Call **directly** as `code_context_get_code_context({...})` - NOT via Code Mode
- Use for **structural** queries (what exists, where)
- Pair with **LEANN** for semantic understanding (how, why)
- Pair with **Grep** for text pattern matching

**Remember**: Code Context provides **structural intelligence** - it tells you *what exists* and *where*, not *how it works* or *why*. For semantic understanding, use LEANN. For text patterns, use Grep.
