---
name: mcp-narsil
description: "Deep code intelligence via Narsil MCP providing 76 tools for security scanning (OWASP, CWE, taint analysis), call graph analysis (CFG, DFG, callers/callees), structural queries (symbols, definitions, references), and supply chain security (SBOM, license compliance). Accessed via Code Mode for token efficiency."
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain, mcp__code_mode__search_tools, mcp__code_mode__list_tools]
version: 1.0.0
---

<!-- Keywords: narsil, mcp-narsil, security-scanning, vulnerability, OWASP, CWE, taint-analysis, call-graph, callers, callees, dead-code, control-flow, data-flow, SBOM, supply-chain, license-compliance, find-symbols, project-structure, symbol-definition, git-blame, complexity, code-mode -->

# Narsil MCP - Deep Code Intelligence

Rust-powered code intelligence providing 76 specialized tools for security scanning, call graph analysis, and structural queries. Accessed via **Code Mode** for token-efficient on-demand access (~700 tokens vs ~6,000-8,000 native).

**Core Principle**: Unified code intelligence - Narsil handles STRUCTURE, SECURITY, and SEMANTIC search.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use when**:
- Security vulnerability scanning needed (OWASP, CWE, injections)
- Call graph or control flow analysis required
- Finding symbols, definitions, or references
- Dead code detection or complexity analysis
- SBOM generation or license compliance
- Git blame, history, or hotspot analysis

**Keyword Triggers**:
- Security: "security scan", "vulnerability", "injection", "OWASP", "CWE", "taint"
- Call Graph: "call graph", "callers", "callees", "who calls", "what calls"
- Structure: "find symbols", "find functions", "project structure", "references"
- Quality: "dead code", "unreachable", "complexity", "unused"
- Supply Chain: "SBOM", "dependencies", "licenses", "CVE"
- Git: "git blame", "hotspots", "contributors", "history"

### Use Cases

#### Security Auditing

- Full security scan with OWASP Top 10 and CWE Top 25
- SQL injection, XSS, command injection detection
- Taint analysis tracing untrusted data flow
- Secret and credential detection

#### Code Understanding

- Project structure overview
- Symbol search (functions, classes, structs)
- Call graph visualization
- Dependency analysis

#### Code Quality

- Dead code and unreachable code detection
- Complexity metrics (cyclomatic, cognitive)
- Unused assignments and uninitialized variables

#### Supply Chain Security

- SBOM generation (CycloneDX, SPDX)
- CVE checking against OSV database
- License compliance verification

### When NOT to Use

**Do not use for**:
- Simple text pattern search → Use **Grep**
- File path/name matching → Use **Glob**

**For semantic search**: Use `narsil_neural_search` - Narsil's neural backend handles meaning-based queries.

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Security scanning needed
    │   └─► Load: references/security_guide.md
    │       └─► Tools: scan_security, find_injection_vulnerabilities, trace_taint
    │
    ├─► Call graph / code flow analysis
    │   └─► Load: references/call_graph_guide.md
    │       └─► Tools: get_call_graph, get_callers, get_callees
    │
    ├─► Quick overview / first use
    │   └─► Load: references/quick_start.md
    │       └─► Tools: get_project_structure, find_symbols
    │
    ├─► Full tool reference needed
    │   └─► Load: references/tool_reference.md
    │       └─► All 76 tools documented
    │
    └─► Simple structural query
        └─► Use SKILL.md only
            └─► Tools: find_symbols, get_project_structure
