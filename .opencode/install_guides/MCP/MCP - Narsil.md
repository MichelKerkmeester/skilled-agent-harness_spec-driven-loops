# Narsil MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the Narsil MCP server for deep code intelligence including security scanning, call graph analysis, and structural queries with 76 specialized tools.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Binary**: `${NARSIL_PATH}/target/release/narsil-mcp` | **Access**: Via Code Mode (not standalone)

---

#### TABLE OF CONTENTS

0. [🤖 AI INSTALL GUIDE](#0--ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 0. 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Narsil MCP server for deep code intelligence.

Please help me:
1. Verify I have Rust/Cargo installed (for building) or the pre-built binary
2. Verify Code Mode MCP is installed (Narsil is accessed via Code Mode)
3. Configure Narsil in .utcp_config.json for Code Mode access
4. Verify the installation with tool discovery
5. Run a basic project structure query

My project to analyze is located at: [your project path]
My Narsil binary is at: [path to narsil-mcp binary, or "need to build"]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify Rust/Cargo or locate pre-built binary
- Ensure Code Mode MCP is properly installed
- Configure Narsil in `.utcp_config.json`
- Verify tool discovery via Code Mode
- Test with a basic structural query
- Show you how to use security scanning and call graph tools

**Expected setup time:** 5-10 minutes (binary exists) or 15-20 minutes (building from source)

---

## 1. 📖 OVERVIEW

Narsil is a Rust-powered MCP server providing **76 specialized tools** for deep code intelligence including **structural analysis**, **security scanning**, and **neural semantic search**.

### Source Repository

| Property       | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| **GitHub**     | [postrv/narsil-mcp](https://github.com/postrv/narsil-mcp)  |
| **Language**   | Rust                                                       |
| **Binary**     | `narsil-mcp` (pre-built or cargo build)                    |
| **License**    | MIT                                                        |
| **Tool Count** | 76 tools                                                   |

### Core Principle

> **Narsil = UNIFIED CODE INTELLIGENCE**
>
> Use Narsil for:
> - **Structure**: "List all functions", "Show call graph"
> - **Security**: "Scan for vulnerabilities", "Check OWASP compliance"
> - **Semantics**: "How does authentication work?" (with --neural flag)

### Key Features

| Feature                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| **Security Scanning**     | OWASP Top 10, CWE Top 25, taint analysis            |
| **Call Graph Analysis**   | CFG, DFG, callers/callees, function hotspots        |
| **Structural Queries**    | Find symbols, definitions, references               |
| **Supply Chain Security** | SBOM generation, CVE checking, license compliance   |
| **Git Integration**       | Blame, history, hotspots, contributors              |
| **Code Quality**          | Dead code detection, complexity metrics             |
| **76 Tools**              | Comprehensive coverage for code intelligence        |
| **Via Code Mode**         | Token-efficient access (~700 tokens vs ~6,000-8,000)|

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Agent (Claude Code, OpenCode, VS Code Copilot)              │
│                                                                 │
│  Sees: Only 4 tools in context (~1.6k tokens)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • call_tool_chain   (Execute TypeScript)                  │  │
│  │ • search_tools      (Progressive discovery)               │  │
│  │ • list_tools        (List all available)                  │  │
│  │ • tool_info         (Get tool interface)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ TypeScript Code
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP Server (V8 Isolate Sandbox)                      │
│  • Executes TypeScript with tool access                         │
│  • Routes calls to appropriate MCP servers                      │
│  • Returns results + logs                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Tool Calls
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Narsil MCP Server (Rust)                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    76 Analysis Tools                       │  │
│  │  Security | Call Graph | Symbols | Quality | Git | SBOM   │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Core Components                         │  │
│  │  AST Parser | Taint Tracker | Index Manager | Git Backend │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Project Repository                          │
│  Source files | Git history | Dependencies | Config              │
└─────────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature            | Narsil            | Grep/Ripgrep |
| ------------------ | ----------------- | ------------ |
| **Query Type**     | Structural + Semantic | Lexical  |
| **Security Scan**  | Yes (OWASP/CWE)   | No           |
| **Call Graph**     | Yes               | No           |
| **Find Symbols**   | Yes               | Pattern only |
| **Meaning Search** | Yes (with --neural) | No         |
| **Dead Code**      | Yes               | No           |
| **SBOM/CVE**       | Yes               | No           |

### Tool Categories Summary

| Category               | Tool Count | Key Tools                                    |
| ---------------------- | ---------- | -------------------------------------------- |
| **Security**           | 9          | scan_security, check_owasp_top10, trace_taint|
| **Call Graph**         | 6          | get_call_graph, get_callers, get_callees     |
| **Symbols/Navigation** | 7          | find_symbols, get_symbol_definition          |
| **Repository/Files**   | 8          | get_project_structure, get_file, reindex     |
| **Supply Chain**       | 4          | generate_sbom, check_dependencies            |
| **Code Quality**       | 5          | find_dead_code, get_complexity               |
| **Data Flow**          | 4          | get_data_flow, find_uninitialized            |
| **Git**                | 10         | get_blame, get_hotspots, get_contributors    |
| **Other**              | 23         | Type inference, chunking, metrics            |

---

## 2. 📋 PREREQUISITES

**Phase 1** focuses on verifying required dependencies.

### Required Software

1. **Code Mode MCP** (MANDATORY - Narsil is accessed via Code Mode)
   ```bash
   # Verify Code Mode is installed
   which npx && npx utcp-mcp --help
   ```
   
   If not installed, see [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) first.

2. **Narsil Binary** (one of the following):
   
   **Option A: Pre-built binary exists**
   ```bash
   # Check if binary exists at expected location
   ls -la "${NARSIL_PATH}/target/release/narsil-mcp"
   ```
   
   **Option B: Build from source** (requires Rust)
   ```bash
   # Check Rust is installed
   rustc --version
   cargo --version
   
   # If not installed:
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```

### Actions

1. **Locate or Build Narsil Binary**

   **If binary exists:**
   ```bash
   # Verify binary works
   "${NARSIL_PATH}/target/release/narsil-mcp" --version
   ```
   
   **If building from source:**
   ```bash
   # Clone repository
   git clone https://github.com/postrv/narsil-mcp.git
   cd narsil-mcp
   
   # Build release binary (takes 5-10 minutes)
   cargo build --release
   
   # Verify build
   ./target/release/narsil-mcp --version
   ```

2. **Verify Code Mode is Working**
   ```bash
   # Code Mode should be able to discover tools
   # This will be verified in the Configuration section
   ```

### Validation: `prerequisites_complete`

**Checklist:**
- [ ] Code Mode MCP is installed and working
- [ ] Narsil binary exists and runs without error
- [ ] `narsil-mcp --version` returns version info

**Quick Verification:**
```bash
# Check Code Mode
npx utcp-mcp --help >/dev/null 2>&1 && echo "Code Mode: PASS" || echo "Code Mode: FAIL"

# Check Narsil binary (update path as needed)
test -x "${NARSIL_PATH}/target/release/narsil-mcp" && echo "Narsil Binary: PASS" || echo "Narsil Binary: FAIL"
```

**STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Code Mode not installed → See [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)
- Narsil binary missing → Build from source or download release
- Rust not installed → `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

---

## 3. 📥 INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Configure)**.

### Step 1: Locate Your Narsil Binary

Find or note the full path to your Narsil binary:

```bash
# Example location (update for your system)
NARSIL_BINARY="/Users/YOUR_USERNAME/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp"

# Verify it exists
ls -la "$NARSIL_BINARY"
```

### Step 2: Verify Binary Execution

```bash
# Check version
"$NARSIL_BINARY" --version

# Check help
"$NARSIL_BINARY" --help
```

### Validation: `binary_ready`

**Checklist:**
- [ ] Binary path is known and accessible
- [ ] `narsil-mcp --version` works
- [ ] `narsil-mcp --help` shows available flags

**Quick Verification:**
```bash
"${NARSIL_PATH}/target/release/narsil-mcp" --version && echo "PASS" || echo "FAIL"
```

**STOP if validation fails** - Fix before continuing.

---

## 4. ⚙️ CONFIGURATION

Connect Narsil to Code Mode for AI assistant access.

### IMPORTANT: Narsil Uses Code Mode (Not Standalone MCP)

Unlike Sequential Thinking (which uses native MCP), Narsil is **NOT** configured in `opencode.json` directly. Instead, it's configured in `.utcp_config.json` for Code Mode access.

This provides:
- Token efficiency (~700 tokens vs ~6,000-8,000 native)
- Unified tool orchestration
- TypeScript-based invocation

### Step 1: Create/Update .utcp_config.json

Add Narsil to your project's `.utcp_config.json`:

```json
{
  "name": "narsil",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "narsil": {
        "transport": "stdio",
        "command": "/Users/YOUR_USERNAME/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp",
        "args": [
          "--repos", "${workspaceFolder}",
          "--git",
          "--call-graph",
          "--persist",
          "--watch"
        ]
      }
    }
  }
}
```

**Replace:**
- `YOUR_USERNAME` with your actual username
- Path with your actual Narsil binary location

### Configuration Flags Reference

| Flag              | Purpose                                      | Recommended |
| ----------------- | -------------------------------------------- | ----------- |
| `--repos`         | Repository paths to index                    | Yes         |
| `--git`           | Enable git integration (blame, history)      | Yes         |
| `--call-graph`    | Enable call graph analysis                   | Yes         |
| `--persist`       | Save index to disk (faster restarts)         | Yes         |
| `--watch`         | Auto-reindex on file changes                 | Yes         |
| `--neural`        | Enable neural semantic search                | Optional    |
| `--neural-backend`| Backend for embeddings (api or local)        | Optional    |
| `--neural-model`  | Embedding model (e.g., voyage-code-3)        | Optional    |
| `--lsp`           | LSP integration (SKIP - IDE handles)         | No          |
| `--remote`        | Remote repository access (SKIP - local only) | No          |

### Step 2: Verify .utcp_config.json Syntax

```bash
# Validate JSON syntax
python3 -m json.tool < .utcp_config.json > /dev/null && echo "JSON Valid" || echo "JSON Invalid"
```

### Full .utcp_config.json Example

If you have multiple Code Mode tools configured:

```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "/Users/YOUR_USERNAME/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp",
      "args": ["--repos", "${workspaceFolder}", "--git", "--call-graph", "--persist", "--watch"]
    },
    "webflow": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/webflow-mcp"]
    }
  }
}
```

### Neural Semantic Search Configuration (Optional)

To enable neural semantic search capabilities:

```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "/Users/YOUR_USERNAME/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp",
      "args": [
        "--repos", "${workspaceFolder}",
        "--git",
        "--call-graph",
        "--persist",
        "--watch",
        "--neural",
        "--neural-backend", "api",
        "--neural-model", "voyage-code-3"
      ],
      "env": {
        "VOYAGE_API_KEY": "your-voyage-api-key-here"
      }
    }
  }
}
```

**Voyage API Setup:**
1. Get API key from https://www.voyageai.com/
2. Key format: starts with "pa-"
3. Add to env section in `.utcp_config.json`

**Neural Search Usage:**
```typescript
// Semantic search for code meaning
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
```

### Validation: `configuration_complete`

**Checklist:**
- [ ] `.utcp_config.json` exists with valid JSON
- [ ] Narsil server block is present with correct path
- [ ] Binary path matches actual location
- [ ] Username replaced with actual username

**Quick Verification:**
```bash
grep -q "narsil-mcp" .utcp_config.json && python3 -m json.tool < .utcp_config.json >/dev/null 2>&1 && echo "PASS" || echo "FAIL"
```

**STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Invalid JSON → `python3 -m json.tool < .utcp_config.json` to find errors
- Path not found → Update `command` path to actual binary location

---

## 5. ✅ VERIFICATION

Verify Narsil is accessible via Code Mode.

### Step 1: Restart Code Mode / OpenCode

Restart your AI client to reload MCP configurations:

```bash
# For OpenCode - close and reopen
opencode
```

### Step 2: Discover Narsil Tools

Ask your AI assistant or use Code Mode directly:

```typescript
// Discover Narsil tools
search_tools({ task_description: "narsil security scanning" });

