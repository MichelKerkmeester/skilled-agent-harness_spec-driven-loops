# LEANN Tool Catalog - Complete Command Reference

Complete reference for all 5 LEANN commands with parameters, examples, troubleshooting, and configuration options.

**Usage:** Use `leann --help` or `leann <command> --help` to discover commands dynamically. This catalog provides a comprehensive static reference.

---

## 1. 📖 HOW TO USE THIS CATALOG

**CLI discovery is faster than static reference:**

```bash
# Recommended: Dynamic discovery
leann --help                    # List all commands
leann build --help              # Get build parameters
leann search --help             # Get search parameters
leann ask --help                # Get ask parameters

# Quick verification
leann list                      # Show available indexes
```

**This catalog is useful for:**
- Understanding all available parameters
- Planning index configurations
- Troubleshooting common issues
- Quick reference when offline

---

## 2. 🗂️ AVAILABLE COMMANDS

| Command   | Purpose                    | Speed    | Use When                   |
| --------- | -------------------------- | -------- | -------------------------- |
| `build`   | Create vector index        | 1-60s    | Setting up semantic search |
| `search`  | Find content by meaning    | <1s      | Finding relevant code/docs |
| `ask`     | RAG Q&A with LLM           | 2-10s    | Answering questions        |
| `list`    | Show available indexes     | <1s      | Managing indexes           |
| `remove`  | Delete an index            | <1s      | Cleanup                    |

**Total:** 5 commands

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Query                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       LEANN CLI                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Command Layer                       │  │
│  │     build  |  search  |  ask  |  list  |  remove      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Embedding Layer                       │  │
│  │  sentence-transformers | OpenAI | MLX | Ollama        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Chunking Layer                        │  │
│  │    Document Chunking  |  AST-Aware Code Chunking      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vector Index                           │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   HNSW Backend      │  │    DiskANN Backend          │   │
│  │   (Default, Fast)   │  │    (Large Scale)            │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (for 'ask' command)
┌─────────────────────────────────────────────────────────────┐
│                         LLM Layer                           │
│       Ollama (default) | OpenAI | HuggingFace               │
└─────────────────────────────────────────────────────────────┘
```

### Command Flow

```
                    leann build
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  Documents/Code → Chunks → Embeddings  │
    │                    │                   │
    │                    ▼                   │
    │             Vector Index               │
    └────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    leann search    leann ask       leann list
         │               │               │
         ▼               ▼               ▼
    Ranked Results  LLM Answer     Index Info
```

---

## 3. 🔨 LEANN BUILD

**Purpose**: Create a vector index from documents or code files for semantic search.

### Basic Usage

```bash
leann build <index-name> --docs <path>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `index-name` | string | Yes | - | Name for the index |
| `--docs` | path(s) | Yes | - | Directories/files to index |
| `--backend-name` | string | No | `hnsw` | `hnsw` or `diskann` |
| `--embedding-model` | string | No | `facebook/contriever` | Embedding model name |
| `--embedding-mode` | string | No | `sentence-transformers` | Provider mode |
| `--force` | flag | No | false | Force rebuild existing index |
| `--graph-degree` | int | No | 32 | Graph connectivity |
| `--complexity` | int | No | 64 | Build complexity |
| `--compact` / `--no-compact` | flag | No | true | Compact index after build |
| `--recompute` / `--no-recompute` | flag | No | false | Recompute embeddings |
| `--file-types` | string | No | all | Filter by extensions |
| `--use-ast-chunking` | flag | No | false | AST-aware code chunking |
| `--doc-chunk-size` | int | No | 512 | Document chunk size |
| `--doc-chunk-overlap` | int | No | 50 | Document chunk overlap |
| `--code-chunk-size` | int | No | 1000 | Code chunk size |
| `--code-chunk-overlap` | int | No | 100 | Code chunk overlap |

### Embedding Providers

| Provider | Mode Flag | Model Example | Requirements |
|----------|-----------|---------------|--------------|
| **sentence-transformers** | `sentence-transformers` | `facebook/contriever` | Python, torch |
| **OpenAI** | `openai` | `text-embedding-3-small` | API key |
| **MLX** | `mlx` | `mlx-community/bge-small` | Apple Silicon |
| **Ollama** | `ollama` | `nomic-embed-text` | Ollama running |

### Backend Options

| Backend | Best For | Characteristics |
|---------|----------|-----------------|
| **HNSW** (default) | Most use cases | Fast, in-memory, good recall |
| **DiskANN** | Large datasets | Disk-based, scalable |

