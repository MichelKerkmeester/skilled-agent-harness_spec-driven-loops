# CodeGraph Tool Reference

A comprehensive reference for all 4 CodeGraph agentic tools with parameters, examples, and response structures.

---

## 🤖 AI-FIRST USAGE GUIDE

### Verify Success (30 seconds)

After installation, test immediately:
1. Ensure SurrealDB is running on port 3004
2. Open OpenCode in a configured project
3. Ask: "What are the main modules in this codebase?"
4. See agentic_architecture tool invocation = SUCCESS

Not working? Jump to [Troubleshooting](#8--troubleshooting).

---

> **Related Documentation:**
> - [SKILL.md](../SKILL.md) - AI agent instructions for CodeGraph tools
> - [codegraph.md](../../../command/search/codegraph.md) - Command documentation
> - [MCP - Code Graph.md](../../../install_guides/MCP%20-%20Code%20Graph.md) - Installation and configuration
> - CodeGraph Repository: https://github.com/Jakedismo/codegraph-rust

---

**Copy and paste this prompt to your AI assistant to get usage help:**

```
I want to use CodeGraph for code intelligence queries.

Please help me:
1. Verify SurrealDB is running (port 3004)
2. Check if my project is indexed
3. Explain which tool to use for my question:
   - agentic_context (search, questions)
   - agentic_impact (dependencies)
   - agentic_architecture (structure)
   - agentic_quality (complexity)
4. Run a test query to verify it works

My question is: [your question about the code]

Guide me through the correct tool and parameters.
```

**What the AI will do:**
- Verify database connection
- Check indexing status
- Select appropriate agentic tool
- Execute query with correct focus mode
- Explain the synthesized response

**Expected query time:** 2-10 seconds depending on complexity

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [🎯 TOOL SELECTION](#2--tool-selection)
3. [🔍 AGENTIC_CONTEXT](#3--agentic_context)
4. [📊 AGENTIC_IMPACT](#4--agentic_impact)
5. [🏗️ AGENTIC_ARCHITECTURE](#5-️-agentic_architecture)
6. [📈 AGENTIC_QUALITY](#6--agentic_quality)
7. [⚙️ CONFIGURATION](#7-️-configuration)
8. [🔧 TROUBLESHOOTING](#8--troubleshooting)
9. [📚 RESOURCES](#9--resources)

---

## 1. 📖 OVERVIEW

CodeGraph provides AI assistants with GraphRAG-powered code intelligence. Unlike traditional semantic search that returns code snippets, CodeGraph uses agentic reasoning to synthesize **answers** about your codebase.

### Key Features

- **GraphRAG Search**: Graph + Vector + Lexical hybrid (70/30 split)
- **Agentic Reasoning**: Tools plan, search, analyze, and synthesize
- **4 Specialized Tools**: Context, Impact, Architecture, Quality
- **Tier-Aware**: Adjusts based on LLM context window

### Tool Summary

| Tool | Purpose | Focus Modes |
|------|---------|-------------|
| `agentic_context` | Search, build context, Q&A | `search`, `builder`, `question` |
| `agentic_impact` | Dependencies, change impact | `dependencies`, `call_chain` |
| `agentic_architecture` | System structure, APIs | `structure`, `api_surface` |
| `agentic_quality` | Complexity, refactoring | `complexity`, `coupling`, `hotspots` |

### Tool Selection Flowchart

```
User Question
     │
     ▼
┌─────────────────────────────────────────┐
│ What are you trying to learn?           │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┬────────────┐
    │            │            │            │
    ▼            ▼            ▼            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Find    │  │ Deps /  │  │ Arch /  │  │ Quality │
│ code or │  │ Impact  │  │ Structure│ │ Metrics │
│ Q&A     │  │         │  │         │  │         │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│agentic_ │  │agentic_ │  │agentic_ │  │agentic_ │
│context  │  │impact   │  │architect│  │quality  │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                  │
└─────────────────────────────┬───────────────────────────────┘
                              │ MCP Protocol
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CodeGraph MCP Server (Rust)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Agentic Tools Layer                │  │
│  │  agentic_context | agentic_impact | agentic_quality   │  │
│  │                  agentic_architecture                 │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Inner Graph Tools                    │  │
│  │  Transitive Dependencies | Call Chains | Coupling     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         SurrealDB                            │
│  Nodes (AST) + Edges (relationships) + Chunks (embeddings)   │
└─────────────────────────────────────────────────────────────┘
```

### Performance Targets

| Operation | Target | Typical |
|-----------|--------|---------|
| Simple search | <5s | ~3s |
| Impact analysis | <10s | ~6s |
| Architecture overview | <15s | ~8s |
| Quality analysis | <10s | ~5s |

---

## 2. 🎯 TOOL SELECTION

### Quick Selection Table

| Question Type | Tool | Focus |
|---------------|------|-------|
| "Find code that..." | `agentic_context` | `search` |
| "How does X work?" | `agentic_context` | `question` |
| "Build context for..." | `agentic_context` | `builder` |
| "What depends on X?" | `agentic_impact` | `dependencies` |
| "What calls X?" | `agentic_impact` | `call_chain` |
| "What's the architecture?" | `agentic_architecture` | `structure` |
| "Show API endpoints" | `agentic_architecture` | `api_surface` |
| "Where to refactor?" | `agentic_quality` | `hotspots` |
| "What's complex?" | `agentic_quality` | `complexity` |
| "High coupling?" | `agentic_quality` | `coupling` |

### When NOT to Use CodeGraph

| Scenario | Use Instead | Why |
|----------|-------------|-----|
| Known file path | `Read` tool | Direct, no overhead |
| Exact symbol search | `Grep` tool | Pattern matching |
| File patterns | `Glob` tool | Fast listing |
| Conversation memory | `semantic_memory` MCP | Different purpose |

---

## 3. 🔍 AGENTIC_CONTEXT

**Purpose**: Multi-purpose tool for searching code, building context, and answering questions.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Natural language query |
| `focus` | string | No | auto | `search`, `builder`, `question` |

### Focus Modes

| Mode | Best For | Example Query |
|------|----------|---------------|
| `search` | Finding code by intent | "Find code that validates emails" |
| `builder` | Building comprehensive context | "Build context for the hero section" |
| `question` | Answering specific questions | "How do animations work?" |

### Example Requests

**Search for code:**
```json
{
  "query": "email validation logic"
}
```

**Build comprehensive context:**
```json
{
  "query": "hero section implementation",
  "focus": "builder"
}
```

**Answer a specific question:**
```json
{
  "query": "How do animations work in this codebase?",
  "focus": "question"
}
```

### Example Response

```json
{
  "analysis_type": "context_search",
  "query": "email validation",
  "structured_output": {
    "analysis": "Email validation is handled in src/utils/validation.js...",
    "highlights": [
      {
        "file_path": "src/utils/validation.js",
        "line_number": 42,
        "snippet": "function validateEmail(email) { ... }"
      }
    ],
    "next_steps": ["Read the full file for context"]
  },
  "steps_taken": 4,
  "tool_use_count": 4
}
```

---

## 4. 📊 AGENTIC_IMPACT

**Purpose**: Analyzes dependencies, call chains, and the impact of potential changes.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Component/symbol to analyze |
| `focus` | string | No | both | `dependencies`, `call_chain` |

### Focus Modes

| Mode | Best For | Example Query |
|------|----------|---------------|
| `dependencies` | What depends on this | "What depends on UserService?" |
| `call_chain` | Execution flow tracing | "What does initVideo call?" |

### Example Requests

**Full impact analysis:**
```json
{
  "query": "UserService"
}
```

**Dependency focus:**
```json
{
  "query": "authentication module",
  "focus": "dependencies"
}
```

**Call chain focus:**
```json
{
  "query": "initVideoPlayer",
  "focus": "call_chain"
}
```

### Example Response

```json
{
  "analysis_type": "dependency_analysis",
  "query": "UserService",
  "structured_output": {
    "analysis": "UserService is a critical hub with 12 dependents...",
    "highlights": [...],
    "dependents": ["AuthController", "ProfilePage", "SettingsPage"],
    "dependencies": ["DatabaseService", "CacheService"],
    "coupling_score": 0.85,
    "risk_level": "high",
    "next_steps": ["Consider interface extraction"]
  },
  "steps_taken": 5,
  "tool_use_count": 5
}
```

---

## 5. 🏗️ AGENTIC_ARCHITECTURE

**Purpose**: Explores system structure, module organization, and API surfaces.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Architecture query |
| `focus` | string | No | both | `structure`, `api_surface` |

### Focus Modes

| Mode | Best For | Example Query |
|------|----------|---------------|
| `structure` | Codebase organization | "What are the main modules?" |
| `api_surface` | API endpoints/interfaces | "Show REST API endpoints" |

### Example Requests

**Full architecture overview:**
```json
{
  "query": "main modules and their relationships"
}
```

**Structure focus:**
```json
{
  "query": "how is the frontend organized?",
  "focus": "structure"
}
```

**API surface focus:**
```json
{
  "query": "REST API endpoints",
  "focus": "api_surface"
}
```

### Example Response

```json
{
  "analysis_type": "architecture_analysis",
  "query": "main modules",
  "structured_output": {
    "analysis": "The codebase is organized into 5 main modules...",
    "modules": [
      {
        "name": "services",
        "purpose": "Business logic",
        "files": 12,
        "dependencies": ["utils", "models"]
      }
    ],
    "patterns": ["Repository pattern", "Service layer"],
    "highlights": [...],
    "next_steps": ["Review service boundaries"]
  },
  "steps_taken": 6,
  "tool_use_count": 6
}
```

---

## 6. 📈 AGENTIC_QUALITY

**Purpose**: Analyzes code quality, complexity, and identifies refactoring opportunities.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Quality query |
| `focus` | string | No | all | `complexity`, `coupling`, `hotspots` |

### Focus Modes

| Mode | Best For | Example Query |
|------|----------|---------------|
| `complexity` | Cyclomatic complexity | "Most complex functions" |
| `coupling` | Module dependencies | "Tightly coupled modules" |
| `hotspots` | Refactoring targets | "Where to focus improvements?" |

### Example Requests

**Find all quality issues:**
```json
{
  "query": "areas that need refactoring"
}
```

**Complexity focus:**
```json
{
  "query": "most complex functions",
  "focus": "complexity"
}
```

**Coupling focus:**
```json
{
  "query": "tightly coupled modules",
  "focus": "coupling"
}
```

### Example Response

```json
{
  "analysis_type": "quality_analysis",
  "query": "complexity hotspots",
  "structured_output": {
    "analysis": "Found 5 high-complexity functions requiring attention...",
    "hotspots": [
      {
        "file_path": "src/utils/parser.js",
        "function_name": "parseComplexData",
        "line_number": 45,
        "complexity_score": 25,
        "reason": "Deep nesting, many branches"
      }
    ],
    "coupling_issues": [...],
    "recommendations": ["Extract helper functions from parseComplexData"],
    "next_steps": ["Start with highest complexity score"]
  },
  "steps_taken": 5,
  "tool_use_count": 5
}
```

---

## 7. ⚙️ CONFIGURATION

### Common Response Fields

All tools return responses with these common fields:

| Field | Type | Description |
|-------|------|-------------|
| `analysis_type` | string | Type of analysis performed |
| `query` | string | Original query |
| `structured_output` | object | Main response content |
| `structured_output.analysis` | string | Human-readable analysis |
| `structured_output.highlights` | array | Relevant code with locations |
| `structured_output.next_steps` | array | Suggested follow-up actions |
| `steps_taken` | number | Agent reasoning steps |
| `tool_use_count` | number | Internal graph tools called |

### Tier-Aware Behavior

Tools automatically adjust based on configured context window:

| Context Window | Max Steps | Behavior |
|----------------|-----------|----------|
| <50K tokens | 3 | Terse, focused |
| 50K-150K | 5 | Balanced |
| 150K-500K | 6 | Detailed |
| >500K | 8 | Comprehensive |

### Agent Architectures

| Architecture | Characteristics |
|--------------|-----------------|
| **Rig** (default) | Best overall, auto-selects strategy |
| **ReAct** | Linear reasoning, fast |
| **LATS** | Tree search, thorough |
| **Reflexion** | Self-correcting on failures |

### Environment Variables

```bash
CODEGRAPH_CONTEXT_WINDOW=32000
CODEGRAPH_AGENT_ARCHITECTURE=rig
CODEGRAPH_SURREALDB_URL=ws://localhost:3004
CODEGRAPH_EMBEDDING_PROVIDER=ollama
CODEGRAPH_EMBEDDING_MODEL=nomic-embed-text
CODEGRAPH_LLM_PROVIDER=ollama
CODEGRAPH_LLM_MODEL=qwen2.5-coder:3b
```

> **Note**: Using local Ollama models - no API key required.

---

## 8. 🔧 TROUBLESHOOTING

### Connection Refused

**Problem**: `Connection refused to localhost:3004`

**What it means**: SurrealDB is not running.

**Fix**:
```bash
# Start SurrealDB
surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db
```

### Embedding Failed

**Problem**: `Ollama embedding failed`

**What it means**: Ollama not running or model not pulled.

**Fix**:
```bash
# Start Ollama
brew services start ollama

# Pull embedding model
ollama pull nomic-embed-text
```

### No Results Found

**Problem**: `No results found` or empty response

**What it means**: Project not indexed or query too specific.

**Fix**:
```bash
# Re-index project (note: -r flag is REQUIRED for subdirectories)
cd /path/to/project
codegraph index . -r --languages javascript,typescript --index-tier fast --force
```

**CRITICAL**: The `-r` (recursive) flag is required. Without it, only root-level files are indexed.

**If that doesn't work**: Try a broader query. "Find authentication code" instead of "findAuthenticationWithJWTAndOAuthCallback"

### Agent Timeout

**Problem**: Query takes too long or times out

**What it means**: Query too complex or context window too large.

**Fix**:
1. Try more specific query
2. Reduce `CODEGRAPH_CONTEXT_WINDOW`
3. Use `fast` index tier

### Tool Not Appearing in OpenCode

**Problem**: CodeGraph tools not listed

**What it means**: MCP configuration issue.

**Fix**:
1. Check `opencode.json` syntax: `python3 -m json.tool < opencode.json`
2. Verify path to codegraph binary exists
3. Ensure all environment variables set
4. Restart OpenCode

### macOS Code Signing Issue

**Problem**: Binary exits with code 137 (SIGKILL) after building from source

**Fix**:
```bash
xattr -cr ~/.cargo/bin/codegraph
codesign -fs - ~/.cargo/bin/codegraph
```

### Agent Not Executing Tools (tool_calls=0)

**Problem**: Agent returns raw JSON text instead of executing tools

**Symptoms**:
- MCP logs show `tool_calls=0`
- Response contains `{"name": "semantic_code_search", ...}` as text

**Cause**: LLM internal tool names changed between CodeGraph versions

**Fix**:
1. Rebuild CodeGraph from latest source
2. **Restart OpenCode** to load the new MCP binary
3. Verify with: `codegraph config agent-status` (should show Rig framework)

### Changes Not Taking Effect

**Problem**: Updated binary but behavior unchanged

**Cause**: OpenCode caches the MCP server binary at startup

**Fix**: Fully restart OpenCode after any binary updates

### Error Response Format

If a tool fails, it returns:
```json
{
  "error": "Error message",
  "fallback": "Suggested alternative approach"
}
```

### Context Overflow

If results exceed context limits:
```json
{
  "_truncated": true,
  "message": "Results truncated to fit context window",
  "total_results": 50,
  "returned_results": 20
}
```

---

## 9. 📚 RESOURCES

### File Structure

```
.opencode/skills/mcp-code-graph/
├── SKILL.md                    # AI agent instructions
├── references/
│   └── tool_reference.md       # This file
└── config/
    └── config.example.toml     # Example configuration
```

**Note:** Installation guide is located at `../../../install_guides/MCP - Code Graph.md`

### Configuration Paths

| Component | Location |
|-----------|----------|
| CodeGraph binary | `~/.cargo/bin/codegraph` |
| Config file | `~/.codegraph/config.toml` |
| Database | `~/.codegraph/surreal.db/` |
| MCP config | `opencode.json` |

### Verification Commands

```bash
# Check SurrealDB connection
surreal sql --conn ws://localhost:3004 --user root --pass root --ns codegraph --db main --hide-welcome <<< "RETURN 'connected';"

# Check indexed data (note: table names are plural)
surreal sql --conn ws://localhost:3004 --user root --pass root --ns codegraph --db main --hide-welcome <<< "SELECT count() FROM nodes GROUP ALL;"
# Expected: [[{ count: XXXX }]] where XXXX > 0

# Check chunks and edges
surreal sql --conn ws://localhost:3004 --user root --pass root --ns codegraph --db main --hide-welcome <<< "SELECT count() FROM chunks GROUP ALL; SELECT count() FROM edges GROUP ALL;"

# Check Ollama
ollama list

# Check CodeGraph version
codegraph --version
```

### Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| SKILL.md | `../SKILL.md` | AI agent instructions |
| Install Guide | `install_guides/MCP - Code Graph.md` | Installation workflow |
| CodeGraph Repo | https://github.com/Jakedismo/codegraph-rust | Source and updates |
| SurrealDB Docs | https://surrealdb.com/docs | Database reference |

---

## ⚡ Quick Reference

### Tool Summary

| Tool | Purpose | Speed | Use When |
|------|---------|-------|----------|
| `agentic_context` | Search, Q&A | ~3s | Finding code, understanding behavior |
| `agentic_impact` | Dependencies | ~6s | Before refactoring, impact analysis |
| `agentic_architecture` | Structure | ~8s | Onboarding, system overview |
| `agentic_quality` | Metrics | ~5s | Technical debt, refactoring targets |

### Essential Commands

```bash
# Start SurrealDB (required before using CodeGraph)
surreal start --bind 0.0.0.0:3004 --user root --pass root file://$HOME/.codegraph/surreal.db

# Index project (CRITICAL: -r flag required for subdirectories)
codegraph index . -r --languages javascript,typescript --index-tier fast

# Force re-index (clears existing data)
codegraph index . -r --languages javascript,typescript --force

# Check status
codegraph --version
codegraph config agent-status
```

### Command Interface

Use `/search:codegraph` for interactive access:

```bash
/search:codegraph                    # Dashboard
/search:codegraph start              # Start SurrealDB
/search:codegraph status             # Index stats
/search:codegraph find <query>       # Search code
/search:codegraph impact <symbol>    # Dependencies
/search:codegraph arch               # Architecture
/search:codegraph quality            # Hotspots
```

### Query Examples

```json
// Find code
{ "query": "video initialization logic" }

// Impact analysis
{ "query": "UserService" }

// Architecture overview
{ "query": "main modules and relationships" }

// Quality analysis
{ "query": "most complex functions", "focus": "complexity" }
```

---

**Usage Complete!**

You now have the CodeGraph tool reference. Use it to select the right tool and parameters for your code intelligence queries.

Start using CodeGraph by asking your AI assistant:
```
What are the main modules in this codebase?
```

---

## Next Steps

- **Test a query**: Ask about your codebase structure
- **Read SKILL.md**: For complete usage patterns
- **Check install guide**: See `install_guides/MCP - Code Graph.md` if you need to install or reconfigure

**Need help?** See [Troubleshooting](#8--troubleshooting) or check the installation guide.

---

**Protocol**: MCP (Model Context Protocol)
**Status**: Production Ready