// Expected: List of narsil.narsil_* tools
```

Or ask your assistant:
```
Search for available Narsil tools using Code Mode
```

### Step 3: Test Basic Query

```typescript
// Get project structure
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
    return structure;
  `
});
```

Or ask your assistant:
```
Use Narsil via Code Mode to get the project structure
```

### Step 4: Test Security Scan

```typescript
// Basic security scan
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({
      ruleset: "owasp"
    });
    return findings;
  `,
  timeout: 60000
});
```

### Validation: `end_to_end_verification_complete`

**Checklist:**
- [ ] `search_tools()` returns Narsil tools (narsil.narsil_*)
- [ ] `get_project_structure` returns directory tree
- [ ] `find_symbols` returns symbol list
- [ ] `scan_security` runs without error

**Quick Verification via AI:**
Ask your assistant:
```
1. Search for Narsil tools using Code Mode
2. Use Narsil to get the project structure
3. Use Narsil to find all functions in the project
```

**STOP if verification fails** - See Troubleshooting section.

---

## 6. 🚀 USAGE

### Daily Workflow

Narsil is invoked via Code Mode's `call_tool_chain()` function.

**Tool Naming Convention:**
```
narsil.narsil_{tool_name}
```

**Example:**
```typescript
// Correct
await narsil.narsil_scan_security({});
await narsil.narsil_find_symbols({ kind: "function" });

