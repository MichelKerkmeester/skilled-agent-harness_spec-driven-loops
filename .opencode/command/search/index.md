---
description: LEANN index sync & freshness manager - check staleness, update indexes, maintain semantic code search
argument-hint: "[subcommand] [name] [--docs <path>] [--force]"
allowed-tools: Bash, leann_list, leann_remove
---

# 🚨 GATE: DESTRUCTIVE OPERATION CONFIRMATION

**Applies ONLY to: "remove" or "--force" operations**

```
IF "remove" or "--force" in $ARGUMENTS:
├─ Parse index name (if missing → list and ask)
├─ Verify index exists via leann_list({})
├─ Display confirmation with size/details
├─ WAIT for [y]es or [n]o
└─ Only proceed after explicit confirmation

⛔ HARD STOP: Never auto-proceed with destructive operations
```

---

# LEANN Index Sync Manager

Keep semantic code search indexes fresh. LEANN indexes are snapshots — they don't auto-update when files change.

```yaml
role: Index Freshness Manager
purpose: Detect stale indexes and facilitate updates
action: Check freshness by default, update when stale
```

---

## 1. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Subcommand with optional name and options
**Outputs:** `STATUS=<OK|FAIL>` with `ACTION=<subcommand>` and freshness metrics

| Pattern                      | Action          | Example                                     |
| ---------------------------- | --------------- | ------------------------------------------- |
| (empty)                      | **Sync Status** | `/search:index`                             |
| `update` or `sync`           | Smart Update    | `/search:index update`                      |
| `update --force`             | Force Rebuild   | `/search:index update --force`              |
| `list` or `ls`               | List All        | `/search:index list`                        |
| `build <name> --docs <path>` | Build New       | `/search:index build myproject --docs src/` |
| `remove <name>`              | Remove Index    | `/search:index remove oldindex`             |
| `status` or `health`         | Tool Health     | `/search:index status`                      |
| `info <name>`                | Index Details   | `/search:index info anobel`                 |

---

## 2. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─► Empty → SYNC STATUS (Section 4)
    │
    ├─► SUBCOMMAND DETECTION
    │   ├─► "update" | "sync"   → UPDATE (Section 5.1)
    │   ├─► "list" | "ls"       → LIST (Section 5.2)
    │   ├─► "build" <name>      → BUILD (Section 5.3)
    │   ├─► "remove" | "delete" → REMOVE (Section 5.4)
    │   ├─► "status" | "health" → STATUS (Section 5.5)
    │   └─► "info" <name>       → INFO (Section 5.6)
    │
    └─► UNKNOWN → Show help with valid subcommands
```

---

## 3. 🔧 TOOL SIGNATURES

### Shell Alias (Recommended)

LEANN CLI doesn't support config files for embedding defaults. Use a shell alias:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'
```

**Usage:** `leann-build <name> --docs <scope>`

### Tool Reference

```javascript
// LEANN Native MCP
leann_list({})
leann_remove({ index_name: "<name>" })

// LEANN CLI (via Bash)
Bash("leann build <name> --docs <path> --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")
Bash("leann build <name> --docs <path> --exclude <patterns> --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")

// Recommended build (Apple Silicon with Qwen3 - 50% better quality than Contriever)
// Qwen3-Embedding: Specifically trained on code (MTEB-Code 75.41), 4-bit quantized for memory efficiency
Bash("leann build <name> --docs src/ --file-types '.js,.css,.html' --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")

// Progressive scope build (large projects)
Bash("leann build <name> --docs src/ --file-types '.js,.ts,.css,.html,.md' --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")

// Cross-Platform Stat Functions (define once, reuse)
// NOTE: Define these helper functions before using freshness detection commands
get_file_mtime() {
  local file="$1"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    stat -f '%m' "$file"
  else
    stat -c '%Y' "$file"
  fi
}

get_file_mtime_human() {
  local file="$1"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    stat -f '%Sm' -t '%b %d, %Y at %I:%M %p' "$file"
  else
    date -d "@$(stat -c '%Y' "$file")" '+%b %d, %Y at %I:%M %p'
  fi
}

// Freshness Detection (using cross-platform functions)
Bash("get_file_mtime .leann/indexes/<name>/documents.index 2>/dev/null || echo 'missing'")
Bash("find ./src -type f \\( -name '*.js' -o -name '*.ts' -o -name '*.css' -o -name '*.html' \\) -newer .leann/indexes/<name>/documents.index 2>/dev/null | wc -l")
Bash("find ./src -type f \\( -name '*.js' -o -name '*.ts' -o -name '*.css' -o -name '*.html' \\) -newer .leann/indexes/<name>/documents.index 2>/dev/null | head -5")
Bash("get_file_mtime_human .leann/indexes/<name>/documents.index 2>/dev/null")
```

