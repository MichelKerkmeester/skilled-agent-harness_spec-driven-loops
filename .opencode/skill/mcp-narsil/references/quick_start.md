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

#### Installation Location

```
/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/
├── target/release/narsil-mcp  # Binary
├── Cargo.toml                  # Build config
└── src/                        # Source code
```

---

## 2. 🚀 INSTALLATION VERIFICATION

### Step 1: Verify Binary

```bash
# Check binary exists
ls -la "/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp"

# Expected output:
# -rwxr-xr-x  1 user  staff  52.8M  Dec 25 12:00 narsil-mcp
```

### Step 2: Check Version

```bash
"/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp" --version

# Expected output:
# narsil-mcp 1.0.0
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

### Get Project Structure

```typescript
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
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
      kind: "function"
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
      ruleset: "owasp"
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
      function_name: "main"
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

### Tool Not Found

**Symptom**: `search_tools` doesn't find Narsil tools

**Solution**: Verify Code Mode configuration in `.utcp_config.json`

### Binary Not Found

**Symptom**: `spawn ENOENT` error

**Solution**:
```bash
cd "/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp"
cargo build --release
```

### Empty Results

**Symptom**: Tools return empty arrays

**Solution**: Trigger reindex
```typescript
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
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
| Project structure | `narsil_get_project_structure({})` |
| Find functions | `narsil_find_symbols({ kind: "function" })` |
| Security scan | `narsil_scan_security({ ruleset: "owasp" })` |
| Call graph | `narsil_get_call_graph({ function_name: "X" })` |
| Dead code | `narsil_find_dead_code({})` |
| SBOM | `narsil_generate_sbom({ format: "cyclonedx" })` |
| Reindex | `narsil_reindex({})` |

---

**Remember**: All Narsil tools use the naming pattern `narsil.narsil_{tool_name}` when called via Code Mode.
