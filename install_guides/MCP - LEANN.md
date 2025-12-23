# LEANN MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the LEANN (Lean ANNs) MCP server for ultra-efficient semantic code and document search with 97% storage savings.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the LEANN MCP server from https://github.com/yichuan-w/LEANN

Please help me:
1. Verify I have Python 3.9+ and uv installed
2. Install required Homebrew dependencies (libomp, boost, protobuf, zeromq, pkgconf)
3. Install Ollama and pull nomic-embed-text (recommended for local embeddings)
4. Install LEANN using uv tool install
5. Build my first index from a codebase or documents folder
6. Configure the MCP server for my environment (I'm using: [Claude Code / Claude Desktop / OpenCode])
7. Verify the installation with a test search query

My project to index is located at: [your project path]
My embedding provider is: [ollama (recommended) / sentence-transformers / openai / gemini]
My LLM provider is: [ollama (recommended) / openai / gemini / hf]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify Python 3.9+ and uv are available
- Install Homebrew dependencies for native compilation
- Set up Ollama with nomic-embed-text (recommended)
- Install LEANN core and MCP server via uv
- Build a vector index from your codebase
- Configure the MCP server for your AI platform
- Test search functionality with a sample query
- Show you how to use build, search, ask, list, and remove commands

**Expected setup time:** 10-15 minutes

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

LEANN (Lean ANNs) is an ultra-efficient MCP server for semantic search that achieves **97% storage savings** compared to traditional vector databases. It provides AI assistants with semantic code search and document RAG capabilities using state-of-the-art approximate nearest neighbor algorithms.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes. This prevents cascading failures.

### Key Features

| Feature | Description |
|---------|-------------|
| **97% Storage Savings** | Lean vector indices vs traditional vector DBs |
| **Self-Contained** | No external database required |
| **AST-Aware Chunking** | Intelligent code chunking with tree-sitter |
| **Multiple Backends** | HNSW (default), DiskANN for large-scale |
| **Flexible Embeddings** | sentence-transformers, OpenAI, MLX, Ollama |
| **RAG Q&A** | Built-in LLM-powered question answering |
| **MCP Native** | First-class Model Context Protocol support |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ MCP Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LEANN MCP Server (Python)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      MCP Tools Layer                      │  │
│  │  leann_build | leann_search | leann_ask | leann_list      │  │
│  │                     leann_remove                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Core Components                         │  │
│  │  AST Chunking | Embedding Providers | ANN Backends        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Lean Vector Index                          │
│  HNSW/DiskANN graph + Compressed vectors (97% smaller)          │
└─────────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature | LEANN | Traditional Vector DB | Grep/Ripgrep |
|---------|-------|----------------------|--------------|
| **Storage** | 97% smaller | Full vectors | N/A |
| **Query Type** | Semantic | Semantic | Keywords |
| **External DB** | None required | Required | N/A |
| **Setup** | Single command | Multi-step | Built-in |
| **RAG Built-in** | Yes | Usually no | No |

---

## 2. 📋 PREREQUISITES

**Phase 1** focuses on installing the required software dependencies.

### Required Software

1. **Python 3.9 or higher**
   ```bash
   python3 --version
   # Should show 3.9.x or higher
   ```

2. **uv** (Python package manager)
   ```bash
   # Install uv if not present
   curl -LsSf https://astral.sh/uv/install.sh | sh
   source "$HOME/.local/bin/env"
   
   # Verify installation
   uv --version
   ```

3. **Homebrew** (macOS package manager)
   ```bash
   brew --version
   # If not installed: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

### Actions

1. **Install Homebrew Dependencies** (native compilation requirements)
   ```bash
   brew install libomp boost protobuf zeromq pkgconf
   ```

2. **Verify Homebrew Dependencies**
   ```bash
   # All packages should be installed
   brew list libomp boost protobuf zeromq pkgconf
   ```

### Recommended: Local Embeddings with Ollama

**Ollama with nomic-embed-text is the recommended setup** for local-first operation with no API dependencies:

```bash
# Install Ollama
brew install ollama
brew services start ollama

# Pull the recommended embedding model (MANDATORY for local embeddings)
ollama pull nomic-embed-text

# Pull an LLM for RAG Q&A (OPTIONAL - see LLM Provider Options in Resources)
# Option A: Local LLM (uses ~8GB RAM)
ollama pull qwen3:8b          # Recommended local: good balance of speed/quality

# Option B: Cloud LLM (Gemini 2.5 Flash - RECOMMENDED)
# No download needed - just set GEMINI_API_KEY and use leann-ask alias
# See "LLM Providers" section in Resources for setup
```

> **Why nomic-embed-text?** High-quality 768-dimensional embeddings, runs locally, no API costs, consistent results across sessions.

> **LLM Recommendation**: Use **Gemini 2.5 Flash** (cloud) for RAG Q&A - it's cheap (~$0.001/query), fast, and doesn't use RAM. See "LLM Providers" section for setup.

### Alternative: Cloud-Based Embeddings

**Option A: Gemini API** (current project setup)
```bash
export GEMINI_API_KEY="your-key-here"
export GOOGLE_API_KEY="your-key-here"  # Same key, both may be needed
# Add to ~/.zshrc or ~/.bashrc for persistence
```

**Option B: OpenAI API**
```bash
export OPENAI_API_KEY="sk-..."
# Add to ~/.zshrc or ~/.bashrc for persistence
```

> **Note**: Cloud APIs provide high-quality embeddings but require internet and incur costs. Local Ollama is recommended for development workflows.

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
python3 --version       # → Python 3.9.x or higher
uv --version            # → uv 0.x.x
brew list libomp        # → shows libomp is installed
brew list boost         # → shows boost is installed
brew list protobuf      # → shows protobuf is installed
brew list zeromq        # → shows zeromq is installed
brew list pkgconf       # → shows pkgconf is installed
```

**Checklist:**
- [ ] `python3 --version` returns 3.9+?
- [ ] `uv --version` returns version?
- [ ] `brew list libomp` shows installed?
- [ ] `brew list boost` shows installed?
- [ ] `brew list protobuf` shows installed?
- [ ] `brew list zeromq` shows installed?
- [ ] `brew list pkgconf` shows installed?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. 📥 INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Build Index)**.

