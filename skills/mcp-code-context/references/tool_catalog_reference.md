# Tool Catalog - Code Context Provider

Complete reference for the `get_code_context` tool with parameters, examples, troubleshooting, and configuration options.

**Usage:** This catalog provides comprehensive documentation for the code-context-provider-mcp tool. Use it when you need exact parameter specifications, understand output formats, or troubleshoot issues.

---

## 1. 📖 HOW TO USE THIS CATALOG

### Quick Discovery

The tool is available as a **Native MCP tool** (direct call, no wrapper needed):

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/path/to/analyze",
  analyzeJs: true,
  includeSymbols: true
});
```

### This Catalog is Useful For

- Understanding all available parameters and their effects
- Planning queries before execution
- Troubleshooting common issues
- Understanding output structure
- Quick reference when building complex queries

### Catalog Structure

| Section                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| §2 Tool Overview       | High-level capabilities and architecture |
| §3 Parameter Reference | Detailed parameter documentation         |
| §4 Output Formats      | Understanding response structures        |
| §5 Usage Patterns      | Common query patterns                    |
| §6 Configuration       | Setup and environment                    |
| §7 Troubleshooting     | Common issues and fixes                  |

---

## 2. 🗂️ TOOL OVERVIEW

### Available Tools

| Tool               | Purpose                       | Speed | Use When               |
| ------------------ | ----------------------------- | ----- | ---------------------- |
| `get_code_context` | Extract structure and symbols | 1-5s  | Structural exploration |

**Total:** 1 tool (focused, single-purpose)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Query                                  │
│    "List functions in src/auth"                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Code Context Provider                          │
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
│                      JSON Response                               │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   Directory Tree    │  │      Symbol List                │   │
│  │   (Structure)       │  │      (Functions, Classes)       │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Processing Flow

```
get_code_context()
       │
       ▼
┌────────────────────────────────────────┐
│  Path Validation                       │
│  (Must be absolute, must exist)        │
└────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Directory Scanning                    │
│  (Respects .gitignore)                 │
│  (Applies maxDepth limit)              │
└────────────────────────────────────────┘
       │
       ├─── analyzeJs: false ───────────────┐
       │                                    │
       ▼                                    ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  Tree Structure Only │    │  Tree + AST Parsing      │
│  (Fast, lightweight) │    │  (Extracts symbols)      │
└──────────────────────┘    └──────────────────────────┘
       │                                    │
       ▼                                    ▼
┌────────────────────────────────────────────────────┐
│                  JSON Response                      │
│    { tree: [...], symbols: [...] }                 │
└────────────────────────────────────────────────────┘
```

---

## 3. 🔧 PARAMETER REFERENCE

### get_code_context

**Purpose**: Returns directory structure and/or AST-based symbol analysis of a project.

### Parameters Table

| Parameter        | Type    | Required | Default | Description                                   |
| ---------------- | ------- | -------- | ------- | --------------------------------------------- |
| `absolutePath`   | string  | **Yes**  | -       | Absolute path to directory or file to analyze |
| `analyzeJs`      | boolean | No       | `false` | Enable AST parsing for symbol extraction      |
| `includeSymbols` | boolean | No       | `false` | Include symbol list in response               |
| `symbolType`     | string  | No       | `"all"` | Filter symbols by type                        |
| `maxDepth`       | number  | No       | `5`     | Maximum directory recursion depth             |

### Parameter Details

#### `absolutePath` (Required)

**Purpose**: Specifies the target directory or file to analyze.

**Requirements**:
- MUST be an absolute path (starts with `/` on Unix, `C:\` on Windows)
- MUST exist on the filesystem
- Can be a directory (for tree + symbols) or file (for symbols only)

**Examples**:
```javascript
// ✅ Correct - Absolute paths
"/Users/dev/project/src"
"/Users/dev/project/src/auth/login.ts"
"C:\\Users\\dev\\project\\src"  // Windows

