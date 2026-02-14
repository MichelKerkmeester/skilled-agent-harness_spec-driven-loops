---
description: "Create a new OpenCode agent with proper frontmatter, tool permissions, and behavioral rules - supports :auto and :confirm modes"
argument-hint: "<agent_name> [agent_description] [:auto|:confirm]"
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
>    - Auto mode → `create_agent_auto.yaml`
>    - Confirm mode → `create_agent_confirm.yaml`
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
    │   │   • Frontmatter validation                                 │
    │   │   • workflows-documentation skill integration               │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @write /create:agent [agent-name]                        │
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

**Round-trip optimization:** This workflow requires only 1 user interaction.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains an agent name (ignoring flags):
   ├─ IF $ARGUMENTS has content → agent_name = extracted value, omit Q0
   │   ├─ Extract --mode flag if present (optional)
   │   ├─ VALIDATE agent name format:
   │   │   ├─ Must be kebab-case (lowercase, hyphens, digits only)
   │   │   ├─ Must match folder name exactly
   │   │   ├─ No uppercase, underscores, or special characters
   │   │   └─ IF invalid: include Q0 in prompt with format guidance
   │   └─ Store output path as: agent_path (default: .opencode/agent/)
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

4. Determine if memory loading question is needed:
   - Will be asked ONLY if user selects A or C for spec folder AND memory/ has files
   - Include Q3 placeholder with note "(if using existing spec with memory files)"

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Agent Name** (if not provided in command):               │
   │    What agent would you like to create?                        │
   │    Format: kebab-case (e.g., review, security-audit)           │
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
   │ Reply with answers, e.g.: "B, A, C" or "review, B, A, C"       │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - agent_name = [from Q0 or $ARGUMENTS]
   - agent_path = [from --path flag or default: .opencode/agent/]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - memory_choice = [A/B/C from Q3, or N/A if not applicable]

8. Execute background operations based on choices:
   - IF spec_choice == B: Find next number and create: specs/[NNN]-[agent-name]/
   - IF memory_choice == A: Load most recent memory file
   - IF memory_choice == B: Load up to 3 recent memory files

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer agent names from context, screenshots, or conversation history
```

**Phase Output:**
- `write_agent_verified = ________________`
- `agent_name = ________________`
- `agent_path = ________________`
- `spec_choice = ___` | `spec_path = ________________`
- `execution_mode = ________________`
- `memory_loaded = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                | REQUIRED      | YOUR VALUE | SOURCE                 |
| -------------------- | ------------- | ---------- | ---------------------- |
| write_agent_verified | ✅ Yes         | ______     | Automatic check        |
| agent_name           | ✅ Yes         | ______     | Q0 or $ARGUMENTS       |
| agent_path           | ✅ Yes         | ______     | --path flag or default |
| spec_choice          | ✅ Yes         | ______     | Q1                     |
| spec_path            | ○ Conditional | ______     | Derived from Q1        |
| execution_mode       | ✅ Yes         | ______     | Suffix or Q2           |
| memory_loaded        | ○ Conditional | ______     | Q3 (if existing spec)  |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "⚡ INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚡ INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_agent_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_agent_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## Agent Routing

This command dispatches specialized agents at specific workflow steps (see YAML for details):

| Step | Agent | Rule | Purpose |
|------|-------|------|---------|
| 1b: Agent Discovery | @context | Rule 4 — ALL exploration through @context | Memory-first search for similar/duplicate agents |
| 1c: Spec Folder Setup | @speckit | Rule 5 — ALL spec folder docs through @speckit | Template-enforced spec.md + plan.md creation |
| 5b: Quality Review | @review | §3 — @review for quality scoring | 100-point rubric scoring of created artifact |

**Agent files**: `.opencode/agent/context.md`, `.opencode/agent/speckit.md`, `.opencode/agent/review.md`

---

## 1. 📖 ROLE & PURPOSE

```yaml
role: Expert Agent Creator using workflows-documentation skill
purpose: Create production-ready OpenCode agents with proper frontmatter and behavioral rules
action: Guide agent creation from understanding through validation with YAML frontmatter verification

operating_mode:
  workflow: sequential_6_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  tracking: progressive_task_checklists
  validation: yaml_frontmatter_check
```

Create a complete, production-ready OpenCode agent following the 6-step agent creation process from the `workflows-documentation` skill. The workflow ensures understanding before implementation, validates YAML frontmatter syntax, and produces agents that integrate seamlessly with OpenCode's agent system.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Agent name in kebab-case with optional output path
**Outputs:** Complete agent file with frontmatter + content + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 AGENT STRUCTURE & FRONTMATTER REFERENCE

### Agent File Structure

```markdown
---
name: [agent_name]
description: "[One-line description]"
mode: [primary|subagent|all]
temperature: 0.1
permission:
  read: [allow/deny]
  write: [allow/deny]
  edit: [allow/deny/ask]
  bash: [allow/deny/ask]
  grep: [allow/deny]
  glob: [allow/deny]
  webfetch: [allow/deny/ask]
  memory: [allow/deny]
  chrome_devtools: [allow/deny]
  external_directory: [allow/deny]
---

# [Agent Title]

[1-2 sentence intro based on purpose and authority]

---

## 1. 🔄 CORE WORKFLOW

[Numbered steps based on use cases]

---

## 2. 📋 [DOMAIN SECTION]

[Content based on purpose - e.g., "Code Review Standards" for a review agent]

---

## 3. 🚫 ANTI-PATTERNS

❌ **Never [rule from planning]**
- [Reason]

---

## 4. 🔗 RELATED RESOURCES

- [Skills identified in planning]
- [Other relevant resources]
```

---

