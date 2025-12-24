---
description: Create a reference file for an existing skill - deep-dive technical documentation with workflows, patterns, or debugging guides
argument-hint: "<skill-name> <reference-type> [--chained]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

## ⚡ GATE 3 STATUS: EXEMPT (Predefined Location)

**This command creates files at a predefined location and is EXEMPT from the spec folder question.**

| Property | Value |
|----------|-------|
| **Location** | `.opencode/skill/[skill-name]/references/` or `.opencode/skill/[skill-name]/assets/` |
| **Reason** | Skill-internal files, not project documentation |
| **Alternative** | Use `/create:skill` for full skill creation with spec folder |

---

<!-- 
REFERENCE FILE REQUIREMENTS:
- Location: .opencode/skill/[skill-name]/references/
- Naming: snake_case only (e.g., implementation_workflows.md, tool_catalog.md)
- Extension: .md only
- Purpose: Deep-dive documentation loaded as needed (Level 3 progressive disclosure)

WHEN TO CREATE:
- Multi-phase workflows with validation checkpoints
- Decision trees with multiple branches  
- Pattern libraries with 5+ variations
- Systematic debugging procedures
- Tool integration details
- Content exceeds 200 lines
-->

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**⚡ CHAINED EXECUTION MODE:** If invoked with `--chained` flag from a parent workflow, Phases 1-2 are PRE-VERIFIED. Skip directly to the workflow section with provided parameters.

---

## 🔒 PHASE C: CHAINED EXECUTION CHECK (PRIORITY)

**STATUS: ☐ CHECK FIRST**

```
EXECUTE THIS CHECK BEFORE PHASE 1:

├─ IF invoked with --chained flag OR called from skill.md Step 8:
│   │
│   ├─ VERIFY parent workflow provided:
│   │   ├─ skill_name (from parent)
│   │   ├─ skill_path (from parent - already verified)
│   │   ├─ reference_type (from parent selection)
│   │
│   ├─ IF all parameters present:
│   │   ├─ SET PHASE 1: ⏭️ SKIPPED (parent verified)
│   │   ├─ SET PHASE 2: ⏭️ SKIPPED (parent verified)
│   │   └─ PROCEED directly to "# Reference Creation" workflow
│   │
│   └─ IF parameters missing:
│       └─ FALL THROUGH to Phase 1 (normal execution)
│
└─ IF NOT chained:
    └─ PROCEED to Phase 1 (normal execution)

⚡ CHAINED MODE: Enables efficient resource creation from parent workflows
⚡ Parent workflow has already verified skill exists and is valid
```

---

## 🔒 PHASE 1: INPUT VALIDATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS is empty, undefined, or whitespace-only:
│   │
│   ├─ ASK user:
│   │   ┌────────────────────────────────────────────────────────────┐
│   │   │ "Which skill needs a reference file, and what type?"       │
│   │   │                                                            │
│   │   │ Format: <skill-name> <reference-type>                      │
│   │   │                                                            │
│   │   │ Reference types:                                           │
│   │   │   - workflow    (multi-phase processes)                    │
│   │   │   - patterns    (code patterns library)                    │
│   │   │   - debugging   (troubleshooting guide)                    │
│   │   │   - tools       (external tool integration)                │
│   │   │   - quick_ref   (commands/shortcuts)                       │
│   │   └────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Parse response for skill_name and reference_type
│   └─ SET STATUS: ✅ PASSED
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Parse first argument as: skill_name
    ├─ Parse second argument as: reference_type
    │
    ├─ VALIDATE reference_type:
    │   ├─ Must be one of: workflow, patterns, debugging, tools, quick_ref
    │   │
    │   ├─ IF invalid:
    │   │   ├─ SHOW: "Invalid reference type."
    │   │   ├─ SHOW: "Valid: workflow, patterns, debugging, tools, quick_ref"
    │   │   ├─ ASK for correct type
    │   │   └─ WAIT for response
    │   │
    │   └─ IF valid:
    │       └─ Store as: reference_type
    │
    └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer skill name from context or conversation history
⛔ NEVER assume reference type without explicit input
```

**Phase 1 Output:** `skill_name = ________________` | `reference_type = ________________`

---

## 🔒 PHASE 2: SKILL VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. Check if skill exists at expected path:
   └─ .opencode/skill/[skill-name]/

2. Run verification:
   $ ls -d .opencode/skill/[skill-name] 2>/dev/null

3. Process result:
   ├─ IF skill found:
   │   ├─ Store path as: skill_path
   │   ├─ Verify SKILL.md exists
   │   ├─ Check for existing references/ directory
   │   └─ SET STATUS: ✅ PASSED
   │
   └─ IF skill NOT found:
       │
       ├─ ASK user:
       │   ┌────────────────────────────────────────────────────────────┐
       │   │ "Skill '[skill-name]' not found at expected locations."    │
       │   │                                                            │
       │   │ A) Provide correct skill name                              │
       │   │ B) Provide full path to skill                              │
       │   │ C) Create new skill first                                  │
       │   └────────────────────────────────────────────────────────────┘
       │
       ├─ WAIT for response
       └─ Process based on choice

⛔ HARD STOP: DO NOT proceed without verified skill path
⛔ NEVER create references for non-existent skills
```

