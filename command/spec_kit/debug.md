---
description: Delegate debugging to a specialized sub-agent with full context handoff. Always asks for model selection first.
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED.**

**Key Rule:** Model selection is MANDATORY. You MUST ask the user which model to use before dispatching the sub-agent.

---

## ⚡ GATE 3 CLARIFICATION

**When Gate 3 applies:** When debugging leads to file modifications (Step 5, Option A "Apply the fix").

- If a spec folder was established in Phase 1 → Gate 3 is satisfied
- If ad-hoc mode was selected → Gate 3 MUST be asked before applying fixes:
  > **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

**Self-Verification:** Before applying any fix:
> □ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW.

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

⛔ HARD STOP: DO NOT proceed until spec_path is confirmed AND error context is gathered
```

**Phase 1 Output:**
- `spec_path = ________________` | `detection_method = [recent/provided/ad-hoc]`
- `error_message = ________________`
- `affected_files = ________________`
- `previous_attempts = ________________`

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

⛔ HARD STOP: DO NOT proceed until model is selected
```

**Phase 2 Output:** `selected_model = ________________`

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
│   ├─ YES → Proceed to "# Debug Delegation Workflow" section below
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

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

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

# Debug Delegation Workflow

Delegate debugging to a specialized sub-agent with fresh context and full error documentation. The sub-agent analyzes the problem independently and returns findings for integration.

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

## 1. 📋 PURPOSE

Delegate persistent debugging issues to a specialized sub-agent with fresh context. This workflow creates a comprehensive debug report, dispatches a sub-agent with the selected model, and integrates findings back into the main session.

**When to use:**
- Same error persists after 2+ fix attempts
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

## 3. ⚡ INSTRUCTIONS

### Step 1: Validate Context

Confirm all required context is available:

```
VALIDATE:
├─ spec_path exists and is accessible
├─ error_message is captured
├─ affected_files are identified
├─ previous_attempts are documented
└─ reproduction_steps are known (optional but helpful)

IF any critical context missing:
├─ Report what's missing
└─ Request from user before proceeding
```

### Step 2: Generate Debug Report

Create debug-delegation.md using the template:

**Template:** `.opencode/skill/system-spec-kit/templates/debug-delegation.md`

> **Note:** The debug-delegation.md template may not have a "6. RESOLUTION" section. Create this section when documenting the fix outcome.

```
GENERATE debug-delegation.md:

1. Read template from: .opencode/skill/system-spec-kit/templates/debug-delegation.md

2. Fill placeholders:
   ├─ Date: [Current timestamp - ISO format]
   ├─ Task ID: [Extract from spec folder name or generate: debug-YYYYMMDD-HHMM]
   ├─ Delegated By: "Primary Agent"
   ├─ Attempts Before Delegation: [Count from previous_attempts]
   │
   ├─ Error Category: [Classify from error message]
   │   Options: syntax_error | type_error | runtime_error | 
   │            test_failure | build_error | lint_error | unknown
   │
   ├─ Error Message: [Full error output, preserve formatting]
   ├─ Affected Files: [List from affected_files]
   │
   ├─ Attempted Fixes: [Document each from previous_attempts]
   │   Format per attempt:
   │   - Approach: [what was tried]
   │   - Result: [why it failed]
   │
   ├─ Relevant Code Section: [Extract key code snippets]
   ├─ Hypothesis: [Current theory about root cause]
   └─ Recommended Next Steps: [Suggestions for sub-agent]

3. Save to: [spec_path]/debug-delegation.md
   (or scratch/debug-delegation.md if ad-hoc mode)

4. Verify file was created successfully
```

### Step 3: Dispatch Sub-Agent

**Sub-Agent Dispatch:**

Use the Task tool with these parameters:
- **description**: "Debug: [brief error summary - max 50 chars]"
- **prompt**: [Full debug context including error, attempts, code snippets]
- **subagent_type**: "general"

