---
description: Manage memory database - stats, scan, cleanup, tier, triggers, validate, delete, health, and checkpoint operations
argument-hint: "[scan [--force]] | [cleanup] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <useful|not>] | [delete <id>] | [health] | [checkpoint <subcommand>]"
allowed-tools: Read, Bash, spec_kit_memory_memory_stats, spec_kit_memory_memory_list, spec_kit_memory_memory_search, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_validate, spec_kit_memory_memory_update, spec_kit_memory_memory_delete, spec_kit_memory_memory_health, spec_kit_memory_checkpoint_create, spec_kit_memory_checkpoint_restore, spec_kit_memory_checkpoint_list, spec_kit_memory_checkpoint_delete
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

## Argument Parsing Gate

**STATUS: ☐ BLOCKED** (until argument is parsed)

```
BEFORE executing ANY workflow:

1. PARSE $ARGUMENTS to determine mode
2. VALIDATE mode is recognized (stats, scan, cleanup, tier, triggers, validate, delete, health, checkpoint)
   - IF $ARGUMENTS is empty → mode = "stats" (default)
3. For modes requiring <id>: VERIFY id is provided and numeric
4. For modes requiring <name>: VERIFY name is provided

IF mode unrecognized:
  → STATUS=FAIL ERROR="Unknown mode: <mode>. Valid: scan, cleanup, tier, triggers, validate, delete, health, checkpoint"

IF required parameter missing:
  → STATUS=FAIL ERROR="Missing required parameter for <mode>"
```

### 4 CRITICAL RULES

1. **PARSE** - Extract mode and parameters from `$ARGUMENTS`
2. **VALIDATE** - Confirm mode exists and parameters are complete
3. **ERROR IF INVALID** - Return `STATUS=FAIL` with specific error message
4. **NEVER ASSUME** - Do not invent, guess, or hallucinate missing parameters

---

## Conditional Gates for Destructive Operations

**Gates apply to cleanup and delete modes only. All other modes pass through immediately.**

---

### 🔒 GATE 1: CLEANUP CONFIRMATION (Conditional)

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

### 🔒 GATE 2: DELETE CONFIRMATION (Conditional)

**STATUS: ⏭️ N/A** (default for non-delete modes)

```
EXECUTE THIS CHECK:

├─ IF $ARGUMENTS does NOT contain "delete":
│   └─ SET STATUS: ⏭️ N/A → Proceed directly to workflow
│
└─ IF $ARGUMENTS contains "delete <id>":
    │
    ├─ SET STATUS: ☐ BLOCKED
    │
    ├─ RETRIEVE memory details:
    │   spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
    │   → Find memory with matching ID
    │
    ├─ IF ID not found:
    │   └─ STATUS=FAIL ERROR="Memory #<id> not found"
    │
    ├─ IF tier is constitutional OR critical:
    │   ├─ Display: "⚠️ WARNING: This is a <tier> memory. Deletion requires explicit confirmation."
    │   ├─ Show memory title, spec folder, creation date
    │   └─ Ask: "Type 'DELETE <title>' to confirm, or [b]ack to cancel"
    │
    └─ IF tier is other:
        ├─ Display memory details
        ├─ Ask: "Delete this memory? [y]es | [n]o"
        └─ SET STATUS: ✅ PASSED on [y] → Proceed to deletion

⛔ HARD STOP: DO NOT delete any memory until user explicitly confirms
```

---

### 🔒 GATE 3: CHECKPOINT RESTORE CONFIRMATION (Conditional)

**STATUS: ⏭️ N/A** (default for non-restore modes)

