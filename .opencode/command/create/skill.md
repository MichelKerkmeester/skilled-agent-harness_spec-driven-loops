---
description: Create a complete OpenCode skill with 9-step workflow including resource planning - supports :auto and :confirm modes
argument-hint: "<skill-name> [--path output-dir] [:auto|:confirm]"
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, TodoWrite]
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> **YOU are the executor.** Run this workflow directly — do NOT delegate to other agents.
> Do NOT use the Task tool to dispatch sub-agents.
>
> **WORKFLOW SEQUENCE:**
> 1. Run Phase 0: Verify you are the @write agent (self-check, not a dispatch)
> 2. Run the Unified Setup Phase: gather user inputs in one consolidated prompt
> 3. Load the YAML workflow: `assets/create_skill.yaml`
> 4. Execute the YAML steps sequentially
>
> The @write references below are self-verification checks — not dispatch instructions.
> Content after the setup phases is reference context for the YAML workflow.

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** This workflow requires only 1 user interaction.

---

## 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK Phase 0: @write agent verification (AUTOMATIC - not a question):
   │
   ├─ SELF-CHECK: Are you operating as the @write agent?
   │   │
   │   ├─ INDICATORS that you ARE @write agent:
   │   │   ├─ You were invoked with "@write" prefix
   │   │   ├─ You have template-first workflow capabilities
   │   │   ├─ You load templates BEFORE creating content
   │   │   ├─ You validate template alignment AFTER creating
   │   │
   │   ├─ IF YES (all indicators present):
   │   │   └─ write_agent_verified = TRUE → Continue to step 2
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
   │       │   │   • Template-first workflow (loads before creating)          │
   │       │   │   • DQI scoring (target: 90+ Excellent)                    │
   │       │   │   • workflows-documentation skill integration               │
   │       │   │                                                            │
   │       │   │ To proceed, restart with:                                  │
   │       │   │   @write /create:skill [skill-name]                        │
   │       │   │                                                            │
   │       │   │ Reference: .opencode/agent/write.md                        │
   │       │   └────────────────────────────────────────────────────────────┘
   │       │
   │       └─ RETURN: STATUS=FAIL ERROR="Write agent required"

2. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

3. CHECK if $ARGUMENTS contains a skill name (ignoring flags):
   ├─ IF $ARGUMENTS has content → skill_name = extracted value, omit Q0
   │   ├─ Extract --path flag if present (optional)
   │   ├─ VALIDATE skill name format:
   │   │   ├─ Must be hyphen-case (lowercase, hyphens, digits only)
   │   │   ├─ Must match folder name exactly
   │   │   ├─ No uppercase, underscores, or special characters
   │   │   └─ IF invalid: include Q0 in prompt with format guidance
   │   └─ Store output path as: skill_path (default: .opencode/skill/)
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

4. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

5. Determine if memory loading question is needed:
   - Will be asked ONLY if user selects A or C for spec folder AND memory/ has files
   - Include Q3 placeholder with note "(if using existing spec with memory files)"

6. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Skill Name** (if not provided in command):               │
   │    What skill would you like to create?                        │
   │    Format: hyphen-case (e.g., pdf-editor, api-client)          │
   │                                                                │
   │ **Q1. Spec Folder** (required):                                │
   │    A) Use existing: [suggest if related found]                 │
   │    B) Create new spec folder (Recommended)                     │
   │    C) Update related spec: [if partial match found]            │
   │    D) Skip documentation                                       │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ **Q3. Memory Context** (if using existing spec with memory/):  │
   │    A) Load most recent memory file                              │
   │    B) Load all recent files, up to 3                            │
   │    C) Skip (start fresh)                                       │
   │                                                                │
   │ Reply with answers, e.g.: "B, A, C" or "pdf-editor, B, A, C"   │
   └────────────────────────────────────────────────────────────────┘

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - skill_name = [from Q0 or $ARGUMENTS]
   - skill_path = [from --path flag or default: .opencode/skill/]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - memory_choice = [A/B/C from Q3, or N/A if not applicable]