// ❌ Wrong - Relative paths
"./src"
"src/auth"
"../project"
```

**Common Errors**:
```javascript
// Error: "Path must be absolute"
// Fix: Resolve to absolute path first
const absolutePath = path.resolve(process.cwd(), "./src");
```

#### `analyzeJs` (Optional)

**Purpose**: Enables AST parsing for JavaScript, TypeScript, and Python files.

**Values**:
| Value   | Effect                                           |
| ------- | ------------------------------------------------ |
| `true`  | Parse files, extract symbols (slower, more data) |
| `false` | Directory tree only (faster, structure only)     |

**When to use `true`**:
- You need to list functions, classes, methods
- You need to understand code organization
- You want symbol-level information

**When to use `false`**:
- You only need directory structure
- You want fast response times
- Files are not JS/TS/Python

#### `includeSymbols` (Optional)

**Purpose**: Controls whether symbol list is included in response.

**Note**: Only relevant when `analyzeJs: true`. If `analyzeJs: false`, symbols are not extracted regardless of this setting.

**Values**:
| Value   | Effect                              |
| ------- | ----------------------------------- |
| `true`  | Include `symbols` array in response |
| `false` | Omit `symbols` array (tree only)    |

#### `symbolType` (Optional)

**Purpose**: Filters extracted symbols by type.

**Values**:
| Value         | Extracts                                        |
| ------------- | ----------------------------------------------- |
| `"functions"` | Function declarations, arrow functions, methods |
| `"classes"`   | Class declarations                              |
| `"variables"` | Variable declarations (const, let, var)         |
| `"imports"`   | Import statements                               |
| `"exports"`   | Export declarations                             |
| `"all"`       | All symbol types (default)                      |

**Examples**:
```javascript
// Functions only - for API exploration
{ symbolType: "functions" }

// Classes only - for OOP structure
{ symbolType: "classes" }

// Imports only - for dependency analysis
{ symbolType: "imports" }
```

#### `maxDepth` (Optional)

**Purpose**: Limits directory recursion depth to prevent timeout and context overflow.

**Values**:
| Value | Use Case                                       |
| ----- | ---------------------------------------------- |
| `1`   | Top-level only                                 |
| `2`   | Recommended for initial exploration            |
| `3`   | Moderate depth                                 |
| `5`   | Default, good for most cases                   |
| `10+` | Deep analysis (may timeout on large codebases) |

**Guidance**:
```javascript
// Project overview - stay shallow
{ maxDepth: 2 }

// Specific module - go deeper
{ maxDepth: 5 }

// Monorepo root - stay very shallow
{ maxDepth: 1 }
```

---

## 4. 📤 OUTPUT FORMATS

### Response Structure

```typescript
interface CodeContextResponse {
  tree: TreeNode[];      // Directory structure
  symbols?: Symbol[];    // Extracted symbols (if analyzeJs: true)
  metadata?: {
    path: string;
    filesAnalyzed: number;
    totalSymbols: number;
  };
}

interface TreeNode {
  name: string;          // File or directory name
  type: "file" | "directory";
  path: string;          // Full path
  children?: TreeNode[]; // Subdirectories/files
}

interface Symbol {
  name: string;          // Symbol name (e.g., "handleLogin")
  type: string;          // Symbol type (e.g., "function")
  file: string;          // File containing symbol
  line: number;          // Line number
  column?: number;       // Column position
}
```

### Example Responses

#### Directory Tree Only (analyzeJs: false)

```javascript
// Query
{
  absolutePath: "/Users/dev/project/src",
  analyzeJs: false,
  maxDepth: 2
}

// Response
{
  "tree": [
    {
      "name": "src",
      "type": "directory",
      "path": "/Users/dev/project/src",
      "children": [
        {
          "name": "components",
          "type": "directory",
          "path": "/Users/dev/project/src/components",
          "children": [
            { "name": "Button.tsx", "type": "file", "path": "..." },
            { "name": "Modal.tsx", "type": "file", "path": "..." }
          ]
        },
        {
          "name": "utils",
          "type": "directory",
          "path": "/Users/dev/project/src/utils",
          "children": [
            { "name": "api.ts", "type": "file", "path": "..." },
            { "name": "helpers.ts", "type": "file", "path": "..." }
          ]
        },
        { "name": "index.ts", "type": "file", "path": "..." }
      ]
    }
  ]
}
```

#### With Symbols (analyzeJs: true)

```javascript
// Query
{
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
}

