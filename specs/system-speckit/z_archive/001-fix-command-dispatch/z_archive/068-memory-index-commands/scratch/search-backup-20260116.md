---
description: Unified memory interface - search, browse, load by ID/folder/anchor, manage, cleanup
argument-hint: "[query] | <id> | <spec-folder> [--anchor:<id>] [--tier:<tier>] [cleanup] [triggers]"
allowed-tools: Read, Bash, spec_kit_memory_memory_search, spec_kit_memory_memory_match_triggers, spec_kit_memory_memory_list, spec_kit_memory_memory_stats, spec_kit_memory_memory_validate, spec_kit_memory_memory_update, spec_kit_memory_memory_delete
---

# 🚨 CONDITIONAL GATE - DESTRUCTIVE OPERATION ENFORCEMENT

**This gate ONLY applies to cleanup mode. All other modes pass through immediately.**

---

## GATE 1: CLEANUP CONFIRMATION (Conditional)

**STATUS: ⏭️ N/A** (default for non-cleanup modes)

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS does NOT contain "cleanup":
│   └─ SET STATUS: ⏭️ N/A → Proceed directly to workflow
│
└─ IF $ARGUMENTS contains "cleanup":
    │
    ├─ SET STATUS: ☐ BLOCKED
    │
    ├─ EXECUTE cleanup candidate search:
    │   spec_kit_memory_memory_list({ limit: 50, sortBy: "created_at" })
    │
    ├─ FILTER by tier eligibility:
    │   ├─ deprecated      → Always include
    │   ├─ temporary       → Include if >7 days old
    │   ├─ normal          → Include if >90 days old AND <3 accesses
    │   └─ important/critical/constitutional → PROTECTED (never include)
    │
    ├─ IF no candidates found:
    │   ├─ Display: "No cleanup candidates found. All memories are active."
    │   └─ SET STATUS: ⏭️ N/A → Exit workflow
    │
    └─ IF candidates found:
        ├─ Display candidates with [a]ll, [r]eview, [n]one, [b]ack options
        ├─ WAIT for user selection
        └─ SET STATUS: ✅ PASSED → Proceed to cleanup execution

**STOP HERE** - Wait for user to confirm deletion action ([a]ll, [r]eview, [n]one) before deleting any memories.

⛔ HARD STOP: DO NOT delete any memories until user explicitly chooses [a]ll or [y]es per item
⛔ NEVER auto-delete without user confirmation
```

---

# Unified Memory Command

One command to search, browse, load, manage, and clean up your conversation memories.

---

```yaml
role: Memory System Specialist
purpose: Unified interface for all memory operations except save and checkpoint
action: Route through dashboard, search, direct load, triggers, cleanup based on arguments

operating_mode:
  workflow: interactive_unified
  workflow_compliance: MANDATORY
  workflow_execution: single_letter_actions
  approvals: cleanup_deletions_only
  tracking: session_state
