---
description: Save and restore memory states for context switching and safety nets
argument-hint: "<subcommand> [name]"
allowed-tools: Read, Bash, mcp__semantic_memory__memory_list, mcp__semantic_memory__memory_search, mcp__semantic_memory__memory_load, mcp__semantic_memory__memory_stats, mcp__semantic_memory__memory_delete, mcp__semantic_memory__checkpoint_create, mcp__semantic_memory__checkpoint_restore, mcp__semantic_memory__checkpoint_list, mcp__semantic_memory__checkpoint_delete
---

# 🚨 MANDATORY PHASE - BLOCKING ENFORCEMENT

**This phase MUST be passed before workflow execution. You CANNOT proceed until phase shows ✅ PASSED.**

---

## 🔒 PHASE 1: SUBCOMMAND PARSING

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS starts with "create":
│   ├─ Extract checkpoint name from remaining args
│   ├─ IF name provided:
│   │   ├─ Validate name (alphanumeric + dashes, no spaces, max 50 chars)
│   │   ├─ Store as: subcommand = "create", checkpoint_name = "<name>"
│   │   └─ SET STATUS: ✅ PASSED → Route to CREATE workflow
│   └─ IF name missing:
│       ├─ ASK user: "What name for this checkpoint?"
│       ├─ WAIT for response
│       ├─ Validate and store
│       └─ SET STATUS: ✅ PASSED
│
├─ IF $ARGUMENTS starts with "restore":
│   ├─ Extract checkpoint name from remaining args
│   ├─ IF name provided:
│   │   ├─ Store as: subcommand = "restore", checkpoint_name = "<name>"
│   │   └─ SET STATUS: ✅ PASSED → Route to RESTORE workflow
│   └─ IF name missing:
│       ├─ List available checkpoints
│       ├─ ASK user to select
│       ├─ WAIT for response
│       └─ SET STATUS: ✅ PASSED
│
├─ IF $ARGUMENTS starts with "list":
│   ├─ Store as: subcommand = "list"
│   └─ SET STATUS: ✅ PASSED → Route to LIST workflow
│
├─ IF $ARGUMENTS starts with "delete":
│   ├─ Extract checkpoint name
│   ├─ IF name provided:
│   │   ├─ Store as: subcommand = "delete", checkpoint_name = "<name>"
│   │   └─ SET STATUS: ✅ PASSED → Route to DELETE workflow
│   └─ IF name missing:
│       ├─ List available checkpoints
│       ├─ ASK user to select
│       └─ SET STATUS: ✅ PASSED
│
└─ IF $ARGUMENTS is empty or invalid:
    ├─ Show usage help with subcommand options
    └─ SET STATUS: ⛔ BLOCKED (awaiting valid subcommand)

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 1 Output:** `subcommand = ______` | `checkpoint_name = ______`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify phase status:**

| PHASE               | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                      |
| ------------------- | --------------- | ----------- | --------------------------------- |
| PHASE 1: SUBCOMMAND | ✅ PASSED        | ______      | subcommand: ______ / name: ______ |

```
VERIFICATION CHECK:
├─ Phase shows ✅ PASSED?
│   ├─ YES → Proceed to corresponding subcommand section
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Started executing a subcommand before phase passed
- Assumed a checkpoint name without validation
- Skipped the name validation for create/delete/restore
- Did not show usage help for invalid input
- Proceeded with restore/delete without confirmation

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated PHASE 1 by [specific action]. Correcting now."
3. RETURN to phase validation
4. COMPLETE the phase properly
5. RESUME only after phase passes verification
```

---

# Memory Checkpoint Management

Save and restore memory states for context switching and safety nets.

---

```yaml
role: Memory State Manager
purpose: Create and manage checkpoints for memory state preservation
action: Execute subcommand (create/restore/list/delete) with checkpoint operations

operating_mode:
  workflow: subcommand_dispatch
  workflow_compliance: MANDATORY
  approvals: restore_and_delete_only
  tracking: checkpoint_operations
```

---

## MCP ENFORCEMENT MATRIX

**CRITICAL:** This command uses MCP tools directly. Native MCP only - NEVER Code Mode.

```
┌─────────────────┬─────────────────────────────────────┬──────────┬─────────────────┐
│ SCREEN          │ REQUIRED MCP CALLS                  │ MODE     │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ CREATE          │ checkpoint_create(name)             │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ RESTORE         │ checkpoint_restore(name)            │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ LIST            │ checkpoint_list                     │ SINGLE   │ Show empty msg  │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ DELETE          │ checkpoint_delete(name)             │ SINGLE   │ Show error msg  │
└─────────────────┴─────────────────────────────────────┴──────────┴─────────────────┘
```

