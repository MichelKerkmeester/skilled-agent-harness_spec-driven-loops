---
description: Create an asset file for an existing skill - templates, lookups, examples, or guides - supports :auto and :confirm modes
argument-hint: "<skill-name> <asset-type> [--chained] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> **YOU are the executor.** Run this workflow directly — do NOT delegate to other agents.
> Do NOT use the Task tool to dispatch sub-agents.
>
> **WORKFLOW SEQUENCE:**
> 1. Run Phase 0: Verify you are the @write agent (self-check, not a dispatch)
> 2. Run the Unified Setup Phase: gather user inputs in one consolidated prompt
> 3. Load the YAML workflow: `assets/create_skill_asset.yaml`
> 4. Execute the YAML steps sequentially
>
> The @write references below are self-verification checks — not dispatch instructions.
> Content after the setup phases is reference context for the YAML workflow.

## ⚡ GATE 3 STATUS: EXEMPT (Predefined Location)

**This command creates files at a predefined location and is EXEMPT from the spec folder question.**

| Property        | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| **Location**    | `.opencode/skill/[skill-name]/references/` or `.opencode/skill/[skill-name]/assets/` |
| **Reason**      | Skill-internal files, not project documentation                                      |
| **Alternative** | Use `/create:skill` for full skill creation with spec folder                         |

---

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** This workflow requires only 1 user interaction (0 if --chained).

**⚡ CHAINED EXECUTION MODE:** If invoked with `--chained` flag, skip to workflow with provided parameters.

---

## 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED / ⏭️ N/A if chained**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for --chained flag FIRST (before any other checks):
   ├─ IF invoked with --chained flag OR called from skill.md Step 8:
   │   │
   │   ├─ VERIFY parent workflow provided:
   │   │   ├─ skill_name (from parent)
   │   │   ├─ skill_path (from parent - already verified)
   │   │   ├─ asset_type (from parent selection)
   │   │   ├─ execution_mode (inherited from parent)
   │   │
   │   ├─ IF all parameters present:
   │   │   ├─ SET STATUS: ⏭️ N/A (chained mode - all inputs from parent)
   │   │   └─ SKIP directly to "# Asset Creation" workflow section
   │   │
   │   └─ IF parameters missing:
   │       └─ FALL THROUGH to step 2 (normal execution)
   │
   └─ IF NOT chained:
       └─ PROCEED to step 2

2. CHECK Phase 0: @write agent verification (automatic):
   ├─ SELF-CHECK: Are you operating as the @write agent?
   │   │
   │   ├─ INDICATORS that you ARE @write agent:
   │   │   ├─ You were invoked with "@write" prefix
   │   │   ├─ You have template-first workflow capabilities
   │   │   ├─ You load templates BEFORE creating content
   │   │
   │   ├─ IF YES (all indicators present):
   │   │   └─ CONTINUE to step 3
   │   │
   │   └─ IF NO or UNCERTAIN:
   │       │
   │       ├─ ⛔ HARD BLOCK - DO NOT PROCEED
   │       │
   │       ├─ DISPLAY to user:
   │       │   ┌────────────────────────────────────────────────────────────┐
   │       │   │ ⛔ WRITE AGENT REQUIRED                                    │
   │       │   │                                                            │
   │       │   │ This command requires the @write agent for:                │
   │       │   │   • Template-first workflow                                  │
   │       │   │   • DQI scoring                                            │
   │       │   │   • workflows-documentation skill integration               │
   │       │   │                                                            │
   │       │   │ To proceed, restart with:                                  │
   │       │   │   @write /create:skill_asset [args]                        │
   │       │   │                                                            │
   │       │   │ Reference: .opencode/agent/write.md                        │
   │       │   └────────────────────────────────────────────────────────────┘
   │       │
   │       └─ RETURN: STATUS=FAIL ERROR="Write agent required"

3. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