```

---

## 1. PURPOSE

Provide a unified interface for all memory operations: searching, browsing, **direct loading by ID/folder/anchor**, validating, editing triggers, managing tiers, and cleaning up old memories.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Optional query, ID, spec folder, mode keyword, or filters
**Outputs:** `STATUS=<OK|FAIL>` with optional `REMOVED=<N>` for cleanup mode

### Argument Patterns

| Pattern                  | Mode          | Example                               |
| ------------------------ | ------------- | ------------------------------------- |
| (empty)                  | Dashboard     | `/memory:search`                      |
| `<numeric-id>`           | Direct Load   | `/memory:search 42`                   |
| `<NNN-folder-name>`      | Folder Load   | `/memory:search 007-auth`             |
| `<id> --anchor:<anchor>` | Anchor Load   | `/memory:search 42 --anchor:summary`  |
| `<query>`                | Search        | `/memory:search oauth implementation` |
| `cleanup`                | Cleanup       | `/memory:search cleanup`              |
| `triggers`               | Triggers View | `/memory:search triggers`             |
| `--tier:<tier>`          | Filtered      | `/memory:search --tier:critical`      |
| `--type:<type>`          | Filtered      | `/memory:search --type:decision`      |

---

## 3. ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)
    │   └─→ DASHBOARD (Section 6): Stats + Recent + Suggested
    │
    ├─ Numeric only (e.g., "42", "123")
    │   └─→ DIRECT LOAD BY ID (Section 5.1)
    │
    ├─ Spec folder pattern (e.g., "007-auth", "042-feature")
    │   │   Pattern: ^\d{3}-[a-z0-9-]+$
    │   └─→ LOAD FROM FOLDER (Section 5.2)
    │
    ├─ Contains "--anchor:<id>"
    │   └─→ LOAD WITH ANCHOR (Section 5.3)
    │
    ├─ "cleanup"
    │   └─→ GATE 1 BLOCKED → CLEANUP MODE (Section 11)
    │
    ├─ "triggers"
    │   └─→ TRIGGERS VIEW (Section 10): Global trigger overview
    │
    ├─ "--tier:<tier>" or "--type:<type>"
    │   └─→ FILTERED SEARCH (Section 7)
    │
    └─ Any other text (e.g., "oauth tokens")
        └─→ SEARCH MODE (Section 7): Semantic search results
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

## 4. MCP ENFORCEMENT MATRIX

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
│ TRIGGER EDIT    │ memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TRIGGERS VIEW   │ memory_list                                             │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CLEANUP         │ memory_list → [confirm] → memory_delete                  │ SEQUENCE │ Abort operation │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TIER CHANGE     │ memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ VALIDATION      │ memory_validate                                         │ SINGLE   │ Show error msg  │
└─────────────────┴─────────────────────────────────────────────────────────┴──────────┴─────────────────┘
```

### MCP Tool Signatures

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
spec_kit_memory_memory_match_triggers({ prompt: "<context>", limit: N })
spec_kit_memory_memory_search({ query: "<q>", limit: N, tier: "<tier>", contextType: "<type>", includeContent: true, includeContiguity: false, concepts: [...] })
spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })
spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>", triggerPhrases: [...] })
spec_kit_memory_memory_delete({ id: <id> })
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

## 5. DIRECT LOAD MODE

### 5.1 Load by Memory ID

**Trigger:** `/memory:search 42` (numeric ID only)

**Steps:**

1. List memories to find the ID:
   ```javascript
   spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
   ```

2. Find memory with matching ID in results

3. Read full content:
   ```javascript
   Read({ filePath: "<absolute_path_from_result>" })
   ```

4. Display formatted content (Section 8)

**Error:** `STATUS=FAIL ERROR="Memory #<id> not found"`

### 5.2 Load by Spec Folder

**Trigger:** `/memory:search 007-auth-feature` (matches `^\d{3}-[a-z0-9-]+$`)

**Steps:**

1. Search for memories in spec folder:
   ```javascript
   spec_kit_memory_memory_search({ 
     query: "*", 
     specFolder: "007-auth-feature",
     limit: 5 
   })
   ```

2. If multiple results, load the most recent (sorted by updated_at)

3. Read full content:
   ```javascript
   Read({ filePath: "<filePath_from_result>" })
   ```

4. Display formatted content (Section 8)

**Error:** `STATUS=FAIL ERROR="No memories in folder <folder>"`

### 5.3 Load with Anchor

**Trigger:** `/memory:search 42 --anchor:summary`

**Steps:**

1. Load memory using steps from 5.1 or 5.2

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

## 6. DASHBOARD MODE (No Arguments)

**Trigger:** `/memory:search` with no arguments

