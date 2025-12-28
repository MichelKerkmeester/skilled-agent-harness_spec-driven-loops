---
name: mcp-leann
description: "Lightweight vector database providing semantic CODE search with 97% storage savings. Uses MLX + Qwen3 embeddings on Apple Silicon. Index src/ folder only - use Spec Kit Memory for documents."
allowed-tools: [leann_leann_build, leann_leann_search, leann_leann_ask, leann_leann_list, leann_leann_remove]
version: 1.2.0
---

<!-- Keywords: leann, semantic-search, vector-database, rag, embeddings, code-search, mlx, qwen3, apple-silicon, native-mcp -->

# MCP LEANN - Semantic Code Search

Lightweight vector database for **semantic CODE search** on Apple Silicon. Uses MLX + Qwen3 embeddings for local, memory-efficient indexing. LEANN is a **NATIVE MCP tool** - call it directly, not through Code Mode.

> **IMPORTANT**: LEANN is for **CODE search only** (index `src/` folder). For document/spec search, use **Spec Kit Memory MCP** instead.

---

## 1. 🎯 WHEN TO USE

### Use LEANN When

**For semantic CODE search only**:
- ✅ Searching code by intent ("Find code that handles user login")
- ✅ Understanding how code works ("How does authentication flow?")
- ✅ Building searchable index for `src/` folder
- ✅ RAG Q&A about your codebase

**Benefits**:
- 🚀 **97% storage savings** - Selective recomputation vs storing all embeddings
- ⚡ **Intent-based search** - Find by what code does, not what it's called
- 🔗 **Local-first** - MLX + Qwen3 runs entirely on your Mac
- 🛡️ **Memory-efficient** - 4-bit quantized model won't crash your Mac

### Do NOT Use LEANN For

| Don't Index         | Use Instead                |
| ------------------- | -------------------------- |
| `specs/` folder     | Spec Kit Memory MCP        |
| `.opencode/` folder | Spec Kit Memory MCP        |
| `docs/` folder      | Grep or Spec Kit Memory    |
| `node_modules/`     | Never index                |
| Known file paths    | Read tool                  |
| Exact patterns      | Grep tool                  |
| Symbol navigation   | mcp-narsil (via Code Mode) |

> **Why src/ only?** Smaller index = faster search, less memory, better relevance. Use Spec Kit Memory for conversation context and documentation.

### Common Use Cases

| Scenario                     | LEANN Approach                                                       | Benefit                   |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------- |
| **Find authentication code** | `leann_leann_search({ query: "user login handling" })`               | Intent-based, not keyword |
| **Understand a codebase**    | `leann_leann_ask({ question: "How does payment processing work?" })` | RAG-powered explanation   |
| **Index project code**       | `leann_leann_build({ index_name: "my-project", docs: "./src" })`     | Fast semantic search      |
| **Code exploration**         | `leann_leann_ask({ question: "What are the main API endpoints?" })`  | Codebase discovery        |

---

## 2. 🧭 SMART ROUTING

### Activation Detection
```
TASK CONTEXT
    │
    ├─► User asks "find code that..." or "search for..."
    │   └─► ACTIVATE leann_search for semantic discovery
    │
    ├─► User asks "how does X work?" or "explain..."
    │   └─► ACTIVATE leann_ask for RAG Q&A
    │
    ├─► User needs to index a folder or codebase
    │   └─► ACTIVATE leann_build for index creation
    │
    ├─► User mentions "LEANN", "semantic search", "vector index"
    │   └─► ACTIVATE this skill
    │
    ├─► Known exact file path or symbol
    │   └─► Use Read/Grep tools directly, skip LEANN
    │
    └─► Need dependency or architecture analysis
        └─► Use mcp-narsil (via Code Mode) or Grep, not LEANN
```