4. CHECK if $ARGUMENTS contains skill name and asset type:
   ├─ IF $ARGUMENTS has skill_name → omit Q0
   ├─ IF $ARGUMENTS has valid asset_type (template/lookup/example/guide) → omit Q1
   └─ IF $ARGUMENTS is empty or incomplete → include applicable questions

5. List available skills:
   $ ls .opencode/skill/*/SKILL.md 2>/dev/null | sed 's|.*/skill/||;s|/SKILL.md||'

6. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Skill Name** (if not provided):                          │
   │    Which existing skill needs an asset?                        │
   │    Available: [list from step 5]                               │
   │                                                                │
   │ **Q1. Asset Type** (required):                                 │
   │    A) Template - Copy-paste starting points                    │
   │    B) Lookup - Lookup tables, decisions                        │
   │    C) Example - Working code examples                          │
   │    D) Guide - Step-by-step how-tos                             │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ Reply with answers, e.g.: "A, A" or "my-skill, A, A"           │
   └────────────────────────────────────────────────────────────────┘

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - skill_name = [from Q0 or $ARGUMENTS]
   - asset_type = [A=template, B=lookup, C=example, D=guide from Q1 or $ARGUMENTS]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]

9. Verify skill exists (inline check, not separate phase):
   ├─ Run: ls -d .opencode/skill/[skill_name] 2>/dev/null
   │
   ├─ IF skill found:
   │   ├─ Store path as: skill_path
   │   ├─ Verify SKILL.md exists
   │   └─ CONTINUE to step 10
   │
   └─ IF skill NOT found:
       │
       ├─ DISPLAY error with options:
       │   ┌────────────────────────────────────────────────────────────┐
       │   │ Skill '[skill_name]' not found.                            │
       │   │                                                            │
       │   │ A) Provide correct skill name                              │
       │   │ B) Provide full path to skill                              │
       │   │ C) Create new skill first (/create:skill)                   │
       │   └────────────────────────────────────────────────────────────┘
       │
       ├─ WAIT for response
       └─ Process based on choice, then retry step 9

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer skill name from context or conversation history
⛔ NEVER assume asset type without explicit input
⛔ NEVER create assets for non-existent skills
```

**Phase Output:**
- `skill_name = ________________`
- `asset_type = ________________`
- `skill_path = ________________`
- `execution_mode = ________________`

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

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD          | REQUIRED | YOUR VALUE | SOURCE                  |
| -------------- | -------- | ---------- | ----------------------- |
| skill_name     | ✅ Yes    | ______     | Q0 or $ARGUMENTS        |
| asset_type     | ✅ Yes    | ______     | Q1 or $ARGUMENTS        |
| skill_path     | ✅ Yes    | ______     | Derived from skill_name |
| execution_mode | ✅ Yes    | ______     | Suffix or Q2            |

```
VERIFICATION CHECK:
├─ IF chained mode (--chained flag):
│   └─ All values from parent? → Proceed to workflow
│
├─ IF normal mode:
│   └─ ALL required fields have values? → Proceed to workflow
│
└─ OTHERWISE → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Executed command without @write agent verification when not chained
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without both skill name AND asset type
- Attempted to create asset for non-existent skill
- Inferred inputs from context instead of explicit user input
- Claimed chained mode without valid parent workflow parameters

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
```

---

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→5). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## WORKFLOW TRACKING

| STEP | NAME          | STATUS | REQUIRED OUTPUT        | VERIFICATION               |
| ---- | ------------- | ------ | ---------------------- | -------------------------- |
| 1    | Analysis      | ☐      | Skill path, asset type | Skill verified, type valid |
| 2    | Planning      | ☐      | Filename, sections     | File spec determined       |
| 3    | Template Load | ☐      | Structure patterns     | Template loaded            |
| 4    | Content       | ☐      | [asset_name].md        | Asset file created         |
| 5    | Validation    | ☐      | Updated SKILL.md       | Integration complete       |

---

## 📊 WORKFLOW DIAGRAM

```mermaid
flowchart TD
    subgraph phases["Pre-Execution Phases"]
        P0["Phase 0: @write Agent Verification"]
        PC["Phase C: Chained Check"]
        P1["Phase 1: Input Validation"]
        P2["Phase 2: Skill Verification"]
    end

    subgraph workflow["5-Step Workflow"]
        S1["Step 1: Analysis"]
        S2["Step 2: Planning"]
        S3["Step 3: Template Load"]
        S4["Step 4: Content Creation"]
        S5["Step 5: Validation"]
    end

    START((Start)) --> CHAINED{--chained flag?}

    CHAINED -->|Yes| PC
    CHAINED -->|No| P0

    P0 --> P0_GATE{@write agent?}
    P0_GATE -->|No| BLOCK[/"⛔ HARD BLOCK<br/>Restart with @write"/]
    P0_GATE -->|Yes| PC

    PC --> PC_GATE{Parent params<br/>provided?}
    PC_GATE -->|Yes, skip P1-P2| S1
    PC_GATE -->|No| P1

    P1 --> P1_GATE{skill_name &<br/>asset_type?}
    P1_GATE -->|Missing| ASK1[/"Ask user for input"/]
    ASK1 --> P1
    P1_GATE -->|Valid| P2

    P2 --> P2_GATE{Skill exists?}
    P2_GATE -->|No| ASK2[/"Ask: A) Correct name<br/>B) Full path<br/>C) Create skill"/]
    ASK2 --> P2
    P2_GATE -->|Yes| S1

    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> DONE((Complete))

    classDef phase fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff
    classDef block fill:#7f1d1d,stroke:#ef4444,color:#fff

    class P0,PC,P1,P2 phase
    class P0_GATE,PC_GATE,P1_GATE,P2_GATE,CHAINED gate
    class S1,S2,S3,S4,S5,DONE verify
    class BLOCK block
