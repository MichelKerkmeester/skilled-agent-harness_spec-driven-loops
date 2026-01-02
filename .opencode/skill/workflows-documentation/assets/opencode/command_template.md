---
title: Command Template - OpenCode Slash Commands
description: Templates and best practices for creating production-quality slash commands in OpenCode with proper frontmatter and structure.
---

# Command Template - OpenCode Slash Commands

Templates for creating slash commands with proper frontmatter, mandatory gates, and structured workflows.

---

## 1. 📖 OVERVIEW

### What Are OpenCode Commands?

**OpenCode commands** are slash-triggered instructions (e.g., `/spec_kit:complete`, `/memory:save`) that automate workflows, enforce patterns, and extend AI agent capabilities. They're markdown files that define structured behavior for specific tasks.

**Core Purpose**:
- **Workflow automation** - Multi-step processes become single invocations
- **Pattern enforcement** - Consistent behavior across sessions
- **Task routing** - Arguments dispatch to appropriate handlers
- **User guidance** - Structured prompts prevent errors
- **Tool restriction** - Limit which tools the command can use

**Key Difference from Skills**:
- Commands = Actionable workflows triggered by `/command-name`
- Skills = Reference documentation loaded via `Read(".opencode/skill/<skill-name>/SKILL.md")`

### Core Characteristics

| Characteristic         | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **Markdown-based**     | Human-readable instruction files                      |
| **Frontmatter-driven** | Metadata controls behavior (description, args, tools) |
| **Argument-aware**     | Parse and validate user input via `$ARGUMENTS`        |
| **Status-reporting**   | Return structured outcomes (`STATUS=OK\|FAIL`)        |
| **Tool-restricted**    | `allowed-tools` limits available tools                |

### How Commands Are Invoked

```
User types: /command-name arguments
                │           │
                │           └─► Passed as $ARGUMENTS variable
                │
                └─► OpenCode finds .opencode/command/command-name.md
                    │
                    ├─► Loads frontmatter (description, tools, hints)
                    │
                    ├─► Injects $ARGUMENTS into instruction body
                    │
                    └─► AI agent executes instructions step-by-step
```

### Command File Location

```
.opencode/
└── command/
    ├── simple-command.md          → /simple-command
    ├── workflow-command.md        → /workflow-command
    └── namespace/                  → Grouped commands
        ├── action1.md             → /namespace:action1
        └── action2.md             → /namespace:action2
```

### Progressive Complexity

```
Level 1: Simple Command
         └─ Single action, few arguments (~50-100 lines)
            ↓
Level 2: Workflow Command
         └─ Multi-step process with validation (~100-200 lines)
            ↓
Level 3: Mode-Based / Dispatch Command
         └─ Complex routing, user control (~150-300 lines)
```

---

## 2. 🎯 WHEN TO CREATE COMMANDS

### Create Command When

- Multi-step process with defined phases
- Repeated task needing consistency across sessions
- Requires confirmation gates (destructive actions)
- Multiple argument patterns need routing
- User should control execution pace (`:auto`/`:confirm` modes)
- Tool restrictions needed for security/focus

### Use Skill Instead When

- Content is reference material, not executable workflow
- Complex domain knowledge that multiple commands might need
- Reusable patterns/standards across multiple commands

### Decision Framework

```
Is this a repeatable workflow with defined steps?
├─► YES
│   │
│   ├─► Does it need user arguments?
│   │   └─► Command with argument-hint + mandatory gate
│   │
│   ├─► Does it have modes (auto/confirm)?
│   │   └─► Mode-based command template
│   │
│   ├─► Is it destructive/irreversible?
│   │   └─► Destructive command template
│   │
│   ├─► Multiple action keywords (start/stop/status)?
│   │   └─► Argument dispatch pattern
│   │
│   └─► Simple single action?
│       └─► Simple command template
│
└─► NO
    │
    ├─► Is it reference documentation?
    │   └─► Create Skill instead
    │
    ├─► Is it reusable knowledge?
    │   └─► Create Skill instead
    │
    └─► Is it one-time task?
        └─► Just do it (no command needed)
```

### Command Types by Complexity