### Resource Router
```python
def route_leann_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # INSTALLATION GUIDE
    # Purpose: Complete setup instructions for LEANN MCP server
    # Key Insight: Simple setup - just install leann and configure MCP
    # ──────────────────────────────────────────────────────────────────
    if task.needs_installation or task.setup_required:
        return load("../../install_guides/MCP/MCP - LEANN.md")  # Full installation workflow

    # ──────────────────────────────────────────────────────────────────
    # TOOL CATALOG
    # Purpose: Detailed parameters, examples, response structures
    # Key Insight: 5 commands - build, search, ask, list, remove
    # ──────────────────────────────────────────────────────────────────
    if task.needs_tool_details or task.unfamiliar_with_parameters:
        return load("references/tool_catalog.md")  # Complete command reference

    # ──────────────────────────────────────────────────────────────────
    # COMMAND SELECTION
    # Purpose: Route to correct leann command based on task type
    # Key Insight: Tool choice is determined by the operation needed
    # ──────────────────────────────────────────────────────────────────
    if task.operation == "create_index" or task.operation == "rebuild":
        return use_tool("leann_build")  # Index creation

    if task.operation == "find_code" or task.operation == "search_content":
        return use_tool("leann_search")  # Semantic search

    if task.operation == "question" or task.operation == "explain":
        return use_tool("leann_ask")  # RAG Q&A

    if task.operation == "list_indexes" or task.operation == "check_status":
        return use_tool("leann_list")  # Index management

    if task.operation == "delete_index" or task.operation == "cleanup":
        return use_tool("leann_remove")  # Index removal

    # ══════════════════════════════════════════════════════════════════════
    # STATIC RESOURCES (always available, not conditionally loaded)
    # ══════════════════════════════════════════════════════════════════════
    # references/tool_catalog.md → Complete command reference with all parameters
    # ../../install_guides/MCP/MCP - LEANN.md → Installation and setup guide
```

---

## 3. 🛠️ HOW IT WORKS

### LEANN Architecture

Unlike traditional vector databases that store all embeddings, LEANN uses graph-based selective recomputation:

```
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

### Graph-Based Selective Recomputation

The core innovation that enables 97% storage savings:

**Traditional Approach:**
- Store ALL embeddings for ALL chunks
- Storage grows linearly with content size
- Fixed storage cost regardless of query patterns

**LEANN Approach:**
- Store only high-degree graph nodes (hub nodes)
- Recompute non-stored embeddings on-demand
- High-degree preserving pruning maintains search quality

```
Traditional:   [E1] [E2] [E3] [E4] [E5] ... [E1000]  → Store all 1000

LEANN:         [E1] [ ] [E3] [ ] [ ] ... [E1000]    → Store ~30
               (hub)    (hub)            (hub)

On Query:      Recompute E2, E4, E5 only when needed
```

### The 5 LEANN Commands

> **Note:** LEANN MCP tools use the pattern `leann_leann_{command}` where the first `leann` is the MCP server name and the second is the tool namespace. This is standard MCP naming convention.

| Command              | Purpose                 | Input                    |
| -------------------- | ----------------------- | ------------------------ |
| `leann_leann_build`  | Create searchable index | Directory path, options  |
| `leann_leann_search` | Semantic similarity     | Query string, index name |
| `leann_leann_ask`    | RAG Q&A with LLM        | Question, index name     |
| `leann_leann_list`   | Show available indexes  | None                     |
| `leann_leann_remove` | Delete an index         | Index name               |

### Quick Examples

```javascript
// Build index for src/ folder (ALWAYS use src/ only)
leann_leann_build({ index_name: "my-project", docs: "./src", embedding_mode: "mlx", embedding_model: "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" })

// Search for code by intent
leann_leann_search({ index_name: "my-project", query: "error handling logic" })

// Ask questions about the codebase
leann_leann_ask({ index_name: "my-project", question: "How does authentication work?" })

// List all indexes
leann_leann_list()

// Remove an index
leann_leann_remove({ index_name: "my-project" })
```

### Storage Comparison

| Codebase Size | Traditional DB | LEANN   | Savings |
| ------------- | -------------- | ------- | ------- |
| 1,000 files   | ~500 MB        | ~15 MB  | 97%     |
| 10,000 files  | ~5 GB          | ~150 MB | 97%     |
| 100,000 files | ~50 GB         | ~1.5 GB | 97%     |

---

## 4. 🏗️ PROJECT CONFIGURATION

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
      "command": ["/Users/username/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic code search with 97% less storage than traditional vector DBs",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

> **Important**: After updating the LEANN binary, you must **restart OpenCode** for changes to take effect.

### How to Verify LEANN is Working

```bash
# Check LEANN CLI is installed
leann --help

# Check MCP server is running (in OpenCode)
# The leann_leann_* tools should appear in available tools
```

```javascript
// Quick verification test (MCP function calls)
leann_leann_build({ index_name: "test-index", docs: "./README.md" })
leann_leann_search({ index_name: "test-index", query: "test query" })
leann_leann_remove({ index_name: "test-index" })
```

### Environment Variables

| Variable                | Default                                       | Description                               |
| ----------------------- | --------------------------------------------- | ----------------------------------------- |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`                            | Index storage location                    |
| `LEANN_EMBEDDING_MODEL` | `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` | Embedding model (Qwen3 for Apple Silicon) |
| `LEANN_EMBEDDING_MODE`  | `mlx`                                         | Embedding provider (mlx only)             |
| `OLLAMA_HOST`           | `http://localhost:11434`                      | Ollama server URL (for ask command LLM)   |

### Embedding Configuration

**MLX + Qwen3 is the ONLY supported embedding mode.**

