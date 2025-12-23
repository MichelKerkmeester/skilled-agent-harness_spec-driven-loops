# MCP Code Context Installation Guide

A comprehensive guide to installing, configuring, and using the Code Context MCP server for structural code intelligence via Tree-sitter AST analysis.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Code Context MCP server for structural code analysis

Please help me:
1. Check if I have Node.js 18+ installed
2. Verify I have npx available for running MCP servers
3. Add Code Context to my .utcp_config.json for Code Mode access
4. Configure Code Context for my AI environment (I'm using: [Claude Code / OpenCode / VS Code Copilot])
5. Verify the installation is working with a test query
6. Test listing functions in a directory

My project to analyze is located at: [your project path]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Add Code Context to `.utcp_config.json` configuration
- Configure for your specific AI platform
- Test the `get_code_context` tool with structural queries
- Show you how to use symbol extraction and tree visualization
- Demonstrate the tool selection matrix (Code Context vs LEANN vs Grep)

**Expected setup time:** 5-10 minutes

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

Code Context MCP is a structural code intelligence tool that uses Tree-sitter AST (Abstract Syntax Tree) analysis to provide precise navigation and understanding of code structure. Unlike lexical search (Grep) which matches text, or semantic search (LEANN) which matches meaning, Code Context matches **structure** - functions, classes, methods, and their relationships.

### Source Repository

| Property          | Value                             |
| ----------------- | --------------------------------- |
| **npm Package**   | `code-context-provider-mcp`       |
| **License**       | MIT                               |
| **Access Method** | Via Code Mode `call_tool_chain()` |

### Key Features

| Feature                     | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| **AST-Aware Analysis**      | Tree-sitter parsing for precise symbol extraction         |
| **Multi-Language Support**  | JavaScript, TypeScript, Python, CSS, HTML                 |
| **Symbol Filtering**        | Filter by functions, classes, variables, imports, exports |
| **Directory Visualization** | Tree view of folder structure                             |
| **Gitignore Respect**       | Automatically excludes ignored files                      |
| **Depth Control**           | Limit recursion to prevent timeout                        |

### The Tool Selection Matrix

**When to use which tool:**

| Need                      | Tool             | Why                        |
| ------------------------- | ---------------- | -------------------------- |
| Find function definitions | **Code Context** | AST-aware symbol search    |
| Find text pattern         | Grep             | Lexical pattern matching   |
| Understand code intent    | LEANN            | Semantic search by meaning |
| Read file contents        | Read             | Direct file access         |
| List files by pattern     | Glob             | Filename pattern matching  |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Query                                 │
│    "List functions in src/auth"                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Code Context Provider                         │
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

### How It Compares

| Feature             | Code Context       | LEANN                 | Grep           |
| ------------------- | ------------------ | --------------------- | -------------- |
| **Query Type**      | Structural (AST)   | Semantic (meaning)    | Lexical (text) |
| **Finds**           | Symbol definitions | Code by intent        | Text patterns  |
| **Example**         | "List functions"   | "How does auth work?" | "Find TODO"    |
| **Speed**           | Fast (1-5s)        | Medium                | Fastest        |
| **False Positives** | None (AST-aware)   | Context-aware         | High           |

---

## 2. 📋 PREREQUISITES

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

- **Code Mode MCP** (Code Context is accessed via Code Mode)
  - See `MCP - Code Mode.md` for Code Mode installation
  - Code Context is registered in `.utcp_config.json`

- **MCP-Compatible Client** (one of the following):
  - Claude Code CLI
  - OpenCode CLI
  - VS Code with GitHub Copilot

### Validation: `prerequisites_complete`

```bash
# All commands should succeed:
node --version       # → v18.x or higher
npm --version        # → 9.x or higher
npx --version        # → 9.x or higher
```

**Checklist:**
- [ ] `node --version` returns v18+?
- [ ] `npm --version` returns version?
- [ ] `npx --version` returns version?
- [ ] Code Mode MCP is installed and working?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. 📥 INSTALLATION

Code Context is installed as an npm package and accessed via Code Mode.

### Step 1: Verify Code Mode is Working

```bash
# In your AI client, test Code Mode is available
# Use list_tools to see if code_mode tools are present
```

### Step 2: Add Code Context to .utcp_config.json

Add the Code Context configuration to your `.utcp_config.json` file in the `manual_call_templates` array:

```json
{
  "name": "code_context",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "code_context": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "code-context-provider-mcp"
        ],
        "env": {}
      }
    }
  }
}
```

### Step 3: Complete .utcp_config.json Example

Here's a complete example showing Code Context alongside other MCP servers:

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
      "name": "code_context",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "code_context": {
            "transport": "stdio",
            "command": "npx",
            "args": [
              "-y",
              "code-context-provider-mcp"
            ],
            "env": {}
          }
        }
      }
    }
  ]
}
```

### Validation: `installation_complete`

```bash
# Validate JSON configuration
python3 -m json.tool < .utcp_config.json

