---
description: Recover session from crash, compaction, or timeout - resume interrupted work
argument-hint: "[recovery-mode:auto|manual]"
allowed-tools: Read, Bash, spec_kit_memory_memory_search, spec_kit_memory_memory_list, spec_kit_memory_memory_stats
---

# 🚨 MANDATORY PHASE - BLOCKING ENFORCEMENT

**This phase MUST be passed before workflow execution. You CANNOT proceed until phase shows ✅ PASSED.**

---

## 🔒 PHASE 1: RECOVERY MODE DETECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS contains ":auto":
│   ├─ Store as: recovery_mode = "auto"
│   └─ SET STATUS: ✅ PASSED → Route to AUTO workflow
│
├─ IF $ARGUMENTS contains ":manual":
│   ├─ Store as: recovery_mode = "manual"
│   └─ SET STATUS: ✅ PASSED → Route to MANUAL workflow
│
├─ IF $ARGUMENTS is empty or invalid:
│   ├─ Detect recovery scenario from system state
│   ├─ CHECK for CONTINUE_SESSION.md in recent spec folders
│   ├─ CHECK for recent memory files with state anchor
│   ├─ CHECK for context compaction in system messages
│   ├─ Determine scenario: crash | compaction | timeout
│   ├─ Store as: recovery_mode = "auto", scenario = "<detected>"
│   └─ SET STATUS: ✅ PASSED
│
└─ IF detection fails:
    ├─ ASK user: "What caused the interruption?"
    │   Options:
    │     A) MCP server crash/restart
    │     B) Context compaction (conversation too long)
    │     C) Session timeout (returned after break)
    │     D) Manual recovery (specify reason)
    ├─ WAIT for response
    ├─ Store scenario and recovery_mode
    └─ SET STATUS: ✅ PASSED

**STOP HERE** - Wait for detection to complete or user to provide scenario.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 1 Output:** `recovery_mode = ______` | `scenario = ______`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify phase status:**

| PHASE                  | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                    |
| ---------------------- | --------------- | ----------- | ------------------------------- |
| PHASE 1: RECOVERY MODE | ✅ PASSED        | ______      | mode: ______ / scenario: ______ |

```
VERIFICATION CHECK:
├─ Phase shows ✅ PASSED?
│   ├─ YES → Proceed to corresponding workflow section
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Started recovery workflow before phase passed
- Assumed recovery scenario without detection
- Skipped CONTINUE_SESSION.md check
- Did not show recovery options to user
- Proceeded without loading session state

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated PHASE 1 by [specific action]. Correcting now."
3. RETURN to phase validation
4. COMPLETE the phase properly
5. RESUME only after phase passes verification
```

---

# Memory Continue Command

Session recovery from crash, compaction, or timeout. Resume interrupted work with full context restoration.

---

```yaml
role: Session Recovery Specialist
purpose: Restore interrupted sessions from crash/compaction/timeout with context recovery
action: Execute recovery workflow based on detected scenario

operating_mode:
  workflow: session_recovery
  workflow_compliance: MANDATORY
  approvals: manual_mode_only
  tracking: recovery_state
```

---

## 1. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** This command uses MCP tools directly. Native MCP only - NEVER Code Mode.

```
┌─────────────────┬─────────────────────────────────────┬──────────┬─────────────────┐
│ SCREEN          │ REQUIRED MCP CALLS                  │ MODE     │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ DETECTION       │ spec_kit_memory_memory_search(query: "session") │ SINGLE   │ Ask user        │
├─────────────────┼─────────────────────────────────────────────────┼──────────┼─────────────────┤
│ STATE LOAD      │ spec_kit_memory_memory_search(includeContent: true) │ SINGLE   │ Use CONTINUE.md │
├─────────────────┼─────────────────────────────────────────────────┼──────────┼─────────────────┤
│ STATS           │ spec_kit_memory_memory_stats                    │ SINGLE   │ Show error msg  │
└─────────────────┴─────────────────────────────────────┴──────────┴─────────────────┘
```

**Tool Call Format:**
```
spec_kit_memory_memory_search({ query: "session state", specFolder: "<folder>", includeContent: true })
spec_kit_memory_memory_list({ limit: 5, sortBy: "updated_at" })
spec_kit_memory_memory_stats({ includeScores: true })
Read({ filePath: "<absolute_path>" })
```

---

## 2. 🎯 PURPOSE

Enable session recovery from three interruption scenarios:

1. **Crash Recovery**: MCP server crashed or restarted mid-session
2. **Compaction Recovery**: Conversation context was compressed due to length
3. **Session Timeout**: User returned after break (hours or days)