```
EXECUTE THIS CHECK:

├─ IF $ARGUMENTS does NOT contain "checkpoint restore":
│   └─ SET STATUS: ⏭️ N/A → Proceed directly to workflow
│
└─ IF $ARGUMENTS contains "checkpoint restore <name>":
    │
    ├─ SET STATUS: ☐ BLOCKED
    │
    ├─ RETRIEVE checkpoint details:
    │   spec_kit_memory_checkpoint_list({})
    │   → Find checkpoint with matching name
    │
    ├─ IF checkpoint not found:
    │   └─ STATUS=FAIL ERROR="Checkpoint '<name>' not found"
    │
    ├─ Show diff summary:
    │   ├─ "Restoring checkpoint '<name>'"
    │   ├─ "Changes detected: X memories added since checkpoint (will be removed)"
    │   └─ "Confirm? [y]es, [n]o, [v]iew diff"
    │
    └─ WAIT for user selection
        └─ SET STATUS: ✅ PASSED on [y] → Proceed to restore

⛔ HARD STOP: DO NOT restore checkpoint until user explicitly confirms
```

---

### ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**Before proceeding, verify you have NOT:**
- [ ] Skipped confirmation for destructive operations (cleanup/delete/restore)
- [ ] Proceeded without creating pre-cleanup checkpoint
- [ ] Used tools before completing mandatory phases

**If ANY violation:** STOP → State violation → Return to phase → Complete properly

---

# Memory Management Command

Unified management interface for the memory database: scan for new files, cleanup old memories, change tiers, edit triggers, validate usefulness, delete entries, check health, and manage checkpoints.

---

```yaml
role: Memory Database Administrator
purpose: Unified management interface for memory database maintenance and checkpoint operations
action: Route through scan, cleanup, tier, triggers, validate, delete, health, checkpoint based on arguments

operating_mode:
  workflow: interactive_management
  workflow_compliance: MANDATORY
  workflow_execution: single_letter_actions
  approvals: cleanup_delete_restore_require_confirmation
  tracking: session_state
```

---

## 1. 🎯 PURPOSE

Provide a unified interface for memory database **management** operations:
- Indexing new files and scanning for updates
- Cleanup of old or deprecated memories
- Tier management and trigger editing
- Validation feedback and deletion
- Health checks and diagnostics
- Checkpoint creation, restoration, listing, and deletion

**Separation from `/memory:context`:**
- `/memory:context` = RETRIEVAL (intent-aware search and load)
- `/memory:manage` = MANAGEMENT (modify, delete, maintain, checkpoint)

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Mode keyword with optional parameters
**Outputs:** `STATUS=<OK|FAIL>` with mode-specific output

### Argument Patterns

| Pattern                     | Mode              | Example                                             |
| --------------------------- | ----------------- | --------------------------------------------------- |
| (empty)                     | Stats             | `/memory:manage`                                    |
| `scan`                      | Scan              | `/memory:manage scan`                               |
| `scan --force`              | Force Scan        | `/memory:manage scan --force`                       |
| `cleanup`                   | Cleanup           | `/memory:manage cleanup`                            |
| `tier <id> <tier>`          | Tier Change       | `/memory:manage tier 42 critical`                   |
| `triggers <id>`             | Edit Triggers     | `/memory:manage triggers 42`                        |
| `validate <id> useful`      | Validate          | `/memory:manage validate 42 useful`                 |
| `validate <id> not`         | Validate          | `/memory:manage validate 42 not`                    |
| `delete <id>`               | Delete            | `/memory:manage delete 42`                          |
| `health`                    | Health            | `/memory:manage health`                             |
| `checkpoint create <name>`  | Create Checkpoint | `/memory:manage checkpoint create before-refactor`  |
| `checkpoint restore <name>` | Restore           | `/memory:manage checkpoint restore before-refactor` |
| `checkpoint list`           | List Checkpoints  | `/memory:manage checkpoint list`                    |
| `checkpoint delete <name>`  | Delete Checkpoint | `/memory:manage checkpoint delete old-checkpoint`   |

---

## 3. 📊 SCHEMA OVERVIEW (v9)

The memory database uses SQLite with the following core tables:

### Core Tables

