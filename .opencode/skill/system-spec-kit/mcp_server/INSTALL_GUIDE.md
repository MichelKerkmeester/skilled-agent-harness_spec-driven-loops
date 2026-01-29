# Spec Kit Memory MCP Server Installation Guide

Complete installation and configuration guide for the Spec Kit Memory MCP server, providing semantic memory and context preservation across AI sessions. Features vector-based semantic search with hybrid ranking, fast trigger phrase matching (<50ms), six-tier importance system (constitutional to deprecated), checkpoint save/restore, and automatic memory indexing. Essential for maintaining continuity in long-running projects, recovering context after session breaks, and surfacing relevant prior decisions during implementation.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Package**: Bundled | **Dependencies**: Node.js 18+, Ollama (optional)

---

#### TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4--configuration)
5. [✅ VERIFICATION](#5--verification)
6. [💾 DATABASE BACKUP AND RESTORE](#6--database-backup-and-restore)
7. [🚀 USAGE](#7--usage)
8. [🎯 FEATURES](#8--features)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 🤖 AI INSTALL GUIDE

### Verify Success (30 seconds)

After installation, test immediately:
1. Open Claude Code in a configured project
2. Type: "Search my memories for recent decisions"
3. See tool invocation = SUCCESS

Not working? Jump to [Troubleshooting](#9--troubleshooting).

---

> **Related Documentation:**
> - [Skill README](../../skill/system-spec-kit/README.md) - Overview and workflow details
> - [SKILL.md](../../skill/system-spec-kit/SKILL.md) - AI agent instructions for memory operations
> - `/memory:save` and `/memory:search` commands - Command reference

> **Migration Note (December 2025):** The semantic memory system was merged into `system-spec-kit`. All paths in this guide reflect the new locations. The `spec_kit_memory` MCP tool names remain unchanged for backward compatibility.

---

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to configure the Spec Kit Memory MCP server for conversation memory retrieval.

The server is already bundled in my project at:
.opencode/skill/system-spec-kit/mcp_server/context-server.js

Please help me:
1. Check if I have Node.js 18+ installed
2. Install dependencies in the mcp_server directory
3. Configure my AI environment (I'm using: [Claude Code / OpenCode])
4. Initialize the database
5. Test the installation with a basic memory search

My project path is: [your-project-path]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ and npm are available
- Run npm install in the mcp_server directory for dependencies
- Configure MCP settings for your platform
- Initialize the SQLite database with vector extension
- Test all tools: `memory_search`, `memory_match_triggers`

**Expected setup time:** 5-10 minutes

---

## 1. 📖 OVERVIEW

The Spec Kit Memory MCP Server provides AI assistants with conversation memory retrieval capabilities. It enables semantic search using local vector embeddings, fast trigger phrase matching, and direct memory content loading.

### Source Repository

| Property        | Value                                         |
| --------------- | --------------------------------------------- |
| **Type**        | Bundled (internal project)                    |
| **Location**    | `.opencode/skill/system-spec-kit/mcp_server/` |
| **Entry Point** | `context-server.js`                           |
| **License**     | Internal                                      |

> **Note**: This MCP server is bundled within the `system-spec-kit` skill folder. No external installation or GitHub repository required - the server code travels with the skill for self-contained deployment.

### Key Features

- **Multi-Provider Embeddings**: Supports HF Local (768d), Voyage AI (1024d), OpenAI (1536d) - dimensions auto-detected
- **Fast Trigger Matching**: Sub-50ms phrase matching for proactive surfacing
- **Multi-Concept Search**: Find memories matching ALL specified concepts
- **Graceful Degradation**: Falls back to anchor-only mode if sqlite-vec unavailable
- **Cross-Platform**: Works with Claude Code, OpenCode, and other MCP clients

### Embedding Model

> **Default Model**: `nomic-ai/nomic-embed-text-v1.5` (768 dimensions)
> **Cloud Options**: Voyage AI (1024d), OpenAI (1536d) - configure via environment variables

| Specification      | Default (HF Local)               | Voyage AI                 | OpenAI                    |
| ------------------ | -------------------------------- | ------------------------- | ------------------------- |
| **Model Name**     | `nomic-ai/nomic-embed-text-v1.5` | `voyage-4`                | `text-embedding-3-small`  |
| **Dimensions**     | 768                              | 1024                      | 1536                      |
| **Context Window** | 8,192 tokens                     | 32,000 tokens             | 8,191 tokens              |
| **Inference**      | Local (HuggingFace Transformers) | Cloud API                 | Cloud API                 |
| **Storage**        | sqlite-vec (dynamic dimensions)  | sqlite-vec (auto-config)  | sqlite-vec (auto-config)  |

**Voyage 4 Support:**
The system supports the Voyage 4 model family (released Jan 2026), including `voyage-4-large`, `voyage-4`, and `voyage-4-lite`. These models share an embedding space, allowing asymmetric retrieval (e.g., embedding documents with `voyage-4-large` and querying with `voyage-4-lite`).

**Note**: Dimensions are now auto-detected from the provider profile. Each provider uses its own database file to prevent dimension mismatches.

**Why nomic-embed-text-v1.5 as default?**
- 2x larger context window than alternatives (8K vs 512 tokens)
- Better semantic understanding for technical documentation
- Fully local inference - no API calls, complete privacy

### Tool Selection Flowchart

```
User Request
     │
     ▼
┌─────────────────────────────────────────┐
│ Does request contain specific keywords?  │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
        YES              NO
         │               │
         ▼               ▼
┌─────────────────┐  ┌────────────────────┐
│ memory_match_   │  │ Need semantic      │
│ triggers        │  │ understanding?     │
│ (<50ms)         │  └─────────┬──────────┘
└────────┬────────┘            │
         │              ┌──────┴──────┐
         │             YES            NO
         │              │              │
         ▼              ▼              ▼
┌─────────────────┐  ┌──────────────┐  ┌─────────────────────┐
│ Found matches?  │  │ memory_search│  │ memory_search       │
│                 │  │ (~500ms)     │  │ (includeContent:true│
└────────┬────────┘  └──────────────┘  │  for direct access) │
         │                             └─────────────────────┘
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│ Done!  │  │ memory_search│
│        │  │ (fallback)   │
└────────┘  └──────────────┘
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Client (Claude/OpenCode)             │
└─────────────────────────────┬───────────────────────────────┘
                              │ stdio
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    context-server.js                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ MCP Protocol Handler (@modelcontextprotocol/sdk)    │    │
│  │ - ListTools / CallTool handlers                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                              │
│  ┌───────────┬───────────────┼───────────────┬───────────┐  │
│  │           │               │               │           │  │
│  ▼           ▼               ▼               ▼           │  │
│ ┌─────┐   ┌─────────┐   ┌─────────┐   ┌──────────────┐   │  │
│ │embed│   │vector-  │   │trigger- │   │trigger-      │   │  │
│ │dings│   │index.js │   │matcher  │   │extractor.js  │   │  │
│ │.js  │   │         │   │.js      │   │(save only)   │   │  │
│ └──┬──┘   └────┬────┘   └────┬────┘   └──────────────┘   │  │
│    │           │              │                          │  │
│    │     ┌─────┴─────┐        │                          │  │
│    │     │           │        │                          │  │
│    ▼     ▼           ▼        ▼                          │  │
│ ┌────────────┐  ┌────────────────┐                       │  │
│ │ HuggingFace│  │ SQLite + vec   │                       │  │
│ │ nomic-v1.5 │  │ memory-index   │                       │  │
│ │ (local)    │  │ .sqlite        │                       │  │
│ └────────────┘  └────────────────┘                       │  │
└─────────────────────────────────────────────────────────────┘
```

### Performance Targets

| Operation            | Target | Typical |
| -------------------- | ------ | ------- |
| Trigger matching     | <50ms  | ~35ms   |
| Vector search        | <500ms | ~450ms  |
| Embedding generation | <500ms | ~400ms  |

---

## 2. 📋 PREREQUISITES

Before installing the Spec Kit Memory MCP server, ensure you have:

### Required

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x or higher
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- **MCP-Compatible Client** (one of the following):
  - Claude Code CLI
  - OpenCode CLI

### Dependencies (Auto-installed)

These dependencies are required and typically available via shared node_modules:

| Dependency                  | Purpose                     |
| --------------------------- | --------------------------- |
| `@modelcontextprotocol/sdk` | MCP protocol implementation |
| `better-sqlite3`            | SQLite database driver      |
| `sqlite-vec`                | Vector similarity extension |
| `@huggingface/transformers` | Local embedding model       |

### Database Location

The memory database is stored at:
```
.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

This location is within the skill folder for self-contained deployment.

### Common Setup Gotchas

**Two config files needed (Claude Code):**
- `.mcp.json` - defines the server
- `settings.local.json` - enables via `enabledMcpjsonServers: ["spec_kit_memory"]`

**Platform-specific sqlite-vec:**
- macOS ARM: `sqlite-vec-darwin-arm64`
- macOS Intel: `sqlite-vec-darwin-x64`
- Linux: `sqlite-vec-linux-x64`

**Graceful fallback:** If sqlite-vec fails, system uses keyword search automatically.

---

## 3. 📥 INSTALLATION

The Spec Kit Memory MCP server is bundled within the `system-spec-kit` skill folder. No external installation or file copying is required.

### Skill Folder Structure

```
.opencode/skill/system-spec-kit/
├── database/
│   └── context-index.sqlite      # Vector database (auto-created)
├── mcp_server/
│   ├── context-server.js         # Main MCP server entry point
│   ├── package.json              # Dependencies manifest
│   ├── lib/                      # Server modules
│   │   ├── embeddings.js         # HuggingFace embedding generation
│   │   ├── vector-index.js       # SQLite-vec database operations
│   │   ├── trigger-matcher.js    # Fast phrase matching
│   │   └── ...                   # Other modules
│   └── scripts/                  # CLI utilities
├── scripts/
│   └── generate-context.js       # Memory file generator
├── SKILL.md                      # AI agent instructions
└── README.md                     # Skill documentation
```

### Step 1: Install Dependencies

Navigate to the MCP server directory and install dependencies:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm install
```

This installs all required packages including:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `better-sqlite3` - SQLite database driver
- `sqlite-vec` - Vector similarity extension
- `@huggingface/transformers` - Local embedding model

### Step 2: Test Server Startup

```bash
# Test that server starts correctly
node .opencode/skill/system-spec-kit/mcp_server/context-server.js
# Press Ctrl+C after seeing successful startup message
```

### Step 3: Configure Your MCP Client

See [Section 4: Configuration](#4--configuration) for client-specific setup.

### Validation: `prerequisites_complete`

**Checklist:**
- [ ] Server file exists at expected path
- [ ] Dependencies installed (better-sqlite3 present)
- [ ] Server can start without errors

**Quick Verification:**
```bash
ls .opencode/skill/system-spec-kit/mcp_server/context-server.js && ls .opencode/skill/system-spec-kit/mcp_server/node_modules/better-sqlite3 && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

---

## 4. ⚙️ CONFIGURATION

### Option A: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [
        "${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/context-server.js"
      ],
      "env": {},
      "disabled": false
    }
  }
}
```

**Note:** Replace `${workspaceFolder}` with your absolute project path, e.g.:
`/Users/yourname/projects/my-project/.opencode/skill/system-spec-kit/mcp_server/context-server.js`

Enable in `settings.local.json`:

```json
{
  "enabledMcpjsonServers": [
    "spec_kit_memory"
  ]
}
```

### Option B: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": [
        "node",
        "${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/context-server.js"
      ],
      "environment": {
        "EMBEDDINGS_PROVIDER": "auto",
        "VOYAGE_API_KEY": "YOUR_VOYAGE_API_KEY_HERE",
        "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
        "_NOTE_1_DATABASE": "Stores vectors in: .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite",
        "_NOTE_2_PROVIDERS": "Supports: Voyage (1024 dims, recommended), OpenAI (1536/3072 dims), HF Local (768 dims, fallback)",
        "_NOTE_3_AUTO_DETECTION": "Priority: VOYAGE_API_KEY -> OPENAI_API_KEY -> HF Local (no installation needed)",
        "_NOTE_4_VOYAGE_4": "Defaults to 'voyage-4'. Override with VOYAGE_EMBEDDINGS_MODEL env var.",
        "_NOTE_5_NEW_PROJECT": "When copying to new project, update command path to match new location"
      }
    }
  }
}
```

**Note:** Replace `${workspaceFolder}` with your absolute project path.

### Self-Contained Architecture Benefits

The MCP server and database are bundled **inside the skill folder** for several reasons:

1. **Portable**: Copy `.opencode/skill/system-spec-kit/` to any project and it works
2. **Project-isolated**: Each project has its own memory database - no cross-contamination
3. **Version controlled**: Server code travels with the skill, ensuring compatibility
4. **Simple deployment**: No external dependencies or separate MCP server installations

**When copying to a new project:**
1. Copy the entire `.opencode/skill/system-spec-kit/` folder
2. Update the path in `opencode.json` to match the new project location
3. Run `npm install` in the `mcp_server/` directory
4. The database will be created fresh on first use (or copy `database/` to preserve memories)

### Database Path Configuration

The default database path is `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`. This can be overridden via environment variable:

```json
{
  "environment": {
    "MEMORY_DB_PATH": "/custom/path/context-index.sqlite"
  }
}
```

---

## 5. ✅ VERIFICATION

### One-Command Health Check

```bash
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT 'OK: ' || COUNT(*) || ' memories' FROM memory_index" 2>/dev/null || echo "Database not created yet (will be created on first save)"
```

### Check 1: Verify Server Files

```bash
# Check all required files exist
ls -la .opencode/skill/system-spec-kit/mcp_server/
# Should show: context-server.js, lib/, package.json

ls -la .opencode/skill/system-spec-kit/mcp_server/lib/
# Should show: embeddings.js, vector-index.js, trigger-matcher.js,
#              memory-parser.js, importance-tiers.js, and more
```

### Check 2: Verify Dependencies Installed

```bash
# Check node_modules exists
ls -la .opencode/skill/system-spec-kit/mcp_server/node_modules/better-sqlite3
# Should show the better-sqlite3 directory
```

### Check 3: Test Server Startup

```bash
# Start server manually (will wait for MCP protocol input)
node .opencode/skill/system-spec-kit/mcp_server/context-server.js

# Expected: No errors, server waits for input
# Press Ctrl+C to exit
```

### Check 4: Verify in Your AI Client

**In Claude Code:**
```bash
# Start Claude Code session
claude

# Ask about available tools
> What memory tools are available?

# Expected: Should list memory_search, memory_match_triggers
```

**In OpenCode:**
```bash
opencode

> List available MCP tools

# Expected: Memory tools should appear
```

### Check 5: Test Database Connection

```bash
# Check database exists and has tables
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite ".tables"
# Expected: memory_index vec_memories

# Count indexed memories
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
```

### Validation: `installation_complete`

**Checklist:**
- [ ] Server files exist
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] MCP config is valid JSON
- [ ] Memory tools appear in AI client (14 tools)
- [ ] Database tables created (memory_index, vec_memories)

**Quick Verification:**
```bash
ls .opencode/skill/system-spec-kit/mcp_server/context-server.js && python3 -m json.tool < .mcp.json > /dev/null && sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite ".tables" 2>/dev/null | grep -q "memory_index" && echo "✅ PASS" || echo "❌ FAIL"
```

> **Note:** This command checks `.mcp.json` (Claude Code). For OpenCode, verify `opencode.json` instead: `python3 -m json.tool < opencode.json`

❌ **STOP if validation fails** - Fix before continuing.

---

## 6. 💾 DATABASE BACKUP AND RESTORE

The memory database stores all indexed memories and embeddings. Backup before risky operations.

### When to Backup

| Situation                     | Action       |
| ----------------------------- | ------------ |
| Before schema migrations      | **Required** |
| Before bulk deletions         | **Required** |
| Before force re-indexing      | Recommended  |
| Weekly maintenance            | Recommended  |
| Before major OpenCode updates | Recommended  |

### Backup Procedure

**Create timestamped backup:**
```bash
cp .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/database/backup-$(date +%Y%m%d-%H%M%S).sqlite
```

**Verify backup was created:**
```bash
ls -la .opencode/skill/system-spec-kit/mcp_server/database/backup-*.sqlite
```

**Verify backup integrity:**
```bash
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/backup-*.sqlite "SELECT COUNT(*) FROM memory_index"
```

### Restore Procedure

**1. Stop MCP server** (close OpenCode/Claude Code)

**2. Restore from backup:**
```bash
cp .opencode/skill/system-spec-kit/mcp_server/database/backup-YYYYMMDD-HHMMSS.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

**3. Verify restore:**
```bash
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
```

**4. Restart OpenCode** to reload the MCP server with restored data

> **Important:** After restoring, restart OpenCode to clear the MCP server's in-memory cache. The server caches database state and won't see restored data until restarted.

### Checkpoint vs Backup

| Feature      | Checkpoint (in-database) | File Backup            |
| ------------ | ------------------------ | ---------------------- |
| **Use case** | Logical restore points   | Full disaster recovery |
| **Speed**    | Fast (metadata only)     | Slower (full copy)     |
| **Scope**    | Per spec folder          | Entire database        |
| **Storage**  | Inside database          | Separate file          |
| **Recovery** | MCP tool                 | Manual file copy       |

**Recommendation:** Use checkpoints for routine save points, file backups for protection against corruption.

### Validation: `verification_complete`

**Checklist:**
- [ ] Backup file exists
- [ ] Backup contains valid data (memory count > 0)

**Quick Verification:**
```bash
ls .opencode/skill/system-spec-kit/mcp_server/database/backup-*.sqlite 2>/dev/null && sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/backup-*.sqlite "SELECT COUNT(*) FROM memory_index" 2>/dev/null | grep -q "[1-9]" && echo "✅ PASS" || echo "❌ FAIL"
```

❌ **STOP if validation fails** - Fix before continuing.

---

## 7. 🚀 USAGE

### Pattern 1: Quick Topic Check

When starting work on a topic, check for existing context:

```
1. Call memory_match_triggers with topic keywords
   → Fast check for relevant memories (<50ms)

2. If matches found, use memory_search with includeContent: true
   → Returns full content of matched memories directly

3. If no matches, call memory_search for semantic lookup
   → Broader search using meaning (slower but thorough)
```

**Example conversation:**
```
User: Let's work on the authentication system

AI uses memory_match_triggers("authentication system")
→ Returns matches with specFolders and file paths

AI uses memory_search({ specFolder: "049-auth-system", includeContent: true })
→ Returns full context from previous sessions
```

### Pattern 2: Deep Research

When researching a complex topic:

```
1. Call memory_search with natural language query
   → Find semantically related memories

2. Call memory_search with concepts array
   → Find memories matching ALL concepts (AND search)
   → Example: ["authentication", "error handling", "retry"]

3. For full content, use memory_search with includeContent: true
   → Returns content directly in results
   → Or use Read(filePath) on returned file paths
```

### Pattern 3: Direct Access

When you know exactly what you need:

```
1. Call memory_search with specFolder and includeContent: true
   → Get memories for that spec with full content

2. Or use Read(filePath) on search results
   → Read specific memory files directly
```

**Example:**
```json
{
  "specFolder": "011-spec-kit-memory-upgrade",
  "includeContent": true
}
```

### Pattern 4: Creating and Managing Memories

#### Creating a Memory File

Use the `generate-context.js` script to create properly formatted memory files:

```bash
# Standard location (project root)
node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/[###-name]/

# Alternative location (inside .opencode)
node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/[###-name]/
```

The script:
1. Prompts for session context interactively
2. Generates a timestamped memory file in the spec's `memory/` folder
3. Uses ANCHOR format for searchable sections
4. Auto-indexes the file into the vector database

**Example:**

```bash
# After completing auth implementation work (standard location)
node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/049-auth-system/
# Creates: specs/049-auth-system/memory/24-12-25_14-30__auth.md

# Or using alternative location
node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/049-auth-system/
# Creates: .opencode/specs/049-auth-system/memory/24-12-25_14-30__auth.md

# Auto-indexed with extracted trigger phrases
```

**Important:** This is the ONLY sanctioned method for creating memory files (per AGENTS.md Gate 5). Do NOT manually create memory files with the Write tool.

#### Setting Importance Tier

After creating a memory, you can adjust its importance tier:

```typescript
memory_update({ 
  id: 42, 
  importanceTier: "critical" 
})
```

For core project rules that should ALWAYS surface, use constitutional tier (see §8.16).

### Tool Selection Guide

| Scenario               | Tool                                        | Why                      |
| ---------------------- | ------------------------------------------- | ------------------------ |
| Quick keyword lookup   | `memory_match_triggers`                     | <50ms, no embeddings     |
| Semantic understanding | `memory_search`                             | Vector similarity        |
| Known spec folder      | `memory_search` with `specFolder`           | Filtered search          |
| Need full content      | `memory_search` with `includeContent: true` | Returns content directly |
| Multi-concept search   | `memory_search` with `concepts`             | AND search               |
| Read specific file     | `Read(filePath)` from search results        | Direct file access       |

### Memory Commands Reference

Use these commands in your AI client for common memory operations:

| Command                             | Description                         |
| ----------------------------------- | ----------------------------------- |
| `/memory:save <folder>`             | Save current context to spec folder |
| `/memory:search`                    | Open dashboard mode (interactive)   |
| `/memory:search <query>`            | Search memories by query            |
| `/memory:search cleanup`            | Find orphaned memories              |
| `/memory:search triggers`           | Show trigger phrase configuration   |
| `/memory:checkpoint create <name>`  | Create named checkpoint             |
| `/memory:checkpoint list`           | List available checkpoints          |
| `/memory:checkpoint restore <name>` | Restore from checkpoint             |
| `/memory:checkpoint delete <name>`  | Delete a checkpoint                 |

**Examples:**
```bash
# Save context after completing auth feature
/memory:save 049-auth-system

# Search for previous decisions
/memory:search "authentication architecture decisions"

# Create checkpoint before major changes
/memory:checkpoint create before-migration-v2

# Restore if something goes wrong
/memory:checkpoint restore before-migration-v2
```

### Importance Tiers Quick Reference

| Tier             | Level | Decay     | Use Case                           |
| ---------------- | ----- | --------- | ---------------------------------- |
| `constitutional` | 0     | Never     | Core rules, always surfaced        |
| `critical`       | 1     | Slow      | Architecture decisions             |
| `important`      | 2     | Normal    | Key learnings                      |
| `normal`         | 3     | Normal    | General context (default)          |
| `temporary`      | 4     | Fast      | Session-specific (7-day expiry)    |
| `deprecated`     | 5     | Immediate | Outdated info (hidden from search) |

> **Tip:** Set importance tier with `memory_update({ id: 42, importanceTier: "critical" })`

---

## 8. 🎯 FEATURES

### 8.1 memory_search

**Purpose**: Search conversation memories semantically using vector similarity. Constitutional tier memories are ALWAYS included at the top of results, regardless of query.

#### Hybrid Search

The memory search now combines two search methods for better results:

| Method                     | Description                                 | Strength                |
| -------------------------- | ------------------------------------------- | ----------------------- |
| **FTS5 Full-Text Search**  | Finds exact keyword matches                 | Precise term matching   |
| **Vector Semantic Search** | Finds semantically similar content          | Meaning-based discovery |
| **RRF Fusion**             | Merges results using Reciprocal Rank Fusion | Best of both approaches |

The system automatically falls back to pure vector search if hybrid search fails (e.g., FTS5 index unavailable).

**Parameters**:

| Parameter               | Type    | Required | Default | Description                                       |
| ----------------------- | ------- | -------- | ------- | ------------------------------------------------- |
| `query`                 | string  | Yes*     | -       | Natural language search query                     |
| `concepts`              | array   | No*      | -       | 2-5 concepts for AND search (requires all)        |
| `specFolder`            | string  | No       | -       | Limit to specific spec folder                     |
| `limit`                 | number  | No       | 10      | Maximum results                                   |
| `tier`                  | string  | No       | -       | Filter by importance tier                         |
| `contextType`           | string  | No       | -       | Filter by context type (decision, research, etc.) |
| `useDecay`              | boolean | No       | true    | Apply temporal decay scoring                      |
| `includeContiguity`     | boolean | No       | false   | Include adjacent memories in results              |
| `includeConstitutional` | boolean | No       | true    | Include constitutional tier at top of results     |
| `includeContent`        | boolean | No       | false   | Include full memory content in results            |

*Either `query` OR `concepts` required (not both)

**Example Request**:
```json
{
  "query": "authentication implementation decisions",
  "specFolder": "049-auth-system",
  "tier": "critical",
  "limit": 5
}
```

**Example Response**:
```json
{
  "searchType": "vector",
  "count": 2,
  "results": [
    {
      "id": 42,
      "specFolder": "049-auth-system",
      "filePath": "specs/049-auth-system/memory/28-11-25_14-30__oauth.md",
      "title": "OAuth Implementation Session",
      "similarity": 0.89,
      "triggerPhrases": ["oauth", "jwt", "authentication"],
      "createdAt": "2025-11-28T14:30:00Z"
    }
  ]
}
```

### 8.2 memory_match_triggers

**Purpose**: Fast trigger phrase matching without embeddings. Use for quick keyword-based lookups.

**Parameters**:

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- | ------- | ------------------------------ |
| `prompt`  | string | Yes      | -       | Text to match against triggers |
| `limit`   | number | No       | 3       | Maximum results                |

**Example Request**:
```json
{
  "prompt": "How did we implement OAuth with JWT tokens?",
  "limit": 3
}
```

**Example Response**:
```json
{
  "matchType": "trigger-phrase",
  "count": 2,
  "results": [
    {
      "memoryId": 42,
      "specFolder": "049-auth-system",
      "filePath": "specs/049-auth-system/memory/28-11-25_14-30__oauth.md",
      "title": "OAuth Implementation",
      "matchedPhrases": ["oauth", "jwt"],
      "importanceWeight": 0.8
    }
  ]
}
```

### 8.3 memory_list

**Purpose**: Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update.

**Parameters**:

| Parameter    | Type   | Required | Default    | Description                                     |
| ------------ | ------ | -------- | ---------- | ----------------------------------------------- |
| `limit`      | number | No       | 20         | Maximum results (max 100)                       |
| `offset`     | number | No       | 0          | Skip results (for pagination)                   |
| `specFolder` | string | No       | -          | Filter by spec folder                           |
| `sortBy`     | string | No       | created_at | Sort: created_at, updated_at, importance_weight |

**Example Request**:
```json
{
  "specFolder": "049-auth-system",
  "limit": 10,
  "sortBy": "updated_at"
}
```

### 8.4 memory_update

**Purpose**: Update an existing memory with corrections. Re-generates embedding if content changes.

**Parameters**:

| Parameter          | Type   | Required | Default | Description                    |
| ------------------ | ------ | -------- | ------- | ------------------------------ |
| `id`               | number | Yes      | -       | Memory ID to update            |
| `title`            | string | No       | -       | New title                      |
| `triggerPhrases`   | array  | No       | -       | Updated trigger phrases        |
| `importanceWeight` | number | No       | -       | New importance weight (0-1)    |
| `importanceTier`   | string | No       | -       | Set importance tier (see 8.15) |

**Embedding Regeneration**: When you update a memory's title, the embedding is automatically regenerated to ensure accurate search results. The response includes an `embeddingRegenerated` field indicating whether this occurred.

**Example Request**:
```json
{
  "id": 42,
  "importanceTier": "critical",
  "triggerPhrases": ["oauth", "jwt", "authentication", "security"]
}
```

### 8.5 memory_delete

**Purpose**: Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information.

**Parameters**:

| Parameter    | Type    | Required | Default | Description                                       |
| ------------ | ------- | -------- | ------- | ------------------------------------------------- |
| `id`         | number  | No*      | -       | Memory ID to delete                               |
| `specFolder` | string  | No*      | -       | Delete all memories in this spec folder           |
| `confirm`    | boolean | No       | -       | Required for bulk delete (specFolder)             |
| `dryRun`     | boolean | No       | false   | Preview what would be deleted without deleting    |

*Either `id` or `specFolder` required

**Example Request** (single):
```json
{
  "id": 42
}
```

**Example Request** (bulk with dryRun preview):
```json
{
  "specFolder": "deprecated-project",
  "dryRun": true
}
```

**Example dryRun Response**:
```json
{
  "dryRun": true,
  "wouldDelete": 15,
  "memories": [
    { "id": 1, "title": "Memory 1", "specFolder": "deprecated-project" },
    { "id": 2, "title": "Memory 2", "specFolder": "deprecated-project" }
  ]
}
```

**Example Request** (confirmed bulk delete):
```json
{
  "specFolder": "deprecated-project",
  "confirm": true
}
```

### 8.6 memory_stats

**Purpose**: Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders.

**Parameters**: None required.

**Example Response**:
```json
{
  "totalMemories": 156,
  "byTier": {
    "constitutional": 3,
    "critical": 12,
    "important": 28,
    "normal": 98,
    "temporary": 15,
    "deprecated": 0
  },
  "topFolders": [
    { "specFolder": "011-spec-kit-memory", "count": 23 },
    { "specFolder": "049-auth-system", "count": 18 }
  ],
  "oldestMemory": "2025-06-15T10:30:00Z",
  "newestMemory": "2025-12-16T14:22:00Z"
}
```

### 8.7 memory_validate

**Purpose**: Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence (≥90%) and sufficient validation counts may be promoted to critical tier.

**Parameters**:

| Parameter   | Type    | Required | Default | Description                                |
| ----------- | ------- | -------- | ------- | ------------------------------------------ |
| `id`        | number  | Yes      | -       | Memory ID to validate                      |
| `wasUseful` | boolean | Yes      | -       | True increases confidence, false decreases |

**Example Request**:
```json
{
  "id": 42,
  "wasUseful": true
}
```

**Confidence Promotion**: When a memory reaches 90% confidence with 5+ validations, it becomes eligible for automatic promotion to `critical` tier.

### 8.8 memory_save

**Purpose**: Index a memory file into the semantic memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index.

**Parameters**:

| Parameter  | Type    | Required | Default | Description                                   |
| ---------- | ------- | -------- | ------- | --------------------------------------------- |
| `filePath` | string  | Yes      | -       | Absolute path to memory file                  |
| `force`    | boolean | No       | false   | Force re-index even if content hash unchanged |

**Example Request**:
```json
{
  "filePath": "/Users/me/project/specs/049-auth-system/memory/session-notes.md",
  "force": false
}
```

**Alternative location example**:
```json
{
  "filePath": "/Users/me/project/.opencode/specs/049-auth-system/memory/session-notes.md",
  "force": false
}
```

**Note**: File must be in a `specs/**/memory/` or `.opencode/specs/**/memory/` directory structure.

> **Specs Directory Locations**: The system checks for specs folders in two locations (in priority order):
> 1. `<project-root>/specs/` - Standard location at project root
> 2. `<project-root>/.opencode/specs/` - Alternative location inside .opencode folder
> 
> If both locations exist, the project root location takes precedence.

### 8.9 memory_index_scan

**Purpose**: Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files.

**Parameters**:

| Parameter               | Type    | Required | Default | Description                                           |
| ----------------------- | ------- | -------- | ------- | ----------------------------------------------------- |
| `specFolder`            | string  | No       | -       | Limit scan to specific spec folder                    |
| `force`                 | boolean | No       | false   | Force re-index all files (ignore hash)                |
| `includeConstitutional` | boolean | No       | true    | Also scan `.opencode/skill/*/constitutional/` directories |

#### Batch Processing

Bulk indexing uses controlled concurrency to prevent resource exhaustion:

| Setting          | Default | Description                            |
| ---------------- | ------- | -------------------------------------- |
| `BATCH_SIZE`     | 5       | Files processed concurrently per batch |
| `BATCH_DELAY_MS` | 100     | Delay between batches (ms)             |

Progress is logged showing batch completion (e.g., `[index-scan] Processing batch 3/10`).

**Example Request**:
```json
{
  "specFolder": "005-memory",
  "force": false
}
```

### 8.10 checkpoint_create

**Purpose**: Create a named checkpoint of current memory state for later restoration. Use before risky operations.

**Parameters**:

| Parameter    | Type   | Required | Default | Description                   |
| ------------ | ------ | -------- | ------- | ----------------------------- |
| `name`       | string | Yes      | -       | Unique checkpoint name        |
| `specFolder` | string | No       | -       | Limit to specific spec folder |
| `metadata`   | object | No       | -       | Additional metadata           |

**Example Request**:
```json
{
  "name": "before-migration-v2",
  "specFolder": "011-spec-kit-memory",
  "metadata": { "reason": "Pre-schema update backup" }
}
```

### 8.11 checkpoint_list

**Purpose**: List all available checkpoints.

**Parameters**:

| Parameter    | Type   | Required | Default | Description           |
| ------------ | ------ | -------- | ------- | --------------------- |
| `specFolder` | string | No       | -       | Filter by spec folder |
| `limit`      | number | No       | 50      | Maximum results       |

### 8.12 checkpoint_restore

**Purpose**: Restore memory state from a checkpoint.

**Parameters**:

| Parameter       | Type    | Required | Default | Description                           |
| --------------- | ------- | -------- | ------- | ------------------------------------- |
| `name`          | string  | Yes      | -       | Checkpoint name to restore            |
| `clearExisting` | boolean | No       | false   | Clear current memories before restore |

**Example Request**:
```json
{
  "name": "before-migration-v2",
  "clearExisting": false
}
```

### 8.13 checkpoint_delete

**Purpose**: Delete a checkpoint that is no longer needed.

**Parameters**:

| Parameter | Type   | Required | Default | Description               |
| --------- | ------ | -------- | ------- | ------------------------- |
| `name`    | string | Yes      | -       | Checkpoint name to delete |

**Example Request**:
```json
{
  "name": "before-migration-v2"
}
```

### 8.14 Six-Tier Importance System

Memories are classified into six importance tiers that affect search ranking, decay behavior, and auto-expiration:

| Tier             | Search Boost | Decay | Auto-Expire | Use Case                          |
| ---------------- | ------------ | ----- | ----------- | --------------------------------- |
| `constitutional` | 3.0x         | No    | Never       | Core rules - always surface first |
| `critical`       | 2.0x         | No    | Never       | Architecture decisions            |
| `important`      | 1.5x         | No    | Never       | Key implementations               |
| `normal`         | 1.0x         | Yes   | Never       | Standard memories (default)       |
| `temporary`      | 0.5x         | Yes   | 7 days      | Session notes                     |
| `deprecated`     | 0.0x         | N/A   | Manual      | Hidden from search                |

**Special Behaviors**:
- **Constitutional**: Always included at top of search results, regardless of query relevance. With plugin: shown in dashboard summary (~500-800 tokens total for entire dashboard)
- **Deprecated**: Excluded from search results entirely, accessible only via direct `memory_list` or `Read(filePath)`
- **Temporary**: Automatically deleted after 7 days
- **Decay**: ~62-day half-life for temporal relevance scoring (normal/temporary tiers only)

**Setting Tier**: Use `memory_update` with `importanceTier` parameter:
```json
{
  "id": 42,
  "importanceTier": "critical"
}
```

### 8.15 Creating Constitutional Memories

Constitutional memories are special memories that ALWAYS appear at the top of search results, regardless of query. Use them for:

- Gate enforcement reminders (like Gate 3 spec folder question)
- Project-wide architectural decisions that must never be forgotten
- Core workflow rules that apply to every session

**Creation Workflow:**

1. **Create memory content** - Write content with clear, actionable reminders

2. **Generate memory file:**
   ```bash
   node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/[folder]/
   ```

3. **Index the memory** (if not auto-indexed):
   ```typescript
   memory_save({ filePath: "/path/to/memory/file.md" })
   // Note the returned memoryId
   ```

4. **Promote to constitutional tier:**
   ```typescript
   memory_update({
     id: <memoryId>,
     importanceTier: "constitutional",
     triggerPhrases: [
       // 20-40 phrases for broad coverage
       "fix", "implement", "create", "modify", "update",
       "refactor", "comprehensive", "all bugs", "15 agents"
     ]
   })
   ```

5. **Verify enforcement:**
   ```typescript
   // Test trigger matching
   memory_match_triggers({ prompt: "fix all bugs in codebase" })
   // Should return your constitutional memory with matchedPhrases
   
   // Test search surfacing
   memory_search({ query: "unrelated topic" })
   // Constitutional memory should appear FIRST with similarity: 100
   ```

**Example - Gate 3 Enforcement Memory:**

See `specs/005-memory/018-gate3-enforcement/` for a complete example:
- Memory file with reminder content (~320 tokens)
- 33 trigger phrases covering action words + scale indicators
- Constitutional tier promotion via `memory_update()`
- Validation via `memory_match_triggers()` testing

**Token Budget:** Keep constitutional memories under 500 tokens to ensure they don't overwhelm search results.

**Limit:** Maximum 3 constitutional memories recommended to maintain focus.

---

## 9. 🔧 TROUBLESHOOTING

### Server Won't Start

**Problem**: `Error: Cannot find module`

**What it means**: The server can't find its dependencies. The node_modules are missing or npm install wasn't run.

**Fix**:
```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm install
```

**If that doesn't work**:
```bash
# Check node_modules exists
ls -la .opencode/skill/system-spec-kit/mcp_server/node_modules
# If missing, run npm install again
```

### sqlite-vec Not Loading

**Problem**: `Warning: sqlite-vec unavailable, falling back to anchor-only mode`

**What it means**: The vector search extension isn't loading. The system will still work using keyword search, but semantic similarity won't be available.

**Fix**:
```bash
# Check if the right platform binary exists in mcp_server/node_modules
ls .opencode/skill/system-spec-kit/mcp_server/node_modules/sqlite-vec-darwin-arm64/  # macOS ARM
ls .opencode/skill/system-spec-kit/mcp_server/node_modules/sqlite-vec-darwin-x64/    # macOS Intel
ls .opencode/skill/system-spec-kit/mcp_server/node_modules/sqlite-vec-linux-x64/     # Linux x64
```

**If that doesn't work**:
```bash
# Reinstall dependencies
cd .opencode/skill/system-spec-kit/mcp_server
rm -rf node_modules
npm install
```

### No Search Results

**Problem**: `memory_search` returns empty results

**What it means**: Either no memories have been saved yet, or the embeddings haven't been generated for existing memories.

**Fix**:
```bash
# Check database exists
ls .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Verify embeddings exist
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT COUNT(*) FROM vec_memories"
```

**If that doesn't work**:
```bash
# Check embedding status - most should show 'completed'
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"
```

**Rebuild index with MCP tool or batch indexer**:
```bash
# Via MCP tool (recommended)
memory_index_scan({ force: true })

# Or via CLI script from mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server/scripts
node index-cli.js --scan
```

The `--scan` option recursively finds all memory files in nested specs structures like `specs/001-foo/002-bar/memory/` or `.opencode/specs/001-foo/002-bar/memory/`.

### Slow Performance

**Problem**: Operations exceeding targets (triggers >50ms, search >500ms)

**What it means**: The database may not be optimized, or queries are hitting large datasets.

**Fix**:
```bash
# Verify WAL mode is enabled for better concurrency
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "PRAGMA journal_mode"
# Should return: wal
```

**If that doesn't work**: Large prompts are truncated at 2000 characters. If you're sending very long queries, try shorter, more specific ones.

### Tool Not Appearing in Client

**Problem**: Memory tools not listed in AI client

**What it means**: The MCP configuration isn't being read, or there's a syntax error in the config file.

**Fix**:
```bash
# Check for JSON syntax errors
python3 -m json.tool < .mcp.json
```

**If that doesn't work**:
1. Verify the server path is absolute, not relative
2. For Claude Code: ensure both `.mcp.json` AND `settings.local.json` are configured
3. Restart the AI client after configuration changes

### Database Corruption or Reset

**Problem**: Database errors, corrupted data, or need to start fresh

**What it means**: The SQLite database may be corrupted or in an inconsistent state.

**Option A - Restore from backup (preferred):**
```bash
# List available backups
ls -la .opencode/skill/system-spec-kit/mcp_server/database/backup-*.sqlite

# Restore most recent backup
cp .opencode/skill/system-spec-kit/mcp_server/database/backup-YYYYMMDD-HHMMSS.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Restart OpenCode to clear MCP server cache
```

**Option B - Reset database (lose all memories):**
```bash
# Backup first (just in case)
cp .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/database/backup-pre-reset-$(date +%Y%m%d).sqlite

# Remove corrupted database
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Restart OpenCode - database will be recreated on first use

# Re-index all memory files
memory_index_scan({ force: true })
```

**Option C - Repair database:**
```bash
# Check database integrity
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "PRAGMA integrity_check"

# If issues found, try to recover
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite ".recover" > recovered.sql
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index-new.sqlite < recovered.sql
mv .opencode/skill/system-spec-kit/mcp_server/database/context-index-new.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

### MCP Server Cache Issues

**Problem**: Changes to database not reflected in search results, or stale data appearing

**What it means**: The MCP server caches database state in memory. After manual database changes (restore, deletion, repair), the cache is stale.

**Fix**:
```bash
# The ONLY reliable fix is to restart OpenCode
# Close OpenCode completely, then reopen

# On macOS, ensure process is fully stopped
pkill -f opencode || true
```

**After restart, verify:**
```bash
# In your AI client, run:
memory_stats()
# Should show current database state
```

### Embedding Generation Failures

**Problem**: Memories indexed but semantic search returns poor results

**What it means**: Embeddings may have failed to generate, falling back to keyword-only search.

**Diagnose:**
```bash
# Check embedding status distribution
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"

# Expected: Most should be 'completed'
# Problem: Many 'pending' or 'failed'
```

**Fix failed embeddings:**
```bash
# Force re-index to regenerate embeddings
memory_index_scan({ force: true })

# Or re-index specific folder
memory_index_scan({ specFolder: "049-auth-system", force: true })
```

**Check Ollama (if using local embeddings):**
```bash
# Verify Ollama is running
ollama list

# Check nomic model is available
ollama show nomic-embed-text

# If missing, pull it
ollama pull nomic-embed-text
```

### Backup and Restore Issues

**Problem**: Restored database shows wrong data or missing memories

**What it means**: Either the backup was from a different point in time, or the MCP server cache wasn't cleared.

**Fix**:
1. **Verify backup contents before restore:**
   ```bash
   sqlite3 backup-YYYYMMDD.sqlite "SELECT COUNT(*), MAX(created_at) FROM memory_index"
   ```

2. **Ensure complete restart after restore:**
   ```bash
   # Close OpenCode completely
   pkill -f opencode || true
   
   # Wait a moment
   sleep 2
   
   # Reopen OpenCode
   opencode
   ```

3. **Verify restore worked:**
   ```bash
   memory_stats()
   # Compare counts with backup verification
   ```

---

## 10. 📚 RESOURCES

### File Structure

The Spec Kit Memory system is organized within the `system-spec-kit` skill folder:

```
.opencode/skill/system-spec-kit/
├── database/
│   └── context-index.sqlite      # Vector database (auto-created)
├── mcp_server/
│   ├── context-server.js         # Main MCP server entry point
│   ├── package.json              # Dependencies manifest
│   ├── INSTALL_GUIDE.md          # This installation guide
│   ├── LICENSE
│   ├── configs/
│   │   └── search-weights.json   # Search algorithm configuration
│   ├── lib/
│   │   ├── embeddings.js         # HuggingFace embedding generation (nomic-embed-text-v1.5)
│   │   ├── vector-index.js       # SQLite-vec database operations
│   │   ├── trigger-matcher.js    # Fast phrase matching (<50ms)
│   │   ├── trigger-extractor.js  # TF-IDF phrase extraction
│   │   ├── retry-manager.js      # Failed embedding retry logic
│   │   ├── importance-tiers.js   # Six-tier importance system
│   │   ├── checkpoints.js        # Checkpoint save/restore operations
│   │   ├── confidence-tracker.js # Validation and confidence scoring
│   │   ├── memory-parser.js      # Memory file parsing and metadata extraction
│   │   ├── token-budget.js       # Token limit management for results
│   │   ├── access-tracker.js     # Memory access tracking for decay
│   │   └── ...                   # Additional modules
│   └── scripts/
│       └── index-cli.js          # CLI indexing utility
├── scripts/
│   └── generate-context.js       # Memory file generator script
├── references/                   # Skill documentation references
├── templates/
│   └── context_template.md       # Memory file template
├── config/
│   └── config.jsonc              # Skill configuration
├── SKILL.md                      # AI agent instructions
└── README.md                     # Skill overview
```

### Database Schema

```sql
-- Metadata table
CREATE TABLE memory_index (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spec_folder TEXT NOT NULL,
  file_path TEXT NOT NULL,
  anchor_id TEXT,
  title TEXT,
  trigger_phrases TEXT,           -- JSON array
  importance_weight REAL DEFAULT 0.5,
  importance_tier TEXT DEFAULT 'normal',  -- constitutional|critical|important|normal|temporary|deprecated
  embedding_status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  content_hash TEXT,              -- SHA-256 for change detection
  context_type TEXT,              -- decision|implementation|research|discovery|general
  confidence_score REAL DEFAULT 0.5,
  validation_count INTEGER DEFAULT 0,
  last_accessed_at TEXT,          -- For access tracking
  created_at TEXT,
  updated_at TEXT
);

-- Indexes for efficient queries
CREATE INDEX idx_spec_folder ON memory_index(spec_folder);
CREATE INDEX idx_importance_tier ON memory_index(importance_tier);
CREATE INDEX idx_embedding_status ON memory_index(embedding_status);

-- Vector table (sqlite-vec with dynamic dimensions based on provider)
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[N]  -- N = 768 (HF Local), 1024 (Voyage), 1536 (OpenAI)
);
-- Note: rowids synchronized between tables
-- Note: Dimensions are auto-detected from embedding provider profile

-- Checkpoints table
CREATE TABLE checkpoints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  spec_folder TEXT,
  memory_count INTEGER,
  metadata TEXT,        -- JSON
  created_at TEXT
);
```

### Configuration Paths

| Client          | Configuration File                  | Server Key        |
| --------------- | ----------------------------------- | ----------------- |
| **Claude Code** | `.mcp.json` + `settings.local.json` | `spec_kit_memory` |
| **OpenCode**    | `opencode.json`                     | `spec_kit_memory` |

### Verification Commands

```bash
# Check server version
node .opencode/skill/system-spec-kit/mcp_server/context-server.js --version 2>&1 | head -1

# Test startup (Ctrl+C to exit)
node .opencode/skill/system-spec-kit/mcp_server/context-server.js

# Check database tables
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite ".tables"

# Count indexed memories
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"

# Check embedding statistics
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) as count FROM memory_index GROUP BY embedding_status"
```

### Performance Monitoring

Slow operations are logged automatically:
```
[trigger-matcher] matchTriggerPhrases: 45ms (target <50ms)
[embeddings] generateEmbedding: 520ms (target <500ms) - SLOW
```

### Related Documentation

| Document     | Location                                      | Purpose                 |
| ------------ | --------------------------------------------- | ----------------------- |
| Skill README | `.opencode/skill/system-spec-kit/README.md`   | Skill overview          |
| SKILL.md     | `.opencode/skill/system-spec-kit/SKILL.md`    | AI agent instructions   |
| References   | `.opencode/skill/system-spec-kit/references/` | Technical documentation |

---

### Quick Reference: Complete Tool Summary (13 Tools)

**Core Search Tools:**

| Tool                               | Purpose                  | Speed  | Use When                           |
| ---------------------------------- | ------------------------ | ------ | ---------------------------------- |
| `memory_search`                    | Semantic vector search   | ~500ms | Need meaning-based retrieval       |
| `memory_search` + `includeContent` | Search with full content | ~500ms | Need content without separate read |
| `memory_match_triggers`            | Fast phrase matching     | <50ms  | Quick keyword lookup first         |

**Memory Management Tools:**

| Tool                | Purpose                         |
| ------------------- | ------------------------------- |
| `memory_save`       | Index single memory file        |
| `memory_list`       | Browse memories with pagination |
| `memory_update`     | Update importance/metadata      |
| `memory_delete`     | Delete by ID or spec folder     |
| `memory_validate`   | Record validation feedback      |
| `memory_stats`      | System statistics               |
| `memory_index_scan` | Bulk scan and index workspace   |

**Checkpoint Tools:**

| Tool                 | Purpose                    |
| -------------------- | -------------------------- |
| `checkpoint_create`  | Save named restore point   |
| `checkpoint_list`    | List available checkpoints |
| `checkpoint_restore` | Restore from checkpoint    |
| `checkpoint_delete`  | Delete checkpoint          |

### Importance Tiers

| Tier             | Decay  | Use Case                          |
| ---------------- | ------ | --------------------------------- |
| `constitutional` | Never  | Core rules, always surfaced first |
| `critical`       | Slow   | Architecture decisions            |
| `important`      | Normal | Key learnings                     |
| `normal`         | Normal | General context (default)         |
| `temporary`      | Fast   | Session-specific (7-day expiry)   |
| `deprecated`     | N/A    | Hidden from search                |

### Essential Commands

```bash
# Verify installation
ls -la .opencode/skill/system-spec-kit/mcp_server/lib/
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite ".tables"

