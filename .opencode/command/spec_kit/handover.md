---
description: Create session handover document for continuing work in a new conversation
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** Handover uses 1-2 user interactions maximum.

---

## 🔒 PHASE 1: INPUT & SPEC DETECTION

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
│   │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
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
    │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
    │
    └─ IF NO session found:
        ├─ SHOW: "No active session detected"
        ├─ ASK: "Would you like to:"
        │   ┌────────────────────────────────────────────────────────────┐
        │   │ A) List available spec folders and select one              │
        │   │ B) Cancel handover                                         │
        │   └────────────────────────────────────────────────────────────┘
        └─ WAIT for user response

**STOP HERE** - Wait for user to provide or confirm a valid spec folder path before continuing.

⛔ HARD STOP: DO NOT proceed until a valid spec_path is confirmed
```

**Phase 1 Output:** `spec_path = ________________` | `detection_method = [recent/provided]`

---

## 🔒 PHASE 2: PRE-HANDOVER VALIDATION

**STATUS: ☐ BLOCKED**

Before creating handover, validation runs automatically to ensure clean state.

Strict mode is used to ensure no warnings are passed to the next session.

**Key checks before handover:**
- **ANCHORS_VALID** - Memory files have balanced anchors
- **PRIORITY_TAGS** - Remaining tasks are prioritized  
- **PLACEHOLDER_FILLED** - No incomplete placeholders

```
EXECUTE AFTER PHASE 1 PASSES:

1. Validation runs automatically (strict mode)

2. IF validation passes:
   └─ SET STATUS: ✅ PASSED → Proceed to workflow

3. IF validation fails (exit 1 or 2):
   ├─ SHOW: Validation warnings/errors
   ├─ ASK: "Would you like to:"
   │   ┌────────────────────────────────────────────────────────────┐
   │   │ A) Fix issues before handover                              │
   │   │ B) Proceed anyway (warnings will transfer to next session) │
   │   │ C) Cancel                                                  │
   │   └────────────────────────────────────────────────────────────┘
   └─ WAIT for user response

**STOP HERE** - Wait for validation to complete or user to confirm bypass before continuing.

⛔ HARD STOP: DO NOT proceed until validation is complete or user confirms bypass
```

**Phase 2 Output:** `validation = [PASSED/BYPASSED/FIXED]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                 | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                       |
| --------------------- | --------------- | ----------- | ---------------------------------- |
| PHASE 1: INPUT & SPEC | ✅ PASSED        | ______      | spec_path: ______ / method: ______ |
| PHASE 2: VALIDATION   | ✅ PASSED        | ______      | validation: ______                 |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED?
│   ├─ YES → Proceed to "# SpecKit Handover" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Assumed a spec folder without user confirmation when path was invalid
- Proceeded without validating spec path exists (Phase 1)
- Skipped pre-handover validation (Phase 2)
- Created handover without gathering context first
- Did not display the created file path and continuation instructions

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

## Workflow Steps (4 steps)

| STEP | NAME            | STATUS | REQUIRED OUTPUT        | VERIFICATION                |
| ---- | --------------- | ------ | ---------------------- | --------------------------- |
| 1    | Validate Spec   | ☐      | spec_path confirmed    | Path validated              |
| 2    | Gather Context  | ☐      | context_summary        | Session context loaded      |
| 3    | Create Handover | ☐      | handover.md            | File created in spec folder |
| 4    | Display Result  | ☐      | continuation_displayed | Instructions shown to user  |

---

# SpecKit Handover

Create session handover document for continuing work in a new conversation.

---

```yaml
role: Expert Developer using Smart SpecKit for Session Handover
purpose: Create continuation documentation for session branching and context preservation
action: Run 4 step handover workflow from context gathering through document creation

operating_mode:
  workflow: sequential_4_step
  workflow_compliance: MANDATORY
  tracking: file_creation
  validation: file_exists_check
```

---

## 1. 🎯 PURPOSE

Create a handover document that enables seamless session continuation. The handover captures session context, decisions, blockers, and next steps for the next session.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path
**Outputs:** `handover.md` + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name            | Purpose                              | Outputs           |
| ---- | --------------- | ------------------------------------ | ----------------- |
| 1    | Validate Spec   | Confirm spec folder exists           | spec_path         |
| 2    | Gather Context  | Load session context                 | context_summary   |
| 3    | Create Handover | Generate handover.md                 | handover.md       |
| 4    | Display Result  | Show file path and continuation info | user_instructions |

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, execute the workflow steps below. This command uses direct execution without YAML asset files due to its single-mode operation (no auto/confirm variants).