| Type                  | Complexity | Lines       | Use When                                 |
| --------------------- | ---------- | ----------- | ---------------------------------------- |
| **Simple**            | Low        | 50-100      | Single action, few args                  |
| **Workflow**          | Medium     | 100-200     | Multi-step process with outputs          |
| **Mode-Based**        | Medium     | 150-250     | User controls execution pace             |
| **Argument Dispatch** | Medium     | 150-300     | Multiple entry points/actions            |
| **Destructive**       | Medium     | 100-180     | Irreversible actions, needs confirmation |
| **Namespace**         | Varies     | 50-150 each | Related commands grouped together        |

---

## 3. 🏷️ COMMAND TYPES

### Overview

| Type                  | Complexity | Use When                      | Template Section |
| --------------------- | ---------- | ----------------------------- | ---------------- |
| **Simple**            | Low        | Single action, few args       | Section 10       |
| **Workflow**          | Medium     | Multi-step process            | Section 11       |
| **Mode-Based**        | Medium     | `:auto`/`:confirm` variants   | Section 12       |
| **Argument Dispatch** | Medium     | Multiple entry points/actions | Section 13       |
| **Destructive**       | Medium     | Requires confirmation         | Section 14       |
| **Namespace**         | Varies     | Grouped related commands      | Section 15       |

### Choosing the Right Type

```
Start Here
    │
    ├─► Single action, straightforward?
    │   └─► SIMPLE COMMAND
    │
    ├─► Multiple defined steps with outputs?
    │   └─► WORKFLOW COMMAND
    │
    ├─► User should control execution pace?
    │   └─► MODE-BASED COMMAND
    │
    ├─► Multiple action keywords (start/stop/status)?
    │   └─► ARGUMENT DISPATCH
    │
    ├─► Deletes data or irreversible?
    │   └─► DESTRUCTIVE COMMAND
    │
    └─► Part of related command group?
        └─► NAMESPACE COMMAND
```

---

## 4. 📋 STANDARD COMMAND STRUCTURE

### Common Sections (All Command Types)

| Order | Section             | Required         | Purpose                             |
| ----- | ------------------- | ---------------- | ----------------------------------- |
| 0     | **Frontmatter**     | Yes              | Metadata (description, args, tools) |
| 1     | **Mandatory Gate**  | If required args | Prevent context inference           |
| 2     | **Title + Purpose** | Yes              | What the command does               |
| 3     | **Contract**        | Recommended      | Inputs/outputs specification        |
| 4     | **Instructions**    | Yes              | Step-by-step execution              |
| 5     | **Examples**        | Recommended      | Usage demonstrations                |
| 6     | **Notes**           | Optional         | Caveats, requirements               |

### Minimal Command Structure

```markdown
---
description: [Action verb] [what it does]
argument-hint: "<required> [optional]"
allowed-tools: Tool1, Tool2
---

# Command Title

[One sentence describing purpose.]

## 1. 📋 PURPOSE

[2-3 sentences explaining the command.]

## 2. ⚡ INSTRUCTIONS

### Step 1: [Name]
[Instructions]

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`
```

---

## 5. 📝 STEP NUMBERING RULES

**Rule**: Use full integers only (1, 2, 3). No decimals (1.5, 2.5) or sub-steps (1.1, 1.2).

| Element  | Correct                   | Wrong              |
| -------- | ------------------------- | ------------------ |
| Steps    | Step 1, Step 2, Step 3    | Step 1.5, Step 2.5 |
| Phases   | PHASE 1, PHASE 2, PHASE 3 | PHASE 1.5, PHASE 2 |
| Sections | ## 1. 🎯 PURPOSE           | ## 1.1 PURPOSE     |

**Sub-activities**: Use bullets within a step, not decimal sub-steps:
```markdown
Step 3: Execute workflow
  - Load configuration
  - Validate inputs  
  - Run process
```

---

## 6. 🏷️ EMOJI VOCABULARY

Commands use two types of emojis: **semantic** (for blocking/validation states) and **section** (for content organization).

### Semantic Emojis (Blocking/Validation)

These emojis indicate workflow state and enforcement:

| Emoji | Name    | Purpose                     | Example Usage               |
| ----- | ------- | --------------------------- | --------------------------- |
| 🚨     | Alert   | Critical/mandatory sections | `# 🚨 MANDATORY PHASES`      |
| 🔒     | Lock    | Phase/gate headers          | `## 🔒 PHASE 1: INPUT`       |
| ✅     | Check   | Passed/success status       | `✅ PASSED`                  |
| ⏭️     | Skip    | N/A or skipped              | `⏭️ N/A (no memory files)`   |
| ⛔     | Stop    | Hard stop/blocking error    | `⛔ STOP - Phase incomplete` |
| ⚠️     | Warning | Non-blocking alert          | `⚠️ VIOLATION DETECTED`      |
| ❌     | Fail    | Validation failure          | `❌ FAILED`                  |

