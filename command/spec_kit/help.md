---
description: Show available SpecKit commands and usage information
argument-hint: "[command-name]"
allowed-tools: Read, Glob
---

# SpecKit Help

Display available SpecKit commands with descriptions and usage examples. Optionally show detailed help for a specific command.

---

```yaml
role: SpecKit Documentation Specialist
purpose: Provide quick reference for all SpecKit commands
action: Display command list or detailed help for specific command

operating_mode:
  workflow: single_action
  workflow_compliance: MANDATORY
  approvals: none_required
  tracking: none
```

---

## 1. 🎯 PURPOSE

Provide a quick reference for all SpecKit commands and their usage. Helps users discover available functionality and understand command syntax.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional command name for detailed help
**Outputs:** Command list or detailed help text

---

## 3. ⚡ INSTRUCTIONS

### Step 1: Check Arguments

```
IF $ARGUMENTS is empty:
    └─→ Display full command list (see Section 4)

IF $ARGUMENTS contains a command name:
    └─→ Display detailed help for that command (see Section 5)
```

### Step 2: Execute

**No arguments:** Display the command list below.

**With command name:** Read the command file and display its purpose, usage, and examples.

---

## 4. 📊 COMMAND LIST (No Arguments)

When called without arguments, display:

```
╭─────────────────────────────────────────────────────────────╮
│  SPECKIT COMMANDS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WORKFLOW COMMANDS                                          │
│  ─────────────────────────────────────────────────────────  │
│  /spec_kit:complete    Full feature workflow (plan→build)   │
│  /spec_kit:plan        Create planning documents only       │
│  /spec_kit:implement   Execute implementation phase         │
│  /spec_kit:research    Deep technical investigation         │
│                                                             │
│  SESSION COMMANDS                                           │
│  ─────────────────────────────────────────────────────────  │
│  /spec_kit:resume      Resume work on existing spec folder  │
│  /spec_kit:handover    Create handover document for next    │
│                        session                              │
│                                                             │
│  DEBUG COMMANDS                                             │
│  ─────────────────────────────────────────────────────────  │
│  /spec_kit:debug       Delegate stuck problem to specialist │
│                                                             │
│  HELP                                                       │
│  ─────────────────────────────────────────────────────────  │
│  /spec_kit:help        Show this help (you are here)        │
│  /spec_kit:help <cmd>  Detailed help for specific command   │
│                                                             │
╰─────────────────────────────────────────────────────────────╯

Examples:
  /spec_kit:complete              Start full feature workflow
  /spec_kit:resume specs/007-*/   Resume specific spec folder
  /spec_kit:help resume           Detailed help for resume command

Full documentation: .opencode/skill/system-spec-kit/SKILL.md
```

---

## 5. 📖 DETAILED HELP (With Command Name)

When called with a command name, read the corresponding command file and display:

### Pattern

```
<COMMAND_NAME>
────────────────────────────────────────────────────

DESCRIPTION
<description from frontmatter>

USAGE
/spec_kit:<command> <argument-hint>

ARGUMENTS
<parsed from command file>

EXAMPLES
<examples from command file>

RELATED COMMANDS
<related commands>

Full details: .opencode/command/spec_kit/<command>.md
```

### Command File Locations

| Command | File |
|---------|------|
| complete | `.opencode/command/spec_kit/complete.md` |
| plan | `.opencode/command/spec_kit/plan.md` |
| implement | `.opencode/command/spec_kit/implement.md` |
| research | `.opencode/command/spec_kit/research.md` |
| resume | `.opencode/command/spec_kit/resume.md` |
| handover | `.opencode/command/spec_kit/handover.md` |
| debug | `.opencode/command/spec_kit/debug.md` |
| help | `.opencode/command/spec_kit/help.md` |

---

## 6. 🔍 COMMAND SUMMARIES

### /spec_kit:complete
**Purpose:** Full feature workflow from planning through implementation
**Usage:** `/spec_kit:complete [feature-description]`
**When to use:** Starting a new feature that requires both planning and implementation
**Output:** Complete spec folder with all artifacts