---

## 4. 🔄 SYNC STATUS MODE (Default)

**Trigger:** `/search:index` with no arguments

### Workflow

```javascript
// 1. Get index list
leann_list({})

// 2. Get freshness for primary index (uses cross-platform functions from Section 3)
Bash("get_file_mtime_human .leann/indexes/anobel/documents.index")
Bash("find ./src -type f ... -newer .leann/indexes/anobel/documents.index | wc -l")
Bash("find ./src -type f ... -newer .leann/indexes/anobel/documents.index | head -5")
```

### Freshness Algorithm

| Changed Files | Status           | Recommendation              |
| ------------- | ---------------- | --------------------------- |
| Index missing | ❌ MISSING        | Build index first           |
| 0             | ✅ FRESH          | No update needed            |
| 1-10          | ⚠️ SLIGHTLY STALE | Consider updating           |
| 11-50         | 🔄 STALE          | Update recommended          |
| >50           | 🔴 OUTDATED       | Update strongly recommended |

### Output Template

```
╭─────────────────────────────────────────────────────────────╮
│  LEANN INDEX SYNC STATUS                                    │
├─────────────────────────────────────────────────────────────┤
│  📊 <name>                                                  │
│     ├─ Status: <emoji> <STATUS>                             │
│     ├─ Last built: <date>                                   │
│     ├─ Files changed since: <N>                             │
│     └─ Size: <size>                                         │
│                                                             │
│  <Recent changes if stale>                                  │
├─────────────────────────────────────────────────────────────┤
│  <RECOMMENDATION>                                           │
│  [u]pdate | [l]ist | [i]nfo | [s]tatus | [q]uit             │
╰─────────────────────────────────────────────────────────────╯
```

**Variations:**
- FRESH: Hide "Recent changes", show "INDEX UP TO DATE"
- MISSING: Show "NO INDEX FOUND", offer [b]uild

---

## 5. ⚡ WORKFLOWS

### 5.1 UPDATE INDEX

**Trigger:** `/search:index update` or `sync`

```
1. Check freshness (count changed files)
2. IF fresh AND NOT --force:
   → Display "Already fresh. Use --force to rebuild anyway."
   → EXIT STATUS=OK ACTION=update RESULT=skipped
3. ELSE:
   → Check project size (find . -type f | wc -l)
   → IF >2000 files AND rebuilding:
      ├─► Display memory warning
      ├─► Suggest scope reduction: "Consider --docs src/ for faster rebuild"
      └─► Recommend MLX + Qwen3 if Apple Silicon
   → leann_remove({ index_name })
   → Bash("leann build <name> --docs <scope> --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")
   → Display result with document count delta
```

**Memory Warning (Large Projects):**
```
⚠️ MEMORY NOTICE: Rebuilding large index (<N> files)
   Tip: Use --docs src/ to reduce scope
   Tip: Qwen3 + MLX: 50% better quality, 4-bit quantized for memory efficiency
   
   Continue with full rebuild? [y] yes | [s] suggest scope | [c] cancel
```

**Output:** "Index updated in Xs" | "Index is now FRESH ✅"

### 5.2 LIST INDEXES

**Trigger:** `/search:index list` or `ls`

```javascript
leann_list({})
```

**Output:**
```
| Name   | Size   | Status       |
| ------ | ------ | ------------ |
| anobel | 8.7 MB | ⚠️ Stale (23) |

[u]pdate stale | [b]uild new | [r]emove | [q]uit
```

### 5.3 BUILD INDEX

**Trigger:** `/search:index build <name> --docs <path>`

#### Smart Scope Suggestion (Pre-Build)

Before any build, run scope analysis to optimize indexing:

```
SCOPE SUGGESTION WORKFLOW:
├─► Step 1: Detect project size
│   └─ Bash("find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l")
│
├─► Step 2: IF >2000 files → Suggest progressive scope
│   ├─► Recommend: --docs src/ (or primary code directory)
│   ├─► Recommend: --file-types ".js,.ts,.css,.html,.md"
│   └─► Show estimated file reduction
│
├─► Step 3: Detect Apple Silicon
│   └─ Bash("uname -m") → IF "arm64" → Add: --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
│
└─► Step 4: Present scope options to user
    ├─ a) src/ only (recommended for large projects)
    ├─ b) src/ with specific file types
    └─ c) Full project (warn if >2000 files)
```

