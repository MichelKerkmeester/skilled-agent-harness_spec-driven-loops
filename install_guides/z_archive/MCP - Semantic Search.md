# Semantic Search MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the Semantic Search MCP server for intent-based code discovery.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Semantic Search MCP server from https://github.com/dudufcb1/semantic-search

Please help me:
1. Check if I have Python 3.10+ installed
2. Verify I have the codebase-index-cli indexer installed (npm package)
3. Clone the semantic-search repository to ~/CloudStorage/MCP Servers/semantic-search
4. Create a virtual environment and install dependencies
5. Configure environment variables for my embedding provider
6. Configure the MCP server for my environment (I'm using: [Claude Code / Claude Desktop / OpenCode / Cline])
7. Verify the installation is working with a test search

My project to index is located at: [your project path]
My embedding provider is: [OpenAI / Voyage AI / OpenRouter / other]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify Python 3.10+ is available on your system
- Check if codebase-index-cli is installed for indexing
- Clone the semantic-search repository
- Set up virtual environment and install dependencies
- Configure embedding provider (OpenAI, Voyage AI, OpenRouter, etc.)
- Configure MCP server for your specific AI platform
- Test the three available tools: `semantic_search`, `search_commit_history`, `visit_other_project`
- Show you how to use natural language queries effectively

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

Semantic Search MCP is a Python-based Model Context Protocol (MCP) server that enables AI assistants to search codebases using natural language queries. Instead of keyword matching, it interprets the **meaning** of your queries to find relevant code—even when terminology differs.

### Key Features

- **Intent-Based Search**: Find code by what it does, not what it's called
- **LLM-Powered Reranking**: AI-assisted relevance scoring for better results
- **Git Commit History Search**: Query analyzed commit messages and diffs
- **Multi-Project Search**: Search across different codebases/workspaces
- **Flexible Storage**: SQLite (local) or Qdrant (scalable) backends
- **Parallel Query Execution**: Concurrent searches with smart deduplication

### Two-Component Architecture

Semantic search requires **two tools** working together:

| Component | Technology | Purpose |
|-----------|------------|---------|
| **codebase-index-cli** | Node.js | Creates vector embeddings from your code |
| **semantic-search** | Python MCP | Provides search tools to AI assistants |

```
┌─────────────────────────────────────────────────────────────┐
│                    Your AI Assistant                         │
│  (Claude Code, Claude Desktop, OpenCode, Cline, etc.)       │
└─────────────────────────┬───────────────────────────────────┘
                          │ MCP Protocol
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              semantic-search MCP Server                      │
│  • Receives natural language queries                         │
│  • Converts queries to vectors                               │
│  • Searches indexed codebase                                 │
│  • Reranks results with LLM judge                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ SQL/Vector Queries
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           .codebase/vectors.db (SQLite) or Qdrant           │
│  • Vector embeddings of your code                            │
│  • Created by codebase-index-cli                             │
│  • Real-time updates on file changes                         │
└─────────────────────────────────────────────────────────────┘
```

### How It Compares

| Feature | Semantic Search | Grep/Ripgrep | IDE Search |
|---------|-----------------|--------------|------------|
| **Query Type** | Natural language | Keywords/regex | Keywords |
| **Finds By** | Intent/behavior | Exact match | Symbol names |
| **Cross-file Relationships** | Yes | Limited | Some |
| **Use Case** | "Find code that validates emails" | `grep "validate"` | "Find validateEmail" |

---

## 2. 📋 PREREQUISITES

Before installing Semantic Search MCP, ensure you have:

### Required

- **Python 3.10 or higher**
  ```bash
  python3 --version
  # Should show 3.10.x or higher
  ```

- **Node.js 16+** (for the indexer)
  ```bash
  node --version
  # Should show v16.x or higher
  ```

- **codebase-index-cli** (the indexer tool)
  ```bash
  # Install globally
  npm install -g codebase-index-cli

  # Verify installation
  codesql --version
  ```

- **An Embedding API** (one of the following):
  - OpenAI API key (for `text-embedding-3-small`)
  - Voyage AI API key (for `voyage-code-3`)
  - OpenRouter API key
  - Any OpenAI-compatible embedding API

- **MCP-Compatible Client** (one of the following):
  - Claude Code CLI
  - Claude Desktop
  - OpenCode
  - Cline (VS Code extension)
  - Windsurf

### Optional but Recommended

- **Qdrant** (for scalable storage with large codebases)
  ```bash
  # Using Docker
  docker run -p 6333:6333 qdrant/qdrant

  # Or Homebrew (macOS)
  brew install qdrant && qdrant
  ```

- **Git** for version control and commit history search

---

## 3. 📥 INSTALLATION

### Step 1: Index Your Codebase First

Before installing the MCP server, you need indexed vectors from your codebase:

```bash
# Navigate to your project
cd /path/to/your/project

# Index with SQLite (local, portable)
codesql

# OR index with Qdrant (scalable, remote)
codebase
```

**What this creates:**
```
your-project/
├── .codebase/
│   ├── state.json      # Collection info and indexing status
│   ├── cache.json      # File hashes for incremental updates
│   └── vectors.db      # SQLite database (if using codesql)
```

**Verify indexing succeeded:**
```bash
cat .codebase/state.json | python3 -m json.tool

# Expected: Shows workspacePath, qdrantCollection, and qdrantStats
```

### Step 2: Choose Installation Location

Create a dedicated directory for MCP servers:

```bash
# Create MCP Servers directory
mkdir -p ~/CloudStorage/MCP\ Servers
cd ~/CloudStorage/MCP\ Servers
```

### Step 3: Clone Repository

```bash
# Clone the Semantic Search repository
git clone https://github.com/dudufcb1/semantic-search.git
cd semantic-search
```

### Step 4: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 5: Install Dependencies

```bash
# Install required packages
pip install fastmcp qdrant-client httpx pydantic pydantic-settings python-dotenv

# Or if requirements.txt exists:
pip install -r requirements.txt
```

### Step 6: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env  # or use your preferred editor
```

**Minimum required environment variables:**

```bash
# .env file

# Embedder Configuration (REQUIRED)
# CRITICAL: Must match the model used by codebase-index-cli!
MCP_CODEBASE_EMBEDDER_PROVIDER=openai-compatible
MCP_CODEBASE_EMBEDDER_API_KEY=your-api-key-here
MCP_CODEBASE_EMBEDDER_BASE_URL=https://api.openai.com/v1
MCP_CODEBASE_EMBEDDER_MODEL_ID=text-embedding-3-small
MCP_CODEBASE_EMBEDDER_DIMENSION=1536

# Qdrant Configuration (only for server_qdrant.py)
MCP_CODEBASE_QDRANT_URL=http://localhost:6333
MCP_CODEBASE_QDRANT_API_KEY=  # Optional, leave empty for local

# Judge/Reranker Configuration (for refined_answer=True)
MCP_CODEBASE_JUDGE_PROVIDER=openai-compatible
MCP_CODEBASE_JUDGE_API_KEY=your-api-key-here
MCP_CODEBASE_JUDGE_BASE_URL=https://api.openai.com/v1
MCP_CODEBASE_JUDGE_MODEL_ID=gpt-4o-mini
MCP_CODEBASE_JUDGE_MAX_TOKENS=32000
MCP_CODEBASE_JUDGE_TEMPERATURE=0.0
```

### Critical: Embedder Model Consistency

**The embedding model MUST exactly match between indexer and server!**

```bash
# If indexer used:
EMBEDDER_MODEL_ID=text-embedding-3-small
EMBEDDER_DIMENSION=1536

# Server MUST use identical settings:
MCP_CODEBASE_EMBEDDER_MODEL_ID=text-embedding-3-small
MCP_CODEBASE_EMBEDDER_DIMENSION=1536
```

Mismatched models/dimensions create incompatible vector spaces and **search will fail silently**.

### Installed Dependencies

The installation includes:
- **FastMCP** - Model Context Protocol implementation
- **qdrant-client** - Qdrant vector database client
- **httpx** - Async HTTP client
- **pydantic** - Data validation
- **python-dotenv** - Environment variable management

---

## 4. ⚙️ CONFIGURATION

Semantic Search MCP can be configured for different AI platforms:

### Option A: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "semantic-search": {
      "command": "/Users/YOUR_NAME/MCP Servers/semantic-search/venv/bin/python",
      "args": ["/Users/YOUR_NAME/MCP Servers/semantic-search/src/server_sqlite.py"],
      "env": {
        "MCP_CODEBASE_EMBEDDER_PROVIDER": "openai-compatible",
        "MCP_CODEBASE_EMBEDDER_API_KEY": "your-key",
        "MCP_CODEBASE_EMBEDDER_BASE_URL": "https://api.openai.com/v1",
        "MCP_CODEBASE_EMBEDDER_MODEL_ID": "text-embedding-3-small",
        "MCP_CODEBASE_EMBEDDER_DIMENSION": "1536"
      }
    }
  }
}
```

**Replace** `/Users/YOUR_NAME/` with your actual path.

### Option B: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "semantic-search": {
      "type": "local",
      "command": [
        "/Users/YOUR_NAME/MCP Servers/semantic-search/venv/bin/python",
        "/Users/YOUR_NAME/MCP Servers/semantic-search/src/server_sqlite.py"
      ],
      "env": {
        "MCP_CODEBASE_EMBEDDER_PROVIDER": "openai-compatible",
        "MCP_CODEBASE_EMBEDDER_API_KEY": "your-key",
        "MCP_CODEBASE_EMBEDDER_BASE_URL": "https://api.openai.com/v1",
        "MCP_CODEBASE_EMBEDDER_MODEL_ID": "text-embedding-3-small",
        "MCP_CODEBASE_EMBEDDER_DIMENSION": "1536"
      }
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
    "semantic-search": {
      "command": "/Users/YOUR_NAME/MCP Servers/semantic-search/venv/bin/python",
      "args": ["/Users/YOUR_NAME/MCP Servers/semantic-search/src/server_sqlite.py"],
      "env": {
        "MCP_CODEBASE_EMBEDDER_PROVIDER": "openai-compatible",
        "MCP_CODEBASE_EMBEDDER_API_KEY": "your-key",
        "MCP_CODEBASE_EMBEDDER_BASE_URL": "https://api.openai.com/v1",
        "MCP_CODEBASE_EMBEDDER_MODEL_ID": "text-embedding-3-small",
        "MCP_CODEBASE_EMBEDDER_DIMENSION": "1536"
      }
    }
  }
}
```

### Option D: Configure for Cline/Windsurf

Create or edit `.mcp.toml` in your project root:

```toml
[mcp_servers.semantic-search]
type = "stdio"
command = "/Users/YOUR_NAME/MCP Servers/semantic-search/venv/bin/python"
args = ["/Users/YOUR_NAME/MCP Servers/semantic-search/src/server_sqlite.py"]
timeout = 3600