### Section Emojis (Standardized)

These emojis identify section types. Use EXACTLY as shown:

| Emoji | Section      | H2 Format                    | Purpose                      |
| ----- | ------------ | ---------------------------- | ---------------------------- |
| 🎯     | PURPOSE      | `## N. 🎯 PURPOSE`            | What the command does        |
| 📝     | CONTRACT     | `## N. 📝 CONTRACT`           | Inputs/outputs specification |
| 📊     | WORKFLOW     | `## N. 📊 WORKFLOW OVERVIEW`  | Process flow/steps table     |
| ⚡     | INSTRUCTIONS | `## N. ⚡ INSTRUCTIONS`       | How to execute               |
| 📌     | REFERENCE    | `## N. 📌 REFERENCE`          | Related resources            |
| 🔍     | EXAMPLES     | `## N. 🔍 EXAMPLES`           | Usage demonstrations         |
| 🔗     | RELATED      | `## N. 🔗 RELATED COMMANDS`   | Links to related commands    |
| 🔧     | TOOLS        | `## N. 🔧 TOOL SIGNATURES`    | MCP/tool configuration       |
| 🔀     | ROUTING      | `## N. 🔀 ARGUMENT ROUTING`   | Mode detection/dispatch      |
| 📚     | DOCS         | `## N. 📚 FULL DOCUMENTATION` | Link to full docs            |
| 📋     | INPUT        | `## N. 📋 USER INPUT`         | User input display           |

### Emoji Consistency Rules

1. **One emoji per purpose**: Don't use 📋 for PURPOSE (use 🎯)
2. **One purpose per emoji**: Don't use ⚡ for both INSTRUCTIONS and GATE STATUS
3. **Exact format**: `## N. [EMOJI] SECTION-NAME` (number, period, space, emoji, space, name)

---

## 7. 📁 FRONTMATTER REFERENCE

### Required Fields

```yaml
---
description: |
  Clear, action-oriented description.
  Start with action verb (Create, Search, Delete, Start, Stop).
  One to two sentences maximum.
  Shown in /help output.
---
```

### Recommended Fields

```yaml
---
argument-hint: "<required> [optional] [--flag]"
# Format conventions:
#   <angle-brackets> = required argument
#   [square-brackets] = optional argument
#   --flag = boolean flag
#   [default: value] = argument with default

allowed-tools: Tool1, Tool2, Tool3
# Common tools: Read, Write, Edit, Bash, Grep, Glob, Task
# MCP tools: mcp__[server-name]__[tool_function]
---
```

### Optional Fields

```yaml
---
name: command-name
# Override inferred name from filename

model: opus
# Override default model (USE SPARINGLY - only for complex reasoning)

version: 1.0.0
# Track command version

disable-model-invocation: true
# Prevent the AI agent from invoking this command
---
```

### Example

```yaml
---
description: Complete spec folder workflow (5 steps) - research through implementation
argument-hint: "<task> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Task
---
```

---

## 8. 🚨 MANDATORY GATE PATTERN (CRITICAL)

### Why This Pattern Exists

Without this gate, AI agents may:
- Infer tasks from conversation history or open files
- Assume what the user wants based on screenshots or context
- Proceed with incorrect assumptions instead of asking

### When to Use

| Argument Type                  | Use Mandatory Gate? | Example                              |
| ------------------------------ | ------------------- | ------------------------------------ |
| `<required>` (angle brackets)  | **YES**             | `<task>`, `<query>`, `<spec-folder>` |
| `[optional]` (square brackets) | No (has default)    | `[count]`, `[--flag]`                |
| `[:auto\|:confirm]` mode flags | No (mode selection) | Mode suffixes only                   |

### The Pattern

Add this block **immediately after frontmatter, before any other content**:

```markdown
# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

\`\`\`
IF $ARGUMENTS is empty, undefined, or contains only whitespace (ignoring mode flags):
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "[Context-appropriate question]"
        options:
          - label: "[Action label]"
            description: "[What user will provide]"
    → WAIT for user response
    → Use their response as the [input type]
    → Only THEN continue with this workflow

IF $ARGUMENTS contains [expected input]:
    → Continue reading this file
\`\`\`

**CRITICAL RULES:**
- **DO NOT** infer [input type] from context, screenshots, or existing files
- **DO NOT** assume what the user wants based on conversation history
- **DO NOT** proceed past this point without an explicit [input] from the user
- The [input] MUST come from `$ARGUMENTS` or user's answer to the question above
```

### Example Questions by Command Type

| Command Purpose    | Question                                          |
| ------------------ | ------------------------------------------------- |
| Planning           | "What would you like to plan?"                    |
| Research           | "What topic would you like to research?"          |
| Implementation     | "Which spec folder would you like to implement?"  |
| File improvement   | "What would you like to improve and which files?" |
| Prompt enhancement | "What prompt would you like to improve?"          |
| Generic routing    | "What request would you like to route?"           |

### Multi-Phase Blocking Pattern

For commands requiring multiple inputs before workflow execution:

```markdown
# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

> **HARD BLOCK**: Do not proceed past this section until ALL phases complete.

## 🔒 PHASE 1: INPUT COLLECTION
[Collect required inputs from $ARGUMENTS or prompt user]

## 🔒 PHASE 2: CONTEXT VERIFICATION
[Verify prerequisites exist]

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

| Phase            | Status | Blocker? |
| ---------------- | ------ | -------- |
| Input Collection | ✅/❌   | HARD     |
| Context Verify   | ✅/❌   | HARD     |

**Gate Check:** ALL phases must show ✅. ANY ❌ = STOP and resolve.
```

### Violation Self-Detection

Every workflow command MUST include:

```markdown
## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**Before proceeding, verify you have NOT:**
- [ ] Skipped any required phase
- [ ] Used project tools before completing phases
- [ ] Proceeded without required user confirmation

**If ANY violation:** STOP → State violation → Return to phase → Complete properly
```

### Gate Exemption Declaration

For commands exempt from Gate 3:

```markdown
## ⚡ GATE 3 STATUS: EXEMPT

| Aspect      | Value                            |
| ----------- | -------------------------------- |
| Location    | [Where output goes]              |
| Reason      | [Why exempt]                     |
| Alternative | [What replaces spec folder]      |
```

---

## 9. 📄 SIMPLE COMMAND TEMPLATE

Use for: Single-action commands with straightforward execution.

```markdown
---
description: [Action verb] [what it does] [context/scope]
argument-hint: "<required-arg> [optional-arg]"
allowed-tools: Tool1, Tool2
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

\`\`\`
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present options to user
    → WAIT for user response
    → Only THEN continue

IF $ARGUMENTS contains required input:
    → Continue reading this file
\`\`\`

**CRITICAL RULES:**
- **DO NOT** infer from context, screenshots, or conversation history
- **DO NOT** assume what the user wants
- **DO NOT** proceed without explicit input from the user

---

# [Command Title]

[One sentence describing what this command does and when to use it.]

---

## 1. 📋 PURPOSE

[2-3 sentences explaining the command's purpose and primary use case.]

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — [Description of expected arguments]
**Outputs:** `STATUS=<OK|FAIL> [ADDITIONAL_DATA=<value>]`

---

## 3. ⚡ INSTRUCTIONS

Execute the following steps:

### Step 1: [Step Name]

- [Sub-step or detail]
- [Sub-step or detail]

### Step 2: [Step Name]

- [Sub-step or detail]

### Step 3: Return Status

- If successful: `STATUS=OK [DATA=<value>]`
- If failed: `STATUS=FAIL ERROR="<message>"`

---

## 4. 🔍 EXAMPLE USAGE

### Basic Usage

\`\`\`bash
/command-name "argument"
\`\`\`

### With Optional Args

\`\`\`bash
/command-name "argument" --flag
\`\`\`

---

## 5. 📊 EXAMPLE OUTPUT

\`\`\`
[Formatted output example]

STATUS=OK DATA=<value>
\`\`\`

---

## 6. 📌 NOTES

- **[Category]:** [Important note about usage]
- **[Category]:** [Performance or limitation note]
- **Requirements:** [Prerequisites or dependencies]
```