### AST Chunking

When `--use-ast-chunking` is enabled, LEANN parses code files using AST (Abstract Syntax Tree) to create semantically meaningful chunks based on functions, classes, and modules instead of arbitrary text splits.

**Supported languages**: Python, JavaScript, TypeScript, Rust, Go, Java

### Example Commands

```bash
# Basic document indexing
leann build my-docs --docs ./documents

# Code indexing with AST chunking
leann build my-code --docs ./src --use-ast-chunking --file-types ".js,.ts,.py"

# Using OpenAI embeddings
leann build openai-index --docs ./src \
  --embedding-mode openai \
  --embedding-model text-embedding-3-small

# Using Ollama embeddings
leann build ollama-index --docs ./src \
  --embedding-mode ollama \
  --embedding-model nomic-embed-text

# Large codebase with DiskANN
leann build large-project --docs ./src \
  --backend-name diskann \
  --use-ast-chunking \
  --graph-degree 64 \
  --complexity 128

# Force rebuild with custom chunk sizes
leann build my-index --docs ./src \
  --force \
  --doc-chunk-size 1024 \
  --doc-chunk-overlap 100 \
  --code-chunk-size 2000 \
  --code-chunk-overlap 200
```

---

## 4. 🔍 LEANN SEARCH

**Purpose**: Perform semantic search on an existing index to find relevant content.

### Basic Usage

```bash
leann search <index-name> "<query>"
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `index-name` | string | Yes | - | Name of index to search |
| `query` | string | Yes | - | Natural language query |
| `--top-k` | int | No | 5 | Number of results |
| `--complexity` | int | No | 64 | Search complexity |
| `--recompute` / `--no-recompute` | flag | No | false | Recompute query embedding |
| `--pruning-strategy` | string | No | `global` | Result pruning method |
| `--show-metadata` | flag | No | false | Show result metadata |

### Pruning Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| **global** (default) | Prune based on global similarity threshold | General use |
| **local** | Prune based on local neighborhood | Clustered data |
| **proportional** | Proportional to result count | Balanced results |

### Example Commands

```bash
# Basic search
leann search my-index "authentication logic"

# Get more results with metadata
leann search my-index "error handling" --top-k 20 --show-metadata

# High-precision search
leann search my-index "database connection" --complexity 128 --top-k 10

# Using local pruning
leann search my-index "API endpoints" --pruning-strategy local
```

### Example Output

```
Results for: "authentication logic"

1. [0.89] src/auth/login.ts:45-78
   User authentication with JWT token validation...

2. [0.82] src/middleware/auth.ts:12-34
   Authentication middleware for protected routes...

3. [0.76] src/utils/token.ts:8-25
   Token generation and verification utilities...

4. [0.71] src/auth/oauth.ts:56-89
   OAuth2 provider integration for social login...

5. [0.68] tests/auth/login.test.ts:10-45
   Unit tests for authentication flow...
```

---

## 5. 💬 LEANN ASK

**Purpose**: Answer questions using RAG (Retrieval-Augmented Generation) with an LLM.

### Basic Usage

```bash
leann ask <index-name> "<question>"
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `index-name` | string | Yes | - | Name of index to query |
| `question` | string | Yes* | - | Question to answer (*optional in interactive) |
| `--llm` | string | No | `ollama` | LLM provider |
| `--model` | string | No | `qwen3:8b` | Model name |
| `--interactive` | flag | No | false | Chat mode |
| `--top-k` | int | No | 20 | Context chunks to retrieve |
| `--thinking-budget` | string | No | `medium` | Reasoning depth |

### LLM Providers

| Provider | Flag Value | Model Examples | Requirements |
|----------|------------|----------------|--------------|
| **Ollama** (default) | `ollama` | `qwen3:8b`, `llama3.2`, `codellama` | Ollama running |
| **OpenAI** | `openai` | `gpt-4o`, `gpt-4o-mini` | API key |
| **HuggingFace** | `hf` | `meta-llama/Llama-3-8b` | HF token |
| **Simulated** | `simulated` | - | None (testing) |

### Thinking Budget

| Level | Description | Use When |
|-------|-------------|----------|
| `low` | Quick, minimal reasoning | Simple questions |
| `medium` (default) | Balanced reasoning | General questions |
| `high` | Deep analysis | Complex questions |

### Interactive Mode

Enable `--interactive` for a chat session with context persistence:

```bash
leann ask my-index --interactive --model qwen3:8b
```

In interactive mode:
- Type questions naturally
- Context is maintained between questions
- Type `exit` or `quit` to end session
- Type `clear` to reset context

