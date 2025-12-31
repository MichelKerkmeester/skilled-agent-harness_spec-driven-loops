---
description: Resume work on an existing spec folder - loads context, shows progress, and continues from last state
argument-hint: "[spec-folder-path] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> **Argument Format:** `/spec_kit:resume [spec-folder-path] [:auto|:confirm]`
> 
> Examples:
> - `/spec_kit:resume specs/007-feature/` - Interactive mode (default)
> - `/spec_kit:resume specs/007-feature/ :auto` - Auto mode
> - `/spec_kit:resume:auto specs/007-feature/` - Also valid (mode as suffix)

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** Resume uses 1-2 user interactions. Mode defaults to INTERACTIVE without asking.

---

## 🔒 PHASE 1: INPUT & SESSION DETECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

1. CHECK for spec folder in $ARGUMENTS:

├─ IF $ARGUMENTS contains a spec folder path:
│   │
│   ├─ Validate path exists: ls -d [spec_folder_input] 2>/dev/null
│   │
│   ├─ IF path exists:
│   │   ├─ Store as: spec_path
│   │   ├─ detection_method = "provided"
│   │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 3
│   │
│   └─ IF path NOT found:
│       ├─ SHOW: "Spec folder not found: [path]"
│       ├─ ASK: "Would you like to:"
│       │   ┌────────────────────────────────────────────────────────────┐
│       │   │ A) Try auto-detection (search for recent sessions)         │
│       │   │ B) Provide a different path                                │
│       │   │ C) Cancel                                                  │
│       │   └────────────────────────────────────────────────────────────┘
│       └─ WAIT for user response
│
└─ IF $ARGUMENTS is empty (auto-detect mode):
    │
    ├─ Find most recent memory file (Stateless - no .spec-active marker)
    │   Glob("specs/**/memory/*.md") → Results sorted by modification time, take first
    │
    ├─ IF session found:
    │   ├─ Store as: spec_path (extract from memory file path)
    │   ├─ detection_method = "recent"
    │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 3
    │
    └─ IF NO session found:
        ├─ SHOW: "No active session detected"
        ├─ ASK: "Would you like to:"
        │   ┌────────────────────────────────────────────────────────────┐
        │   │ A) List available spec folders and select one              │
        │   │ B) Start new workflow with /spec_kit:complete               │
        │   │ C) Cancel                                                  │
        │   └────────────────────────────────────────────────────────────┘
        └─ WAIT for user response

⛔ HARD STOP: DO NOT proceed until a valid spec_path is confirmed
```

**Phase 1 Output:** `spec_path = ________________` | `detection_method = [recent/provided]`

---

## 🔒 PHASE 2: CONTINUATION VALIDATION (Gate 0.5)

**STATUS: ☐ CONDITIONAL**

```
EXECUTE IF handoff pattern detected in $ARGUMENTS or recent user messages:

1. CHECK for "CONTINUATION - Attempt" pattern:
   ├─ IF detected:
   │   ├─ Parse: Spec folder path, Last Completed, Next Action
   │   │
│   ├─ VALIDATE against most recent memory file:
│   │   Glob("[spec_path]/memory/*.md") → Results sorted by modification time, take first
   │   │   $ Read memory file → Extract "Project State Snapshot" section
   │   │
   │   ├─ COMPARE claimed progress vs actual progress:
   │   │   - Claimed "Last Completed" matches memory "Last Action"?
   │   │   - Claimed "Next Action" matches memory "Next Action"?
   │   │
   │   ├─ IF mismatch:
   │   │   ├─ SHOW: "⚠️ State mismatch detected"
   │   │   │   Claimed: Last=[X], Next=[Y]
   │   │   │   Memory:  Last=[A], Next=[B]
   │   │   ├─ ASK: "Which is correct?"
   │   │   │   ┌──────────────────────────────────────────────────┐
   │   │   │   │ A) Use handoff claims                            │
   │   │   │   │ B) Use memory file state                          │
   │   │   │   │ C) Investigate first                              │
   │   │   │   └──────────────────────────────────────────────────┘
   │   │   └─ WAIT for user response
   │   │
   │   └─ IF validated OR no memory files:
   │       ├─ SHOW: "✅ Continuation validated"
   │       └─ SET STATUS: ✅ PASSED
   │
   └─ IF NO handoff pattern:
       └─ SET STATUS: ⏭️ N/A (not a continuation)

