---
description: Create an asset file for an existing skill - templates, lookups, examples, or guides
argument-hint: "<skill-name> <asset-type> [--chained]"
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
│   │   ├─ asset_type (from parent selection)
│   │
│   ├─ IF all parameters present:
│   │   ├─ SET PHASE 1: ⏭️ SKIPPED (parent verified)
│   │   ├─ SET PHASE 2: ⏭️ SKIPPED (parent verified)
│   │   └─ PROCEED directly to "# Asset Creation" workflow
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
│   │   │ "Which skill needs an asset, and what type?"               │
│   │   │                                                            │
│   │   │ Format: <skill-name> <asset-type>                          │
│   │   │                                                            │
│   │   │ Asset types:                                               │
│   │   │   - template  (copy-paste starting points)                 │
│   │   │   - lookup    (lookup tables, decisions)                   │
│   │   │   - example   (working code examples)                      │
│   │   │   - guide     (step-by-step how-tos)                       │
│   │   └────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Parse response for skill_name and asset_type
│   └─ SET STATUS: ✅ PASSED
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Parse first argument as: skill_name
    ├─ Parse second argument as: asset_type
    │
    ├─ VALIDATE asset_type:
    │   ├─ Must be one of: template, lookup, example, guide
    │   │
    │   ├─ IF invalid:
    │   │   ├─ SHOW: "Invalid asset type. Valid: template, lookup, example, guide"
    │   │   ├─ ASK for correct type
    │   │   └─ WAIT for response
    │   │
    │   └─ IF valid:
    │       └─ Store as: asset_type
    │
    └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer skill name from context or conversation history
⛔ NEVER assume asset type without explicit input
```

**Phase 1 Output:** `skill_name = ________________` | `asset_type = ________________`

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
⛔ NEVER create assets for non-existent skills
```

**Phase 2 Output:** `skill_path = ________________` | `skill_verified = [yes/no]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                   | REQUIRED STATUS         | YOUR STATUS | OUTPUT VALUE                           |
| ----------------------- | ----------------------- | ----------- | -------------------------------------- |
| PHASE C: CHAINED        | ⏭️ SKIPPED or N/A       | ______      | chained_mode: [yes/no]                 |
| PHASE 1: INPUT          | ✅ PASSED or ⏭️ SKIPPED | ______      | skill_name: ______ / asset_type: _____ |
| PHASE 2: SKILL VERIFY   | ✅ PASSED or ⏭️ SKIPPED | ______      | skill_path: ______                     |

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
- Proceeded without both skill name AND asset type (Phase 1) when not chained
- Attempted to create asset for non-existent skill (Phase 2) when not chained
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
| 1    | Analysis       | ☐      | Skill path, asset type   | Skill verified, type valid      |
| 2    | Planning       | ☐      | Filename, sections       | File spec determined            |
| 3    | Template Load  | ☐      | Structure patterns       | Template loaded                 |
| 4    | Content        | ☐      | [asset_name].md          | Asset file created              |
| 5    | Validation     | ☐      | Updated SKILL.md         | Integration complete            |

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

## 2. 📋 CONTRACT

**Inputs:** `$ARGUMENTS` — Skill name and asset type (template|lookup|example|guide)
**Outputs:** Asset file in skill's assets/ directory + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📝 INSTRUCTIONS

### Step 3.1: Verify All Phases Passed

Confirm you have these values from the phases:
- `skill_name` from PHASE 1
- `asset_type` from PHASE 1
- `skill_path` from PHASE 2

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 3.2: Load & Execute Workflow

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

## 4. 📚 REFERENCE

### Asset Location
- **Path**: `.opencode/skill/[skill-name]/assets/`
- **Naming**: snake_case (e.g., `frontmatter_templates.md`, `config_examples.yaml`)

### Asset Types & Naming Conventions

| Type      | Naming Pattern           | Example                    | Purpose                        |
| --------- | ------------------------ | -------------------------- | ------------------------------ |
| Template  | `[content]_templates.md` | `frontmatter_templates.md` | Copy-paste starting points     |
| Reference | `[topic]_reference.md`   | `emoji_reference.md`       | Lookup tables, decisions       |
| Example   | `[topic]_examples.md`    | `optimization_examples.md` | Working code examples          |
| Guide     | `[process]_guide.md`     | `packaging_guide.md`       | Step-by-step how-tos           |

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

| Section              | Location in YAML                    |
| -------------------- | ----------------------------------- |
| Asset Types          | `notes.asset_type_selection_guide`  |
| Naming Conventions   | `workflow.steps[2].naming`          |
| Integration Rules    | `notes.integration_requirements`    |
| Chained Mode         | `notes.chained_execution_mode`      |
| Failure Recovery     | `failure_recovery`                  |
| Completion Report    | `completion_report_template`        |

### Template Reference
- **Template location**: `.opencode/skill/workflows-documentation/assets/skill_asset_template.md`

---

## 5. 💡 EXAMPLES

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
/documentation:create_asset system-memory guide
```
→ Creates `.opencode/skill/system-memory/assets/[name]_guide.md`
