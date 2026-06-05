---
description: Create a new OpenCode agent with frontmatter, tool permissions, behavioral rules. Modes :auto, :confirm.
argument-hint: "<agent_name> [agent_description] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @markdown agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `create_agent_auto.yaml`
>    - Confirm mode → `create_agent_confirm.yaml`
> 5. Execute the YAML workflow step by step
>
> The @markdown references below are self-verification checks — not dispatch instructions.
> All content after the Setup Phase is reference context for the YAML workflow.

---

# 🚨 PHASE 0: @MARKDOWN AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @markdown agent?
│
├─ INDICATORS that you ARE @markdown agent:
│   ├─ You were invoked with "@markdown" prefix
│   ├─ You have template-first workflow capabilities
│   ├─ You load templates BEFORE creating content
│   ├─ You validate template alignment AFTER creating
│
├─ IF YES (all indicators present):
│   └─ create_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ MARKDOWN AGENT REQUIRED                                      │
    │   │                                                            │
    │   │ This command requires the @markdown agent for:              │
    │   │   • Template-first workflow (loads before creating)          │
    │   │   • Frontmatter validation                                 │
    │   │   • sk-doc skill integration                               │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @markdown /create:agent [agent-name]                      │
    │   │                                                            │
    │   │ Reference: [runtime_agent_path]/markdown.md                 │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Markdown agent required"
```

**Phase Output:**
- `create_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{spec_path}/create-agent-config.json` when a spec is linked, otherwise `/tmp/create-agent-config.json` (shape: `agentName`, `agentPath`, `specChoice`, `specPath`, `executionMode: "auto"`, `memoryChoice`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/create/assets/create_agent_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_choice`. **Ordering rule**: none needed.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/create:agent:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  agent_name: quality-gate  # kebab-case string
  agent_path: .opencode/agents/  # runtime agent directory path
  spec_choice: new  # existing | new | update-related | skip
  spec_path: <spec-folder>  # explicit path when applicable
  execution_mode: AUTONOMOUS  # from :auto suffix
  memory_choice: skip  # latest | recent3 | skip | n/a
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `agent_name` | Y | `$ARGUMENTS` positional agent name, or marker `agent_name` | none | N |
| `agent_path` | Y | flag `--path`, marker `agent_path`, runtime profile default | runtime agent path | N |
| `spec_choice` | Y | marker `spec_choice`, or targeted choice among existing/new/update-related/skip | none | Y, when related specs exist and the folder choice is ambiguous |
| `spec_path` | Conditional | marker `spec_path`, derived from `spec_choice`, or null when `spec_choice` is `skip` | none | N |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `memory_choice` | N | marker `memory_choice`, prior-session detection, or default | `skip` when no prior continuity records exist | N |

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
   │   └─ Store output path as: agent_path (default: [runtime_agent_path]/)
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

4. Determine if prior-session context loading is needed:
   - Will be asked ONLY if user selects A or C for spec folder AND the spec docs include recent `_memory.continuity` entries or a `handover.md`
   - Include Q3 placeholder with note "(if using existing spec with prior-session context)"

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Agent Name** (if not provided in command):               │
   │    What agent would you like to create?                        │
   │    Format: kebab-case (e.g., quality-gate, security-audit)     │
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
   │ **Q3. Prior Session Context** (if existing spec has it):        │
   │    A) Load `handover.md` + `_memory.continuity` from            │
   │       `implementation-summary.md`                                │
   │    B) Load canonical spec docs (spec.md, plan.md, tasks.md,     │
   │       decision-record.md) up to a recent cap                    │
   │    C) Skip (start fresh)                                       │
   │                                                                │
   │ Reply with answers, e.g.: "B, A, C" or "quality-gate, B, A, C" │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - agent_name = [from Q0 or $ARGUMENTS]
   - agent_path = [from --path flag or default runtime path ([runtime_agent_path]/)]
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
- `create_agent_verified = ________________`
- `agent_name = ________________`
- `agent_path = ________________`
- `spec_choice = ___` | `spec_path = ________________`
- `execution_mode = ________________`
- `memory_loaded = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                | REQUIRED      | YOUR VALUE | SOURCE                 |
| -------------------- | ------------- | ---------- | ---------------------- |
| create_agent_verified | ✅ Yes         | ______     | Automatic check        |
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

## INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/commands/create/assets/create_agent_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/commands/create/assets/create_agent_confirm.yaml`

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@context`, `spec authoring`) from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: run Phase 0, then Setup Phase, then load the YAML file

---

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- Claude: `.claude/agents`
- Codex: `.codex/agents`

---

## 1. ROLE & PURPOSE

```yaml
role: Expert Agent Creator using sk-doc skill
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