[mcp_servers.semantic-search.env]
MCP_CODEBASE_EMBEDDER_PROVIDER = "openai-compatible"
MCP_CODEBASE_EMBEDDER_API_KEY = "your-key"
MCP_CODEBASE_EMBEDDER_BASE_URL = "https://api.openai.com/v1"
MCP_CODEBASE_EMBEDDER_MODEL_ID = "text-embedding-3-small"
MCP_CODEBASE_EMBEDDER_DIMENSION = "1536"
```

### Server Mode Selection

Choose the appropriate server based on your storage backend:

| Server Script | Storage | Features | Best For |
|---------------|---------|----------|----------|
| `server_sqlite.py` | SQLite | semantic_search, visit_other_project | Single developer, local work |
| `server_qdrant.py` | Qdrant | All tools + search_commit_history | Teams, large codebases |

---

## 5. ✅ VERIFICATION

### Check 1: Test Server Directly

```bash
# Activate virtual environment
cd ~/CloudStorage/MCP\ Servers/semantic-search
source venv/bin/activate

# Test SQLite server
python src/server_sqlite.py

# Expected: Server starts without errors, waits for MCP connection
# Press Ctrl+C to stop
```

### Check 2: Verify in Your AI Client

**In Claude Code:**
```bash
# Start Claude Code session
claude