| Provider        | Mode  | Model                         | Memory | Quality   |
| --------------- | ----- | ----------------------------- | ------ | --------- |
| **MLX + Qwen3** | `mlx` | Qwen3-Embedding-0.6B-4bit-DWQ | Low    | MTEB 70.7 |

> **Why Qwen3-Embedding?** 50% better quality than alternatives (MTEB 70.7), trained on code (MTEB-Code 75.41), 32K context, native MLX support with 4-bit quantization, and won't crash your Mac.

### Shell Alias Setup (Required)

```bash
# Add to ~/.zshrc
alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'

# Reload shell
source ~/.zshrc
```

**Usage:**
```bash
# Index your project's src/ folder (ALWAYS src/ only)
leann-build myproject --docs src/
```

### Prerequisites

| Component | Purpose             | Install Command                                                    |
| --------- | ------------------- | ------------------------------------------------------------------ |
| LEANN CLI | Core functionality  | `uv tool install leann-core --with leann --with mlx --with mlx-lm` |
| leann_mcp | MCP server binary   | Built with LEANN                                                   |
| qwen3:8b  | LLM for ask command | `ollama pull qwen3:8b`                                             |

---

## 5. 📋 RULES

### ✅ ALWAYS

- **Build an index before searching** - Required for all search and ask operations
- **Use natural language queries** - Describe what you're looking for by intent
- **Choose the correct command** - build/search/ask/list/remove for each task type
- **Verify index exists** - Use `leann list` before searching
- **Combine with Read tool** - LEANN finds results, Read provides full context
- **Check Ollama is running** - Required for LLM in ask command (not for embeddings - MLX handles those)
- **Use MLX on Apple Silicon** - Use `--embedding-mode mlx` for memory-efficient indexing
- **Start with smallest scope** - Use progressive scope indexing (see Memory-Efficient Indexing below)

### ❌ NEVER

- **Use for known file paths** - Use Read tool instead (faster, no overhead)
- **Use for exact symbol searches** - Use Grep tool instead (more precise)
- **Use grep/find syntax in queries** - LEANN expects natural language
- **Search without an index** - All search operations require pre-built index
- **Expect real-time file updates** - Indexes are snapshots, rebuild when files change
- **Call through Code Mode** - LEANN is NATIVE MCP, call directly

### ⚠️ ESCALATE IF

- **Index not found** - Check `leann list`, offer to build new index
- **Search returns empty/irrelevant** - May need index rebuild with different chunk size
- **Build fails or times out** - Check file permissions, directory path, exclude large binaries
- **Unsure which index to search** - Use `leann list` and let user choose
- **Ollama connection error** - Verify Ollama is running with `ollama serve`
- **Out of memory during indexing** - Apply progressive scope indexing or switch to MLX/OpenAI

---

## 5.1 🧠 INDEXING BEST PRACTICES

### ALWAYS Index src/ Only

```bash
# Correct - index src/ folder only
leann-build myproject --docs src/

# WRONG - do not index these folders
# leann-build myproject --docs specs/        # Use Spec Kit Memory instead
# leann-build myproject --docs .opencode/    # Use Spec Kit Memory instead
# leann-build myproject --docs docs/         # Use Spec Kit Memory instead
```

### Why src/ Only?

| Reason          | Explanation                                       |
| --------------- | ------------------------------------------------- |
| **Performance** | Smaller index = faster search (~1 min vs 30+ min) |
| **Memory**      | Large indexes can crash your Mac                  |
| **Relevance**   | Code search should return code, not docs          |
| **Separation**  | Use Spec Kit Memory for conversation context      |

### Recommended Build Command

```bash
# Using shell alias (recommended)
leann-build myproject --docs src/

# Full command (equivalent)
leann build myproject --docs src/ --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
```

---

## 6. 🏆 SUCCESS CRITERIA

**LEANN implementation complete when**:

- ✅ Index exists or has been built for target content
- ✅ Selected correct command (build/search/ask/list/remove)
- ✅ Provided natural language query (not grep/find syntax)
- ✅ Received ranked results or synthesized answer
- ✅ Combined with Read for full context if deeper inspection needed
- ✅ Avoided using LEANN for known paths or exact symbols
- ✅ Used LEANN as Native MCP (not through Code Mode)

**Quality Targets:**
- **Relevance**: Top results match query intent
- **Completeness**: Results include all relevant files/sections
- **Context**: File paths and line numbers provided
- **Actionable**: Clear next steps for follow-up

---

## 7. 🔌 INTEGRATION POINTS

### Cross-Skill Collaboration