### Step 1: Install LEANN via uv

```bash
# Install LEANN core with MCP server support
uv tool install leann-core --with leann
```

This installs two binaries:
- `leann` - CLI for building and searching indexes
- `leann_mcp` - MCP server for AI assistant integration

### Step 2: Verify Binary Installation

```bash
# Check binaries are in PATH
which leann
# → ~/.local/bin/leann

which leann_mcp
# → ~/.local/bin/leann_mcp

# Verify LEANN version
leann --version
```

### Validation: `phase_2_complete`

```bash
# LEANN binaries exist and are accessible
leann --version        # → leann x.x.x
leann_mcp --version    # → should show version or help
which leann            # → ~/.local/bin/leann
which leann_mcp        # → ~/.local/bin/leann_mcp
```

**Checklist:**
- [ ] `leann --version` returns version?
- [ ] `which leann` shows `~/.local/bin/leann`?
- [ ] `which leann_mcp` shows `~/.local/bin/leann_mcp`?

❌ **STOP if validation fails** - Check uv installation output for errors.

### Step 3: Build Your First Index

Build a vector index from your codebase or documents.

**For Code Projects:**
```bash
# Build index with AST-aware chunking (recommended for code)
leann build my-project --docs /path/to/your/project

# With specific options
leann build my-project --docs /path/to/your/project \
  --backend hnsw \
  --embedding sentence-transformers
```

**For Documents (Markdown, Text):**
```bash
# Build index for documentation
leann build my-docs --docs /path/to/docs/folder
```

### Build Options Reference

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--backend` | hnsw, diskann | hnsw | ANN algorithm |
| `--embedding` | ollama, sentence-transformers, openai, mlx | ollama | Embedding provider |
| `--chunk-size` | integer | 512 | Characters per chunk |
| `--overlap` | integer | 50 | Chunk overlap |

> **Recommended**: Use `--embedding ollama` with `nomic-embed-text` model for local-first operation.

### Validation: `phase_3_complete`

```bash
# List created indexes
leann list
# → Should show your index (e.g., "my-project")

