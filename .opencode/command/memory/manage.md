---
description: Manage memory database - stats, scan, cleanup, tier, triggers, validate, delete, health, and checkpoint operations
argument-hint: "[scan [--force]] | [cleanup] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <useful|not>] | [delete <id>] | [health] | [checkpoint <subcommand>]"
allowed-tools: Read, Bash, spec_kit_memory_memory_stats, spec_kit_memory_memory_list, spec_kit_memory_memory_search, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_validate, spec_kit_memory_memory_update, spec_kit_memory_memory_delete, spec_kit_memory_memory_health, spec_kit_memory_checkpoint_create, spec_kit_memory_checkpoint_restore, spec_kit_memory_checkpoint_list, spec_kit_memory_checkpoint_delete
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

---

## 1. ARGUMENT PARSING GATE

**STATUS: BLOCKED** (until argument is parsed)

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

---

## 2. CONDITIONAL GATES FOR INTERACTIVE/DESTRUCTIVE OPERATIONS

**Gates apply to scan, cleanup, delete, and checkpoint restore modes. Other modes pass through immediately.**

### GATE 1: CLEANUP CONFIRMATION

**STATUS: N/A** (default for non-cleanup modes)

If `$ARGUMENTS` contains "cleanup":
1. SET STATUS: BLOCKED
2. Execute `memory_list({ limit: 50, sortBy: "created_at" })`
3. Filter by tier eligibility:
   - `deprecated` → Always include
   - `temporary` → Include if >7 days old
   - `normal` → Include if >90 days old AND <3 accesses
   - `important/critical/constitutional` → PROTECTED (never include)
4. If no candidates: Display "No cleanup candidates found" → Exit
5. If candidates found: Display with `[a]ll | [r]eview | [n]one | [b]ack` options
6. **WAIT for user selection** before proceeding

HARD STOP: DO NOT delete any memories until user explicitly chooses [a]ll or [y]es per item

### GATE 2: DELETE CONFIRMATION

**STATUS: N/A** (default for non-delete modes)

If `$ARGUMENTS` contains "delete `<id>`":
1. SET STATUS: BLOCKED
2. Retrieve memory details via `memory_list`
3. If ID not found → `STATUS=FAIL ERROR="Memory #<id> not found"`
4. If tier is `constitutional` or `critical`:
   - Show warning, require typing `DELETE <title>` to confirm
5. If other tier: Ask `[y]es | [n]o`

HARD STOP: DO NOT delete any memory until user explicitly confirms

### GATE 3: CHECKPOINT RESTORE CONFIRMATION

**STATUS: N/A** (default for non-restore modes)

If `$ARGUMENTS` contains "checkpoint restore `<name>`":
1. SET STATUS: BLOCKED
2. Verify checkpoint exists via `checkpoint_list`
3. If not found → `STATUS=FAIL ERROR="Checkpoint '<name>' not found"`
4. Show diff summary: memories added since checkpoint (will be removed)
5. Ask: `[y]es | [n]o | [v]iew diff`

HARD STOP: DO NOT restore checkpoint until user explicitly confirms

### GATE 4: SCAN SOURCE CONFIRMATION

**STATUS: N/A** (default for non-scan modes)

If `$ARGUMENTS` contains `scan`:
1. SET STATUS: BLOCKED
2. Ask user source scope for this run:
   - `[a]ll` → include skill references (`includeSkillRefs: true`) **(default)**
   - `[c]ore` → exclude skill references (`includeSkillRefs: false`)
   - `[b]ack` → cancel and return to dashboard
3. **WAIT for user selection** before calling `memory_index_scan`

HARD STOP: DO NOT execute scan until user selects source scope for this run

---

# Memory Management Command

Unified management interface for the memory database: scan for new files, cleanup old memories, change tiers, edit triggers, validate usefulness, delete entries, check health, and manage checkpoints.

```yaml
role: Memory Database Administrator
purpose: Unified management interface for memory database maintenance and checkpoint operations
action: Route through scan, cleanup, tier, triggers, validate, delete, health, checkpoint based on arguments
operating_mode:
  workflow: interactive_management
  approvals: cleanup_delete_restore_require_confirmation
```

---

## 3. PURPOSE

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

## 4. CONTRACT

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

