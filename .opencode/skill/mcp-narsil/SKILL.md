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

## 1. 📖 OVERVIEW

Narsil MCP provides deep code intelligence through 76 specialized tools covering security scanning (OWASP, CWE, taint analysis), call graph analysis (CFG, DFG, callers/callees), structural queries (symbols, definitions, references), and supply chain security (SBOM, license compliance). All tools are accessed via Code Mode for token efficiency.

### When to Use

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

Narsil is configured with neural embeddings via Voyage API:
- **Model**: voyage-code-2 (code-specialized, 1536-dim)
- **Tool**: `narsil_neural_search`
- **Fallback**: BM25 search if API unavailable

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

### Code Mode Integration

**Configuration**: Add to `.utcp_config.json`:

```json
{
  "name": "narsil",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "narsil": {
        "transport": "stdio",
        "command": "narsil-mcp",
        "args": [
          "--repos", ".",
          "--preset", "full",
          "--index-path", ".narsil-index",
          "--git",
          "--call-graph",
          "--persist",
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

```bash
# Start with HTTP visualization enabled
narsil-mcp --repos . --preset full --http --http-port 3000

# Frontend (port 5173) - in separate terminal (optional, for development)
cd "${NARSIL_PATH}/frontend" && npm install && npm run dev
```

**Graph views**: `import` (best for JS), `call`, `symbol`, `hybrid`, `flow`

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

```
/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp
```

---

## 7. 📚 RELATED RESOURCES

### Reference Files

- [tool_reference.md](./references/tool_reference.md) - Complete documentation for all 76 tools
- [security_guide.md](./references/security_guide.md) - Security scanning workflow with checkpoints
- [call_graph_guide.md](./references/call_graph_guide.md) - Call graph analysis workflow
- [quick_start.md](./references/quick_start.md) - Getting started in 5 minutes

### Assets

- [tool_categories.md](./assets/tool_categories.md) - Priority categorization of tools

### External Resources

- [Narsil GitHub](https://github.com/postrv/narsil-mcp) - Source code and documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security standard
- [CWE Top 25](https://cwe.mitre.org/top25/) - Weakness enumeration

### Related Skills

- `mcp-code-mode` - Tool orchestration (Narsil accessed via Code Mode)
- `system-spec-kit` - Context preservation across sessions