# Ask about available tools
> What MCP tools are available?

# Expected: Should list semantic-search tools
```

**In OpenCode:**
```bash
opencode

> List available MCP tools

# Expected: semantic-search tools should appear
```

### Check 3: Test a Search Query

```
# In your AI chat:
Use semantic_search to find code that handles form validation
```

Expected response should show:
- Ranked code snippets from your indexed codebase
- File paths and line numbers
- Similarity scores

### Check 4: Verify Index Connection

```bash
# Check your project has been indexed
ls -la /path/to/your/project/.codebase/

# Expected:
# state.json     (collection info)
# cache.json     (file hashes)
# vectors.db     (SQLite database, if using codesql)
```

---

## 6. 🚀 USAGE

### Basic Usage Pattern

Semantic search works best when you describe **what code does**, not what it's called:

```
# Good: Describes behavior
semantic_search("Find code that validates email addresses in contact forms")

# Good: Asks about relationships
semantic_search("What code depends on the video player?")

# Bad: Grep-style (use grep instead)
semantic_search("grep validateEmail")  # ❌

# Bad: Known file path (use Read instead)
semantic_search("Show me hero_video.js")  # ❌
```

### Query Best Practices

**Do:**
- ✅ Use natural language
- ✅ Describe behavior/intent
- ✅ Add context ("in forms", "for authentication")
- ✅ Ask about relationships
- ✅ Be specific about what you're looking for

**Don't:**
- ❌ Use grep/find syntax
- ❌ Search for exact symbols (use Grep tool)
- ❌ Request known file paths (use Read tool)
- ❌ Be too generic ("Find code")

### Workflow Integration

**Recommended workflow:**

```
1. semantic_search("Find code that handles [feature]")
   ↓