// Response
{
  "tree": [...],
  "symbols": [
    {
      "name": "handleLogin",
      "type": "function",
      "file": "/Users/dev/project/src/auth/login.ts",
      "line": 45
    },
    {
      "name": "validateToken",
      "type": "function",
      "file": "/Users/dev/project/src/auth/token.ts",
      "line": 12
    },
    {
      "name": "refreshSession",
      "type": "function",
      "file": "/Users/dev/project/src/auth/session.ts",
      "line": 78
    }
  ],
  "metadata": {
    "path": "/Users/dev/project/src/auth",
    "filesAnalyzed": 5,
    "totalSymbols": 3
  }
}
```

#### Classes Only

```javascript
// Query
{
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
}

// Response
{
  "tree": [...],
  "symbols": [
    {
      "name": "User",
      "type": "class",
      "file": "/Users/dev/project/src/models/User.ts",
      "line": 5
    },
    {
      "name": "Product",
      "type": "class",
      "file": "/Users/dev/project/src/models/Product.ts",
      "line": 8
    }
  ]
}
```

---

## 5. 🔄 USAGE PATTERNS

### Pattern 1: Project Overview

**Goal**: Quick understanding of project structure

```typescript
// Native MCP - call directly (shallow exploration)
code_context_get_code_context({
  absolutePath: "/Users/dev/project",
  analyzeJs: false,
  maxDepth: 2
});
```

**When to use**: Starting work on unfamiliar project, getting oriented.

### Pattern 2: Module Deep Dive

**Goal**: Understand specific module in detail

```typescript
// Native MCP - call directly (deep dive)
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all",
  maxDepth: 5
});
```

**When to use**: Working on specific feature, understanding dependencies.

### Pattern 3: Function Discovery

**Goal**: Find all functions in a directory

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/utils",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
```

**When to use**: Looking for specific functionality, API exploration.

### Pattern 4: Class Mapping

**Goal**: Map object-oriented structure

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
});
```

**When to use**: Understanding OOP design, finding entity definitions.

### Pattern 5: Dependency Analysis

**Goal**: Understand import structure

```typescript
// Native MCP - call directly
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/components/Button.tsx",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "imports"
});
```

**When to use**: Understanding dependencies, refactoring imports.

---

## 6. ⚙️ CONFIGURATION

### MCP Registration

Code Context Provider is registered in `opencode.json` as a **Native MCP tool**:

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

**Native MCP (direct call - recommended)**:
```typescript
// Call directly - no wrapper needed
code_context_get_code_context({
  absolutePath: "/absolute/path",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions",
  maxDepth: 3
});
```

**Via Bash (alternative)**:
```bash
# Direct MCP CLI invocation
npx code-context-provider-mcp get_code_context \
  --absolutePath "/absolute/path" \
  --analyzeJs true \
  --includeSymbols true
```

### Prerequisites

| Component                 | Purpose          | Installation                               |
| ------------------------- | ---------------- | ------------------------------------------ |
| Node.js                   | Runtime          | `brew install node`                        |
| code-context-provider-mcp | MCP server       | `npm install -g code-context-provider-mcp` |
| Tree-sitter grammars      | Language parsing | Included with package                      |

### Supported File Types

| Extension | Language         | Symbol Extraction |
| --------- | ---------------- | ----------------- |
| `.js`     | JavaScript       | ✅ Full            |
| `.jsx`    | React JavaScript | ✅ Full            |
| `.ts`     | TypeScript       | ✅ Full            |
| `.tsx`    | React TypeScript | ✅ Full            |
| `.py`     | Python           | ✅ Full            |
| `.css`    | CSS              | ⚠️ Selectors only  |
| `.html`   | HTML             | ⚠️ Limited         |
| `.json`   | JSON             | ⚠️ Structure only  |
| `.md`     | Markdown         | ⚠️ Headers only    |

---

## 7. 🔧 TROUBLESHOOTING

### Path Errors

**Problem**: `Error: Path must be absolute`

**What it means**: Relative path was provided instead of absolute.

**Fix**:
```javascript
// ❌ Wrong
{ absolutePath: "./src" }

