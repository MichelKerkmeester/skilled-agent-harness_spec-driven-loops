# System Architecture: Semantic Search MCP

Technical architecture and data flow for semantic code search capabilities in CLI AI agents.

---

## 1. 📖 INTRODUCTION & PURPOSE

### What Is This Reference?

This reference provides complete technical documentation of the semantic search MCP architecture, including system components, data flows, performance characteristics, and configuration.

**Core Purpose**:
- **System architecture** - Two-component design (Indexer + MCP Server)
- **Data flows** - Indexing and searching workflows
- **Technical details** - Vector embeddings, judge model, database schema
- **Performance characteristics** - Latency, scalability, storage requirements

**Progressive Disclosure Context**:
```
Level 1: SKILL.md metadata (name + description)
         └─ Always in context (~100 words)
            ↓
Level 2: SKILL.md body
         └─ When skill triggers (<5k words)
            ↓
Level 3: Reference files (this document)
         └─ Loaded as needed for architecture details
```

This reference file provides Level 3 deep-dive technical guidance on system architecture and implementation.

### Core Principle

**"Two-component architecture: Indexer creates vectors, MCP Server searches them - separation enables real-time updates."**

**Prerequisites**: Understanding semantic search from SKILL.md:
- **MCP dependency**: Requires MCP server running
- **Indexing required**: Must run indexer before searching
- **See**: [SKILL.md](../SKILL.md) for system overview
- **See**: [tool_comparison.md](./tool_comparison.md) for when to use semantic search

---

## 2. 🎯 PURPOSE AND SCOPE

### What This System Does

**Enables CLI AI agents to search codebases semantically:**

| Aspect | Details |
|--------|---------|
| **Used by** | Any CLI AI agent with MCP support (OpenCode, GitHub Copilot CLI, Cline, etc.) |
| **Purpose** | Enable AI to search codebase by intent, not keywords |
| **Benefit** | AI finds code by what it does, understands relationships |
| **NOT for** | IDE integrations (autocomplete/suggestions) |
| **NOT for** | Developer's direct use in editor |

**Key distinction:** Semantic search helps CLI AI agents help you. It doesn't provide autocomplete while typing in your IDE.

---

## 3. 🏗️ COMPONENT STACK

### Two Main Tools

**1. codebase-index-cli** (Node.js Indexer)

- **Purpose:** Create and maintain vector embeddings from code
- **Technology:** Node.js, tree-sitter (29+ languages)
- **Storage:** SQLite database (`.codebase/vectors.db`)
- **Features:**
  - Real-time file watching
  - Incremental updates
  - Language-aware parsing
  - 1024-dimensional vectors (Voyage AI)

**2. semantic-search MCP** (Python MCP Server)

- **Purpose:** Provide search tools to CLI AI agents
- **Technology:** Python, Model Context Protocol
- **Features:**
  - Query vectorization (voyage-code-3)
  - Vector similarity search
  - Result reranking (voyage-3 judge)
  - Three search tools: codebase, commits, other workspaces

---

## 4. 📐 ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────┐
│          CLI AI Agents (Any MCP-compatible)     │
│  "Find code that handles video initialization"  │
│  - OpenCode                                     │
│  - GitHub Copilot CLI                           │
│  - Cline, Kilo CLI                              │
└───────────────────┬─────────────────────────────┘
                    │
                    │ MCP Protocol
                    ▼
┌─────────────────────────────────────────────────┐
│          semantic-search MCP Server             │
│  (Python)                                       │
│  ┌───────────────────────────────────────────┐  │
│  │ 1. Receive query from AI agent            │  │
│  │ 2. Convert query to vector (voyage-code-3)│  │
│  │ 3. Search SQLite for similar vectors      │  │
│  │ 4. Rerank results (voyage-3 judge)        │  │
│  │ 5. Return ranked code snippets            │  │
│  └───────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────┘
                    │
                    │ SQL Queries
                    ▼
