---
description: Create a comprehensive AI-first installation guide with step-by-step setup instructions, requirements, and troubleshooting - supports :auto and :confirm modes
argument-hint: "<project-name> [--platforms <list>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @write agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `create_install_guide_auto.yaml`
>    - Confirm mode → `create_install_guide_confirm.yaml`
> 5. Execute the YAML workflow step by step
>
> The @write references below are self-verification checks — not dispatch instructions.
> All content after the Setup Phase is reference context for the YAML workflow.

---

# 🚨 PHASE 0: @WRITE AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @write agent?
│
├─ INDICATORS that you ARE @write agent:
│   ├─ You were invoked with "@write" prefix
│   ├─ You have template-first workflow capabilities
│   ├─ You load templates BEFORE creating content
│   ├─ You validate template alignment AFTER creating
│
├─ IF YES (all indicators present):
│   └─ write_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ WRITE AGENT REQUIRED                                    │
    │   │                                                            │
    │   │ This command requires the @write agent for:                │
    │   │   • Template-first workflow (loads before creating)          │
    │   │   • DQI scoring (target: 75+ Good)                         │
    │   │   • sk-documentation skill integration               │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @write /create:install_guide [project-name]              │
    │   │                                                            │
    │   │ Reference: [runtime_agent_path]/write.md                   │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Write agent required"
```

**Phase Output:**
- `write_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q3)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q3)
   └─ No suffix → execution_mode = "ASK" (include Q3 in prompt)

2. CHECK if $ARGUMENTS contains a project name:
   ├─ IF $ARGUMENTS has content (ignoring flags/suffixes) → project_name = $ARGUMENTS, omit Q0
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. CHECK for --platforms flag in $ARGUMENTS:
   ├─ IF --platforms flag present with valid values → platforms = [values], omit Q1
   └─ IF no --platforms flag → include Q1 in prompt