| Table                | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `memories`           | Primary memory storage with embeddings    |
| `causal_edges`       | Relationship graph between memories       |
| `memory_corrections` | User feedback and correction history      |
| `session_state`      | Active session tracking and deduplication |
| `checkpoints`        | Named snapshots for backup/restore        |

### Memory Columns (v9 Schema)

| Column             | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `id`               | INTEGER  | Primary key                                       |
| `content`          | TEXT     | Full memory content                               |
| `embedding`        | BLOB     | Vector embedding for semantic search              |
| `memory_type`      | TEXT     | Classification (see types below)                  |
| `importance_tier`  | TEXT     | constitutional, critical, important, normal, etc. |
| `half_life_days`   | REAL     | Decay rate for memory freshness                   |
| `access_count`     | INTEGER  | Number of times memory was retrieved              |
| `last_accessed_at` | DATETIME | Timestamp of last retrieval                       |
| `is_archived`      | BOOLEAN  | Whether memory is archived                        |
| `archived_at`      | DATETIME | When memory was archived (NULL if active)         |
| `spec_folder`      | TEXT     | Associated spec folder path                       |
| `trigger_phrases`  | TEXT     | JSON array of trigger phrases                     |
| `created_at`       | DATETIME | Creation timestamp                                |
| `updated_at`       | DATETIME | Last modification timestamp                       |

### Importance Tiers

| Tier           | Description                        |
| -------------- | ---------------------------------- |
| constitutional | Universal rules (~2000 tokens max) |
| critical       | Architecture, core patterns        |
| important      | Key implementations                |
| normal         | General context                    |
| temporary      | Short-term, WIP                    |
| deprecated     | Mark as outdated                   |

---

## 4. ⚡ ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)
    │   └─→ STATS DASHBOARD (Section 6)
    │
    ├─ "scan" or "scan --force"
    │   └─→ SCAN MODE (Section 7)
    │
    ├─ "cleanup"
    │   └─→ GATE 1 BLOCKED → CLEANUP MODE (Section 8)
    │
    ├─ "tier <id> <tier>"
    │   └─→ TIER MANAGEMENT (Section 9)
    │
    ├─ "triggers <id>"
    │   └─→ TRIGGER EDIT (Section 10)
    │
    ├─ "validate <id> <useful|not>"
    │   └─→ VALIDATE MODE (Section 11)
    │
    ├─ "delete <id>"
    │   └─→ GATE 2 BLOCKED → DELETE MODE (Section 12)
    │
    ├─ "health"
    │   └─→ HEALTH CHECK (Section 13)
    │
    └─ "checkpoint <subcommand>"
        ├─ "checkpoint create <name>"
        │   └─→ CHECKPOINT CREATE (Section 14)
        ├─ "checkpoint restore <name>"
        │   └─→ GATE 3 BLOCKED → CHECKPOINT RESTORE (Section 14)
        ├─ "checkpoint list"
        │   └─→ CHECKPOINT LIST (Section 14)
        └─ "checkpoint delete <name>"
            └─→ CHECKPOINT DELETE (Section 14)
