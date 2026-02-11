---
description: Create session handover document for continuing work in a new conversation
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** Handover uses only 1 user interaction (all questions asked together).

---

## 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for spec folder in $ARGUMENTS:
   ├─ IF $ARGUMENTS has path → validate path exists
   └─ IF $ARGUMENTS is empty → auto-detect from recent memory files

2. Auto-detect spec folder if needed:
   - Glob("specs/**/memory/*.md") → Sort by modification time, take first
   - IF found: spec_path = extracted path, detection_method = "recent"
   - IF not found: detection_method = "none" (include Q0 in prompt)

3. Run pre-handover validation (background, strict mode):
   - Check: ANCHORS_VALID, PRIORITY_TAGS, PLACEHOLDER_FILLED
   - Store: validation_status = [passed/warnings/errors]

4. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Spec Folder** (if not detected/provided):                │
   │    No active session detected. Available spec folders:         │
   │    [list folders if found]                                     │
   │    A) List available spec folders and select one               │
   │    B) Cancel handover                                          │
   │                                                                │
   │ **Q1. Confirm Detected Session** (if auto-detected):            │
   │    Detected: [spec_path] (last activity: [date])               │
   │    A) Yes, create handover for this session                    │
   │    B) No, select a different spec folder                       │
   │    C) Cancel                                                   │
   │                                                                │
   │ **Q2. Validation Issues** (if validation found warnings/errors)│
   │    Pre-handover validation found issues:                       │
   │    [list warnings/errors]                                      │
   │    A) Fix issues before handover                               │
   │    B) Proceed anyway (warnings transfer to next session)       │
   │    C) Cancel                                                   │
   │                                                                │
   │ Reply with answers, e.g.: "A" or "A, B"                        │
   └────────────────────────────────────────────────────────────────┘

5. WAIT for user response (DO NOT PROCEED)

6. Parse response and store ALL results:
   - spec_path = [from Q0/Q1 or auto-detected or $ARGUMENTS]
   - detection_method = [provided/recent]
   - validation_choice = [from Q2: FIX/BYPASS, or N/A if passed]

7. Handle redirects if needed:
   - IF validation_choice == FIX → Fix issues, then re-run validation
   - IF Q0/Q1 == B → Re-prompt with folder selection only
   - IF Q0/Q1 == C or Q2 == C → Cancel workflow

8. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER assume spec folder without user confirmation when path was invalid
⛔ NEVER skip pre-handover validation
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `spec_path = ________________` | `detection_method = ________________`
- `validation_status = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD             | REQUIRED | YOUR VALUE | SOURCE                          |
| ----------------- | -------- | ---------- | ------------------------------- |
| spec_path         | ✅ Yes    | ______     | Q0/Q1 or auto-detect or $ARGS   |
| detection_method  | ✅ Yes    | ______     | Auto-determined                 |
| validation_status | ✅ Yes    | ______     | Validation check (Q2 if issues) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "# SpecKit Handover" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Assumed a spec folder without user confirmation when path was invalid
- Skipped pre-handover validation
- Created handover without gathering context first
- Did not display the created file path and continuation instructions

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
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

### Workflow Diagram

```mermaid
flowchart TD
    subgraph SETUP["🔒 UNIFIED SETUP PHASE"]
        A["/spec_kit:handover"] --> B{"$ARGUMENTS<br/>has path?"}
        B -->|Yes| C["Validate path exists"]
        B -->|No| D["Auto-detect from<br/>recent memory files"]
        C --> E["Pre-handover validation"]
        D --> E
        E --> F{"Validation<br/>passed?"}
        F -->|Errors/Warnings| G["Ask Q2: Fix or Bypass"]
        F -->|Passed| H["Consolidated prompt<br/>Q0/Q1 as needed"]
        G --> H
    end

    subgraph GATE["⛔ PHASE STATUS VERIFICATION"]
        H --> I{"All fields set?<br/>spec_path, detection_method,<br/>validation_status"}
        I -->|No| J["Re-prompt for<br/>missing values"]
        J --> I
        I -->|Yes| K["✅ PHASES PASSED"]
    end

    subgraph DISPATCH["🔀 SUB-AGENT DELEGATION"]
        K --> L{"Task tool<br/>available?"}
        L -->|Yes| M["Dispatch @handover<br/>via Task tool"]
        M --> N{"Sub-agent<br/>result?"}
        N -->|status: OK| O["Extract:<br/>file_path, attempt_number,<br/>last_action, next_action"]
        N -->|status: FAIL| P["FALLBACK"]
        N -->|Timeout/Error| P
        L -->|No| P
    end

    subgraph FALLBACK["⚡ FALLBACK EXECUTION"]
        P --> Q["Log: Sub-agent unavailable"]
        Q --> R["Step 1: Validate Spec<br/>(use phase outputs)"]
        R --> S["Step 2: Gather Context<br/>spec.md, plan.md, memory/*.md"]
        S --> T["Step 3: Create Handover<br/>Check existing, calc attempt #"]
    end

    subgraph RESULT["📊 DISPLAY RESULT"]
        O --> U["Step 4: Display Result"]
        T --> U
        U --> V["Show handover.md path"]
        V --> W["Show continuation prompt:<br/>CONTINUATION - Attempt N"]
        W --> X["Suggest /spec_kit:resume"]
        X --> Y["✅ STATUS=OK"]
    end

    classDef core fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff

    class A,B,C,D,E,F,G,H core
    class I,J,K gate
    class L,M,N,O,P,Q,R,S,T verify
    class U,V,W,X,Y core
