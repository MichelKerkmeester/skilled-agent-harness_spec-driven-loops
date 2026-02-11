---
description: Delegate debugging to a specialized sub-agent with full context handoff. Always asks for model selection first.
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together).

**Key Rule:** Model selection is MANDATORY and included in the consolidated prompt.

---

## 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for spec folder in $ARGUMENTS:
   ├─ IF $ARGUMENTS contains a spec folder path → validate and store
   └─ IF $ARGUMENTS is empty → auto-detect from recent memory files

2. Auto-detect spec folder if needed:
   - Glob("specs/**/memory/*.md") → Sort by modification time, take first
   - IF found: spec_path = extracted path, detection_method = "recent"
   - IF not found: detection_method = "none" (include Q0 in prompt)

3. GATHER ERROR CONTEXT from conversation (background scan):
   - Scan for: error messages, stack traces, affected files, previous attempts
   - IF found: Store as error_message, affected_files, previous_attempts
   - IF not found: Include Q1 in prompt

4. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Spec Folder** (if not detected/provided):                │
   │    Available spec folders: [list if found]                     │
   │    A) Use: [most recent if detected]                           │
   │    B) Select different folder (specify path)                   │
   │    C) Debug without spec folder (ad-hoc mode)                  │
   │    D) Cancel                                                   │
   │                                                                │
   │ **Q1. Error Context** (if not found in conversation):          │
   │    What error are you debugging? Please provide:               │
   │    • The error message or unexpected behavior                  │
   │    • Which file(s) are affected                                 │
   │    • What you've already tried (if anything)                   │
   │                                                                │
   │ **Q2. AI Model** (required):                                   │
   │    A) OpenAI - GPT-4o/o1/o3 models                              │
   │    B) Anthropic - Claude Opus/Sonnet (Recommended)             │
   │    C) Google - Gemini Pro/Flash models                         │
   │    D) Other - Specify                                          │
   │                                                                │
   │ **Q3. Dispatch Mode** (required):                              │
   │    A) Single Agent - One agent (Recommended)                   │
   │    B) Multi-Agent (1+2) - 1 orchestrator (opus) + 2 workers (opus) │
   │    C) Multi-Agent (1+3) - 1 orchestrator (opus) + 3 workers (opus) │
   │                                                                │
   │ **Q4. Worker Model** (if B or C selected above):               │
   │    Default: opus                                               │
   │    To use different model, type: opus, gemini, gpt             │
   │    or leave blank for default                                  │
   │                                                                │
   │ Reply with answers, e.g.: "A, A, A, " or "A, [error desc], A, B, gemini" │
   └────────────────────────────────────────────────────────────────┘

5. WAIT for user response (DO NOT PROCEED)

6. Parse response and store ALL results:
   - spec_path = [from Q0 or auto-detected or $ARGUMENTS]
   - detection_method = [provided/recent/ad-hoc]
   - error_message = [from Q1 or extracted from conversation]
   - affected_files = [extracted or from Q1]
   - previous_attempts = [extracted or from Q1]
   - selected_model = [from Q2]
   - dispatch_mode = [single/multi_small/multi_large from Q3]
   - worker_model = [from Q4: opus/gemini/gpt, default opus if blank]

7. IF dispatch_mode is multi_*:
   - Note: Orchestrator handles OBSERVE + FIX phases
   - Note: Workers handle parallel hypothesis generation in ANALYZE phase

8. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER skip model selection - it is MANDATORY
⛔ NEVER skip dispatch mode selection - it is MANDATORY
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `spec_path = ________________` | `detection_method = ________________`
- `error_message = ________________`
- `affected_files = ________________`
- `selected_model = ________________`
- `dispatch_mode = ________________`
- `worker_model = ________________` (default: opus)

---

## ⚡ GATE 3 CLARIFICATION

**When Gate 3 applies:** When debugging leads to file modifications (Step 5, Option A "Apply the fix").

- If a spec folder was established in unified setup → Gate 3 is satisfied
- If ad-hoc mode was selected → Gate 3 MUST be asked before applying fixes:
  > **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

