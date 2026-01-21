---
description: Memory database management - index, scan, cleanup, tier management, triggers, validation, delete, health
argument-hint: "[scan [--force]] | [cleanup] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <useful|not>] | [delete <id>] | [health]"
allowed-tools: Read, Bash, spec_kit_memory_memory_stats, spec_kit_memory_memory_list, spec_kit_memory_memory_search, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_validate, spec_kit_memory_memory_update, spec_kit_memory_memory_delete, spec_kit_memory_memory_health, spec_kit_memory_checkpoint_create, spec_kit_memory_checkpoint_restore
---

# 🚨 CONDITIONAL GATES - DESTRUCTIVE OPERATION ENFORCEMENT

**Gates apply to cleanup and delete modes only. All other modes pass through immediately.**

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

## 🔒 GATE 2: DELETE CONFIRMATION (Conditional)

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

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**Before proceeding, verify you have NOT:**
- [ ] Skipped confirmation for destructive operations (cleanup/delete)
- [ ] Proceeded without creating pre-cleanup checkpoint
- [ ] Used tools before completing mandatory phases

**If ANY violation:** STOP → State violation → Return to phase → Complete properly

---

# Memory Database Management Command

Manage the memory database: scan for new files, cleanup old memories, change tiers, edit triggers, validate usefulness, delete entries, and check health.

---

```yaml
role: Memory Database Administrator
purpose: Management interface for memory database maintenance operations
action: Route through scan, cleanup, tier, triggers, validate, delete, health based on arguments

operating_mode:
  workflow: interactive_management
  workflow_compliance: MANDATORY
  workflow_execution: single_letter_actions
  approvals: cleanup_and_delete_require_confirmation
  tracking: session_state
```

---

## 1. 🎯 PURPOSE

Provide a dedicated interface for memory database **management** operations: indexing new files, cleanup of old memories, tier management, trigger editing, validation feedback, deletion, and health checks.

**Separation from `/memory:search`:**
- `/memory:search` = READ-ONLY (browse, search, load)
- `/memory:database` = MANAGEMENT (modify, delete, maintain)

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Mode keyword with optional parameters
**Outputs:** `STATUS=<OK|FAIL>` with mode-specific output

### Argument Patterns

| Pattern                    | Mode        | Example                          |
| -------------------------- | ----------- | -------------------------------- |
| (empty)                    | Stats       | `/memory:database`                     |
| `scan`                     | Scan        | `/memory:database scan`                |
| `scan --force`             | Force Scan  | `/memory:database scan --force`        |
| `cleanup`                  | Cleanup     | `/memory:database cleanup`             |
| `tier <id> <tier>`         | Tier Change | `/memory:database tier 42 critical`    |
| `triggers <id>`            | Edit        | `/memory:database triggers 42`         |
| `validate <id> useful`     | Validate    | `/memory:database validate 42 useful`  |
| `validate <id> not`        | Validate    | `/memory:database validate 42 not`     |
| `delete <id>`              | Delete      | `/memory:database delete 42`           |
| `health`                   | Health      | `/memory:database health`              |

---

## 3. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)
    │   └─→ STATS DASHBOARD (Section 5)
    │
    ├─ "scan" or "scan --force"
    │   └─→ SCAN MODE (Section 6)
    │
    ├─ "cleanup"
    │   └─→ GATE 1 BLOCKED → CLEANUP MODE (Section 7)
    │
    ├─ "tier <id> <tier>"
    │   └─→ TIER MANAGEMENT (Section 8)
    │
    ├─ "triggers <id>"
    │   └─→ TRIGGER EDIT (Section 9)
    │
    ├─ "validate <id> <useful|not>"
    │   └─→ VALIDATE MODE (Section 10)
    │
    ├─ "delete <id>"
    │   └─→ GATE 2 BLOCKED → DELETE MODE (Section 11)
    │
    └─ "health"
        └─→ HEALTH CHECK (Section 12)
```

---

## 4. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each mode.

```
┌─────────────────┬─────────────────────────────────────────────────────────┬──────────┬─────────────────┐
│ MODE            │ REQUIRED CALLS                                          │ PATTERN  │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ STATS           │ memory_stats + memory_list                              │ PARALLEL │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ SCAN            │ memory_index_scan                                       │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ CLEANUP         │ memory_list → [confirm] → checkpoint_create → delete     │ SEQUENCE │ Abort operation │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TIER CHANGE     │ memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ TRIGGER EDIT    │ memory_update                                           │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ VALIDATION      │ memory_validate                                         │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ DELETE          │ memory_list → [confirm] → memory_delete                  │ SEQUENCE │ Abort operation │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ HEALTH          │ memory_health                                           │ SINGLE   │ Show error msg  │
└─────────────────┴─────────────────────────────────────────────────────────┴──────────┴─────────────────┘
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
spec_kit_memory_checkpoint_create({ name: "<name>", specFolder: "optional" })
spec_kit_memory_checkpoint_restore({ name: "<name>", clearExisting: <bool> })
```

---

## 5. 📊 STATS DASHBOARD (No Arguments)

**Trigger:** `/memory:database` with no arguments

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
│  [s]can | [c]leanup | [h]ealth | [q]uit                     │
╰─────────────────────────────────────────────────────────────╯

STATUS=OK
```

### Step 3: Handle Actions