# Test search on your index
leann search my-project "main function entry point"
# → Should return relevant results
```

**Checklist:**
- [ ] `leann list` shows your index?
- [ ] `leann search <name> "test query"` returns results?

❌ **STOP if validation fails** - Check build output for errors, verify source path exists.

---

## 4. ⚙️ CONFIGURATION

Connect LEANN to your AI assistant (Phase 4).

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

**Local Setup (Recommended - Ollama):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_TOOLS": "Provides semantic code search with 97% storage savings",
        "_NOTE_EMBEDDING": "Uses nomic-embed-text via Ollama (local)",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

**Cloud Setup (Gemini API):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "GEMINI_API_KEY": "your-gemini-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key",
        "_NOTE_TOOLS": "Provides semantic code search with 97% storage savings",
        "_NOTE_LLM": "Uses Gemini 2.5 Flash via GEMINI_API_KEY (cloud)",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username. Find it with `whoami`.

### Option B: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "leann": {
      "command": "/Users/YOUR_USERNAME/.local/bin/leann_mcp",
      "args": [],
      "env": {}
    }
  }
}
```

### Option C: Configure for Claude Desktop

Add to `claude_desktop_config.json`:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "leann": {
      "command": "/Users/YOUR_USERNAME/.local/bin/leann_mcp",
      "args": [],
      "env": {}
    }
  }
}
```

### Environment Variables (Optional)

Set these for advanced configuration:

```bash
# For OpenAI embeddings
export OPENAI_API_KEY="sk-..."

# For Ollama (if using custom host)
export OLLAMA_HOST="http://localhost:11434"
```

### Validation: `phase_4_complete`

```bash
# Configuration file exists and is valid JSON
cat opencode.json | python3 -m json.tool

# Path in config matches actual binary
ls -la /Users/YOUR_USERNAME/.local/bin/leann_mcp
```

**Checklist:**
- [ ] Configuration file has valid JSON syntax?
- [ ] `leann_mcp` path in config exists?
- [ ] Username replaced with actual username?

❌ **STOP if validation fails** - Fix configuration syntax or paths.

---

## 5. ✅ VERIFICATION

Verify the end-to-end connection in your AI assistant.

### Step 1: Restart Your AI Client

Restart OpenCode, Claude Code, or Claude Desktop to load the new MCP server.

```bash
# For OpenCode
opencode
```

### Step 2: Check MCP Server Is Loaded

Ask your AI assistant:
```
What MCP tools are available?
```

Expected: Should list LEANN tools (leann_build, leann_search, leann_ask, leann_list, leann_remove).

### Step 3: Test with a Search Query

Ask your agent:
```
Use leann_search to find code related to "form validation" in my-project
```

Or directly test CLI:
```bash
leann search my-project "form validation"
```

### Success Criteria (`phase_5_complete`)

- [ ] ✅ OpenCode/Claude shows `leann` in MCP server list
- [ ] ✅ `leann_list` tool returns your indexed projects
- [ ] ✅ `leann_search` returns relevant code snippets
- [ ] ✅ No connection errors in responses
- [ ] ✅ Results include file paths and content

**Checklist:**
- [ ] MCP server appears in tool list?
- [ ] Search returns results with file paths?
- [ ] No error messages in output?

❌ **STOP if validation fails** - Check MCP configuration, restart client, verify index exists.

---

## 6. 🚀 USAGE

### Daily Workflow

**LEANN requires no background services** - indexes are self-contained files.

```bash
# Start your AI client - LEANN MCP starts automatically
opencode

# Or use CLI directly
leann search my-project "authentication flow"
leann ask my-project "How does the login system work?"
```

### Building New Indexes

**When to rebuild:**
- After significant code changes
- When adding new source files
- When changing embedding provider

```bash
# Rebuild existing index
leann build my-project --docs /path/to/project

# Build with different settings
leann build my-project --docs /path/to/project --backend diskann --embedding openai
```

### Index Management

```bash
# List all indexes
leann list

# Remove an index
leann remove my-project

# Search across index
leann search my-project "your query here"

# RAG Q&A (requires LLM)
leann ask my-project "What does this codebase do?"
```

### Backend Selection Guide

| Backend | Best For | Speed | Memory |
|---------|----------|-------|--------|
| `hnsw` | < 100K chunks | Fastest | Higher |
| `diskann` | > 100K chunks | Fast | Lower |

**Decision Logic:**
```
IF project < 10K files:
  → Use "hnsw" (fastest, default)

IF project 10K-100K files:
  → Use "hnsw" with monitoring

IF project > 100K files OR memory constrained:
  → Use "diskann" (disk-based)
