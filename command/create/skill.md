---
description: Create a complete OpenCode skill with 9-step workflow including resource planning - supports interactive execution
argument-hint: "skill-name [--path output-dir]"
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, Task, TodoWrite]
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** This workflow requires 1-2 user interactions.

---

## 🔒 PHASE 1: INPUT COLLECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS is empty, undefined, or whitespace-only:
│   │
│   ├─ ASK user:
│   │   ┌────────────────────────────────────────────────────────────┐
│   │   │ "What skill would you like to create?"                     │
│   │   │                                                            │
│   │   │ Please provide a hyphen-case skill name                    │
│   │   │ (e.g., pdf-editor, data-transformer, api-client)           │
│   │   └────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store response as: skill_name
│   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Extract skill name (first argument)
    ├─ Extract --path flag if present (optional)
    ├─ VALIDATE skill name format:
│   ├─ Must be hyphen-case (lowercase, hyphens, digits only)
│   ├─ Must match folder name exactly
│   ├─ No uppercase, underscores, or special characters
    │   │
    │   ├─ IF invalid format:
    │   │   ├─ SHOW: "Invalid skill name format. Expected: hyphen-case-name"
    │   │   ├─ ASK for corrected name
    │   │   └─ WAIT for response
    │   │
    │   └─ IF valid:
    │       └─ Store as: skill_name
    │
    ├─ Store output path as: skill_path (default: .opencode/skill/)
    └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer skill names from context, screenshots, or conversation history
⛔ NEVER proceed without explicit skill name from user
```

**Phase 1 Output:** `skill_name = ________________` | `skill_path = ________________`

---

## 🔒 PHASE 2: SPEC FOLDER SELECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

2. ASK user with these EXACT options:
   ┌────────────────────────────────────────────────────────────┐
   │ "Where should this skill creation be documented?"          │
   │                                                            │
   │ A) Use existing spec folder: [suggest if related found]    │
   │ B) Create new spec folder (auto-numbered)                  │
   │ C) Update related spec: [if partial match found]           │
   │ D) Skip documentation                                      │
   └────────────────────────────────────────────────────────────┘

3. WAIT for explicit user choice (A, B, C, or D)

4. Process choice:
   ├─ IF A (Use existing):
   │   ├─ Confirm which folder
   │   └─ Store as: spec_path
   │
   ├─ IF B (Create new):
   │   ├─ Find next number: ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
   │   ├─ Create: specs/[NNN]-[skill-name]/
   │   └─ Store as: spec_path
   │
   ├─ IF C (Update related):
   │   ├─ Confirm which folder
   │   └─ Store as: spec_path
   │
   └─ IF D (Skip):
       └─ spec_path = null

5. SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT proceed until user explicitly selects A, B, C, or D
⛔ NEVER auto-create spec folders without user confirmation
```

**Phase 2 Output:** `spec_choice = ___` | `spec_path = ________________`

---

## 🔒 PHASE 3: MEMORY CONTEXT LOADING (Conditional)

**STATUS: ☐ BLOCKED / ☐ N/A**

```
EXECUTE AFTER PHASE 2 PASSES:

CHECK spec_choice value from Phase 2:

├─ IF spec_choice == D (Skip):
│   └─ SET STATUS: ⏭️ N/A (no spec folder, no memory)
│
├─ IF spec_choice == B (Create new):
│   └─ SET STATUS: ⏭️ N/A (new folder has no memory)
│
└─ IF spec_choice == A or C (Use existing):
    │
    ├─ Check: Does spec_path/memory/ exist AND contain files?
    │
    ├─ IF memory/ is empty or missing:
    │   └─ SET STATUS: ⏭️ N/A (no memory to load)
    │
    └─ IF memory/ has files:
        │
        ├─ ASK user:
        │   ┌────────────────────────────────────────────────────┐
        │   │ "Load previous context from this spec folder?"     │
        │   │                                                    │
        │   │ A) Load most recent memory file (quick refresh)     │
        │   │ B) Load all recent files, up to 3 (comprehensive)   │
        │   │ C) List all files and select specific                │
        │   │ D) Skip (start fresh, no context)                  │
        │   └────────────────────────────────────────────────────┘
        │
        ├─ WAIT for user response
        ├─ Execute loading based on choice (use Read tool)
        ├─ Acknowledge loaded context briefly
        └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED or ⏭️ N/A
```

**Phase 3 Output:** `memory_loaded = [yes/no]` | `context_summary = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE                           |
| -------------------- | ----------------- | ----------- | -------------------------------------- |
| PHASE 1: INPUT       | ✅ PASSED          | ______      | skill_name: ______ / skill_path: _____ |
| PHASE 2: SPEC FOLDER | ✅ PASSED          | ______      | spec_choice: ___ / spec_path: ______   |
| PHASE 3: MEMORY      | ✅ PASSED or ⏭️ N/A | ______      | memory_loaded: ______                  |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# Skill Creation Workflow" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Started reading the workflow section before all phases passed
- Proceeded without asking user for skill name (Phase 1)
- Auto-created spec folder without A/B/C/D choice (Phase 2)
- Skipped memory prompt when using existing folder with memory files (Phase 3)
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
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification

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

# 📊 WORKFLOW EXECUTION (9 STEPS) - MANDATORY TRACKING

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

## 2. 📋 CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name in hyphen-case with optional output path
**Outputs:** Complete skill folder with SKILL.md + resources + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📝 INSTRUCTIONS

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

## 4. 📚 REFERENCE (See YAML for Details)

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

**Validation** (run after creation):
```bash
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/pdf-editor --check
```
