# Opencode Agents — Primary & Sub-agents

Comprehensive guide for creating and configuring OpenCode agents. Covers both **primary agents** (main assistants cycled via Tab key) and **subagents** (specialized assistants invoked via @ mention or automatically by primary agents). Includes built-in agents (Build, Plan, General, Explore), custom agent creation with YAML frontmatter, tool permissions, behavioral rules, and the distinction between agents (authority + tools) and skills (knowledge + workflows).

Agents are the execution layer of the OpenCode system. Each agent is a specialized persona with specific capabilities, tool access, and behavioral constraints. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.

The agent system enables both focused single-agent work and complex multi-agent orchestration with parallel delegation.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.
> **Scope**: .opencode/agent

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. AVAILABLE AGENTS](#4--available-agents)
- [5. AGENT ANATOMY](#5--agent-anatomy)
- [6. CREATING NEW AGENTS](#6--creating-new-agents)
- [7. AGENT VS SKILL](#7--agent-vs-skill)
- [8. USAGE EXAMPLES](#8--usage-examples)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED RESOURCES](#10--related-resources)

---

## AI SET-UP GUIDE

### ⛔ HARD BLOCK: Write Agent Required

> **⚠️ CRITICAL:** Agent creation REQUIRES the `@write` agent to be active.

**Why @write is mandatory:**
- Loads `agent_template.md` BEFORE creating (template-first workflow)
- Validates frontmatter format (YAML syntax, required fields)
- Ensures proper tool permissions and behavioral rules
- Invokes `sk-documentation` skill for documentation standards
- Validates template alignment AFTER creating

**Template Location:** `.opencode/skill/sk-documentation/assets/opencode/agent_template.md`

**Verification (MUST pass before proceeding):**
- [ ] Write agent exists: `ls .opencode/agent/write.md`
- [ ] Agent template exists: `ls .opencode/skill/sk-documentation/assets/opencode/agent_template.md`
- [ ] Use `@write` prefix when invoking the prompt below

**❌ DO NOT** create agents without the @write agent — manual creation bypasses quality gates and frontmatter validation.

**Reference:** `.opencode/agent/write.md` → Documentation creation standards

---

**Copy and paste this prompt for interactive agent creation:**

```text
@write I want to create a new agent for OpenCode. Please guide me through the process interactively by asking me questions one at a time.

**PREREQUISITE CHECK (you MUST verify before proceeding):**
- [ ] You are operating as the @write agent
- [ ] sk-documentation skill is accessible

⚠️ If you are NOT the @write agent: STOP immediately and instruct the user to restart with the "@write" prefix. Do NOT proceed with agent creation.

**Questions to ask me (one at a time, wait for my answer):**

1. **Purpose**: What is the agent's purpose? What specific role will it fill?
   (e.g., "Code review specialist", "Security auditor", "Test automation")

2. **Authority**: What is this agent responsible for? What decisions can it make?
   (e.g., "Approve/reject code changes", "Flag security issues", "Generate test cases")

3. **Tool Permissions**: What tools will the agent need access to?
   - read: Examine files
   - write: Create files
   - edit: Modify files
   - bash: Run commands
   - grep: Search content
   - glob: Find files
   - webfetch: Fetch URLs
   - memory: Spec Kit Memory
   - chrome_devtools: Browser debugging
   - task: Delegate to sub-agents (orchestrator only)

4. **Behavioral Rules**: What should this agent ALWAYS do? NEVER do?
   (e.g., "ALWAYS run tests before approving", "NEVER modify production files")

5. **Skills Integration**: What skills should this agent invoke?
   (e.g., "sk-code--web for code standards", "system-spec-kit for documentation")

6. **Agent Name**: What should we name this agent?
   (Format: lowercase, single word or hyphenated, e.g., "review", "security-audit")

**After gathering my answers, please:**

1. Create the agent file at `.opencode/agent/<agent-name>.md`
2. Generate proper YAML frontmatter with:
   - name, description, mode, temperature
   - tools (true/false for each)
   - permission (allow/deny for actions)
3. Create the agent body with:
   - Core workflow section
   - Domain-specific sections
   - Anti-patterns section
   - Related resources section
4. Validate the frontmatter syntax
5. Help me test the agent with a real example
6. Iterate and refine based on testing

My project is at: [your project path]
```

**What the AI will do:**
- Ask questions one at a time to understand your agent requirements
- Create the agent file with proper frontmatter structure
- Generate behavioral rules based on your answers
- Set appropriate tool permissions
- Guide you through testing with real examples

**Expected creation time:** 15-25 minutes

---

## 1. OVERVIEW

### What Are Agents?

Agents are specialized AI personas defined in markdown files with YAML frontmatter. Each agent has:

- **Identity**: Name and description
- **Authority**: What they're responsible for
- **Tools**: Which tools they can use (read, write, bash, etc.)
- **Permissions**: What actions are allowed/denied
- **Behavior**: Rules and workflows they follow

Think of agents as **roles** with specific job descriptions, while skills are **knowledge bases** they can consult.

### Agent Types

OpenCode has **two types** of agents:

| Type            | Description                                                                 | Invocation                                      |
| --------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| **Primary**     | Main assistants you interact with directly. Handle main conversation.       | **Tab** key to cycle, or configured keybind     |
| **Subagent**    | Specialized assistants for specific tasks. Invoked by primary agents or manually. | **@ mention** (e.g., `@general`) or automatic |

**Primary agents** are cycled through using the **Tab** key during a session. They have full access to configured tools and handle your main conversation.

**Subagents** are specialized assistants that:
- Can be invoked **automatically** by primary agents based on their descriptions
- Can be invoked **manually** by @ mentioning them (e.g., `@general help me search`)
- Create child sessions that you can navigate using `<Leader>+Right/Left`

### Built-in Agents (OpenCode Default)

OpenCode comes with **4 built-in agents** (2 primary + 2 subagents):

| Agent       | Mode       | Purpose                                                    |
| ----------- | ---------- | ---------------------------------------------------------- |
| **Build**   | `primary`  | Default agent with all tools enabled for development work  |
| **Plan**    | `primary`  | Restricted agent for analysis/planning without changes     |
| **General** | `subagent` | General-purpose for research and multi-step tasks          |
| **Explore** | `subagent` | Fast agent for codebase exploration and file searching     |

> **Note:** For exploration tasks, prefer `@context` over raw `@explore`. Context_loader provides memory integration, structured output, and can dispatch @explore internally when needed.

### Key Statistics

| Metric              | Value              | Description                                                      |
| ------------------- | ------------------ | ---------------------------------------------------------------- |
| Built-in Agents     | 4                  | Build, Plan, General, Explore                                    |
| Custom Agents       | 8                  | context, orchestrate, write, research, review, speckit, handover, debug |
| Default Mode        | `all`              | Both primary and subagent                                        |
| Default Temperature | 0.1                | Deterministic, consistent output                                 |
| Location            | `.opencode/agent/` | Agent definition files                                           |

### Key Features

| Feature                  | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **Tool Permissions**     | Fine-grained control over which tools each agent can use |
| **Behavioral Rules**     | Embedded workflows and constraints in each agent file    |
| **Parallel Delegation**  | Primary agents can invoke subagents for specialized tasks |
| **Template Enforcement** | Write agent ensures 100% template alignment              |
| **Skill Integration**    | Agents invoke skills for domain expertise                |
| **Session Navigation**   | Navigate between parent and child sessions with keybinds |

### How Agents Work

```
User Request
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                     AGENT SELECTION                         │
├─────────────────────────────────────────────────────────────┤
│  PRIMARY AGENTS (Tab to cycle):                             │
│  ├─► Build: Full development with all tools                 │
│  ├─► Plan: Analysis without making changes                  │
│  │                                                          │
│  SUBAGENTS (@ mention or automatic):                        │
│  ├─► @general: Research, search, multi-step tasks           │
│  ├─► @explore: Fast codebase exploration (prefer            │
│  │    @context for structured output)                 │
│  │                                                          │
│  CUSTOM AGENTS:                                             │
│  ├─► @context: Context retrieval, analysis,          │
│  │    exploration dispatch                                   │
│  ├─► @orchestrate: Task decomposition & delegation          │
│  ├─► @write: Documentation with template enforcement        │
│  ├─► @research: Technical investigation & evidence gathering│
│  ├─► @review: Code quality & security assessment            │
│  ├─► @speckit: Spec folder documentation (Level 1-3+)       │
│  ├─► @handover: Session continuation & context preservation │
│  └─► @debug: Fresh perspective debugging (4-phase method)   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Agent Executes (using permitted tools + invoking skills/subagents)
    │
    ▼
Response Delivered
```

---

## 2. QUICK START

### Using Primary Agents

Primary agents are cycled using the **Tab** key during a session:

```markdown
# Press Tab to switch between primary agents
<Tab> → Build (default, all tools)
<Tab> → Plan (analysis only, no changes)
<Tab> → Build (cycles back)

# You'll see the current agent indicated in the lower right corner
```

### Using Subagents

Subagents are invoked via **@ mention** or automatically by primary agents:

```markdown
# Manual invocation with @ mention
"@general help me search for this function"
"@context find all files matching *.config.ts"

# Automatic invocation (primary agent decides based on task)
"Search the codebase for authentication patterns"
→ Primary agent may invoke @context automatically for structured exploration
```

### Session Navigation

When subagents create child sessions, navigate between them:

| Keybind              | Action                                    |
| -------------------- | ----------------------------------------- |
| `<Leader>+Right`     | Cycle forward: parent → child1 → child2   |
| `<Leader>+Left`      | Cycle backward: parent ← child1 ← child2  |

### Verify Agents Are Available

```bash
# List custom agent files
ls .opencode/agent/

# Expected output:
# context.md
# debug.md
# handover.md
# orchestrate.md
# research.md
# review.md
# speckit.md
# write.md

# Built-in agents (Build, Plan, General, Explore) are always available
```

### First Use

1. **For development work**: Use **Build** agent (default) - has all tools enabled

2. **For planning/analysis**: Press **Tab** to switch to **Plan** agent - suggests changes without making them

3. **For codebase exploration & context retrieval**: Type `@context` for memory-integrated exploration with structured Context Package output (preferred over raw `@explore`)

4. **For research tasks**: Type `@general` for general purposes, or `@research` for structured 9-step technical investigation

5. **For documentation tasks**: Type `@write` to invoke the custom documentation agent

6. **For complex multi-step tasks**: Type `@orchestrate` to decompose and delegate work

7. **For code reviews**: Type `@review` for quality scoring and security assessment

8. **For spec folder creation**: Type `@speckit` to create Level 1-3+ spec documentation

9. **For session handover**: Type `@handover` or use `/spec_kit:handover` to preserve context

10. **For stuck debugging**: Type `@debug` for fresh perspective with 4-phase methodology

---

## 3. STRUCTURE

### Directory Layout

```
.opencode/agent/
├── context.md   # Context retrieval & exploration dispatch agent
├── debug.md            # Fresh perspective debugging agent
├── handover.md         # Session continuation agent
├── orchestrate.md      # Task decomposition & delegation agent
├── research.md         # Technical investigation agent
├── review.md           # Code quality & security assessment agent
├── speckit.md          # Spec folder documentation agent
└── write.md            # Documentation creation agent
```

### File Naming Conventions

| Pattern                  | Example                  | Use Case              |
| ------------------------ | ------------------------ | --------------------- |
| `{role}.md`              | `write.md`               | Single-word role name |
| `{action}-{domain}.md`   | `review-code.md`         | Action-focused agent  |
| `{domain}-specialist.md` | `security-specialist.md` | Domain expert agent   |

### Required vs Optional Files

| File             | Required    | Purpose                  |
| ---------------- | ----------- | ------------------------ |
| `README.md`      | Recommended | This documentation       |
| `orchestrate.md` | Recommended | Multi-agent coordination |
| `write.md`       | Recommended | Documentation tasks      |
| Custom agents    | Optional    | Domain-specific agents   |

---

## 4. AVAILABLE AGENTS

### Built-in Agents (OpenCode Default)

These agents come with OpenCode and are always available:

| Agent       | Mode       | Purpose                                              | Key Feature                          |
| ----------- | ---------- | ---------------------------------------------------- | ------------------------------------ |
| **Build**   | `primary`  | Default development agent with all tools enabled     | Full tool access, Tab to select      |
| **Plan**    | `primary`  | Analysis and planning without making changes         | Read-only, suggests changes          |
| **General** | `subagent` | Research, search, and multi-step task execution      | @ mention or automatic invocation    |
| **Explore** | `subagent` | Fast codebase exploration and file pattern matching  | Quick file/code discovery (prefer @context) |

---

### Build (Built-in Primary)

**The Default Development Agent**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Mode        | `primary`                                |
| Tools       | All tools enabled                        |
| Permissions | Full access to file operations and bash  |

**When to Use:**
- Standard development work
- Making code changes
- Running commands
- Full access needed

---

### Plan (Built-in Primary)

**The Analysis Agent**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Mode        | `primary`                                |
| Tools       | Read-only (write/edit/bash set to `ask`) |
| Permissions | Prompts for approval before changes      |

**When to Use:**
- Analyzing code without making changes
- Creating plans and suggestions
- Code review and feedback
- Understanding codebase before implementing

**Tip:** Switch to Plan mode using **Tab** when you want suggestions without automatic changes.

---

### General (Built-in Subagent)

**The Research Agent**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Mode        | `subagent`                               |
| Invocation  | `@general` or automatic                  |

**When to Use:**
- Researching complex questions
- Searching for code patterns
- Executing multi-step tasks
- When you're not confident about finding the right match quickly

---

### Explore (Built-in Subagent)

**The Fast Explorer**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Mode        | `subagent`                               |
| Invocation  | `@explore` or automatic                  |

**When to Use:**
- Quickly finding files by patterns
- Searching code for keywords
- Answering questions about codebase structure
- Fast exploration without deep analysis

> **⚠️ Prefer @context** for all exploration tasks. `@context` wraps `@explore` with memory-first retrieval, structured Context Package output, and active dispatch. Use raw `@explore` only when you need fast file search without memory or structure.

---

### Custom Agents Summary

These are project-specific agents defined in `.opencode/agent/`:

| Agent           | Purpose                                | Tools                                                         | Key Capability                              |
| --------------- | -------------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **context** | Context retrieval & exploration dispatch | read, bash, grep, glob, memory                             | Structured Context Package output, active dispatch (@explore + @research) |
| **orchestrate** | Task decomposition & delegation        | `task` only                                                   | Parallel delegation to subagents            |
| **write**       | Documentation creation                 | read, write, edit, bash, grep, glob, webfetch, memory         | Template-first, DQI scoring                 |
| **research**    | Technical investigation                | read, write, edit, bash, grep, glob, webfetch, memory         | 9-step research workflow, evidence-based    |
| **review**      | Code quality & security assessment     | read, bash, grep, glob, memory (read-only)                    | Quality scoring, 5-dimension rubric         |
| **speckit**     | Spec folder documentation              | read, write, edit, bash, grep, glob, memory                   | Level 1-3+ templates, validation            |
| **handover**    | Session continuation                   | read, write, edit, bash, grep, glob, memory                   | Context preservation, attempt tracking      |
| **debug**       | Fresh perspective debugging            | read, write, edit, bash, grep, glob, memory                   | 4-phase methodology, isolated context       |

---

### orchestrate.md (Custom)

**The Senior Task Commander**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Name        | `orchestrate`                            |
| Mode        | `primary`                                |
| Temperature | 0.1                                      |
| Tools       | `task` only (cannot read/write directly) |

**Authority:**
- Task decomposition into discrete, delegatable units
- Strategic delegation to subagents
- Quality evaluation (accept/reject/revise)
- Conflict resolution between parallel workstreams
- Unified synthesis into single response

**Key Constraint:** Has ONLY the `task` tool. Cannot read files, search code, or execute commands directly. MUST delegate ALL work to subagents.

**When to Use:**
- Complex requests requiring multiple skills
- Parallel workstreams that need coordination
- Tasks requiring quality gates and synthesis

---

### write.md (Custom)

**The Documentation Writer**

| Attribute   | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Name        | `write`                                               |
| Mode        | `all`                                                 |
| Temperature | 0.1                                                   |
| Tools       | read, write, edit, bash, grep, glob, webfetch, memory |

**Authority:**
- Document creation (READMEs, skills, guides, references)
- Quality enforcement (DQI scoring, structure validation)
- Template application (100% alignment with templates)
- Flowchart generation (ASCII diagrams)
- Content optimization (AI-first patterns)

**Key Feature:** Template-first workflow - loads template BEFORE creating, validates alignment AFTER creating.

**When to Use:**
- Creating any documentation (README, SKILL.md, references, assets)
- Improving existing documentation quality
- Creating install guides
- Generating ASCII flowcharts

---

### research.md (Custom)

**The Researcher: Technical Investigation Specialist**

| Attribute   | Value                                                         |
| ----------- | ------------------------------------------------------------- |
| Name        | `research`                                                    |
| Mode        | `subagent`                                                    |
| Temperature | 0.1                                                           |
| Tools       | read, write, edit, bash, grep, glob, webfetch, memory |

**Authority:**
- Evidence gathering with citation requirements
- Pattern analysis and feasibility assessment
- Multi-option recommendations with trade-offs
- Context preservation via memory system

**Key Feature:** 9-step research workflow producing research.md with 17 sections. Focuses on INVESTIGATION, not implementation.

**When to Use:**
- Technical uncertainty requiring investigation
- Pre-planning feasibility analysis
- Codebase pattern discovery
- External documentation research

---

### review.md (Custom)

**The Reviewer: Code Quality Guardian**

| Attribute   | Value                                             |
| ----------- | ------------------------------------------------- |
| Name        | `review`                                          |
| Mode        | `subagent`                                        |
| Temperature | 0.1                                               |
| Tools       | read, bash, grep, glob, memory (READ-ONLY)        |

**Authority:**
- Code review with 5-dimension quality rubric (100 points)
- Security vulnerability assessment (OWASP/CWE patterns)
- Pattern validation and standards compliance
- Quality gate pass/fail determination

**Key Feature:** READ-ONLY file access by design. Scores against explicit rubrics: Correctness (30), Security (25), Patterns (20), Maintainability (15), Performance (10).

**When to Use:**
- PR/MR reviews
- Pre-commit validation
- Quality gate enforcement
- Security-sensitive code assessment

---

### speckit.md (Custom)

**The Spec Writer: Documentation Specialist**

| Attribute   | Value                                     |
| ----------- | ----------------------------------------- |
| Name        | `speckit`                                 |
| Mode        | `subagent`                                |
| Temperature | 0.1                                       |
| Tools       | read, write, edit, bash, grep, glob, memory |

**Authority:**
- Spec folder creation (Level 1-3+)
- Template enforcement (CORE + ADDENDUM architecture)
- Validation and completeness verification
- Checklist management (P0/P1/P2 priorities)

**Key Feature:** Template-first approach using `scripts/spec/create.sh` and `scripts/spec/validate.sh`. Never creates spec documentation from scratch.

**When to Use:**
- Creating new spec folders
- Writing spec.md, plan.md, tasks.md, checklist.md
- Level assessment and template selection
- Spec folder validation

---

### handover.md (Custom)

**The Handover Agent: Session Continuation Specialist**

| Attribute   | Value                                     |
| ----------- | ----------------------------------------- |
| Name        | `handover`                                |
| Mode        | `subagent`                                |
| Temperature | 0.1                                       |
| Tools       | read, write, edit, bash, grep, glob, memory |

**Authority:**
- Context gathering from spec folder files
- Key information extraction (decisions, blockers, actions)
- Handover document generation with template
- Attempt counter management for session continuity

**Key Feature:** Creates handover.md files from spec folder context. Tracks attempt numbers for continuation sessions.

**When to Use:**
- Session ending and need context preservation
- Creating continuation documents
- Preparing for session branching
- Dispatched by `/spec_kit:handover` command

---

### debug.md (Custom)

**The Debugger: Fresh Perspective Specialist**

| Attribute   | Value                                         |
| ----------- | --------------------------------------------- |
| Name        | `debug`                                       |
| Mode        | `subagent`                                    |
| Temperature | 0.2                                           |
| Tools       | read, write, edit, bash, grep, glob, memory |

**Authority:**
- Systematic debugging with 4-phase methodology
- Root cause analysis with evidence
- Hypothesis-driven debugging (2-3 ranked theories)
- Escalation after 3+ failed hypotheses

**Key Feature:** Receives structured context handoff (NOT conversation history). Isolated by design to avoid inherited assumptions from failed attempts.

**When to Use:**
- 3+ prior debug attempts have failed
- User explicitly requests fresh perspective
- Error persists despite multiple fixes
- Root cause remains elusive

**4-Phase Methodology:**
1. OBSERVE - Read error without assumptions
2. ANALYZE - Trace paths, understand flow
3. HYPOTHESIZE - Form 2-3 ranked theories
4. FIX - Minimal change, verify, document

---

## 5. AGENT ANATOMY

### Frontmatter Fields (v1.1.1+ Format)

Every agent file MUST have YAML frontmatter:

```yaml
---
name: agent-name                    # Required: Identifier
description: One-line description   # Required: Purpose
mode: primary                       # Required: primary or secondary
temperature: 0.1                    # Required: 0.0-1.0 (lower = deterministic)
permission:                         # Required: Unified permissions (v1.1.1+)
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  external_directory: allow
---
```

> **Note:** The separate `tools:` object is deprecated as of OpenCode v1.1.1. Use the unified `permission:` object with `allow`/`deny`/`ask` values instead. The old format still works for backwards compatibility.

### Frontmatter Field Reference

| Field         | Required | Type   | Description                                                                 |
| ------------- | -------- | ------ | --------------------------------------------------------------------------- |
| `name`        | Yes      | string | Agent identifier (used in `@name` invocation)                               |
| `description` | Yes      | string | One-line purpose description (used for automatic routing)                   |
| `mode`        | No       | string | `primary`, `subagent`, or `all` (default: `all`)                            |
| `temperature` | No       | float  | 0.0-1.0, lower = more deterministic (default: model-specific)               |
| `permission`  | No       | object | Unified tool & action permissions (allow/deny/ask)                          |
| `model`       | No       | string | Override model for this agent (format: `provider/model-id`)                 |
| `steps`       | No       | int    | Max agentic iterations (replaces deprecated `maxSteps`)                     |

### Mode Options

| Mode        | Description                                                              | Invocation                    |
| ----------- | ------------------------------------------------------------------------ | ----------------------------- |
| `primary`   | Main assistant, cycled via Tab key                                       | Tab key or configured keybind |
| `subagent`  | Specialized assistant, invoked by primary agents or @ mention            | `@agent-name` or automatic    |
| `all`       | Can be used as both primary and subagent (default if not specified)      | Both methods                  |

### Permission Reference

| Permission          | Purpose                             | Typical Setting       |
| ------------------- | ----------------------------------- | --------------------- |
| `read`              | Read files                          | allow                 |
| `write`             | Create files                        | allow                 |
| `edit`              | Modify files                        | allow                 |
| `bash`              | Execute commands                    | allow (with caution)  |
| `grep`              | Search content                      | allow                 |
| `glob`              | Find files                          | allow                 |
| `webfetch`          | Fetch URLs                          | deny (unless needed)  |
| `memory`            | Spec Kit Memory                     | allow                 |
| `chrome_devtools`   | Browser debugging                   | deny (unless needed)  |
| `external_directory`| Access files outside project        | allow                 |

### Permission Values

| Value   | Behavior                                    |
| ------- | ------------------------------------------- |
| `allow` | Automatically approve (no prompt)           |
| `deny`  | Automatically reject (blocked)              |
| `ask`   | Prompt the user for approval each time      |

### Required Sections

Agent files should follow this structure:

```markdown
# Agent Title

[1-2 sentence intro - what this agent does]

---

## 1. CORE WORKFLOW
[Numbered steps the agent follows]

## 2-N. [DOMAIN SECTIONS]
[Agent-specific content]

## N. ANTI-PATTERNS
[What the agent should NEVER do]

## N+1. RELATED RESOURCES
[Links to skills, templates, docs]
```

---

## 6. CREATING NEW AGENTS

### Step-by-Step Guide

#### Step 1: Identify the Need

Ask yourself:
- Does this task require specific tool permissions?
- Does this task have unique behavioral rules?
- Would a skill be sufficient, or is agent authority needed?

If you need **authority + tools + rules** → Create an agent.
If you need **knowledge + workflows** → Create a skill.

#### Step 2: Create the File

**Option A: Interactive Command (Recommended)**

```bash
# Use the /create:agent command with @write agent
@write /create:agent my-agent
```

This interactive command will:
1. Verify @write agent is active (required for template enforcement)
2. Ask for agent type (primary/subagent/all)
3. Confirm output location (project or global)
4. Guide you through understanding (purpose, use cases, authority)
5. Help you plan configuration (tools, permissions, rules)
6. Generate the agent file with proper frontmatter
7. Validate YAML syntax before completion

**Option B: OpenCode CLI (Alternative)**

```bash
# Use OpenCode's built-in agent creation wizard
opencode agent create
```

This CLI command will:
1. Ask where to save the agent (global or project-specific)
2. Ask for a description of what the agent should do
3. Generate an appropriate system prompt and identifier
4. Let you select which tools the agent can access
5. Create a markdown file with the agent configuration

**Option C: Manual Creation**

```bash
# Create agent file manually
touch .opencode/agent/my-agent.md
```

#### Step 3: Add Frontmatter (v1.1.1+ Format)

```yaml
---
name: my-agent
description: One-line description of what this agent does
mode: subagent  # Options: primary, subagent, or all (default)
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  external_directory: allow
---
```

**Mode Selection Guide:**

| Choose `mode`  | When...                                                        |
| -------------- | -------------------------------------------------------------- |
| `primary`      | Agent should appear in Tab cycle as main assistant             |
| `subagent`     | Agent should only be invoked via @ mention or by other agents  |
| `all` (default)| Agent can be used both ways                                    |

#### Step 4: Add Content

```markdown
# My Agent Title

Brief description of this agent's purpose and authority.

---

## 1. CORE WORKFLOW

1. **STEP 1** → Description
2. **STEP 2** → Description
3. **STEP 3** → Description

---

## 2. [DOMAIN SECTION]

### Subsection

Content...

---

## 3. ANTI-PATTERNS

❌ **Never do X**
- Reason

❌ **Never do Y**
- Reason

---

## 4. RELATED RESOURCES

- [Skill Name](../skill/skill-name/SKILL.md)
- [Template](../skill/sk-documentation/assets/opencode/agent_template.md)
```

#### Step 5: Test the Agent

```markdown
# Invoke explicitly
@my-agent do something

# Or let OpenCode route automatically based on task type
```

---

## 7. AGENT VS SKILL

### Key Differences

| Aspect           | Agent                         | Skill                        |
| ---------------- | ----------------------------- | ---------------------------- |
| **Purpose**      | Persona with authority to act | Knowledge/workflow bundle    |
| **Location**     | `.opencode/agent/`            | `.opencode/skill/`           |
| **Invocation**   | `@agent-name` or automatic    | `skill("name")` or automatic |
| **Has Tools**    | Yes (tool permissions)        | No (uses agent's tools)      |
| **Has Rules**    | Yes (behavioral)              | Yes (domain-specific)        |
| **Scope**        | Broad authority               | Narrow expertise             |
| **Can Delegate** | Yes (orchestrate)             | No                           |
| **Frontmatter**  | name, tools, permission       | name, allowed-tools          |

### When to Use Each

| Scenario                        | Use Agent        | Use Skill                   |
| ------------------------------- | ---------------- | --------------------------- |
| Need specific tool permissions  | ✅                | ❌                           |
| Need to delegate to sub-agents  | ✅                | ❌                           |
| Need domain knowledge/workflows | ❌                | ✅                           |
| Need templates and standards    | ❌                | ✅                           |
| Need behavioral constraints     | ✅                | ✅                           |
| Creating documentation          | ✅ `@write`       | ✅ `sk-documentation` |
| Complex multi-step task         | ✅ `@orchestrate` | ❌                           |
| Code quality standards          | ❌                | ✅ `sk-code--web`          |
| Git workflows                   | ❌                | ✅ `sk-git`           |

### How They Work Together

```
User Request
    │
    ▼
Agent Selected (based on task type)
    │
    ▼
Agent Invokes Skills (for domain expertise)
    │
    ├─► sk-documentation (for doc standards)
    ├─► sk-code--web (for code standards)
    ├─► system-spec-kit (for spec folders)
    └─► etc.
    │
    ▼
Agent Executes (using tools + skill knowledge)
    │
    ▼
Response Delivered
```

---

## 8. USAGE EXAMPLES

### Example 1: Documentation Creation

```markdown
User: "Create a README for the utils folder"

→ Routes to @write agent
→ Agent loads readme_template.md
→ Agent creates README following template
→ Agent validates template alignment
→ Agent runs DQI scoring
→ Agent delivers template-aligned README
```

### Example 2: Complex Multi-Step Task

```markdown
User: "@orchestrate analyze this codebase and create a refactoring plan"

→ Orchestrate agent receives request
→ Decomposes into tasks:
   - Task 1: Analyze code structure (delegate to @general)
   - Task 2: Identify patterns (delegate to @general)
   - Task 3: Create refactoring plan (delegate to @write)
→ Delegates tasks in parallel
→ Evaluates sub-agent outputs
→ Synthesizes into unified response
→ Delivers comprehensive plan
```

### Example 3: Agent + Skill Integration

```markdown
User: "Create a new skill for API testing"

→ Routes to @write agent
→ Agent invokes sk-documentation skill
→ Skill provides:
   - skill_md_template.md
   - skill_reference_template.md
   - skill_asset_template.md
   - DQI scoring standards
→ Agent creates skill structure
→ Agent validates against templates
→ Agent delivers DQI-compliant skill
```

---

## 9. TROUBLESHOOTING

### Common Issues

#### Agent Not Recognized

**Symptom:** `@agent-name` doesn't invoke the agent

**Causes & Solutions:**

| Cause                        | Solution                              |
| ---------------------------- | ------------------------------------- |
| File not in correct location | Move to `.opencode/agent/`            |
| Invalid frontmatter          | Check YAML syntax                     |
| Missing `name` field         | Add `name: agent-name` to frontmatter |
| OpenCode not restarted       | Restart OpenCode                      |

#### Agent Can't Use Tool

**Symptom:** Agent fails when trying to use a tool

**Causes & Solutions:**

| Cause                     | Solution                                         |
| ------------------------- | ------------------------------------------------ |
| Permission set to `deny`  | Set `permission.toolname: allow` in frontmatter  |
| Using deprecated format   | Migrate from `tools:` to `permission:` (v1.1.1+) |
| Tool not available        | Check tool exists in OpenCode                    |

#### Agent Not Following Rules

**Symptom:** Agent ignores behavioral rules in its file

**Causes & Solutions:**

| Cause                  | Solution                              |
| ---------------------- | ------------------------------------- |
| Rules not clear enough | Make rules explicit with ALWAYS/NEVER |
| Conflicting rules      | Resolve conflicts, prioritize         |
| Temperature too high   | Lower temperature to 0.1              |

### Diagnostic Commands

```bash
# Check agent files exist
ls -la .opencode/agent/

# Verify frontmatter syntax
head -30 .opencode/agent/write.md

# Check for YAML errors
python3 -c "import yaml; yaml.safe_load(open('.opencode/agent/write.md').read().split('---')[1])"
```

### Quick Fixes

| Problem                | Quick Fix                                         |
| ---------------------- | ------------------------------------------------- |
| Agent not found        | Check file location and name field                |
| Tool permission denied | Set `permission.toolname: allow` in frontmatter   |
| Inconsistent behavior  | Lower temperature to 0.1                          |
| Not invoking skills    | Add skill invocation to workflow                  |
| Using deprecated format| Migrate from `tools:` to `permission:` (v1.1.1+)  |

---

## 10. RELATED RESOURCES

### Internal Documentation

| Document  | Location          | Purpose                        |
| --------- | ----------------- | ------------------------------ |
| AGENTS.md | `../../AGENTS.md` | Main AI behavior configuration |
| Skills    | `../skill/`       | Domain expertise bundles       |
| Commands  | `../command/`     | Slash command definitions      |

### Agent Files

| Agent          | Location              | Purpose                                |
| -------------- | --------------------- | -------------------------------------- |
| context | `./context.md` | Context retrieval & exploration dispatch |
| orchestrate    | `./orchestrate.md`    | Task decomposition & delegation        |
| write       | `./write.md`       | Documentation creation                 |
| research    | `./research.md`    | Technical investigation                |
| review      | `./review.md`      | Code quality & security assessment     |
| speckit     | `./speckit.md`     | Spec folder documentation              |
| handover    | `./handover.md`    | Session continuation                   |
| debug       | `./debug.md`       | Fresh perspective debugging            |

### Related Skills

| Skill                   | Location                            | Purpose                 |
| ----------------------- | ----------------------------------- | ----------------------- |
| sk-documentation | `../skill/sk-documentation/` | Documentation standards |
| sk-code--web          | `../skill/sk-code--web/`          | Code quality standards  |
| system-spec-kit         | `../skill/system-spec-kit/`         | Spec folder management  |
| sk-git           | `../skill/sk-git/`           | Git workflows           |

### Templates

| Template                 | Location                                                      | Purpose                  |
| ------------------------ | ------------------------------------------------------------- | ------------------------ |
| skill_md_template        | `../skill/sk-documentation/assets/opencode/` | SKILL.md structure       |
| skill_reference_template | `../skill/sk-documentation/assets/opencode/` | Reference file structure |
| skill_asset_template     | `../skill/sk-documentation/assets/opencode/` | Asset file structure     |

---

## Summary

The agent system provides **specialized AI personas** for different task types:

### Built-in Agents (Always Available)

| Agent       | Type       | Purpose                                    | Invocation        |
| ----------- | ---------- | ------------------------------------------ | ----------------- |
| **Build**   | Primary    | Full development with all tools            | Tab key (default) |
| **Plan**    | Primary    | Analysis without changes                   | Tab key           |
| **General** | Subagent   | Research and multi-step tasks              | `@general`        |
| **Explore** | Subagent   | Fast codebase exploration (prefer @context) | `@explore`        |

### Custom Agents (Project-Specific)

| Agent              | Type     | Purpose                                    | Invocation           |
| ------------------ | -------- | ------------------------------------------ | -------------------- |
| **context** | Subagent | Context retrieval & exploration dispatch    | `@context`    |
| **orchestrate**    | Primary  | Task decomposition & delegation            | `@orchestrate`       |
| **write**       | All      | Documentation with template enforcement    | `@write`          |
| **research**    | Subagent | Technical investigation & evidence         | `@research`       |
| **review**      | Subagent | Code quality & security assessment         | `@review`         |
| **speckit**     | Subagent | Spec folder documentation (Level 1-3+)     | `@speckit`        |
| **handover**    | Subagent | Session continuation & context preservation| `@handover`       |
| **debug**       | Subagent | Fresh perspective debugging                | `@debug`          |

### Key Principles

- **Primary agents** are cycled via **Tab** key - use for main conversation
- **Subagents** are invoked via **@ mention** - use for specialized tasks
- **Agents have authority** - They can act using permitted tools
- **Skills have knowledge** - They provide expertise agents can invoke
- **Templates ensure consistency** - All output follows established patterns
- **Quality gates verify output** - DQI scoring, template alignment checks

**Remember:** Use agents for **authority + tools**, use skills for **knowledge + workflows**.

---

*Documentation version: 1.3 | Last updated: 2026-01-29 | OpenCode v1.1.1+ compatible*
