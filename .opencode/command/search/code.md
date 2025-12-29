---
description: Unified AI-powered code search - semantic and structural via Narsil with smart multi-tool fusion
argument-hint: "[query] [--index:<name>] [--path:<dir>] [--type:<ext>] [--limit:<N>]"
allowed-tools: Bash, Read, code_mode_call_tool_chain, code_mode_search_tools
---

# 🔍 PRE-SEARCH VALIDATION (LIGHT)

```
EXECUTE QUICK VALIDATION:
├─ INDEX MANAGEMENT REDIRECT? ("build", "list", "remove", "status")
│   └─ YES → Forward to /search:index
├─ CLASSIFY INTENT: SEMANTIC | STRUCTURAL | SECURITY | ANALYSIS | AMBIGUOUS
├─ RESOURCE CHECK (non-blocking):
│   ├─ Semantic → Check index exists (warn if missing)
│   └─ Structural/Security/Analysis → Check path exists
└─ PROCEED (warnings inline, don't block)
```

---

# Unified Code Search

One command for semantic and structural code search via Narsil with intelligent routing.

```yaml
role: Code Search Specialist
purpose: Unified interface for AI-powered code search operations
action: Route to optimal tool based on query intent
```

---

## 1. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Query, mode keyword, or filters
**Outputs:** `STATUS=<OK|FAIL>` with `RESULTS=<N>` and `TOOLS=<used>`

| Pattern        | Mode        | Example                           |
| -------------- | ----------- | --------------------------------- |
| (empty)        | Dashboard   | `/search:code`                    |
| `<query>`      | Smart Route | `/search:code how does auth work` |
| `--path:<dir>` | Filter      | `/search:code --path:src/auth`    |
| `--type:<ext>` | Filter      | `/search:code --type:js,ts`       |
| `--limit:<N>`  | Filter      | `/search:code --limit:20`         |
| `--depth:<N>`  | Filter      | `/search:code --depth:3`          |

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
    │   ├─► "tree" | "structure" | "outline" | "symbols" → STRUCTURAL
    │   ├─► "security" | "vulnerabilities" | "scan" | "audit" → SECURITY
    │   └─► "complexity" | "dead code" | "call graph" | "unused" → ANALYSIS
    │
    └─► SMART ROUTING (natural language)
        ├─► STRUCTURAL? ("list functions", "show classes", "where defined")
        ├─► SEMANTIC? ("how does", "explain", "what is", "why", "understand")
        ├─► SECURITY? ("security", "vulnerability", "OWASP", "CWE", "injection")
        ├─► ANALYSIS? ("complexity", "dead code", "dependencies", "unused")
        └─► AMBIGUOUS (<60% confidence) → HYBRID (Narsil semantic + structural)
```

---

## 3. 🎯 ROUTING DECISION DISPLAY

**Before executing, show routing decision:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ROUTING DECISION                                                │
├─────────────────────────────────────────────────────────────────┤
│ Query: "<user_query>"                                           │
│ Mode: <MODE>                                                    │
│ Why: <trigger_reason>  |  Confidence: <N>%                       │
│ Tip: <mode-specific_tip>                                         │
└─────────────────────────────────────────────────────────────────┘
```

| Mode       | Type                              |
| ---------- | --------------------------------- |
| SEMANTIC   | Neural Search (Semantic)          |
| STRUCTURAL | AST Parser (Abstract Syntax Tree) |
| SECURITY   | Vulnerability Scanning            |
| ANALYSIS   | Code Metrics & Quality            |
| FUSION     | Multi-tool parallel execution     |

**Trigger reasons:** See `/search:code:help` Section 3 for full detection patterns.

---

## 4. 🔧 TOOL SIGNATURES

```javascript
// Narsil (Semantic - via Code Mode)
code_mode_call_tool_chain({
  code: `
    const results = await narsil.narsil_neural_search({ 
      query: "<q>",
      top_k: N 
    });
    return results;
  `
})

// Narsil (Structural - via Code Mode)
code_mode_call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({ kind: "function", pattern: "" });
    const structure = await narsil.narsil_get_project_structure({});
    return { symbols, structure };
  `
})

// Narsil (Security - via Code Mode)
code_mode_call_tool_chain({
  code: `
    const results = await narsil.narsil_scan_security({ 
      path: "<path>",
      severity: "high"
    });
    return results;
  `
})

// Narsil (Analysis - via Code Mode)
code_mode_call_tool_chain({
  code: `
    const deadCode = await narsil.narsil_find_dead_code({ path: "<path>" });
    const complexity = await narsil.narsil_analyze_complexity({ path: "<path>" });
    return { deadCode, complexity };
  `
})
```

---

## 5. 📊 DASHBOARD MODE (No Arguments)

**Trigger:** `/search:code` with no arguments

```javascript
code_mode_call_tool_chain({
  code: `
    const status = await narsil.narsil_get_index_status({});
    return status;
  `
})
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CODE SEARCH DASHBOARD                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEARCH MODES                                                               │
│                                                                             │
│  Semantic        Neural Search           ✅ Available                       │
│  Structural      AST Parser              ✅ Available                       │
│  Security        Vulnerability Scan      ✅ Available                       │
│  Analysis        Code Metrics            ✅ Available                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  COMMANDS                                                                   │
│                                                                             │
│  [s] search <query>     Semantic search       --path: --limit:              │
│  [t] tree <path>        Structure/symbols     --depth: --type:              │
│  [x] security <path>    Vulnerability scan    --severity:                   │
│  [a] analysis <path>    Code metrics          --type:                       │
│  [f] fusion <query>     Multi-mode search     (auto-routes)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  INDEX: /search:index                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 🔮 SEMANTIC MODE

**Trigger:** "how does", "explain", "what is", "why", "understand"

