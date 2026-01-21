---
description: Create an OpenCode agent (primary or subagent) with proper frontmatter, tool permissions, and behavioral rules - supports :auto and :confirm modes
argument-hint: "<agent-name> [--mode primary|subagent|all] [--global] [:auto|:confirm]"
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, TodoWrite]
---

## ⚡ GATE 3 STATUS: EXEMPT (Self-Documenting Artifact)

**This command creates agent files that ARE the configuration artifact.**

| Property        | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| **Location**    | `.opencode/agent/` (project) or `~/.config/opencode/agent/` (global) |
| **Reason**      | The created file IS the agent configuration                          |
| **Spec Folder** | Optional - can track complex agent development                       |

---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** This workflow requires 2-3 user interactions.

---

## 🔒 PHASE 0: WRITE AGENT VERIFICATION [PRIORITY GATE]

**STATUS: ☐ BLOCKED** (Must pass BEFORE all other phases)

> **⚠️ CRITICAL:** This command REQUIRES the `@write` agent for template enforcement and quality gates.

```
EXECUTE THIS CHECK FIRST:

├─ SELF-CHECK: Are you operating as the @write agent?
│   │
│   ├─ INDICATORS that you ARE @write agent:
│   │   ├─ You were invoked with "@write" prefix
│   │   ├─ You have template-first workflow capabilities
│   │   ├─ You load templates BEFORE creating content
│   │   ├─ You validate template alignment AFTER creating
│   │
│   ├─ IF YES (all indicators present):
│   │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 1
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
│       │   │   • Frontmatter validation                                 │
│       │   │   • workflows-documentation skill integration               │
│       │   │                                                            │
│       │   │ To proceed, restart with:                                  │
│       │   │   @write /create:agent [agent-name]                        │
│       │   │                                                            │
│       │   │ Reference: .opencode/agent/write.md                        │
│       │   └────────────────────────────────────────────────────────────┘
│       │
│       └─ RETURN: STATUS=FAIL ERROR="Write agent required"

⛔ HARD STOP: DO NOT proceed to PHASE 1 until STATUS = ✅ PASSED
```

**Phase 0 Output:** `write_agent_verified = [yes/no]`

---

## 🔒 PHASE 1: INPUT COLLECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS is empty, undefined, or whitespace-only:
│   │
│   ├─ ASK user:
│   │   ┌────────────────────────────────────────────────────────────┐
│   │   │ "What agent would you like to create?"                     │
│   │   │                                                            │
│   │   │ Please provide an agent name                               │
│   │   │ (e.g., review, security-audit, test-runner)                │
│   │   │                                                            │
│   │   │ Format: lowercase, single word or hyphenated               │
│   │   └────────────────────────────────────────────────────────────┘
│   │
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store response as: agent_name
│   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│
└─ IF $ARGUMENTS contains content:
    │
    ├─ Extract agent name (first argument)
    ├─ Extract --mode flag if present (default: subagent)
    ├─ Extract --global flag if present (default: false)
    ├─ VALIDATE agent name format:
    │   ├─ Must be lowercase
    │   ├─ Only letters, numbers, and hyphens allowed
    │   ├─ No uppercase, underscores, or special characters
    │   │
    │   ├─ IF invalid format:
    │   │   ├─ SHOW: "Invalid agent name format. Expected: lowercase-hyphenated"
    │   │   ├─ ASK for corrected name
    │   │   └─ WAIT for response
    │   │
    │   └─ IF valid:
    │       └─ Store as: agent_name
    │
    ├─ VALIDATE mode (if provided):
    │   ├─ Must be one of: primary, subagent, all
    │   ├─ IF invalid: Set default: mode = "subagent"
    │   └─ Store as: agent_mode
    │
    ├─ Store global flag as: is_global (default: false)
    └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2

**STOP HERE** - Wait for user to provide a valid agent name before continuing.

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer agent names from context
⛔ NEVER proceed without explicit agent name from user
```

**Phase 1 Output:** `agent_name = ________________` | `agent_mode = ________________` | `is_global = ________________`

---

## 🔒 MODE DETECTION

```
CHECK for mode suffix in $ARGUMENTS or command invocation:

├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS"
├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE"
└─ No suffix → execution_mode = "INTERACTIVE" (default - safer for creation workflows)
```

**Mode Output:** `execution_mode = ________________`

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

## 🔒 PHASE 2: AGENT TYPE SELECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. IF agent_mode was NOT provided in arguments, ASK user:
   ┌────────────────────────────────────────────────────────────┐
   │ "What type of agent should this be?"                       │
   │                                                            │
   │ A) Primary agent                                           │
   │    • Appears in Tab cycle as main assistant                │
   │    • Handles main conversation                             │
   │    • Example: Build, Plan                                  │
   │                                                            │
   │ B) Subagent                                                │
   │    • Invoked via @ mention (e.g., @review)                 │
   │    • Can be invoked automatically by primary agents        │
   │    • Example: General, Explore                             │
   │                                                            │
   │ C) Both (mode: all)                                        │
   │    • Can be used as primary or subagent                    │
   │    • Maximum flexibility                                    │
   └────────────────────────────────────────────────────────────┘

2. WAIT for explicit user choice (A, B, or C)

3. Process choice:
   ├─ IF A: agent_mode = "primary"
   ├─ IF B: agent_mode = "subagent"
   └─ IF C: agent_mode = "all"

4. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to select agent type (A/B/C) before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly selects A, B, or C
```

**Phase 2 Output:** `agent_mode = ________________`

---

## 🔒 PHASE 3: OUTPUT LOCATION VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 2 PASSES:

1. Determine output location:
   ├─ IF is_global == true:
   │   └─ agent_path = ~/.config/opencode/agent/[agent_name].md
   │
   └─ IF is_global == false (default):
       └─ agent_path = .opencode/agent/[agent_name].md

2. Check if agent already exists:
   $ ls -la [agent_path] 2>/dev/null

3. Process result:
   ├─ IF agent file already exists:
   │   ├─ ASK user:
   │   │   ┌────────────────────────────────────────────────────────────┐
   │   │   │ "Agent '[agent_name]' already exists at [path]."           │
   │   │   │                                                            │
   │   │   │ A) Overwrite existing file                                  │
   │   │   │ B) Create with different name                              │
   │   │   │ C) Cancel                                                  │
   │   │   └────────────────────────────────────────────────────────────┘
   │   └─ Process based on choice
   │
   └─ IF no existing file:
       └─ SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to confirm output location or resolve existing file conflict before continuing.

⛔ HARD STOP: DO NOT proceed without confirmed output location
```

**Phase 3 Output:** `agent_path = ________________` | `existing_agent = [yes/no]`

---

## 🔒 PHASE 4: SPEC FOLDER SELECTION (Optional)

**STATUS: ☐ BLOCKED / ☐ N/A**

```
EXECUTE AFTER PHASE 3 PASSES:

1. ASK user:
   ┌────────────────────────────────────────────────────────────┐
   │ "Would you like to track this agent creation in a spec     │
   │ folder? (Recommended for complex agents)"                  │
   │                                                            │
   │ A) Use existing spec folder                                │
   │ B) Create new spec folder                                  │
   │ C) Skip documentation (simple agent)                       │
   └────────────────────────────────────────────────────────────┘

2. WAIT for explicit user choice (A, B, or C)

3. Process choice:
   ├─ IF A (Use existing):
   │   ├─ List available spec folders
   │   ├─ Confirm which folder
   │   └─ Store as: spec_path
   │
   ├─ IF B (Create new):
   │   ├─ Find next number: ls -d specs/[0-9]*/ | sort -n | tail -1
   │   ├─ Create: specs/[NNN]-[agent-name]-agent/
   │   └─ Store as: spec_path
   │
   └─ IF C (Skip):
       └─ spec_path = null

4. SET STATUS: ✅ PASSED or ⏭️ N/A

**STOP HERE** - Wait for user to select spec folder option (A/B/C) before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly selects A, B, or C
```

**Phase 4 Output:** `spec_choice = ___` | `spec_path = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE                          |
| -------------------- | ----------------- | ----------- | ------------------------------------- |
| PHASE 0: WRITE AGENT | ✅ PASSED          | ______      | write_agent_verified: ______          |
| PHASE 1: INPUT       | ✅ PASSED          | ______      | agent_name: ______ / mode: ______     |
| MODE DETECTION       | ✅ SET             | ______      | execution_mode: ______                |
| PHASE 2: AGENT TYPE  | ✅ PASSED          | ______      | agent_mode: ______                    |
| PHASE 3: OUTPUT      | ✅ PASSED          | ______      | agent_path: ______ / existing: ______ |
| PHASE 4: SPEC FOLDER | ✅ PASSED or ⏭️ N/A | ______      | spec_path: ______                     |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# Agent Creation Workflow" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification (Phase 0)
- Started reading the workflow section before all phases passed
- Proceeded without asking user for agent name (Phase 1)
- Auto-selected agent type without A/B/C choice (Phase 2)
- Overwrote existing agent without confirmation (Phase 3)