This command restores the most recent session state, loads relevant context, and presents continuation options.

---

## 3. 🔧 SQLITE CRASH RECOVERY

### Immediate Persistence Pattern

All session state is immediately persisted to SQLite to ensure recoverability after crashes:

```javascript
// Write-ahead logging (WAL) for crash safety
const db = new Database(dbPath, { wal: true });

// Immediate persistence on state changes
function updateSessionState(sessionId, state) {
  const tx = db.transaction(() => {
    db.prepare(`
      INSERT OR REPLACE INTO session_state
      (session_id, state_json, updated_at)
      VALUES (?, ?, datetime('now'))
    `).run(sessionId, JSON.stringify(state));
  });

  tx.immediate();  // Force immediate write
  return tx;
}
```

### Transaction Safety

| Operation         | Isolation | Recovery Guarantee     |
| ----------------- | --------- | ---------------------- |
| State write       | IMMEDIATE | Survives process crash |
| Checkpoint create | EXCLUSIVE | Full consistency       |
| Memory save       | IMMEDIATE | Write-ahead logged     |

### Database Path

```
.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

### Recovery from SQLite State

```javascript
function recoverFromSQLite(sessionId) {
  const state = db.prepare(`
    SELECT state_json, updated_at
    FROM session_state
    WHERE session_id = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `).get(sessionId);

  if (state) {
    return {
      ...JSON.parse(state.state_json),
      _recovered: true,
      _recovered_at: new Date().toISOString(),
      _source: 'sqlite'
    };
  }

  return null;
}
```

---

## 4. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` - Optional recovery mode flag (`:auto` or `:manual`)
**Outputs:** `STATUS=<OK|FAIL|CANCELLED> SCENARIO=<crash|compaction|timeout> SESSION=<spec-folder>`

---

## 5. 📊 RECOVERY SCENARIOS

| Scenario       | Detection Signal                     | Recovery Source          | Auto-Recoverable |
| -------------- | ------------------------------------ | ------------------------ | ---------------- |
| **Crash**      | MCP restart detected, recent session | CONTINUE_SESSION.md      | Yes              |
| **Compaction** | System message: "continue from..."   | Most recent memory file  | Yes              |
| **Timeout**    | Last activity >2 hours ago           | Memory with state anchor | Yes              |

---

## 6. ⚡ WORKFLOW: AUTO MODE

Auto mode attempts automatic recovery without user confirmation.

### Step 1: Detect Recovery Scenario

**Priority order:**

1. **Check for CONTINUE_SESSION.md**:
   ```bash
   # Find most recent CONTINUE_SESSION.md
   find specs -name "CONTINUE_SESSION.md" -type f -mtime -1 | head -1
   ```
   - If found and <24h old: `scenario = "crash"`, load this file

2. **Check for compaction signal**:
   - Scan system messages for "continue from where we left off"
   - If found: `scenario = "compaction"`

3. **Check for timeout**:
   - Get most recent memory file
   - If mtime >2h ago: `scenario = "timeout"`

4. **Fallback**:
   - If none detected: Switch to MANUAL mode, ask user

### Step 2: Load Session State

**For Crash (CONTINUE_SESSION.md exists):**

```typescript
// Read CONTINUE_SESSION.md
const continueFile = Read({ filePath: "<detected_path>" })

// Parse session state table
const state = {
  specFolder: extractFromTable("Spec Folder"),
  lastAction: extractFromTable("Last Action"),
  nextSteps: extractFromTable("Next Steps"),
  progress: extractFromTable("Progress"),
  blockers: extractFromTable("Blockers")
}
```

**For Compaction/Timeout (use memory files):**

```typescript
// Find most recent memory with state anchor
spec_kit_memory_memory_list({
  limit: 1,
  sortBy: "updated_at"
})

// Extract state from ANCHOR:state section
const state = extractAnchor(result, "state")
```

### Step 3: Validate Content vs Folder Alignment

**CRITICAL**: Before displaying the recovery summary, validate that the memory content matches the spec folder.