┌─────────────────────────────────────────────────┐
│          .codebase/vectors.db (SQLite)          │
│  ┌──────────────────────────────────────────┐   │
│  │ Files Table (as of 2025-11-25):          │   │
│  │ - 249 files indexed                      │   │
│  │ - File paths, content, metadata          │   │
│  │                                          │   │
│  │ Blocks Table:                            │   │
│  │ - 496 code blocks                        │   │
│  │ - 1024-dimensional vectors               │   │
│  │ - Language, function names, context      │   │
│  │                                          │   │
│  │ Commits Table (if indexed):              │   │
│  │ - Commit messages, diffs, metadata       │   │
│  │ - Vector embeddings of commits           │   │
│  └──────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    ▲
                    │
                    │ File Watching & Indexing
                    │
┌─────────────────────────────────────────────────┐
│        codebase-index-cli (codesql)             │
│  (Node.js)                                      │
│  ┌──────────────────────────────────────────┐   │
│  │ 1. Watch project files for changes       │   │
│  │ 2. Parse code with tree-sitter           │   │
│  │ 3. Chunk code into semantic blocks       │   │
│  │ 4. Send to Voyage AI API for vectors     │   │
│  │ 5. Store in .codebase/vectors.db         │   │
│  └──────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │
                    │ Voyage AI API
                    ▼
┌─────────────────────────────────────────────────┐
│              Voyage AI Service                  │
│  - voyage-code-3 model (embeddings)             │
│  - voyage-3 model (judge/reranking)             │
│  - 1024-dimensional vector space                │
└─────────────────────────────────────────────────┘
```

---

## 5. 🔀 SYSTEM SEPARATION: CLI VS IDE

```
┌───────────────────────────────────────────────────┐
│              YOUR WORKFLOW                        │
├───────────────────────────────────────────────────┤
│  Ask AI in CLI/Chat    │  Type in Editor          │
│  "Find video code"     │  function validate...    │
│         │              │         │                │
│         ▼              │         ▼                │
│  CLI AI Agents         │  IDE Integrations        │
│  (Any MCP-compatible)  │  (GitHub Copilot IDE)    │
│  Uses Semantic MCP ✅  │  No MCP Support ❌       │
│         │              │         │                │
│         ▼              │         ▼                │
│  Searches .codebase/   │  Suggests completions    │
│  Returns to AI         │  Directly to you         │
│         │              │         │                │
│         ▼              │         ▼                │
│  AI explains to you    │  You accept/reject       │
│                                                   │
│  ← SEPARATE SYSTEMS - DO NOT INTERACT →           │
└───────────────────────────────────────────────────┘
```

**Key points:**

- **CLI AI agents** (left side) use semantic search MCP
- **IDE integrations** (right side) use different systems
- These systems **do not interact** with each other
- Semantic search improves **AI answers**, not autocomplete

---

## 6. 🔄 DATA FLOW

### Indexing Flow (One-Time + Real-Time Updates)

```
Project Files
    ↓
[codesql Watcher]
    ↓
Parse with tree-sitter
    ↓
Chunk into semantic blocks
    ↓
Send to Voyage AI API
    ↓
Receive 1024-dim vectors
    ↓
Store in .codebase/vectors.db
    ↓
[Real-time updates on file changes]
```

**Step-by-step:**

1. **Watch files:** `codesql` monitors project for changes
2. **Parse code:** tree-sitter parses 29+ languages
3. **Chunk code:** Intelligent splitting into semantic blocks
4. **Vectorize:** Voyage AI creates 1024-dim embeddings
5. **Store:** Vectors saved in SQLite database
6. **Update:** Real-time indexing on file changes

### Searching Flow (On-Demand)

```
AI Agent Query: "Find video playback code"
    ↓
[semantic-search MCP Server]
    ↓
Vectorize query (voyage-code-3)
    ↓
Search .codebase/vectors.db
    ↓
Retrieve top N similar vectors
    ↓
Rerank with judge model (voyage-3)
    ↓
Return ranked code snippets to AI
    ↓