// Incorrect (missing prefix)
await narsil.scan_security({});  // WRONG
```

### Common Workflows

#### Security Audit Workflow

```typescript
// Step 1: Overview scan
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({ ruleset: "owasp" });
    console.log("Total findings:", findings.length);
    return findings;
  `,
  timeout: 120000
});

// Step 2: Check specific vulnerabilities
call_tool_chain({
  code: `
    const injections = await narsil.narsil_find_injection_vulnerabilities({});
    return injections;
  `
});

// Step 3: Trace taint for critical findings
call_tool_chain({
  code: `
    const taint = await narsil.narsil_trace_taint({ source: "user_input" });
    return taint;
  `
});

// Step 4: Generate SBOM
call_tool_chain({
  code: `
    const sbom = await narsil.narsil_generate_sbom({ format: "cyclonedx" });
    return sbom;
  `
});

// Step 5: Check dependencies for CVEs
call_tool_chain({
  code: `
    const cves = await narsil.narsil_check_dependencies({});
    return cves;
  `
});
```

#### Code Understanding Workflow

```typescript
// Step 1: Project overview
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
    return structure;
  `
});

// Step 2: Find key components
call_tool_chain({
  code: `
    const functions = await narsil.narsil_find_symbols({ kind: "function" });
    const classes = await narsil.narsil_find_symbols({ kind: "class" });
    return { functions: functions.length, classes: classes.length };
  `
});

