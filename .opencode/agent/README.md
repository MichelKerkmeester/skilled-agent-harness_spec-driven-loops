# Agent System

> Specialized AI personas with defined authorities, tool permissions, and behavioral rules for task execution.

Agents are the execution layer of the OpenCode system. Each agent is a specialized persona with specific capabilities, tool access, and behavioral constraints. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.

The agent system enables both focused single-agent work and complex multi-agent orchestration with parallel delegation.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🤖 AVAILABLE AGENTS](#4--available-agents)
- [5. ⚙️ AGENT ANATOMY](#5--agent-anatomy)
- [6. 🔧 CREATING NEW AGENTS](#6--creating-new-agents)
- [7. 🎯 AGENT VS SKILL](#7--agent-vs-skill)
- [8. 💡 USAGE EXAMPLES](#8--usage-examples)
- [9. 🛠️ TROUBLESHOOTING](#9--troubleshooting)
- [10. 🔗 RELATED RESOURCES](#10--related-resources)

---

## 1. 📖 OVERVIEW

### What Are Agents?

Agents are specialized AI personas defined in markdown files with YAML frontmatter. Each agent has:

- **Identity**: Name and description
- **Authority**: What they're responsible for
- **Tools**: Which tools they can use (read, write, bash, etc.)
- **Permissions**: What actions are allowed/denied
- **Behavior**: Rules and workflows they follow

Think of agents as **roles** with specific job descriptions, while skills are **knowledge bases** they can consult.

### Key Statistics

| Metric              | Value              | Description                      |
| ------------------- | ------------------ | -------------------------------- |
| Available Agents    | 2                  | orchestrate, write               |
| Default Mode        | primary            | Full authority within scope      |
| Default Temperature | 0.1                | Deterministic, consistent output |
| Location            | `.opencode/agent/` | Agent definition files           |

### Key Features

| Feature                  | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **Tool Permissions**     | Fine-grained control over which tools each agent can use |
| **Behavioral Rules**     | Embedded workflows and constraints in each agent file    |
| **Parallel Delegation**  | Orchestrator can spawn up to 20 sub-agents               |
| **Template Enforcement** | Write agent ensures 100% template alignment              |
| **Skill Integration**    | Agents invoke skills for domain expertise                |

### How Agents Work

```
User Request
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                     AGENT SELECTION                         │
├─────────────────────────────────────────────────────────────┤
│  Complex multi-step task?                                   │
│  ├─► YES → @orchestrate (decompose, delegate, synthesize)   │
│  │                                                          │
│  Documentation task?                                        │
│  ├─► YES → @write (template-first, DQI scoring)              │
│  │                                                          │
│  └─► DEFAULT → Main assistant with AGENTS.md rules          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Agent Executes (using permitted tools + invoking skills)
    │
    ▼
Response Delivered
```

---

## 2. 🚀 QUICK START

### Using an Agent

Agents are invoked automatically based on task type, or explicitly via `@agent-name`:

```markdown
# Automatic (OpenCode routes based on task)
"Create a README for the utils folder"
→ Routes to @write agent

# Explicit invocation
"@orchestrate analyze this codebase and create a refactoring plan"
→ Explicitly uses orchestrate agent
```

### Verify Agents Are Available

```bash
# List agent files
ls .opencode/agent/

# Expected output:
# README.md
# orchestrate.md
# write.md
```

### First Use

1. **For documentation tasks**: Just ask - the write agent handles template loading, DQI scoring, and alignment verification automatically

2. **For complex multi-step tasks**: The orchestrate agent decomposes work and delegates to sub-agents

3. **For general tasks**: The main assistant uses AGENTS.md rules directly

---

## 3. 📁 STRUCTURE

### Directory Layout

```
.opencode/agent/
├── README.md           # This documentation file
├── orchestrate.md      # Task decomposition & delegation agent
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

## 4. 🤖 AVAILABLE AGENTS

### Agent Summary

| Agent           | Purpose                         | Tools                                                        | Key Capability                        |
| --------------- | ------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| **orchestrate** | Task decomposition & delegation | `task` only                                                  | Parallel delegation (up to 20 agents) |
| **write**       | Documentation creation          | read, write, edit, bash, grep, glob, webfetch, leann, memory | Template-first, DQI scoring           |

---

### orchestrate.md

**The Senior Task Commander**

| Attribute   | Value                                    |
| ----------- | ---------------------------------------- |
| Name        | `orchestrate`                            |
| Mode        | primary                                  |
| Temperature | 0.1                                      |
| Tools       | `task` only (cannot read/write directly) |

**Authority:**
- Task decomposition into discrete, delegatable units
- Strategic delegation to sub-agents
- Quality evaluation (accept/reject/revise)
- Conflict resolution between parallel workstreams
- Unified synthesis into single response

**Key Constraint:** Has ONLY the `task` tool. Cannot read files, search code, or execute commands directly. MUST delegate ALL work to sub-agents.

**When to Use:**
- Complex requests requiring multiple skills
- Parallel workstreams that need coordination
- Tasks requiring quality gates and synthesis

---

### write.md

**The Documentation Writer**

| Attribute   | Value                                                        |
| ----------- | ------------------------------------------------------------ |
| Name        | `documentation-writer`                                       |
| Mode        | primary                                                      |
| Temperature | 0.1                                                          |
| Tools       | read, write, edit, bash, grep, glob, webfetch, leann, memory |

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

## 5. ⚙️ AGENT ANATOMY

### Frontmatter Fields

Every agent file MUST have YAML frontmatter:

```yaml
---
name: agent-name                    # Required: Identifier
description: One-line description   # Required: Purpose
mode: primary                       # Required: primary or secondary
temperature: 0.1                    # Required: 0.0-1.0 (lower = deterministic)
tools:                              # Required: Tool permissions
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  webfetch: false
  leann: true
  memory: true
  narsil: false
  chrome_devtools: false
permission:                         # Required: Action permissions
  edit: allow
  bash: allow
  webfetch: deny
  external_directory: allow
---
```

### Frontmatter Field Reference

| Field         | Required | Type   | Description                                         |
| ------------- | -------- | ------ | --------------------------------------------------- |
| `name`        | Yes      | string | Agent identifier (used in `@name` invocation)       |
| `description` | Yes      | string | One-line purpose description                        |
| `mode`        | Yes      | string | `primary` (full authority) or `secondary` (limited) |
| `temperature` | Yes      | float  | 0.0-1.0, lower = more deterministic                 |
| `tools`       | Yes      | object | Tool permissions (true/false for each)              |
| `permission`  | Yes      | object | Action permissions (allow/deny)                     |

### Tool Permissions

| Tool              | Purpose              | Typical Setting       |
| ----------------- | -------------------- | --------------------- |
| `read`            | Read files           | true                  |
| `write`           | Create files         | true                  |
| `edit`            | Modify files         | true                  |
| `bash`            | Execute commands     | true (with caution)   |
| `grep`            | Search content       | true                  |
| `glob`            | Find files           | true                  |
| `webfetch`        | Fetch URLs           | false (unless needed) |
| `leann`           | Semantic code search | true                  |
| `memory`          | Spec Kit Memory      | true                  |
| `narsil`          | Code analysis        | false (unless needed) |
| `chrome_devtools` | Browser debugging    | false (unless needed) |

### Required Sections

Agent files should follow this structure:

```markdown
# Agent Title

[1-2 sentence intro - what this agent does]

---

## 1. 🔄 CORE WORKFLOW
[Numbered steps the agent follows]

## 2-N. [DOMAIN SECTIONS]
[Agent-specific content]

## N. 🚫 ANTI-PATTERNS
[What the agent should NEVER do]

## N+1. 🔗 RELATED RESOURCES
[Links to skills, templates, docs]
```

---

## 6. 🔧 CREATING NEW AGENTS

### Step-by-Step Guide

#### Step 1: Identify the Need

Ask yourself:
- Does this task require specific tool permissions?
- Does this task have unique behavioral rules?
- Would a skill be sufficient, or is agent authority needed?

If you need **authority + tools + rules** → Create an agent.
If you need **knowledge + workflows** → Create a skill.

#### Step 2: Create the File

```bash
# Create agent file
touch .opencode/agent/my-agent.md
```

#### Step 3: Add Frontmatter

```yaml
---
name: my-agent
description: One-line description of what this agent does
mode: primary
temperature: 0.1
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  webfetch: false
  leann: true
  memory: true
  narsil: false
  chrome_devtools: false
permission:
  edit: allow
  bash: allow
---
```

#### Step 4: Add Content

```markdown
# My Agent Title

Brief description of this agent's purpose and authority.

---

## 1. 🔄 CORE WORKFLOW

1. **STEP 1** → Description
2. **STEP 2** → Description
3. **STEP 3** → Description

---

## 2. 📋 [DOMAIN SECTION]

### Subsection

Content...

---

## 3. 🚫 ANTI-PATTERNS

❌ **Never do X**
- Reason

❌ **Never do Y**
- Reason

---

## 4. 🔗 RELATED RESOURCES

- [Skill Name](../skill/skill-name/SKILL.md)
- [Template](../skill/workflows-documentation/assets/template.md)
```

#### Step 5: Test the Agent

```markdown
# Invoke explicitly
@my-agent do something

# Or let OpenCode route automatically based on task type
```

---

## 7. 🎯 AGENT VS SKILL

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
| Creating documentation          | ✅ `@write`       | ✅ `workflows-documentation` |
| Complex multi-step task         | ✅ `@orchestrate` | ❌                           |
| Code quality standards          | ❌                | ✅ `workflows-code`          |
| Git workflows                   | ❌                | ✅ `workflows-git`           |

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
    ├─► workflows-documentation (for doc standards)
    ├─► workflows-code (for code standards)
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

## 8. 💡 USAGE EXAMPLES

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
→ Agent invokes workflows-documentation skill
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

## 9. 🛠️ TROUBLESHOOTING

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

| Cause               | Solution                                  |
| ------------------- | ----------------------------------------- |
| Tool set to `false` | Set `tools.toolname: true` in frontmatter |
| Permission denied   | Set `permission.action: allow`            |
| Tool not available  | Check tool exists in OpenCode             |

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

| Problem                | Quick Fix                           |
| ---------------------- | ----------------------------------- |
| Agent not found        | Check file location and name field  |
| Tool permission denied | Update tools section in frontmatter |
| Inconsistent behavior  | Lower temperature to 0.1            |
| Not invoking skills    | Add skill invocation to workflow    |

---

## 10. 🔗 RELATED RESOURCES

### Internal Documentation

| Document  | Location          | Purpose                        |
| --------- | ----------------- | ------------------------------ |
| AGENTS.md | `../../AGENTS.md` | Main AI behavior configuration |
| Skills    | `../skill/`       | Domain expertise bundles       |
| Commands  | `../command/`     | Slash command definitions      |

### Agent Files

| Agent       | Location           | Purpose                         |
| ----------- | ------------------ | ------------------------------- |
| orchestrate | `./orchestrate.md` | Task decomposition & delegation |
| write       | `./write.md`       | Documentation creation          |

### Related Skills

| Skill                   | Location                            | Purpose                 |
| ----------------------- | ----------------------------------- | ----------------------- |
| workflows-documentation | `../skill/workflows-documentation/` | Documentation standards |
| workflows-code          | `../skill/workflows-code/`          | Code quality standards  |
| system-spec-kit         | `../skill/system-spec-kit/`         | Spec folder management  |
| workflows-git           | `../skill/workflows-git/`           | Git workflows           |

### Templates

| Template                 | Location                                   | Purpose                  |
| ------------------------ | ------------------------------------------ | ------------------------ |
| skill_md_template        | `../skill/workflows-documentation/assets/` | SKILL.md structure       |
| skill_reference_template | `../skill/workflows-documentation/assets/` | Reference file structure |
| skill_asset_template     | `../skill/workflows-documentation/assets/` | Asset file structure     |

---

## Summary

The agent system provides **specialized AI personas** for different task types:

- **orchestrate**: Complex multi-step tasks requiring decomposition and delegation
- **write**: Documentation tasks requiring template alignment and quality scoring

Key principles:

- **Agents have authority** - They can act using permitted tools
- **Skills have knowledge** - They provide expertise agents can invoke
- **Templates ensure consistency** - All output follows established patterns
- **Quality gates verify output** - DQI scoring, template alignment checks

**Remember:** Use agents for **authority + tools**, use skills for **knowledge + workflows**.

---

*Documentation version: 1.0 | Last updated: 2025-12-27*