# Check Code Context entry exists
cat .utcp_config.json | grep "code_context"
```

**Checklist:**
- [ ] `.utcp_config.json` has valid JSON syntax?
- [ ] `code_context` entry exists in `manual_call_templates`?
- [ ] Command is `npx` with args `["-y", "code-context-provider-mcp"]`?

❌ **STOP if validation fails** - Fix configuration before continuing.

---

## 4. ⚙️ CONFIGURATION

### Option A: Configure for OpenCode

Code Context is accessed through Code Mode. Ensure `opencode.json` has Code Mode configured:

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

### Option B: Configure for Claude Code CLI

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

### No Environment Variables Required

Code Context does not require any API keys or environment variables. It runs entirely locally using Tree-sitter for AST parsing.

---

## 5. ✅ VERIFICATION

### Check 1: Verify Configuration Files

```bash
# Check .utcp_config.json is valid JSON
python3 -m json.tool < .utcp_config.json

# Verify code_context entry
cat .utcp_config.json | grep -A 15 '"code_context"'
```

### Check 2: Verify in Your AI Client

**In OpenCode:**
```bash
opencode

> List available Code Mode tools
# Expected: Should show code_context tools
```

### Check 3: Test Tool Discovery

```typescript
// In your AI chat:
Use search_tools to find tools related to "code context"

// Expected: Should show code_context.code_context_get_code_context
```

### Check 4: Test a Basic Query

```typescript
// In your AI chat:
Use call_tool_chain to get the directory structure:

call_tool_chain({
  code: `
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/path/to/your/project/src",
      analyzeJs: false,
      maxDepth: 2
    });
    console.log('Structure:', JSON.stringify(result, null, 2));
    return result;
  `
});
```

### Success Criteria (`verification_complete`)

- [ ] ✅ Code Mode shows `code_context` in tool list
- [ ] ✅ `get_code_context` tool is accessible
- [ ] ✅ Directory tree query returns results
- [ ] ✅ No connection errors in responses

**Checklist:**
- [ ] Tool appears in `list_tools()` output?
- [ ] Test query returns directory structure?
- [ ] No error messages in output?

❌ **STOP if validation fails** - Check Code Mode configuration, restart client.

---

## 6. 🚀 USAGE

### Critical Naming Pattern

**THE #1 MOST COMMON ERROR** is using wrong function names. The tool call MUST follow this pattern:

```typescript
code_context.code_context_get_code_context({ ... })
```

**Pattern**: `{manual_name}.{manual_name}_{tool_name}`

**Examples:**
| Manual Name    | Tool Name          | Full Call                                      |
| -------------- | ------------------ | ---------------------------------------------- |
| `code_context` | `get_code_context` | `code_context.code_context_get_code_context()` |

**Common Mistakes:**

| ❌ Wrong                           | ✅ Correct                                      |
| --------------------------------- | ---------------------------------------------- |
| `code_context.get_code_context()` | `code_context.code_context_get_code_context()` |
| `codeContext.getCodeContext()`    | `code_context.code_context_get_code_context()` |

### Basic Workflow

**Step 1: Get Directory Structure**

```typescript
call_tool_chain({
  code: `
    const tree = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src",
      analyzeJs: false,
      maxDepth: 2
    });
    console.log('Directory tree:', tree);
    return tree;
  `
});
```

**Step 2: Get Functions in a Directory**

```typescript
call_tool_chain({
  code: `
    const symbols = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src/auth",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "functions"
    });
    console.log('Functions:', symbols.symbols);
    return symbols;
  `
});
```

**Step 3: Follow Up with Read**

After finding a symbol, use the Read tool to see implementation:
```
Found handleLogin at auth/login.ts:45
→ Read auth/login.ts lines 45-78
```

### Tool Selection Decision Tree

```
What do you need?
    │
    ├─► Directory structure visualization
    │   └─► code_context { analyzeJs: false, maxDepth: 2 }
    │
    ├─► List all functions in a file/folder
    │   └─► code_context { analyzeJs: true, symbolType: "functions" }
    │
    ├─► List all classes
    │   └─► code_context { analyzeJs: true, symbolType: "classes" }
    │
    ├─► Find text pattern (e.g., "TODO")
    │   └─► Use Grep instead (not Code Context)
    │
    └─► Understand code meaning ("How does X work?")
        └─► Use LEANN instead (not Code Context)
