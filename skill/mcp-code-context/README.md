# MCP Code Context - Structural Intelligence

Precise structural analysis of codebases using Tree-sitter AST parsing. Bridges the gap between lexical search (Grep) and semantic search (LEANN) by matching **structure** - functions, classes, methods, and their relationships.

> **Navigation**:
> - New to Code Context? Start with [Quick Start](#2--quick-start)
> - Need tool guidance? See [Tool Selection Guide](#3--tool-selection-guide)
> - Parameter reference? See [MCP Tools](#4--mcp-tools-1-total)
> - Usage patterns? See [Usage Patterns](#7--usage-patterns)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 🎯 TOOL SELECTION GUIDE](#3--tool-selection-guide)
- [4. 🔧 MCP TOOLS (1 TOTAL)](#4--mcp-tools-1-total)
- [5. 🏗️ ARCHITECTURE](#5--architecture)
- [6. ⚙️ CONFIGURATION](#6--configuration)
- [7. 💡 USAGE PATTERNS](#7--usage-patterns)
- [8. 🛠️ TROUBLESHOOTING](#8--troubleshooting)
- [9. ❓ FAQ](#9--faq)
- [10. 📚 RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

### What It Does

Code Context provides **structural intelligence** for codebases through Tree-sitter AST (Abstract Syntax Tree) parsing. Unlike text search which matches characters, or semantic search which matches meaning, Code Context matches **code structure** - actual function definitions, class declarations, and symbol relationships.

### Key Differentiator

**When you need to know "what symbols exist in this file" rather than "find text X" or "understand how Y works".**

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **AST-Aware Parsing** | Uses Tree-sitter for language-aware symbol extraction |
| **Symbol Extraction** | Lists functions, classes, methods, variables, imports, exports |
| **Directory Trees** | Visualizes folder hierarchy with configurable depth |
| **Symbol Filtering** | Filter by type (functions, classes, variables, etc.) |
| **Multi-Language** | JavaScript, TypeScript, Python, and more |
| **Precise Navigation** | Find where symbols are defined, not just mentioned |

### How It Compares

| Feature | Code Context | Grep | LEANN |
|---------|--------------|------|-------|
| **Query Type** | Structural | Lexical | Semantic |
| **Matches** | Code structure | Text patterns | Meaning/intent |
| **Best For** | "List functions" | "Find 'TODO'" | "How does X work?" |
| **Precision** | Very high | Medium | Context-dependent |
| **False Positives** | Low | High | Low |
| **Speed** | Fast | Very fast | Medium |

### Use Case Comparison

| Need | Tool | Example |
|------|------|---------|
| List all functions in file | **Code Context** | "What functions are in auth.ts?" |
| Find text pattern | Grep | "Find all TODO comments" |
| Understand code intent | LEANN | "How does authentication work?" |
| Read file contents | Read | "Show me auth.ts" |
| Find files by name | Glob | "Find all *.test.js files" |

### Source Information

| Property | Value |
|----------|-------|
| **NPM Package** | [code-context-provider-mcp](https://www.npmjs.com/package/code-context-provider-mcp) |
| **Parser** | [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) |
| **MCP Type** | Native MCP (via `opencode.json`) |
| **License** | MIT |

---

## 2. 🚀 QUICK START

### Prerequisites

| Component | Purpose | Status |
|-----------|---------|--------|
| **Node.js 18+** | Runtime environment | Required |
| **code-context-provider-mcp** | MCP server | Already installed |
| **Native MCP** | Tool execution | Configured in `opencode.json` |

### Verification

```bash
# Check if the package is available
npm list -g code-context-provider-mcp

# The tool is available as a Native MCP tool: code_context_get_code_context
```

### Basic Workflow

```typescript
// 1. Get directory structure (Native MCP - call directly)
code_context_get_code_context({
  absolutePath: "/path/to/project/src",
  analyzeJs: false,
  maxDepth: 2
});

// 2. List functions in a specific file/directory
code_context_get_code_context({
  absolutePath: "/path/to/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});

// 3. Get all symbols (functions, classes, variables)
code_context_get_code_context({
  absolutePath: "/path/to/project/src/auth.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
});
```

### First Use Example

```typescript
// Task: "What functions are in the src folder?"
// Native MCP - call directly (no call_tool_chain wrapper needed)
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions",
  maxDepth: 2
});
```

---

## 3. 🎯 TOOL SELECTION GUIDE

### Tool at a Glance

| Tool | Purpose | Speed | Use When |
|------|---------|-------|----------|
| `get_code_context` | Structural analysis | <1s | List symbols, view structure |

### Tool Selection Flowchart

```
User Request
     │
     ▼
┌────────────────────────────────────────┐
│ What kind of search do you need?       │
└───────────────┬────────────────────────┘
                │
    ┌───────────┼───────────┬───────────┐
    │           │           │           │
    ▼           ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│Structure│  │ Text   │  │Meaning │  │ Read   │
│ Query  │  │Pattern │  │ Query  │  │ File   │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │
    ▼           ▼           ▼           ▼
 Code         Grep        LEANN        Read
 Context                               Tool
```

### When to Use Code Context

**✅ USE Code Context for:**
- Listing all functions, classes, or methods in a file
- Getting a high-level structure view of a directory
- Finding where a specific symbol is defined
- Understanding code organization before reading
- Symbol-based navigation (vs text-based)

**❌ DO NOT use Code Context for:**
- Semantic questions: "How does auth work?" → Use LEANN
- Text pattern matching: "Find TODO comments" → Use Grep
- Reading file contents → Use Read tool
- File pattern search: "Find *.test.js" → Use Glob
- Known file paths → Use Read directly

### Smart Routing Logic

```
Need to list functions?      → Code Context
Need to find text pattern?   → Grep
Need to understand meaning?  → LEANN
Need to read file content?   → Read
Need to find files by name?  → Glob
```

---

## 4. 🔧 MCP TOOLS (1 TOTAL)

### 4.1 get_code_context

**Purpose**: Analyze code structure using Tree-sitter AST parsing.

**Access**: Native MCP (direct call - no wrapper needed)

**Tool Name**: `code_context_get_code_context`

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `absolutePath` | string | **Yes** | - | Absolute path to file or directory |
| `analyzeJs` | boolean | No | `false` | Enable AST symbol extraction |
| `includeSymbols` | boolean | No | `false` | Include symbol list in response |
| `symbolType` | string | No | `"all"` | Filter: functions/classes/variables/imports/exports/all |
| `maxDepth` | number | No | `5` | Maximum directory recursion depth |

### symbolType Values

| Value | Returns |
|-------|---------|
| `"functions"` | Function declarations and expressions |
| `"classes"` | Class declarations |
| `"variables"` | Variable declarations |
| `"imports"` | Import statements |
| `"exports"` | Export declarations |
| `"all"` | All symbol types (default) |

### Example: Directory Tree

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: false,
  maxDepth: 2
});
```

**Output**:
```
src/
├── components/
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── Form/
├── utils/
│   ├── api.ts
│   └── helpers.ts
└── index.ts
```

### Example: List Functions

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
```

**Output**:
```json
{
  "symbols": [
    { "name": "handleLogin", "type": "function", "line": 45 },
    { "name": "validateToken", "type": "function", "line": 78 },
    { "name": "refreshSession", "type": "function", "line": 112 }
  ]
}
```

### Example: All Symbols

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all",
  maxDepth: 3
});
```

---

## 5. 🏗️ ARCHITECTURE

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Direct MCP call
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               code-context-provider-mcp Server                  │
│                    (Native MCP in opencode.json)                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Tree-sitter Parser                      │  │
│  │  • JavaScript/TypeScript grammar                          │  │
│  │  • Python grammar                                         │  │
│  │  • Multi-language support                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Symbol Extractor                        │  │
│  │  • Functions, classes, methods                            │  │
│  │  • Variables, imports, exports                            │  │
│  │  • Line numbers and positions                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Structured JSON Response
```

### How Tree-sitter Works

```
Source Code ──► Tree-sitter Parser ──► AST ──► Symbol Extraction ──► JSON
     │                  │                │              │                │
     ▼                  ▼                ▼              ▼                ▼
  .js/.ts/.py     Language-specific   Parse tree   Functions,      Structured
  source files    grammar rules       nodes        Classes,        response
                                                   Methods
```

**Tree-sitter** is a parser generator and incremental parsing library:
- Produces concrete syntax trees for source files
- Language-agnostic - supports many languages via grammars
- Fast and incremental - can update on file changes
- Error-tolerant - produces trees even for broken code

### Supported Languages

| Language | Extension | Symbol Extraction |
|----------|-----------|-------------------|
| JavaScript | `.js` | ✅ Full |
| TypeScript | `.ts`, `.tsx` | ✅ Full |
| Python | `.py` | ✅ Full |
| CSS | `.css` | ⚠️ Limited |
| HTML | `.html` | ⚠️ Limited |
| JSON | `.json` | ⚠️ Structure only |
| Markdown | `.md` | ⚠️ Headers only |

---

## 6. ⚙️ CONFIGURATION

### MCP Type: Native MCP

**IMPORTANT**: Code Context is a **Native MCP tool** configured in `opencode.json`. Call it directly without any wrapper.

| System | Config File | Examples |
|--------|-------------|----------|
| **Native MCP** | `opencode.json` | LEANN, Sequential Thinking, Semantic Memory, **Code Context** |
| **Code Mode MCP** | `.utcp_config.json` | Webflow, Figma, ClickUp (external tools) |

### opencode.json Entry

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

### Tool Invocation

```typescript
// Native MCP - call directly (no wrapper needed)
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});

// Common mistakes:
// ❌ call_tool_chain(`code_context.code_context_get_code_context({...})`)
// ❌ await code_context.get_code_context({...});
// ✅ code_context_get_code_context({...});
```

### Discovery Commands

```typescript
// The tool is registered as a Native MCP tool
// Tool name: code_context_get_code_context
// No discovery commands needed - call directly
```

---

## 7. 💡 USAGE PATTERNS

### Pattern 1: Explore Directory Structure

**Use case**: Get a high-level view of a project's organization.

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: false,
  maxDepth: 2
});
```

### Pattern 2: List Functions Before Reading

**Use case**: Understand what's in a file before reading the full content.

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
// Follow-up: Use Read tool to read specific function implementation
```

### Pattern 3: Find Class Definitions

**Use case**: Map out the class hierarchy in a codebase.

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes",
  maxDepth: 3
});
```

### Pattern 4: Combine with LEANN

**Use case**: Structure first, then understanding.

```typescript
// Step 1: Code Context - Find what exists (Native MCP)
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
});

// Step 2: LEANN - Understand how it works (also Native MCP)
leann_search({
  index_name: "my-project",
  query: "authentication flow"
});
```

### Pattern 5: Pre-Refactoring Analysis

**Use case**: Map out dependencies before making changes.

```typescript
// Get exports from the file you want to refactor
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/utils/helpers.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "exports"
});

