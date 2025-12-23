---
description: Unified code search - route structural, semantic, and lexical queries with smart multi-tool fusion
argument-hint: "[query] [--index:<name>] [--path:<dir>] [--type:<ext>] [--limit:<N>]"
allowed-tools: Bash, Read, Grep, Glob, leann_search, leann_ask, leann_list, code_context_get_code_context, openskills
---

# 🔍 PRE-SEARCH VALIDATION (LIGHT)

```
EXECUTE QUICK VALIDATION:
├─ INDEX MANAGEMENT REDIRECT? ("build", "list", "remove", "status")
│   └─ YES → Forward to /search:index
├─ CLASSIFY INTENT: SEMANTIC | STRUCTURAL | LEXICAL | AMBIGUOUS
├─ RESOURCE CHECK (non-blocking):
│   ├─ Semantic → Check index exists (warn if missing)
│   ├─ Structural → Check path exists
│   └─ Lexical → No check needed
└─ PROCEED (warnings inline, don't block)
```

---

# Unified Code Search

One command for semantic (LEANN), structural (Code Context), and lexical (Grep) search with intelligent routing.

```yaml
role: Code Search Specialist
purpose: Unified interface for all code search operations
action: Route to optimal tool based on query intent
```

---

## 1. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Query, mode keyword, or filters
**Outputs:** `STATUS=<OK|FAIL>` with `RESULTS=<N>` and `TOOLS=<used>`

| Pattern          | Mode        | Example                           |
| ---------------- | ----------- | --------------------------------- |
| (empty)          | Dashboard   | `/search:code`                    |
| `<query>`        | Smart Route | `/search:code how does auth work` |
| `--index:<name>` | Filter      | `/search:code --index:anobel`     |
| `--path:<dir>`   | Filter      | `/search:code --path:src/auth`    |
| `--type:<ext>`   | Filter      | `/search:code --type:js,ts`       |
| `--limit:<N>`    | Filter      | `/search:code --limit:20`         |
| `--depth:<N>`    | Filter      | `/search:code --depth:3`          |

**Index Management:** Use `/search:index` for build, list, remove, status.

---

## 2. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─► INDEX KEYWORDS? ("build", "list", "remove", "status")
    │   └─► Forward to /search:index
    │
    ├─► Empty → DASHBOARD (Section 4)
    │
    ├─► EXPLICIT MODE KEYWORDS
    │   ├─► "tree" | "structure" → STRUCTURAL
    │   ├─► "outline" | "symbols" → STRUCTURAL  
    │   └─► "grep" | "pattern" → LEXICAL
    │
    └─► SMART ROUTING (natural language)
        ├─► STRUCTURAL? ("list functions", "show classes", "where defined")
        ├─► SEMANTIC? ("how does", "explain", "what is", "why")
        ├─► LEXICAL? (quoted strings, /regex/, "TODO", "FIXME")
        └─► AMBIGUOUS (<60% confidence) → FUSION
```

---

## 3. 🎯 ROUTING DECISION DISPLAY

**Before executing, show routing decision:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 ROUTING DECISION                                             │
├─────────────────────────────────────────────────────────────────┤
│ Query: "<user_query>"                                           │
│ Mode: <emoji> <MODE>  |  Tool: <tool_name>                      │
│ Why: <trigger_reason>  |  Confidence: <N>%                      │
│ 💡 <mode-specific_tip>                                          │
└─────────────────────────────────────────────────────────────────┘
```

| Mode       | Emoji | Tool         | Type                                 |
| ---------- | ----- | ------------ | ------------------------------------ |
| SEMANTIC   | 🔮     | LEANN        | RAG (Retrieval-Augmented Generation) |
| STRUCTURAL | 🏗️     | Code Context | AST Parser (Abstract Syntax Tree)    |
| LEXICAL    | 🔍     | Grep         | Text Pattern Matching                |
| FUSION     | ⚡     | All          | Multi-tool parallel execution        |

**Trigger reasons:** See `/search:code:help` Section 3 for full detection patterns.

---

## 4. 🔧 TOOL SIGNATURES

```javascript
// LEANN (Semantic)
leann_search({ index_name: "<name>", query: "<q>", top_k: N, show_metadata: true })
leann_list({})
Bash("leann ask <name> '<question>'")

// Code Context (Structural)
code_context_get_code_context({ 
  absolutePath: "<path>", 
  analyzeJs: true,
  includeSymbols: true,
  symbolType: "functions", // or "classes", "all"
  maxDepth: N 
})

// Grep (Lexical)
Grep({ pattern: "<regex>", path: "<dir>", include: "<glob>" })
```

---

## 5. 📊 DASHBOARD MODE (No Arguments)

**Trigger:** `/search:code` with no arguments

