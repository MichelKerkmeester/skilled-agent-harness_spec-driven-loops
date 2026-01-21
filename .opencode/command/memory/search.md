---
description: Memory search and browse - search, load by ID/folder/anchor, view triggers (read-only)
argument-hint: "[query] | <id> | <spec-folder> [--anchor:<id>] [--tier:<tier>] [triggers]"
allowed-tools: Read, spec_kit_memory_memory_search, spec_kit_memory_memory_match_triggers, spec_kit_memory_memory_list, spec_kit_memory_memory_stats
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "What would you like to search for in memory?"
        options:
          - label: "Search by query"
            description: "Semantic search using natural language"
          - label: "Load by ID"
            description: "Load a specific memory by its ID"
          - label: "Browse folder"
            description: "List memories in a spec folder"
          - label: "View triggers"
            description: "Show configured trigger phrases"
    → WAIT for user response
    → Use their response to determine the search mode
    → Only THEN continue with this workflow

IF $ARGUMENTS contains search parameters:
    → Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer search terms from conversation context
- **DO NOT** assume which memory the user wants
- **DO NOT** proceed past this point without explicit input from the user
- The search parameters MUST come from `$ARGUMENTS` or user's answer above

---

# Memory Search Command

One command to search, browse, and load your conversation memories. **Read-only operations only.**

For management operations (cleanup, tier changes, trigger edits, delete), use `/memory:database`.

---

```yaml
role: Memory Search Specialist
purpose: Read-only interface for searching and browsing memories
action: Route through dashboard, search, direct load, triggers based on arguments

operating_mode:
  workflow: interactive_read_only
  workflow_compliance: MANDATORY
  workflow_execution: single_letter_actions
  approvals: none_required
  tracking: session_state
```

---

## 1. 🎯 PURPOSE

Provide a **read-only** interface for memory operations: searching, browsing, and **direct loading by ID/folder/anchor**.

**Separation from `/memory:database`:**

- `/memory:search` = READ-ONLY (this command)
- `/memory:database` = MANAGEMENT (modify, delete, maintain)

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional query, ID, spec folder, or filters
**Outputs:** `STATUS=<OK|FAIL>` with search/load results

### Argument Patterns

| Pattern                  | Mode          | Example                               |
| ------------------------ | ------------- | ------------------------------------- |
| (empty)                  | Dashboard     | `/memory:search`                      |
| `<numeric-id>`           | Direct Load   | `/memory:search 42`                   |
| `<NNN-folder-name>`      | Folder Load   | `/memory:search 007-auth`             |
| `<id> --anchor:<anchor>` | Anchor Load   | `/memory:search 42 --anchor:summary`  |
| `<query>`                | Search        | `/memory:search oauth implementation` |
| `triggers`               | Triggers View | `/memory:search triggers`             |
| `--tier:<tier>`          | Filtered      | `/memory:search --tier:critical`      |
| `--type:<type>`          | Filtered      | `/memory:search --type:decision`      |

---

## 3. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)
    │   └─→ DASHBOARD (Section 5): Stats + Recent + Suggested
    │
    ├─ Numeric only (e.g., "42", "123")
    │   └─→ DIRECT LOAD BY ID (Section 4.1)
    │
    ├─ Spec folder pattern (e.g., "007-auth", "042-feature")
    │   │   Pattern: ^\d{3}-[a-z0-9-]+$
    │   └─→ LOAD FROM FOLDER (Section 4.2)
    │
    ├─ Contains "--anchor:<id>"
    │   └─→ LOAD WITH ANCHOR (Section 4.3)
    │
    ├─ "triggers"
    │   └─→ TRIGGERS VIEW (Section 8): Global trigger overview (read-only)
    │
    ├─ "--tier:<tier>" or "--type:<type>"
    │   └─→ FILTERED SEARCH (Section 6)
    │
    └─ Any other text (e.g., "oauth tokens")
        └─→ SEARCH MODE (Section 6): Semantic search results