**Tool Call Format:**
```
mcp__semantic_memory__checkpoint_create({ name: "<name>" })
mcp__semantic_memory__checkpoint_restore({ name: "<name>" })
mcp__semantic_memory__checkpoint_list({})
mcp__semantic_memory__checkpoint_delete({ name: "<name>" })
```

---

## 1. 📋 PURPOSE

Create and manage checkpoints for memory state preservation. Use checkpoints for:
- Safety nets before major refactors
- Context switching between features
- Experimentation with rollback capability
- Session recovery after accidental cleanup

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` - Subcommand and optional checkpoint name
**Outputs:** `STATUS=<OK|FAIL> CHECKPOINT=<name> ACTION=<create|restore|list|delete>`

---

## 3. 📊 SUBCOMMAND OVERVIEW

| Subcommand       | Description                           | Requires Confirmation |
| ---------------- | ------------------------------------- | --------------------- |
| `create <name>`  | Save current memory state with a name | No                    |
| `restore <name>` | Restore to a saved checkpoint         | **Yes**               |
| `list`           | Show all available checkpoints        | No                    |
| `delete <name>`  | Remove a checkpoint                   | **Yes**               |

---

## 4. ⚡ SUBCOMMAND: CREATE

### Usage
```
/memory/checkpoint create "before-refactor"
```

### Instructions

1. **Validate Name** (from Phase 1)
   - Alphanumeric characters, dashes, underscores only
   - Max 50 characters
   - No spaces

2. **Execute MCP Call**
   ```
   mcp__semantic_memory__checkpoint_create({
     name: "<checkpoint_name>"
   })
   ```

3. **Enforce Limits**
   - Max 10 checkpoints allowed
   - If limit exceeded: oldest checkpoint auto-deleted
   - Auto-cleanup: remove checkpoints older than 30 days

4. **Display Result**
   ```
   ✅ Checkpoint Created

      Name: before-refactor
      Memories captured: 47
      Spec folders: 5

   STATUS=OK CHECKPOINT=before-refactor ACTION=create
   ```

---

## 5. ⚡ SUBCOMMAND: RESTORE

### Usage
```
/memory/checkpoint restore "before-refactor"
```

### Instructions

1. **Load Checkpoint via MCP**
   ```
   mcp__semantic_memory__checkpoint_list({})
   ```
   Verify checkpoint exists.

2. **Show Diff Summary**
   ```
   Restoring checkpoint 'before-refactor'

   Changes detected:
      - 12 memories added since checkpoint (will be removed)
      - 3 memories deleted since checkpoint (will be restored)
      - 2 memories modified since checkpoint (will be reverted)

   Confirm? [y]es, [n]o, [v]iew diff
   ```

3. **Wait for Confirmation** (MANDATORY)
   - If `y` → Execute restore
   - If `n` → Cancel operation
   - If `v` → Show detailed diff, then re-prompt

4. **Execute Restore**
   ```
   mcp__semantic_memory__checkpoint_restore({
     name: "<checkpoint_name>"
   })
   ```

5. **Display Result**
   ```
   ✅ Checkpoint Restored

      Name: before-refactor
      Memories removed: 12
      Memories marked for recovery: 3

   STATUS=OK CHECKPOINT=before-refactor ACTION=restore
   ```

### ⚠️ CAUTION

Restore is a **destructive operation**:
- Memories added after checkpoint will be deleted
- Deleted memories cannot be automatically restored (data loss)
- Always create a new checkpoint before restoring

---

## 6. ⚡ SUBCOMMAND: LIST

### Usage
```
/memory/checkpoint list
```

### Instructions

1. **Execute MCP Call**
   ```
   mcp__semantic_memory__checkpoint_list({})
   ```

2. **Display Table**
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

3. **Empty State**
   ```
   No checkpoints found

   Create one with: /memory/checkpoint create "my-checkpoint"

   STATUS=OK ACTION=list
   ```

---

## 7. ⚡ SUBCOMMAND: DELETE

### Usage
```
/memory/checkpoint delete "old-checkpoint"
```

### Instructions

1. **Show Confirmation** (MANDATORY)
   ```
   Delete checkpoint 'old-checkpoint'?

      Created: Dec 5, 9:00 AM
      Memories: 35
      Size: 8.2 KB

   This action is permanent. Confirm? [y]es, [n]o
   ```

2. **Wait for Confirmation**
   - If `y` → Execute delete
   - If `n` → Cancel operation

3. **Execute Delete**
   ```
   mcp__semantic_memory__checkpoint_delete({
     name: "<checkpoint_name>"
   })
   ```

4. **Display Result**
   ```
   ✅ Checkpoint Deleted

      Name: old-checkpoint

   STATUS=OK CHECKPOINT=old-checkpoint ACTION=delete
   ```

---

## 8. 🔧 FAILURE RECOVERY

| Failure Type             | Recovery Action               |
| ------------------------ | ----------------------------- |
| Checkpoint not found     | List available checkpoints    |
| Name validation fails    | Show naming requirements      |
| Max checkpoints exceeded | Auto-delete oldest, warn user |
| Restore without confirm  | Abort operation               |
| Delete without confirm   | Abort operation               |

---

## 9. ⚠️ ERROR HANDLING

| Condition                     | Action                                     |
| ----------------------------- | ------------------------------------------ |
| Invalid subcommand            | Show usage help with available subcommands |
| Checkpoint not found          | List available checkpoints                 |
| Name validation fails         | Show naming requirements                   |
| Max checkpoints exceeded      | Auto-delete oldest, warn user              |
| Restore without confirmation  | Abort operation                            |
| Delete without confirmation   | Abort operation                            |
| Checkpoints directory missing | Create automatically                       |

---

## 10. 🔍 QUICK REFERENCE

| Command                             | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| `/memory/checkpoint create "name"`  | Save current memory state                      |
| `/memory/checkpoint restore "name"` | Restore to saved state (requires confirmation) |
| `/memory/checkpoint list`           | Show all checkpoints                           |
| `/memory/checkpoint delete "name"`  | Remove checkpoint (requires confirmation)      |

---

## 11. 📊 USE CASES

### Before Major Refactors
```
User: Create a checkpoint before I start the auth refactor
AI: /memory/checkpoint create "pre-auth-refactor"
    ✅ Checkpoint 'pre-auth-refactor' created (47 memories)