### /spec_kit:plan
**Purpose:** Create planning documents without implementation
**Usage:** `/spec_kit:plan [feature-description]`
**When to use:** Need to plan and get approval before implementing
**Output:** spec.md, plan.md, and optionally checklist.md

### /spec_kit:implement
**Purpose:** Execute implementation based on existing plan
**Usage:** `/spec_kit:implement [spec-folder-path]`
**When to use:** Plan exists and is approved, ready to build
**Output:** Implementation code and updated task tracking

### /spec_kit:research
**Purpose:** Deep technical investigation with documentation
**Usage:** `/spec_kit:research [topic]`
**When to use:** Need to investigate before planning
**Output:** research.md with findings and recommendations

### /spec_kit:resume
**Purpose:** Resume work on an existing spec folder
**Usage:** `/spec_kit:resume [spec-folder-path] [:auto\|:confirm]`
**When to use:** Continuing work from a previous session
**Output:** Loaded context with progress display

### /spec_kit:handover
**Purpose:** Create handover document for next session
**Usage:** `/spec_kit:handover`
**When to use:** Ending a session, need to preserve context
**Output:** handover.md with context transfer information

### /spec_kit:debug
**Purpose:** Delegate stuck debugging to specialist agent
**Usage:** `/spec_kit:debug`
**When to use:** Stuck on an error after 3+ attempts
**Output:** Debug delegation report and parallel agent dispatch

---

## 7. 🔄 COMMAND WORKFLOWS

### Separated Workflow (Recommended for complex features)

```
/spec_kit:research "topic"     → Deep investigation
        ↓
/spec_kit:plan "feature"       → Spec + Plan creation
        ↓
/spec_kit:implement specs/path → Implementation phase
```

**When to use:** Complex features requiring research, stakeholder approval between phases, or when you need to pause between stages.

### All-in-One Workflow (For simpler features)

```
/spec_kit:complete "feature"   → Full lifecycle in one command
```

**When to use:** Straightforward features where you can plan and implement in a single session without needing approval gates.

### Session Management

```
/spec_kit:handover            → Save context for new session
        ↓
/spec_kit:resume specs/path   → Continue in new session
```

**When to use:** Long-running work that spans multiple sessions, context compaction detected, or handing off to another team member.

### Debugging

```
/spec_kit:debug               → Delegate to specialist sub-agent
```

**When to use:** Stuck on an error after 3+ attempts, need fresh perspective, or want parallel investigation.

---

## 8. 📋 QUICK REFERENCE

| Command | Purpose | Typical Arguments |
|---------|---------|-------------------|
| `/spec_kit:complete` | Full workflow | `"feature description"` |
| `/spec_kit:plan` | Planning only | `"feature description"` |
| `/spec_kit:implement` | Implementation only | `specs/###-folder-name/` |
| `/spec_kit:research` | Investigation | `"topic to research"` |
| `/spec_kit:resume` | Continue work | `specs/###-folder-name/ [:auto]` |
| `/spec_kit:handover` | Session transfer | *(none)* |
| `/spec_kit:debug` | Debug delegation | *(none)* |
| `/spec_kit:help` | This help | `[command-name]` |

**Note:** Full command names are required. Short aliases (e.g., `/sk:c`) are not currently supported.

---

## 9. ⚠️ ERROR HANDLING

| Condition | Action |
|-----------|--------|
| Unknown command | Show "Unknown command: <name>. Use /spec_kit:help for available commands." |
| Command file not found | Show "Command file not found. This command may not be installed." |

---

## 10. 🔗 RELATED COMMANDS

- `/memory:search` - Memory system dashboard
- `/memory:save` - Save conversation context
- `/memory:load` - Load specific memory

---

## 11. 📚 FULL DOCUMENTATION

For comprehensive SpecKit documentation:
`.opencode/skill/system-spec-kit/SKILL.md`

For command development:
`.opencode/skill/workflows-documentation/references/`