9. Execute background operations based on choices:
   - IF spec_choice == B: Find next number and create: specs/[NNN]-[skill-name]/
   - IF memory_choice == A: Load most recent memory file
   - IF memory_choice == B: Load up to 3 recent memory files

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer skill names from context, screenshots, or conversation history
```

**Phase Output:**
- `write_agent_verified = ________________`
- `skill_name = ________________`
- `skill_path = ________________`
- `spec_choice = ___` | `spec_path = ________________`
- `execution_mode = ________________`
- `memory_loaded = ________________`

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

| FIELD                | REQUIRED      | YOUR VALUE | SOURCE                 |
| -------------------- | ------------- | ---------- | ---------------------- |
| write_agent_verified | ✅ Yes         | ______     | Automatic check        |
| skill_name           | ✅ Yes         | ______     | Q0 or $ARGUMENTS       |
| skill_path           | ✅ Yes         | ______     | --path flag or default |
| spec_choice          | ✅ Yes         | ______     | Q1                     |
| spec_path            | ○ Conditional | ______     | Derived from Q1        |
| execution_mode       | ✅ Yes         | ______     | Suffix or Q2           |
| memory_loaded        | ○ Conditional | ______     | Q3 (if existing spec)  |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "# Skill Creation Workflow" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without asking user for skill name when not in $ARGUMENTS
- Auto-created or assumed a spec folder without user confirmation
- Auto-selected execution mode without suffix or explicit user choice
- Inferred skill name from context instead of explicit user input

**Workflow Violations (Steps 1-9):**
- Skipped understanding phase and jumped to initialization
- Created SKILL.md without gathering examples first
- Did not run validation scripts before claiming complete
- Claimed "complete" without DQI score verification
- Skipped resource recommendation (Step 8) and went straight to save context

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

---

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→9). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## WORKFLOW TRACKING

| STEP | NAME             | STATUS | REQUIRED OUTPUT             | VERIFICATION                   |
| ---- | ---------------- | ------ | --------------------------- | ------------------------------ |
| 1    | Analysis         | ☐      | skill_name, skill_path      | Name validated, path confirmed |
| 2    | Spec Setup       | ☐      | specs/###-skill-name/       | Folder created                 |
| 3    | Understanding    | ☐      | Use cases, triggers         | Examples gathered              |
| 4    | Planning         | ☐      | Scripts, references, assets | Resources identified           |
| 5    | Initialization   | ☐      | SKILL.md template, dirs     | Structure scaffolded           |
| 6    | Content          | ☐      | SKILL.md, resources         | Files populated                |
| 7    | Validation       | ☐      | package_skill.py results    | All checks pass                |
| 8    | Resource Routing | ☐      | references/, assets/ files  | User chose, resources created  |
| 9    | Save Context     | ☐      | memory/*.md                 | Context preserved              |

---

## 📊 WORKFLOW DIAGRAM

```mermaid
flowchart TD
    subgraph phase0["Phase 0: @write Agent Verification"]
        P0{{"@write Agent?"}}
    end

    subgraph steps["9-Step Skill Creation Workflow"]
        S1["Step 1: Analysis<br/>Validate name & path"]
        S2["Step 2: Spec Setup<br/>Create spec folder"]
        S3["Step 3: Understanding<br/>Gather use cases & triggers"]
        S4["Step 4: Planning<br/>Identify resources needed"]
        S5["Step 5: Initialization<br/>Scaffold SKILL.md & dirs"]
        S6["Step 6: Content<br/>Populate all sections"]
        S7["Step 7: Validation<br/>Run package_skill.py"]
        S8["Step 8: Resource Routing<br/>Create references/assets"]
        S9["Step 9: Save Context<br/>Preserve to memory/"]
    end

    subgraph gates["Decision Gates"]
        G1{{"Name Valid?"}}
        G2{{"Examples Gathered?"}}
        G3{{"Validation Pass?"}}
        G4{{"Resources Needed?"}}
    end

    P0 -->|Yes| S1
    P0 -->|No| BLOCK["⛔ HARD BLOCK<br/>Restart with @write"]

    S1 --> G1
    G1 -->|Yes| S2
    G1 -->|No| S1

    S2 --> S3
    S3 --> G2
    G2 -->|Yes| S4
    G2 -->|No| S3

    S4 --> S5
    S5 --> S6
    S6 --> S7

    S7 --> G3
    G3 -->|Pass| S8
    G3 -->|Fail| S6

    S8 --> G4
    G4 -->|Yes| CREATE["Create Resources"]
    G4 -->|Skip| S9
    CREATE --> S9

    S9 --> DONE["✅ Skill Complete"]

    classDef phase fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef gate fill:#7c2d12,stroke:#ea580c,color:#fff
    classDef verify fill:#065f46,stroke:#10b981,color:#fff
    classDef block fill:#7f1d1d,stroke:#ef4444,color:#fff
    classDef step fill:#1e293b,stroke:#64748b,color:#fff

    class P0 phase
    class G1,G2,G3,G4 gate
    class DONE,CREATE verify
    class BLOCK block
    class S1,S2,S3,S4,S5,S6,S7,S8,S9 step
```

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 3 (Understanding) REQUIREMENTS:
├─ MUST gather 3-5 concrete usage examples from user
├─ MUST identify trigger patterns (what users say)
├─ MUST define success criteria
└─ MUST NOT proceed without examples (blocks Step 4+)

STEP 6 (Content) REQUIREMENTS:
├─ MUST populate all SKILL.md sections
├─ MUST create bundled resources identified in Step 4
├─ MUST follow template structure from assets/
├─ MUST NOT leave placeholder text
├─ MUST include required sections: WHEN TO USE, HOW IT WORKS, RULES
├─ RULES section MUST have subsections: ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF
├─ SECTION BOUNDARIES (CRITICAL):
│   ├─ "WHEN TO USE" = ONLY activation triggers, use cases, exclusions
│   │   └─ NO file references, NO navigation guides
│   └─ "SMART ROUTING" = Navigation Guide + Phase Detection + Resource Router
│       └─ ALL file/resource references go here
├─ SIZE CONSTRAINTS:
│   ├─ Max 5000 words (3000 recommended)
│   └─ Max 3000 lines

STEP 7 (Validation) REQUIREMENTS:
├─ MUST run package_skill.py --check before claiming complete
│   └─ Command: python .opencode/skill/workflows-documentation/scripts/package_skill.py <skill-path> --check
├─ MUST pass all validation checks (frontmatter, sections, size)
├─ MUST NOT claim "complete" without validation pass
└─ MUST fix issues if validation fails

STEP 8 (Resource Routing) REQUIREMENTS:
├─ MUST analyze Step 3/4 outputs for resource recommendations
├─ MUST present recommendations with clear rationale
├─ MUST wait for explicit user choice (A/B/C/D)
├─ MUST execute selected resource creation via chained commands
├─ MUST NOT auto-create resources without user approval
└─ MUST NOT skip this step (user can choose "Skip" option)
```