## 5. ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Empty (no args)       → STATS DASHBOARD (Section 5)
    ├─ "scan [--force]"      → GATE 4 → SCAN MODE (Section 8)
    ├─ "cleanup"             → GATE 1 → CLEANUP MODE (Section 7)
    ├─ "tier <id> <tier>"    → TIER MANAGEMENT (Section 8)
    ├─ "triggers <id>"       → TRIGGER EDIT (Section 9)
    ├─ "validate <id> <u|n>" → VALIDATE MODE (Section 10)
    ├─ "delete <id>"         → GATE 2 → DELETE MODE (Section 11)
    ├─ "health"              → HEALTH CHECK (Section 12)
    └─ "checkpoint <sub>"    → CHECKPOINT OPS (Section 13)
        ├─ "create <name>"   → Create snapshot
        ├─ "restore <name>"  → GATE 3 → Restore
        ├─ "list"            → List snapshots
        └─ "delete <name>"   → Delete snapshot
```

---

## 6. MCP ENFORCEMENT MATRIX

| MODE               | REQUIRED CALLS                                                             | PATTERN  | ON FAILURE      |
| ------------------ | -------------------------------------------------------------------------- | -------- | --------------- |
| STATS              | `memory_stats()` + `memory_list()`                                         | PARALLEL | Show error msg  |
| SCAN               | `GATE 4` → `memory_index_scan()`                                           | SEQUENCE | Show error msg  |
| CLEANUP            | `memory_list()` → [confirm] → `checkpoint_create()` → `memory_delete()`   | SEQUENCE | Abort operation |
| TIER CHANGE        | `memory_update()`                                                          | SINGLE   | Show error msg  |
| TRIGGER EDIT       | `memory_update()`                                                          | SINGLE   | Show error msg  |
| VALIDATION         | `memory_validate()`                                                        | SINGLE   | Show error msg  |
| DELETE             | `memory_list()` → [confirm] → `memory_delete()`                           | SEQUENCE | Abort operation |
| HEALTH             | `memory_health()`                                                          | SINGLE   | Show error msg  |
| CHECKPOINT CREATE  | `checkpoint_create()`                                                      | SINGLE   | Show error msg  |
| CHECKPOINT RESTORE | `checkpoint_list()` → [confirm] → snapshot → `checkpoint_restore()`       | SEQUENCE | Rollback+abort  |
| CHECKPOINT LIST    | `checkpoint_list()`                                                        | SINGLE   | Show empty msg  |
| CHECKPOINT DELETE  | `checkpoint_delete()`                                                      | SINGLE   | Show error msg  |

### MCP Tool Signatures

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
spec_kit_memory_memory_search({ query: "<q>", limit: N, specFolder: "optional" })
spec_kit_memory_memory_index_scan({ force, specFolder, includeReadmes, includeSpecDocs, includeConstitutional, includeSkillRefs, incremental })
spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })
spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>", triggerPhrases: [...] })
spec_kit_memory_memory_delete({ id: <id> })
spec_kit_memory_memory_health({})
spec_kit_memory_checkpoint_create({ name: "<name>", specFolder: "optional", metadata: {...} })
spec_kit_memory_checkpoint_restore({ name: "<name>", clearExisting: <bool> })
spec_kit_memory_checkpoint_list({ limit: 50, specFolder: "optional" })
spec_kit_memory_checkpoint_delete({ name: "<name>" })
```

> **Feature Flag Behavior:** `SPECKIT_ADAPTIVE_FUSION` affects scan and search behavior — when enabled, index scans apply adaptive weight profiles during embedding and artifact-class routing during re-indexing. `SPECKIT_EXTENDED_TELEMETRY` enables detailed per-operation metrics for scan, search, and health calls. **Mutation Ledger:** cleanup and delete operations are recorded in the append-only mutation ledger, providing a full audit trail that can be reviewed when investigating unexpected state changes.

### `memory_index_scan` Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| force | boolean | false | Force re-index all files |
| specFolder | string | - | Limit scan to specific spec folder |
| includeReadmes | boolean | true | Include skill + project README.md and README.txt files |
| includeSpecDocs | boolean | true | Include spec folder documents |
| includeConstitutional | boolean | true | Include constitutional rule files |
| includeSkillRefs | boolean | true | Include workflow skill `references/` and `assets/` files |
| incremental | boolean | true | Skip unchanged files (mtime check) |

---

## 7. STATS DASHBOARD (No Arguments)

**Trigger:** `/memory:manage` with no arguments

Call `memory_stats()` and `memory_list({ limit: 10, sortBy: "updated_at" })` in parallel. Display:

```
MEMORY:STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total       <N>
  Size        <size>
  Indexed     <date>

→ Tier Distribution ────────────────────────────────
  constitutional  ██░░░░░░░░  <N>
  critical        ████░░░░░░  <N>
  important       ██████░░░░  <N>
  normal          █████████░  <N>
  temporary       ██░░░░░░░░  <N>
  deprecated      █░░░░░░░░░  <N>

→ Top Folders ──────────────────────────────────────
  <folder-1>  █████████░  <N>
  <folder-2>  ██████░░░░  <N>
  <folder-3>  ████░░░░░░  <N>

─────────────────────────────────────────────────────
[scan] index    [cleanup] remove    [health] check    [checkpoint] ops

STATUS=OK
```

User Input: Type action name (scan, cleanup, health, point, quit) to proceed

---

## 8. SCAN MODE

**Trigger:** `/memory:manage scan` or `/memory:manage scan --force` — **⚠️ GATE 4 MUST BE PASSED**

Normal scan skips unchanged files (mtime check). Force scan re-indexes all files regardless.

### Gate 4 Prompt (Required Every Scan)

Before running `memory_index_scan`, ask:

```
MEMORY:SCAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Source Scope ─────────────────────────────────────
  [a] all     include skill references (default)
  [c] core    exclude skill references
  [b] back    cancel
```

Map selection to `includeSkillRefs` for this run.

### 6-Source Pipeline

The scan discovers memory-eligible files from six sources:

| # | Source | Key | Location |
|---|--------|-----|----------|
| 1 | Spec Memories | specFiles | specs/*/memory/*.{md,txt} |
| 2 | Constitutional | constitutionalFiles | .opencode/skill/*/constitutional/*.md |
| 3 | Skill READMEs | skillReadmes | .opencode/skill/*/README.{md,txt} |
| 4 | Project READMEs | projectReadmes | **/README.{md,txt} |
| 5 | Spec Documents | specDocFiles | .opencode/specs/**/*.md |
| 6 | Skill References/Assets | skillRefFiles | .opencode/skill/*/{references,assets}/**/*.md |

### Call Examples

```javascript
spec_kit_memory_memory_index_scan({ force: false, includeSkillRefs: true })  // Normal incremental
spec_kit_memory_memory_index_scan({ force: true, includeSkillRefs: true })   // Force full re-index
```

**Targeted indexing examples:**
- Spec docs only: `{ includeReadmes: false }`
- READMEs only: `{ includeSpecDocs: false }`
- Core sources only (no skill refs): `{ includeSkillRefs: false }`
- Specific folder: `{ specFolder: "007-auth" }`
- Force full re-index: `{ force: true }`

### Output

```
MEMORY:SCAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Mode        <normal|force>
  Indexed     <N>
  Skipped     <N>
  Updated     <N>
  Errors      <N>

STATUS=OK INDEXED=<N> SKIPPED=<N> UPDATED=<N>
```

---

## 9. CLEANUP MODE

**Trigger:** `/memory:manage cleanup` — **⚠️ GATE 1 MUST BE PASSED**

### Workflow

1. **Safety:** Create auto-checkpoint `pre-cleanup-{timestamp}` before any deletions
2. **Identify:** `memory_list({ limit: 50, sortBy: "created_at" })`, filter by Gate 1 tier eligibility rules
3. **Display candidates:**
```
MEMORY:CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Candidates ───────────────────────────── <N> found

  ID    Tier          Title                   Age       Accesses
  42    deprecated    Early hero experiments   4 months  1
  38    temporary     Debug session notes      2 months  0

→ Protected ────────────────────────────────────────
  constitutional <N>  ·  critical <N>  ·  important <N>

─────────────────────────────────────────────────────
[a] remove all    [r] review each    [n] keep all    [b] back
```
4. **Actions:** `a`→checkpoint+delete all, `r`→step through each, `n`→cancel, `b`→back, `q`→exit
5. **Completion:**
```
MEMORY:CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Checkpoint  pre-cleanup-<timestamp>
  Removed     <N>
  Kept        <N>

  Undo: /memory:manage checkpoint restore pre-cleanup-<timestamp>

STATUS=OK REMOVED=<N> KEPT=<N> CHECKPOINT=<name>
```

---

## 10. TIER MANAGEMENT

**Trigger:** `/memory:manage tier <id> <tier>`

### Workflow

1. **Validate:** tier must be one of: constitutional, critical, important, normal, temporary, deprecated
2. **Validate:** id must exist in memory database
3. **Execute:** `spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>" })`
4. **Confirm:**

```
MEMORY:TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Old Tier    <old_tier>
  New Tier    <new_tier>

STATUS=OK ID=<id> TIER=<tier>
```