```

---

## 5. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each mode.

```
┌─────────────────────┬─────────────────────────────────────────────────────────────────────────┬──────────┬─────────────────┐
│ MODE                │ REQUIRED CALLS                                                          │ PATTERN  │ ON FAILURE      │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ STATS               │ spec_kit_memory_memory_stats + spec_kit_memory_memory_list              │ PARALLEL │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ SCAN                │ spec_kit_memory_memory_index_scan                                       │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CLEANUP             │ spec_kit_memory_memory_list → [confirm] → checkpoint_create → delete    │ SEQUENCE │ Abort operation │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TIER CHANGE         │ spec_kit_memory_memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TRIGGER EDIT        │ spec_kit_memory_memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ VALIDATION          │ spec_kit_memory_memory_validate                                         │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DELETE              │ spec_kit_memory_memory_list → [confirm] → spec_kit_memory_memory_delete │ SEQUENCE │ Abort operation │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ HEALTH              │ spec_kit_memory_memory_health                                           │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CHECKPOINT CREATE   │ spec_kit_memory_checkpoint_create                                       │ SINGLE   │ Show error msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CHECKPOINT RESTORE  │ spec_kit_memory_checkpoint_list → [confirm] → snapshot → checkpoint_restore │ SEQUENCE │ Rollback+abort  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CHECKPOINT LIST     │ spec_kit_memory_checkpoint_list                                         │ SINGLE   │ Show empty msg  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CHECKPOINT DELETE   │ spec_kit_memory_checkpoint_delete                                       │ SINGLE   │ Show error msg  │
└─────────────────────┴─────────────────────────────────────────────────────────────────────────┴──────────┴─────────────────┘
```

### MCP Tool Signatures

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
spec_kit_memory_memory_search({ query: "<q>", limit: N, specFolder: "optional" })
spec_kit_memory_memory_index_scan({ force: <bool>, specFolder: "optional" })
spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })
spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>", triggerPhrases: [...] })
spec_kit_memory_memory_delete({ id: <id> })
spec_kit_memory_memory_health({})
spec_kit_memory_checkpoint_create({ name: "<name>", specFolder: "optional", metadata: {...} })
spec_kit_memory_checkpoint_restore({ name: "<name>", clearExisting: <bool> })
spec_kit_memory_checkpoint_list({ limit: 50, specFolder: "optional" })
spec_kit_memory_checkpoint_delete({ name: "<name>" })
```

---

## 6. 📊 STATS DASHBOARD (No Arguments)

**Trigger:** `/memory:manage` with no arguments

### Step 1: Gather Data (Parallel)

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: 10, sortBy: "updated_at" })
```

### Step 2: Display Stats Dashboard

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DATABASE STATS                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Memories: <N>                                        │
│  Database Size:  <size>                                     │
│  Last Indexed:   <date>                                     │
│                                                             │
│  BY TIER:                                                   │
│    ★ constitutional: <N>                                    │
│    ◆ critical:       <N>                                    │
│    ◇ important:      <N>                                    │
│    ○ normal:         <N>                                    │
│    ◌ temporary:      <N>                                    │
│    ✗ deprecated:     <N>                                    │
│                                                             │
│  TOP SPEC FOLDERS:                                          │
│    <folder-1>: <N> memories                                 │
│    <folder-2>: <N> memories                                 │
│    <folder-3>: <N> memories                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [s]can | [c]leanup | [h]ealth | [p]oint (checkpoint) | [q] │
╰─────────────────────────────────────────────────────────────╯

STATUS=OK
```

### Step 3: Handle Actions

| Input | Action                      |
| ----- | --------------------------- |
| s     | Go to SCAN MODE             |
| c     | Go to CLEANUP MODE (Gate 1) |
| h     | Go to HEALTH CHECK          |
| p     | Go to CHECKPOINT submenu    |
| q     | Exit with STATUS=OK         |

---

## 7. 🔄 SCAN MODE

**Trigger:** `/memory:manage scan` or `/memory:manage scan --force`

### Incremental Indexing

The scan system uses **incremental indexing** by default:

| Scan Type | Behavior                               | Use When                         |
| --------- | -------------------------------------- | -------------------------------- |
| Normal    | Skip files with unchanged content hash | Regular maintenance              |
| Force     | Re-index all files regardless of hash  | After schema changes, corruption |

### Step 1: Execute Scan

```javascript
// Normal scan (skip unchanged files)
spec_kit_memory_memory_index_scan({ force: false })

// Force scan (re-index all files)
spec_kit_memory_memory_index_scan({ force: true })
```

### Step 2: Display Progress