# Test server
node .opencode/skill/system-spec-kit/mcp_server/context-server.js

# Check database stats
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
```

### Configuration Quick Copy

**Claude Code (.mcp.json):**
```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": ["${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/context-server.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

**OpenCode (opencode.json):**
```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": ["node", "${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/context-server.js"],
      "environment": {
        "EMBEDDINGS_PROVIDER": "auto",
        "VOYAGE_API_KEY": "YOUR_VOYAGE_API_KEY_HERE",
        "_NOTE_1_DATABASE": "Stores vectors in: .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite",
        "_NOTE_2_PROVIDERS": "Voyage (recommended), OpenAI, or HF Local (fallback)"
      }
    }
  }
}
```

**Note:** Replace `${workspaceFolder}` with your absolute project path.

---

**Installation Complete!**

You now have the Spec Kit Memory MCP server configured. Use it to retrieve conversation context, search memories semantically, and quickly match trigger phrases.

Start using Spec Kit Memory by asking your AI assistant:
```
Search my memories for information about [topic]
```

---

### Next Steps

- **Test the system**: Run `/memory:search` in your AI client
- **Save your first context**: Type "save context" or run `/memory:save` after a meaningful conversation
- **Search memories**: Try `/memory:search how did we...`

**Need help?** See [Troubleshooting](#9--troubleshooting) or check your AI client terminal for server logs.

---

**Protocol**: MCP (Model Context Protocol)
**Status**: Production Ready