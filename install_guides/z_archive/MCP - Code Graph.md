# CodeGraph MCP Server Installation Guide

Complete installation, configuration, and verification workflow for the CodeGraph MCP server.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the CodeGraph MCP server from https://github.com/Jakedismo/codegraph-rust

Please help me:
1. Verify I have Rust, SurrealDB, and Ollama installed (or help me install them)
2. Clone and build the CodeGraph server from source
3. Start SurrealDB and apply the database schema
4. Create the config.toml configuration file
5. Index my project codebase
6. Configure the MCP server for my environment (I'm using OpenCode)
7. Verify the installation with a test query

My project to index is located at: [your project path]
My embedding provider is: Ollama (nomic-embed-text)
My LLM provider is: Anthropic (claude-sonnet-4)

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Check/Install Rust toolchain, SurrealDB, and Ollama
- Build the `codegraph` binary from source
- Initialize the graph database
- Configure the server settings
- Index your codebase for the first time
- Set up the MCP connection in OpenCode
- Verify end-to-end functionality

**Expected setup time:** 15-20 minutes

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [🔧 TROUBLESHOOTING](#8--troubleshooting)
9. [📚 RESOURCES](#9--resources)

---

## 1. 📖 OVERVIEW

The CodeGraph MCP Server provides AI assistants with GraphRAG-powered code intelligence through agentic tools that return synthesized answers, not just search results.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes. This prevents cascading failures.

### Key Features

| Feature | Description |
|---------|-------------|
| **GraphRAG** | Graph + Vector + Lexical hybrid search |
| **Agentic Tools** | 4 tools with specialized reasoning agents |
| **Flexible Providers** | Ollama, Jina, OpenAI for embeddings |
| **Multi-LLM Support** | Anthropic, OpenAI, Ollama for reasoning |
| **14+ Languages** | Full tree-sitter AST support |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ MCP Protocol
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CodeGraph MCP Server (Rust)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Agentic Tools Layer                    │  │
│  │  agentic_context | agentic_impact | agentic_architecture  │  │
│  │                    agentic_quality                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Inner Graph Tools                        │  │
│  │  Transitive Dependencies | Call Chains | Coupling Metrics │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SurrealDB                               │
│  Nodes (AST) + Edges (relationships) + Chunks (embeddings)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 📋 PREREQUISITES

**Phase 1** focuses on installing the required software dependencies.

### Actions

1. **Install Rust** (build toolchain)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
   source "$HOME/.cargo/env"
   ```

2. **Install SurrealDB** (graph + vector database)
   ```bash
   brew install surrealdb/tap/surreal
   ```

3. **Install Ollama** (local embeddings)
   ```bash
   brew install ollama
   brew services start ollama
   ollama pull nomic-embed-text
   ```

4. **Set API Key** (for agentic reasoning)
   ```bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   # Add to ~/.zshrc or ~/.bashrc for persistence
   ```

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
cargo --version        # → cargo 1.x.x
surreal version        # → surreal 2.x.x
ollama --version       # → ollama version 0.x.x
ollama list            # → shows nomic-embed-text
echo $ANTHROPIC_API_KEY # → sk-ant-...
```

**Checklist:**
- [ ] `cargo --version` returns version?
- [ ] `surreal version` returns version?
- [ ] `ollama list` shows nomic-embed-text?
- [ ] `ANTHROPIC_API_KEY` is set?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. 📥 INSTALLATION

This section covers **Phase 2 (Build)** and **Phase 3 (Index)**.

### Step 1: Clone and Build CodeGraph

```bash
cd ~
git clone https://github.com/Jakedismo/codegraph-rust.git
cd codegraph-rust
./install-codegraph-full-features.sh
source "$HOME/.cargo/env"
```

### Step 2: Start SurrealDB & Apply Schema

```bash
# Start DB
mkdir -p ~/.codegraph
surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db

# In a new terminal, apply schema
cd ~/codegraph-rust/schema
./apply-schema.sh
```

### Step 3: Create Configuration File

Create `~/.codegraph/config.toml`:

```toml
[embedding]
provider = "ollama"
model = "nomic-embed-text"
dimension = 768

[llm]
enabled = true
provider = "anthropic"
model = "claude-sonnet-4"

[surrealdb]
url = "ws://localhost:3004"
namespace = "codegraph"
database = "main"
username = "root"
password = "root"

[indexing]
tier = "fast"
languages = ["javascript", "typescript", "css", "html", "markdown"]

[agent]
architecture = "rig"
context_window = 128000
max_steps = 6
```

### Validation: `phase_2_complete`

```bash
# CodeGraph binary exists
codegraph --version    # → codegraph 0.1.x

# SurrealDB connection works
surreal sql --conn ws://localhost:3004 --user root --pass root --ns codegraph --db main --hide-welcome <<< "RETURN 'connected';"
# → ['connected']

# Config file exists
cat ~/.codegraph/config.toml | head -5
```

### Step 4: Index Project

Parse your codebase into the knowledge graph.

1. **Set Environment Variables** (if not using config.toml):
   ```bash
   export CODEGRAPH_SURREALDB_URL="ws://localhost:3004"
   export CODEGRAPH_SURREALDB_NS="codegraph"
   export CODEGRAPH_SURREALDB_DB="main"
   export CODEGRAPH_SURREALDB_USER="root"
   export CODEGRAPH_SURREALDB_PASS="root"
   export CODEGRAPH_EMBEDDING_PROVIDER="ollama"
   export CODEGRAPH_EMBEDDING_MODEL="nomic-embed-text"
   export CODEGRAPH_EMBEDDING_DIMENSION="768"
   ```
   
   > **Note**: Both short (`_NS`, `_DB`, `_USER`, `_PASS`) and long (`_NAMESPACE`, `_DATABASE`, `_USERNAME`, `_PASSWORD`) forms are supported.

2. **Index Your Project**:
   ```bash
   cd /path/to/your/project
   codegraph index . -r --languages javascript,typescript --index-tier fast
   ```
   
   > **CRITICAL**: The `-r` (recursive) flag is REQUIRED to index subdirectories. Without it, only root-level files are indexed.

### Validation: `phase_3_complete`

```bash
# Check indexed data (note: table is "nodes" plural)
surreal sql --conn ws://localhost:3004 --user root --pass root --ns codegraph --db main --hide-welcome <<< "SELECT count() FROM nodes GROUP ALL;"
# → Returns count > 0 (e.g., [[{ count: 3967 }]])
```

❌ **STOP if validation fails** - Check build output, language flags, or ensure `-r` flag was used.

---

## 4. ⚙️ CONFIGURATION

Connect CodeGraph to OpenCode (Phase 4).

### Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "codegraph": {
      "type": "local",
      "command": [
        "/Users/YOUR_USERNAME/.cargo/bin/codegraph",
        "start",
        "stdio",
        "--watch"
      ],
      "environment": {
        "CODEGRAPH_SURREALDB_URL": "ws://localhost:3004",
        "CODEGRAPH_SURREALDB_NAMESPACE": "codegraph",
        "CODEGRAPH_SURREALDB_DATABASE": "main",
        "CODEGRAPH_SURREALDB_USERNAME": "root",
        "CODEGRAPH_SURREALDB_PASSWORD": "root",
        "CODEGRAPH_EMBEDDING_PROVIDER": "ollama",
        "CODEGRAPH_EMBEDDING_MODEL": "nomic-embed-text",
        "CODEGRAPH_EMBEDDING_DIMENSION": "768",
        "CODEGRAPH_LLM_PROVIDER": "ollama",
        "CODEGRAPH_LLM_MODEL": "qwen2.5-coder:3b",
        "CODEGRAPH_CONTEXT_WINDOW": "32000",
        "CODEGRAPH_AGENT_ARCHITECTURE": "rig"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username.

---

## 5. ✅ VERIFICATION

Verify the end-to-end connection in OpenCode.

### Step 1: Restart OpenCode

Restart your OpenCode session to load the new MCP server.

### Step 2: Test with a Query

Ask your agent:
```
What are the main modules in this codebase?
```

### Success Criteria (`phase_4_complete`)

- [ ] ✅ OpenCode shows `codegraph` in MCP server list
- [ ] ✅ Query triggers `agentic_architecture` (or similar) tool invocation
- [ ] ✅ Response includes structured output with analysis
- [ ] ✅ No connection errors in the response

---

## 6. 🚀 USAGE

### Daily Startup

**Before using CodeGraph each session:**

```bash
# Terminal 1: Start SurrealDB (keep running)
surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db

# OpenCode will start CodeGraph MCP server automatically
opencode
```

**Optional**: Add SurrealDB to login items or use a process manager.

### Indexing Tiers

| Tier | Speed | Features |
|------|-------|----------|
| `fast` | Fastest | AST nodes + core edges only |
| `balanced` | Medium | + LSP symbols, docs, module linking |
| `full` | Slowest | + All analyzers, dataflow, architecture |

**Decision Logic**:

```
IF project < 500 files:
  → Use "balanced" tier for best results (2-5 mins)

IF project 500-2000 files:
  → Use "fast" tier initially (5-15 mins)
  → Re-index with "balanced" if needed

IF project > 2000 files:
  → Use "fast" tier (15+ mins)
  → Consider per-module indexing
```

**Re-indexing Command**:
```bash
codegraph index . -r --languages javascript,typescript --index-tier fast
```

---

## 7. 🎯 FEATURES

The server exposes 4 agentic tools that allow the AI to reason about your codebase:

### 7.1 agentic_context
**Purpose**: Gather client-readable context for a query.
- Returns summary, highlights (snippets), related locations, and risks.
- Best for: "How does X work?", "Explain the auth flow".

### 7.2 agentic_impact
**Purpose**: Assess change impact.
- Analyzes dependencies, call chains, and coupling.
- Best for: "What breaks if I change X?", "Who calls this function?".

### 7.3 agentic_architecture
**Purpose**: Summarize system structure.
- Returns high-level architectural analysis.
- Best for: "What are the main modules?", "Draw the system diagram".

### 7.4 agentic_quality
**Purpose**: Highlight quality risks and hotspots.
- Analyzes complexity and coupling metrics.
- Best for: "Where is the technical debt?", "Find complex functions".

---

## 8. 🔧 TROUBLESHOOTING

### Common Errors

**❌ "CODEGRAPH_SURREALDB_URL must be set"**
- **Cause**: Environment variables not configured.
- **Fix**: Export variables or ensure `config.toml` exists.

**❌ "Connection refused to localhost:3004"**
- **Cause**: SurrealDB not running.
- **Fix**: Run `surreal start ...` command.

**❌ "Ollama embedding failed"**
- **Cause**: Ollama not running or model not pulled.
- **Fix**: `brew services start ollama && ollama pull nomic-embed-text`

**❌ "No files indexed" or "0 nodes extracted"**
- **Cause**: Missing `-r` (recursive) flag - only root files indexed.
- **Fix**: `cd /project && codegraph index . -r --languages javascript,typescript --force`

**❌ Exit code 137 on macOS (binary killed)**
- **Cause**: macOS code signing issue after building from source.
- **Fix**: 
  ```bash
  xattr -cr ~/.cargo/bin/codegraph
  codesign -fs - ~/.cargo/bin/codegraph
  ```

**❌ Agent returns JSON text instead of executing tools (tool_calls=0)**
- **Cause**: LLM internal tool names changed between CodeGraph versions.
- **Symptom**: MCP logs show `tool_calls=0`, response contains raw JSON like `{"name": "semantic_code_search", ...}`
- **Fix**: 
  1. Rebuild CodeGraph from latest source
  2. **Restart OpenCode** to pick up the new MCP binary
  3. The new version uses Rig framework with correct tool definitions

**❌ Changes to binary not taking effect**
- **Cause**: OpenCode's MCP server caches the binary at startup.
- **Fix**: Fully restart OpenCode after rebuilding or updating the CodeGraph binary.

**❌ Tool not appearing in OpenCode**
- **Cause**: MCP configuration issue.
- **Fix**: Check `opencode.json` syntax, verify paths, restart OpenCode.

**❌ Slow agent responses**
- **Cause**: Context window too large.
- **Fix**: Reduce `CODEGRAPH_CONTEXT_WINDOW` or use "fast" tier.

---

## 9. 📚 RESOURCES

### File Locations

| Path | Purpose |
|------|---------|
| `~/.codegraph/config.toml` | Global configuration |
| `~/.codegraph/surreal.db/` | SurrealDB data directory |
| `~/.cargo/bin/codegraph` | CodeGraph binary |
| `~/codegraph-rust/` | Source code (if built locally) |
| `~/codegraph-rust/schema/` | Database schemas |

### External Resources

- **CodeGraph Repository**: https://github.com/Jakedismo/codegraph-rust
- **SurrealDB Documentation**: https://surrealdb.com/docs
- **Ollama**: https://ollama.com
- **Anthropic API**: https://docs.anthropic.com

---

**Installation Complete!**

Return to [SKILL.md](.opencode/skills/mcp-code-graph/SKILL.md) for usage instructions and tool documentation.