### Example Commands

```bash
# Basic question
leann ask my-code "How does the authentication system work?"

# Using OpenAI
leann ask my-code "Explain the database schema" \
  --llm openai \
  --model gpt-4o-mini

# Deep analysis with more context
leann ask my-code "What are the security vulnerabilities?" \
  --thinking-budget high \
  --top-k 50

# Interactive chat session
leann ask my-code --interactive \
  --model llama3.2 \
  --top-k 30

# Quick answer with minimal reasoning
leann ask my-code "What is the main entry point?" \
  --thinking-budget low \
  --top-k 10
```

### Example Output

```
Question: How does the authentication system work?

Retrieving context from 20 chunks...

Answer:

The authentication system in this codebase uses JWT (JSON Web Tokens) 
for session management. Here's how it works:

1. **Login Flow** (src/auth/login.ts)
   - User submits credentials to /api/auth/login
   - Credentials are validated against the database
   - On success, a JWT token is generated with user claims

2. **Token Validation** (src/middleware/auth.ts)
   - Protected routes use authMiddleware
   - Token is extracted from Authorization header
   - JWT is verified using the secret key

3. **Session Management** (src/auth/session.ts)
   - Tokens expire after 24 hours
   - Refresh tokens are used for seamless renewal

Sources:
- src/auth/login.ts:45-78
- src/middleware/auth.ts:12-34
- src/auth/session.ts:8-42
```

---

## 6. 📋 LEANN LIST & REMOVE

### List Indexes

**Purpose**: Show all available indexes.

```bash
leann list
```

**Example Output:**

```
Available indexes:

  Name             Backend    Chunks    Created
  ─────────────────────────────────────────────
  my-code          hnsw       1,234     2024-12-20
  docs-index       hnsw       567       2024-12-19
  large-project    diskann    45,678    2024-12-18

Total: 3 indexes
```

### Remove Index

**Purpose**: Delete an index and free disk space.

```bash
leann remove <index-name>
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `index-name` | string | Yes | - | Name of index to remove |

**Example Commands:**

```bash
# Remove single index
leann remove old-index

# Remove with confirmation prompt
leann remove my-code
# > Are you sure you want to remove 'my-code'? (y/N): y
# > Index 'my-code' removed successfully.
```

---

## 7. ⚙️ CONFIGURATION

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LEANN_INDEX_DIR` | `~/.leann/indexes` | Index storage location |
| `LEANN_EMBEDDING_MODEL` | `nomic-embed-text` | Default embedding model (recommended) |
| `LEANN_EMBEDDING_MODE` | `ollama` | Default embedding provider (recommended) |
| `OPENAI_API_KEY` | - | Required for OpenAI embeddings/LLM |
| `GEMINI_API_KEY` | - | Required for Gemini LLM (recommended for `ask`) |
| `HF_TOKEN` | - | Required for HuggingFace models |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server URL |

### Embedding Model Options

| Provider | Popular Models | Dimensions |
|----------|----------------|------------|
| **Ollama** (recommended) | `nomic-embed-text`, `mxbai-embed-large` | 768, 1024 |
| **sentence-transformers** | `facebook/contriever`, `all-MiniLM-L6-v2` | 768, 384 |
| **OpenAI** | `text-embedding-3-small`, `text-embedding-3-large` | 1536, 3072 |
| **MLX** | `mlx-community/bge-small-en-v1.5` | 384 |

### LLM Model Options

| Provider | Recommended Models | Context Window |
|----------|-------------------|----------------|
| **Ollama** | `qwen3:8b`, `llama3.2`, `codellama:13b` | 8K-128K |
| **OpenAI** | `gpt-4o-mini`, `gpt-4o` | 128K |
| **HuggingFace** | `meta-llama/Llama-3.2-3B-Instruct` | 8K-128K |

### Configuration File

LEANN can use a configuration file at `~/.leann/config.toml`:

```toml
[defaults]
embedding_model = "facebook/contriever"
embedding_mode = "sentence-transformers"
backend = "hnsw"
top_k = 10

[llm]
provider = "ollama"
model = "qwen3:8b"

[build]
doc_chunk_size = 512
doc_chunk_overlap = 50
code_chunk_size = 1000
code_chunk_overlap = 100
```

### Configuration Paths

| Component | Location |
|-----------|----------|
| Indexes | `~/.leann/indexes/` |
| Config file | `~/.leann/config.toml` |
| Cache | `~/.leann/cache/` |
| Logs | `~/.leann/logs/` |