// Step 3: Analyze call graph
call_tool_chain({
  code: `
    const graph = await narsil.narsil_get_call_graph({ function_name: "main" });
    return graph;
  `
});

// Step 4: Find hotspots (central functions)
call_tool_chain({
  code: `
    const hotspots = await narsil.narsil_get_function_hotspots({});
    return hotspots;
  `
});
```

#### Code Quality Workflow

```typescript
// Find dead code
call_tool_chain({
  code: `
    const deadCode = await narsil.narsil_find_dead_code({});
    return deadCode;
  `
});

// Check complexity
call_tool_chain({
  code: `
    const complexity = await narsil.narsil_get_complexity({});
    return complexity;
  `
});

// Find unused assignments
call_tool_chain({
  code: `
    const deadStores = await narsil.narsil_find_dead_stores({});
    return deadStores;
  `
});
```

### When to Use Different Narsil Tools

| Query Type                      | Tool                    | Reason                    |
| ------------------------------- | ----------------------- | ------------------------- |
| "How does authentication work?" | `narsil_neural_search`  | Semantic meaning          |
| "Find code similar to this"     | `narsil_neural_search`  | Vector similarity         |
| "List all auth functions"       | `narsil_find_symbols`   | Structural query          |
| "Scan for SQL injection"        | `narsil_scan_security`  | Security analysis         |
| "Show call graph for login"     | `narsil_get_call_graph` | Code flow                 |
| "Who calls validateUser?"       | `narsil_get_callers`    | Callers analysis          |
| "Find dead code"                | `narsil_find_dead_code` | Unreachable code          |
| "Generate SBOM"                 | `narsil_generate_sbom`  | Supply chain              |

### Reindexing

After significant code changes, trigger a reindex:

```typescript
call_tool_chain({
  code: `
    await narsil.narsil_reindex({});
    return "Reindex triggered";
  `
});
```

> **Note:** With `--watch` flag enabled, Narsil auto-reindexes on file changes.

---

## 7. 🎯 FEATURES

Narsil provides 76 tools organized into categories. This section covers the **39 HIGH priority tools** you'll use most often.

### 7.1 Repository & File Management (8 tools)

| Tool                   | Purpose                          | Example                               |
| ---------------------- | -------------------------------- | ------------------------------------- |
| `list_repos`           | List indexed repositories        | `narsil_list_repos({})`               |
| `get_project_structure`| Directory tree overview          | `narsil_get_project_structure({})`    |
| `get_file`             | Get file contents                | `narsil_get_file({ path: "src/a.ts" })`|
| `get_excerpt`          | Extract code context             | `narsil_get_excerpt({ ... })`         |
| `reindex`              | Trigger re-indexing              | `narsil_reindex({})`                  |
| `discover_repos`       | Auto-discover repositories       | `narsil_discover_repos({})`           |
| `validate_repo`        | Validate repository path         | `narsil_validate_repo({ path: "..." })`|
| `get_index_status`     | Show index statistics            | `narsil_get_index_status({})`         |

**Example - Get Project Structure:**
```typescript
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
    console.log(structure.tree);
    console.log("Files:", structure.file_count);
    return structure;
  `
});
```

### 7.2 Symbol Search & Navigation (7 tools)

| Tool                    | Purpose                          | Example                                    |
| ----------------------- | -------------------------------- | ------------------------------------------ |
| `find_symbols`          | Find functions/classes/structs   | `narsil_find_symbols({ kind: "function" })`|
| `get_symbol_definition` | Get source code for symbol       | `narsil_get_symbol_definition({ name: "main" })`|
| `find_references`       | Find all usages of a symbol      | `narsil_find_references({ name: "auth" })` |
| `get_dependencies`      | Analyze imports                  | `narsil_get_dependencies({ file: "..." })` |
| `workspace_symbol_search`| Fuzzy search across workspace   | `narsil_workspace_symbol_search({ query: "user" })`|
| `find_symbol_usages`    | Cross-file usage analysis        | `narsil_find_symbol_usages({ name: "..." })`|
| `get_export_map`        | Module exports/API discovery     | `narsil_get_export_map({})`                |