// Get imports from files that might depend on it
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "imports",
  maxDepth: 2
});
```

---

## 8. 🛠️ TROUBLESHOOTING

### Common Errors

#### "Path must be absolute"

**Cause**: Relative path used instead of absolute path.

**Solution**:
```typescript
// ❌ Wrong - relative path
absolutePath: "./src"

// ✅ Correct - absolute path
absolutePath: "/Users/dev/project/src"
```

#### "Tool is not a function"

**Cause**: Wrong tool naming or trying to use Code Mode wrapper.

**Solution**:
```typescript
// ❌ Wrong - Code Mode pattern (no longer used)
await code_context.code_context_get_code_context({...});

// ❌ Wrong - call_tool_chain wrapper (no longer needed)
call_tool_chain(`code_context.code_context_get_code_context({...})`);

// ✅ Correct - Native MCP direct call
code_context_get_code_context({...});
```

#### Empty Results

**Cause**: Path doesn't exist, wrong file type, or parsing error.

**Solution**:
1. Verify path exists with Glob or List tool
2. Check file extension is supported (`.js`, `.ts`, `.py`)
3. Ensure `analyzeJs: true` for symbol extraction

#### Timeout on Large Directories

**Cause**: Too deep recursion or too many files.

**Solution**:
1. Reduce `maxDepth` to 2 or 3
2. Target specific subdirectory instead of root
3. Break into multiple smaller queries

### Diagnostic Commands

```typescript
// Test with simple query (Native MCP - call directly)
code_context_get_code_context({
  absolutePath: "/Users/dev/project",
  analyzeJs: false,
  maxDepth: 1
});
```

### Quick Fixes

| Problem | Fix |
|---------|-----|
| Empty symbols | Add `analyzeJs: true` and `includeSymbols: true` |
| Wrong tool name | Use `code_context_get_code_context` (direct call) |
| Path error | Convert to absolute path |
| Timeout | Reduce `maxDepth` or target subdirectory |
| Missing types | Check file extension is supported |

---

## 9. ❓ FAQ

### General Questions

**Q: What's the difference between Code Context and Grep?**

A: Code Context uses AST parsing to understand code structure - it finds actual function definitions, not just text matches. Grep matches text patterns and may return false positives (comments, variable names, etc.).

**Q: What's the difference between Code Context and LEANN?**

A: Code Context answers "what exists?" (structure). LEANN answers "what does it mean?" (semantics). Use Code Context to list functions, use LEANN to understand how they work.

**Q: Why use Code Context instead of just reading the file?**

A: For large files, Code Context gives you a quick overview (list of functions) without reading thousands of lines. It's faster and uses less context.

**Q: Does Code Context understand code meaning?**

A: No. Code Context only understands structure (syntax). For meaning, use LEANN.

### Technical Questions

**Q: Why do I need absolute paths?**

A: MCP tools run in a sandboxed environment and need absolute paths to resolve file locations correctly.

**Q: Which languages are supported?**

A: Full support for JavaScript, TypeScript, and Python. Limited support for CSS, HTML, JSON, and Markdown.

**Q: Can I use Code Context for non-code files?**

A: Limited. It can parse JSON structure and Markdown headers, but it's optimized for code.

**Q: Why is the tool name so long?**

A: The tool follows Native MCP naming: `{server}_{tool}`. Code Context uses `code_context_get_code_context`.

**Q: Is Code Context a native MCP tool?**

A: Yes! Code Context is configured in `opencode.json` as a Native MCP tool. Call it directly with `code_context_get_code_context({...})` - no `call_tool_chain()` wrapper needed.

---

## 10. 📚 RESOURCES

### Bundled Files

| File | Purpose |
|------|---------|
| [SKILL.md](./SKILL.md) | AI agent instructions for Code Context |
| [references/tool_catalog_reference.md](./references/tool_catalog_reference.md) | Complete parameter reference |
| [assets/usage_examples.md](./assets/usage_examples.md) | Common query patterns and examples |

### External Resources

- [code-context-provider-mcp](https://www.npmjs.com/package/code-context-provider-mcp) - NPM package
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) - The underlying AST parsing library
- [Tree-sitter Playground](https://tree-sitter.github.io/tree-sitter/playground) - Interactive AST explorer

### Related Skills

| Skill | Purpose | MCP Type |
|-------|---------|----------|
| **[mcp-leann](../mcp-leann/README.md)** | Semantic code search | Native MCP |
| **[mcp-code-mode](../mcp-code-mode/README.md)** | External tool execution (Webflow, Figma, etc.) | Native MCP (wrapper) |
| **[system-memory](../system-memory/README.md)** | Context preservation | Native MCP |

### Cross-Skill Workflow

```typescript
// 1. Code Context - Find what symbols exist (Native MCP)
code_context_get_code_context({
  absolutePath: "/path/to/src",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});