**Self-Verification:** Before applying any fix:
> □ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW.

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD            | REQUIRED      | YOUR VALUE | SOURCE                     |
| ---------------- | ------------- | ---------- | -------------------------- |
| spec_path        | ○ Conditional | ______     | Q0 or auto-detect or $ARGS |
| detection_method | ✅ Yes         | ______     | Auto-determined            |
| error_message    | ✅ Yes         | ______     | Q1 or conversation scan    |
| selected_model   | ✅ Yes         | ______     | Q2                         |
| dispatch_mode    | ✅ Yes         | ______     | Q3                         |
| worker_model     | ○ Conditional | ______     | Q4 (default: opus)         |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "# /spec_kit:debug" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Skipped model selection (Q2 is MANDATORY)
- Skipped dispatch mode selection (Q3 is MANDATORY)
- Assumed single-agent mode without explicit user choice
- Dispatched sub-agent without creating debug-delegation.md first
- Did not wait for user response on integration options

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
```

---

# 📊 WORKFLOW EXECUTION (5 STEPS) - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER. Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## Workflow Steps (5 steps)

| STEP | NAME               | STATUS | REQUIRED OUTPUT      | VERIFICATION                    |
| ---- | ------------------ | ------ | -------------------- | ------------------------------- |
| 1    | Validate Context   | ☐      | context_confirmed    | Spec path + error context valid |
| 2    | Generate Report    | ☐      | debug-delegation.md  | File created in spec folder     |
| 3    | Dispatch Sub-Agent | ☐      | sub_agent_dispatched | Task tool invoked               |
| 4    | Receive Findings   | ☐      | findings_received    | Sub-agent response captured     |
| 5    | Integration        | ☐      | resolution_complete  | User chose action, applied      |

---

# /spec_kit:debug

Delegate persistent debugging issues to a specialized sub-agent with fresh context. Creates a comprehensive debug report, dispatches a sub-agent with the selected model, and integrates findings back into the main session.

---

```yaml
role: Expert Developer using Debug Delegation for Persistent Issues
purpose: Hand off debugging to fresh sub-agent with complete context handoff
action: Run 5-step debug workflow from context gathering through integration

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: sub_agent_delegation
  approvals: model_selection_required
  tracking: debug_report_creation
  validation: sub_agent_response_check
```

---

## 1. 🎯 PURPOSE

Delegate persistent debugging issues to a specialized sub-agent with fresh context. This workflow creates a comprehensive debug report, dispatches a sub-agent with the selected model, and integrates findings back into the main session.

**When to use:**
- Same error persists after 3+ fix attempts
- Need fresh perspective on complex issue
- Want to preserve debugging context for handoff
- Primary agent is stuck in a debugging loop

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path
**Outputs:** Debug resolution + `STATUS=<RESOLVED|NEEDS_REVIEW|ESCALATE>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name               | Purpose                             | Outputs             |
| ---- | ------------------ | ----------------------------------- | ------------------- |
| 1    | Validate Context   | Confirm all inputs ready            | context_confirmed   |
| 2    | Generate Report    | Create debug-delegation.md          | debug-delegation.md |
| 3    | Dispatch Sub-Agent | Send to Task tool with full context | sub_agent_dispatch  |
| 4    | Receive Findings   | Capture and validate response       | findings_received   |
| 5    | Integration        | Apply fix or review                 | resolution_complete |

### Workflow Diagram

