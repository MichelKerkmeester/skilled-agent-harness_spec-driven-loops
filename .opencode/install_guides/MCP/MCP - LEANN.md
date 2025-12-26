# LEANN MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the LEANN (Lean ANNs) MCP server for ultra-efficient semantic code and document search with 97% storage savings.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Binary**: `~/.local/bin/leann_mcp` | **Dependencies**: Ollama + nomic-embed-text

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

## 1. 📖 OVERVIEW

LEANN (Lean ANNs) is an ultra-efficient MCP server for semantic search that achieves **97% storage savings** compared to traditional vector databases. It provides AI assistants with semantic code search and document RAG capabilities using state-of-the-art approximate nearest neighbor algorithms.

### Source Repository

| Property    | Value                                                 |
| ----------- | ----------------------------------------------------- |
| **GitHub**  | [yichuan-w/LEANN](https://github.com/yichuan-w/LEANN) |
| **PyPI**    | `leann-core`                                          |
| **Binary**  | `~/.local/bin/leann` and `~/.local/bin/leann_mcp`     |
| **License** | MIT                                                   |

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes. This prevents cascading failures.

### Key Features

| Feature                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| **97% Storage Savings** | Lean vector indices vs traditional vector DBs |
| **Self-Contained**      | No external database required                 |
| **AST-Aware Chunking**  | Intelligent code chunking with tree-sitter    |
| **Multiple Backends**   | HNSW (default), DiskANN for large-scale       |
| **Flexible Embeddings** | sentence-transformers, OpenAI, MLX, Ollama    |
| **RAG Q&A**             | Built-in LLM-powered question answering       |
| **MCP Native**          | First-class Model Context Protocol support    |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────────────────────────────────────────┘
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

| Feature          | LEANN          | Traditional Vector DB | Grep/Ripgrep |
| ---------------- | -------------- | --------------------- | ------------ |
| **Storage**      | 97% smaller    | Full vectors          | N/A          |
| **Query Type**   | Semantic       | Semantic              | Keywords     |
| **External DB**  | None required  | Required              | N/A          |
| **Setup**        | Single command | Multi-step            | Built-in     |
| **RAG Built-in** | Yes            | Usually no            | No           |

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

### Validation: `prerequisites_complete`

**Checklist:**
- [ ] Python 3.9+ installed
- [ ] uv package manager installed
- [ ] All Homebrew dependencies installed (libomp, boost, protobuf, zeromq, pkgconf)
- [ ] Ollama running with nomic-embed-text model (if using local embeddings)

**Quick Verification:**
```bash
python3 --version && uv --version && brew list libomp boost protobuf zeromq pkgconf >/dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"
```

**Ollama Verification (if using local embeddings):**
```bash
brew services list | grep -q "ollama.*started" && ollama list | grep -q nomic-embed-text && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Python version too old → `brew install python@3.11`
- Homebrew packages missing → `brew install libomp boost protobuf zeromq pkgconf`
- Ollama not running → `brew services start ollama && ollama pull nomic-embed-text`

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

### Validation: `binary_installation_complete`

**Checklist:**
- [ ] `leann --version` returns version 1.1.x
- [ ] `which leann` shows `~/.local/bin/leann`
- [ ] `which leann_mcp` shows `~/.local/bin/leann_mcp`

**Quick Verification:**
```bash
leann --version && which leann | grep -q ".local/bin/leann" && which leann_mcp | grep -q ".local/bin/leann_mcp" && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Command not found → `source "$HOME/.local/bin/env"` or check uv installation output

---

### Estimating Index Size Before Building

Before building an index, estimate the number of chunks to choose the right backend.

**Quick Estimate Script:**
```bash
# Count source files
FILES=$(find /path/to/project -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.md" \) | wc -l)

# Estimate chunks (avg 200 lines/file, 80 chars/line, 512 chars/chunk)
CHUNKS=$(echo "$FILES * 31" | bc)

# Recommend backend
echo "Files: $FILES"
echo "Estimated chunks: $CHUNKS"
if [ $CHUNKS -lt 100000 ]; then
  echo "Recommended backend: hnsw (faster, higher RAM)"
else
  echo "Recommended backend: diskann (slower, lower RAM)"
fi
```

**Rules of Thumb:**

| Project Size | Files  | Est. Chunks | Backend |
| ------------ | ------ | ----------- | ------- |
| Small        | <1K    | ~30K        | HNSW    |
| Medium       | 1K-3K  | ~30K-100K   | HNSW    |
| Large        | 3K-10K | ~100K-300K  | DiskANN |
| Enterprise   | 10K+   | 300K+       | DiskANN |

### Backend Selection Guide

| Backend     | Best For     | RAM Usage       | Build Time        | Query Speed |
| ----------- | ------------ | --------------- | ----------------- | ----------- |
| **HNSW**    | <100K chunks | Higher (~2-4GB) | Faster (minutes)  | Fastest     |
| **DiskANN** | >100K chunks | Lower (~500MB)  | Slower (10-30min) | Fast        |

**Decision Logic:**
- Default to `hnsw` for most projects
- Use `diskann` if RAM is constrained OR chunks exceed 100K
- Large monorepos almost always need `diskann`

---

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

| Option         | Values                                     | Default | Description          |
| -------------- | ------------------------------------------ | ------- | -------------------- |
| `--backend`    | hnsw, diskann                              | hnsw    | ANN algorithm        |
| `--embedding`  | ollama, sentence-transformers, openai, mlx | ollama  | Embedding provider   |
| `--chunk-size` | integer                                    | 512     | Characters per chunk |
| `--overlap`    | integer                                    | 50      | Chunk overlap        |

> **Recommended**: Use `--embedding ollama` with `nomic-embed-text` model for local-first operation.

### Validation: `index_built_complete`

**Checklist:**
- [ ] `leann list` shows your index
- [ ] `leann search <name> "test query"` returns results with file paths
- [ ] Results have similarity scores (0.0-1.0)

**Quick Verification:**
```bash
leann list | grep -q "my-project" && leann search my-project "main function" | grep -q "score" && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Index empty or no results → See Troubleshooting → "Index is empty after build"

---

## 4. ⚙️ CONFIGURATION

Connect LEANN to your AI assistant (Phase 4).

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

**Recommended Configuration (matches current production):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": [
        "/Users/YOUR_USERNAME/.local/bin/leann_mcp"
      ],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic code search with 97% less storage than traditional vector DBs",
        "_NOTE_EMBEDDING": "Uses nomic-embed-text via Ollama (local, no API costs)",
        "_NOTE_LLM_DEFAULT": "CLI defaults to qwen3:8b via Ollama (requires 'ollama pull qwen3:8b')",
        "_NOTE_LLM_GEMINI": "Use 'leann-ask' alias for Gemini 2.5 Flash (cloud, low RAM, cheap)",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username. Find it with `whoami`.

**Minimal Configuration (if you prefer brevity):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "enabled": true
    }
  }
}
```

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

### Validation: `configuration_complete`

**Checklist:**
- [ ] Configuration file has valid JSON syntax
- [ ] `leann_mcp` path in config matches actual binary location
- [ ] Username replaced with your actual username (not YOUR_USERNAME)

**Quick Verification:**
```bash
python3 -m json.tool < opencode.json > /dev/null 2>&1 && ls ~/.local/bin/leann_mcp > /dev/null 2>&1 && grep -q "$(whoami)" opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

**Common fixes:**
- Invalid JSON syntax → `python3 -m json.tool < opencode.json` to find syntax errors
- Binary path doesn't exist → `which leann_mcp` to find actual path and update config

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

### Validation: `end_to_end_verification_complete`

**Checklist:**
- [ ] MCP server appears in AI assistant's tool list
- [ ] `leann_list` shows your indexed projects
- [ ] `leann_search` returns results with file paths and scores
- [ ] No connection errors in responses

**Quick Verification:**
```bash
leann list && leann search my-project "test query" | grep -q "score" && echo "✅ PASS" || echo "❌ FAIL"
```

**AI Assistant Verification:**
Ask your assistant: "What LEANN tools are available?"
Expected: Lists `leann_build`, `leann_search`, `leann_ask`, `leann_list`, `leann_remove`

❌ **STOP if validation fails** - Fix before continuing.

**Common fixes:**
- MCP server not appearing → Restart AI client, check JSON syntax, verify binary path
- No results from search → Verify index exists with `leann list`, rebuild if needed

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

### OpenCode Index Commands (/search:index)

OpenCode provides wrapper commands for managing LEANN indexes directly from the chat interface.

| Command                                    | Description                | Underlying Action                  |
| ------------------------------------------ | -------------------------- | ---------------------------------- |
| `/search:index`                            | Show sync status dashboard | `leann list` + freshness check     |
| `/search:index update`                     | Update stale indexes       | Rebuilds out-of-date indexes       |
| `/search:index build <name> --docs <path>` | Build new index            | `leann build <name> --docs <path>` |
| `/search:index remove <name>`              | Delete index               | `leann remove <name>`              |

**Usage Examples:**

```
# Check which indexes need updating
/search:index

# Rebuild stale indexes automatically
/search:index update

# Build a new index for a project
/search:index build myapp --docs /path/to/myapp

# Remove an old index
/search:index remove old-project
```

**Sync Status Dashboard:**
When you run `/search:index` without arguments, it shows:
- Index name and location
- Last build timestamp
- File count and chunk count
- Freshness status (current / stale / missing)

> **Note**: These commands are OpenCode-specific. For CLI usage outside OpenCode, use `leann` commands directly.

### Backend Selection Guide

| Backend   | Best For      | Speed   | Memory |
| --------- | ------------- | ------- | ------ |
| `hnsw`    | < 100K chunks | Fastest | Higher |
| `diskann` | > 100K chunks | Fast    | Lower  |

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

**❌ "Cannot connect to Ollama" / Connection refused**
- **Cause**: Ollama service not running or wrong port.
- **Diagnostic Steps**:
  ```bash
  # 1. Check if Ollama is running
  brew services list | grep ollama
  
  # 2. Verify Ollama API is responding
  curl -s http://localhost:11434/api/tags
  
  # 3. Check if models are available
  ollama list
  ```
- **Fix**:
  ```bash
  # Start Ollama service
  brew services start ollama
  
  # Wait 5 seconds, then verify
  sleep 5 && curl -s http://localhost:11434/api/tags
  
  # If using custom host, set environment variable
  export OLLAMA_HOST="http://localhost:11434"
  ```

**❌ "Model 'qwen3:8b' not found" / "Model not found"**
- **Cause**: Required Ollama model not pulled.
- **Diagnostic Steps**:
  ```bash
  # Check which models are available
  ollama list
  
  # Check if specific model exists
  ollama show nomic-embed-text  # For embeddings
  ollama show qwen3:8b          # For LLM (ask command)
  ```
- **Fix** (Option A - Install required models):
  ```bash
  # For embeddings (REQUIRED)
  ollama pull nomic-embed-text
  
  # For LLM/RAG (optional, only for 'ask' command)
  ollama pull qwen3:8b
  ```
- **Fix** (Option B - Use Gemini for LLM, RECOMMENDED):
  ```bash
  # Add to ~/.zshrc (one-time)
  export GEMINI_API_KEY="your-api-key"
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

**❌ "Index is empty after build"**
- **Cause**: Build completed but no files were indexed.
- **Diagnostic Steps**:
  ```bash
  # 1. Check source path has indexable files
  find /path/to/source -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.md" \) | head -10
  
  # 2. Verify Ollama is running (embedding generation requires it)
  curl -s http://localhost:11434/api/tags | head -5
  # If no response: brew services start ollama
  
  # 3. Check index location for files
  ls -la ~/.leann/indexes/my-project/
  
  # 4. Rebuild with verbose output
  leann build my-project --docs /path/to/source --verbose 2>&1 | tail -50
  ```
- **Common Causes**:
  - Ollama not running → Embedding generation fails silently
  - No files match default extensions → Use `--include` flag
  - Permission denied → Check file permissions on source directory
  - Path doesn't exist → Verify path with `ls`

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

| Path                     | Purpose                        |
| ------------------------ | ------------------------------ |
| `~/.local/bin/leann`     | LEANN CLI binary               |
| `~/.local/bin/leann_mcp` | LEANN MCP server binary        |
| `~/.leann/`              | Default index storage location |
| `opencode.json`          | OpenCode MCP configuration     |
| `.mcp.json`              | Claude Code MCP configuration  |

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

| Provider              | Command                             | Notes                                         |
| --------------------- | ----------------------------------- | --------------------------------------------- |
| Ollama                | `--embedding ollama`                | **Recommended**, local, uses nomic-embed-text |
| sentence-transformers | `--embedding sentence-transformers` | Local, fast, good default                     |
| OpenAI                | `--embedding openai`                | Requires OPENAI_API_KEY, cloud                |
| Gemini                | N/A (via env vars)                  | Requires GEMINI_API_KEY, cloud                |
| MLX                   | `--embedding mlx`                   | Apple Silicon optimized                       |

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

| Feature       | Gemini 2.5 Flash | Ollama (qwen3:8b)  |
| ------------- | ---------------- | ------------------ |
| **RAM Usage** | ~0 MB            | ~8 GB              |
| **Cost**      | ~$0.001/query    | Free               |
| **Speed**     | Fast (5-15s)     | Varies by hardware |
| **Privacy**   | Cloud (Google)   | Fully local        |
| **Setup**     | API key only     | Model download     |
| **Offline**   | No               | Yes                |

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

**OpenCode - Recommended (opencode.json):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": [
        "/Users/YOUR_USERNAME/.local/bin/leann_mcp"
      ],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic code search with 97% less storage than traditional vector DBs",
        "_NOTE_EMBEDDING": "Uses nomic-embed-text via Ollama (local, no API costs)",
        "_NOTE_LLM_DEFAULT": "CLI defaults to qwen3:8b via Ollama (requires 'ollama pull qwen3:8b')",
        "_NOTE_LLM_GEMINI": "Use 'leann-ask' alias for Gemini 2.5 Flash (cloud, low RAM, cheap)",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

**OpenCode - Minimal (opencode.json):**
```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
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

### Quick Start Summary

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