---

# Skill Creation Workflow

Create a complete, production-ready OpenCode skill following the 9-step workflow from understanding through validation and resource creation.

---

```yaml
role: Expert Skill Creator using workflows-documentation skill
purpose: Create production-ready OpenCode skills with proper structure and validation
action: Guide skill creation from understanding through packaging with DQI verification and resource routing

operating_mode:
  workflow: sequential_9_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  tracking: progressive_task_checklists
  validation: checkpoint_based_with_dqi
  resource_routing: chained_command_execution
```

---

## 1. 🎯 PURPOSE

Create a complete, production-ready OpenCode skill following the 9-step skill creation process from the `workflows-documentation` skill. The workflow ensures understanding before implementation, validates quality through DQI scoring, and offers intelligent resource recommendations with dynamic routing.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name in hyphen-case with optional output path
**Outputs:** Complete skill folder with SKILL.md + resources + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. ⚡ INSTRUCTIONS

### Step 4: Verify All Phases Passed

Confirm you have these values from the phases:
- `skill_name` from PHASE 1
- `skill_path` from PHASE 1 (default: .opencode/skill/)
- `spec_choice` and `spec_path` from PHASE 2
- `memory_loaded` status from PHASE 3

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 5: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_skill.yaml
```

The YAML file contains:
- Detailed step-by-step activities
- Checkpoint prompts and options
- Error recovery procedures
- Validation requirements
- Resource recommendation engine
- Chained command routing
- Completion report template

Execute all 9 steps in sequence following the workflow definition.

---

## 4. 📌 REFERENCE (See YAML for Details)

| Section             | Location in YAML                     |
| ------------------- | ------------------------------------ |
| Step Activities     | `workflow.steps[1-9].activities`     |
| Failure Recovery    | `failure_recovery`                   |
| Error Handling      | `error_handling`                     |
| Templates Used      | `templates_used`                     |
| Completion Report   | `completion_report_template`         |
| DQI Quality Bands   | `notes.dqi_quality_bands`            |
| Resource Categories | `notes.resource_categories`          |
| Resource Routing    | `workflow.steps[8]` (Step 8 details) |

---

## 5. 🔍 EXAMPLES

**Example 1: Basic skill creation**
```
/documentation:create_skill pdf-editor
```
→ Creates skill at `.opencode/skill/pdf-editor/`
→ Skills auto-discovered from SKILL.md frontmatter
→ Appears as `skills_pdf_editor` function in OpenCode

**Example 2: Custom path**
```
/documentation:create_skill data-transformer --path ./my-skills
```
→ Creates skill at `./my-skills/data-transformer/`

**Example 3: Prompted creation**
```
/documentation:create_skill
```
→ Prompts: "What skill would you like to create?"

**Example 4: Auto mode (no prompts)**
```
/create:skill pdf-editor :auto
```
→ Creates skill without approval prompts, only stops for errors

**Example 5: Confirm mode (step-by-step approval)**
```
/create:skill pdf-editor :confirm
```
→ Pauses at each step for user confirmation

**Validation** (run after creation):
```bash
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/pdf-editor --check
```

---

## 6. 🔗 COMMAND CHAIN

This command creates skills that may need additional resources:

```
/create:skill → [/create:skill_reference] and/or [/create:skill_asset]
```

**Explicit next steps:**
→ `/create:skill_reference [skill-name] [type]` (add technical reference docs)
→ `/create:skill_asset [skill-name] [type]` (add templates, lookups, examples)

---

## 7. 📌 NEXT STEPS

After skill creation completes, suggest relevant next steps:

| Condition                  | Suggested Command                               | Reason                          |
| -------------------------- | ----------------------------------------------- | ------------------------------- |
| Skill needs reference docs | `/create:skill_reference [skill-name] workflow` | Add technical workflows         |
| Skill needs templates      | `/create:skill_asset [skill-name] template`     | Add copy-paste templates        |
| Skill needs examples       | `/create:skill_asset [skill-name] example`      | Add working code examples       |
| Skill is complete          | Test with `/skill:[skill-name]`                 | Verify skill works              |
| Want to save context       | `/memory:save [spec-folder-path]`               | Preserve skill creation context |

**ALWAYS** end with: "What would you like to do next?"