```mermaid
flowchart TB
    subgraph SETUP["🔒 UNIFIED SETUP PHASE"]
        direction TB
        A1[Check $ARGUMENTS] --> A2{Spec folder<br/>provided?}
        A2 -->|Yes| A3[Validate path]
        A2 -->|No| A4[Auto-detect from<br/>recent memory]
        A3 --> A5[Scan conversation<br/>for error context]
        A4 --> A5
        A5 --> A6["📋 CONSOLIDATED PROMPT<br/>Q0: Spec Folder<br/>Q1: Error Context<br/>Q2: AI Model ⚠️<br/>Q3: Dispatch Mode ⚠️<br/>Q4: Worker Model"]
        A6 --> A7[/"⏳ WAIT for<br/>user response"/]
    end

    subgraph WORKFLOW["📊 5-STEP WORKFLOW"]
        direction TB
        S1["Step 1: VALIDATE CONTEXT<br/>Confirm spec_path + error_message"]
        S2["Step 2: GENERATE REPORT<br/>Create debug-delegation.md"]
        S3["Step 3: DISPATCH SUB-AGENT<br/>Task tool → @debug"]
        S4["Step 4: RECEIVE FINDINGS<br/>Capture response"]
        S5["Step 5: INTEGRATION<br/>Apply or review"]

        S1 --> S2 --> S3 --> S4 --> S5
    end

    subgraph ISOLATION["🔒 ISOLATION PATTERN"]
        direction TB
        ISO1[["Main Agent<br/>(orchestrator)"]]
        ISO2[/"Structured Handoff<br/>debug-delegation.md"/]
        ISO3[["@debug Agent<br/>(fresh perspective)"]]

        ISO1 -->|"Context via<br/>document ONLY"| ISO2
        ISO2 -->|"NO conversation<br/>history passed"| ISO3
    end

    subgraph DEBUG["🔍 @debug 4-PHASE METHODOLOGY"]
        direction LR
        D1["1️⃣ OBSERVE<br/>Read error<br/>Categorize<br/>Map scope"]
        D2["2️⃣ ANALYZE<br/>Trace paths<br/>Understand flow"]
        D3["3️⃣ HYPOTHESIZE<br/>Form 2-3<br/>ranked theories"]
        D4["4️⃣ FIX<br/>Minimal change<br/>Verify"]

        D1 --> D2 --> D3 --> D4
    end

    subgraph RESPONSE["📤 RESPONSE TYPES"]
        direction TB
        R1{Response?}
        R2["✅ SUCCESS<br/>Root cause found<br/>Fix applied"]
        R3["⚠️ BLOCKED<br/>Missing info<br/>Access issue"]
        R4["🔴 ESCALATION<br/>3+ hypotheses failed"]

        R1 --> R2
        R1 --> R3
        R1 --> R4
    end

    subgraph INTEGRATE["🔀 INTEGRATION OPTIONS"]
        direction TB
        I1["A) Apply the fix"]
        I2["B) Show full details"]
        I3["C) Request more investigation"]
        I4["D) Manual review"]
    end

    A7 --> S1
    S3 -.->|"Task tool<br/>subagent_type: debug"| ISO1
    ISO3 --> D1
    D4 --> R1
    R2 --> S4
    R3 --> S4
    R4 --> S4
    S5 --> INTEGRATE

    classDef core fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff
    classDef isolation fill:#4c1d95,stroke:#8b5cf6,color:#fff
    classDef debug fill:#0f766e,stroke:#14b8a6,color:#fff

    class A1,A2,A3,A4,A5,A6,A7 gate
    class S1,S2,S3,S4,S5 core
    class ISO1,ISO2,ISO3 isolation
    class D1,D2,D3,D4 debug
    class R1,R2,R3,R4 verify
    class I1,I2,I3,I4 core
```