```

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 2 (Planning) REQUIREMENTS:
├─ MUST determine filename following naming conventions
├─ MUST identify sections based on asset type
├─ MUST plan content structure before generation
└─ MUST NOT proceed without clear file spec

STEP 4 (Content) REQUIREMENTS:
├─ MUST follow asset template structure
├─ MUST include examples appropriate to asset type
├─ MUST create content matching the asset purpose
└─ MUST NOT leave placeholder content

STEP 5 (Validation) REQUIREMENTS:
├─ MUST update SKILL.md Navigation Guide
├─ MUST add routing rules to SMART ROUTING section
├─ MUST verify asset is complete and functional
└─ MUST NOT claim "complete" without SKILL.md update
```

---

# Asset Creation

Create a new asset file for an existing skill following the `skill_asset_template.md` structure.

---

```yaml
role: Expert Asset Creator using workflows-documentation skill
purpose: Create skill asset files (templates, lookups, examples, guides)
action: Generate properly structured asset files with validation

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  chained_support: true
```

---

## 1. 🎯 PURPOSE

Create a new asset file for an existing skill following the `skill_asset_template.md` structure. Asset files provide templates, lookups, examples, or guides that support skill functionality.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name and asset type (template|lookup|example|guide)
**Outputs:** Asset file in skill's assets/ directory + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. ⚡ INSTRUCTIONS

### Step 4: Verify Unified Setup Passed

Confirm you have these values from the unified setup phase:
- `skill_name` from Q0 or $ARGUMENTS
- `asset_type` from Q1 or $ARGUMENTS
- `skill_path` derived from skill_name verification
- `execution_mode` from suffix or Q2

**If ANY field is incomplete, STOP and return to the UNIFIED SETUP PHASE section.**

