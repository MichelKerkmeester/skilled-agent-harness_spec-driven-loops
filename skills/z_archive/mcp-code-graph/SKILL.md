---
name: mcp-code-graph
description: GraphRAG-powered code intelligence providing agentic reasoning tools (agentic_context, agentic_impact, agentic_architecture, agentic_quality) that return synthesized ANSWERS about code relationships, dependencies, architecture, and quality metrics. Uses knowledge graph + vector embeddings for relationship-aware code understanding. Replaces mcp-semantic-search.
allowed-tools: [Read, Glob, Grep]
version: 1.0.0
---

<!-- Keywords: codegraph, graphrag, code-intelligence, agentic-reasoning, knowledge-graph, vector-embeddings, surrealdb, code-search, dependency-analysis, architecture-analysis, code-quality -->

# MCP CodeGraph - GraphRAG Code Intelligence

GraphRAG-powered code intelligence for CLI AI agents. Unlike traditional semantic search that returns code snippets, CodeGraph uses agentic reasoning to synthesize **answers** about your codebase through knowledge graph traversal.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use when:**
- Understanding code relationships ("What depends on this component?")
- Searching by behavior/intent ("Find code that handles authentication")
- Exploring architecture ("What's the overall system structure?")
- Analyzing code quality ("Where are the complexity hotspots?")
- Impact analysis before changes ("What would break if I refactor this?")

**Keyword Triggers:**
- "what depends on", "what calls", "impact of changing"
- "find code that", "where do we", "how does X work"
- "architecture", "main modules", "system structure"
- "complexity", "coupling", "needs refactoring", "hotspots"

### Use Cases

### Code Relationship Questions

- "What depends on UserService?" → Dependency graph analysis
- "What would break if I change this function?" → Impact assessment
- "Show me the call chain for authentication" → Call graph traversal

### Intent-Based Code Discovery

- "Find code that validates email addresses" → Semantic + graph search
- "Where do we process payments?" → Function location by purpose
- "Show me error handling patterns" → Pattern recognition

### Architecture Exploration

- "What are the main modules?" → Structure analysis
- "Show me API endpoints" → Surface enumeration
- "How is the codebase organized?" → Module hierarchy

### Code Quality Analysis

- "Which functions are too complex?" → Complexity metrics
- "Where is coupling highest?" → Coupling analysis
- "What needs refactoring?" → Hotspot identification

### When NOT to Use

**Skip this skill when:**
- **Known exact file path** → Use `Read` tool (faster, no overhead)
- **Specific symbol/pattern search** → Use `Grep` tool (more precise)
- **Conversation memory** → Use `semantic_memory` MCP (different purpose)
- **File structure listing** → Use `Glob` tool (pattern matching)

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Need installation help
    │   └─► Load: ../../../install_guides/MCP - Code Graph.md
    │
    ├─► Need detailed tool parameters
    │   └─► Load: references/tool_reference.md
    │
    ├─► Code relationship question
    │   └─► Use: agentic_context or agentic_impact
    │
    ├─► Architecture question
    │   └─► Use: agentic_architecture
    │
    ├─► Quality/refactoring question
    │   └─► Use: agentic_quality
    │
    └─► Known file path or exact symbol
        └─► Use Read/Grep tools directly