**Example - Find All Functions:**
```typescript
call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({ kind: "function" });
    console.log("Found", symbols.length, "functions");
    return symbols.slice(0, 20);  // First 20
  `
});
```

### 7.3 Call Graph Analysis (6 tools)

| Tool                   | Purpose                          | Example                                  |
| ---------------------- | -------------------------------- | ---------------------------------------- |
| `get_call_graph`       | Function relationships           | `narsil_get_call_graph({ function_name: "main" })`|
| `get_callers`          | Who calls this function?         | `narsil_get_callers({ function_name: "auth" })`|
| `get_callees`          | What does this function call?    | `narsil_get_callees({ function_name: "login" })`|
| `find_call_path`       | Path between two functions       | `narsil_find_call_path({ from: "a", to: "b" })`|
| `get_complexity`       | Cyclomatic/cognitive complexity  | `narsil_get_complexity({})`              |
| `get_function_hotspots`| Find central/critical functions  | `narsil_get_function_hotspots({})`       |

**Example - Get Call Graph:**
```typescript
call_tool_chain({
  code: `
    const graph = await narsil.narsil_get_call_graph({
      function_name: "handleSubmit"
    });
    console.log("Nodes:", graph.nodes?.length);
    console.log("Edges:", graph.edges?.length);
    return graph;
  `
});
```

### 7.4 Security - Taint Tracking (4 tools)

| Tool                           | Purpose                          | Example                            |
| ------------------------------ | -------------------------------- | ---------------------------------- |
| `find_injection_vulnerabilities`| SQL/XSS/command injection       | `narsil_find_injection_vulnerabilities({})`|
| `trace_taint`                  | Trace untrusted data flow        | `narsil_trace_taint({ source: "input" })`|
| `get_taint_sources`            | Identify input entry points      | `narsil_get_taint_sources({})`     |
| `get_security_summary`         | Quick risk assessment            | `narsil_get_security_summary({})`  |

**Example - Find Injection Vulnerabilities:**
```typescript
call_tool_chain({
  code: `
    const vulns = await narsil.narsil_find_injection_vulnerabilities({});
    console.log("Found", vulns.length, "potential injection points");
    return vulns;
  `,
  timeout: 60000
});
```

### 7.5 Security - Rules Engine (5 tools)

| Tool                   | Purpose                          | Example                                |
| ---------------------- | -------------------------------- | -------------------------------------- |
| `scan_security`        | Full security scan               | `narsil_scan_security({ ruleset: "owasp" })`|
| `check_owasp_top10`    | OWASP Top 10 compliance          | `narsil_check_owasp_top10({})`         |
| `check_cwe_top25`      | CWE Top 25 compliance            | `narsil_check_cwe_top25({})`           |
| `explain_vulnerability`| Get detailed vulnerability info  | `narsil_explain_vulnerability({ id: "..." })`|
| `suggest_fix`          | Get remediation guidance         | `narsil_suggest_fix({ vulnerability_id: "..." })`|

**Example - OWASP Security Scan:**
```typescript
call_tool_chain({
  code: `
    const findings = await narsil.narsil_scan_security({
      ruleset: "owasp"
    });
    
    // Group by severity
    const critical = findings.filter(f => f.severity === "critical");
    const high = findings.filter(f => f.severity === "high");
    
    console.log("Critical:", critical.length);
    console.log("High:", high.length);
    return { critical, high };
  `,
  timeout: 120000
});
```

### 7.6 Supply Chain Security (4 tools)

| Tool                | Purpose                          | Example                                  |
| ------------------- | -------------------------------- | ---------------------------------------- |
| `generate_sbom`     | Generate Software Bill of Materials| `narsil_generate_sbom({ format: "cyclonedx" })`|
| `check_dependencies`| Check for known CVEs             | `narsil_check_dependencies({})`          |
| `check_licenses`    | License compliance verification  | `narsil_check_licenses({})`              |
| `find_upgrade_path` | Find safe upgrade path           | `narsil_find_upgrade_path({ package: "..." })`|

**Example - Generate SBOM:**
```typescript
call_tool_chain({
  code: `
    const sbom = await narsil.narsil_generate_sbom({
      format: "cyclonedx"
    });
    console.log("Components:", sbom.components?.length);
    return sbom;
  `
});
```

### 7.7 Control Flow & Code Quality (4 tools)

| Tool             | Purpose                          | Example                        |
| ---------------- | -------------------------------- | ------------------------------ |
| `get_control_flow`| CFG basic blocks analysis       | `narsil_get_control_flow({ function: "..." })`|
| `find_dead_code` | Find unreachable code            | `narsil_find_dead_code({})`    |
| `find_dead_stores`| Find unused assignments         | `narsil_find_dead_stores({})`  |
| `find_uninitialized`| Find uninitialized variables  | `narsil_find_uninitialized({})`|

**Example - Find Dead Code:**
```typescript
call_tool_chain({
  code: `
    const deadCode = await narsil.narsil_find_dead_code({});
    console.log("Found", deadCode.length, "dead code sections");
    return deadCode;
  `
});
```

### 7.8 Type Inference (3 tools)

| Tool                | Purpose                          | Example                          |
| ------------------- | -------------------------------- | -------------------------------- |
| `infer_types`       | Discover types without tooling   | `narsil_infer_types({ file: "..." })`|
| `check_type_errors` | Quick type error detection       | `narsil_check_type_errors({})`   |
| `get_typed_taint_flow`| Type-aware taint analysis      | `narsil_get_typed_taint_flow({})` |

### 7.9 Git Integration (6 HIGH priority tools)

| Tool              | Purpose                          | Example                             |
| ----------------- | -------------------------------- | ----------------------------------- |
| `get_blame`       | Git blame for file/line          | `narsil_get_blame({ file: "..." })` |
| `get_file_history`| Commit history for file          | `narsil_get_file_history({ file: "..." })`|
| `get_recent_changes`| Recent commits                  | `narsil_get_recent_changes({})`     |
| `get_hotspots`    | Churn analysis (risk areas)      | `narsil_get_hotspots({})`           |
| `get_contributors`| Team/author information          | `narsil_get_contributors({})`       |
| `get_commit_diff` | Diff for specific commit         | `narsil_get_commit_diff({ commit: "..." })`|

**Example - Get Hotspots:**
```typescript
call_tool_chain({
  code: `
    const hotspots = await narsil.narsil_get_hotspots({});
    console.log("Top risk files by churn:");
    return hotspots.slice(0, 10);
  `
});
```

---

## 8. 💡 EXAMPLES

### Example 1: Security Audit

**Scenario:** Perform a comprehensive security audit of your codebase.

```typescript
// Step 1: Quick security summary
call_tool_chain({
  code: `
    const summary = await narsil.narsil_get_security_summary({});
    console.log("Risk Level:", summary.overall_risk);
    return summary;
  `
});