2. Read the top-ranked files for full context
   ↓
3. Use Grep for specific symbol usage if needed
   ↓
4. Make your changes with full understanding
```

---

## 7. 🎯 FEATURES

### 7.1 semantic_search

**Purpose**: Search current project semantically

**Parameters**:
- `query` (string, required) - Natural language search query
- `qdrant_collection` (string, required) - Collection name from state.json
- `max_results` (int, optional) - Maximum results, default: 20
- `refined_answer` (bool, optional) - Enable LLM reranking, default: false

**Example**:
```json
{
  "query": "authentication middleware implementation",
  "qdrant_collection": "codebase-7a1480dc62504bc490",
  "max_results": 15,
  "refined_answer": true
}
```

**Returns**: Ranked code fragments with similarity scores. With `refined_answer`: AI-analyzed summary plus ranked files.

### 7.2 search_commit_history

**Purpose**: Query git commit history (Qdrant mode only)

**Parameters**:
- `query` (string, required) - Search query for commits
- `qdrant_collection` (string, required) - Collection name
- `max_results` (int, optional) - Maximum results, default: 10

**Requirements**:
- Git tracking enabled during indexing
- Commits analyzed by LLM
- **Qdrant backend required** (not available with SQLite)

**Example**:
```json
{
  "query": "when was SQLite storage implemented",
  "qdrant_collection": "codebase-7a1480dc62504bc490",
  "max_results": 5
}
```

### 7.3 visit_other_project

**Purpose**: Search a different workspace/codebase

**Parameters**:
- `query` (string, required) - Search query
- `workspace_path` (string, optional) - Absolute path to workspace
- `qdrant_collection` (string, optional) - Explicit collection name
- `storage_type` (string, optional) - "sqlite" or "qdrant", default: "qdrant"
- `refined_answer` (bool, optional) - Enable LLM reranking, default: false
- `max_results` (int, optional) - Maximum results, default: 20

**Example**:
```json
{
  "query": "payment processing flow",
  "workspace_path": "/home/user/other-project",
  "storage_type": "sqlite",
  "refined_answer": true
}
```

### 7.4 semantic_parallel_search (Advanced)

**Purpose**: Execute multiple query variations in parallel with deduplication

**Parameters**:
- `query` (string, required) - Base query
- `qdrant_collection` (string, required) - Collection name
- `queries` (list, optional) - Up to 5 additional query variations
- `max_results` (int, optional) - Maximum results, default: 20
- `refined_answer` (bool, optional) - Enable LLM reranking, default: false

**Example**:
```json
{
  "query": "How do we handle payment processing?",
  "qdrant_collection": "codebase-1d85d0a83c1348b3be",
  "queries": [
    "payment gateway integration stripe",
    "transaction validation error handling",
    "payment confirmation webhooks"
  ],
  "max_results": 20,
  "refined_answer": false
}
```

**Benefits**:
- Runs queries concurrently
- Removes duplicates by file + line range
- Each file lists exact queries that surfaced it

---

## 8. 💡 EXAMPLES

### Example 1: Feature Discovery

**Scenario**: Find how authentication is implemented

```
# Step 1: Use semantic search
semantic_search("Find code that handles user authentication and session management")

