---
title: Quick Start - Narsil MCP
description: Get started with Narsil in 5 minutes covering prerequisites, verification, and first commands.
---

# Quick Start - Narsil MCP

Get started with Narsil in 5 minutes covering prerequisites and first commands.

---

## 1. 📖 OVERVIEW

### Prerequisites

#### Required

| Component | Purpose | Verification |
|-----------|---------|--------------|
| Narsil binary | MCP server | `narsil-mcp --version` |
| Code Mode MCP | Tool orchestration | `search_tools()` returns results |

---

## 2. 🚀 INSTALLATION

### Installation Methods (Choose One)

| Method | Command | Platform |
|--------|---------|----------|
| **Homebrew** | `brew tap postrv/narsil && brew install narsil-mcp` | macOS, Linux |
| **Scoop** | `scoop bucket add narsil https://github.com/postrv/scoop-narsil && scoop install narsil-mcp` | Windows |
| **npm** | `npm install -g narsil-mcp` | All |
| **Cargo** | `cargo install narsil-mcp` | All (Rust) |
| **AUR** | `yay -S narsil-mcp-bin` | Arch Linux |

### Config Wizard (After Install)

```bash
# Interactive setup with automatic editor detection
narsil-mcp config init

# With neural search enabled (requires Voyage API key)
narsil-mcp config init --neural
```

### Verify Installation

```bash
narsil-mcp --version
# Expected: narsil-mcp X.X.X
```

### Step 3: Verify Code Mode Integration

```typescript
// Discover Narsil tools
search_tools({ task_description: "narsil security" });

// Expected output: List of narsil.narsil_* tools
// - narsil.narsil_scan_security
// - narsil.narsil_find_symbols
// - narsil.narsil_get_call_graph
// ... etc
```

---

## 3. 🎯 FIRST COMMANDS

> **Important**: Most Narsil tools require a `repo` parameter. First discover the repo name:

### Step 0: Discover Repo Name

```typescript
call_tool_chain({
  code: `
    const repos = await narsil.narsil_list_repos({});
    console.log(repos);
    return repos;  // Returns repo name (typically "unknown")
  `
});

// Expected output: Repo name like "unknown"
```

### Get Project Structure

```typescript
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({
      repo: "unknown"  // Required: use repo name from list_repos
    });
    console.log(structure);
    return structure;
  `
});

// Expected output:
// {
//   "tree": "project/\n├── src/\n│   ├── main.rs\n│   └── lib.rs\n...",
//   "file_count": 42,
//   "total_lines": 5000
// }
```

### Find All Functions

```typescript
call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({
      repo: "unknown",           // Required
      symbol_type: "function"    // Note: symbol_type, not kind
    });
    console.log('Found', symbols.length, 'functions');
    return symbols.slice(0, 10);  // First 10
  `
});

// Expected output:
// Found 150 functions
// [{ name: "main", file: "src/main.rs", line: 1 }, ...]
```

### Run Security Scan

```typescript
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({
      repo: "unknown"  // Required
    });
    console.log('Findings:', findings.length);
    return findings;
  `,
  timeout: 60000
});

// Expected output:
// Findings: 5
// [{ severity: "high", category: "A03-Injection", ... }, ...]
```

### Get Call Graph

```typescript
call_tool_chain({
  code: `
    const graph = await narsil.narsil_get_call_graph({
      repo: "unknown",    // Required
      function: "main"    // Note: function, not function_name
    });
    console.log('Nodes:', graph.nodes?.length);
    return graph;
  `
});