```

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, execute the workflow steps below. This command uses a simplified YAML configuration (see Related Files) and operates in single-mode (no auto/confirm variants).

> **Note:** Unlike other spec_kit commands, handover operates in a single mode and delegates to a sub-agent (see Section 7) rather than switching between auto/confirm YAML prompts.

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

The handover.md should include these 7 sections (aligned with YAML template):
1. **Session Summary** - Date, duration, objective, progress percentage, key accomplishments
2. **Current State** - Phase, active file/line, last action, system state
3. **Completed Work** - Tasks done, files modified, tests passed, docs updated
4. **Pending Work** - Immediate next action, remaining tasks, effort estimates, dependencies
5. **Key Decisions** - Decisions made, rationale, alternatives rejected, impact
6. **Blockers & Risks** - Current blockers, risks identified, mitigation strategies
7. **Continuation Instructions** - Resume command, files to review, context to load

### Step 4: Display Result

Show the created file path and continuation instructions.

---

## 5. 📊 OUTPUT FORMATS

**Output Location:** `[spec_folder]/handover.md`

The handover file is created in the spec folder root, NOT in memory/.

> **Crash Recovery Note:** For emergency crash recovery scenarios (unexpected session termination), the same content format can be saved as `CONTINUE_SESSION.md` in the project root. This file is checked by `/spec_kit:resume` and `/memory:continue` for rapid recovery. The handover.md in spec folder is the standard location; CONTINUE_SESSION.md is for edge cases where spec folder context was lost.

> **MANDATORY:** After creating the handover file, you **MUST** run:
> `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
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

The handover workflow delegates execution work to the dedicated `@handover` agent for token efficiency. The main agent handles validation and user interaction; the sub-agent handles context gathering and file generation.