**Workflow:**
```
1. Parse: --limit:<N>, remaining → query
2. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const results = await narsil.narsil_neural_search({ 
         query: "<query>",
         top_k: <N> 
       });
       return results;
     `
   })
3. Display results table
```

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│ SEMANTIC SEARCH: <query>                                        │
├─────────────────────────────────────────────────────────────────┤
│ Results: N matches                                              │
│                                                                 │
│ [1] path/to/file.js:42                                          │
│     function handleAuth() { ... }                               │
│     Score: 0.92                                                 │
│                                                                 │
│ [2] path/to/other.js:15                                         │
│     const authMiddleware = ...                                  │
│     Score: 0.87                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Q&A:** Use `narsil.narsil_semantic_search()` via Code Mode, then Read tool for file content.

---

## 7. 🏗️ STRUCTURAL MODE

**Trigger:** "list functions", "show classes", "tree", "outline", "where defined"

**Workflow:**
```
1. Parse: --path:<dir>, --depth:<N>, remaining → path
2. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const symbols = await narsil.narsil_find_symbols({ 
         kind: "function", 
         pattern: "",
         path: "<path>" 
       });
       const structure = await narsil.narsil_get_project_structure({ 
         path: "<path>",
         maxDepth: <N> 
       });
       return { symbols, structure };
     `
   })
3. Display tree/outline
```

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│ STRUCTURE: <path>                                               │
├─────────────────────────────────────────────────────────────────┤
│ Depth: 2                                                        │
│                                                                 │
│ src/auth/                                                       │
│ ├── index.js                                                    │
│ │   ├── function: validateUser                                  │
│ │   └── export: authMiddleware                                  │
│ └── oauth.js                                                    │
│     └── class: OAuthProvider                                    │
├─────────────────────────────────────────────────────────────────┤
│ [f]ile | [d]eeper | [s]earch | [b]ack | [q]uit                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. 🔒 SECURITY MODE

**Trigger:** "security", "vulnerabilities", "scan", "audit", "OWASP", "CWE"

**Workflow:**
```
1. Parse: --path:<dir>, --severity:<level>, remaining → target
2. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const results = await narsil.narsil_scan_security({ 
         path: "<path>",
         severity: "high" // "low", "medium", "high", "critical"
       });
       return results;
     `
   })
3. Display security findings
```

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│ SECURITY SCAN: <path>                                           │
├─────────────────────────────────────────────────────────────────┤
│ Findings: N issues                                              │
│                                                                 │
│ [HIGH] SQL Injection                                            │
│        src/db/query.js:45                                       │
│        User input in SQL query                                  │
│                                                                 │
│ [MED]  XSS Vulnerability                                        │
│        src/views/render.js:23                                   │
│        Unescaped output                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. 🧠 ANALYSIS MODE

**Trigger:** "dead code", "complexity", "dependencies", "call graph", "unused"

**Workflow:**
```
1. Parse: --path:<dir>, --type:<analysis>, remaining → target
2. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       // For dead code analysis
       const deadCode = await narsil.narsil_find_dead_code({ path: "<path>" });
       
       // For complexity analysis
       const complexity = await narsil.narsil_analyze_complexity({ path: "<path>" });
       
       // For call graph
       const callGraph = await narsil.narsil_get_call_graph({ 
         path: "<path>",
         symbol: "<function_name>" 
       });
       
       return { deadCode, complexity, callGraph };
     `
   })
3. Display analysis results
```

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ANALYSIS: <path>                                                │
├─────────────────────────────────────────────────────────────────┤
│ Metrics                                                         │
│                                                                 │
│ Complexity     Cyclomatic: 12    Cognitive: 8                   │
│ Dependencies   Imports: 5        Exports: 3                     │
│ Size           Lines: 245        Functions: 12                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. ⚡ FUSION MODE

**Trigger:** Ambiguous queries (confidence < 60%), broad topics, single words

**Workflow:**
```
1. Execute via Code Mode (parallel Narsil calls):
   code_mode_call_tool_chain({
     code: `
       const [semantic, structural] = await Promise.all([
         narsil.narsil_neural_search({ query: "<query>", top_k: 5 }),
         narsil.narsil_find_symbols({ kind: "all", pattern: "<query>" })
       ]);
       return { semantic, structural };
     `
   })
2. Merge by file path, deduplicate, sort by relevance
3. Display unified results with search type attribution
```

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│ FUSION SEARCH: <query>                                          │
├─────────────────────────────────────────────────────────────────┤
│ Modes: semantic + structural                                    │
│ Results: N matches                                              │
│                                                                 │
│ [1] path/to/file.js                                              │
│     Semantic: 0.92 | Structural: function match                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. ⚠️ ERROR HANDLING

| Condition       | Action                                           |
| --------------- | ------------------------------------------------ |
| Index not found | Suggest `/search:index build`                    |
| Path not found  | Show similar paths via Glob                      |
| Empty results   | Try fallback: Semantic → Structural → Diagnostic |
| All tools fail  | Show diagnostic with refinement suggestions      |

**Fallback Chain:**
```
Primary empty? → Semantic → Structural → Diagnostic
```

---

## 12. 📌 QUICK REFERENCE

| Command                                  | Result     |
| ---------------------------------------- | ---------- |
| `/search:code`                           | Dashboard  |
| `/search:code how does auth work`        | Semantic   |
| `/search:code list functions in auth.js` | Structural |
| `/search:code security scan src/`        | Security   |
| `/search:code complexity analysis`       | Analysis   |
| `/search:code authentication`            | Fusion     |
| `/search:code tree src/`                 | Structural |

---

## 13. 🔗 RELATED RESOURCES

- **mcp-narsil skill** - Narsil semantic, structural, security, and analysis documentation
- `/search:index` - Index management and status