AI processes and explains to user
```

**Step-by-step:**

1. **Receive query:** AI agent sends natural language query
2. **Vectorize query:** Convert to 1024-dim vector (voyage-code-3)
3. **Vector search:** Find similar vectors in database
4. **Retrieve candidates:** Get top N code blocks
5. **Rerank:** Judge model (voyage-3) reranks by relevance
6. **Return results:** Ranked code snippets with file paths
7. **AI processes:** AI analyzes results and explains to user

---

## 7. 🔧 TECHNICAL DETAILS

### Vector Embeddings

**Model:** voyage-code-3 (Voyage AI)

- **Dimensions:** 1024
- **Optimized for:** Code understanding and similarity
- **Training:** Specialized on code corpora
- **Context length:** Up to 16K tokens per chunk

**Validation**: `vector_config_verified`
- Is voyage-code-3 model accessible via Voyage AI API?
- Are 1024 dimensions sufficient for code semantic understanding?
- Is context length (16K tokens) adequate for typical code blocks?

**Why 1024 dimensions?**

- Balance between precision and storage
- Sufficient for capturing code semantics
- Efficient for real-time similarity search

### Judge Model (Reranking)

**Model:** voyage-3 (Voyage AI)

- **Purpose:** Rerank search results by relevance
- **How it works:** Scores query-result pairs
- **Benefit:** Top results are usually most relevant
- **Trade-off:** Slight latency for better accuracy

**Validation**: `reranking_enabled`
- Is voyage-3 judge model configured correctly?
- Does reranking improve result relevance measurably?
- Is latency trade-off acceptable (<200ms additional)?

**Why rerank?**

- Vector similarity alone may miss context
- Judge model understands nuanced intent
- Dramatically improves result quality

### Database Schema

**SQLite tables in .codebase/vectors.db:**

```sql
-- Files table
CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    content TEXT,
    language TEXT,
    last_modified TIMESTAMP,
    hash TEXT
);

-- Blocks table (code chunks)
CREATE TABLE blocks (
    id INTEGER PRIMARY KEY,
    file_id INTEGER REFERENCES files(id),
    content TEXT NOT NULL,
    start_line INTEGER,
    end_line INTEGER,
    vector BLOB,  -- 1024-dim vector
    metadata JSON,
    FOREIGN KEY(file_id) REFERENCES files(id)
);

