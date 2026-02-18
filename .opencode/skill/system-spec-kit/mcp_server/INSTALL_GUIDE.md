# Spec Kit Memory MCP Server Installation Guide

Complete installation and configuration guide for the Spec Kit Memory MCP server, enabling AI-powered context retrieval and conversation memory. Provides semantic search across documentation (markdown files, spec folders, skill references), trigger-based memory surfacing, intent-aware context loading, and causal relationship tracking. Post-update recovery workflows address native module mismatches, workspace dependency failures, and database path confusion.

---

## AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server

Please help me:
1. Verify I have Node.js >=18 and npm installed
2. Install dependencies and build the MCP server
3. Configure for my environment (I'm using: [Claude Code / Claude Desktop / OpenCode])
4. Verify the installation with a test search query
5. Handle any native module rebuild issues if they occur

My project is located at: [your project path]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify Node.js and npm are available
- Install Spec Kit Memory dependencies
- Build the MCP server via `npm run build`
- Configure the MCP server for your AI platform
- Test semantic search with a sample query
- Troubleshoot native module issues if needed

**Expected setup time:** 3-5 minutes (clean install), 2-5 minutes (recovery)

---

## TABLE OF CONTENTS

0. [AI-FIRST INSTALL GUIDE](#ai-first-install-guide)
1. [OVERVIEW](#1--overview)
2. [PREREQUISITES](#2--prerequisites)
3. [INSTALLATION](#3--installation)
4. [CONFIGURATION](#4--configuration)
5. [VERIFICATION](#5--verification)
6. [USAGE](#6--usage)
7. [FEATURES](#7--features)
8. [EXAMPLES](#8--examples)
9. [TROUBLESHOOTING](#9--troubleshooting)
10. [RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

Spec Kit Memory is an MCP server that provides AI assistants with semantic memory and context retrieval capabilities. It indexes markdown documentation, conversation memories, and project context to surface relevant information during AI interactions.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes.

### Key Features

| Feature                        | Description                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------- |
| **Semantic Search**            | Vector-based similarity search across all indexed markdown                        |
| **Trigger Phrases**            | Fast keyword-based memory surfacing (sub-50ms)                                    |
| **Intent-Aware Context**       | Automatically loads relevant context based on task type (implement, debug, plan)  |
| **Causal Relationships**       | Track decision lineage with "why was this decided?" queries                       |
| **Multi-Tier Importance**      | Constitutional, critical, important, normal, temporary, deprecated classification |
| **Session Deduplication**      | Prevents re-sending the same memories (50% token savings on follow-up queries)    |
| **Post-Update Recovery**       | Handles native module ABI mismatches, workspace dependency issues                 |
| **Database Path Transparency** | Canonical runtime path with compatibility symlink                                 |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ MCP stdio
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              Spec Kit Memory MCP Server (Node.js)               │
│  - Context indexing, semantic search, trigger matching          │
│  - SQLite + sqlite-vec for vector storage                       │
│  - Canonical DB: mcp_server/dist/database/context-index.sqlite  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Markdown Documentation                       │
│  specs/**/memory/, .opencode/skill/**/references/, README.md    │
└─────────────────────────────────────────────────────────────────┘
```

### What This Guide Solves

This guide focuses on failures users report after major updates:

- `Error: Cannot find module ...`
- `Cannot find module '@spec-kit/shared/...'`
- `ERR_DLOPEN_FAILED` or `NODE_MODULE_VERSION` mismatch
- sqlite extension load issues (`sqlite-vec unavailable`)
- Server starts but search returns empty/stale results

### Current Runtime Paths (Canonical)

- **MCP entry script**: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`
- **Canonical database**: `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`
- **Compatibility symlink**: `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` → `dist/database/`

> **Note**: If documentation references `mcp_server/database/...`, treat that as a compatibility view. The canonical runtime storage is `mcp_server/dist/database/`.

---

## 2. ⚙️ PREREQUISITES

**Phase 1** focuses on verifying required software dependencies.

### Required Software

1. **Node.js** (`>=18`)
   ```bash
   node --version
   # Should show v18.0.0 or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   # Should show version number
   ```

3. **MCP client** (OpenCode or Claude Code)
   - OpenCode: AI-powered CLI client
   - Claude Code: VS Code extension

### Actions

No additional dependencies required beyond Node.js and npm.

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
node --version    # → v18.0.0 or higher
npm --version     # → 9.0.0 or higher
```

**Checklist:**
- [ ] `node --version` returns v18 or higher?
- [ ] `npm --version` returns a version number?

❌ **STOP if validation fails** - Install Node.js from https://nodejs.org/ before continuing.

---

## 3. 🛠️ INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Initialize)**.

### Step 1: Navigate to Skill Directory

```bash
cd .opencode/skill/system-spec-kit
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `better-sqlite3` (SQLite with native bindings)
- `sqlite-vec` (vector extension for semantic search)
- Workspace dependencies (`@spec-kit/shared`)

### Step 3: Build the MCP Server

```bash
npm run build
```

> **Note**: If workspace type errors occur and you only need a runtime build, use: `npx tsc --build --noCheck --force`

### Validation: `phase_2_complete`

```bash
# Verify artifacts exist:
ls mcp_server/dist/context-server.js
# → should show the file

ls mcp_server/node_modules/better-sqlite3
# → should show the directory
```

**Checklist:**
- [ ] `mcp_server/dist/context-server.js` exists?
- [ ] `mcp_server/node_modules/better-sqlite3` exists?

❌ **STOP if validation fails** - Check installation output for errors.

### Step 4: Verify Native Modules (Optional but Recommended)

```bash
bash scripts/setup/check-native-modules.sh
```

If native check reports mismatch/failure:

```bash
bash scripts/setup/rebuild-native-modules.sh
```

### Validation: `phase_3_complete`

```bash
# Smoke test: server should start without crash
node mcp_server/dist/context-server.js
# → Process starts and waits for MCP stdio input
# Press Ctrl+C to exit
```

**Checklist:**
- [ ] Server starts without immediate crash?
- [ ] No `ERR_DLOPEN_FAILED` errors?

❌ **STOP if validation fails** - Run native module rebuild (see Troubleshooting).

---

## 4. ⚙️ CONFIGURATION

Connect Spec Kit Memory to your AI assistant (Phase 4).

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": [
        "node",
        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "environment": {
        "EMBEDDINGS_PROVIDER": "hf-local",
        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Paths are relative to project root. Use absolute paths if needed: `/Users/YOUR_USERNAME/path/to/project/.opencode/skill/...`

### Option B: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [
        "${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "hf-local"
      },
      "disabled": false
    }
  }
}
```

**Also add to** `settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["spec_kit_memory"]
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
    "spec_kit_memory": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/path/to/project/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "hf-local"
      }
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` and `path/to/project` with your actual paths. Find username with `whoami`.

### Validation: `phase_4_complete`

```bash
# Verify JSON syntax is valid
python3 -m json.tool < opencode.json > /dev/null
# OR for Claude Code:
python3 -m json.tool < .mcp.json > /dev/null

# Verify binary path exists
ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
```

**Checklist:**
- [ ] Configuration file has valid JSON syntax?
- [ ] Binary path in config exists?
- [ ] Username replaced with actual username (if using absolute paths)?

❌ **STOP if validation fails** - Fix configuration syntax or paths.

---

## 5. ✅ VERIFICATION

Verify end-to-end connection in your AI assistant.

### Step 1: Restart Your AI Client

```bash
# For OpenCode:
opencode

# For Claude Code: Restart VS Code
# For Claude Desktop: Quit and reopen application
```

### Step 2: Check MCP Server Is Loaded

Ask your AI assistant:
```
What MCP tools are available?
```

Expected: Should list `spec_kit_memory` tools including:
- `memory_context` (unified context retrieval)
- `memory_search` (semantic search)
- `memory_match_triggers` (fast trigger matching)
- `memory_save` (index new memories)

### Step 3: Test with a Query

Ask your AI assistant:
```
Search memory for documentation about Gate 3
```

Expected: Should return relevant memories about Gate 3 (spec folder question) from AGENTS.md or related documentation.

### Success Criteria (`phase_5_complete`)

- [ ] ✅ MCP server appears in tool list
- [ ] ✅ `memory_search()` returns results (or empty if no memories indexed yet)
- [ ] ✅ No connection errors in responses
- [ ] ✅ No `ERR_DLOPEN_FAILED` or module resolution errors

❌ **STOP if validation fails** - Check MCP configuration, restart client, see Troubleshooting.

---

## 6. 💼 USAGE

### Daily Workflow

The MCP server starts automatically when your AI client launches. No manual start required.

```bash
# Start your AI client - MCP starts automatically
opencode

# MCP server runs in background, handling memory queries from AI
```

### Common Operations

**Index new memories**:
```bash
# Via AI assistant:
"Scan for new memory files and index them"

# This calls memory_index_scan() internally
```

**Search for context**:
```bash
# Via AI assistant:
"Search memory for [topic]"
"What do we remember about [feature]?"
"Find documentation related to [keyword]"
```

**Resume previous work**:
```bash
# Via AI assistant:
"Load context from spec folder 005-memory"
"Continue work on the authentication feature"
```

### When to Rebuild

Rebuild after:
- Updating Node.js version
- Pulling updates that modify `mcp_server/` code
- Experiencing module resolution errors

```bash
cd .opencode/skill/system-spec-kit
npm install
npm run build
bash scripts/setup/rebuild-native-modules.sh
```

---

## 7. 🎯 FEATURES

### Memory Context (Unified Entry Point)

**Tool**: `memory_context()`

**Purpose**: Unified context retrieval with intent-aware routing. Automatically detects task intent and surfaces relevant memories.

**Modes**:
- `auto` (default): Detect intent and route optimally
- `quick`: Fast trigger-based matching
- `deep`: Comprehensive semantic search
- `focused`: Intent-optimized retrieval
- `resume`: Session recovery (load previous state)

**Example**:
```typescript
memory_context({
  input: "I want to implement authentication",
  mode: "auto"
})
// Returns relevant memories about auth, implementation patterns, related specs
```

### Memory Search (Semantic)

**Tool**: `memory_search()`

**Purpose**: Vector-based semantic search across all indexed memories.

**Key Parameters**:
- `query`: Natural language search query
- `limit`: Max results (default 10)
- `minState`: Minimum memory state (HOT, WARM, COLD, DORMANT, ARCHIVED)
- `intent`: Task intent for weight adjustments (add_feature, fix_bug, refactor, etc.)
- `includeContent`: Embed full file content in results

**Example**:
```typescript
memory_search({
  query: "How do we handle Gate 3 validation?",
  limit: 5,
  minState: "WARM",
  intent: "understand"
})
```

### Memory Match Triggers (Fast Lookup)

**Tool**: `memory_match_triggers()`

**Purpose**: Fast keyword-based matching (sub-50ms). Used for immediate context surfacing.

**Example**:
```typescript
memory_match_triggers({
  prompt: "User wants to modify a file",
  limit: 3
})
// Returns memories with trigger phrases matching "modify file", "file modification", etc.
```

### Memory Save (Indexing)

**Tool**: `memory_save()`

**Purpose**: Index new or updated memory files into the database.

**Example**:
```typescript
memory_save({
  filePath: "specs/005-memory/memory/session-001.md",
  force: false
})
```

> **Note**: For bulk indexing, use `memory_index_scan()` instead.

### Memory Index Scan (Bulk)

**Tool**: `memory_index_scan()`

**Purpose**: Scan workspace for new/changed memory files and index them.

**Options**:
- `force`: Re-index all files (ignore content hash)
- `specFolder`: Limit scan to specific folder
- `includeConstitutional`: Include `.opencode/skill/*/constitutional/`
- `includeSpecDocs`: Include spec folder documents (spec.md, plan.md, etc.)
- `includeReadmes`: Include README.md files

**Example**:
```typescript
memory_index_scan({
  force: false,
  includeSpecDocs: true,
  includeReadmes: true
})
```

### Memory Stats

**Tool**: `memory_stats()`

**Purpose**: Get statistics about the memory system (counts, dates, top folders).

**Example**:
```typescript
memory_stats({
  folderRanking: "composite",
  includeScores: true,
  limit: 10
})
```

---

## 8. 💡 EXAMPLES

### Example 1: Fresh Install and First Search

```bash
# 1. Install
cd .opencode/skill/system-spec-kit
npm install
npm run build

# 2. Configure (add to opencode.json)

# 3. Restart OpenCode
opencode

# 4. Ask AI:
"Search memory for documentation about spec folders"
```

**Expected**: Returns memories from AGENTS.md, system-spec-kit about spec folder creation.

### Example 2: Post-Update Recovery

```bash
# Symptoms: Server won't start, module errors

# Fix:
cd .opencode/skill/system-spec-kit
npm install
npm run build
bash scripts/setup/rebuild-native-modules.sh

# Verify:
node mcp_server/dist/context-server.js
# Should start without errors (Ctrl+C to exit)

# Restart AI client
```

### Example 3: Resume Previous Work

```bash
# Ask AI:
"Load context from spec folder 012-authentication and show me what we were working on"
```

**Expected**: AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, returns previous session state.

### Example 4: Intent-Aware Context Loading

```bash
# Ask AI:
"I need to add a new feature for user profiles"
```

**Behind the scenes**: 
- AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
- Intent detected: `add_feature`
- Returns memories about feature implementation patterns, related code, similar features

### Example 5: Bulk Indexing After Creating Memories

```bash
# After creating multiple memory files in specs/*/memory/

# Ask AI:
"Scan for new memory files and index them"
```

**Behind the scenes**:
- AI calls `memory_index_scan({ force: false })`
- Server scans `specs/**/memory/`, `.opencode/skill/**/constitutional/`, README files
- Indexes changed/new files (skips unchanged based on content hash)

### Example 6: Troubleshooting Empty Search Results

```bash
# Symptom: Search returns no results

# Check database:
sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
# → Shows memory count

# If 0 or low:
# Ask AI: "Index all memory files"

# Restart AI client after indexing
```

---

## 9. 🛠️ TROUBLESHOOTING

### Common Errors

**❌ "Cannot find module '@spec-kit/shared/...'** or similar

- **Cause**: Workspace dependency state is incomplete or stale.
- **Fix**: 
  ```bash
  cd .opencode/skill/system-spec-kit
  npm install
  npm run build
  ```

If still failing, remove local workspace installs and reinstall:

```bash
rm -rf .opencode/skill/system-spec-kit/node_modules
rm -rf .opencode/skill/system-spec-kit/mcp_server/node_modules
rm -rf .opencode/skill/system-spec-kit/shared/node_modules
cd .opencode/skill/system-spec-kit
npm install
npm run build
```

**❌ "ERR_DLOPEN_FAILED" / "NODE_MODULE_VERSION" mismatch**

- **Cause**: Native module compiled for a different Node.js ABI.
- **Fix**:
  ```bash
  cd .opencode/skill/system-spec-kit
  bash scripts/setup/rebuild-native-modules.sh
  bash scripts/setup/check-native-modules.sh
  ```

You can also inspect runtime/module versions:

```bash
node -e "console.log('Node', process.version, 'MODULE_VERSION', process.versions.modules)"
```

**❌ "sqlite-vec unavailable" warning**

- **Cause**: Optional platform package missing or load failed.
- **Fix**:
  ```bash
  cd .opencode/skill/system-spec-kit/mcp_server
  npm install
  npm rebuild
  ```

> **Note**: The server degrades gracefully to non-vector behavior, but semantic similarity quality drops until fixed.

**❌ Server runs but no memories found**

- **Cause**: No indexed memories yet, or embeddings are pending/failed.
- **Checks**:
  ```bash
  sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
  
  sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"
  ```

- **Recovery**:
  - Ask AI: "Index all memory files" (calls `memory_index_scan({ force: true })`)
  - Restart MCP client after manual DB operations

**❌ Database appears stale after restore/reset**

- **Cause**: Client still using an old MCP server process with in-memory state.
- **Fix**: Fully restart OpenCode/Claude Code.

**❌ MCP server not appearing in tools**

- **Cause**: Configuration file issue or path incorrect.
- **Fix**:
  1. Check config syntax:
     ```bash
     python3 -m json.tool < opencode.json
     ```
  2. Verify binary path exists:
     ```bash
     ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
     ```
  3. Restart AI client completely.

### Root Cause Summary (Post-Update Failures)

**Was node_modules relocation the root cause?**

Partly. It is a contributing factor, not the only cause:
- The relocation to nested workspace dependencies (`install-strategy=nested`) changed where packages are expected.
- If local environments still follow pre-relocation assumptions, module resolution and native module loading can fail.

**Most common actual failure modes**:

1. **Install/build run from wrong place**
   - Running partial installs can leave workspace links unresolved (notably `@spec-kit/shared`).

2. **Native module ABI mismatch after Node update**
   - `better-sqlite3`/`sqlite-vec` compiled for an older `MODULE_VERSION`.

3. **Stale build output after dependency changes**
   - `dist/` not rebuilt, or rebuilt without required workspace state.

4. **Database path confusion**
   - Users inspect `mcp_server/database/...` while runtime writes to `dist/database/...`.

---

## 10. 📚 RESOURCES

### File Locations

| Path                                                                                    | Purpose                                   |
| --------------------------------------------------------------------------------------- | ----------------------------------------- |
| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`                    | MCP server entry point                    |
| `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`        | Canonical database (runtime)              |
| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`             | Compatibility symlink                     |
| `.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh`                | Native module diagnostics                 |
| `.opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh`              | Native module rebuild                     |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts`           | Vector index implementation               |
| `.opencode/skill/system-spec-kit/mcp_server/database/README.md`                        | Database path notes                       |

### CLI Command Reference

```bash
# Install and build
cd .opencode/skill/system-spec-kit
npm install
npm run build

# Native module diagnostics
bash scripts/setup/check-native-modules.sh
bash scripts/setup/rebuild-native-modules.sh

# Smoke test
node mcp_server/dist/context-server.js

# Validate configuration
python3 -m json.tool < opencode.json > /dev/null

# Database inspection
sqlite3 mcp_server/dist/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index"
sqlite3 mcp_server/dist/database/context-index.sqlite "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"

# Backup database
cp mcp_server/dist/database/context-index.sqlite \
  mcp_server/dist/database/backup-$(date +%Y%m%d-%H%M%S).sqlite

# Verify backup
sqlite3 mcp_server/dist/database/backup-YYYYMMDD-HHMMSS.sqlite "SELECT COUNT(*) FROM memory_index"
```

### External Resources

- **GitHub Repository**: `.opencode/skill/system-spec-kit/`
- **MCP Package**: `.opencode/skill/system-spec-kit/mcp_server/package.json`
- **Documentation**: See skill README and memory/ directories in spec folders

---

## Quick Start Summary

```bash
# 1. Prerequisites
node --version  # v18+
npm --version

# 2. Install
cd .opencode/skill/system-spec-kit
npm install
npm run build

# 3. Verify native modules
bash scripts/setup/check-native-modules.sh

# 4. Configure MCP (add to opencode.json)
# See Configuration section above

# 5. Restart AI client and start using!
opencode
```

---

**Installation Complete!**

You now have Spec Kit Memory installed and configured. Ask your AI assistant to search memory, load context, or index new documentation.

---