4. Check for existing installation guides:
   $ ls -la ./install_guides/*.md ./INSTALL.md ./docs/INSTALL.md 2>/dev/null
   - Will inform conflict handling in Q2 if files exist

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Project Name** (if not provided in command):             │
   │    What project/tool needs an installation guide?              │
   │                                                                │
   │ **Q1. Target Platforms** (required):                           │
   │    A) All platforms (macOS, Linux, Windows, Docker)            │
   │    B) macOS only                                               │
   │    C) Linux only                                               │
   │    D) Custom (specify: macos,linux,windows,docker)             │
   │                                                                │
   │ **Q2. Output Location** (required):                            │
   │    A) install_guides/[Type] - [Name].md (Recommended)          │
   │    B) INSTALL.md at project root                               │
   │    C) docs/INSTALL.md                                          │
   │    D) Custom path (specify)                                    │
   │    [If existing file found: E) Overwrite | F) Merge | G) Cancel]│
   │                                                                │
   │ **Q3. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ Reply with answers, e.g.: "A, A, A" or "my-tool, A, A, A"      │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - project_name = [from Q0 or $ARGUMENTS]
   - platforms = [from Q1 or --platforms flag: all/macos/linux/windows/docker]
   - output_path = [derived from Q2 choice]
   - existing_file = [yes/no based on check]
   - conflict_resolution = [if existing: overwrite/merge/cancel]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q3]

8. IF output location has conflict AND conflict_resolution not set:
   - Handle inline based on Q2 response (E/F/G options)

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER infer project from context
⛔ NEVER assume platforms without confirmation
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `write_agent_verified = ________________`
- `project_name = ________________`
- `platforms = ________________`
- `output_path = ________________`
- `existing_file = ________________`
- `execution_mode = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                | REQUIRED | YOUR VALUE | SOURCE                 |
| -------------------- | -------- | ---------- | ---------------------- |
| write_agent_verified | ✅ Yes    | ______     | Automatic check        |
| project_name         | ✅ Yes    | ______     | Q0 or $ARGUMENTS       |
| platforms            | ✅ Yes    | ______     | Q1 or --platforms flag |
| output_path          | ✅ Yes    | ______     | Derived from Q2        |
| existing_file        | ✅ Yes    | ______     | Automatic check        |
| execution_mode       | ✅ Yes    | ______     | Suffix or Q3           |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "⚡ INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_install_guide_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_install_guide_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, resource routing, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: run Phase 0, then Setup Phase, then load the YAML file

---

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- ChatGPT: `.opencode/agent/chatgpt`
- Claude: `/.claude/agents`

---

# Installation Guide Creation Workflow

Create a comprehensive AI-first installation guide with clear prerequisites, step-by-step instructions, and troubleshooting for common issues. Every guide starts with a copy-paste AI prompt.

---

```yaml
role: Expert Installation Guide Creator using sk-documentation skill
purpose: Create comprehensive multi-platform AI-first installation documentation
action: Generate step-by-step setup instructions with AI-assisted install prompt

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
```

---

## 1. PURPOSE

Create a comprehensive AI-first installation guide following the pattern in `install_guides/`. The guide includes a copy-paste AI prompt for assisted installation, clear prerequisites, platform-specific commands, and thorough troubleshooting.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Project name with optional --platforms flag
**Outputs:** Installation guide at specified location + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. INSTRUCTIONS

### Step 4: Verify All Fields Set

Confirm you have these values from the unified setup phase:
- `write_agent_verified` from automatic check
- `project_name` from Q0 or $ARGUMENTS
- `platforms` from Q1 or --platforms flag (default: "all")
- `output_path` derived from Q2
- `existing_file` from automatic check
- `execution_mode` from suffix or Q3

**If ANY field is missing, STOP and return to the UNIFIED SETUP PHASE section.**

### Step 5: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_install_guide.yaml
```

The YAML file contains:
- Detailed step-by-step activities
- Guide type prefixes (MCP/CLI/PLUGIN/SDK/SERVICE)
- Platform configurations
- AI-First template and full guide template
- Checkpoint prompts and options
- Error recovery procedures
- Validation requirements
- Completion report template

Execute all 5 steps in sequence following the workflow definition.

---

## 4. REFERENCE (See YAML for Details)

| Section             | Location in YAML                |
| ------------------- | ------------------------------- |
| Type Prefixes       | `notes.type_prefix_conventions` |
| Required Sections   | `notes.required_sections`       |
| AI-First Philosophy | `notes.ai_first_philosophy`     |
| Failure Recovery    | `failure_recovery`              |
| Completion Report   | `completion_report_template`    |

**Reference Guides:**
- `.opencode/install_guides/MCP - Code Mode.md`
- `.opencode/install_guides/MCP - Spec Kit Memory.md`
- `.opencode/install_guides/MCP - Chrome Dev Tools.md`

---

## 5. EXAMPLES

**Example 1: MCP Server Guide**
```
/documentation:create_install_guide semantic-search-mcp
```
→ Creates `install_guides/MCP/MCP - Semantic Search.md`

**Example 2: CLI Tool Guide**
```
/documentation:create_install_guide chrome-devtools-cli --platforms macos,linux
```
→ Creates `install_guides/CLI - Chrome DevTools.md`

**Example 3: Plugin Guide**
```
/documentation:create_install_guide antigravity-auth
```
→ Creates `install_guides/PLUGIN - Antigravity Auth.md`

**Example 4: Auto mode (no prompts)**
```
/create:install_guide semantic-search-mcp :auto
```
→ Creates install guide without approval prompts, only stops for errors

**Example 5: Confirm mode (step-by-step approval)**
```
/create:install_guide chrome-devtools-cli --platforms macos,linux :confirm
```
→ Pauses at each step for user confirmation

---

## 6. COMMAND CHAIN

This command creates standalone documentation:

```
/create:install_guide → [Verify guide works]
```

**Related commands:**
- Create README: `/create:folder_readme [path]`

---

## 7. NEXT STEPS

After install guide creation completes, suggest relevant next steps:

| Condition            | Suggested Command                 | Reason                         |
| -------------------- | --------------------------------- | ------------------------------ |
| Guide created        | Test AI-First prompt              | Verify installation works      |
| Need README          | `/create:folder_readme [path]`    | Add project README             |
| Create another guide | `/create:install_guide [project]` | Document related tool          |
| Want to save context | `/memory:save [spec-folder-path]` | Preserve documentation context |

**ALWAYS** end with: "What would you like to do next?"