## 4. 🎯 AGENT MODES REFERENCE

| Mode     | Tab Cycle | @ Mention | Automatic Invocation | Use Case            |
| -------- | --------- | --------- | -------------------- | ------------------- |
| primary  | ✅         | ✅         | ❌                    | Main assistant      |
| subagent | ❌         | ✅         | ✅                    | Specialized tasks   |
| all      | ✅         | ✅         | ✅                    | Maximum flexibility |

**Primary Agents:**
- Appear in Tab cycle as main conversation handlers
- Users explicitly select them as their active assistant
- Coordinate work and delegate to subagents

**Subagents:**
- Invoked via `@agent-name` mentions or automatically by primary agents
- Specialized for specific tasks (review, research, security, etc.)
- Return control to primary agent when complete

**Mode: All:**
- Hybrid mode with both primary and subagent capabilities
- Maximum flexibility but can be confusing for users
- Use sparingly for truly multi-purpose agents

---

## 5. 🔧 PERMISSION REFERENCE

### Unified Permission Format (v1.1.1+)

All tool permissions are defined in a single `permission:` object with `allow/deny/ask` values.

| Permission          | Values         | Purpose                         | Default |
| ------------------- | -------------- | ------------------------------- | ------- |
| read                | allow/deny     | Read files                      | allow   |
| write               | allow/deny     | Create files                    | allow   |
| edit                | allow/deny/ask | Modify files                    | allow   |
| bash                | allow/deny/ask | Execute commands                | allow   |
| grep                | allow/deny     | Search content                  | allow   |
| glob                | allow/deny     | Find files                      | allow   |
| webfetch            | allow/deny/ask | Fetch URLs                      | deny    |
| memory              | allow/deny     | Spec Kit Memory                 | allow   |
| chrome_devtools     | allow/deny     | Browser debugging               | deny    |
| external_directory  | allow/deny     | Access files outside project    | allow   |

**Permission Values:**
- `allow`: Allow all operations without approval
- `deny`: Disable the tool completely
- `ask`: Prompt for approval before running (edit, bash, webfetch only)

**Pattern-Based Bash Restrictions:**
```yaml
permission:
  bash:
    git: allow
    npm: allow
    docker: deny
    rm: ask
```

---

## 6. 📋 AGENT CREATION TEMPLATES

### Agent Template Path
`.opencode/skill/workflows-documentation/assets/opencode/agent_template.md`

### Agent Scripts
- Validation: `.opencode/skill/workflows-documentation/scripts/validate_document.py`
- Structure extraction: `.opencode/skill/workflows-documentation/scripts/extract_structure.py`

### Agent References
- Core standards: `.opencode/skill/workflows-documentation/references/core_standards.md`
- Agent creation guide: `.opencode/skill/workflows-documentation/references/agent_creation.md`

---

## 7. 🔍 EXAMPLES

**Example 1: Code Review Subagent**
```
/create:agent review --mode subagent
```
→ Creates `.opencode/agent/review.md`
→ Invoked via `@review` or automatically by primary agents

**Example 2: Security Audit Primary Agent**
```
/create:agent security-audit --mode primary
```
→ Creates `.opencode/agent/security-audit.md`
→ Appears in Tab cycle

**Example 3: Global Documentation Agent**
```
/create:agent docs-writer --mode subagent --global
```
→ Creates `~/.config/opencode/agent/docs-writer.md`
→ Available across all projects

**Example 4: Prompted Creation**
```
/create:agent
```
→ Prompts: Single consolidated prompt with Q0-Q3
→ Interactive workflow guides through all decisions

**Example 5: Auto mode (no prompts)**
```
/create:agent review --mode subagent :auto
```
→ Creates agent without approval prompts, only stops for errors

**Example 6: Confirm mode (step-by-step approval)**
```
/create:agent security-audit --mode primary :confirm
```
→ Pauses at each step for user confirmation

---

## 8. ⚠️ ERROR HANDLING

### Common Validation Errors

**YAML Parse Error:**
- **Cause:** Invalid YAML syntax in frontmatter
- **Fix:** Check for missing colons, incorrect indentation, unquoted strings with special characters

**Missing Required Field:**
- **Cause:** `name`, `description`, or `mode` field missing
- **Fix:** Add the missing field to frontmatter

**Invalid Mode Value:**
- **Cause:** Mode is not one of: primary, subagent, all
- **Fix:** Correct the mode value

**Deprecated Tools Object:**
- **Cause:** Old `tools:` object present instead of unified `permission:` object
- **Fix:** Convert to v1.1.1+ format with `permission:` object

**File Already Exists:**
- **Cause:** Agent file already exists at target path
- **Fix:** Choose to overwrite, rename, or cancel

---

<!-- REFERENCE ONLY -->

---

## 9. 🚫 VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification (Phase 0)
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without asking user for agent name when not in $ARGUMENTS
- Auto-selected agent type without explicit user choice
- Overwrote existing agent without confirmation

**Workflow Violations (Steps 1-6):**
- Skipped understanding phase and jumped to generation
- Created agent without gathering purpose and use cases first
- Did not validate frontmatter syntax before claiming complete
- Claimed "complete" without YAML validation

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

## 10. 🔗 RELATED RESOURCES

| Resource | Path |
|---|---|
| Agent template | `workflows-documentation/assets/opencode/agent_template.md` |
| workflows-documentation skill | `.opencode/skill/workflows-documentation/SKILL.md` |
| system-spec-kit skill | `.opencode/skill/system-spec-kit/SKILL.md` |
| Scripts: validate_document.py, extract_structure.py | `workflows-documentation/scripts/` |
| Core standards reference | `workflows-documentation/references/core_standards.md` |