Example invocation:
```
Task tool parameters:
- description: "Debug: TypeError in auth module"
- prompt: "DEBUGGING TASK: [full context here]"
- subagent_type: general
```

**Prompt Template for Sub-Agent:**

```markdown
# Debug Task Delegation

You are a specialized debugging agent. A primary agent has encountered a persistent issue and is delegating to you for fresh analysis.

## Selected Model
[selected_model] - chosen for this debugging task.

## Your Task
Analyze the following debug report and provide:
1. Root cause analysis
2. Proposed fix with code
3. Verification steps
4. Prevention recommendations

## Debug Report
[INSERT FULL CONTENT OF debug-delegation.md HERE]

## Instructions
- Focus on the error, not general code quality
- Provide executable fix code with exact file paths
- Explain your reasoning step by step
- If you need more context, specify exactly what files/info you need
- Consider edge cases the primary agent may have missed

## Response Format

### 🔍 Root Cause
[Your analysis of what's causing the issue - be specific about the mechanism]

### 🔧 Proposed Fix
\`\`\`[language]
// File: [exact file path]
[Code changes - show before/after or patch format]
\`\`\`

### ✅ Verification
[Specific steps to verify the fix works]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### 🛡️ Prevention
[How to prevent this issue in future - patterns, tests, or guards to add]

### ⚠️ Caveats
[Any assumptions made or areas of uncertainty]
```

> **Note:** Model selection (Phase 2) is mandatory—the user must always be asked to select a model. The Task tool uses the model configured in your OpenCode environment, so the selected model name is passed in the prompt to provide capability-level context to the sub-agent. This context is valuable for the sub-agent's self-understanding, even though it does not change which model processes the request.

**Timeout:** Sub-agent has standard timeout (2 minutes). If no response, report back to user with partial findings if available.

### Step 4: Receive Findings

Capture and validate sub-agent response:

```
RECEIVE sub-agent response:

├─ IF response received:
│   ├─ Extract: root_cause, proposed_fix, verification_steps, prevention
│   ├─ Validate: proposed_fix includes file paths and executable code
│   └─ Store findings for integration
│
├─ IF timeout or error:
│   ├─ Report: "Sub-agent did not respond in time"
│   ├─ Offer: "Would you like to:"
│   │   ┌────────────────────────────────────────────────────────────┐
│   │   │ A) Retry with same model                                   │
│   │   │ B) Try a different model                                   │
│   │   │ C) Continue debugging manually                             │
│   │   └────────────────────────────────────────────────────────────┘
│   └─ WAIT for user response
│
└─ IF response is "need more context":
    ├─ Display what context is needed
    ├─ Gather additional context
    └─ Re-dispatch sub-agent with enhanced report

**Retry Limit:** Maximum 3 re-dispatch attempts before forcing escalation to user.
```

### Step 5: Integration

Present findings and apply resolution:

```
PRESENT findings to user:

┌────────────────────────────────────────────────────────────────┐
│ 🔍 DEBUG FINDINGS                                              │
├────────────────────────────────────────────────────────────────┤
│ Root Cause: [summary from sub-agent]                           │
│                                                                │
│ Proposed Fix:                                                  │
│ [code snippet preview - first 10 lines]                         │
│                                                                │
│ Confidence: [HIGH/MEDIUM/LOW based on sub-agent analysis]       │
└────────────────────────────────────────────────────────────────┘

ASK: "How would you like to proceed?"

┌────────────────────────────────────────────────────────────────┐
│ A) Apply the fix - I'll make the code changes now               │
│ B) Show full details - Let me review before deciding           │
│ C) Request more investigation - This needs deeper analysis     │
│ D) Manual review - I'll handle it myself                       │
└────────────────────────────────────────────────────────────────┘

WAIT for user response.

HANDLE response:
├─ A) Apply fix:
│   ├─ Make code changes using Edit tool
│   ├─ Verify changes applied correctly
│   ├─ Suggest running tests/build to verify
│   └─ Update debug-delegation.md with resolution section
│
├─ B) Show details:
│   ├─ Display full sub-agent response
│   ├─ Re-ask for action (A, C, or D)
│   └─ WAIT for user response
│
├─ C) More investigation:
│   ├─ Ask what specific areas need deeper analysis
│   ├─ Re-dispatch sub-agent with focused questions
│   └─ Return to Step 3
│
└─ D) Manual review:
    ├─ Confirm user will handle
    ├─ Keep debug-delegation.md for reference
    └─ STATUS = NEEDS_REVIEW
```