**Pairs with mcp-narsil**:
- Use **mcp-narsil** for structural queries - list functions, classes, symbols (via Code Mode)
- Use **LEANN** for semantic code search by intent (NATIVE MCP)
- Example: Narsil maps structure → LEANN finds code by meaning

### Complementary Skills

| Skill      | Relationship                                                  |
| ---------- | ------------------------------------------------------------- |
| mcp-leann  | Semantic search (by meaning) - use for "how does X work?"     |
| mcp-narsil | Structural search (by symbol) - use for "list functions in X" |

**Pairs with spec_kit_memory**:
- Use **spec_kit_memory** for conversation context preservation (NATIVE MCP)
- Use **LEANN** for code/document search (NATIVE MCP)
- Different purposes: memory = conversations, LEANN = codebase

**Workflow example**:
```javascript
// 1. Find relevant code using LEANN
leann_leann_search({ index_name: "my-project", query: "authentication flow" })

// 2. Read the full files found
// Use Read tool on identified files

// 3. Analyze code structure using Narsil (via Code Mode)
narsil.narsil_find_symbols({ path: "src/auth/" })  // List symbols
// Or: narsil.narsil_get_project_structure({ path: "src/auth/" })
```

### Triggers

**Automatic activation when**:
- User asks "find code that..." or "search for..."
- User asks "how does X work?" or "explain..."
- Request involves semantic code discovery
- Need to build index for a project
- User mentions "LEANN", "vector search", "semantic search"

### Outputs

**What LEANN produces**:
- Ranked search results with similarity scores
- File paths and line number ranges
- Synthesized answers (ask command)
- Index status and statistics (list command)

---

## 8. 🏎️ QUICK REFERENCE

### Essential Commands

```javascript
// Build index for src/ folder (ALWAYS src/ only)
leann_leann_build({ index_name: "my-code", docs: "./src", embedding_mode: "mlx", embedding_model: "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ" })

// Search for code by intent
leann_leann_search({ index_name: "my-code", query: "authentication logic" })

// Ask questions with RAG
leann_leann_ask({ index_name: "my-code", question: "How does error handling work?" })

// List all indexes
leann_leann_list()

// Remove an index
leann_leann_remove({ index_name: "old-index" })
```

### Command Decision Tree

```
What do you need?
    │
    ├─► Create/rebuild searchable index
    │   └─► leann_leann_build({ index_name: "<name>", docs: "<path>" })
    │
    ├─► Find code/content by meaning
    │   └─► leann_leann_search({ index_name: "<index>", query: "<query>" })
    │
    ├─► Answer question about codebase
    │   └─► leann_leann_ask({ index_name: "<index>", question: "<question>" })
    │
    ├─► See what indexes exist
    │   └─► leann_leann_list()
    │
    └─► Delete an index
        └─► leann_leann_remove({ index_name: "<name>" })
```

### Backend Options

| Backend | Best For       | Characteristics                  |
| ------- | -------------- | -------------------------------- |
| HNSW    | Most use cases | Fast queries, in-memory, default |
| DiskANN | Large datasets | Disk-based, scalable, lower RAM  |

---

## 9. 📚 ADDITIONAL RESOURCES

### Installation

**Required files**:
- LEANN CLI and MCP binary installed
- opencode.json configured with leann MCP entry

**Installation guide**: See `../../install_guides/MCP/MCP - LEANN.md`

### External Resources

- [LEANN Repository](https://github.com/yichuan-w/LEANN) - Source code and documentation
- [LEANN Paper](https://arxiv.org/abs/2401.11511) - Research paper on selective recomputation
- [Ollama](https://ollama.com) - Local embedding and LLM models

### Related Skills

- **[mcp-narsil](../mcp-narsil/SKILL.md)** - Structural code queries for symbol navigation (via Code Mode)
- **[system-spec-kit](../system-spec-kit/SKILL.md)** - Conversation context preservation (NATIVE MCP)
- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - TypeScript execution for external MCP tools (Code Mode)

---

## 10. 📦 BUNDLED RESOURCES

### scripts/

**update-leann.sh** - Update LEANN to latest version

Updates LEANN CLI and MCP server to the latest version via `uv`. Checks Ollama status and required models.

**Usage**: 
```bash
bash .opencode/skill/mcp-leann/scripts/update-leann.sh
```

### references/

**tool_catalog.md** - Complete command reference

Detailed documentation for all 5 LEANN commands with parameters, examples, troubleshooting, and configuration options.

**Usage**: Load when user needs parameter details, examples, or troubleshooting help.

---

**Remember**: 
- LEANN is for **CODE search only** - index `src/` folder, nothing else
- Use **MLX + Qwen3** embeddings (the only supported mode)
- For document/spec search, use **Spec Kit Memory MCP** instead
- LEANN is a **NATIVE MCP tool** - call directly, not through Code Mode