> **Note:** Unlike other spec_kit commands, handover operates in a single mode and delegates to a sub-agent (see Section 7) rather than loading YAML prompts.

### Step 1: Validate Spec

Confirm the spec folder path exists and contains relevant context files.

### Step 2: Gather Context

Load session context from:
- `spec.md` / `plan.md` / `tasks.md` (project definition)
- `checklist.md` (current progress)
- `memory/*.md` files (session context)

### Step 3: Create Handover

Generate `handover.md` using the template:

**Template**: `.opencode/skill/system-spec-kit/templates/handover.md`

#### Attempt Counter Logic

Before creating handover.md, determine the attempt number:

1. Check if handover.md already exists in the spec folder
2. If exists, read the current attempt number from the file
3. Increment by 1 for the new handover
4. If no existing file, start at Attempt 1

**Implementation:**
```
IF handover.md exists in [spec_folder]:
  Extract current [N] from "CONTINUATION - Attempt [N]"
  New attempt = N + 1
ELSE:
  New attempt = 1
```

#### Handover Sections

The handover.md should include:
1. **Handover Summary** - Session ID, phase completed, timestamp
2. **Context Transfer** - Key decisions, blockers, files modified
3. **For Next Session** - Starting point, priority tasks, context to load
4. **Validation Checklist** - Pre-handover verification
5. **Session Notes** - Free-form notes

### Step 4: Display Result

Show the created file path and continuation instructions.

---

## 5. 📊 OUTPUT FORMATS

**Output Location:** `[spec_folder]/handover.md`

The handover file is created in the spec folder root, NOT in memory/.

> **💡 Tip:** After creating the handover file, consider running:
> `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]`
> to preserve full semantic context for future searches. Handover files are for quick continuation; memory files are for semantic retrieval.

### Handover Success

```text
╭─────────────────────────────────────────────────────────────╮
│ ✅ HANDOVER CREATED                                         │
├─────────────────────────────────────────────────────────────┤
│ File: specs/014-auth-feature/handover.md                    │
├─────────────────────────────────────────────────────────────┤
│ TO CONTINUE IN NEW SESSION:                                 │
│                                                             │
│ /spec_kit:resume specs/014-auth-feature/                    │
│                                                             │
│ Or paste this handoff:                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CONTINUATION - Attempt 1                                │ │
│ │ Spec: specs/014-auth-feature/                           │ │
│ │ Last: [Last completed action]                           │ │
│ │ Next: [Next pending action]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
╰─────────────────────────────────────────────────────────────╯
```

### No Spec Folder Found

```text
╭─────────────────────────────────────────────────────────────╮
│ ⚠️  NO ACTIVE SESSION                                       │
├─────────────────────────────────────────────────────────────┤
│ No recent spec folders found for handover.                  │
├─────────────────────────────────────────────────────────────┤
│ OPTIONS                                                     │
│   • Specify folder: /spec_kit:handover specs/014-*/         │
│   • Start new work: /spec_kit:complete                      │
╰─────────────────────────────────────────────────────────────╯
```

---

## 6. 📌 REFERENCE

**Template:** `.opencode/skill/system-spec-kit/templates/handover.md`

**See also:** AGENTS.md Section 2 (Compaction Recovery edge case, Context Health suggestions).

---

## 7. 🔀 SUB-AGENT DELEGATION

The handover workflow delegates execution work to a sub-agent for token efficiency. The main agent handles validation and user interaction; the sub-agent handles context gathering and file generation.

### Delegation Architecture

```
Main Agent (reads command):
├── PHASE 1: Input & Spec Detection (validation)
├── PHASE 2: Pre-Handover Validation
├── DISPATCH: Task tool with sub-agent
│   ├── Sub-agent gathers context
│   ├── Sub-agent creates handover.md
│   └── Sub-agent returns result
├── FALLBACK (if Task unavailable):
│   └── Execute Steps 1-3 directly
└── Step 4: Display Result (always main agent)
```

### Sub-Agent Execution

**WHEN phases pass, dispatch to sub-agent:**

