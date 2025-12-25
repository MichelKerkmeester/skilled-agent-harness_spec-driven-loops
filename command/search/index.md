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

| Pattern                      | Action          | Example                                   |
| ---------------------------- | --------------- | ----------------------------------------- |
| (empty)                      | **Sync Status** | `/search:index`                           |
| `update` or `sync`           | Smart Update    | `/search:index update`                    |
| `update --force`             | Force Rebuild   | `/search:index update --force`            |
| `list` or `ls`               | List All        | `/search:index list`                      |
| `build <name> --docs <path>` | Build New       | `/search:index build myproject --docs src/` |
| `remove <name>`              | Remove Index    | `/search:index remove oldindex`           |
| `status` or `health`         | Tool Health     | `/search:index status`                    |
| `info <name>`                | Index Details   | `/search:index info anobel`               |

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

```javascript
// LEANN Native MCP
leann_list({})
leann_remove({ index_name: "<name>" })

// LEANN CLI (via Bash)
Bash("leann build <name> --docs <path>")
Bash("leann build <name> --docs <path> --exclude <patterns>")

// Freshness Detection
Bash("stat -f '%m' .leann/indexes/<name>/documents.index 2>/dev/null || echo 'missing'")
Bash("find ./src -type f \\( -name '*.js' -o -name '*.ts' -o -name '*.css' -o -name '*.html' \\) -newer .leann/indexes/<name>/documents.index 2>/dev/null | wc -l")
Bash("find ./src -type f \\( -name '*.js' -o -name '*.ts' -o -name '*.css' -o -name '*.html' \\) -newer .leann/indexes/<name>/documents.index 2>/dev/null | head -5")
Bash("stat -f '%Sm' -t '%b %d, %Y at %I:%M %p' .leann/indexes/<name>/documents.index 2>/dev/null")
```

---

## 4. 🔄 SYNC STATUS MODE (Default)

**Trigger:** `/search:index` with no arguments

### Workflow

```javascript
// 1. Get index list
leann_list({})

// 2. Get freshness for primary index
Bash("stat -f '%Sm' -t '%b %d, %Y at %I:%M %p' .leann/indexes/anobel/documents.index")
Bash("find ./src -type f ... -newer .leann/indexes/anobel/documents.index | wc -l")
Bash("find ./src -type f ... -newer .leann/indexes/anobel/documents.index | head -5")
```

### Freshness Algorithm

| Changed Files | Status           | Recommendation             |
| ------------- | ---------------- | -------------------------- |
| Index missing | ❌ MISSING       | Build index first          |
| 0             | ✅ FRESH         | No update needed           |
| 1-10          | ⚠️ SLIGHTLY STALE | Consider updating          |
| 11-50         | 🔄 STALE         | Update recommended         |
| >50           | 🔴 OUTDATED      | Update strongly recommended |

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
   → leann_remove({ index_name })
   → Bash("leann build <name> --docs .")
   → Display result with document count delta
```

**Output:** "Index updated in Xs" | "Index is now FRESH ✅"

### 5.2 LIST INDEXES

**Trigger:** `/search:index list` or `ls`

```javascript
leann_list({})
```

**Output:**
```
| Name   | Size   | Status        |
| ------ | ------ | ------------- |
| anobel | 8.7 MB | ⚠️ Stale (23) |

[u]pdate stale | [b]uild new | [r]emove | [q]uit
```

### 5.3 BUILD INDEX

**Trigger:** `/search:index build <name> --docs <path>`

```
1. Parse: <name> (required), --docs (default "."), --exclude (optional)
2. Validate: path exists, index doesn't exist (suggest update if it does)
3. Execute: Bash("leann build <name> --docs <path>")
4. Display: "Indexed N documents in Xs"
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
Bash("stat -f '%Sm' ... .leann/indexes/<name>/documents.index")
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

# Build new index
/search:index build anobel --docs .

# Remove old index
/search:index remove oldproject
```

---

## 8. 🔗 RELATED

- `/search:code` - Semantic, structural, lexical code search
- **mcp-leann skill** - Full LEANN documentation and advanced usage