```

### Resource Router

```python
def route_codegraph_resources(task):
    """
    Resource Router for mcp-codegraph skill
    Load references based on task context
    """

    # ──────────────────────────────────────────────────────────────────
    # INSTALLATION GUIDE
    # Purpose: Complete setup instructions for CodeGraph MCP server
    # Key Insight: Follow phases in order - prerequisites, build, configure, index
    # ──────────────────────────────────────────────────────────────────
    if task.needs_installation or task.setup_required:
        return load("../../../install_guides/MCP - Code Graph.md")  # Full installation workflow

    # ──────────────────────────────────────────────────────────────────
    # TOOL REFERENCE
    # Purpose: Detailed parameters, examples, response structures for each tool
    # Key Insight: All 4 tools share common response format but differ in focus modes
    # ──────────────────────────────────────────────────────────────────
    if task.needs_tool_details or task.unfamiliar_with_parameters:
        return load("references/tool_reference.md")  # Tool-by-tool documentation

    # ──────────────────────────────────────────────────────────────────
    # QUICK TOOL SELECTION
    # Purpose: Route to correct agentic tool based on question type
    # Key Insight: Tool choice is determined by what you want to learn
    # ──────────────────────────────────────────────────────────────────
    if task.question_type == "find_code" or task.question_type == "how_works":
        return use_tool("agentic_context")  # Search, context, Q&A
    
    if task.question_type == "dependencies" or task.question_type == "impact":
        return use_tool("agentic_impact")  # Dependency and change analysis
    
    if task.question_type == "architecture" or task.question_type == "structure":
        return use_tool("agentic_architecture")  # System structure
    
    if task.question_type == "quality" or task.question_type == "refactoring":
        return use_tool("agentic_quality")  # Complexity and coupling

    # Default: SKILL.md covers basic usage

# ══════════════════════════════════════════════════════════════════════
# TOOL SELECTION TABLE (always available)
# ══════════════════════════════════════════════════════════════════════
# Question Type          → Tool                 → Focus Mode
# "Find code that..."    → agentic_context      → search
# "How does X work?"     → agentic_context      → question
# "Build context for..." → agentic_context      → builder
# "What depends on X?"   → agentic_impact       → dependencies
# "What calls X?"        → agentic_impact       → call_chain
# "What's the arch?"     → agentic_architecture → structure
# "Show API endpoints"   → agentic_architecture → api_surface
# "Where to refactor?"   → agentic_quality      → hotspots
# "What's complex?"      → agentic_quality      → complexity
```

---

## 3. 🛠️ HOW IT WORKS

### GraphRAG Architecture

Unlike traditional semantic search (vector-only), CodeGraph combines three search strategies:

```
Your Code → AST + FastML Parsing → Knowledge Graph → Vector Embeddings
               ↓                        ↓                   ↓
           Nodes/Edges            Relationships        768-dim vectors
               ↓                        ↓                   ↓
                    ╔═══════════════════════════════════════╗
                    ║         HYBRID SEARCH ENGINE          ║
                    ║  70% Vector + 30% Lexical + Graph     ║
                    ╚═══════════════════════════════════════╝
                                      ↓
                         Agentic Reasoning Layer
                                      ↓
                           Synthesized Answer
```

### Agentic Reasoning Process

When you call an agentic tool, it doesn't just return search results:

**Process Flow:**
```
STEP 1: PLAN
       ├─ Parse natural language query
       ├─ Determine required graph operations
       └─ Select inner tools (transitive_deps, call_chains, etc.)
       ↓
STEP 2: SEARCH
       ├─ Hybrid search (vector + lexical)
       ├─ Graph traversal for relationships
       └─ Retrieve relevant code chunks
       ↓
STEP 3: ANALYZE
       ├─ Calculate coupling metrics
       ├─ Detect cycles and hub nodes
       └─ Trace dependency chains
       ↓
STEP 4: SYNTHESIZE
       └─ Produce coherent, actionable answer
```

### The 4 Agentic Tools

| Tool                   | Purpose                     | Focus Modes                          |
| ---------------------- | --------------------------- | ------------------------------------ |
| `agentic_context`      | Search, build context, Q&A  | `search`, `builder`, `question`      |
| `agentic_impact`       | Dependencies, change impact | `dependencies`, `call_chain`         |
| `agentic_architecture` | System structure, APIs      | `structure`, `api_surface`           |
| `agentic_quality`      | Complexity, refactoring     | `complexity`, `coupling`, `hotspots` |

### Quick Examples

```javascript
// Find code by intent
agentic_context({ query: "video initialization logic" })

// Analyze dependencies
agentic_impact({ query: "UserService" })

