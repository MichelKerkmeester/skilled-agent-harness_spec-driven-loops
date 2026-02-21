---
description: "Create a reference file for an existing skill - deep-dive technical documentation with workflows, patterns, or debugging guides - supports :auto and :confirm modes"
argument-hint: "<skill-name> <reference-type> [--chained] [:auto|:confirm]"
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
>    - Auto mode → `create_skill_reference_auto.yaml`
>    - Confirm mode → `create_skill_reference_confirm.yaml`
> 5. Execute the YAML workflow step by step
>
> The @write references below are self-verification checks — not dispatch instructions.
> All content after the Setup Phase is reference context for the YAML workflow.

---

# 🚨 PHASE 0: @WRITE AGENT VERIFICATION

**STATUS: ☐ BLOCKED / ⏭️ N/A if chained**

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
    │   │   @write /create:skill_reference [skill-name] [type]       │
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

**STATUS: ☐ BLOCKED / ⏭️ N/A if chained**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction (0 if --chained).

**⚡ CHAINED EXECUTION MODE:** If invoked with `--chained` flag, skip to workflow with provided parameters.

```
EXECUTE THIS SINGLE SETUP PHASE:

1. CHECK for --chained flag FIRST (PRIORITY):
   ├─ IF invoked with --chained flag OR called from skill.md Step 8:
   │   │
   │   ├─ VERIFY parent workflow provided:
   │   │   ├─ skill_name (from parent)
   │   │   ├─ skill_path (from parent - already verified)
   │   │   ├─ reference_type (from parent selection)
   │   │   ├─ execution_mode (inherited from parent)
   │   │
   │   ├─ IF all parameters present:
   │   │   ├─ SET write_agent_verified = "skipped-chained"
   │   │   ├─ SET STATUS: ⏭️ N/A (parent verified)
   │   │   └─ SKIP directly to "⚡ INSTRUCTIONS" section
   │   │
   │   └─ IF parameters missing:
   │       └─ FALL THROUGH to step 2 (normal execution)
   │
   └─ IF NOT chained:
       └─ CONTINUE to step 2

2. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

3. CHECK if $ARGUMENTS contains skill name and reference type:
   ├─ Parse first argument as: skill_name (if present, omit Q0)
   ├─ Parse second argument as: reference_type (if present AND valid, omit Q1)
   │   └─ Valid types: workflow, patterns, debugging, tools, quick_ref
   └─ IF either missing or invalid → include in prompt

4. List available skills:
   $ ls .opencode/skill/*/SKILL.md 2>/dev/null | sed 's|.*/skill/||;s|/SKILL.md||'

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Skill Name** (if not provided in command):               │
   │    Which existing skill needs a reference file?                 │
   │    Available: [list from ls command]                           │
   │                                                                │
   │ **Q1. Reference Type** (if not provided or invalid):           │
   │    A) Workflow - Multi-phase processes                          │
   │    B) Patterns - Code patterns library                         │
   │    C) Debugging - Troubleshooting guide                        │
   │    D) Tools - External tool integration                        │
   │    E) Quick_ref - Commands/shortcuts                           │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ Reply with answers, e.g.: "A, A" or "my-skill, A, A"           │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - skill_name = [from Q0 or $ARGUMENTS]
   - reference_type = [from Q1 or $ARGUMENTS: workflow/patterns/debugging/tools/quick_ref]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]

8. VERIFY skill exists (inline check):
   │
   ├─ Run: ls -d .opencode/skill/[skill_name] 2>/dev/null
   │
   ├─ IF skill found:
   │   ├─ Store path as: skill_path
   │   ├─ Verify SKILL.md exists
   │   └─ Check for existing references/ directory
   │
   └─ IF skill NOT found:
       │
       ├─ DISPLAY:
       │   ┌────────────────────────────────────────────────────────────┐
       │   │ "Skill '[skill_name]' not found at expected location."     │
       │   │                                                            │
       │   │ A) Provide correct skill name                              │
       │   │ B) Provide full path to skill                              │
       │   │ C) Create new skill first (/create:skill)                   │
       │   └────────────────────────────────────────────────────────────┘
       │
       └─ WAIT for response and process based on choice

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
⛔ NEVER infer skill name from context or conversation history
⛔ NEVER assume reference type without explicit input
⛔ NEVER create references for non-existent skills
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `write_agent_verified = ________________`
- `skill_name = ________________`
- `reference_type = ________________`
- `execution_mode = ________________`
- `skill_path = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                | REQUIRED | YOUR VALUE | SOURCE                     |
| -------------------- | -------- | ---------- | -------------------------- |
| write_agent_verified | ✅ Yes    | ______     | Step 1 (chained) or Phase 0 |
| skill_name           | ✅ Yes    | ______     | Q0 or $ARGUMENTS           |
| reference_type       | ✅ Yes    | ______     | Q1 or $ARGUMENTS           |
| execution_mode       | ✅ Yes    | ______     | Suffix or Q2               |
| skill_path           | ✅ Yes    | ______     | Step 8 verification        |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "⚡ INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_skill_reference_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_skill_reference_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, resource routing, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@review`) from this document
- **DO NOT** dispatch `@review` to review this workflow or command prompt
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: run Phase 0, then Setup Phase, then load the YAML file

