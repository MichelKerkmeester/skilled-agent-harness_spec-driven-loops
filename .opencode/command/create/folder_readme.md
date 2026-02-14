---
description: Create an AI-optimized README.md file with proper structure, table of contents, and comprehensive documentation - supports :auto and :confirm modes
argument-hint: "<target-path> [--type <project|component|feature|skill>] [:auto|:confirm]"
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
>    - Auto mode → `create_folder_readme_auto.yaml`
>    - Confirm mode → `create_folder_readme_confirm.yaml`
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
    │   │   • workflows-documentation skill integration               │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @write /create:folder_readme [target-path]               │
    │   │                                                            │
    │   │ Reference: .opencode/agent/write.md                        │
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

**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together), with an optional follow-up only if README already exists.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains target path:
   ├─ IF $ARGUMENTS has path content (ignoring flags) → target_path = $ARGUMENTS, omit Q0
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. CHECK if $ARGUMENTS contains --type flag:
   ├─ IF --type flag present → readme_type = [parsed value], omit Q1
   └─ IF no --type flag → include Q1 in prompt

4. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Target Path** (if not provided in command):              │
   │    Where should the README be created?                         │
   │    (e.g., .opencode/skill/my-skill, src/components, ./)        │
   │                                                                │
   │ **Q1. README Type** (if not provided via --type):              │
   │    A) Project - Main project documentation at root level       │
   │    B) Component - Documentation for a module/package/skill     │
   │    C) Feature - Documentation for a specific feature/system     │
   │    D) Skill - Documentation for an OpenCode skill              │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ Reply with answers, e.g.: "B, A" or "src/components, B, A"     │
   └────────────────────────────────────────────────────────────────┘

5. WAIT for user response (DO NOT PROCEED)

6. Parse response and store ALL results:
   - target_path = [from Q0 or $ARGUMENTS]
   - readme_type = [A/B/C/D from Q1 or --type flag → project/component/feature/skill]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]

7. VERIFY target and check for existing README:
   ├─ Check if target path exists:
   │   $ ls -la [target_path] 2>/dev/null
   │
   ├─ IF target path does not exist:
   │   └─ Create directory: mkdir -p [target_path]
   │
   ├─ Check for existing README:
   │   $ ls -la [target_path]/README.md 2>/dev/null
   │
   └─ IF README.md already exists:
       ├─ ASK user (ONLY conditional follow-up):
       │   ┌────────────────────────────────────────────────────────────┐
       │   │ **README.md already exists at [path].**                    │
       │   │                                                            │
       │   │ **Q3. How should we proceed?**                             │
       │   │    A) Overwrite existing file                               │
       │   │    B) Create backup and overwrite                          │
       │   │    C) Merge/update existing content                        │
       │   │    D) Cancel                                               │
       │   └────────────────────────────────────────────────────────────┘
       ├─ WAIT for user response
       └─ Process based on choice (D = RETURN STATUS=CANCELLED)

8. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create directories without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer README location from context
```

**Phase Output:**
- `write_agent_verified = ________________`
- `target_path = ________________`
- `readme_type = ________________`
- `execution_mode = ________________`
- `existing_readme_action = ________________` (if applicable)

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                |
| ---------------------- | ------------- | ---------- | --------------------- |
| write_agent_verified   | ✅ Yes         | ______     | Automatic check       |
| target_path            | ✅ Yes         | ______     | Q0 or $ARGUMENTS      |
| readme_type            | ✅ Yes         | ______     | Q1 or --type flag     |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2          |
| existing_readme_action | ○ Conditional | ______     | Q3 (if README exists) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "⚡ INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚡ INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_folder_readme_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_folder_readme_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, resource routing, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## Agent Routing

This command dispatches a specialized agent at a specific workflow step (see YAML for details):

| Step | Agent | Rule | Purpose |
|------|-------|------|---------|
| 5b: Quality Review | @review | §3 — @review for quality scoring | 100-point rubric scoring of created README |

**Agent file**: `.opencode/agent/review.md`

---

## ⛔ GATE 3 STATUS: EXEMPT (Self-Documenting Artifact)

**This command creates documentation files that ARE the documentation artifact.**

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| **Location**    | User-specified path (`install_guides/` or target directory) |
| **Reason**      | The created file IS the documentation                       |
| **Spec Folder** | Not required - the guide/README serves as its own spec      |

---

<!-- REFERENCE ONLY -->

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Started reading the workflow section before all fields are set
- Proceeded without explicit target path
- Overwrote existing README without confirmation
- Inferred README location from context instead of explicit user input

**Workflow Violations (Steps 1-5):**
- Skipped content discovery and jumped to generation
- Generated README without identifying key features first
- Did not validate structure before claiming complete

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. VERIFY outputs exist
6. MARK step ✅ in tracking table
7. CONTINUE to next step in sequence
```

<!-- END REFERENCE -->

---

## 📋 MODE BEHAVIORS

**AUTONOMOUS (:auto):**
- Execute all steps without approval prompts
- Only stop for errors or missing required input
- Best for: Experienced users, scripted workflows, batch operations

**INTERACTIVE (:confirm):**
- Pause at each major step for user approval
- Show preview before file creation
- Ask for confirmation on critical decisions
- Best for: New users, learning workflows, high-stakes changes

**Default:** INTERACTIVE (creation workflows benefit from confirmation)

---

## 📊 WORKFLOW TRACKING