```

---

## 7. 🎯 FEATURES

The server exposes 5 MCP tools for semantic search and RAG:

### 7.1 leann_build

**Purpose**: Create or update a vector index from documents/code.

**CLI Usage**:
```bash
leann build <name> --docs <path> [options]
```

**Parameters**:
- `name` (string, required) - Unique name for the index
- `--docs` (path, required) - Path to source files
- `--backend` (string, optional) - hnsw or diskann
- `--embedding` (string, optional) - Embedding provider

**Example**:
```bash
leann build anobel-site --docs /path/to/anobel.com --backend hnsw
```

### 7.2 leann_search

**Purpose**: Semantic search within an indexed project.

**CLI Usage**:
```bash
leann search <name> "<query>" [--top-k N]
```

**Parameters**:
- `name` (string, required) - Index name
- `query` (string, required) - Natural language search query
- `--top-k` (int, optional) - Number of results, default: 10

**Example**:
```bash
leann search anobel-site "video player initialization"
```

**Returns**: Ranked code/document snippets with file paths and similarity scores.

### 7.3 leann_ask

**Purpose**: RAG-powered question answering over your codebase.

**CLI Usage**:
```bash
leann ask <name> "<question>" [--llm-provider <provider>]
```

**Parameters**:
- `name` (string, required) - Index name
- `question` (string, required) - Natural language question
- `--llm-provider` (string, optional) - ollama, openai, or hf

**Example**:
```bash
leann ask anobel-site "How does the contact form handle validation?"
```

**Returns**: LLM-generated answer with source citations.

### 7.4 leann_list

**Purpose**: List all available indexes.

**CLI Usage**:
```bash
leann list
```

**Returns**: Table of index names, sizes, and creation dates.

### 7.5 leann_remove

**Purpose**: Delete an index.

**CLI Usage**:
```bash
leann remove <name>
```

**Example**:
```bash
leann remove old-project
```

---

## 8. 💡 EXAMPLES

### Example 1: Code Search

**Scenario**: Find video player implementation details

```bash
# Step 1: Build index for your project
leann build anobel --docs /path/to/anobel.com

# Step 2: Search for video-related code
leann search anobel "HLS video player initialization and playback control"

# Expected results:
# - src/2_javascript/video_player_hls.js (score: 0.89)
# - src/2_javascript/video_background_hls.js (score: 0.85)
# - src/1_css/video/video_player_hls.css (score: 0.72)
```

### Example 2: Document RAG Q&A

**Scenario**: Ask questions about project documentation

```bash
# Step 1: Build index for docs
leann build project-docs --docs /path/to/docs

# Step 2: Ask a question
leann ask project-docs "What are the main CSS naming conventions used?"

# Expected: LLM-generated answer with citations to relevant docs
```

### Example 3: Multi-Project Search

**Scenario**: Search across different codebases

```bash
# Build indexes for each project
leann build frontend --docs /path/to/frontend
leann build backend --docs /path/to/backend
leann build shared --docs /path/to/shared-libs

# Search each independently
leann search frontend "authentication component"
leann search backend "JWT token validation"
leann search shared "utility functions for date formatting"
```

### Example 4: Large Codebase with DiskANN

**Scenario**: Index a large monorepo

```bash
# Use DiskANN for better memory efficiency
leann build monorepo --docs /path/to/large/monorepo \
  --backend diskann \
  --chunk-size 1024

# Search as normal
leann search monorepo "database migration scripts"
```

### Example 5: OpenAI Embeddings

**Scenario**: Use OpenAI embeddings for higher quality

```bash
# Set API key
export OPENAI_API_KEY="sk-..."

# Build with OpenAI embeddings
leann build my-project --docs /path/to/project --embedding openai