# Step 2: Read top results
Read("src/auth/auth_service.js")

# Step 3: Find specific usage
Grep("authenticateUser", output_mode="content")
```

### Example 2: Understanding Dependencies

**Scenario**: Find what depends on a core module

```
# Step 1: Search for relationships
semantic_search("What code imports or uses the video player component?")

# Expected results:
# - src/components/hero_section.js (imports VideoPlayer)
# - src/animations/hero_animations.js (triggers on video events)
# - src/pages/home.js (renders VideoPlayer)

# Step 2: Read specific files for context
Read("src/components/hero_section.js")
```

### Example 3: Bug Investigation

**Scenario**: Find where a specific behavior originates

```
# Step 1: Describe the behavior
semantic_search("Find code that handles form validation errors and displays them to users")

# Step 2: With refined answer for better analysis
semantic_search(
  query="form validation error display logic",
  refined_answer=true
)

# Expected: AI-analyzed summary pointing to validation and UI code
```

### Example 4: Cross-Project Search

**Scenario**: Find similar patterns in another project

```
# Search another indexed project
visit_other_project(
  query="API rate limiting implementation",
  workspace_path="/home/user/api-project",
  storage_type="sqlite"
)
```

### Example 5: Commit History Search

**Scenario**: Find when a feature was added (Qdrant mode only)

```
# Search commit history
search_commit_history(
  query="when was dark mode feature added",
  qdrant_collection="codebase-abc123"
)