---

## 11. TRIGGER EDIT

**Trigger:** `/memory:manage triggers <id>`

1. **Load:** `memory_list({ limit: 100, sortBy: "created_at" })` → find memory, extract `triggerPhrases`
2. **Display:** Current triggers numbered, with `[a]dd | [r]emove # | [s]ave | [b]ack` actions
3. **Edit:** `a`→prompt for new phrase, `r`→prompt for number to remove, `s`→save via `memory_update({ triggerPhrases: [...] })`, `b`→back (discard)
4. **Confirm:**
```
MEMORY:TRIGGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"

→ Current Triggers ─────────────────────────────────
  1) <phrase1>
  2) <phrase2>
  3) <phrase3>

─────────────────────────────────────────────────────
[a] add    [r] remove #    [s] save    [b] back

STATUS=OK ID=<id> TRIGGERS=<N>
```

---

## 12. VALIDATE MODE

**Trigger:** `/memory:manage validate <id> useful` or `/memory:manage validate <id> not`

### Workflow

1. Parse: `"useful"` → `wasUseful: true` | `"not"` → `wasUseful: false`
2. Execute: `spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })`
3. Confirm:

```
MEMORY:VALIDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Feedback    <useful|not useful>
  Confidence  <old>% → <new>%

STATUS=OK ID=<id> USEFUL=<true|false>
```

---

## 13. DELETE MODE

**Trigger:** `/memory:manage delete <id>`
**⚠️ GATE 2 MUST BE PASSED**

### Step 1: Retrieve and Display

```javascript
spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
```

For protected tiers (constitutional, critical):
```
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  WARN  Protected memory
  Memory      #<id> "<title>"
  Tier        <tier>
  Created     <date>

  Type 'DELETE <title>' to confirm, or [b] back
```

For other tiers:
```
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Tier        <tier>
  Created     <date>

─────────────────────────────────────────────────────
[y] delete    [n] cancel
```

### Step 2: Execute and Confirm

```javascript
spec_kit_memory_memory_delete({ id: <id> })
```

```
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Removed     #<id> "<title>"

STATUS=OK DELETED=<id>
```

---

## 14. HEALTH CHECK

**Trigger:** `/memory:manage health`

Execute `spec_kit_memory_memory_health({})`. Display:

```
MEMORY:HEALTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Status      <healthy|degraded|error>
  Size        <size>
  Schema      v13
  Total       <N>

→ Tables ───────────────────────────────────────────
  PASS  memory_index (v13)
  PASS  causal_edges
  PASS  memory_corrections
  PASS  session_state
  PASS  checkpoints

→ Checks ───────────────────────────────────────────
  PASS  DB accessible
  PASS  Embeddings valid
  PASS  No orphans
  PASS  No duplicate IDs

→ Warnings ─────────────────────────────────────────
  WARN  <N> memories without trigger phrases
  WARN  <N> memories older than 90 days

STATUS=OK HEALTH=<healthy|degraded|error> SCHEMA=v13
```

---

## 15. CHECKPOINT OPERATIONS

### Checkpoint Create

**Trigger:** `/memory:manage checkpoint create <name>`

```javascript
spec_kit_memory_checkpoint_create({
  name: "<checkpoint_name>",
  specFolder: "<folder>",   // Optional
  metadata: { ... }         // Optional
})
```

```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Name        <checkpoint_name>
  Memories    <N>
  Folders     <N>

STATUS=OK CHECKPOINT=<name> ACTION=create
```

**Limits:** Max 10 checkpoints. Auto-cleanup: checkpoints older than 30 days.

---

### Checkpoint Restore

**Trigger:** `/memory:manage checkpoint restore <name>`
**⚠️ GATE 3 MUST BE PASSED**

### Restore Workflow

1. Verify checkpoint exists via `checkpoint_list()`
2. Create pre-restore snapshot: `checkpoint_create({ name: "pre-restore-{timestamp}", metadata: { type: "rollback-snapshot" } })`
3. Execute restore: `checkpoint_restore({ name: "<name>", clearExisting: false })`
4. On success: delete pre-restore snapshot, show confirmation
5. On failure: rollback to pre-restore snapshot, report failure

**Output (Success):**
```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Restored    <checkpoint_name>
  Removed     <N>
  Recovered   <N>

STATUS=OK CHECKPOINT=<name> ACTION=restore
```