[... work happens, things go wrong ...]

User: Restore to before the refactor
AI: /memory/checkpoint restore "pre-auth-refactor"
```

### Context Switching Between Features
```
User: I need to switch to the billing feature for a bit
AI: /memory/checkpoint create "auth-wip"

[... work on billing ...]

User: Back to auth work, restore my context
AI: /memory/checkpoint restore "auth-wip"
```

### Experimentation
```
User: Let me try a different approach, but save current state first
AI: /memory/checkpoint create "approach-a"

[... try different approach ...]

User: That didn't work, go back
AI: /memory/checkpoint restore "approach-a"
```

---

## 12. 📁 CONFIGURATION

Configuration is handled internally by the MCP server. Default values:

| Setting        | Default                   | Description                 |
| -------------- | ------------------------- | --------------------------- |
| `max_count`    | 10                        | Maximum checkpoints allowed |
| `max_age_days` | 30                        | Auto-delete after N days    |
| `storage_path` | `.opencode/checkpoints`   | Runtime storage location    |

These defaults are enforced by the semantic memory MCP server and cannot be overridden via configuration files.

---

## 13. 📌 LIMITATIONS

1. **Cannot fully restore deleted memories**: When a memory is deleted from the database, restoring a checkpoint cannot recreate it. The checkpoint only records metadata, not full content.

2. **Embedding data not preserved**: Checkpoints capture metadata but not vector embeddings. Restored memories will retain their original embeddings if they still exist.

3. **Cross-session limitations**: Checkpoints are local to the workspace and may not transfer between machines.

---

## 14. 📌 RELATED COMMANDS

- `/memory/save` - Save conversation context to memory
- `/memory/search` - Unified memory dashboard (search, browse, cleanup, triggers)

---

## 15. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-memory/SKILL.md`

---

## 16. 🏛️ CONSTITUTIONAL TIER HANDLING

**IMPORTANT:** Constitutional tier memories receive special treatment during checkpoint operations:

### Create
- Constitutional memories ARE included in checkpoints
- They are marked with `tier: constitutional` in the checkpoint metadata

### Restore
- Constitutional memories from the checkpoint are restored normally
- **Warning:** If constitutional memories were added AFTER the checkpoint, they will be removed on restore
- Consider: Constitutional memories often contain critical rules - verify before restoring older checkpoints

### Best Practice
Before restoring a checkpoint that predates constitutional memory additions:
1. Review current constitutional memories: `memory_search({ tier: "constitutional" })`
2. Note any that should be preserved
3. After restore, manually re-promote critical rules if needed:
   ```typescript
   memory_update({ id: <id>, importanceTier: "constitutional" })
   ```

### Example: Gate 3 Enforcement Memory
Memory #132 is a constitutional memory for Gate 3 enforcement. If restoring a checkpoint from before this was created, you would need to re-create it after restore.