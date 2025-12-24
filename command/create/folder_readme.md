---
description: Create an AI-optimized README.md file with proper structure, table of contents, and comprehensive documentation
argument-hint: "<target-path> [--type <project|component|feature|skill>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

## ⚡ GATE 3 STATUS: EXEMPT (Self-Documenting Artifact)

**This command creates documentation files that ARE the documentation artifact.**

| Property | Value |
|----------|-------|
| **Location** | User-specified path (`install_guides/` or target directory) |
| **Reason** | The created file IS the documentation |
| **Spec Folder** | Not required - the guide/README serves as its own spec |

---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** This workflow requires 1-2 user interactions.

---

## 🔒 PHASE 1: INPUT VALIDATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS is empty, undefined, or whitespace-only:
│   │
│   ├─ ASK user:
│   │   ┌────────────────────────────────────────────────────────────┐
│   │   │ "Where should the README be created, and what type?"       │
│   │   │                                                            │
│   │   │ A) Project README                                          │
│   │   │    Main project documentation at root level                │
│   │   │                                                            │
│   │   │ B) Component README                                        │
│   │   │    Documentation for a module/package/skill                │
│   │   │                                                            │
│   │   │ C) Feature README                                          │
│   │   │    Documentation for a specific feature/system             │
│   │   │                                                            │
│   │   │ D) Skill README                                            │
│   │   │    Documentation for an OpenCode skill                     │
│   │   └────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Based on choice, ask for target path
│   ├─ Store as: target_path, readme_type
│   └─ SET STATUS: ✅ PASSED
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Parse first argument as: target_path
    ├─ Parse --type flag if present (default: project)
    │
    ├─ VALIDATE readme_type:
    │   ├─ Must be one of: project, component, feature, skill
    │   │
    │   ├─ IF invalid or missing:
    │   │   └─ Set default: readme_type = "project"
    │   │
    │   └─ Store as: readme_type
    │
    └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer README location from context
⛔ NEVER overwrite existing README without confirmation
```

**Phase 1 Output:** `target_path = ________________` | `readme_type = ________________`

---

## 🔒 PHASE 2: TARGET VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. Check if target path exists:
   $ ls -la [target_path] 2>/dev/null

2. Check for existing README:
   $ ls -la [target_path]/README.md 2>/dev/null

3. Process result:
   ├─ IF target path does not exist:
   │   ├─ ASK user:
   │   │   ┌────────────────────────────────────────────────────────────┐
   │   │   │ "Path '[target_path]' does not exist."                     │
   │   │   │                                                            │
   │   │   │ A) Create directory and proceed                            │
   │   │   │ B) Choose different path                                   │
   │   │   │ C) Cancel                                                  │
   │   │   └────────────────────────────────────────────────────────────┘
   │   └─ Process based on choice
   │
   ├─ IF README.md already exists:
   │   ├─ ASK user:
   │   │   ┌────────────────────────────────────────────────────────────┐
   │   │   │ "README.md already exists at [path]."                      │
   │   │   │                                                            │
   │   │   │ A) Overwrite existing file                                 │
   │   │   │ B) Create backup and overwrite                             │
   │   │   │ C) Merge/update existing content                           │
   │   │   │ D) Cancel                                                  │
   │   │   └────────────────────────────────────────────────────────────┘
   │   └─ Process based on choice
   │
   └─ IF path exists and no README:
       └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT proceed without confirmed target
```

**Phase 2 Output:** `path_verified = [yes/no]` | `existing_readme = [yes/no]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                  | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                           |
| ---------------------- | --------------- | ----------- | -------------------------------------- |
| PHASE 1: INPUT         | ✅ PASSED       | ______      | target_path: ______ / type: __________ |
| PHASE 2: TARGET        | ✅ PASSED       | ______      | path_verified: ______ / existing: ____ |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED?
│   ├─ YES → Proceed to "# README Creation Workflow" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Started reading the workflow section before all phases passed
- Proceeded without explicit target path (Phase 1)
- Overwrote existing README without confirmation (Phase 2)

**Workflow Violations (Steps 1-5):**
- Skipped content discovery and jumped to generation
- Generated README without identifying key features first
- Did not validate structure before claiming complete

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly
5. RESUME only after all phases pass
```

---

# 📊 WORKFLOW EXECUTION (5 STEPS) - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→5). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## WORKFLOW TRACKING

| STEP | NAME           | STATUS | REQUIRED OUTPUT          | VERIFICATION                    |
| ---- | -------------- | ------ | ------------------------ | ------------------------------- |
| 1    | Analysis       | ☐      | README type, path        | Type and location confirmed     |
| 2    | Discovery      | ☐      | Features, structure      | Project info gathered           |
| 3    | Structure      | ☐      | Section structure        | Template selected               |
| 4    | Generation     | ☐      | README.md                | Complete README written         |
| 5    | Validation     | ☐      | Validated README         | Structure verified              |

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

# README Creation Workflow

Create a comprehensive README.md following the documentation patterns from SpecKit, Memory System, and Code Environment READMEs. Uses numbered sections with emojis, table of contents, tables for data, and proper progressive disclosure.

---

```yaml
role: Expert README Creator using workflows-documentation skill
purpose: Create comprehensive README files with proper structure and AI-optimization
action: Generate scannable, well-organized README with table of contents

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
```

---

## 1. 🎯 PURPOSE

Create a comprehensive README.md following the documentation patterns from SpecKit, Memory System, and Code Environment READMEs. The README will use numbered sections with emojis, table of contents, tables for data, and proper progressive disclosure.

---

## 2. 📋 CONTRACT

**Inputs:** `$ARGUMENTS` — Target path with optional --type flag (project|component|feature|skill)
**Outputs:** README.md file at target path + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📝 INSTRUCTIONS

### Step 3.1: Verify All Phases Passed

Confirm you have these values from the phases:
- `target_path` from PHASE 1
- `readme_type` from PHASE 1 (project|component|feature|skill)
- `path_verified` from PHASE 2
- `existing_readme` handling from PHASE 2

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 3.2: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_folder_readme.yaml
```

The YAML file contains:
- Detailed step-by-step activities
- README type configurations and sections
- Template structures for each type
- AI optimization principles
- Checkpoint prompts and options
- Error recovery procedures
- Validation requirements
- Completion report template

Execute all 5 steps in sequence following the workflow definition.

---

## 4. 📚 REFERENCE (See YAML for Details)

| Section              | Location in YAML                    |
| -------------------- | ----------------------------------- |
| README Types         | `notes.readme_type_selection`       |
| Key Patterns         | `notes.key_patterns`                |
| Section Templates    | `templates.[type]`                  |
| Failure Recovery     | `failure_recovery`                  |
| Completion Report    | `completion_report_template`        |

**Reference READMEs:**
- `.opencode/skill/system-spec-kit/README.md` (SpecKit pattern)
- `.opencode/skill/system-memory/README.md` (Skill pattern)

---

## 5. 💡 EXAMPLES

**Example 1: Project README**
```
/documentation:create_readme ./ --type project
```
→ Creates comprehensive project README at root

**Example 2: Skill README**
```
/documentation:create_readme .opencode/skill/my-skill --type skill
```
→ Creates skill documentation with triggers, commands, MCP tools

**Example 3: Component README**
```
/documentation:create_readme ./src/auth --type component
```
→ Creates component README with API, usage, integration