⛔ SOFT STOP: Can proceed after acknowledgment
```

> **Gate 3 Note:** The resume command inherently satisfies Gate 3 because it REQUIRES a spec folder (either provided or detected). No separate Gate 3 question needed.

---

## 🔒 PHASE 3: ARTIFACT VALIDATION & MODE SELECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 2 PASSES:

1. Check for required artifacts in spec_path:
   $ ls -la [spec_path]/

   Required (at least ONE must exist):
   - spec.md
   - plan.md OR tasks.md

2. CHECK command invocation for mode suffix:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS"
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE"
   └─ No suffix → execution_mode = "INTERACTIVE" (default for resume - safer)

3. IF required artifacts missing:
   ├─ SHOW: "Spec folder exists but missing required artifacts"
   ├─ ASK: "Would you like to:"
   │   ┌────────────────────────────────────────────────────────────┐
   │   │ A) Run /spec_kit:plan to create planning artifacts         │
   │   │ B) Select a different spec folder                          │
   │   │ C) Continue anyway (limited resume)                        │
   │   └────────────────────────────────────────────────────────────┘
   └─ WAIT for user response

4. IF artifacts exist:
   ├─ Store artifact status
   ├─ Store execution_mode
   └─ SET STATUS: ✅ PASSED

Note: Unlike other workflows, resume defaults to INTERACTIVE without asking,
since it's a context-recovery operation where user review is beneficial.

⛔ HARD STOP: DO NOT proceed until artifacts are validated or user chooses option
```

**Phase 3 Output:** `artifacts_valid = [yes/partial/no]` | `available_artifacts = [list]` | `execution_mode = ________________`

---

## 🔒 PHASE 4: MEMORY LOADING (Gate 4)

**STATUS: ☐ CONDITIONAL**

```
EXECUTE AFTER PHASE 3 PASSES:

1. CHECK for memory files in spec folder:
   $ ls -la [spec_path]/memory/*.md 2>/dev/null

2. IF memory files exist:
   │
   ├─ IF execution_mode = "AUTONOMOUS":
   │   ├─ Auto-load most recent memory file
   │   ├─ SHOW: "📚 Auto-loaded: [filename]"
   │   └─ SET STATUS: ✅ PASSED
   │
   └─ IF execution_mode = "INTERACTIVE":
       ├─ Count available memory files
       ├─ SHOW: "Found [N] memory file(s) in [spec_path]/memory/"
       ├─ ASK: "Memory Loading:"
       │   ┌────────────────────────────────────────────────────────────┐
       │   │ A) Load most recent memory                                 │
       │   │ B) Load all memories (1-3 max)                             │
       │   │ C) Select specific memory                                   │
       │   │ D) Skip memory loading                                     │
       │   └────────────────────────────────────────────────────────────┘
       ├─ WAIT for user response
       │
       ├─ IF A: Load most recent memory file → Display summary
       ├─ IF B: Load up to 3 most recent files → Display summaries
       ├─ IF C: List all memory files → Wait for selection → Load
       └─ IF D: Skip → Proceed without memory context
       │
       └─ SET STATUS: ✅ PASSED

3. IF NO memory files exist:
   ├─ SHOW: "ℹ️  No memory files found in [spec_path]/memory/"
   └─ SET STATUS: ⏭️ N/A (no memories to load)

Note: This implements Gate 4 from AGENTS.md Section 2.
```

**Phase 4 Output:** `memory_loaded = [yes/no/skipped]` | `memory_files = [list or none]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                       | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE                       |
| --------------------------- | ----------------- | ----------- | ---------------------------------- |
| PHASE 1: INPUT & SESSION    | ✅ PASSED          | ______      | spec_path: ______ / method: ______ |
| PHASE 2: CONTINUATION CHECK | ✅ PASSED or ⏭️ N/A | ______      | validated: ______ / source: ______ |
| PHASE 3: ARTIFACTS & MODE   | ✅ PASSED          | ______      | artifacts: ______ / mode: ______   |
| PHASE 4: MEMORY LOADING     | ✅ PASSED or ⏭️ N/A | ______      | memory: ______ / files: ______     |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# SpecKit Resume" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Proceeded without validating artifacts exist (Phase 3)
- Assumed a spec folder without user confirmation when path was invalid
- Skipped Gate 4 memory loading question when memory files exist (Phase 4)
- Did not wait for user A/B/C/D response before loading memories in interactive mode
- Did not display progress calculation
- Claimed "resumed" without showing continuation options

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
```

