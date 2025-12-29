---
name: index
description: Narsil index management - status, reindex, repos, validate, health
argument-hint: "[status|reindex|repos|validate|health] [--path:<dir>]"
allowed-tools: Bash, code_mode_call_tool_chain
---

# 🔍 PRE-INDEX VALIDATION (LIGHT)

```
EXECUTE QUICK VALIDATION:
├─ SEARCH REDIRECT? (query-like input: "how does", "find", "what is")
│   └─ YES → Forward to /search:code
├─ CLASSIFY OPERATION: STATUS | REINDEX | REPOS | VALIDATE | HEALTH
└─ PROCEED
```

---

# Narsil Index Manager

Manage and monitor Narsil's code index for the current workspace.

```yaml
role: Index Management Specialist
purpose: Unified interface for Narsil index operations
action: Route to appropriate index management tool
```

---

## 1. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Operation keyword or path
**Outputs:** `STATUS=<OK|FAIL>` with operation results

| Pattern           | Operation | Example                    |
| ----------------- | --------- | -------------------------- |
| (empty)           | Dashboard | `/search:index`            |
| `status`          | Status    | `/search:index status`     |
| `reindex`         | Reindex   | `/search:index reindex`    |
| `repos`           | List      | `/search:index repos`      |
| `validate <path>` | Validate  | `/search:index validate .` |
| `health`          | Health    | `/search:index health`     |

**Code Search:** Use `/search:code` for semantic, structural, security, analysis.

---

## 2. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─► SEARCH KEYWORDS? (query-like: "how does", "find", "what is")
    │   └─► Forward to /search:code
    │
    ├─► Empty → DASHBOARD (Section 4)
    │
    └─► OPERATION KEYWORDS
        ├─► "status" | "stats" → STATUS MODE
        ├─► "reindex" | "rebuild" | "refresh" → REINDEX MODE
        ├─► "repos" | "list" | "repositories" → REPOS MODE
        ├─► "validate" | "check" → VALIDATE MODE
        └─► "health" | "diag" | "diagnostic" → HEALTH MODE
```

---

## 3. 🎯 OPERATION DECISION DISPLAY

**Before executing, show operation decision:**

```
┌─────────────────────────────────────────────────────────────────┐
│ INDEX OPERATION                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Operation: <OPERATION>                                          │
│ Target: <path_or_all>                                           │
└─────────────────────────────────────────────────────────────────┘
```

| Operation | Type                       |
| --------- | -------------------------- |
| STATUS    | Index statistics and state |
| REINDEX   | Force full re-indexing     |
| REPOS     | List indexed repositories  |
| VALIDATE  | Check repository validity  |
| HEALTH    | Diagnostic health check    |

---

## 4. 📊 DASHBOARD MODE (No Arguments)

**Trigger:** `/search:index` with no arguments

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
│  INDEX MANAGEMENT DASHBOARD                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  INDEX STATUS                                                               │
│                                                                             │
│  Status:     <indexed|indexing|error>                                       │
│  Files:      <N> indexed                                                    │
│  Languages:  <N> detected                                                   │
│  Neural:     <enabled|disabled>                                             │
│  Last:       <timestamp>                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  OPERATIONS                                                                 │
│                                                                             │
│  [s] status           Show detailed index statistics                        │
│  [r] reindex          Force full re-indexing                                │
│  [l] repos            List all indexed repositories                         │
│  [v] validate <path>  Check if path is valid repository                     │
│  [h] health           Run diagnostic health check                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEARCH: /search:code                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 📈 STATUS MODE

**Trigger:** `status`, `stats`

**Workflow:**
```
1. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const status = await narsil.narsil_get_index_status({});
       return status;
     `
   })
2. Display detailed statistics
```

**Output:**
```
INDEX STATUS
────────────────────────────────────────────────────
Status:      Indexed
Files:       1,234 files
Languages:   JavaScript (456), TypeScript (321), Python (89)
Features:    Neural ✅  Git ✅  Call Graph ✅
Last Index:  2024-01-15 14:32:00
────────────────────────────────────────────────────
```

---

## 6. 🔄 REINDEX MODE

**Trigger:** `reindex`, `rebuild`, `refresh`