// Step 2: Full OWASP scan
call_tool_chain({
  code: `
    const findings = await narsil.narsil_check_owasp_top10({});
    const grouped = {};
    findings.forEach(f => {
      grouped[f.category] = grouped[f.category] || [];
      grouped[f.category].push(f);
    });
    return grouped;
  `,
  timeout: 120000
});

// Step 3: Check for injection vulnerabilities
call_tool_chain({
  code: `
    const injections = await narsil.narsil_find_injection_vulnerabilities({});
    return injections.filter(i => i.confidence > 0.7);
  `
});

// Step 4: Trace taint for user inputs
call_tool_chain({
  code: `
    const taint = await narsil.narsil_trace_taint({});
    return taint;
  `
});

// Step 5: Check dependencies for CVEs
call_tool_chain({
  code: `
    const deps = await narsil.narsil_check_dependencies({});
    const vulnerable = deps.filter(d => d.vulnerabilities?.length > 0);
    return vulnerable;
  `
});

// Step 6: Generate SBOM for compliance
call_tool_chain({
  code: `
    const sbom = await narsil.narsil_generate_sbom({ format: "cyclonedx" });
    return { component_count: sbom.components?.length };
  `
});
```

### Example 2: Understanding New Codebase

**Scenario:** Quickly understand the structure and key components of a new project.

```typescript
// Step 1: Get project structure
call_tool_chain({
  code: `
    const structure = await narsil.narsil_get_project_structure({});
    return structure;
  `
});

// Step 2: Find all classes and functions
call_tool_chain({
  code: `
    const classes = await narsil.narsil_find_symbols({ kind: "class" });
    const functions = await narsil.narsil_find_symbols({ kind: "function" });
    return {
      class_count: classes.length,
      function_count: functions.length,
      classes: classes.slice(0, 20),
      functions: functions.slice(0, 20)
    };
  `
});

// Step 3: Find hotspot functions (most connected)
call_tool_chain({
  code: `
    const hotspots = await narsil.narsil_get_function_hotspots({});
    console.log("Key functions to understand:");
    return hotspots.slice(0, 10);
  `
});

// Step 4: Analyze main entry point call graph
call_tool_chain({
  code: `
    const graph = await narsil.narsil_get_call_graph({ function_name: "main" });
    return graph;
  `
});