// Explore architecture
agentic_architecture({ query: "main modules and relationships" })

// Find complexity hotspots
agentic_quality({ query: "what needs refactoring?" })
```

### Tier-Aware Intelligence

CodeGraph automatically adjusts based on LLM context window:

| Context Window | Behavior             | Max Steps |
| -------------- | -------------------- | --------- |
| <50K tokens    | Terse prompts        | 3         |
| 50K-150K       | Balanced analysis    | 5         |
| 150K-500K      | Detailed exploration | 6         |
| >500K          | Comprehensive        | 8         |

---

## 4. 📖 RULES

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS verify SurrealDB is running**
   - Required for all CodeGraph operations
   - Start with: `surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db`

2. **ALWAYS use natural language queries**
   - Describe what you're looking for by intent
   - "Find code that validates emails" NOT "grep email"

3. **ALWAYS choose the correct tool for the question**
   - Context/search → `agentic_context`
   - Dependencies → `agentic_impact`
   - Architecture → `agentic_architecture`
   - Quality → `agentic_quality`

4. **ALWAYS combine with Read tool for full context**
   - CodeGraph finds and summarizes
   - Read tool provides complete file content

5. **ALWAYS check focus modes when results seem off**
   - Default modes are usually correct
   - Override explicitly when needed

### ❌ NEVER

**NEVER do these:**

1. **NEVER use for known file paths**
   - Use Read tool instead
   - CodeGraph adds unnecessary overhead for direct file access

2. **NEVER use for exact symbol searches**
   - Use Grep tool instead
   - More precise for literal pattern matching

3. **NEVER use grep/find syntax in queries**
   - CodeGraph expects natural language
   - The agent handles query translation

4. **NEVER skip the SurrealDB check**
   - Tools will fail without database connection
   - Check first, troubleshoot before proceeding

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF SurrealDB is unavailable**
   - Check: `surreal sql --conn ws://localhost:3004`
   - Offer fallback to Grep/Glob tools

2. **ESCALATE IF results seem incorrect or incomplete**
   - May need project re-indexing
   - Command: `codegraph index . -r --languages javascript,typescript --force`
   - **CRITICAL**: The `-r` flag is REQUIRED for recursive directory scanning

3. **ESCALATE IF agent times out repeatedly**
   - Reduce context window setting
   - Try more specific queries
   - Consider using `fast` index tier

4. **ESCALATE IF unsure which tool to use**
   - Present the 4 options with their purposes
   - Let user choose based on their goal

---

## 5. 🎓 SUCCESS CRITERIA

### Tool Usage Completion Checklist

**CodeGraph query complete when:**
- ✅ Selected correct agentic tool (context/impact/architecture/quality)
- ✅ Provided natural language query (not grep/find syntax)
- ✅ Received synthesized answer (not raw search results)
- ✅ Combined with Read for full context if deeper inspection needed
- ✅ Avoided using CodeGraph for known paths or exact symbols

### Quality Targets

**Target response characteristics:**
- **Synthesis**: Answer includes analysis, not just code snippets
- **Highlights**: Relevant code locations with line numbers
- **Next steps**: Actionable follow-up suggestions
- **Step count**: Appropriate for query complexity (3-8 steps)

### Validation Success

**Validation passes when:**
- ✅ SurrealDB connection verified before tool call
- ✅ Tool focus mode matches question type
- ✅ Response includes `structured_output` with analysis
- ✅ No "connection refused" or embedding errors

---

## 6. 🔗 INTEGRATION POINTS

### MCP Configuration