```

---

## 7. 🎯 FEATURES

The server exposes 1 MCP tool for structural code analysis:

### 7.1 get_code_context

**Purpose**: Extract directory structure and/or AST-based symbols from code.

**Parameters**:

| Parameter        | Type    | Required | Default | Description                                             |
| ---------------- | ------- | -------- | ------- | ------------------------------------------------------- |
| `absolutePath`   | string  | **Yes**  | -       | Absolute path to directory or file                      |
| `analyzeJs`      | boolean | No       | `false` | Enable AST parsing for symbols                          |
| `includeSymbols` | boolean | No       | `false` | Include symbol list in response                         |
| `symbolType`     | string  | No       | `"all"` | Filter: functions/classes/variables/imports/exports/all |
| `maxDepth`       | number  | No       | `5`     | Maximum directory recursion depth                       |

**Via Code Mode:**
```typescript
call_tool_chain({
  code: `
    await code_context.code_context_get_code_context({
      absolutePath: "/absolute/path/to/directory",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "functions",
      maxDepth: 3
    });
  `
});
```

**Returns**:
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
| JavaScript | `.js`         | ✅ Full            |
| TypeScript | `.ts`, `.tsx` | ✅ Full            |
| Python     | `.py`         | ✅ Full            |
| CSS        | `.css`        | ⚠️ Limited         |
| HTML       | `.html`       | ⚠️ Limited         |
| JSON       | `.json`       | ⚠️ Structure only  |
| Markdown   | `.md`         | ⚠️ Headers only    |

---

## 8. 💡 EXAMPLES

### Example 1: Project Overview

**Scenario**: Get a high-level view of project structure

```typescript
call_tool_chain({
  code: `
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project",
      analyzeJs: false,
      maxDepth: 2
    });
    
    console.log('Project structure:');
    console.log(JSON.stringify(result.tree, null, 2));
    return result;
  `
});
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
call_tool_chain({
  code: `
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src/auth",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "functions"
    });
    
    console.log('Functions found:', result.symbols?.length);
    result.symbols?.forEach(s => {
      console.log(\`  - \${s.name} at \${s.file}:\${s.line}\`);
    });
    return result;
  `
});
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
call_tool_chain({
  code: `
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src/models",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "classes"
    });
    
    console.log('Classes:');
    result.symbols?.forEach(s => console.log(\`  - \${s.name}\`));
    return result;
  `
});
```

### Example 4: Dependency Analysis

**Scenario**: Check what a file imports

```typescript
call_tool_chain({
  code: `
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src/components/Button.tsx",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "imports"
    });
    
    console.log('Imports:');
    result.symbols?.forEach(s => console.log(\`  - \${s.name}\`));
    return result;
  `
});
```

### Example 5: Combined Workflow

**Scenario**: Find → Read → Understand

```typescript
call_tool_chain({
  code: `
    // Step 1: Find functions in auth module
    const result = await code_context.code_context_get_code_context({
      absolutePath: "/Users/dev/project/src/auth",
      analyzeJs: true,
      includeSymbols: true,
      symbolType: "functions"
    });
    
    // Log results with file locations
    console.log('Auth functions:');
    result.symbols?.forEach(s => {
      console.log(\`  \${s.name} → \${s.file}:\${s.line}\`);
    });
    
    return {
      functions: result.symbols,
      nextStep: "Use Read tool to see implementation of specific function"
    };
  `
});
```

---

## 9. 🔧 TROUBLESHOOTING

### Tool Not Found Error

**Problem**: `Error: Tool not found: code_context.get_code_context`

**Cause**: Missing manual prefix in tool name

**Solution**:
```typescript
// ❌ Wrong
await code_context.get_code_context({});