```
SCANNING MEMORY FILES...
────────────────────────────────────────────────────

Mode: <normal|force>

Scanning: specs/003-memory-and-spec-kit/...
  ✓ Found: session-context-2025-01-15.md
  ✓ Found: implementation-summary.md
  ○ Skipped: unchanged-file.md (hash match)

────────────────────────────────────────────────────
SCAN COMPLETE

New files indexed:     <N>
Files skipped:         <N>
Files updated:         <N>
Errors:                <N>

STATUS=OK INDEXED=<N> SKIPPED=<N> UPDATED=<N>
```

---

## 8. 🧹 CLEANUP MODE

**Trigger:** `/memory:manage cleanup`

**⚠️ GATE 1 MUST BE PASSED**

### Pre-Cleanup Safety

Before executing bulk delete:
1. Create automatic checkpoint: `checkpoint_create({ name: "pre-cleanup-{timestamp}" })`
2. Inform user of checkpoint name in output
3. Proceed with deletion after user confirmation
4. Provide restore instructions in output

### Step 1: Identify Candidates

```javascript
spec_kit_memory_memory_list({ limit: 50, sortBy: "created_at" })
```

Filter by tier eligibility:
- `deprecated` → Always include
- `temporary` → Include if >7 days old
- `normal` → Include if >90 days old AND <3 accesses
- `important/critical/constitutional` → PROTECTED (never include)

### Step 2: Display Candidates

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

### Step 3: Handle Actions

| Input | Action                                      |
| ----- | ------------------------------------------- |
| a     | Create checkpoint, confirm, then delete all |
| r     | Step through: [y]es, [n]o, [v]iew, [s]kip   |
| n     | Cancel, keep all                            |
| b     | Back to STATS DASHBOARD                     |
| q     | Exit                                        |

### Step 4: Completion

```
CLEANUP COMPLETE
────────────────────────────────────────────────────

Checkpoint created: pre-cleanup-2025-01-15T10-30-00

Removed: <N> memories | Kept: <N> memories

To undo this cleanup, run:
  /memory:manage checkpoint restore pre-cleanup-2025-01-15T10-30-00

STATUS=OK REMOVED=<N> KEPT=<N> CHECKPOINT=<name>
```

---

## 9. ⬆️ TIER MANAGEMENT

**Trigger:** `/memory:manage tier <id> <tier>`

### Valid Tiers

| Tier           | Description                        |
| -------------- | ---------------------------------- |
| constitutional | Universal rules (~2000 tokens max) |
| critical       | Architecture, core patterns        |
| important      | Key implementations                |
| normal         | General context                    |
| temporary      | Short-term, WIP                    |
| deprecated     | Mark as outdated                   |

### Step 1: Validate Input

```
IF tier not in valid list:
  STATUS=FAIL ERROR="Invalid tier. Valid: constitutional, critical, important, normal, temporary, deprecated"

IF id not found:
  STATUS=FAIL ERROR="Memory #<id> not found"
```

### Step 2: Execute Change

```javascript
spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>" })
```

### Step 3: Confirmation

```
TIER CHANGED
────────────────────────────────────────────────────

Memory #<id>: "<title>"
Old tier: <old_tier>
New tier: <new_tier>

STATUS=OK ID=<id> TIER=<tier>
```

---

## 10. ✏️ TRIGGER EDIT

**Trigger:** `/memory:manage triggers <id>`

### Step 1: Load Current Triggers

```javascript
spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
// Find memory with matching ID, extract triggerPhrases
```

### Step 2: Display Edit Interface

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

### Step 3: Handle Actions

| Input | Action                                     |
| ----- | ------------------------------------------ |
| a     | Prompt for new trigger phrase              |
| r     | Prompt for number to remove                |
| s     | `memory_update({ triggerPhrases: [...] })` |
| b     | Back (discard changes)                     |

### Step 4: Save Confirmation

```
TRIGGERS UPDATED
────────────────────────────────────────────────────

Memory #<id>: "<title>"

New triggers:
  1) oauth
  2) token refresh
  3) callback url
  4) jwt decode
  5) authentication flow  ← NEW

STATUS=OK ID=<id> TRIGGERS=<N>
```