```
DISPATCH SUB-AGENT:
  tool: Task
  subagent_type: general
  description: "Create handover document"
  prompt: |
    Create a handover document for spec folder: {spec_path}
    
    VALIDATED INPUTS:
    - spec_path: {spec_path}
    - detection_method: {detection_method}
    
    TASKS TO EXECUTE:
    1. Load context from spec folder:
       - Read spec.md, plan.md, tasks.md, checklist.md (if exist)
       - Read memory/*.md files for session context
       - Extract current phase, blockers, key decisions
    
    2. Determine attempt number:
       - Check if {spec_path}/handover.md exists
       - If exists: extract current attempt N, increment to N+1
       - If not exists: start at attempt 1
    
    3. Generate handover.md using template:
       - Template: .opencode/skill/system-spec-kit/templates/handover.md
       - Include: session summary, context transfer, next steps, validation checklist
    
    4. Write file to: {spec_path}/handover.md
    
    RETURN (as your final message):
    ```json
    {
      "status": "OK",
      "file_path": "{spec_path}/handover.md",
      "attempt_number": [N],
      "last_action": "[extracted from context]",
      "next_action": "[extracted from context]",
      "spec_folder": "{spec_path}"
    }
    ```
    
    If any step fails, return:
    ```json
    {
      "status": "FAIL",
      "error": "[error description]"
    }
    ```
    
    Tools you can use: Read, Write, Glob, Bash
```

### Fallback Logic

**FALLBACK triggers if:**
- Task tool call returns error
- Task tool call times out
- Sub-agent returns `status: FAIL`

**FALLBACK behavior:**
```
WHEN fallback triggers:
├── Log: "Sub-agent unavailable, executing directly"
├── Execute Steps 1-3 directly (current workflow behavior)
└── Continue to Step 4: Display Result
```

### Execution Flow

```
IF phases passed:
  TRY:
    result = Task(subagent_type="general", prompt=SUB_AGENT_PROMPT)
    IF result.status == "OK":
      file_path = result.file_path
      attempt_number = result.attempt_number
      last_action = result.last_action
      next_action = result.next_action
      → Proceed to Step 4: Display Result
    ELSE:
      → GOTO fallback
  CATCH (Task unavailable or error):
    → GOTO fallback

fallback:
  Log: "Fallback: executing handover steps directly"
  Execute Step 1: Validate Spec (use phase outputs)
  Execute Step 2: Gather Context
  Execute Step 3: Create Handover
  → Proceed to Step 4: Display Result
```

### Why Sub-Agent?

| Benefit | Description |
|---------|-------------|
| Token efficiency | Heavy context analysis happens in sub-agent context |
| Main agent responsive | User can see progress without waiting |
| Fallback safety | Commands always work, even without Task tool |
| Parallel potential | Future: multiple handovers could run in parallel |

---

## 8. 🔍 EXAMPLES

**Example 1: Auto-detect handover**
```
/spec_kit:handover
```
→ Auto-detects recent spec folder, creates handover.md

**Example 2: Specific folder handover**
```
/spec_kit:handover specs/014-auth-feature/
```
→ Creates handover.md in specified folder

---

## 9. 🔗 RELATED COMMANDS

| Command              | Relationship                                       |
| -------------------- | -------------------------------------------------- |
| `/spec_kit:resume`   | Loads handover document to continue work           |
| `/spec_kit:complete` | Start new feature (handover captures in-progress)  |
| `/memory:save`       | Save context to memory (handover is for branching) |

---

## 10. 📌 INTEGRATION

### Context Health Suggestions

Long sessions benefit from periodic handover suggestions:

- **Tier 1** (15 exchanges): "Consider /spec_kit:handover soon"
- **Tier 2** (25 exchanges): "Recommend /spec_kit:handover now"
- **Tier 3** (35 exchanges): "Handover strongly recommended"

### Compaction Recovery (AGENTS.md Section 2)

When context compaction is detected (system message contains "Please continue the conversation..."), the handover format is displayed:

```
CONTINUATION - Attempt [N]
Spec: [CURRENT_SPEC_PATH]
Last: [MOST_RECENT_COMPLETED_TASK]
Next: [NEXT_PENDING_TASK]

Run /spec_kit:handover to save handover.md, then in new session:
/spec_kit:resume [spec-path]
```

### Keyword Triggers

Proactive `/spec_kit:handover` suggestion on session-ending keywords:
- "stopping", "done", "finished", "break", "later"
- "forgetting", "remember", "context", "losing track"

---

## 11. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[Any workflow] → /spec_kit:handover → [/spec_kit:resume]
```

**Explicit next step:**
→ `/spec_kit:resume [spec-folder-path]` (in new session)

---

## 12. 📌 NEXT STEPS

After handover is created, provide continuation instructions:

| Condition | Suggested Action | Reason |
|-----------|------------------|--------|
| Handover created | Copy continuation prompt | Ready for new session |
| Ready to continue now | `/spec_kit:resume [spec-folder-path]` | Load context and continue |
| Want to save more context | `/memory:save [spec-folder-path]` | Preserve additional details |
| Starting new work | `/spec_kit:complete [feature-description]` | Begin different feature |

**ALWAYS** end with: "What would you like to do next?"