```typescript
// Extract key_files from memory metadata
const keyFiles = extractFromYaml(memoryContent, "key_files");

// Check for infrastructure mismatch
const opencodeFiles = keyFiles.filter(f => f.includes('.opencode/'));
const opencodeRatio = opencodeFiles.length / keyFiles.length;

if (opencodeRatio > 0.5) {
  // More than 50% of files are in .opencode/ - this is infrastructure work
  const specFolderLower = state.specFolder.toLowerCase();
  const infrastructurePatterns = ['memory', 'spec-kit', 'speckit', 'opencode', 'command', 'agent'];

  const matchesInfrastructure = infrastructurePatterns.some(p => specFolderLower.includes(p));

  if (!matchesInfrastructure) {
    // MISMATCH DETECTED - infrastructure work filed under project folder
    console.log("⚠️ CONTENT MISMATCH DETECTED");
    console.log(`   Memory contains infrastructure work (${Math.round(opencodeRatio * 100)}% .opencode/ files)`);
    console.log(`   But spec_folder is "${state.specFolder}" (project-specific)`);
    console.log(`   Detected subpath: ${detectSubpath(opencodeFiles)}`);

    // Present options
    console.log("\n   Options:");
    console.log("   A) Search for infrastructure-related spec folder");
    console.log("   B) Continue with stored spec folder anyway");
    console.log("   C) Select spec folder manually");

    // Wait for user choice before proceeding
  }
}
```

**Mismatch Detection Signals:**

| Signal | Meaning |
|--------|---------|
| `key_files` contain `.opencode/skill/` | Skill/infrastructure work |
| `key_files` contain `.opencode/command/` | Command development work |
| `key_files` contain `.opencode/agent/` | Agent development work |
| `spec_folder` doesn't match patterns | Likely saved to wrong folder |

### Step 4: Display Recovery Summary

```
╭─────────────────────────────────────────────────────────────╮
│ 🔄 SESSION RECOVERY                                         │
├─────────────────────────────────────────────────────────────┤
│ Scenario: Crash recovery (MCP restart detected)            │
│ Spec: specs/082-speckit-reimagined/                        │
│ Last Activity: 15 minutes ago                               │
│                                                             │
│ LAST ACTION:                                                │
│   Created /memory:continue command file                     │
│                                                             │
│ NEXT STEPS:                                                 │
│   1. Verify command structure                               │
│   2. Test recovery scenarios                                │
│   3. Update tasks.md                                        │
│                                                             │
│ PROGRESS: 47% (118/250 tasks)                               │
│ BLOCKERS: None                                              │
│                                                             │
│ KEY FILES:                                                  │
│   • .opencode/skill/system-spec-kit/scripts/...             │
│   • .opencode/command/memory/continue.md                    │
│   (showing first 3 of N files)                              │
├─────────────────────────────────────────────────────────────┤
│ ✅ Context restored. Ready to continue.                     │
╰─────────────────────────────────────────────────────────────╯

STATUS=OK SCENARIO=crash SESSION=specs/082-speckit-reimagined/
```

**IMPORTANT**: Always display key files in the recovery summary. This allows the user to quickly verify that the spec folder makes sense for the work that was done. If `key_files` are in `.opencode/` but `spec_folder` is project-specific (like `005-anobel.com`), this is a mismatch that should be flagged.

### Step 5: Auto-Continue

In auto mode, immediately present continuation options:

```
What would you like to do?

  A) Continue from last action - Resume where you left off
  B) Review session state - See full context before continuing
  C) Change direction - Different task in this spec folder
  D) Cancel - Exit recovery

Reply with A/B/C/D
```

---

## 7. ⚡ WORKFLOW: MANUAL MODE

Manual mode requires user confirmation at each step.

### Step 1: Ask User for Scenario

```
Session interruption detected. What caused the interruption?

  A) MCP server crash/restart
  B) Context compaction (conversation too long)
  C) Session timeout (returned after break)
  D) Manual recovery (specify reason)

Reply with A/B/C/D
```

### Step 2: Confirm Session Detection

```
Most recent session detected:

  Spec: specs/082-speckit-reimagined/
  Last Activity: 15 minutes ago
  Last Memory: session-20260201-152030.md

Is this the session to recover?

  A) Yes, recover this session
  B) No, select a different spec folder
  C) Cancel recovery

Reply with A/B/C
```

### Step 3: Load and Confirm State

(Same as Auto Mode Step 2, but wait for confirmation before proceeding)

```
Loaded session state. Confirm context is accurate?

  Last Action: Created /memory:continue command file
  Next Steps: Verify command structure, test scenarios
  Progress: 47% (118/250 tasks)

  A) Yes, context is accurate
  B) Context incomplete - load more memory files
  C) Context incorrect - investigate

Reply with A/B/C
```

### Step 4: Present Continuation Options

(Same as Auto Mode Step 4)

---

## 8. 📌 SESSION STATE STRUCTURE

### CONTINUE_SESSION.md Format

