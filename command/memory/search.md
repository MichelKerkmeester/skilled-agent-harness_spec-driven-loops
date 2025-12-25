---
description: Unified memory dashboard - search, browse, manage triggers, cleanup, and validate memories
argument-hint: "[query] [--tier:<tier>] [--type:<type>] [cleanup] [triggers]"
allowed-tools: Read, Bash, semantic_memory_memory_search, semantic_memory_memory_match_triggers, semantic_memory_memory_list, semantic_memory_memory_stats, semantic_memory_memory_validate, semantic_memory_memory_update, semantic_memory_memory_delete
---

# 🚨 CONDITIONAL GATE - DESTRUCTIVE OPERATION ENFORCEMENT

**This gate ONLY applies to cleanup mode. All other modes (dashboard, search, triggers) pass through immediately.**

---

## 🔒 GATE 1: CLEANUP CONFIRMATION (Conditional)

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
    │   semantic_memory_memory_list({ limit: 50, sortBy: "created_at" })
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

⛔ HARD STOP: DO NOT delete any memories until user explicitly chooses [a]ll or [y]es per item
⛔ NEVER auto-delete without user confirmation
```

**Gate 1 Output:** `cleanup_status = [N/A|PASSED]` | `candidates_count = ___`

---

## ✅ GATE STATUS VERIFICATION

**Before executing any mode, verify gate status:**

| GATE                    | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE           |
| ----------------------- | ----------------- | ----------- | ---------------------- |
| GATE 1: CLEANUP CONFIRM | ⏭️ N/A or ✅ PASSED | ______      | cleanup_status: ______ |

```
VERIFICATION CHECK:
├─ Gate shows ⏭️ N/A (non-cleanup mode)?
│   └─ YES → Proceed to appropriate mode section
│
├─ Gate shows ✅ PASSED (cleanup mode)?
│   └─ YES → Proceed to Section 10 (Cleanup Mode)
│
└─ Gate shows ☐ BLOCKED?
    └─ STOP and complete the gate (show candidates, wait for user choice)
```

---

## ⚠️ VIOLATION SELF-DETECTION

**YOU ARE IN VIOLATION IF YOU:**

- Deleted any memory without showing candidates first
- Deleted memories without user selecting [a]ll, [r]eview, or per-item [y]es
- Skipped the confirmation prompt for bulk deletion
- Deleted protected tier memories (constitutional, critical, important)
- Proceeded past ☐ BLOCKED status without user input

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue deletion
2. STATE: "I violated GATE 1 by [specific action]. Correcting now."
3. RETURN to gate verification
4. DISPLAY candidates with action menu
5. WAIT for explicit user choice
6. RESUME only after gate passes verification
```

---

# Unified Memory Command

One command to search, browse, manage, and clean up your conversation memories.

---

```yaml
role: Memory System Specialist
purpose: Unified interface for all memory operations except save and checkpoint
action: Route through dashboard, search, triggers, cleanup based on arguments

operating_mode:
  workflow: interactive_unified
  workflow_compliance: MANDATORY
  workflow_execution: single_letter_actions
  approvals: cleanup_deletions_only
  tracking: session_state
```

---

## 1. 🎯 PURPOSE

Provide a unified interface for all memory operations: searching, browsing, validating, editing triggers, managing tiers, and cleaning up old memories. This command consolidates what were previously separate commands into one cohesive dashboard experience.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional query, mode keyword, or filters
**Outputs:** `STATUS=<OK|FAIL>` with optional `REMOVED=<N>` for cleanup mode

### Argument Patterns

| Pattern         | Mode          | Example                               |
| --------------- | ------------- | ------------------------------------- |
| (empty)         | Dashboard     | `/memory/search`                      |
| `<query>`       | Search        | `/memory/search oauth implementation` |
| `cleanup`       | Cleanup       | `/memory/search cleanup`              |
| `triggers`      | Triggers View | `/memory/search triggers`             |
| `--tier:<tier>` | Filtered      | `/memory/search --tier:critical`      |
| `--type:<type>` | Filtered      | `/memory/search --type:decision`      |