---

## 11. ✅ VALIDATE MODE

**Trigger:** `/memory:manage validate <id> useful` or `/memory:manage validate <id> not`

### Step 1: Parse Action

```
"useful" → wasUseful: true
"not"    → wasUseful: false
```

### Step 2: Execute Validation

```javascript
spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })
```

### Step 3: Confirmation

```
VALIDATION RECORDED
────────────────────────────────────────────────────

Memory #<id>: "<title>"
Feedback: <useful|not useful>

Confidence updated: <old>% → <new>%

STATUS=OK ID=<id> USEFUL=<true|false>
```

---

## 12. 🗑️ DELETE MODE

**Trigger:** `/memory:manage delete <id>`

**⚠️ GATE 2 MUST BE PASSED**

### Step 1: Retrieve Memory Details

```javascript
spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
// Find memory with matching ID
```

### Step 2: Display Confirmation

For protected tiers (constitutional, critical):
```
⚠️ WARNING: PROTECTED MEMORY
────────────────────────────────────────────────────

Memory #<id>: "<title>"
Tier:        <constitutional|critical>
Spec Folder: <folder>
Created:     <date>

This memory is marked as <tier>. Deletion is irreversible.

Type 'DELETE <title>' to confirm, or [b]ack to cancel:
```

For other tiers:
```
DELETE MEMORY
────────────────────────────────────────────────────

Memory #<id>: "<title>"
Tier:        <tier>
Spec Folder: <folder>
Created:     <date>

────────────────────────────────────────────────────
Delete this memory? [y]es | [n]o
```

### Step 3: Execute Deletion

```javascript
spec_kit_memory_memory_delete({ id: <id> })
```

### Step 4: Confirmation

```
MEMORY DELETED
────────────────────────────────────────────────────

Removed: #<id> "<title>"

STATUS=OK DELETED=<id>
```

---

## 13. 🏥 HEALTH CHECK

**Trigger:** `/memory:manage health`

### Step 1: Execute Health Check

```javascript
spec_kit_memory_memory_health({})
```

### Step 2: Display Report

```
MEMORY SYSTEM HEALTH
────────────────────────────────────────────────────

Database Status:    ✓ Healthy
Database Size:      <size>
Schema Version:     v9
Total Memories:     <N>
Last Indexed:       <date>

SCHEMA VALIDATION:
  ✓ memories table present with all v9 columns
  ✓ causal_edges table present (relationships enabled)
  ✓ memory_corrections table present
  ✓ session_state table present
  ✓ checkpoints table present

CORE CHECKS:
  ✓ Database accessible
  ✓ Embeddings valid
  ✓ No orphaned entries
  ✓ No duplicate IDs

WARNINGS:
  ⚠ <N> memories have no trigger phrases
  ⚠ <N> memories older than 90 days

RECOMMENDATIONS:
  • Run '/memory:manage scan' to index new files
  • Consider cleanup for <N> deprecated memories

────────────────────────────────────────────────────
STATUS=OK HEALTH=<healthy|degraded|error> SCHEMA=v9
```

---

## 14. 📸 CHECKPOINT OPERATIONS

### Checkpoint Create

**Trigger:** `/memory:manage checkpoint create <name>`

```javascript
spec_kit_memory_checkpoint_create({
  name: "<checkpoint_name>",
  specFolder: "<folder>",  // Optional: limit to specific folder
  metadata: { ... }        // Optional: additional context
})
```

**Output:**
```
✅ Checkpoint Created

   Name: before-refactor
   Memories captured: 47
   Spec folders: 5

STATUS=OK CHECKPOINT=before-refactor ACTION=create
```

**Limits:**
- Max 10 checkpoints allowed
- Auto-cleanup: checkpoints older than 30 days

---

### Checkpoint Restore

**Trigger:** `/memory:manage checkpoint restore <name>`

**⚠️ GATE 3 MUST BE PASSED**

