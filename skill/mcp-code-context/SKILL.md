---
name: mcp-code-context
description: "Structural intelligence for codebases using Tree-sitter AST analysis. Provides precise structural queries like listing functions, classes, and definitions, bridging the gap between lexical search (grep) and semantic search (LEANN). Use for structural exploration, symbol navigation, and codebase mapping."
allowed-tools: [Bash, Read, code_context_get_code_context]
version: 1.1.0
---

<!-- Keywords: ast, tree-sitter, code-structure, symbols, functions, classes, definitions, outline, tree-view, structural-search, code-context-provider -->

# MCP Code Context - Structural Intelligence

Structural code analysis via AST (Abstract Syntax Tree) parsing, enabling precise navigation and understanding of code structure. Unlike lexical search (grep) which matches text, or semantic search (LEANN) which matches meaning, Code Context matches **structure** - functions, classes, methods, and their relationships.

**Key Differentiator**: When you need to know "what symbols exist in this file" rather than "find text X" or "understand how Y works".

> **Important:** The `absolutePath` parameter must be a **directory path**, not a file path. To analyze a single file, provide its parent directory and use `maxDepth: 1`.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use when**:
- You need to list all functions, classes, or definitions in a file
- You need to see the high-level structure (tree) of a directory
- You need to find where a specific symbol is defined (structural search)
- You need to understand the relationships between code components
- Grep returns too many irrelevant matches (e.g., finding "save" function vs. the word "save")
- You want to understand a file's organization before reading its contents

**Keyword Triggers**:
- "list functions in [file]"
- "show structure of [file/dir]"
- "outline [file]"
- "tree view"
- "find definition of [symbol]"
- "what classes are in [file]"
- "show me the symbols"
- "codebase structure"
- "directory tree"

### Use Cases

### Structural Exploration

When you need to understand *how* a file is organized before reading the entire content. This is more efficient than reading raw file content for large files.

**Example scenarios**:
- "What functions are in this 2000-line file?" → Structural query avoids reading all 2000 lines
- "How is the src folder organized?" → Tree view shows hierarchy without listing every file
- "What methods does this class have?" → Symbol extraction shows API surface

### Precise Navigation

When you know *what* you are looking for (e.g., "User class") but not *where* it is, and you want to avoid false positives from text search.

**Example scenarios**:
- "Find the User class" → Grep would match "User", "UserService", comments about users, etc.
- "Where is handleSubmit defined?" → AST search finds the actual function definition
- "List all exported functions" → Structural filter for export declarations only

### Codebase Mapping

When you need to build a mental map of a directory's architecture without reading every file.

**Example scenarios**:
- "Give me an overview of the project" → Tree view with depth limit
- "What's in the utils folder?" → Directory structure visualization
- "How many files are in src/components?" → Tree analysis

### Tool Selection Matrix

| Need | Tool | Why |
|------|------|-----|
| Find function definitions | **Code Context** | AST-aware symbol search |
| Find text pattern | Grep | Lexical pattern matching |
| Understand code intent | LEANN | Semantic search by meaning |
| Read file contents | Read | Direct file access |
| List files by pattern | Glob | Filename pattern matching |
| Known file path | Read | Fastest, no overhead |

### When NOT to Use

**Do not use for**:
- **Semantic questions**: "How does auth work?" → Use `leann_search` (LEANN understands meaning)
- **Exact text matching**: "Find 'TODO' comments" → Use `Grep` (text pattern matching)
- **Reading file content**: "Read file.js" → Use `Read` (direct file access)
- **Writing code**: This skill is read-only
- **File pattern search**: "Find all *.test.js files" → Use `Glob`
- **Known file paths**: If you already know the path, just use Read

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Need API details/tool parameters
    │   └─► Load: references/tool_catalog_reference.md
    │
    ├─► Need usage patterns/examples
    │   └─► Load: assets/usage_examples.md
    │
    ├─► Semantic question ("How does X work?")
    │   └─► REDIRECT: Use mcp-leann skill instead
    │
    ├─► Exact text search ("Find 'TODO'")
    │   └─► REDIRECT: Use Grep tool instead
    │
    ├─► Known file path
    │   └─► REDIRECT: Use Read tool instead
    │
    └─► Structural Query ("List functions in...")
        └─► Use SKILL.md + get_code_context tool