**Update debug-delegation.md on resolution:**

Append to file:
```markdown
## 6. RESOLUTION

**Resolved By:** Sub-agent delegation
**Resolution Date:** [timestamp]
**Root Cause:** [from sub-agent]
**Fix Applied:** [description of changes]
**Verified:** [yes/no + verification method]
```

---

## 4. 📊 OUTPUT FORMATS

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
│ Proposed fix available in debug-delegation.md                    │
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
│   • Try /spec_kit:debug with Opus model                         │
│   • Review debug-delegation.md for all attempted fixes           │
│   • Consider breaking problem into smaller parts                │
│ Status: ESCALATE                                                │
╰─────────────────────────────────────────────────────────────────╯
```

---

## 5. 📌 REFERENCE

### Error Categories

| Category      | Indicators                                     |
| ------------- | ---------------------------------------------- |
| syntax_error  | Parse errors, unexpected tokens, brackets      |
| type_error    | Type mismatch, undefined properties, TS errors |
| runtime_error | Exceptions during execution, crashes           |
| test_failure  | Assertion failures, test timeouts              |
| build_error   | Compilation failures, bundling errors          |
| lint_error    | ESLint, Prettier, style violations             |
| unknown       | Cannot classify from error message             |

### Validation Integration

Before or during debugging, validation runs automatically to catch common issues.

Common validation issues that cause debugging sessions:
- Missing required files (FILE_EXISTS)
- Unfilled placeholders (PLACEHOLDER_FILLED)
- Missing priority tags in checklist (PRIORITY_TAGS)
- Broken memory anchors (ANCHORS_VALID)

### Related Templates

- `.opencode/skill/system-spec-kit/templates/debug-delegation.md`
- `.opencode/skill/workflows-code/references/debugging_workflows.md`
- `.opencode/skill/workflows-code/assets/debugging_checklist.md`

---

## 6. 🔀 PARALLEL DISPATCH

This command uses the Task tool to dispatch a parallel sub-agent for debugging. The sub-agent runs independently and returns findings.

**Model Hint:** The selected model (Claude/Gemini/Codex) is passed as context to help route to appropriate capabilities.

**Timeout:** Sub-agent has standard timeout. If no response, report back to user with options.

**Sub-agent isolation:** The debugging sub-agent does NOT have access to the conversation history. All context must be passed via the debug-delegation.md report.

---

## 7. 🔍 EXAMPLES

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

## 8. 🔗 RELATED COMMANDS

| Command              | Relationship                                    |
| -------------------- | ----------------------------------------------- |
| `/spec_kit:complete` | Start feature work (debug when issues arise)    |
| `/spec_kit:handover` | Create handover (debug documents issue context) |
| `/spec_kit:resume`   | Resume work (may need debug after resuming)     |

---

## 9. 📌 INTEGRATION

### workflows-code Skill Integration

The debug command complements the workflows-code skill's debugging phase:
- Use workflows-code for standard debugging workflow
- Use /spec_kit:debug when stuck after multiple attempts
- Debug delegation creates permanent record in debug-delegation.md

### Memory Integration

After successful resolution:
- Consider running `/memory:save` to capture debugging insights
- Debug-delegation.md serves as memory for the spec folder
- Future agents can learn from documented fix attempts