---

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER. Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## Auto Mode (4 steps)

| STEP | NAME               | STATUS | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | ------ | -------------------- | ----------------------- |
| 1    | Session Detection  | ☐      | spec_path confirmed  | Path validated          |
| 2    | Load Memory        | ☐      | context_loaded       | Most recent file loaded |
| 3    | Calculate Progress | ☐      | progress_percentages | Tasks/checklist counted |
| 4    | Present Resume     | ☐      | resume_summary       | Summary displayed       |

## Confirm Mode (5 steps)

| STEP | NAME               | STATUS | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | ------ | -------------------- | ----------------------- |
| 1    | Session Detection  | ☐      | spec_path confirmed  | Path validated          |
| 2    | Memory Selection   | ☐      | user_choice          | User selected A/B/C/D   |
| 3    | Load Memory        | ☐      | context_loaded       | Selected file(s) loaded |
| 4    | Calculate Progress | ☐      | progress_percentages | Tasks/checklist counted |
| 5    | Present Resume     | ☐      | resume_summary       | Summary displayed       |

---

# SpecKit Resume

Resume work on an existing spec folder by detecting the last active session, loading context from memory files, and presenting progress with clear next steps.

---

```yaml
role: Expert Developer using Smart SpecKit for Session Recovery
purpose: Resume interrupted work with full context restoration and progress visibility
action: Run 4-5 step resume workflow from session detection through continuation options

operating_mode:
  workflow: sequential_4_or_5_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: memory_selection_in_confirm_mode
  tracking: progress_calculation
  validation: artifact_based
```

---

## 1. 🎯 PURPOSE

Resume work on an existing spec folder by automatically detecting the last active session, loading context from memory files, and presenting progress with clear next steps. This is a utility workflow for session continuity.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path with optional :auto/:confirm mode suffix
**Outputs:** Resumed session context + progress display + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`

The YAML contains detailed step-by-step workflow, output formats, and all configuration.

---

## 4. 📊 OUTPUT FORMATS

### Success Output

```text
╭─────────────────────────────────────────────────────────────╮
│ ✅ SESSION RESUMED                                          │
├─────────────────────────────────────────────────────────────┤
│ Spec: specs/014-context-aware-permission-system/            │
│ Context: Loaded from session-20251206-203430.md             │
│ Progress: 96% complete (49/51 tasks)                        │
│                                                             │
│ Ready to continue. What would you like to work on?          │
╰─────────────────────────────────────────────────────────────╯
```

### No Session Found

```text
╭─────────────────────────────────────────────────────────────╮
│ ⚠️  NO ACTIVE SESSION                                       │
├─────────────────────────────────────────────────────────────┤
│ No recent spec folders with incomplete tasks.               │
├─────────────────────────────────────────────────────────────┤
│ OPTIONS                                                     │
│   • Run /spec_kit:complete to start a new workflow           │
│   • Specify folder: /spec_kit:resume specs/014-*/           │
╰─────────────────────────────────────────────────────────────╯
```

### Stale Session (>7 days)

```text
╭─────────────────────────────────────────────────────────────╮
│ ⚠️  STALE SESSION DETECTED                                  │
├─────────────────────────────────────────────────────────────┤
│ Spec: specs/014-context-aware-permission-system/            │
│ Last Activity: 8 days ago                                   │
│ Context may be outdated. Codebase changes likely.           │
├─────────────────────────────────────────────────────────────┤
│ OPTIONS                                                     │
│   A) Resume anyway - Load context and continue              │
│   B) Fresh start - Keep artifacts, restart workflow          │
│   C) Review first - Show me what changed                     │
│   D) Cancel                                                 │
╰─────────────────────────────────────────────────────────────╯
```

---

## 5. 📌 REFERENCE

**Full details in YAML prompts:**
- Workflow steps and activities
- Progress calculation logic
- Memory loading options
- Session detection priority
- Stale session handling
- Mode behaviors (auto/confirm)
- Failure recovery procedures

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 6. 🔧 MCP TOOL USAGE

The resume workflow uses semantic memory MCP tools directly for context loading. **CRITICAL:** Call MCP tools directly - NEVER through Code Mode.

### Memory Tools

| Tool                    | Purpose                                    | Usage                                              |
| ----------------------- | ------------------------------------------ | -------------------------------------------------- |
| `memory_search`         | Find and load context from semantic memory | Query with `includeContent: true` to embed content |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms)       | Quick session detection by keywords                |
| `memory_list`           | Browse stored memories with pagination     | Discover available memories and find IDs           |
| `memory_stats`          | Get memory system statistics               | Show resume status and counts                      |
| `memory_delete`         | Delete a memory by ID or spec folder       | Use `dryRun: true` for safe preview before delete  |
| `memory_update`         | Update existing memory metadata            | Modify title, triggers, or importance tier         |
| `memory_validate`       | Record validation feedback for memories    | Track usefulness to adjust confidence scores       |
| `memory_index_scan`     | Scan workspace for new/changed files       | Bulk index after creating multiple memory files    |
| `memory_health`         | Check health status of memory system       | Verify database, embeddings, and index status      |

### Checkpoint Tools

| Tool                | Purpose                              | Usage                                    |
| ------------------- | ------------------------------------ | ---------------------------------------- |
| `checkpoint_create` | Create named checkpoint of state     | Snapshot memory state before major work  |
| `checkpoint_list`   | List all available checkpoints       | Browse saved checkpoints with metadata   |
| `checkpoint_delete` | Delete a checkpoint                  | Clean up old or unused checkpoints       |

**Note:** There is no `memory_load` tool. Use `memory_search` with `includeContent: true` to load memory content directly in search results.

### Example Invocations

```typescript
// Load memories with content embedded in results (CORRECT)
spec_kit_memory_memory_search({ 
  specFolder: "014-auth-system", 
  includeContent: true,
  limit: 5
})

