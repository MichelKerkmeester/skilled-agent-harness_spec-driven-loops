---
description: Narsil index management - status, reindex, repos, validate, health
argument-hint: "[status|reindex|repos|validate|health] [--path:<dir>]"
allowed-tools: Bash, code_mode_call_tool_chain
---

# 🔍 PRE-INDEX VALIDATION (LIGHT)

```
EXECUTE QUICK VALIDATION:
├─ SEARCH REDIRECT? (query-like input: "how does", "find", "what is")
│   └─ YES → Forward to /search:code
├─ HTTP SERVER CHECK (if "ui", "viz", "visual", "frontend", "http", "server")
│   └─ Run Section 14: HTTP Server Auto-Start
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
| `ui`              | Viz UI    | `/search:index ui`         |

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
        ├─► "health" | "diag" | "diagnostic" → HEALTH MODE
        └─► "ui" | "viz" | "visual" | "frontend" | "http" | "server" → HTTP SERVER MODE (Section 14)
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

## 4. 📊 DASHBOARD MODE

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
┌────────────────────────────────────────────────────────────┐
│  INDEX MANAGEMENT DASHBOARD                                │
├────────────────────────────────────────────────────────────┤
│  INDEX STATUS                                              │
│                                                            │
│  Status:     <indexed|indexing|error>                      │
│  Files:      <N> indexed                                   │
│  Languages:  <N> detected                                  │
│  Neural:     <enabled|disabled>                            │
│  Last:       <timestamp>                                   │
├────────────────────────────────────────────────────────────┤
│  OPERATIONS                                                │
│                                                            │
│  [s] status           Show detailed index statistics       │
│  [r] reindex          Force full re-indexing               │
│  [l] repos            List all indexed repositories        │
│  [v] validate <path>  Check if path is valid repository    │
│  [h] health           Run diagnostic health check          │
├────────────────────────────────────────────────────────────┤
│  SEARCH: /search:code                                      │
└────────────────────────────────────────────────────────────┘
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
┌────────────────────────────────────────────────────────────────┐
│ INDEX STATUS                                                   │
├────────────────────────────────────────────────────────────────┤
│ Status       Indexed                                           │
│ Files        1,234 files                                        │
│ Languages    JavaScript (456), TypeScript (321), Python (89)   │
│ Features     Neural ✅  Git ✅  Call Graph ✅                  │
│ Last Index   2024-01-15 14:32:00                               │
└────────────────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────┐
│ REINDEX                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Status       Indexing...                                        │
│ Progress     Processing files...                                 │
└─────────────────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────┐
│ INDEXED REPOSITORIES                                            │
├─────────────────────────────────────────────────────────────────┤
│ #   Path                      Files   Status                    │
│ 1   /path/to/repo             1,234   Indexed                   │
└─────────────────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────┐
│ REPOSITORY VALIDATION: <path>                                   │
├─────────────────────────────────────────────────────────────────┤
│ Valid        ✅ Yes                                             │
│ Type         Git repository                                     │
│ Languages    JavaScript, TypeScript                             │
└─────────────────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────┐
│ INDEX HEALTH CHECK                                              │
├─────────────────────────────────────────────────────────────────┤
│ Index        ✅ Healthy                                         │
│ Neural       ✅ API Connected                                   │
│ Watch        ✅ Active                                          │
│ Memory       Normal                                             │
└─────────────────────────────────────────────────────────────────┘
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
4. If still not updating, **restart OpenCode** to restart the MCP server

### Full Reindex After Clearing Index
If you manually cleared `.narsil-index/`:
1. Simply running `reindex` may not rebuild neural embeddings
2. **Restart OpenCode** (Ctrl+C, then restart) for a complete rebuild
3. The MCP server needs a fresh start to regenerate all indexes

### Neural Search Not Working
1. Verify VOYAGE_API_KEY in `.utcp_config.json`
2. Check API key format (starts with "pa-")
3. Narsil falls back to BM25 if API unavailable

### High Memory Usage
For large repos (>50K files):
```bash
RUST_MIN_STACK=8388608 narsil-mcp --repos /path/to/repo
```

### Manual Index Building (HTTP Server Mode)

For pre-warming indexes or large codebases:

```bash
# Terminal 1: Start backend with HTTP server
narsil-mcp --repos . --index-path .narsil-index --persist --reindex --http --http-port 3000