---

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- ChatGPT: `.opencode/agent/chatgpt`
- Claude: `/.claude/agents`

---

## GATE 3 STATUS: EXEMPT (Predefined Location)

**This command creates files at a predefined location and is EXEMPT from the spec folder question.**

| Property        | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| **Location**    | `.opencode/skill/[skill-name]/references/` or `.opencode/skill/[skill-name]/assets/` |
| **Reason**      | Skill-internal files, not project documentation                                      |
| **Alternative** | Use `/create:skill` for full skill creation with spec folder                         |

---

## WORKFLOW TRACKING

| STEP | NAME          | STATUS | REQUIRED OUTPUT       | VERIFICATION               |
| ---- | ------------- | ------ | --------------------- | -------------------------- |
| 1    | Analysis      | ☐      | Skill path, ref type  | Skill verified, type valid |
| 2    | Planning      | ☐      | Sections, checkpoints | Content structure defined  |
| 3    | Template Load | ☐      | Structure patterns    | Template loaded            |
| 4    | Content       | ☐      | [reference_name].md   | Reference file created     |
| 5    | Validation    | ☐      | Updated SKILL.md      | Integration complete       |

---

## WORKFLOW DIAGRAM

```mermaid
flowchart TD
    subgraph setup["Unified Setup Phase"]
        CHAIN{"--chained flag?"}
        P0["@write Agent Check"]
        MODE["Mode Detection"]
        ARGS["Parse Arguments"]
        PROMPT["Consolidated Prompt"]
        VERIFY["Skill Verification"]
    end

    subgraph workflow["5-Step Workflow"]
        S1["Step 1: Analysis"]
        S2["Step 2: Planning"]
        S3["Step 3: Template Load"]
        S4["Step 4: Content Creation"]
        S5["Step 5: Validation"]
    end

    START(["/create:skill_reference"]) --> CHAIN

    CHAIN -->|Yes + params| SKIP_SETUP["Skip to Workflow<br/>(Parent verified)"]
    CHAIN -->|No| P0

    P0 -->|"✅ @write agent"| MODE
    P0 -->|"❌ Not @write"| BLOCK0[/"⛔ HARD BLOCK<br/>Restart with @write"/]

    MODE --> ARGS
    ARGS -->|"Has values"| VERIFY
    ARGS -->|"Missing values"| PROMPT

    PROMPT --> WAIT[/"Wait for response"/]
    WAIT --> VERIFY

    VERIFY -->|"✅ Skill found"| GATE{"All Fields<br/>Set?"}
    VERIFY -->|"❌ Not found"| ASK[/"Ask: Correct path?"/]
    ASK --> VERIFY

    SKIP_SETUP --> S1
    GATE -->|Yes| S1
    GATE -->|No| PROMPT

    S1 -->|"Skill verified"| S2
    S2 -->|"Structure defined"| S3
    S3 -->|"Template loaded"| S4
    S4 -->|"File created"| S5
    S5 -->|"SKILL.md updated"| DONE([✅ Complete])

    classDef phase fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff
    classDef step fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef block fill:#7f1d1d,stroke:#dc2626,color:#fff

    class CHAIN,MODE,ARGS,PROMPT,VERIFY,P0 phase
    class GATE gate
    class S1,S2,S3,S4,S5 step
    class DONE verify
    class BLOCK0 block
```