### Simple Command Example

```yaml
---
description: Search codebase semantically using natural language queries
argument-hint: "<query> [--refined]"
allowed-tools: mcp__semantic-search__semantic_search
---
```

---

## 10. 📊 WORKFLOW COMMAND TEMPLATE

Use for: Multi-step processes with defined phases and outputs.

```markdown
---
description: [Workflow name] ([N] steps) - [brief purpose]
argument-hint: "<topic> [context]"
allowed-tools: Read, Write, Edit, Bash, Task
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

[Include mandatory gate pattern from Section 6]

---

# [Workflow Title]

**Purpose**: [One sentence describing the workflow's goal and primary output.]

---

## 1. 📋 USER INPUT

\`\`\`text
$ARGUMENTS
\`\`\`

---

## 2. 🔍 WORKFLOW OVERVIEW ([N] STEPS)

| Step | Name         | Purpose               | Outputs             |
| ---- | ------------ | --------------------- | ------------------- |
| 1    | [Step Name]  | [What it does]        | [Artifacts created] |
| 2    | [Step Name]  | [What it does]        | [Artifacts created] |
| 3    | [Step Name]  | [What it does]        | [Artifacts created] |
| N    | Save Context | Preserve conversation | memory/*.md         |

---

## 3. ⚡ INSTRUCTIONS

### Step 1: [Step Name]

[Detailed instructions for this step]

**Validation checkpoint:**
- [ ] [Condition that must be true]
- [ ] [Another condition]

### Step 2: [Step Name]

[Detailed instructions for this step]

---

## 4. 🔧 FAILURE RECOVERY

| Failure Type        | Recovery Action  |
| ------------------- | ---------------- |
| [Failure condition] | [How to recover] |
| [Another condition] | [Recovery steps] |

---

## 5. ⚠️ ERROR HANDLING

| Condition          | Action                            |
| ------------------ | --------------------------------- |
| Empty `$ARGUMENTS` | Prompt user: "Please describe..." |
| [Other condition]  | [Action to take]                  |

---

## 6. 📁 TEMPLATES USED

- `.opencode/skill/system-spec-kit/templates/[template].md`
- [Other template references]

---

## 7. 📊 COMPLETION REPORT

After workflow completion, report:

\`\`\`
✅ [Workflow Name] Complete

[Summary of what was accomplished]

Artifacts Created:
- [artifact 1]
- [artifact 2]

Next Steps:
- [Recommended follow-up action]
\`\`\`

---

## 8. 🎯 EXAMPLES

**Example 1: [Use case]**
\`\`\`
/workflow-name [arguments]
\`\`\`

**Example 2: [Another use case]**
\`\`\`
/workflow-name [different arguments]
\`\`\`
```

---

## 11. 🔀 MODE-BASED COMMAND TEMPLATE

Use for: Commands supporting `:auto` and `:confirm` execution modes.

```markdown
---
description: [Workflow name] ([N] steps) - [purpose]. Supports :auto and :confirm modes
argument-hint: "<request> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Task
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

[Include mandatory gate pattern from Section 6]

---

# [Command Title]

**Purpose**: [Description of what this command accomplishes.]

---

## 1. 📋 USER INPUT

\`\`\`text
$ARGUMENTS
\`\`\`

---

## 2. 🔍 MODE DETECTION & ROUTING

### Step 1: Parse Mode Suffix

Detect execution mode from command invocation:

| Pattern                | Mode        | Behavior                                      |
| ---------------------- | ----------- | --------------------------------------------- |
| `/command:auto`        | AUTONOMOUS  | Execute all steps without user approval gates |
| `/command:confirm`     | INTERACTIVE | Pause at each step for user approval          |
| `/command` (no suffix) | PROMPT      | Ask user to choose mode                       |

### Step 2: Mode Selection (when no suffix detected)

If no `:auto` or `:confirm` suffix is present, present options to user:

**Question**: "How would you like to execute this workflow?"

| Option | Mode        | Description                                                    |
| ------ | ----------- | -------------------------------------------------------------- |
| **A**  | Autonomous  | Execute all steps without approval gates. Best for [use case]. |
| **B**  | Interactive | Pause at each step for approval. Best for [use case].          |

**Wait for user response before proceeding.**

### Step 3: Transform Raw Input

Parse the raw text from `$ARGUMENTS` and transform into structured fields.

---

## 3. ⚡ KEY BEHAVIORS

### Autonomous Mode (`:auto`)
- Executes all steps without user approval gates
- Self-validates at each checkpoint
- Makes informed decisions based on best judgment
- Documents all significant decisions

### Interactive Mode (`:confirm`)
- Pauses after each step for user approval
- Presents options: Approve, Review Details, Modify, Skip, Abort
- Documents user decisions at each checkpoint
- Allows course correction throughout workflow

---

## 4. 📁 CONTEXT LOADING

When resuming work in an existing spec folder, prompt to load prior session memory:
- **A)** Load most recent memory file (quick context refresh)
- **B)** Load all recent files (up to 3) (comprehensive context)
- **C)** List all files and select specific (historical search)
- **D)** Skip (start fresh, no context)

---

## 5. 🎯 EXAMPLES

**Example 1: Autonomous execution**
\`\`\`
/command:auto [arguments]
\`\`\`

**Example 2: Interactive execution**
\`\`\`
/command:confirm [arguments]
\`\`\`

**Example 3: Prompt for mode selection**
\`\`\`
/command [arguments]
\`\`\`
```