```markdown
# SESSION CONTINUATION

| Field       | Value                                 |
| ----------- | ------------------------------------- |
| Spec Folder | specs/082-speckit-reimagined/         |
| Active Task | T118 - Implement /memory:continue     |
| Last Action | Created /memory:continue command file |
| Next Steps  | Verify structure, test scenarios      |
| Progress    | 47% (118/250 tasks)                   |
| Blockers    | None                                  |
| Session ID  | session-20260201-152030               |
| Timestamp   | 2026-02-01 15:20:30                   |

## Context Summary

Created /memory:continue command following patterns from checkpoint.md, search.md, and resume.md.
Implemented Phase 1 detection logic, auto/manual workflows, and recovery from three scenarios.

## Pending Work

- [ ] Verify command structure against existing patterns
- [ ] Test crash recovery scenario
- [ ] Test compaction recovery scenario
- [ ] Test timeout recovery scenario
- [ ] Update tasks.md with completion status

## Quick Resume

**To continue this session:**

```
/memory:continue
```

Context will be automatically restored. Next action: Verify command structure.
```

### Memory File State Anchor Format

```markdown
<!-- ANCHOR:state -->

**Current State:** Implementing T118 - /memory:continue command

**Last Action:** Created command file with Phase 1 detection logic

**Next Steps:**
1. Verify command structure against patterns
2. Test recovery scenarios
3. Update tasks.md with status

**Progress:** 47% (118/250 tasks)

**Blockers:** None

<!-- /ANCHOR:state -->
```

---

## 9. 🔧 FAILURE RECOVERY

| Failure Type                     | Recovery Action                        |
| -------------------------------- | -------------------------------------- |
| CONTINUE_SESSION.md not found    | Fall back to memory file search        |
| No memory files with state       | Ask user for manual context            |
| Multiple sessions detected       | Ask user to select                     |
| Session state corrupt/incomplete | Reconstruct from multiple memory files |
| Spec folder not found            | List available, ask user to select     |

---

## 10. 🔧 SESSION STATE MANAGER API

### SessionStateManager Class Interface

The `SessionStateManager` class provides programmatic access to session recovery operations:

```typescript
interface SessionStateManager {
  /**
   * Reset all sessions marked as interrupted (status = 'interrupted')
   * Called on MCP server startup to clean up stale sessions
   * @returns Number of sessions reset
   */
  resetInterruptedSessions(): number;

  /**
   * Recover state for a specific session
   * Attempts recovery from multiple sources in priority order:
   * 1. CONTINUE_SESSION.md
   * 2. SQLite session_state table
   * 3. Memory files with state anchor
   *
   * @param sessionId - The session ID to recover
   * @returns Recovered state with _recovered: true flag, or null if not found
   */
  recoverState(sessionId: string): RecoveredState | null;

  /**
   * Get list of recoverable sessions
   * @param options - Filter options (maxAge, status, specFolder)
   * @returns Array of session summaries
   */
  listRecoverableSessions(options?: RecoveryOptions): SessionSummary[];

  /**
   * Mark session as recovered (prevents duplicate recovery)
   * @param sessionId - The session ID to mark
   */
  markRecovered(sessionId: string): void;
}
```

### RecoveredState Interface

```typescript
interface RecoveredState {
  sessionId: string;
  specFolder: string;
  activeTask: string | null;      // Task ID if available
  lastAction: string;
  nextSteps: string[];
  progress: string;               // e.g., "47% (118/250 tasks)"
  blockers: string[];
  timestamp: string;              // ISO timestamp

  // Recovery metadata
  _recovered: true;               // Always true for recovered state
  _recovered_at: string;          // ISO timestamp of recovery
  _source: 'continue_session' | 'sqlite' | 'memory_anchor';
}
```

### Usage Example

```javascript
const manager = new SessionStateManager(dbPath);

// On server startup
const resetCount = manager.resetInterruptedSessions();
console.log(`Reset ${resetCount} interrupted sessions`);

// Recover a specific session
const state = manager.recoverState('session-20260201-152030');
if (state) {
  console.log(`Recovered session from ${state._source}`);
  console.log(`Active task: ${state.activeTask}`);
  console.log(`Last action: ${state.lastAction}`);

  // Mark as recovered to prevent re-recovery
  manager.markRecovered(state.sessionId);
}
```

### resetInterruptedSessions() Implementation

```javascript
resetInterruptedSessions() {
  const result = this.db.prepare(`
    UPDATE session_state
    SET status = 'reset',
        reset_at = datetime('now')
    WHERE status = 'interrupted'
      AND updated_at < datetime('now', '-5 minutes')
  `).run();

  return result.changes;
}
```

