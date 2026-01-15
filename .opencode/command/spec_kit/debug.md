---
description: Delegate debugging to a specialized sub-agent with full context handoff. Always asks for model selection first.
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED.**

**Key Rule:** Model selection is MANDATORY. You MUST ask the user which model to use before dispatching the sub-agent.

---

## 🔒 PHASE 1: CONTEXT DETECTION

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
│   │   └─ Continue to error context gathering
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
    ├─ Find most recent memory file:
    │   Glob("specs/**/memory/*.md") → Results sorted by modification time, take first
    │
    ├─ IF session found:
    │   ├─ Store as: spec_path (extract from memory file path)
    │   ├─ detection_method = "recent"
    │   └─ Continue to error context gathering
    │
    └─ IF NO session found:
        ├─ SHOW: "No active session detected"
        ├─ ASK: "Would you like to:"
        │   ┌────────────────────────────────────────────────────────────┐
        │   │ A) List available spec folders and select one              │
        │   │ B) Debug without a spec folder (ad-hoc mode)               │
        │   │ C) Cancel                                                  │
        │   └────────────────────────────────────────────────────────────┘
        └─ WAIT for user response

2. GATHER ERROR CONTEXT from conversation:

├─ Scan recent conversation for:
│   ├─ Error messages (look for stack traces, error codes, exceptions)
│   ├─ Affected file paths (files mentioned in errors or recent edits)
│   ├─ Previous fix attempts (code changes, commands run)
│   └─ Reproduction steps (how the error was triggered)
│
├─ Store extracted context:
│   ├─ error_message = [extracted error text]
│   ├─ affected_files = [list of file paths]
│   ├─ previous_attempts = [list of attempted fixes]
│   └─ reproduction_steps = [how to reproduce]
│
└─ IF no error context found in conversation:
    ├─ ASK: "What error are you debugging? Please provide:"
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ • The error message or unexpected behavior                 │
    │   │ • Which file(s) are affected                                │
    │   │ • What you've already tried (if anything)                  │
    │   └────────────────────────────────────────────────────────────┘
    └─ WAIT for user response

**STOP HERE** - Wait for user to confirm spec folder and provide error context before continuing.

⛔ HARD STOP: DO NOT proceed until spec_path is confirmed AND error context is gathered
```

**Phase 1 Output:** `spec_path = ___` | `detection_method = [recent/provided/ad-hoc]` | `error_message = ___` | `affected_files = ___`

---

## 🔒 PHASE 2: MODEL SELECTION [MANDATORY - ALWAYS ASK]

**STATUS: ☐ BLOCKED**

⛔ HARD STOP: You MUST ask the user which model to use. DO NOT skip this phase.

```
DISPLAY EXACTLY:

┌────────────────────────────────────────────────────────────────┐
│ 🤖 Which AI model should handle this debugging task?           │
│                                                                │
│ A) Claude - Anthropic models                                   │
│ B) Gemini - Google models (Pro/Ultra)                          │
│ C) Codex - OpenAI models (GPT-4/o1)                            │
│ D) Other - Specify a different model                           │
│                                                                │
│ Reply with A, B, C, or D (with model name if D)                │
└────────────────────────────────────────────────────────────────┘

WAIT for user response.

Parse response:
├─ "A" or "claude" → selected_model = "claude"
├─ "B" or "gemini" → selected_model = "gemini"
├─ "C" or "codex" or "gpt" or "openai" → selected_model = "codex"
├─ "D [model]" → selected_model = [user-specified model]
└─ Invalid → Re-prompt with options

Store: selected_model = ________________

**STOP HERE** - Wait for user to select a model (A/B/C/D) before continuing.

⛔ HARD STOP: DO NOT proceed until model is selected
```

**Phase 2 Output:** `selected_model = ___`

---

## ⚡ GATE 3 CLARIFICATION

**When Gate 3 applies:** When debugging leads to file modifications (Step 5, Option A "Apply the fix").

- If a spec folder was established in Phase 1 → Gate 3 is satisfied
- If ad-hoc mode was selected → Gate 3 MUST be asked before applying fixes:
  > **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

**Self-Verification:** Before applying any fix:
> □ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW.

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                    | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                      |
| ------------------------ | --------------- | ----------- | --------------------------------- |
| PHASE 1: CONTEXT         | ✅ PASSED        | ______      | spec_path: ______ / error: ______ |
| PHASE 2: MODEL SELECTION | ✅ PASSED        | ______      | selected_model: ______            |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED?
│   ├─ YES → Proceed to "# /spec_kit:debug" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Skipped model selection (Phase 2 is MANDATORY)
- Assumed error context without extracting from conversation
- Proceeded without asking user about model selection
- Dispatched sub-agent without creating debug-delegation.md first
- Did not wait for user response on integration options

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
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
- subagent_type: "general"
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

| Template            | Path                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| Debug delegation    | `.opencode/skill/system-spec-kit/templates/debug-delegation.md`                 |
| Universal debugging | `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` |

### Validation Integration

Before or during debugging, validation runs automatically to catch common issues:
- Missing required files (FILE_EXISTS)
- Unfilled placeholders (PLACEHOLDER_FILLED)
- Missing priority tags in checklist (PRIORITY_TAGS)
- Broken memory anchors (ANCHORS_VALID)

---

## 7. 🔀 SUB-AGENT DELEGATION

This command uses the Task tool to dispatch a parallel sub-agent for debugging. The sub-agent runs independently and returns findings.

### Delegation Architecture

```
Main Agent (reads command):
├── PHASE 1: Context Detection (validation)
├── PHASE 2: Model Selection (mandatory)
├── DISPATCH: Task tool with sub-agent
│   ├── Sub-agent analyzes debug report
│   ├── Sub-agent proposes fix
│   └── Sub-agent returns findings
└── Step 5: Integration (always main agent)
```

### Sub-Agent Isolation

The debugging sub-agent does NOT have access to the conversation history. All context must be passed via the debug-delegation.md report.

### Model Hint

The selected model (Claude/Gemini/Codex) is passed as context to help route to appropriate capabilities. The Task tool uses the model configured in your OpenCode environment.

### Timeout & Retry

- **Timeout:** 2 minutes (standard)
- **Retry Limit:** Maximum 3 re-dispatch attempts before forcing escalation

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

### workflows-code Skill Integration

The debug command uses universal debugging methodology applicable to any technology stack:
- Follows 4-phase approach: Observe → Analyze → Hypothesize → Fix
- Use /spec_kit:debug when stuck after multiple attempts (any stack)
- Debug delegation creates permanent record in debug-delegation.md
- Sub-agent adapts debugging approach based on error context and file types

### Memory Integration

After successful resolution:
- Consider running `/memory:save` to capture debugging insights
- Debug-delegation.md serves as memory for the spec folder
- Future agents can learn from documented fix attempts

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

## 12. 🔜 WHAT NEXT?

After debugging completes, suggest relevant next steps:

| Condition                      | Suggested Command                              | Reason                        |
| ------------------------------ | ---------------------------------------------- | ----------------------------- |
| Fix applied successfully       | Verify in browser/tests                        | Confirm fix works             |
| Fix applied, continue work     | Return to original workflow                    | Resume implementation         |
| Issue needs more analysis      | `/spec_kit:debug` (retry with different model) | Fresh perspective             |
| Want to save debugging context | `/memory:save [spec-folder-path]`              | Preserve debugging insights   |
| Debugging session complete     | `/spec_kit:handover [spec-folder-path]`        | Document for future reference |

**ALWAYS** end with: "What would you like to do next?"