### Checkpoint Restore Workflow

```
CHECKPOINT RESTORE WORKFLOW:
1. Verify checkpoint exists
2. Create pre-restore snapshot (for rollback if restore fails)
3. Begin restore operation
4. IF restore fails mid-operation:
   - Attempt rollback to pre-restore snapshot
   - Report failure with rollback status
5. IF restore succeeds:
   - Clean up pre-restore snapshot
   - Confirm success

ON FAILURE: "Restore failed. Database rolled back to state before restore attempt."
```

### Implementation Steps

**Step 1: Verify checkpoint exists**
```javascript
spec_kit_memory_checkpoint_list({})
// Confirm target checkpoint exists before proceeding
```

**Step 2: Create pre-restore snapshot**
```javascript
spec_kit_memory_checkpoint_create({
  name: "pre-restore-{timestamp}",
  metadata: { type: "rollback-snapshot", targetRestore: "<checkpoint_name>" }
})
```

**Step 3: Execute restore**
```javascript
spec_kit_memory_checkpoint_restore({
  name: "<checkpoint_name>",
  clearExisting: false  // Set true to wipe current state first
})
```

**Step 4: Handle result**
```
IF restore succeeds:
  - Delete pre-restore snapshot: checkpoint_delete({ name: "pre-restore-{timestamp}" })
  - Show success output

IF restore fails:
  - Attempt rollback: checkpoint_restore({ name: "pre-restore-{timestamp}" })
  - Delete pre-restore snapshot after rollback
  - Show failure with rollback status
```

**Output (Success):**
```
✅ Checkpoint Restored

   Name: before-refactor
   Memories removed: 12
   Memories marked for recovery: 3

STATUS=OK CHECKPOINT=before-refactor ACTION=restore
```

**Output (Failure with Rollback):**
```
❌ Checkpoint Restore Failed

   Target: before-refactor
   Error: <reason>
   Rollback: ✓ Successful - Database rolled back to state before restore attempt

STATUS=FAIL CHECKPOINT=before-refactor ACTION=restore ROLLBACK=success
```

**Output (Failure with Rollback Failed):**
```
❌ Checkpoint Restore Failed

   Target: before-refactor
   Error: <reason>
   Rollback: ✗ Failed - Manual intervention required

   Recovery: Pre-restore snapshot available as 'pre-restore-{timestamp}'
   Run: /memory:manage checkpoint restore "pre-restore-{timestamp}"

STATUS=FAIL CHECKPOINT=before-refactor ACTION=restore ROLLBACK=failed
```

**Caution:**
- Default (`clearExisting=false`): Marks existing memories as `deprecated`
- `clearExisting=true`: Deletes existing memories before restore
- Always run `memory_index_scan` after restore to regenerate embeddings
- Pre-restore snapshots are automatically cleaned up on success

---

### Checkpoint List

**Trigger:** `/memory:manage checkpoint list`

```javascript
spec_kit_memory_checkpoint_list({
  limit: 50,
  specFolder: "<folder>"  // Optional: filter by folder
})
```

**Output:**
```
Available Checkpoints

| Name            | Created         | Memories | Size    |
| --------------- | --------------- | -------- | ------- |
| before-refactor | Dec 8, 10:30 AM | 47       | 12.4 KB |
| feature-auth    | Dec 7, 3:15 PM  | 42       | 10.8 KB |
| initial-state   | Dec 5, 9:00 AM  | 35       | 8.2 KB  |

Total: 3 checkpoints (31.4 KB)

STATUS=OK ACTION=list
```

---

### Checkpoint Delete

**Trigger:** `/memory:manage checkpoint delete <name>`

```javascript
spec_kit_memory_checkpoint_delete({
  name: "<checkpoint_name>"
})
```

**Confirmation Required:**
```
Delete checkpoint 'old-checkpoint'?

   Created: Dec 5, 9:00 AM
   Memories: 35
   Size: 8.2 KB

This action is permanent. Confirm? [y]es, [n]o
```