// ✅ Correct
await code_context.code_context_get_code_context({});
```

### Path Must Be Absolute

**Problem**: `Error: Path must be absolute`

**Cause**: Relative path was provided

**Solution**:
```typescript
// ❌ Wrong
{ absolutePath: "./src" }
{ absolutePath: "src/components" }

// ✅ Correct
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
// ❌ Problem: Deep recursion on large codebase
{
  absolutePath: "/Users/dev/monorepo",
  analyzeJs: true,
  maxDepth: 10
}

// ✅ Solution: Start shallow
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

### Code Context Not Appearing

**Problem**: `list_tools()` doesn't show code_context

**Solutions**:
1. Check `.utcp_config.json` has `code_context` entry
2. Verify manual name is exactly `"code_context"` (with underscore)
3. Restart AI client after configuration changes
4. Check JSON syntax:
   ```bash
   python3 -m json.tool < .utcp_config.json
   ```

---

## 10. 📚 RESOURCES

### File Locations

| Path                                 | Purpose                        |
| ------------------------------------ | ------------------------------ |
| `.utcp_config.json`                  | Code Context MCP configuration |
| `.opencode/skills/mcp-code-context/` | Skill documentation            |
| `opencode.json`                      | OpenCode MCP configuration     |
| `.mcp.json`                          | Claude Code MCP configuration  |

### Parameter Quick Reference

| Goal           | analyzeJs | symbolType    | maxDepth |
| -------------- | --------- | ------------- | -------- |
| Quick overview | `false`   | -             | `2`      |
| Function list  | `true`    | `"functions"` | `3`      |
| Class map      | `true`    | `"classes"`   | `3`      |
| Full analysis  | `true`    | `"all"`       | `5`      |
| Imports only   | `true`    | `"imports"`   | `3`      |

### External Resources

- **npm Package**: https://www.npmjs.com/package/code-context-provider-mcp
- **Tree-sitter**: https://tree-sitter.github.io/tree-sitter/
- **MCP Protocol**: https://modelcontextprotocol.io

### Related Skills

- **mcp-leann** - Semantic code search (for "how" and "why" questions)
- **mcp-code-mode** - Code Mode orchestration (required for Code Context access)
- **workflows-code** - Code implementation workflow

### Configuration Templates

**Complete .utcp_config.json Entry:**
```json
{
  "name": "code_context",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "code_context": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "code-context-provider-mcp"
        ],
        "env": {}
      }
    }
  }
}
```

---

## Quick Start Summary

```bash
# 1. Prerequisites
node --version  # Ensure v18+

# 2. Add to .utcp_config.json (see Installation section)

# 3. Validate configuration
python3 -m json.tool < .utcp_config.json

# 4. Restart AI client

# 5. Test with a query
# In your AI chat:
# "Use Code Mode to list functions in /path/to/your/project/src"
```

---

**Installation Complete!**

You now have Code Context MCP installed and configured. Use it to explore code structure, find symbol definitions, and understand codebase organization.

Start using Code Context by asking your AI assistant:
```
Use Code Mode to get the directory structure of /path/to/project/src
```

Or list functions:
```
Use Code Mode to list all functions in /path/to/project/src/auth
```

**Remember**: Code Context provides **structural intelligence** - it tells you *what exists* and *where*, not *how it works* or *why*. For semantic understanding, pair with LEANN. For text patterns, use Grep.