### Step 1: Gather Data (Parallel)

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: 20, sortBy: "updated_at" })
```

### Step 2: Display Dashboard

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [<N> entries]    │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #<id>  <title>                                           │
│                                                             │
│  ◆ CRITICAL                                                 │
│    #<id>  <title>                                           │
│                                                             │
│  ◇ IMPORTANT                                                │
│    #<id>  <title>                                           │
│                                                             │
│  ○ RECENT (last 7 days)                                     │
│    #<id>  <title> (<date>)                                  │
├─────────────────────────────────────────────────────────────┤
│  [#] load memory | [s]earch | [t]riggers | [c]leanup        │
╰─────────────────────────────────────────────────────────────╯
```

**Display Rules:**
- Hide empty tier sections
- Limits: 3 constitutional + 3 critical + 3 important + 5 recent = 14 max
- Constitutional always surfaces at top

**Tier Symbols:**
| Symbol | Tier           |
| ------ | -------------- |
| ★      | constitutional |
| ◆      | critical       |
| ◇      | important      |
| ○      | recent         |

### Step 3: Handle Actions

| Input  | Action                          |
| ------ | ------------------------------- |
| `<id>` | Go to MEMORY DETAIL for that ID |
| s      | Prompt for search query         |
| t      | Go to TRIGGERS VIEW             |
| c      | Go to CLEANUP MODE (Gate 1)     |
| q      | Exit with STATUS=OK             |

---

## 7. SEARCH MODE

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
  tier: "<tier>",           // if specified
  contextType: "<type>",    // if specified
  useDecay: true            // unless --use-decay:false
})
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

## CONSTITUTIONAL MEMORY BEHAVIOR

Constitutional tier memories receive special handling:

| Behavior             | Description                                   |
| -------------------- | --------------------------------------------- |
| **Always surfaces**  | Appears at TOP of every search result         |
| **Fixed similarity** | Returns `similarity: 100` regardless of query |
| **Response flag**    | `isConstitutional: true` in results           |
| **Token budget**     | ~500 tokens max                               |

**Parameter:** Use `--include-constitutional:false` to suppress.

---

## 8. MEMORY DETAIL VIEW

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
[a-c] related | [l]oad anchor | [t]riggers edit
[v]alidate    | [x] not useful | [p]romote tier
[s]earch      | [b]ack         | [q]uit

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
| t     | Go to TRIGGER EDIT                        |
| v     | `memory_validate({ wasUseful: true })`    |
| x     | `memory_validate({ wasUseful: false })`   |
| p     | Show tier promotion menu                  |
| f     | Load full memory (from anchor view)       |
| o     | Prompt for another anchor ID              |
| s     | New search                                |
| b     | Back to previous screen                   |
| q     | Exit                                      |

---

## 9. TRIGGER EDIT (Per-Memory)

**Trigger:** [t] from MEMORY DETAIL

```
EDIT TRIGGERS: "<memory_title>"
────────────────────────────────────────────────────

Current triggers:
  1) oauth
  2) token refresh
  3) callback url
  4) jwt decode

────────────────────────────────────────────────────
[a]dd trigger | [r]emove (enter #) | [b]ack | [s]ave
```

| Input | Action                                     |
| ----- | ------------------------------------------ |
| a     | Prompt for new trigger phrase              |
| r     | Prompt for number to remove                |
| s     | `memory_update({ triggerPhrases: [...] })` |
| b     | Back (discard changes)                     |

---

## 10. TRIGGERS VIEW (Global)

**Trigger:** `/memory:search triggers` or dashboard [t]

```javascript
spec_kit_memory_memory_list({ limit: 30, sortBy: "updated_at" })
```

```
TRIGGER PHRASES OVERVIEW
────────────────────────────────────────────────────

Memory: "Core Project Rules" [ID: 1]
  Tier: constitutional
  Triggers: project rules, constraints, must follow

Memory: "OAuth Implementation" [ID: 42]
  Tier: critical
  Triggers: oauth, token refresh, callback url

────────────────────────────────────────────────────
[#] edit triggers for memory # | [s]earch by trigger | [b]ack | [q]uit
```