**Diagram Key:**
- **Orange nodes**: Setup phase (model selection mandatory)
- **Blue nodes**: Core workflow steps
- **Purple nodes**: Isolation pattern (context handoff)
- **Teal nodes**: @debug methodology phases
- **Green nodes**: Response verification

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml`

The YAML contains detailed step-by-step workflow, sub-agent prompt template, error handling, and all configuration.

### Quick Reference

**Step 2 - Generate Report:**
- Template: `.opencode/skill/system-spec-kit/templates/debug-delegation.md`
- Save to: `[spec_path]/debug-delegation.md` (or `scratch/` if ad-hoc)

**Step 3 - Dispatch Sub-Agent:**
- Tool: Task
- subagent_type: "debug" (routes to `@debug` agent)
- Agent file: `.opencode/agent/debug.md`
- Timeout: 2 minutes (standard)

**Step 5 - Integration Options:**
- A) Apply the fix
- B) Show full details
- C) Request more investigation
- D) Manual review

---

## 5. 📊 OUTPUT FORMATS

### Debug Delegation Success

```text
╭─────────────────────────────────────────────────────────────────╮
│ ✅ DEBUG DELEGATION COMPLETE                                    │
├─────────────────────────────────────────────────────────────────┤
│ Spec: specs/014-auth-feature/                                   │
│ Model: Claude                                                   │
│ Report: specs/014-auth-feature/debug-delegation.md              │
├─────────────────────────────────────────────────────────────────┤
│ Root Cause: [brief summary]                                     │
│ Fix Applied: [yes/no]                                           │
│ Status: RESOLVED                                                │
╰─────────────────────────────────────────────────────────────────╯
```

### Debug Needs Review

```text
╭─────────────────────────────────────────────────────────────────╮
│ ⚠️  DEBUG REQUIRES REVIEW                                       │
├─────────────────────────────────────────────────────────────────┤
│ Spec: specs/014-auth-feature/                                   │
│ Report: specs/014-auth-feature/debug-delegation.md              │
├─────────────────────────────────────────────────────────────────┤
│ Findings documented. User chose manual review.                  │
│ Status: NEEDS_REVIEW                                            │
╰─────────────────────────────────────────────────────────────────╯
```

### Debug Escalation

```text
╭─────────────────────────────────────────────────────────────────╮
│ 🔴 DEBUG ESCALATION                                             │
├─────────────────────────────────────────────────────────────────┤
│ Sub-agent could not resolve the issue.                          │
│ Attempts: 3                                                     │
├─────────────────────────────────────────────────────────────────┤
│ RECOMMENDED:                                                    │
│   • Try /spec_kit:debug with different model                    │
│   • Review debug-delegation.md for all attempted fixes           │
│   • Consider breaking problem into smaller parts                │
│ Status: ESCALATE                                                │
╰─────────────────────────────────────────────────────────────────╯
```

---

## 6. 📌 REFERENCE

### Error Categories

| Category      | Indicators                                     |
| ------------- | ---------------------------------------------- |
| syntax_error  | Parse errors, unexpected tokens, brackets      |
| type_error    | Type mismatch, undefined properties, TS errors |
| runtime_error | Exceptions during execution, crashes           |
| test_failure  | Assertion failures, test timeouts              |
| build_error   | Compilation failures, bundling errors          |
| lint_error    | Linter errors, code style violations           |
| unknown       | Cannot classify from error message             |

### Related Templates

| Template            | Path                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Debug delegation    | `.opencode/skill/system-spec-kit/templates/debug-delegation.md`                           |
| Universal debugging | `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` |

### Validation Integration

Before or during debugging, validation runs automatically to catch common issues:
- Missing required files (FILE_EXISTS)
- Unfilled placeholders (PLACEHOLDER_FILLED)
- Missing priority tags in checklist (PRIORITY_TAGS)
- Broken memory anchors (ANCHORS_VALID)

---

## 7. 🔀 SUB-AGENT DELEGATION

This command uses the Task tool to dispatch the specialized `@debug` agent for debugging. The sub-agent runs independently with fresh perspective and returns structured findings.

### Delegation Architecture

```
Main Agent (reads command):
├── PHASE 1: Context Detection (validation)
├── PHASE 2: Model Selection (mandatory)
├── Step 2: Generate debug-delegation.md (context handoff)
├── DISPATCH: Task tool with @debug agent
│   ├── @debug receives structured handoff (NOT conversation history)
│   ├── @debug executes 4-phase methodology
│   │   ├── Phase 1: OBSERVE (read error, categorize, map scope)
│   │   ├── Phase 2: ANALYZE (trace paths, understand flow)
│   │   ├── Phase 3: HYPOTHESIZE (form 2-3 ranked theories)
│   │   └── Phase 4: FIX (minimal change, verify)
│   └── @debug returns structured response (Success/Blocked/Escalation)
└── Step 5: Integration (always main agent)
```

### @debug Agent Dispatch Template

```
Task tool with prompt:
---
You are the @debug agent. Follow your 4-phase debugging methodology.

## Debug Context Handoff

### Error Description
{error_message}

### Files Involved
{affected_files}

### Reproduction Steps
{reproduction_steps}

### Prior Attempts (What Was Tried)
{previous_attempts}

### Environment
{environment_context}