**Workflow:**
```
1. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const result = await narsil.narsil_reindex({});
       return result;
     `
   })
2. Display reindex progress/result
```

**Output:**
```
REINDEX INITIATED
────────────────────────────────────────────────────
Status:      Indexing...
Progress:    Processing files...
────────────────────────────────────────────────────
```

---

## 7. 📂 REPOS MODE

**Trigger:** `repos`, `list`, `repositories`

**Workflow:**
```
1. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const repos = await narsil.narsil_list_repos({});
       return repos;
     `
   })
2. Display repository list
```

**Output:**
```
INDEXED REPOSITORIES
────────────────────────────────────────────────────
| #   | Path                    | Files | Status  |
| --- | ----------------------- | ----- | ------- |
| 1   | /path/to/repo           | 1,234 | Indexed |
────────────────────────────────────────────────────
```

---

## 8. ✅ VALIDATE MODE

**Trigger:** `validate <path>`, `check <path>`

**Workflow:**
```
1. Parse: path from arguments
2. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const result = await narsil.narsil_validate_repo({ path: "<path>" });
       return result;
     `
   })
3. Display validation result
```

**Output:**
```
REPOSITORY VALIDATION: <path>
────────────────────────────────────────────────────
Valid:       ✅ Yes
Type:        Git repository
Languages:   JavaScript, TypeScript
────────────────────────────────────────────────────
```

---

## 9. 💚 HEALTH MODE

**Trigger:** `health`, `diag`, `diagnostic`

**Workflow:**
```
1. Execute via Code Mode:
   code_mode_call_tool_chain({
     code: `
       const status = await narsil.narsil_get_index_status({});
       return { status, healthy: true };
     `
   })
2. Display health diagnostics
```

**Output:**
```
INDEX HEALTH CHECK
────────────────────────────────────────────────────
Index:       ✅ Healthy
Neural:      ✅ API Connected
Watch:       ✅ Active
Memory:      Normal
────────────────────────────────────────────────────
```

---

## 10. ⚠️ ERROR HANDLING

| Condition       | Action                    |
| --------------- | ------------------------- |
| Index not found | Suggest `reindex`         |
| API key missing | Show VOYAGE_API_KEY setup |
| Path not found  | Show similar paths        |
| MCP not running | Show startup instructions |

---

## 11. 🔧 TROUBLESHOOTING

### Index Not Updating
1. Check if `--watch` flag is enabled (default: yes)
2. Verify file is not in .gitignore (Narsil respects gitignore)
3. Force reindex: `/search:index reindex`

### Neural Search Not Working
1. Verify VOYAGE_API_KEY in `.utcp_config.json`
2. Check API key format (starts with "pa-")
3. Narsil falls back to BM25 if API unavailable

### High Memory Usage
For large repos (>50K files):
```bash
RUST_MIN_STACK=8388608 narsil-mcp --repos /path/to/repo
```

### Configuration Reference
Narsil is configured in `.utcp_config.json` with these flags:
- `--repos .` - Index current workspace
- `--preset full` - All 76 tools enabled
- `--git` - Git integration (blame, history)
- `--call-graph` - Function call analysis
- `--persist` - Save index to disk
- `--watch` - Auto-reindex on changes
- `--neural` - Neural semantic search
- `--neural-backend api` - Voyage AI embeddings
- `--neural-model voyage-code-3` - Code-specialized model

### Supported Languages (16)
Rust, Python, JavaScript, TypeScript, Go, C, C++, Java, C#, Bash, Ruby, Kotlin, PHP, Swift, Verilog/SystemVerilog

---

## 12. 📌 QUICK REFERENCE

| Command                    | Result              |
| -------------------------- | ------------------- |
| `/search:index`            | Dashboard           |
| `/search:index status`     | Detailed statistics |
| `/search:index reindex`    | Force reindex       |
| `/search:index repos`      | List repositories   |
| `/search:index validate .` | Validate path       |
| `/search:index health`     | Health check        |

---

## 13. 🔗 RELATED RESOURCES

- `/search:code` - Unified code search (semantic + structural)
- `mcp-narsil` skill - Full Narsil documentation
- **Narsil GitHub**: https://github.com/postrv/narsil-mcp
- **Configuration**: `.utcp_config.json` (narsil section)