# Terminal 2: Start frontend (separate React app)
cd "${NARSIL_PATH}/frontend" && npm install && npm run dev
```

The backend runs on port 3000, frontend on port 5173. Both must be running for visualization.
Index saves automatically after --reindex completes.

### Configuration Reference
Narsil is configured in `.utcp_config.json` with these flags:
- `--repos .` - Index current workspace
- `--index-path .narsil-index` - Project-local index storage
- `--git` - Git integration (blame, history)
- `--call-graph` - Function call analysis
- `--persist` - Save index to disk
- `--watch` - Auto-reindex on changes
- `--neural` - Neural semantic search
- `--neural-backend api` - Voyage AI embeddings
- `--neural-model voyage-code-2` - Code-specialized model (1536-dim)

### Supported Languages (15)
Rust, Python, JavaScript, TypeScript, Go, C, C++, Java, C#, Bash, Ruby, Kotlin, PHP, Swift, Verilog/SystemVerilog

### JavaScript/TypeScript Limitations
- **Call Graph**: May return empty results due to dynamic call patterns
- **Security Scan**: Limited rule coverage for frontend code
- **Workaround**: Use `find_symbols` + `get_symbol_definition` for structural analysis

### Narsil Not Appearing in Code Mode

**Symptom:** `narsil is not defined` error when calling `narsil.narsil_*` tools

**Root Cause:** Code Mode loads `.utcp_config.json` at **startup only**. Changes to the config file are NOT picked up until OpenCode restarts.

**Solution:**
1. Verify `.utcp_config.json` has correct Narsil configuration
2. **Restart OpenCode** (Ctrl+C, then restart)
3. After restart, verify with `code_mode_list_tools()`

**Common Config Issues:**
| Issue | Fix |
|-------|-----|
| Extra fields in config | Remove `_note`, `_neural_backends`, `_usage_examples` |
| Relative command path | Use absolute path: `/Users/username/bin/narsil-mcp` |
| Missing transport field | Add `"transport": "stdio"` to mcpServers config |
| Invalid JSON | Validate: `python3 -m json.tool < .utcp_config.json` |

**Minimal Working Config:**
```json
{
  "name": "narsil",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "narsil": {
        "transport": "stdio",
        "command": "/absolute/path/to/narsil-mcp",
        "args": ["--repos", ".", "--persist"],
        "env": {}
      }
    }
  }
}
```

---

## 12. 🌐 HTTP SERVER MODE

**Trigger:** `ui`, `viz`, `visual`, `frontend`, `http`, `server`

**Purpose:** Start Narsil's visualization frontend for graphical index exploration.

### Auto-Start Workflow

```
1. CHECK IF SERVERS RUNNING:
   - Backend: lsof -i :3000 | grep LISTEN
   - Frontend: lsof -i :5173 | grep LISTEN

2. IF BOTH RUNNING:
   - Display "Already running" message
   - Open browser to http://localhost:5173

3. IF BACKEND OFFLINE (port 3000 not listening):
   - Start backend with stdin kept open:
     (tail -f /dev/null | /Users/michelkerkmeester/bin/narsil-mcp \
       --repos . --index-path .narsil-index \
       --git --call-graph --persist \
       --http --http-port 3000 > /tmp/narsil-http.log 2>&1) &
   - Wait 2 seconds, verify port 3000 listening

4. IF FRONTEND OFFLINE (port 5173 not listening):
   - Start frontend:
     cd "/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/frontend" && \
       npm run dev > /tmp/narsil-frontend.log 2>&1 &
   - Wait 3 seconds, verify port 5173 listening

5. OPEN BROWSER:
   - open http://localhost:5173

6. DISPLAY STATUS
```

### Bash Commands (Execute in Order)

```bash
# Step 1: Check current status
BACKEND_RUNNING=$(lsof -i :3000 2>/dev/null | grep LISTEN | wc -l)
FRONTEND_RUNNING=$(lsof -i :5173 2>/dev/null | grep LISTEN | wc -l)

# Step 2: Start backend if needed
if [ "$BACKEND_RUNNING" -eq 0 ]; then
  (tail -f /dev/null | /Users/michelkerkmeester/bin/narsil-mcp \
    --repos . --index-path .narsil-index \
    --git --call-graph --persist \
    --http --http-port 3000 > /tmp/narsil-http.log 2>&1) &
  sleep 2
fi

# Step 3: Start frontend if needed  
if [ "$FRONTEND_RUNNING" -eq 0 ]; then
  cd "/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/frontend" && \
    npm run dev > /tmp/narsil-frontend.log 2>&1 &
  sleep 3
fi

# Step 4: Open browser
open http://localhost:5173
```

### Output Display

```
┌─────────────────────────────────────────────────────────────────┐
│ NARSIL VISUALIZATION UI                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Backend:   <Started|Already Running> → http://localhost:3000    │
│ Frontend:  <Started|Already Running> → http://localhost:5173    │
│                                                                 │
│ Browser opened to: http://localhost:5173                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ TO STOP SERVERS                                                 │
│                                                                 │
│ pkill -f "narsil-mcp.*--http"                                   │
│ pkill -f "vite"                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

| Setting | Value |
|---------|-------|
| Backend Port | 3000 |
| Frontend Port | 5173 |
| Backend Log | `/tmp/narsil-http.log` |
| Frontend Log | `/tmp/narsil-frontend.log` |
| Narsil Path | `/Users/michelkerkmeester/bin/narsil-mcp` |
| Frontend Path | `/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/frontend` |

### Notes

- HTTP server mode is **separate from OpenCode's Code Mode** integration
- Backend uses the same `.narsil-index` as the stdio MCP (shared index)
- Frontend requires `node_modules` installed (run `npm install` if missing)
- Watch mode does NOT work in HTTP server mode (use for visualization only)

---

## 13. 📌 QUICK REFERENCE

| Command                    | Result                    |
| -------------------------- | ------------------------- |
| `/search:index`            | Dashboard                 |
| `/search:index status`     | Detailed statistics       |
| `/search:index reindex`    | Force reindex             |
| `/search:index repos`      | List repositories         |
| `/search:index validate .` | Validate path             |
| `/search:index health`     | Health check              |
| `/search:index ui`         | Start visualization UI    |

---

## 14. 🔗 RELATED RESOURCES

- `/search:code` - Unified code search (semantic + structural)
- `mcp-narsil` skill - Full Narsil documentation
- **Narsil GitHub**: https://github.com/postrv/narsil-mcp
- **Configuration**: `.utcp_config.json` (narsil section)