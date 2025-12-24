---
name: mcp-leann
description: "Lightweight vector database providing semantic code search with 97% storage savings. Uses graph-based selective recomputation for efficient RAG on codebases, documents, and any text content. Provides build, search, and ask commands via MCP integration."
allowed-tools: [leann_leann_build, leann_leann_search, leann_leann_ask, leann_leann_list, leann_leann_remove]
version: 1.1.0
---

<!-- Keywords: leann, semantic-search, vector-database, rag, embeddings, code-search, document-search, hnsw, diskann, selective-recomputation, native-mcp -->

# MCP LEANN - Lightweight Semantic Search

Lightweight vector database for semantic code and document search. Unlike traditional vector databases that store all embeddings, LEANN uses graph-based selective recomputation to achieve **97% storage savings** while maintaining search quality. LEANN is a **NATIVE MCP tool** - call it directly, not through Code Mode.

---

## 1. 🎯 WHEN TO USE

### Use LEANN When

**MANDATORY for semantic code/document search**:
- ✅ Searching code by intent or behavior ("Find code that handles user login")
- ✅ Querying documents by meaning ("What does the config say about timeouts?")
- ✅ Building searchable indexes for codebases or documents
- ✅ Need efficient RAG without massive storage overhead
- ✅ Semantic search on any text content (markdown, code, logs)

**Benefits over grep/find**:
- 🚀 **97% storage savings** - Selective recomputation vs storing all embeddings
- ⚡ **Intent-based search** - Find by what code does, not what it's called
- 🔗 **Local-first** - No external API keys required (uses Ollama)
- 🛡️ **AST-aware chunking** - Smart code parsing for better results
- 🎯 **RAG Q&A built-in** - Answer questions using retrieved context

### Do NOT Use LEANN For

**Use native tools instead**:
- ❌ Known file paths (use Read tool - faster, no overhead)
- ❌ Exact symbol/pattern search (use Grep tool - more precise)
- ❌ Conversation memory (use `semantic_memory` MCP - different purpose)
- ❌ File structure listing (use Glob tool - pattern matching)
- ❌ Structural code queries (use `mcp-code-context` for symbol navigation)

### Common Use Cases

| Scenario                     | LEANN Approach                                  | Benefit                       |
| ---------------------------- | ----------------------------------------------- | ----------------------------- |
| **Find authentication code** | `leann_leann_search({ query: "user login handling" })`            | Intent-based, not keyword     |
| **Understand a codebase**    | `leann_leann_ask({ question: "How does payment processing work?" })` | RAG-powered explanation       |
| **Index new project**        | `leann_leann_build({ index_name: "my-project", docs: "./src" })`           | Fast semantic search ready    |
| **Search documentation**     | `leann_leann_search({ query: "deployment requirements" })`        | Find by meaning, not filename |
| **Code exploration**         | `leann_leann_ask({ question: "What are the main API endpoints?" })`  | Structured codebase discovery |

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
        └─► Use mcp-code-context or Grep, not LEANN
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
// Build index for source directory
leann_leann_build({ index_name: "my-project", docs: "./src" })

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

| Variable                | Default                  | Description                                                |
| ----------------------- | ------------------------ | ---------------------------------------------------------- |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`       | Index storage location                                     |
| `LEANN_EMBEDDING_MODEL` | `nomic-embed-text`       | Embedding model (recommended: nomic-embed-text via Ollama) |
| `LEANN_EMBEDDING_MODE`  | `ollama`                 | Embedding provider (ollama recommended for local-first)    |
| `OLLAMA_HOST`           | `http://localhost:11434` | Ollama server URL                                          |
| `OPENAI_API_KEY`        | -                        | Only required if using OpenAI embeddings instead of Ollama |

### Prerequisites

| Component        | Purpose             | Install Command                |
| ---------------- | ------------------- | ------------------------------ |
| LEANN CLI        | Core functionality  | See install guide              |
| leann_mcp        | MCP server binary   | Built with LEANN               |
| Ollama           | Local embeddings    | `brew install ollama`          |
| nomic-embed-text | Embeddings model    | `ollama pull nomic-embed-text` |
| qwen3:8b         | LLM for ask command | `ollama pull qwen3:8b`         |

> **Recommended Setup**: Use `nomic-embed-text` via Ollama for embeddings. This provides high-quality embeddings locally without external API dependencies. No API keys required.

> **Alternative**: For cloud-based embeddings, set `LEANN_EMBEDDING_MODE=openai` and provide `OPENAI_API_KEY`.

---

## 5. 📋 RULES

### ✅ ALWAYS

- **Build an index before searching** - Required for all search and ask operations
- **Use natural language queries** - Describe what you're looking for by intent
- **Choose the correct command** - build/search/ask/list/remove for each task type
- **Verify index exists** - Use `leann list` before searching
- **Combine with Read tool** - LEANN finds results, Read provides full context
- **Check Ollama is running** - Required for embeddings and LLM features

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

---

## 6. 🎓 SUCCESS CRITERIA

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

## 7. 🔗 INTEGRATION POINTS

### Cross-Skill Collaboration

**Pairs with mcp-code-context**:
- Use **mcp-code-context** for structural queries - list functions, classes, symbols (NATIVE MCP)
- Use **LEANN** for semantic code search by intent (NATIVE MCP)
- Example: mcp-code-context maps structure → LEANN finds code by meaning

**Pairs with semantic_memory**:
- Use **semantic_memory** for conversation context preservation (NATIVE MCP)
- Use **LEANN** for code/document search (NATIVE MCP)
- Different purposes: memory = conversations, LEANN = codebase

**Workflow example**:
```javascript
// 1. Find relevant code using LEANN
leann_leann_search({ index_name: "my-project", query: "authentication flow" })

// 2. Read the full files found
// Use Read tool on identified files

// 3. Analyze code structure using mcp-code-context
code_context_get_code_context({ absolutePath: "src/auth/" })  // List symbols
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

## 8. 🎯 QUICK REFERENCE

### Essential Commands

```javascript
// Build index from source code
leann_leann_build({ index_name: "my-code", docs: "./src", use_ast_chunking: true })

// Search for code by intent
leann_leann_search({ index_name: "my-code", query: "authentication logic" })

// Ask questions with RAG
leann_leann_ask({ index_name: "my-code", question: "How does error handling work?" })

// Interactive Q&A session
leann_leann_ask({ index_name: "my-code", interactive: true })

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

- **[mcp-code-context](../mcp-code-context/SKILL.md)** - Structural code queries for symbol navigation (NATIVE MCP)
- **[system-memory](../system-memory/SKILL.md)** - Conversation context preservation (NATIVE MCP)
- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - TypeScript execution for external MCP tools (Code Mode)

---

## 📦 BUNDLED RESOURCES

### references/

**tool_catalog.md** - Complete command reference

Detailed documentation for all 5 LEANN commands with parameters, examples, troubleshooting, and configuration options.

**Usage**: Load when user needs parameter details, examples, or troubleshooting help.

---

**Remember**: LEANN is a **NATIVE MCP tool**. Call `leann_leann_build()`, `leann_leann_search()`, `leann_leann_ask()`, `leann_leann_list()`, `leann_leann_remove()` directly - do NOT use Code Mode's `call_tool_chain()`. LEANN provides efficient semantic search with 97% storage savings through graph-based selective recomputation.