### Step 5: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_skill_asset.yaml
```

The YAML file contains:
- Asset type specifications and naming conventions
- Step-by-step activities with checkpoints
- Content structure patterns per asset type
- SKILL.md integration procedures
- Validation requirements
- Completion report template

Execute all 5 steps in sequence following the workflow definition.

---

## 4. 📌 REFERENCE

### Asset Location
- **Path**: `.opencode/skill/[skill-name]/assets/`
- **Naming**: snake_case (e.g., `frontmatter_templates.md`, `config_examples.yaml`)

### Asset Types & Naming Conventions

| Type      | Naming Pattern           | Example                    | Purpose                    |
| --------- | ------------------------ | -------------------------- | -------------------------- |
| Template  | `[content]_templates.md` | `frontmatter_templates.md` | Copy-paste starting points |
| Reference | `[topic]_reference.md`   | `emoji_reference.md`       | Lookup tables, decisions   |
| Example   | `[topic]_examples.md`    | `optimization_examples.md` | Working code examples      |
| Guide     | `[process]_guide.md`     | `packaging_guide.md`       | Step-by-step how-tos       |

### When to Create Assets
- Templates users apply repeatedly
- Reference data >50 lines
- Multiple examples of same pattern
- Lookup tables or decision matrices
- Template variations for different scenarios

### Keep in SKILL.md When
- Content <30 lines
- Tightly coupled to workflow logic
- Part of core instructions (RULES, WORKFLOW)

### Workflow Details (See YAML)

| Section            | Location in YAML                   |
| ------------------ | ---------------------------------- |
| Asset Types        | `notes.asset_type_selection_guide` |
| Naming Conventions | `workflow.steps[2].naming`         |
| Integration Rules  | `notes.integration_requirements`   |
| Chained Mode       | `notes.chained_execution_mode`     |
| Failure Recovery   | `failure_recovery`                 |
| Completion Report  | `completion_report_template`       |

### Template Reference
- **Template location**: `.opencode/skill/workflows-documentation/assets/opencode/skill_asset_template.md`

---

## 5. 🔍 EXAMPLES

**Example 1: Create template asset**
```
/documentation:create_asset workflows-git template
```
→ Creates `.opencode/skill/workflows-git/assets/[name]_templates.md`

**Example 2: Create lookup asset**
```
/documentation:create_asset workflows-documentation lookup
```
→ Creates `.opencode/skill/workflows-documentation/assets/[name]_reference.md`

**Example 3: Create example asset**
```
/documentation:create_asset my-skill example
```
→ Creates `.opencode/skill/my-skill/assets/[name]_examples.md`

**Example 4: Create guide asset**
```
/documentation:create_asset system-spec-kit guide
```
→ Creates `.opencode/skill/system-spec-kit/assets/[name]_guide.md`

**Example 5: Auto mode (no prompts)**
```
/create:skill_asset workflows-git template :auto
```
→ Creates asset without approval prompts, only stops for errors

**Example 6: Confirm mode (step-by-step approval)**
```
/create:skill_asset workflows-documentation lookup :confirm
```
→ Pauses at each step for user confirmation

---

## 6. 🔗 COMMAND CHAIN

This command is often used after skill creation:

```
[/create:skill] → [/create:skill_reference] → /create:skill_asset
```

**Related commands:**
← `/create:skill [skill-name]` (create the skill first)
← `/create:skill_reference [skill-name] [type]` (add reference docs)

---

## 7. 📌 NEXT STEPS

After asset creation completes, suggest relevant next steps:

| Condition               | Suggested Command                               | Reason                    |
| ----------------------- | ----------------------------------------------- | ------------------------- |
| Skill needs more assets | `/create:skill_asset [skill-name] [type]`       | Add another asset         |
| Skill needs references  | `/create:skill_reference [skill-name] workflow` | Add technical docs        |
| Asset complete          | Verify SKILL.md Navigation Guide updated        | Confirm routing works     |
| Want to save context    | `/memory:save [spec-folder-path]`               | Preserve creation context |

**ALWAYS** end with: "What would you like to do next?"