**Output (Failure):**
```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FAIL  Restore failed
  Target      <checkpoint_name>
  Error       <reason>
  Rollback    <successful|failed>

STATUS=FAIL CHECKPOINT=<name> ACTION=restore ROLLBACK=<status>
```

**Output (Failure + Rollback Failed):**
```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FAIL  Restore failed
  Target      <checkpoint_name>
  Error       <reason>
  Rollback    FAIL — manual intervention required
  Recovery    pre-restore-<timestamp>

  Run: /memory:manage checkpoint restore "pre-restore-<timestamp>"

STATUS=FAIL CHECKPOINT=<name> ACTION=restore ROLLBACK=failed
```

**Caution:**
- Default (`clearExisting=false`): Marks existing memories as `deprecated`
- `clearExisting=true`: Deletes existing memories before restore
- Always run `memory_index_scan` after restore to regenerate embeddings

---

### Checkpoint List

**Trigger:** `/memory:manage checkpoint list`

```javascript
spec_kit_memory_checkpoint_list({ limit: 50, specFolder: "<folder>" })
```

```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available ────────────────────────────── <N> checkpoints

  Name              Created          Memories  Size
  before-refactor   Dec 8, 10:30 AM  47        12.4 KB
  feature-auth      Dec 7, 3:15 PM   42        10.8 KB

  Total: <N> checkpoints (<size>)

STATUS=OK ACTION=list
```

---

### Checkpoint Delete

**Trigger:** `/memory:manage checkpoint delete <name>`

```javascript
spec_kit_memory_checkpoint_delete({ name: "<checkpoint_name>" })
```

Confirmation required before deleting. Output:
```
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Deleted     <checkpoint_name>

STATUS=OK CHECKPOINT=<name> ACTION=delete
```

---

## 16. QUICK REFERENCE

| Command                                    | Result                 |
| ------------------------------------------ | ---------------------- |
| `/memory:manage`                           | Stats dashboard        |
| `/memory:manage scan`                      | Index new files        |
| `/memory:manage scan --force`              | Re-index all files     |
| `/memory:manage cleanup`                   | Cleanup old memories   |
| `/memory:manage tier 42 critical`          | Change tier            |
| `/memory:manage triggers 42`              | Edit triggers          |
| `/memory:manage validate 42 useful`        | Mark as useful         |
| `/memory:manage validate 42 not`           | Mark as not useful     |
| `/memory:manage delete 42`                 | Delete memory          |
| `/memory:manage health`                    | System health check    |
| `/memory:manage checkpoint create "name"`  | Save memory state      |
| `/memory:manage checkpoint restore "name"` | Restore to saved state |
| `/memory:manage checkpoint list`           | Show all checkpoints   |
| `/memory:manage checkpoint delete "name"`  | Remove checkpoint      |

---

## 17. ERROR HANDLING

| Condition               | Response                                     |
| ----------------------- | -------------------------------------------- |
| Unknown subcommand      | `STATUS=FAIL` — list valid subcommands       |
| Memory ID not found     | `STATUS=FAIL ERROR="Memory #<id> not found"` |
| Invalid tier            | `STATUS=FAIL ERROR="Invalid tier: <tier>"`   |
| Database locked         | `STATUS=FAIL ERROR="Database locked"`        |
| Permission denied       | `STATUS=FAIL ERROR="Cannot access database"` |
| Scan failed             | `STATUS=FAIL ERROR="Scan failed: <reason>"`  |
| Checkpoint not found    | `STATUS=FAIL ERROR="Checkpoint not found"`   |
| Max checkpoints reached | Auto-delete oldest, warn user                |

---

## 18. RELATED COMMANDS

- `/memory:context` — Intent-aware context retrieval (read-only)
- `/memory:save` — Save current conversation context
- `/memory:continue` — Resume session using CONTINUE_SESSION.md
- `/memory:learn` — Capture explicit learnings

---

## 19. CONSTITUTIONAL TIER HANDLING

Constitutional tier memories receive special treatment across all operations:

- **Cleanup:** NEVER included in cleanup candidates, always protected regardless of age/access count
- **Delete:** Requires typing `DELETE <title>` to confirm, with extra irreversibility warning
- **Checkpoint Restore:** Constitutional memories added AFTER a checkpoint will be removed on restore

**Best Practice:** Before restoring a checkpoint that predates constitutional memory additions:
1. Review current constitutional memories
2. Note any that should be preserved
3. After restore, manually re-promote critical rules if needed

---

## 20. FULL DOCUMENTATION

For comprehensive memory system documentation: `.opencode/skill/system-spec-kit/SKILL.md`