**Agent File:** `.opencode/agent/handover.md`

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
  subagent_type: handover
  description: "Create handover document"
  prompt: |
    Create a handover document for spec folder: {spec_path}

    VALIDATED INPUTS:
    - spec_path: {spec_path}
    - detection_method: {detection_method}
    - validation_status: {validation}

    CONTEXT SOURCES (read in this priority):
    1. spec.md, plan.md, tasks.md (core definition - HIGH priority)
    2. checklist.md (progress tracking - MEDIUM priority)
    3. memory/*.md files (session context - HIGH priority)
    4. implementation-summary.md (completion status - MEDIUM priority)

    WORKFLOW:
    1. GATHER - Load context from spec folder files
    2. EXTRACT - Identify current phase, last action, next action, blockers, decisions
    3. DETERMINE - Check for existing handover.md, calculate attempt number
    4. GENERATE - Create handover.md using template
    5. WRITE - Save file to spec folder

    TEMPLATE: .opencode/skill/system-spec-kit/templates/handover.md

    REQUIRED SECTIONS (7 sections, aligned with YAML template):
    1. Session Summary (date, duration, objective, progress percentage, key accomplishments)
    2. Current State (phase, active file/line, last action, system state)
    3. Completed Work (tasks done, files modified, tests passed, docs updated)
    4. Pending Work (immediate next action, remaining tasks, effort estimates, dependencies)
    5. Key Decisions (decisions made, rationale, alternatives rejected, impact)
    6. Blockers & Risks (current blockers, risks identified, mitigation strategies)
    7. Continuation Instructions (resume command, files to review, context to load)

    RETURN (as your final message):
    ```json
    {
      "status": "OK",
      "file_path": "{spec_path}/handover.md",
      "attempt_number": [N],
      "last_action": "[actual value from context]",
      "next_action": "[actual value from context]",
      "spec_folder": "{spec_path}"
    }
    ```

    If any step fails, return:
    ```json
    {
      "status": "FAIL",
      "error": "[specific error description]"
    }
    ```

    CRITICAL: Never fabricate context. Read actual files. Replace all placeholders.
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
    result = Task(subagent_type="handover", description="Create handover document", prompt=SUB_AGENT_PROMPT)
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

### Why Dedicated @handover Agent?

| Benefit               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| Token efficiency      | Heavy context analysis happens in sub-agent context        |
| Cost optimization     | Model selected automatically based on task complexity      |
| Specialized prompting | Agent has handover-specific instructions and anti-patterns |
| Main agent responsive | User can see progress without waiting                      |
| Fallback safety       | Commands always work, even without Task tool               |
| Output verification   | Agent enforces JSON response format and content validation |

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

## 9. 🔗 RELATED RESOURCES

### Commands

| Command              | Relationship                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `/spec_kit:resume`   | Loads handover document to continue work                                                  |
| `/spec_kit:complete` | Start new feature (handover captures in-progress)                                         |
| `/memory:save`       | **Recommended companion** - Save semantic context to memory for search/retrieval          |
| `/memory:continue`   | Crash recovery - loads most recent CONTINUE_SESSION.md or handover context                |

> **Best Practice:** After creating handover.md, also run `/memory:save` to preserve semantic context for future searches. Handover files are for quick continuation; memory files enable semantic retrieval across sessions.

### Agents

| Agent          | Relationship                                     |
| -------------- | ------------------------------------------------ |
| `@handover`    | Dedicated sub-agent for this command             |
| `@orchestrate` | May coordinate handover in multi-agent workflows |
| `@speckit`     | Works with spec folders this command reads       |

### Files

| File                                                            | Purpose            |
| --------------------------------------------------------------- | ------------------ |
| `.opencode/agent/handover.md`                                   | Agent definition   |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | YAML configuration |
| `.opencode/skill/system-spec-kit/templates/handover.md`         | Output template    |

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

## 11. 🔌 CIRCUIT BREAKER

The circuit breaker isolates failing operations to prevent cascading failures during handover generation.

### States

| State     | Condition                        | Behavior                                 |
| --------- | -------------------------------- | ---------------------------------------- |
| CLOSED    | Normal operation                 | All operations proceed                   |
| OPEN      | 3+ consecutive failures          | Operations fail-fast, skip affected step |
| HALF-OPEN | After recovery_timeout_s (60s)   | Single test operation allowed            |

### Configuration

| Parameter          | Value | Description                                        |
| ------------------ | ----- | -------------------------------------------------- |
| failure_threshold  | 3     | Consecutive failures before OPEN state             |
| recovery_timeout_s | 60    | Seconds in OPEN state before trying HALF-OPEN      |
| success_to_close   | 1     | Successes needed in HALF-OPEN to close circuit     |

### Recovery Protocol

1. **OPEN state triggered**: Handover workflow halts with error summary
2. **Wait recovery_timeout_s**: System waits 60 seconds
3. **HALF-OPEN attempt**: Single retry of failed operation
4. **Success**: Reset to CLOSED, continue workflow
5. **Failure**: Return to OPEN, escalate to user

---

## 12. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[Any workflow] → /spec_kit:handover → [/spec_kit:resume]
```

**Explicit next step:**
→ `/spec_kit:resume [spec-folder-path]` (in new session)

---

## 13. 📌 NEXT STEPS

After handover is created, provide continuation instructions:

| Condition                 | Suggested Action                           | Reason                      |
| ------------------------- | ------------------------------------------ | --------------------------- |
| Handover created          | Copy continuation prompt                   | Ready for new session       |
| Ready to continue now     | `/spec_kit:resume [spec-folder-path]`      | Load context and continue   |
| Want to save more context | `/memory:save [spec-folder-path]`          | Preserve additional details |
| Starting new work         | `/spec_kit:complete [feature-description]` | Begin different feature     |

**ALWAYS** end with: "What would you like to do next?"