---

## 3. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)
    │   └─→ DASHBOARD (Section 5): Stats + Recent + Suggested
    │
    ├─ "cleanup"
    │   └─→ GATE 1 BLOCKED → CLEANUP MODE (Section 10)
    │
    ├─ "triggers"
    │   └─→ TRIGGERS VIEW (Section 9): Global trigger overview
    │
    ├─ "<query>" (any other text)
    │   └─→ SEARCH MODE (Section 6): Semantic search results
    │
    └─ "--tier:<tier>" or "--type:<type>"
        └─→ FILTERED SEARCH (Section 6): Apply filters
```

---

## 4. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each mode. Call patterns are enforced.

```
┌─────────────────┬─────────────────────────────────────────────────────────┬──────────┬─────────────────┐
│ MODE            │ REQUIRED CALLS                                          │ PATTERN  │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DASHBOARD       │ memory_stats + memory_list + memory_match_triggers      │ PARALLEL │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ SEARCH          │ memory_search                                           │ SINGLE   │ No results msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DETAIL VIEW     │ memory_search (includeContent: true for details)        │ SINGLE   │ Show error msg  │
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
semantic_memory_memory_stats({})
semantic_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
semantic_memory_memory_match_triggers({ prompt: "<context>", limit: N })
semantic_memory_memory_search({ query: "<q>", limit: N, tier: "<tier>", contextType: "<type>" })
// For full content, use memory_search with specific parameters - memory_load has been deprecated
semantic_memory_memory_validate({ id: <id>, wasUseful: <bool> })
semantic_memory_memory_update({ id: <id>, importanceTier: "<tier>", triggerPhrases: [...] })
semantic_memory_memory_delete({ id: <id> })
```

**Content Retrieval:**
```javascript
// Search with content included
semantic_memory_memory_search({ query: "auth implementation", limit: 5, includeContent: true })

// For specific memory by ID, use memory_list to browse then Read the file directly
```

---

## 5. 📊 DASHBOARD MODE (No Arguments)

**Trigger:** `/memory/search` with no arguments

### Step 1: Gather Data (Parallel MCP Calls)

```javascript
semantic_memory_memory_stats({})
semantic_memory_memory_list({ limit: 20, sortBy: "updated_at" })
```

### Step 2: Display Dashboard

**Format:** Use box-drawing characters with tier-grouped display. Empty sections are hidden automatically.

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [<N> entries]    │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #<id>  <title>                                           │
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
│    #<id>  <title> (<date>)                                  │
├─────────────────────────────────────────────────────────────┤
│  [#] view memory | [s]earch | [t]riggers | [c]leanup        │
╰─────────────────────────────────────────────────────────────╯
```