Execute your OBSERVE → ANALYZE → HYPOTHESIZE → FIX methodology.
Return your findings in structured format (Success/Blocked/Escalation).
---
subagent_type: "debug"
```

### Sub-Agent Isolation (By Design)

The `@debug` agent does NOT have access to conversation history. This is intentional:
- **Prevents inherited assumptions** from failed attempts
- **Fresh perspective** may see what others missed
- **All context** must be passed via structured handoff format

### Context Handoff Format

The debug-delegation.md report MUST include:

| Section            | Required | Purpose                          |
| ------------------ | -------- | -------------------------------- |
| Error Description  | ✓        | Exact error message, symptoms    |
| Files Involved     | ✓        | Affected files with roles        |
| Reproduction Steps | ✓        | How to trigger the error         |
| Prior Attempts     | ✓        | What was tried and why it failed |
| Environment        | ○        | Runtime, versions, config        |

### Model Hint

The selected model (GPT/Claude/Gemini) is passed as context to help route to appropriate capabilities. The Task tool uses the model configured in your OpenCode environment.

### Timeout & Retry

- **Timeout:** 2 minutes (standard)
- **Retry Limit:** Maximum 3 re-dispatch attempts before forcing escalation
- **Escalation:** After 3 failed hypotheses, @debug returns ESCALATION response

---

## 8. 🔍 EXAMPLES

**Example 1: Auto-detect with recent error**
```
/spec_kit:debug
```
→ Auto-detects spec folder, gathers error from conversation, asks for model, dispatches

**Example 2: Specific spec folder**
```
/spec_kit:debug specs/007-anobel.com/004-table-of-content/
```
→ Uses specified folder, gathers error context, asks for model, dispatches

**Example 3: After multiple failed attempts**
```
User: This TypeScript error keeps coming back after 3 fix attempts
Agent: Let me delegate this to a fresh debugging agent...
/spec_kit:debug
```
→ Creates comprehensive delegation report with all 3 attempts documented

---

## 9. 🔗 RELATED COMMANDS

| Command              | Relationship                                    |
| -------------------- | ----------------------------------------------- |
| `/spec_kit:complete` | Start feature work (debug when issues arise)    |
| `/spec_kit:handover` | Create handover (debug documents issue context) |
| `/spec_kit:resume`   | Resume work (may need debug after resuming)     |

---

## 10. 📌 INTEGRATION

### @debug Agent Integration

The debug command dispatches to the specialized `@debug` agent (`.opencode/agent/debug.md`):
- **4-phase methodology:** Observe → Analyze → Hypothesize → Fix
- **Codebase-agnostic:** Works with any technology stack
- **Isolation by design:** No conversation history, only structured handoff
- **Structured responses:** Success, Blocked, or Escalation format

### @debug Agent Response Types

| Response       | Meaning                       | Next Action                          |
| -------------- | ----------------------------- | ------------------------------------ |
| **Success**    | Root cause found, fix applied | Verify fix, continue work            |
| **Blocked**    | Missing info or access issue  | Provide requested info               |
| **Escalation** | 3+ hypotheses failed          | Try different model or manual review |

### Memory Integration

After successful resolution:
- Save semantic context for future retrieval:
  ```
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]
  ```
- Consider running `/memory:save` to capture debugging insights
- Debug-delegation.md serves as memory for the spec folder
- Future agents can learn from documented fix attempts

### Learning from Mistakes

- After resolution, use `/memory:learn` to capture the corrected approach
- Document what was tried, what failed, and what ultimately worked
- This builds institutional knowledge for future debugging sessions

---

## 11. 🔗 COMMAND CHAIN

This command can be invoked from any workflow:

```
[/spec_kit:implement] → /spec_kit:debug → [Return to original workflow]
[/spec_kit:complete] → /spec_kit:debug → [Return to original workflow]
```

**After resolution:**
→ Return to the original workflow step that triggered debugging

---

## 12. 📌 NEXT STEPS

After debugging completes, suggest relevant next steps:

| Condition                      | Suggested Command                              | Reason                            |
| ------------------------------ | ---------------------------------------------- | --------------------------------- |
| Fix applied successfully       | Verify in browser/tests                        | Confirm fix works                 |
| Fix applied, continue work     | Return to original workflow                    | Resume implementation             |
| Issue needs more analysis      | `/spec_kit:debug` (retry with different model) | Fresh perspective                 |
| Want to save debugging context | `/memory:save [spec-folder-path]`              | Preserve debugging insights       |
| Debugging session complete     | `/spec_kit:handover [spec-folder-path]`        | Document for future reference     |
| Record lessons learned         | `/memory:learn [description]`                  | Capture learning from debugging   |

**ALWAYS** end with: "What would you like to do next?"