```

### Resource Router

```python
def route_code_context_resources(task):
    """
    Resource Router for mcp-code-context skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # TOOL CATALOG & API REFERENCE
    # Purpose: Detailed documentation of get_code_context parameters
    # Key Insight: Use when you need exact parameter names, types, and values
    # ──────────────────────────────────────────────────────────────────
    if task.needs_api_details or task.needs_tool_params:
        return load("references/tool_catalog_reference.md")  # Complete parameter reference

    # ──────────────────────────────────────────────────────────────────
    # USAGE EXAMPLES
    # Purpose: Concrete examples of structural queries
    # Key Insight: Use when you need patterns for common tasks
    # ──────────────────────────────────────────────────────────────────
    if task.needs_examples or task.uncertain_about_query:
        return load("assets/usage_examples.md")  # Example patterns

    # ──────────────────────────────────────────────────────────────────
    # REDIRECT: SEMANTIC QUESTIONS
    # Purpose: Route semantic queries to appropriate tool
    # Key Insight: Code Context doesn't understand meaning, only structure
    # ──────────────────────────────────────────────────────────────────
    if task.is_semantic_question:
        return redirect("mcp-leann")  # Use LEANN for "how" and "why"

    # ──────────────────────────────────────────────────────────────────
    # REDIRECT: TEXT SEARCH
    # Purpose: Route text pattern searches to Grep
    # Key Insight: Grep is faster and more precise for exact text
    # ──────────────────────────────────────────────────────────────────
    if task.is_text_search:
        return redirect("Grep")  # Use Grep for pattern matching

    # Default: SKILL.md covers basic structural queries
    return None

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# references/tool_catalog_reference.md → Complete get_code_context documentation
# assets/usage_examples.md             → Common query patterns and examples
```

---

## 3. 🛠️ HOW IT WORKS

### Architecture Overview

Code Context Provider uses Tree-sitter to parse source code into ASTs and extract meaningful symbols:

```
Source Code ──► Tree-sitter Parser ──► AST ──► Symbol Extraction ──► Structured Output
     │                  │                │              │                    │
     ▼                  ▼                ▼              ▼                    ▼
  .js/.ts/.py      Language-specific   Parse tree   Functions,         JSON response
  source files     grammar rules       nodes        Classes,           with symbols
                                                    Methods,           and tree
                                                    Variables
```

### Process Flow

```
STEP 1: Identify Target
   ├─ File path (for outline/definitions)
   ├─ Directory path (for tree view)
   └─ Validate path is absolute
   ↓
STEP 2: Configure Analysis
   ├─ analyzeJs: true/false (enable symbol extraction)
   ├─ includeSymbols: true/false (include symbol list)
   ├─ symbolType: filter by type (functions/classes/all)
   └─ maxDepth: limit recursion depth
   ↓
STEP 3: Execute Query
   ├─ Call code_context_get_code_context (Native MCP - direct call)
   ├─ Parse JSON response
   └─ Handle errors gracefully
   ↓
STEP 4: Present Results
   ├─ Display tree structure
   ├─ List symbols with locations
   └─ Provide actionable next steps
```

### Key Capabilities

> **Note:** Symbol extraction (`analyzeJs: true`) returns structural information. The exact output format may vary - some installations return JSON with symbol arrays, others return ASCII tree format. Check your specific installation's behavior.

**1. File Outline**
Extracts functions, classes, methods, and variables from source files.

```javascript
// Input: code_context_get_code_context with analyzeJs: true, symbolType: "functions"
// Output: List of function names with line numbers

// Example output structure (format may vary by installation):
{
  "symbols": [
    { "name": "handleLogin", "type": "function", "line": 45 },
    { "name": "validateToken", "type": "function", "line": 78 },
    { "name": "refreshSession", "type": "function", "line": 112 }
  ]
}
```

**2. Directory Tree**
Visualizes folder hierarchy, respecting .gitignore patterns.

```javascript
// Input: code_context_get_code_context with analyzeJs: false
// Output: Tree structure of directory
```

### Output Format

The tool returns directory structure in ASCII tree format:
```
Directory structure for: /path/to/dir
├── components/
│   ├── Button.tsx (2 KB)
│   ├── Modal.tsx (3 KB)
│   └── Form/
│       ├── Input.tsx (1 KB)
│       └── Select.tsx (2 KB)
├── utils/
│   ├── api.ts (4 KB)
│   └── helpers.ts (1 KB)
└── index.ts (1 KB)
```

When `analyzeJs: true` and `includeSymbols: true`, additional symbol information may be included depending on the tool version.

**3. Symbol Filtering**
Filter symbols by type to reduce noise.

| symbolType | Returns |
|------------|---------|
| `"functions"` | Function declarations and expressions |
| `"classes"` | Class declarations |
| `"variables"` | Variable declarations |
| `"imports"` | Import statements |
| `"exports"` | Export declarations |
| `"all"` | All symbol types (default) |

### Supported Languages

Tree-sitter provides parsers for many languages. Primary support:

| Language | Extension | Symbol Extraction |
|----------|-----------|-------------------|
| JavaScript | `.js` | ✅ Full |
| TypeScript | `.ts`, `.tsx` | ✅ Full |
| Python | `.py` | ✅ Full |
| CSS | `.css` | ⚠️ Limited |
| HTML | `.html` | ⚠️ Limited |
| JSON | `.json` | ⚠️ Structure only |
| Markdown | `.md` | ⚠️ Headers only |

### Tool Invocation

> **Important:** The `absolutePath` parameter must be a **directory path**, not a file path. To analyze a single file, provide its parent directory and use `maxDepth: 1`.

**Native MCP (Direct Call)**:
```typescript
// Call directly - Code Context is a NATIVE MCP tool in opencode.json
code_context_get_code_context({
  absolutePath: "/absolute/path/to/directory",  // Must be a directory, not a file
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions",
  maxDepth: 3
});
```

**Via Bash (alternative)**:
```bash
# Using the MCP CLI directly
npx code-context-provider-mcp get_code_context \
  --absolutePath "/absolute/path/to/directory" \
  --analyzeJs true
```

---

## 4. 📖 RULES

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS Use Absolute Paths**
   - **Why**: MCP tools require absolute paths to resolve files correctly
   - **Impl**: Resolve relative paths against project root before calling
   - **Example**: `/Users/dev/project/src` not `./src`

2. **ALWAYS Prefer Structural Search Over Grep for Symbols**
   - **Why**: Grep matches text, not code. AST search matches definitions
   - **Impl**: Use `get_code_context` with `analyzeJs: true` and `includeSymbols: true`
   - **Example**: Finding "handleSubmit function" vs finding text "handleSubmit"

3. **ALWAYS Limit Depth for Large Directories**
   - **Why**: Deep recursion can timeout or overflow context
   - **Impl**: Use `maxDepth: 2` or `maxDepth: 3` for initial exploration
   - **Example**: Start shallow, then drill into specific subdirectories

4. **ALWAYS Verify Output Against Tool Response**
   - **Why**: Never hallucinate symbols that weren't in the response
   - **Impl**: Only report symbols explicitly returned by the tool
   - **Example**: If tool returns 5 functions, report exactly those 5

5. **ALWAYS Combine With Read for Full Context**
   - **Why**: Code Context shows structure, Read shows content
   - **Impl**: After finding symbols, use Read to see implementation
   - **Example**: Find `handleLogin` → Read `auth.ts:45-78` for details

### ❌ NEVER

**NEVER do these:**

1. **NEVER Use for Semantic Queries**
   - **Why**: This tool doesn't "understand" code intent, only structure
   - **Alt**: Use `mcp-leann` for "how" or "why" questions
   - **Example**: "How does auth work?" → LEANN, not Code Context

2. **NEVER Use Relative Paths**
   - **Why**: MCP tools require absolute paths
   - **Alt**: Always resolve to absolute path first
   - **Example**: `./src` will fail, use `/Users/dev/project/src`

3. **NEVER Assume Output Format**
   - **Why**: Output is structured JSON or text, varies by query type
   - **Impl**: Parse the output programmatically or present it clearly
   - **Example**: Don't assume array vs object structure

4. **NEVER Request Excessive Depth**
   - **Why**: Large codebases can timeout or overflow context
   - **Alt**: Use `maxDepth: 2` and drill into specific areas
   - **Example**: `maxDepth: 10` on root will likely fail

5. **NEVER Skip Path Validation**
   - **Why**: Invalid paths cause cryptic errors
   - **Impl**: Verify path exists before calling tool
   - **Example**: Check with Glob or List first if unsure

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF Tool Fails or Times Out**
   - **Why**: Large files or directories might choke the AST parser
   - **Action**: Ask user if they want to:
     - Fall back to `Read` (raw text)
     - Fall back to `Grep` (text search)
     - Target a specific subdirectory

2. **ESCALATE IF Path Doesn't Exist**
   - **Why**: User may have typo or outdated mental model
   - **Action**: Show similar paths using Glob, ask for clarification

3. **ESCALATE IF Unsure About Query Type**
   - **Why**: Wrong tool choice wastes time
   - **Action**: "Are you looking for code structure (Code Context), text patterns (Grep), or meaning (LEANN)?"

4. **ESCALATE IF Output is Empty**
   - **Why**: May indicate wrong path, wrong file type, or parsing error
   - **Action**: Verify path, check file extension, offer alternatives

### Troubleshooting

**ENOTDIR error**: You provided a file path instead of a directory. Use the parent directory instead.
```typescript
// Wrong: absolutePath: "/path/to/file.js"
// Right: absolutePath: "/path/to" with maxDepth: 1
```

**Empty symbol output**: Symbol extraction may not be available for all file types or tool versions. Use `Grep` for text-based symbol search as fallback.

**Timeout on large directories**: Reduce `maxDepth` to 2 or 3 for initial exploration.

**Unexpected output format**: The tool may return ASCII tree format instead of JSON. Parse the output accordingly or use the raw text for display.

---

## 5. 🎓 SUCCESS CRITERIA

### Structural Analysis Completion Checklist

**Structural Analysis Complete When:**

- ✅ Target file/directory identified correctly
- ✅ Path resolved to absolute form
- ✅ Correct tool parameters selected (analyzeJs, symbolType, maxDepth)
- ✅ Tool executed successfully without timeout
- ✅ Output parsed and presented clearly
- ✅ No hallucinated symbols (verified against tool output)
- ✅ User's structural question answered

### Quality Targets

**Target metrics**:
- **Precision**: 100% (Must match actual AST - no hallucinated symbols)
- **Performance**: Response < 5s for typical files/directories
- **Depth**: Appropriate maxDepth for query scope
- **Completeness**: All relevant symbols reported

### Validation Success

**Validation passes when**:
- ✅ Absolute path used in all queries
- ✅ Correct symbolType for user's request
- ✅ Reasonable maxDepth (2-3 for exploration, 5+ for specific deep queries)
- ✅ Output matches tool response exactly
- ✅ Follow-up actions suggested (e.g., "Use Read to see implementation")

---

## 6. 🔗 INTEGRATION POINTS

### Related Skills

**mcp-leann** (Complementary):
- Use **Code Context** for *structure*: "What functions exist?"
- Use **LEANN** for *meaning*: "How does authentication work?"
- **Workflow**: Code Context finds symbols → LEANN explains intent

**workflows-code** (Upstream):
- Use **Code Context** during the "Understand" phase of coding tasks
- Map out dependencies before making changes
- Verify structure after refactoring

### Tool Usage Guidelines

**Read Tool**: After Code Context finds symbols, use Read to see implementation
```
Code Context: Found handleLogin at auth.ts:45
→ Read: auth.ts lines 45-78 for full implementation
```

**Grep Tool**: Use for text patterns Code Context can't find
```
Code Context: Can't find "TODO" comments
→ Grep: Search for "TODO" pattern across codebase
```

**Glob Tool**: Use to verify paths before Code Context
```
Glob: Verify src/components exists
→ Code Context: Analyze src/components structure
```

### External Tools

**code-context-provider-mcp**:
- **Installation**: `npm install -g code-context-provider-mcp` (Already installed)
- **Purpose**: Provides the AST parsing engine via Tree-sitter
- **Configuration**: Registered in `opencode.json` as a Native MCP tool

### MCP Configuration

Code Context is a **Native MCP tool** (direct invocation, not Code Mode):

```json
// opencode.json
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

**Direct Invocation (Native MCP)**:
```typescript
// Call directly - no call_tool_chain() wrapper needed
code_context_get_code_context({
  absolutePath: "/path/to/dir",
  analyzeJs: true
});
```

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [tool_catalog_reference.md](./references/tool_catalog_reference.md) - Complete parameter reference for get_code_context

### Assets
- [usage_examples.md](./assets/usage_examples.md) - Common query patterns and examples

### Related Skills
- `mcp-leann` - Semantic code search (use for "how" and "why" questions)
- `workflows-code` - Code implementation workflow (uses Code Context in "Understand" phase)

### External Resources
- [code-context-provider-mcp](https://www.npmjs.com/package/code-context-provider-mcp) - NPM package
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) - The underlying AST parsing library

---

## 8. 🎯 QUICK REFERENCE

### Essential Queries

```typescript
// Directory tree (structure only)
code_context_get_code_context({
  absolutePath: "/path/to/dir",
  analyzeJs: false,
  maxDepth: 2
})

// File outline (all symbols)
code_context_get_code_context({
  absolutePath: "/path/to/dir",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
})

// Functions only
code_context_get_code_context({
  absolutePath: "/path/to/dir",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
})

// Classes only
code_context_get_code_context({
  absolutePath: "/path/to/dir",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
})

// Single file analysis (use parent directory)
code_context_get_code_context({
  absolutePath: "/path/to/parent/dir",  // NOT the file path
  analyzeJs: true,
  includeSymbols: true,
  maxDepth: 1
})
```

### Query Decision Tree

```
What do you need?
    │
    ├─► Directory structure visualization
    │   └─► code_context_get_code_context { analyzeJs: false, maxDepth: 2 }
    │
    ├─► List all functions in a file/folder
    │   └─► code_context_get_code_context { analyzeJs: true, symbolType: "functions" }
    │
    ├─► List all classes
    │   └─► code_context_get_code_context { analyzeJs: true, symbolType: "classes" }
    │
    ├─► Complete symbol overview
    │   └─► code_context_get_code_context { analyzeJs: true, symbolType: "all" }
    │
    ├─► Analyze a single file
    │   └─► code_context_get_code_context { absolutePath: "parent/dir", maxDepth: 1 }
    │
    ├─► Find text pattern
    │   └─► Use Grep instead (not Code Context)
    │
    └─► Understand code meaning
        └─► Use LEANN instead (not Code Context)
```

### Parameter Quick Reference

| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `absolutePath` | string | *required* | Absolute path to **directory** (not file) |
| `analyzeJs` | boolean | `false` | Enable AST symbol extraction |
| `includeSymbols` | boolean | `false` | Include symbols in response |
| `symbolType` | string | `"all"` | Filter: functions/classes/variables/imports/exports/all |
| `maxDepth` | number | `5` | Maximum directory recursion depth |

---

**Remember**: Code Context provides **structural intelligence** - it tells you *what exists* and *where*, not *how it works* or *why*. For semantic understanding, pair with LEANN. For text patterns, use Grep.
