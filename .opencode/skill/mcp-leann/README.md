# LEANN MCP - Semantic Code Search

Ultra-efficient semantic code and document search with **97% storage savings** through graph-based selective recomputation. LEANN is a **Native MCP tool** - call it directly, not through Code Mode.

> **Navigation**:
> - New to LEANN? Start with [Quick Start](#2--quick-start)
> - Need tool guidance? See [Tool Selection Guide](#3--tool-selection-guide)
> - Installation help? See [Install Guide](../../install_guides/MCP/MCP - LEANN.md)
> - Command reference? See [Tool Catalog](references/tool_catalog.md)

[![MCP](https://img.shields.io/badge/MCP-Native-brightgreen.svg)](https://modelcontextprotocol.io)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 🎯 TOOL SELECTION GUIDE](#3--tool-selection-guide)
- [4. 🔧 MCP TOOLS (5 TOTAL)](#4--mcp-tools-5-total)
- [5. 🏗️ ARCHITECTURE](#5--architecture)
- [6. 💬 LLM PROVIDERS](#6--llm-providers)
- [7. ⚙️ CONFIGURATION](#7--configuration)
- [8. 📁 INDEX MANAGEMENT](#8--index-management)
- [9. 📊 PERFORMANCE](#9--performance)
- [10. 🛠️ TROUBLESHOOTING](#10--troubleshooting)
- [11. 📚 RESOURCES](#11--resources)
- [12. 📋 QUICK REFERENCE CARD](#12--quick-reference-card)

---

## 1. 📖 OVERVIEW

### What It Does

LEANN (Lean ANNs) provides semantic search capabilities for code and documents through MCP integration. Unlike traditional vector databases that store all embeddings, LEANN uses **graph-based selective recomputation** to achieve massive storage savings while maintaining search quality.

### Key Capabilities

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **97% Storage Savings** | Selective recomputation vs storing all embeddings     |
| **Intent-Based Search** | Find code by what it does, not what it's called       |
| **AST-Aware Chunking**  | Smart code parsing for better results                 |
| **RAG Q&A Built-in**    | Answer questions using retrieved context              |
| **Multiple Backends**   | HNSW (fast, default) or DiskANN (large scale)         |
| **Local-First**         | Uses Ollama for embeddings - no external API required |
| **Native MCP**          | Direct tool calls, not through Code Mode              |

### How It Compares

| Feature          | LEANN         | Traditional Vector DB | Grep/Ripgrep |
| ---------------- | ------------- | --------------------- | ------------ |
| **Storage**      | 97% smaller   | Full vectors          | N/A          |
| **Query Type**   | Semantic      | Semantic              | Keywords     |
| **External DB**  | None required | Required              | N/A          |
| **RAG Built-in** | Yes           | Usually no            | No           |

### Storage Comparison

| Codebase Size | Traditional DB | LEANN   | Savings |
| ------------- | -------------- | ------- | ------- |
| 1,000 files   | ~500 MB        | ~15 MB  | 97%     |
| 10,000 files  | ~5 GB          | ~150 MB | 97%     |
| 100,000 files | ~50 GB         | ~1.5 GB | 97%     |

---

## 2. 🚀 QUICK START

### Prerequisites

| Component            | Purpose          | Install                                            |
| -------------------- | ---------------- | -------------------------------------------------- |
| **Python 3.9+**      | Core runtime     | `brew install python`                              |
| **uv**               | Package manager  | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| **Ollama**           | Local embeddings | `brew install ollama`                              |
| **nomic-embed-text** | Embedding model  | `ollama pull nomic-embed-text`                     |

### Shell Alias Setup (Recommended)

LEANN CLI doesn't support config files for embedding defaults. Use a shell alias for Qwen3:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'

# Reload shell
source ~/.zshrc
```

**Usage:**
```bash
# With alias (recommended)
leann-build myproject --docs src/
leann-build myproject --docs src/ --file-types ".js,.css,.html"

# Full command (equivalent)
leann build myproject --docs src/ --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
```

### 5-Minute Setup

```bash
# 1. Install dependencies
brew install libomp boost protobuf zeromq pkgconf

# 2. Install LEANN
uv tool install leann-core --with leann
source "$HOME/.local/bin/env"

# 3. Start Ollama (for LLM features)
brew services start ollama
ollama pull nomic-embed-text

# 4. Build your first index (Apple Silicon - recommended)
leann build my-project --docs /path/to/your/project/src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# 5. Test search
leann search my-project "authentication flow"
```

> **Apple Silicon Users**: The `--embedding-mode mlx` flag uses Apple's unified memory architecture for significantly better memory efficiency during indexing.

### Installation Guide

For complete installation instructions including MCP configuration, see:
**[MCP - LEANN Install Guide](../../install_guides/MCP/MCP - LEANN.md)**

---

## 3. 🎯 TOOL SELECTION GUIDE

### Tools at a Glance

| Tool           | Purpose             | Speed | Use When                   |
| -------------- | ------------------- | ----- | -------------------------- |
| `leann_build`  | Create vector index | 1-60s | Setting up semantic search |
| `leann_search` | Semantic similarity | <1s   | Finding relevant code/docs |
| `leann_ask`    | RAG Q&A with LLM    | 2-10s | Answering questions        |
| `leann_list`   | Show indexes        | <1s   | Managing indexes           |
| `leann_remove` | Delete index        | <1s   | Cleanup                    |

### Tool Selection Flowchart

```text
User Request
     │
     ▼
┌────────────────────────────────────────┐
│ What do you need to do?                │
└───────────────┬────────────────────────┘
                │
    ┌───────────┼───────────┬───────────┬───────────┐
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐  ┌────────┐
│ Create │  │ Find   │  │ Answer  │  │ List   │  │ Delete │
│ index  │  │ code   │  │ question│  │ indexes│  │ index  │
└───┬────┘  └───┬────┘  └───┬─────┘  └───┬────┘  └───┬────┘
    │           │           │            │           │
    ▼           ▼           ▼            ▼           ▼
leann_build  leann_search  leann_ask  leann_list  leann_remove
```

### Smart Routing Logic

```python
def route_leann_tool(task):
    # Index creation or rebuild
    if task.operation in ["create_index", "rebuild", "update_index"]:
        return leann_build(name, docs_path)
    
    # Find code/content by meaning
    if task.operation in ["find_code", "search", "semantic_lookup"]:
        return leann_search(index_name, query)
    
    # Answer questions about codebase
    if task.operation in ["question", "explain", "how_does"]:
        return leann_ask(index_name, question)
    
    # Check what indexes exist
    if task.operation in ["list", "show_indexes", "status"]:
        return leann_list()
    
    # Clean up old indexes
    if task.operation in ["delete", "remove", "cleanup"]:
        return leann_remove(index_name)
```

### Usage Patterns

#### Pattern 1: Code Discovery

```bash
# 1. Build index for project (Apple Silicon)
leann build my-project --docs ./src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# 2. Search by intent
leann search my-project "error handling patterns"

# 3. Read found files with Read tool for full context
```

#### Pattern 2: Codebase Q&A

```bash
# 1. Ensure index exists
leann list

# 2. Ask natural language question
leann ask my-project "How does authentication work?"

# 3. Follow up with specific searches
leann search my-project "JWT token validation"
```

#### Pattern 3: Multi-Project Search

```bash
# Build indexes for each project (Apple Silicon)
leann build frontend --docs /path/to/frontend/src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
leann build backend --docs /path/to/backend/src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# Search each independently
leann search frontend "login form component"
leann search backend "user session management"
```

---

## 4. 🔧 MCP TOOLS (5 TOTAL)

### 4.1 leann_build

**Purpose**: Create or update a vector index from documents/code.

**CLI Usage**:
```bash
leann build <name> --docs <path> [options]
```

**Parameters**:

| Parameter            | Type   | Required | Default | Description               |
| -------------------- | ------ | -------- | ------- | ------------------------- |
| `name`               | string | Yes      | -       | Unique name for the index |
| `--docs`             | path   | Yes      | -       | Directory to index        |
| `--backend`          | string | No       | hnsw    | `hnsw` or `diskann`       |
| `--embedding`        | string | No       | ollama  | Embedding provider        |
| `--use-ast-chunking` | flag   | No       | false   | AST-aware code chunking   |

**Examples**:
```bash
# Apple Silicon (RECOMMENDED) - Memory-efficient with MLX + Qwen3
leann build my-project --docs ./src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# Code project with AST chunking (Apple Silicon)
leann build my-code --docs ./src --file-types ".js,.ts" --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" --use-ast-chunking

# Large codebase with DiskANN + MLX
leann build large-project --docs ./src --file-types ".js,.ts" --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" --backend diskann
```

---

### 4.2 leann_search

**Purpose**: Semantic search within an indexed project.

**CLI Usage**:
```bash
leann search <name> "<query>" [options]
```

**Parameters**:

| Parameter         | Type   | Required | Default | Description                |
| ----------------- | ------ | -------- | ------- | -------------------------- |
| `name`            | string | Yes      | -       | Index name                 |
| `query`           | string | Yes      | -       | Natural language query     |
| `--top-k`         | int    | No       | 5       | Number of results          |
| `--complexity`    | int    | No       | 32      | Search complexity (16-128) |
| `--show-metadata` | flag   | No       | false   | Include file metadata      |

**Examples**:
```bash
# Basic search
leann search my-project "authentication logic"

# Get more results with metadata
leann search my-project "error handling" --top-k 20 --show-metadata

# High-precision search
leann search my-project "database connection" --complexity 64
```

**Example Output**:
```
Results for: "authentication logic"

1. [0.89] src/auth/login.ts:45-78
   User authentication with JWT token validation...

2. [0.82] src/middleware/auth.ts:12-34
   Authentication middleware for protected routes...

3. [0.76] src/utils/token.ts:8-25
   Token generation and verification utilities...
```

---

### 4.3 leann_ask

**Purpose**: RAG-powered question answering over your codebase.

**CLI Usage**:
```bash
leann ask <name> "<question>" [options]
```

**Parameters**:

| Parameter       | Type   | Required | Default  | Description                |
| --------------- | ------ | -------- | -------- | -------------------------- |
| `name`          | string | Yes      | -        | Index name                 |
| `question`      | string | Yes      | -        | Natural language question  |
| `--llm`         | string | No       | ollama   | LLM provider               |
| `--model`       | string | No       | qwen3:8b | Model name                 |
| `--top-k`       | int    | No       | 20       | Context chunks to retrieve |
| `--interactive` | flag   | No       | false    | Interactive chat mode      |

**Examples**:
```bash
# Basic question
leann ask my-project "How does authentication work?"

# With more context
leann ask my-project "What are the API endpoints?" --top-k 30

# Interactive session
leann ask my-project --interactive
```

**Using Gemini 2.5 Flash (Recommended)**:
```bash
# Use the shell alias (recommended)
leann-ask my-project "How does the login system work?"

# Or with explicit flags
OPENAI_API_KEY=$GEMINI_API_KEY leann ask my-project "query" \
  --llm openai \
  --model gemini-2.5-flash \
  --api-base "https://generativelanguage.googleapis.com/v1beta/openai"
```

---

### 4.4 leann_list

**Purpose**: Show all available indexes.

**CLI Usage**:
```bash
leann list
```

**Example Output**:
```
Available indexes:

  Name             Backend    Chunks    Created
  ─────────────────────────────────────────────
  my-code          hnsw       1,234     2024-12-20
  docs-index       hnsw       567       2024-12-19
  large-project    diskann    45,678    2024-12-18

Total: 3 indexes
```

---

### 4.5 leann_remove

**Purpose**: Delete an index and free disk space.

**CLI Usage**:
```bash
leann remove <name>
```

**Example**:
```bash
leann remove old-index
# → Index 'old-index' removed successfully.
```

---

## 5. 🏗️ ARCHITECTURE

### Graph-Based Selective Recomputation

The core innovation that enables 97% storage savings:

```text
Source Files ──► Text Chunking ──► Graph Index ──► Selective Storage
     │                │                 │                │
     ▼                ▼                 ▼                ▼
 Code/Docs      512-token chunks   HNSW/DiskANN    Only essential
                                   graph nodes    embeddings stored
                                                    (97% savings)
                     │
                     ▼
          ┌─────────────────────────────────┐
          │   SELECTIVE RECOMPUTATION       │
          │   Recompute embeddings          │
          │   on-demand during search       │
          └─────────────────────────────────┘
                     │
                     ▼
            Semantic Search Results
```

### Traditional vs LEANN Approach

**Traditional Approach:**
- Store ALL embeddings for ALL chunks
- Storage grows linearly with content size
- Fixed storage cost regardless of query patterns

**LEANN Approach:**
- Store only high-degree graph nodes (hub nodes)
- Recompute non-stored embeddings on-demand
- High-degree preserving pruning maintains search quality

```text
Traditional:   [E1] [E2] [E3] [E4] [E5] ... [E1000]  → Store all 1000

LEANN:         [E1] [ ] [E3] [ ] [ ] ... [E1000]    → Store ~30
               (hub)    (hub)            (hub)

On Query:      Recompute E2, E4, E5 only when needed
```

### System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ MCP Protocol (stdio)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LEANN MCP Server (Python)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      MCP Tools Layer                      │  │
│  │  leann_build | leann_search | leann_ask | leann_list      │  │
│  │                     leann_remove                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Embedding Layer                         │  │
│  │  sentence-transformers | OpenAI | MLX | Ollama            │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Chunking Layer                          │  │
│  │    Document Chunking  |  AST-Aware Code Chunking          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Lean Vector Index                          │
│  HNSW/DiskANN graph + Compressed vectors (97% smaller)          │
│  Storage: ~/.leann/indexes/                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (for 'ask' command)
┌─────────────────────────────────────────────────────────────────┐
│                         LLM Layer                               │
│       Ollama (default) | OpenAI | Gemini | HuggingFace          │
└─────────────────────────────────────────────────────────────────┘
```

### Embedding Mode Comparison

| Mode                  | Model                         | Memory  | Speed  | Quality   | Best For                   |
| --------------------- | ----------------------------- | ------- | ------ | --------- | -------------------------- |
| **mlx** (recommended) | Qwen3-Embedding-0.6B-4bit-DWQ | Low     | Fast   | MTEB 70.7 | Apple Silicon              |
| sentence-transformers | facebook/contriever           | High    | Medium | MTEB ~40  | Linux/Windows (fallback)   |
| openai                | text-embedding-3-small        | Minimal | Fast   | High      | Memory-constrained systems |
| ollama                | nomic-embed-text              | Medium  | Medium | Medium    | Local with flexibility     |

> **Why Qwen3-Embedding?** 50% better quality than Contriever (MTEB 70.7 vs ~40), trained on code (MTEB-Code 75.41), 32K context vs 512 tokens, native MLX support with 4-bit quantization, and actively maintained (Jun 2025).

> **Apple Silicon Users**: Use `--embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"` for best quality and memory efficiency.

### Backend Options

| Backend            | Best For       | Characteristics                 |
| ------------------ | -------------- | ------------------------------- |
| **HNSW** (default) | Most use cases | Fast queries, in-memory         |
| **DiskANN**        | Large datasets | Disk-based, scalable, lower RAM |

**Decision Logic:**
```text
IF project < 10K files:
  → Use "hnsw" (fastest, default)

IF project 10K-100K files:
  → Use "hnsw" with monitoring

IF project > 100K files OR memory constrained:
  → Use "diskann" (disk-based)
```

---

## 6. 💬 LLM PROVIDERS

The `leann ask` command uses an LLM to generate answers from retrieved context. You have two main options:

### Option A: Gemini 2.5 Flash (Recommended - Cloud)

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

### Option B: Ollama with Qwen (Local)

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

### Comparison Table

| Feature       | Gemini 2.5 Flash | Ollama (qwen3:8b)  |
| ------------- | ---------------- | ------------------ |
| **RAM Usage** | ~0 MB            | ~8 GB              |
| **Cost**      | ~$0.001/query    | Free               |
| **Speed**     | Fast (5-15s)     | Varies by hardware |
| **Privacy**   | Cloud (Google)   | Fully local        |
| **Setup**     | API key only     | Model download     |
| **Offline**   | No               | Yes                |

> **Recommendation**: Use **Gemini 2.5 Flash** for daily development (cheap, fast, no RAM). Use **Ollama** for offline work or privacy-sensitive projects.

### Important: config.toml Limitation

The `~/.leann/config.toml` file's `[llm]` section is **NOT currently implemented** in the LEANN CLI. The CLI has hardcoded defaults (`--llm ollama --model qwen3:8b`). To use a different LLM, you must:
1. Use CLI flags (as shown above), OR
2. Use the `leann-ask` shell alias (recommended)

---

## 7. ⚙️ CONFIGURATION

### Native MCP Configuration

**IMPORTANT**: LEANN is a **NATIVE MCP tool** - it's configured in `opencode.json`, NOT `.utcp_config.json`.

This is the same pattern as Sequential Thinking MCP:
- **Native MCP** (opencode.json) → Call directly: `leann_build()`, `leann_search()`, etc.
- **Code Mode MCP** (.utcp_config.json) → Call via `call_tool_chain()`: Webflow, ClickUp, Figma, etc.

**DO NOT** try to call LEANN through Code Mode's `call_tool_chain()`.

### opencode.json Configuration

```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic code search with 97% less storage than traditional vector DBs",
        "_NOTE_LLM_DEFAULT": "CLI defaults to qwen3:8b via Ollama for 'ask' command",
        "_NOTE_LLM_GEMINI": "Use 'leann-ask' shell alias for Gemini 2.5 Flash (no RAM, cheap)",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username. Find it with `whoami`.

### Environment Variables

| Variable                | Default                                       | Description                                            |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------ |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`                            | Index storage location                                 |
| `LEANN_EMBEDDING_MODE`  | `mlx`                                         | Embedding provider (mlx recommended for Apple Silicon) |
| `LEANN_EMBEDDING_MODEL` | `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` | Embedding model (Qwen3 for Apple Silicon)              |
| `OLLAMA_HOST`           | `http://localhost:11434`                      | Ollama server URL                                      |
| `OPENAI_API_KEY`        | -                                             | Required for OpenAI embeddings/LLM                     |
| `GEMINI_API_KEY`        | -                                             | Required for Gemini LLM                                |

### File Locations

| Path                     | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `~/.local/bin/leann`     | LEANN CLI binary                                    |
| `~/.local/bin/leann_mcp` | LEANN MCP server binary                             |
| `~/.leann/indexes/`      | Index storage location                              |
| `~/.leann/config.toml`   | Configuration (embedding only, LLM not implemented) |

---

## 8. 📁 INDEX MANAGEMENT

### Building Indexes

**When to build:**
- First time indexing a project
- After significant code changes
- When switching embedding providers

```bash
# Apple Silicon (RECOMMENDED) - Memory-efficient with MLX + Qwen3
leann build my-project --docs ./src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# With AST chunking (recommended for code)
leann build my-code --docs ./src --file-types ".js,.ts" --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" --use-ast-chunking

# Force rebuild
leann build my-project --docs ./src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" --force
```

### Memory-Efficient Indexing

Use **progressive scope indexing** to prevent memory issues:

| File Count   | Recommendation     | Action                                      |
| ------------ | ------------------ | ------------------------------------------- |
| <2,000       | Normal             | Proceed with default settings               |
| 2,000-5,000  | Suggest reduction  | Use `--docs src/` or file type filters      |
| 5,000-10,000 | Strongly recommend | Use scope reduction + MLX embedding mode    |
| >10,000      | Warning            | Use DiskANN backend + scope reduction + MLX |

**Memory Escape Hatches** (in priority order):
1. **Primary**: Use `--embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"` (Apple Silicon)
2. **Secondary**: Reduce scope with `--file-types` filter
3. **Tertiary**: Use `--embedding-mode openai` to offload to cloud

### Rebuilding Indexes

**When to rebuild:**
- Source files changed significantly
- Embedding model changed
- Search quality degraded

```bash
# Rebuild with same settings
leann build my-project --docs ./src --force

# Rebuild with different settings
leann remove my-project
leann build my-project --docs ./src --backend diskann
```

### Listing and Removing

```bash
# List all indexes
leann list

# Remove specific index
leann remove old-project

# Remove and rebuild
leann remove my-project && leann build my-project --docs ./src
```

### Index Hygiene

| Task               | Frequency           | Command                    |
| ------------------ | ------------------- | -------------------------- |
| **List indexes**   | Weekly              | `leann list`               |
| **Remove unused**  | Monthly             | `leann remove old-index`   |
| **Rebuild active** | After major changes | `leann build --force`      |
| **Check storage**  | Monthly             | `du -sh ~/.leann/indexes/` |

---

## 9. 📊 PERFORMANCE

### Target Metrics

| Operation                | Target | Typical |
| ------------------------ | ------ | ------- |
| **Index build** (small)  | <30s   | ~15s    |
| **Index build** (medium) | 1-2min | ~60s    |
| **Search**               | <1s    | ~200ms  |
| **Ask** (local LLM)      | 5-30s  | ~10s    |
| **Ask** (Gemini)         | 2-10s  | ~5s     |
| **List**                 | <1s    | ~50ms   |
| **Remove**               | <1s    | ~100ms  |

### Memory Usage

| Component                | Memory       |
| ------------------------ | ------------ |
| LEANN CLI                | ~50MB        |
| Embedding model (Ollama) | ~200MB       |
| LLM (qwen3:8b)           | ~8GB         |
| LLM (Gemini)             | ~0MB (cloud) |

### Optimization Tips

1. **Use MLX for embeddings** (Apple Silicon) - Uses unified memory, most efficient
2. **Use Gemini for RAG** - No RAM usage, cheap, fast
3. **Use AST chunking for code** - Better semantic chunks
4. **Use progressive scope indexing** - Start with `src/` directory, add file type filters
5. **Use DiskANN for large projects** - Lower memory usage
6. **Rebuild indexes sparingly** - Only when needed

---

## 10. 🛠️ TROUBLESHOOTING

### Common Errors

**"Command not found: leann"**
```bash
source "$HOME/.local/bin/env"
# Or add to ~/.zshrc: export PATH="$HOME/.local/bin:$PATH"
```

**"No index found: <name>"**
```bash
leann list  # Check what indexes exist
leann build <name> --docs /path/to/source
```

**"Cannot connect to Ollama"**
```bash
brew services start ollama
ollama list  # Verify models are pulled
```

**"Model 'qwen3:8b' not found"**
```bash
# Option A: Install local model
ollama pull qwen3:8b

# Option B: Use Gemini instead (RECOMMENDED)
# Set up leann-ask alias (see LLM Providers section)
leann-ask my-index "your question"
```

**"MCP server not appearing in tools"**
1. Check configuration file syntax:
   ```bash
   python3 -m json.tool < opencode.json
   ```
2. Verify binary path exists:
   ```bash
   ls -la ~/.local/bin/leann_mcp
   ```
3. Restart OpenCode completely

**"Index is empty / no results"**
```bash
# Rebuild with verbose output
leann build my-project --docs /path/to/source --verbose

# Check source path has files
ls /path/to/source
```

### Diagnostic Commands

```bash
# Check LEANN installation
leann --version
which leann
which leann_mcp

# List indexes
leann list

# Test embedding model
leann build test-index --docs ./README.md
leann search test-index "test query"
leann remove test-index

# Check Ollama (if using)
ollama list
curl http://localhost:11434/api/tags
```

---

## 11. 📚 RESOURCES

### Bundled Files

| File                                                     | Purpose                                        |
| -------------------------------------------------------- | ---------------------------------------------- |
| [SKILL.md](./SKILL.md)                                   | AI agent instructions for LEANN integration    |
| [references/tool_catalog.md](references/tool_catalog.md) | Complete command reference with all parameters |

### Installation

**Full installation guide**: [MCP - LEANN.md](../../install_guides/MCP/MCP - LEANN.md)

### External Resources

- [LEANN Repository](https://github.com/yichuan-w/LEANN) - Source code and documentation
- [LEANN Paper](https://arxiv.org/abs/2401.11511) - Research paper on selective recomputation
- [Ollama](https://ollama.com) - Local embedding and LLM models
- [uv Documentation](https://docs.astral.sh/uv/) - Python package manager

### Related Skills

| Skill                                               | Purpose                            | MCP Type   |
| --------------------------------------------------- | ---------------------------------- | ---------- |
| **[system-spec-kit](../system-spec-kit/README.md)** | Conversation context preservation  | Native MCP |
| **[mcp-code-mode](../mcp-code-mode/README.md)**     | External MCP tools (Webflow, etc.) | Code Mode  |

### Cross-Skill Workflow

```bash
# 1. Find relevant code using LEANN
leann search my-project "authentication flow"

# 2. Read the full files found
# (Use Read tool on identified files)

# 3. Save context for future sessions
# (Use spec_kit_memory to preserve decisions)
```

---

## 12. 📋 QUICK REFERENCE CARD

### Essential Commands

```bash
# Build index from source code (Apple Silicon - recommended)
leann build my-code --docs ./src --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" --use-ast-chunking

# Build index (Linux/Windows - fallback with Contriever)
leann build my-code --docs ./src --embedding-mode sentence-transformers --embedding-model "facebook/contriever" --use-ast-chunking

# Search for code by intent
leann search my-code "authentication logic"

# Ask questions with RAG (using Gemini)
leann-ask my-code "How does error handling work?"

# Interactive Q&A session
leann ask my-code --interactive

# List all indexes
leann list

# Remove an index
leann remove old-index
```

### Verification Commands

```bash
# Check LEANN installation
leann --version
which leann
which leann_mcp

# List indexes
leann list

# Quick test
leann build test --docs ./README.md
leann search test "test"
leann remove test
```

---

**Remember**: LEANN is a **NATIVE MCP tool**. Call `leann_build()`, `leann_search()`, `leann_ask()` directly - do NOT use Code Mode's `call_tool_chain()`. LEANN provides efficient semantic search with 97% storage savings through graph-based selective recomputation.