```

### Pattern Detection Logic

```javascript
// Numeric ID: pure digits only
const isNumericId = /^\d+$/.test(args);

// Spec folder: 3-digit prefix + hyphen + lowercase name
const isSpecFolder = /^\d{3}-[a-z0-9-]+$/i.test(args);

// Anchor flag: anywhere in arguments
const hasAnchor = /--anchor:[\w-]+/.test(args);

// Priority: anchor > numeric > folder > keywords > search
```

---

## 4. ⚡ DIRECT LOAD MODE

### 4.1 Load by Memory ID

**Trigger:** `/memory:search 42` (numeric ID only)

**Steps:**

1. List memories to find the ID:

   ```javascript
   spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" });
   ```

2. Find memory with matching ID in results

3. Read full content:

   ```javascript
   Read({ filePath: "<absolute_path_from_result>" });
   ```

4. Display formatted content (Section 7)

**Error:** `STATUS=FAIL ERROR="Memory #<id> not found"`

### 4.2 Load by Spec Folder

**Trigger:** `/memory:search 007-auth-feature` (matches `^\d{3}-[a-z0-9-]+$`)

**Steps:**

1. Search for memories in spec folder:

   ```javascript
   spec_kit_memory_memory_search({
     query: "*",
     specFolder: "007-auth-feature",
     limit: 5,
   });
   ```

2. If multiple results, load the most recent (sorted by updated_at)

3. Read full content:

   ```javascript
   Read({ filePath: "<filePath_from_result>" });
   ```

4. Display formatted content (Section 7)

**Error:** `STATUS=FAIL ERROR="No memories in folder <folder>"`

### 4.3 Load with Anchor

**Trigger:** `/memory:search 42 --anchor:summary`

**Steps:**

1. Load memory using steps from 4.1 or 4.2

2. Extract anchor section using regex:

   ```regex
   <!-- ANCHOR:<anchor-id> -->
   (.*?)
   <!-- /ANCHOR:<anchor-id> -->
   ```

3. Display only the anchor content

**Common Anchor IDs:**

- `summary` - Session summary section
- `decision-*` - Decision records
- `implementation-*` - Implementation details
- `files` - Files modified list

**Error:** `STATUS=FAIL ERROR="Anchor '<id>' not found in memory #<id>"`
→ Show available anchors if extraction fails

---

## 5. 📊 DASHBOARD MODE (No Arguments)

**Trigger:** `/memory:search` with no arguments

### Step 1: Fetch Stats with Server-Side Scoring

**Option A (Preferred - Server-Side):**

Call `memory_stats` with composite ranking for pre-computed folder scores:

```javascript
spec_kit_memory_memory_stats({
  folderRanking: 'composite',  // Use server-side composite scoring
  includeScores: true,         // Get score breakdown per folder
  includeArchived: false,      // Hide archived by default
  limit: 10                    // Top 10 folders
});
```

The response includes pre-computed folder data:
- `simplified` - Display-friendly folder name (leaf path)
- `score` - Composite score (0-100%)
- `lastActivity` - Relative time since last update
- `isArchived` - Archive status flag
- `topTier` - Highest importance tier in folder
- `count` - Memory count in folder

**Option B (Fallback - Client-Side):**

If server doesn't support new parameters (older MCP version), fall back to client-side ranking:

```javascript
// Parallel calls
spec_kit_memory_memory_stats({});
spec_kit_memory_memory_list({ limit: 100, sortBy: "updated_at" });
```

Then process through ranking script:

```bash
# Save memory_list results to temp file, then rank
node .opencode/skill/system-spec-kit/scripts/memory/rank-memories.js /tmp/memories.json
# Add --show-archived flag if user toggled archive visibility
```

**Ranking Script Output:**
- `constitutional` - Always-visible memories with constitutional tier
- `recentlyActive` - Folders ranked by composite score (recency 40% + importance 30% + activity 20% + validation 10%)
- `highImportance` - Folders containing critical/constitutional content
- `recentMemories` - Most recently updated non-constitutional memories
- `stats` - Total counts, active/archived folder counts

**Archive Detection:** Folders matching `z_archive/`, `/scratch/`, `/test-`, `-test/` are hidden by default.

### Step 2: Display Dashboard

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [<N> entries]    │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #<id>  <title>                                           │
│                                                             │
│  ◆ RECENTLY ACTIVE FOLDERS                                  │
│    <folder> (<count>, <time-ago>) <score>%                  │
│    <folder> (<count>, <time-ago>) <score>%                  │
│    <folder> (<count>, <time-ago>) <score>%                  │
│                                                             │
│  ◇ HIGH IMPORTANCE CONTENT                                  │
│    <folder> (<tier>)                                        │
│                                                             │
│  ○ RECENT MEMORIES                                          │
│    #<id>  <title> (<folder>, <time-ago>)                    │
├─────────────────────────────────────────────────────────────┤
│  [#] load | [s]earch | [f]older | [t]riggers | [a]rchived   │
│  [q]uit                                                     │
╰─────────────────────────────────────────────────────────────╯
```

