---
description: Create a comprehensive AI-first installation guide with step-by-step setup instructions, requirements, and troubleshooting
argument-hint: "<project-name> [--platforms <list>]"
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
│   │   ┌─────────────────────────────────────────────────────────────┐
│   │   │ "What project/tool needs an installation guide?"            │
│   │   │                                                             │
│   │   │ Please provide:                                             │
│   │   │ - Project name                                              │
│   │   │ - Target platforms (optional: macos, linux, windows, docker)│
│   │   └─────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store as: project_name
│   └─ SET STATUS: ✅ PASSED
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Parse first argument as: project_name
    ├─ Parse --platforms flag if present
    │
    ├─ VALIDATE platforms (if specified):
    │   ├─ Must be comma-separated list of: macos, linux, windows, docker, all
    │   │
    │   ├─ IF invalid:
    │   │   ├─ SHOW: "Invalid platform. Valid: macos, linux, windows, docker, all"
    │   │   └─ Set default: platforms = "all"
    │   │
    │   └─ IF valid or not specified:
    │       └─ Store as: platforms (default: "all")
    │
    └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer project from context
⛔ NEVER assume platforms without confirmation
```

**Phase 1 Output:** `project_name = ________________` | `platforms = ________________`

---

## 🔒 PHASE 2: OUTPUT LOCATION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. Determine output location:
   ├─ Default: ./install_guides/[Type] - [Project Name].md
   └─ Alternative: ./INSTALL.md or ./docs/INSTALL.md

2. Check for existing installation guide:
   $ ls -la ./install_guides/*.md ./INSTALL.md ./docs/INSTALL.md 2>/dev/null

3. Process result:
   ├─ IF similar guide exists:
   │   ├─ ASK user:
   │   │   ┌────────────────────────────────────────────────────────────┐
   │   │   │ "Found existing guide at [path]."                          │
   │   │   │                                                            │
   │   │   │ A) Overwrite existing file                                 │
   │   │   │ B) Create with different name                              │
   │   │   │ C) Merge with existing content                             │
   │   │   │ D) Cancel                                                  │
   │   │   └────────────────────────────────────────────────────────────┘
   │   └─ Process based on choice
   │
   └─ IF no existing file:
       ├─ Suggest: install_guides/[Type] - [Project Name].md
       ├─ ASK for confirmation or alternate name
       ├─ Store as: output_path
       └─ SET STATUS: ✅ PASSED

⛔ HARD STOP: DO NOT proceed without confirmed output location
```

**Phase 2 Output:** `output_path = ________________` | `existing_file = [yes/no]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE           | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                             |
| --------------- | --------------- | ----------- | ---------------------------------------- |
| PHASE 1: INPUT  | ✅ PASSED        | ______      | project: ______ / platforms: ________    |
| PHASE 2: OUTPUT | ✅ PASSED        | ______      | output_path: ______ / existing: ________ |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED?
│   ├─ YES → Proceed to "# Installation Guide Creation Workflow" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Started reading the workflow section before all phases passed
- Proceeded without explicit project name (Phase 1)
- Assumed platforms without confirmation (Phase 1)
- Overwrote existing file without confirmation (Phase 2)

**Workflow Violations (Steps 1-5):**
- Skipped requirements discovery and jumped to generation
- Generated guide without AI-First section
- Did not include all 11 sections (9 required + 2 optional)
- Claimed "complete" without validation checklist

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

| STEP | NAME       | STATUS | REQUIRED OUTPUT   | VERIFICATION                |
| ---- | ---------- | ------ | ----------------- | --------------------------- |
| 1    | Analysis   | ☐      | Scope defined     | Project/platforms confirmed |
| 2    | Discovery  | ☐      | Requirements list | Prerequisites identified    |
| 3    | Steps      | ☐      | Step-by-step plan | Installation steps defined  |
| 4    | Generation | ☐      | Complete guide    | All 11 sections included    |
| 5    | Validation | ☐      | Validated guide   | Commands verified           |

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 2 (Discovery) REQUIREMENTS:
├─ MUST identify all prerequisites
├─ MUST determine project type (MCP/CLI/PLUGIN/SDK/SERVICE)
├─ MUST gather platform-specific requirements
└─ MUST NOT proceed without clear requirements list

STEP 4 (Generation) REQUIREMENTS:
├─ MUST include AI-First prompt section
├─ MUST include ALL 11 sections (9 required + 2 optional)
├─ MUST add platform-specific configuration
├─ MUST include troubleshooting section
└─ MUST NOT skip any required section

STEP 5 (Validation) REQUIREMENTS:
├─ MUST verify all commands are accurate
├─ MUST check all platforms covered
├─ MUST validate AI-First prompt completeness
└─ MUST NOT claim "complete" without validation checklist
```

---

# Installation Guide Creation Workflow

Create a comprehensive AI-first installation guide with clear prerequisites, step-by-step instructions, and troubleshooting for common issues. Every guide starts with a copy-paste AI prompt.

---

```yaml
role: Expert Installation Guide Creator using workflows-documentation skill
purpose: Create comprehensive multi-platform AI-first installation documentation
action: Generate step-by-step setup instructions with AI-assisted install prompt

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
```

---

## 1. 🎯 PURPOSE

Create a comprehensive AI-first installation guide following the pattern in `install_guides/`. The guide includes a copy-paste AI prompt for assisted installation, clear prerequisites, platform-specific commands, and thorough troubleshooting.

---

## 2. 📋 CONTRACT

**Inputs:** `$ARGUMENTS` — Project name with optional --platforms flag
**Outputs:** Installation guide at specified location + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📝 INSTRUCTIONS

### Step 3.1: Verify All Phases Passed

Confirm you have these values from the phases:
- `project_name` from PHASE 1
- `platforms` from PHASE 1 (default: "all")
- `output_path` from PHASE 2
- `existing_file` handling from PHASE 2

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 3.2: Load & Execute Workflow

Load and execute the workflow definition:

```
.opencode/command/create/assets/create_install_guide.yaml
```

The YAML file contains:
- Detailed step-by-step activities
- Guide type prefixes (MCP/CLI/PLUGIN/SDK/SERVICE)
- Platform configurations
- AI-First template and full guide template
- Checkpoint prompts and options
- Error recovery procedures
- Validation requirements
- Completion report template

Execute all 5 steps in sequence following the workflow definition.

---

## 4. 📚 REFERENCE (See YAML for Details)

| Section             | Location in YAML                |
| ------------------- | ------------------------------- |
| Type Prefixes       | `notes.type_prefix_conventions` |
| Required Sections   | `notes.required_sections`       |
| AI-First Philosophy | `notes.ai_first_philosophy`     |
| Failure Recovery    | `failure_recovery`              |
| Completion Report   | `completion_report_template`    |

**Reference Guides:**
- `.opencode/install_guides/MCP/MCP - Code Mode.md`
- `.opencode/install_guides/MCP/MCP - Semantic Memory.md`
- `.opencode/install_guides/MCP/MCP - Chrome Dev Tools.md`

---

## 5. 💡 EXAMPLES

**Example 1: MCP Server Guide**
```
/documentation:create_install_guide semantic-search-mcp
```
→ Creates `install_guides/MCP/MCP - Semantic Search.md`

**Example 2: CLI Tool Guide**
```
/documentation:create_install_guide chrome-devtools-cli --platforms macos,linux
```
→ Creates `install_guides/CLI - Chrome DevTools.md`

**Example 3: Plugin Guide**
```
/documentation:create_install_guide antigravity-auth
```
→ Creates `install_guides/PLUGIN - Antigravity Auth.md`