// Fast trigger matching for session detection
spec_kit_memory_memory_match_triggers({ prompt: "auth system work" })

// List available memories in a spec folder
spec_kit_memory_memory_list({ specFolder: "014-auth-system" })

// Delete with dry run preview first (safe)
spec_kit_memory_memory_delete({ id: 42, dryRun: true })

// Update memory metadata
spec_kit_memory_memory_update({ id: 42, importanceTier: "critical" })

// Record validation feedback
spec_kit_memory_memory_validate({ id: 42, wasUseful: true })

// Scan for new memory files
spec_kit_memory_memory_index_scan({ specFolder: "014-auth-system" })

// Check system health
spec_kit_memory_memory_health({})

// Create checkpoint before major changes
spec_kit_memory_checkpoint_create({ name: "pre-refactor-backup" })

// List available checkpoints
spec_kit_memory_checkpoint_list({})

// NEVER do this (WRONG)
call_tool_chain(`memory.memory_search(...)`)  // NO - not through Code Mode
spec_kit_memory_memory_load(...)              // NO - tool doesn't exist
```

### Session Detection Priority

1. CLI argument (explicit path provided)
2. Most recent memory file in `specs/*/memory/`

### Context Loading Priority

1. handover.md (if exists, <24h old)
2. Recent memory/*.md files
3. checklist.md for progress state

**Note:** Stateless architecture - no `.spec-active` marker file used.

### Validation on Resume

After loading context, validation runs automatically to check the spec folder state.

This catches:
- Missing files that may have been deleted
- Broken memory anchors from incomplete saves
- Unfilled placeholders from previous session

---

## 7. 🔀 PARALLEL DISPATCH

The resume workflow is a **utility workflow** and does NOT use parallel dispatch. All steps execute sequentially:

- **Auto mode**: 4 sequential steps
- **Confirm mode**: 5 sequential steps with user checkpoints

Parallel dispatch is only used in implementation-heavy workflows (`/spec_kit:complete`, `/spec_kit:implement`, `/spec_kit:research`).

---

## 8. 🔍 EXAMPLES

**Example 1: Auto-detect and resume**
```
/spec_kit:resume
```
→ Detects from most recent memory file

**Example 2: Resume specific folder**
```
/spec_kit:resume specs/014-context-aware-permission-system/
```
→ Resumes the specified spec folder

**Example 3: Resume in autonomous mode**
```
/spec_kit:resume:auto
```
→ Auto-loads most recent memory, skips selection prompt

**Example 4: Resume with full prompts**
```
/spec_kit:resume:confirm specs/014-*/
```
→ Interactive mode with memory selection options

---

## 9. 🔗 RELATED COMMANDS

| Command               | Relationship                                        |
| --------------------- | --------------------------------------------------- |
| `/spec_kit:complete`  | Start new feature (resume continues existing)       |
| `/spec_kit:plan`      | Create planning artifacts (if missing on resume)    |
| `/spec_kit:implement` | Execute implementation (can be called after resume) |