**Workflow Violations (Steps 1-6):**
- Skipped understanding phase and jumped to generation
- Created agent without gathering purpose and use cases first
- Did not validate frontmatter syntax before claiming complete
- Claimed "complete" without YAML validation

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

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→6). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## WORKFLOW TRACKING

| STEP | NAME          | STATUS | REQUIRED OUTPUT               | VERIFICATION                   |
| ---- | ------------- | ------ | ----------------------------- | ------------------------------ |
| 1    | Analysis      | ☐      | agent_name, agent_path        | Name validated, path confirmed |
| 2    | Understanding | ☐      | Purpose, use cases, authority | Examples gathered              |
| 3    | Planning      | ☐      | Tools, permissions, rules     | Configuration defined          |
| 4    | Generation    | ☐      | [agent_name].md               | File created with content      |
| 5    | Validation    | ☐      | YAML syntax verified          | Frontmatter valid              |
| 6    | Save Context  | ☐      | memory/*.md (if spec folder)  | Context preserved              |

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 2 (Understanding) REQUIREMENTS:
├─ MUST gather agent PURPOSE (what role does it fill?)
├─ MUST gather 2-3 concrete USE CASES (when invoked?)
├─ MUST define AUTHORITY (what decisions can it make?)
└─ MUST NOT proceed without user confirmation

STEP 3 (Planning) REQUIREMENTS:
├─ MUST identify TOOLS needed (read, write, edit, bash, etc.)
├─ MUST determine PERMISSIONS (allow/deny/ask for each action)
├─ MUST define BEHAVIORAL RULES (ALWAYS/NEVER/ESCALATE IF)
├─ MUST identify SKILLS to integrate (if any)
└─ MUST NOT proceed without tool/permission configuration

STEP 4 (Generation) REQUIREMENTS:
├─ MUST include valid YAML frontmatter with:
│   ├─ name (matches file name)
│   ├─ description (one-line)
│   ├─ mode (primary/subagent/all)
│   ├─ temperature (default: 0.1)
│   ├─ tools (object with true/false)
│   └─ permission (object with allow/deny/ask)
├─ MUST include markdown body with:
│   ├─ Title and intro
│   ├─ Core workflow section
│   ├─ Domain-specific sections
│   ├─ Anti-patterns section
│   └─ Related resources section
└─ MUST NOT leave placeholder content

STEP 5 (Validation) REQUIREMENTS:
├─ MUST verify YAML frontmatter parses correctly
├─ MUST check required fields present (name, description)
├─ MUST verify mode is valid (primary/subagent/all)
└─ MUST NOT claim "complete" without validation pass
```

---

# Agent Creation Workflow

Create a complete OpenCode agent with proper YAML frontmatter, tool permissions, behavioral rules, and markdown documentation.

---

```yaml
role: Expert Agent Creator using workflows-documentation skill
purpose: Create production-ready OpenCode agents (primary or subagent)
action: Guide agent creation from understanding through validation

operating_mode:
  workflow: sequential_6_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  tracking: progressive_task_checklists
  validation: yaml_frontmatter_check
```

---

## 1. 🎯 PURPOSE

Create a complete, production-ready OpenCode agent following the 6-step workflow. The workflow ensures understanding before implementation, validates YAML frontmatter syntax, and produces agents that integrate seamlessly with OpenCode's agent system.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Agent name with optional --mode and --global flags
**Outputs:** Agent markdown file at specified location + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. ⚡ INSTRUCTIONS

### Step 4: Verify All Phases Passed

Confirm you have these values from the phases:
- `agent_name` from PHASE 1
- `agent_mode` from PHASE 2 (primary/subagent/all)
- `agent_path` from PHASE 3
- `spec_path` from PHASE 4 (or null if skipped)

**If ANY phase is incomplete, STOP and return to the MANDATORY PHASES section.**

### Step 5: Execute Workflow

Execute the 6-step workflow:

**STEP 1: Analysis**
- Validate agent name format (lowercase, hyphenated)
- Confirm output location
- Check for existing agent (handled in Phase 3)

**STEP 2: Understanding**
Ask user these questions (one at a time):

1. **Purpose**: What is the agent's purpose? What specific role will it fill?
   (e.g., "Code review specialist", "Security auditor", "Test automation")

2. **Use Cases**: Give me 2-3 concrete examples of when this agent would be invoked.
   (e.g., "When user asks to review a PR", "When security scan is needed")

3. **Authority**: What is this agent responsible for? What decisions can it make?
   (e.g., "Approve/reject code changes", "Flag security issues")

**STEP 3: Planning**
Based on understanding, determine:

1. **Permissions** (v1.1.1+ unified format): Which tools and actions are allowed?
   - read: allow/deny - Examine files
   - write: allow/deny - Create files
   - edit: allow/deny/ask - Modify files
   - bash: allow/deny/ask - Run commands (can use patterns)
   - grep: allow/deny - Search content
   - glob: allow/deny - Find files
   - webfetch: allow/deny/ask - Fetch URLs
   - narsil: allow/deny - Semantic + structural code analysis
   - memory: allow/deny - Spec Kit Memory
   - chrome_devtools: allow/deny - Browser debugging
   - external_directory: allow/deny - Access files outside project

2. **Behavioral Rules**:
   - ✅ ALWAYS: What must this agent always do?
   - ❌ NEVER: What must this agent never do?
   - ⚠️ ESCALATE IF: When should it ask for help?

3. **Skills Integration**: Which skills should this agent invoke?

**STEP 4: Generation**
Create the agent file with this structure (v1.1.1+ format):

```markdown
---
name: [agent_name]
description: "[One-line description based on purpose]"
mode: [agent_mode]
temperature: 0.1
permission:
  read: [allow/deny]
  write: [allow/deny]
  edit: [allow/deny/ask]
  bash: [allow/deny/ask]
  grep: [allow/deny]
  glob: [allow/deny]
  webfetch: [allow/deny/ask]
  narsil: [allow/deny]
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

❌ **Never [rule from planning]**
- [Reason]

---

## 4. 🔗 RELATED RESOURCES

- [Skills identified in planning]
- [Other relevant resources]
```

**STEP 5: Validation**
Run YAML validation:

```bash
python3 -c "import yaml; yaml.safe_load(open('[agent_path]').read().split('---')[1])"
```

Verify:
- [ ] YAML parses without errors
- [ ] `name` field matches file name
- [ ] `description` is present and single-line
- [ ] `mode` is one of: primary, subagent, all
- [ ] `permission` object uses v1.1.1+ format (allow/deny/ask values)
- [ ] No deprecated `tools` object present

**STEP 6: Save Context (if spec folder used)**
If spec_path is not null:
```bash
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec_path]
```

---

## 4. 📌 REFERENCE

### Agent Mode Reference

| Mode     | Tab Cycle | @ Mention | Automatic Invocation | Use Case            |
| -------- | --------- | --------- | -------------------- | ------------------- |
| primary  | ✅         | ✅         | ❌                    | Main assistant      |
| subagent | ❌         | ✅         | ✅                    | Specialized tasks   |
| all      | ✅         | ✅         | ✅                    | Maximum flexibility |

### Tool Reference

| Tool            | Purpose                             | Default |
| --------------- | ----------------------------------- | ------- |
| read            | Read files                          | true    |
| write           | Create files                        | true    |
| edit            | Modify files                        | true    |
| bash            | Execute commands                    | true    |
| grep            | Search content                      | true    |
| glob            | Find files                          | true    |
| webfetch        | Fetch URLs                          | false   |
| narsil          | Semantic + structural code analysis | true    |
| memory          | Spec Kit Memory                     | true    |
| chrome_devtools | Browser debugging                   | false   |

### Permission Reference

| Permission | Values         | Description                            |
| ---------- | -------------- | -------------------------------------- |
| edit       | allow/deny/ask | File modification permission           |
| bash       | allow/deny/ask | Command execution (can be per-command) |
| webfetch   | allow/deny/ask | URL fetching permission                |

---

## 5. 🔍 EXAMPLES

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
→ Prompts: "What agent would you like to create?"
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

## 6. 🔗 COMMAND CHAIN

This command creates standalone agents:

```
/create:agent → [Test with @agent-name]
```

**Related commands:**
- Test agent: `@[agent-name] [task]`
- Edit agent: `.opencode/agent/[agent-name].md`

---

## 7. 📌 NEXT STEPS

After agent creation completes, suggest relevant next steps:

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Agent created | Test with `@[agent-name]` | Verify agent works as expected |
| Need to modify | Edit `.opencode/agent/[agent-name].md` | Adjust behavior or permissions |
| Create another agent | `/create:agent [name]` | Build related agent |
| Want to save context | `/memory:save [spec-folder-path]` | Preserve agent design decisions |

**ALWAYS** end with: "What would you like to do next?"