# Search (uses same embeddings)
leann search my-project "error handling patterns"
```

### Example 6: MCP Integration Query

**In your AI assistant:**

```
Use leann_search to find all code related to "form submission and validation" in the anobel index
```

Expected response:
- Ranked list of relevant files
- Code snippets with context
- File paths for follow-up reading

---

## 9. 🔧 TROUBLESHOOTING

### Common Errors

**❌ "Command not found: leann"**
- **Cause**: Binary not in PATH after uv installation.
- **Fix**: 
  ```bash
  source "$HOME/.local/bin/env"
  # Or add to ~/.zshrc: export PATH="$HOME/.local/bin:$PATH"
  ```

**❌ "Error building with libomp"**
- **Cause**: Missing Homebrew dependencies.
- **Fix**:
  ```bash
  brew install libomp boost protobuf zeromq pkgconf
  ```

**❌ "No index found: <name>"**
- **Cause**: Index doesn't exist or was removed.
- **Fix**:
  ```bash
  leann list  # Check what indexes exist
  leann build <name> --docs /path/to/source
  ```

**❌ "Cannot connect to Ollama"**
- **Cause**: Ollama service not running.
- **Fix**:
  ```bash
  brew services start ollama
  ollama list  # Verify models are pulled
  ```

**❌ "Model 'qwen3:8b' not found"**
- **Cause**: Local LLM model not installed, trying to use default.
- **Fix** (Option A - Install local model):
  ```bash
  ollama pull qwen3:8b
  ```
- **Fix** (Option B - Use Gemini instead, RECOMMENDED):
  ```bash
  # Add to ~/.zshrc
  alias leann-ask='OPENAI_API_KEY=$GEMINI_API_KEY leann ask --llm openai --model gemini-2.5-flash --api-base "https://generativelanguage.googleapis.com/v1beta/openai"'
  source ~/.zshrc
  # Then use: leann-ask my-index "your question"
  ```

**❌ "OpenAI API error"**
- **Cause**: Invalid or missing API key.
- **Fix**:
  ```bash
  export OPENAI_API_KEY="sk-..."
  echo $OPENAI_API_KEY  # Verify it's set
  ```

**❌ "MCP server not appearing in tools"**
- **Cause**: Configuration file issue or path incorrect.
- **Fix**:
  1. Check configuration file syntax:
     ```bash
     python3 -m json.tool < opencode.json
     ```
  2. Verify binary path exists:
     ```bash
     ls -la ~/.local/bin/leann_mcp
     ```
  3. Restart your AI client completely.

**❌ "Index is empty / no results"**
- **Cause**: Build failed or no matching files found.
- **Fix**:
  ```bash
  # Rebuild with verbose output
  leann build my-project --docs /path/to/source --verbose
  
  # Check source path has files
  ls /path/to/source
  ```

**❌ "Memory error during build"**
- **Cause**: Large codebase with HNSW backend.
- **Fix**:
  ```bash
  # Use DiskANN for large projects
  leann build large-project --docs /path --backend diskann
  ```

**❌ "Slow search performance"**
- **Cause**: Large index or slow embedding generation.
- **Fix**:
  1. Use local embeddings (sentence-transformers or MLX)
  2. Reduce chunk size if index is very large
  3. Consider DiskANN backend for large indexes

**❌ "Different results than expected"**
- **Cause**: Query phrasing or embedding model mismatch.
- **Fix**:
  1. Try rephrasing query with different terms
  2. Use `leann ask` for RAG to get interpreted answers
  3. Rebuild index if embedding provider changed

---

## 10. 📚 RESOURCES

### File Locations

| Path | Purpose |
|------|---------|
| `~/.local/bin/leann` | LEANN CLI binary |
| `~/.local/bin/leann_mcp` | LEANN MCP server binary |
| `~/.leann/` | Default index storage location |
| `opencode.json` | OpenCode MCP configuration |
| `.mcp.json` | Claude Code MCP configuration |

### CLI Command Reference

```bash
# Build index
leann build <name> --docs <path> [--backend hnsw|diskann] [--embedding provider]

# Search index
leann search <name> "<query>" [--top-k N]

# RAG Q&A
leann ask <name> "<question>" [--llm-provider ollama|openai|hf]

# List indexes
leann list

# Remove index
leann remove <name>

# Version
leann --version
```

### Embedding Providers

| Provider | Command | Notes |
|----------|---------|-------|
| Ollama | `--embedding ollama` | **Recommended**, local, uses nomic-embed-text |
| sentence-transformers | `--embedding sentence-transformers` | Local, fast, good default |
| OpenAI | `--embedding openai` | Requires OPENAI_API_KEY, cloud |
| Gemini | N/A (via env vars) | Requires GEMINI_API_KEY, cloud |
| MLX | `--embedding mlx` | Apple Silicon optimized |

> **Recommended Setup**: Ollama with `nomic-embed-text` for local-first development.

### LLM Providers (for `ask` command)

The `leann ask` command uses an LLM to generate answers from retrieved context. You have two main options:

#### Option A: Gemini 2.5 Flash (Recommended - Cloud)

**Benefits:**
- No local RAM usage during queries
- Fast responses (~5-15 seconds)
- Very cheap (~$0.001 per query)
- No model download required

**Setup:**
```bash
# 1. Add to ~/.zshrc (one-time setup)
export GEMINI_API_KEY="your-api-key"
alias leann-ask='OPENAI_API_KEY=$GEMINI_API_KEY leann ask --llm openai --model gemini-2.5-flash --api-base "https://generativelanguage.googleapis.com/v1beta/openai"'

