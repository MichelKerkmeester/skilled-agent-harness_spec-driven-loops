# Narsil MCP Server Installation Guide (Code Mode Provider)

Complete installation and configuration guide for Narsil MCP as a **Code Mode provider**, providing deep code intelligence through 90 specialized tools. Covers semantic search (neural embeddings for meaning-based queries), structural analysis (AST-based symbol and definition queries), security scanning (OWASP, CWE, taint analysis), and call graph visualization.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Binary**: `narsil-mcp` (installed via brew/npm/scoop/cargo) | **Access**: **Via Code Mode (ONLY)** - not standalone

---

## Table of Contents

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-configuration)
5. [🌐 HTTP SERVER & VISUALIZATION](#5--http-server--visualization)
6. [✅ VERIFICATION](#6--verification)
7. [🚀 USAGE](#7--usage)
8. [🎯 FEATURES](#8--features)
9. [💡 EXAMPLES](#9--examples)
10. [🔧 TROUBLESHOOTING](#10--troubleshooting)
11. [📚 RESOURCES](#11--resources)

---

## 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Narsil MCP server for deep code intelligence.

Please help me:
1. Verify Code Mode MCP is installed (Narsil is accessed via Code Mode)
2. Install Narsil using the best method for my platform
3. Run the config wizard: narsil-mcp config init --neural
4. Configure Narsil in .utcp_config.json for Code Mode access
5. Verify the installation with tool discovery
6. Run a basic project structure query

My platform is: [macOS / Windows / Linux / Arch Linux]
My project to analyze is located at: [your project path]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Ensure Code Mode MCP is properly installed
- Install Narsil via the recommended method for your platform (Homebrew, Scoop, npm, etc.)
- Run the interactive config wizard with neural search
- Configure Narsil in `.utcp_config.json`
- Verify tool discovery via Code Mode
- Test with a basic structural query
- Show you how to use security scanning and call graph tools

**Expected setup time:** 5-10 minutes

---

## ⚠️ IMPORTANT: Code Mode Provider

**Narsil MCP is accessed through Code Mode, not called directly.**

This means:

| Aspect             | What This Means                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Configuration**  | Narsil is configured in `.utcp_config.json`, NOT `opencode.json`                         |
| **Access Method**  | All 90 Narsil tools are accessed via Code Mode's `call_tool_chain()`                     |
| **Prerequisite**   | Code Mode MCP must be installed first ([MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)) |
| **Context Cost**   | AI sees only 4 Code Mode tools (~1.6k tokens), not 90 Narsil tools                       |
| **Naming Pattern** | Tools use pattern: `narsil.narsil_{tool_name}`                                           |

**Why Code Mode?** Narsil's 90 tools would consume ~270k tokens if exposed natively. Code Mode provides on-demand access with 99% context reduction.

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client (Claude Code, OpenCode, VS Code)                │
│  └─► Sees: 4 Code Mode tools (call_tool_chain, search_tools...) │
│      └─► NOT 90 Narsil tools directly                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ call_tool_chain({ code: `narsil.narsil_scan_security(...)` })
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Code Mode MCP (configured in opencode.json)                     │
│  └─► Reads .utcp_config.json for Narsil provider definition       │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Narsil Provider (configured in .utcp_config.json)                │
│  └─► 90 tools accessible via narsil.narsil_{tool_name}          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. 📖 OVERVIEW

Narsil is a Rust-powered MCP server providing **90 specialized tools** for deep code intelligence including **structural analysis**, **security scanning**, and **neural semantic search**.

### Source Repository

| Property        | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **GitHub**      | [postrv/narsil-mcp](https://github.com/postrv/narsil-mcp) |
| **Language**    | Rust                                                      |
| **Binary**      | `narsil-mcp`                                              |
| **Install**     | Homebrew, Scoop, npm, Cargo, AUR, one-click scripts       |
| **License**     | MIT                                                       |
| **Tool Count**  | 90 tools                                                  |
| **Config Wizard** | `narsil-mcp config init --neural`                       |

### Core Principle

> **Narsil = UNIFIED CODE INTELLIGENCE**
>
> Use Narsil for:
> - **Structure**: "List all functions", "Show call graph"
> - **Security**: "Scan for vulnerabilities", "Check OWASP compliance"
> - **Semantics**: "How does authentication work?" (with --neural flag)

### Key Features

| Feature                   | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| **Security Scanning**     | OWASP Top 10, CWE Top 25, taint analysis             |
| **Call Graph Analysis**   | CFG, DFG, callers/callees, function hotspots         |
| **Structural Queries**    | Find symbols, definitions, references                |
| **Supply Chain Security** | SBOM generation, CVE checking, license compliance    |
| **Git Integration**       | Blame, history, hotspots, contributors               |
| **Code Quality**          | Dead code detection, complexity metrics              |
| **90 Tools**              | Comprehensive coverage for code intelligence         |
| **Via Code Mode**         | Token-efficient access (~700 tokens vs ~6,000-8,000) |

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
│  │                    90 Analysis Tools                      │  │
│  │  Security | Call Graph | Symbols | Quality | Git | SBOM   │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Core Components                        │  │
│  │  AST Parser | Taint Tracker | Index Manager | Git Backend │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Project Repository                         │
│  Source files | Git history | Dependencies | Config               │
└─────────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature            | Narsil                | Grep/Ripgrep |
| ------------------ | --------------------- | ------------ |
| **Query Type**     | Structural + Semantic | Lexical      |
| **Security Scan**  | Yes (OWASP/CWE)       | No           |
| **Call Graph**     | Yes                   | No           |
| **Find Symbols**   | Yes                   | Pattern only |
| **Meaning Search** | Yes (with --neural)   | No           |
| **Dead Code**      | Yes                   | No           |
| **SBOM/CVE**       | Yes                   | No           |

### Tool Categories Summary

| Category               | Tool Count | Key Tools                                     |
| ---------------------- | ---------- | --------------------------------------------- |
| **Security**           | 9          | scan_security, check_owasp_top10, trace_taint |
| **Call Graph**         | 6          | get_call_graph, get_callers, get_callees      |
| **Symbols/Navigation** | 7          | find_symbols, get_symbol_definition           |
| **Repository/Files**   | 8          | get_project_structure, get_file, reindex      |
| **Supply Chain**       | 4          | generate_sbom, check_dependencies             |
| **Code Quality**       | 5          | find_dead_code, get_complexity                |
| **Data Flow**          | 4          | get_data_flow, find_uninitialized             |
| **Git**                | 10         | get_blame, get_hotspots, get_contributors     |
| **Other**              | 23         | Type inference, chunking, metrics             |

---

## 2. 📋 PREREQUISITES

**Phase 1** focuses on verifying required dependencies.

### Required Software

1. **Code Mode MCP** (MANDATORY - Narsil is accessed via Code Mode)
   ```bash
   # Verify Code Mode is installed
   which npx && npx @utcp/code-mode-mcp --help
   ```
   
   If not installed, see [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) first.

2. **Node.js 18+** (for npm installation method)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

### Validation: `prerequisites_complete`

**Checklist:**
- [ ] Code Mode MCP is installed and working
- [ ] Node.js 18+ installed (for npm method) OR package manager available (brew/scoop/cargo)

**Quick Verification:**
```bash
# Check Code Mode
npx @utcp/code-mode-mcp --help >/dev/null 2>&1 && echo "Code Mode: PASS" || echo "Code Mode: FAIL"

# Check Node.js version
node --version
```

**STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Code Mode not installed → See [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)
- Node.js outdated → Install Node.js 18+ from https://nodejs.org/

---

## 3. 📥 INSTALLATION

Narsil offers **7 installation methods** to suit different platforms and preferences.

### Installation Methods Overview

| Method | Command | Platform | Best For |
|--------|---------|----------|----------|
| **Homebrew** | `brew tap postrv/narsil && brew install narsil-mcp` | macOS, Linux | Mac users |
| **Scoop** | `scoop bucket add narsil https://github.com/postrv/scoop-narsil && scoop install narsil-mcp` | Windows | Windows users |
| **npm** | `npm install -g narsil-mcp` | All | Cross-platform simplicity |
| **Cargo** | `cargo install narsil-mcp` | All | Rust developers |
| **AUR** | `yay -S narsil-mcp-bin` | Arch Linux | Arch users |
| **One-click (Unix)** | `curl -fsSL https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.sh \| bash` | macOS, Linux | Quick setup |
| **One-click (Windows)** | `irm https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.ps1 \| iex` | Windows | Quick setup |

### Method 1: Homebrew (macOS/Linux) - RECOMMENDED for Mac

```bash
# Add the Narsil tap and install
brew tap postrv/narsil
brew install narsil-mcp

# Verify installation
narsil-mcp --version
```

### Method 2: Scoop (Windows) - RECOMMENDED for Windows

```powershell
# Add the Narsil bucket and install
scoop bucket add narsil https://github.com/postrv/scoop-narsil
scoop install narsil-mcp

# Verify installation
narsil-mcp --version
```

### Method 3: npm (All Platforms) - RECOMMENDED for Cross-Platform

```bash
# Install globally via npm
npm install -g narsil-mcp

# Verify installation
narsil-mcp --version
```

### Method 4: Cargo (Rust Developers)

```bash
# Requires Rust toolchain
# Install Rust first if needed: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

cargo install narsil-mcp

# Verify installation
narsil-mcp --version
```

### Method 5: AUR (Arch Linux)

```bash
# Using yay (or paru, etc.)
yay -S narsil-mcp-bin

# Verify installation
narsil-mcp --version
```

### Method 6: One-Click Install (macOS/Linux)

```bash
# Downloads and installs automatically
curl -fsSL https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.sh | bash

# Verify installation
narsil-mcp --version
```

### Method 7: One-Click Install (Windows PowerShell)

```powershell
# Downloads and installs automatically
irm https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.ps1 | iex

# Verify installation
narsil-mcp --version
```

### Interactive Config Wizard

After installation, use the interactive config wizard to set up Narsil:

```bash
# Interactive setup with automatic editor detection
narsil-mcp config init

# With neural search enabled (requires Voyage API key)
narsil-mcp config init --neural
```

The wizard automatically detects and configures:
- Zed
- VS Code
- Claude Desktop
- Other MCP-compatible editors

### Validation: `binary_ready`

**Checklist:**
- [ ] Narsil installed via one of the 7 methods
- [ ] `narsil-mcp --version` returns version info
- [ ] `narsil-mcp --help` shows available flags

**Quick Verification:**
```bash
narsil-mcp --version && echo "PASS" || echo "FAIL"
```

**STOP if validation fails** - Try a different installation method.

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
        "command": "narsil-mcp",
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

**Note**: 
- Use `narsil-mcp` if installed via Homebrew/npm, or full path to binary
- `--watch` enables auto-reindexing when files change
- `--http --http-port 3000` can be added for visualization UI (optional)

### Configuration Flags Reference

| Flag               | Purpose                                      | Recommended |
| ------------------ | -------------------------------------------- | ----------- |
| `--repos`          | Repository paths to index                    | Yes         |
| `--git`            | Enable git integration (blame, history)      | Yes         |
| `--call-graph`     | Enable call graph analysis                   | Yes         |
| `--persist`        | Save index to disk (faster restarts)         | Yes         |
| `--watch`          | Auto-reindex when files change               | Yes         |
| `--index-path`     | Custom index storage location                | Yes         |
| `--preset`         | Tool preset (see Presets section below)      | Optional    |
| `--http`           | Enable visualization UI at localhost:3000    | Optional    |
| `--http-port`      | Port for visualization UI (default: 3000)    | Optional    |
| `--neural`         | Enable neural semantic search                | Optional    |
| `--neural-backend` | Backend for embeddings (api or local)        | Optional    |
| `--neural-model`   | Embedding model (voyage-code-2 for Narsil)   | Optional    |
| `--lsp`            | LSP integration (SKIP - IDE handles)         | No          |
| `--remote`         | Remote repository access (SKIP - local only) | No          |

### Presets

Narsil provides 4 presets to balance tool availability vs. startup time:

| Preset              | Tools | Use Case                                    |
| ------------------- | ----- | ------------------------------------------- |
| `--preset minimal`  | 26    | Fast startup, lightweight editors           |
| `--preset balanced` | 51    | General development, daily use              |
| `--preset full`     | 90    | Comprehensive analysis, Claude Desktop      |
| `--preset security-focused` | ~40 | Security-focused workflows, audits   |

**Example with preset:**
```json
{
  "narsil": {
    "transport": "stdio",
    "command": "narsil-mcp",
    "args": ["--repos", ".", "--preset", "full", "--persist"]
  }
}
```

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
      "command": "narsil-mcp",
      "args": ["--repos", ".", "--preset", "full", "--index-path", ".narsil-index", "--git", "--call-graph", "--persist"]
    },
    "webflow": {
      "transport": "stdio",
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.webflow.com/sse"]
    }
  }
}
```

> **Architecture Note**: The `--http` flag enables a visualization web UI, NOT HTTP transport for MCP. MCP communication is always via stdio.

## Index Persistence

Narsil supports persisting the code index to disk for faster startup on subsequent sessions.

### Configuration

| Flag           | Purpose                               | Default                |
| -------------- | ------------------------------------- | ---------------------- |
| `--persist`    | Enable saving/loading index from disk | Disabled               |
| `--index-path` | Custom index storage location         | `~/.cache/narsil-mcp/` |

### Project-Local Indexes (Recommended)

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

### How Persistence Works

1. **On startup**: Loads existing index from disk (if available)
2. **After --reindex**: Automatically saves index to disk
3. **Manual save**: Use `save_index` MCP tool via Code Mode
4. **Watch mode**: Saves after detecting file changes

### Manual Index Building

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

### New MCP Tool: save_index

Manually trigger index save via Code Mode:

```javascript
narsil.narsil_save_index({})
```

### Neural Semantic Search Configuration (Optional)

Narsil supports **three neural embedding backends** for semantic code search:

| Backend | Model | API Key Env Var | Dimensions | Best For |
|---------|-------|-----------------|------------|----------|
| **Voyage AI** | `voyage-code-2` | `VOYAGE_API_KEY` | 1536 | Code search (RECOMMENDED) |
| **OpenAI** | `text-embedding-3-small` | `OPENAI_API_KEY` | 1536 | General purpose |
| **Local ONNX** | Built-in | None required | 384 | Offline/privacy |

> **Note on Voyage 4**: While Voyage 4 is available for general text, `voyage-code-2` remains the recommended model for code search as of Jan 2026. You can test `voyage-4` by setting `--neural-model voyage-4`, but verify retrieval quality first.

#### Option 1: Voyage AI (Recommended for Code)

```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "narsil-mcp",
      "args": [
        "--repos", ".",
        "--index-path", ".narsil-index",
        "--git", "--call-graph", "--persist", "--watch",
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
```

**Setup:** Get API key from https://www.voyageai.com/ (key starts with "pa-")

> **⚠️ IMPORTANT: Code Mode Prefixed Variables**
> 
> When using Narsil via Code Mode, you must add a **prefixed** version of the API key to your `.env`:
> ```bash
> # Standard variable
> VOYAGE_API_KEY=pa-your-voyage-key
> 
> # Code Mode prefixed version (REQUIRED)
> narsil_VOYAGE_API_KEY=pa-your-voyage-key
> ```
> 
> Code Mode looks for `{manual_name}_{VARIABLE}` in the environment. Without the prefixed version, you'll see:
> `Error: Variable 'narsil_VOYAGE_API_KEY' not found`

#### Option 2: OpenAI

```json
{
  "args": [
    "--repos", ".",
    "--index-path", ".narsil-index",
    "--git", "--call-graph", "--persist", "--watch",
    "--neural",
    "--neural-backend", "api",
    "--neural-model", "text-embedding-3-small"
  ],
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}"
  }
}
```

**Setup:** Get API key from https://platform.openai.com/api-keys (key starts with "sk-")

#### Option 3: Local ONNX (No API Key Required)

```json
{
  "args": [
    "--repos", ".",
    "--index-path", ".narsil-index",
    "--git", "--call-graph", "--persist", "--watch",
    "--neural",
    "--neural-backend", "onnx"
  ],
  "env": {}
}
```

**No API key needed** - embeddings run locally. Lower quality than cloud options but works offline.

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

### ⚠️ CRITICAL: Config Changes Require Restart

**Code Mode loads `.utcp_config.json` at startup.** Any changes to the Narsil configuration will NOT take effect until you restart OpenCode.

**After editing `.utcp_config.json`:**
1. Save the file
2. Exit OpenCode (Ctrl+C)
3. Restart OpenCode
4. Verify with `code_mode_list_tools()` - should show `narsil.*` tools

**If Narsil still doesn't appear after restart:**
| Issue | Fix |
|-------|-----|
| Extra fields in config | Remove `_note`, `_neural_backends`, `_usage_examples` from mcpServers |
| Relative command path | Use absolute path: `/Users/username/bin/narsil-mcp` |
| Missing transport field | Add `"transport": "stdio"` to the narsil mcpServers config |
| JSON syntax error | Validate: `python3 -m json.tool < .utcp_config.json` |

### Validation: `configuration_complete`

**Checklist:**
- [ ] `.utcp_config.json` exists with valid JSON
- [ ] Narsil server block is present with correct path
- [ ] Binary path matches actual location (use absolute path)
- [ ] No extra fields like `_note` in mcpServers config
- [ ] `transport: "stdio"` is present

**Quick Verification:**
```bash
grep -q "narsil-mcp" .utcp_config.json && python3 -m json.tool < .utcp_config.json >/dev/null 2>&1 && echo "PASS" || echo "FAIL"
```

**STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Invalid JSON → `python3 -m json.tool < .utcp_config.json` to find errors
- Path not found → Update `command` path to actual binary location (use absolute path)
- Narsil not appearing → Restart OpenCode after config changes

---

## 5. 🌐 HTTP SERVER & VISUALIZATION

Narsil includes an HTTP server with a React-based visualization frontend for exploring code graphs interactively. This is optional but useful for understanding code relationships visually.

> **Important Architecture Note**: The `--http` flag enables a **visualization web UI**, NOT HTTP transport for MCP. MCP tool communication is **always via stdio** - Code Mode spawns the Narsil process and communicates via stdin/stdout. The HTTP server runs in parallel on port 3000 for visual exploration of call graphs, import dependencies, and code structure.

### Starting the HTTP Server

**CRITICAL**: The HTTP server requires stdin to stay open. Use this pattern:

```bash
# Backend (port 3000) - MUST use stdin pipe to prevent EOF shutdown
(tail -f /dev/null | narsil-mcp \
  --repos . \
  --index-path .narsil-index \
  --git --call-graph --persist \
  --http --http-port 3000 > /tmp/narsil-http.log 2>&1) &

# Check it's running
curl http://localhost:3000/health
```

**Why the pipe?** MCP servers read from stdin. Without input, they receive EOF and shut down immediately. The `tail -f /dev/null |` keeps stdin open indefinitely.

The HTTP server provides:
- `/health` endpoint for health checks
- API endpoints for graph data (used by frontend)
- Web UI at http://localhost:3000 for interactive visualization

### Starting the Frontend

The visualization frontend is a **separate React application** located in the `frontend/` directory of the Narsil repository:

```bash
# Find Narsil source (if installed from source)
# Common locations: ~/narsil-mcp, ~/MEGA/MCP Servers/narsil-mcp

# Navigate to Narsil frontend directory
cd /path/to/narsil-mcp/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173
```

**Important**: The backend (port 3000) and frontend (port 5173) must both be running for visualization to work.

### Graph Views & Limitations

The visualization supports multiple graph types:

| View     | Purpose                            | Required Parameters | Best For                  |
| -------- | ---------------------------------- | ------------------- | ------------------------- |
| `import` | Module import/export relationships | None                | JavaScript/TypeScript     |
| `call`   | Function call relationships        | None                | Rust, Python (limited JS) |
| `symbol` | Symbol definitions and references  | **`root` (function name)** | All languages     |
| `hybrid` | Combined import + call graph       | **`repo`**          | Comprehensive analysis    |
| `flow`   | Data flow visualization            | None                | Security analysis         |

**Known Frontend Issues:**
- **Symbol view**: Shows "Symbol view requires a root" - you must enter a function name in the Root field
- **Hybrid view**: May fail without repo parameter - use Import or Call view instead
- For JavaScript projects, the `import` view is most useful
- The `call` view works better for statically-typed languages like Rust and Python

### Performance Tips for Large Codebases

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

### Validation: `http_visualization_check`

**Checklist:**
- [ ] Backend running on port 3000 (`curl http://localhost:3000/health`)
- [ ] Frontend running on port 5173
- [ ] Graph visualization loads in browser
- [ ] Can switch between graph views

**Quick Verification:**
```bash
# Check backend health
curl http://localhost:3000/health && echo "Backend: PASS" || echo "Backend: FAIL"

# Check frontend (should see Vite dev server output)
curl -s http://localhost:5173 | head -1 && echo "Frontend: PASS" || echo "Frontend: FAIL"
```

---

## 6. ✅ VERIFICATION

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

## 7. 🚀 USAGE

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

| Query Type                      | Tool                    | Reason            |
| ------------------------------- | ----------------------- | ----------------- |
| "How does authentication work?" | `narsil_neural_search`  | Semantic meaning  |
| "Find code similar to this"     | `narsil_neural_search`  | Vector similarity |
| "List all auth functions"       | `narsil_find_symbols`   | Structural query  |
| "Scan for SQL injection"        | `narsil_scan_security`  | Security analysis |
| "Show call graph for login"     | `narsil_get_call_graph` | Code flow         |
| "Who calls validateUser?"       | `narsil_get_callers`    | Callers analysis  |
| "Find dead code"                | `narsil_find_dead_code` | Unreachable code  |
| "Generate SBOM"                 | `narsil_generate_sbom`  | Supply chain      |

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

> **Note:** Use `--persist` to save the index to disk for faster subsequent startups.

---

## 8. 🎯 FEATURES

Narsil provides 90 tools organized into categories. This section covers the **39 HIGH priority tools** you'll use most often.

### 7.1 Repository & File Management (8 tools)

| Tool                    | Purpose                    | Example                                 |
| ----------------------- | -------------------------- | --------------------------------------- |
| `list_repos`            | List indexed repositories  | `narsil_list_repos({})`                 |
| `get_project_structure` | Directory tree overview    | `narsil_get_project_structure({})`      |
| `get_file`              | Get file contents          | `narsil_get_file({ path: "src/a.ts" })` |
| `get_excerpt`           | Extract code context       | `narsil_get_excerpt({ ... })`           |
| `reindex`               | Trigger re-indexing        | `narsil_reindex({})`                    |
| `discover_repos`        | Auto-discover repositories | `narsil_discover_repos({})`             |
| `validate_repo`         | Validate repository path   | `narsil_validate_repo({ path: "..." })` |
| `get_index_status`      | Show index statistics      | `narsil_get_index_status({})`           |

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

| Tool                      | Purpose                        | Example                                             |
| ------------------------- | ------------------------------ | --------------------------------------------------- |
| `find_symbols`            | Find functions/classes/structs | `narsil_find_symbols({ kind: "function" })`         |
| `get_symbol_definition`   | Get source code for symbol     | `narsil_get_symbol_definition({ name: "main" })`    |
| `find_references`         | Find all usages of a symbol    | `narsil_find_references({ name: "auth" })`          |
| `get_dependencies`        | Analyze imports                | `narsil_get_dependencies({ file: "..." })`          |
| `workspace_symbol_search` | Fuzzy search across workspace  | `narsil_workspace_symbol_search({ query: "user" })` |
| `find_symbol_usages`      | Cross-file usage analysis      | `narsil_find_symbol_usages({ name: "..." })`        |
| `get_export_map`          | Module exports/API discovery   | `narsil_get_export_map({})`                         |

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

| Tool                    | Purpose                         | Example                                            |
| ----------------------- | ------------------------------- | -------------------------------------------------- |
| `get_call_graph`        | Function relationships          | `narsil_get_call_graph({ function_name: "main" })` |
| `get_callers`           | Who calls this function?        | `narsil_get_callers({ function_name: "auth" })`    |
| `get_callees`           | What does this function call?   | `narsil_get_callees({ function_name: "login" })`   |
| `find_call_path`        | Path between two functions      | `narsil_find_call_path({ from: "a", to: "b" })`    |
| `get_complexity`        | Cyclomatic/cognitive complexity | `narsil_get_complexity({})`                        |
| `get_function_hotspots` | Find central/critical functions | `narsil_get_function_hotspots({})`                 |

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

| Tool                             | Purpose                     | Example                                     |
| -------------------------------- | --------------------------- | ------------------------------------------- |
| `find_injection_vulnerabilities` | SQL/XSS/command injection   | `narsil_find_injection_vulnerabilities({})` |
| `trace_taint`                    | Trace untrusted data flow   | `narsil_trace_taint({ source: "input" })`   |
| `get_taint_sources`              | Identify input entry points | `narsil_get_taint_sources({})`              |
| `get_security_summary`           | Quick risk assessment       | `narsil_get_security_summary({})`           |

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

| Tool                    | Purpose                         | Example                                           |
| ----------------------- | ------------------------------- | ------------------------------------------------- |
| `scan_security`         | Full security scan              | `narsil_scan_security({ ruleset: "owasp" })`      |
| `check_owasp_top10`     | OWASP Top 10 compliance         | `narsil_check_owasp_top10({})`                    |
| `check_cwe_top25`       | CWE Top 25 compliance           | `narsil_check_cwe_top25({})`                      |
| `explain_vulnerability` | Get detailed vulnerability info | `narsil_explain_vulnerability({ id: "..." })`     |
| `suggest_fix`           | Get remediation guidance        | `narsil_suggest_fix({ vulnerability_id: "..." })` |

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

| Tool                 | Purpose                             | Example                                         |
| -------------------- | ----------------------------------- | ----------------------------------------------- |
| `generate_sbom`      | Generate Software Bill of Materials | `narsil_generate_sbom({ format: "cyclonedx" })` |
| `check_dependencies` | Check for known CVEs                | `narsil_check_dependencies({})`                 |
| `check_licenses`     | License compliance verification     | `narsil_check_licenses({})`                     |
| `find_upgrade_path`  | Find safe upgrade path              | `narsil_find_upgrade_path({ package: "..." })`  |

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

| Tool                 | Purpose                      | Example                                        |
| -------------------- | ---------------------------- | ---------------------------------------------- |
| `get_control_flow`   | CFG basic blocks analysis    | `narsil_get_control_flow({ function: "..." })` |
| `find_dead_code`     | Find unreachable code        | `narsil_find_dead_code({})`                    |
| `find_dead_stores`   | Find unused assignments      | `narsil_find_dead_stores({})`                  |
| `find_uninitialized` | Find uninitialized variables | `narsil_find_uninitialized({})`                |

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

| Tool                   | Purpose                        | Example                               |
| ---------------------- | ------------------------------ | ------------------------------------- |
| `infer_types`          | Discover types without tooling | `narsil_infer_types({ file: "..." })` |
| `check_type_errors`    | Quick type error detection     | `narsil_check_type_errors({})`        |
| `get_typed_taint_flow` | Type-aware taint analysis      | `narsil_get_typed_taint_flow({})`     |

### 7.9 Git Integration (6 HIGH priority tools)

| Tool                 | Purpose                     | Example                                     |
| -------------------- | --------------------------- | ------------------------------------------- |
| `get_blame`          | Git blame for file/line     | `narsil_get_blame({ file: "..." })`         |
| `get_file_history`   | Commit history for file     | `narsil_get_file_history({ file: "..." })`  |
| `get_recent_changes` | Recent commits              | `narsil_get_recent_changes({})`             |
| `get_hotspots`       | Churn analysis (risk areas) | `narsil_get_hotspots({})`                   |
| `get_contributors`   | Team/author information     | `narsil_get_contributors({})`               |
| `get_commit_diff`    | Diff for specific commit    | `narsil_get_commit_diff({ commit: "..." })` |

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

## 9. 💡 EXAMPLES

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

## 10. 🔧 TROUBLESHOOTING

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

**"Variable 'narsil_VOYAGE_API_KEY' not found"**
- **Cause:** Code Mode requires prefixed environment variables.
- **Fix:**
  1. Add the prefixed variable to `.env`:
     ```bash
     # Standard variable
     VOYAGE_API_KEY=pa-your-voyage-key
     
     # Code Mode prefixed version (REQUIRED)
     narsil_VOYAGE_API_KEY=pa-your-voyage-key
     ```
  2. Restart OpenCode after updating `.env`
  3. Code Mode looks for `{manual_name}_{VARIABLE}` format

**"Index out of date / stale results"**
- **Cause:** Files changed but index not updated.
- **Fix:**
  ```typescript
  // Manual reindex
  call_tool_chain({
    code: `await narsil.narsil_reindex({})`
  });
  ```
  The `--persist` flag saves the index to disk for faster restarts.

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

## 11. 📚 RESOURCES

### File Locations

| Path                          | Purpose                              |
| ----------------------------- | ------------------------------------ |
| `narsil-mcp`                  | Narsil binary (in PATH after install)|
| `.utcp_config.json`           | Code Mode configuration              |
| `opencode.json`               | OpenCode MCP configuration           |
| `.opencode/skill/mcp-narsil/` | Narsil skill documentation           |
| `.opencode/skill/mcp-narsil/mcp_server/` | Embedded Narsil source (optional) |
| `.narsil-index/`              | Project-local index (add to .gitignore) |

### Embedded Source Option

For projects that want to bundle the Narsil source for version control and portability, the source can be embedded at `.opencode/skill/mcp-narsil/mcp_server/`.

**Setup:**
1. Copy Narsil source to `mcp_server/` (excluding `.git`, `target`, `frontend`)
2. Build: `cd mcp_server && cargo build --release`
3. Update `.utcp_config.json` to use the embedded binary:
   ```json
   "command": ".opencode/skill/mcp-narsil/mcp_server/target/release/narsil-mcp"
   ```
4. Add `mcp_server/target/` to `.gitignore`

**Benefits:**
- Self-contained project with all dependencies
- Version-controlled MCP server source
- No external path dependencies

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

| Tool                                    | Purpose                     |
| --------------------------------------- | --------------------------- |
| `narsil_get_project_structure`          | Directory tree overview     |
| `narsil_find_symbols`                   | Find functions/classes      |
| `narsil_scan_security`                  | Full security scan          |
| `narsil_check_owasp_top10`              | OWASP compliance check      |
| `narsil_find_injection_vulnerabilities` | SQL/XSS/injection detection |
| `narsil_trace_taint`                    | Trace untrusted data flow   |
| `narsil_get_call_graph`                 | Function relationships      |
| `narsil_get_callers`                    | Who calls this function?    |
| `narsil_get_callees`                    | What does this call?        |
| `narsil_find_dead_code`                 | Unreachable code detection  |
| `narsil_get_complexity`                 | Complexity metrics          |
| `narsil_generate_sbom`                  | Software Bill of Materials  |
| `narsil_check_dependencies`             | CVE vulnerability check     |
| `narsil_get_blame`                      | Git blame                   |
| `narsil_get_hotspots`                   | High-churn files            |
| `narsil_reindex`                        | Trigger re-indexing         |
| `narsil_get_symbol_definition`          | Get source code for symbol  |
| `narsil_find_references`                | Find all usages             |
| `narsil_get_security_summary`           | Quick risk assessment       |
| `narsil_check_licenses`                 | License compliance          |

### Configuration Templates

**Minimal .utcp_config.json:**

> **IMPORTANT**: Use absolute path for command.

```json
{
  "name": "narsil",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "narsil": {
        "transport": "stdio",
        "command": "/absolute/path/to/narsil-mcp",
        "args": ["--repos", ".", "--preset", "minimal", "--persist", "--watch"],
        "env": {}
      }
    }
  }
}
```

**Recommended .utcp_config.json (Full Features):**

> **IMPORTANT**: 
> - Use absolute path for command
> - Use `${VOYAGE_API_KEY}` variable reference (not hardcoded key)
> - Do NOT add extra fields like `_note`, `_neural_backends` - they break Code Mode parsing

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
# Example output: /Users/username/bin/narsil-mcp
# Use this absolute path in the config
```

**Presets:**
| Preset             | Tools | Best For                               |
| ------------------ | ----- | -------------------------------------- |
| `minimal`          | 26    | Fast startup, lightweight editors      |
| `balanced`         | 51    | General development                    |
| `full`             | 90    | Comprehensive analysis, Claude Desktop |
| `security-focused` | ~40   | Security audits and compliance         |

### External Resources

- **GitHub Repository**: https://github.com/postrv/narsil-mcp
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **CycloneDX SBOM**: https://cyclonedx.org/
- **MCP Protocol**: https://modelcontextprotocol.io

### Related Skills

| Skill             | Relationship                               |
| ----------------- | ------------------------------------------ |
| `mcp-code-mode`   | Narsil accessed via Code Mode              |
| `system-spec-kit` | Save security findings for future sessions |

### Optional Flags

| Flag       | Purpose                                   | When to Use                      |
| ---------- | ----------------------------------------- | -------------------------------- |
| `--neural` | Enable neural semantic search (Voyage AI) | If you need semantic code search |
| `--lsp`    | IDE provides LSP features natively        | Skip - IDE handles this          |
| `--remote` | Not needed for local development          | Skip - local only                |

---

### Quick Start Summary

```bash
# 1. Prerequisites
# - Ensure Code Mode is installed (see MCP - Code Mode.md)

# 2. Install Narsil (choose ONE method)
brew tap postrv/narsil && brew install narsil-mcp  # macOS/Linux
# OR
npm install -g narsil-mcp                           # Cross-platform
# OR
scoop bucket add narsil https://github.com/postrv/scoop-narsil && scoop install narsil-mcp  # Windows

# 3. (Optional) Run interactive config wizard
narsil-mcp config init --neural

# 4. Configure .utcp_config.json (add narsil section)
# See "Recommended .utcp_config.json" above for full config

# 5. Restart OpenCode

# 6. Verify via AI
# "Use Code Mode to search for Narsil tools"
# "Use Narsil to get the project structure"
```

### All Installation Methods (Quick Reference)

| Platform | Recommended Command |
|----------|-------------------|
| **macOS** | `brew tap postrv/narsil && brew install narsil-mcp` |
| **Windows** | `scoop bucket add narsil https://github.com/postrv/scoop-narsil && scoop install narsil-mcp` |
| **Linux** | `npm install -g narsil-mcp` or `brew install narsil-mcp` |
| **Arch Linux** | `yay -S narsil-mcp-bin` |
| **Any (Quick)** | `curl -fsSL https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.sh \| bash` |
| **Rust Dev** | `cargo install narsil-mcp` |

### Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│  Code Mode (.utcp_config.json)                               │
│  call_tool_chain() ───────────────────────────────────────┐ │
└───────────────────────────────────────────────────────────┼─┘
                                                            │
                            ┌───────────────────────────────┘
                            │ stdio (spawn process)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Narsil MCP Server                                          │
│  ┌──────────────────────┬──────────────────────────────────┐│
│  │ MCP Tools (90)       │ Visualization UI (optional)      ││
│  │ via stdio            │ via HTTP :3000                   ││
│  │                      │                                  ││
│  │ • narsil_find_symbols│ • Call graph viewer               ││
│  │ • narsil_scan_security│ • Import graph                  ││
│  │ • narsil_neural_search│ • File browser                  ││
│  └──────────────────────┴──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

NOTE: --http enables visualization UI only, NOT HTTP transport for MCP.
      MCP communication is ALWAYS via stdio.
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
