# Narsil MCP

> **Last Updated:** 2025-12-29 | **Version:** Narsil MCP

The blazing-fast, privacy-first MCP server for **deep code intelligence**. **76 tools**, **15 languages**, security scanning, call graphs, and more. Narsil is accessed via **Code Mode** - use `call_tool_chain()` to invoke tools.

> **Navigation**:
> - New to Narsil? Start with [Quick Start](#2--quick-start)
> - Need feature overview? See [Features](#4--features)
> - Configuration help? See [Configuration](#5--configuration)
> - Troubleshooting? See [Troubleshooting](#9--troubleshooting)

[![License](https://img.shields.io/badge/License-MIT%20OR%20Apache--2.0-blue.svg)](https://github.com/postrv/narsil-mcp)
[![Rust](https://img.shields.io/badge/rust-1.70%2B-orange.svg)](https://www.rust-lang.org)
[![Tests](https://img.shields.io/badge/tests-359%20passed-brightgreen.svg)](https://github.com/postrv/narsil-mcp)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 🌐 HTTP SERVER & VISUALIZATION](#6--http-server--visualization)
- [7. 💡 USAGE EXAMPLES](#7--usage-examples)
- [8. 📊 PERFORMANCE](#8--performance)
- [9. 🏗️ ARCHITECTURE](#9--architecture)
- [10. 🛠️ TROUBLESHOOTING](#10--troubleshooting)
- [11. ❓ FAQ](#11--faq)
- [12. 📚 RELATED DOCUMENTS](#12--related-documents)

---

## 1. 📖 OVERVIEW

### What is Narsil MCP?

Narsil is a Rust-powered MCP server providing AI assistants with deep code understanding through 76 specialized tools. It combines Tree-sitter AST parsing, Tantivy full-text search, and sophisticated static analysis to provide capabilities beyond traditional search tools, including security scanning, call graph analysis, dead code detection, and SBOM generation.

### Key Statistics

| Category       | Count | Details                                        |
| -------------- | ----- | ---------------------------------------------- |
| Tools          | 76    | Across 17 categories                           |
| Languages      | 15    | Rust, Python, JS/TS, Go, C/C++, Java, and more |
| Security Rules | 111   | OWASP Top 10, CWE Top 25, crypto, secrets      |
| Tests          | 359   | Comprehensive test coverage                    |
| Token Overhead | ~700  | Via Code Mode (vs ~6,000-8,000 native)         |

### Comparison with Alternatives

| Feature            | narsil-mcp | XRAY    | Serena    | GitHub MCP |
| ------------------ | ---------- | ------- | --------- | ---------- |
| **Languages**      | 15         | 4       | 30+ (LSP) | N/A        |
| **Neural Search**  | Yes        | No      | No        | No         |
| **Taint Analysis** | Yes        | No      | No        | No         |
| **SBOM/Licenses**  | Yes        | No      | No        | Partial    |
| **Offline/Local**  | Yes        | Yes     | Yes       | No         |
| **WASM/Browser**   | Yes        | No      | No        | No         |
| **Call Graphs**    | Yes        | Partial | No        | No         |
| **Type Inference** | Yes        | No      | No        | No         |

### Key Features

| Feature                   | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Security Scanning**     | OWASP Top 10, CWE Top 25, injection detection, taint analysis      |
| **Call Graph Analysis**   | CFG, DFG, callers/callees, complexity metrics                      |
| **Structural Queries**    | Symbol search, definitions, references, project structure          |
| **Supply Chain Security** | SBOM generation (CycloneDX/SPDX), license compliance, CVE checking |
| **Neural Search**         | Semantic code search using Voyage AI, OpenAI, or ONNX embeddings   |
| **Type Inference**        | Infer types in Python/JS/TS without mypy/tsc                       |
| **Git Integration**       | Blame, history, hotspots, contributors                             |
| **WASM Support**          | Run in browser for code playgrounds and educational tools          |
| **Code Mode Access**      | Token-efficient on-demand tool invocation                          |

### Supported Languages

| Language              | Extensions                 | Symbols Extracted                                       |
| --------------------- | -------------------------- | ------------------------------------------------------- |
| Rust                  | `.rs`                      | functions, structs, enums, traits, impls, mods          |
| Python                | `.py`, `.pyi`              | functions, classes                                      |
| JavaScript            | `.js`, `.jsx`, `.mjs`      | functions, classes, methods, variables                  |
| TypeScript            | `.ts`, `.tsx`              | functions, classes, interfaces, types, enums            |
| Go                    | `.go`                      | functions, methods, types                               |
| C                     | `.c`, `.h`                 | functions, structs, enums, typedefs                     |
| C++                   | `.cpp`, `.cc`, `.hpp`      | functions, classes, structs, namespaces                 |
| Java                  | `.java`                    | methods, classes, interfaces, enums                     |
| C#                    | `.cs`                      | methods, classes, interfaces, structs, enums, delegates |
| Bash                  | `.sh`, `.bash`, `.zsh`     | functions, variables                                    |
| Ruby                  | `.rb`, `.rake`, `.gemspec` | methods, classes, modules                               |
| Kotlin                | `.kt`, `.kts`              | functions, classes, objects, interfaces                 |
| PHP                   | `.php`, `.phtml`           | functions, methods, classes, interfaces, traits         |
| Swift                 | `.swift`                   | classes, structs, enums, protocols, functions           |
| Verilog/SystemVerilog | `.v`, `.vh`, `.sv`, `.svh` | modules, tasks, functions, interfaces, classes          |

### Requirements

| Requirement    | Minimum    | Recommended          |
| -------------- | ---------- | -------------------- |
| Rust toolchain | 1.70+      | Latest stable        |
| Code Mode MCP  | Configured | Configured           |
| Disk Space     | ~30 MB     | ~100 MB (with index) |

---

## 2. 🚀 QUICK START

### Prerequisites

- Narsil installed at `${NARSIL_PATH}` (e.g., `/path/to/narsil-mcp`)
- Code Mode MCP configured in `.utcp_config.json`

### 30-Second Setup

```bash
# 1. Verify binary exists
ls -la "${NARSIL_PATH}/target/release/narsil-mcp"

# 2. Check version
"${NARSIL_PATH}/target/release/narsil-mcp" --version
# Expected: narsil-mcp 1.0.0
```

### Installation Options

**Option A: One-Click Install**
```bash
curl -fsSL https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.sh | bash
```

**Option B: From Source**
```bash
git clone git@github.com:postrv/narsil-mcp.git
cd narsil-mcp
cargo build --release
# Binary at target/release/narsil-mcp
```

**Option C: Cargo Install**
```bash
cargo install narsil-mcp
```

### Verify Installation

```typescript
// Via Code Mode - discover Narsil tools
search_tools({ task_description: "narsil" });

// Expected output: List of narsil.narsil_* tools
```

### First Use

```typescript
// Get project structure
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
    console.log(structure);
    return structure;
  `
});

// Expected: Directory tree with file information
```

---

## 3. 📁 STRUCTURE

```
.opencode/skill/mcp-narsil/
├── SKILL.md                    # AI agent instructions
├── README.md                   # This file (user documentation)
├── references/
│   ├── tool_reference.md       # All 76 tools documented
│   ├── security_guide.md       # Security scanning workflow
│   ├── call_graph_guide.md     # Call graph analysis guide
│   └── quick_start.md          # Getting started guide
├── assets/
│   └── tool_categories.md      # Tool priority categorization
└── scripts/
    └── update-narsil.sh        # Binary update script
```

### Key Files

| File                           | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `SKILL.md`                     | AI agent activation triggers and workflow guidance |
| `references/tool_reference.md` | Complete tool documentation with all 76 tools      |
| `references/security_guide.md` | Security scanning phased workflow                  |
| `assets/tool_categories.md`    | HIGH/MEDIUM/LOW/SKIP categorization                |

---

## 4. ⚡ FEATURES

### Security Scanning

Comprehensive security analysis with OWASP Top 10, CWE Top 25, and taint tracking.

| Tool                                        | Purpose                                   |
| ------------------------------------------- | ----------------------------------------- |
| `narsil.narsil_scan_security`               | Full security scan with multiple rulesets |
| `narsil.narsil_find_injection_vulnerabilities` | SQL, XSS, command injection detection  |
| `narsil.narsil_check_owasp_top10`           | OWASP Top 10 2021 compliance              |
| `narsil.narsil_check_cwe_top25`             | CWE Top 25 weaknesses                     |
| `narsil.narsil_trace_taint`                 | Data flow from untrusted sources          |

### Call Graph Analysis

Deep code flow understanding with CFG, DFG, and complexity metrics.

| Tool                            | Purpose                         |
| ------------------------------- | ------------------------------- |
| `narsil.narsil_get_call_graph`  | Function call relationships     |
| `narsil.narsil_get_callers`     | Who calls this function?        |
| `narsil.narsil_get_callees`     | What does this function call?   |
| `narsil.narsil_get_complexity`  | Cyclomatic/cognitive complexity |
| `narsil.narsil_get_control_flow`| CFG showing basic blocks        |
| `narsil.narsil_get_data_flow`   | Variable definitions and uses   |

### Neural Semantic Search

Find similar code using embeddings - works even when variable names, comments, and structure differ.

| Backend   | Flag                    | Models                                             | Best For                     |
| --------- | ----------------------- | -------------------------------------------------- | ---------------------------- |
| Voyage AI | `--neural-backend api`  | `voyage-code-2` (1536-dim)                         | Code-specific, best accuracy |
| OpenAI    | `--neural-backend api`  | `text-embedding-3-small`, `text-embedding-3-large` | General, wide availability   |
| Custom    | `--neural-backend api`  | Any compatible                                     | Local deployment             |
| ONNX      | `--neural-backend onnx` | Local models                                       | Offline, no API costs        |

**Use Cases:**
- **Semantic clone detection**: Find copy-pasted code that was renamed/refactored
- **Similar function search**: "Find functions that do pagination" even if named differently
- **Code deduplication**: Identify candidates for extracting shared utilities

### Type Inference

Built-in type inference for dynamic languages without requiring external type checkers (mypy, tsc).

**Supported Languages:** Python, JavaScript, TypeScript

| Tool                              | Purpose                                                 |
| --------------------------------- | ------------------------------------------------------- |
| `narsil.narsil_infer_types`       | Get inferred types for all variables in a function      |
| `narsil.narsil_check_type_errors` | Find potential type mismatches without running mypy/tsc |
| `narsil.narsil_get_typed_taint_flow` | Enhanced security analysis combining types with taint|

### Supply Chain Security

Dependency management and compliance verification.

| Tool                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `narsil.narsil_generate_sbom`     | CycloneDX/SPDX software bill of materials |
| `narsil.narsil_check_dependencies`| CVE checking against OSV database         |
| `narsil.narsil_check_licenses`    | License compliance verification           |
| `narsil.narsil_find_upgrade_path` | Safe upgrade paths for vulnerable deps    |

### Structural Queries

Symbol search and project navigation.

| Tool                                   | Purpose                          |
| -------------------------------------- | -------------------------------- |
| `narsil.narsil_find_symbols`           | Find functions, classes, structs |
| `narsil.narsil_get_project_structure`  | Directory tree overview          |
| `narsil.narsil_find_references`        | All usages of a symbol           |
| `narsil.narsil_workspace_symbol_search`| Fuzzy search across workspace    |

### WASM/Browser Support

Run Narsil entirely in the browser via WebAssembly - perfect for browser-based IDEs, code review tools, or educational platforms.

**Features available in WASM:**
- Multi-language parsing (14 languages)
- Symbol extraction (functions, classes, structs, etc.)
- Full-text search with BM25 ranking
- TF-IDF code similarity search
- In-memory file storage

**Bundle Size:** ~2-3MB gzipped

See [references/tool_reference.md](./references/tool_reference.md) for complete tool documentation.

---

## 5. ⚙️ CONFIGURATION

### Code Mode Configuration

Add to `.utcp_config.json`:

```json
{
  "manual_call_templates": [
    {
      "name": "narsil",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "narsil": {
            "transport": "stdio",
            "command": "${NARSIL_PATH}/target/release/narsil-mcp",
            "args": [
              "--repos", "${workspaceFolder}",
              "--index-path", ".narsil-index",
              "--git",
              "--call-graph",
              "--persist",
              "--watch"
            ],
            "env": {}
          }
        }
      }
    }
  ]
}
```

### Index Persistence

Narsil supports persisting the code index to disk for faster startup on subsequent sessions.

| Flag | Purpose | Default |
|------|---------|---------|
| `--persist` | Enable saving/loading index from disk | Disabled |
| `--index-path` | Custom index storage location | `~/.cache/narsil-mcp/` |

**Project-Local Indexes (Recommended)**

Store indexes per-project instead of globally:

```json
"args": [
  "--repos", ".",
  "--index-path", ".narsil-index",
  "--persist",
  ...
]
```

Add to `.gitignore`:
```
.narsil-index/
```

**How Persistence Works**

1. **On startup**: Loads existing index from disk (if available)
2. **After --reindex**: Automatically saves index to disk
3. **Manual save**: Use `save_index` MCP tool via Code Mode
4. **Watch mode**: Saves after detecting file changes

**Manual Index Building**

For large codebases or pre-warming the index:

```bash
narsil-mcp \
  --repos . \
  --index-path .narsil-index \
  --persist \
  --reindex \
  --http

# Index builds and saves automatically
# Press Ctrl+C when done, or leave running for visualization
# Open http://localhost:3000 for web UI
```

**New MCP Tool: save_index**

Manually trigger index save via Code Mode:

```javascript
narsil.narsil_save_index({})
```

### CLI Flags Reference

| Flag               | Purpose                         | Recommended |
| ------------------ | ------------------------------- | ----------- |
| `--repos`          | Repository paths to index       | Required    |
| `--index-path`     | Custom index storage location   | Yes         |
| `--git`            | Enable git integration          | Yes         |
| `--call-graph`     | Enable call graph analysis      | Yes         |
| `--persist`        | Save index to disk              | Yes         |
| `--watch`          | Auto-reindex on changes         | Yes         |
| `--lsp`            | Enable LSP for hover, go-to-def | Optional    |
| `--streaming`      | Stream large result sets        | Optional    |
| `--remote`         | Enable GitHub remote support    | Optional    |
| `--neural`         | Enable neural embeddings        | Optional    |
| `--neural-backend` | Backend: `api` or `onnx`        | With neural |
| `--neural-model`   | Model to use                    | With neural |
| `--http`           | Enable HTTP server for frontend | Optional    |
| `--verbose`        | Enable verbose logging          | Debug       |
| `--reindex`        | Force re-index on startup       | Manual      |

### Flags to Skip

| Flag       | Reason                           |
| ---------- | -------------------------------- |
| `--lsp`    | IDE handles LSP natively         |
| `--remote` | Not needed for local development |

> **Note**: `--neural` is now RECOMMENDED for semantic code search capabilities.

### Feature Builds

| Feature            | Description                            | Size  |
| ------------------ | -------------------------------------- | ----- |
| `native` (default) | Full MCP server with all tools         | ~30MB |
| `frontend`         | + Embedded visualization web UI        | ~31MB |
| `neural`           | + TF-IDF vector search, API embeddings | ~32MB |
| `neural-onnx`      | + Local ONNX model inference           | ~50MB |
| `wasm`             | Browser build (no file system, git)    | ~3MB  |

### MCP Client Configurations

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "narsil-mcp": {
      "command": "/path/to/narsil-mcp",
      "args": ["--repos", "/path/to/your/projects"]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "narsil-mcp": {
      "command": "narsil-mcp",
      "args": ["--repos", "~/code/my-project"]
    }
  }
}
```

**VS Code + GitHub Copilot** (`.vscode/mcp.json`):
```json
{
  "servers": {
    "narsil-mcp": {
      "command": "/path/to/narsil-mcp",
      "args": [
        "--repos", "${workspaceFolder}",
        "--git",
        "--call-graph"
      ]
    }
  }
}
```

---

## 6. 🌐 HTTP SERVER & VISUALIZATION

Narsil includes an HTTP server with a React-based visualization frontend for exploring code graphs interactively.

### Starting the Servers

The backend and frontend run as separate processes:

```bash
# Terminal 1: Start backend with HTTP server
narsil-mcp \
  --repos . \
  --index-path .narsil-index \
  --persist \
  --http \
  --http-port 3000

# Terminal 2: Start frontend (separate React app)
cd "${NARSIL_PATH}/frontend"
npm install  # First time only
npm run dev  # Runs on http://localhost:5173
```

**Important**: Both servers must be running for visualization to work.

### Graph Views

| View       | Purpose                                    | Best For                    |
| ---------- | ------------------------------------------ | --------------------------- |
| `import`   | Module import/export relationships         | JavaScript/TypeScript       |
| `call`     | Function call relationships                | Rust, Python (limited JS)   |
| `symbol`   | Symbol definitions and references          | All languages               |
| `hybrid`   | Combined import + call graph               | Comprehensive analysis      |
| `flow`     | Data flow visualization                    | Security analysis           |

**Note**: For JavaScript projects, the `import` view is most useful. The `call` view works better for statically-typed languages like Rust and Python.

### Performance Tips

1. **Use the Limit slider** in the UI to reduce displayed nodes (prevents browser crashes)
2. **Index specific directories** instead of entire project:
   ```bash
   narsil-mcp -r src -r .opencode --http --http-port 3000
   ```
3. **Exclude node_modules** by adding to `.gitignore` (Narsil respects `.gitignore`):
   ```
   **/node_modules
   ```
4. **Multiple repositories**: Use multiple `-r` flags:
   ```bash
   narsil-mcp -r src -r lib -r .opencode --http
   ```

### Validation

```bash
# Check backend health
curl http://localhost:3000/health

# Frontend should be accessible at http://localhost:5173
```

---

## 7. 💡 USAGE EXAMPLES

### Example 1: Security Audit

```typescript
call_tool_chain({
  code: `
    // OWASP Top 10 scan
    const owasp = await narsil.narsil_check_owasp_top10({});
    console.log('OWASP findings:', owasp.length);
    
    // Injection vulnerabilities
    const injections = await narsil.narsil_find_injection_vulnerabilities({
      types: ["sql", "xss", "command"]
    });
    
    return { owasp, injections };
  `,
  timeout: 60000
});
```

**Result**: List of security findings categorized by severity.

### Example 2: Code Understanding

```typescript
call_tool_chain({
  code: `
    // Project structure
    const structure = await narsil.narsil_get_project_structure({});
    
    // Find all functions
    const functions = await narsil.narsil_find_symbols({ kind: "function" });
    
    // Get call graph for main
    const callGraph = await narsil.narsil_get_call_graph({ 
      function_name: "main" 
    });
    
    return { structure, functions: functions.length, callGraph };
  `
});
```

**Result**: Project overview with symbol counts and call relationships.

### Example 3: Dead Code Detection

```typescript
call_tool_chain({
  code: `
    // Find unreachable code
    const deadCode = await narsil.narsil_find_dead_code({});
    
    // Find unused assignments
    const deadStores = await narsil.narsil_find_dead_stores({});
    
    return { deadCode, deadStores };
  `
});
```

**Result**: Lists of dead code and unused assignments for cleanup.

### Example 4: Neural Semantic Search

```typescript
call_tool_chain({
  code: `
    // Find similar code by meaning
    const similar = await narsil.narsil_neural_search({
      query: "function that validates email addresses"
    });
    
    // Find semantic clones of a function
    const clones = await narsil.narsil_find_semantic_clones({
      function_name: "validate_input"
    });
    
    return { similar, clones };
  `
});
```

**Result**: Code matching by meaning, not just keywords.

### Common Patterns

| Pattern        | Code                                                          | When to Use       |
| -------------- | ------------------------------------------------------------- | ----------------- |
| Security scan  | `narsil.narsil_scan_security({ ruleset: "owasp" })`           | Pre-release audit |
| Find symbols   | `narsil.narsil_find_symbols({ kind: "function" })`            | Code exploration  |
| Call graph     | `narsil.narsil_get_call_graph({ function_name: "X" })`        | Impact analysis   |
| SBOM           | `narsil.narsil_generate_sbom({ format: "cyclonedx" })`        | Compliance        |
| Type inference | `narsil.narsil_infer_types({ function_name: "X" })`           | Dynamic languages |
| Taint analysis | `narsil.narsil_trace_taint({ source: "user_input" })`         | Security review   |

---

## 8. 📊 PERFORMANCE

Benchmarked on Apple M1 (criterion.rs):

### Parsing Throughput

| Language           | Input Size | Time    | Throughput     |
| ------------------ | ---------- | ------- | -------------- |
| Rust (large file)  | 278 KB     | 131 µs  | **1.98 GiB/s** |
| Rust (medium file) | 27 KB      | 13.5 µs | 1.89 GiB/s     |
| Python             | ~4 KB      | 16.7 µs | -              |
| TypeScript         | ~5 KB      | 13.9 µs | -              |
| Mixed (5 files)    | ~15 KB     | 57 µs   | -              |

### Search Latency

| Operation          | Corpus Size   | Time       |
| ------------------ | ------------- | ---------- |
| Symbol exact match | 1,000 symbols | **483 ns** |
| Symbol prefix      | 1,000 symbols | 2.7 µs     |
| Symbol fuzzy       | 1,000 symbols | 16.5 µs    |
| BM25 full-text     | 1,000 docs    | 80 µs      |
| TF-IDF similarity  | 1,000 docs    | 130 µs     |
| Hybrid search      | 1,000 docs    | 151 µs     |

### End-to-End Indexing

| Repository             | Files   | Symbols | Time   | Memory |
| ---------------------- | ------- | ------- | ------ | ------ |
| narsil-mcp (this repo) | 53      | 1,733   | 220 ms | ~50 MB |
| rust-analyzer          | 2,847   | ~50K    | 2.1s   | 89 MB  |
| linux kernel           | 78,000+ | ~500K   | 45s    | 2.1 GB |

**Key metrics:**
- Tree-sitter parsing: **~2 GiB/s** sustained throughput
- Symbol lookup: **<1µs** for exact match
- Full-text search: **<1ms** for most queries
- Hybrid search runs BM25 + TF-IDF in parallel via rayon

---

## 9. 🏗️ ARCHITECTURE

```text
╭─────────────────────────────────────────────────────────────────╮
│                      NARSIL MCP SERVER                          │
│              Code Intelligence Architecture                     │
╰─────────────────────────────────────────────────────────────────╯

┌─────────────────────────────────────────────────────────────────┐
│                      TRANSPORT LAYER                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  JSON-RPC         │
                    │  • stdio          │
                    │  • HTTP (opt)     │
                    └───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CODE INTEL ENGINE                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐
│ Symbol Index  │   │  File Cache   │   │    Search Engine      │
│ • DashMap     │   │  • DashMap    │   │    • Tantivy (BM25)   │
│ • 15 langs    │   │  • LRU evict  │   │    • TF-IDF vectors   │
└───────────────┘   └───────────────┘   └───────────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐
│ Call Graph    │   │ Taint         │   │  Security Rules       │
│ • CFG / DFG   │   │ Tracker       │   │  Engine               │
│ • Callers     │   │ • Sources     │   │  • OWASP / CWE        │
│ • Callees     │   │ • Sinks       │   │  • 111 rules          │
└───────────────┘   └───────────────┘   └───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TREE-SITTER PARSER                           │
└─────────────────────────────────────────────────────────────────┘
                              │
    ┌───────┬───────┬───────┬─┴─────┬───────┬───────┬───────┐
    ▼       ▼       ▼       ▼       ▼       ▼       ▼       ▼
┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│ Rust ││Python││  JS  ││  TS  ││  Go  ││ Java ││  C++ ││ ...  │
└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REPOSITORY WALKER                             │
│              (ignore crate - respects .gitignore)               │
└─────────────────────────────────────────────────────────────────┘
```

**Built with:**
- [tree-sitter](https://tree-sitter.github.io/) - Incremental parsing
- [tantivy](https://github.com/quickwit-oss/tantivy) - Full-text search
- [tokio](https://tokio.rs/) - Async runtime
- [rayon](https://github.com/rayon-rs/rayon) - Data parallelism
- [serde](https://serde.rs/) - Serialization

---

## 10. 🛠️ TROUBLESHOOTING

### Common Issues

#### Tool is not a function

**Symptom**: `TypeError: narsil.scan_security is not a function`

**Cause**: Missing `narsil_` prefix in tool name.

**Solution**:
```typescript
// Wrong
await narsil.scan_security({});

// Correct
await narsil.narsil_scan_security({});
```

#### Binary not found

**Symptom**: `Error: spawn ENOENT` or command not found

**Cause**: Narsil binary not built or path incorrect.

**Solution**:
```bash
cd "${NARSIL_PATH}"
cargo build --release
ls -la target/release/narsil-mcp
```

#### Empty results or index not found

**Symptom**: Queries return empty results or "index not found" error

**Cause**: Repository not indexed.

**Solution**:
```typescript
// Trigger reindex
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
```

#### Tree-sitter build errors

**Symptom**: Errors about missing C compilers during build

**Solution**:
```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt install build-essential
```

#### Neural search API errors

**Symptom**: Neural search fails with API errors

**Solution**:
```bash
# Check your API key is set
echo $VOYAGE_API_KEY  # or $OPENAI_API_KEY

# Voyage keys start with "pa-"
export VOYAGE_API_KEY="pa-..."

# OpenAI keys start with "sk-"
export OPENAI_API_KEY="sk-..."
```

#### Memory issues with large repos

**Symptom**: Out of memory errors with very large repositories

**Solution**:
```bash
# Increase stack size for >50K file repos
RUST_MIN_STACK=8388608 narsil-mcp --repos /path/to/huge-repo

# Or index specific subdirectories
narsil-mcp --repos /path/to/repo/src --repos /path/to/repo/lib
```

### Quick Fixes

| Problem               | Quick Fix                                   |
| --------------------- | ------------------------------------------- |
| Tool not found        | Use `search_tools()` to discover exact name |
| Empty results         | Run `reindex()` to refresh index            |
| Slow indexing         | Add `--persist` flag                        |
| Security scan timeout | Increase timeout to 120s                    |
| Binary missing        | Run `cargo build --release`                 |
| .gitignore issues     | Use `--verbose` to see skipped files        |

### Diagnostic Commands

```typescript
// Check index status
call_tool_chain({
  code: `await narsil.narsil_get_index_status({})`
});

// List indexed repos
call_tool_chain({
  code: `await narsil.narsil_list_repos({})`
});

// Get performance metrics
call_tool_chain({
  code: `await narsil.narsil_get_metrics({})`
});

// Validate repo
call_tool_chain({
  code: `await narsil.narsil_validate_repo({ path: "/path/to/repo" })`
});
```

---

## 11. ❓ FAQ

### General Questions

**Q: What can Narsil do?**

A: Narsil is a unified code intelligence solution providing STRUCTURE (symbols, call graphs), SECURITY (vulnerability scanning, taint analysis), and SEMANTIC search (neural embeddings via `narsil_neural_search`).

**Q: Why use Code Mode instead of native MCP?**

A: Code Mode adds ~700 tokens overhead vs ~6,000-8,000 for native MCP. This is a significant token savings, especially for context-heavy conversations.

**Q: What makes Narsil different from GitHub MCP?**

A: Narsil is privacy-first (fully local), supports neural search, taint analysis, SBOM generation, and works offline. GitHub MCP requires internet and doesn't offer security analysis.

### Technical Questions

**Q: How do I reindex after making code changes?**

A: Use the `--watch` flag for auto-reindexing, or manually trigger:

```typescript
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
```

**Q: Which languages are supported?**

A: Narsil supports 15 languages: Rust, Python, JavaScript, TypeScript, Go, C, C++, Java, C#, Bash, Ruby, Kotlin, PHP, Swift, and Verilog/SystemVerilog.

**Q: How do I update Narsil to the latest version?**

A:
```bash
cd "${NARSIL_PATH}"
git pull
cargo build --release
```

**Q: Can I use Narsil in the browser?**

A: Yes! Build with `--target wasm32-unknown-unknown --features wasm` for WebAssembly support. The WASM build (~2-3MB) includes multi-language parsing, symbol extraction, and full-text search.

**Q: How does type inference work without mypy/tsc?**

A: Narsil uses data flow analysis to track type flow through variables, analyzing assignments, function calls, and operators to infer types at each program point.

---

## 12. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document                                                           | Purpose                                     |
| ------------------------------------------------------------------ | ------------------------------------------- |
| [SKILL.md](./SKILL.md)                                             | AI agent instructions and workflow guidance |
| [references/tool_reference.md](./references/tool_reference.md)     | Complete documentation for all 76 tools     |
| [references/security_guide.md](./references/security_guide.md)     | Security scanning workflow with checkpoints |
| [references/call_graph_guide.md](./references/call_graph_guide.md) | Call graph analysis guide                   |
| [references/quick_start.md](./references/quick_start.md)           | Getting started in 5 minutes                |
| [assets/tool_categories.md](./assets/tool_categories.md)           | Tool priority categorization                |

### External Resources

| Resource                                                  | Description                    |
| --------------------------------------------------------- | ------------------------------ |
| [Narsil GitHub](https://github.com/postrv/narsil-mcp)     | Source code and documentation  |
| [crates.io](https://crates.io/crates/narsil-mcp)          | Rust package registry          |
| [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) | Underlying parser technology   |
| [Tantivy](https://github.com/quickwit-oss/tantivy)        | Search engine library          |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/)    | Security standard reference    |
| [CWE Top 25](https://cwe.mitre.org/top25/)                | Weakness enumeration reference |

### Related Skills

| Skill                                           | Purpose                                     |
| ----------------------------------------------- | ------------------------------------------- |
| [mcp-code-mode](../mcp-code-mode/README.md)     | Tool orchestration via TypeScript execution |
| [system-spec-kit](../system-spec-kit/README.md) | Context preservation across sessions        |