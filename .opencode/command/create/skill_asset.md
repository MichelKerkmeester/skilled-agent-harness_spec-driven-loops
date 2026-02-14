---
description: "Create an asset file for an existing skill - templates, lookups, examples, or guides - supports :auto and :confirm modes"
argument-hint: "<skill-name> <asset-type> [--chained] [:auto|:confirm]"
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
>    - Auto mode → `create_skill_asset_auto.yaml`
>    - Confirm mode → `create_skill_asset_confirm.yaml`
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
    │   │   @write /create:skill_asset [skill-name] [type]           │
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

**Round-trip optimization:** This workflow requires only 1 user interaction (0 if --chained).

**⚡ CHAINED EXECUTION MODE:** If invoked with `--chained` flag, skip to workflow with provided parameters.

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
   │   │   └─ SKIP directly to "⚡ INSTRUCTIONS" section
   │   │
   │   └─ IF parameters missing:
   │       └─ FALL THROUGH to step 2 (normal execution)
   │
   └─ IF NOT chained:
       └─ PROCEED to step 2

2. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

3. CHECK if $ARGUMENTS contains skill name and asset type:
   ├─ IF $ARGUMENTS has skill_name → omit Q0
   ├─ IF $ARGUMENTS has valid asset_type (template/lookup/example/guide) → omit Q1
   └─ IF $ARGUMENTS is empty or incomplete → include applicable questions

4. List available skills:
   $ ls .opencode/skill/*/SKILL.md 2>/dev/null | sed 's|.*/skill/||;s|/SKILL.md||'

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Skill Name** (if not provided in command):               │
   │    Which existing skill needs an asset?                        │
   │    Available: [list from step 4]                               │
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

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - skill_name = [from Q0 or $ARGUMENTS]
   - asset_type = [A=template, B=lookup, C=example, D=guide from Q1 or $ARGUMENTS]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]

8. Verify skill exists (inline check, not separate phase):
   ├─ Run: ls -d .opencode/skill/[skill_name] 2>/dev/null
   │
   ├─ IF skill found:
   │   ├─ Store path as: skill_path
   │   ├─ Verify SKILL.md exists
   │   └─ CONTINUE to step 9
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
       └─ Process based on choice, then retry step 8

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer skill names from context, screenshots, or conversation history
⛔ NEVER assume asset type without explicit input
⛔ NEVER create assets for non-existent skills
```

**Phase Output:**
- `write_agent_verified = ________________`
- `skill_name = ________________`
- `asset_type = ________________`
- `skill_path = ________________`
- `execution_mode = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD          | REQUIRED | YOUR VALUE | SOURCE                  |
| -------------- | -------- | ---------- | ----------------------- |
| write_agent_verified | ✅ Yes         | ______     | Automatic check        |
| skill_name     | ✅ Yes    | ______     | Q0 or $ARGUMENTS        |
| asset_type     | ✅ Yes    | ______     | Q1 or $ARGUMENTS        |
| skill_path     | ✅ Yes    | ______     | Derived from skill_name |
| execution_mode | ✅ Yes    | ______     | Suffix or Q2            |

```
VERIFICATION CHECK:
├─ IF chained mode (--chained flag):
│   └─ All values from parent? → Proceed to "⚡ INSTRUCTIONS"
│
├─ IF normal mode:
│   └─ ALL required fields have values? → Proceed to "⚡ INSTRUCTIONS"
│
└─ OTHERWISE → Re-prompt for missing values only
```

---

## ⚡ INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_skill_asset_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_skill_asset_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, resource routing, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## Agent Routing

This command dispatches a specialized agent at a specific workflow step (see YAML for details):

| Step | Agent | Rule | Purpose |
|------|-------|------|---------|
| 5b: Quality Review | @review | §3 — @review for quality scoring | 100-point rubric scoring of created asset |

**Agent file**: `.opencode/agent/review.md`

---

## ⛔ GATE 3 STATUS: EXEMPT (Predefined Location)

**This command creates files at a predefined location and is EXEMPT from the spec folder question.**

| Property        | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| **Location**    | `.opencode/skill/[skill-name]/references/` or `.opencode/skill/[skill-name]/assets/` |
| **Reason**      | Skill-internal files, not project documentation                                      |
| **Alternative** | Use `/create:skill` for full skill creation with spec folder                         |

---

<!-- REFERENCE ONLY -->

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

<!-- END REFERENCE -->

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

## 3. 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→6). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## WORKFLOW TRACKING

| STEP | NAME          | STATUS | REQUIRED OUTPUT        | VERIFICATION               |
| ---- | ------------- | ------ | ---------------------- | -------------------------- |
| 1    | Analysis      | ☐      | Skill path, asset type | Skill verified, type valid |
| 2    | Planning      | ☐      | Filename, sections     | File spec determined       |
| 3    | Template Load | ☐      | Structure patterns     | Template loaded            |
| 4    | Content       | ☐      | [asset_name].md        | Asset file created         |
| 5    | Validation    | ☐      | Updated SKILL.md       | Integration complete       |
| 6    | Save Context  | ☐      | Memory file            | Context preserved          |

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