---

## 12. 🧭 ARGUMENT DISPATCH PATTERN

Use for: Commands that accept multiple argument types and need to route to different actions.

### Pattern Overview

When a single command handles multiple argument patterns (like `/semantic_search` accepting queries, actions, and flags), use an ASCII decision tree to document the routing logic clearly.

### When to Use Argument Dispatch

| Scenario                                   | Use Pattern?                 |
| ------------------------------------------ | ---------------------------- |
| Command has multiple action keywords       | **Yes**                      |
| Command accepts both keywords AND queries  | **Yes**                      |
| Command has only one action                | No (use simple template)     |
| Command uses `:auto`/`:confirm` modes only | No (use mode-based template) |

### The Pattern

```markdown
---
description: [Command] with multiple entry points
argument-hint: "[action|query] [options]"
allowed-tools: [Tools]
---

# [Command Title]

---

## 1. 📋 ARGUMENT DISPATCH

\`\`\`
$ARGUMENTS
    │
    ├─► Empty (no args)
    │   └─► DEFAULT ACTION: [What happens with no args]
    │
    ├─► First word matches ACTION KEYWORD (case-insensitive)
    │   ├─► "start" | "on" | "init"       → START ACTION
    │   ├─► "stop" | "off" | "kill"       → STOP ACTION
    │   ├─► "status" | "info"             → STATUS ACTION
    │   ├─► "search" | "find" | "query"   → SEARCH ACTION (remaining args = query)
    │   └─► "reset" | "clear"             → RESET ACTION
    │
    ├─► Looks like NATURAL LANGUAGE QUERY
    │   Detection: 2+ words, question words, code terms, quotes
    │   └─► SEARCH ACTION (full args = query)
    │
    └─► Single ambiguous word
        └─► [DEFAULT ACTION] (assume most common intent)
\`\`\`

---

## 2. ⚡ ACTION HANDLERS

### START ACTION
[Instructions for start]

### STOP ACTION
[Instructions for stop]

### SEARCH ACTION
[Instructions for search]

---

## 3. 📊 EXAMPLE ROUTING

| Input                | Detected As      | Action                  |
| -------------------- | ---------------- | ----------------------- |
| (empty)              | No args          | Show menu/help          |
| `start`              | Keyword          | START ACTION            |
| `how does auth work` | Natural language | SEARCH ACTION           |
| `oauth`              | Single word      | SEARCH ACTION (default) |
```

### Real Example: `/semantic_search`

```
/semantic_search [args]
    │
    ├─► No args
    │   └─► Show usage help
    │
    ├─► "index" | "reindex" | "rebuild"
    │   └─► INDEX ACTION: Rebuild vector index
    │
    ├─► "status" | "health"
    │   └─► STATUS ACTION: Show index health
    │
    ├─► Natural language query (2+ words)
    │   └─► SEARCH ACTION: Execute semantic search
    │
    └─► Single ambiguous word
        └─► SEARCH ACTION (assume search intent)
```

### Combining with Mode-Based Pattern

For commands that need BOTH argument dispatch AND mode support:

```
$ARGUMENTS
    │
    ├─► Parse mode suffix (:auto | :confirm)
    │
    └─► After mode extraction, dispatch remaining args:
        ├─► "action1" → ACTION 1
        ├─► "action2" → ACTION 2
        └─► Natural language → DEFAULT ACTION
```

---

## 13. ⚠️ DESTRUCTIVE COMMAND TEMPLATE

Use for: Commands that delete data or make irreversible changes.

```markdown
---
description: [Action] (DESTRUCTIVE)
argument-hint: "[--confirm]"
allowed-tools: Bash
---

# [Command Title]

**DESTRUCTIVE OPERATION** - [Brief warning about what will be affected.]

---

## 1. 📋 PURPOSE

[Explain the destructive action and why it might be needed.]

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Must include `--confirm` flag to skip prompt
**Outputs:** `STATUS=<OK|FAIL|CANCELLED> ACTION=<action|cancelled>`

---

## 3. ⚡ INSTRUCTIONS

### Step 1: Safety Check - Require Confirmation

- Check if `--confirm` flag is present in `$ARGUMENTS`
- If NOT present:
  - Ask user: "[Warning message]. Are you sure?"
  - Options: "Yes, proceed" / "No, cancel"
  - If user cancels: `STATUS=CANCELLED ACTION=cancelled`

### Step 2: Show What Will Be Affected

- Display current state
- List items that will be deleted/changed
- Show size/count of affected data

### Step 3: Execute Destructive Action

- [Step-by-step execution]
- Log each action taken

### Step 4: Verify Completion

- Confirm action completed
- Show new state

### Step 5: Provide Recovery Guidance

- Explain how to rebuild/restore if needed
- Link to relevant commands

### Step 6: Return Status

- If completed: `STATUS=OK ACTION=[action]`
- If cancelled: `STATUS=CANCELLED ACTION=cancelled`
- If failed: `STATUS=FAIL ERROR="<message>"`

---

## 4. 🔍 EXAMPLE USAGE

### Without Confirmation (Safe Default)

\`\`\`bash
/command-name
\`\`\`
→ Will prompt for confirmation before proceeding

### With Confirmation Flag (Skip Prompt)

\`\`\`bash
/command-name --confirm
\`\`\`
→ Proceeds immediately (use with caution)

---

## 5. 📌 NOTES

- **When to Use:**
  - [Valid use case 1]
  - [Valid use case 2]

- **Impact:**
  - [What will be lost]
  - [Other consequences]
  - [What is preserved]
  - [Recovery options]

- **Alternatives to Consider:**
  - [Less destructive alternative]
  - [Another option]

---

## 6. 🛡️ SAFETY FEATURES

- Requires explicit confirmation by default
- Shows what will be affected before proceeding
- Provides clear recovery steps
- Cannot accidentally affect [protected items]
```

---

## 14. 📁 NAMESPACE COMMAND PATTERN

Use for: Grouping related commands under a common prefix.

### Directory Structure

```
.opencode/command/
└── [namespace]/           # Directory name = namespace
    ├── [action1].md       # → /namespace:action1
    ├── [action2].md       # → /namespace:action2
    └── [action3].md       # → /namespace:action3
```

### Example: Index Namespace

```
.opencode/command/
└── index/
    ├── start.md     → /index:start
    ├── stop.md      → /index:stop
    ├── search.md    → /index:search
    ├── stats.md     → /index:stats
    ├── history.md   → /index:history
    └── reset.md     → /index:reset
```

### Naming Conventions

| Element             | Convention             | Example                      |
| ------------------- | ---------------------- | ---------------------------- |
| Namespace directory | lowercase, hyphen-case | `index/`, `git-workflow/`    |
| Action files        | lowercase, hyphen-case | `search.md`, `full-reset.md` |
| Resulting command   | namespace:action       | `/index:search`              |

---

## 15. ✅ VALIDATION CHECKLIST

Before publishing a command, verify:

### Frontmatter

- [ ] `description` is present and action-oriented
- [ ] `argument-hint` shows expected format (if args expected)
- [ ] `allowed-tools` lists all tools used (if any)
- [ ] No angle brackets `< >` in description (reserved for hints)

### Mandatory Gate (CRITICAL for required arguments)