| STEP | NAME       | STATUS | REQUIRED OUTPUT     | VERIFICATION                |
| ---- | ---------- | ------ | ------------------- | --------------------------- |
| 1    | Analysis   | ☐      | README type, path   | Type and location confirmed |
| 2    | Discovery  | ☐      | Features, structure | Project info gathered       |
| 3    | Structure  | ☐      | Section structure   | Template selected           |
| 4    | Generation | ☐      | README.md           | Complete README written     |
| 5    | Validation | ☐      | Validated README    | Structure verified          |

---

## 📊 WORKFLOW DIAGRAM

```mermaid
flowchart TD
    classDef phase fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff
    classDef wait fill:#4a1d6b,stroke:#a855f7,color:#fff

    START(["/create:folder_readme"]) --> SETUP

    subgraph SETUP["UNIFIED SETUP PHASE"]
        S1[@write check] --> S2[Parse mode suffix] --> S3[Check $ARGUMENTS] --> S4{{"Q0-Q2<br/>(consolidated)"}}
        S4 --> S5[Parse response]
    end

    SETUP --> WRITE_CHECK{@write<br/>agent?}
    WRITE_CHECK -->|No| BLOCK[/"⛔ HARD BLOCK<br/>Restart with @write"/]
    BLOCK --> END_FAIL([End - User Action Required])
    WRITE_CHECK -->|Yes| README_CHECK{README<br/>exists?}
    README_CHECK -->|Yes| CONFLICT[/"Q3: Overwrite?<br/>(A-D options)"/]
    README_CHECK -->|No| WORKFLOW
    CONFLICT --> WAIT_Q3{{Wait for User}}
    WAIT_Q3 --> WORKFLOW

    subgraph WORKFLOW["Steps 1-5: README Creation"]
        W1[Step 1: Analysis<br/>Confirm type + path]
        W2[Step 2: Discovery<br/>Gather project info]
        W3[Step 3: Structure<br/>Select template]
        W4[Step 4: Generation<br/>Write README.md]
        W5[Step 5: Validation<br/>Verify structure]

        W1 --> W2 --> W3 --> W4 --> W5
        W5 --> DONE([/"✅ README Complete"/])
    end

    class WRITE_CHECK,README_CHECK gate
    class DONE verify
    class S1,S2,S3,S5,W1,W2,W3,W4,W5 phase
    class S4,WAIT_Q3 wait
```

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 2 (Discovery) REQUIREMENTS:
├─ MUST gather project information before writing
├─ MUST identify key features and structure
├─ MUST determine appropriate sections for type
└─ MUST NOT proceed without content to document

STEP 4 (Generation) REQUIREMENTS:
├─ MUST include title + tagline
├─ MUST include TABLE OF CONTENTS
├─ MUST use numbered sections with emojis
├─ MUST include tables for structured data
└─ MUST NOT leave placeholder content

STEP 5 (Validation) REQUIREMENTS:
├─ MUST verify all sections are linked in TOC
├─ MUST check no placeholders remain
├─ MUST validate horizontal rules present
└─ MUST NOT claim "complete" without structure check
```

---

## 1. 🎯 PURPOSE

Create a comprehensive README.md following the documentation patterns from SpecKit, Memory System, and Code Environment READMEs. The README will use numbered sections with emojis, table of contents, tables for data, and proper progressive disclosure.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Target path with optional --type flag (project|component|feature|skill)
**Outputs:** README.md file at target path + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📌 REFERENCE (See YAML for Details)

| Section           | Location in YAML                                   |
| ----------------- | -------------------------------------------------- |
| README Types      | `readme_types`                                     |
| Key Patterns      | `template_references`                              |
| Section Templates | `templates`                                        |
| Failure Recovery  | `error_recovery`                                   |
| Completion Report | `completion_report`                                |

**Reference READMEs:**
- `.opencode/skill/system-spec-kit/README.md` (SpecKit + Memory pattern)

---

## 4. 🔍 EXAMPLES

**Example 1: Project README**
```
/create:folder_readme ./ --type project
```
→ Creates comprehensive project README at root

**Example 2: Skill README**
```
/create:folder_readme .opencode/skill/my-skill --type skill
```
→ Creates skill documentation with triggers, commands, MCP tools

**Example 3: Component README**
```
/create:folder_readme ./src/auth --type component
```
→ Creates component README with API, usage, integration

**Example 4: Auto mode (no prompts)**
```
/create:folder_readme ./ --type project :auto
```
→ Creates README without approval prompts, only stops for errors

**Example 5: Confirm mode (step-by-step approval)**
```
/create:folder_readme .opencode/skill/my-skill --type skill :confirm
```
→ Pauses at each step for user confirmation

---

## 5. 🔗 COMMAND CHAIN

This command creates standalone documentation:

```
/create:folder_readme → [Verify README]
```

**Related commands:**
- Create install guide: `/create:install_guide [project]`

---

## 6. 📌 NEXT STEPS

After README creation completes, suggest relevant next steps:

| Condition             | Suggested Command                 | Reason                         |
| --------------------- | --------------------------------- | ------------------------------ |
| README created        | Review and verify links work      | Confirm TOC links correctly    |
| Need install guide    | `/create:install_guide [project]` | Add installation documentation |
| Create another README | `/create:folder_readme [path]`    | Document related component     |
| Want to save context  | `/memory:save [spec-folder-path]` | Preserve documentation context |

**ALWAYS** end with: "What would you like to do next?"