// Step 5: Use neural search for semantic understanding
call_tool_chain({
  code: `
    const results = await narsil.narsil_neural_search({
      query: "How does authentication work?"
    });
    return results;
  `
});
```

### Example 3: Code Quality Review

**Scenario:** Identify code quality issues and refactoring candidates.

```typescript
// Step 1: Find dead code
call_tool_chain({
  code: `
    const dead = await narsil.narsil_find_dead_code({});
    return dead;
  `
});

// Step 2: Find unused variables/assignments
call_tool_chain({
  code: `
    const deadStores = await narsil.narsil_find_dead_stores({});
    return deadStores;
  `
});

// Step 3: Get complexity metrics
call_tool_chain({
  code: `
    const complexity = await narsil.narsil_get_complexity({});
    const highComplexity = complexity.filter(c => c.cyclomatic > 10);
    console.log("High complexity functions:", highComplexity.length);
    return highComplexity;
  `
});

// Step 4: Find uninitialized variables
call_tool_chain({
  code: `
    const uninit = await narsil.narsil_find_uninitialized({});
    return uninit;
  `
});

// Step 5: Check for circular imports
call_tool_chain({
  code: `
    const circular = await narsil.narsil_find_circular_imports({});
    return circular;
  `
});
```

### Example 4: Impact Analysis

**Scenario:** Understand the impact of changing a specific function.

```typescript
// Step 1: Find all callers
call_tool_chain({
  code: `
    const callers = await narsil.narsil_get_callers({
      function_name: "validateUser"
    });
    console.log("Functions that call validateUser:", callers.length);
    return callers;
  `
});

// Step 2: Find what it calls
call_tool_chain({
  code: `
    const callees = await narsil.narsil_get_callees({
      function_name: "validateUser"
    });
    console.log("Functions called by validateUser:", callees.length);
    return callees;
  `
});

// Step 3: Find all references
call_tool_chain({
  code: `
    const refs = await narsil.narsil_find_references({
      name: "validateUser"
    });
    return refs;
  `
});

// Step 4: Get git blame/history
call_tool_chain({
  code: `
    const history = await narsil.narsil_get_file_history({
      file: "src/auth/validate.ts"
    });
    return history.slice(0, 10);
  `
});
```

---

## 9. 🔧 TROUBLESHOOTING

### Common Errors

**"Tool not found: narsil.narsil_*"**
- **Cause:** Narsil not configured in `.utcp_config.json` or Code Mode not restarted.
- **Fix:**
  1. Verify `.utcp_config.json` has narsil configuration
  2. Restart OpenCode/Code Mode
  3. Use `search_tools({ task_description: "narsil" })` to verify

**"spawn ENOENT" or binary not found**
- **Cause:** Narsil binary path incorrect in configuration.
- **Fix:**
  ```bash
  # Find actual binary location
  find ~ -name "narsil-mcp" -type f 2>/dev/null | head -5
  
  # Update .utcp_config.json with correct path
  ```

**"Empty results from find_symbols"**
- **Cause:** Repository not indexed or wrong path.
- **Fix:**
  ```typescript
  // Check index status
  call_tool_chain({
    code: `
      const status = await narsil.narsil_get_index_status({});
      return status;
    `
  });
  
  // Trigger reindex
  call_tool_chain({
    code: `await narsil.narsil_reindex({})`
  });
  ```

**"Timeout during security scan"**
- **Cause:** Large codebase or complex analysis.
- **Fix:**
  ```typescript
  // Increase timeout (up to 120 seconds)
  call_tool_chain({
    code: `await narsil.narsil_scan_security({ ruleset: "owasp" })`,
    timeout: 120000
  });
  ```

**"Missing narsil_ prefix error"**
- **Cause:** Incorrect tool naming.
- **Fix:**
  ```typescript
  // WRONG
  await narsil.scan_security({});
  
  // CORRECT
  await narsil.narsil_scan_security({});
  ```

**"Code Mode search_tools doesn't find Narsil"**
- **Cause:** `.utcp_config.json` not loaded or invalid.
- **Fix:**
  1. Validate JSON: `python3 -m json.tool < .utcp_config.json`
  2. Check file is in project root
  3. Restart OpenCode completely
  4. Try `list_tools()` to see all available tools

**"Index out of date / stale results"**
- **Cause:** Files changed but index not updated.
- **Fix:**
  ```typescript
  // Manual reindex
  call_tool_chain({
    code: `await narsil.narsil_reindex({})`
  });
  ```
  Or ensure `--watch` flag is in configuration for auto-reindex.

### Diagnostic Commands

```typescript
// Check if Narsil is accessible
search_tools({ task_description: "narsil" });

// Get index status
call_tool_chain({
  code: `return await narsil.narsil_get_index_status({})`
});

// List indexed repos
call_tool_chain({
  code: `return await narsil.narsil_list_repos({})`
});