---

## 8. 🔧 TROUBLESHOOTING

### Index Not Found

**Problem**: `Index 'my-index' not found`

**What it means**: The specified index doesn't exist or is in a different location.

**Fix**:
```bash
# List available indexes
leann list

# Check index directory
ls ~/.leann/indexes/

# Rebuild if necessary
leann build my-index --docs ./src --force
```

### Embedding Model Error

**Problem**: `Failed to load embedding model` or `Model not found`

**What it means**: The embedding model couldn't be loaded.

**Fix**:
```bash
# For sentence-transformers (install model)
pip install sentence-transformers
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('facebook/contriever')"

# For Ollama
ollama pull nomic-embed-text

# For OpenAI (check API key)
echo $OPENAI_API_KEY
```

### No Results Found

**Problem**: Search returns empty results

**What it means**: Query doesn't match indexed content or index is empty.

**Fix**:
1. Verify index has content:
   ```bash
   leann list  # Check 'Chunks' column
   ```
2. Try broader query terms
3. Rebuild index with different settings:
   ```bash
   leann build my-index --docs ./src --force \
     --doc-chunk-size 256 \
     --doc-chunk-overlap 100
   ```

### Ollama Connection Error

**Problem**: `Connection refused` or `Ollama not responding`

**What it means**: Ollama server is not running.

**Fix**:
```bash
# Start Ollama
ollama serve

# Or on macOS with brew
brew services start ollama

# Verify it's running
curl http://localhost:11434/api/tags
```

### Import Errors

**Problem**: `ModuleNotFoundError` or missing dependencies

**What it means**: Required Python packages not installed.

**Fix**:
```bash
# Install LEANN with all dependencies
pip install leann[all]

# Or install specific extras
pip install leann[ollama]      # For Ollama support
pip install leann[openai]      # For OpenAI support
pip install leann[ast]         # For AST chunking
```

### Out of Memory

**Problem**: Process killed or memory error during indexing

**What it means**: Index too large for available RAM.

**Fix**:
```bash
# Use DiskANN for large datasets
leann build my-index --docs ./src \
  --backend-name diskann

# Or reduce chunk size
leann build my-index --docs ./src \
  --doc-chunk-size 256 \
  --code-chunk-size 500
```

### Slow Search Performance

**Problem**: Search takes too long

**What it means**: Index complexity too high or too many results.

**Fix**:
```bash
# Reduce search complexity
leann search my-index "query" --complexity 32 --top-k 5

# Compact the index
leann build my-index --docs ./src --compact
```

---

## 9. 📝 SUMMARY

**Total Commands:** 5 (build, search, ask, list, remove)

**Best practices:**
1. Build index before searching (`leann build`)
2. Use natural language queries, not grep syntax
3. Combine search results with Read tool for full context
4. Use `--use-ast-chunking` for code projects
5. Verify index exists with `leann list` before searching

**Remember:** LEANN is a **NATIVE MCP tool**. Call `leann_leann_build()`, `leann_leann_search()`, `leann_leann_ask()`, `leann_leann_list()`, `leann_leann_remove()` directly - do NOT use Code Mode's `call_tool_chain()`.

---

## 10. 🔗 RELATED RESOURCES

### Reference Files

- [SKILL.md](../SKILL.md) - AI agent instructions for LEANN integration
- [MCP - LEANN.md](../../../install_guides/MCP/MCP%20-%20LEANN.md) - Installation and setup guide

### External Resources

- [LEANN Repository](https://github.com/yichuan-w/LEANN) - Source code and documentation
- [LEANN Paper](https://arxiv.org/abs/2401.11511) - Research paper on selective recomputation
- [Ollama](https://ollama.com) - Local embedding and LLM models

### Related Skills

- **mcp-code-context** - Structural code queries for symbol navigation (NATIVE MCP)
- **system-memory** - Conversation context preservation (NATIVE MCP)
- **mcp-code-mode** - TypeScript execution for external MCP tools (Code Mode)

---

## ⚡ Quick Reference Card

### Essential Commands

```bash
# Build index from source code
leann build my-code --docs ./src --use-ast-chunking

# Search for code by intent
leann search my-code "authentication logic"

# Ask questions with RAG
leann ask my-code "How does error handling work?"

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

**Usage Complete!**

Start using LEANN by building an index:
```bash
leann build my-project --docs ./src --use-ast-chunking
```

Then search:
```bash
leann search my-project "your query"
```

**Need help?** See [Troubleshooting](#8-🔧-troubleshooting) or check the LEANN repository.