Create a complete, production-ready OpenCode agent following the 6-step agent creation process from the `sk-doc` skill. The workflow ensures understanding before implementation, validates YAML frontmatter syntax, and produces agents that integrate seamlessly with OpenCode's agent system.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Agent name in kebab-case with optional output path
**Outputs:** Complete agent file with frontmatter + content + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. AGENT STRUCTURE & FRONTMATTER REFERENCE

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

## 1. CORE WORKFLOW

[Numbered steps based on use cases]

---

## 2. [DOMAIN SECTION]

[Content based on purpose - e.g., "Quality Validation Standards" for a quality-gate agent]

---

## 3. ANTI-PATTERNS

❌ **Never [rule from planning]**
- [Reason]

---

## 4. RELATED RESOURCES

- [Skills identified in planning]
- [Other relevant resources]
```

---

## 4. AGENT MODES REFERENCE

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
- Specialized for specific tasks (validation, research, security, etc.)
- Return control to primary agent when complete

**Mode: All:**
- Hybrid mode with both primary and subagent capabilities
- Maximum flexibility but can be confusing for users
- Use sparingly for truly multi-purpose agents

---

## 5. PERMISSION REFERENCE

### Unified Permission Format (v1.1.1+)

All tool permissions are defined in a single `permission:` object with `allow/deny/ask` values.

| Permission         | Values         | Purpose                      | Default |
| ------------------ | -------------- | ---------------------------- | ------- |
| read               | allow/deny     | Read files                   | allow   |
| write              | allow/deny     | Create files                 | allow   |
| edit               | allow/deny/ask | Modify files                 | allow   |
| bash               | allow/deny/ask | Execute commands             | allow   |
| grep               | allow/deny     | Search content               | allow   |
| glob               | allow/deny     | Find files                   | allow   |
| webfetch           | allow/deny/ask | Fetch URLs                   | deny    |
| memory             | allow/deny     | Spec Kit Memory              | allow   |
| chrome_devtools    | allow/deny     | Browser debugging            | deny    |
| external_directory | allow/deny     | Access files outside project | allow   |

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

## 6. AGENT CREATION TEMPLATES

### Agent Template Path
`.opencode/skills/sk-doc/assets/agent_template.md`

### Agent Scripts
- Validation: `.opencode/skills/sk-doc/scripts/validate_document.py`
- Structure extraction: `.opencode/skills/sk-doc/scripts/extract_structure.py`

### Agent References
- Core standards: `.opencode/skills/sk-doc/references/global/core_standards.md`
- Agent creation guide: `.opencode/skills/sk-doc/references/agent_creation.md`

---

## 7. EXAMPLES

**Example 1: Quality Validation Subagent**
```
/create:agent quality-gate --mode subagent
```
→ Creates `[runtime_agent_path]/quality-gate.md`
→ Invoked via `@quality-gate` or automatically by primary agents

**Example 2: Security Audit Primary Agent**
```
/create:agent security-audit --mode primary
```
→ Creates `[runtime_agent_path]/security-audit.md`
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
/create:agent quality-gate --mode subagent :auto
```
→ Creates agent without approval prompts, only stops for errors

**Example 6: Confirm mode (step-by-step approval)**
```
/create:agent security-audit --mode primary :confirm
```
→ Pauses at each step for user confirmation

---

## 8. ERROR HANDLING

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

## 9. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @markdown agent verification (Phase 0)
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

---

## 10. RELATED RESOURCES

| Resource                                            | Path                                       |
| --------------------------------------------------- | ------------------------------------------ |
| Agent template                                      | `sk-doc/assets/agent_template.md`   |
| sk-doc skill                                        | `.opencode/skills/sk-doc/SKILL.md`          |
| system-spec-kit skill                               | `.opencode/skills/system-spec-kit/SKILL.md` |
| Scripts: validate_document.py, extract_structure.py | `sk-doc/scripts/`                          |
| Core standards reference                            | `sk-doc/references/global/core_standards.md`      |