---

## 11. 📌 ERROR HANDLING

| Condition                   | Action                                        |
| --------------------------- | --------------------------------------------- |
| No session detected         | Ask user for spec folder or start new session |
| Stale session (>7 days)     | Warn about staleness, confirm recovery        |
| Invalid CONTINUE_SESSION.md | Use memory file fallback                      |
| Missing state anchor        | Load full memory content, extract manually    |
| Context compaction detected | Show compaction message, load recent memory   |

---

## 12. 📌 QUICK REFERENCE

| Command                    | Result                            |
| -------------------------- | --------------------------------- |
| `/memory:continue`         | Auto-detect and recover session   |
| `/memory:continue :auto`   | Auto-recover without confirmation |
| `/memory:continue :manual` | Manual recovery with user prompts |

---

## 13. 🔍 USE CASES

### Use Case 1: Crash Recovery

```
User: /memory:continue

AI: 🔄 SESSION RECOVERY
    Scenario: Crash recovery (MCP restart detected)
    Spec: specs/082-speckit-reimagined/
    Last Action: Created /memory:continue command file
    Next Steps: Verify structure, test scenarios

    ✅ Context restored. Ready to continue.
```

### Use Case 2: Compaction Recovery

```
User: [System message: "Please continue from where we left off..."]

AI: ⚠️ CONTEXT COMPACTION DETECTED

    Detected active session:
      Spec: specs/082-speckit-reimagined/
      Last Activity: 30 minutes ago

    Run /memory:continue to restore context and continue.

User: /memory:continue

AI: [Loads state from memory file, presents continuation options]
```

### Use Case 3: Session Timeout

```
User: /memory:continue

AI: 🔄 SESSION RECOVERY
    Scenario: Session timeout (returned after 4 hours)
    Spec: specs/082-speckit-reimagined/
    Last Action: Created /memory:continue command file

    ⚠️ Note: Codebase may have changed since last session.

    A) Continue from last action
    B) Review changes first
    C) Fresh start
```

---

## 14. 🔗 RELATED COMMANDS

- `/spec_kit:resume` - Resume work on spec folder (broader scope, includes planning)
- `/spec_kit:handover` - Create handover for session continuity
- `/memory:context` - Search memories for context
- `/memory:manage` - Create checkpoint for rollback

---

## 15. 📌 NEXT STEPS

After recovery completes:

| Condition                 | Suggested Action                       |
| ------------------------- | -------------------------------------- |
| Crash recovery successful | Continue from last action              |
| Compaction recovery       | Verify context accuracy, then continue |
| Timeout after >4 hours    | Review codebase changes first          |
| Blockers detected         | Address blockers before continuing     |
| Progress <50%             | Review plan.md, verify alignment       |
| Progress >90%             | Verify completion criteria             |

---

## 16. 🔧 CONFIGURATION

Recovery behavior can be customized via session state:

| Setting                 | Default    | Description                          |
| ----------------------- | ---------- | ------------------------------------ |
| `auto_recovery_enabled` | true       | Enable automatic recovery detection  |
| `stale_session_days`    | 7          | Warn if session older than N days    |
| `compaction_signal`     | "continue" | Text pattern to detect compaction    |
| `state_anchor_required` | false      | Require state anchor in memory files |

---

## 17. 📚 FULL DOCUMENTATION

For comprehensive session management documentation:
`.opencode/skill/system-spec-kit/SKILL.md`

---

## 18. 📌 RECOVERY PRIORITIES

**Priority order for context sources:**

1. **CONTINUE_SESSION.md** (if <24h old) - Highest fidelity
2. **Memory file with state anchor** - Targeted state extraction
3. **Most recent memory file (full)** - Complete context
4. **checklist.md progress** - Minimal state reconstruction
5. **User input** - Fallback when automated recovery fails

**Token Efficiency:**
- CONTINUE_SESSION.md: ~200-300 tokens
- State anchor: ~150-200 tokens
- Full memory file: ~500-1000 tokens
- User input: Variable

---

## 19. 📌 SESSION ISOLATION

**Security Considerations:**

- Each recovery session is isolated
- Session IDs prevent cross-session data leakage
- CONTINUE_SESSION.md contains no secrets
- Memory files filtered by spec folder scope

**Validation:**
- Verify spec folder exists before loading
- Validate session ID format
- Check file timestamps for staleness
- Confirm user owns spec folder (multi-user systems)