**Display Rules:**
- Hide empty tier sections (don't show "◆ CRITICAL" if no critical memories)
- Limits: 3 constitutional + 3 critical + 3 important + 5 recent = 14 max entries
- Constitutional tier always surfaces at top (if any exist)
- Entry count `[N entries]` shows total memories in system
- Use `memory_list()` output to build tier grouping

**Tier Symbols:**
| Symbol | Tier           | Description                                      |
| ------ | -------------- | ------------------------------------------------ |
| ★      | constitutional | Universal rules, always active (~500 tokens max) |
| ◆      | critical       | Architecture decisions, breaking changes         |
| ◇      | important      | Key implementations, major features              |
| ○      | recent         | Last 7 days, any tier                            |

### Step 3: Handle Actions

| Input  | Action                                                   |
| ------ | -------------------------------------------------------- |
| `<id>` | Go to MEMORY DETAIL for memory with that ID (e.g., `42`) |
| s      | Prompt for search query, go to SEARCH MODE               |
| t      | Go to TRIGGERS VIEW                                      |
| c      | Go to CLEANUP MODE (Gate 1 activates)                    |
| q      | Exit with STATUS=OK                                      |

---

## 6. 🔍 SEARCH MODE

**Trigger:** `/memory/search <query>` or `/memory/search` then [s]

### Arguments

- `<query>` - Natural language search
- `--tier:<tier>` - Filter: constitutional, critical, important, normal, temporary, deprecated
- `--type:<type>` - Filter: research, implementation, decision, discovery, general
- `--use-decay:false` - Disable temporal decay
- `--concepts:<a,b,c>` - AND search (match ALL concepts)

### Step 1: Execute Search

```javascript
semantic_memory_memory_search({
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

| Input | Action                                     |
| ----- | ------------------------------------------ |
| 1-N   | Go to MEMORY DETAIL                        |
| n     | Prompt for new search query                |
| f     | Show filter menu (tier/type/decay toggles) |
| b     | Back to DASHBOARD                          |
| q     | Exit                                       |

---

## 🏛️ CONSTITUTIONAL MEMORY BEHAVIOR

Constitutional tier memories receive special handling in search results:

| Behavior             | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| **Always surfaces**  | Constitutional memories appear at TOP of every search result |
| **Fixed similarity** | Returns `similarity: 100` regardless of query relevance      |
| **Response flag**    | `isConstitutional: true` in search results                   |
| **Token budget**     | ~500 tokens max for constitutional memories                  |
| **Default enabled**  | `includeConstitutional: true` is the default                 |

**Parameter:** Use `--include-constitutional:false` to suppress (rare use case).

**Example:** Memory #132 (Gate 3 enforcement) always surfaces to remind about spec folder question.

---

## 7. 📄 MEMORY DETAIL VIEW

**Trigger:** Select a memory from dashboard or search

### Step 1: Load Memory

```javascript
// Search for related memories with content
semantic_memory_memory_search({ query: "<title_keywords>", limit: 5, includeContent: true })
// For specific memory details, use the filePath from search results with Read tool
```

### Step 2: Display Detail

```
<Memory Title>
────────────────────────────────────────────────────
Spec:    <spec-folder>
Date:    <created_at>
Tier:    <tier> (confidence: <N>%)
Type:    <context_type>

SECTIONS
  Use Read tool with filePath from search results to view full content

PREVIEW
<First 500 characters of content...>

TRIGGER PHRASES
  <phrase1>, <phrase2>, <phrase3>

RELATED MEMORIES
  [a] <title> (92% match) - <spec_folder>
  [b] <title> (87% match) - <spec_folder>
  [c] <title> (81% match) - <spec_folder>

────────────────────────────────────────────────────
[a-c] explore related | [l]oad full (via Read)
[t]riggers edit       | [v]alidate useful     | [x] not useful
[p]romote tier        | [s]earch | [b]ack     | [q]uit
```

### Step 3: Handle Actions

| Input | Action                                              |
| ----- | --------------------------------------------------- |
| a-c   | Go to MEMORY DETAIL for related memory              |
| l     | Load full memory content via Read(filePath)         |
| t     | Go to TRIGGER EDIT for this memory                  |
| v     | Call memory_validate with wasUseful: true           |
| x     | Call memory_validate with wasUseful: false          |
| p     | Show tier promotion menu                            |
| s     | New search                                          |
| b     | Back to previous screen                             |
| q     | Exit                                                |

## 8. ✏️ TRIGGER EDIT (Per-Memory)

**Trigger:** [t] from MEMORY DETAIL

### Display

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

### Handle Actions

| Input | Action                                           |
| ----- | ------------------------------------------------ |
| a     | Prompt for new trigger phrase, add to list       |
| r     | Prompt for number to remove                      |
| s     | Call memory_update with new triggerPhrases array |
| b     | Back to MEMORY DETAIL (discard changes)          |

---

## 9. 📋 TRIGGERS VIEW (Global)

**Trigger:** `/memory/search triggers` or [t] from DASHBOARD

### Step 1: Load Data

```javascript
semantic_memory_memory_list({ limit: 30, sortBy: "updated_at" })
```

### Step 2: Display

```
TRIGGER PHRASES OVERVIEW
────────────────────────────────────────────────────

Memory: "Core Project Rules" [ID: 1]
  Tier: constitutional
  Triggers: project rules, constraints, must follow

Memory: "OAuth Implementation" [ID: 42]
  Tier: critical
  Triggers: oauth, token refresh, callback url, jwt decode

Memory: "Database Schema" [ID: 38]
  Tier: important
  Triggers: user table, migrations, foreign key

────────────────────────────────────────────────────
[#] edit triggers for memory # | [s]earch by trigger | [b]ack | [q]uit
```

### Handle Actions

| Input    | Action                                              |
| -------- | --------------------------------------------------- |
| <number> | Go to TRIGGER EDIT for that memory                  |
| s        | Prompt for phrase, filter memories by trigger match |
| b        | Back to DASHBOARD                                   |
| q        | Exit                                                |

---

## 10. 🧹 CLEANUP MODE

**Trigger:** `/memory/search cleanup` or [c] from DASHBOARD

**⚠️ GATE 1 MUST BE PASSED before this section executes**

### Step 1: Display Candidates (from Gate 1)

```
CLEANUP MODE
────────────────────────────────────────────────────

Found <N> cleanup candidates:

| ID  | Tier       | Title                  | Age      | Accesses |
| --- | ---------- | ---------------------- | -------- | -------- |
| 42  | deprecated | Early hero experiments | 4 months | 1        |
| 55  | temporary  | Deprecated API notes   | 10 days  | 0        |
| 78  | normal     | Old video handling     | 3 months | 2        |

Protected (not shown):
  constitutional: <N> | critical: <N> | important: <N>

────────────────────────────────────────────────────
[a]ll remove | [r]eview each | [n]one keep | [b]ack | [q]uit
```

### Step 2: Handle Actions

| Input | Action                                                          |
| ----- | --------------------------------------------------------------- |
| a     | Show confirmation prompt, then delete all candidates            |
| r     | Step through each: [y]es remove, [n]o keep, [v]iew, [s]kip rest |
| n     | Cancel cleanup, keep all                                        |
| b     | Back to DASHBOARD                                               |
| q     | Exit                                                            |

### Confirmation for "all"

```
Confirm: Remove <N> memories permanently?
This cannot be undone.

[y]es, remove all | [n]o, cancel
```

### Review Mode (per item)

```
Remove "<title>" (tier: <tier>)?

[y]es remove | [n]o keep | [v]iew content | [s]kip remaining
```

### Completion Report

```
CLEANUP COMPLETE
────────────────────────────────────────────────────
Removed: <N> memories
Kept:    <N> memories

STATUS=OK REMOVED=<N> KEPT=<N>
```

---

## 11. ⬆️ TIER PROMOTION MENU

**Trigger:** [p] from MEMORY DETAIL

```
CHANGE TIER: "<memory_title>"
────────────────────────────────────────────────────
Current: <tier> (confidence: <N>%)

Select new tier:
  [0] constitutional - Universal rules (~500 tokens max)
  [1] critical       - Architecture, core patterns
  [2] important      - Key implementations, bugs
  [3] normal         - General context
  [4] temporary      - Short-term, WIP
  [5] deprecated     - Mark as outdated

[b]ack to cancel
```

**Action:** Call `memory_update({ id, importanceTier: "<selected>" })`

---

## 12. 📌 QUICK REFERENCE

| Command                               | Result                         |
| ------------------------------------- | ------------------------------ |
| `/memory:search`                      | Dashboard                      |
| `/memory:search <query>`              | Search                         |
| `/memory:search cleanup`              | Cleanup mode (Gate 1 required) |
| `/memory:search triggers`             | Global triggers view           |
| `/memory:search <q> --tier:critical`  | Filtered search                |
| `/memory:search --concepts:a,b,c`     | AND search                     |

---

## 13. 🔗 RELATED COMMANDS

- `/memory/save` - Save current conversation context
- `/memory/checkpoint` - Create/restore memory state checkpoints

---

## 14. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`