// Expected output:
// Nodes: 25
// { nodes: [...], edges: [...] }
```

---

## 4. 🔧 COMMON WORKFLOWS

### Security Audit

```
1. scan_security   → Get overview of findings
2. find_injection  → Check SQL/XSS/command injection
3. trace_taint     → Trace untrusted data flow
4. generate_sbom   → Get dependency list
5. check_deps      → Check for CVEs
```

See [security_guide.md](./security_guide.md) for detailed workflow.

### Code Understanding

```
1. get_project_structure → Overview
2. find_symbols          → Key components
3. get_call_graph        → Relationships
4. neural_search         → Semantic understanding
```

See [call_graph_guide.md](./call_graph_guide.md) for detailed workflow.

### Code Quality

```
1. find_dead_code    → Unreachable code
2. find_dead_stores  → Unused assignments
3. get_complexity    → Complexity metrics
4. get_hotspots      → Churn + complexity
```

---

## 5. 🛠️ TROUBLESHOOTING

### Narsil Not Defined in Code Mode (MOST COMMON)

**Symptom**: `narsil is not defined` error when calling `narsil.narsil_*` tools

**Root Cause**: Code Mode loads `.utcp_config.json` at **startup only**. Config changes require restart.

**Solution**:
1. Verify `.utcp_config.json` has correct Narsil configuration
2. **Restart OpenCode** (Ctrl+C, then restart)
3. After restart, verify: `code_mode_list_tools()` should show `narsil.*` tools

**Common Config Issues**:
| Issue | Fix |
|-------|-----|
| Extra fields | Remove `_note`, `_neural_backends`, `_usage_examples` |
| Relative path | Use absolute: `/Users/username/bin/narsil-mcp` |
| Missing transport | Add `"transport": "stdio"` to mcpServers |

### Tool Not Found

**Symptom**: `search_tools` doesn't find Narsil tools

**Solution**: 
1. Verify Code Mode configuration in `.utcp_config.json`
2. **Restart OpenCode** to reload config
3. Check with `code_mode_list_tools()`

### Binary Not Found

**Symptom**: `spawn ENOENT` error

**Solution**: Reinstall Narsil following [INSTALL.md](../INSTALL.md):

```bash
# If installed via Homebrew:
brew reinstall narsil-mcp

# If built from source, rebuild in your narsil-mcp directory:
cd <your-narsil-source-directory>
cargo build --release
```

### Empty Results

**Symptom**: Tools return empty arrays

**Solution**: 
1. First, try reindex via Code Mode:
```typescript
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
```

2. If still empty (especially after clearing `.narsil-index/`), **restart OpenCode**:
   - The MCP server may have stale in-memory state
   - Exit OpenCode (Ctrl+C), then restart
   - Fresh index will be built on startup

### Call Graph Empty for JavaScript

**Symptom**: `get_call_graph` returns 0 nodes for JS projects

**Cause**: tree-sitter-javascript has limited support for dynamic call patterns

**Workaround**: Use structural queries instead:
```typescript
// Find all functions (use symbol_type, not kind)
const symbols = await narsil.narsil_find_symbols({ 
  repo: "unknown", 
  symbol_type: "function" 
});

// Get definition for specific function (use symbol, not name)
const def = await narsil.narsil_get_symbol_definition({ 
  repo: "unknown", 
  symbol: "myFunction" 
});
```

### Search Returns Empty (Code Mode)

**Symptom**: `semantic_search`, `neural_search`, `hybrid_search` return empty results

**Cause**: Code Mode spawns fresh MCP processes for each batch. Search indexes take ~40-60s to rebuild.

**Solution**: Use HTTP server for reliable search:
```bash
# Start HTTP server (indexes build once and stay warm)
./.opencode/skill/mcp-narsil/scripts/narsil-server.sh start

# Wait ~60s for indexes, then search
./.opencode/skill/mcp-narsil/scripts/narsil-search.sh semantic "query"
./.opencode/skill/mcp-narsil/scripts/narsil-search.sh neural "how does X work"

# Stop when done
./.opencode/skill/mcp-narsil/scripts/narsil-server.sh stop
```

---

## 6. 🔗 RELATED RESOURCES

| Guide | When to Use |
|-------|-------------|
| [tool_reference.md](./tool_reference.md) | Full tool documentation |
| [security_guide.md](./security_guide.md) | Security scanning workflow |
| [call_graph_guide.md](./call_graph_guide.md) | Code flow analysis |

### Key Commands Reference

| Task | Command |
|------|---------|
| List repos | `narsil_list_repos({})` |
| Project structure | `narsil_get_project_structure({ repo: "unknown" })` |
| Find functions | `narsil_find_symbols({ repo: "unknown", symbol_type: "function" })` |
| Security scan | `narsil_scan_security({ repo: "unknown" })` |
| Call graph | `narsil_get_call_graph({ repo: "unknown", function: "X" })` |
| Symbol definition | `narsil_get_symbol_definition({ repo: "unknown", symbol: "X" })` |
| Dead code | `narsil_find_dead_code({ repo: "unknown", path: "src/file.js" })` |
| SBOM | `narsil_generate_sbom({ repo: "unknown", format: "cyclonedx" })` |
| Reindex | `narsil_reindex({ repo: "unknown" })` |

---

**Remember**: All Narsil tools use the naming pattern `narsil.narsil_{tool_name}` when called via Code Mode.
