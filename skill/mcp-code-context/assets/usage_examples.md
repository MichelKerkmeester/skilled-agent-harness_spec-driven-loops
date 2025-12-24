# Usage Examples - Code Context Patterns

Common patterns and examples for using `get_code_context` effectively. This asset provides ready-to-use query patterns for structural code analysis.

**Usage:** Reference this file when you need inspiration for structural queries or want to see complete working examples.

---

## 1. 🔍 SYMBOL LISTING

**Purpose**: Extract functions, classes, or definitions from specific files or directories.

### Key Points

- Use `analyzeJs: true` to enable AST parsing
- Use `symbolType` to filter noise and focus on what you need
- Target specific directories to avoid timeout on large codebases

### Template

```typescript
code_context_get_code_context({
  absolutePath: "/absolute/path/to/directory",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"  // or "classes", "variables", "all"
});
```

### Complete Examples

**Example 1: List All Functions in a File**

**User Request**: "What functions are in `src/utils/date.js`?"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/utils",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
```

**Expected Output**:
```json
{
  "symbols": [
    { "name": "formatDate", "type": "function", "file": ".../date.js", "line": 5 },
    { "name": "parseDate", "type": "function", "file": ".../date.js", "line": 23 },
    { "name": "isValidDate", "type": "function", "file": ".../date.js", "line": 45 }
  ]
}
```

**Follow-up**: Use Read tool to see implementation: `Read date.js lines 5-22`

---

**Example 2: List All Classes in a Module**

**User Request**: "What classes are in the models folder?"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/models",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "classes"
});
```

**Expected Output**:
```json
{
  "symbols": [
    { "name": "User", "type": "class", "file": ".../User.ts", "line": 8 },
    { "name": "Product", "type": "class", "file": ".../Product.ts", "line": 5 },
    { "name": "Order", "type": "class", "file": ".../Order.ts", "line": 12 }
  ]
}
```

---

**Example 3: List All Exports**

**User Request**: "What does this module export?"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/utils",  // Note: Must be directory, not file
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "exports"
});
```

---

## 2. 🌳 DIRECTORY VISUALIZATION

**Purpose**: Visualize the high-level structure of a folder without reading file contents.

### Key Points

- Use `analyzeJs: false` for speed (no AST parsing)
- Set `maxDepth` to avoid huge outputs
- Ideal for "What's in here?" queries

### Template

```typescript
code_context_get_code_context({
  absolutePath: "/absolute/path/to/folder",
  analyzeJs: false,
  maxDepth: 2
});
```

### Complete Examples

**Example 1: Show Component Structure**

**User Request**: "Show me the structure of the `components` folder"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/components",
  analyzeJs: false,
  maxDepth: 2
});
```

**Expected Output**:
```
components/
├── common/
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── Input.tsx
├── forms/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── index.ts
```

---

**Example 2: Explore Unknown Folder**

**User Request**: "What's in the `lib` folder?"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/lib",
  analyzeJs: false,
  maxDepth: 3
});
```

---

## 3. 🗺️ CODEBASE OVERVIEW

**Purpose**: Get a broad map of the project layout for orientation.

### Key Points

- Target the project root
- STRICTLY limit depth (max 2) to avoid timeout
- Disable symbol analysis for speed

### Template

```typescript
code_context_get_code_context({
  absolutePath: "/absolute/path/to/project",
  analyzeJs: false,
  maxDepth: 2
});
```

### Complete Examples

**Example 1: Project Overview**

**User Request**: "Give me a high level overview of the project structure"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project",
  analyzeJs: false,
  maxDepth: 2
});
```

**Expected Output**:
```
project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── hooks/
│   └── index.ts
├── tests/
│   ├── unit/
│   └── integration/
├── public/
│   └── assets/
├── package.json
└── tsconfig.json
```

**Follow-up**: "Now show me what's in `src/components`" → Drill deeper

---

**Example 2: Monorepo Navigation**

**User Request**: "Show me the packages in this monorepo"