**Output:**
```
✅ Checkpoint Deleted

   Name: old-checkpoint

STATUS=OK CHECKPOINT=old-checkpoint ACTION=delete
```

---

## 15. 🔍 USE CASES

### Before Major Refactors
```
User: Create a checkpoint before I start the auth refactor
AI: /memory:manage checkpoint create "pre-auth-refactor"
    ✅ Checkpoint 'pre-auth-refactor' created (47 memories)

[... work happens, things go wrong ...]

User: Restore to before the refactor
AI: /memory:manage checkpoint restore "pre-auth-refactor"
```

### Context Switching Between Features
```
User: I need to switch to the billing feature for a bit
AI: /memory:manage checkpoint create "auth-wip"

[... work on billing ...]

User: Back to auth work, restore my context
AI: /memory:manage checkpoint restore "auth-wip"
```

### Cleanup and Maintenance
```
User: Let's clean up old memories
AI: /memory:manage cleanup
    → Shows candidates, creates pre-cleanup checkpoint
    → Removes deprecated/old memories
    → Provides restore instructions
```

---

## 16. 🔍 QUICK REFERENCE

| Command                                    | Result                 |
| ------------------------------------------ | ---------------------- |
| `/memory:manage`                           | Stats dashboard        |
| `/memory:manage scan`                      | Index new files        |
| `/memory:manage scan --force`              | Re-index all files     |
| `/memory:manage cleanup`                   | Cleanup old memories   |
| `/memory:manage tier 42 critical`          | Change tier            |
| `/memory:manage triggers 42`               | Edit triggers          |
| `/memory:manage validate 42 useful`        | Mark as useful         |
| `/memory:manage validate 42 not`           | Mark as not useful     |
| `/memory:manage delete 42`                 | Delete memory          |
| `/memory:manage health`                    | System health check    |
| `/memory:manage checkpoint create "name"`  | Save memory state      |
| `/memory:manage checkpoint restore "name"` | Restore to saved state |
| `/memory:manage checkpoint list`           | Show all checkpoints   |
| `/memory:manage checkpoint delete "name"`  | Remove checkpoint      |

---

## 17. ⚠️ ERROR HANDLING

| Condition               | Response                                     |
| ----------------------- | -------------------------------------------- |
| Memory ID not found     | `STATUS=FAIL ERROR="Memory #<id> not found"` |
| Invalid tier            | `STATUS=FAIL ERROR="Invalid tier: <tier>"`   |
| Database locked         | `STATUS=FAIL ERROR="Database locked"`        |
| Permission denied       | `STATUS=FAIL ERROR="Cannot access database"` |
| Scan failed             | `STATUS=FAIL ERROR="Scan failed: <reason>"`  |
| Checkpoint not found    | `STATUS=FAIL ERROR="Checkpoint not found"`   |
| Max checkpoints reached | Auto-delete oldest, warn user                |

---

## 18. 🔗 RELATED COMMANDS

- `/memory:context` - Intent-aware context retrieval (read-only)
- `/memory:save` - Save current conversation context
- `/memory:continue` - Resume session using CONTINUE_SESSION.md
- `/memory:learn` - Capture explicit learnings

---

## 19. 📌 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`

---

## 20. 🏛️ CONSTITUTIONAL TIER HANDLING

**IMPORTANT:** Constitutional tier memories receive special treatment:

### Cleanup
- Constitutional memories are NEVER included in cleanup candidates
- Always protected regardless of age or access count

### Delete
- Requires typing 'DELETE <title>' to confirm
- Extra warning about irreversibility

### Checkpoint Restore
- Constitutional memories from checkpoint are restored normally
- Warning: Constitutional memories added AFTER checkpoint will be removed

### Best Practice
Before restoring a checkpoint that predates constitutional memory additions:
1. Review current constitutional memories
2. Note any that should be preserved
3. After restore, manually re-promote critical rules if needed