---

## CRITICAL ENFORCEMENT RULES

```
STEP 2 (Planning) REQUIREMENTS:
├─ MUST determine content structure based on reference type
├─ MUST identify all sections needed for the type
├─ MUST define checkpoints for phased workflows
└─ MUST NOT proceed without clear content plan

STEP 4 (Content) REQUIREMENTS:
├─ MUST follow structure patterns from template
├─ MUST include code examples (before/after for patterns)
├─ MUST create validation checkpoints for workflows
└─ MUST NOT leave placeholder content

STEP 5 (Validation) REQUIREMENTS:
│       ├─ MUST update SKILL.md Navigation Guide
│       └─ MUST add routing rules to SMART ROUTING section
├─ MUST verify all sections are complete
└─ MUST NOT claim "complete" without integration update
```

---

## VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Executed command without @write agent verification when not chained
- Started reading the workflow section before all fields are set
- Proceeded without both skill name AND reference type
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Attempted to create reference for non-existent skill
- Inferred inputs from context instead of explicit user input
- Claimed chained mode without valid parent workflow parameters

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated the UNIFIED SETUP PHASE by [specific action]. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
```

---

## 1. PURPOSE

Create a technical reference file for an existing skill following the `skill_reference_template.md` structure. Reference files provide Level 3 progressive disclosure - deep technical guidance loaded when needed for complex operations.

**Template Location:** `.opencode/skill/sk-documentation/assets/opencode/skill_reference_template.md`

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name and reference type (workflow|patterns|debugging|tools|quick_ref)
**Outputs:** Reference file in skill's references/ directory + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. REFERENCE (See YAML for Details)

| Section            | Location in YAML                     |
| ------------------ | ------------------------------------ |
| Reference Types    | `reference_types`                    |
| Workflow Structure | `reference_types.workflow.structure` |
| Pattern Structure  | `reference_types.patterns.structure` |
| Chained Mode       | `operating_mode.chained_support`     |
| Failure Recovery   | `error_recovery`                     |
| Completion Report  | `completion_report`                  |

---

## 4. EXAMPLES

**Example 1: Create workflow reference**
```
/create:skill_reference sk-code--web workflow
```
→ Creates phased workflow documentation with checkpoints

**Example 2: Create patterns reference**
```
/create:skill_reference sk-documentation patterns
```
→ Creates before/after code pattern library

**Example 3: Create debugging reference**
```
/create:skill_reference mcp-chrome-devtools debugging
```
→ Creates systematic troubleshooting guide

**Example 4: Auto mode (no prompts)**
```
/create:skill_reference sk-code--web workflow :auto
```
→ Creates reference without approval prompts, only stops for errors

**Example 5: Confirm mode (step-by-step approval)**
```
/create:skill_reference sk-documentation patterns :confirm
```
→ Pauses at each step for user confirmation

---

## 5. COMMAND CHAIN

This command is often used after skill creation:

```
[/create:skill] → /create:skill_reference → [/create:skill_asset]
```

**Related commands:**
← `/create:skill [skill-name]` (create the skill first)
→ `/create:skill_asset [skill-name] [type]` (add asset files)

---

## 6. NEXT STEPS

After reference creation completes, suggest relevant next steps:

| Condition                   | Suggested Command                             | Reason                    |
| --------------------------- | --------------------------------------------- | ------------------------- |
| Skill needs more references | `/create:skill_reference [skill-name] [type]` | Add another reference     |
| Skill needs assets          | `/create:skill_asset [skill-name] template`   | Add templates or examples |
| Reference complete          | Verify SKILL.md Navigation Guide updated      | Confirm routing works     |
| Want to save context        | `/memory:save [spec-folder-path]`             | Preserve creation context |

**ALWAYS** end with: "What would you like to do next?"