| Input  | Action                             |
| ------ | ---------------------------------- |
| `<id>` | Go to TRIGGER EDIT for that memory |
| s      | Filter memories by trigger match   |
| b      | Back to DASHBOARD                  |
| q      | Exit                               |

---

## 11. CLEANUP MODE

**Trigger:** `/memory:search cleanup` or dashboard [c]

**⚠️ GATE 1 MUST BE PASSED**

### Pre-Cleanup Safety

Before executing bulk delete:
1. Create automatic checkpoint: `checkpoint_create({ name: "pre-cleanup-{timestamp}" })`
   - Example: `pre-cleanup-2025-01-15T10-30-00`
2. Inform user of checkpoint name in output
3. Proceed with deletion after user confirmation
4. Provide restore instructions in output:
   ```
   To undo this cleanup, run:
   checkpoint_restore({ name: "pre-cleanup-{timestamp}" })
   ```

```
CLEANUP MODE
────────────────────────────────────────────────────

Found <N> cleanup candidates:

| ID  | Tier       | Title                  | Age      | Accesses |
| --- | ---------- | ---------------------- | -------- | -------- |
| 42  | deprecated | Early hero experiments | 4 months | 1        |
| 55  | temporary  | Deprecated API notes   | 10 days  | 0        |

Protected (not shown):
  constitutional: <N> | critical: <N> | important: <N>

────────────────────────────────────────────────────
[a]ll remove | [r]eview each | [n]one keep | [b]ack | [q]uit
```

| Input | Action                                    |
| ----- | ----------------------------------------- |
| a     | Confirm prompt, then delete all           |
| r     | Step through: [y]es, [n]o, [v]iew, [s]kip |
| n     | Cancel, keep all                          |
| b     | Back to DASHBOARD                         |
| q     | Exit                                      |

**Completion:**
```
CLEANUP COMPLETE
Removed: <N> memories | Kept: <N> memories

STATUS=OK REMOVED=<N> KEPT=<N>
```

---

## 12. TIER PROMOTION MENU

**Trigger:** [p] from MEMORY DETAIL

```
CHANGE TIER: "<memory_title>"
────────────────────────────────────────────────────
Current: <tier>

Select new tier:
  [0] constitutional - Universal rules (~500 tokens max)
  [1] critical       - Architecture, core patterns
  [2] important      - Key implementations
  [3] normal         - General context
  [4] temporary      - Short-term, WIP
  [5] deprecated     - Mark as outdated

[b]ack to cancel
```

**Action:** `memory_update({ id, importanceTier: "<selected>" })`

---

## 13. QUICK REFERENCE

| Command                              | Result                   |
| ------------------------------------ | ------------------------ |
| `/memory:search`                     | Dashboard                |
| `/memory:search 42`                  | Load memory #42 directly |
| `/memory:search 007-auth`            | Load from spec folder    |
| `/memory:search 42 --anchor:summary` | Load anchor section      |
| `/memory:search oauth tokens`        | Search query             |
| `/memory:search cleanup`             | Cleanup mode             |
| `/memory:search triggers`            | Triggers view            |
| `/memory:search --tier:critical`     | Filtered search          |
| `/memory:search --concepts:auth,jwt` | AND search               |

---

## 14. ERROR HANDLING

| Condition              | Response                                      |
| ---------------------- | --------------------------------------------- |
| Memory ID not found    | `STATUS=FAIL ERROR="Memory #<id> not found"`  |
| No memories in folder  | `STATUS=FAIL ERROR="No memories in <folder>"` |
| Anchor not found       | Show available anchors, suggest alternatives  |
| File path missing      | `STATUS=FAIL ERROR="File path unavailable"`   |
| Read permission denied | `STATUS=FAIL ERROR="Cannot read memory file"` |

---

## 15. RELATED COMMANDS

- `/memory:save` - Save current conversation context
- `/memory:checkpoint` - Create/restore memory state checkpoints

---

## 16. FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skills/system-spec-kit/SKILL.md`