// ✅ Correct
{ absolutePath: "/Users/dev/project/src" }

// ✅ Resolve dynamically
const path = require('path');
{ absolutePath: path.resolve(process.cwd(), "./src") }
```

---

**Problem**: `Error: Path does not exist`

**What it means**: The specified path doesn't exist on the filesystem.

**Fix**:
```bash
# Verify path exists
ls -la /Users/dev/project/src

# Check for typos
# Common issues: wrong project name, missing subdirectory
```

---

### Timeout Errors

**Problem**: Query times out or takes too long

**What it means**: Directory is too large or maxDepth is too high.

**Fix**:
```javascript
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

---

### Empty Results

**Problem**: Response has empty symbols array

**What it means**: No matching symbols found, or wrong configuration.

**Fix**:
```javascript
// Check 1: Is analyzeJs enabled?
{ analyzeJs: true }  // Must be true for symbols

// Check 2: Is includeSymbols enabled?
{ includeSymbols: true }  // Must be true

// Check 3: Are files the right type?
// Only JS/TS/Python files are analyzed

// Check 4: Is symbolType too restrictive?
{ symbolType: "all" }  // Try "all" first
```

---

### Parse Errors

**Problem**: AST parsing fails for specific files

**What it means**: Syntax error in file, or unsupported language feature.

**Fix**:
```javascript
// Option 1: Skip problematic file
// Target a different directory that excludes the file

// Option 2: Use tree-only mode
{ analyzeJs: false }

// Option 3: Fix syntax error in source file
// Check for unclosed brackets, invalid syntax
```

---

## 8. 📝 SUMMARY

**Tool**: `get_code_context`

**Purpose**: Structural analysis of codebases using Tree-sitter AST parsing.

**Key Parameters**:
| Parameter      | Most Common Value        | Purpose                  |
| -------------- | ------------------------ | ------------------------ |
| `absolutePath` | Project path             | Target to analyze        |
| `analyzeJs`    | `true` or `false`        | Enable symbol extraction |
| `symbolType`   | `"functions"` or `"all"` | Filter symbol types      |
| `maxDepth`     | `2` or `3`               | Limit recursion          |

**Best Practices**:
1. Always use absolute paths
2. Start with shallow depth, drill deeper as needed
3. Use `analyzeJs: false` for quick structure overview
4. Combine with Read tool for full file content
5. Fall back to Grep for text patterns

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [SKILL.md](../SKILL.md) - AI agent instructions for Code Context integration
- [usage_examples.md](../assets/usage_examples.md) - Common query patterns

### Related Skills
- **mcp-leann** - Semantic code search (for "how" and "why" questions)
- **workflows-code** - Code implementation workflow

### External Resources
- [code-context-provider-mcp](https://www.npmjs.com/package/code-context-provider-mcp) - NPM package
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) - AST parsing library

---

## ⚡ Quick Reference Card

### Essential Queries

```typescript
// Directory tree only (fast) - Native MCP
code_context_get_code_context({
  absolutePath: "/path",
  analyzeJs: false,
  maxDepth: 2
});

// All symbols - Native MCP
code_context_get_code_context({
  absolutePath: "/path",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
});

// Functions only - Native MCP
code_context_get_code_context({
  absolutePath: "/path",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
```

### Parameter Cheat Sheet

| Goal           | analyzeJs | symbolType    | maxDepth |
| -------------- | --------- | ------------- | -------- |
| Quick overview | `false`   | -             | `2`      |
| Function list  | `true`    | `"functions"` | `3`      |
| Class map      | `true`    | `"classes"`   | `3`      |
| Full analysis  | `true`    | `"all"`       | `5`      |

---

**Usage Complete!**

Start with a simple query (Native MCP - call directly):
```typescript
code_context_get_code_context({
  absolutePath: "/your/project/path",
  analyzeJs: false,
  maxDepth: 2
});
```

Then drill deeper as needed.