**Required in opencode.json:**
```json
{
  "mcp": {
    "codegraph": {
      "type": "local",
      "command": ["codegraph", "start", "stdio", "--watch"],
      "environment": {
        "CODEGRAPH_SURREALDB_URL": "ws://localhost:3004",
        "CODEGRAPH_SURREALDB_NAMESPACE": "codegraph",
        "CODEGRAPH_SURREALDB_DATABASE": "main",
        "CODEGRAPH_SURREALDB_USERNAME": "root",
        "CODEGRAPH_SURREALDB_PASSWORD": "root",
        "CODEGRAPH_EMBEDDING_PROVIDER": "ollama",
        "CODEGRAPH_EMBEDDING_MODEL": "nomic-embed-text",
        "CODEGRAPH_LLM_PROVIDER": "ollama",
        "CODEGRAPH_LLM_MODEL": "qwen2.5-coder:3b",
        "CODEGRAPH_CONTEXT_WINDOW": "32000"
      },
      "enabled": true
    }
  }
}
```

> **Important**: After updating the CodeGraph binary, you must **restart OpenCode** for changes to take effect.

### Prerequisites

| Component        | Purpose                 | Start Command                                                                                  |
| ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| SurrealDB        | Graph + vector database | `surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db` |
| Ollama           | Local embeddings + LLM  | `brew services start ollama`                                                                   |
| nomic-embed-text | Embeddings model        | `ollama pull nomic-embed-text`                                                                 |
| qwen2.5-coder:3b | Reasoning model         | `ollama pull qwen2.5-coder:3b`                                                                 |

> **No API key required** - CodeGraph runs fully locally with Ollama.

### Tool Usage Guidelines

**Read**: Get full file content after CodeGraph identifies relevant files

**Grep**: Use for exact symbol searches instead of CodeGraph

**Glob**: Use for file pattern matching (*.js, etc.)

**semantic_memory**: Use for conversation context, NOT code search

### Related Skills

- `mcp-semantic-search` (DEPRECATED - replaced by this skill)
- `system-memory` - Conversation memory preservation
- `mcp-code-mode` - External tool orchestration via TypeScript

### Knowledge Base Dependencies

**Required:**
- SurrealDB running on port 3004 - All queries fail without it

**Optional:**
- Ollama with nomic-embed-text - Can substitute Jina or OpenAI for embeddings

---

## 7. 🔗 COMMAND INTERFACE

Use the `/search:codegraph` command for interactive access to all CodeGraph features.

### Quick Reference

| Command                             | Action                |
| ----------------------------------- | --------------------- |
| `/search:codegraph`                 | Interactive dashboard |
| `/search:codegraph start`           | Start SurrealDB       |
| `/search:codegraph stop`            | Stop SurrealDB        |
| `/search:codegraph status`          | Show index stats      |
| `/search:codegraph index`           | Re-index project      |
| `/search:codegraph find <query>`    | Search code by intent |
| `/search:codegraph impact <symbol>` | Analyze dependencies  |
| `/search:codegraph arch`            | Architecture overview |
| `/search:codegraph quality`         | Find quality hotspots |
| `/search:codegraph <natural query>` | Smart routing         |

### Smart Routing

The command auto-detects intent from natural language:
- "how does auth work" → `agentic_context`
- "what depends on UserService" → `agentic_impact`
- "main modules" → `agentic_architecture`
- "complex functions" → `agentic_quality`
- Single symbol (e.g., `UserService`) → `agentic_impact`

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [tool_reference.md](./references/tool_reference.md) - Detailed tool parameters and response structures

### Command Documentation
- [codegraph.md](../../command/search/codegraph.md) - Full command documentation

### Installation Guide
- [MCP - Code Graph.md](../../install_guides/MCP%20-%20Code%20Graph.md) - Complete setup and configuration

### External Resources
- [CodeGraph Repository](https://github.com/Jakedismo/codegraph-rust) - Source code and updates
- [SurrealDB Docs](https://surrealdb.com/docs) - Database documentation
- [Ollama](https://ollama.com) - Local embedding and LLM models

### Related Skills
- `system-memory` - Conversation context preservation (different from code search)
- `mcp-code-mode` - TypeScript execution for external MCP tools

---

**Core Insight**: CodeGraph provides **ANSWERS**, not just search results. It understands your codebase as a knowledge graph with relationships, not just a collection of files. Use it when you need to understand how code connects and behaves.