| Input | Action                      |
| ----- | --------------------------- |
| s     | Go to SCAN MODE             |
| c     | Go to CLEANUP MODE (Gate 1) |
| h     | Go to HEALTH CHECK          |
| q     | Exit with STATUS=OK         |

---

## 6. 🔄 SCAN MODE

**Trigger:** `/memory:database scan` or `/memory:database scan --force`

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

Scanning: specs/045-auth-system/...
  ✓ Found: oauth-decisions.md

────────────────────────────────────────────────────
SCAN COMPLETE

New files indexed:     <N>
Files skipped:         <N>
Files updated:         <N>
Errors:                <N>

STATUS=OK INDEXED=<N> SKIPPED=<N> UPDATED=<N>
```

### Step 3: Handle Errors

```
If scan fails:
  STATUS=FAIL ERROR="<error_message>"
  
Common errors:
  - "Database locked" → Another process using the database
  - "Permission denied" → Cannot read memory files
  - "Invalid memory file" → File doesn't match expected format
```

---

## 7. 🧹 CLEANUP MODE

**Trigger:** `/memory:database cleanup`

**⚠️ GATE 1 MUST BE PASSED**

### Pre-Cleanup Safety

Before executing bulk delete:
1. Create automatic checkpoint: `checkpoint_create({ name: "pre-cleanup-{timestamp}" })`
   - Example: `pre-cleanup-2025-01-15T10-30-00`
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

| Input | Action                                    |
| ----- | ----------------------------------------- |
| a     | Create checkpoint, confirm, then delete all |
| r     | Step through: [y]es, [n]o, [v]iew, [s]kip |
| n     | Cancel, keep all                          |
| b     | Back to STATS DASHBOARD                   |
| q     | Exit                                      |

### Step 4: Completion

```
CLEANUP COMPLETE
────────────────────────────────────────────────────

Checkpoint created: pre-cleanup-2025-01-15T10-30-00

Removed: <N> memories | Kept: <N> memories

To undo this cleanup, run:
  /memory:checkpoint restore pre-cleanup-2025-01-15T10-30-00

STATUS=OK REMOVED=<N> KEPT=<N> CHECKPOINT=<name>
```

---

## 8. ⬆️ TIER MANAGEMENT

**Trigger:** `/memory:database tier <id> <tier>`

### Valid Tiers

| Tier           | Description                        |
| -------------- | ---------------------------------- |
| constitutional | Universal rules (~500 tokens max)  |
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

### Interactive Mode (from STATS dashboard)

If triggered from dashboard, show menu:

```
CHANGE TIER
────────────────────────────────────────────────────
Memory #<id>: "<title>"
Current tier: <tier>

Select new tier:
  [0] constitutional - Universal rules (~500 tokens max)
  [1] critical       - Architecture, core patterns
  [2] important      - Key implementations
  [3] normal         - General context
  [4] temporary      - Short-term, WIP
  [5] deprecated     - Mark as outdated

[b]ack to cancel
```

---

## 9. ✏️ TRIGGER EDIT

**Trigger:** `/memory:database triggers <id>`

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

## 10. ✓ VALIDATE MODE

**Trigger:** `/memory:database validate <id> useful` or `/memory:database validate <id> not`

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

## 11. 🗑️ DELETE MODE

**Trigger:** `/memory:database delete <id>`

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

## 12. 🏥 HEALTH CHECK

**Trigger:** `/memory:database health`

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
Total Memories:     <N>
Last Indexed:       <date>

CHECKS:
  ✓ Database accessible
  ✓ Embeddings valid
  ✓ No orphaned entries
  ✓ No duplicate IDs
  
WARNINGS:
  ⚠ <N> memories have no trigger phrases
  ⚠ <N> memories older than 90 days

RECOMMENDATIONS:
  • Run '/memory:database scan' to index new files
  • Consider cleanup for <N> deprecated memories

────────────────────────────────────────────────────
STATUS=OK HEALTH=<healthy|degraded|error>
```

---

## 13. 📌 QUICK REFERENCE

| Command                                | Result                |
| -------------------------------------- | --------------------- |
| `/memory:database`                     | Stats dashboard       |
| `/memory:database scan`                | Index new files       |
| `/memory:database scan --force`        | Re-index all files    |
| `/memory:database cleanup`             | Cleanup old memories  |
| `/memory:database tier 42 critical`    | Change tier           |
| `/memory:database triggers 42`         | Edit triggers         |
| `/memory:database validate 42 useful`  | Mark as useful        |
| `/memory:database validate 42 not`     | Mark as not useful    |
| `/memory:database delete 42`           | Delete memory         |
| `/memory:database health`              | System health check   |

---

## 14. ⚠️ ERROR HANDLING

| Condition              | Response                                      |
| ---------------------- | --------------------------------------------- |
| Memory ID not found    | `STATUS=FAIL ERROR="Memory #<id> not found"`  |
| Invalid tier           | `STATUS=FAIL ERROR="Invalid tier: <tier>"`    |
| Database locked        | `STATUS=FAIL ERROR="Database locked"`         |
| Permission denied      | `STATUS=FAIL ERROR="Cannot access database"`  |
| Scan failed            | `STATUS=FAIL ERROR="Scan failed: <reason>"`   |

---

## 15. 🔗 RELATED COMMANDS

- `/memory:search` - Browse and search memories (read-only)
- `/memory:save` - Save current conversation context
- `/memory:checkpoint` - Create/restore memory state checkpoints

---

## 16. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`