-- Commits table (optional, if git indexed)
CREATE TABLE commits (
    id INTEGER PRIMARY KEY,
    hash TEXT UNIQUE NOT NULL,
    message TEXT,
    diff TEXT,
    author TEXT,
    timestamp TIMESTAMP,
    vector BLOB
);
```

**Validation**: `database_schema_verified`
- Does .codebase/vectors.db exist with correct schema?
- Are foreign key constraints properly enforced?
- Is vector BLOB storage efficient for 1024-dim vectors?

### Language Support

**Supported via tree-sitter (29+ languages):**

| Category | Languages |
|----------|-----------|
| **Web** | JavaScript, TypeScript, HTML, CSS, SCSS |
| **Backend** | Python, Java, Go, Rust, C, C++, C# |
| **Mobile** | Swift, Kotlin, Objective-C |
| **Data** | SQL, JSON, YAML, TOML |
| **Markup** | Markdown, XML |
| **Config** | Bash, Shell, Dockerfile |

**Parsing features:**

- Function/class extraction
- Import/export detection
- Comment preservation
- Context-aware chunking

---

## 8. ⚡ PERFORMANCE CHARACTERISTICS

**Note:** Statistics based on anobel.com project as of 2025-11-25.

### Indexing Performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Initial indexing** | ~2-5 minutes | For 249 files, 496 blocks |
| **Incremental updates** | <1 second | Per file change |
| **Vector generation** | ~50-100ms | Per code block (Voyage AI API) |
| **Database writes** | ~10-20ms | Per block |

### Search Performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Query vectorization** | ~50-100ms | Voyage AI API call |
| **Vector search** | ~10-50ms | SQLite similarity search |
| **Reranking** | ~100-200ms | Voyage AI judge model |
| **Total latency** | ~200-400ms | End-to-end search time |

**Trade-offs:**

- Slight latency for better accuracy
- Reranking improves result quality significantly
- Acceptable for interactive AI chat use case

---

## 9. 💾 STORAGE REQUIREMENTS

### Disk Space

**For anobel.com project:**

- **Original code:** ~2-5 MB
- **Vector database:** ~50-100 MB
- **Index overhead:** ~20-40x original size

**Why so large?**

- 1024-dim vectors are 4KB each (float32)
- 496 blocks × 4KB = ~2MB for vectors alone
- Metadata, file content, indexes add overhead

**Optimization:**

- Only indexed files stored
- Efficient binary storage (BLOB)
- SQLite compression

---

## 10. 📈 SCALABILITY

### Current Limits

**anobel.com project:**

- **Files:** 249 files
- **Code blocks:** 496 chunks
- **Performance:** Excellent (<400ms searches)

**Theoretical limits:**

- **Small projects (<1K files):** Excellent performance
- **Medium projects (1K-10K files):** Good performance
- **Large projects (>10K files):** May need optimization

**Scaling strategies:**

- Selective indexing (ignore node_modules, build, etc.)
- Database sharding for very large codebases
- Caching frequently accessed vectors
- Incremental indexing on file changes

---

## 11. ⚙️ CONFIGURATION

### Indexer Configuration

**Location:** `.codebase/config.json` (or indexer config)

```json
{
  "ignored_patterns": [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/.git/**"
  ],
  "languages": [
    "javascript",
    "typescript",
    "python",
    "css",
    "html",
    "markdown"
  ],
  "chunk_size": 512,
  "overlap": 50
}
```

### MCP Server Configuration

**Voyage AI API key required:**

```bash
# .env file
VOYAGE_API_KEY=your_api_key_here
```

**Setup guide:** See `specs/025-semantic-search-setup/README.md`

---

## 12. 📦 DEPENDENCIES

### External Services

1. **Voyage AI API**
   - Required for vector embeddings
   - Required for judge model
   - API key needed
   - https://docs.voyageai.com/

### NPM Packages (Indexer)

- `tree-sitter` - Code parsing
- `sqlite3` - Database storage
- `voyageai` - Vector generation
- `chokidar` - File watching

### Python Packages (MCP Server)

- `mcp` - Model Context Protocol
- `voyageai` - API client
- `sqlite3` - Database queries (built-in)

---

## 13. 🔍 TROUBLESHOOTING

### Common Issues

**1. Database not found**

```
Error: .codebase/vectors.db not found
```

**Solution:** Run indexer first: `codesql -start`

**2. Slow searches**

```
Search taking >1 second
```

**Possible causes:**

- Large database (>10K files)
- Network latency to Voyage AI
- Database not optimized

**Solutions:**

- Run `VACUUM` on database
- Check network connection
- Consider selective indexing

**3. MCP server not responding**

```
Error: MCP server unavailable
```

**Checklist:**

- Is MCP server running?
- Is Voyage AI API key set?
- Is .env file loaded?
- Check MCP server logs

---

## 14. 🔗 RELATED RESOURCES

### Reference Files
- [query_patterns.md](./query_patterns.md) - Effective semantic search query writing patterns and best practices
- [tool_comparison.md](./tool_comparison.md) - Decision framework for choosing between semantic search, grep, and glob tools

### Templates
- [query_examples.md](../assets/query_examples.md) - Categorized collection of example queries demonstrating semantic search usage patterns

### Related Skills
- `mcp-code-mode` - MCP orchestration via TypeScript for multi-tool workflows
- `workflows-code` - Implementation lifecycle guidance including browser verification requirements

### External Resources
- [Indexer repository](https://github.com/dudufcb1/codebase-index-cli) - Node.js indexer for creating vector embeddings from code
- [MCP server repository](https://github.com/dudufcb1/semantic-search) - Python MCP server providing search tools to CLI AI agents
- [Voyage AI documentation](https://docs.voyageai.com/) - API documentation for voyage-code-3 embeddings and voyage-3 judge model

### Standards
- [Setup guide](specs/025-semantic-search-setup/README.md) - Installation and configuration guide for semantic search system

---

## 15. 📝 SUMMARY

**Architecture highlights:**

1. **Two-component system:** Indexer (Node.js) + MCP Server (Python)
2. **Vector-based:** 1024-dim embeddings via Voyage AI
3. **Real-time:** File watching for incremental updates
4. **Reranked:** Judge model improves result quality
5. **MCP-based:** Works with any compatible CLI AI agent
6. **Not for IDEs:** Separate from autocomplete systems

**Key benefits:**

- AI agents find code by intent
- Natural language queries
- Cross-file relationship understanding
- Real-time index updates
- High-quality results via reranking