**Scope Options Display:**
```
┌───────────────────────────────────────────────────────────────────┐
│  SMART SCOPE SUGGESTION                                           │
├───────────────────────────────────────────────────────────────────┤
│  Project size: <N> files detected                                  │
│  Platform: <Apple Silicon | Intel/Other>                          │
├───────────────────────────────────────────────────────────────────┤
│  RECOMMENDED OPTIONS:                                             │
│                                                                   │
│  [a] src/ only          ~<N> files    (recommended)                │
│  [b] src/ + file types  ~<N> files    .js,.ts,.css,.html,.md        │
│  [c] Full project       <N> files     ⚠️ Large - may be slow       │
│  [d] Custom scope       Enter path    --docs <your-path>          │
├───────────────────────────────────────────────────────────────────┤
│  MLX Mode: <✅ Enabled | ❌ Not available (Intel)>                │
│  Model: Qwen3-Embedding-0.6B-4bit-DWQ (50% better than Contriever)│
│  Tip: Qwen3 is specifically trained on code (MTEB-Code 75.41)      │
└───────────────────────────────────────────────────────────────────┘
```

#### Build Execution

```
1. Parse: <name> (required), --docs (default "."), --exclude (optional)
2. Run Smart Scope Suggestion (above) if no --docs specified
3. Validate: path exists, index doesn't exist (suggest update if it does)
4. Build command template:
   - Apple Silicon: Bash("leann build <name> --docs <scope> --file-types '<types>' --embedding-mode mlx --embedding-model 'mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ'")
   - Intel/Other:   Bash("leann build <name> --docs <scope> --file-types '<types>' --embedding-mode sentence-transformers --embedding-model 'facebook/contriever'")
5. Display: "Indexed N documents in Xs"
```

**Recommended Build Commands:**
```bash
# With alias (recommended) - see Section 3 for setup
leann-build <name> --docs src/ --file-types ".js,.ts,.css,.html,.md"

# Full command (if alias not set)
leann build <name> --docs src/ --file-types ".js,.ts,.css,.html,.md" --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# Intel/Linux - Progressive scope (fallback with Contriever)
leann build <name> --docs src/ --file-types ".js,.ts,.css,.html,.md" --embedding-mode sentence-transformers --embedding-model "facebook/contriever"
```

### 5.4 REMOVE INDEX

**Trigger:** `/search:index remove <name>` (requires Gate confirmation)

```
1. Validate name (list to select if missing)
2. Confirm: "Remove '<name>'? Size: X. ⚠️ Permanent. [y/n]"
3. After [y]: leann_remove({ index_name })
4. Display: "✅ Index Removed. Space recovered: X"
```

### 5.5 STATUS (Tool Health)

**Trigger:** `/search:index status` or `health`

```javascript
leann_list({})
```

**Output:**
```
📊 LEANN: ✅ Available (N indexes)
```

### 5.6 INDEX INFO

**Trigger:** `/search:index info <name>`

```javascript
leann_list({})
Bash("get_file_mtime_human .leann/indexes/<name>/documents.index")
Bash("find ... -newer ... | wc -l")
```

**Output:** Name, Size, Location, Last Built, Freshness Status, Changed Files

---

## 6. ⚠️ ERROR HANDLING

| Condition            | Action                              |
| -------------------- | ----------------------------------- |
| LEANN CLI not found  | Show installation instructions      |
| Index not found      | Suggest build, show available       |
| Index already exists | Suggest update instead              |
| Path not found       | Show error with path validation     |
| Build fails          | Show error, suggest troubleshooting |
| Remove w/o confirm   | Block until y/n received            |

---

## 7. 📌 QUICK REFERENCE

```bash
# Check freshness (most common)
/search:index

# Smart update (only if stale)
/search:index update

# Force rebuild
/search:index update --force

# Build new index (with alias - recommended)
leann-build anobel --docs src/

# Build new index (full command)
leann build anobel --docs src/ --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"

# Remove old index
/search:index remove oldproject
```

---

## 8. 🔗 RELATED

- `/search:code` - Semantic, structural, lexical code search
- **mcp-leann skill** - Full LEANN documentation and advanced usage