# Expected: Commits related to dark mode implementation
```

---

## 9. 🔧 TROUBLESHOOTING

### Server Not Starting

**Problem**: MCP server fails to start

**Solutions**:
1. Verify Python version is 3.10+
   ```bash
   python3 --version
   ```

2. Check virtual environment is activated
   ```bash
   which python3
   # Should point to venv/bin/python3
   ```

3. Reinstall dependencies
   ```bash
   cd ~/CloudStorage/MCP\ Servers/semantic-search
   source venv/bin/activate
   pip install -r requirements.txt --force-reinstall
   ```

4. Check environment variables are set
   ```bash
   env | grep MCP_CODEBASE
   ```

### Database Not Found

**Problem**: `Error: .codebase/vectors.db not found`

**Solutions**:
1. Index your codebase first
   ```bash
   cd /path/to/your/project
   codesql  # or codebase for Qdrant
   ```

2. Verify index was created
   ```bash
   ls -la .codebase/
   cat .codebase/state.json
   ```

3. Check you're in the correct project directory

### Search Returns No Results

**Problem**: Searches return empty or irrelevant results

**Solutions**:
1. **Check embedder model consistency**
   ```bash
   # Your indexer config
   cat ~/.codebase-index-cli/config.json | grep MODEL

   # Your .env file
   cat .env | grep EMBEDDER_MODEL
   ```
   **Models MUST match exactly!**

2. Verify index has content
   ```bash
   cat .codebase/state.json | python3 -m json.tool
   # Check qdrantStats.totalVectors > 0
   ```

3. Try a simpler query
   ```
   semantic_search("Find JavaScript files")
   ```

### API Rate Limits

**Problem**: `Error: Rate limit exceeded`

**Solutions**:
1. Check your API usage dashboard
2. Add delays between queries
3. Use `refined_answer=false` to reduce API calls
4. Consider a higher API tier

### Tools Not Appearing in AI Client

**Problem**: Semantic search tools don't show in Claude/OpenCode

**Solutions**:
1. Restart your AI client completely

2. Verify configuration path is correct
   ```bash
   ls -la ~/CloudStorage/MCP\ Servers/semantic-search/venv/bin/python
   ```

3. Check configuration file syntax
   ```bash
   python3 -m json.tool < .mcp.json
   # or
   python3 -m json.tool < opencode.json
   ```

4. Check server logs (if available)
   ```bash
   # Run server manually to see errors
   cd ~/CloudStorage/MCP\ Servers/semantic-search
   source venv/bin/activate
   python src/server_sqlite.py 2>&1
   ```

### Slow Search Performance

**Problem**: Search taking >2 seconds

**Possible causes**:
- Large database (>10K files)
- Network latency to embedding API
- `refined_answer=true` adds reranking time

**Solutions**:
1. Use `refined_answer=false` for faster results
2. Reduce `max_results` parameter
3. Run Qdrant locally instead of remote
4. Check network connection to API

### Dimension Mismatch Error

**Problem**: `Error: Vector dimension mismatch`

**Solution**: This is the most common issue!

```bash
# Check indexer dimension
cat .codebase/state.json | grep -i dimension

# Check server config
echo $MCP_CODEBASE_EMBEDDER_DIMENSION

# They MUST match exactly
```

If they don't match, you need to **re-index** with the correct model.

---

## 10. 📚 RESOURCES

### Documentation

- **GitHub Repository**: https://github.com/dudufcb1/semantic-search
- **Indexer Repository**: https://github.com/dudufcb1/codebase-index-cli
- **MCP Protocol**: https://modelcontextprotocol.io

### Embedding Providers

- **OpenAI**: https://platform.openai.com/docs/guides/embeddings
- **Voyage AI**: https://docs.voyageai.com/
- **OpenRouter**: https://openrouter.ai/docs

### Related Skills

If using with Claude Code or OpenCode:

- **mcp-semantic-search skill**: `.opencode/skills/mcp-semantic-search/SKILL.md`
- **Architecture reference**: `.opencode/skills/mcp-semantic-search/references/architecture.md`

### Understanding state.json

The indexer creates `.codebase/state.json` with important information:

```json
{
  "workspacePath": "/absolute/path/to/your/project",
  "qdrantCollection": "codebase-1d85d0a83c1348b3be",
  "createdAt": "2025-10-17T10:13:48.454Z",
  "indexingStatus": {
    "state": "watching"
  },
  "qdrantStats": {
    "totalVectors": 396,
    "uniqueFiles": 22,
    "vectorDimension": 1536
  }
}
```

**Key fields**:
- `qdrantCollection`: Use this as the `qdrant_collection` parameter
- `qdrantStats.vectorDimension`: Must match your server config
- `indexingStatus.state`: "watching" means real-time updates active

### Helper Commands

```bash
# View index status
cat /path/to/project/.codebase/state.json | python3 -m json.tool