// 2. LEANN - Understand how they work (Native MCP)
leann_search({
  index_name: "my-project",
  query: "authentication flow"
});

// 3. Read - Get full implementation
// Use Read tool on specific file:line found

// 4. Semantic Memory - Save context for future sessions
// Use memory_save to preserve decisions
```

---

## Quick Reference Card

### Essential Query Patterns

```typescript
// Directory tree (structure only) - Native MCP
code_context_get_code_context({
  absolutePath: "/absolute/path/to/dir",
  analyzeJs: false,
  maxDepth: 2
});

// File outline (all symbols) - Native MCP
code_context_get_code_context({
  absolutePath: "/absolute/path/to/file.ts",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
});

// Functions only - Native MCP
code_context_get_code_context({
  absolutePath: "/absolute/path/to/dir",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});

// Classes only - Native MCP
code_context_get_code_context({
  absolutePath: "/absolute/path/to/dir",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
});
```

### Tool Selection Quick Guide

```
"List functions in..."     → Code Context
"Find text 'TODO'..."      → Grep
"How does X work?"         → LEANN
"Read file..."             → Read tool
"Find *.test.js files"     → Glob
```

### Parameter Defaults

| Parameter | Default | Recommendation |
|-----------|---------|----------------|
| `analyzeJs` | `false` | Set `true` for symbol extraction |
| `includeSymbols` | `false` | Set `true` when listing symbols |
| `symbolType` | `"all"` | Filter for efficiency |
| `maxDepth` | `5` | Use `2-3` for exploration |

---

**Remember**: Code Context provides **structural intelligence** - it tells you *what exists* and *where*, not *how it works* or *why*. For semantic understanding, pair with LEANN. For text patterns, use Grep. **Native MCP tool - call directly with `code_context_get_code_context({...})`**.
