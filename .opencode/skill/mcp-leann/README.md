# LEANN MCP - Semantic Code Search

The smallest vector index in the world. Semantic **CODE search** with 97% storage savings using graph-based selective recomputation. Uses MLX + Qwen3 embeddings on Apple Silicon. LEANN is a **Native MCP tool** - call it directly, not through Code Mode.

> **Navigation**:
> - New to LEANN? Start with [Quick Start](#2--quick-start)
> - Need tool guidance? See [Tool Selection Guide](#3--tool-selection-guide)
> - CLI reference? See [CLI Commands](#5--cli-commands)
> - Configuration help? See [Configuration](#6--configuration)

[![MCP](https://img.shields.io/badge/MCP-Native-brightgreen.svg)](https://modelcontextprotocol.io)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 🎯 TOOL SELECTION GUIDE](#3--tool-selection-guide)
- [4. 🔧 MCP TOOLS (5 TOTAL)](#4--mcp-tools-5-total)
- [5. 💻 CLI COMMANDS](#5--cli-commands)
- [6. ⚙️ CONFIGURATION](#6--configuration)
- [7. 🏗️ ARCHITECTURE](#7--architecture)
- [8. 📊 PERFORMANCE](#8--performance)
- [9. 💡 USAGE PATTERNS](#9--usage-patterns)
- [10. 🛠️ TROUBLESHOOTING](#10--troubleshooting)
- [11. 📚 RESOURCES](#11--resources)
- [12. 📋 QUICK REFERENCE CARD](#12--quick-reference-card)

---

## 1. 📖 OVERVIEW

### What It Does

LEANN (Lightweight Efficient Approximate Nearest Neighbor) provides semantic CODE search using graph-based vector indexing with selective recomputation. Instead of storing all embeddings (like traditional vector databases), LEANN stores only the graph structure and recomputes embeddings on-demand, achieving **97% storage savings**.

### Why LEANN?

Traditional vector databases store every embedding, consuming massive storage. LEANN takes a different approach: store the graph structure, recompute embeddings when needed. This trade-off provides:

- **97% smaller indexes** - A 1GB traditional index becomes ~30MB
- **Semantic understanding** - Find code by what it DOES, not what it's called
- **Apple Silicon optimized** - MLX embeddings run efficiently on M1/M2/M3

### Key Capabilities

| Feature                 | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **97% Storage Savings** | Selective recomputation vs storing all embeddings            |
| **Intent-Based Search** | Find code by meaning: "authentication flow" finds login code |
| **MLX + Qwen3**         | Memory-efficient embeddings on Apple Silicon                 |
| **Graph-Based Index**   | HNSW or DiskANN backends for fast approximate search         |
| **AST-Aware Chunking**  | Intelligent code splitting respecting syntax boundaries      |
| **Native MCP**          | Direct tool calls, not through Code Mode                     |
| **RAG Q&A**             | Ask questions with LLM-powered answers                       |

### Performance Comparison

| Metric           | Traditional Vector DB | LEANN            | Improvement           |
| ---------------- | --------------------- | ---------------- | --------------------- |
| **Storage Size** | 100% (all embeddings) | 3% (graph only)  | 97% reduction         |
| **Index Build**  | Fast                  | Moderate         | Trade-off             |
| **Search Speed** | Instant               | Fast (recompute) | Slight overhead       |
| **Memory Usage** | High                  | Low              | Significant reduction |

### What to Index

| Index This    | Don't Index This  | Use Instead             |
| ------------- | ----------------- | ----------------------- |
| `src/` folder | `specs/` folder   | Spec Kit Memory MCP     |
| Source code   | `.opencode/`      | Spec Kit Memory MCP     |
|               | `docs/` folder    | Grep or Spec Kit Memory |
|               | `node_modules/`   | Never index             |
|               | `dist/`, `build/` | Never index             |

> **IMPORTANT**: LEANN is for **CODE search only**. For document/spec search, use **Spec Kit Memory MCP** instead.

### Source Repository

| Property            | Value                                         |
| ------------------- | --------------------------------------------- |
| **Package**         | `leann-core` (PyPI)                           |
| **MCP Binary**      | `leann_mcp`                                   |
| **CLI**             | `leann`                                       |
| **License**         | MIT                                           |
| **Embedding Model** | `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` |

---

## 2. 🚀 QUICK START

### Prerequisites

| Component             | Purpose               | Install                                            |
| --------------------- | --------------------- | -------------------------------------------------- |
| **Python 3.10+**      | Runtime               | Pre-installed on macOS                             |
| **uv**                | Package manager       | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| **Homebrew deps**     | Native libraries      | See below                                          |
| **Ollama** (optional) | LLM for `ask` command | `brew install ollama`                              |

### Two Semantic Systems (DO NOT CONFUSE)

**IMPORTANT**: LEANN and Spec Kit Memory are COMPLETELY SEPARATE systems:

| System              | MCP Name          | Database Location                    | Purpose                  |
| ------------------- | ----------------- | ------------------------------------ | ------------------------ |
| **LEANN**           | `leann`           | `~/.leann/indexes/`                  | **Code** semantic search |
| **Spec Kit Memory** | `spec_kit_memory` | `.opencode/.../context-index.sqlite` | **Conversation** context |

- LEANN uses **MLX + Qwen3** for embeddings
- Spec Kit Memory uses **Ollama + nomic-embed-text** for embeddings
- They serve different purposes and should not be confused

### Installation Steps

```bash
# 1. Install Homebrew dependencies
brew install libomp boost protobuf zeromq pkgconf

# 2. Install LEANN with MLX support
uv tool install leann-core --with leann --with mlx --with mlx-lm

# 3. Add to PATH
source "$HOME/.local/bin/env"

# 4. Verify installation
leann --help
```

### Shell Alias Setup (REQUIRED)

Add this alias to use MLX + Qwen3 embeddings by default:

```bash
# Add to ~/.zshrc
echo 'alias leann-build='"'"'leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'"'"'' >> ~/.zshrc
source ~/.zshrc
```

### Optional: Ollama for Ask Command

```bash
# Install Ollama (only needed for 'ask' command LLM, NOT for embeddings)
brew install ollama
brew services start ollama
ollama pull qwen3:8b
```

### Build and Search

```bash
# Build index (src/ folder only)
leann-build my-project --docs /path/to/project/src

# Search for code by meaning
leann search my-project "authentication flow"

# Ask questions (requires Ollama)
leann ask my-project "How does the login system work?"

# List all indexes
leann list

# Remove an index
leann remove old-project
```

---

## 3. 🎯 TOOL SELECTION GUIDE

### Tools at a Glance

| Tool           | Purpose              | Speed | Use When                      |
| -------------- | -------------------- | ----- | ----------------------------- |
| `leann_search` | Find code by meaning | <1s   | Most common - semantic search |
| `leann_ask`    | RAG Q&A with LLM     | 2-10s | Need explained answers        |
| `leann_build`  | Create/rebuild index | 1-60s | New project or code changed   |
| `leann_list`   | Show all indexes     | <1s   | Check what's indexed          |
| `leann_remove` | Delete an index      | <1s   | Cleanup old indexes           |

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
┌────────┐  ┌─────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Find   │  │ Answer  │  │ Build  │  │ List   │  │ Remove │
│ code   │  │ question│  │ index  │  │ indexes│  │ index  │
└───┬────┘  └───┬─────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
leann_search  leann_ask   leann_build  leann_list  leann_remove
```

### When to Use LEANN vs Other Tools

**✅ USE LEANN for:**
- Finding code by what it DOES ("authentication logic")
- Understanding unfamiliar codebases
- Locating implementation patterns
- Semantic code discovery

**❌ DO NOT use LEANN for:**
- Finding exact text patterns → Use **Grep**
- Finding files by name → Use **Glob**
- Searching specs/docs → Use **Spec Kit Memory**
- Structural code queries → Use **Narsil** (via Code Mode)

### Code Search Tool Comparison

| Tool       | Type       | Query Example               | Best For             |
| ---------- | ---------- | --------------------------- | -------------------- |
| **LEANN**  | Semantic   | "How does auth work?"       | Understanding intent |
| **Narsil** | Structural | "List functions in auth.ts" | Symbol navigation    |
| **Grep**   | Lexical    | "TODO"                      | Exact text patterns  |

**Typical Workflow:**
1. **LEANN** → Understand what code does ("How does login work?")
2. **Narsil** → Map structure ("What functions are in this file?")
3. **Read** → Get implementation details

---

## 4. 🔧 MCP TOOLS (5 TOTAL)

### 4.1 leann_search

**Purpose**: Find code semantically by meaning/intent. Most commonly used tool.

**Parameters**:

| Parameter       | Type    | Required | Default | Description                        |
| --------------- | ------- | -------- | ------- | ---------------------------------- |
| `index_name`    | string  | Yes      | -       | Name of the index to search        |
| `query`         | string  | Yes      | -       | Natural language search query      |
| `top_k`         | number  | No       | 5       | Number of results to return (1-20) |
| `complexity`    | number  | No       | 32      | Search complexity (16-128)         |
| `show_metadata` | boolean | No       | false   | Include file paths in results      |

**Example**:
```javascript
leann_leann_search({
  index_name: "my-project",
  query: "error handling patterns",
  top_k: 10,
  show_metadata: true
});
```

**Returns**:
```json
{
  "results": [
    {
      "content": "try {\n  await fetchData();\n} catch (error) {\n  handleError(error);\n}",
      "score": 0.89,
      "metadata": {
        "file": "src/utils/api.js",
        "chunk_id": 42
      }
    }
  ]
}
```

---

### 4.2 leann_ask

**Purpose**: RAG-powered Q&A. Retrieves relevant code and generates an answer using an LLM.

**Parameters**:

| Parameter    | Type   | Required | Default    | Description                       |
| ------------ | ------ | -------- | ---------- | --------------------------------- |
| `index_name` | string | Yes      | -          | Name of the index                 |
| `question`   | string | Yes      | -          | Question to answer                |
| `llm`        | string | No       | "ollama"   | LLM provider (ollama, openai, hf) |
| `model`      | string | No       | "qwen3:8b" | Model name                        |
| `top_k`      | number | No       | 20         | Number of chunks to retrieve      |

**Example**:
```javascript
leann_leann_ask({
  index_name: "my-project",
  question: "How does the authentication system validate tokens?",
  top_k: 15
});
```

**Returns**:
```json
{
  "answer": "The authentication system validates tokens by...",
  "sources": [
    { "file": "src/auth/validator.js", "relevance": 0.92 }
  ]
}
```

> **Note**: Requires Ollama running with a model pulled (e.g., `ollama pull qwen3:8b`)

---

### 4.3 leann_build

**Purpose**: Create or rebuild a vector index from source code.

**Parameters**:

| Parameter         | Type    | Required | Default | Description                   |
| ----------------- | ------- | -------- | ------- | ----------------------------- |
| `index_name`      | string  | Yes      | -       | Name for the index            |
| `docs`            | string  | Yes      | -       | Path to source directory      |
| `embedding_mode`  | string  | No       | "mlx"   | Embedding backend             |
| `embedding_model` | string  | No       | Qwen3   | Model for embeddings          |
| `backend`         | string  | No       | "hnsw"  | Index backend (hnsw, diskann) |
| `file_types`      | string  | No       | all     | Filter by extension           |
| `force`           | boolean | No       | false   | Force rebuild                 |

**Example**:
```javascript
leann_leann_build({
  index_name: "my-project",
  docs: "./src",
  embedding_mode: "mlx",
  embedding_model: "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ",
  file_types: ".js,.ts,.py"
});
```

**Returns**:
```json
{
  "success": true,
  "index_name": "my-project",
  "documents_indexed": 156,
  "chunks_created": 1247
}
```

---

### 4.4 leann_list

**Purpose**: List all available indexes.

**Parameters**: None

**Example**:
```javascript
leann_leann_list();
```

**Returns**:
```json
{
  "indexes": [
    { "name": "my-project", "path": "~/.leann/indexes/my-project" },
    { "name": "other-project", "path": "~/.leann/indexes/other-project" }
  ]
}
```

---

### 4.5 leann_remove

**Purpose**: Delete an index.

**Parameters**:

| Parameter    | Type   | Required | Description             |
| ------------ | ------ | -------- | ----------------------- |
| `index_name` | string | Yes      | Name of index to remove |

**Example**:
```javascript
leann_leann_remove({ index_name: "old-project" });
```

**Returns**:
```json
{
  "success": true,
  "removed": "old-project"
}
```

---

## 5. 💻 CLI COMMANDS

### build

Create or rebuild a vector index.

```bash
leann build <index_name> --docs <path> [options]
```

**Key Options**:

| Option               | Default               | Description                                 |
| -------------------- | --------------------- | ------------------------------------------- |
| `--docs`             | `.`                   | Source directories/files (multiple allowed) |
| `--embedding-mode`   | sentence-transformers | mlx, ollama, openai, sentence-transformers  |
| `--embedding-model`  | facebook/contriever   | Model for embeddings                        |
| `--backend-name`     | hnsw                  | hnsw or diskann                             |
| `--file-types`       | all                   | Filter: `.js,.ts,.py`                       |
| `--force`            | false                 | Force rebuild                               |
| `--compact`          | true                  | Use compact storage (97% savings)           |
| `--use-ast-chunking` | false                 | AST-aware code chunking                     |

**Examples**:
```bash
# Basic build with alias (recommended)
leann-build my-project --docs src/

# Build with file type filter
leann-build my-project --docs src/ --file-types ".js,.ts,.py"

# Build with AST-aware chunking
leann-build my-project --docs src/ --use-ast-chunking

# Force rebuild
leann-build my-project --docs src/ --force
```

### search

Search for code semantically.

```bash
leann search <index_name> "<query>" [options]
```

**Key Options**:

| Option            | Default | Description                                |
| ----------------- | ------- | ------------------------------------------ |
| `--top-k`         | 5       | Number of results                          |
| `--complexity`    | 64      | Search complexity (higher = more accurate) |
| `--show-metadata` | false   | Show file paths                            |

**Examples**:
```bash
# Basic search
leann search my-project "authentication flow"

# More results with metadata
leann search my-project "error handling" --top-k 10 --show-metadata
```

### ask

Ask questions with RAG-powered answers.

```bash
leann ask <index_name> "<question>" [options]
```

**Key Options**:

| Option          | Default  | Description                       |
| --------------- | -------- | --------------------------------- |
| `--llm`         | ollama   | LLM provider (ollama, openai, hf) |
| `--model`       | qwen3:8b | Model name                        |
| `--interactive` | false    | Interactive chat mode             |
| `--top-k`       | 20       | Retrieval count                   |

**Examples**:
```bash
# Basic question
leann ask my-project "How does login work?"

# Interactive chat mode
leann ask my-project --interactive

# Use different model
leann ask my-project "Explain the API" --model llama3.2:8b
```

### list

List all indexes.

```bash
leann list
```

### remove

Delete an index.

```bash
leann remove <index_name>
```

---

## 6. ⚙️ CONFIGURATION

### Configuration Files

| File                | Purpose           | Location       |
| ------------------- | ----------------- | -------------- |
| `opencode.json`     | MCP server config | Project root   |
| `~/.zshrc`          | Shell alias       | Home directory |
| `~/.leann/indexes/` | Index storage     | Home directory |

### opencode.json Entry

```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic CODE search - index src/ folder only"
      },
      "enabled": true
    }
  }
}
```

### Environment Variables

| Variable                | Default                  | Description                  |
| ----------------------- | ------------------------ | ---------------------------- |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`       | Index storage location       |
| `LEANN_EMBEDDING_MODE`  | `mlx`                    | Default embedding provider   |
| `LEANN_EMBEDDING_MODEL` | Qwen3                    | Default embedding model      |
| `OLLAMA_HOST`           | `http://localhost:11434` | Ollama URL (for ask command) |
| `OPENAI_API_KEY`        | -                        | For OpenAI embeddings/LLM    |

### Embedding Modes

| Mode                    | Provider    | Best For                        | Notes                   |
| ----------------------- | ----------- | ------------------------------- | ----------------------- |
| `mlx`                   | Apple MLX   | **Apple Silicon (recommended)** | Qwen3 embeddings, fast  |
| `ollama`                | Ollama      | Cross-platform                  | Requires Ollama running |
| `openai`                | OpenAI API  | Cloud-based                     | Requires API key        |
| `sentence-transformers` | HuggingFace | CPU fallback                    | Default, slower         |

**Our Setup**: We use `mlx` with `Qwen3-Embedding-0.6B-4bit-DWQ` exclusively.

---

## 7. 🏗️ ARCHITECTURE

### System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    OpenCode / Claude Desktop                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │ MCP Protocol (stdio)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LEANN MCP Server                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Embedding Layer                         │  │
│  │  • MLX + Qwen3-Embedding-0.6B-4bit-DWQ                    │  │
│  │  • On-demand recomputation (not stored)                   │  │
│  │  • ~384 dimensions per chunk                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Graph Index Layer                       │  │
│  │  • HNSW (default) or DiskANN backend                      │  │
│  │  • Compact storage: graph structure only                  │  │
│  │  • 97% smaller than full embedding storage                │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Chunking Layer                          │  │
│  │  • Code: 512 tokens + 50 overlap                          │  │
│  │  • Docs: 256 tokens + 128 overlap                         │  │
│  │  • Optional: AST-aware chunking                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ~/.leann/indexes/<name>/
                    ├── documents.index      (graph structure)
                    ├── documents.ids.txt    (chunk IDs)
                    └── metadata.json        (index config)
```

### How LEANN Works

1. **Indexing (Build)**:
   - Chunk source files (code-aware or AST-aware)
   - Generate embeddings using MLX + Qwen3
   - Build graph index (HNSW or DiskANN)
   - Store graph structure only (discard embeddings)

2. **Searching**:
   - Embed the query using same model
   - Traverse graph to find approximate neighbors
   - Recompute embeddings for candidate chunks
   - Rank by similarity and return results

3. **Why Recomputation?**:
   - Embeddings are deterministic (same input = same output)
   - Graph structure captures relationships
   - Recomputing on-demand saves 97% storage
   - Trade-off: slightly slower search, massive space savings

### Storage Model

| Mode                  | Storage | Search Speed | Use Case         |
| --------------------- | ------- | ------------ | ---------------- |
| **Compact** (default) | 3%      | Fast         | Most projects    |
| **Full**              | 100%    | Fastest      | Latency-critical |

---

## 8. 📊 PERFORMANCE

### Storage Savings

| Project Size        | Traditional | LEANN (Compact) | Savings |
| ------------------- | ----------- | --------------- | ------- |
| Small (100 files)   | ~50MB       | ~1.5MB          | 97%     |
| Medium (1000 files) | ~500MB      | ~15MB           | 97%     |
| Large (10000 files) | ~5GB        | ~150MB          | 97%     |

### Search Speed

| Complexity | Speed  | Accuracy | Use When                |
| ---------- | ------ | -------- | ----------------------- |
| 16         | <100ms | Good     | Quick lookups           |
| 32         | <200ms | Better   | **Default recommended** |
| 64         | <500ms | Best     | Thorough search         |
| 128        | <1s    | Maximum  | Critical searches       |

### Chunking Options

| Type         | Chunk Size | Overlap    | Best For          |
| ------------ | ---------- | ---------- | ----------------- |
| **Code**     | 512 tokens | 50 tokens  | Source files      |
| **Document** | 256 tokens | 128 tokens | Markdown, text    |
| **AST**      | 300 chars  | 64 chars   | Syntax-aware code |

### Complexity Guidelines

| Workflow          | Recommended Complexity |
| ----------------- | ---------------------- |
| Quick exploration | 16-32                  |
| Normal search     | 32 (default)           |
| Thorough search   | 64                     |
| Maximum accuracy  | 128                    |

---

## 9. 💡 USAGE PATTERNS

### Pattern 1: Basic Code Search

```javascript
// Find authentication-related code
leann_leann_search({
  index_name: "my-project",
  query: "user authentication and login",
  top_k: 5
});
```

### Pattern 2: RAG Q&A

```javascript
// Ask a question about the codebase
leann_leann_ask({
  index_name: "my-project",
  question: "How does the API handle rate limiting?",
  top_k: 15
});
```

### Pattern 3: Filtered Search

```bash
# Build index with only JavaScript/TypeScript
leann-build my-project --docs src/ --file-types ".js,.ts,.jsx,.tsx"

# Search with more results
leann search my-project "state management" --top-k 15 --show-metadata
```

### Pattern 4: Multi-Project Workflow

```bash
# Index multiple projects
leann-build frontend --docs ./frontend/src
leann-build backend --docs ./backend/src
leann-build shared --docs ./shared/src

# Search across specific project
leann search frontend "form validation"
leann search backend "database queries"
```

### Pattern 5: Interactive Exploration

```bash
# Start interactive chat mode
leann ask my-project --interactive

# In interactive mode:
> How does authentication work?
> What about password reset?
> Show me the token validation logic
```

### Pattern 6: Cross-Tool Workflow

```javascript
// 1. Find relevant code with LEANN
const results = leann_leann_search({
  index_name: "my-project",
  query: "error handling middleware"
});

// 2. Read the specific file
Read({ filePath: results[0].metadata.file });

// 3. Use Narsil for structural analysis (via Code Mode)
call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({
      file: "src/middleware/error.js"
    });
    return symbols;
  `
});
```

---

## 10. 🛠️ TROUBLESHOOTING

### Common Errors

#### "Command not found: leann"

**Cause**: PATH not configured after installation

**Solution**:
```bash
source "$HOME/.local/bin/env"
# Or add to ~/.zshrc permanently
```

#### "No index found"

**Cause**: Index doesn't exist or wrong name

**Solution**:
```bash
# List available indexes
leann list

# Build if missing
leann-build my-project --docs src/
```

#### "Cannot connect to Ollama" (ask command)

**Cause**: Ollama not running

**Solution**:
```bash
brew services start ollama
ollama list  # Verify it's running
```

#### "MLX not available"

**Cause**: MLX not installed or not on Apple Silicon

**Solution**:
```bash
# Reinstall with MLX
uv tool install leann-core --with leann --with mlx --with mlx-lm --force

# Verify
python3 -c "import mlx; print('MLX OK')"
```

#### "Memory error during build"

**Cause**: Too many files or large files

**Solution**:
```bash
# Reduce scope with file type filter
leann-build my-project --docs src/ --file-types ".js,.ts,.py"

# Or use smaller chunk sizes
leann build my-project --docs src/ --code-chunk-size 256
```

#### "Search returns irrelevant results"

**Cause**: Query too vague or index needs rebuild

**Solution**:
```bash
# Use more specific queries
leann search my-project "JWT token validation in auth middleware"

# Increase complexity for better accuracy
leann search my-project "authentication" --complexity 64

# Rebuild index if code changed
leann-build my-project --docs src/ --force
```

### Diagnostic Commands

```bash
# Check LEANN is installed
leann --help

# List all indexes
leann list

# Check index contents
ls -la ~/.leann/indexes/<index-name>/

# Verify MLX
python3 -c "import mlx; print('MLX version:', mlx.__version__)"

# Check Ollama (for ask command)
ollama list
```

---

## 11. 📚 RESOURCES

### Bundled Files

| File                                                     | Purpose                         |
| -------------------------------------------------------- | ------------------------------- |
| [SKILL.md](./SKILL.md)                                   | AI agent instructions for LEANN |
| [references/tool_catalog.md](references/tool_catalog.md) | Detailed tool reference         |

### External Resources

- [LEANN on PyPI](https://pypi.org/project/leann-core/) - Package page
- [Ollama](https://ollama.com) - Local LLM for ask command
- [MLX](https://github.com/ml-explore/mlx) - Apple's ML framework

### Related Skills

| Skill                                               | Purpose                     | MCP Type   |
| --------------------------------------------------- | --------------------------- | ---------- |
| **[system-spec-kit](../system-spec-kit/README.md)** | Document/spec search        | Native MCP |
| **[mcp-narsil](../mcp-narsil/README.md)**           | Structural code queries     | Code Mode  |
| **[mcp-code-mode](../mcp-code-mode/README.md)**     | External tool orchestration | Native MCP |

### Cross-Skill Workflow

```javascript
// 1. Find relevant code using LEANN (Native MCP - call directly)
leann_leann_search({ index_name: "my-project", query: "authentication" });

// 2. Get structural info using Narsil (via Code Mode)
call_tool_chain({
  code: `
    const symbols = await narsil.narsil_find_symbols({
      file: "src/auth/login.js"
    });
    return symbols;
  `
});

// 3. Save context for future sessions (Native MCP)
// Use Spec Kit Memory to preserve decisions
```

---

## 12. 📋 QUICK REFERENCE CARD

### Essential Commands

```bash
# Shell alias (add to ~/.zshrc)
alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'

# Build index
leann-build <name> --docs src/

# Search
leann search <name> "query"

# Ask (requires Ollama)
leann ask <name> "question"

# List indexes
leann list

# Remove index
leann remove <name>
```

### MCP Tool Calls

```javascript
// Search (most common)
leann_leann_search({ index_name: "proj", query: "auth flow", top_k: 10 });

// Ask
leann_leann_ask({ index_name: "proj", question: "How does login work?" });

// Build
leann_leann_build({ index_name: "proj", docs: "./src" });

// List
leann_leann_list();

// Remove
leann_leann_remove({ index_name: "old-proj" });
```

### Key Points

| Point                  | Value                       |
| ---------------------- | --------------------------- |
| **Embedding Provider** | MLX + Qwen3 (Apple Silicon) |
| **What to Index**      | `src/` folder only          |
| **Storage Savings**    | 97% vs traditional          |
| **MCP Type**           | Native (NOT Code Mode)      |
| **For Documents**      | Use Spec Kit Memory instead |

---

**Remember**: LEANN is for **CODE search only** (src/ folder). Use **Spec Kit Memory MCP** for documents, specs, and conversation context.