# Re-index a project
cd /path/to/project
rm -rf .codebase  # Remove old index
codesql           # Create new index

# Test MCP connection manually
cd ~/CloudStorage/MCP\ Servers/semantic-search
source venv/bin/activate
python src/server_sqlite.py

# Update semantic-search
cd ~/CloudStorage/MCP\ Servers/semantic-search
git pull origin main
pip install -r requirements.txt --upgrade
```

### Project Structure

```
semantic-search/
├── src/
│   ├── server_qdrant.py   # Qdrant-based MCP server
│   └── server_sqlite.py   # SQLite-based MCP server
├── venv/                   # Virtual environment (created during install)
├── .env                    # Your configuration (created from .env.example)
├── .env.example            # Configuration template
└── README.md
```

---

## Quick Reference

### Essential Commands

```bash
# Install
cd ~/CloudStorage/MCP\ Servers
git clone https://github.com/dudufcb1/semantic-search.git
cd semantic-search
python3 -m venv venv
source venv/bin/activate
pip install fastmcp qdrant-client httpx pydantic pydantic-settings python-dotenv

# Index a project (run in project directory)
cd /path/to/your/project
codesql  # SQLite mode
# or
codebase # Qdrant mode

# Test server
cd ~/CloudStorage/MCP\ Servers/semantic-search
source venv/bin/activate
python src/server_sqlite.py

# Update
cd ~/CloudStorage/MCP\ Servers/semantic-search
git pull origin main
pip install -r requirements.txt --upgrade
```

### Configuration Paths

| Client | Configuration File | Key Path |
|--------|-------------------|----------|
| **Claude Code** | `.mcp.json` | `mcpServers.semantic-search` |
| **OpenCode** | `opencode.json` | `mcp.semantic-search` |
| **Claude Desktop** | `claude_desktop_config.json` | `mcpServers.semantic-search` |
| **Cline/Windsurf** | `.mcp.toml` | `[mcp_servers.semantic-search]` |

### Common Query Patterns

**Feature Discovery**:
```
semantic_search("Find code that handles [feature/behavior]")
```

**Relationship Understanding**:
```
semantic_search("What code depends on [component]?")
```

**Pattern Finding**:
```
semantic_search("How do we implement [pattern] in this project?")
```

**Cross-Project Search**:
```
visit_other_project(query="[query]", workspace_path="/path/to/other/project")
```

### Environment Variables Quick Reference

```bash
# Required for all modes
MCP_CODEBASE_EMBEDDER_PROVIDER=openai-compatible
MCP_CODEBASE_EMBEDDER_API_KEY=your-key
MCP_CODEBASE_EMBEDDER_BASE_URL=https://api.openai.com/v1
MCP_CODEBASE_EMBEDDER_MODEL_ID=text-embedding-3-small
MCP_CODEBASE_EMBEDDER_DIMENSION=1536

# Required for Qdrant mode
MCP_CODEBASE_QDRANT_URL=http://localhost:6333

# Optional (for refined_answer=true)
MCP_CODEBASE_JUDGE_PROVIDER=openai-compatible
MCP_CODEBASE_JUDGE_API_KEY=your-key
MCP_CODEBASE_JUDGE_MODEL_ID=gpt-4o-mini
```

---

**Installation Complete!**

You now have Semantic Search MCP installed and configured. Use it to find code by intent, understand relationships between components, and explore your codebase with natural language queries.

Start searching by asking your AI assistant:
```
Use semantic_search to find code that handles [your feature]
```

For more information, refer to the GitHub repository and the mcp-semantic-search skill documentation.