```javascript
leann_list({})
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CODE SEARCH DASHBOARD                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔮 LEANN          Semantic (RAG)         ✅ anobel                          │
│  🏗️ Code Context   Structural (AST)       ✅ Available                       │
│  🔍 Grep           Lexical (Pattern)      ✅ Available                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  COMMANDS                                                                   │
│                                                                             │
│  [s] search <query>     Semantic search     --index: --limit:               │
│  [t] tree <path>        Structure/symbols   --depth: --type:                │
│  [a] ask <question>     Q&A with context    --index:                        │
│  [f] fusion <query>     Multi-tool search   (auto-routes to best tool)      │
│  [i] index              Index management    → /search:index                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 🧠 SEMANTIC MODE (LEANN)

**Trigger:** "how does", "explain", "what is", "why", "understand"

**Workflow:**
```
1. Parse: --index:<name>, --limit:<N>, remaining → query
2. Execute: leann_search({ index_name, query, top_k, show_metadata: true })
3. Display results table
```

**Output:**
```
SEMANTIC SEARCH: "<query>"
Index: <name> | Limit: <N>
────────────────────────────────────────────────────
| #   | Score | File              | Preview                 |
| --- | ----- | ----------------- | ----------------------- |
| 1   | 94%   | src/auth/oauth.js | OAuth callback handling |
────────────────────────────────────────────────────
[1-N] view | [a]sk Q&A | [r]efine | [b]ack | [q]uit
```

**Q&A:** `Bash("leann ask <name> '<question>'")`

---

## 7. 🏗️ STRUCTURAL MODE (Code Context)

**Trigger:** "list functions", "show classes", "tree", "outline", "where defined"

**Workflow:**
```
1. Parse: --path:<dir>, --depth:<N>, remaining → path
2. Execute: code_context_get_code_context({ absolutePath, analyzeJs: true, includeSymbols: true, maxDepth })
3. Display tree/outline
```

**Output:**
```
STRUCTURE: src/auth/
Depth: 2
────────────────────────────────────────────────────
src/auth/
├── index.js
│   ├── function: validateUser
│   └── export: authMiddleware
└── oauth.js
    └── class: OAuthProvider
────────────────────────────────────────────────────
[f]ile inspect | [d]eeper | [s]earch | [b]ack | [q]uit
```

---

## 8. 📝 LEXICAL MODE (Grep)

**Trigger:** quoted strings `"..."`, regex `/pattern/`, "TODO", "FIXME"

**Workflow:**
```
1. Parse: --path:<dir>, --type:<ext>, --limit:<N>, remaining → pattern
2. Execute: Grep({ pattern, path, include: "*.{ext}" })
3. Display matches table
```

**Output:**
```
GREP: "TODO"
Path: src/ | Type: js,ts | Limit: 20
────────────────────────────────────────────────────
| #   | File              | Line | Match                      |
| --- | ----------------- | ---- | -------------------------- |
| 1   | src/auth/oauth.js | 45   | // TODO: Add rate limiting |
────────────────────────────────────────────────────
[1-N] view | [r]efine pattern | [s]earch | [b]ack | [q]uit
```

---

## 9. ⚡ FUSION MODE (Multi-Tool)

**Trigger:** Ambiguous queries (confidence < 60%), broad topics, single words

**Workflow:**
```
1. Execute in parallel:
   - leann_search({ index_name, query, top_k: 5 })
   - code_context_get_code_context({ absolutePath: "src/", ... })
   - Grep({ pattern: query, path: "src/" })
2. Merge by file path, deduplicate, sort by relevance
3. Display unified results with tool attribution
```

**Output:**
```
SEARCH RESULTS: "authentication"
Mode: Multi-Tool Fusion
────────────────────────────────────────────────────
| #   | Tool    | Score | File              | Match                   |
| --- | ------- | ----- | ----------------- | ----------------------- |
| 1   | LEANN   | 94%   | src/auth/oauth.js | OAuth callback handling |
| 2   | Context | -     | src/auth/index.js | function: validateUser  |
| 3   | Grep    | -     | src/utils/auth.js | "authentication token"  |
────────────────────────────────────────────────────
[1-N] view | [s]emantic | [t]ree | [g]rep | [r]efine | [q]uit
```

---

## 10. ⚠️ ERROR HANDLING

| Condition       | Action                                      |
| --------------- | ------------------------------------------- |
| Index not found | Suggest `/search:index build`               |
| Path not found  | Show similar paths via Glob                 |
| Empty results   | Try fallback: Semantic→Structural→Lexical   |
| All tools fail  | Show diagnostic with refinement suggestions |

**Fallback Chain:**
```
Primary empty? → Semantic → Structural → Lexical → Diagnostic
```

---

## 11. 📌 QUICK REFERENCE

| Command                                  | Result        |
| ---------------------------------------- | ------------- |
| `/search:code`                           | Dashboard     |
| `/search:code how does auth work`        | Semantic      |
| `/search:code list functions in auth.js` | Structural    |
| `/search:code "TODO"`                    | Lexical       |
| `/search:code authentication`            | Fusion (auto) |
| `/search:code tree src/`                 | Folder tree   |

---

## 12. 📚 MORE HELP

For detailed reference (examples, patterns, comparisons):
- **mcp-leann skill** - LEANN documentation
- **mcp-code-context skill** - Code Context documentation