```

### Resource Router

```python
def route_narsil_resources(task):
    """
    Resource Router for mcp-narsil skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # SECURITY SCANNING
    # Purpose: OWASP, CWE, injection detection, taint analysis
    # Key Insight: Start with scan_security for overview, drill into specifics
    # ──────────────────────────────────────────────────────────────────
    if task.involves_security or task.mentions_vulnerability:
        return load("references/security_guide.md")  # Security workflow

    # ──────────────────────────────────────────────────────────────────
    # CALL GRAPH ANALYSIS
    # Purpose: CFG, DFG, callers/callees, complexity metrics
    # Key Insight: Start with get_call_graph, then drill with callers/callees
    # ──────────────────────────────────────────────────────────────────
    if task.involves_call_graph or task.mentions_code_flow:
        return load("references/call_graph_guide.md")  # Analysis workflow

    # ──────────────────────────────────────────────────────────────────
    # QUICK START
    # Purpose: First-time usage, verification, basic commands
    # Key Insight: Fastest path to working state
    # ──────────────────────────────────────────────────────────────────
    if task.is_first_use or task.needs_verification:
        return load("references/quick_start.md")  # Getting started

    # ──────────────────────────────────────────────────────────────────
    # COMPLETE REFERENCE
    # Purpose: All 76 tools with descriptions and priority
    # Key Insight: Use for discovery or when unsure which tool
    # ──────────────────────────────────────────────────────────────────
    if task.needs_tool_discovery or task.needs_full_reference:
        return load("references/tool_reference.md")  # All tools

    # Default: SKILL.md covers basic structural queries

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# assets/tool_categories.md → Priority categorization of all 76 tools
# scripts/update-narsil.sh   → Script to update Narsil binary
```

---

## 3. 🛠️ HOW IT WORKS

### Code Mode Invocation

Narsil is accessed via Code Mode's `call_tool_chain()` for token efficiency.

**Naming Convention**:
```
narsil.narsil_{tool_name}
```

**Process Flow**:
```
STEP 1: Discover Tools
       ├─ Use search_tools() for capability-based discovery
       ├─ Use tool_info() for specific tool details
       └─ Output: Tool name and parameters
       ↓
STEP 2: Execute via Code Mode
       ├─ Use call_tool_chain() with TypeScript code
       ├─ Await narsil.narsil_{tool_name}({params})
       └─ Output: Tool results
       ↓
STEP 3: Process Results
       └─ Parse and present findings
```

### Tool Invocation Examples

> **Important**: Most Narsil tools require a `repo` parameter. Use `list_repos()` to discover the repo name (typically "unknown" if not explicitly named).

```typescript
// Discover security tools
search_tools({ task_description: "security vulnerability scanning" });

// Get tool details
tool_info({ tool_name: "narsil.narsil_scan_security" });

// First: Discover repo name
call_tool_chain({
  code: `
    const repos = await narsil.narsil_list_repos({});
    return repos;  // Returns repo name (e.g., "unknown")
  `
});

// Execute security scan (repo required)
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({
      repo: "unknown"
    });
    return findings;
  `
});

// Find all functions (repo required, use symbol_type not kind)
call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({
      repo: "unknown",
      symbol_type: "function"
    });
    return symbols;
  `
});

// Get call graph (repo required, use function not function_name)
call_tool_chain({
  code: `
    const graph = await narsil.narsil_get_call_graph({
      repo: "unknown",
      function: "main"
    });
    return graph;
  `
});

// Get symbol definition (repo required, use symbol not name)
call_tool_chain({
  code: `
    const def = await narsil.narsil_get_symbol_definition({
      repo: "unknown",
      symbol: "myFunction"
    });
    return def;
  `
});
```

### Unified Code Search

Narsil provides both structural AND semantic search capabilities:

| Query Type                      | Tool                    | Reason            |
| ------------------------------- | ----------------------- | ----------------- |
| "How does authentication work?" | `narsil_neural_search`  | Semantic meaning  |
| "Find code similar to this"     | `narsil_neural_search`  | Vector similarity |
| "List all auth functions"       | `narsil_find_symbols`   | Structural query  |
| "Scan for vulnerabilities"      | `narsil_scan_security`  | Security analysis |
| "Show call graph for login"     | `narsil_get_call_graph` | Code flow         |

### Neural Semantic Search

Narsil supports **three neural embedding backends** for semantic code search:

| Backend | Model | API Key | Dimensions | Best For |
|---------|-------|---------|------------|----------|
| **Voyage AI** | `voyage-code-2` | `VOYAGE_API_KEY` | 1536 | Code search (RECOMMENDED) |
| **OpenAI** | `text-embedding-3-small` | `OPENAI_API_KEY` | 1536 | General purpose |
| **Local ONNX** | Built-in | None required | 384 | Offline/privacy |

**Configuration Examples:**

```bash
# Voyage AI (recommended for code)
--neural --neural-backend api --neural-model voyage-code-2
# Requires: VOYAGE_API_KEY in .env

# OpenAI
--neural --neural-backend api --neural-model text-embedding-3-small
# Requires: OPENAI_API_KEY in .env

# Local ONNX (no API key needed)
--neural --neural-backend onnx
# No API key required - runs locally
```

**Tool**: `narsil_neural_search`
**Fallback**: BM25 search if neural unavailable

```typescript
// Example: Semantic code search
call_tool_chain({
  code: `
    const results = await narsil.narsil_neural_search({ 
      query: "how does authentication work",
      top_k: 10 
    });
    return results;
  `
});
```

See [references/tool_reference.md](./references/tool_reference.md) for complete tool documentation.

### Error Handling Patterns

Narsil tools can fail for various reasons. Use these patterns for robust error handling.

#### Pattern 1: Check Index Status Before Search

```typescript
call_tool_chain({
  code: `
    const status = await narsil.narsil_get_index_status({});
    
    if (!status.neural_ready || status.embedding_count === 0) {
      console.log("Neural index building, using structural query");
      const symbols = await narsil.narsil_find_symbols({
        repo: "unknown",
        symbol_type: "function",
        name_pattern: "auth"
      });
      return { fallback: true, results: symbols };
    }
    
    const results = await narsil.narsil_neural_search({
      query: "authentication flow"
    });
    return { fallback: false, results };
  `
});
```

#### Pattern 2: Try-Catch with Retry

```typescript
call_tool_chain({
  code: `
    try {
      const findings = await narsil.narsil_scan_security({ repo: "unknown" });
      return { success: true, findings };
    } catch (error) {
      if (error.message?.includes("not found")) {
        await narsil.narsil_reindex({});
        const findings = await narsil.narsil_scan_security({ repo: "unknown" });
        return { success: true, retried: true, findings };
      }
      throw error;
    }
  `,
  timeout: 60000
});
```

#### Pattern 3: Graceful Degradation

```typescript
call_tool_chain({
  code: `
    async function robustSearch(query) {
      try {
        const neural = await narsil.narsil_neural_search({ query, top_k: 10 });
        if (neural.results?.length > 0) return { method: "neural", results: neural.results };
      } catch (e) { console.log("Neural unavailable:", e.message); }
      
      try {
        const semantic = await narsil.narsil_semantic_search({ repo: "unknown", query });
        if (semantic.results?.length > 0) return { method: "semantic", results: semantic.results };
      } catch (e) { console.log("Semantic unavailable:", e.message); }
      
      const symbols = await narsil.narsil_find_symbols({
        repo: "unknown",
        name_pattern: query.split(" ")[0]
      });
      return { method: "symbols", results: symbols };
    }
    
    return await robustSearch("authentication handler");
  `
});
```

---

## 4. 📋 RULES

### ✅ ALWAYS

1. **ALWAYS use Code Mode for Narsil invocation**
   - Call via `call_tool_chain()` with TypeScript
   - Saves ~5,300 tokens vs native MCP

2. **ALWAYS use full tool naming convention**
   - Format: `narsil.narsil_{tool_name}`
   - Example: `narsil.narsil_scan_security({})`

3. **ALWAYS use neural_search for semantic queries**
   - "How does X work?" → `narsil_neural_search`
   - "Find code like X" → `narsil_neural_search`

4. **ALWAYS load security_guide.md for security tasks**
   - Provides phased workflow with checkpoints
   - Ensures comprehensive coverage

5. **ALWAYS verify tool exists before calling**
   - Use `search_tools()` or `tool_info()` first
   - Prevents "tool not found" errors

### ❌ NEVER

1. **NEVER skip the `narsil_` prefix in tool names**
   - Wrong: `await narsil.scan_security({})`
   - Right: `await narsil.narsil_scan_security({})`

2. **NEVER use Narsil's LSP/remote tools unnecessarily**
   - LSP: IDE handles this natively
   - Remote: Not needed for local development

4. **NEVER assume index is current**
   - Use `narsil_reindex({})` after file changes
   - Index persists with `--persist` flag

### ⚠️ ESCALATE IF

1. **ESCALATE IF large repository causes timeout**
   - Increase timeout: `{ timeout: 120000 }`
   - Use `--persist` flag to save index
   - Consider indexing subset of files

2. **ESCALATE IF tool returns unexpected results**
   - Verify tool name with `tool_info()`
   - Check if repository is indexed with `list_repos()`
   - Trigger `reindex()` if needed

3. **ESCALATE IF security findings seem incomplete**
   - Verify all categories enabled in scan
   - Check language support (15 languages)
   - Consider taint analysis for deeper inspection

### ⚠️ KNOWN LIMITATIONS

1. **JavaScript Call Graph**
   - Call graph analysis may return empty or incomplete results for JavaScript
   - tree-sitter-javascript has limited support for dynamic call patterns
   - **Workaround**: Use `find_symbols` + `get_symbol_definition` for JS code analysis

2. **Security Scanning Language Support**
   - Security rules are primarily designed for backend languages (Rust, Python, Go, Java, C/C++)
   - JavaScript/TypeScript security coverage is limited
   - Frontend-specific vulnerabilities (DOM XSS) may not be fully detected

3. **Neural Search After Index Clear**
   - Clearing `.narsil-index/` requires **OpenCode restart** to rebuild neural embeddings
   - Simply calling `reindex()` may not regenerate embeddings if MCP server has stale state
   - **Fix**: Exit OpenCode (Ctrl+C), then restart

4. **Git Blame Unicode** (Fixed in local build)
   - Original Narsil had issues with files containing Unicode box-drawing characters
   - Local build includes fix for char-safe string slicing

5. **Code Mode Process Spawning**
   - Code Mode spawns fresh Narsil MCP processes for each call batch
   - Search indexes (BM25, TF-IDF, Neural) are in-memory and rebuilt on each spawn
   - **Impact**: Semantic search may return empty if index hasn't built yet (~40-60s)
   - **Workaround 1**: Keep related calls in same `call_tool_chain()` batch
   - **Workaround 2 (Recommended)**: Use HTTP server mode for reliable search (see below)

### HTTP Server Workaround for Search

For reliable search functionality, use Narsil's HTTP server instead of Code Mode:

```bash
# Start HTTP server (indexes build once and stay warm)
./.opencode/skill/mcp-narsil/scripts/narsil-server.sh start

# Wait ~60s for indexes, then search reliably
./.opencode/skill/mcp-narsil/scripts/narsil-search.sh semantic "query"
./.opencode/skill/mcp-narsil/scripts/narsil-search.sh neural "how does X work"
./.opencode/skill/mcp-narsil/scripts/narsil-search.sh symbols function

# Or call any tool via HTTP
curl -X POST http://localhost:3001/tools/call \
  -H "Content-Type: application/json" \
  -d '{"tool": "semantic_search", "args": {"repo": "unknown", "query": "test"}}'
```

**Scripts available:**
- `narsil-server.sh` - Server management (start/stop/restart/status/logs)
- `narsil-search.sh` - Search CLI (neural/semantic/code/hybrid/symbols)

6. **Functions with Limited Results**
   - `get_project_structure`: May return empty tree structure
   - `find_references`: Returns 0 for most symbols (needs call graph traversal)
   - `get_chunk_stats`: Returns 0 (aggregate stats not populated)
   - `hybrid_search`: Requires BOTH BM25 + Neural indexes to be built

7. **Code Mode Config Loading (CRITICAL)**
   - Code Mode loads `.utcp_config.json` at **startup only**
   - Changes to Narsil config require **OpenCode restart** to take effect
   - If `narsil is not defined` error: **restart OpenCode**
   - Verify after restart: `code_mode_list_tools()` should show `narsil.*` tools
   - Common config issues: extra fields, relative paths, missing `transport: "stdio"`

### Function Categories by Index Dependency

| Category | Functions | Timing |
|----------|-----------|--------|
| **AST-Based** (work immediately) | `find_symbols`, `get_symbol_definition`, `get_file`, `get_chunks`, `find_dead_code`, `scan_security`, `get_recent_changes` | Instant |
| **Index-Based** (need ~40-60s) | `semantic_search`, `search_code`, `hybrid_search`, `neural_search`, `find_similar_code` | 40-60s after server start |

**Tip**: Use AST-based functions for immediate results. For semantic search, either wait ~60s after first Narsil call or trigger `reindex()` and wait.

---

## 5. 🏆 SUCCESS CRITERIA

### Security Audit Complete

**Security audit complete when**:
- ✅ `scan_security` executed with OWASP/CWE rules
- ✅ `find_injection_vulnerabilities` checked SQL/XSS/command
- ✅ `trace_taint` analyzed untrusted data flow
- ✅ `generate_sbom` created dependency manifest
- ✅ `check_dependencies` verified against CVE database
- ✅ `check_licenses` confirmed compliance
- ✅ All critical/high findings addressed or documented

### Code Analysis Complete

**Code analysis complete when**:
- ✅ `get_project_structure` provided overview
- ✅ `find_symbols` identified key components
- ✅ `get_call_graph` mapped function relationships
- ✅ `find_dead_code` identified cleanup candidates
- ✅ `get_complexity` flagged refactoring targets
- ✅ `narsil_neural_search` used for semantic understanding

### Validation Checkpoints

| Checkpoint          | Validation                                   |
| ------------------- | -------------------------------------------- |
| `tools_discovered`  | `search_tools()` returns Narsil tools        |
| `repo_indexed`      | `list_repos()` shows repository              |
| `scan_complete`     | Security scan has zero unaddressed criticals |
| `analysis_complete` | All structural queries executed              |

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Code Mode Integration

**Configuration**: Add to `.utcp_config.json`:

> **CRITICAL**: 
> - Use **absolute path** for command (e.g., `/Users/username/bin/narsil-mcp`)
> - Do NOT include extra fields like `_note`, `_neural_backends` in mcpServers
> - Config changes require **OpenCode restart** to take effect

```json
{
  "name": "narsil",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "narsil": {
        "transport": "stdio",
        "command": "/absolute/path/to/narsil-mcp",
        "args": [
          "--repos", ".",
          "--index-path", ".narsil-index",
          "--git",
          "--call-graph",
          "--persist",
          "--watch",
          "--neural",
          "--neural-backend", "api",
          "--neural-model", "voyage-code-2"
        ],
        "env": {
          "VOYAGE_API_KEY": "${VOYAGE_API_KEY}"
        }
      }
    }
  }
}
```

**Finding your Narsil path:**
```bash
which narsil-mcp
# Use the output as the absolute path in config
```

**After config changes:**
1. Save `.utcp_config.json`
2. **Restart OpenCode** (Ctrl+C, then restart)
3. Verify: `code_mode_list_tools()` should show `narsil.*` tools

> **Note**: The `--http` flag enables a visualization web UI at localhost:3000, NOT HTTP transport for MCP. MCP transport is always stdio.

### Index Persistence

Narsil supports persisting the code index to disk for faster startup:

| Flag | Purpose | Default |
|------|---------|---------|
| `--persist` | Enable saving/loading index from disk | Disabled |
| `--index-path` | Custom index storage location | `~/.cache/narsil-mcp/` |

**Project-local indexes** (recommended): Use `--index-path .narsil-index` and add `.narsil-index/` to `.gitignore`.

**Manual save**: Use `narsil.narsil_save_index({})` via Code Mode to trigger index save.

### HTTP Server & Visualization

Narsil includes an HTTP server with React frontend for interactive graph visualization.

> **Important**: The `--http` flag enables a **visualization web UI**, NOT HTTP transport for MCP. MCP communication is **always via stdio** - Code Mode spawns the Narsil process and communicates via stdin/stdout. The HTTP server runs in parallel for visual exploration.

**Starting the HTTP Server (CRITICAL):**

The HTTP server requires stdin to stay open. Use this pattern to keep it running:

```bash
# Backend (port 3000) - MUST use stdin pipe to prevent EOF shutdown
(tail -f /dev/null | narsil-mcp \
  --repos . \
  --index-path .narsil-index \
  --git --call-graph --persist \
  --http --http-port 3000 > /tmp/narsil-http.log 2>&1) &

# Frontend (port 5173) - in separate terminal
cd /path/to/narsil-mcp/frontend && npm install && npm run dev
```

**Why the pipe?** MCP servers read from stdin. Without input, they receive EOF and shut down. The `tail -f /dev/null |` keeps stdin open indefinitely.

**Graph Views & Limitations:**

| View | Purpose | Required Parameters |
|------|---------|---------------------|
| `import` | Module import/export | None (best for JS) |
| `call` | Function call graph | None |
| `symbol` | Symbol definitions | **Requires `root` parameter** (function name) |
| `hybrid` | Combined import + call | **Requires `repo` parameter** |
| `flow` | Data flow | None |

**Known Frontend Issues:**
- Symbol view shows "Symbol view requires a root" - enter a function name in the Root field
- Hybrid view may fail without repo parameter - use Import or Call view instead

**Performance**: Use Limit slider in UI, index specific dirs with `-r src -r lib`, add `**/node_modules` to `.gitignore`.

### Related Skills

| Skill               | Integration                                                       |
| ------------------- | ----------------------------------------------------------------- |
| **mcp-code-mode**   | Tool orchestration - Narsil accessed via Code Mode's `call_tool_chain()` |
| **system-spec-kit** | Context preservation - save security findings for future sessions |

### Tool Usage Guidelines

**Bash**: Execute update script, verify binary
**Read**: Load reference files for detailed workflows

### Binary Location

The Narsil MCP server source is embedded in the skill folder:
```
.opencode/skill/mcp-narsil/mcp_server/
```

Binary path (after build):
```
.opencode/skill/mcp-narsil/mcp_server/target/release/narsil-mcp
```

The absolute path is configured in `.utcp_config.json`. A symlink at `~/bin/narsil-mcp` also points to this binary.

**To update Narsil:**
```bash
bash .opencode/skill/mcp-narsil/scripts/update-narsil.sh
```

---

## 7. 🏎️ QUICK REFERENCE

### Essential Commands

| Task | Tool | Example |
|------|------|---------|
| Semantic search | `neural_search` | `narsil.narsil_neural_search({ query: "authentication flow" })` |
| Find symbols | `find_symbols` | `narsil.narsil_find_symbols({ symbol_type: "function" })` |
| Security scan | `scan_security` | `narsil.narsil_scan_security({ repo: "." })` |
| Call graph | `get_call_graph` | `narsil.narsil_get_call_graph({ function: "main" })` |
| Find callers | `get_callers` | `narsil.narsil_get_callers({ function: "login" })` |
| Find references | `find_references` | `narsil.narsil_find_references({ symbol: "UserService" })` |

### Common Patterns

```typescript
// Semantic code search
call_tool_chain({
  code: `
    const results = await narsil.narsil_neural_search({
      query: "how does authentication work"
    });
    return results;
  `
});

// Security scan
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({
      repo: "."
    });
    return findings;
  `
});

// Find all functions
call_tool_chain({
  code: `
    const functions = await narsil.narsil_find_symbols({
      symbol_type: "function"
    });
    return functions;
  `
});
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Neural search returns empty | Wait 60s after server start for index to build |
| Call graph empty for JS | Known limitation - use find_symbols + find_references instead |
| Tool not found | Check naming: `narsil.narsil_{tool}` |
| Slow first query | Index building in progress - check with `get_index_status` |

### Error Quick Reference

| Error Pattern | Cause | Solution |
|---------------|-------|----------|
| "not found" in message | Repo not indexed | Run `narsil.narsil_reindex({})` |
| "timeout" in message | Large codebase | Use `categories` filter, increase timeout |
| `neural_ready: false` | Index building | Wait ~60s or use AST-based tools |
| Empty results | No matches or index issue | Try different search method |

---

## 8. 🔗 RELATED RESOURCES

### scripts/

| Script | Purpose | Usage |
|--------|---------|-------|
| **update-narsil.sh** | Update to latest version | `bash .opencode/skill/mcp-narsil/scripts/update-narsil.sh` |
| **narsil-server.sh** | HTTP server management | `bash scripts/narsil-server.sh start\|stop\|status` |
| **narsil-search.sh** | Search CLI | `bash scripts/narsil-search.sh neural "query"` |

### references/

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| **tool_reference.md** | All 76 tools documented | Complete parameter reference |
| **security_guide.md** | Security scanning workflow | OWASP/CWE checkpoints |
| **call_graph_guide.md** | Call graph analysis | CFG/DFG patterns |
| **quick_start.md** | Getting started | 5-minute setup |

### assets/

| Asset | Purpose |
|-------|---------|
| **tool_categories.md** | Priority categorization of all 76 tools |

### External Resources

- [Narsil GitHub](https://github.com/postrv/narsil-mcp) - Source code and documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security standard
- [CWE Top 25](https://cwe.mitre.org/top25/) - Weakness enumeration

### Related Skills

- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - Tool orchestration (Narsil accessed via Code Mode)
- **[system-spec-kit](../system-spec-kit/SKILL.md)** - Context preservation across sessions

### Install Guide

- [MCP - Narsil.md](../../install_guides/MCP/MCP%20-%20Narsil.md) - Installation and configuration