# 2. Reload shell
source ~/.zshrc

# 3. Use the alias
leann-ask my-index "How does authentication work?"
```

**Or use CLI flags directly:**
```bash
OPENAI_API_KEY=$GEMINI_API_KEY leann ask my-index "query" \
  --llm openai \
  --model gemini-2.5-flash \
  --api-base "https://generativelanguage.googleapis.com/v1beta/openai"
```

#### Option B: Ollama with Qwen (Local)

**Benefits:**
- Completely offline/private
- No API costs
- No rate limits

**Drawbacks:**
- Uses significant RAM (~8GB for qwen3:8b)
- Requires model download (~5GB)
- Slower on modest hardware

**Setup:**
```bash
# 1. Install and pull model
brew services start ollama
ollama pull qwen3:8b

# 2. Use directly (default behavior)
leann ask my-index "How does authentication work?"
```

#### Comparison Table

| Feature | Gemini 2.5 Flash | Ollama (qwen3:8b) |
|---------|------------------|-------------------|
| **RAM Usage** | ~0 MB | ~8 GB |
| **Cost** | ~$0.001/query | Free |
| **Speed** | Fast (5-15s) | Varies by hardware |
| **Privacy** | Cloud (Google) | Fully local |
| **Setup** | API key only | Model download |
| **Offline** | No | Yes |

> **Recommendation**: Use **Gemini 2.5 Flash** for daily development (cheap, fast, no RAM). Use **Ollama** for offline work or privacy-sensitive projects.

#### Important: config.toml Limitation

The `~/.leann/config.toml` file's `[llm]` section is **not currently implemented** in the LEANN CLI. The CLI has hardcoded defaults (`--llm ollama --model qwen3:8b`). To use a different LLM, you must:
1. Use CLI flags (as shown above), OR
2. Use the shell alias (recommended)

### External Resources

- **GitHub Repository**: https://github.com/yichuan-w/LEANN
- **uv Documentation**: https://docs.astral.sh/uv/
- **MCP Protocol**: https://modelcontextprotocol.io
- **Ollama**: https://ollama.com

### Quick Reference

```bash
# Complete install sequence
brew install libomp boost protobuf zeromq pkgconf
uv tool install leann-core --with leann
source "$HOME/.local/bin/env"
leann build my-project --docs /path/to/project
leann search my-project "test query"

# Update LEANN
uv tool upgrade leann-core

# Reinstall if issues
uv tool uninstall leann-core
uv tool install leann-core --with leann
```

### Configuration Templates

**OpenCode - Local Setup (opencode.json):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_EMBEDDING": "Uses nomic-embed-text via Ollama (local)"
      },
      "enabled": true
    }
  }
}
```

**OpenCode - Cloud Setup with Gemini (opencode.json):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "GEMINI_API_KEY": "your-gemini-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key",
        "_NOTE_LLM": "Uses Gemini via API (cloud)"
      },
      "enabled": true
    }
  }
}
```

**Claude Code (.mcp.json):**
```json
{
  "mcpServers": {
    "leann": {
      "command": "/Users/YOUR_USERNAME/.local/bin/leann_mcp",
      "args": []
    }
  }
}
```

**Claude Desktop (claude_desktop_config.json):**
```json
{
  "mcpServers": {
    "leann": {
      "command": "/Users/YOUR_USERNAME/.local/bin/leann_mcp",
      "args": []
    }
  }
}
```

---

## Quick Start Summary

```bash
# 1. Prerequisites
brew install libomp boost protobuf zeromq pkgconf

# 2. Install LEANN
uv tool install leann-core --with leann
source "$HOME/.local/bin/env"

# 3. Build an index
leann build my-project --docs /path/to/your/project

# 4. Search
leann search my-project "your query here"

# 5. Configure MCP (add to opencode.json)
# See Configuration section above

# 6. Restart OpenCode and start using!
```

---

**Installation Complete!**

You now have LEANN MCP installed and configured. Use it to search your codebase semantically with 97% less storage than traditional vector databases.

Start searching by asking your AI assistant:
```
Use leann_search to find code that handles [your feature]
```

Or use the CLI directly:
```bash
leann search my-project "feature you're looking for"
```

For more information, refer to the GitHub repository: https://github.com/yichuan-w/LEANN