// Get tool info
tool_info({ tool_name: "narsil.narsil_scan_security" });
```

---

## 10. 📚 RESOURCES

### File Locations

| Path                                 | Purpose                          |
| ------------------------------------ | -------------------------------- |
| `${NARSIL_PATH}/target/release/narsil-mcp` | Narsil binary                    |
| `.utcp_config.json`                  | Code Mode configuration          |
| `opencode.json`                      | OpenCode MCP configuration       |
| `.opencode/skill/mcp-narsil/`        | Narsil skill documentation       |

### Tool Naming Convention

All Narsil tools follow this pattern when called via Code Mode:

```
narsil.narsil_{tool_name}
```

Examples:
- `narsil.narsil_scan_security({})`
- `narsil.narsil_find_symbols({ kind: "function" })`
- `narsil.narsil_get_call_graph({ function_name: "main" })`

### Quick Reference - Top 20 Tools

| Tool                           | Purpose                          |
| ------------------------------ | -------------------------------- |
| `narsil_get_project_structure` | Directory tree overview          |
| `narsil_find_symbols`          | Find functions/classes           |
| `narsil_scan_security`         | Full security scan               |
| `narsil_check_owasp_top10`     | OWASP compliance check           |
| `narsil_find_injection_vulnerabilities` | SQL/XSS/injection detection |
| `narsil_trace_taint`           | Trace untrusted data flow        |
| `narsil_get_call_graph`        | Function relationships           |
| `narsil_get_callers`           | Who calls this function?         |
| `narsil_get_callees`           | What does this call?             |
| `narsil_find_dead_code`        | Unreachable code detection       |
| `narsil_get_complexity`        | Complexity metrics               |
| `narsil_generate_sbom`         | Software Bill of Materials       |
| `narsil_check_dependencies`    | CVE vulnerability check          |
| `narsil_get_blame`             | Git blame                        |
| `narsil_get_hotspots`          | High-churn files                 |
| `narsil_reindex`               | Trigger re-indexing              |
| `narsil_get_symbol_definition` | Get source code for symbol       |
| `narsil_find_references`       | Find all usages                  |
| `narsil_get_security_summary`  | Quick risk assessment            |
| `narsil_check_licenses`        | License compliance               |

### Configuration Templates

**Minimal .utcp_config.json:**
```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "/path/to/narsil-mcp",
      "args": ["--repos", "${workspaceFolder}"]
    }
  }
}
```

**Recommended .utcp_config.json:**
```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "/path/to/narsil-mcp",
      "args": [
        "--repos", "${workspaceFolder}",
        "--git",
        "--call-graph",
        "--persist",
        "--watch"
      ]
    }
  }
}
```

### External Resources

- **GitHub Repository**: https://github.com/postrv/narsil-mcp
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **CycloneDX SBOM**: https://cyclonedx.org/
- **MCP Protocol**: https://modelcontextprotocol.io

### Related Skills

| Skill             | Relationship                                       |
| ----------------- | -------------------------------------------------- |
| `mcp-code-mode`   | Narsil accessed via Code Mode                      |
| `system-spec-kit` | Save security findings for future sessions         |

### Optional Flags

| Flag       | Purpose                                          | When to Use                           |
| ---------- | ------------------------------------------------ | ------------------------------------- |
| `--neural` | Enable neural semantic search (Voyage AI)        | If you need semantic code search      |
| `--lsp`    | IDE provides LSP features natively               | Skip - IDE handles this               |
| `--remote` | Not needed for local development                 | Skip - local only                     |

---

### Quick Start Summary

```bash
# 1. Prerequisites
# - Ensure Code Mode is installed
# - Ensure Narsil binary exists

# 2. Configure .utcp_config.json
cat > .utcp_config.json << 'EOF'
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "/path/to/narsil-mcp",
      "args": ["--repos", "${workspaceFolder}", "--git", "--call-graph", "--persist", "--watch"]
    }
  }
}
EOF

# 3. Restart OpenCode

# 4. Verify via AI
# "Use Code Mode to search for Narsil tools"
# "Use Narsil to get the project structure"
```

---

**Installation Complete!**

You now have Narsil MCP configured and accessible via Code Mode. Use it for:
- **Security scanning**: `narsil_scan_security`, `narsil_check_owasp_top10`
- **Code structure**: `narsil_find_symbols`, `narsil_get_call_graph`
- **Code quality**: `narsil_find_dead_code`, `narsil_get_complexity`
- **Supply chain**: `narsil_generate_sbom`, `narsil_check_dependencies`

**Remember**: Narsil provides unified code intelligence - STRUCTURE, SECURITY, and SEMANTICS.

For semantic code search ("How does X work?"), use `narsil.narsil_neural_search()` with the neural backend enabled.

For more information, refer to:
- Skill documentation: `.opencode/skill/mcp-narsil/SKILL.md`
- GitHub repository: https://github.com/postrv/narsil-mcp