**Display Rules:**

- Hide empty sections (don't show section header if no items)
- Limits: 3 constitutional + 3 active folders + 3 high importance + 5 recent = 14 max
- Constitutional memories always surface at top
- Archived folders hidden by default (toggle with `[a]`)
- Folder display shows: simplified name (memory count, relative time) score%

**Section Symbols:**
| Symbol | Section             | Content                                        |
| ------ | ------------------- | ---------------------------------------------- |
| ★      | CONSTITUTIONAL      | Tier=constitutional memories                   |
| ◆      | RECENTLY ACTIVE     | Folders by composite score (excludes archived) |
| ◇      | HIGH IMPORTANCE     | Folders with critical/constitutional content   |
| ○      | RECENT MEMORIES     | Most recent by updatedAt (non-constitutional)  |

### Step 3: Handle Actions

| Input  | Action                                          |
| ------ | ----------------------------------------------- |
| `<id>` | Go to MEMORY DETAIL for that ID                 |
| s      | Prompt for search query                         |
| f      | Load memories from a specific folder            |
| t      | Go to TRIGGERS VIEW                             |
| a      | Toggle archived folder visibility               |
| q      | Exit with STATUS=OK                             |

**Archive Toggle Behavior:**
- Default: Archived folders hidden (stats show "hiding N archived")
- After toggle: Archived folders visible with "(archived)" suffix
- Visual indicator: `[a]rchived*` when showing archived
- Server-side: Re-call `memory_stats({ folderRanking: 'composite', includeArchived: true, ... })`
- Client-side fallback: Re-run ranking script with `--show-archived` flag

---

## 6. 🔍 SEARCH MODE

**Trigger:** `/memory:search <query>` or dashboard [s]

### Arguments

- `<query>` - Natural language search
- `--tier:<tier>` - Filter: constitutional, critical, important, normal, temporary, deprecated
- `--type:<type>` - Filter: research, implementation, decision, discovery, general
- `--use-decay:false` - Disable temporal decay
- `--concepts:<a,b,c>` - AND search (match ALL concepts, requires 2-5 items)
- `--include-content:true` - Include full memory content in results
- `--include-contiguity:true` - Include adjacent/contiguous memories

### Step 1: Execute Search

```javascript
spec_kit_memory_memory_search({
  query: "<query>",
  limit: 10,
  tier: "<tier>", // if specified
  contextType: "<type>", // if specified
  useDecay: true, // unless --use-decay:false
});
```

### Step 2: Display Results

```
SEARCH: "<query>"
Filters: tier=<all|tier> | type=<all|type> | decay=<on|off>
────────────────────────────────────────────────────

| #   | Score | Tier      | Title                | Spec Folder      |
| --- | ----- | --------- | -------------------- | ---------------- |
| 1   | 92%   | critical  | OAuth Implementation | 049-auth-system  |
| 2   | 85%   | important | JWT token handling   | 049-auth-system  |
| 3   | 78%   | normal    | Session management   | 032-api-security |

────────────────────────────────────────────────────
[1-N] select | [n]ew search | [f]ilters | [b]ack | [q]uit
```

### Step 3: Handle Actions

| Input | Action               |
| ----- | -------------------- |
| 1-N   | Go to MEMORY DETAIL  |
| n     | Prompt for new query |
| f     | Show filter menu     |
| b     | Back to DASHBOARD    |
| q     | Exit                 |

---

## 🏛️ CONSTITUTIONAL MEMORY BEHAVIOR

Constitutional tier memories receive special handling:

| Behavior             | Description                                   |
| -------------------- | --------------------------------------------- |
| **Always surfaces**  | Appears at TOP of every search result         |
| **Fixed similarity** | Returns `similarity: 100` regardless of query |
| **Response flag**    | `isConstitutional: true` in results           |
| **Token budget**     | ~500 tokens max                               |

**Parameter:** Use `--include-constitutional:false` to suppress.

---

## 7. 📄 MEMORY DETAIL VIEW

**Trigger:** Select memory from dashboard, search, or direct load

### Full Memory Display

```
MEMORY #<id>: <title>
────────────────────────────────────────────────────
Spec Folder: <spec_folder>
Created:     <created_date>
Updated:     <updated_date>
Tier:        <importance_tier>
Type:        <context_type>
Triggers:    <phrase1>, <phrase2>, <phrase3>

────────────────────────────────────────────────────
<memory_content>
────────────────────────────────────────────────────

AVAILABLE ANCHORS:
  - summary
  - decision-jwt
  - files

────────────────────────────────────────────────────
[a-c] related | [l]oad anchor | [s]earch | [b]ack | [q]uit

STATUS=OK ID=<id>
```

### Anchor-Only Display

```
MEMORY #<id>: <title>
ANCHOR: <anchor-id>
────────────────────────────────────────────────────

<anchor_content>

────────────────────────────────────────────────────
[f]ull memory | [o]ther anchor | [b]ack | [q]uit

STATUS=OK ID=<id> ANCHOR=<anchor-id>
```

### Handle Actions

| Input | Action                                    |
| ----- | ----------------------------------------- |
| a-c   | Go to related memory                      |
| l     | Prompt for anchor ID, extract and display |
| f     | Load full memory (from anchor view)       |
| o     | Prompt for another anchor ID              |
| s     | New search                                |
| b     | Back to previous screen                   |
| q     | Exit                                      |

---

## 8. 📋 TRIGGERS VIEW (Read-Only)

**Trigger:** `/memory:search triggers` or dashboard [t]

```javascript
spec_kit_memory_memory_list({ limit: 30, sortBy: "updated_at" });
```

```
TRIGGER PHRASES OVERVIEW (Read-Only)
────────────────────────────────────────────────────

Memory: "Core Project Rules" [ID: 1]
  Tier: constitutional
  Triggers: project rules, constraints, must follow

Memory: "OAuth Implementation" [ID: 42]
  Tier: critical
  Triggers: oauth, token refresh, callback url

────────────────────────────────────────────────────
[#] view memory # | [s]earch by trigger | [b]ack | [q]uit

To edit triggers, use: /memory:database triggers <id>
```

| Input  | Action                     |
| ------ | -------------------------- |
| `<id>` | Go to MEMORY DETAIL (view) |
| s      | Filter memories by trigger |
| b      | Back to DASHBOARD          |
| q      | Exit                       |

---

## 9. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each mode.

```
┌─────────────────┬─────────────────────────────────────────────────────────┬──────────┬─────────────────┐
│ MODE            │ REQUIRED CALLS                                          │ PATTERN  │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ BY ID           │ memory_list → Read(filePath)                             │ SEQUENCE │ ID not found    │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ BY SPEC FOLDER  │ memory_search(specFolder) → Read(filePath)               │ SEQUENCE │ No memories     │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ WITH ANCHOR     │ memory_list/search → Read(filePath) → Extract anchor     │ SEQUENCE │ Anchor missing  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DASHBOARD       │ memory_stats + memory_list                              │ PARALLEL │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ SEARCH          │ memory_search                                           │ SINGLE   │ No results msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DETAIL VIEW     │ memory_search (includeContent: true)                    │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TRIGGERS VIEW   │ memory_list                                             │ SINGLE   │ Show error msg  │
└─────────────────┴─────────────────────────────────────────────────────────┴──────────┴─────────────────┘
```

### MCP Tool Signatures

```javascript
spec_kit_memory_memory_stats({
  folderRanking: 'composite',  // Optional: 'composite' for scored folders, omit for counts only
  includeScores: true,         // Optional: include score breakdown per folder
  includeArchived: false,      // Optional: include archived folders (default: false)
  limit: 10                    // Optional: limit top folders returned
})
spec_kit_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
spec_kit_memory_memory_match_triggers({ prompt: "<context>", limit: N })
spec_kit_memory_memory_search({ query: "<q>", limit: N, tier: "<tier>", contextType: "<type>", includeContent: true, includeContiguity: false, concepts: [...] })
Read({ filePath: "<absolute_path>" })
```

### Full Parameter Reference: memory_search

| Parameter               | Type    | Default | Description                                                                                              |
| ----------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `query`                 | string  | -       | Natural language search query                                                                            |
| `concepts`              | array   | -       | Multiple concepts for AND search (2-5 strings). Results must match ALL concepts. Alternative to `query`. |
| `limit`                 | number  | 10      | Maximum number of results to return                                                                      |
| `tier`                  | string  | -       | Filter by importance tier: constitutional, critical, important, normal, temporary, deprecated            |
| `contextType`           | string  | -       | Filter by context type: decision, implementation, research, discovery, general                           |
| `specFolder`            | string  | -       | Limit search to a specific spec folder (e.g., "011-semantic-memory")                                     |
| `includeContent`        | boolean | false   | Include full file content in results. Embeds content directly, eliminating separate load calls.          |
| `includeContiguity`     | boolean | false   | Include adjacent/contiguous memories in results. Useful for finding related context.                     |
| `includeConstitutional` | boolean | true    | Include constitutional tier memories at top of results (~500 tokens max)                                 |
| `useDecay`              | boolean | true    | Apply temporal decay scoring to results (recent memories rank higher)                                    |

**Usage Notes:**

- Use either `query` (single search string) OR `concepts` (array for AND search), not both
- `concepts` requires 2-5 strings; results must match ALL concepts
- `includeContent: true` returns full memory content, avoiding separate Read calls
- `includeContiguity: true` surfaces memories that were created in sequence

---

## 10. 📌 QUICK REFERENCE

| Command                              | Result                    |
| ------------------------------------ | ------------------------- |
| `/memory:search`                     | Dashboard                 |
| `/memory:search 42`                  | Load memory #42 directly  |
| `/memory:search 007-auth`            | Load from spec folder     |
| `/memory:search 42 --anchor:summary` | Load anchor section       |
| `/memory:search oauth tokens`        | Search query              |
| `/memory:search triggers`            | Triggers view (read-only) |
| `/memory:search --tier:critical`     | Filtered search           |
| `/memory:search --concepts:auth,jwt` | AND search                |

---

## 11. ⚠️ ERROR HANDLING

| Condition              | Response                                      |
| ---------------------- | --------------------------------------------- |
| Memory ID not found    | `STATUS=FAIL ERROR="Memory #<id> not found"`  |
| No memories in folder  | `STATUS=FAIL ERROR="No memories in <folder>"` |
| Anchor not found       | Show available anchors, suggest alternatives  |
| File path missing      | `STATUS=FAIL ERROR="File path unavailable"`   |
| Read permission denied | `STATUS=FAIL ERROR="Cannot read memory file"` |

---

## 12. 🔗 RELATED COMMANDS

- `/memory:database` - Database management (cleanup, tier, triggers, delete, scan, health)
- `/memory:save` - Save current conversation context
- `/memory:checkpoint` - Create/restore memory state checkpoints

---

## 13. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`