**Query**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/monorepo",
  analyzeJs: false,
  maxDepth: 1  // Very shallow for monorepo root
});
```

---

## 4. 🔗 COMBINED WORKFLOWS

**Purpose**: Combine Code Context with other tools for complete analysis.

### Pattern: Find → Read → Understand

**Step 1**: Use Code Context to find symbols
```typescript
// Find the function
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions"
});
// Result: handleLogin at auth/login.ts:45
```

**Step 2**: Use Read to see implementation
```bash
Read auth/login.ts lines 45-78
```

**Step 3**: Use LEANN to understand intent (if needed)
```bash
leann ask project "How does the handleLogin function work?"
```

---

### Pattern: Structure → Symbols → Dependencies

**Step 1**: Get directory structure
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: false,
  maxDepth: 2
});
```

**Step 2**: Get symbols for interesting directory
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "all"
});
```

**Step 3**: Check imports for dependencies
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/auth",
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "imports"
});
```

---

## 5. ⚠️ ANTI-PATTERNS

**Purpose**: Common mistakes to avoid.

### Anti-Pattern 1: Relative Paths

❌ **Wrong**:
```typescript
code_context_get_code_context({
  absolutePath: "./src/components",  // Relative path!
  analyzeJs: true
});
```

✅ **Correct**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src/components",  // Absolute path
  analyzeJs: true
});
```

---

### Anti-Pattern 2: Too Deep on Large Codebases

❌ **Wrong**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/huge-monorepo",
  analyzeJs: true,
  maxDepth: 10  // Will timeout!
});
```

✅ **Correct**:
```typescript
// Start shallow
code_context_get_code_context({
  absolutePath: "/Users/dev/huge-monorepo",
  analyzeJs: false,
  maxDepth: 2
});

// Then drill into specific area
code_context_get_code_context({
  absolutePath: "/Users/dev/huge-monorepo/packages/auth",
  analyzeJs: true,
  maxDepth: 5
});
```

---

### Anti-Pattern 3: Using for Semantic Questions

❌ **Wrong** (Code Context can't answer this):
```
User: "How does authentication work?"
→ Code Context only shows STRUCTURE, not meaning
```

✅ **Correct**:
```
User: "How does authentication work?"
→ Use LEANN: leann ask project "How does authentication work?"

User: "What functions handle authentication?"
→ Use Code Context (this IS a structural question)
```

---

### Anti-Pattern 4: Forgetting to Set analyzeJs

❌ **Wrong** (no symbols returned):
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  includeSymbols: true,  // This alone doesn't enable parsing!
  symbolType: "functions"
});
```

✅ **Correct**:
```typescript
code_context_get_code_context({
  absolutePath: "/Users/dev/project/src",
  analyzeJs: true,  // REQUIRED for symbol extraction
  includeSymbols: true,
  symbolType: "functions"
});
```

---

## 6. 📋 QUICK REFERENCE

### Query Cheat Sheet

| Goal                | analyzeJs | symbolType    | maxDepth |
| ------------------- | --------- | ------------- | -------- |
| Directory tree only | `false`   | -             | `2`      |
| All functions       | `true`    | `"functions"` | `3`      |
| All classes         | `true`    | `"classes"`   | `3`      |
| All symbols         | `true`    | `"all"`       | `5`      |
| Imports analysis    | `true`    | `"imports"`   | `3`      |
| Quick overview      | `false`   | -             | `1-2`    |

### Decision Tree

```
What do you need?
    │
    ├─► "Show me the folder structure"
    │   └─► analyzeJs: false, maxDepth: 2
    │
    ├─► "List functions in X"
    │   └─► analyzeJs: true, symbolType: "functions"
    │
    ├─► "What classes are defined?"
    │   └─► analyzeJs: true, symbolType: "classes"
    │
    ├─► "Find text pattern X"
    │   └─► Use Grep instead (not Code Context)
    │
    └─► "How does X work?"
        └─► Use LEANN instead (not Code Context)
```

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [SKILL.md](../SKILL.md) - Complete skill instructions
- [tool_catalog_reference.md](../references/tool_catalog_reference.md) - Parameter documentation

### Related Skills
- **mcp-leann** - Semantic search for "how" and "why" questions
- **workflows-code** - Code implementation workflow

---

**Remember**: Code Context shows **structure** (what exists, where). For **meaning** (how it works, why), use LEANN. For **text patterns** (exact matches), use Grep.