- [ ] If `argument-hint` contains `<required>` args → **MANDATORY GATE present**
- [ ] Gate is **immediately after frontmatter**, before any other content
- [ ] Gate presents options to user with appropriate question
- [ ] Gate includes all 4 CRITICAL RULES (DO NOT infer, assume, proceed)
- [ ] Skip gate only if ALL arguments are `[optional]` with defaults

### Structure

- [ ] H1 title matches command purpose
- [ ] H2 sections use format: `## N. [EMOJI] SECTION-NAME` (see Section 6 for emoji vocabulary)
- [ ] H3 subsections: `### Step N: Description`
- [ ] Dividers (`---`) between major sections
- [ ] Instructions are numbered and actionable
- [ ] Example usage shows 2-3 scenarios
- [ ] Full integer step numbering only (no 1.5, 2.5 - see Section 5)

### Header Format

- [ ] H1: Plain title only (`# Command Title`) or with semantic emoji for blocking sections (`# 🚨 MANDATORY PHASES`)
- [ ] H2: Numbered + emoji + SECTION-NAME (`## 1. 🎯 PURPOSE`)
- [ ] H3/H4: Title case (`### Step 1: Description`)
- [ ] Consistent numbering (1, 2, 3...)
- [ ] Emojis from approved vocabulary (Section 6)

**Blocking Phase Pattern:**
Commands with mandatory input phases use these semantic emojis:
- `# 🚨 MANDATORY PHASES` - Critical blocking section (H1)
- `## 🔒 PHASE N:` - Required blocking phases (H2)
- `## ✅ PHASE STATUS VERIFICATION` - Gate checks (H2)
- `## ⚠️ VIOLATION SELF-DETECTION` - Violation recovery (H2)

---

## 16. 🎭 ORCHESTRATOR + WORKERS PATTERN

Use for: Commands that spawn parallel sub-agents for exploration/analysis.

```
OPUS ORCHESTRATOR → Dispatches → SONNET WORKERS (parallel)
     │                              │
     └── Synthesizes ←──────────────┘
```

| Role             | Model    | Responsibility                                        |
| ---------------- | -------- | ----------------------------------------------------- |
| **Orchestrator** | `opus`   | Task understanding, dispatch, verification, synthesis |
| **Workers**      | `sonnet` | Fast parallel exploration, hypothesis generation      |

**Use when**: Parallel codebase exploration, multi-aspect analysis, complex planning.
**Skip when**: Simple single-action commands, sequential workflows.

---

## 17. 📊 STATUS OUTPUT PATTERNS

### Standard Patterns

| Pattern                                 | Use Case       | Example              |
| --------------------------------------- | -------------- | -------------------- |
| `STATUS=OK`                             | Simple success | Basic commands       |
| `STATUS=OK RESULTS_COUNT=N`             | Search/query   | `/index:search`      |
| `STATUS=OK ACTION=<action>`             | State change   | `/index:start`       |
| `STATUS=OK ACTION=<action> PATH=<path>` | File creation  | `/spec_kit:complete` |
| `STATUS=FAIL ERROR="<message>"`         | All failures   | Error handling       |
| `STATUS=CANCELLED ACTION=cancelled`     | User abort     | Interactive commands |

---

## 18. 📋 BEST PRACTICES SUMMARY

### DO

| Practice                                 | Reason                            |
| ---------------------------------------- | --------------------------------- |
| Include mandatory gate for required args | Prevents context inference errors |
| Use action verbs in descriptions         | Clear, scannable in /help         |
| Document all steps with checkpoints      | Enables debugging and recovery    |
| Provide example usage                    | Users learn faster                |
| Return structured status                 | Enables automation                |
| Use appropriate command type             | Right tool for the job            |

### DON'T

| Anti-Pattern               | Problem                      |
| -------------------------- | ---------------------------- |
| Skip mandatory gate        | AI will infer incorrectly    |
| Vague descriptions         | Users won't know when to use |
| Missing error handling     | Failures become mysterious   |
| No examples                | Users struggle to start      |
| Inconsistent status format | Breaks automation            |
| Over-complex commands      | Split into namespace instead |

---

## 19. 🔗 RELATED RESOURCES

### Templates
- [frontmatter_templates.md](../documentation/frontmatter_templates.md) - Frontmatter by document type
- [skill_md_template.md](./skill_md_template.md) - If converting to skill

### Standards
- [core_standards.md](../../references/core_standards.md) - Document type rules
- [validation.md](../../references/validation.md) - Quality scoring