**Phase 2 Output:** `skill_path = ________________` | `skill_verified = [yes/no]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                   | REQUIRED STATUS         | YOUR STATUS | OUTPUT VALUE                              |
| ----------------------- | ----------------------- | ----------- | ----------------------------------------- |
| PHASE C: CHAINED        | ⏭️ SKIPPED or N/A       | ______      | chained_mode: [yes/no]                    |
| PHASE 1: INPUT          | ✅ PASSED or ⏭️ SKIPPED | ______      | skill_name: ______ / reference_type: ____ |
| PHASE 2: SKILL VERIFY   | ✅ PASSED or ⏭️ SKIPPED | ______      | skill_path: ______                        |

```
VERIFICATION CHECK:
├─ IF chained_mode == yes:
│   └─ Phases 1-2 show ⏭️ SKIPPED? → Proceed to workflow
│
├─ IF chained_mode == no:
│   └─ ALL phases show ✅ PASSED? → Proceed to workflow
│
└─ OTHERWISE → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Started reading the workflow section before all phases passed (unless chained)
- Proceeded without both skill name AND reference type (Phase 1) when not chained
- Attempted to create reference for non-existent skill (Phase 2) when not chained
- Inferred inputs from context instead of explicit user input (when not chained)
- Claimed chained mode without valid parent workflow parameters

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
| 1    | Analysis       | ☐      | Skill path, ref type     | Skill verified, type valid      |
| 2    | Planning       | ☐      | Sections, checkpoints    | Content structure defined       |
| 3    | Template Load  | ☐      | Structure patterns       | Template loaded                 |
| 4    | Content        | ☐      | [reference_name].md      | Reference file created          |
| 5    | Validation     | ☐      | Updated SKILL.md         | Integration complete            |

---

## ⛔ CRITICAL ENFORCEMENT RULES

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
├─ MUST update SKILL.md Navigation Guide
├─ MUST add routing rules to SMART ROUTING section
├─ MUST verify all sections are complete
└─ MUST NOT claim "complete" without SKILL.md update
```

---

# Reference Creation

Create a technical reference file for an existing skill following the `skill_reference_template.md` structure. Reference files provide Level 3 progressive disclosure - deep technical guidance loaded when needed.

**Reference File Location:** `.opencode/skill/[skill-name]/references/`

**Naming Convention:** snake_case with `.md` extension
- ✅ `implementation_workflows.md`
- ✅ `tool_catalog.md`
- ✅ `debugging_guide.md`
- ❌ `ImplementationWorkflows.md` (no PascalCase)
- ❌ `implementation-workflows.md` (no kebab-case)

---

```yaml
role: Expert Reference Creator using workflows-documentation skill
purpose: Create deep-dive technical reference files for skills
action: Generate workflow, pattern, debugging, or tool reference documentation

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  chained_support: true
```

---

## 1. 🎯 PURPOSE

Create a technical reference file for an existing skill following the `skill_reference_template.md` structure. Reference files provide Level 3 progressive disclosure - deep technical guidance loaded when needed for complex operations.

**Template Location:** `.opencode/skill/workflows-documentation/assets/skill_reference_template.md`

---

## 2. 📋 CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name and reference type (workflow|patterns|debugging|tools|quick_ref)
**Outputs:** Reference file in skill's references/ directory + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📝 INSTRUCTIONS

### Step 3.1: Verify All Phases Passed

Confirm you have these values from the phases:
- `skill_name` from PHASE 1
- `reference_type` from PHASE 1
- `skill_path` from PHASE 2

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 3.2: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_skill_reference.yaml
```

The YAML file contains:
- Reference type specifications and size targets
- Step-by-step activities with checkpoints
- Content structure patterns per reference type
- Code example formatting requirements
- SKILL.md integration procedures
- Validation requirements
- Completion report template

Execute all 5 steps in sequence following the workflow definition.

---

## 4. 📚 REFERENCE (See YAML for Details)

| Section              | Location in YAML                     |
| -------------------- | ------------------------------------ |
| Reference Types      | `notes.reference_type_selection`     |
| Size Targets         | `notes.reference_type_size_targets`  |
| Workflow Structure   | `notes.workflow_reference_structure` |
| Pattern Structure    | `notes.pattern_reference_structure`  |
| Chained Mode         | `notes.chained_execution_mode`       |
| Failure Recovery     | `failure_recovery`                   |
| Completion Report    | `completion_report_template`         |

---

## 5. 💡 EXAMPLES

**Example 1: Create workflow reference**
```
/documentation:create_reference workflows-code workflow
```
→ Creates phased workflow documentation with checkpoints

**Example 2: Create patterns reference**
```
/documentation:create_reference workflows-documentation patterns
```
→ Creates before/after code pattern library

**Example 3: Create debugging reference**
```
/documentation:create_reference workflows-chrome-devtools debugging
```
→ Creates systematic troubleshooting guide
